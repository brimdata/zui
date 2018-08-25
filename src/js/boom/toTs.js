import moment from "moment"
const BRO_TS_FORMAT = "X.SSSSSS"

export default date => moment.utc(date).format(BRO_TS_FORMAT)
