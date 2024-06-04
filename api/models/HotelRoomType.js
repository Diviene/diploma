import mongoose from 'mongoose';
import HotelRoom from './HotelRoom.js';

const HotelRoomTypeSchema = new mongoose.Schema({
    Rating: {
        type: Number,
        required: true,
    },
    Name: {
        type: String,
        required: true,
        Unique: true
    },
    PriceForAdult: {
        type: Number,
        required: true,
    },
    PriceForChild: {
        type: Number,
        required: true,
    },
    HotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }
});

HotelRoomTypeSchema.pre('remove', async function(next) {
    try {
        await HotelRoom.deleteMany({ HotelRoomTypeId: this._id });
        next();
    } catch (err) {
        next(err);
    }
});


export default mongoose.model("HotelRoomType", HotelRoomTypeSchema);


