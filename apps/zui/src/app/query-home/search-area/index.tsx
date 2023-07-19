import React from "react"
import styled from "styled-components"

import Input from "./Input"
import {useSelector} from "react-redux"
import {Pins} from "./pins/pins"
import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import Layout from "src/js/state/Layout"
import {EditorResizer} from "../editor-resizer"

const Group = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  position: relative;
`

export default function SearchArea() {
  const value = useSelector(Editor.getValue)
  const query = useSelector(Current.getActiveQuery)
  const height = useSelector(Layout.getEditorHeight)
  return (
    <>
      <Pins />
      <Group style={{height}}>
        <Input value={value} disabled={query.isReadOnly()} />
        <EditorResizer />
      </Group>
    </>
  )
}
