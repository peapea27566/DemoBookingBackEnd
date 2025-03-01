import { Request, Response } from "express";
import {
  createBooking,
  updateBookingStatus,
  getBookingById,
  getBookingsInMonth,
  findOverlappingBooking,
} from "../repositories/bookingRepository";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { redisClient, clearBookingsCache } from "../services/redisClient";

export class BookingController {
  // Create a new booking
  async createBooking(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.userId;
      let { checkInDate, checkOutDate, note } = req.body;
      console.log(checkInDate, checkOutDate);

      checkInDate = new Date(checkInDate);
      checkOutDate = new Date(checkOutDate);

      console.log(checkInDate, checkOutDate);


      if (checkInDate > checkOutDate) {
        return res
          .status(400)
          .json({ message: "Check-in date must be before check-out date." });
      }

      const today = new Date().setHours(0,0,0,0);
      console.log(today);
      if (checkInDate < today) {
        return res
          .status(400)
          .json({ message: "Check-in date must be before the current date." });
      }
      if (await findOverlappingBooking(checkInDate, checkOutDate)) {
        return res.status(400).json({ message: "Time slot is already booked" });
      }

      const booking = await createBooking(
        userId,
        checkInDate,
        checkOutDate,
        note
      );
      await clearBookingsCache();
      return res
        .status(201)
        .json({ message: "Booking created successfully", booking });
    } catch (error) {
      return res.status(500).json({ message: "Error creating booking", error });
    }
  }

  // Update the status of an existing booking
  async updateBookingStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.userId;
      const bookingId = parseInt(req.params.id);
      const { status } = req.body;
      const booking = await getBookingById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.user.id !== userId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to update this booking" });
      }

      await updateBookingStatus(bookingId, status);
      await clearBookingsCache();

      return res.json({ message: "Booking status updated successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating booking status", error });
    }
  }

  // Get a booking by its ID
  async getBookingById(req: Request, res: Response) {
    try {
      const bookingId = parseInt(req.params.id);
      const booking = await getBookingById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      return res.json(booking);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error retrieving booking", error });
    }
  }

  async getBookings(req: Request, res: Response) {
    try {
      const year = Number(req.query.year);
      const month = Number(req.query.month);

      if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ message: "Invalid year or month" });
      }

      const startDate = new Date(Date.UTC(year, month - 2, 1, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));

      const cacheKey = `bookings:${year}:${month}`;
      console.log(cacheKey, startDate, endDate);

      const cachedBookings = await redisClient.get(cacheKey);
      if (cachedBookings !== null && cachedBookings != "[]") {
        return res.json(JSON.parse(cachedBookings));
      }

      const bookings = await getBookingsInMonth(startDate, endDate);

      await redisClient.setEx(cacheKey, 3600, JSON.stringify(bookings));

      return res.json(bookings);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error retrieving bookings", error });
    }
  }
}
