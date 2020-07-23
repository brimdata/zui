import { SpaceArgs, SearchArgs } from "../types.ts";

export default {
  list() {
    return {
      path: "/space",
      method: "GET",
    };
  },
  get(spaceId: string) {
    return {
      path: `/space/${encodeURIComponent(spaceId)}`,
      method: "GET",
    };
  },
  create(args: SpaceArgs) {
    return {
      path: "/space",
      method: "POST",
      body: JSON.stringify(args),
    };
  },
  delete(spaceId: string) {
    return {
      path: `/space/${encodeURIComponent(spaceId)}`,
      method: "DELETE",
    };
  },
  update(spaceId: string, args: Partial<SpaceArgs>) {
    return {
      path: `/space/${encodeURIComponent(spaceId)}`,
      method: "PUT",
      body: JSON.stringify(args),
    };
  },
};
