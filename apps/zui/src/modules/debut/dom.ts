import {DebutConfig} from "./config"
import {DebutElement} from "./element"
import {DebutGroup} from "./group"

export function selectGroup(name: string) {
  const elements = []
  const nodes = document.querySelectorAll("[data-debut*=" + name + "]") as any

  for (const el of nodes) {
    const val = el.dataset.debut
    const configs = DebutConfig.parseAll(val)
    const config = configs.find((c) => c.group === name)
    if (config) elements.push(new DebutElement(el, config.effect, config.group))
  }
  return new DebutGroup(elements)
}
