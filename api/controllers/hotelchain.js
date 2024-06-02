import HotelChain from "../models/HotelChain.js";

export const createHotelChain = async (req, res, next) => {
    const newHotelChain = new HotelChain(req.body)
    
    try{
        const savedHotelChain = await newHotelChain.save()
        res.status(200).json(savedHotelChain);
    }
    catch(err){
        next(err);
    }
}

export const updateHotelChain = async (req, res, next) => {
    try{
        const updatedHotelChain = await HotelChain.findByIdAndUpdate(
            req.params.id, 
            {$set: req.body}, 
            {new:true}
        )
        res.status(200).json(updatedHotelChain);
    }
    catch(err){
        next(err);
    }
}

export const deleteHotelChain = async (req, res, next) => {
   
    try{
        await HotelChain.findByIdAndDelete(req.params.id)
        res.status(200).json("Успешно удалено");
    }
    catch(err){
        next(err);
    }
}

export const getHotelChain = async (req, res, next) => {
    try{
        const hotelChain = await HotelChain.findById(
            req.params.id
        )
        res.status(200).json(hotelChain);
    }
    catch(err){
        next(err);
    }
}

export const getHotelChains = async (req, res, next) => {

    try {
        const hotelChains = await HotelChain.find();

        res.status(200).json(hotelChains);
    } catch (err) {
        next(err);
    }
};