import {IconButton} from "src/components/icon-button"
import {TabBarHandler} from "./handler"
import {
  RightSidebarToggleButton,
  SidebarToggleButton,
} from "../sidebar/sidebar-toggle-button"
import {Icon} from "src/components/icon"

export function TabBar() {
  const handler = new TabBarHandler()
  return (
    <div className="tab-bar">
      {handler.showMacPlaceholder && <div className="mac-placeholder" />}
      {handler.showSidebarToggle && <SidebarToggleButton />}

      <nav className="tab-list">
        {handler.tabs.map((tab, index) => {
          return (
            <div
              key={tab.id}
              className="tab-item"
              aria-selected={handler.isActive(tab.id)}
              onClick={() => handler.activate(tab.id)}
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
        })}
      </nav>
      <IconButton iconName="plus" click={() => handler.create()} />
      {handler.showSecondarySidebarToggle && <RightSidebarToggleButton />}
    </div>
  )
}
