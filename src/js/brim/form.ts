export type FormFieldConfig = {
  defaultValue?: string
  name: string
  label: string
  check?: (arg0: string) => FormCheckResult
  submit?: (arg0: string) => void
}

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
    }
  }
}

function getFields(el, config) {
  const fields = []
  for (const key in config) {
    const {name, label, check, submit} = config[key]
    const input = el.elements.namedItem(name)
    if (!input) throw new Error(`No input with name="${name}"`)

    const value = input.value
    const safeCheck = check || ((_) => [true, ""])
    const safeSubmit = submit || ((_) => {})

    fields.push({
      name,
      input,
      value,
      check: () => safeCheck(value),
      submit: () => safeSubmit(value),

      buildError: (message): FormError => ({label, message, input})
    })
  }
  return fields
}
