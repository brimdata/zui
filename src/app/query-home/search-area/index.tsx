import React from "react"
import styled from "styled-components"

import Error from "./error"
import Input, {hasNewLine} from "./Input"
import {useSelector} from "react-redux"
import {Pins} from "./pins/pins"
import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"

const Group = styled.div<{flex: number; multiline: boolean}>`
  display: flex;
  flex: ${(p) => p.flex || "initial"};
  flex-direction: column;
  padding: ${(p) => (p.multiline ? "0" : "0 16px 10px")};
`

export default function SearchArea() {
  const value = useSelector(Editor.getValue)
  const multiline = hasNewLine(value)
  const query = useSelector(Current.getQuery)

  return (
    <>
      <Pins />
      <Group multiline={multiline} flex={1}>
        <Input
          value={value}
          multiline={multiline}
          disabled={query.isReadOnly}
        />
        <Error />
      </Group>
    </>
  )
}
