import React, {useRef} from "react"
import {useAutoSelect} from "src/app/core/hooks/use-auto-select"
import {InputButton} from "src/components/input-button"
import {SubmitButton} from "src/components/submit-button"
import TextInput from "src/js/components/common/forms/TextInput"
import useEscapeKey from "src/js/components/hooks/useEscapeKey"
import styled from "styled-components"
import {useHeadingForm} from "./use-heading-form"

const Form = styled.form`
  display: flex;
  gap: 10px;
  width: 100%;
  margin: 0 auto;
`

const Input = styled(TextInput)`
  font-weight: 700;
  flex: 1;
`

export default function HeadingForm() {
  const form = useHeadingForm()
  const ref = useRef()
  useAutoSelect(ref)
  useEscapeKey(form.onReset)
  return (
    <Form onSubmit={form.onSubmit} onReset={form.onReset}>
      <Input
        autoFocus
        name="query-name"
        defaultValue={form.defaultValue}
        placeholder="Query name..."
        ref={ref}
      />
      <InputButton type="reset">Cancel</InputButton>
      <SubmitButton icon="check">{form.buttonText}</SubmitButton>
    </Form>
  )
}
