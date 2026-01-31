import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { addIncome, deleteIncome, getUserIncome, updateIncome } from "../controllers/income.controllers";

const router = Router();

router.route("/add-income").post(requireAuth(), addIncome);

router.route("/get-income").get(requireAuth(), getUserIncome);

router.route("/delete-income/:incomeId").delete(requireAuth(), deleteIncome);

router.route("/update-income/:incomeId").put(requireAuth(), updateIncome);


export default router;