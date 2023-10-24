import useListener from "./useListener"

export default function useEscapeKey(callback: (e: KeyboardEvent) => void) {
  useListener<KeyboardEvent>(document.body, "keyup", (e) => {
    if (e.key === "Escape") callback(e)
  })
}
