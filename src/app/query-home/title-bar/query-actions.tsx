import React from "react"
import styled from "styled-components"
import {ActiveQuery} from "./active-query"
import {Button} from "./button"

const Actions = styled.div`
  display: flex;
  padding: 0 16px;
  gap: 10px;
  position: absolute;
  &:first-child {
    left: 0px;
  }
  &:last-child {
    right: 0px;
  }
`

export function QueryActions({query}: {query: ActiveQuery}) {
  return (
    <Actions>
      {query.isModified() && (
        <Button icon="update" primary>
          Update
        </Button>
      )}
      {!query.isAnonymous() && <Button icon="detach">Detach</Button>}
      <Button icon="plus">Create</Button>
    </Actions>
  )
}
