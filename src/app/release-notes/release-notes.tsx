import Markdown from "src/app/core/components/markdown"
import React from "react"
import styled from "styled-components"
import {useReleaseNotes} from "./use-release-notes"
import {Content} from "src/js/components/Content"

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
