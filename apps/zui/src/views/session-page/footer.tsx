import {ButtonMenu} from "src/components/button-menu"
import styles from "./footer.module.css"
import {ToolbarTabs} from "src/components/toolbar-tabs"
import {useSelector} from "react-redux"
import Layout from "src/js/state/Layout"
import {
  collapseAllColumns,
  collapseAllHandler,
  expandAllColumns,
  expandAllHandler,
  showInspectorView,
  showTableView,
  toggleHistogram,
} from "src/domain/results/handlers"
import React from "react"
import {RESULTS_QUERY} from "src/views/results-pane/run-results-query"
import styled from "styled-components"
import Results from "src/js/state/Results"
import {pluralize} from "src/util/pluralize"
import {MenuItem} from "src/core/menu"

export function Footer() {
  const view = useSelector(Layout.getResultsView)

  const tableItems: MenuItem[] = [
    {iconName: "chart", click: toggleHistogram},
    {iconName: "expand-horizontal", click: expandAllColumns},
    {iconName: "collapse-horizontal", click: collapseAllColumns},
  ]
  const inspectorItems: MenuItem[] = [
    {iconName: "chart", click: toggleHistogram},
    {iconName: "expand", click: expandAllHandler},
    {iconName: "collapse", click: collapseAllHandler},
  ]

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
        ]}
      />
      <ButtonMenu
        justify="flex-start"
        label="Result Nesting"
        items={view === "TABLE" ? tableItems : inspectorItems}
      />
      <div className={styles.counts}>
        <ShapeCount />
        <RowCount />
      </div>
    </footer>
  )
}

const Span = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`

export function RowCount() {
  const status = useSelector(Results.getStatus(RESULTS_QUERY))
  const count = useSelector(Results.getCount(RESULTS_QUERY))
  if (status === "FETCHING") {
    return (
      <Span aria-label="fetching" role="status">
        Fetching...
      </Span>
    )
  } else if (status === "COMPLETE") {
    return (
      <span role="status" aria-label="results">
        {count} {pluralize("Row", count)}
      </span>
    )
  } else if (status === "INCOMPLETE") {
    return (
      <span role="status" aria-label="results">
        First {count} {pluralize("Row", count)}
      </span>
    )
  } else if (status === "LIMIT") {
    return (
      <span role="status" aria-label="results">
        Limited to {count} {pluralize("Row", count)}
      </span>
    )
  }
}

function ShapeCount() {
  const shapes = useSelector(Results.getShapes(RESULTS_QUERY))
  const status = useSelector(Results.getStatus(RESULTS_QUERY))
  const count = Object.keys(shapes).length
  if (["COMPLETE", "LIMIT", "INCOMPLETE"].includes(status)) {
    return (
      <span aria-label="shapes">
        {count} {pluralize("Shape", count)}
      </span>
    )
  } else {
    return null
  }
}
