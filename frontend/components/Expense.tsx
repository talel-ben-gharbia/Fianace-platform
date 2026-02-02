"use client";
import React, { useEffect, useMemo, useState } from "react";
import ExpenseModal from "./ExpenseModal";
import { SquarePen, Trash2, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import {
  addExpense,
  deleteExpense,
  fetchExpense,
  updateExpense,
} from "@/serices/expense.services";
import { IChartSeriesPoint, ITransactionData } from "@/utils/types";
import { Spinner } from "./ui/Spinner";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { fetchTransactionsList, getCHartsOptions } from "@/utils/helpers";

function Expense() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [expenseList, setExpenseList] = useState<ITransactionData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [expenseObj, setExpenseObj] = useState<ITransactionData | null>(null);
  const [seriesData, setSeriesData] = useState<IChartSeriesPoint[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const handleAddExpense = async (expenseData: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("User not authenticated");
        return false;
      }
      await addExpense(expenseData, token);
      await handleFetchUserExpense();
      toast.success("Expense added successfully");
      setShowModal(false);
      return true;
    } catch (error) {
      toast.error("Failed to add expense");
      console.log(error);
      return false;
    }
  };

  const handleUpdateExpense = async (expense: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("User not authenticated");
        return false;
      }
      if (!expense._id) {
        toast.error("Expense ID is missing");
        return;
      }
      await updateExpense(expense, expense._id, token);
      await handleFetchUserExpense();
      toast.success("Expense updated successfully");
    } catch (error) {
      toast.error("Failed to update expense");
      console.log(error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("User not authenticated");
        return false;
      }
      await deleteExpense(id || "", token);
      await handleFetchUserExpense();
      toast.success("Expense deleted successfully");
    } catch (error) {
      toast.error("Failed to delete expense");
      console.log(error);
    }
  };

  const handleFetchUserExpense = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        return;
      }
      const expenseList = await fetchExpense(token);
      setExpenseList(expenseList);

      const { newSeriesData = [], newCategories = [] } = fetchTransactionsList(expenseList);
      setSeriesData(newSeriesData);
      setCategories(newCategories);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchUserExpense();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options: Highcharts.Options = useMemo(() => {
    return getCHartsOptions(categories, seriesData);
  }, [categories, seriesData]);

  return (
    <div className="w-[75%] ml-8 mt-6 mr-8">
      <div className="flex w-full justify-between">
        <h1 className="text-xl font-medium">Expenses</h1>
        <ExpenseModal
          onAddExpense={handleAddExpense}
          onUpdateExpense={handleUpdateExpense}
          showModal={showModal}
          setShowModal={setShowModal}
          expenseObj={expenseObj}
          setIsEditMode={setIsEditMode}
          isEditMode={isEditMode}
        />
      </div>

      {expenseList?.length ? (
        <div className="border border-gray-300 mt-4 px-3 py-6 rounded-3xl flex-1">
          <div className="font-medium text-lg">Expense overview</div>
          <div className="text-sm text-gray-500">Monitor your expenses over time and make informed decisions</div>
          <div className="mt-8">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        </div>
      ) : null}

      {expenseList?.length ? (
        <div className="mt-4 h-[332px] overflow-y-scroll rounded-3xl border border-gray-300 px-6 py-6 no-scrollbar">
          <div className="grid grid-cols-2 gap-10">
            {expenseList.map((expense) => (
              <div
                key={expense._id}
                className="flex gap-2 justify-between items-center"
              >
                {/* LEFT SIDE */}
                <div className="flex gap-2">
                  <span className="bg-gray-100 shadow-2xl text-2xl w-12 h-12 rounded-full flex items-center justify-center">
                    {expense.emoji}
                  </span>

                  <div className="flex flex-col">
                    <span className="font-medium">{expense.title}</span>
                    <span className="text-gray-500 text-sm">
                      {expense.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {expense.date ? new Date(expense.date).toLocaleDateString() : ""}
                    </span>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center justify-center gap-2 h-fit bg-red-100 rounded-md px-4 py-1">
                    <span className="text-red-800 font-medium">- ${expense.amount}</span>
                    <TrendingDown className="w-4 h-4 text-red-800 font-bold" />
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <SquarePen
                      className="w-5 h-5 text-gray-500 cursor-pointer"
                      onClick={() => {
                        setIsEditMode(true);
                        setShowModal(true);
                        setExpenseObj(expense);
                      }}
                    />
                    <Trash2
                      className="text-red-500 w-5 h-5 cursor-pointer"
                      onClick={() => {
                        handleDeleteExpense(expense._id || "");
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
          Click the Add expense button to add expense
        </div>
      )}
    </div>
  );
}

export default Expense;
