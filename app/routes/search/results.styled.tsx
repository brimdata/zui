import Icon from "app/core/Icon"
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
  padding: 0 12px;
  justify-content: space-between;
`
export const Body = styled.div`
  flex: 1;
`

export const Button = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 34px;
  border-radius: 3px;

  svg {
    width: 18px;
    height: 18px;
    fill: var(--slate);
  }
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  &[aria-pressed="true"],
  &:active {
    background: rgba(0, 0, 0, 0.08);
  }
`

export const ButtonSwitch = styled.nav`
  border-radius: 3px;
  background: rgba(0, 0, 0, 0);
  display: flex;

  transition: background 300ms;
  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
  ${Button}:not(.active):hover {
    background: none;
  }
`

export const Group = styled.div`
  display: flex;
`

export const TableButton = (props: ComponentProps<any>) => (
  <Button aria-label="Table View" title="Show Table View" {...props}>
    <Icon name="columns" />
  </Button>
)

export const ObjectsButton = (props: ComponentProps<any>) => (
  <Button aria-label="Objects View" title="Show Objects View" {...props}>
    <Icon name="braces" />
  </Button>
)

export const ExpandAllButton = (props: ComponentProps<any>) => (
  <Button aria-label="Expand All" title="Expand All" {...props}>
    <Icon name="expand" />
  </Button>
)

export const CollapseAllButton = (props: ComponentProps<any>) => (
  <Button aria-label="Collapse All" title="Collapse All" {...props}>
    <Icon name="collapse" />
  </Button>
)
