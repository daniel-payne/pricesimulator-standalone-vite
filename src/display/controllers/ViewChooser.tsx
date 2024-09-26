import { useQueryState } from "@keldan-systems/state-mutex"

import { FaArrowDownShortWide, FaArrowUpShortWide } from "react-icons/fa6"

import type { HTMLAttributes, PropsWithChildren } from "react"

export type View = "expanded" | "contracted"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

const UNSELECTED_BUTTON = "btn btn-sm btn-ghost"
const SELECTED_BUTTON = "btn btn-sm btn-info"

export default function ViewChooser({ name = "ViewChooser", ...rest }: PropsWithChildren<ComponentProps>) {
  const [view, setView] = useQueryState<View>("view", "expanded")

  const handleClick = (range: View) => {
    return () => setView(range)
  }

  const handleClickEXP = handleClick("expanded")
  const handleClickCON = handleClick("contracted")

  let classNameEXP = UNSELECTED_BUTTON
  let classNameCON = UNSELECTED_BUTTON

  switch (view) {
    case "expanded":
      classNameEXP = SELECTED_BUTTON
      break
    case "contracted":
      classNameCON = SELECTED_BUTTON
      break
  }

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-row gap-2 justify-center items-center">
        <div className={classNameEXP} onClick={handleClickEXP}>
          <FaArrowDownShortWide />
        </div>
        <div className={classNameCON} onClick={handleClickCON}>
          <FaArrowUpShortWide />
        </div>
      </div>
    </div>
  )
}
