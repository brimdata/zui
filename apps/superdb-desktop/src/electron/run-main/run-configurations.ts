import time from "src/js/models/time"
import {configurations} from "src/zui"

export function runConfigurations() {
  configurations.create({
    name: "application",
    title: "Application",
    properties: {
      updateMode: {
        name: "updateMode",
        label: "Check for updates...",
        type: "string",
        enum: [
          ["On Startup & Daily", "default"],
          ["On Startup", "startup"],
          ["Manually", "manual"],
        ],
        defaultValue: "startup",
      },
    },
  })
  configurations.create({
    name: "pools",
    title: "Pools",
    properties: {
      nameDelimiter: {
        name: "nameDelimiter",
        label: "Group Pools By",
        type: "char",
        defaultValue: "/",
      },
    },
  })
  configurations.create({
    name: "display",
    title: "Display",
    properties: {
      timeZone: {
        name: "timeZone",
        label: "Time Zone",
        type: "string",
        defaultValue: "UTC",
        enum: time.getZoneNames(),
      },
      timeFormat: {
        name: "timeFormat",
        label: "Time Format",
        type: "string",
        defaultValue: "",
        placeholder: "%Y-%m-%dT%H:%M:%S.%L%:z",
        helpLink: {
          label: "docs",
          url: "https://zui.brimdata.io/docs/features/Time-Display",
        },
      },
      thousandsSeparator: {
        name: "thousandsSeparator",
        label: "Thousands Separator",
        type: "char",
        defaultValue: ",",
      },
      decimal: {
        name: "decimal",
        label: "Decimal",
        type: "char",
        defaultValue: ".",
      },
    },
  })
  configurations.create({
    name: "editor",
    title: "Editor",
    properties: {
      runQueryOnEnter: {
        name: "runQueryOnEnter",
        label: "Run Query On...",
        type: "string",
        enum: [
          ["Shift + Enter", "shift-enter"],
          ["Enter", "enter"],
        ],
        defaultValue: "enter",
      },
    },
  })
  configurations.create({
    name: "defaultLake",
    title: "Zed Lake Service",
    properties: {
      address: {
        name: "listenAddr",
        label: "Listen For Incoming Connections From...",
        type: "string",
        enum: [
          ["Localhost only", "localhost"],
          ["Anywhere", ""],
        ],
        defaultValue: "localhost",
      },
    },
  })
}
