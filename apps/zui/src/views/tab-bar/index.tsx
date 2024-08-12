import {IconButton} from "src/components/icon-button"
import {TabBarHandler} from "./handler"
import {
  RightSidebarToggleButton,
  SidebarToggleButton,
} from "../sidebar/sidebar-toggle-button"
import classNames from "classnames"
import {TabItem} from "./tab-item"

export function TabBar() {
  const handler = new TabBarHandler()
  return (
    <div
      className={classNames("tab-bar", {
        "flush-left": !handler.showSidebarToggle,
      })}
    >
      {handler.showMacPlaceholder && <div className="mac-placeholder" />}
      {handler.showSidebarToggle && <SidebarToggleButton />}

      <nav className="tab-list">
        {handler.tabs.map((tab) => {
          return <TabItem key={tab.id} tab={tab} handler={handler} />
        })}
      </nav>
      <IconButton iconName="plus" click={() => handler.create()} />
      {handler.showSecondarySidebarToggle && <RightSidebarToggleButton />}
    </div>
  )
}
