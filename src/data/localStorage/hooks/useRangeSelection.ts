import { useQueryState } from "@keldan-systems/state-mutex"

import type { Range } from "@/display/controllers/RangeChooser"

export default function useRangeSelection() {
  const [selection] = useQueryState<Range>("range", "1m")

  return selection
}
