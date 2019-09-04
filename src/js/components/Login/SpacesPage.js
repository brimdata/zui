/* @flow */
import {isEmpty} from "lodash"
import {useDispatch} from "react-redux"
import React, {useState} from "react"

import type {Cluster} from "../../state/clusters/types"
import {Dots} from "./Dots"
import {createSpace} from "../../backend/thunks"
import {disconnectCluster} from "../../state/clusters/thunks"
import {getFormData} from "../../stdlib/form"
import {setCurrentSpaceName} from "../../state/actions"
import Back from "../../icons/back-arrow.svg"
import Form from "../form/Form"
import Input from "../form/Input"
import InputSubmit from "../form/InputSubmit"

type Props = {cluster: Cluster}

export default function SpacesPage({cluster}: Props) {
  let dispatch = useDispatch()
  let [status, setStatus] = useState("")

  function onSubmit(e) {
    e.preventDefault()
    let {name} = getFormData(e.target, "name")
    if (isEmpty(name)) return

    dispatch(createSpace(name))
      .then((space) => {
        dispatch(setCurrentSpaceName(space.name))
      })
      .catch((e) => {
        setStatus(e.error)
      })
  }

  return (
    <div className="login">
      <aside>
        <h3>Connected</h3>
        <article>
          <p>
            Successfully connected to{" "}
            <b>
              {cluster.host}:{cluster.port}
            </b>
            , but there are no spaces in this cluster.
          </p>
          <p>Create a space using the form on the right.</p>
        </article>
      </aside>

      <main>
        <a className="go-back" onClick={() => dispatch(disconnectCluster())}>
          <Back />
          <span>Back</span>
        </a>
        <div className="login-form">
          <h1>Create a Space</h1>
          <p className="status">{status}</p>
          <Form onSubmit={onSubmit}>
            <Input label="Name:" name="name" autoFocus required />
            <InputSubmit value="Create" />
          </Form>
        </div>
        <Dots />
      </main>
    </div>
  )
}
