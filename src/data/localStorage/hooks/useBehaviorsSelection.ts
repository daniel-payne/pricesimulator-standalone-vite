import { useQueryState } from "@keldan-systems/state-mutex"

import type { Behavior } from "@/display/controllers/BehaviorSelector"

export default function useBehaviorsSelection() {
  const [selection] = useQueryState<Behavior>("behaviors", "off")

  return selection
}
