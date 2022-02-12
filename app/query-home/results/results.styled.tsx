import React, {ComponentProps} from "react"
import styled from "styled-components"

export const BG = styled.div`
  display: flex;
  flex-direction: column;
  border: none;
  position: relative;
  flex: 1;
`

export const Toolbar = styled.header`
  background: white;
  border-bottom: 1px solid var(--pane-border);
  border-top: none;
  flex: 0 0 25px;
  display: flex;
  align-items: center;
  padding: 0 6px;
  justify-content: flex-end;
`
export const Body = styled.div`
  flex: 1;
`

export const Button = styled.button`
  ${(p) => p.theme.typography.labelNormal}
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  border-radius: 5px;
  opacity: 0.4;

  &:hover {
    opacity: 1;
  }

  span {
    padding: 3px 0;
    border-bottom: 2px solid transparent;
  }

  &[aria-pressed="true"],
  &:active {
    opacity: 1;
    span {
      border-color: var(--havelock);
    }
  }
`

export const ButtonSwitch = styled.nav`
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.08);
  display: flex;
  margin: 6px 4px 12px;
`

export const Group = styled.div`
  display: flex;
`

export const TableButton = (props: ComponentProps<any>) => (
  <Button aria-label="Table View" title="Show Table View" {...props}>
    <span>Table</span>
  </Button>
)

export const ObjectsButton = (props: ComponentProps<any>) => (
  <Button aria-label="Objects View" title="Show Objects View" {...props}>
    <span>Inspector</span>
  </Button>
)
