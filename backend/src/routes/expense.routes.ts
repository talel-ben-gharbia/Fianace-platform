import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { addExpense, deleteExpense, getUserExpense, updateExpense } from "../controllers/expense.controllers";

const router = Router();

router.route("/add-expense").post(requireAuth(), addExpense);

router.route("/get-expense").get(requireAuth(), getUserExpense);

router.route("/delete-expense/:expenseId").delete(requireAuth(), deleteExpense);

router.route("/update-expense/:expenseId").put(requireAuth(), updateExpense);

export default router;
