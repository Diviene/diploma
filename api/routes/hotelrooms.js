import express from "express"
import { isAdmin } from "../utils/verifyToken.js";
import { createHotelRoom, deleteHotelRoom, getHotelRoom, getHotelRooms, getHotelRoomsByHotelId, getPriceForRooms, postPriceForRoom, updateHotelRoom } from "../controllers/hotelroom.js";

const router = express.Router();

router.get("/getBySelectedRoom", getPriceForRooms)

router.post("/postPriceForRoom", postPriceForRoom)

router.get("/getByHotel/:hotelId", getHotelRoomsByHotelId)

//ДОБАВЛЕНИЕ
router.post("/", isAdmin, createHotelRoom);

//Обновление
router.put("/:id", isAdmin, updateHotelRoom)

//Удаление
router.delete("/:id", isAdmin, deleteHotelRoom)

//Вывод отеля по id
router.get("/:id", getHotelRoom)

//Вывод всех отелей
router.get("/", getHotelRooms)



export default router