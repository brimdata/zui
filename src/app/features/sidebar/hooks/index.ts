import {useBrimApi} from "src/app/core/context"
import {useFilesDrop} from "src/util/hooks/use-files-drop"

export const useQueryImportOnDrop = () => {
  const api = useBrimApi()
  return useFilesDrop({onDrop: (files) => api.queries.import(files[0])})
}
