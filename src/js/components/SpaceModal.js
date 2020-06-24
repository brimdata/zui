/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useState, useEffect} from "react"

import {reactElementProps} from "../test/integration"
import InputField from "./common/forms/InputField"
import InputLabel from "./common/forms/InputLabel"
import Modal from "../state/Modal"
import ModalBox from "./ModalBox/ModalBox"
import Spaces from "../state/Spaces"
import TextInput from "./common/forms/TextInput"
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
      <InputField>
        <InputLabel>New Name</InputLabel>
        <TextInput
          autoFocus
          label="Space Name"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
          }}
        />
      </InputField>
    </div>
  )
}
