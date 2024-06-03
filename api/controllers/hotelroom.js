import Hotel from "../models/Hotel.js";
import HotelRoom from "../models/HotelRoom.js";
import HotelRoomType from "../models/HotelRoomType.js";

export const createHotelRoom = async (req, res, next) => {
    try {
        const { HotelRoomTypeId, ...hotelData } = req.body;

        const hotel = await HotelRoomType.findById(HotelRoomTypeId);

        if (!hotel) {
            return res.status(404).json({ error: "Одна или несколько моделей не найдены" });
        }

        const newRoom = new HotelRoom({
            ...hotelData,
            HotelRoomTypeId: hotel._id,
        });

        const savedHotelRoom = await newRoom.save()
        res.status(200).json(savedHotelRoom);
    } catch (err) {
        next(err);
    }
}

export const updateHotelRoom = async (req, res, next) => {
    try{
        const updatedHotelRoom = await HotelRoom.findByIdAndUpdate(
            req.params.id, 
            {$set: req.body}, 
            {new:true}
        )
        if (req.body.HotelId) {
            await HotelRoomType.findByIdAndUpdate(
                req.body.HotelRoomTypeId,
                { $addToSet: { hotelrooms: updatedHotelRoom._id } },
                { new: true }
            );
        }
        res.status(200).json(updatedHotelRoom);
    }
    catch(err){
        next(err);
    }
}

export const deleteHotelRoom = async (req, res, next) => {
   
    try{
        await HotelRoom.findByIdAndDelete(req.params.id)
        res.status(200).json("Успешно удалено");
    }
    catch(err){
        next(err);
    }
}

export const getHotelRoom = async (req, res, next) => {
    try{
        
        const hotelRoom = await HotelRoom.findById(req.params.id)
            .populate('HotelRoomTypeId') 

        if (!hotelRoom) {
            return res.status(404).json({ error: "Комнаты не найдены" });
        }
        res.status(200).json({
            HotelRoomNumber: hotelRoom.HotelRoomNumber,
            photos: hotelRoom.photos,
            HotelRoomType: hotelRoom.HotelRoomTypeId.Name
        });
    }
    catch(err){
        next(err);
    }
}

export const getHotelRooms = async (req, res, next) => {

    try {
        const hotelRoom = await HotelRoom.find();

        res.status(200).json(hotelRoom);
    } catch (err) {
        next(err);
    }
};

export const getHotelRoomsByHotelId = async (req, res, next) => {
    try {
      const { hotelId } = req.params;
      const { HotelRoomTypeId } = req.query;
  
      const roomTypes = await HotelRoomType.find({ HotelId: hotelId }).select("_id");
  
      const roomTypeIds = roomTypes.map((roomType) => roomType._id);
  
      let filter = { HotelRoomTypeId: { $in: roomTypeIds } };
  
      if (HotelRoomTypeId) {
        filter.HotelRoomTypeId = HotelRoomTypeId;
      }

      const hotelRooms = await HotelRoom.find(filter).populate({
        path: 'HotelRoomTypeId',
        select: 'Name PriceForAdult PriceForChild',
    });
  
      const result = hotelRooms.map(hotelRoom => ({
        ...hotelRoom.toObject(),
        HotelRoomType: hotelRoom.HotelRoomTypeId.Name,
        priceForAdult: hotelRoom.HotelRoomTypeId.PriceForAdult,
        priceForChildren: hotelRoom.HotelRoomTypeId.PriceForChild
      }));
  
      res.status(200).json(result);
    } catch (error) {
      console.error("Ошибка: ", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  };

export const getPriceForRooms = async (selectedRoomIds) => {
    try {
        if (!Array.isArray(selectedRoomIds)) {
            throw new Error("selectedRoomIds должен быть массивом идентификаторов номеров отеля");
        }
        const hotelRoomTypes = await HotelRoomType.find({ _id: { $in: selectedRoomIds } });

        const prices = hotelRoomTypes.map(roomType => ({
            _id: roomType._id,
            Name: roomType.Name,
            PriceForAdult: roomType.PriceForAdult,
            PriceForChild: roomType.PriceForChild
        }));

        return prices;
    } catch (error) {
        throw new Error("Ошибка при получении цен для номеров отеля");
    }
};

export const postPriceForRoom = async (req, res) => {
    const { selectedRoomIds } = req.body;
  
    try {
        const roomPrices = await Promise.all(selectedRoomIds.map(async (roomId) => {
            const room = await HotelRoom.findById(roomId).populate({
                path: 'HotelRoomTypeId',
                populate: {
                    path: 'HotelId',
                    model: 'Hotel'
                }
            });
            
            return {
                roomId: room._id,
                roomNumber: room.HotelRoomNumber,
                hotelRoomTypeName:room.HotelRoomTypeId.Name,
                priceForAdult: room.HotelRoomTypeId.PriceForAdult,
                priceForChild: room.HotelRoomTypeId.PriceForChild,
                hotelName: room.HotelRoomTypeId.HotelId.HotelName
            };
        }));
      
        res.json(roomPrices);
    } catch (error) {
        res.status(500).json({ error: 'Произошла ошибка при обработке запроса' });
    }
};