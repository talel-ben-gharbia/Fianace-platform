import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { getAllTransactions } from "../controllers/transaction.controllers";


const router = Router();


router.route("/get-transaction").get(requireAuth(),getAllTransactions); 



export default router;