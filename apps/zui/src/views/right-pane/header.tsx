import {SectionTabs} from "src/components/section-tabs"
import {HeaderHandler} from "./header-handler"
import {useSelector} from "react-redux"
import Layout from "src/js/state/Layout"

export function Header() {
  const name = useSelector(Layout.getCurrentPaneName)
  const handler = new HeaderHandler(name)

  return (
    <header
      className="flex gap-2xs"
      style={{blockSize: "calc(var(--toolbar-height) + 1px)"}}
    >
      <div
        className="vertical-rule border-more"
        style={{marginBlock: "var(--space-2xs)"}}
      />
      <div className="w-full border-b-solid border-more" style={{}}>
        <SectionTabs options={handler.options} />
      </div>
    </header>
  )
}
