import {SectionTabs} from "src/components/section-tabs"
import {HeaderHandler} from "./header-handler"
import {useSelector} from "react-redux"
import Layout from "src/js/state/Layout"
import {RightSidebarToggleButton} from "../sidebar/sidebar-toggle-button"

export function Header() {
  const name = useSelector(Layout.getCurrentPaneName)
  const handler = new HeaderHandler(name)

  return (
    <header
      className="flex gap-2xs border-more overflow-hidden"
      style={{blockSize: "calc(var(--toolbar-height) + 1px)"}}
    >
      <div
        className="vertical-rule"
        style={{marginBlock: "var(--space-2xs)"}}
      />
      <div
        className="flex items-center w-full border-b-solid overflow-hidden"
        style={{marginInlineEnd: "var(--gutter-space)"}}
      >
        <RightSidebarToggleButton />
        <SectionTabs options={handler.options} className="justify-end" />
      </div>
    </header>
  )
}
