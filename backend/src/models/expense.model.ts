import mongoose from "mongoose";

const expenseShema = new mongoose.Schema({
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
    userId : {
        type:String,
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

export const Expense = mongoose.model("Expense", expenseShema);