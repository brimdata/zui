import {configurations} from "src/zui"
import {pluginNamespace, yamlConfigPropName} from "./config"
import {AnalyzeOptions, createCli} from "./cli"

function getAnalyzeOptions(): AnalyzeOptions {
  return {
    json: true,
    config: configurations.get(pluginNamespace, yamlConfigPropName) || "",
  }
}

export function createAnalyzeProcess(signal) {
  const cli = createCli()
  const sub = cli.analyze("-", getAnalyzeOptions(), signal)
  return sub
}
