import useBalance from "@/data/indexDB/hooks/useBalance"

// import formatTimestamp from "@/utilities/formatTimestamp"
// import formatTimestampDay from "@/utilities/formatTimestampDay"

import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function BalancePage({ name = "StatusesBalancePagePage", ...rest }: PropsWithChildren<ComponentProps>) {
  const balance = useBalance()

  return (
    <div {...rest} data-component={name}>
      <div className="m-4 flex flex-row flex-wrap gap-2 items-center">
        <Link to="/" className="btn btn-primary btn-sm mx-2">
          Home
        </Link>
        <div className="text-secondary text-2xl font-bold">Balance</div>
      </div>
      <div className="m-4 flex flex-row flex-wrap gap-0">
        <div className="w-full h-full border border-primary rounded-xl p-2 overflow-hidden">
          <pre>{JSON.stringify(balance, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
