import React from "react"
import styled from "styled-components"

const Underline = styled.div`
  position: absolute;
  bottom: 0;
  left: -4px;
  right: -4px;
  height: 2px;
  background: var(--primary-color);
  border-radius: 1px;
  opacity: 0;
`

const Button = styled.button`
  background-color: var(--button-background);
  border: none;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  min-width: 60px;
  padding: 0 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    display: flex;
    height: 100%;
    align-items: center;
    opacity: 0.5;
    position: relative;
  }

  &[aria-pressed="true"] {
    span {
      opacity: 1;
    }
    ${Underline} {
      opacity: 1;
    }
  }

  &:hover:not([aria-pressed="true"]) {
    background: var(--sidebar-item-hover);
    span {
      opacity: 0.7;
    }
  }

  &:active:not([aria-pressed="true"]) {
    background: var(--sidebar-item-active);
    box-shadow: var(--sidebar-item-active-shadow);
  }

  &:first-child {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  &:last-child {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
`

const BG = styled.div<{minWidth: number}>`
  user-select: none;
  border-radius: 6px;
  height: 22px;
  display: flex;
  gap: 1px;

  ${Button} {
    min-width: ${(props) => props.minWidth}px;
  }
`

type Option = {
  label: string
  click: React.MouseEventHandler
  active: boolean
}

function Option(props: Option) {
  return (
    <Button onClick={props.click} aria-pressed={props.active}>
      <span>
        {props.label}
        <Underline />
      </span>
    </Button>
  )
}

type Props = {
  options: Option[]
  minWidth?: number
}

export function SwitchButton(props: Props) {
  return (
    <BG minWidth={props.minWidth || 60}>
      {props.options.map((props, i) => (
        <Option key={i} {...props} />
      ))}
    </BG>
  )
}
