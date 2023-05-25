import tabHistory from "src/app/router/tab-history"
import {createHandler} from "src/core/handlers"

createHandler("session.goBack", ({dispatch}) => {
  dispatch(tabHistory.goBack())
})

createHandler("session.goForward", ({dispatch}) => {
  dispatch(tabHistory.goForward())
})
