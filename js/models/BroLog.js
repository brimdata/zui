import BroField from "./BroField"
import isEqual from "lodash/isEqual"

export default class BroLog {
  static buildFrom({events = [], schemas = {}}) {
    return events
      .map(values => ({values, schema: schemas[values[0]]}))
      .filter(args => args.schema)
      .map(args => new BroLog(args))
  }

  constructor({values, schema}) {
    this.values = values
    this.schema = schema
  }

  fieldNames() {
    return this.schema.map(header => header.name)
  }

  getField(fieldName) {
    const i = this.schema.findIndex(header => header.name === fieldName)
    if (i !== -1) {
      const {name, type} = this.schema[i]
      const value = this.values[i]
      return new BroField({name, type, value})
    } else {
      return new BroField({})
    }
  }

  key() {
    return [this.get("_path"), this.get("uid"), this.get("ts")].join("-")
  }

  lineId() {
    return {
      path: this.cast("_path"),
      uid: this.cast("uid"),
      ts: this.cast("ts").toDate()
    }
  }

  isEqual(broLog) {
    return isEqual(broLog.lineId(), this.lineId())
  }

  get(fieldName) {
    return this.getField(fieldName).toString()
  }

  cast(fieldName) {
    return this.getField(fieldName).cast()
  }
}
