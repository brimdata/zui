import {compact} from "lodash"
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

export function monitorAnalyzeProgress(analyzeProc, callback) {
  analyzeProc.stderr
    .once("data", () => analyzeProc.stdout.emit("start"))
    .on("data", (data) => {
      const lines = compact(data.toString().split("\n")) as string[]
      const stats = lines.map((line) => JSON.parse(line))
      stats.forEach(callback)
    })
}
