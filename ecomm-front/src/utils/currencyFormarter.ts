export const currencyFormatter = (value: number | string, decimals = 0) => {
  const number = Number(value);
  if (isNaN(number)) return value;
  return number.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
