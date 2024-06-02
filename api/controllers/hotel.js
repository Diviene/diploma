import Hotel from "../models/Hotel.js";
import City from "../models/City.js";
import HotelChain from "../models/HotelChain.js";
import HotelRating from "../models/HotelRating.js";

export const createHotel = async (req, res, next) => {
    try {
        const { CityId, HotelChainId, HotelRatingId, ...hotelData } = req.body;

        const city = await City.findById(CityId);
        const hotelChain = await HotelChain.findById(HotelChainId);
        const hotelRating = await HotelRating.findById(HotelRatingId);

        if (!city || !hotelChain || !hotelRating) {
            return res.status(404).json({ error: "Одна или несколько моделей не найдены" });
        }

        const newHotel = new Hotel({
            ...hotelData,
            CityId: city._id,
            HotelChainId: hotelChain._id,
            HotelRatingId: hotelRating._id
        });

        // Save the new hotel to the database
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);
    } catch (err) {
        next(err);
    }
}

export const updateHotel= async (req, res, next) => {
    try{
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id, 
            {$set: req.body}, 
            {new:true}
        )

        if (req.body.CityId) {
            await City.findByIdAndUpdate(
                req.body.CityId,
                { $addToSet: { hotels: updatedHotel._id } },
                { new: true }
            );
        }

        if (req.body.HotelChainId) {
            await HotelChain.findByIdAndUpdate(
                req.body.HotelChainId,
                { $addToSet: { hotels: updatedHotel._id } },
                { new: true }
            );
        }

        if (req.body.HotelRatingId) {
            await HotelRating.findByIdAndUpdate(
                req.body.HotelRatingId,
                { $addToSet: { hotels: updatedHotel._id } },
                { new: true }
            );
        }

        res.status(200).json(updatedHotel);
    }
    catch(err){
        next(err);
    }
}

export const deleteHotel = async (req, res, next) => {
   
    try{
        await Hotel.findByIdAndDelete(req.params.id)
        res.status(200).json("Успешно удалено");
    }
    catch(err){
        next(err);
    }
}

export const getHotelById = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id)
            .populate('CityId')
            .populate('HotelChainId')
            .populate('HotelRatingId');

        if (!hotel) {
            return res.status(404).json({ error: "Отель не найден" });
        }

        res.status(200).json({
            _id:hotel._id,
            HotelName: hotel.HotelName,
            HotelAddress: hotel.HotelAddress,
            HotelPostcode: hotel.HotelPostcode,
            HotelDescription: hotel.HotelDescription,
            photos: hotel.photos,
            City: hotel.CityId.name,
            HotelChain: hotel.HotelChainId.HotelChainName,
            HotelRating: hotel.HotelRatingId.HotelRatingStars
        });
    } catch (err) {
        next(err);
    }
};

export const getHotel = async (req, res, next) => {
    try {
        const hotels = await Hotel.find();

        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
};

export const getHotelsByCity = async (req, res, next) => {
    try {
        const { cityId } = req.params;

        const hotels = await Hotel.find({ CityId: cityId })
            .populate('CityId')
            .populate('HotelChainId')
            .populate('HotelRatingId');

        if (hotels.length === 0) {
            return res.status(404).json({ error: "В данном городе нет отелей" });
        }
        const formattedHotels = hotels.map(hotel => ({
            _id: hotel._id,
            HotelName: hotel.HotelName,
            HotelAddress: hotel.HotelAddress,
            HotelPostcode: hotel.HotelPostcode,
            HotelDescription: hotel.HotelDescription,
            photos: hotel.photos,
            City: hotel.CityId.name,
            HotelChain: hotel.HotelChainId.HotelChainName,
            HotelRating: hotel.HotelRatingId.HotelRatingStars
        }));

        res.status(200).json(formattedHotels);
    } catch (err) {
        next(err);
    }
};

export const getHotelsByParams = async (req, res, next) => {
    try {
        const { CityId, HotelChainId, HotelRatingId } = req.query;

        const filter = {};
        if (CityId) filter.CityId = CityId;
        if (HotelChainId) filter.HotelChainId = HotelChainId;
        if (HotelRatingId) filter.HotelRatingId = HotelRatingId;

        const hotels = await Hotel.find(filter)
            .populate('CityId')
            .populate('HotelChainId')
            .populate('HotelRatingId');

        if (hotels.length === 0) {
            return res.status(404).json({ error: "Отелей, удовлетворяющих заданным параметрам, не найдено" });
        }

        const formattedHotels = hotels.map(hotel => ({
            _id: hotel._id,
            HotelName: hotel.HotelName,
            HotelAddress: hotel.HotelAddress,
            HotelPostcode: hotel.HotelPostcode,
            HotelDescription: hotel.HotelDescription,
            photos: hotel.photos,
            City: hotel.CityId.name,
            HotelChain: hotel.HotelChainId.HotelChainName,
            HotelRating: hotel.HotelRatingId.HotelRatingStars
        }));

        res.status(200).json(formattedHotels);
    } catch (err) {
        next(err);
    }
};