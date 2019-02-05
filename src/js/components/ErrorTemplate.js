/* @flow */

import React from "react"
import {Paragraph, Code} from "./Typography"
import {AppError} from "../models/Errors"
import MessageBox from "./MessageBox"
import {isObject} from "lodash"
import {Link as LinkTo} from "react-router-dom"

type Props = {
  error: AppError
}

export default class ErrorTemplate extends React.Component<Props> {
  templates = {
    NetworkError: NetworkErrorTemplate,
    UnauthorizedError: UnauthorizedErrorTemplate,
    NoSpacesError: NoSpacesErrorTemplate
  }

  render() {
    const name = this.props.error.constructor.name
    const Template = this.templates[name] || DefaultErrorTemplate

    return <Template error={this.props.error} />
  }
}

const DefaultErrorTemplate = ({error}) => (
  <MessageBox title={error.title()}>
    <Paragraph>{error.message()}</Paragraph>
    <br />
    <Paragraph>Details:</Paragraph>
    <Code full>
      <pre>{print(error.raw)}</pre>
    </Code>
  </MessageBox>
)

const NetworkErrorTemplate = () => (
  <MessageBox title="Network Error">
    <Paragraph>
      Either this client does not have internet access or the server is down.
    </Paragraph>
  </MessageBox>
)

const UnauthorizedErrorTemplate = () => (
  <MessageBox title="Unauthorized Error">
    <Paragraph>
      Your credentials are not authorized to connect to this server.
    </Paragraph>
    <br />
    <LinkTo to="/connect" className="link yellow">
      Return to Login
    </LinkTo>
  </MessageBox>
)

const NoSpacesErrorTemplate = () => (
  <MessageBox title="No Spaces on Host">
    <Paragraph>
      This host has no spaces to search. Use the command line to create a space,
      then reload this page.
    </Paragraph>
    <br />
    <Paragraph>For example, to create a space called {'"default"'}:</Paragraph>
    <Code>{"boom -execute 'new default'"}</Code>
  </MessageBox>
)

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
