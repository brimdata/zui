import {cssVar, lighten, darken} from "polished"
import React from "react"
import styled from "styled-components"
import {GenericQueryPin} from "./reducer"

const Field = styled.div`
  margin-bottom: 10px;
  label {
    font-weight: 500;
    display: block;
    margin-bottom: 6px;
  }
  input,
  textarea {
    background: var(--input-background);
    border: none;
    border-radius: 5px;
    font-family: var(--mono-font);
    line-height: 1.5;
  }
  input {
    width: 66%;
    height: 26px;
    padding: 0 6px;
  }
  textarea {
    width: 100%;
    padding: 6px;
    height: calc(26px * 3);
  }
`

const Actions = styled.div`
  margin-top: 26px;
  text-align: center;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`

const Button = styled.button`
  background: var(--control-background);
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  color: var(--foreground-color);
  padding: 0 8px;
  min-width: 60px;
  font-weight: 500;
  &:hover {
    background: var(--control-hover);
  }
  &:active {
    background: var(--control-active);
  }
`

const primary = cssVar("--primary-color") as string
const hover = lighten(0.03, primary)
const active = darken(0.03, primary)
const PrimaryButton = styled(Button)`
  background: var(--primary-color);
  color: white;
  &:hover {
    background: ${hover};
  }
  &:active {
    background: ${active};
  }
`

export function GenericPinForm(props: {pin: GenericQueryPin}) {
  return (
    <form method="dialog">
      <Field>
        <label htmlFor="value">Value</label>
        <textarea autoFocus name="value">
          {props.pin.value}
        </textarea>
      </Field>

      <Field>
        <label htmlFor="label">Label</label>
        <input
          name="label"
          placeholder="Same as value"
          defaultValue={props.pin.label}
        />
      </Field>

      <Actions>
        <Button value="cancel">Cancel</Button>
        <PrimaryButton value="ok">OK</PrimaryButton>
      </Actions>
    </form>
  )
}
