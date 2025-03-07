import {Marker} from "src/js/state/Editor/types"
import {Source} from "./source"
import {SourceSet} from "./source-set"

export class CompilationError {
  constructor(
    public message: string,
    public offset: number,
    public end: number
  ) {}

  toMarker(sourceSet: SourceSet) {
    const source = sourceSet.sourceOf(this.offset)
    const start = this.getStartPosition(source)
    const end = this.getEndPosition(source)

    return {
      message: this.message,
      startLineNumber: start.lineNumber,
      startColumn: start.column,
      endLineNumber: end ? end.lineNumber : start.lineNumber,
      endColumn: end ? end.column : start.column + 1,
    } as Marker
  }

  private hasRange() {
    return this.end >= 0
  }

  private getStartPosition(source: Source) {
    return source.position(this.offset)
  }

  private getEndPosition(source: Source) {
    return this.hasRange() ? source.position(this.end) : null
  }
}
