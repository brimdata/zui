import Markdown from "src/components/markdown"
import React, {useLayoutEffect} from "react"
import styled from "styled-components"
import {useReleaseNotes} from "./use-release-notes"
import {Content} from "src/js/components/Content"
import {Active} from "src/models/active"

const Scrollable = styled.div`
  overflow: auto;
`
const BG = styled(Content)`
  margin: 48px auto;
  padding: 24px;
  width: 100%;
  max-width: 600px;
`

export default function ReleaseNotes() {
  useLayoutEffect(() => {
    Active.tab.setTitle("Release Notes")
  }, [])
  const {notes, version, fetching} = useReleaseNotes()
  if (fetching) return null

  return (
    <Scrollable>
      <BG>
        <h1>Release Notes for Version {version}</h1>
        <Markdown>{notes}</Markdown>
      </BG>
    </Scrollable>
  )
}
