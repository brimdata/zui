import {useDispatch} from "src/app/core/state"
import styles from "./data-dropzone.module.css"
import {useFilesDrop} from "src/util/hooks/use-files-drop"
import LoadDataForm from "src/js/state/LoadDataForm"

export function DataDropzone({children}) {
  const dispatch = useDispatch()
  const onDrop = (files: File[]) => {
    dispatch(LoadDataForm.setFiles(files.map((f) => f.path)))
  }
  const [props, ref] = useFilesDrop({onDrop})

  return (
    <div className={styles.dropzone} ref={ref}>
      {children}
      {props.isOver && (
        <div className={styles.overlay}>
          <div className={styles.outline} />
          <div className={styles.outline} />
          <div className={styles.outline} />
          <h1 className={styles.title}>
            Preview & Load <em>Data</em>
          </h1>
        </div>
      )}
    </div>
  )
}
