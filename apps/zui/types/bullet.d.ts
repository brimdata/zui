import {Reducer, Store} from "@reduxjs/toolkit"

declare module "bullet" {
  type Schema = {[name: string]: {type: any; default?: any}}
  type AttributeTypes<T extends Schema> = {
    [Key in keyof T]: T[Key]["default"]
  }

  export class Entity<A> {
    static store: Store
    static schema: Schema
    static count: number
    static slice: {[name: string]: Reducer}
    static useAll<T extends Entity>(this: new (a: Partial<A>) => T): T[]
    static where<T extends Entity>(
      this: new (a: Partial<A>) => T,
      attributes: Partial<A>
    ): T[]
    static find<T extends Entity>(this: new (a: Partial<A>) => T, id: string): T
    static create<T extends Entity>(
      this: new (a: Partial<A>) => T,
      attributes: Partial<A>
    ): T
    id: string
    createdAt: Date
    updatedAt: Date
    attributes: A
    constructor(attributes: Partial<A>)
    save(): boolean
  }
}
