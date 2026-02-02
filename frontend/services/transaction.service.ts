import { APP_API_URL } from "@/utils/constants";
import axios from "axios";

const getAllTransactions = async (token: string) => {
    try {
        const response = await axios.get(`${APP_API_URL}/get-transaction`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        return response.data.transactions;
    } catch (error) {
        console.log(error);
    }
}

export { getAllTransactions };