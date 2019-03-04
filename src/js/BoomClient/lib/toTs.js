import {msToTs} from "./time"

export default date => {
  return msToTs(date.getTime())
}
