class TypeOfIp {
  name = "ip"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }
}

export const TypeIp = new TypeOfIp()
