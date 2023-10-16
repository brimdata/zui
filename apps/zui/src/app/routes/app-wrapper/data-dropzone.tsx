import styles from "./data-dropzone.module.css"
import {useFilesDrop} from "src/util/hooks/use-files-drop"
import usePoolId from "src/app/router/hooks/use-pool-id"
import {previewLoadFiles, quickLoadFiles} from "src/domain/loads/handlers"
import useListener from "src/js/components/hooks/useListener"
import {useEffect, useState} from "react"

export function DataDropzone({children}) {
  const poolId = usePoolId()
  const [shiftKey, setShiftKey] = useState(false)
  const onDrop = async (webFiles: File[]) => {
    const files = webFiles.map((f) => f.path)
    if (shiftKey) {
      quickLoadFiles(files)
    } else {
      previewLoadFiles({files, poolId})
    }
  }

  let [props, ref] = useFilesDrop({onDrop})

  useListener(document.body, "dragover", (e: KeyboardEvent) => {
    if (!props.isOver) return
    setShiftKey(e.shiftKey)
  })

  useEffect(() => {
    if (!props.isOver) setShiftKey(false)
  }, [props.isOver])

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
              {shiftKey ? (
                <>
                  Quick Load <em>Data</em>
                </>
              ) : (
                <>
                  Preview & Load <em>Data</em>
                </>
              )}
            </h1>
            <p className={styles.note}>
              {shiftKey ? (
                <>
                  Release <b>{"Shift"}</b> to preview data first.
                </>
              ) : (
                <>
                  Hold <b>{"Shift"}</b> to quick load into new pool with
                  defaults.
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
