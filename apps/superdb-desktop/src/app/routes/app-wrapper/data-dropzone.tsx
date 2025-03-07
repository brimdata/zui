import styles from "./data-dropzone.module.css"
import {useFilesDrop} from "src/util/hooks/use-files-drop"
import usePoolId from "src/app/router/hooks/use-pool-id"
import useListener from "src/js/components/hooks/useListener"
import {useEffect, useState} from "react"
import {Dialog} from "src/components/dialog"
import LoadDataForm from "src/js/state/LoadDataForm"
import {useSelector} from "react-redux"
import {DataDropzoneController} from "./data-dropzone-controller"

export function DataDropzone({children}) {
  const poolId = usePoolId()
  const [shiftKey, setShiftKey] = useState(false)
  const previewing = useSelector(LoadDataForm.getShow)
  const dropzone = new DataDropzoneController(shiftKey, previewing, poolId)
  let [props, ref] = useFilesDrop({onDrop: (files) => dropzone.onDrop(files)})

  useListener(document.body, "dragover", (e: KeyboardEvent) => {
    if (props.isOver) setShiftKey(e.shiftKey)
  })

  useEffect(() => {
    if (!props.isOver) setShiftKey(false)
  }, [props.isOver])

  return (
    <div className={styles.dropzone} ref={ref}>
      {children}
      {props.isOver && (
        <Dialog modal isOpen className={styles.overlay}>
          {[1, 2, 3, 4].map((i) => (
            <div className={styles.hair} key={i}>
              <div />
              <div />
            </div>
          ))}
          <div className={styles.message}>
            <h1 className={styles.title}>{dropzone.title}</h1>
            <p className={styles.note}>{dropzone.note}</p>
          </div>
        </Dialog>
      )}
    </div>
  )
}
