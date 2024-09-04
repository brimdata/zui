import {IconButton} from "src/components/icon-button"
import {TabBarHandler} from "./handler"
import {
  RightSidebarToggleButton,
  SidebarToggleButton,
} from "../sidebar/sidebar-toggle-button"
import {TabItem} from "./tab-item"
import {Show} from "src/components/show"

export function TabBar() {
  const handler = new TabBarHandler()
  return (
    <div className={handler.tabBarClassNames}>
      <Show when={handler.showMacPlaceholder}>
        <div className="mac-placeholder" />
      </Show>
      <Show when={handler.showSidebarToggle}>
        <SidebarToggleButton />
      </Show>
      <nav className="tab-list">
        {handler.tabs.map((tab, index) => {
          return (
            <TabItem key={tab.id} tab={tab} handler={handler} index={index} />
          )
        })}
      </nav>
      <IconButton iconName="plus" click={() => handler.create()} />
      {handler.showSecondarySidebarToggle && <RightSidebarToggleButton />}
    </div>
  )
}
