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
import {searchKeymap, highlightSelectionMatches} from "@codemirror/search"
import {autocompletion, completionKeymap} from "@codemirror/autocomplete"
import {commentKeymap} from "@codemirror/comment"
import {rectangularSelection} from "@codemirror/rectangular-selection"
import {defaultHighlightStyle} from "@codemirror/highlight"

const EditorWrap = styled.div`
  width: 100%;
  margin: 8px 0;
  max-height: 58px;
  overflow: scroll;
`

const editorTheme = EditorView.theme(
  {
    ".cm-scroller": {
      overflow: "hidden"
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
  const isMultiLineMode = hasNewLine(inputValue)
  const dispatch = useDispatch()

  const onKeyDown = (e) => {
    if (e.key === "Enter" && e.metaKey) dispatch(submitSearch())
  }

  const onChangeUpdater = EditorView.updateListener.of((viewUpdate) => {
    if (!viewUpdate.docChanged) return
    dispatch(SearchBar.changeSearchBarInput(viewUpdate.state.doc.toString()))
  })
  const extensions = [editorTheme, onChangeUpdater]
  if (isMultiLineMode) extensions.push(baseEditorSetup)

  useEffect(() => {
    if (!view) return
    // TODO: this policy of re-rendering the whole editor contents on change needs
    // a more efficient solution
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
  }, [ref])

  return <EditorWrap ref={ref} onKeyDown={onKeyDown} />
}

export default BrimEditor
