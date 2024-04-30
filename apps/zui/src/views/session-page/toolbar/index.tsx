import {IconButton} from "src/components/icon-button"
import styles from "./toolbar.module.css"
import {
  canGoBack,
  canGoForward,
  goBack,
  goForward,
} from "src/domain/session/handlers/navigation"
import {useSelector} from "react-redux"
import {editQuery} from "src/domain/session/handlers"
import Layout from "src/js/state/Layout"
import classNames from "classnames"
import {ToolbarHandler} from "./handler"
import {ButtonMenu} from "src/components/button-menu"
import {useMenuExtension} from "src/core/menu"
import {createSelector} from "reselect"
import {sessionToolbarMenu} from "src/domain/session/menus/toolbar-menu"
import {useMemo} from "react"
import {SessionPageProps} from ".."

const getWhenContext = createSelector(Layout.getResultsView, (resultsView) => {
  return {
    "results.view": resultsView.toLowerCase(),
  }
})

export function Toolbar(props: SessionPageProps) {
  const context = useSelector(getWhenContext)
  const defaultItems = useMemo(
    () =>
      sessionToolbarMenu({
        isModified: props.isModified,
        isSaved: !!props.namedQuery,
      }),
    [props.isModified, props.namedQuery]
  )
  const items = useMenuExtension("results.toolbarMenu", defaultItems, context)
  const handler = new ToolbarHandler(props)
  const isEditing = useSelector(Layout.getIsEditingTitle)

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
      {isEditing ? (
        <TitleForm handler={handler} />
      ) : (
        <Title handler={handler} />
      )}
      <ButtonMenu items={items} label={"Results Toolbar Menu"} />
    </div>
  )
}

function Title({handler}: {handler: ToolbarHandler}) {
  return (
    <>
      <button className={styles.button}>
        <h1
          onClick={editQuery}
          className={classNames({
            [styles.modified]: handler.isModified,
            [styles.untitled]: !handler.hasNamedQuery,
          })}
        >
          {handler.title}
        </h1>
      </button>
    </>
  )
}

function TitleForm({handler}: {handler: ToolbarHandler}) {
  return (
    <form
      className={classNames(styles.form)}
      onBlur={handler.onBlur}
      onKeyUp={handler.onKeyUp}
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
        defaultValue={handler.props.namedQuery?.name}
      />
    </form>
  )
}
