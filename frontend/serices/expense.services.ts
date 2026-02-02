import { APP_API_URL } from "@/utils/constants";
import { ITransactionData } from "@/utils/types";
import axios from "axios";
const addExpense = async (payload: ITransactionData, token: string) => {
  try {
    const response = await axios.post(`${APP_API_URL}/add-expense`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchExpense = async (token: string) => {
  try {
    const response = await axios.get(`${APP_API_URL}/get-expense`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data.expenses;
  } catch (error) {
    throw error;
  }
};

const updateExpense = async (payload: ITransactionData, id: string, token: string) => {
  try {
    await axios.put(`${APP_API_URL}/update-expense/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw error;
  }
};

const deleteExpense = async (id: string, token: string) => {
  try {
    await axios.delete(`${APP_API_URL}/delete-expense/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw error;
  }
};

export { addExpense, fetchExpense, deleteExpense, updateExpense };
