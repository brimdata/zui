import path from "path"
import PluginManager from "./pluginManager"
import BrimApi from "../api"

const initPlugins = async (api: BrimApi) => {
  const pluginManager = new PluginManager(api)

  // load third party plugins
  await pluginManager.load(path.join(__dirname, "../../plugins"))
  // load native brim plugins
  // await pluginManager.load("native brim plugins")
  pluginManager.activate()

  return pluginManager
}

export default initPlugins
