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
import {editQuery} from "src/domain/session/handlers"
import Layout from "src/js/state/Layout"
import classNames from "classnames"
import {useTitleForm} from "./use-title-form"
import useSelect from "src/app/core/hooks/use-select"
import {ButtonMenu} from "src/components/button-menu"
import {useMenuExtension} from "src/core/menu"
import {createSelector} from "reselect"
import {sessionToolbarMenu} from "src/domain/session/menus/toolbar-menu"
import {useMemo} from "react"
import {SessionPageProps} from "."

const getWhenContext = createSelector(Layout.getResultsView, (resultsView) => {
  return {
    "results.view": resultsView.toLowerCase(),
  }
})

export function Toolbar(props: SessionPageProps) {
  const context = useSelector(getWhenContext)
  const query = useSelector(Current.getActiveQuery)
  const defaultItems = useMemo(() => sessionToolbarMenu(query), [query])
  const items = useMenuExtension("results.toolbarMenu", defaultItems, context)

  return (
    <div className={styles.toolbar}>
      <nav className={styles.nav}>
        <IconButton
          iconName="left_arrow"
          label="Go Back"
          iconSize={24}
          click={() => goBack()}
          enabled={canGoBack()}
        />
        <IconButton
          iconName="right_arrow"
          label="Go Forward"
          iconSize={24}
          click={goForward}
          enabled={canGoForward()}
        />
      </nav>
      <QueryTitle {...props} />
      <ButtonMenu items={items} label={"Results Toolbar Menu"} />
    </div>
  )
}

function QueryTitle(props: SessionPageProps) {
  const {namedQuery, isModified} = props
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

  let name = ""
  if (namedQuery) name = namedQuery.name + (isModified ? "*" : "")

  if (!isEditing) {
    return (
      <>
        <button className={styles.button}>
          <h1
            onClick={editQuery}
            className={classNames({[styles.modified]: isModified})}
          >
            {namedQuery ? (
              name
            ) : (
              <span className={styles.untitled}>Untitled</span>
            )}
          </h1>
        </button>
      </>
    )
  } else {
    return (
      <form
        className={classNames(styles.form)}
        onBlur={onBlur}
        onKeyUp={onKeyUp}
      >
        <label htmlFor="query-name" style={{display: "none"}}>
          Query Name
        </label>
        <input
          id="query-name"
          name="query-name"
          placeholder="Name your query..."
          autoFocus
          className={styles.input}
          defaultValue={namedQuery?.name}
        />
      </form>
    )
  }
}
