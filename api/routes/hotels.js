import express from "express"
import { isAdmin } from "../utils/verifyToken.js";
import { createHotelChain, deleteHotelChain, getHotelChains, getHotelChain, updateHotelChain } from "../controllers/hotelchain.js";
import { getHotelRating } from "../controllers/hotelrating.js";
import { createHotel, deleteHotel, getHotel, getHotelById, getHotelsByCity, getHotelsByParams, updateHotel } from "../controllers/hotel.js";

const router = express.Router();

//ДОБАВЛЕНИЕ
router.post("/", isAdmin, createHotel);

router.get("/hotelbyParams", getHotelsByParams)

router.get("/", getHotel)
//Обновление
router.put("/:id", isAdmin, updateHotel)

//Удаление
router.delete("/:id", isAdmin, deleteHotel)

//Вывод отеля по id
router.get("/:id", getHotelById)

//Вывод всех отелей

router.get("/city/:cityId", getHotelsByCity);

export default router