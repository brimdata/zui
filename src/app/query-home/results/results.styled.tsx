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
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 0 6px;
  border-radius: 5px;

  span {
    opacity: 0.5;
    border-top: 2px solid transparent;
    border-bottom: 2px solid transparent;
    min-width: 60px;
    font-size: 11px;
    text-transform: uppercase;
    font-weight: 500;
    padding: 0 6px;
  }

  &:hover {
    span {
      opacity: 0.7;
      transition: opacity 0.2s;
    }
  }

  &:active {
    span {
      opacity: 0.8;
    }
  }

  &[aria-pressed="true"] {
    span {
      opacity: 1;
      border-bottom-color: var(--havelock);
    }
  }
`

export const ButtonSwitch = styled.nav`
  border-radius: 6px;
  background: var(--button-background);
  display: flex;
  margin: 0;
  height: 22px;
  margin-top: -11px;
  margin-bottom: 10px;
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
