/* @flow */
import {isEmpty} from "lodash"
import {useDispatch, useSelector} from "react-redux"

import type {FormConfig} from "../../brim/form"
import {globalDispatch} from "../../state/GlobalContext"
import Prefs from "../../state/Prefs"
import View from "../../state/View"
import lib from "../../lib"

export default function usePreferencesForm(): FormConfig {
  let dispatch = useDispatch()
  return {
    timeZone: {
      name: "timeZone",
      label: "Timezone",
      defaultValue: useSelector(View.getTimeZone),
      submit: (value) => dispatch(View.setTimeZone(value)),
      check: (value) => [!isEmpty(value), "must not be blank"]
    },
    timeFormat: {
      name: "timeFormat",
      label: "Time Format",
      defaultValue: useSelector(Prefs.getTimeFormat),
      submit: (value) => globalDispatch(Prefs.setTimeFormat(value))
    },
    zeekRunner: {
      name: "zeekRunner",
      label: "Zeek Runner",
      defaultValue: useSelector(Prefs.getZeekRunner),
      submit: (value) => globalDispatch(Prefs.setZeekRunner(value)),
      check: (path) => {
        if (path === "") return [true, ""]
        return lib
          .file(path)
          .exists()
          .then((exists) => [exists, "file does not exist."])
      }
    },
    jsonTypeConfig: {
      name: "jsonTypeConfig",
      label: "JSON Type Config",
      defaultValue: useSelector(Prefs.getJSONTypeConfig),
      submit: (value) => globalDispatch(Prefs.setJSONTypeConfig(value)),
      check: (path) => {
        if (path === "") return [true, ""]
        return lib
          .file(path)
          .read()
          .then((text) => JSON.parse(text))
          .catch((e) => {
            let msg = e.name + ": " + e.message
            if (/SyntaxError/.test(msg)) {
              return [false, "file does not contain valid JSON."]
            } else if (/ENOENT/.test(msg)) {
              return [false, "file does not exist."]
            } else {
              return [false, msg]
            }
          })
      }
    }
  }
}
