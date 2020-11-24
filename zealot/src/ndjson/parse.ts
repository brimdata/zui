class UnexpectedServerResponse extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = "UnexpectedServerResponse"
  }
}

export function parse(string: string) {
  try {
    return JSON.parse(string)
  } catch (e) {
    throw new UnexpectedServerResponse(
      `Expected ndjson but received "${string}"`
    )
  }
}
