import {DomainModel} from "src/core/domain-model"
import ConfigPropValues from "src/js/state/ConfigPropValues"

export class DefaultLake extends DomainModel {
  static get listenAddr() {
    return this.select(ConfigPropValues.get("defaultLake", "listenAddr"))
  }
}
