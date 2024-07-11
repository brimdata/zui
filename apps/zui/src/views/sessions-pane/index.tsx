import {last} from "lodash"
import {SessionsPaneHandler} from "./handler"
import {VirtualList} from "src/js/components/virtual-list"
import {Icon} from "src/components/icon"

export function SessionsPane() {
  const handler = new SessionsPaneHandler()
  return (
    <div className="h-full half-gutter gutter w-full">
      <VirtualList items={handler.sessions} rowHeight={32} paddingTop={10}>
        {({item, style}) => (
          <li
            style={style}
            key={item.id}
            onClick={() => item.tab.activate()}
            className="sidebar-item white-selection font:mono step--1 center-y gutter gap-2xs truncate"
            aria-selected={item.tab.isActive}
          >
            <Icon name="session" />
            {last(item.snapshots).toQueryText().replace("\n", " ")}
          </li>
        )}
      </VirtualList>
    </div>
  )
}
