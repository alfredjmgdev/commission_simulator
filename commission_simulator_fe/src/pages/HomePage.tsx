import React from "react";
import {
  InvestmentProvider,
  useInvestment,
} from "../context/InvestmentContext";
import InvestmentForm from "../components/investment/InvestmentForm";
import ResultsTable from "../components/investment/ResultsTable";
import PaymentQR from "../components/investment/PaymentQR";
import PaymentStatus from "../components/investment/PaymentStatus";
import ErrorAlert from "../components/common/ErrorAlert";

// Componente interno que usa el contexto
const InvestmentContent: React.FC = () => {
  const { error, result, paymentData, paymentStatus } = useInvestment();
  const [localError, setLocalError] = React.useState<string | null>(null);

  // Sincronizamos el error del contexto con nuestro estado local
  React.useEffect(() => {
    setLocalError(error);
  }, [error]);

  const handleCloseError = () => {
    // Solo limpiamos el error local
    setLocalError(null);
  };

  // Determinar dónde mostrar el error basado en el estado actual
  const getErrorPosition = () => {
    if (!result) return "before-form"; // Si no hay resultados, mostrar antes del formulario
    if (!paymentData) return "after-results"; // Si hay resultados pero no datos de pago
    if (!paymentStatus) return "after-payment-qr"; // Si hay datos de pago pero no estado
    return "after-payment-status"; // Si todo está presente
  };

  const errorPosition = getErrorPosition();

  return (
    <div className="max-w-4xl mx-auto">
      {localError && errorPosition === "before-form" && (
        <ErrorAlert message={localError} onClose={handleCloseError} />
      )}

      <InvestmentForm />

      {localError && errorPosition === "after-results" && (
        <ErrorAlert message={localError} onClose={handleCloseError} />
      )}

      <ResultsTable />

      {localError && errorPosition === "after-payment-qr" && (
        <ErrorAlert message={localError} onClose={handleCloseError} />
      )}

      <PaymentQR />

      {localError && errorPosition === "after-payment-status" && (
        <ErrorAlert message={localError} onClose={handleCloseError} />
      )}

      <PaymentStatus />
    </div>
  );
};

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary-light">
        Simulador de Inversiones
      </h1>

      <InvestmentProvider>
        <InvestmentContent />
      </InvestmentProvider>
    </div>
  );
};

export default HomePage;
