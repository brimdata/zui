import {ViewHandler} from "src/core/view-handler"
import {Props, State} from "."
import {StateObject} from "src/core/state-object"
import {basename} from "src/util/basename"

export class MarkdownPageHandler extends ViewHandler {
  constructor(public props: Props, public state: StateObject<State>) {
    super()
  }

  async read() {
    const {content} = await this.request("files#show", {path: this.props.path})
    this.state.setItem("contents", content)
  }

  get title() {
    return basename(this.props.path)
  }
}
