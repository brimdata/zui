import {DomainModel} from "src/core/domain-model"
import {Store} from "../state/types"
import {Entity} from "bullet"
import {ApplicationRunner} from "src/runners/application-runner"

export function initDomainModels(args: {store: Store}) {
  DomainModel.store = args.store
  Entity.store = args.store
  ApplicationRunner.store = args.store
}
