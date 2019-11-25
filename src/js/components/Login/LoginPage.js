/* @flow */
import React from "react"

import {Input, InputCheckbox, InputSubmit} from "../form/Inputs"
import {reactElementProps} from "../../test/integration"
import Brand from "./Brand"
import EmptyCheck from "../EmptyCheck"
import Form from "../form/Form"
import LoginWelcome from "./LoginWelcome"
import Notice from "../Notice"
import SavedClusters from "./SavedClusters"
import useLoginController from "./useLoginController"

export default function LoginPage() {
  let login = useLoginController()

  return (
    <div className="login">
      <aside>
        <Brand />
        <EmptyCheck array={login.saved} empty={<LoginWelcome />}>
          <SavedClusters
            onClick={login.submitSaved}
            onRightClick={login.showSavedMenu}
            saved={login.saved}
          />
        </EmptyCheck>
      </aside>
      <main>
        <div className="login-form" {...reactElementProps("login")}>
          <h3 className="section-heading">New Connection</h3>
          <Form onSubmit={login.submitForm}>
            <Input
              label="Host:"
              name="host"
              type="text"
              required
              autoFocus
              value={login.form.host}
              onChange={login.onFormChange}
            />
            <Input
              label="Username:"
              name="username"
              type="text"
              value={login.form.username}
              onChange={login.onFormChange}
            />
            <Input
              label="Password:"
              name="password"
              type="password"
              value={login.form.password}
              onChange={login.onFormChange}
            />
            <InputCheckbox
              label="Save credentials"
              name="save"
              checked={login.form.save}
              onChange={login.onFormChange}
            />
            <InputSubmit value="Connect" />
          </Form>
          <Notice show={login.error}>
            <span>{login.error && login.error.message()} </span>
            <a onClick={login.clearError}>Dismiss</a>{" "}
          </Notice>
        </div>
      </main>
    </div>
  )
}
