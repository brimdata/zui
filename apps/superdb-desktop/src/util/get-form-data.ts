export function getFormData(e: any): any {
  const form = e.currentTarget as HTMLFormElement
  const data = Object.fromEntries(new FormData(form).entries())
  const submit = e.nativeEvent.submitter.getAttribute("name")
  return {
    ...data,
    submit,
  }
}
