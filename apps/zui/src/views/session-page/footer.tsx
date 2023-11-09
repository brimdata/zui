import {ButtonMenu} from "src/components/button-menu"
import styles from "./footer.module.css"
import {ToolbarTabs} from "src/components/toolbar-tabs"

export function Footer() {
  return (
    <footer className={styles.footer}>
      <ToolbarTabs
        onlyIcon={true}
        options={[
          {label: "Table", iconName: "columns", checked: true, click: () => {}},
          {label: "Chart", iconName: "chart", click: () => {}},
          {label: "Inspector", iconName: "braces", click: () => {}},
        ]}
      />
      <ButtonMenu
        justify="flex-start"
        label="Result Nesting"
        items={[{iconName: "expand"}, {iconName: "collapse"}]}
      />
      <ToolbarTabs
        onlyIcon={false}
        options={[
          {label: "2 Columns", checked: false},
          {label: "4 Types", checked: false},
          {label: "100 / 2345 Rows", checked: true},
        ]}
      />
    </footer>
  )
}
