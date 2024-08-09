import useDatas from "@/data/indexDB/hooks/useDatas"
import formatTimestamp from "@/utilities/formatTimestamp"

import { useQueryState } from "@keldan-systems/state-mutex"

import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function DatasPage({ name = "DatasPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJson, setShowJson] = useQueryState<boolean>("showJson", false)

  const datas = useDatas()

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <Link to="/" className="btn btn-primary btn-sm mx-2">
            Home
          </Link>
          <div className="text-secondary text-2xl font-bold">Data</div>
          <button className="btn btn-primary btn-ghost btn-sm hidden" onClick={() => setShowJson(!showJson)}>
            json
          </button>
        </div>
        <div className="flex-auto flex flex-row flex-wrap gap-0">
          {datas?.map((data) => {
            return (
              <div className="w-1/6 p-2" key={data.symbol}>
                <div className="w-full h-full border border-primary rounded-xl p-2 overflow-hidden">
                  <div className="text-primary text-xl font-bold">{data.symbol}</div>
                  {showJson && <pre>{JSON.stringify(data, null, 2)}</pre>}
                  <div className="text-secondary font-bold">{data?.timestamps?.length}&nbsp;</div>
                  <div className="text-secondary font-bold">
                    {formatTimestamp(data?.timestamps?.[0])} - {formatTimestamp(data?.timestamps?.[data?.timestamps?.length - 1])}&nbsp;
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
