import {Marker} from "src/js/state/Editor/types"
import {EditorSnapshot} from "../editor-snapshot"
import {invoke} from "src/core/invoke"
import {CompilationError} from "./compilation-error"
import {DescribeErrorResponse} from "./types"

export class Validator {
  public errors: Marker[] = []

  async validate(snapshot: EditorSnapshot) {
    const sourceSet = snapshot.toSourceSet()
    const response: DescribeErrorResponse = await invoke(
      "editor.describe",
      sourceSet.contents
    )

    if (response.error) {
      this.errors = (response.error.compilation_errors ?? [])
        .map(({Pos, End, Msg}) => new CompilationError(Msg, Pos, End))
        .map((error) => error.toMarker(sourceSet))
      return false
    } else {
      return true
    }
  }
}
