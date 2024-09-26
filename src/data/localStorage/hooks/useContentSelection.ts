import { useQueryState } from "@keldan-systems/state-mutex"

import type { View } from "@/display/controllers/ContentChooser"

export default function useContentSelection() {
  const [selection] = useQueryState<View>("content", "contracted")

  return selection
}
