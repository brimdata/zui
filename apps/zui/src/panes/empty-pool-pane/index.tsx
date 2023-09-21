import {ChangeEvent, useRef} from "react"
import styles from "./index.module.css"
import usePoolId from "src/app/router/hooks/use-pool-id"
import {IconButton} from "src/components/icon-button"
import {loadFiles} from "src/domain/loaders/handlers"

export function EmptyPoolPane() {
  const input = useRef<HTMLInputElement>()
  const poolId = usePoolId()

  function onClick() {
    input.current?.click()
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.currentTarget.files).map((f) => f.path)
    loadFiles({files, poolId})
  }

  return (
    <div className={styles.pane}>
      <h2>Empty Pool</h2>
      <p>
        Drag-and-drop or choose files to preview and load data in this pool.
      </p>
      <IconButton
        onClick={onClick}
        iconName="doc-plain"
        display="icon-label"
        label="Choose Files"
      />
      <input
        ref={input}
        type="file"
        style={{visibility: "hidden"}}
        onChange={onChange}
      />
    </div>
  )
}
