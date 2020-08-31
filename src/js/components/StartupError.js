/* @flow */
import React from "react"
import styled from "styled-components"

import {remote} from "electron"

import type {Styled} from "../types/styled"
import Link from "./common/Link"

type Props = {error: *}

const Wrap: Styled<> = styled.div`
  padding: 50px;
  min-height: 100vh;
  background: linear-gradient(to top, var(--cloudy), var(--coconut));
`

const Pre = styled.pre`
  font-size: 13px;
  overflow: auto;
`

const Title = styled.h1`
  font-size: 1.5rem;
  text-shadow: 1px 1px white;
`

const P = styled.p`
  font-size: 13px;
`

export default function StartupError({error}: Props) {
  const e = JSON.stringify(error, null, 2)
  function onClick() {
    remote.app.relaunch()
    remote.app.exit(0)
  }
  return (
    <Wrap>
      <Title>Brim Failed to Start</Title>
      <Pre>{e}</Pre>
      <P>
        <Link onClick={onClick}>Try Again</Link>
      </P>
      <P>
        <Link href="mailto:support@brimsecurity.com">Contact Support</Link>
      </P>
    </Wrap>
  )
}
