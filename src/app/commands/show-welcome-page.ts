import Tabs from "src/js/state/Tabs"
import {lakePath} from "../router/utils/paths"
import {createCommand} from "./command"

export const showWelcomePage = createCommand(
  {id: "tabs.showWelcomePage"},
  ({dispatch, api}) => {
    dispatch(Tabs.activateUrl(lakePath(api.current.lakeId)))
  }
)
