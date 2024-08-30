import discoverOptionPrice from "@/data/indexDB/controllers/discoverOptionPrice"
import generateAnalysis from "@/data/indexDB/controllers/generateAnalysis"
import { OptionDirection } from "@/data/indexDB/enums/OptionDirection"
import { OptionExecution } from "@/data/indexDB/enums/OptionExecution"

import { TradeDirection } from "@/data/indexDB/enums/TradeDirection"
import useActiveMarkets from "@/data/indexDB/hooks/useActiveMarkets"
import useTimer from "@/data/indexDB/hooks/useTimer"
import { Analysis } from "@/data/indexDB/types/Analysis"

import { Market } from "@/data/indexDB/types/Market"
import formatIndexAsDate from "@/utilities/formatIndexAsDate"
import formatIndexAsDay from "@/utilities/formatIndexAsDay"
import formatNumber from "@/utilities/formatNumber"
import formatValue from "@/utilities/formatValue"

import { ChangeEvent, useEffect, useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function BalancePage({ name = "StatusesBalancePagePage", ...rest }: PropsWithChildren<ComponentProps>) {
  const activeMarkets = useActiveMarkets()
  const timer = useTimer()

  const [selectedSymbol, setSelectedSymbol] = useState<string | undefined>(undefined)
  const [notional, setNotional] = useState<number>(1000000)
  const [showDelta, setShowDelta] = useState<boolean>(false)

  const [analysis, setAnalysis] = useState<Analysis | undefined>(undefined)

  const handleToggleDelta = () => {
    setShowDelta(!showDelta)
  }

  const handleChangeNotional = (e: ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value
    setNotional(value)
  }

  const handleTChangeSelectedMarket = (market: Market | undefined) => {
    setSelectedSymbol(market?.symbol)
  }

  const handleOnClickCost = async (data: any) => {
    const { cost, direction, contractDelta } = data

    //alert(JSON.stringify({ item, cost, direction, contractDelta, notional, selectedSymbol }, null, 2))

    if (selectedSymbol) {
      const price = await discoverOptionPrice(selectedSymbol, "USD", notional, direction, OptionExecution.European, contractDelta, 30)

      alert([price, cost])
    }
  }

  useEffect(() => {
    let symbol

    if (selectedSymbol == null) {
      symbol = activeMarkets?.[0]?.symbol

      setSelectedSymbol(symbol)
    } else {
      symbol = selectedSymbol
    }

    async function run(symbol: string, notional: number) {
      const analysis = await generateAnalysis(symbol, notional)

      setAnalysis(analysis)
    }

    if (symbol) {
      run(symbol, notional)
    }
  }, [activeMarkets, selectedSymbol, notional])

  return (
    <div {...rest} data-component={name}>
      <div className="m-4 flex flex-row flex-wrap gap-2 items-center justify-between">
        <div className=" flex flex-row flex-wrap gap-2 items-center">
          <Link to="/" className="btn btn-primary btn-sm mx-2">
            Home
          </Link>
          <div className="text-secondary text-2xl font-bold">Analysis</div>
        </div>
        <div className="text-secondary  ms-6">
          <strong>{formatIndexAsDay(timer?.currentIndex)}</strong> {formatIndexAsDate(timer?.currentIndex)}
        </div>
      </div>
      <div className="divider" />
      <div className="flex flex-row gap-2 p-2 items-center">
        <ActiveMarketsSelector selectedSymbol={selectedSymbol} activeMarkets={activeMarkets} onChange={handleTChangeSelectedMarket} />
        <div>
          <label className="w-64 input input-bordered border-primary flex items-center gap-2">
            Notional
            <input type="text" className="grow" value={notional} onChange={handleChangeNotional} />
          </label>
        </div>
        {/* <div className="border border-secondary rounded-lg py-2 px-4">Buy at {currentAsk}</div>
        <div className="border border-secondary rounded-lg py-2 px-4">Sell at {currentBid}</div> */}
        <button className={` btn btn-primary btn-sm ${showDelta ? "" : "btn-outline"}`} onClick={handleToggleDelta}>
          Show Delta
        </button>
      </div>
      {/* <div className="divider" />
      <div className="flex flex-col gap-2 p-2">
        <ActionRow1 />
      </div>
      <div className="divider" />
      <div className="flex flex-col gap-2 p-2">
        <ActionRow2 />
        <ActionRow3 />
      </div> */}
      <div className="divider" />
      <div className="flex flex-row gap-2 p-2 overflow-auto">
        {/* <ActionColumn /> */}

        <TradeBlock source={analysis?.makeCall} showDelta={showDelta} />
        <TradeBlock source={analysis?.makePut} showDelta={showDelta} />

        <OptionBlock source={analysis?.buyCall} showDelta={showDelta} onClick={handleOnClickCost} />
        <OptionBlock source={analysis?.sellCall} showDelta={showDelta} onClick={handleOnClickCost} />
        <OptionBlock source={analysis?.buyPut} showDelta={showDelta} onClick={handleOnClickCost} />
        <OptionBlock source={analysis?.sellPut} showDelta={showDelta} onClick={handleOnClickCost} />
      </div>
      <div className="flex-auto overflow-auto">{/* <pre>{JSON.stringify(analysis?.buyCall.contracts[3], null, 2)}</pre> */}</div>
      {/* <div className="flex flex-row gap-2 p-2">
        <button className="btn btn-primary w-80 h-16 leading-6">Do Nothing</button>
        <button className="btn btn-primary w-80 h-16 leading-6">Buy Something, then sell it back</button>
        <button className="btn btn-primary w-80 h-16 leading-6">Sell Something, then buy it back</button>
        <button className="btn btn-primary w-80 h-16 leading-6">Pay Some Money to have the chance to buy below market price</button>
        <button className="btn btn-primary w-80 h-16 leading-6">Get Some Money, and have the risk you have to sell below market price</button>
        <button className="btn btn-primary w-80 h-16 leading-6">Sell a risk to offset the cost to have the chance to buy below market price</button>
        <button className="btn btn-primary w-80 h-16 leading-6">Sell a risk to offset the cost to have the chance to sell above market price</button>
      </div> */}
      {/* <div className="flex flex-row gap-2 p-2">
        <button className="btn btn-primary w-32 h-6 leading-6">Go Long</button>
        <button className="btn btn-primary w-32 h-6 leading-6">Go Short</button>
        <button className="btn btn-primary w-32 h-6 leading-6">Covered Call</button>
        <button className="btn btn-primary w-32 h-6 leading-6">Covered Short</button>
        <button className="btn btn-primary w-32 h-6 leading-6">Buy a call</button>
        <button className="btn btn-primary w-32 h-6 leading-6">Sell a call</button>
        <button className="btn btn-primary w-32 h-6 leading-6">Buy a Put</button>
        <button className="btn btn-primary w-32 h-6 leading-6">Sell a Put</button>
        <button className="btn btn-primary w-32 h-6 leading-6">Risk Reversal</button>
        <button className="btn btn-primary w-32 h-6 leading-6">Straddle</button>
        <button className="btn btn-primary w-32 h-6 leading-6">Strangle</button>
        <button className="btn btn-primary w-32 h-6 leading-6">Butterfly</button>
        <button className="btn btn-primary w-32 h-6 leading-6">Iron Condor</button>
        <button className="btn btn-primary w-32 h-6 leading-6" disabled>
          Long Call Butterfly
        </button>
      </div> */}
    </div>
  )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ActiveMarketsSelector = ({
  activeMarkets,
  selectedSymbol,
  onChange,
}: {
  activeMarkets: Array<Market> | undefined
  selectedSymbol?: string | undefined
  onChange: (market: Market | undefined) => void
}) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value

    const market = activeMarkets?.find((market) => market.name === name)

    onChange(market)
  }

  return (
    <>
      <select className="select select-bordered border-primary  w-full max-w-xs" defaultValue={selectedSymbol} onChange={handleChange}>
        {activeMarkets?.map((market) => {
          return <option key={market.symbol}>{market.name}</option>
        })}
      </select>
    </>
  )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MakeCallIcons = ({ priceToday = false }: { priceToday?: boolean }) => {
  return (
    <div className="flex flex-row items-center gap-2 p-2">
      <div className={`font-bold ${priceToday ? "text-primary" : ""}`}>$</div>
      <div className="text-xl font-extrabold">→</div>
      <div className=" font-bold">•</div>
      <div className="text-xl font-extrabold">→</div>
      <div className=" font-bold   ">▤</div>
    </div>
  )
}

const MakePutIcons = ({ priceToday = false }: { priceToday?: boolean }) => {
  return (
    <div className="flex flex-row items-center gap-2 p-2">
      <div className=" font-bold">▤</div>
      <div className="text-xl font-extrabold">→</div>
      <div className=" font-bold">•</div>
      <div className="text-xl font-extrabold   ">→</div>
      <div className={`font-bold ${priceToday ? "text-primary" : ""}`}>$</div>
    </div>
  )
}

const BuyCallIcons = () => {
  return (
    <div className="flex flex-row items-baseline gap-1 p-2">
      <div className=" font-bold">$</div>
      <div className="text-xl font-extrabold">→</div>
      <div className=" font-bold">•</div>
      <div className="text-xl font-extrabold opacity-30  ">↳</div>
      <div className=" font-bold  opacity-30  ">▤</div>
    </div>
  )
}

const SellCallIcons = () => {
  return (
    <div className="flex flex-row items-baseline gap-1 p-2">
      <div className=" font-bold  opacity-30 ">▤</div>
      <div className="text-xl font-extrabold opacity-30  ">↳</div>
      <div className=" font-bold">•</div>
      <div className="text-xl font-bold">→</div>
      <div className=" font-bold">$</div>
    </div>
  )
}

const BuyPutIcons = () => {
  return (
    <div className="flex flex-row items-baseline gap-1 p-2">
      <div className=" font-bold">$</div>
      <div className="text-xl font-extrabold">→</div>
      <div className=" font-bold">•</div>
      <div className="text-xl font-extrabold opacity-30  ">↱</div>
      <div className=" font-bold  opacity-30  ">▤</div>
    </div>
  )
}

const SellPutIcons = () => {
  return (
    <div className="flex flex-row items-baseline gap-1 p-2">
      <div className=" font-bold  opacity-30 ">▤</div>
      <div className="text-xl font-extrabold opacity-30  ">↱</div>
      <div className=" font-bold">•</div>
      <div className="text-xl font-bold">→</div>
      <div className=" font-bold">$</div>
    </div>
  )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ActionColumn = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-2">
      <div className="w-32 border-primary border-2 rounded-xl flex flex-col items-center gap-2 p-2">
        <div className="text-secondary font-extrabold">Make Call</div>
        <MakeCallIcons />
      </div>

      <div className="w-32 border-primary border-2 rounded-xl flex flex-col items-center gap-2 p-2">
        <div className="text-secondary font-extrabold">Make Put</div>
        <MakePutIcons />
      </div>

      <div className="w-32 border-primary border-2 rounded-xl flex flex-col items-center gap-2 p-2">
        <div className="text-secondary font-extrabold">Buy Call</div>
        <BuyCallIcons />
      </div>

      <div className="w-32 border-primary border-2 rounded-xl flex flex-col items-center gap-2 p-2">
        <div className="text-secondary font-extrabold">Sell Call</div>
        <SellCallIcons />
      </div>

      <div className="w-32 border-primary border-2 rounded-xl flex flex-col items-center gap-2 p-2">
        <div className="text-secondary font-extrabold">Buy Put</div>
        <BuyPutIcons />
      </div>

      <div className="w-32 border-primary border-2 rounded-xl flex flex-col items-center gap-2 p-2">
        <div className="text-secondary font-extrabold">Sell Put</div>
        <SellPutIcons />
      </div>
    </div>
  )
}

