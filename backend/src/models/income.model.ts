import mongoose from "mongoose";

const incomeShema = new mongoose.Schema({
    transactionType:{
        type: String,
        required: true,
        trim:true,
    },
    title: {
        type: String,
        required: true,
        trim:true,
    },
    emoji :{
        type :String,
        trim:true,
        required:true,
    },
    category :{
        type :String,
        trim:true,
        required:true,
    },
    amount : {
        type :String,
        required:true,
        trim:true,
    },
    userId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        trim:true,
    },
    date : {
        type:Date,
        required:true,
        trim:true,
    },
},
    {timestamps:true}
);

export const Income = mongoose.model("Income", incomeShema);