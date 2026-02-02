import { clerkClient, getAuth } from "@clerk/express";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Income } from "../models/income.model";
import { Expense } from "../models/expense.model";

const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId || "");
    const email = clerkUser.primaryEmailAddress?.emailAddress;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allIncome = await Income.find({ userId: user._id }).sort({
      createdAt: -1,
    });
    const allExpense = await Expense.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    const allTransacions = [...allIncome, ...allExpense].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return res.status(200).json({ transactions :allTransacions, message : "Transactions fetched successfully"});
  } catch (error) {}
};

export { getAllTransactions };