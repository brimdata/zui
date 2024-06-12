import {Source} from "./source"

export class SourceSet {
  sources: Source[] = []
  contents: string = ""

  constructor(prefixes: string[], mainText: string) {
    prefixes
      .concat(mainText)
      .filter((snippet) => snippet.trim().length)
      .forEach((snippet) => this.appendSource(snippet))

    if (!this.sources.length) this.appendSource("*")
  }

  appendSource(text: string) {
    const isFirst = this.contents.length === 0
    if (!isFirst) this.contents += " | "
    this.sources.push(new Source(this.contents.length, text))
    this.contents += text
  }

  sourceOf(pos: number) {
    return this.sources.find(
      (s) => pos >= s.start && pos < s.start + s.length + 1
    )
  }
}
