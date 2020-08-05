/* @flow */
import {useDispatch} from "react-redux"
import React, {useState} from "react"
import styled from "styled-components"

import type {Styled} from "../types/styled"
import {createSpace} from "../flows/createSpace"
import ErrorFactory from "../models/ErrorFactory"
import FileInput from "./common/forms/FileInput"
import InputField from "./common/forms/InputField"
import InputLabel from "./common/forms/InputLabel"
import Notice from "../state/Notice"
import PrimaryButton from "./common/buttons/PrimaryButton"
import SelectInput from "./common/forms/SelectInput"
import TextInput from "./common/forms/TextInput"

const Wrap: Styled<> = styled.section`
  max-width: 460px;
  width: 100%;
  margin: 0 auto;
`

const FormWrap = styled.form`
  .input-field {
    margin-bottom: 18px;
  }
`

const SubmitWrap = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
`

export default function TabCreateSpace() {
  const dispatch = useDispatch()
  const [name, setName] = useState("")
  const [kind, setKind] = useState("filestore")
  const [data_path, setDataPath] = useState("")

  const onSubmit = (e) => {
    dispatch(createSpace({name, kind, data_path})).catch((e) => {
      dispatch(Notice.set(ErrorFactory.create(e)))
    })
    e.preventDefault()
  }

  return (
    <Wrap>
      <h2>Create Space</h2>
      <FormWrap onSubmit={onSubmit}>
        <InputField>
          <InputLabel>Name</InputLabel>
          <TextInput
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputField>

        <InputField>
          <InputLabel>Storage</InputLabel>
          <SelectInput value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="filestore">File Store</option>
            <option value="archivestore">Archive Store</option>
          </SelectInput>
        </InputField>

        <InputField>
          <InputLabel>Data Directory</InputLabel>
          <FileInput
            isDirInput={true}
            placeholder="default"
            defaultValue={data_path}
            onChange={(path) => setDataPath(path)}
          />
        </InputField>

        <SubmitWrap>
          <PrimaryButton>Create</PrimaryButton>
        </SubmitWrap>
      </FormWrap>
    </Wrap>
  )
}
