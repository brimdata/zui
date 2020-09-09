/* @flow */
import React from "react"
import styled from "styled-components"

import type {Styled} from "../../types/styled"
import Pins from "./Pins"
import Error from "./Error"
import HistoryArrows from "./HistoryArrows"
import Input from "./Input"
import InputBackdrop from "./InputBackdrop"
import MenuAction from "./MenuAction"
import PinAction from "./PinAction"
import Spinner from "./Spinner"
import SubmitButton from "./SubmitButton"
import TargetSelect from "./TargetSelect"

const Wrap: Styled<> = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  -webkit-app-region: no-drag;
  margin-bottom: 12px;

  & > * {
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }
`

const Group = styled.div`
  display: flex;
  flex: ${(p) => p.flex || "initial"};
  flex-direction: column;
`

const InputActions = styled.div`
  display: flex;
  margin-right: 8px;
`

export function SearchBar() {
  return (
    <Wrap className="search-bar">
      <HistoryArrows />
      <Group flex={1}>
        <InputBackdrop>
          <TargetSelect />
          <Input />
          <Spinner />
          <InputActions>
            <PinAction />
            <MenuAction />
          </InputActions>
          <SubmitButton />
        </InputBackdrop>
        <Error />
        <Pins />
      </Group>
    </Wrap>
  )
}
