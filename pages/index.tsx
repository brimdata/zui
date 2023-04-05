import React, {useEffect} from "react"
import initialize from "src/js/initializers/initialize"

export default function HomePage() {
  useEffect(() => {
    initialize()
  }, [])

  return <div>Welcome to Next.js!</div>
}
