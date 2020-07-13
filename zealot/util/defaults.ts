import { flatRecords, totalRecords, zngToZeek } from "../enhancers/mod.ts";
import { SearchArgs } from "../types.ts";

export default {
  searchArgs(): SearchArgs {
    return {
      from: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days
      to: new Date(),
      spaceId: "default",
      format: "zjson",
      controlMessages: true,
      enhancers: [zngToZeek, flatRecords, totalRecords],
    };
  },
  host(hostUrl: string) {
    let [host, port] = hostUrl.split(":");
    port = port ? port : "9867";
    return host + ":" + port;
  },
};
