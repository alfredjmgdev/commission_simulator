import React, { useState } from "react";
import { useInvestment } from "../../context/InvestmentContext";
import Modal from "../common/Modal";
import {
  formatCurrency,
  formatTimestamp,
  truncateAddress,
} from "../../utils/formatters";

const PaymentStatus: React.FC = () => {
  const { paymentStatus, paymentStatusRef } = useInvestment();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!paymentStatus) return null;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const isPaymentReceived = paymentStatus.data.amountCaptured > 0;

  return (
    <>
      <div
        ref={paymentStatusRef}
        className="bg-white p-6 rounded-lg shadow-md mt-6"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Estado del Pago
        </h2>

        <div
          className={`p-4 rounded-md mb-6 ${
            isPaymentReceived ? "bg-green-100" : "bg-yellow-100"
          }`}
        >
          <p
            className={`font-medium ${
              isPaymentReceived ? "text-green-800" : "text-yellow-800"
            }`}
          >
            {isPaymentReceived
              ? "¡Pago recibido correctamente!"
              : "Esperando confirmación del pago..."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-sm font-medium text-gray-500">Estado:</div>
          <div className="text-sm text-gray-900">
            {paymentStatus.data.status}
          </div>

          <div className="text-sm font-medium text-gray-500">Dirección:</div>
          <div className="text-sm text-gray-900">
            {truncateAddress(paymentStatus.data.address)}
          </div>

          <div className="text-sm font-medium text-gray-500">
            Monto Capturado:
          </div>
          <div className="text-sm text-gray-900">
            {formatCurrency(paymentStatus.data.amountCaptured)}
          </div>

          <div className="text-sm font-medium text-gray-500">
            Monto Objetivo:
          </div>
          <div className="text-sm text-gray-900">
            {formatCurrency(paymentStatus.data.fundsGoal)}
          </div>
        </div>

        <button
          onClick={handleOpenModal}
          className="w-full py-2 px-4 bg-amber-400 text-white rounded-md hover:bg-amber-500 transition-colors cursor-pointer"
        >
          Ver Detalles Completos
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Detalles del Estado del Pago"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium text-gray-500">Dirección:</div>
            <div className="text-sm text-gray-900 break-all">
              {paymentStatus.data.address}
            </div>

            <div className="text-sm font-medium text-gray-500">Red:</div>
            <div className="text-sm text-gray-900">
              {paymentStatus.data.network}
            </div>

            <div className="text-sm font-medium text-gray-500">
              Monto Objetivo:
            </div>
            <div className="text-sm text-gray-900">
              {formatCurrency(paymentStatus.data.fundsGoal)}
            </div>

            <div className="text-sm font-medium text-gray-500">
              Monto Capturado:
            </div>
            <div className="text-sm text-gray-900">
              {formatCurrency(paymentStatus.data.amountCaptured)}
            </div>

            <div className="text-sm font-medium text-gray-500">Estado:</div>
            <div className="text-sm text-gray-900">
              {paymentStatus.data.status}
            </div>

            <div className="text-sm font-medium text-gray-500">
              Estado de Fondos:
            </div>
            <div className="text-sm text-gray-900">
              {paymentStatus.data.fundStatus}
            </div>

            <div className="text-sm font-medium text-gray-500">
              Paso del Proceso:
            </div>
            <div className="text-sm text-gray-900">
              {paymentStatus.data.processStep} de{" "}
              {paymentStatus.data.processTotalSteps}
            </div>

            <div className="text-sm font-medium text-gray-500">
              Balance Actual:
            </div>
            <div className="text-sm text-gray-900">
              {formatCurrency(paymentStatus.data.currentBalance)}
            </div>

            <div className="text-sm font-medium text-gray-500">Símbolo:</div>
            <div className="text-sm text-gray-900">
              {paymentStatus.data.smartContractSymbol}
            </div>

            <div className="text-sm font-medium text-gray-500">Expiración:</div>
            <div className="text-sm text-gray-900">
              {formatTimestamp(paymentStatus.data.fundsExpirationAt)}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PaymentStatus;
