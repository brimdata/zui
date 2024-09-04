import {Icon} from "src/components/icon"
import {IconButton} from "src/components/icon-button"
import {useDrag} from "@react-aria/dnd"
import classNames from "classnames"
import {useRef} from "react"
import tab from "src/js/models/tab"
import {TabBarHandler} from "./handler"

type Props = {
  tab: ReturnType<typeof tab>
  handler: TabBarHandler
  index: number
}

export function TabItem({tab, handler, index}: Props) {
  const ref = useRef()
  let {dragProps} = useDrag({
    getItems: () => [{type: "tab", id: tab.id}],
    onDragStart: (e) => handler.onDragStart(e, index, ref.current),
    onDragMove: (e) => handler.onDragMove(e),
    onDragEnd: () => handler.onDragEnd(),
  })

  return (
    <div
      ref={ref}
      className={classNames()}
      aria-selected={handler.isActive(tab.id)}
      {...dragProps}
    >
      <span className="tab-item-title">
        <Icon name={tab.icon()} className="tab-icon" />
        {tab.title()}
      </span>
      <IconButton
        className="tab-item-close-button"
        aria-label="Close Tab"
        onClick={(e) => handler.destroy(e, tab.id)}
        onMouseDown={(e) => e.stopPropagation()}
        iconName="close"
      />
    </div>
  )
}
