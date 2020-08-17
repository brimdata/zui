import { createFetcher } from "./fetcher/fetcher.ts";
import { spaces, logs, pcaps, search, archive, subspaces } from "./api/mod.ts";
import { getHost } from "./util/host.ts";
import { getDefaultSearchArgs } from "./config/search_args.ts";
import {
  SearchArgs,
  SpaceArgs,
  PcapsPostArgs,
  PcapsGetArgs,
  LogsPostArgs,
  ZealotArgs,
  SubspaceCreateArgs,
} from "./types.ts";
import { IndexSearchArgs } from "./api/archive.ts";

export function createZealot(
  hostUrl: string,
  args: ZealotArgs = { fetcher: createFetcher },
) {
  let host = getHost(hostUrl);
  const { promise, stream } = args.fetcher(host);

  let searchArgs: SearchArgs = getDefaultSearchArgs();

  return {
    setHost: (hostUrl: string) => host = hostUrl,
    getHost: () => host,
    setSearchOptions: (args: Partial<SearchArgs>) => {
      searchArgs = { ...searchArgs, ...args };
    },
    status: () => {
      return promise({ method: "GET", path: "/status" });
    },
    search: (zql: string, args?: Partial<SearchArgs>) => {
      return stream(search(zql, { ...searchArgs, ...args }));
    },
    archive: {
      search: (args: IndexSearchArgs) => {
        return stream(
          { ...archive.search(args), enhancers: searchArgs.enhancers },
        );
      },
    },
    spaces: {
      list: () => {
        return promise(spaces.list());
      },
      get: (id: string) => {
        return promise(spaces.get(id));
      },
      stat: (id: string, args?: Partial<SearchArgs>) => {
        return stream(spaces.stat(id, { ...searchArgs, ...args }));
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
    subspaces: {
      create: (args: SubspaceCreateArgs) => {
        return promise(subspaces.create(args));
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
    inspect: {
      search: (zql: string, args?: Partial<SearchArgs>) => {
        return search(zql, { ...searchArgs, ...args });
      },
    },
  };
}
