import {useEffect, useRef, useState} from "react"
import {EditorView} from "@codemirror/view"
import {EditorState, StateEffect} from "@codemirror/state"
import {useExtensions} from "./use-extensions"
import {hasNewLine} from "../Input"

export function useEditorView(args: {
  value: string
  disabled: boolean
  onChange: (nextValue: string) => void
}) {
  const ref = useRef<HTMLDivElement>()
  const [view, setView] = useState<EditorView>(null)
  const extensions = useExtensions({
    multiLine: hasNewLine(args.value),
    disabled: args.disabled,
    onChange: args.onChange,
  })

  // Create the EditorView on mount
  useEffect(() => {
    if (!ref.current) return
    const state = EditorState.create({
      extensions,
      doc: args.value,
    })
    const newView = new EditorView({
      state,
      parent: ref.current,
    })
    setView(newView)
    newView.focus()
  }, [])

  // Reconfigure the extensions when they change
  useEffect(() => {
    if (!view) return
    view.dispatch({
      effects: StateEffect.reconfigure.of(extensions),
    })
  }, [view, extensions])

  // Update the EditorView when value changes externally
  useEffect(() => {
    if (!view) return
    if (view.state.doc.toString() === args.value) return
    view.dispatch(
      view.state.update({
        changes: {from: 0, to: view.state.doc.length, insert: args.value},
      })
    )
  }, [args.value, view])

  return ref
}
