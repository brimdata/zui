/* @flow */

export function getFormData(
  form: HTMLFormElement,
  ...fields: string[]
): Object {
  return fields.reduce((data, name) => {
    let el = form.elements.namedItem(name)
    if (el instanceof HTMLInputElement) {
      switch (el.type) {
        case "checkbox":
          data[name] = el.checked
          break
        default:
          data[name] = el.value
          break
      }
    }
    return data
  }, {})
}
