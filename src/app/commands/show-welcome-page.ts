import Tabs from "src/js/state/Tabs"
import {welcomePath} from "../router/utils/paths"
import {createCommand} from "./command"

export const showWelcomePage = createCommand(
  {id: "tabs.showWelcomePage"},
  ({dispatch, api}) => {
    dispatch(Tabs.activateUrl(welcomePath(api.current.lakeId)))
  }
)
