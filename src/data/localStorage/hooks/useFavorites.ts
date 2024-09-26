import { useLocalState } from "@keldan-systems/state-mutex"

export default function useFavorites() {
  const [favorites] = useLocalState<Array<string>>("MARKET-FAVORITES", [])

  return favorites
}
