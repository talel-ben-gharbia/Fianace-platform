import { BadgeDollarSign, Home, TrendingDown, TrendingUp } from "lucide-react";
import { title } from "process";
export const APP_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

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


export { SIDEBAR_CONSTANTS, INCOME_CATEGORY_CONSTATNS };