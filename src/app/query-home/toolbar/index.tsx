import React from "react"
import QueryPageTitle from "./query-page-title"
import styled from "styled-components"
import {ActionButtonProps} from "./action-button"
import {GUTTER} from "./action-buttons"
import Actions from "./actions"

const Wrap = styled.div`
  margin-bottom: 6px;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Left = styled.div`
  overflow: hidden;
  min-width: 150px;
  flex: 1 1 0;
  margin-right: 12px;
  align-items: center;
`

const Right = styled.div`
  padding-top: 2px; // for the outline state to not get clipped
  overflow: hidden;
  display: flex;
  flex: 0 1 auto;
  width: min-content;

  & > * {
    margin-right: ${GUTTER}px;
    &:last-child {
      margin-right: 0;
    }
  }
`

type Props = {
  actions: ActionButtonProps[]
}

const Toolbar = ({actions}: Props) => {
  return (
    <Wrap>
      <Row>
        <Left>
          <QueryPageTitle />
        </Left>
        <Right>
          <Actions actions={actions} />
        </Right>
      </Row>
    </Wrap>
  )
}

export default Toolbar
