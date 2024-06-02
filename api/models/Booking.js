import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    DateOfStart: {
        type: Date,
        required: true,
    },
    DateOfEnd: {
        type: Date,
        required: true,
    },
    NumberOfAdults: {
        type: Number,
        required: true,
    },
    NumberOfChildren: {
        type: Number,
        required: true,
    },
    FullPrice: {
        type: Number,
        required: true,
    },
    Status: {
        type: String,
    },
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    HotelRoomIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HotelRoom' }]
});

export default mongoose.model("Booking", BookingSchema);