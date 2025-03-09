import {useEffect, useState} from "react"

const query = "(prefers-color-scheme: dark)"

export function useColorScheme() {
  const [isDark, setIsDark] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    const fn = ({matches}) => setIsDark(matches)
    media.addEventListener("change", fn)
    return () => {
      media.removeEventListener("change", fn)
    }
  }, [])

  return {isDark, isLight: !isDark}
}
