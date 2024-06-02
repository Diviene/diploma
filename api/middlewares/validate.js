export function validateEmailAndPassword(req, res, next) {
    if (req.path.startsWith(`/register`)) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ success: false, message: "Неправильный формат Email. Правильный формат: aaa@gmail.com" });
        }

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordRegex.test(req.body.password)) {
            return res.status(400).json({ success: false, message: "Пароль должен содержать по крайней мере одну цифру, одну букву в нижнем регистре, одну букву в верхнем регистре, и должен состоять из по крайней мере 8 символов." });
        }

        // Валидация фамилии
        const surnameRegex = /^[А-Я][а-я]+$/;
        if (!surnameRegex.test(req.body.CustomerSurname)) {
            return res.status(400).json({ success: false, message: "Неправильный формат фамилии. Фамилия не должна содержать числа." });
        }

        // Валидация имени
        const nameRegex = /^[А-Я][а-я]+$/;
        if (!nameRegex.test(req.body.CustomerName)) {
            return res.status(400).json({ success: false, message: "Неправильный формат имени. Имя не должно содержать чисел." });
        }

        // Валидация отчества
        const patronymicRegex = /^[А-Я][а-я]+$/;
        if (!patronymicRegex.test(req.body.CustomerPatronymic)) {
            return res.status(400).json({ success: false, message: "Неправильный формат отчества. Отчество не должно содержать чисел." });
        }

        // Валидация номера телефона
        const phoneRegex = /^\+7\d{10}$/;
        if (!phoneRegex.test(req.body.PhoneNumber)) {
            return res.status(400).json({ success: false, message: "Неправильный формат номера телефона. Правильный формат \"+79999999999\"" });
        }
    }

    next();
}