import {useSelector} from "react-redux"
import {Field} from "src/components/field"
import InputLabel from "src/js/components/common/forms/InputLabel"
import TextInput from "src/js/components/common/forms/TextInput"
import PoolSettings from "src/js/state/PoolSettings"
import {useForm} from "react-hook-form"
import {useDispatch} from "src/app/core/state"
import {State} from "src/js/state/types"
import styles from "./histogram-pane.module.css"
import {runHistogramQuery} from "./run-histogram-query"
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
    dispatch(runHistogramQuery())
  }

  return (
    <form
      method="dialog"
      onSubmit={form.handleSubmit(onSubmit)}
      className={styles.settingsForm}
    >
      <Field>
        <InputLabel>Time Field</InputLabel>
        <TextInput
          {...form.register("timeField")}
          placeholder={defaults.timeField}
        />
      </Field>
      <Field>
        <InputLabel>Color Field</InputLabel>
        <TextInput
          {...form.register("colorField")}
          placeholder={defaults.colorField}
        />
      </Field>
      <button type="submit">save</button>
    </form>
  )
}
