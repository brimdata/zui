import {AttributeTypes} from "bullet"
import {ApplicationEntity} from "./application-entity"

const schema = {
  name: {type: String, default: null as string},
}

type Attributes = AttributeTypes<typeof schema>

export class QuerySession extends ApplicationEntity<Attributes> {
  static schema = schema
}
