import {useDispatch} from "src/app/core/state"
import ConfigPropValues from "src/js/state/ConfigPropValues"
import {FormConfig, FormFieldConfig} from "../../models/form"
import {useEffect, useState} from "react"
import {getConfigurations} from "src/js/electron/ops"
import {Config} from "src/domain/configurations/plugin-api"

export const useConfigsForm = (): FormConfig => {
  const dispatch = useDispatch()
  const [configs, setConfigs] = useState<Config[]>([])

  useEffect(() => {
    getConfigurations().then((configs) => {
      setConfigs(configs)
    })
  }, [])

  const formConfig: FormConfig = {}
  configs.forEach((config) => {
    Object.values(config.properties).forEach((prop) => {
      const {name, label, defaultValue, type, command, helpLink} = prop

      const submit = (value) => {
        if (command) throw new Error("Fix me" + command)
        dispatch(
          ConfigPropValues.set({
            configName: config.name,
            propName: prop.name,
            value,
          })
        )
      }

      let check
      switch (prop.type) {
        case "string":
          // can validate further if 'pattern' (regex) provided in property here
          break
        default:
          check = () => [true, null]
      }

      formConfig[prop.name] = {
        configName: config.name,
        name,
        type,
        label,
        defaultValue,
        enum: prop.enum,
        submit,
        check,
        helpLink,
      } as FormFieldConfig
    })
  })

  return formConfig
}
