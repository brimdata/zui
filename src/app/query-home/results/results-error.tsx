import {isObject} from "lodash"
import React from "react"
import styled from "styled-components"

const BG = styled.div`
  margin-top: 16px;
  padding: 24px;
  width: 100%;
  height: 100%;
  h2 {
    margin-bottom: 0.5em;
  }
`

type PegSyntaxError = {
  name: string
  message: string
  location: {
    start: {
      column: number
      line: number
    }
    end: {
      column: number
      line: number
    }
  }
}

function isParseError(obj: unknown): obj is PegSyntaxError {
  return isObject(obj) && "name" in obj && "message" in obj && "location" in obj
}

export function ResultsError(props: {error: string | object}) {
  if (isParseError(props.error)) {
    return <SyntaxError error={props.error} />
  }
  return (
    <BG>
      <h2>Error</h2>
      <p>{props.error.toString()}</p>
    </BG>
  )
}

export function SyntaxError(props: {error: PegSyntaxError}) {
  return (
    <BG>
      <h4>{props.error.name}</h4>
      <p>{props.error.message}</p>
      <p>
        Location: Line {props.error.location.start.line} Column{" "}
        {props.error.location.start.column}
      </p>
    </BG>
  )
}
