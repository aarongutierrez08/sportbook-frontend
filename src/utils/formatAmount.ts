export function formatAmountIntl(
  number?: number,
  withSymbol?: false,
  locale: string = "es-AR"
): string {
  if (!number && number !== 0) return "";
  if (!Number.isFinite(number)) return "";

  const decimalOptions = Number.isInteger(number)
    ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    : { minimumFractionDigits: 2, maximumFractionDigits: 2 };

  const options: Intl.NumberFormatOptions = {
    ...decimalOptions,
    style: withSymbol ? "currency" : "decimal",
  };

  if (withSymbol) {
    options.currency = "ARS";
    options.currencyDisplay = "narrowSymbol";
  }

  const fmt = new Intl.NumberFormat(locale, options);

  return fmt.format(number);
}
