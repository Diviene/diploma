import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.js"
import cityRoute from "./routes/cities.js"
import userRoute from "./routes/users.js"
import hotelratingsRoute from "./routes/hotelratings.js"
import hotelchainRoute from "./routes/hotelchains.js"
import hotelRoute from "./routes/hotels.js"
import hotelroomtypesRoute from "./routes/hotelroomtypes.js"
import hotelroomsRoute from "./routes/hotelrooms.js"
import bookingRoute from "./routes/booking.js"
import { validateEmailAndPassword } from "./middlewares/validate.js"


const app = express()
dotenv.config()

const connect = async () => {
    try {
    await mongoose.connect(process.env.MONGO);
    console.log("Успешно подключено к базе данных")
  } catch (error) {
    throw error
  }
};

mongoose.connection.on("disconnected", () => {
    console.log("Отключено от базы данных!")
})

app.use(cors())
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", validateEmailAndPassword, authRoute)
app.use("/api/users", userRoute);
app.use("/api/cities", cityRoute)
app.use("/api/hotelchains", hotelchainRoute)
app.use("/api/hotelratings", hotelratingsRoute)
app.use("/api/hotels", hotelRoute)
app.use("/api/hotelroomtypes", hotelroomtypesRoute)
app.use("/api/hotelrooms", hotelroomsRoute)
app.use("/api/bookings", bookingRoute)

app.use((err,req,res,next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Что-то пошло не так"
    return res.status(errorStatus).json({
      success:false,
      status:errorStatus,
      message:errorMessage,
      stack:err.stack
    })
  })

app.listen(8900, () => {
    connect()
    console.log("Подключено к бэкенду.")
})