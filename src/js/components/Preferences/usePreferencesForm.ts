import {useZuiApi} from "src/app/core/context"
import {useDispatch} from "src/app/core/state"
import ConfigPropValues from "src/js/state/ConfigPropValues"
import {FormConfig, FormFieldConfig} from "../../models/form"
import {executeCommand} from "../../flows/executeCommand"

export const useConfigsForm = (): FormConfig => {
  const dispatch = useDispatch()
  const api = useZuiApi()
  const configs = api.configs.all
  const formConfig: FormConfig = {}
  configs.forEach((config) => {
    Object.values(config.properties).forEach((prop) => {
      const {name, label, defaultValue, type, command, helpLink} = prop

      const submit = (value) => {
        if (command) dispatch(executeCommand(command, value))
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
