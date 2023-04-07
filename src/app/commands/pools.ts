import {CreatePoolOpts, LoadFormat} from "@brimdata/zed-js"
import errors from "src/js/errors"
import {ErrorData} from "src/js/errors/types"
import ErrorFactory from "src/js/models/ErrorFactory"
import {PoolName} from "../features/sidebar/pools-section/pool-name"
import {lakePoolPath} from "../router/utils/paths"
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
    const decendentIds = api.pools.all
      .filter((pool) => {
        return new PoolName(pool.name, api.pools.nameDelimiter).isIn(group)
      })
      .map((pool) => pool.id)

    return deletePools.run(decendentIds)
  }
)

export const createAndLoadFiles = createCommand(
  "pools.createAndLoadFiles",
  async (
    {api},
    files: File[],
    opts: {name?: string; format?: LoadFormat} & Partial<CreatePoolOpts> = {}
  ) => {
    let poolId: string | null = null
    const lakeId = api.current.lakeId
    const tabId = api.current.tabId
    const poolNames = api.pools.all.map((p) => p.name)
    if (!opts.name && files.length === 0) {
      api.toast("No pool name and no files provided.")
      return
    }
    try {
      const name =
        opts.name ||
        (await global.zui.invoke(
          "derivePoolNameOp",
          await global.zui.invoke(
            "detectFileTypesOp",
            files.map((f) => f.path)
          ),
          poolNames
        ))
      poolId = await api.pools.create(name, opts)

      if (files.length === 0) {
        api.toast.success("Pool created: " + name)
      } else {
        const promise = api.pools.loadFiles(poolId, files, opts.format)
        api.toast.promise(promise, {
          loading: `Loading data into pool: ${name}...`,
          success: "Load successful",
          error: "Load error",
        })
        await promise
      }

      api.url.push(lakePoolPath(poolId, lakeId), {tabId})
    } catch (e) {
      if (poolId) await api.pools.delete(poolId)
      api.notice.error(parseError(e))
      api.pools.syncAll()
    }
  }
)

export const loadFiles = createCommand(
  "pools.loadFiles",
  async ({api}, id: string, files: File[], format?: LoadFormat) => {
    try {
      const promise = api.pools.loadFiles(id, files, format)
      api.toast.promise(promise, {
        loading: "Loading data into pool...",
        success: "Load successful",
        error: "Load error",
      })
      await promise
    } catch (e) {
      api.notice.error(parseError(e))
      api.pools.syncAll()
      console.error(e)
    }
  }
)

function parseError(e: Error): ErrorData {
  if (/(Failed to fetch)|(network error)/.test(e && e.message)) {
    return errors.importInterrupt()
  } else if (/format detection error/i.test(e && e.message)) {
    return errors.formatDetection(e.message)
  } else if (/EISDIR/.test(e && e.message)) {
    return ErrorFactory.create(
      new Error(
        "Importing directories is not yet supported. Select multiple files."
      )
    )
  } else {
    return ErrorFactory.create(e)
  }
}
