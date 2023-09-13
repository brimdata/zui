import {useDispatch} from "src/app/core/state"
import styles from "./data-dropzone.module.css"
import {useFilesDrop} from "src/util/hooks/use-files-drop"
import LoadDataForm from "src/js/state/LoadDataForm"
import {createAndLoadFiles} from "src/app/commands/pools"
import {invoke} from "src/core/invoke"
import usePoolId from "src/app/router/hooks/use-pool-id"

export function DataDropzone({children}) {
  const dispatch = useDispatch()
  const poolId = usePoolId()

  const onDrop = async (webFiles: File[]) => {
    const paths = webFiles.map((f) => f.path)
    const files = await invoke("loaders.getFileTypes", paths)

    if (files.length === 1 && files[0].type === "pcap") {
      createAndLoadFiles.run(paths)
    } else {
      dispatch(LoadDataForm.setPoolId(poolId))
      dispatch(LoadDataForm.setFiles(paths))
    }
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
