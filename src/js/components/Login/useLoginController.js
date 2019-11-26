/* @flow */
import {useDispatch, useSelector} from "react-redux"
import {useEffect, useState} from "react"

import {ipcRenderer} from "electron"

import type {Cluster} from "../../state/clusters/types"
import type {FormData} from "./types"
import {addCluster, removeCluster} from "../../state/clusters/actions"
import {connectCluster} from "../../state/clusters/thunks"
import {getSavedClusters} from "../../state/clusters/selectors"
import {showContextMenu} from "../../lib/System"

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

  function showSavedMenu(creds: Cluster) {
    showContextMenu([
      {
        label: "Remove",
        click: () => dispatch(removeCluster(creds))
      }
    ])
  }

  return {
    form,
    submitForm,
    onFormChange,
    submitSaved,
    showSavedMenu,
    saved: useSelector(getSavedClusters)
  }
}
