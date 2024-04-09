import {useSelector} from "react-redux"
import PoolSettings from "src/js/state/PoolSettings"
import {useForm} from "react-hook-form"
import {useDispatch} from "src/app/core/state"
import {State} from "src/js/state/types"
import {runHistogramQuery} from "./run-query"
import {getDefaults} from "src/js/state/PoolSettings/selectors"

type Inputs = {
  timeField: string
  colorField: string
}

type Props = {
  close: () => void
  poolId: string
}

const defaults = getDefaults()

export function SettingsForm(props: Props) {
  const settings = useSelector((s: State) => PoolSettings.find(s, props.poolId))
  const dispatch = useDispatch()
  const form = useForm<Inputs>({defaultValues: settings})

  function onSubmit(data: Inputs) {
    const timeField = data.timeField.trim() || defaults.timeField
    const colorField = data.colorField.trim() || defaults.colorField
    const id = props.poolId
    dispatch(PoolSettings.upsert({id, timeField, colorField}))
    props.close()
    runHistogramQuery()
  }

  return (
    <form
      method="dialog"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flow"
    >
      <label>Time Field</label>
      <input
        type="text"
        {...form.register("timeField")}
        placeholder={defaults.timeField}
      />
      <label>Color Field</label>
      <input
        type="text"
        {...form.register("colorField")}
        placeholder={defaults.colorField}
      />
      <button
        type="submit"
        className="button submit"
        style={{display: "block", marginInlineStart: "auto"}}
      >
        Save
      </button>
    </form>
  )
}
