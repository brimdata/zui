import React, {useCallback, useState} from "react"

import {reactElementProps} from "../../../../test/integration/helpers/integration"
import DataDirInput from "./DataDirInput"
import FormErrors from "./FormErrors"
import ModalBox from "../ModalBox/ModalBox"
import TextContent from "../TextContent"
import TimeFormat from "./TimeFormat"
import Timezone from "./Timezone"
import brim from "../../brim"
import useCallbackRef from "../hooks/useCallbackRef"
import usePreferencesForm, {useConfigsForm} from "./usePreferencesForm"
import {FormConfig} from "../../brim/form"
import InputLabel from "../common/forms/InputLabel"
import FileInput from "../common/forms/FileInput"
import TextInput from "../common/forms/TextInput"
import ConfigPropValues from "src/js/state/ConfigPropValues"
import {useSelector} from "react-redux"
import get from "lodash/get"

function ConfigFormItems(props: {configs: FormConfig}) {
  const {configs} = props
  if (!configs) return null

  const configVals = useSelector(ConfigPropValues.all)

  const formInputs = Object.values(configs).map((c) => {
    const {label, defaultValue, name} = c
    if (!c.type) return
    switch (c.type) {
      case "file":
        return (
          <div key={name} className="setting-panel">
            <InputLabel>{label}</InputLabel>
            <FileInput
              name={name}
              defaultValue={
                get(configVals, [c.configName, c.name], "") ||
                defaultValue ||
                ""
              }
              placeholder="default"
            />
          </div>
        )
      case "string":
        return (
          <div key={name} className="setting-panel">
            <div>
              <InputLabel>{label}</InputLabel>
            </div>
            <TextInput
              name={name}
              type="text"
              placeholder="default"
              defaultValue={defaultValue}
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

  // TODO: convert remaining prefs into configs via a 'core' plugin
  const prefsForm = usePreferencesForm()
  const configsForm = useConfigsForm()

  const onClose = () => setErrors([])

  const onSubmit = useCallback(
    async (closeModal) => {
      if (!f) return
      const comboForm = Object.assign(prefsForm, configsForm)
      const form = brim.form(f, comboForm)

      if (await form.isValid()) {
        setErrors([])
        form.submit()
        closeModal()
      } else {
        setErrors(form.getErrors())
      }
    },
    [f, prefsForm, configsForm]
  )

  return (
    <ModalBox
      onClose={onClose}
      name="settings"
      title="Preferences"
      buttons={[{label: "OK", click: onSubmit}]}
      className="settings-modal"
      {...reactElementProps("settingsModal")}
    >
      <TextContent>
        <FormErrors errors={errors} />
        <form ref={setForm} className="settings-form">
          <Timezone config={prefsForm.timeZone} />
          <TimeFormat config={prefsForm.timeFormat} />
          <DataDirInput config={prefsForm.dataDir} />
          <ConfigFormItems configs={configsForm} />
        </form>
      </TextContent>
    </ModalBox>
  )
}
