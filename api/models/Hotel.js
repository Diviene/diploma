import mongoose from 'mongoose';
import HotelRoomType from './HotelRoomType.js';

const HotelSchema = new mongoose.Schema({
    HotelName: { type: String, required: true, unique: true },
    HotelAddress: { type: String, required: true, unique: true  },
    HotelPostcode: { type: String, required: true },
    HotelDescription: { type: String, required: true },
    photos:{
      type: [String]
    },
    CityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    HotelChainId: { type: mongoose.Schema.Types.ObjectId, ref: 'HotelChain', required: true },
    HotelRatingId: { type: mongoose.Schema.Types.ObjectId, ref: 'HotelRating', required: true }
  });

  HotelSchema.pre('remove', async function(next) {
    try {
        await HotelRoomType.deleteMany({ HotelId: this._id });
        next();
    } catch (err) {
        next(err);
    }
});

export default mongoose.model("Hotel", HotelSchema);