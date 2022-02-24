import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import renamePool from "../flows/renamePool"
import Modal from "../state/Modal"
import Pools from "../state/Pools"
import {AppDispatch} from "../state/types"
import InputField from "./common/forms/InputField"
import InputLabel from "./common/forms/InputLabel"
import InputLabelError from "./common/forms/InputLabelError"
import TextInput from "./common/forms/TextInput"
import ModalBox from "./ModalBox/ModalBox"
import {Pool} from "src/app/core/pools/pool"

export default function PoolModal() {
  const args = useSelector(Modal.getArgs) || {}
  const {lakeId, poolId} = args
  const pool = useSelector(Pools.get(lakeId, poolId)) as Pool
  const name = (pool && pool.name) || ""
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
    dispatch(renamePool(poolId, nameInput))
      .then(() => {
        dispatch(Modal.hide())
        return
      })
      .catch((e) => {
        console.log(e)
        setError(e.error)
      })
  }

  return (
    <ModalBox
      name="pool"
      title=""
      buttons={[{label: "OK", click: onSubmit}]}
      className="pool-modal"
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
