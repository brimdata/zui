import React, {useRef} from "react"
import {useAutoSelect} from "src/app/core/hooks/use-auto-select"
import useEscapeKey from "src/js/components/hooks/useEscapeKey"
import styled from "styled-components"
import {useHeadingForm} from "./use-heading-form"
import forms from "src/components/forms.module.css"

const Form = styled.form`
  display: flex;
  gap: 10px;
  width: 100%;
  margin: 0 auto;
  padding-left: 6px;
  padding-right: 16px;
  height: 28px;
`

const Input = styled.input`
  font-weight: 700;
  flex: 1;
`

export default function HeadingForm() {
  const form = useHeadingForm()
  const ref = useRef()
  useAutoSelect(ref)
  useEscapeKey(form.onReset)
  return (
    <Form
      onSubmit={form.onSubmit}
      onReset={form.onReset}
      className={forms.form}
    >
      <Input
        type="text"
        autoFocus
        name="query-name"
        defaultValue={form.defaultValue}
        placeholder="Query name..."
        ref={ref}
      />
      <button type="reset" className={forms.button}>
        Cancel
      </button>
      <button type="submit" className={forms.submit}>
        {form.buttonText}
      </button>
    </Form>
  )
}
