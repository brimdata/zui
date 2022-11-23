import Tabs from "src/js/state/Tabs"
import {newPoolPath} from "../router/utils/paths"
import {createCommand} from "./command"

export const newPool = createCommand({id: "newPool"}, ({api, dispatch}) => {
  dispatch(Tabs.activateUrl(newPoolPath(api.current.lakeId)))
})
