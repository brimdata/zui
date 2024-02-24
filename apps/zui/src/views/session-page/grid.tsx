import {useSelector} from "react-redux"
import styles from "./grid.module.css"
import Layout from "src/js/state/Layout"
import Tab from "src/js/state/Tab"

export function Grid({children}) {
  const title = "min-content"
  const pins = "min-content"
  const editorPx = useSelector(Layout.getEditorHeight) + "px"
  const key = useSelector(Tab.getLastLocationKey)
  const editor = `minmax(10vh, min(${editorPx}, 65vh))`
  const results = "minmax(0, 1fr)"
  const footer = "min-content"
  const rows = [title, pins, editor, results, footer]
  const style = {gridTemplateRows: rows.join(" ")}

  return (
    <div className={styles.grid} style={style} data-location-key={key}>
      {children}
    </div>
  )
}
