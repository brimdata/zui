/* @flow */
export type SpacesCreateArgs = {dir: string}

export default {
  list() {
    return {
      path: "/space",
      method: "GET"
    }
  },
  get(name: string) {
    return {
      path: `/space/${name}`,
      method: "GET"
    }
  },
  create(args: SpacesCreateArgs) {
    return {
      path: "/space",
      method: "POST",
      body: JSON.stringify(args)
    }
  }
}
