class TypeOfString {
  name = "string"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }
}

export const TypeString = new TypeOfString()
