import Auth0Client from "../../auth0"
import {BrimLake} from "../../brim"
import Current from "../../state/Current"
import {Thunk} from "../../state/types"

export const getAuth0 =
  (l?: BrimLake): Thunk<Auth0Client> =>
  (dispatch, getState) => {
    if (!l) l = Current.getLake(getState())
    if (!l.authType || l.authType !== "auth0") return null
    if (!l.authData) throw new Error("authData missing from lake")

    const {clientId, domain} = l.authData

    return new Auth0Client(clientId, domain)
  }
