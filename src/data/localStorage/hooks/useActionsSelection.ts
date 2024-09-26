import { useQueryState } from "@keldan-systems/state-mutex"

import type { Action } from "@/display/controllers/ActionSelector"

export default function useActionsSelection() {
  const [selection] = useQueryState<Action>("actions", "off")

  return selection
}
