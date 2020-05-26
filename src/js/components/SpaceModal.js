/* @flow */
import React, {useState} from "react"

import ModalBox from "./ModalBox/ModalBox"
import {useDispatch, useSelector} from "react-redux"
import {reactElementProps} from "../test/integration"
import Modal from "../state/Modal"
import Spaces from "../state/Spaces"
import {Input, InputSubmit} from "./form/Inputs"
import Form from "./form/Form"
import renameSpace from "../flows/renameSpace"

export default function SpaceModal() {
  return (
    <ModalBox
      name="space"
      title=""
      buttons={[]}
      {...reactElementProps("spaceModal")}
    >
      <SpaceModalContents />
    </ModalBox>
  )
}

const SpaceModalContents = () => {
  const {spaceId, clusterId} = useSelector(Modal.getArgs)
  const space = useSelector(Spaces.get(clusterId, spaceId))
  const {name} = space || {name: ""}
  const [nameInput, setNameInput] = useState(name)
  const dispatch = useDispatch()

  const onSubmit = () => {
    dispatch(renameSpace(clusterId, spaceId, nameInput))
    dispatch(Modal.hide())
  }

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <Input
          label="Space Name"
          value={nameInput}
          onChange={(e) => {
            setNameInput(e.target.value)
          }}
        />
        <InputSubmit value={"Rename"} />
      </Form>
    </div>
  )
}
