import express from "express"
import { isAdmin } from "../utils/verifyToken.js";
import { createHotelRating, deleteHotelRating, getHotelRating, getHotelRatings, updateHotelRating } from "../controllers/hotelrating.js";

const router = express.Router();

//ДОБАВЛЕНИЕ
router.post("/", isAdmin, createHotelRating);

//Обновление
router.put("/:id", isAdmin, updateHotelRating)

//Удаление
router.delete("/:id", isAdmin, deleteHotelRating)

//Вывод отеля по id
router.get("/:id", getHotelRating)

//Вывод всех отелей
router.get("/", getHotelRatings)

export default router