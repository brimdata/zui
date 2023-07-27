import {Editor} from "@monaco-editor/react"
import {useEffect, useRef} from "react"

export function ZedEditor(props: {
  path: string
  value: string
  onChange: (value: string | undefined, ev: any) => void
  autoFocus?: boolean
}) {
  const ref = useRef<any>()

  // Keep this thing in focus as much as possible.
  // Probably want to move this into parent.
  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.focus()
      }
    })
  }, [props.path, props.value])

  return (
    <Editor
      height="100%"
      width="100%"
      value={props.value}
      onChange={props.onChange}
      language="zed"
      options={{
        minimap: {enabled: false},
        renderLineHighlightOnlyWhenFocus: true,
        renderControlCharacters: false,
      }}
      onMount={(editor) => {
        ref.current = editor
      }}
      path={props.path}
    />
  )
}
