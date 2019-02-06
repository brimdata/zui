/* @flow */

import React from "react"
import {Paragraph, Code} from "./Typography"
import {AppError} from "../models/Errors"
import MessageBox from "./MessageBox"
import {isObject} from "lodash"
import {Link as LinkTo} from "react-router-dom"

type EmptyFunc = () => *

type Props = {
  error: AppError,
  onClose?: EmptyFunc
}

export default class ErrorTemplate extends React.Component<Props> {
  templates = {
    NetworkError: NetworkErrorTemplate,
    UnauthorizedError: UnauthorizedErrorTemplate,
    NoSpacesError: NoSpacesErrorTemplate,
    LookytalkVersionError: LookytalkVersionErrorTemplate
  }

  render() {
    const name = this.props.error.constructor.name
    const Template = this.templates[name] || DefaultErrorTemplate

    return <Template {...this.props} />
  }
}

const DefaultErrorTemplate = ({error, onClose}: Props) => (
  <MessageBox title={error.title()} onClose={onClose}>
    <Paragraph>{error.message()}</Paragraph>
    <Code full>
      <pre>{print(error.raw)}</pre>
    </Code>
  </MessageBox>
)

const NetworkErrorTemplate = ({onClose}: Props) => (
  <MessageBox title="Network Error" onClose={onClose}>
    <Paragraph>
      Either this client does not have internet access or the server is down.
    </Paragraph>
  </MessageBox>
)

const UnauthorizedErrorTemplate = ({onClose}: Props) => (
  <MessageBox title="Unauthorized Error" onClose={onClose}>
    <Paragraph>
      Your credentials are not authorized to connect to this server.
    </Paragraph>
    <br />
    <LinkTo to="/connect" onClick={onClose} className="link yellow">
      Return to Login
    </LinkTo>
  </MessageBox>
)

const NoSpacesErrorTemplate = ({onClose}: Props) => (
  <MessageBox title="No Spaces on Host" onClose={onClose}>
    <Paragraph>
      This host has no spaces to search. Use the command line to create a space,
      then reload this page.
    </Paragraph>
    <br />
    <Paragraph>For example, to create a space called {'"default"'}:</Paragraph>
    <Code>{"boom -execute 'new default'"}</Code>
  </MessageBox>
)

const LookytalkVersionErrorTemplate = ({error, onClose}: Props) => {
  return (
    <MessageBox title="Lookytalk Version Error" onClose={onClose}>
      <Paragraph>
        The server and client lookytalk versions do not match.
      </Paragraph>
      <Code>
        Server: {error.context.serverVersion}
        <br />
        Client: {error.context.clientVersion}
      </Code>
    </MessageBox>
  )
}

const print = rawError => {
  const error = tryParse(rawError)
  if (isObject(error)) return JSON.stringify(error, null, 2)
  else return error
}

const tryParse = string => {
  try {
    return JSON.parse(string)
  } catch (_) {
    return string
  }
}
