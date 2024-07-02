import {DomainModel} from "src/core/domain-model"
import {error} from "src/core/log"
import ConfigPropValues from "src/js/state/ConfigPropValues"

export class DefaultLake extends DomainModel {
  static get listenAddr() {
    const value = this.select(ConfigPropValues.get("defaultLake", "listenAddr"))
    if (["localhost", ""].includes(value)) {
      return value
    } else {
      error("Invalid defaultLake.listenAddr: ", value)
      return "localhost"
    }
  }
}
