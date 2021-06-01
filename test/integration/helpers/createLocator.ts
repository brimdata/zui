export type Locator = {
  props: {"data-test-locator": string}
  css: string
  xpath: string
}

export default function createLocator(name: string): Locator {
  return {
    props: {"data-test-locator": name},
    css: `[data-test-locator="${name}"]`,
    xpath: `//*[@data-test-locator="${name}"]`
  }
}
