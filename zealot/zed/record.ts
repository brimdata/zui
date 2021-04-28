// import {zed.Field} from "./field"
// import {deserialize} from "./json"

// export class zed.Record {
//   fields: zed.Field[] | null
//   typeName?: string

//   constructor(args: {fields: zed.Field[]; typeName?: string}) {
//     this.fields = args.fields
//     this.typeName = args.typeName
//   }

//   static deserialize(data): zed.Record {
//     return deserialize(data)
//   }

//   [Symbol.iterator]() {
//     let index = 0
//     const next = () =>
//       index < this.fields.length
//         ? {done: false, value: this.at(index++)}
//         : {done: true, value: undefined}

//     return {next}
//   }

//   get columns() {
//     return this.fields.map((f) => f.name)
//   }

//   at(index: number) {
//     return this.fields[index].data
//   }

//   get(name: string) {
//     return this.getField(name).data
//   }

//   try(name: string) {
//     try {
//       return this.get(name)
//     } catch {
//       return null
//     }
//   }

//   isUnset() {
//     return this.fields === null
//   }

//   private _getField(name: string) {
//     if (this.isUnset()) throw new Error("Record is unset")
//     const field = this.fields.find((f) => f.name == name)
//     if (!field) throw new UnknownColumnError(name, this.columns)
//     return field
//   }

//   getField(name: string) {
//     return name
//       .split(".")
//       .reduce<zed.Field>((field: zed.Field, namePart: string) => {
//         if (field.data instanceof zed.Record) {
//           return new zed.Field({name, data: field.data._getField(namePart).data})
//         } else {
//           throw new Error("Dot syntax is only for nested records")
//         }
//       }, new zed.Field({name: "", data: this}))
//   }

//   tryField(name: string) {
//     try {
//       return this.getField(name)
//     } catch {
//       return null
//     }
//   }

//   has(name: string) {
//     return this.columns.includes(name)
//   }

//   flatten(prefix = ""): zed.Record {
//     let fields = []

//     this.fields.forEach((field) => {
//       if (field.data instanceof zed.Record) {
//         const nested = field.data.flatten(field.name + ".")
//         fields = fields.concat(nested.fields)
//       } else {
//         fields.push({data: field.data, name: prefix + field.name})
//       }
//     })
//     return new zed.Record({fields})
//   }

//   serialize() {
//     return {
//       kind: "record",
//       typeName: this.typeName,
//       fields: this.fields.map((f) => f.serialize())
//     }
//   }
// }
