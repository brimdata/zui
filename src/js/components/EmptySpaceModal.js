/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"

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
    >
      <p>This space is empty.</p>
      <p>Use the boom CLI to ingest zeek logs into this space:</p>
      <code>boom post -s {name} [path to logs]</code>
    </Modal>
  )
}
