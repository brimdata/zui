import {Lake} from "ppl/lake/lake"

export default function lakeMainHandler(lake: Lake) {
  if (lake) {
    lake.start()
    console.log("lake started on: ", lake.addr())
  }
}
