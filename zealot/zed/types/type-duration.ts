class TypeOfDuration {
  name = "duration"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }
}

export const TypeDuration = new TypeOfDuration()
