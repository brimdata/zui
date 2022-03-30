import React, {useEffect, useRef, useState} from "react"
import styled from "styled-components"
import {useSelector} from "react-redux"
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
  dropCursor
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

const EditorWrap = styled.div<{isMultiLine: boolean}>`
  width: 100%;
  margin: 0;
  max-height: 150px;
  overflow: auto;
`

const editorTheme = EditorView.theme(
  {
    ".cm-content": {
      fontFamily: cssVar("--mono-font"),
      letterSpacing: "0.8px"
    },
    ".cm-line": {
      padding: 0
    },
    ".cm-scroller": {
      overflow: "hidden"
    },
    ".cm-gutters": {
      margin: 0,
      border: "none",
      background: "inherit"
    },
    ".cm-activeLine": {
      background: cssVar("--hawkes-blue")
    },
    ".cm-activeLineGutter": {
      background: cssVar("--hawkes-blue")
    }
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
    ...foldKeymap
  ])
]

const BrimEditor = () => {
  const ref = useRef<HTMLDivElement>()
  const [view, setView] = useState<EditorView>(null)
  const inputValue = useSelector(SearchBar.getSearchBarInputValue)
  const [currentEditorValue, setCurrentEditorValue] = useState("")
  const isMultiLineMode = hasNewLine(inputValue)
  const dispatch = useDispatch()

  const onKeyDown = (e) => {
    if (e.key === "Enter" && e.metaKey) dispatch(submitSearch())
  }

  const onChangeUpdater = EditorView.updateListener.of((viewUpdate) => {
    if (!viewUpdate.docChanged) return
    const viewContents = viewUpdate.state.doc.toString()
    setCurrentEditorValue(viewContents)
    dispatch(SearchBar.changeSearchBarInput(viewContents))
  })
  const extensions = [editorTheme, onChangeUpdater]
  if (isMultiLineMode) extensions.push(baseEditorSetup)

  useEffect(() => {
    if (!view) return
    if (inputValue === currentEditorValue) return
    view.dispatch(
      view.state.update({
        changes: {from: 0, to: view.state.doc.length, insert: inputValue}
      })
    )
  }, [inputValue])
  useEffect(() => {
    if (!view) return
    view.dispatch({
      effects: StateEffect.reconfigure.of(extensions)
    })
  }, [isMultiLineMode])
  useEffect(() => {
    if (!ref.current) return
    const state = EditorState.create({
      extensions,
      doc: inputValue
    })
    const newView = new EditorView({
      state,
      parent: ref.current
    })
    setView(newView)
    newView.focus()
  }, [])

  return (
    <EditorWrap isMultiLine={isMultiLineMode} ref={ref} onKeyDown={onKeyDown} />
  )
}

export default BrimEditor
