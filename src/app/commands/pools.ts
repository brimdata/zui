import {PoolName} from "../features/sidebar/pools-section/pool-name"
import {createCommand} from "./command"
import {deletePools} from "./delete-pools"

export const renameGroup = createCommand(
  "pools.renameGroup",
  ({api}, group: string[], name: string) => {
    const newGroup = [...group]
    newGroup[group.length - 1] = name
    const promise = api.pools.renameGroup({
      group: group,
      changes: {group: newGroup},
    })
    api.toast.promise(promise, {
      success: "Renamed pools",
      loading: "Renaming pools...",
      error: "Error renaming pools",
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
    const decendentIds = api.pools.all
      .filter((pool) => {
        return new PoolName(
          pool.name,
          api.configs.get("pools", "nameDelimeter")
        ).within(group)
      })
      .map((pool) => pool.id)

    return deletePools.run(decendentIds)
  }
)
