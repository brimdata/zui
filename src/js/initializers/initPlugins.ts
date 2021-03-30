import BrimApi from "./brimApi"
import PluginManager from "./pluginManager"

const initPlugins = async (api: BrimApi) => {
  const pluginManager = new PluginManager(api)

  // load third party plugins
  await pluginManager.load("plugins")
  // load native brim plugins
  // await pluginManager.load("native brim plugins")

  pluginManager.activate()

  return pluginManager
}

export default initPlugins
