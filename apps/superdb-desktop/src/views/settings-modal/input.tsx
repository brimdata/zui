import {isArray} from "lodash"
import {useSelector} from "react-redux"
import {useDispatch} from "src/core/use-dispatch"
import ConfigPropValues from "src/js/state/ConfigPropValues"
import {SettingProps} from "./section"
import {invoke} from "src/core/invoke"

export function Input(props: SettingProps) {
  const dispatch = useDispatch()
  const {field} = props
  const {name, defaultValue, placeholder} = field
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
          onBlur={onChange}
          placeholder={placeholder}
          defaultValue={value === undefined ? defaultValue : value}
        />
      )
    case "file":
      return (
        <div className="flex items-center gap-s">
          <input
            key={value}
            type="text"
            defaultValue={value}
            onBlur={onChange}
            placeholder="Default"
          />
          <button
            onClick={() => document.getElementById(name).click()}
            className="button"
            type="button"
          >
            Choose File
          </button>
          <input
            type="file"
            className="hidden"
            id={name}
            name={name}
            onChange={(e) => update(e.currentTarget.files[0]?.path)}
          />
        </div>
      )
    case "folder":
      return (
        <div className="flex items-center gap-s">
          <input
            key={value}
            type="text"
            defaultValue={value}
            onBlur={onChange}
            placeholder={field.placeholder || "None"}
          />
          <button
            onClick={async () => {
              const {canceled, filePaths} = await invoke("openDirectory")
              if (!canceled && filePaths[0]) {
                update(filePaths[0])
              }
            }}
            className="button"
            type="button"
          >
            Choose Folder
          </button>
        </div>
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
            onBlur={onChange}
            type="text"
            placeholder={placeholder}
            defaultValue={value === undefined ? defaultValue : value}
          />
        )
      }
  }
}
