import {SectionTabs} from "src/components/section-tabs"
import {HeaderHandler} from "./header-handler"
import {useSelector} from "react-redux"
import Layout from "src/js/state/Layout"

export function Header() {
  const name = useSelector(Layout.getCurrentPaneName)
  const handler = new HeaderHandler(name)

  return (
    <header className="h-toolbar flex">
      <div
        className="vertical-rule border-more"
        style={{marginBlock: "var(--space-2xs)"}}
      />
      <div className="border-b-solid border-more w-full">
        <SectionTabs options={handler.options} />
      </div>
    </header>
  )
}
