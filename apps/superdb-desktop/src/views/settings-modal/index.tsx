import React from "react"
import {useFields} from "./use-fields"
import {PopoverModal, usePopoverModal} from "src/components/popover-modal"
import {Config} from "src/zui"
import {Section} from "./section"
import {IconButton} from "src/components/icon-button"
import {useStoredState} from "src/modules/use-stored-state"

export function SettingsModal() {
  const configs = useFields()
  if (!configs.length) return null
  return <Content configs={configs} />
}

type Props = {configs: Config[]}
type State = {activeIndex: number; setActiveIndex: (string: number) => void}

class Controller {
  constructor(public props: Props, public state: State) {}

  get sections() {
    return this.props.configs.sort((a, b) => (a.title < b.title ? -1 : 1))
  }

  get activeSection() {
    return this.sections[this.activeIndex]
  }

  get activeIndex() {
    return this.state.activeIndex || 0
  }

  isActive(index: number) {
    return this.activeIndex === index
  }

  setActive(index: number) {
    this.state.setActiveIndex(index)
  }
}

function Content(props: {configs: Config[]}) {
  const modal = usePopoverModal()
  const [activeIndex, setActiveIndex] = useStoredState(
    "settings-modal-tab-index",
    0,
    parseInt
  )
  const ctl = new Controller(props, {activeIndex, setActiveIndex})

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
          {ctl.sections.map((section, index) => (
            <li
              key={section.title}
              className="sidebar-item box nowrap"
              tabIndex={0}
              role="tab"
              aria-selected={ctl.isActive(index)}
              onClick={() => ctl.setActive(index)}
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
            <Section config={ctl.activeSection} />
          </form>
        </div>
      </section>
    </PopoverModal>
  )
}
