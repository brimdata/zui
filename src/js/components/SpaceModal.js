/* @flow */
import React, {useState, useEffect} from "react"

import ModalBox from "./ModalBox/ModalBox"
import {useDispatch, useSelector} from "react-redux"
import {reactElementProps} from "../test/integration"
import Modal from "../state/Modal"
import Spaces from "../state/Spaces"
import {Input} from "./form/Inputs"
import renameSpace from "../flows/renameSpace"

export default function SpaceModal() {
  const args = useSelector(Modal.getArgs) || {}
  const {clusterId, spaceId} = args
  const space = useSelector(Spaces.get(clusterId, spaceId))
  const {name} = space || {name: ""}
  const [nameInput, setNameInput] = useState(name)
  const dispatch = useDispatch()

  useEffect(() => {
    setNameInput(name)
  }, [name])

  const onSubmit = () => {
    dispatch(renameSpace(clusterId, spaceId, nameInput))
    dispatch(Modal.hide())
  }

  return (
    <ModalBox
      name="space"
      title=""
      buttons={[{label: "OK", click: onSubmit}]}
      className="space-modal"
      {...reactElementProps("spaceModal")}
    >
      <SpaceModalContents value={nameInput} onChange={setNameInput} />
    </ModalBox>
  )
}

const SpaceModalContents = ({value, onChange}) => {
  return (
    <div className="space-modal-contents">
      <Input
        label="Space Name"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
      />
    </div>
  )
}
