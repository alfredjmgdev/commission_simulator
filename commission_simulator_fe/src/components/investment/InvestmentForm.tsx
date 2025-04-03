import React from "react";
import { useInvestment } from "../../context/InvestmentContext";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";

const InvestmentForm: React.FC = () => {
  const { formData, updateFormData, simulate, loading } = useInvestment();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "initialAmount") {
      updateFormData({ [name]: parseFloat(value) || 0 });
    } else if (name === "period") {
      updateFormData({ [name]: parseInt(value) as 3 | 6 | 9 | 12 });
    } else if (name === "interestType") {
      updateFormData({ [name]: value as "simple" | "compound" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    simulate();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Simulador de Comisiones
      </h2>
      <form onSubmit={handleSubmit}>
        <Input
          id="initialAmount"
          name="initialAmount"
          type="number"
          value={formData.initialAmount}
          onChange={handleChange}
          label="Capital Semilla"
          placeholder="Ingrese el monto inicial"
          min={1}
          step={1}
          required
        />

        <Select
          id="period"
          name="period"
          value={formData.period}
          onChange={handleChange}
          label="Período de Inversión"
          options={[
            { value: 3, label: "3 meses (1% mensual)" },
            { value: 6, label: "6 meses (2% mensual)" },
            { value: 9, label: "9 meses (3% mensual)" },
            { value: 12, label: "12 meses (4% mensual)" },
          ]}
          required
        />

        <Select
          id="interestType"
          name="interestType"
          value={formData.interestType}
          onChange={handleChange}
          label="Tipo de Beneficio"
          options={[
            { value: "simple", label: "Beneficio Simple" },
            { value: "compound", label: "Beneficio Interés Compuesto" },
          ]}
          required
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-amber-400 text-white hover:bg-amber-500"
        >
          {loading ? "Calculando..." : "SIMULAR"}
        </Button>
      </form>
    </div>
  );
};

export default InvestmentForm;
