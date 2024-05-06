import {useZuiApi} from "src/app/core/context"
import {useFilesDrop} from "src/util/hooks/use-files-drop"

export const useQueryImportOnDrop = () => {
  const api = useZuiApi()
  return useFilesDrop({onDrop: (files) => api.queries.import(files[0])})
}
