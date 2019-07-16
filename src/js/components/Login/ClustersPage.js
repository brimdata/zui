/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import {Dots} from "./Dots"
import {addCluster} from "../../state/clusters/actions"
import {attemptLogin} from "../../state/clusters/thunks"
import {getSavedClusters} from "../../state/clusters/selectors"
import {setAppMenu} from "../../electron/setAppMenu"
import BrandedAside from "./BrandedAside"
import ClusterForm from "./ClusterForm"
import ClusterWelcome from "./ClusterWelcome"
import EmptyCheck from "../EmptyCheck"
import ErrorFactory from "../../models/ErrorFactory"
import SavedClusters from "./SavedClusters"

export default function ClustersPage() {
  let saved = useSelector(getSavedClusters)
  let dispatch = useDispatch()
  let [status, setStatus] = useState("Waiting for user input...")
  let [form, setForm] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
    save: true
  })

  useEffect(() => {
    setAppMenu("LOGIN")
  }, [])

  function onChange(e) {
    if (e.target.type == "checkbox") {
      setForm({...form, [e.target.name]: e.target.checked})
    } else {
      setForm({...form, [e.target.name]: e.target.value})
    }
  }

  function submit(form) {
    let {save, ...creds} = form
    setStatus("Testing connection.")
    dispatch(attemptLogin(creds))
      .then(() => {
        setStatus("Connection succeeded.")
        if (save) dispatch(addCluster(creds))
      })
      .catch((e) => {
        setStatus(ErrorFactory.create(e).message())
      })
  }

  return (
    <div className="login">
      <BrandedAside>
        <EmptyCheck array={saved} empty={<ClusterWelcome />}>
          <SavedClusters saved={saved} setForm={setForm} submit={submit} />
        </EmptyCheck>
      </BrandedAside>
      <main>
        <ClusterForm
          data={form}
          onChange={onChange}
          status={status}
          submit={submit}
        />
        <Dots />
      </main>
    </div>
  )
}
