import HotelRating from "../models/HotelRating.js";

export const createHotelRating = async (req, res, next) => {
    const newHotelRating = new HotelRating(req.body)
    
    try{
        const savedHotelRating = await newHotelRating.save()
        res.status(200).json(savedHotelRating);
    }
    catch(err){
        next(err);
    }
}

export const updateHotelRating = async (req, res, next) => {
    try{
        const updatedHotelRating = await HotelRating.findByIdAndUpdate(
            req.params.id, 
            {$set: req.body}, 
            {new:true}
        )
        res.status(200).json(updatedHotelRating);
    }
    catch(err){
        next(err);
    }
}

export const deleteHotelRating = async (req, res, next) => {
   
    try{
        await HotelRating.findByIdAndDelete(req.params.id)
        res.status(200).json("Успешно удалено");
    }
    catch(err){
        next(err);
    }
}

export const getHotelRating = async (req, res, next) => {
    try{
        const hotelRating = await HotelRating.findById(
            req.params.id
        )
        res.status(200).json(hotelRating);
    }
    catch(err){
        next(err);
    }
}

export const getHotelRatings = async (req, res, next) => {

    try {
        const hotelRatings = await HotelRating.find();

        res.status(200).json(hotelRatings);
    } catch (err) {
        next(err);
    }
};