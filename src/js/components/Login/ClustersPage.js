/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import {ipcRenderer} from "electron"

import {addCluster} from "../../state/clusters/actions"
import {connectCluster} from "../../state/clusters/thunks"
import {getBackendError} from "../../backend"
import {getSavedClusters} from "../../state/clusters/selectors"
import Brand from "./Brand"
import ClusterForm from "./ClusterForm"
import ClusterWelcome from "./ClusterWelcome"
import EmptyCheck from "../EmptyCheck"
import SavedClusters from "./SavedClusters"

export default function ClustersPage() {
  let saved = useSelector(getSavedClusters)
  let error = useSelector(getBackendError)
  let dispatch = useDispatch()
  let [form, setForm] = useState({
    host: "",
    username: "",
    password: "",
    save: true
  })

  useEffect(() => {
    ipcRenderer.send("open-login-window")
  }, [])

  function onChange(e) {
    if (e.target.type === "checkbox") {
      setForm({...form, [e.target.name]: e.target.checked})
    } else {
      setForm({...form, [e.target.name]: e.target.value})
    }
  }

  function submit(form) {
    let hostparts = form.host.split(":")
    let host = hostparts[0]
    let port = hostparts[1] || "9867"
    let creds = {
      host,
      port,
      username: form.username,
      password: form.password
    }
    dispatch(connectCluster(creds)).then(() => {
      if (form.save) dispatch(addCluster(creds))
    })
  }

  return (
    <div className="login">
      <aside>
        <Brand />
        <EmptyCheck array={saved} empty={<ClusterWelcome />}>
          <SavedClusters saved={saved} setForm={setForm} submit={submit} />
        </EmptyCheck>
      </aside>
      <main>
        <ClusterForm
          data={form}
          onChange={onChange}
          status={error ? error.message() : ""}
          submit={submit}
        />
      </main>
    </div>
  )
}
