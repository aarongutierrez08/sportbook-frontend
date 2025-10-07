import { formatAmountIntl } from "../../utils/formatAmount"

export const AmountText = ({ number }: { number: number }) => {
  const formattedNumber = formatAmountIntl(number)
  return <>{formattedNumber}</>
}