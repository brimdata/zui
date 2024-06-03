import {Editor, useMonaco} from "@monaco-editor/react"
import {useEffect, useRef} from "react"
import {useSelector} from "react-redux"
import {cmdOrCtrl} from "src/app/core/utils/keyboard"
import Config from "src/js/state/Config"
import {Marker} from "src/js/state/Editor/types"
import {useColorScheme} from "src/util/hooks/use-color-scheme"
// import {MarkerSeverity} from "monaco-editor"

/**
 *
 * @param onSubmit Function
 * @returns onKeyDownListener attach to parent in capture phase
 */
export function useZedEditorKeyboardSubmit(onSubmit: () => void) {
  const runOnEnter = useSelector(Config.getRunOnEnter)
  return (e: React.KeyboardEvent) => {
    const isEnterKey = e.key === "Enter"
    const isModKey = e.shiftKey || cmdOrCtrl(e)
    if (isEnterKey) {
      if ((runOnEnter && !isModKey) || (!runOnEnter && isModKey)) {
        e.preventDefault()
        onSubmit()
      }
    }
  }
}

export function ZedEditor(props: {
  testId?: string
  path: string
  value: string
  onChange: (value: string | undefined, ev: any) => void
  autoFocus?: boolean
  markers?: Marker[]
}) {
  const monaco = useMonaco()
  const ref = useRef<any>()
  const {isDark} = useColorScheme()

  // Keep this thing in focus as much as possible.
  // Probably want to move this into parent.
  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.focus()
      }
    })
  }, [props.path, props.value])

  useEffect(() => {
    const ms = props.markers.map(m => {
      return {...m}
    })
    if (!monaco) return
    let zedModel = monaco.editor.getModels().find(m => m.getLanguageId() == "zed")
    if (!zedModel) {
      console.log("zed model not found, cannot curiously do zed valdiation")
    }
    monaco.editor.setModelMarkers(zedModel, "zed", ms)
    console.log("markers did change m'fer", props.markers, monaco.editor.setModelMarkers)
  }, [props.markers])

  return (
    <Editor
      wrapperProps={{
        "data-testid": props.testId,
      }}
      height="100%"
      width="100%"
      value={props.value}
      onChange={props.onChange}
      language="zed"
      theme={isDark ? "vs-dark" : "vs-light"}
      options={{
        minimap: {enabled: false},
        renderLineHighlight: "none",
        renderControlCharacters: false,
        fontSize: 14,
        fontFamily: "var(--mono-font)",
        fontVariations: "inherit",
        lineNumbersMinChars: 4,
      }}
      onMount={(editor) => {
        ref.current = editor
      }}
      path={props.path}
    />
  )
}
