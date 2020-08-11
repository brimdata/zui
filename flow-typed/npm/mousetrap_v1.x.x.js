// flow-typed signature: 40c60d8d03e5f9e1f0552c668b677ca8
// flow-typed version: c6154227d1/mousetrap_v1.x.x/flow_>=v0.25.x <=v0.103.x

declare module "mousetrap" {
  declare class Mousetrap {
    constructor(node?: HTMLElement): Mousetrap;
    stopCallback (
      e: KeyboardEvent,
      element: Element,
      combo: string
    ): boolean;
    bind(
      key: string | Array<string>,
      fn: (e: Event, combo?: string) => mixed,
      eventType?: string
    ): Mousetrap;
    unbind(key: string | Array<string>): void;
    trigger(key: string): void;
    reset(): void;
  }

  declare module.exports: typeof Mousetrap
}
