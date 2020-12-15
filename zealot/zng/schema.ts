import * as zjson from "../zjson"

export class Schema {
  constructor(readonly columns: zjson.Column[]) {}

  flatten() {
    const flat = (cols: zjson.Column[], prefix = ""): zjson.Column[] => {
      return cols.flatMap((c) => {
        const name = prefix + c.name
        if (c.type == "record") {
          return flat(c.of, name + ".")
        } else {
          return {...c, name}
        }
      })
    }
    return flat(this.columns)
  }
}
