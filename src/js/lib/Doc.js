/* @flow */

export const id = (name: string) => {
  const el = document.getElementById(name)
  if (el) return el
  else throw new Error(`Could not find DOM node with id: ${name}`)
}
