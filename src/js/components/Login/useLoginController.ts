import {useDispatch, useSelector} from "react-redux"
import {useEffect, useState} from "react"

import {ipcRenderer} from "electron"

import {Cluster} from "../../state/Clusters/types"
import {FormData} from "./types"
import {connectCluster} from "../../state/Clusters/flows"
import {showContextMenu} from "../../lib/System"
import Clusters from "../../state/Clusters"
import brim from "../../brim"
import {AppDispatch} from "src/js/state/types"

export default function useLoginController() {
  useEffect(() => {
    ipcRenderer.send("open-login-window")
  }, [])

  const dispatch = useDispatch<AppDispatch>()
  const [form, setForm] = useState<FormData>({
    host: "",
    username: "",
    password: "",
    save: true
  })

  function submitForm() {
    const hostparts = form.host.split(":")
    const host = hostparts[0]
    const port = hostparts[1] || "9867"
    const cluster = {
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

  function onFormChange(e: any) {
    if (e.target.type === "checkbox") {
      setForm({...form, [e.target.name]: e.target.checked})
    } else {
      setForm({...form, [e.target.name]: e.target.value})
    }
  }

  function submitSaved(creds: Cluster) {
    const form = {
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
