import React from "react"
import SearchPageTitle from "src/js/components/SearchPageTitle"
import SpanControls from "src/js/components/Span/SpanControls"
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
  align-items: flex-start;
`

const Left = styled.div`
  overflow: hidden;
  min-width: 150px;
  flex: 1 1 0;
  margin-right: 12px;
  align-items: center;
`

const Right = styled.div`
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
  submit: () => void
  actions: ActionButtonProps[]
}

/**
 * The left side has a flex basis of 0 but will grow to fill the available space.
 * The right side has a flex basis of min-content, will not grow, and will shrink
 * allowing the toolbar buttons to collapse into a context menu.
 */
export function Toolbar({submit, actions}: Props) {
  return (
    <Wrap>
      <Row>
        <Left>
          <SearchPageTitle />
        </Left>
        <Right>
          <Actions actions={actions} />
          <SpanControls submit={submit} />
        </Right>
      </Row>
    </Wrap>
  )
}
