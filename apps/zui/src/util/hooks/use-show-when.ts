import {MutableRefObject, useLayoutEffect} from "react"

function shouldShow(code, data) {
  const [name, value] = code.split("==")
  return data.get(name) === value
}

export function useShowWhen(ref: MutableRefObject<HTMLFormElement>) {
  function run() {
    if (!ref.current) return
    const form = ref.current
    const data = new FormData(form)
    const elements = form.querySelectorAll<HTMLElement>("[data-show-when]")
    for (const e of elements) {
      const code = e.dataset.showWhen
      e.style.display = shouldShow(code, data) ? "" : "none"
    }
  }

  useLayoutEffect(() => {
    run()
    ref.current.addEventListener("input", run)
    return () => {
      ref.current.addEventListener("input", run)
    }
  }, [])
}
