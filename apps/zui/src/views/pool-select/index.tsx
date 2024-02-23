import {useSelector} from "react-redux"
import Current from "src/js/state/Current"

export function PoolSelect(props: any) {
  const pools = useSelector(Current.getPools)
  return (
    <div className="field">
      <label htmlFor="poolId">Pool</label>
      <select name="poolId" id="poolId" {...props}>
        <>
          <option value="new">+ New Pool</option>
          {pools.map((pool) => (
            <option key={pool.id} value={pool.id}>
              {pool.name}
            </option>
          ))}
        </>
      </select>
    </div>
  )
}
