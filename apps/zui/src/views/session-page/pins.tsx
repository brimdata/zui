import {QueryPin} from "src/js/state/Editor/types"
import styles from "./pins.module.css"
import {GenericPin} from "./pins/generic-pin"
import {TimeRangePin} from "./pins/time-range-pin"
import {useSelector} from "react-redux"
import Editor from "src/js/state/Editor"
import {BasePin} from "./pins/base-pin"
import {choosePoolMenu} from "src/domain/session/handlers/pins"

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
              {label: "Switch Pool", submenu: choosePoolMenu()},
              {type: "separator"}
            )
          }
        />
      )
    case "generic":
      return <GenericPin pin={pin} index={index} key={index} />
    case "time-range":
      return <TimeRangePin pin={pin} index={index} key={index} />
  }
}
