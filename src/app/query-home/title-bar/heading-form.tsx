import React, {useRef} from "react"
import {useAutoSelect} from "src/app/core/hooks/use-auto-select"
import useEscapeKey from "src/js/components/hooks/useEscapeKey"
import styled from "styled-components"
import {ActiveQuery} from "./active-query"
import {Button} from "./button"
import {useHeadingForm} from "./use-heading-form"

const Form = styled.form`
  display: flex;
  gap: 4px;
  width: 100%;
  margin: 0 auto;
  max-width: 600px;
  padding: 0 24px;
`

const Input = styled.input`
  height: 22px;
  border: 2px solid var(--primary-color);
  font-size: 14px;
  font-weight: 700;
  padding 0 10px;
  border-radius: 6px;
  line-height: 22px;
  margin-right: 6px;
  flex: 1;
`

export default function HeadingForm({active}: {active: ActiveQuery}) {
  const form = useHeadingForm(active)
  useEscapeKey(form.onReset)
  const ref = useRef()
  useAutoSelect(ref)
  return (
    <Form onSubmit={form.onSubmit} onReset={form.onReset}>
      <Input
        autoFocus
        name="query-name"
        defaultValue={active.name() || ""}
        placeholder="Query name..."
        ref={ref}
      />
      <Button icon="check" primary type="submit">
        Save
      </Button>
      <Button type="reset">Cancel</Button>
    </Form>
  )
}
