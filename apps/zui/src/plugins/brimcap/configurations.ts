import {
  pluginNamespace,
  yamlConfigPropName,
  suricataLocalRulesPropName,
} from "./config"
import {configurations} from "src/zui"

export function activateBrimcapConfigurations() {
  configurations.create({
    name: pluginNamespace,
    title: "Brimcap Settings",
    properties: {
      [yamlConfigPropName]: {
        name: yamlConfigPropName,
        type: "file",
        label: "Brimcap YAML Config File",
        defaultValue: "",
        helpLink: {
          label: "docs",
          url: "https://github.com/brimdata/brimcap/wiki/Custom-Brimcap-Config",
        },
      },
      [suricataLocalRulesPropName]: {
        name: suricataLocalRulesPropName,
        type: "folder",
        label: "Local Suricata Rules Folder",
        defaultValue: "",
      },
    },
  })
}
