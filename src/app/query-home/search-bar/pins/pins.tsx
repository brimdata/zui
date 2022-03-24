import classNames from "classnames"
import {MenuItemConstructorOptions} from "electron/main"
import {isString} from "lodash"
import {cssVar, darken, transparentize} from "polished"
import React, {useEffect, useReducer, useRef} from "react"
import Icon from "src/app/core/icon-temp"
import {useDispatch} from "src/app/core/state"
import useListener from "src/js/components/hooks/useListener"
import {showContextMenu} from "src/js/lib/System"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import styled from "styled-components"
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

    dialog {
      z-index: 999;
      top: 24px;
      border: none;
      box-shadow: var(--shadow-elevation-high);
      border-radius: 5px;
      padding: 0;
      text-align: left;

      textarea {
        font-family: var(--mono-font);
        border-radius: 5px 5px 0 0;
        padding: 16px;
        width: 300px;
        height: 50px;
        border: none;
        background: var(--input-background);
        border: 2px solid white;
      }

      .actions {
        padding: 6px;
        display: flex;
        justify-content: right;
        button {
          margin-left: 6px;
          border: none;
          background: var(--control-background);
          padding: 6px 10px;
          border-radius: 5px;
        }
      }
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
    dispatch(PinsUI.edit(1))
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
    menu: pinMenu,
    isEditing: state.editing === index,
    dispatch
  }

  switch (pin.type) {
    case "generic":
      return (
        <Pin {...props}>
          <GenericPin {...props} />
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

function GenericPin(props) {
  const dialog = useRef<HTMLDialogElement>()
  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (props.isEditing) {
      d.show()
    }
  }, [props.isEditing])

  useListener(dialog.current, "close", () => {
    if (dialog.current.returnValue === "ok") {
      props.dispatch(PinsUI.submit({value: "my new value"}))
    } else {
      props.dispatch(PinsUI.reset())
    }
  })

  return (
    <>
      <span className="pin-label">{props.pin.label || props.pin.value}</span>
      <dialog ref={dialog}>
        <form method="dialog">
          <textarea autoFocus>{props.pin.value}</textarea>
          <div className="actions">
            <button value="cancel">Cancel</button>
            <button value="ok">OK</button>
          </div>
        </form>
      </dialog>
    </>
  )
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

function Pin(props: {
  pin: QueryPin
  index: number
  menu: () => MenuItemConstructorOptions[]
  onClick: () => void
  children: any
  isEditing: boolean
}) {
  return (
    <button
      key={props.index}
      onContextMenu={() => showContextMenu(pinMenu())}
      onClick={props.onClick}
      className={classNames("pin-button", {editing: props.isEditing})}
    >
      {props.children}
    </button>
  )
}

function pinMenu() {
  return [
    {label: "Disable"},
    {label: "Remove"},
    {label: "Edit"},
    {label: "Label"},
    {label: "Copy Value"}
  ]
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
