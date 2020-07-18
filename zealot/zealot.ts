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
  ZealotArgs,
} from "./types.ts";

export function createZealot(
  hostUrl: string,
  args: ZealotArgs = { fetcher: createFetcher },
) {
  const host = getHost(hostUrl);
  const { promise, stream } = args.fetcher(host);

  let searchArgs: SearchArgs = getDefaultSearchArgs();

  return {
    setSearchOptions: (args: Partial<SearchArgs>) => {
      searchArgs = { ...searchArgs, ...args };
    },
    status: () => {
      return promise({ method: "GET", path: "/status" });
    },
    search: (zql: string, args?: Partial<SearchArgs>) => {
      return stream(search(zql, { ...searchArgs, ...args }));
    },
    spaces: {
      list: () => {
        return promise(spaces.list());
      },
      get: (id: string) => {
        return promise(spaces.get(id));
      },
      create: (args: SpaceArgs) => {
        return promise(spaces.create(args));
      },
      delete: (id: string) => {
        return promise(spaces.delete(id));
      },
      update: (id: string, args: Partial<SpaceArgs>) => {
        return promise(spaces.update(id, args));
      },
    },
    pcaps: {
      post: (args: PcapsPostArgs) => {
        return stream(pcaps.post(args));
      },
      get: (args: PcapsGetArgs): Promise<Response> => {
        return promise(pcaps.get(args));
      },
    },
    logs: {
      post: (args: LogsPostArgs) => {
        return stream(logs.post(args));
      },
    },
  };
}
