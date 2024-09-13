import {ToolbarHandler} from "./handler"
import styles from "../toolbar.module.css"
import classNames from "classnames"

export function Title({handler}: {handler: ToolbarHandler}) {
  if (!handler.isEditing) {
    return (
      <>
        <button className={styles.button}>
          <h1
            onClick={() => handler.onEdit()}
            className={classNames({[styles.modified]: handler.isModified})}
          >
            {handler.isSaved ? (
              handler.queryName
            ) : (
              <span className={styles.untitled}>Untitled</span>
            )}
            {handler.isModified && "*"}
          </h1>
        </button>
      </>
    )
  } else {
    return (
      <form
        className={classNames(styles.form)}
        onBlur={(e) => handler.onBlur(e)}
        onKeyUp={(e) => handler.onKeyUp(e)}
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
          defaultValue={handler.queryName}
        />
      </form>
    )
  }
}
