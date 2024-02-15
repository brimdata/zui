import {MutableRefObject, useLayoutEffect} from "react"

// This should be called use form conditionals

function createHook(keyword, callback) {
  const attr = "data-" + keyword + "-when"
  const selector = "[" + attr + "]"

  return function useFormConditional(ref: MutableRefObject<HTMLFormElement>) {
    function run() {
      if (!ref.current) return
      const form = ref.current
      const data = new FormData(form)
      const elements = form.querySelectorAll<HTMLElement>(selector)
      for (const element of elements) {
        const code = element.getAttribute(attr)
        const isTrue = condition(code, data)
        callback(element, isTrue)
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
}

function condition(code, data) {
  const exprs = code.split("&&")
  const result = exprs.every((expr) => {
    const [left, right] = expr.trim().split("==")
    return data.get(left) === right
  })
  return result
}

export const useRequiredWhen = createHook("required", (element, isTrue) => {
  if (isTrue) {
    element.setAttribute("required", "true")
  } else {
    element.removeAttribute("required")
  }
})

export const useDisabledWhen = createHook("disabled", (element, isTrue) => {
  if (isTrue) {
    element.setAttribute("disabled", "true")
  } else {
    element.removeAttribute("disabled")
  }
})

export const useShowWhen = createHook("show", (element, isTrue) => {
  element.style.display = isTrue ? "" : "none"
})
