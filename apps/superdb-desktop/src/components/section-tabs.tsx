import React, {useRef} from "react"
import {MenuItem} from "src/core/menu"
import {MoreItemsButton} from "./more-items-button"
import {useResponsiveMenu} from "src/js/components/hooks/use-responsive-menu"
import classNames from "classnames"

export function SectionTabs(props: {
  options: MenuItem[]
  className?: string
  style?: any
}) {
  const changeCount = useRef(0)
  const menu = useResponsiveMenu(props.options)

  return (
    <div
      ref={menu.containerRef}
      style={props.style}
      className={classNames(
        props.className,
        "flex items-center h-full relative w-full overflow-hidden"
      )}
    >
      <nav className="flex h-full items-center">
        {menu.items.map((item, index) => (
          <button
            className="section-tab-button h-full"
            key={item.id ?? index}
            onClick={() => {
              changeCount.current += 1
              item.click()
            }}
            aria-pressed={item.checked}
            data-section-tab-value={item.label.toLowerCase()}
            style={{
              display: menu.isHidden(item) ? "none" : "block",
            }}
          >
            <span>{item.label}</span>
          </button>
        ))}

        {menu.hasHiddenItems ? (
          <MoreItemsButton items={menu.hiddenItems} ref={menu.moreRef} />
        ) : null}
      </nav>
    </div>
  )
}
