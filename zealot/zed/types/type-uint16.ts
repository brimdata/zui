class TypeOfUint16 {
  name = "uint16"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }
}

export const TypeUint16 = new TypeOfUint16()
