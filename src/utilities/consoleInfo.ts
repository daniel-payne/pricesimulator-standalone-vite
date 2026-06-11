const ENABLE_LOGGING = true

export default function consoleInfo(message: string, ...args: any[]) {
  if (ENABLE_LOGGING) {
    console.log(`[AppLog] ${message}`, ...args)
  }
}
