// import timerNextDay from "@/data/indexDB/controllers/timer/timerNextDay"
// import timerReset from "@/data/indexDB/controllers/timer/timerReset"
// import timerStart from "@/data/indexDB/controllers/timer/timerStart"
// import timerStop from "@/data/indexDB/controllers/timer/timerStop"
// import { ScenarioSpeed } from "@/data/indexDB/enums/ScenarioSpeed"

// import useCurrentPriceForSymbol from "@/data/indexDB/hooks/useCurrentPriceForSymbol"
import usePriceForSymbol from "@/data/indexDB/hooks/usePriceForSymbol"
import useDataForSymbol from "@/data/indexDB/hooks/useDataForSymbol"

import formatNumber from "@/utilities/formatNumber"
import formatTimestamp from "@/utilities/formatTimestamp"
import formatTimestampDay from "@/utilities/formatTimestampDay"
import { useQueryState } from "@keldan-systems/state-mutex"
import { type HTMLAttributes, type PropsWithChildren } from "react"
import { useParams } from "react-router-dom"
import AutoSizer from "react-virtualized-auto-sizer"
import { FixedSizeGrid as Grid } from "react-window"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

const Cell = ({ data, columnIndex, rowIndex, style }: { data: any; columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
  let display: string | number | undefined = ""

  const displayStyle = { ...style }

  if (rowIndex === 0) {
    if (columnIndex === 0) {
      display = "index"
    } else if (columnIndex === 1) {
      display = "date"
    } else if (columnIndex === 2) {
      display = "opens"
    } else if (columnIndex === 3) {
      display = "highs"
    } else if (columnIndex === 4) {
      display = "lows"
    } else if (columnIndex === 5) {
      display = "closes"
    }
  } else {
    if (columnIndex === 0) {
      display = rowIndex
    } else if (columnIndex === 1) {
      display = formatTimestampDay(data?.timestamps[rowIndex]) + " " + formatTimestamp(data?.timestamps[rowIndex])
    } else if (columnIndex === 2) {
      display = formatNumber(data?.opens[rowIndex])
    } else if (columnIndex === 3) {
      display = formatNumber(data?.highs[rowIndex])
    } else if (columnIndex === 4) {
      display = formatNumber(data?.lows[rowIndex])
    } else if (columnIndex === 5) {
      display = formatNumber(data?.closes[rowIndex])
    }
  }

  return <div style={displayStyle}>{display}</div>
}

export default function OHLCPage({ name = "OHLCPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const { symbol } = useParams()

  const [showAll] = useQueryState<boolean>("all", false)

  const data = useDataForSymbol(symbol)

  const price = usePriceForSymbol(symbol)

  if (symbol == null || data == null || price == null) {
    return <div>Loading</div>
  }

  const rowCount = showAll ? data.timestamps?.length : (price?.currentIndex ?? -1) + 1

  return (
    <div {...rest} data-component={name}>
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            className="List"
            itemData={data ?? {}}
            height={height}
            rowCount={rowCount ?? 0}
            columnCount={5 + 1}
            rowHeight={35}
            columnWidth={200}
            width={width}
          >
            {Cell}
          </Grid>
        )}
      </AutoSizer>
    </div>
  )
}
