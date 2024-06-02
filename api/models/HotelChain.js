import mongoose from 'mongoose';
import Hotel from './Hotel.js';

const HotelChainSchema = new mongoose.Schema({
    HotelChainName: { type: String, required: true, unique: true },
    HotelChainDescription: { type: String }
  });

  HotelChainSchema.pre('remove', async function(next) {
    try {
        await Hotel.deleteMany({ HotelChainId: this._id });
        next();
    } catch (err) {
        next(err);
    }
});

  export default mongoose.model("HotelChain", HotelChainSchema);