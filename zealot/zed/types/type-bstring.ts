class TypeOfBstring {
  name = "bstring"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }
}

export const TypeBstring = new TypeOfBstring()
