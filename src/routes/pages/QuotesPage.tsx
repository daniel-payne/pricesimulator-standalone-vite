import { useQueryState } from "@keldan-systems/state-mutex"

import useQuotes from "@/data/indexDB/hooks/useQuotes"

import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function QuotesPage({ name = "QuotesPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJson, setShowJson] = useQueryState<boolean>("showJson", false)

  const quotes = useQuotes()

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <Link to="/" className="btn btn-primary btn-sm mx-2">
            Home
          </Link>
          <div className="text-secondary text-2xl font-bold">Quotes</div>
          <button className="btn btn-primary btn-ghost btn-sm" onClick={() => setShowJson(!showJson)}>
            json
          </button>
        </div>
        <div className="flex-auto flex flex-row flex-wrap gap-0">
          {quotes?.map((quote) => {
            return (
              <div className="w-96 p-2" key={quote.id}>
                <div className="w-full h-full border border-primary rounded-xl p-2 overflow-hidden">
                  <div className="text-primary text-xl font-bold">{quote.id}</div>
                  {showJson && <pre>{JSON.stringify(quote, null, 2)}</pre>}
                  {/* <div className="text-secondary font-bold">{market?.name}&nbsp;</div>
                  <div className="text-secondary">{market?.description}&nbsp;</div>
                  <div className="text-secondary font-bold">
                    {market?.contractSize} {market?.contractUnit}&nbsp;
                  </div>
                  <div className="text-secondary">{market?.contractName}&nbsp;</div> */}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
