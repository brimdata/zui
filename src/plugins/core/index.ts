import BrimApi from "src/js/api"
import time from "src/js/models/time"

export function activate(api: BrimApi) {
  api.configs.add({
    name: "pools",
    title: "Pools",
    properties: {
      nameDelimiter: {
        name: "nameDelimiter",
        label: "Group Pools By",
        type: "string",
        defaultValue: "/",
      },
    },
  })
  api.configs.add({
    name: "display",
    title: "Display",
    properties: {
      timeZone: {
        name: "timeZone",
        label: "Timezone",
        type: "string",
        defaultValue: "UTC",
        enum: time.getZoneNames(),
      },
      timeFormat: {
        name: "timeFormat",
        label: "Time Format",
        type: "string",
        defaultValue: "",
        helpLink: {
          label: "docs",
          url: "https://momentjs.com/docs/#/displaying/format/",
        },
      },
      thousandsSeparator: {
        name: "thousandsSeparator",
        label: "Thousands Separator",
        type: "string",
        defaultValue: ",",
      },
      decimal: {
        name: "decimal",
        label: "Decimal",
        type: "string",
        defaultValue: ".",
      },
    },
  })
  api.configs.add({
    name: "editor",
    title: "Editor",
    properties: {
      runQueryOnEnter: {
        name: "runQueryOnEnter",
        label: "Run Query on Enter",
        type: "boolean",
        defaultValue: true,
      },
    },
  })
}

export function deactivate() {}
