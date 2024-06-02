import express from "express"
import { isAdmin } from "../utils/verifyToken.js";
import { createCity, deleteCity, getCities, getCity, updateCity } from "../controllers/city.js";

const router = express.Router();

//ДОБАВЛЕНИЕ
router.post("/", isAdmin, createCity);

//Обновление
router.put("/:id", isAdmin, updateCity)

//Удаление
router.delete("/:id", isAdmin, deleteCity)

//Вывод отеля по id
router.get("/:id", getCity)

//Вывод всех отелей
router.get("/", getCities)

export default router