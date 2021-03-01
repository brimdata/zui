import React from "react"
import SearchPageTitle from "src/js/components/SearchPageTitle"
import SpanControls from "src/js/components/Span/SpanControls"
import styled from "styled-components"
import {ActionButtonProps} from "./action-button"
import Actions from "./actions"
import MainViewSwitch from "./main-view-switch"

const Wrap = styled.div`
  margin-bottom: 6px;
`

const Group = styled.div`
  display: flex;
  & > * {
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;

  & > * {
  }
`

type Props = {
  submit: () => void
  actions: ActionButtonProps[]
}

export function Toolbar({submit, actions}: Props) {
  return (
    <Wrap>
      <SearchPageTitle />
      <Row>
        <Group>
          <MainViewSwitch />
        </Group>
        <Actions actions={actions} />
        <SpanControls submit={submit} />
      </Row>
    </Wrap>
  )
}
