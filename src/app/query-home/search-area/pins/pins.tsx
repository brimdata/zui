import React from "react"
import {MenuItemConstructorOptions} from "electron/main"
import {isString} from "lodash"
import {cssVar, darken, transparentize} from "polished"
import {useEffect, useReducer} from "react"
import Icon from "src/app/core/icon-temp"
import {useDispatch} from "src/app/core/state"
import {showContextMenu} from "src/js/lib/System"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import styled from "styled-components"
import {GenericPinForm} from "./generic-pin-form"
import {Pin} from "./pin"
import PinsUI, {QueryPin} from "./reducer"

const primary = cssVar("--primary-color") as string
const buttonColor = transparentize(0.8, primary)
const buttonHoverColor = transparentize(0.75, primary)
const buttonActiveColor = transparentize(0.7, primary)
const labelColor = darken(0.4, primary)
const secondaryLabelColor = darken(0.3, primary)

const Container = styled.section`
  margin-top: 16px;
  margin-bottom: 6px;
  display: flex;

  button.pin-button {
    position: relative;
    margin-right: 4px;
    max-width: 300px;
    height: 20px;
    white-space: nowrap;
    line-height: 1;

    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: ${labelColor};
    background: ${buttonColor};
    border: none;
    border-radius: 8px;
    box-shadow: 0;
    border: 1px solid transparent;
    &:hover {
      background: ${buttonHoverColor};
    }

    &:active {
      background: ${buttonActiveColor};
    }

    span.pin-label {
      font-family: var(--mono-font);
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 15px;
    }

    span.secondary {
      font-family: var(--mono-font);
      opacity: 0.5;
      margin-right: 8px;
      text-transform: uppercase;
      font-size: 11px;
      color: ${secondaryLabelColor};
      font-weight: bold;
      flex-shrink: 0;
    }

    svg {
      width: 13px;
      height: 13px;
    }
    i {
      flex: 0 0 13px;
      flex-basis: 13px;
      margin-left: 4px;
    }
  }
`

export function Pins() {
  const [state, dispatch] = useReducer(PinsUI.reducer, {
    pins: [],
    editing: null
  })

  useEffect(() => {
    dispatch(PinsUI.add({type: "from", value: "finance-data"}))
    dispatch(
      PinsUI.add({type: "generic", value: "has(ts)", label: "Has a timestamp"})
    )
  }, [])

  return (
    <>
      <Container>
        {state.pins.map((pin, index) => pinSwitch(pin, index, dispatch, state))}
      </Container>
    </>
  )
}

function pinSwitch(pin: QueryPin, index: number, dispatch, state) {
  function onClick() {
    dispatch(PinsUI.edit(index))
  }
  const props = {
    pin,
    index,
    onClick,
    isEditing: state.editing === index,
    dispatch,
    menu: () => [] as MenuItemConstructorOptions[],
    dialog: GenericPinForm
  }

  switch (pin.type) {
    case "generic":
      return (
        <Pin {...props}>
          <span className="pin-label">{pin.label || pin.value}</span>
        </Pin>
      )
    case "from":
      return (
        <Pin {...props}>
          <FromPin {...props} />
        </Pin>
      )
  }
}

function FromPin(props) {
  const dispatch = useDispatch()

  useEffect(() => {
    if (props.isEditing) {
      dispatch(showPoolMenu()).then((value: string) => {
        if (isString(value)) props.dispatch(PinsUI.submit({value}))
        else props.dispatch(PinsUI.reset())
      })
    }
  }, [props.isEditing])

  return (
    <>
      <span className="secondary">from</span>
      <span className="pin-label">{props.pin.value}</span>
      <Icon name="chevron-down" />
    </>
  )
}

const showPoolMenu = () => (dispatch, getState) => {
  const s = getState()
  const lakeId = Current.getLakeId(s)
  const pools = Pools.getPools(lakeId)(s)

  let selected = null
  const template = pools
    ? pools.map((p) => ({
        label: p.name,
        click: () => {
          selected = p.name
        }
      }))
    : [
        {
          label: "No pools in lake",
          enabled: false
        }
      ]

  return new Promise((resolve) => {
    showContextMenu(template, {
      callback: () => resolve(selected)
    })
  })
}
