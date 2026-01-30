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
    },
    expenses : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense',
    }],
    income : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Income',
    }],
}, {timestamps:true});

export const User = mongoose.model("User", userSchema);