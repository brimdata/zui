import {Editor, useMonaco} from "@monaco-editor/react"
import {useEffect, useMemo, useRef} from "react"
import {useSelector} from "react-redux"
import {cmdOrCtrl} from "src/app/core/utils/keyboard"
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
  const ref = useRef<any>()
  const {isDark} = useColorScheme()
  const monaco = useMonaco()
  const handler = useMemo(
    () => new ZedEditorHandler(monaco, ref.current),
    [monaco, ref.current]
  )

  useEffect(() => handler.focus(), [props.path, props.value, handler])
  useEffect(() => handler.setErrors(props.markers), [props.markers, handler])

  return (
    <Editor
      height="100%"
      language="zed"
      onChange={props.onChange}
      onMount={(editor) => (ref.current = editor)}
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
