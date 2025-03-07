import {Lake} from "src/models/lake"
import Auth0Client from "../../../core/auth0"
import Current from "../../state/Current"
import {Thunk} from "../../state/types"

export const getAuth0 =
  (l?: Lake): Thunk<Auth0Client> =>
  (dispatch, getState) => {
    if (!l) l = Current.getLake(getState())
    if (!l.authType || l.authType !== "auth0") return null
    if (!l.authData) throw new Error("authData missing from lake")

    const {audience, clientId, domain} = l.authData

    return new Auth0Client(audience, clientId, domain)
  }
