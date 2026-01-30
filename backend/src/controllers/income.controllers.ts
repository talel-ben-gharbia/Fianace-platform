import { clerkClient, getAuth } from "@clerk/express";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Income } from "../models/income.model";

const addIncome = async (req: Request, res: Response) => {
  try {
    const { title, emoji, category, amount, date } = req.body;
    const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId || "");
    const email = clerkUser.primaryEmailAddress?.emailAddress;
    const isIncomeDateEmpty = [title, emoji, category, amount, date].some(
      (field) => field.toString().trim() === "",
    );

    if (isIncomeDateEmpty) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const income = await Income.create({
      transactionType: "Income",
      title,
      emoji,
      category,
      amount,
      date,
      userId: user._id,
    });

    if (!income) {
      return res.status(500).json({ message: "Failed to create income" });
    }
    user.income.push(income._id);
    await user.save();
    return res
      .status(201)
      .json({ message: "Income added successfully", income });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ meesage: "Server error while adding income" });
  }
};

const getUserIncome = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId || "");
    const email = clerkUser.primaryEmailAddress?.emailAddress;

    const user = await User.findOne({ email })
      .lean()
      .populate({ path: "income", select: "-__v  -userId" });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const incomes = user.income;
    return res
      .status(200)
      .json({ incomes, message: "Income fetched successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error while fetching income" });
  }
};

const deleteIncome = async (req: Request, res: Response) => {
    try {
        const {id} =req.params ;
        const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId || "");
    const email = clerkUser.primaryEmailAddress?.emailAddress;

    const user = await User.findOne({ email });
    if(!user){
        return res.status(404).json({message:"User not found"});
    }


    const deletedIncome = await Income.findOneAndDelete({
        _id:id,
        userId:user._id,
    },);

    if(!deletedIncome){
        return res.status(401).json({message :"Income not found or unauthorized"});
    }
    user.income = user.income.filter((incomeId) => incomeId.toString() !== id);
    await user.save();
    return res.status(200).json({message:"Income deleted successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error while deleting income"});
    }
};

const updateIncome = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, emoji, category, amount, date } = req.body;
    const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId || "");
    const email = clerkUser.primaryEmailAddress?.emailAddress;
    const isIncomeDateEmpty = [title, emoji, category, amount, date].some(
      (field) => field.trim() === "",
    );

    if (isIncomeDateEmpty) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateIncome = await Income.findOneAndUpdate(
      {
        _id: id,
        userId: user._id,
      },
      {
        $set: {
          title,
          emoji,
          category,
          amount,
          date,
        },
      },
    );
    if (!updateIncome) {
      return res
        .status(401)
        .json({ message: "Income not found or unauthorized" });
    }

    return res.status(200).json({ message: "Income updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error while updating income" });
  }
};

export { addIncome, getUserIncome, deleteIncome, updateIncome };
