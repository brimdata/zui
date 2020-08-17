/* @flow */

export type FormFieldConfig = {
  defaultValue?: string,
  name: string,
  label: string,
  check?: (string) => Promise<[boolean, string]> | [boolean, string],
  submit?: (string) => void
}

export type FormConfig = {
  [string]: FormFieldConfig
}

export type FormError = {
  label: string,
  message: string,
  input: HTMLInputElement
}

export default function form(element: HTMLFormElement, config: FormConfig) {
  let errors = []
  let fields = () => getFields(element, config)
  return {
    async isValid() {
      errors = []
      for (let field of fields()) {
        let check = await field.check()
        if (!Array.isArray(check))
          throw new Error(`${field.name} check did not return an array`)

        let [passed, message] = check
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
    getData() {
      return Object.fromEntries(fields().map((f) => [f.name, f.value]))
    }
  }
}

function getFields(el, config) {
  let fields = []
  for (let key in config) {
    let {name, label, check, submit} = config[key]
    let input = el.elements.namedItem(name)
    if (!input) throw new Error(`No input with name="${name}"`)

    // $FlowFixMe
    let value = input.value
    let safeCheck = check || ((_) => [true, ""])
    let safeSubmit = submit || ((_) => {})

    fields.push({
      name,
      input,
      value,
      check: () => safeCheck(value),
      submit: () => safeSubmit(value),
      // $FlowFixMe
      buildError: (message): FormError => ({label, message, input})
    })
  }
  return fields
}
