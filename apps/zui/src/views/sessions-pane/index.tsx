import {useSelector} from "react-redux"
import {Icon} from "src/components/icon"
import {VirtualList} from "src/js/components/virtual-list"
import SessionHistories from "src/js/state/SessionHistories"
import {QuerySession} from "src/models/query-session"
import {SessionsPaneHandler} from "./handler"
import Tabs from "src/js/state/Tabs"

export function SessionsPane() {
  useSelector(SessionHistories.raw) // We need this here to update the display name
  useSelector(Tabs.getActive) // We need this to update isActive
  const sessions = QuerySession.useAll().sort(
    (item, pivot) => pivot.createdAt - item.createdAt
  )
  const handler = new SessionsPaneHandler()

  return (
    <div className="h-full" style={{zIndex: 2}}>
      <VirtualList
        items={sessions}
        rowHeight={32}
        paddingTop={10}
        paddingBottom={10}
      >
        {({item, style}) => (
          <li
            className="gutter half-gutter list-none flex"
            style={{...style}}
            onClick={() => item.activate()}
            onContextMenu={() => handler.showMenu(item)}
          >
            <div
              className="sidebar-item flex items-center gap-xs half-gutter gutter white-selection"
              aria-selected={item.isActive}
            >
              <Icon name="session" className="shrink-0" />
              <span className="truncate font:mono step--1">
                {item.displayName}
              </span>
            </div>
          </li>
        )}
      </VirtualList>
    </div>
  )
}
