import mongoose from 'mongoose';

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

export default mongoose.model("HotelRoom", HotelRoomSchema);