import useTransactions from "@/data/indexDB/hooks/useTransactions"
import formatTimestamp from "@/utilities/formatTimestamp"
import formatValue from "@/utilities/formatValue"
import { useQueryState } from "@keldan-systems/state-mutex"

import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TransactionsPage({ name = "TransactionsPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJson, setShowJson] = useQueryState<boolean>("showJson", false)

  const transactions = useTransactions()

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <Link to="/" className="btn btn-primary btn-sm mx-2">
            Home
          </Link>
          <div className="text-secondary text-2xl font-bold">Transactions</div>
          <button className="btn btn-primary btn-ghost btn-sm" onClick={() => setShowJson(!showJson)}>
            json
          </button>
        </div>
        <div className="flex-auto flex flex-row flex-wrap gap-0">
          {transactions?.map((transaction) => {
            return (
              <div className="w-1/6 p-2" key={transaction.id}>
                <div className="w-full h-full border border-primary rounded-xl p-2 overflow-hidden">
                  <div className="text-primary text-xl font-bold">{transaction.id}</div>
                  {showJson && <pre>{JSON.stringify(transaction, null, 2)}</pre>}
                  <div className="text-secondary font-bold">{formatTimestamp(transaction?.timestamp)}&nbsp;</div>
                  <div className="text-secondary font-bold">{formatValue(transaction?.value, true, "USD")}&nbsp;</div>
                  <div className="text-secondary">{transaction?.source}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
