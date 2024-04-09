import React, {useState} from "react"
import {useFields} from "./use-fields"
import {PopoverModal, usePopoverModal} from "src/components/popover-modal"
import {Config} from "src/zui"
import {Section} from "./section"
import {IconButton} from "src/components/icon-button"

export function SettingsModal() {
  const configs = useFields()
  if (!configs.length) return null
  return <Content configs={configs} />
}

function Content(props: {configs: Config[]}) {
  const modal = usePopoverModal()
  const sections = props.configs.sort((a, b) => (a.title < b.title ? -1 : 1))
  const [active, setActive] = useState(sections[0].name)
  const section = props.configs.find((config) => config.name === active)

  return (
    <PopoverModal
      ref={modal.ref}
      style={{maxInlineSize: "70ch", maxBlockSize: "80vh", blockSize: "440px"}}
      className="settings-modal"
    >
      <header className="repel box">
        <h1>Settings</h1>
        <IconButton iconName="close" onClick={() => modal.close()} />
      </header>
      <section className="sidebar">
        <ul role="tablist" className="scroll-y box bg-chrome">
          {sections.map((section) => (
            <li
              key={section.title}
              className="sidebar-item box"
              tabIndex={0}
              role="tab"
              aria-selected={section.name === active}
              onClick={() => setActive(section.name)}
            >
              {section.title}
            </li>
          ))}
        </ul>
        <div
          role="tabpanel"
          className="scroll-y box region gutter-space-l region-space-m"
        >
          <form className="flow">
            <Section config={section} />
          </form>
        </div>
      </section>
    </PopoverModal>
  )
}
