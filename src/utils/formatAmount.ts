export function formatAmountIntl(
  number?: number,
  withSymbol?: false, // Nuevo parámetro (true por defecto)
  locale: string = "es-AR"
): string {
  if (!number && number !== 0) return "";
  if (!Number.isFinite(number)) return "";

  // Determinar cantidad de decimales
  const decimalOptions = Number.isInteger(number)
    ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    : { minimumFractionDigits: 2, maximumFractionDigits: 2 };

  // Configurar opciones base
  const options: Intl.NumberFormatOptions = {
    ...decimalOptions,
    // Si queremos símbolo usamos 'currency', sino 'decimal'
    style: withSymbol ? "currency" : "decimal",
  };

  // Solo agregamos configuración de moneda si el estilo es currency
  if (withSymbol) {
    options.currency = "ARS";
    options.currencyDisplay = "narrowSymbol";
  }

  const fmt = new Intl.NumberFormat(locale, options);

  return fmt.format(number);
}
