import { Price } from "@/data/indexDB/types/Price"
import formatNumber from "@/utilities/formatNumber"
import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  market: Market
  price?: Price | null | undefined
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function CurrentOpenDisplay({ market, price, name = "CurrentOpenDisplay", ...rest }: PropsWithChildren<ComponentProps>) {
  const displayValue = price?.isMarketClosed ? price?.priorClose : price?.currentOpen

  if (displayValue == null) {
    return null
  }

  const priceDecimals = market.priceDecimals ?? 2

  const overnightMovement = (price?.currentOpen ?? 0) - (price?.priorClose ?? 0)

  let displayClasses

  if (price?.isMarketClosed) {
    displayClasses = "fg-price-info--closed"
  } else {
    if (overnightMovement > 0) {
      displayClasses = "fg-price-info--profit"
    } else if (overnightMovement < 0) {
      displayClasses = "fg-price-info--loss"
    } else {
      displayClasses = "fg-price-info--no-movement"
    }
  }

  return (
    <div {...rest} data-component={name}>
      <Link to={`/data/prices/${price?.symbol}`} target="_blank">
        <div className={displayClasses}>{formatNumber(displayValue, priceDecimals)}</div>
      </Link>
    </div>
  )
}
