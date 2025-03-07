export class ZedScript {
  constructor(public script: string) {}

  isEmpty() {
    const lines = this.script.split("\n")
    const comment = /^\s*\/\/.*$/
    const whiteSpace = /^\s*$/
    const linesWithZed = lines.filter(
      (line) => !comment.test(line) && !whiteSpace.test(line)
    )
    return linesWithZed.length === 0
  }
}
