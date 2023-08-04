import styles from "./data-dropzone.module.css"
import {useFilesDrop} from "src/util/hooks/use-files-drop"

export function DataDropzone({children}) {
  const onDrop = (files) => {
    console.log("dropped", files)
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
