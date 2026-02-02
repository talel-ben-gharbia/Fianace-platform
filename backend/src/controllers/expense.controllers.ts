import { clerkClient, getAuth } from "@clerk/express";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Expense } from "../models/expense.model";

const addExpense = async (req: Request, res: Response) => {
  try {
    const { title, emoji, category, amount, date } = req.body;
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let clerkUser;
    try {
      clerkUser = await Promise.race([
        clerkClient.users.getUser(userId || ""),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Clerk fetch timeout")), 5000)),
      ] as any);
    } catch (err) {
      console.log("addExpense: clerk user fetch failed", err);
      return res.status(500).json({ message: "Authentication provider error" });
    }

    const email = clerkUser?.primaryEmailAddress?.emailAddress;

    const isExpenseDateEmpty = [title, emoji, category, amount, date].some(
      (field) => field === undefined || field === null || (typeof field === "string" && field.trim() === ""),
    );

    const parsedDate = date ? new Date(date) : null;
    if (isExpenseDateEmpty || !parsedDate || isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "All fields are required and date must be valid" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const expense = await Expense.create({
      transactionType: "Expense",
      title,
      emoji,
      category,
      amount,
      date: parsedDate,
      userId: user._id as any,
    }) as any;

    if (!expense) {
      return res.status(500).json({ message: "Failed to create expense" });
    }

    user.expenses.push(expense._id);
    await user.save();

    return res.status(201).json({ message: "Expense added successfully", expense });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error while adding expense" });
  }
};

const getUserExpense = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId || "");
    const email = clerkUser.primaryEmailAddress?.emailAddress;

    const user = await User.findOne({ email }).lean().populate({ path: "expenses", select: "-__v  -userId" });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const expenses = user.expenses;

    return res.status(200).json({ expenses, message: "Expense fetched successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error while fetching expense" });
  }
};

const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { expenseId } = req.params;
    const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId || "");
    const email = clerkUser.primaryEmailAddress?.emailAddress;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedExpense = await Expense.findOneAndDelete({
      _id: expenseId,
      userId: user._id as any,
    });

    if (!deletedExpense) {
      return res.status(401).json({ message: "Expense not found or unauthorized" });
    }

    user.expenses = user.expenses.filter((Id) => Id.toString() !== expenseId);
    await user.save();

    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error while deleting expense" });
  }
};

const updateExpense = async (req: Request, res: Response) => {
  try {
    const { expenseId } = req.params;
    const { title, emoji, category, amount, date } = req.body;
    const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId || "");
    const email = clerkUser.primaryEmailAddress?.emailAddress;

    const isExpenseDateEmpty = [title, emoji, category, amount, date].some((field) => field === undefined || field === null || (typeof field === "string" && field.trim() === ""));

    if (isExpenseDateEmpty) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateExpense = await Expense.findOneAndUpdate(
      {
        _id: expenseId,
        userId: user._id as any,
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

    if (!updateExpense) {
      return res.status(401).json({ message: "Expense not found or unauthorized" });
    }

    return res.status(200).json({ message: "Expense updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error while updating expense" });
  }
};

export { addExpense, getUserExpense, deleteExpense, updateExpense };