const ActionRow1 = () => {
  return (
    <div className="flex flex-row gap-2  items-center">
      <button className="btn btn-info h-24 w-40 flex flex-col rounded-tr-none">
        <div>Make Call</div> <MakeCallIcons />
      </button>
      <button className="btn btn-info btn-outline h-24 w-40 flex flex-col rounded-br-none">
        <div>Make Put</div> <MakePutIcons />
      </button>
      <button className="btn btn-info btn-outline h-24 w-40 flex flex-col rounded-tr-none">
        <div>Buy Call</div> <BuyCallIcons />
      </button>
      <button className="btn btn-info btn-outline h-24 w-40 flex flex-col rounded-br-none">
        <div>Sell Call</div> <SellCallIcons />
      </button>
      <button className="btn btn-info btn-outline h-24 w-40 flex flex-col rounded-br-none">
        <div>Buy Put</div> <BuyPutIcons />
      </button>
      <button className="btn btn-info btn-outline h-24 w-40 flex flex-col rounded-tr-none">
        <div>Sell Put</div> <SellPutIcons />
      </button>
    </div>
  )
}

const ActionRow2 = () => {
  return (
    <div className="flex flex-row gap-2  items-center">
      <button className="btn btn-primary btn-outline w-80 h-16 leading-6">Do Nothing</button>
      <button className="btn btn-primary w-80 h-16 leading-6">Buy Something, then sell it back</button>
      <button className="btn btn-primary btn-outline w-80 h-16 leading-6">Sell Something, then buy it back</button>
      <button className="btn btn-primary btn-outline w-80 h-16 leading-6">Pay Some Money to have the chance to buy below market price</button>
      <button className="btn btn-primary btn-outline w-80 h-16 leading-6">Get Some Money, and have the risk you have to sell below market price</button>
      <button className="btn btn-primary btn-outline w-80 h-16 leading-6">Sell a risk to offset the cost to have the chance to buy below market price</button>
      <button className="btn btn-primary btn-outline w-80 h-16 leading-6">Sell a risk to offset the cost to have the chance to sell above market price</button>
    </div>
  )
}

