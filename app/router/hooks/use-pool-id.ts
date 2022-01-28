import {useParams} from "react-router"

export default function usePoolId() {
  const {lakeId} = useParams<{lakeId: string}>()
  return lakeId
}
