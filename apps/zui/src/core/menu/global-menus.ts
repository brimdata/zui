import ZuiApi from "src/js/api/zui-api"
import {MenuManager} from "./menu-manager"

export const menus = new MenuManager<{api: ZuiApi}>()
