import {ButtonMenu} from "src/components/button-menu"
import styles from "./footer.module.css"
import {ToolbarTabs} from "src/components/toolbar-tabs"
import {useSelector} from "react-redux"
import Layout from "src/js/state/Layout"
import {
  collapseAllHandler,
  expandAllHandler,
  showChartView,
  showInspectorView,
  showTableView,
} from "src/domain/results/handlers"

export function Footer() {
  const view = useSelector(Layout.getResultsView)

  return (
    <footer className={styles.footer}>
      <ToolbarTabs
        onlyIcon={true}
        options={[
          {
            label: "Inspector",
            iconName: "braces",
            checked: view === "INSPECTOR",
            click: showInspectorView,
          },
          {
            label: "Table",
            iconName: "columns",
            checked: view === "TABLE",
            click: showTableView,
          },
          {
            label: "Chart",
            iconName: "chart",
            checked: view === "CHART",
            click: showChartView,
          },
        ]}
      />
      <ButtonMenu
        justify="flex-start"
        label="Result Nesting"
        items={[
          {iconName: "expand", click: expandAllHandler},
          {iconName: "collapse", click: collapseAllHandler},
        ]}
      />
      <ToolbarTabs
        onlyIcon={false}
        labelClassName={styles.label}
        options={[
          {label: "2 Columns", checked: false},
          {label: "4 Types", checked: false},
          {label: "100 / 2345 Rows", checked: true},
        ]}
      />
    </footer>
  )
}
