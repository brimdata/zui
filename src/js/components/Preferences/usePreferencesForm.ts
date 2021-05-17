import {isEmpty} from "lodash"
import {useDispatch, useSelector} from "react-redux"

import {FormConfig} from "../../brim/form"
import Prefs from "../../state/Prefs"
import View from "../../state/View"
import lib from "../../lib"
import Configs from "src/js/state/Configs"
import {executeCommand} from "../../flows/executeCommand"
import ConfigPropValues from "src/js/state/ConfigPropValues"

const checkFile = (path) => {
  if (path === "") return [true, ""]
  return lib
    .file(path)
    .exists()
    .then((exists) => [exists, "file does not exist."])
}

export const useConfigsForm = (): FormConfig => {
  const dispatch = useDispatch()
  const configs = useSelector(Configs.all)

  const formConfig: FormConfig = {}
  configs.forEach((config) => {
    Object.values(config.properties).forEach((prop) => {
      const {name, label, defaultValue, type, command} = prop

      const submit = (value) => {
        if (command) dispatch(executeCommand(command, value))
        dispatch(
          ConfigPropValues.set({
            configName: config.name,
            propName: prop.name,
            value
          })
        )
      }

      let check
      switch (prop.type) {
        case "file":
          check = checkFile
          break
        case "string":
          // can validate further if 'pattern' (regex) provided in property here
          break
        default:
          check = () => {}
      }

      formConfig[prop.name] = {
        configName: config.name,
        name,
        type,
        label,
        defaultValue,
        submit,
        check
      }
    })
  })

  return formConfig
}

export default function usePreferencesForm(): FormConfig {
  const dispatch = useDispatch()

  return {
    timeZone: {
      name: "timeZone",
      label: "Timezone",
      defaultValue: useSelector(View.getTimeZone),
      submit: (value) => dispatch(View.setTimeZone(value)),
      check: (value) => [!isEmpty(value), "must not be blank"]
    },
    timeFormat: {
      name: "timeFormat",
      label: "Time Format",
      defaultValue: useSelector(Prefs.getTimeFormat),
      submit: (value) => dispatch(Prefs.setTimeFormat(value))
    },
    dataDir: {
      name: "dataDir",
      label: "Data Directory",
      defaultValue: useSelector(Prefs.getDataDir),
      submit: (value) => dispatch(Prefs.setDataDir(value)),
      check: (path) => {
        if (path === "") return [true, ""]
        return lib
          .file(path)
          .isDirectory()
          .then((isDir) => [isDir, "Selection must be a directory"])
          .catch((e) => {
            const msg = e.name + ": " + e.message
            return /ENOENT/.test(msg)
              ? [false, "Directory does not exist."]
              : [false, msg]
          })
      }
    }
  }
}
