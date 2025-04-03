import React from "react";
import { useInvestment } from "../../context/InvestmentContext";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatters";

const ResultsTable: React.FC = () => {
  const { result, exportResults, deposit, loading, reset, resultsRef } =
    useInvestment();

  if (!result) return null;

  return (
    <div ref={resultsRef} className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Resultados de la Simulación
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interés Mensual
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interés Acumulado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {result.monthlyBreakdown.map((item) => (
              <tr key={item.month}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.month}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(item.balance)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(item.interest)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(item.cumulativeInterest)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-md">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-sm font-medium text-gray-500">Monto Final:</div>
          <div className="text-sm text-gray-900">
            {formatCurrency(result.finalAmount)}
          </div>

          <div className="text-sm font-medium text-gray-500">
            Interés Total:
          </div>
          <div className="text-sm text-gray-900">
            {formatCurrency(result.totalInterest)}
          </div>

          <div className="text-sm font-medium text-gray-500">Fee:</div>
          <div className="text-sm text-gray-900">
            {formatCurrency(result.fee)}
          </div>

          <div className="text-sm font-medium text-gray-500">Monto Neto:</div>
          <div className="text-sm font-bold text-gray-900">
            {formatCurrency(result.netAmount)}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Button
          onClick={exportResults}
          disabled={loading}
          variant="secondary"
          className="flex-1"
        >
          Exportar CSV
        </Button>
        <Button
          onClick={deposit}
          disabled={loading}
          variant="success"
          className="flex-1"
        >
          DEPOSITAR AHORA
        </Button>
        <Button onClick={reset} variant="danger" className="flex-1">
          RESET/NEW
        </Button>
      </div>
    </div>
  );
};

export default ResultsTable;
