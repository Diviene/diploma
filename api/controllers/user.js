import User from "../models/User.js";

export const createUser = async (req, res, next) => {
    const newUser = new User(req.body)
    
    try{
        const savedUser = await newUser.save()
        res.status(200).json(savedUser);
    }
    catch(err){
        next(err);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ success: false, message: "Неправильный формат Email. Правильный формат: aaa@gmail.com" });
        }

        const surnameRegex = /^[А-Яа-я]+$/;
        if (!surnameRegex.test(req.body.CustomerSurname)) {
            return res.status(400).json({ success: false, message: "Неправильный формат фамилии. Фамилия не должна содержать числа." });
        }

        const nameRegex = /^[А-Яа-я]+$/;
        if (!nameRegex.test(req.body.CustomerName)) {
            return res.status(400).json({ success: false, message: "Неправильный формат имени. Имя не должно содержать чисел." });
        }

        const patronymicRegex = /^[А-Яа-я]+$/;
        if (!patronymicRegex.test(req.body.CustomerPatronymic)) {
            return res.status(400).json({ success: false, message: "Неправильный формат отчества. Отчество не должно содержать чисел." });
        }

        const phoneRegex = /^\+7\d{10}$/;
        if (!phoneRegex.test(req.body.PhoneNumber)) {
            return res.status(400).json({ success: false, message: "Неправильный формат номера телефона. Правильный формат \"+79999999999\"" });
        }

        res.status(200).json(updatedUser);
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
        next(err);
    }
};

export const deleteUser = async (req, res, next) => {
   
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("Успешно удалено");
    }
    catch(err){
        next(err);
    }
}

export const getUser = async (req, res, next) => {
    try{
        const user = await User.findById(
            req.params.id
        )
        res.status(200).json(user);
    }
    catch(err){
        next(err);
    }
}

export const getUsers = async (req, res, next) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    }
    catch(err){
        next(err);
    }
}

export const deleteUserImage = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "Пользователь не найден" });
        }

        user.img = null;
        await user.save();

        res.status(200).json({ success: true, message: "Изображение успешно удалено" });
    } catch (err) {
        next(err);
    }
};