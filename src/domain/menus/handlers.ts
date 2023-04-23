import {createHandler} from "src/core/handlers"
import ResultsToolbar from "src/js/state/ResultsToolbar"

createHandler("menus.update", ({dispatch}, name, id, props) => {
  switch (name) {
    case "results.toolbarMenu":
      return dispatch(ResultsToolbar.update({id, changes: props}))
  }
})
