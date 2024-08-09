import addTransaction from "@/data/indexDB/controllers/add/addTransaction"
import clearData from "@/data/indexDB/controllers/clear/clearData"
import clearUserData from "@/data/indexDB/controllers/clear/clearUserData"
import loadData from "@/data/indexDB/controllers/load/loadData"
import openContract from "@/data/indexDB/controllers/open/openContract"
import timerNextDay from "@/data/indexDB/controllers/timer/timerNextDay"
import timerReset from "@/data/indexDB/controllers/timer/timerReset"
import timerStart from "@/data/indexDB/controllers/timer/timerStart"
import timerStop from "@/data/indexDB/controllers/timer/timerStop"
import { ScenarioSpeed } from "@/data/indexDB/enums/ScenarioSpeed"
import formatValue from "@/utilities/formatValue"
import { FormEvent, useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Link } from "react-router-dom"

const DEPOSIT = 5000
const SYMBOL = "LH.F"
const DIRECTION = "CALL"
const SIZE = 1

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ActionsPage({ name = "ActionsPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [deposit, setDeposit] = useState<number | undefined>(undefined)
  const [symbol, setSymbol] = useState<string | undefined>(undefined)
  const [direction, setDirection] = useState<string | undefined>(undefined)
  const [size, setSize] = useState<0.25 | 0.5 | 1 | 2 | undefined>(undefined)

  const handleUpdateDeposit = (e: FormEvent<HTMLInputElement>) => {
    setDeposit(+e.currentTarget.value)
  }

  const handleUpdateSymbol = (e: FormEvent<HTMLInputElement>) => {
    setSymbol(e.currentTarget.value)
  }

  const handleUpdateDirection = (e: FormEvent<HTMLInputElement>) => {
    setDirection(e.currentTarget.value as any)
  }

  const handleUpdateSize = (e: FormEvent<HTMLInputElement>) => {
    setSize(+e.currentTarget.value as any)
  }

  const handleAddTransaction = () => {
    addTransaction(deposit ?? DEPOSIT)
  }

  const handleOpenContract = () => {
    openContract(symbol ?? SYMBOL, (direction as any) ?? DIRECTION, size ?? SIZE)
  }

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <Link to="/" className="btn btn-primary btn-sm mx-2">
            Home
          </Link>
          <div className="text-secondary text-2xl font-bold">Actions</div>
        </div>

        <div className="m-4 flex flex-col">
          <div className="m-4 flex flex-row flex-wrap gap-4">
            <button className="btn btn-success" onClick={loadData}>
              Load Server Data
            </button>
            <button className="btn btn-error" onClick={clearData}>
              Clear All Data
            </button>
            <button className="btn btn-warning" onClick={clearUserData}>
              Clear User Data
            </button>
          </div>
          <div className="m-4 flex flex-row flex-wrap gap-4 items-center">
            <button className="btn btn-primary" onClick={() => timerNextDay(true)}>
              Next Day
            </button>

            <button className="btn btn-warning" onClick={() => timerStart(ScenarioSpeed.slow)}>
              Slow
            </button>
            <button className="btn btn-warning" onClick={() => timerStart(ScenarioSpeed.medium)}>
              Medium
            </button>
            <button className="btn btn-warning" onClick={() => timerStart(ScenarioSpeed.fast)}>
              Fast
            </button>

            <button className="btn btn-error" onClick={timerStop}>
              Stop
            </button>

            <button className="btn btn-sm btn-secondary" onClick={() => timerReset("1979-01-08")}>
              Reset 1970
            </button>
            <button className="btn btn-sm btn-secondary" onClick={() => timerReset("2000-01-09")}>
              Reset 2000
            </button>
            <button className="btn btn-sm btn-secondary" onClick={() => timerReset("2020-01-05")}>
              Reset 2020
            </button>
          </div>

          <div className="m-4 flex flex-row flex-wrap gap-4 items-center">
            <label className="input input-bordered flex items-center gap-2 w-48">
              Amount
              <input type="text" className="grow" placeholder={formatValue(DEPOSIT)} value={deposit} onChange={handleUpdateDeposit} />
            </label>
          </div>
          <div className="m-4 flex flex-row flex-wrap gap-4 items-center">
            <button className="btn btn-success" onClick={handleAddTransaction}>
              Add Transaction
            </button>
          </div>

          <div className="m-4 flex flex-row flex-wrap gap-4 items-center">
            <label className="input input-bordered flex items-center gap-2 w-48">
              Symbol
              <input type="text" className="grow" placeholder={SYMBOL} value={symbol} onChange={handleUpdateSymbol} />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-48">
              Direction
              <input type="text" className="grow" placeholder={DIRECTION} value={direction} onChange={handleUpdateDirection} />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-48">
              Size
              <input type="text" className="grow" placeholder={SIZE.toString()} value={size} onChange={handleUpdateSize} />
            </label>
          </div>
          <div className="m-4 flex flex-row flex-wrap gap-4 items-center">
            <button className="btn btn-success btn-outline" onClick={handleOpenContract}>
              Open Contract
            </button>
          </div>

          <div className="m-4 flex flex-row flex-wrap gap-4 items-center">
            <label className="input input-bordered flex items-center gap-2 w-48">
              Symbol
              <input type="text" className="grow" placeholder={SYMBOL} value={symbol} onChange={handleUpdateSymbol} />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-48">
              Notional
              <input type="text" className="grow" placeholder="$1000" />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-48">
              Take
              <input type="text" className="grow" placeholder="$50" />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-48">
              Stop
              <input type="text" className="grow" placeholder="$100" />
            </label>
          </div>

          <div className="m-4 flex flex-row flex-wrap gap-4 items-center">
            <button className="btn btn-success btn-outline">Open Trade</button>
          </div>
          <div className="m-4 flex flex-row flex-wrap gap-4 items-center">
            <label className="input input-bordered flex items-center gap-2 w-48">
              Symbol
              <input type="text" className="grow" placeholder={SYMBOL} value={symbol} onChange={handleUpdateSymbol} />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-48">
              Notional
              <input type="text" className="grow" placeholder="$1000" />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-48">
              Take
              <input type="text" className="grow" placeholder="$50" />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-48">
              Stop
              <input type="text" className="grow" placeholder="$100" />
            </label>
            <input type="checkbox" className="checkbox" />
            <label className="input input-bordered flex items-center gap-2 w-48">
              Option
              <input type="text" className="grow" placeholder="25 +/- pt" />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-48">
              Expiry
              <input type="text" className="grow" placeholder="AME" />
            </label>
          </div>

          <div className="m-4 flex flex-row flex-wrap gap-4 items-center">
            <button className="btn btn-success btn-outline">Trade Quote</button>
          </div>

          <div className="m-4 flex flex-row flex-wrap gap-4 items-center">
            <label className="input input-bordered flex items-center gap-2 w-48">
              Symbol
              <input type="text" className="grow" placeholder={SYMBOL} value={symbol} onChange={handleUpdateSymbol} />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-48">
              Notional
              <input type="text" className="grow" placeholder="$1000" />
            </label>
            <label className="input  flex items-center gap-2 w-auto">
              Vanilla
              <input type="radio" name="radio-1" className="radio" defaultChecked />
            </label>
            <label className="input  flex items-center gap-2 w-auto">
              Risk Reversal
              <input type="radio" name="radio-1" className="radio" defaultChecked />
            </label>
            <label className="input  flex items-center gap-2 w-auto">
              Butterfly
              <input type="radio" name="radio-1" className="radio" defaultChecked />
            </label>
            <label className="input  flex items-center gap-2 w-auto">
              Condor
              <input type="radio" name="radio-1" className="radio" defaultChecked />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-48">
              1
              <input type="text" className="grow" placeholder="25 +/- pt" />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-48">
              2
              <input type="text" className="grow" placeholder="5 +/- pt" />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-48">
              3
              <input type="text" className="grow" placeholder="5 +/- pt" />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-48">
              4
              <input type="text" className="grow" placeholder="25 +/- pt" />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-48">
              Expiry
              <input type="text" className="grow" placeholder="AME" />
            </label>
          </div>

          <div className="m-4 flex flex-row flex-wrap gap-4 items-center">
            <button className="btn btn-success btn-outline">Option Quote</button>
          </div>

          <div className="m-4 flex flex-row flex-wrap gap-4">
            <label className="input input-bordered flex items-center gap-2 w-48">
              ID
              <input type="text" className="grow" placeholder="..." />
            </label>
          </div>

          <div className="m-4 flex flex-row flex-wrap gap-4 items-center">
            <button className="btn btn-warning btn-outline">Accept Quote</button>
          </div>
          <div className="m-4 flex flex-row flex-wrap gap-4">
            <label className="input input-bordered flex items-center gap-2 w-48">
              REF
              <input type="text" className="grow" placeholder="..." />
            </label>
          </div>

          <div className="m-4 flex flex-row flex-wrap gap-4 items-center">
            <button className="btn btn-warning btn-outline">Close Trade</button>
          </div>
        </div>
      </div>
    </div>
  )
}
