/* @flow */

import React from "react"
import MessageBox from "./MessageBox"
import {Code} from "./Typography"

type Props = {
  onClose: (*) => *,
  type: string,
  data: {
    client: string,
    server: string
  }
}

const DefaultErrorMessage = ({type, data, onClose}: Props) => {
  return (
    <MessageBox title={type} onClose={onClose}>
      <Code>{JSON.stringify(data)}</Code>
    </MessageBox>
  )
}

export default DefaultErrorMessage
