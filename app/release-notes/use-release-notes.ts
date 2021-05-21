import {getRepo} from "app/core/utils/get-repo"
import {useEffect, useState} from "react"

const REPO = getRepo()

export function useReleaseNotes(version) {
  const [notes, setNotes] = useState("")

  useEffect(() => {
    fetch(`https://api.github.com/repos/${REPO}/releases/tags/v${version}`)
      .then((resp) => {
        if (resp.ok) return resp.json()
        else throw new Error("Not found")
      })
      .then((json) => json.body)
      .then((m) => setNotes(m))
      .catch((e) => {
        let message =
          "There was a problem fetching the release notes for this version. \n\n"
        if (e.message === "Failed to fetch") {
          setNotes(message + "Error: No internet access")
        } else {
          setNotes(message + e.toString())
        }
      })
  }, [])

  return notes
}
