import log from "electron-log"
export type CompiledCorrelation = {
  id: string
  query: string
}

export class CorrelationApi {
  constructor(
    public id: string,
    public query: () => Promise<string> | string,
    public when: () => boolean
  ) {}
}

export class CorrelationsApi {
  public list: CorrelationApi[] = []

  async compile() {
    let result: CompiledCorrelation[] = []
    for (let corr of this.list) {
      if (corr.when()) {
        try {
          const query = await corr.query()
          result.push({id: corr.id, query})
        } catch (e) {
          log.error("Failed to compile query for " + corr.id)
          log.error(e)
        }
      }
    }
    return result
  }

  create(
    id: string,
    correlation: {query: () => Promise<string> | string; when: () => boolean}
  ) {
    this.list.push(new CorrelationApi(id, correlation.query, correlation.when))
  }
}
