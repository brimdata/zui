import {EditorView} from "@codemirror/view"
import {cssVar} from "src/js/lib/cssVar"

export const editorTheme = EditorView.theme(
  {
    "&": {
      background: "var(--editor-background)",
      height: "100%",
    },
    "&.cm-editor": {
      padding: "0",
    },
    "&.cm-editor.cm-focused": {
      outline: "none",
    },
    ".cm-scroller": {
      fontFamily: cssVar("--mono-font"),
      lineHeight: "21px",
      fontSize: "15px",
      color: "var(--foreground-color)",
      overflow: "auto",
    },
    ".cm-gutters": {
      border: "none",
      background: "transparent",
      color: "var(--foreground-color)",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      opacity: 0.2,
      minWidth: 0,
      padding: "0 20px 0 22px",
    },
    ".cm-activeLine": {
      background: "transparent",
    },
    ".cm-activeLineGutter": {
      background: "transparent",
    },
  },
  {dark: false}
)
