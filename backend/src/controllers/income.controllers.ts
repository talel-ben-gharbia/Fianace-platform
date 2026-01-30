import { clerkClient, getAuth } from "@clerk/express";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Income } from "../models/income.model";

const addIncome = async (req: Request, res: Response) => {
  console.log("addIncome called");
  try {
    const { title, emoji, category, amount, date } = req.body;
    const { userId } = getAuth(req);
    if (!userId) {
      console.log("addIncome: missing userId");
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Try to fetch Clerk user but fail fast if external call hangs
    let clerkUser;
    try {
      clerkUser = await Promise.race([
        clerkClient.users.getUser(userId || ""),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Clerk fetch timeout")), 5000)),
      ] as any);
    } catch (err) {
      console.log("addIncome: clerk user fetch failed", err);
      return res.status(500).json({ message: "Authentication provider error" });
    }

    const email = clerkUser?.primaryEmailAddress?.emailAddress;

    const isIncomeDateEmpty = [title, emoji, category, amount, date].some(
      (field) => field === undefined || field === null || (typeof field === "string" && field.trim() === ""),
    );

    const parsedDate = date ? new Date(date) : null;
    if (isIncomeDateEmpty || !parsedDate || isNaN(parsedDate.getTime())) {
      console.log("addIncome: validation failed", { body: { title, emoji, category, amount, date } });
      return res.status(400).json({ message: "All fields are required and date must be valid" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("addIncome: user not found for", email);
      return res.status(404).json({ message: "User not found" });
    }

    const income = await Income.create({
      transactionType: "Income",
      title,
      emoji,
      category,
      amount,
      date: parsedDate,
      userId: user._id,
    });

    if (!income) {
      return res.status(500).json({ message: "Failed to create income" });
    }
    user.income.push(income._id);
    await user.save();
    console.log("addIncome: success for user", email, "incomeId", income._id);
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
