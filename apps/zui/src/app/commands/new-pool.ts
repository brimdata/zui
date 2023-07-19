import Tabs from "src/js/state/Tabs"
import {newPoolPath} from "../router/utils/paths"
import {createCommand} from "./command"

export const newPool = createCommand({id: "newPool"}, ({dispatch}) => {
  dispatch(Tabs.activateUrl(newPoolPath()))
})
