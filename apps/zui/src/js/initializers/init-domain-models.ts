import {DomainModel} from "src/core/domain-model"
import {Store} from "../state/types"
import {Entity} from "bullet"

export function initDomainModels(args: {store: Store}) {
  DomainModel.store = args.store
  Entity.store = args.store
}
