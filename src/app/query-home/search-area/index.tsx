import React from "react"
import styled from "styled-components"

import Error from "./error"
import Input from "./Input"
import {useSelector} from "react-redux"
import {Pins} from "./pins/pins"
import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"

const Group = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
`

export default function SearchArea() {
  const value = useSelector(Editor.getValue)
  const query = useSelector(Current.getActiveQuery)

  return (
    <>
      <Pins />
      <Group>
        <Input value={value} disabled={query.isReadOnly()} />
        <Error />
      </Group>
    </>
  )
}
