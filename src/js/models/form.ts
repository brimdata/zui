type Common = {
  name: string
  label: string
  configName?: string
  check?: (arg0: string) => FormCheckResult
  submit?: (arg0: string) => void
  enum?: string[]
  helpLink?: {
    label: string
    url: string
  }
}
export type StringField = Common & {type: "string"; defaultValue: string}
export type BooleanField = Common & {type: "boolean"; defaultValue: boolean}
export type FileField = Common & {type: "file"; defaultValue: string}
export type DirectoryField = Common & {type: "directory"; defaultValue: string}

export type FormFieldConfig =
  | StringField
  | BooleanField
  | FileField
  | DirectoryField

export type FormConfig = {
  [key: string]: FormFieldConfig
}

export type FormCheckResult = Promise<[boolean, string]> | [boolean, string]

export type FormError = {
  label?: string
  message: string
  input?: HTMLInputElement
}

export default function form(element: HTMLFormElement, config: FormConfig) {
  let errors = []
  const fields = () => getFields(element, config)
  return {
    async isValid() {
      errors = []
      for (const field of fields()) {
        const check = await field.check()
        if (!Array.isArray(check))
          throw new Error(`${field.name} check did not return an array`)

        const [passed, message] = check
        if (!passed) errors.push(field.buildError(message))
      }
      return errors.length === 0
    },
    submit() {
      fields().forEach((f) => f.submit())
    },
    getErrors() {
      return errors
    },
    getFields() {
      return fields()
    },
  }
}

function getFields(el, config) {
  const fields = []
  for (const key in config) {
    const {name, label, check, submit} = config[key]
    const input = el.elements.namedItem(name)
    if (!input) continue

    const value = input.type === "checkbox" ? input.checked : input.value
    const safeCheck = check || ((_) => [true, ""])
    const safeSubmit = submit || ((_) => {})

    fields.push({
      name,
      input,
      value,
      check: () => safeCheck(value),
      submit: () => safeSubmit(value),

      buildError: (message): FormError => ({label, message, input}),
    })
  }
  return fields
}
