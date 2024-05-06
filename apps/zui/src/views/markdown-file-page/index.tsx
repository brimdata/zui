import {useEffect} from "react"
import Markdown from "src/app/core/components/markdown"
import {MarkdownPageHandler} from "./handler"
import {useStateObject} from "src/core/state-object"

export type Props = {path: string}
export type State = {contents: string}

export function MarkdownFilePage(props: Props) {
  const state = useStateObject<State>({contents: ""})
  const handler = new MarkdownPageHandler(props, state)

  useEffect(() => {
    handler.read()
  }, [props.path])

  return (
    <div className="panels">
      <header className="box border-b flow">
        <h1>{handler.title}</h1>
        <p>{props.path}</p>
      </header>
      <article className="principle overflow-y-auto">
        <section
          className="wrap max-w-measure flow region region-space-xl "
          style={{fontSize: "115%"}}
        >
          <Markdown>{handler.state.contents}</Markdown>
        </section>
      </article>
    </div>
  )
}
