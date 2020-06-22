/* @flow */
import React from "react"

import type {Cluster} from "../state/Clusters/types"
import {reactElementProps} from "../test/integration"
import BrimTextLogo from "./BrimTextLogo"
import ErrorNotice from "./ErrorNotice"
import InputField from "./common/forms/InputField"
import InputLabel from "./common/forms/InputLabel"
import TextInput from "./common/forms/TextInput"
import ToolbarButton from "./ToolbarButton"
import brim from "../brim"
import useCallbackRef from "./hooks/useCallbackRef"

function toCluster({host, ...rest}): Cluster {
  let [h, p] = host.split(":")
  // $FlowFixMe
  return {...rest, host: h, port: p || "9867", id: host}
}

export default function TabSignIn() {
  const [f, formRef] = useCallbackRef()
  const config = {
    host: {
      name: "host",
      label: "Host:"
    },
    username: {
      name: "username",
      label: "Username:"
    },
    password: {
      name: "password",
      label: "Password:"
    }
  }

  function onSubmit(e) {
    e.preventDefault()
    if (!f) return
    const form = brim.form(f, config)
    const cluster = toCluster(form.getData())
    console.log(cluster)
  }

  return (
    <div className="tab-sign-in">
      <div className="sign-in-form" {...reactElementProps("login")}>
        <form ref={formRef} onSubmit={onSubmit}>
          <BrimTextLogo />
          <InputField>
            <InputLabel>{config.host.label}</InputLabel>
            <TextInput name={config.host.name} required autoFocus />
          </InputField>
          <InputField>
            <InputLabel>{config.username.label}</InputLabel>
            <TextInput name={config.username.name} />
          </InputField>
          <InputField>
            <InputLabel>{config.password.label} </InputLabel>
            <TextInput name={config.password.name} type="password" />
          </InputField>
          <div className="buttons">
            <ToolbarButton text="Connect" />
          </div>
        </form>
        <ErrorNotice />
      </div>
    </div>
  )
}
