import {useSelector} from "react-redux"
import styles from "./load-pane.module.css"
import {ModalRoot} from "src/components/modal-root"
import LoadDataForm from "src/js/state/LoadDataForm"

export function LoadPane() {
  const files = useSelector(LoadDataForm.getFiles)
  if (files.length === 0) return null

  return (
    <ModalRoot>
      <div className={styles.grid}>
        <nav>
          <h1>Preview & load</h1>
        </nav>
        <aside>
          Form
          <form></form>
        </aside>
        <main>{JSON.stringify(files)}</main>
      </div>
    </ModalRoot>
  )
}
