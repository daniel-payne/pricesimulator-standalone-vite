export enum TradeStatus {
  Open = "OPEN",
  Closed = "CLOSED", // Closed by user
  Curtailed = "CURTAILED", // Closed on margin call
  Expired = "EXPIRED", // Closed on expiry
}
