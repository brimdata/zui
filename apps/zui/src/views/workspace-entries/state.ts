import {useState} from "react"

export function useWorkspaceEntriesState() {
  const [state, setState] = useState<{
    data: any[]
    opens: Record<string, boolean>
  }>({
    data: [],
    opens: {},
  })
  return {
    ...state,
    set: setState,
    setItem: (key: string, value: any) => {
      setState((prev) => ({...prev, [key]: value}))
    },
  }
}

export type WorkspaceEntriesState = ReturnType<typeof useWorkspaceEntriesState>
