/* @flow */

import React from "react"
import MessageBox from "./MessageBox"
import {Paragraph, Code} from "./Typography"

type Props = {
  onClose: (*) => *,
  data: {
    client: string,
    server: string
  }
}

const LookytalkVersionErrorMessage = ({data, onClose}: Props) => {
  return (
    <MessageBox title="Lookytalk Version Error" onClose={onClose}>
      <Paragraph>
        The server and client lookytalk versions do not match.
      </Paragraph>
      <Code>
        Server: {data.server}
        <br />
        Client: {data.client}
      </Code>
    </MessageBox>
  )
}

export default LookytalkVersionErrorMessage
