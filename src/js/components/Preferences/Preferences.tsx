import {isArray} from "lodash"
import get from "lodash/get"
import React, {useCallback, useState} from "react"
import {useSelector} from "react-redux"
import ConfigPropValues from "src/js/state/ConfigPropValues"
import brim from "../../brim"
import form, {FormConfig} from "../../brim/form"
import FileInput from "../common/forms/FileInput"
import InputLabel from "../common/forms/InputLabel"
import SelectInput from "../common/forms/SelectInput"
import TextInput from "../common/forms/TextInput"
import Link from "../common/Link"
import useCallbackRef from "../hooks/useCallbackRef"
import ModalBox from "../ModalBox/ModalBox"
import TextContent from "../TextContent"
import FormErrors from "./FormErrors"
import {useConfigsForm} from "./usePreferencesForm"

function ConfigFormItems(props: {configs: FormConfig}) {
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
      <InputLabel htmlFor={name}>
        {label}
        {maybeHelpLinkLabel()}
      </InputLabel>
    )

    const val = get(configVals, [c.configName, c.name], undefined)
    switch (c.type) {
      case "file":
        return (
          <div key={name} className="setting-panel">
            {itemLabel}
            <FileInput
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
            <FileInput
              isDirInput
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
              <SelectInput
                id={name}
                name={name}
                defaultValue={val === undefined ? defaultValue : val}
              >
                {c.enum.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </SelectInput>
            </div>
          )
        }
        return (
          <div key={name} className="setting-panel">
            {itemLabel}
            <TextInput
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

export default function Preferences() {
  const [f, setForm] = useCallbackRef<HTMLFormElement>()
  const [errors, setErrors] = useState([])

  const configsForm = useConfigsForm()

  const onClose = () => setErrors([])

  const onSubmit = useCallback(
    async (closeModal) => {
      if (!f) return
      const form = brim.form(f, configsForm)

      if (await form.isValid()) {
        setErrors([])
        form.submit()
        closeModal()
      } else {
        setErrors(form.getErrors())
      }
    },
    [f, configsForm]
  )

  return (
    <ModalBox
      onClose={onClose}
      name="settings"
      title="Preferences"
      buttons={[{label: "OK", click: onSubmit}]}
      className="settings-modal"
    >
      <TextContent>
        <FormErrors errors={errors} />
        <form ref={setForm} className="settings-form">
          <ConfigFormItems configs={configsForm} />
        </form>
      </TextContent>
    </ModalBox>
  )
}
