import React, {useCallback} from "react"
import styled from "styled-components"
import {useEditorView} from "./use-editor-view"
import {useDispatch} from "src/app/core/state"
import SearchBar from "src/js/state/SearchBar"
import submitSearch from "../../flows/submit-search"
import ConfigPropValues from "src/js/state/ConfigPropValues"
import {useSelector} from "react-redux"

const EditorWrap = styled.div<{isDisabled?: boolean}>`
  height: 100%;
  width: 100%;
  ${(p) =>
    p.isDisabled &&
    `
    cursor: not-allowed;
  `}
`

type Props = {
  disabled: boolean
  value: string
}

const QueryEditor = ({value, disabled}: Props) => {
  const runOnEnter = useSelector(
    ConfigPropValues.get("editor", "runQueryOnEnter")
  )
  console.log(runOnEnter)
  const dispatch = useDispatch()
  const onChange = useCallback(
    (s: string) => dispatch(SearchBar.changeSearchBarInput(s)),
    []
  )
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if ((runOnEnter && !e.shiftKey) || (!runOnEnter && e.metaKey)) {
        e.preventDefault()
        dispatch(submitSearch())
      }
    }
  }
  const ref = useEditorView({value, disabled, onChange})

  return (
    <EditorWrap
      aria-label="editor"
      isDisabled={disabled}
      ref={ref}
      onKeyDown={onKeyDown}
    />
  )
}

export default QueryEditor
