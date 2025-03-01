// src/routes/bookingRoutes.ts

import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
router.use(authMiddleware);
const bookingController = new BookingController();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bookings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingInput'
 *     responses:
 *       201:
 *         description: Booking created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 */
router.post("/bookings", asyncHandler(bookingController.createBooking));

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   put:
 *     summary: Update booking status
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: The booking id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: number
 *                 description: Booking status (0 = wait, 1 = check-in, 2 = check-out, 3 = reject)
 *                 example: 1
 *     responses:
 *       200:
 *         description: Booking status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 */
router.put(
  "/bookings/:id/status",
  asyncHandler(bookingController.updateBookingStatus)
);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: The booking id.
 *     responses:
 *       200:
 *         description: Booking details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 */
router.get("/bookings/:id", asyncHandler(bookingController.getBookingById));

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings within a specific month
 *     description: Retrieves all bookings within the specified year and month.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: The year of the bookings.
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *         description: The month of the bookings (1-12).
 *     responses:
 *       200:
 *         description: A list of bookings for the given month.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Booking"
 *       400:
 *         description: Missing or invalid parameters.
 *       500:
 *         description: Internal server error.
 */
router.get("/bookings", asyncHandler(bookingController.getBookings));


export default router;
