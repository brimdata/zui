import {isArray} from "lodash"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import {ConfigItem} from "src/domain/configurations/plugin-api"
import ConfigPropValues from "src/js/state/ConfigPropValues"
import {Config} from "src/zui"

export function Section(props: {config: Config}) {
  return (
    <>
      {Object.values(props.config.properties)
        .sort((a, b) => (a.name < b.name ? -1 : 1))
        .map((field) => (
          <Setting
            key={props.config.name + field.name}
            sectionName={props.config.name}
            field={field}
          />
        ))}
    </>
  )
}

type SettingProps = {field: ConfigItem; sectionName: string}

function Setting(props: SettingProps) {
  return (
    <>
      <label>{props.field.label}</label>
      <Input {...props} />
    </>
  )
}

function Input(props: SettingProps) {
  const dispatch = useDispatch()
  const {field} = props
  const {name, defaultValue} = field
  const value = useSelector(ConfigPropValues.get(props.sectionName, field.name))
  const update = (value) =>
    dispatch(
      ConfigPropValues.set({
        configName: props.sectionName,
        propName: field.name,
        value,
      })
    )
  const onChange = (e) => update(e.currentTarget.value)

  switch (field.type) {
    case "char":
      return (
        <input
          type="input"
          style={{inlineSize: "8ch"}}
          id={name}
          name={name}
          onChange={onChange}
          defaultValue={value === undefined ? defaultValue : value}
        />
      )
    case "file":
      return (
        <input
          type="file"
          id={name}
          name={name}
          onChange={onChange}
          defaultValue={value === undefined ? defaultValue : value}
          placeholder="default"
        />
      )
    case "string":
      if (field.enum) {
        return (
          <select
            id={name}
            name={name}
            defaultValue={value === undefined ? defaultValue : value}
            onChange={onChange}
          >
            {field.enum.map((e) => {
              const label = isArray(e) ? e[0] : e
              const value = isArray(e) ? e[1] : e
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            })}
          </select>
        )
      } else {
        return (
          <input
            id={name}
            name={name}
            onChange={onChange}
            type="text"
            placeholder=""
            defaultValue={value === undefined ? defaultValue : value}
          />
        )
      }
  }
}
