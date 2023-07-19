import useListener from "./useListener"

export default function useEscapeKey(callback: Function) {
  useListener<KeyboardEvent>(document.body, "keyup", (e) => {
    if (e.key === "Escape") callback()
  })
}
