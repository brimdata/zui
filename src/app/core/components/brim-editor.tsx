import React, {useEffect, useRef, useState} from "react"
import styled from "styled-components"
import SearchBar from "../../../js/state/SearchBar"
import submitSearch from "../../query-home/flows/submit-search"
import {useDispatch} from "../state"
import {hasNewLine} from "../../query-home/search-area/Input"
import {
  EditorView,
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  dropCursor,
} from "@codemirror/view"
import {Extension, EditorState, StateEffect} from "@codemirror/state"
import {history, historyKeymap} from "@codemirror/history"
import {foldGutter, foldKeymap} from "@codemirror/fold"
import {lineNumbers, highlightActiveLineGutter} from "@codemirror/gutter"
import {bracketMatching} from "@codemirror/matchbrackets"
import {closeBrackets, closeBracketsKeymap} from "@codemirror/closebrackets"
import {highlightSelectionMatches} from "@codemirror/search"
import {autocompletion, completionKeymap} from "@codemirror/autocomplete"
import {rectangularSelection} from "@codemirror/rectangular-selection"
import {defaultHighlightStyle} from "@codemirror/highlight"
import {cssVar} from "src/js/lib/cssVar"

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

const editorTheme = EditorView.theme(
  {
    ".cm-content": {
      fontFamily: cssVar("--mono-font"),
      lineHeight: 1.6,
    },
    ".cm-gutters": {
      margin: 0,
      border: "none",
      color: cssVar("--aqua-transparent"),
      background: cssVar("--editor-background"),
    },
    ".cm-activeLine": {
      background: cssVar("--hawkes-blue"),
    },
    ".cm-activeLineGutter": {
      background: cssVar("--hawkes-blue"),
    },
  },
  {dark: false}
)

const baseEditorSetup: Extension = [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  defaultHighlightStyle.fallback,
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...historyKeymap,
    ...completionKeymap,
    ...foldKeymap,
  ]),
]

type Props = {
  value: string
  isDisabled?: boolean
}

const BrimEditor = ({value, isDisabled}: Props) => {
  const ref = useRef<HTMLDivElement>()
  const [view, setView] = useState<EditorView>(null)
  const [currentEditorValue, setCurrentEditorValue] = useState("")
  const isMultiLineMode = hasNewLine(value)
  const dispatch = useDispatch()

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      dispatch(submitSearch())
      e.preventDefault()
    }
  }

  const onChangeUpdater = EditorView.updateListener.of((viewUpdate) => {
    if (!viewUpdate.docChanged) return
    const viewContents = viewUpdate.state.doc.toString()
    setCurrentEditorValue(viewContents)
    dispatch(SearchBar.changeSearchBarInput(viewContents))
  })
  const extensions = [editorTheme, onChangeUpdater]
  if (isMultiLineMode) extensions.push(baseEditorSetup)
  if (isDisabled) extensions.push(EditorView.editable.of(false))

  useEffect(() => {
    if (!view || value === currentEditorValue || value === null) return
    view.dispatch(
      view.state.update({
        changes: {from: 0, to: view.state.doc.length, insert: value},
      })
    )
  }, [value])
  useEffect(() => {
    if (!view) return
    view.dispatch({
      effects: StateEffect.reconfigure.of(extensions),
    })
  }, [isMultiLineMode, isDisabled])
  useEffect(() => {
    if (!ref.current) return
    const state = EditorState.create({
      extensions,
      doc: value,
    })
    const newView = new EditorView({
      state,
      parent: ref.current,
    })
    setView(newView)
    newView.focus()
  }, [])

  return <EditorWrap isDisabled={isDisabled} ref={ref} onKeyDown={onKeyDown} />
}

export default BrimEditor
