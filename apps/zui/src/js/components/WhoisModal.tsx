import {useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import modal from "../state/Modal"
import whois from "../services/whois"
import useEnterKey from "./hooks/useEnterKey"
import modals from "src/components/modals.module.css"
import {H1} from "src/components/h1"
import forms from "src/components/forms.module.css"
import classNames from "classnames"

export default function WhoisModal({onClose}) {
  useEnterKey(onClose)
  const [text, setText] = useState("...Fetching...")
  const {addr} = useSelector(modal.getArgs)

  useEffect(() => {
    setTimeout(() => {
      whois(addr).then(setText).catch(setText)
    }, 250)
  }, [])

  return (
    <div style={{width: 600}} className={classNames(modals.form, forms.form)}>
      <H1 className={modals.title}>Whois Lookup</H1>
      <div>
        <label>Address</label>
        <input type="text" readOnly value={addr} />
      </div>
      <div>
        <label>Whois Result</label>
      </div>
      <div style={{overflow: "auto"}}>
        <pre className={modals.pre}>{text}</pre>
      </div>
      <div className={classNames(forms.submission, modals.submission)}>
        <button type="button" onClick={onClose} style={{marginLeft: "auto"}}>
          Done
        </button>
      </div>
    </div>
  )
}
