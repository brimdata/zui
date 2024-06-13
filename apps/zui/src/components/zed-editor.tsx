import {Editor} from "@monaco-editor/react"
import {useEffect, useRef} from "react"
import {useSelector} from "react-redux"
import {cmdOrCtrl} from "src/util/keyboard"
import Config from "src/js/state/Config"
import {Marker} from "src/js/state/Editor/types"
import {useColorScheme} from "src/util/hooks/use-color-scheme"
import {ZedEditorHandler} from "./zed-editor-handler"

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
  const {isDark} = useColorScheme()
  const handler = useRef(new ZedEditorHandler()).current

  handler.props = props

  useEffect(() => handler.setErrors(props.markers), [props.markers])

  return (
    <Editor
      height="100%"
      language="zed"
      onChange={props.onChange}
      onMount={handler.onMount.bind(handler)}
      path={props.path}
      theme={isDark ? "vs-dark" : "vs-light"}
      value={props.value}
      width="100%"
      wrapperProps={{
        "data-testid": props.testId,
      }}
      options={{
        minimap: {enabled: false},
        renderLineHighlight: "none",
        renderControlCharacters: false,
        fontSize: 14,
        fontFamily: "var(--mono-font)",
        fontVariations: "inherit",
        lineNumbersMinChars: 4,
      }}
    />
  )
}
