import path from "path"
import PluginManager from "./pluginManager"
import BrimApi from "../api"

const initPlugins = async (api: BrimApi) => {
  const pluginManager = new PluginManager(api)
  await pluginManager.load(path.join(__dirname, "../../plugins"))
  pluginManager.activate()

  return pluginManager
}

export default initPlugins
