import {combineReducers} from "redux"
import broSchemas from "./broSchemas"
import mainSearch from "./mainSearch"
import eventsByUid from "./eventsByUid"
import initialLoad from "./initialLoad"
import spaces from "./spaces"
import currentSpaceName from "./currentSpaceName"
import timeWindow from "./timeWindow"
import filterTree from "./filterTree"
import countByTime from "./countByTime"
import analysis from "./analysis"
import sideBar from "./sideBar"
import logDetails from "./logDetails"
import searchStats from "./searchStats"
import boomdCredentials from "./boomdCredentials"
import boomdConnection from "./boomdConnection"
import searchBar from "./searchBar"
import view from "./view"
import starredLogs from "./starredLogs"

export default combineReducers({
  view,
  searchBar,
  initialLoad,
  broSchemas,
  mainSearch,
  eventsByUid,
  spaces,
  currentSpaceName,
  timeWindow,
  filterTree,
  countByTime,
  analysis,
  sideBar,
  logDetails,
  searchStats,
  boomdCredentials,
  boomdConnection,
  starredLogs
})
