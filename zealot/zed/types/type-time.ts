class TypeOfTime {
  name = "time"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }
}

export const TypeTime = new TypeOfTime()
