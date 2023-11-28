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
import {
  editQuery,
  resetQuery,
  runQuery,
  saveAsNewQuery,
  updateQuery,
} from "src/domain/session/handlers"
import Layout from "src/js/state/Layout"
import classNames from "classnames"
import {useTitleForm} from "./use-title-form"
import useSelect from "src/app/core/hooks/use-select"
import {showExportDialog} from "src/domain/results/handlers"
import {showHistoryPane} from "src/app/commands/show-history-pane"

export function Toolbar() {
  const query = useSelector(Current.getActiveQuery)
  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <nav>
          <IconButton
            iconName="arrow_left"
            iconSize={24}
            click={() => goBack()}
            enabled={canGoBack()}
          />
          <IconButton
            iconName="arrow_right"
            iconSize={24}
            click={goForward}
            enabled={canGoForward()}
          />
        </nav>
        <QueryTitle />
      </div>
      <div className={styles.right}>
        <nav>
          {query.isSaved() && (
            <IconButton iconName="close" iconSize={20} click={resetQuery} />
          )}

          <IconButton iconName="add" click={saveAsNewQuery} />
          <IconButton iconName="history" click={() => showHistoryPane.run()} />
          <IconButton iconName="file_export" click={showExportDialog} />
          <IconButton iconName="pin_2" buildMenu={() => newPinMenu.build()} />
          <IconButton iconName="play" click={runQuery} />
        </nav>
      </div>
    </div>
  )
}

function QueryTitle() {
  const query = useSelector(Current.getActiveQuery)
  const isEditing = useSelector(Layout.getIsEditingTitle)
  const form = useTitleForm()
  const select = useSelect()

  function onBlur(e) {
    if (select(Layout.getIsEditingTitle)) {
      form.onSubmit(e)
    }
  }

  function onKeyUp(e) {
    switch (e.key) {
      case "Escape":
        form.onReset()
        break
      case "Enter":
        form.onSubmit(e)
        break
    }
  }

  if (!isEditing) {
    return (
      <>
        <h1
          onClick={editQuery}
          className={classNames({[styles.modified]: query.isModified()})}
        >
          {query.isSaved() ? (
            query.name()
          ) : (
            <span className={styles.untitled}>Untitled</span>
          )}
          {query.isModified() && "*"}
        </h1>
        {query.isModified() && (
          <IconButton iconName="check" click={updateQuery} />
        )}
      </>
    )
  } else {
    return (
      <form
        className={classNames(styles.form)}
        onBlur={onBlur}
        onKeyUp={onKeyUp}
      >
        <input
          name="query-name"
          placeholder="Name your query..."
          autoFocus
          className={styles.input}
          defaultValue={query.name()}
        />
      </form>
    )
  }
}
