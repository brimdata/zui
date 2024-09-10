import {IconButton} from "src/components/icon-button"
import {TabBarHandler} from "./handler"
import {
  RightSidebarToggleButton,
  SidebarToggleButton,
} from "../sidebar/sidebar-toggle-button"
import {TabItem} from "./tab-item"
import {Show} from "src/components/show"
import {TabItemDragPreview} from "./tab-item-drag-preview"

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
      <nav
        className="tab-list"
        ref={handler.listRef}
        role="tablist"
        id="main-area-tabs"
      >
        {handler.tabs.map((tab, index) => {
          return (
            <TabItem key={tab.id} tab={tab} handler={handler} index={index} />
          )
        })}
      </nav>
      {handler.srcTab && <TabItemDragPreview handler={handler} />}
      <IconButton
        iconName="plus"
        click={() => handler.create()}
        label="New Tab"
      />
      {handler.showSecondarySidebarToggle && <RightSidebarToggleButton />}
    </div>
  )
}
