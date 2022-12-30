import BrimApi from "src/js/api"
import {MenuManager} from "./menu-manager"

export const menus = new MenuManager<{api: BrimApi}>()
