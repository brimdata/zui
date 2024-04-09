import {useEffect, useState} from "react"
import {Config} from "src/domain/configurations/plugin-api"
import {invoke} from "src/core/invoke"

export const useFields = () => {
  const [configs, setConfigs] = useState<Config[]>([])

  useEffect(() => {
    invoke("getConfigurationsOp").then((configs) => {
      setConfigs(configs)
    })
  }, [])

  return configs
}
