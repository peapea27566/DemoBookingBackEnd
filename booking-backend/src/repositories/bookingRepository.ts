// src/repositories/bookingRepository.ts

import { Between, LessThan, MoreThan, Not, Repository } from "typeorm";
import { Booking } from "../models/Booking";
import { AppDataSource } from "../config/data-source";
import { BookingDto } from "../dtos/BookingDto";

export const bookingRepository: Repository<Booking> =
  AppDataSource.getRepository(Booking);

/**
 * Create a new booking.
 * @param userId - The ID of the user making the booking.
 * @param checkInDate - The check-in date.
 * @param checkOutDate - The check-out date.
 * @param note - An optional note.
 */
export const createBooking = async (
  userId: number,
  checkInDate: Date,
  checkOutDate: Date,
  note?: string
): Promise<Booking> => {
   console.log(checkInDate) 
   console.log(checkOutDate) 
  const booking = bookingRepository.create({
    user: { id: userId },
    checkInDate,
    checkOutDate,
    note,
    status: 0, // 0: wait (default)
  });
  var result=  bookingRepository.save(booking);
return result;
  //return new BookingDto(result);
};

/**
 * Update the status of an existing booking.
 * @param bookingId - The ID of the booking.
 * @param status - The new status (0: wait, 1: check-in, 2: check-out, 3: reject).
 */
export const updateBookingStatus = async (
  bookingId: number,
  status: number
) => {
  return bookingRepository.update(bookingId, { status });
};

/**
 * Get a booking by its ID.
 * @param bookingId - The booking ID.
 */
export const getBookingById = async (
  bookingId: number
): Promise<BookingDto | null> => {
  var booking =  await bookingRepository.findOne({
    where: { id: bookingId },
    relations: ["user"],
  });

  return booking ? new BookingDto(booking) : null;
};

/**
 * Get all bookings for a given user.
 * @param userId - The user ID.
 */

export const getBookingsByUser = async (userId: number): Promise<BookingDto[]> => {
    const bookings = await bookingRepository.find({
        where: { user: { id: userId } },
        relations: ["user"],
    });

    return bookings.map(booking => new BookingDto(booking));
};


/**
 * Find an overlapping booking for a given date range.
 * @param checkInDate - The check-in date.
 * @param checkOutDate - The check-out date.
 */
export const findOverlappingBooking = async (
  checkInDate: Date,
  checkOutDate: Date
): Promise<Booking | null> => {
  return await bookingRepository.findOne({
    where: [
      {
        checkInDate: LessThan(checkOutDate),
        checkOutDate: MoreThan(checkInDate),
        status: Not(3),
      },
    ],
  });
};

/**
 * Get all bookings within a specific date range (month).
 */
export const getBookingsInMonth = async (
    startDate: Date,
    endDate: Date
  ): Promise<BookingDto[]> => {  
    const bookings = await bookingRepository.find({
      where: {
        checkInDate: Between(startDate, endDate),
      },
      order: { checkInDate: "ASC" ,status : "ASC"},
      relations: ["user"],
    });
  
    return bookings.map((booking) => new BookingDto(booking)); 
  };