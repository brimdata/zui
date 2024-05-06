import React from "react"
import ReactMarkdown from "react-markdown"
import Link from "src/js/components/common/Link"

const components = {
  // eslint-disable-next-line
  a: ({children, ...props}) => {
    return <Link {...props}>{children}</Link>
  },
}

export default function Markdown(props: any) {
  return <ReactMarkdown components={components} {...props} />
}
