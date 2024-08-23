import {Icon} from "src/components/icon"
import {IconButton} from "src/components/icon-button"
import {DragPreview, useDrag} from "@react-aria/dnd"
import classNames from "classnames"
import {useRef} from "react"

export function TabItem({
  tab,
  handler,
  onDragStart,
  onDragMove,
  onDragEnd,
  className,
}) {
  const ref = useRef()
  const preview = useRef()
  let {dragProps, isDragging} = useDrag({
    getItems: () => [tab.id],
    onDragStart: (e) => onDragStart(e.x, ref.current),
    onDragMove: (e) => onDragMove(e.x),
    onDragEnd: () => onDragEnd(),
  })

  return (
    <>
      <div
        ref={ref}
        className={classNames("tab-item", className, {"opacity-0": isDragging})}
        aria-selected={handler.isActive(tab.id)}
        onClick={() => handler.activate(tab.id)}
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
          iconName="close"
        />
      </div>
      <DragPreview ref={preview}>
        {(items) => {
          return (
            <div className={classNames("tab-item", className)}>
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
        }}
      </DragPreview>
    </>
  )
}
