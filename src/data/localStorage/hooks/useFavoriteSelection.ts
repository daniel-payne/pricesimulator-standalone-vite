import { useQueryState } from "@keldan-systems/state-mutex"

import type { Favorites } from "@/display/controllers/FavoritesSelector"

export default function useFavoriteSelection() {
  const [selection] = useQueryState<Favorites>("favorites", "off")

  return selection
}
