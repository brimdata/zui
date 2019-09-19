/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {InputSubmit} from "./form/Inputs"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import {getModal} from "../state/reducers/view"
import {showModal} from "../state/actions"
import Modal from "./Modal"

export default function EmptySpaceModal() {
  let name = useSelector(getCurrentSpaceName)
  let modal = useSelector(getModal)
  let dispatch = useDispatch()
  let onClose = () => dispatch(showModal(""))

  return (
    <Modal
      title="Empty Space"
      isOpen={modal === "spaceEmpty"}
      onClose={onClose}
      width={400}
    >
      <p>
        There is no data in this space. Use the boom cli to ingest zeek logs
        into this space.
      </p>
      <pre>boom post -s {name} /path/to/zeek/*.log</pre>
      <div className="button-row">
        <InputSubmit value="OK" type="button" onClick={onClose} />
      </div>
    </Modal>
  )
}
