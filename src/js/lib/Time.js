// Our own wrapper around the moment library

import moment from "moment"
import "moment-timezone"

export default moment

export const parse = moment

export const LocalTime = moment

export const zones = moment.tz.names

export const setZone = zone => moment.tz.setDefault(zone)
