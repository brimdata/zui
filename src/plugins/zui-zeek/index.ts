import BrimApi from "src/js/api"
import * as md5 from "./md5-correlations"
import {uidCorrelation} from "./uid-correlations"

export function activate(api: BrimApi) {
  api.correlations.add(md5.md5Correlation)
  api.correlations.add(md5.txHostsCorrelation)
  api.correlations.add(md5.rxHostsCorrelation)
  api.correlations.add(md5.filenameCorrelation)

  api.correlations.add(uidCorrelation)
}

export function deactivate(api: BrimApi) {
  api.correlations.remove(md5.md5Correlation.id)
  api.correlations.remove(md5.txHostsCorrelation.id)
  api.correlations.remove(md5.rxHostsCorrelation.id)
  api.correlations.remove(md5.filenameCorrelation.id)

  api.correlations.remove(uidCorrelation.id)
}
