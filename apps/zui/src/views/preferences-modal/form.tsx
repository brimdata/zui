import {isArray} from "lodash"
import get from "lodash/get"
import React from "react"
import {useSelector} from "react-redux"
import ConfigPropValues from "src/js/state/ConfigPropValues"
import {FormConfig} from "src/js/models/form"
import Link from "src/js/components/common/Link"

export function Form(props: {configs: FormConfig}) {
  const {configs} = props
  if (!configs) return null
  const configVals = useSelector(ConfigPropValues.all)

  const formInputs = Object.values(configs).map((c) => {
    const {label, defaultValue, name, helpLink} = c

    if (!c.type) return

    const maybeHelpLinkLabel = () => {
      if (!helpLink) return null
      const {url, label} = helpLink
      return (
        <>
          {" "}
          <Link href={url}>{label}</Link>
        </>
      )
    }

    const itemLabel = (
      <label htmlFor={name}>
        {label}
        {maybeHelpLinkLabel()}
      </label>
    )

    const val = get(configVals, [c.configName, c.name], undefined)
    switch (c.type) {
      case "boolean":
        return (
          <div className="setting-panel" key={name}>
            {itemLabel}
            <input
              id={name}
              type="checkbox"
              name={name}
              defaultChecked={val === undefined ? defaultValue : val}
            />
          </div>
        )
      case "file":
        return (
          <div key={name} className="setting-panel">
            {itemLabel}
            <input
              type="file"
              id={name}
              name={name}
              defaultValue={val === undefined ? defaultValue : val}
              placeholder="default"
            />
          </div>
        )
      case "directory":
        return (
          <div key={name} className="setting-panel">
            {itemLabel}
            <input
              type="file"
              // @ts-ignore
              webkitdirectory
              id={name}
              name={name}
              defaultValue={val === undefined ? defaultValue : val}
              placeholder="default"
            />
          </div>
        )
      case "string":
        if (isArray(c.enum)) {
          return (
            <div className="setting-panel" key={name}>
              {itemLabel}
              <select
                id={name}
                name={name}
                defaultValue={val === undefined ? defaultValue : val}
              >
                {c.enum.map((e) => {
                  const label = isArray(e) ? e[0] : e
                  const value = isArray(e) ? e[1] : e
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                })}
              </select>
            </div>
          )
        }
        return (
          <div key={name} className="setting-panel">
            {itemLabel}
            <input
              id={name}
              name={name}
              type="text"
              placeholder=""
              defaultValue={val === undefined ? defaultValue : val}
            />
          </div>
        )
    }
  })

  return <>{formInputs}</>
}
