import {useRef, useState} from "react"
import styles from "./histogram-pane.module.css"
import {Dialog} from "src/components/dialog/dialog"

export function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false)
  const button = useRef()
  const close = () => setIsOpen(false)

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
        onOutsideClick={close}
        onClose={close}
        className={styles.settingsDialog}
        isOpen={isOpen}
        anchor={button.current}
        anchorPoint="center left"
        dialogPoint="center right"
        dialogMargin="0 10px"
        keepOnScreen={false}
      >
        <h1>Hello World</h1>
        <button onClick={close}>Close</button>
      </Dialog>
    </>
  )
}
