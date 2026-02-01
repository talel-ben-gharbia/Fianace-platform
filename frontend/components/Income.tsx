"use client";
import React, { useEffect, useMemo, useState } from "react";
import IncomeModal from "./IncomeModal";
import { SquarePen, Trash2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import {
  addIncome,
  deleteIncome,
  fetchIncome,
  updateIncome,
} from "@/serices/income.services";
import { ITransactionData } from "@/utils/types";
import { Spinner } from "./ui/Spinner";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { fetchTransactionsList, getCHartsOptions } from "@/utils/helpers";
import { set } from "date-fns";

function Income() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [incomeList, setIncomeList] = useState<ITransactionData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [incomeObj, setIncomeObj] = useState<ITransactionData | null>(null);
  const [seriesData,setSeriesData] =useState([]);
  const [categories, setCategories] = useState<string[]>([]);
  const handleAddIncome = async (incomeData: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("User not authenticated");
        return false;
      }
      await addIncome(incomeData, token);
      await handleFetchUserIncome();
      toast.success("Income added successfully");
      setShowModal(false);
      return true;
    } catch (error) {
      toast.error("Failed to add income");
      console.log(error);
      return false;
    }
  };

  const handleUpdateIncome = async (income: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("User not authenticated");
        return false;
      }
      if (!income._id) {
        toast.error("Income ID is missing");
        return;
      }
      await updateIncome(income, income._id, token);
      await handleFetchUserIncome();
      toast.success("Income updated successfully");
    } catch (error) {
      toast.error("Failed to update income");
      console.log(error);
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("User not authenticated");
        return false;
      }
      await deleteIncome(id || "", token);
      await handleFetchUserIncome();
      toast.success("Income deleted successfully");
    } catch (error) {
      toast.error("Failed to delete income");
      console.log(error);
    }
  };

  const handleFetchUserIncome = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      console.log(token);
      if (!token) {
        return;
      }
      const incomeList = await fetchIncome(token);
      setIncomeList(incomeList);

      const { newSeriesData = [], newCategories=[] } = fetchTransactionsList(incomeList);
      setSeriesData(newSeriesData);  
      setCategories(newCategories);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  console.log(incomeList);
  useEffect(() => {
    handleFetchUserIncome();
  }, []);

  const options : Highcharts.Options = useMemo(()=>{
    return getCHartsOptions(categories,seriesData);
  },[categories,seriesData]);
    
  return (
    <div className="w-[75%] ml-8 mt-6 mr-8">
      <div className="flex w-full justify-between">
        <h1 className="text-xl font-medium">Incomes</h1>
        <IncomeModal
          onAddIncome={handleAddIncome}
          onUpdateIncome={handleUpdateIncome}
          showModal={showModal}
          setShowModal={setShowModal}
          incomeObj={incomeObj}
          setIsEditMode={setIsEditMode}
          isEditMode={isEditMode}
        />
      </div>

      {incomeList?.length ? (
        <div className="border border-gray-300 mt-4 px-3 py-6 rounded-3xl flex-1">
          <div className="font-medium text-lg">Income overview</div>
          <div className="text-sm text-gray-500">Monitor your income over time and make informed decisions</div>
          <div className="mt-8">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        </div>
      ) : null}

      {incomeList?.length ? (
        <div className="mt-4 h-[332px] overflow-y-scroll rounded-3xl border border-gray-300 px-6 py-6 no-scrollbar">
          <div className="grid grid-cols-2 gap-10">
            {incomeList.map((income) => (
              <div
                key={income._id}
                className="flex gap-2 justify-between items-center"
              >
                {/* LEFT SIDE */}
                <div className="flex gap-2">
                  <span className="bg-gray-100 shadow-2xl text-2xl w-12 h-12 rounded-full flex items-center justify-center">
                    {income.emoji}
                  </span>

                  <div className="flex flex-col">
                    <span className="font-medium">{income.title}</span>
                    <span className="text-gray-500 text-sm">
                      {income.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(income.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center justify-center gap-2 h-fit bg-green-100 rounded-md px-4 py-1">
                    <span className="text-green-800 font-medium">
                      + ${income.amount}
                    </span>
                    <TrendingUp className="w-4 h-4 text-green-800 font-bold" />
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <SquarePen
                      className="w-5 h-5 text-gray-500 cursor-pointer"
                      onClick={() => {
                        setIsEditMode(true);
                        setShowModal(true);
                        setIncomeObj(income);
                      }}
                    />
                    <Trash2
                      className="text-red-500 w-5 h-5 cursor-pointer"
                      onClick={() => {
                        handleDeleteIncome(income._id || "");
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-full w-full">
          <Spinner className="h-10 w-10" />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          Click the Add income button to add income
        </div>
      )}
    </div>
  );
}

export default Income;
