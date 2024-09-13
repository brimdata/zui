import {Marker} from "src/js/state/Editor/types"
import {invoke} from "src/core/invoke"
import {CompilationError} from "./compilation-error"
import {DescribeErrorResponse} from "./types"
import {Snapshot} from "../snapshot"

export class Validator {
  public errors: Marker[] = []

  async validate(snapshot: Snapshot) {
    const sourceSet = snapshot.sourceSet
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
