import express from "express"
import { deleteUser, deleteUserImage, getUser, getUsers, updateUser } from "../controllers/user.js";
import { verifyToken, verifyUser, isAdmin } from "../utils/verifyToken.js";
import { deleteBookingByUserId } from "../controllers/booking.js";
import { validateEmailAndPassword } from "../middlewares/validate.js";

const router = express.Router();

router.get("/checkauth", verifyToken, (req,res,next)=>
{
    res.send("Вы авторизованы!")
})

router.get("/checkuser/:id", verifyUser, (req,res,next)=>
{
        res.send("Вы авторизованы и можете удалить свой аккаунт!")
})

router.get("/checkadmin/:id", isAdmin, (req,res,next)=>
{
            res.send("Вы являетесь администратором!")
})

router.delete('/:userId/bookings/:bookingId', deleteBookingByUserId);
    
//Обновление
router.put("/:id", verifyUser, validateEmailAndPassword, updateUser)

//Удаление
router.delete("/:id", verifyUser, deleteUser)

router.delete("/deleteImage/:id", verifyUser, deleteUserImage)

//Вывод пользователя по id
router.get("/:id", verifyUser, getUser)

router.get("/", isAdmin, getUsers)

export default router