import mongoose from 'mongoose';
import Booking from './Booking.js';

const HotelRoomSchema = new mongoose.Schema({
    HotelRoomNumber: {
        type: String,
        required: true,
        unique: true 
    },
    photos:{
        type: [String]
    },
    HotelRoomTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'HotelRoomType' }
});

HotelRoomSchema.pre('remove', async function(next) {
    try {
        await Booking.deleteMany({ HotelRoomIds: { $in: [this._id] } });
        next();
    } catch (err) {
        next(err);
    }
});

export default mongoose.model("HotelRoom", HotelRoomSchema);