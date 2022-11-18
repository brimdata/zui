import Layout from "src/js/state/Layout"
import {createCommand} from "./command"
import {flashElement} from "./flash-element"

export const showHistoryPane = createCommand(
  {
    id: "showHistoryPane",
  },
  ({dispatch, getState}) => {
    if (
      Layout.getDetailPaneIsOpen(getState()) &&
      Layout.getCurrentPaneName(getState()) === "history"
    ) {
      flashElement.run("#js-history-pane")
    } else {
      dispatch(Layout.showDetailPane())
      dispatch(Layout.setCurrentPaneName("history"))
    }
  }
)
