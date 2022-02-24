import Markdown from "src/app/core/components/markdown"
import React from "react"
import styled from "styled-components"
import {useReleaseNotes} from "./use-release-notes"

const Scrollable = styled.div`
  overflow: auto;
`
const BG = styled.div`
  margin: 48px auto;
  padding: 24px;
  width: 100%;
  max-width: 600px;
  line-height: 1.6;
  a {
    color: var(--azure);
  }
  hr {
    border: none;
    border-top: 1px solid var(--cloudy);
  }
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
