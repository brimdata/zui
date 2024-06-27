import {ConfigItem} from "src/domain/configurations/plugin-api"
import {Config} from "src/zui"
import {Input} from "./input"
import {Link} from "src/components/link"

export type SettingProps = {field: ConfigItem; sectionName: string}

export function Section(props: {config: Config}) {
  return (
    <>
      {Object.values(props.config.properties)
        .sort((a, b) => (a.name < b.name ? -1 : 1))
        .map((field) => (
          <Setting
            key={props.config.name + field.name}
            sectionName={props.config.name}
            field={field}
          />
        ))}
    </>
  )
}

function Setting(props: SettingProps) {
  return (
    <>
      <label htmlFor={props.field.name} className="repel">
        {props.field.label}
        <HelpLink {...props} />
      </label>
      <Input {...props} />
    </>
  )
}

function HelpLink(props: SettingProps) {
  if (!props.field.helpLink) return null
  const {url, label} = props.field.helpLink
  return <Link href={url}>{label}</Link>
}
