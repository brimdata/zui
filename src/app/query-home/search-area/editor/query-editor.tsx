import React, {useCallback} from "react"
import styled from "styled-components"
import {useEditorView} from "./use-editor-view"
import {useDispatch} from "src/app/core/state"
import SearchBar from "src/js/state/SearchBar"
import submitSearch from "../../flows/submit-search"

const EditorWrap = styled.div<{isDisabled?: boolean}>`
  width: 100%;
  margin: 0;
  max-height: 150px;
  overflow: auto;

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
  const dispatch = useDispatch()
  const onChange = useCallback(
    (s: string) => dispatch(SearchBar.changeSearchBarInput(s)),
    []
  )
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      dispatch(submitSearch())
      e.preventDefault()
    }
  }
  const ref = useEditorView({value, disabled, onChange})

  return <EditorWrap isDisabled={disabled} ref={ref} onKeyDown={onKeyDown} />
}

export default QueryEditor
