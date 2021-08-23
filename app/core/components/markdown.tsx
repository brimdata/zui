import React, {ComponentProps} from "react"
import ReactMarkdown from "react-markdown"
import Link from "src/js/components/common/Link"

const components = {
  // eslint-disable-next-line
  a: ({children, ...props}: ComponentProps<any>) => {
    return <Link {...props}>{children}</Link>
  }
}

export default function Markdown({children}: {children: string}) {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>
}
