/* @flow */
import {useDispatch, useSelector} from "react-redux"
import {useEffect, useState} from "react"

import {ipcRenderer} from "electron"

import type {Cluster} from "../../state/clusters/types"
import type {FormData} from "./types"
import {connectCluster} from "../../state/clusters/thunks"
import {showContextMenu} from "../../lib/System"
import Clusters from "../../state/clusters"
import brim from "../../brim"

export default function useLoginController() {
  useEffect(() => {
    ipcRenderer.send("open-login-window")
  }, [])

  let dispatch = useDispatch()
  let [form, setForm] = useState<FormData>({
    host: "",
    username: "",
    password: "",
    save: true
  })

  function submitForm() {
    let hostparts = form.host.split(":")
    let host = hostparts[0]
    let port = hostparts[1] || "9867"
    let cluster = {
      id: brim.randomHash(),
      host,
      port,
      username: form.username,
      password: form.password
    }
    dispatch(connectCluster(cluster)).then(() => {
      if (form.save) dispatch(Clusters.add(cluster))
    })
  }

  function onFormChange(e: *) {
    if (e.target.type === "checkbox") {
      setForm({...form, [e.target.name]: e.target.checked})
    } else {
      setForm({...form, [e.target.name]: e.target.value})
    }
  }

  function submitSaved(creds: Cluster) {
    let form = {
      host: [creds.host, creds.port].join(":"),
      username: creds.username,
      password: creds.password,
      save: true
    }
    setForm(form)
    dispatch(connectCluster(creds))
  }

  function showSavedMenu(cluster: Cluster) {
    showContextMenu([
      {
        label: "Remove",
        click: () => dispatch(Clusters.remove(cluster.id))
      }
    ])
  }

  return {
    form,
    submitForm,
    onFormChange,
    submitSaved,
    showSavedMenu,
    saved: useSelector(Clusters.all)
  }
}
