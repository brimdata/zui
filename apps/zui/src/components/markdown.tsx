import React from "react"
import ReactMarkdown from "react-markdown"
import {Link} from "src/components/link"

const components = {
  a: ({children, ...props}) => {
    return <Link {...props}>{children}</Link>
  },
}

export default function Markdown({children}) {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>
}
