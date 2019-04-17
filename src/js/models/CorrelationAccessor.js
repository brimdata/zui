/* @flow */

import type {Correlations} from "../state/reducers/correlations"

export default class CorrelationAccessor {
  data: Correlations

  constructor(data: Correlations) {
    this.data = data
  }

  exists(key: string, name: string) {
    return !!(this.data[key] && this.data[key][name])
  }

  get(key: string, name: string) {
    if (this.exists(key, name)) {
      return this.data[key][name]
    } else {
      return null
    }
  }
}
