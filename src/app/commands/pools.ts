import errors from "src/js/errors"
import {BrimError} from "src/js/errors/types"
import ErrorFactory from "src/js/models/ErrorFactory"
import {PoolName} from "../features/sidebar/pools-section/pool-name"
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
    const delimeter = api.configs.get("pools", "nameDelimeter")
    const index = group.length - 1
    const prevName = group[index]
    const newGroup = replaceLastItem(group, name)
    const newName = newGroup[index]

    const changes = []
    for (let pool of api.pools.inGroup(group)) {
      const poolName = new PoolName(pool.name, delimeter)
      const parts = poolName.parts
      // Replace the group part of the full name
      parts[index] = parts[index].replace(prevName, newName)
      const name = parts.join(delimeter)
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
    const decendentIds = api.pools.all
      .filter((pool) => {
        return new PoolName(pool.name, api.pools.nameDelimeter).isIn(group)
      })
      .map((pool) => pool.id)

    return deletePools.run(decendentIds)
  }
)

export const createAndLoadFiles = createCommand(
  "pools.createAndLoadFiles",
  async ({api}, files: File[]) => {
    try {
      await api.pools.createFromFiles(files)
      api.toast.success("Import complete.")
    } catch (e) {
      api.notice.error(parseError(e))
      api.pools.syncAll()
      console.error(e.message)
    }
  }
)

export const loadFiles = createCommand(
  "pools.loadFiles",
  async ({api}, id: string, files: File[]) => {
    try {
      await api.pools.loadFiles(id, files)
    } catch (e) {
      api.notice.error(parseError(e))
      api.pools.syncAll()
      console.error(e.message)
    }
  }
)

function parseError(e: Error): BrimError {
  const cause = e.cause
  if (/(Failed to fetch)|(network error)/.test(cause.message)) {
    return errors.importInterrupt()
  } else if (/format detection error/i.test(cause.message)) {
    return errors.formatDetection(cause.message)
  } else {
    return ErrorFactory.create(e.cause)
  }
}
