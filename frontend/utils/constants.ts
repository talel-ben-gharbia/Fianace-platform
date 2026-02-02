import { BadgeDollarSign, Home, TrendingDown, TrendingUp } from "lucide-react";

export const APP_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/api";

const SIDEBAR_CONSTANTS = [
    {
        id : "/",
        title : "Dashboard",
        icon : Home
    },
    {
        id : "/transactions",
        title : "Transactions",
        icon : BadgeDollarSign
    },
    {
        id : "/income",
        title : "Income",
        icon : TrendingUp
    },
    {
        id : "/expense",
        title : "Expense",
        icon : TrendingDown
    }
] 

const INCOME_CATEGORY_CONSTATNS =[
    {
        value : "business",
        title : "Business",
    },
    {
        value : "freelance",
        title : "Freelance",
    },
    {
        value : "investment",
        title : "Investment",
    },
    {
        value : "salary",
        title : "Salary",
    },
    {
        value : "rentalIncome",
        title : "Rental Income",
    },
    {
        value : "otherIncome",
        title : "Other Income",
    },

];

const EXPENSE_CATEGORY_CONSTATNS = [
  { value: "food", title: "Food" },
  { value: "rent", title: "Rent" },
  { value: "shopping", title: "Shopping" },
  { value: "bills", title: "Bills" },
  { value: "travel", title: "Travel" },
  { value: "entertainment", title: "Entertainment" },
  { value: "otherExpense", title: "Other Expense" },
];

export { SIDEBAR_CONSTANTS, INCOME_CATEGORY_CONSTATNS, EXPENSE_CATEGORY_CONSTATNS };