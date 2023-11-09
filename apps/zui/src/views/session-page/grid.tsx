import {useSelector} from "react-redux"
import styles from "./grid.module.css"
import Layout from "src/js/state/Layout"

export function Grid({children}) {
  const title = "min-content"
  const pins = "min-content"
  const editor = useSelector(Layout.getEditorHeight) + "px"
  const results = "minmax(0, 1fr)"
  const footer = "min-content"
  const rows = [title, pins, editor, results, footer]
  const style = {gridTemplateRows: rows.join(" ")}

  return (
    <div className={styles.grid} style={style}>
      {children}
    </div>
  )
}
