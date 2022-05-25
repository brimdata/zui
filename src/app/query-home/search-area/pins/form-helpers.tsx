import {cssVar, darken, lighten} from "polished"
import {FormEvent} from "react"
import styled from "styled-components"

export const Field = styled.div`
  margin-bottom: 10px;
`

export const Label = styled.label`
  font-weight: 500;
  display: block;
  margin-bottom: 6px;
`

export const Input = styled.input`
  background: var(--input-background);
  border: none;
  border-radius: 5px;
  font-family: var(--mono-font);
  line-height: 1.5;
  padding: 0 6px;
  width: 100%;
  height: 26px;
`

export const TextArea = styled.textarea`
  background: var(--input-background);
  border: none;
  border-radius: 5px;
  font-family: var(--mono-font);
  line-height: 1.5;
  width: 100%;
  padding: 6px;
  height: calc(26px * 3);
`

export const Actions = styled.div`
  margin-top: 26px;
  text-align: center;
  display: flex;
  justify-content: space-between;
`

export const ActionsGroup = styled.div`
  display: flex;
  gap: 12px;
`

export const Button = styled.button`
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
export const PrimaryButton = styled(Button)`
  background: var(--primary-color);
  color: white;
  &:hover {
    background: ${hover};
  }
  &:active {
    background: ${active};
  }
`

const red = cssVar("--red") as string
const darkRed = darken(0.1, red)

export const RedLink = styled.a`
  color: ${red};
  cursor: default;
  &:active {
    color: ${darkRed};
  }
`

export function getFormData(e: FormEvent<HTMLFormElement>): any {
  const form = e.target as HTMLFormElement
  return Object.fromEntries(new FormData(form).entries())
}
