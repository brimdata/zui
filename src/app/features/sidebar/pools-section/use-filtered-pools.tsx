import {useMemo} from "react"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"

export function useFilteredPools(searchTerm: string) {
  const all = useSelector(Current.getPools)

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    if (term === "") return all
    return all
      .filter((pool) => pool.name.toLowerCase().includes(term))
      .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1))
  }, [all, searchTerm])

  return [all, filtered] as const
}
