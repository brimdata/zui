export function getPoolFormData(form: HTMLFormElement) {
  const data = new FormData(form)
  return {
    name: data.get("name"),
    key: data.get("key"),
    order: data.get("order"),
  }
}
