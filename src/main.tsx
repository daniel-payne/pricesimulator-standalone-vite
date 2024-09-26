import React from "react"
import ReactDOM from "react-dom/client"

import { createBrowserRouter, RouterProvider } from "react-router-dom"

import ErrorPage from "@/routes/pages/ErrorPage"

import "@/data/indexDB/db"

import "./main.css"

import capitalizedWord from "@/utilities/capitalizedWord"

import TimerDataPage from "@/routes/pages/data/TimerDataPage"
import DataIndexPage from "@/routes/pages/data/DataIndexPage"
import ScenariosDataPage from "@/routes/pages/data/ScenariosDataPage"
import MarketsDataPage from "@/routes/pages/data/MarketsDataPage"
import OHLCDataPage from "@/routes/pages/data/OHLCDataPage"
import CurrenciesDataPage from "./routes/pages/data/CurrenciesDataPage"
import RatesDataPage from "./routes/pages/data/RatesDataPage"
import TradesDataPage from "./routes/pages/data/TradesDataPage"
import TransactionsDataPage from "./routes/pages/data/TransactionsDataPage"
import SymbolsDataPage from "./routes/pages/data/SymbolsDataPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <DataIndexPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/data/timer",
    element: <TimerDataPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/data/scenarios",
    element: <ScenariosDataPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/data/markets",
    element: <MarketsDataPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/data/currencies",
    element: <CurrenciesDataPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/data/ohlc",
    element: <OHLCDataPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/data/rates",
    element: <RatesDataPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/data/trades",
    element: <TradesDataPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/data/transactions",
    element: <TransactionsDataPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/data/symbols",
    element: <SymbolsDataPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
])

document.title = capitalizedWord(window.location.pathname.replace("/", ""))

if (document.title === "") {
  document.title = "Price Simulator"
}

router.subscribe((route) => {
  const name = capitalizedWord(route.location.pathname.replace("/", ""))

  if (name === "") {
    document.title = "Price Simulator"
    return
  }

  document.title = name
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
