import styles from "./data-dropzone.module.css"
import {useFilesDrop} from "src/util/hooks/use-files-drop"
import usePoolId from "src/app/router/hooks/use-pool-id"
import {loadFiles} from "src/domain/loaders/handlers"
import useListener from "src/js/components/hooks/useListener"
import {useState} from "react"

export function DataDropzone({children}) {
  const poolId = usePoolId()
  const [shiftKey, setShiftKey] = useState(false)
  const onDrop = async (webFiles: File[]) => {
    const files = webFiles.map((f) => f.path)
    loadFiles({files, poolId})
  }
  let [props, ref] = useFilesDrop({onDrop})

  useListener(document.body, "keydown", (e: KeyboardEvent) => {
    if (!props.isOver) return
    setShiftKey(e.shiftKey)
  })

  useListener(document.body, "keyup", (e: KeyboardEvent) => {
    if (!props.isOver) return
    setShiftKey(e.shiftKey)
  })

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
          <div className={styles.message}>
            <h1 className={styles.title}>
              Preview & Load <em>Data</em>
            </h1>
            <p>
              Hold down 'Shift' to load into a new pool with default settings.
            </p>
          </div>

          {shiftKey && <p>Holding Shift!</p>}
        </div>
      )}
    </div>
  )
}
