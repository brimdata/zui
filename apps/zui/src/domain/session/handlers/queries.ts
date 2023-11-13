import {createHandler} from "src/core/handlers"
import Layout from "src/js/state/Layout"

export const editQuery = createHandler(({dispatch}) => {
  dispatch(Layout.showTitleForm("create"))
})
