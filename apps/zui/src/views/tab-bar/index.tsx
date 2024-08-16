import {IconButton} from "src/components/icon-button"
import {TabBarHandler} from "./handler"
import {
  RightSidebarToggleButton,
  SidebarToggleButton,
} from "../sidebar/sidebar-toggle-button"
import classNames from "classnames"
import {TabItem} from "./tab-item"
import {useDrop} from "react-aria"
import {useRef} from "react"
import {SortHandler} from "./sort-handler"

export function TabBar() {
  const handler = new TabBarHandler()
  const sorter = new SortHandler(handler.tabs.length)
  const ref = useRef<any>()
  const {dropProps} = useDrop({
    ref,
    onDrop: (e) => sorter.onDrop(e),
  })

  return (
    <div
      className={classNames("tab-bar", {
        "flush-left": !handler.showSidebarToggle,
      })}
    >
      {handler.showMacPlaceholder && <div className="mac-placeholder" />}
      {handler.showSidebarToggle && <SidebarToggleButton />}
      <nav className="tab-list" ref={ref} {...dropProps}>
        {handler.tabs.map((tab, index) => {
          return (
            <TabItem
              key={tab.id}
              tab={tab}
              handler={handler}
              onDragStart={(offset, element) =>
                sorter.onDragStart(ref.current, element, offset, index)
              }
              onDragMove={(offset) => sorter.onDragMove(offset)}
              className={sorter.classNames(index)}
            />
          )
        })}
      </nav>
      <IconButton iconName="plus" click={() => handler.create()} />
      {handler.showSecondarySidebarToggle && <RightSidebarToggleButton />}
    </div>
  )
}
