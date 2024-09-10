import {Icon} from "src/components/icon"
import {IconButton} from "src/components/icon-button"
import {TabBarHandler} from "./handler"

type Props = {
  handler: TabBarHandler
}

export function TabItemDragPreview({handler}: Props) {
  const tab = handler.srcTab
  const {x, y, width, height} = handler.dragPreviewDimens
  return (
    <div
      className={handler.dragPreviewClassNames}
      style={{transform: `translate(${x}px, ${y}px)`, width, height}}
    >
      <span className="tab-item-title">
        <Icon name={tab.icon()} className="tab-icon" />
        {tab.title()}
      </span>
      <IconButton
        className="tab-item-close-button"
        aria-label="Close Tab"
        iconName="close"
      />
    </div>
  )
}
