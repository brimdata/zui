import {
  pluginNamespace,
  yamlConfigPropName,
  suricataLocalRulesPropName,
  pcapFolderPropName,
} from "./config"
import {configurations} from "src/zui"

export function activateBrimcapConfigurations() {
  configurations.create({
    name: pluginNamespace,
    title: "Packet Captures",
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
      [pcapFolderPropName]: {
        name: pcapFolderPropName,
        type: "folder",
        label: "Folder For Extracted pcaps",
        defaultValue: "",
        placeholder: "Default OS tmpdir",
      },
    },
  })
}
