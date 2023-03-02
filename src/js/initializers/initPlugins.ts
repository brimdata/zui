import path from "path"
import PluginManager from "./pluginManager"
import ZuiApi from "../api/zui-api"

const initPlugins = async (api: ZuiApi) => {
  const pluginManager = new PluginManager(api)
  await pluginManager.load(path.join(__dirname, "../../plugins"))
  pluginManager.activate()

  return pluginManager
}

export default initPlugins
