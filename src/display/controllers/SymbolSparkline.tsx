import useClosesFor from "@/data/indexDB/hooks/useClosesFor"
import type { HTMLAttributes, PropsWithChildren } from "react"
import DataSparklineDisplay from "../elements/DataSparklineDisplay"

type ComponentProps = {
  symbol: string
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function SymbolSparkline({ symbol, name = "SymbolSparkline", ...rest }: PropsWithChildren<ComponentProps>) {
  const data = useClosesFor(symbol)

  if (data == null) {
    return (
      <div className="h-32 flex flex-col items-center justify-center">
        <span>Loading</span>
      </div>
    )
  }

  return (
    <div {...rest} data-controller={name}>
      <DataSparklineDisplay className="h-32" data={data} />
    </div>
  )
}
