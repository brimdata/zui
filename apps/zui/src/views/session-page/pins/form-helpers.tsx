import {FormEvent} from "react"

export function getFormData(e: FormEvent<HTMLFormElement>): any {
  const form = e.target as HTMLFormElement
  return Object.fromEntries(new FormData(form).entries())
}
