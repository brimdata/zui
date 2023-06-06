import {useSelector} from "react-redux"
import {Field} from "src/components/field"
import InputLabel from "src/js/components/common/forms/InputLabel"
import TextInput from "src/js/components/common/forms/TextInput"
import PoolSettings from "src/js/state/PoolSettings"
import {useForm} from "react-hook-form"
import {useDispatch} from "src/app/core/state"
import {State} from "src/js/state/types"

type Inputs = {
  timeField: string
  colorField: string
}

type Props = {
  close: () => void
  poolId: string
}

export function SettingsForm(props: Props) {
  const settings = useSelector((s: State) => PoolSettings.get(s, props.poolId))
  const dispatch = useDispatch()
  const form = useForm<Inputs>({defaultValues: settings})

  function onSubmit(data: Inputs) {
    dispatch(PoolSettings.upsert({id: props.poolId, ...data}))
    props.close()
  }

  return (
    <form method="dialog" onSubmit={form.handleSubmit(onSubmit)}>
      <Field>
        <InputLabel>Time Field</InputLabel>
        <TextInput {...form.register("timeField")} />
      </Field>
      <Field>
        <InputLabel>Color Field</InputLabel>
        <TextInput {...form.register("colorField")} />
      </Field>
      <button type="submit">save</button>
    </form>
  )
}
