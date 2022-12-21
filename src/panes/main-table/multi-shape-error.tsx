import isEmpty from "lodash/isEmpty"
import React from "react"
import {useBrimApi} from "src/app/core/context"
import submitSearch from "src/app/query-home/flows/submit-search"
import {Card} from "src/components/card"
import {H1} from "src/components/h1"
import {InputButton} from "src/components/input-button"
import styled from "styled-components"

const BG = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: flex-start;
  padding: 1rem;
  text-align: center;

  ${Card} {
    gap: 24px;
  }

  button {
    width: 100%;
  }
`

export function MultiShapeError() {
  const api = useBrimApi()
  return (
    <BG>
      <Card>
        <H1>Multiple Shapes</H1>
        <p>
          The table can only display data of a single type. Use {'"fuse"'} to
          combine the types into one.
        </p>
        <InputButton
          onClick={() => {
            api.editor.append(isEmpty(api.editor.value) ? "fuse" : " | fuse")
            api.dispatch(submitSearch())
          }}
        >
          Fuse
        </InputButton>
      </Card>
    </BG>
  )
}