const ActionRow3 = () => {
  return (
    <div className="flex flex-row gap-2  items-center">
      <button className="btn btn-primary w-32 h-6 leading-6">Go Long</button>
      <button className="btn btn-primary btn-outline w-32 h-6 leading-6">Go Short</button>
      <button className="btn btn-primary btn-outline w-32 h-6 leading-6">Covered Call</button>
      <button className="btn btn-primary btn-outline w-32 h-6 leading-6">Covered Short</button>
      <button className="btn btn-primary btn-outline w-32 h-6 leading-6">Buy a call</button>
      <button className="btn btn-primary btn-outline w-32 h-6 leading-6">Sell a call</button>
      <button className="btn btn-primary btn-outline w-32 h-6 leading-6">Buy a Put</button>
      <button className="btn btn-primary btn-outline w-32 h-6 leading-6">Sell a Put</button>
      <button className="btn btn-primary btn-outline w-32 h-6 leading-6">Risk Reversal</button>
      <button className="btn btn-primary btn-outline w-32 h-6 leading-6">Straddle</button>
      <button className="btn btn-primary btn-outline w-32 h-6 leading-6">Strangle</button>
      <button className="btn btn-primary btn-outline w-32 h-6 leading-6">Butterfly</button>
      <button className="btn btn-primary btn-outline w-32 h-6 leading-6">Iron Condor</button>
      <button className="btn btn-primary btn-outline w-32 h-6 leading-6" disabled>
        Long Call Butterfly
      </button>
    </div>
  )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const TradeRow = ({ outcome, showDelta = false }: { outcome: any; showDelta?: boolean }) => {
  const displayRate = formatNumber(outcome.rate)

  const displayMinor = displayRate?.split("").reverse().join("").substring(0, 2).split("").reverse().join("")
  const displayMajor = displayRate?.split("").reverse().join("").substring(2).split("").reverse().join("")

  const tradeProfit = outcome.tradeProfit

  const displayProfit = formatValue(tradeProfit, false)

  let containerClassName = "h-6 w-full flex flex-row gap-1 justify-around"
  let profitClassName = "w-16 text-right"

  if (outcome.delta === 0) {
    containerClassName += " text-primary"
  }

  if (tradeProfit > 0) {
    profitClassName += " text-success"
  } else if (tradeProfit < 0) {
    profitClassName += " text-error"
  } else {
    profitClassName += " text-secondary"
  }

  return (
    <div className={containerClassName}>
      {showDelta && (
        <div className="w-16 text-right">
          <span>{outcome.delta}</span>
        </div>
      )}
      {!showDelta && (
        <div className="w-16 text-right">
          <span>{displayMajor}</span>
          <span className="text-xs">{displayMinor}</span>
        </div>
      )}
      <div className={profitClassName}>
        <span>{displayProfit}</span>
      </div>
    </div>
  )
}

const TradeColumn = ({ source, showDelta = false }: { source: any; showDelta?: boolean }) => {
  const { direction, outcomes } = source

  const displayTitle = direction === TradeDirection.Call ? "Make Call" : "Make Put"
  const displayInIcons = direction === TradeDirection.Call ? <MakeCallIcons /> : <MakePutIcons />
  const displayOutIcons = direction === TradeDirection.Call ? <MakePutIcons /> : <MakeCallIcons />

  return (
    <div className="w-48 flex flex-col items-center gap-2 p-2">
      <div className="h-6 text-secondary font-extrabold">{displayTitle}</div>
      <div className="h-4 ">{displayInIcons}</div>
      <div className="h-4 text-secondary">{displayOutIcons}</div>
      <div className="divider"></div>

      {outcomes?.map((outcome: any) => (
        <TradeRow outcome={outcome} showDelta={showDelta} key={outcome.delta} />
      ))}
    </div>
  )
}

const TradeBlock = ({ source, showDelta = false }: { source: any; showDelta?: boolean }) => {
  if (source == null) {
    return null
  }

  return (
    <div className="flex flex-row gap-2 border border-primary rounded ">
      <TradeColumn source={source} showDelta={showDelta} />
    </div>
  )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const PriceRow = ({ item, showDelta = false }: { item: any; showDelta?: boolean }) => {
  const displayRate = formatNumber(item.rate)

  const displayMinor = displayRate?.split("").reverse().join("").substring(0, 2).split("").reverse().join("")
  const displayMajor = displayRate?.split("").reverse().join("").substring(2).split("").reverse().join("")

  let containerClassName = "h-6 w-full flex flex-row gap-1 justify-around"

  if (item.delta === 0) {
    containerClassName += " text-primary"
  }

  return (
    <div className={containerClassName}>
      {showDelta && (
        <div className="w-16 text-right">
          <span>{item.delta}</span>
        </div>
      )}
      {!showDelta && (
        <div className="w-16 text-right">
          <span>{displayMajor}</span>
          <span className="text-xs">{displayMinor}</span>
        </div>
      )}
    </div>
  )
}

const PriceColumn = ({ source, showDelta = false }: { source: any; showDelta?: boolean }) => {
  const { direction, tradeOutcomes } = source

  let displayTitle
  let displayIcons

  switch (direction) {
    case OptionDirection.BuyCall:
      displayTitle = "Buy Call"
      displayIcons = <BuyCallIcons />
      break
    case OptionDirection.SellCall:
      displayTitle = "Sell Call"
      displayIcons = <SellCallIcons />
      break
    case OptionDirection.BuyPut:
      displayTitle = "Buy Put"
      displayIcons = <BuyPutIcons />
      break
    case OptionDirection.SellPut:
      displayTitle = "Sell Put"
      displayIcons = <SellPutIcons />
      break
  }

  return (
    <div className="w-48 flex flex-col items-center gap-2 p-2">
      <div className="h-8 text-secondary font-extrabold">{displayTitle}</div>
      <div className="h-8 ">{displayIcons}</div>
      <div className="divider"></div>

      {tradeOutcomes?.map((item: any) => (
        <PriceRow item={item} showDelta={showDelta} key={item.delta} />
      ))}
    </div>
  )
}

const OptionRow = ({
  item,
  cost,
  direction,
  contractDelta,
  onClick,
}: {
  item: any
  cost: number
  direction: OptionDirection
  contractDelta: number
  onClick?: (data: any) => null
}) => {
  const profit = item.profit
  // const profit = item.percentage * 10000

  // if (balance < maxLoss) {
  //   balance = maxLoss
  // }

  const displayProfit = formatValue(profit, false)

  let profitClassName = ""

  if (profit <= cost * -1) {
    profitClassName += " text-error"
  } else if (profit > 0) {
    profitClassName += " text-success"
    // } else if (profit === cost) {
    //   profitClassName += " text-success opacity-50"
    // } else if (profit > -1 && profit < 1) {
    //   profitClassName += " text-secondary"
  } else {
    profitClassName += " text-warning"
  }

  if (item.delta === contractDelta && (cost > 1 || cost < -1)) {
    profitClassName += " border rounded border-primary w-full text-center"
  }

  if (direction === OptionDirection.BuyCall) {
    if (profit === cost * -1) {
      profitClassName += " opacity-50"
    }
  }

  if (direction === OptionDirection.SellCall) {
    if (profit === cost) {
      profitClassName += " opacity-50"
    }
  }

  if (direction === OptionDirection.BuyPut) {
    if (profit === cost * -1) {
      profitClassName += " opacity-50"
    }
  }

  if (direction === OptionDirection.SellPut) {
    if (profit === cost) {
      profitClassName += " opacity-50"
    }
  }

  const handleClick = () => {
    if (onClick != null) {
      onClick({ item, cost, direction, contractDelta })
    }
  }

  return (
    <div className={profitClassName} onClick={handleClick}>
      {displayProfit}
    </div>
  )
}

const OptionColumn = ({ direction, source, showDelta, onClick }: { direction: OptionDirection; source: any; showDelta?: boolean; onClick?: any }) => {
  const displayRate = formatNumber(source.strikePrice)

  const displayMinor = displayRate?.split("").reverse().join("").substring(0, 2).split("").reverse().join("")
  const displayMajor = displayRate?.split("").reverse().join("").substring(2).split("").reverse().join("")

  let cost = source.contractCost
  const contractDelta = source.delta

  if (cost < 50) {
    cost = null
  }

  const displayCost = cost == null ? null : formatValue(cost, false)

  return (
    <div className="w-24 flex flex-col justify-start items-center gap-2 p-2">
      <div className="h-8 text-secondary font-extrabold  ">
        {showDelta && (
          <div className="w-16 text-center">
            <span>{source.delta}</span>
          </div>
        )}
        {!showDelta && (
          <div className="w-16 text-center">
            <span>{displayMajor}</span>
            <span className="text-xs">{displayMinor}</span>
          </div>
        )}
      </div>

      <div className="h-8 ">{cost != null && <button className="btn btn-sm btn-primary btn-outline">{displayCost}</button>}</div>
      <div className="divider"></div>
      {source.outcomes?.map((item: any) => (
        <OptionRow item={item} cost={cost} contractDelta={contractDelta} direction={direction} onClick={onClick} />
      ))}
    </div>
  )
}

const OptionBlock = ({ source, showDelta = false, onClick }: { source: any; showDelta?: boolean; onClick?: any }) => {
  if (source == null) {
    return null
  }

  return (
    <div className="flex flex-row gap-2 border border-primary rounded ">
      <PriceColumn source={source} showDelta={showDelta} />
      {source?.contracts?.map((contract: any) => {
        return <OptionColumn direction={source.direction} source={contract} showDelta={showDelta} key={contract.delta} onClick={onClick} />
      })}
    </div>
  )
}
