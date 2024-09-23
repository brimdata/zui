import {Icon} from "src/components/icon"
import {IconButton} from "src/components/icon-button"
import {TabBarHandler} from "./handler"
import {BrowserTab} from "src/models/browser-tab"

type Props = {
  handler: TabBarHandler
}

export function TabItemDragPreview({handler}: Props) {
  const tab = handler.srcTab
  const {x, y, width, height} = handler.dragPreviewDimens
  const browserTab = BrowserTab.find(tab.id)
  return (
    <div
      className={handler.dragPreviewClassNames}
      style={{transform: `translate(${x}px, ${y}px)`, width, height}}
    >
      <span className="tab-item-title">
        <Icon name={browserTab.iconName} className="tab-icon" />
        {tab.title}
      </span>
      <IconButton
        className="tab-item-close-button"
        aria-label="Close Tab"
        iconName="close"
      />
    </div>
  )
}
