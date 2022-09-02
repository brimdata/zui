import {useEffect} from "react"
import {showWelcomePage} from "src/app/commands/show-welcome-page"

export function useWelcomePage() {
  useEffect(() => {
    if (global.appMeta.isFirstRun) showWelcomePage.run()
  }, [])
}
