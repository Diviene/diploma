import express from "express"
import { isAdmin } from "../utils/verifyToken.js";
import { createHotelRoomType, deleteHotelRoomType, getHotelRoomType, getHotelRoomTypes, getHotelRoomTypesByHotel, updateHotelRoomType } from "../controllers/hotelroomtype.js";

const router = express.Router();

router.get("/getRoomType/:hotelId", getHotelRoomTypesByHotel)

//ДОБАВЛЕНИЕ
router.post("/", isAdmin, createHotelRoomType);

//Обновление
router.put("/:id", isAdmin, updateHotelRoomType)

//Удаление
router.delete("/:id", isAdmin, deleteHotelRoomType)

//Вывод отеля по id
router.get("/:id", getHotelRoomType)

//Вывод всех отелей
router.get("/", getHotelRoomTypes)

export default router