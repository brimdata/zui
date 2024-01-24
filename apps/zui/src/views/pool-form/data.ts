export function getPoolFormData(form: HTMLFormElement) {
  const data = new FormData(form)
  console.log(Array.from(data.entries()))
  return {
    name: data.get("name"),
    key: data.get("key"),
    order: data.get("order"),
  }
}
