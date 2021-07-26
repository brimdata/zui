import BrimApi from "src/js/api"

export function activate(api: BrimApi) {
  api.configs.add({
    name: "display",
    title: "Number Formats",
    properties: {
      timeZone: {
        name: "timeZone",
        label: "Timezone",
        type: "string",
        defaultValue: "UTC"
      },
      timeFormat: {
        name: "timeFormat",
        label: "Time Format",
        type: "string",
        defaultValue: "",
        helpLink: {
          label: "docs",
          url: "https://momentjs.com/docs/#/displaying/format/"
        }
      },
      thousandsSeparator: {
        name: "thousandsSeparator",
        label: "Thousands Separator",
        type: "string",
        defaultValue: ","
      },
      dataDir: {
        name: "dataDir",
        label: "Data Directory",
        type: "file",
        defaultValue: ""
      }
    }
  })
}

export function deactivate() {}
