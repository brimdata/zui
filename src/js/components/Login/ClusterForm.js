/* @flow */
import React from "react"

import {Input, InputCheckbox, InputSubmit} from "../form/Inputs"
import Form from "../form/Form"

type Props = {
  data: Object,
  onChange: Function,
  submit: Function,
  status: string
}

export default function ClusterForm({data, onChange, status, submit}: Props) {
  function onSubmit(e) {
    e.preventDefault()
    submit(data)
  }

  return (
    <div className="login-form">
      <h1>Login</h1>
      <p className="status">{status}</p>
      <Form onSubmit={onSubmit}>
        <Input
          label="Host:"
          name="host"
          type="text"
          required
          autoFocus
          value={data.host}
          onChange={onChange}
        />
        <Input
          label="Port:"
          name="port"
          type="text"
          required
          value={data.port}
          onChange={onChange}
        />
        <Input
          label="Username:"
          name="username"
          type="text"
          value={data.username}
          onChange={onChange}
        />
        <Input
          label="Password:"
          name="password"
          type="password"
          value={data.password}
          onChange={onChange}
        />
        <InputCheckbox
          label="Save credentials"
          name="save"
          checked={data.save}
          onChange={onChange}
        />
        <InputSubmit value="Connect" />
      </Form>
    </div>
  )
}
