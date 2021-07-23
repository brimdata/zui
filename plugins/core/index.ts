import BrimApi from "src/js/api"

export function activate(api: BrimApi) {
  api.configs.add({
    name: "display",
    title: "Number Formats",
    properties: {
      thousandsSeparator: {
        name: "thousandsSeparator",
        label: "Thousands Separator",
        type: "string",
        defaultValue: ","
      }
    }
  })
}

export function deactivate() {}
