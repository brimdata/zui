import useListener from "src/js/components/hooks/useListener"

// don't use this...a bad experiement
export function createEvent<Args extends any[]>(name: string) {
  return {
    trigger(...args: Args) {
      document.dispatchEvent(new CustomEvent(name, {detail: args}))
    },
    useListener(callback: (...args: Args) => void) {
      useListener(document, name as any, (e: CustomEvent<Args>) => {
        callback(...e.detail)
      })
    },
  }
}
