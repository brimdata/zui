import {DomainModel} from "src/core/domain-model"
import {Store} from "../state/types"
import {ApplicationModel} from "src/models/application-model"

export function initDomainModels(args: {store: Store}) {
  DomainModel.store = args.store
  ApplicationModel.store = args.store
}
