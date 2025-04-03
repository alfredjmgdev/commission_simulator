import React from "react";
import { useInvestment } from "../../context/InvestmentContext";
import Button from "../common/Button";
import { formatCurrency, truncateAddress } from "../../utils/formatters";

const PaymentQR: React.FC = () => {
  const { paymentData, checkPayment, loading, paymentQRRef } = useInvestment();

  if (!paymentData) return null;

  return (
    <div ref={paymentQRRef} className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Pago con Criptomoneda
      </h2>

      <div className="flex flex-col items-center mb-6">
        <img
          src={paymentData.qrCodeData}
          alt="QR Code for payment"
          className="w-64 h-64 mb-4"
        />
        <p className="text-sm text-gray-600 mb-2">
          Escanea este código QR para realizar el pago
        </p>
        <p className="text-sm font-medium text-gray-800 mb-1">
          Red: {paymentData.network}
        </p>
        <p className="text-sm font-medium text-gray-800 mb-1">
          Monto: {formatCurrency(paymentData.amount)}
        </p>
        <p className="text-sm text-gray-600 break-all mt-2">
          Dirección: {truncateAddress(paymentData.paymentAddress, 10)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          (Haz clic para ver la dirección completa)
        </p>
      </div>

      <Button
        onClick={checkPayment}
        disabled={loading}
        className="w-full bg-amber-400 hover:bg-amber-500"
      >
        {loading ? "Verificando..." : "Revisar Pago"}
      </Button>
    </div>
  );
};

export default PaymentQR;
