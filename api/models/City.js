import mongoose from 'mongoose';
import Hotel from './Hotel.js';

const CitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

CitySchema.pre('remove', async function(next) {
    try {
        await Hotel.deleteMany({ CityId: this._id });
        next();
    } catch (err) {
        next(err);
    }
});

export default mongoose.model("City", CitySchema);