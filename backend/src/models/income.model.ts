import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      required: true,
      trim: true,
      enum: ["Income"], // اختياري
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    emoji: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: String, 
      required: true,
      min: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date, 
      required: true,
    },
  },
  { timestamps: true }
);

export const Income = mongoose.model("Income", incomeSchema);
