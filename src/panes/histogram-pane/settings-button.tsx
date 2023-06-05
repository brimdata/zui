import {useRef, useState} from "react"
import styles from "./histogram-pane.module.css"
import {Dialog} from "src/components/dialog/dialog"

export function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false)
  const button = useRef()
  return (
    <>
      <button
        ref={button}
        className={styles.settingsButton}
        onClick={() => setIsOpen(true)}
      >
        Settings
      </button>
      <Dialog
        modal
        className={styles.settingsDialog}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        anchor={button.current}
        anchorPoint="center left"
        dialogPoint="center right"
        dialogMargin="0 10px"
        keepOnScreen={false}
      >
        <h1>Hello World</h1>
        <button onClick={() => setIsOpen(false)}>Close</button>
      </Dialog>
    </>
  )
}
