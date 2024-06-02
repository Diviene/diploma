import express from "express"
import { changePassword, login, register, sendCodeByEmail, verifyCode } from "../controllers/auth.js";

const router = express.Router();
router.post("/changePassword", changePassword)
router.post("/verifyCode", verifyCode)
router.post("/sendCodeByEmail", sendCodeByEmail)
router.post("/register", register)
router.post("/login", login)

export default router