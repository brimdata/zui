import {useParams} from "react-router"

export default function useLakeId() {
  const {lakeId} = useParams<{lakeId: string}>()
  return lakeId
}
