import Tabs from "src/js/state/Tabs"
import {lakeImportPath} from "../router/utils/paths"
import {createCommand} from "./command"

export const newPool = createCommand({id: "newPool"}, ({api, dispatch}) => {
  dispatch(Tabs.activateUrl(lakeImportPath(api.current.lakeId)))
})
