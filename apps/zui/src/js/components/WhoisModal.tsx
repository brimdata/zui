import {useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import Modal from "../state/Modal"
import whois from "../services/whois"
import useEnterKey from "./hooks/useEnterKey"
import {H1} from "src/components/h1"
import forms from "src/components/forms.module.css"
import classNames from "classnames"
import {PopoverModal, usePopoverModal} from "src/components/popover-modal"

export default function WhoisModal() {
  const modal = usePopoverModal()
  useEnterKey(modal.close)
  const [text, setText] = useState("...Fetching...")
  const {addr} = useSelector(Modal.getArgs)

  useEffect(() => {
    setTimeout(() => {
      whois(addr).then(setText).catch(setText)
    }, 250)
  }, [])

  return (
    <PopoverModal ref={modal.ref} className="box-s" style={{maxWidth: "75ch"}}>
      <div className={forms.form + " stack-3"}>
        <H1>Whois Lookup</H1>
        <div className="field">
          <label>Address</label>
          <input type="text" readOnly value={addr} />
        </div>
        <div className="field">
          <label>Whois Result</label>
          <div style={{overflow: "auto"}}>
            <pre>{text}</pre>
          </div>
        </div>
        <div className={classNames(forms.submission)}>
          <button
            type="button"
            onClick={modal.close}
            style={{marginLeft: "auto"}}
          >
            Done
          </button>
        </div>
      </div>
    </PopoverModal>
  )
}
