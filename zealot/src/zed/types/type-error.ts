import {Error} from "../values/error"
import {BasePrimitive} from "./base-primitive"

export class TypeOfError extends BasePrimitive<Error> {
  name = "error"

  create(value: string) {
    return new Error(value)
  }
}

export const TypeError = new TypeOfError()
