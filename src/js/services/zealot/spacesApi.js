/* @flow */
export type SpacesCreateArgs = {name?: string, data_path?: string}
export type SpacesUpdateArgs = {name: string}

export default {
  list() {
    return {
      path: "/space",
      method: "GET"
    }
  },
  get(spaceId: string) {
    return {
      path: `/space/${encodeURIComponent(spaceId)}`,
      method: "GET"
    }
  },
  create(args: SpacesCreateArgs) {
    return {
      path: "/space",
      method: "POST",
      body: JSON.stringify(args)
    }
  },
  delete(spaceId: string) {
    return {
      path: `/space/${encodeURIComponent(spaceId)}`,
      method: "DELETE"
    }
  },
  update(spaceId: string, args: SpacesUpdateArgs) {
    return {
      path: `/space/${encodeURIComponent(spaceId)}`,
      method: "PUT",
      body: JSON.stringify(args)
    }
  }
}
