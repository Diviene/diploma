import mongoose from 'mongoose';

const PasswordCodesSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});


export default mongoose.model("PasswordCodes", PasswordCodesSchema);