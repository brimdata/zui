import {QueryPin} from "src/js/state/Editor/types"
import styles from "./pins.module.css"
import {useSelector} from "react-redux"
import Editor from "src/js/state/Editor"
import {BasePin} from "./pins/base-pin"
import {GenericPinForm} from "./pins/generic-pin-form"
import TimeRangePinForm from "./pins/time-range-pin-form"
import {choosePoolMenu} from "src/domain/session/menus/choose-pool-menu"

export function Pins() {
  const pins = useSelector(Editor.getPins)
  return <div className={styles.container}>{pins.map(renderPin)}</div>
}

function renderPin(pin: QueryPin, index: number) {
  switch (pin.type) {
    case "from":
      return (
        <BasePin
          key={index}
          pin={pin}
          index={index}
          prefix="from"
          label={pin.value || "Select pool"}
          onMenu={(menu) =>
            menu.unshift(
              {label: "Switch Pool", nestedMenu: choosePoolMenu()},
              {type: "separator"}
            )
          }
        />
      )
    case "generic":
      return (
        <BasePin
          pin={pin}
          index={index}
          label={pin.label || pin.value || "Empty pin..."}
          form={GenericPinForm}
        />
      )
    case "time-range":
      return (
        <BasePin
          pin={pin}
          prefix="range"
          label={`${pin.from} — ${pin.to}`}
          index={index}
          form={TimeRangePinForm}
        />
      )
  }
}
