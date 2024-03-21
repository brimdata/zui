import {DomainModel} from "src/core/domain-model"
import {Store} from "../state/types"

export function initDomainModels(args: {store: Store}) {
  DomainModel.store = args.store
}
