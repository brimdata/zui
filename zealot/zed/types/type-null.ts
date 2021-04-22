class TypeOfNull {
  name = "null"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }
}

export const TypeNull = new TypeOfNull()
