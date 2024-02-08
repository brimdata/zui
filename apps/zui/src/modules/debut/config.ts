export class DebutConfig {
  effect: string
  group: string = null

  constructor(s: string) {
    const parts = s.split(":")
    if (parts.length === 1) {
      this.effect = parts[0]
    } else if (parts.length === 2) {
      this.group = parts[0]
      this.effect = parts[1]
    } else {
      throw new Error("Unable to parse data-debut attribute value: " + s)
    }
  }

  static parseAll(string: string) {
    return string
      .trim()
      .split(/\s+/)
      .map((s) => new DebutConfig(s))
  }
}
