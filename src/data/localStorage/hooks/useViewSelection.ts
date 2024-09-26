import { useQueryState } from "@keldan-systems/state-mutex"

import type { View } from "@/display/controllers/ViewChooser"

export default function useViewSelection() {
  const [selection] = useQueryState<View>("view", "contracted")

  return selection
}
