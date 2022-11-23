import React, {useRef} from "react"
import styled from "styled-components"
import {Help} from "./help"
import {InputButton} from "./input-button"

const BG = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export function FileInput(
  props: {
    files: File[]
    setFiles: (files: File[]) => void
  } & JSX.IntrinsicElements["input"]
) {
  const input = useRef<HTMLInputElement>()
  const {files, setFiles, autoFocus, ...inputProps} = props
  const count = files ? files.length : 0
  return (
    <BG>
      <InputButton
        type="button"
        icon="doc-plain"
        text="Choose Files..."
        autoFocus={autoFocus}
        onClick={() => {
          input.current?.click()
        }}
      />
      <Help>
        {count === 0
          ? "No Files Selected"
          : `${count} File${count > 1 ? "s" : ""} Selected`}
      </Help>
      <input
        {...inputProps}
        ref={input}
        type="file"
        style={{display: "none"}}
        onChange={(e) => {
          setFiles(Array.from(e.currentTarget.files))
          props.onChange && props.onChange(e)
        }}
      />
    </BG>
  )
}
