import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  MutableRefObject,
} from "react";
import {
  InvestmentFormData,
  InvestmentResult,
  PaymentData,
  PaymentStatus,
} from "../interfaces/investment";
import {
  calculateInvestment,
  exportToCsv,
  generatePayment,
  checkPaymentStatus,
} from "../services/investmentService";
import axios from "axios";
import { useScrollToElement } from "../hooks/useScrollToElement";

interface InvestmentContextType {
  formData: InvestmentFormData;
  result: InvestmentResult | null;
  paymentData: PaymentData | null;
  paymentStatus: PaymentStatus | null;
  loading: boolean;
  error: string | null;
  updateFormData: (data: Partial<InvestmentFormData>) => void;
  simulate: () => Promise<void>;
  exportResults: () => Promise<void>;
  deposit: () => Promise<void>;
  checkPayment: () => Promise<void>;
  reset: () => void;
  resultsRef: MutableRefObject<HTMLDivElement | null>;
  paymentQRRef: MutableRefObject<HTMLDivElement | null>;
  paymentStatusRef: MutableRefObject<HTMLDivElement | null>;
}

const defaultFormData: InvestmentFormData = {
  initialAmount: 100,
  period: 3,
  interestType: "simple",
};

const InvestmentContext = createContext<InvestmentContextType | undefined>(
  undefined
);

// Función auxiliar para extraer mensajes de error
const extractErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error) && error.response) {
    // Si es un error de Axios con respuesta del servidor
    const responseData = error.response.data;

    // Verificar si la respuesta tiene la estructura esperada
    if (responseData && typeof responseData.message === "string") {
      return responseData.message;
    }
  }

  // Si es un error de JavaScript estándar
  if (error instanceof Error) {
    return error.message;
  }

  // Si no podemos determinar el tipo de error, devolvemos un mensaje genérico
  return "Ha ocurrido un error inesperado";
};

// Export the hook directly instead of defining it separately
export const useInvestment = () => {
  const context = useContext(InvestmentContext);
  if (context === undefined) {
    throw new Error("useInvestment must be used within an InvestmentProvider");
  }
  return context;
};

export const InvestmentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<InvestmentFormData>(defaultFormData);
  const [result, setResult] = useState<InvestmentResult | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Referencias para los componentes a los que haremos scroll
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const paymentQRRef = useRef<HTMLDivElement | null>(null);
  const paymentStatusRef = useRef<HTMLDivElement | null>(null);

  // Hook para hacer scroll
  const scrollToElement = useScrollToElement();

  const updateFormData = (data: Partial<InvestmentFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const simulate = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await calculateInvestment(formData);
      setResult(result);

      // Scroll a los resultados después de simular exitosamente
      setTimeout(() => {
        scrollToElement(resultsRef.current);
      }, 100);
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const blob = await exportToCsv(formData);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `investment-simulation-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deposit = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!result) {
        throw new Error("No hay resultados para depositar");
      }
      const paymentData = await generatePayment(formData.initialAmount);
      setPaymentData(paymentData);

      // Scroll al QR de pago después de depositar exitosamente
      setTimeout(() => {
        scrollToElement(paymentQRRef.current);
      }, 100);
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!paymentData) {
        throw new Error("No hay datos de pago para verificar");
      }
      const status = await checkPaymentStatus(paymentData.paymentAddress);
      setPaymentStatus(status);

      // Scroll al estado del pago después de verificar exitosamente
      setTimeout(() => {
        scrollToElement(paymentStatusRef.current);
      }, 100);
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFormData(defaultFormData);
    setResult(null);
    setPaymentData(null);
    setPaymentStatus(null);
    setError(null);
  };

  return (
    <InvestmentContext.Provider
      value={{
        formData,
        result,
        paymentData,
        paymentStatus,
        loading,
        error,
        updateFormData,
        simulate,
        exportResults,
        deposit,
        checkPayment,
        reset,
        resultsRef,
        paymentQRRef,
        paymentStatusRef,
      }}
    >
      {children}
    </InvestmentContext.Provider>
  );
};
