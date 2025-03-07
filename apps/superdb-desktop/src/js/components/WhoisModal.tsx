import {useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import Modal from "../state/Modal"
import whois from "../services/whois"
import useEnterKey from "./hooks/useEnterKey"
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
    <PopoverModal
      ref={modal.ref}
      className="box gutter-space-m"
      style={{maxWidth: "75ch"}}
    >
      <form className="flow">
        <h1>Whois Lookup</h1>
        <section className="flow region region-space-xl">
          <label>Address</label>
          <input type="text" readOnly value={addr} />
          <label>Whois Result</label>
          <div style={{overflow: "auto"}}>
            <pre>{text}</pre>
          </div>
        </section>
        <button
          type="button"
          onClick={modal.close}
          style={{display: "block", marginInlineStart: "auto"}}
          className="button"
        >
          Done
        </button>
      </form>
    </PopoverModal>
  )
}
