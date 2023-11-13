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
import {editQuery} from "src/domain/session/handlers"
import Layout from "src/js/state/Layout"
import classNames from "classnames"
import {useTitleForm} from "./use-title-form"

export function Toolbar() {
  const query = useSelector(Current.getActiveQuery)
  const isEditing = useSelector(Layout.getIsEditingTitle)
  const form = useTitleForm()

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
        {!isEditing && <h1 onClick={editQuery}>{query.name()}</h1>}
        {isEditing && (
          <form
            className={classNames(styles.form)}
            onSubmit={form.onSubmit}
            onReset={form.onReset}
            onBlur={form.onSubmit}
          >
            <input
              className={styles.input}
              defaultValue={form.defaultValue}
              onBlur={form.onSubmit}
            />
            <button style={{display: "none"}} type="submit" />
          </form>
        )}
      </div>
      <div className={styles.right}>
        <nav>
          <IconButton iconName="plus" click={editQuery} />
          <IconButton iconName="history" />
          <IconButton iconName="export" />
          <IconButton iconName="pin" buildMenu={() => newPinMenu.build()} />
          <IconButton iconName="run" />
        </nav>
      </div>
    </div>
  )
}
