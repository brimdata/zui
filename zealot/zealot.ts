import { createFetcher } from "./fetcher/fetcher.ts";
import { spaces, logs, pcaps, search } from "./api/mod.ts";
import { getHost } from "./util/host.ts";
import { getDefaultSearchArgs } from "./config/search_args.ts";
import {
  SearchArgs,
  SpaceArgs,
  PcapsPostArgs,
  PcapsGetArgs,
  LogsPostArgs,
} from "./types.ts";

export function createZealot(hostUrl: string) {
  const host = getHost(hostUrl);
  const { promise, response } = createFetcher(host);
  let searchArgs: SearchArgs = getDefaultSearchArgs();

  return {
    setSearchOptions: (args: Partial<SearchArgs>) => {
      searchArgs = { ...searchArgs, ...args };
    },
    status: () => promise({ method: "GET", path: "/status" }),
    search: (zql: string, args?: Partial<SearchArgs>) =>
      response(search(zql, { ...searchArgs, ...args })),
    spaces: {
      list: () => promise(spaces.list()),
      get: (id: string) => promise(spaces.get(id)),
      create: (args: SpaceArgs) => promise(spaces.create(args)),
      delete: (id: string) => promise(spaces.delete(id)),
      update: (id: string, args: Partial<SpaceArgs>) =>
        promise(spaces.update(id, args)),
    },
    pcaps: {
      post: (args: PcapsPostArgs) => response(pcaps.post(args)),
      get: (args: PcapsGetArgs) => promise(pcaps.get(args)),
    },
    logs: {
      post: (args: LogsPostArgs) => response(logs.post(args)),
    },
  };
}
