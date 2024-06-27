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
          url: "https://zui.brimdata.io/docs/features/Packet-Captures#brimcap-yaml-config-file",
        },
      },
      [suricataLocalRulesPropName]: {
        name: suricataLocalRulesPropName,
        type: "folder",
        label: "Local Suricata Rules Folder",
        defaultValue: "",
        helpLink: {
          label: "docs",
          url: "https://zui.brimdata.io/docs/features/Packet-Captures#local-suricata-rules-folder",
        },
      },
      [pcapFolderPropName]: {
        name: pcapFolderPropName,
        type: "folder",
        label: "Folder For Extracted pcaps",
        defaultValue: "",
        placeholder: "Default OS tmpdir",
        helpLink: {
          label: "docs",
          url: "https://zui.brimdata.io/docs/features/Packet-Captures#folder-for-extracted-pcaps",
        },
      },
    },
  })
}
