import express from "express"
import { isAdmin } from "../utils/verifyToken.js";
import { createBooking, deleteBooking, getBookingById, getBookings, getBookingsByRoom, getBookingsByUserId, updateBooking } from "../controllers/booking.js";

const router = express.Router();

router.get("/:id", getBookingById)

router.post("/", createBooking);

router.get("/getByRoom/:roomId", getBookingsByRoom);

router.get("/:userId", getBookingsByUserId);

//Обновление
router.put("/:id", isAdmin, updateBooking)

//Удаление
router.delete("/:id", isAdmin, deleteBooking)

//Вывод отеля по id
router.get("/:id", getBookingById)

//Вывод всех отелей
router.get("/", getBookings)

export default router