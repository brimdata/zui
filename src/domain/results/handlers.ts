import {createHandler} from "src/core/handlers"
import Inspector from "src/js/state/Inspector"
import Layout from "src/js/state/Layout"
import Modal from "src/js/state/Modal"
import Table from "src/js/state/Table"

export const expandAllHandler = createHandler(
  "results.expandAll",
  ({dispatch}) => {
    dispatch(Inspector.setExpanded({}))
    dispatch(Inspector.setExpandedDefault(true))
  }
)

export const collapseAllHandler = createHandler(
  "results.collapseAll",
  ({dispatch, select}) => {
    console.log("collapseAllHandler")
    const view = select(Layout.getEffectiveResultsView)

    console.log(view)
    if (view === "INSPECTOR") {
      dispatch(Inspector.setExpanded({}))
      dispatch(Inspector.setExpandedDefault(false))
    } else {
      dispatch(Table.setValueExpanded({}))
    }
  }
)

export const showExportDialogHandler = createHandler(
  "results.showExportDialog",
  ({dispatch}) => {
    dispatch(Modal.show("export"))
  }
)

export const toggleHistogram = createHandler(
  "results.toggleHistogram",
  ({dispatch}) => dispatch(Layout.toggleHistogram())
)
