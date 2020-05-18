/* @flow */

import React, {useCallback, useState, useEffect} from "react"

import {reactElementProps} from "../../test/integration"
import FormErrors from "./FormErrors"
import JSONTypeConfig from "./JSONTypeConfig"
import ModalBox from "../ModalBox/ModalBox"
import TextContent from "../TextContent"
import TimeFormat from "./TimeFormat"
import Timezone from "./Timezone"
import ZeekRunner from "./ZeekRunner"
import brim from "../../brim"
import useCallbackRef from "../hooks/useCallbackRef"
import usePreferencesForm from "./usePreferencesForm"
import DataDirInput from "./DataDirInput"

export default function Preferences() {
  let [f, setForm] = useCallbackRef<HTMLFormElement>()
  let [errors, setErrors] = useState([])
  let prefsForm = usePreferencesForm()

  const onSubmit = useCallback(
    async (closeModal) => {
      if (!f) return
      let form = brim.form(f, prefsForm)

      if (await form.isValid()) {
        setErrors([])
        form.submit()
        closeModal()
      } else {
        setErrors(form.getErrors())
      }
    },
    [f, prefsForm]
  )

  return (
    <ModalBox
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
          <ZeekRunner config={prefsForm.zeekRunner} />
          <JSONTypeConfig config={prefsForm.jsonTypeConfig} />
          <DataDirInput config={prefsForm.dataDir} />
        </form>
      </TextContent>
    </ModalBox>
  )
}
