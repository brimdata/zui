import {DebutElement} from "./element"
import {nextAnimationFrame} from "./utils"

export class DebutGroup {
  constructor(public elements: DebutElement[]) {}

  async enter() {
    if (this.isEntering) return
    if (!this.isExiting) this.set("beforeEnter")
    await nextAnimationFrame()
    this.set("enter")
    return this.setOnEnd("afterEnter")
  }

  async exit() {
    if (this.isExiting) return
    if (!this.isEntering) this.set("beforeExit")
    await nextAnimationFrame()
    this.set("exit")
    return this.setOnEnd("afterExit")
  }

  set(state) {
    this.elements.map((m) => m.set(state))
  }

  reset() {
    this.elements.map((m) => m.reset())
  }

  setOnEnd(state) {
    return Promise.allSettled(this.elements.map((e) => e.setOnEnd(state)))
  }

  get isExiting() {
    return this.elements.some((e) => e.isExiting)
  }

  get isEntering() {
    return this.elements.some((e) => e.isEntering)
  }
}
