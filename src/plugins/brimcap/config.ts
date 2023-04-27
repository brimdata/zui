import path from "path"
import {ZuiMain} from "src/electron/zui-main"

export const pluginNamespace = "brimcap"
export const yamlConfigPropName = "yamlConfigPath"
export const dataDirectoryName = "brimcap-root"

export function getDataRoot(main: ZuiMain) {
  return path.join(main.getPath("app-data"), dataDirectoryName)
}
