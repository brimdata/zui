import {DomainModel} from "src/core/domain-model"
import Queries from "src/js/state/Queries"

type Attrs = {
  name: string
  id: string
}

export class Query extends DomainModel<Attrs> {
  static find(id: string) {
    return this.select((state) => Queries.find(state, id))
  }
}
