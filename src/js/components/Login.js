/* @flow */

import {Redirect} from "react-router-dom"
import {connect} from "react-redux"
import React, {useEffect, useState} from "react"

import type {Credentials} from "../lib/Credentials"
import {fetchSpaces} from "../backend/fetch"
import {getCredentials} from "../state/reducers/boomd"
import {setAppMenu} from "../electron/setAppMenu"
import {setBoomdCredentials} from "../state/actions"
import {trim} from "../lib/Str"
import {updateBoomOptions} from "../backend/options"
import ErrorFactory from "../models/ErrorFactory"
import LoginForm from "./LoginForm"
import LookyHeader from "./LookyHeader"
import dispatchToProps from "../lib/dispatchToProps"

type Props = {|
  credentials: Credentials,
  dispatch: Function
|}

export default function Login({dispatch, credentials}: Props) {
  let [request, setRequest] = useState(null)
  let [error, setError] = useState(null)
  let [status, setStatus] = useState("disconnected")

  useEffect(onMount, [])

  function onChange(creds) {
    dispatch(setBoomdCredentials(creds))
  }

  function validate({host, port}) {
    if (!trim(host) || !+port) {
      setError(ErrorFactory.create("Host and port are required."))
      return false
    } else {
      return true
    }
  }

  function onSubmit() {
    setStatus("connecting")
    dispatch(updateBoomOptions())
    setRequest(
      dispatch(fetchSpaces())
        .done(onSuccess)
        .error(onError)
    )
  }

  function onSuccess() {
    setStatus("connected")
  }

  function onError(e) {
    setStatus("disconnected")
    setError(ErrorFactory.create(e))
  }

  function cancel() {
    setError(null)
    setStatus("disconnected")
    request && request.abort()
  }

  if (status === "connected") return <Redirect to="/search" />

  return (
    <main className="admin-page boomd-connect">
      <LookyHeader />
      <div className="admin-panel-wrapper">
        <div className="admin-panel">
          <LoginForm
            credentials={credentials}
            onChange={onChange}
            onSubmit={onSubmit}
            status={status}
            error={error}
            cancel={cancel}
            validate={validate}
          />
        </div>
      </div>
    </main>
  )
}

function onMount() {
  setAppMenu("LOGIN")
}

const stateToProps = (state) => ({
  credentials: getCredentials(state)
})

export const XLogin = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(Login)
