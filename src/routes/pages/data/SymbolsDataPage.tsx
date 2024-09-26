import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Link } from "react-router-dom"

import favoritesAdd from "@/data/localStorage/controllers/favoritesAdd"
import favoritesRemove from "@/data/localStorage/controllers/favoritesRemove"
import favoritesToggle from "@/data/localStorage/controllers/favoritesToggle"

import useSymbols from "@/data/indexDB/hooks/useSymbols"

import ActionSelector from "@/display/controllers/ActionSelector"
import BehaviorSelector from "@/display/controllers/BehaviorSelector"
import ChartSelector from "@/display/controllers/ChartSelector"
import ContentChooser from "@/display/controllers/ContentChooser"
import FavoritesSelector from "@/display/controllers/FavoritesSelector"
import RangeChooser from "@/display/controllers/RangeChooser"
import TradeChooser from "@/display/controllers/TradeChooser"
import ViewChooser from "@/display/controllers/ViewChooser"

import useFavorites from "@/data/localStorage/hooks/useFavorites"
import useFavoriteSelection from "@/data/localStorage/hooks/useFavoriteSelection"
import SymbolManager from "@/display/controllers/SymbolManager"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function SymbolsDataPage({ name = "SymbolsDataPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJSON, setShowJSON] = useState(false)

  const symbols = useSymbols()

  const favorites = useFavorites()

  const favoriteSelection = useFavoriteSelection()

  const displayList = favoriteSelection === "on" ? favorites : symbols

  return (
    <div {...rest} data-component={name}>
      <div className="p-2">
        <div className="flex flex-row gap-2 items-center p-2">
          <Link to="/">
            <img src="/pricesimulator-32.png" alt="Home Page" style={{ height: 32, width: 32 }} />
          </Link>
          <h1 className="text-xl text-secondary">Market Data</h1>
          <button className={`btn btn-sm btn-primary ${showJSON ? "" : "btn-outline"}`} onClick={() => setShowJSON(!showJSON)}>
            json
          </button>
        </div>

        <div className="divider">Actions</div>
        <div className="flex flex-row gap-2 items-center flex-wrap p-2">
          <button className="btn btn-sm btn-success" onClick={() => favoritesAdd("^SPX")}>
            Add Favorite
          </button>
          <button className="btn btn-sm btn-warning" onClick={() => favoritesRemove("^SPX")}>
            Remove Favorite
          </button>
          <button className="btn btn-sm btn-success" onClick={() => favoritesToggle("^SPX")}>
            Toggle Favorite
          </button>
        </div>

        <div className="divider">Views</div>
        <div className="flex flex-row gap-2 items-center flex-wrap p-2">
          <ViewChooser />
          <div className="divider divider-horizontal" />
          <ContentChooser />
          <div className="divider divider-horizontal" />
          <RangeChooser />
          <div className="divider divider-horizontal" />
          <TradeChooser />
          <div className="divider divider-horizontal" />
          <ActionSelector />
          <div className="divider divider-horizontal" />
          <BehaviorSelector />
          <div className="divider divider-horizontal" />
          <ChartSelector />
          <div className="divider divider-horizontal" />
          <FavoritesSelector />
        </div>

        <div className="divider">Components</div>
        <div className="flex flex-row items-center flex-wrap">
          {displayList?.map((symbol) => (
            <div className="2xl:w-1/3 xl:w-1/4 md:w-1/2 w-full p-2" key={symbol}>
              {/*  */}
              <SymbolManager className="h-full w-full" symbol={symbol} />
            </div>
          ))}
        </div>

        {showJSON && (
          <div>
            <div className="divider">JSON</div>
            <pre className="flex flex-row gap-2 items-center flex-wrap p-2">{JSON.stringify(displayList, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
