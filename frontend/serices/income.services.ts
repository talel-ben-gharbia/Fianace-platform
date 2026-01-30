import { APP_API_URL } from "@/utils/constants";
import { ITransactionData } from "@/utils/types";
import axios from "axios";
const addIncome = async (payload : ITransactionData , token:string) => {
    try {
        const response = await axios.post(`${APP_API_URL}/add-income` , payload , {
            headers : {
                Authorization : `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const fetchIncome = async (token : string) => {
    try {
        const response =await axios.get(`${APP_API_URL}/get-income` , {
            headers : {
                Authorization : `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });
        return response.data.incomes ;
    } catch (error) {
        throw error ;
    }
}

const updateIncome = async (payload : ITransactionData ,id:string ,token:string ) => {
    try {
        await axios.post(`${APP_API_URL}/update-income/${id}` , payload , {
            headers : {
                Authorization : `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })
    } catch (error) {
        throw error ;
    }
}

const deleteIncome = async (id:string ,token: string ) => {
    try {
        await axios.delete(`${APP_API_URL}/delete-income/${id}` , {
            headers : {
                Authorization : `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })
        
    } catch (error) {
        throw error ;
    }
}

export { addIncome , fetchIncome , deleteIncome , updateIncome } ;