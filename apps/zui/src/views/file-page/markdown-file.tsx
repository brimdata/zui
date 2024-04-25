import {useEffect, useState} from "react"
import Markdown from "src/app/core/components/markdown"
import {invoke} from "src/core/invoke"
import {basename} from "src/util/basename"

export function MarkdownFile(props: {path: string}) {
  const {path} = props
  const [contents, setContents] = useState("")

  async function read() {
    const {content} = await invoke("workspaceFiles.read", path)
    setContents(content)
  }

  useEffect(() => {
    read()
  }, [path])

  return (
    <div className="panels">
      <header className="box border-b flow">
        <h1>{basename(path)}</h1>
        <p>{path}</p>
      </header>
      <article className="principle overflow-y-auto">
        <section
          className="wrap max-w-measure flow region region-space-xl "
          style={{fontSize: "115%"}}
        >
          <Markdown>{contents}</Markdown>
        </section>
      </article>
    </div>
  )
}
