import {DomainModel} from "src/core/domain-model"

/**
 * A frame is a model for the browser window.
 */
export class Frame extends DomainModel {
  static id = globalThis.windowId
}
