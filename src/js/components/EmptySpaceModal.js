/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import {InputSubmit} from "./form/Inputs"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import {getModal} from "../state/reducers/view"
import {showModal} from "../state/actions"
import ButtonRow from "./ButtonRow"
import Modal from "./Modal"
import TextContent from "./TextContent"

export default function EmptySpaceModal() {
  let name = useSelector(getCurrentSpaceName)
  let modal = useSelector(getModal)
  let isOpen = modal === "spaceEmpty"
  let dispatch = useDispatch()
  let onClose = () => dispatch(showModal(""))

  function onKeyPress(e) {
    if (!isOpen) return
    if (e.key === "Enter") {
      onClose()
      e.stopPropagation()
      e.preventDefault()
    }
  }

  useEffect(() => {
    document.addEventListener("keypress", onKeyPress, false)
    return () => {
      document.removeEventListener("keypress", onKeyPress, false)
    }
  }, [])

  return (
    <Modal title="Empty Space" isOpen={isOpen} onClose={onClose} width={400}>
      <TextContent>
        <p>
          There is no data in this space. Use the boom cli to ingest zeek logs
          into this space.
        </p>
        <pre>boom post -s {name} /path/to/zeek/*.log</pre>
      </TextContent>
      <ButtonRow>
        <InputSubmit value="OK" type="button" onClick={onClose} />
      </ButtonRow>
    </Modal>
  )
}
