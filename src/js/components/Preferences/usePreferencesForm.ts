
import { isEmpty } from "lodash";
import { useDispatch, useSelector } from "react-redux";

import { FormConfig } from "../../brim/form";
import { globalDispatch } from "../../state/GlobalContext";
import Prefs from "../../state/Prefs";
import View from "../../state/View";
import lib from "../../lib";

export default function usePreferencesForm(): FormConfig {
  let dispatch = useDispatch();
  return {
    timeZone: {
      name: "timeZone",
      label: "Timezone",
      defaultValue: useSelector(View.getTimeZone),
      submit: value => dispatch(View.setTimeZone(value)),
      check: value => [!isEmpty(value), "must not be blank"]
    },
    timeFormat: {
      name: "timeFormat",
      label: "Time Format",
      defaultValue: useSelector(Prefs.getTimeFormat),
      submit: value => globalDispatch(Prefs.setTimeFormat(value))
    },
    zeekRunner: {
      name: "zeekRunner",
      label: "Zeek Runner",
      defaultValue: useSelector(Prefs.getZeekRunner),
      submit: value => globalDispatch(Prefs.setZeekRunner(value)),
      check: path => {
        if (path === "") return [true, ""];
        return lib.file(path).exists().then(exists => [exists, "file does not exist."]);
      }
    },
    jsonTypeConfig: {
      name: "jsonTypeConfig",
      label: "JSON Type Config",
      defaultValue: useSelector(Prefs.getJSONTypeConfig),
      submit: value => globalDispatch(Prefs.setJSONTypeConfig(value)),
      check: path => {
        if (path === "") return [true, ""];
        return lib.file(path).read().then(text => JSON.parse(text)).then(() => [true, ""]).catch(e => {
          let msg = e.name + ": " + e.message;
          if (/SyntaxError/.test(msg)) {
            return [false, "file does not contain valid JSON."];
          } else if (/ENOENT/.test(msg)) {
            return [false, "file does not exist."];
          } else {
            return [false, msg];
          }
        });
      }
    },
    dataDir: {
      name: "dataDir",
      label: "Data Directory",
      defaultValue: useSelector(Prefs.getDataDir),
      submit: value => globalDispatch(Prefs.setDataDir(value)),
      check: path => {
        if (path === "") return [true, ""];
        return lib.file(path).isDirectory().then(isDir => [isDir, "Selection must be a directory"]).catch(e => {
          let msg = e.name + ": " + e.message;
          return /ENOENT/.test(msg) ? [false, "Directory does not exist."] : [false, msg];
        });
      }
    }
  };
}