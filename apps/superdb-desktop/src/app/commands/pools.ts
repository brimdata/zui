import {PoolName} from "../../views/sidebar/pools-section/pool-name"
import {createCommand} from "./command"
import {deletePools} from "./delete-pools"

function replaceLastItem<T>(array: T[], item: T) {
  const next = [...array]
  next[array.length - 1] = item
  return next
}

export const renameGroup = createCommand(
  "pools.renameGroup",
  async ({api}, group: string[], name: string) => {
    const delimiter = api.configs.get("pools", "nameDelimiter")
    const index = group.length - 1
    const prevName = group[index]
    const newGroup = replaceLastItem(group, name)
    const newName = newGroup[index]

    const changes = []
    for (let pool of api.pools.inGroup(group)) {
      const poolName = new PoolName(pool.name, delimiter)
      const parts = poolName.parts
      // Replace the group part of the full name
      parts[index] = parts[index].replace(prevName, newName)

      const name = parts.join(delimiter)
      changes.push({id: pool.id, changes: {name}})
    }
    const promise = api.pools.update(changes)
    return api.toast
      .promise(promise, {
        success: "Renamed pools",
        loading: "Renaming pools...",
        error: "Error renaming pools",
      })
      .catch((e) => {
        console.error(e)
      })
  }
)

export const rename = createCommand(
  "pools.rename",
  async ({api}, id: string, name: string) => {
    try {
      await api.pools.update({id, changes: {name}})
      api.toast.success("Renamed pool")
    } catch (e) {
      console.error(e)
      api.toast.error("Error renaming pool")
    }
  }
)

export const deleteGroup = createCommand(
  "pools.deleteGroup",
  ({api}, group: string[]) => {
    const descendantIds = api.pools.all
      .filter((pool) => {
        return new PoolName(pool.name, api.pools.nameDelimiter).isIn(group)
      })
      .map((pool) => pool.id)

    return deletePools.run(descendantIds)
  }
)
