'use client';
import React from "react";
import IncomeModal from "./IncomeModal";
import { SquarePen, Trash2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { addIncome } from "@/serices/income.services";
import { ITransactionData } from "@/utils/types";

function Income() {
  const {getToken} = useAuth();
  const handleAddIncome = async (incomeData : ITransactionData) => {
    try {
      const token = await  getToken();
      if(!token){
        toast.error("User not authenticated");
        return;
      }
      await addIncome(incomeData , token) ;
      toast.success("Income added successfully");
    } catch (error) {
      toast.error("Failed to add income");
      console.log(error);
    }
  }
  return (
    <div className="w-[75%] ml-8 mt-6 mr-8">
      <div className="flex w-full justify-between">
        <h1 className="text-xl font-medium">Incomes</h1>
        <IncomeModal onAddIncome={handleAddIncome}/>
      </div>

      <div className="mt-4 h-[332px] overflow-y-scroll rounded-3xl border border-gray-300 px-6 py-6 no-scrollbar">
        <div className="grid grid-cols-2 gap-10">
        <div className="flex gap-2 justify-between items-center">
          <div className="flex gap-2">
            <span className="bg-gray-100 shadow-2xl text-2xl w-12 h-12 rounded-full flex items-center justify-center">
              😊
            </span>
            <div className="flex flex-col">
              <span className="font-medium">Ttile</span>
              <span className="text-gray-500 text-sm">Category</span>
              <span className="text-xs text-gray-400 font-medium">Date</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 ">
            <div className="flex items-center justify-center
            gap-2 h-fit bg-green-100 rounded-md px-4 py-1">
              <span className="text-green-800 font-medium">+ $1000</span>
              <TrendingUp  className="w-4 h-4 text-green-800 font-bold"/>
            </div>

            <div className="flex items-center justify-center gap-2">
              <SquarePen className="w-5 h-5 text-gray-500 cursor-pointer" />
              <Trash2 className="text-red-500 w-5 h-5 cursor-pointer " />
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Income;
