import {useZuiApi} from "src/views/application/context"
import {useFilesDrop} from "src/util/hooks/use-files-drop"

export const useQueryImportOnDrop = () => {
  const api = useZuiApi()
  return useFilesDrop({onDrop: (files) => api.queries.import(files[0])})
}
