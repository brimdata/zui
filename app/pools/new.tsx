import {useDispatch} from "react-redux"
import React, {useState} from "react"
import styled from "styled-components"

import ErrorFactory from "../../src/js/models/ErrorFactory"
import InputField from "../../src/js/components/common/forms/InputField"
import InputLabel from "../../src/js/components/common/forms/InputLabel"
import Notice from "../../src/js/state/Notice"
import PrimaryButton from "../../src/js/components/common/buttons/PrimaryButton"
import TextInput from "../../src/js/components/common/forms/TextInput"
import {AppDispatch} from "../../src/js/state/types"
import tabHistory from "app/router/tab-history"
import {createPool} from "../core/pools/create-pool"
import {lakePoolPath} from "app/router/utils/paths"
import Current from "src/js/state/Current"
import useSelect from "app/core/hooks/use-select"

const Wrap = styled.section`
  max-width: 460px;
  width: 100%;
  margin: 0 auto;
`

const FormWrap = styled.form`
  ${InputField} {
    margin-bottom: 18px;
  }
`

const SubmitWrap = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
`

export default function TabCreatePool() {
  const dispatch = useDispatch<AppDispatch>()
  const [name, setName] = useState("")
  const select = useSelect()

  const onSubmit = (e) => {
    const lakeId = select(Current.getLakeId)
    e.preventDefault()
    dispatch(createPool({name}))
      .then((id) => {
        dispatch(tabHistory.push(lakePoolPath(id, lakeId)))
      })
      .catch((e) => {
        dispatch(Notice.set(ErrorFactory.create(e)))
      })
  }

  return (
    <Wrap>
      <h2>Create Pool</h2>
      <FormWrap onSubmit={onSubmit}>
        <InputField>
          <InputLabel>Name</InputLabel>
          <TextInput
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputField>
        <SubmitWrap>
          <PrimaryButton>Create</PrimaryButton>
        </SubmitWrap>
      </FormWrap>
    </Wrap>
  )
}
