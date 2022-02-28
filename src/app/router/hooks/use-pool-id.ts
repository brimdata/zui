import {useParams} from "react-router"

export default function usePoolId() {
  const {poolId} = useParams<{poolId: string}>()
  return poolId
}
