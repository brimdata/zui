import {ChangeEvent, useRef} from "react"
import styles from "./index.module.css"
import {InputButton} from "src/components/input-button"
import LoadDataForm from "src/js/state/LoadDataForm"
import {useDispatch} from "src/app/core/state"
import usePoolId from "src/app/router/hooks/use-pool-id"

export function EmptyPoolPane() {
  const input = useRef<HTMLInputElement>()
  const dispatch = useDispatch()
  const poolId = usePoolId()

  function onClick() {
    input.current?.click()
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.currentTarget.files).map((f) => f.path)
    console.log(files)
    if (files.length) {
      dispatch(LoadDataForm.setPoolId(poolId))
      dispatch(LoadDataForm.setFiles(files))
    }
  }

  return (
    <div className={styles.pane}>
      <h2>Empty Pool</h2>
      <p>
        Drag-and-drop or choose files to preview and load data in this pool.
      </p>
      <InputButton onClick={onClick} icon="doc-plain">
        Choose Files
      </InputButton>
      <input
        ref={input}
        type="file"
        style={{visibility: "hidden"}}
        onChange={onChange}
      />
    </div>
  )
}
