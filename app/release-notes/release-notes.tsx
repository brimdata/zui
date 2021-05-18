import {getVersion} from "app/core/utils/get-version"
import React from "react"
import ReactMarkdown from "react-markdown"
import Link from "src/js/components/common/Link"
import styled from "styled-components"
import {useReleaseNotes} from "./use-release-notes"

const Scrollable = styled.div`
  overflow: auto;
`
const BG = styled.div`
  margin: 48px auto;
  padding: 24px;
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

const components = {
  // eslint-disable-next-line
  a: ({children, ...props}) => {
    return <Link {...props}>{children}</Link>
  }
}

const version = getVersion()

export default function ReleaseNotes() {
  const notes = useReleaseNotes(version)

  return (
    <Scrollable>
      <BG className="release-notes">
        <h1>Release Notes for Version {version}</h1>
        <ReactMarkdown components={components}>{notes}</ReactMarkdown>
      </BG>
    </Scrollable>
  )
}
