import {useRef, useState} from "react"
import styles from "./histogram-pane.module.css"
import {Dialog} from "src/components/dialog/dialog"
import {SettingsForm} from "./settings-form"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"

export function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false)
  const button = useRef()
  const close = () => setIsOpen(false)
  const poolId = useSelector(Current.getPoolFromQuery)?.id // might be null
  if (!poolId) return null

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
        <SettingsForm close={close} poolId={poolId} key={poolId} />
      </Dialog>
    </>
  )
}
