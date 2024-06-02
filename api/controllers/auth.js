import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
import PasswordCodes from "../models/PasswordCodes.js";
import mongoose from "mongoose"

export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            ...req.body,
            password: hash,
        });

        await newUser.save();
        res.status(200).send("Пользователь добавлен");
    } catch (err) {
        let errorMessage = err.message;
        if (err.code === 11000 && err.keyPattern) {
            if(err.keyPattern.username){
                errorMessage = "Данное имя пользователя занято.";
            } 
            else if (err.keyPattern.email) 
            {
                errorMessage = "Данный адрес электронной почты уже используется."
            }
            else if (err.keyPattern.PhoneNumber)
            {
                errorMessage = "Данный номер телефона уже хранится в базе данных"
            }
            res.status(400).json({ message: errorMessage });
        } 
        else if (err instanceof mongoose.Error.ValidationError) {
            if (err.errors.username) {
                return res.status(400).json({ message: "Введите никнейм" });
            }
            if (err.errors.password) {
                return res.status(400).json({ message: "Введите пароль" });
            }
            if (err.errors.email) {
                return res.status(400).json({ message: "Введите почту" });
            }
            if (err.errors.CustomerSurname) {
                return res.status(400).json({ message: "Введите фамилию" });
            }
            if (err.errors.CustomerName) {
                return res.status(400).json({ message: "Введите имя" });
            }
            if (err.errors.DateOfBirth) {
                return res.status(400).json({ message: "Выберите дату рождения" });
            }
            if (err.errors.CustomerGender) {
                return res.status(400).json({ message: "Выберите пол" });
            }
            if (err.errors.PhoneNumber) {
                return res.status(400).json({ message: "Введите номер телефона" });
            }
            
            return res.status(400).json({ message: "Ошибка валидации" });
        }
        else {
            next(err); 
        }
    }   
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return next(createError(404, "Неправильный логин"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return next(createError(404, "Неправильный пароль"));

        const token = jwt.sign({
            id: user._id,
            isAdmin: user.IsAdmin
        }, process.env.JWT);

        const { password, IsAdmin, ...otherDetails } = user._doc;
        res.cookie("access_token", token, {
            httpOnly: true,
        })
      .status(200)
      .json({
           details: {...otherDetails}, IsAdmin
       });
    } catch (err) {
        next(err);
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "ariel19107995@gmail.com",
      pass: "qlde megc djna hcfg",
    },
  });
  
  function generateSixDigitCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  
  export const sendCodeByEmail = async (req, res) => {
    const { username, email } = req.body;
    if (!username && !email) {
        return res.status(400).send("Не указан никнейм или почта пользователя");
    }

    try {
        const user = await User.findOne(username ? { username: username } : { email: email });
        if (!user) {
            return res.status(404).send("Пользователь с указанными данными не найден");
        }

        const code = generateSixDigitCode();
        const existingRecord = await PasswordCodes.findOne({ UserId: user._id });

        if (existingRecord) {
            existingRecord.code = code;
            await existingRecord.save();
        } else {
            await PasswordCodes.create({ code, UserId: user._id });
        }

        const mailOptions = {
            from: "d1vinesss",
            to: user.email,
            subject: "Haven. Код для сброса пароля",
            text: `Ваш код для сброса пароля: ${code}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send({ message: "Письмо с кодом отправлено на ваш email." });
    } catch (error) {
        console.error("Ошибка при отправке письма:", error);
        res.status(500).send("Ошибка при отправке письма.");
    }
};

export const verifyCode = async (req, res) => {
    const { username, email, code } = req.body;
    if ((!username && !email) || !code) {
        return res.status(400).send("Некорректный запрос. Пожалуйста, укажите никнейм или почту пользователя и код.");
    }

    try {
        const user = await User.findOne(username ? { username: username } : { email: email });
        if (!user) {
            return res.status(404).send("Пользователь с указанными данными не найден.");
        }

        const passwordCode = await PasswordCodes.findOne({ UserId: user._id, code });
        if (!passwordCode) {
            return res.status(400).send("Неверный код подтверждения.");
        }

        res.status(200).send("Код подтвержден.");
    } catch (error) {
        console.error("Ошибка при проверке кода:", error);
        res.status(500).send("Ошибка при проверке кода.");
    }
};

export const changePassword = async (req, res) => {
    const { username, email, newPassword } = req.body;
    if ((!username && !email) || !newPassword) {
        return res.status(400).send("Некорректный запрос. Пожалуйста, укажите никнейм или почту пользователя и новый пароль.");
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
            success: false,
            message: "Пароль должен содержать по крайней мере одну цифру, одну букву в нижнем регистре, одну букву в верхнем регистре, и должен состоять из по крайней мере 8 символов."
        });
    }

    try {
        const user = await User.findOne(username ? { username: username } : { email: email });
        if (!user) {
            return res.status(404).send("Пользователь с указанными данными не найден.");
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);

        user.password = hash;
        await user.save();

        res.status(200).send("Пароль успешно изменен.");
    } catch (error) {
        console.error("Ошибка при изменении пароля:", error);
        res.status(500).send("Ошибка при изменении пароля.");
    }
};