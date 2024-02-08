export class DebutClasses {
  constructor(public prefix) {}

  get beforeEnter() {
    return this.prefix + "--before-enter"
  }
  get enter() {
    return this.prefix + "--enter"
  }
  get afterEnter() {
    return this.prefix + "--after-enter"
  }
  get beforeExit() {
    return this.prefix + "--before-exit"
  }
  get exit() {
    return this.prefix + "--exit"
  }
  get afterExit() {
    return this.prefix + "--after-exit"
  }
  get all() {
    return [
      this.beforeEnter,
      this.enter,
      this.afterEnter,
      this.beforeExit,
      this.exit,
      this.afterExit,
    ]
  }
}
