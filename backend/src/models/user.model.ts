import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true,
    },
    imageUrl : {
        type :String,
        trim:true,
        required:true,
    }
}, {timestamps:true});

export const User = mongoose.model("User", userSchema);