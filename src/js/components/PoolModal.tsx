import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import renamePool from "../flows/renamePool"
import Modal from "../state/Modal"
import Pools from "../state/Pools"
import {AppDispatch} from "../state/types"
import {reactElementProps} from "../test/integration"
import InputField from "./common/forms/InputField"
import InputLabel from "./common/forms/InputLabel"
import InputLabelError from "./common/forms/InputLabelError"
import TextInput from "./common/forms/TextInput"
import ModalBox from "./ModalBox/ModalBox"

export default function PoolModal() {
  const args = useSelector(Modal.getArgs) || {}
  const {workspaceId, poolId} = args
  const pool = useSelector(Pools.get(workspaceId, poolId))
  const {name} = pool || {name: ""}
  const [nameInput, setNameInput] = useState(name)
  const [error, setError] = useState(null)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setNameInput(name)
  }, [name])

  const onSubmit = () => {
    setError(null)
    if (pool.name === nameInput) {
      dispatch(Modal.hide())
      return
    }
    dispatch(renamePool(workspaceId, poolId, nameInput))
      .then(() => {
        dispatch(Modal.hide())
      })
      .catch((e) => {
        setError(e.error)
      })
  }

  return (
    <ModalBox
      name="pool"
      title=""
      buttons={[{label: "OK", click: onSubmit}]}
      className="pool-modal"
      {...reactElementProps("poolModal")}
    >
      <PoolModalContents
        value={nameInput}
        onChange={setNameInput}
        error={error}
      />
    </ModalBox>
  )
}

const PoolModalContents = ({value, onChange, error}) => {
  return (
    <div className="pool-modal-contents">
      <InputField>
        <InputLabel>
          New Name
          {error && <InputLabelError> Error: {error}</InputLabelError>}
        </InputLabel>
        <TextInput
          autoFocus
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
          }}
        />
      </InputField>
    </div>
  )
}
