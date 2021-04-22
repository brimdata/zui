class TypeOfUint64 {
  name = "uint64"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }
}

export const TypeUint64 = new TypeOfUint64()
