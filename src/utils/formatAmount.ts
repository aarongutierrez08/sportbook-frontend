export function formatAmountIntl(
  number?: number,
  locale: string = navigator?.language || "es-AR"
): string {
  if (!number && number !== 0) return "";
  if (!Number.isFinite(number)) return "";

  const decimalOptions = Number.isInteger(number)
    ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    : { minimumFractionDigits: 2, maximumFractionDigits: 2 };

  const fmt = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "ARS",
    currencyDisplay: "narrowSymbol",
    ...decimalOptions,
  });

  return fmt.format(number);
}
