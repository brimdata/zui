import {transitionsComplete} from "src/util/watch-transition"
import {DebutClasses} from "./classes"

export class DebutElement {
  classes: DebutClasses

  constructor(public el, public effect: string, public group: string = null) {
    this.classes = new DebutClasses(this.effect)
  }

  set(name: string) {
    this.className(name)
  }

  reset() {
    this.el.classList.remove(...this.classes.all, this.effect)
  }

  async setOnEnd(name: string) {
    if (await transitionsComplete(this.el)) {
      this.set(name)
    }
  }

  get isEntering() {
    return this.el.classList.contains(this.classes.enter)
  }

  get isExiting() {
    return this.el.classList.contains(this.classes.exit)
  }

  className(name) {
    this.el.classList.remove(...this.classes.all)
    this.el.classList.add(this.classes[name], this.effect)
  }
}
