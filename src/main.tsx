import React from "react"
import ReactDOM from "react-dom/client"

import { createBrowserRouter, RouterProvider } from "react-router-dom"

import HomePage from "@/routes/pages/HomePage"
import ErrorPage from "@/routes/pages/ErrorPage"
import MarketsPage from "@/routes/pages/MarketsPage"
import ActionsPage from "@/routes/pages/ActionsPage"
import ScenariosPage from "./routes/pages/ScenariosPage"
import StatusesPage from "./routes/pages/StatusesPage"
import TimerPage from "./routes/pages/TimerPage"
import BalancePage from "./routes/pages/BalancePage"

import "@/data/indexDB/db"

import "./main.css"
import DatasPage from "./routes/pages/DatasPage"
import QuotesPage from "./routes/pages/QuotesPage"
import TradesPage from "./routes/pages/TradesPage"
import TransactionsPage from "./routes/pages/TransactionsPage"
import PricesPage from "./routes/pages/PricesPage"
import MarginsPage from "./routes/pages/MarginsPage"
import MarketsByCategoryPage from "./routes/pages/MarketsByCategoryPage"
import ActiveTradesPage from "./routes/pages/ActiveTradesPage"
import InactiveTradesPage from "./routes/pages/InactiveTradesPage"
import MarketForSymbolPage from "./routes/pages/MarketForSymbolPage"
import PriceForSymbolPage from "./routes/pages/PriceForSymbolPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/timer",
    element: <TimerPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/balance",
    element: <BalancePage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/markets",
    element: <MarketsPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/marketForSymbol",
    element: <MarketForSymbolPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/scenarios",
    element: <ScenariosPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/datas",
    element: <DatasPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/quotes",
    element: <QuotesPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/trades",
    element: <TradesPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/activeTrades",
    element: <ActiveTradesPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/inactiveTrades",
    element: <InactiveTradesPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/transactions",
    element: <TransactionsPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/statuses",
    element: <StatusesPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/prices",
    element: <PricesPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/priceForSymbol",
    element: <PriceForSymbolPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/margins",
    element: <MarginsPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/marketsByCategory",
    element: <MarketsByCategoryPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/actions",
    element: <ActionsPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
