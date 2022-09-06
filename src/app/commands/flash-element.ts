import {createCommand} from "./command"

export const flashElement = createCommand<[selector: string]>(
  {
    id: "flashElement",
  },
  (ctx, selector) => {
    const el: HTMLElement = document.querySelector(selector)
    if (!el) return
    el.classList.add("flash-element")
    el.addEventListener("animationend", () => {
      el.classList.remove("flash-element")
    })
  }
)
