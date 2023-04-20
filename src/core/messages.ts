import {MenusMessages} from "src/domain/menus/messages"
import {PanesMessages} from "src/domain/panes/messages"
import {ResultsMessages} from "src/domain/results/messages"

export type Messages = ResultsMessages & MenusMessages & PanesMessages

export type MessageName = keyof Messages
