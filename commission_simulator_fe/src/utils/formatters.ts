/**
 * Formatea un número como moneda (USD)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formatea una fecha de timestamp a formato legible
 */
export const formatTimestamp = (timestamp: number): string => {
  // Convertir de segundos a milisegundos multiplicando por 1000
  return new Date(timestamp * 1000).toLocaleString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * Formatea un porcentaje
 */
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

/**
 * Trunca una dirección de wallet para mostrar
 */
export const truncateAddress = (address: string, chars = 6): string => {
  if (!address) return "";
  return `${address.substring(0, chars)}...${address.substring(
    address.length - chars
  )}`;
};
