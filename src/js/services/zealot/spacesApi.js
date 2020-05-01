/* @flow */
export type SpacesCreateArgs = {data_dir: string}

export default {
  list() {
    return {
      path: "/space",
      method: "GET"
    }
  },
  get(name: string) {
    return {
      path: `/space/${encodeURIComponent(name)}`,
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
  delete(name: string) {
    return {
      path: `/space/${encodeURIComponent(name)}`,
      method: "DELETE"
    }
  }
}
