import Hotel from "../models/Hotel.js";
import HotelRoomType from "../models/HotelRoomType.js";

export const createHotelRoomType = async (req, res, next) => {
    try {
        const { HotelId, Rating, ...hotelData } = req.body;

        if (Rating < 1 || Rating > 5) {
            return res.status(400).json({ error: "Рейтинг должен быть в диапазоне от 1 до 5" });
        }

        const hotel = await Hotel.findById(HotelId);

        if (!hotel) {
            return res.status(404).json({ error: "Одна или несколько моделей не найдены" });
        }

        const newRoomType = new HotelRoomType({
            ...hotelData,
            Rating: Rating,
            HotelId: hotel._id,
        });

        const savedHotelRoomType = await newRoomType.save()
        res.status(200).json(savedHotelRoomType);
    } catch (err) {
        next(err);
    }
}

export const updateHotelRoomType = async (req, res, next) => {
    try{
        const updatedHotelRoomType = await HotelRoomType.findByIdAndUpdate(
            req.params.id, 
            {$set: req.body}, 
            {new:true}
        )

        if (req.body.HotelId) {
            await Hotel.findByIdAndUpdate(
                req.body.HoteId,
                { $addToSet: { hotelroomtypes: updatedHotelRoomType._id } },
                { new: true }
            );
        }
        res.status(200).json(updatedHotelRoomType);
    }
    catch(err){
        next(err);
    }
}

export const deleteHotelRoomType = async (req, res, next) => {
   
    try{
        await HotelRoomType.findByIdAndDelete(req.params.id)
        res.status(200).json("Успешно удалено");
    }
    catch(err){
        next(err);
    }
}

export const getHotelRoomType = async (req, res, next) => {
    try{
        
        const hotelRoomType = await HotelRoomType.findById(req.params.id)
            .populate('HotelId') 

        if (!hotelRoomType) {
            return res.status(404).json({ error: "Тип комнаты не найден" });
        }
        res.status(200).json({
            Rating: hotelRoomType.Rating,
            Name: hotelRoomType.Name,
            PriceForAdult: hotelRoomType.PriceForAdult,
            PriceForChild: hotelRoomType.PriceForChild,
            Hotel: hotelRoomType.HotelId.HotelName
        });
    }
    catch(err){
        next(err);
    }
}

export const getHotelRoomTypes = async (req, res, next) => {

    try {
        const hotelRoomTypes = await HotelRoomType.find();

        res.status(200).json(hotelRoomTypes);
    } catch (err) {
        next(err);
    }
};

export const getHotelRoomTypesByHotel = async (req, res, next) => {
    try {
        const { hotelId } = req.params;

        const hotelRoomTypes = await HotelRoomType.find({ HotelId: hotelId });

        res.status(200).json(hotelRoomTypes);
    } catch (err) {
        next(err);
    }
};