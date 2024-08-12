import {Icon} from "src/components/icon"
import {IconButton} from "src/components/icon-button"
import {useDrag, useDrop} from "react-aria"
import classNames from "classnames"
import {useRef} from "react"

export function TabItem({tab, handler}) {
  const ref = useRef()
  let {dragProps, isDragging} = useDrag({getItems: () => [tab.id]})
  let {dropProps, isDropTarget} = useDrop({
    ref,
    onDrop(e) {
      console.log("dropped")
    },
    onDropEnter(e) {
      console.log(e)
    },
  })
  console.log(isDropTarget)
  return (
    <div
      ref={ref}
      className={classNames("tab-item", {
        "opacity-0": isDragging,
        "scoot-left": isDropTarget,
      })}
      aria-selected={handler.isActive(tab.id)}
      onClick={() => handler.activate(tab.id)}
      {...dragProps}
      {...dropProps}
    >
      <span className="tab-item-title truncate">
        <Icon name={tab.icon()} className="tab-icon" />
        {tab.title()}
      </span>
      <IconButton
        className="tab-item-close-button"
        aria-label="Close Tab"
        onClick={(e) => handler.destroy(e, tab.id)}
        iconName="close"
      />
    </div>
  )
}
