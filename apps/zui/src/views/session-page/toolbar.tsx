import {IconButton} from "src/components/icon-button"
import styles from "./toolbar.module.css"

export function Toolbar() {
  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <nav>
          <IconButton iconName="chevron-left" iconSize={24} />
          <IconButton iconName="chevron-right" iconSize={24} />
        </nav>
        <h1>Checking CSV Shaper</h1>
      </div>
      <div className={styles.right}>
        <nav>
          <IconButton iconName="history" />
          <IconButton iconName="export" />
          <IconButton iconName="pin" />
          <IconButton iconName="plus" />
          <IconButton iconName="run" />
        </nav>
      </div>
    </div>
  )
}
