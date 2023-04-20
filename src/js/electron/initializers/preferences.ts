import time from "src/js/models/time"
import {ZuiMain} from "../zui-main"

export function initialize(main: ZuiMain) {
  main.configs.add({
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
  main.configs.add({
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
  main.configs.add({
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
