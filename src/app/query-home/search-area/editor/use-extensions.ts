import {useMemo} from "react"
import {
  EditorView,
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  dropCursor,
} from "@codemirror/view"
import {Extension, EditorState} from "@codemirror/state"
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

export function useExtensions(args: {
  multiLine: boolean
  disabled: boolean
  onChange: (update: any) => void
}) {
  return useMemo(() => {
    const onChangeUpdater = EditorView.updateListener.of((viewUpdate) => {
      if (!viewUpdate.docChanged) return
      args.onChange(viewUpdate.state.doc.toString())
    })
    const extensions = [editorTheme, onChangeUpdater]
    if (args.multiLine) extensions.push(baseEditorSetup)
    if (args.disabled) extensions.push(EditorView.editable.of(false))
    return extensions
  }, [args.multiLine, args.disabled, args.onChange])
}
