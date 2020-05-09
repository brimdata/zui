/* @flow */
export type SpacesCreateArgs = {name?: string, data_dir?: string}
export type SpacesUpdateArgs = {name: string}

export default {
  list() {
    return {
      path: "/space",
      method: "GET"
    }
  },
  get(spaceID: string) {
    return {
      path: `/space/${encodeURIComponent(spaceID)}`,
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
  delete(spaceID: string) {
    return {
      path: `/space/${encodeURIComponent(spaceID)}`,
      method: "DELETE"
    }
  },
  update(spaceID: string, args: SpacesUpdateArgs) {
    return {
      path: `/space/${encodeURIComponent(spaceID)}`,
      method: "PUT",
      body: JSON.stringify(args)
    }
  }
}
