import User from "../models/User.js";
import HotelRoom from "../models/HotelRoom.js";
import Booking from "../models/Booking.js";
import moment from 'moment-timezone';
import HotelRoomType from "../models/HotelRoomType.js";
import Hotel from "../models/Hotel.js";

export const createBooking = async (req, res, next) => {
    try {
        const { UserId, DateOfStart, DateOfEnd, HotelRoomIds, ...hotelData } = req.body;

        const user = await User.findById(UserId);
        const hotelRooms = await HotelRoom.find({ _id: { $in: HotelRoomIds } });

        if (!user || !hotelRooms || hotelRooms.length !== HotelRoomIds.length) {
            return res.status(404).json({ error: "Одна или несколько моделей не найдены" });
        }

        const overlappingBookings = await Booking.find({
            HotelRoomIds: { $in: HotelRoomIds },
            $or: [
                { DateOfStart: { $lte: moment(DateOfEnd).endOf('day').toDate() }, DateOfEnd: { $gte: moment(DateOfStart).startOf('day').toDate() } },
                { DateOfStart: { $gte: moment(DateOfStart).startOf('day').toDate(), $lte: moment(DateOfEnd).endOf('day').toDate() } },
            ],
        });

        if (overlappingBookings.length > 0) {
            return res.status(400).json({ error: "Один или несколько номеров отеля недоступны для бронирования в указанный период времени" });
        }

        const newHotel = new Booking({
            ...hotelData,
            UserId: user._id,
            DateOfStart,
            DateOfEnd,
            HotelRoomIds: hotelRooms.map(room => room._id),
        });

        const savedHotel = await newHotel.save();

        res.status(200).json(savedHotel);
    } catch (err) {
        next(err);
    }
}
export const updateBooking= async (req, res, next) => {
    try{
        const updatedHotel = await Booking.findByIdAndUpdate(
            req.params.id, 
            {$set: req.body}, 
            {new:true}
        )
        res.status(200).json(updatedHotel);
    }
    catch(err){
        next(err);
    }
}

export const deleteBooking = async (req, res, next) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

        if (!deletedBooking) {
            return res.status(404).json({ error: "Бронирование не найдено" });
        }

        res.status(200).json("Успешно удалено");
    } catch (err) {
        next(err);
    }
}

export const getBookingById = async (req, res, next) => {
    try {
        const hotel = await Booking.findById(req.params.id)
            .populate('UserId')
            .populate({
                path: 'HotelRoomIds',
                populate: {
                    path: 'HotelRoomTypeId',
                    populate: {
                        path: 'HotelId',
                    }
                }
            });

        if (!hotel) {
            return res.status(404).json({ error: "Отель не найден" });
        }

        res.status(200).json({
            DateOfStart: hotel.DateOfStart,
            DateOfEnd: hotel.DateOfEnd,
            NumberOfAdults: hotel.NumberOfAdults,
            NumberOfChildren: hotel.NumberOfChildren,
            FullPrice: hotel.FullPrice,
            Status: hotel.Status,
            User: hotel.UserId.username,
            HotelRoomIds: hotel.HotelRoomIds.map(room => room.HotelRoomNumber),
            HotelRoomType: hotel.HotelRoomIds[0].HotelRoomTypeId.Name,
            Hotel: hotel.HotelRoomIds[0].HotelRoomTypeId.HotelId.HotelName
        });
    } catch (err) {
        next(err);
    }
};

export const getBookings = async (req, res, next) => {
    try {
        const hotels = await Booking.find();

        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
};


export const getBookingsByRoom = async (req, res, next) => {
    try {
        const { roomId } = req.params;

        const bookings = await Booking.find({ HotelRoomIds: roomId });

        res.status(200).json(bookings);
    } catch (err) {
        next(err);
    }
};

export const getBookingsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const bookings = await Booking.find({ UserId: userId }).populate({
            path: 'HotelRoomIds',
            populate: {
                path: 'HotelRoomTypeId',
                model: HotelRoomType,
            },
        }).populate('HotelRoomIds');

        const bookingsInfo = [];

        for (const booking of bookings) {
            const roomInfo = await Promise.all(booking.HotelRoomIds.map(async (roomId) => {
                const room = await HotelRoom.findById(roomId).populate('HotelRoomTypeId');
                const roomType = room.HotelRoomTypeId;
                const hotel = await Hotel.findById(roomType.HotelId);
                return {
                    roomNumber: room.HotelRoomNumber,
                    roomTypeName: roomType.Name,
                    hotelName: hotel.HotelName,
                };
            }));

            const bookingInfo = {
                id: booking._id,
                DateOfStart: booking.DateOfStart,
                DateOfEnd: booking.DateOfEnd,
                FullPrice: booking.FullPrice,
                NumberOfAdults: booking.NumberOfAdults,
                NumberOfChildren: booking.NumberOfChildren,
                rooms: roomInfo,
            };

            bookingsInfo.push(bookingInfo);
        }
        res.json(bookingsInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteBookingByUserId = async (req, res, next) => {
    const { userId, bookingId } = req.params;

    try {
        const booking = await Booking.findOne({ UserId: userId, _id: bookingId });

        if (!booking) {
            return res.status(404).json({ error: "Бронирование для данного пользователя с указанным ID не найдено" });
        }

        await Booking.deleteOne({ _id: bookingId });

        res.status(200).json({ message: "Бронирование успешно удалено" });
    } catch (err) {
        next(err);
    }
}