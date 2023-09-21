import styles from "./data-dropzone.module.css"
import {useFilesDrop} from "src/util/hooks/use-files-drop"
import usePoolId from "src/app/router/hooks/use-pool-id"
import {loadFiles} from "src/domain/loaders/handlers"

export function DataDropzone({children}) {
  const poolId = usePoolId()

  const onDrop = async (webFiles: File[]) => {
    const files = webFiles.map((f) => f.path)
    loadFiles({files, poolId})
  }

  const [props, ref] = useFilesDrop({onDrop})

  return (
    <div className={styles.dropzone} ref={ref}>
      {children}
      {props.isOver && (
        <div className={styles.overlay}>
          <div className={styles.hair}>
            <div />
            <div />
          </div>

          <div className={styles.hair}>
            <div />
            <div />
          </div>

          <div className={styles.hair}>
            <div />
            <div />
          </div>

          <div className={styles.hair}>
            <div />
            <div />
          </div>
          <h1 className={styles.title}>
            Preview & Load <em>Data</em>
          </h1>
        </div>
      )}
    </div>
  )
}
