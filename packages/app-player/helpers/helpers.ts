export const selectorWithText = (selector: string, text: string): string => {
  return `:is(${selector}:has-text("${text}"))`
}
