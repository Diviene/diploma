import mongoose from 'mongoose';
import Hotel from './Hotel.js';

const HotelRatingSchema = new mongoose.Schema({
    HotelRatingStars: { type: Number, required: true, unique: true  },
    photo:{
      type: String 
    },
  });

  HotelRatingSchema.pre('remove', async function(next) {
    try {
        await Hotel.deleteMany({ HotelRatingId: this._id });
        next();
    } catch (err) {
        next(err);
    }
});

  export default mongoose.model("HotelRating", HotelRatingSchema);