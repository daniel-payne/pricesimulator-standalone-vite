import transactionDepositFunds from "@/data/indexDB/controllers/transactionsDepositFunds"
import useTransactions from "@/data/indexDB/hooks/useTransactions"

import type { Transaction } from "@/data/indexDB/types/Transaction"

import TransactionDetails from "@/display/components/TransactionDetails"

import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TransactionsDataPage({ name = "TransactionsDataPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJSON, setShowJSON] = useState(false)

  const transactions = useTransactions()

  return (
    <div {...rest} data-component={name}>
      <div className="p-2">
        <div className="flex flex-row gap-2 items-center p-2">
          <Link to="/">
            <img src="/pricesimulator-32.png" alt="Home Page" style={{ height: 32, width: 32 }} />
          </Link>
          <h1 className="text-xl text-secondary">Transactions Data</h1>
          <button className={`btn btn-sm btn-primary ${showJSON ? "" : "btn-outline"}`} onClick={() => setShowJSON(!showJSON)}>
            json
          </button>
        </div>

        <div className="divider">Actions</div>
        <div className="flex flex-row gap-2 items-center flex-wrap p-2">
          <button className="btn btn-sm btn-success" onClick={() => transactionDepositFunds(1000)}>
            Deposit $1,000 Funds
          </button>
        </div>

        <div className="divider">Components</div>
        <div className="flex flex-row items-center flex-wrap">
          {transactions?.map((transaction: Transaction) => (
            <div className="w-1/6 p-2">
              <TransactionDetails transaction={transaction} key={transaction.id} />
            </div>
          ))}
        </div>

        {showJSON && (
          <div>
            <div className="divider">JSON</div>
            <pre className="flex flex-row gap-2 items-center flex-wrap p-2">{JSON.stringify(transactions, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
