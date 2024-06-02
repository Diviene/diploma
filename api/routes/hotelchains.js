import express from "express"
import { isAdmin } from "../utils/verifyToken.js";
import { createHotelChain, deleteHotelChain, getHotelChains, getHotelChain, updateHotelChain } from "../controllers/hotelchain.js";

const router = express.Router();

//ДОБАВЛЕНИЕ
router.post("/", isAdmin, createHotelChain);

//Обновление
router.put("/:id", isAdmin, updateHotelChain)

//Удаление
router.delete("/:id", isAdmin, deleteHotelChain)

//Вывод отеля по id
router.get("/:id", getHotelChain)

//Вывод всех отелей
router.get("/", getHotelChains)

export default router