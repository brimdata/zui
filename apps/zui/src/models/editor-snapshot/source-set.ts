import {Source} from "./source"

export class SourceSet {
  sources: Source[]
  contents: string

  constructor(prefixes: string[], mainText: string) {
    this.sources = []
    this.contents = ""

    prefixes
      .concat(mainText)
      .filter((snippet) => snippet.trim().length)
      .forEach((snippet, index) => {
        const isFirst = index === 0
        const text = isFirst ? snippet : " | " + snippet
        this.appendSource(text)
      })

    if (!this.sources.length) this.appendSource("*")
  }

  appendSource(text: string) {
    this.sources.push(new Source(this.contents.length, text))
    this.contents += text
  }

  sourceOf(pos: number) {
    return this.sources.find((s) => pos >= s.start && pos <= s.start + s.length)
  }
}
