import axios from "axios";
import { API_URL } from "../config";
import {
  InvestmentFormData,
  InvestmentResult,
  PaymentData,
  PaymentStatus,
} from "../interfaces/investment";

const api = axios.create({
  baseURL: `${API_URL}/api/investment`,
});

export const calculateInvestment = async (
  data: InvestmentFormData
): Promise<InvestmentResult> => {
  const response = await api.post("/calculate", data);
  return response.data;
};

export const exportToCsv = async (data: InvestmentFormData): Promise<Blob> => {
  const response = await api.get("/export-csv", {
    params: data,
    responseType: "blob",
  });
  return response.data;
};

export const generatePayment = async (amount: number): Promise<PaymentData> => {
  const response = await api.post("/generate-payment", { amount });
  return response.data;
};

export const checkPaymentStatus = async (
  address: string
): Promise<PaymentStatus> => {
  const response = await api.get(`/check-payment-status/${address}`);
  return response.data;
};
