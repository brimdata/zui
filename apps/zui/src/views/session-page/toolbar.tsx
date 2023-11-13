import {IconButton} from "src/components/icon-button"
import styles from "./toolbar.module.css"
import {
  canGoBack,
  canGoForward,
  goBack,
  goForward,
} from "src/domain/session/handlers/navigation"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import {newPinMenu} from "src/app/menus/new-pin-menu"

export function Toolbar() {
  const query = useSelector(Current.getActiveQuery)

  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <nav>
          <IconButton
            iconName="chevron-left"
            iconSize={24}
            click={() => goBack()}
            enabled={canGoBack()}
          />
          <IconButton
            iconName="chevron-right"
            iconSize={24}
            click={goForward}
            enabled={canGoForward()}
          />
        </nav>
        <h1>{query.name()}</h1>
      </div>
      <div className={styles.right}>
        <nav>
          <IconButton iconName="plus" />
          <IconButton iconName="history" />
          <IconButton iconName="export" />
          <IconButton iconName="pin" buildMenu={() => newPinMenu.build()} />
          <IconButton iconName="run" />
        </nav>
      </div>
    </div>
  )
}
