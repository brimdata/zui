/* @flow */

import type {Dispatch} from "../../reducers/types"
import {Handler} from "../../BoomClient"
import type {Span} from "../../BoomClient/types"
import {addHeadProc} from "../../lib/Program"
import {addTuplesByUid} from "../../actions/tuplesByUid"
import {discoverDescriptors} from "../../actions/descriptors"
import BaseSearch from "./BaseSearch"

export default class UidSearch extends BaseSearch {
  uid: string

  constructor(uid: string, span: Span) {
    super(uid, span)
    this.uid = uid
  }

  getProgram() {
    return addHeadProc(this.program, 500)
  }

  receiveData(handler: Handler, dispatch: Dispatch) {
    handler
      .channel(0, ({type, results}) => {
        if (type === "SearchResult") {
          const {tuples} = results
          dispatch(addTuplesByUid(this.program, tuples))
          dispatch(discoverDescriptors(tuples))
        }
      })
      .error(e => e)
  }
}
