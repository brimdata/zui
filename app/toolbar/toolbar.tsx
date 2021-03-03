import React from "react"
import {useLocation} from "react-router"
import SearchPageTitle from "src/js/components/SearchPageTitle"
import SpanControls from "src/js/components/Span/SpanControls"
import styled from "styled-components"
import {ActionButtonProps} from "./action-button"
import MainViewSwitch from "./main-view-switch"
import ResponsiveActions from "./responsive-actions"

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
  const location = useLocation()
  return (
    <Wrap>
      <SearchPageTitle />
      <Row>
        <Group>
          <MainViewSwitch />
        </Group>
        <ResponsiveActions actions={actions} locationKey={location.key} />
        <SpanControls submit={submit} />
      </Row>
    </Wrap>
  )
}
