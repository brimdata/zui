import React from "react"
import styled from "styled-components"
import {ActionButtonProps} from "./action-button"
import {GUTTER} from "./action-buttons"
import Actions from "./actions"
import QueryHeader from "./query-header"

const Wrap = styled.div`
  padding: 10px 16px;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.11);
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Left = styled.div`
  min-width: 200px;
  flex: 1 1 0;
  margin-right: 12px;
  align-items: center;
`

const Right = styled.div`
  overflow: hidden;
  padding-top: 2px; // for the outline state to not get clipped
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
          <QueryHeader />
        </Left>
        <Right>
          <Actions actions={actions} />
        </Right>
      </Row>
    </Wrap>
  )
}

export default Toolbar
