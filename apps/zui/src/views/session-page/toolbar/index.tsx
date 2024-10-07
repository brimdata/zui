import {IconButton} from "src/components/icon-button"
import styles from "../toolbar.module.css"
import {ButtonMenu} from "src/components/button-menu"
import {Title} from "./title"
import {ToolbarHandler} from "./handler"

export function Toolbar() {
  const handler = new ToolbarHandler()

  return (
    <div className={styles.toolbar}>
      <nav className={styles.nav}>
        <IconButton
          iconName="left_arrow"
          label="Go Back"
          iconSize={24}
          click={() => handler.nav.goBack()}
          enabled={handler.nav.canGoBack()}
        />
        <IconButton
          iconName="right_arrow"
          label="Go Forward"
          iconSize={24}
          click={() => handler.nav.goForward()}
          enabled={handler.nav.canGoForward()}
        />
      </nav>
      <Title handler={handler} />
      <ButtonMenu items={handler.menuItems} label={"Results Toolbar Menu"} />
    </div>
  )
}
