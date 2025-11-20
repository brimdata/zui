# SuperDB Desktop

_The Official Front-End to the [SuperDB](https://superdb.org)_

The desktop app for exploring your data.

Highlights:

- **Drag-and-drop** data ingest
- **Automatic detection** of common data formats
- **Schema inference** during ingest
- **Beautiful result views** for nested or tabular data
- **Named queries** with version history
- **Query session history** to keep track of your work
- **Pinnable query fragments** to keep your search box uncluttered
- **Right-click menus** for pivoting and filtering

## Ready To Try It Out?

**[Download](https://www.brimdata.io/download/)** for your operating system.

Refer to the [installation guide](https://zui.brimdata.io/docs/Installation) and
[release notes](https://github.com/brimdata/zui/releases) for more information.

## Powered By SuperDB

[SuperDB](https://superdb.org) offers an innovative approach to working with data known as "[Super-Structured Data](https://www.brimdata.io/blog/super-structured-data/)".

Behind this app runs a local [server](https://superdb.org/command/db-serve.html) instance where you can load your data into [pools](https://superdb.org/database/intro.html#data-pools-1) and use [SuperSQL](https://superdb.org/super-sql/intro.html) to search, analyze, and transform it. Use it to:

- Explore deeply nested JSON objects
- View Parquet and Arrow IPC stream files
- Clean up CSV files by adding type information
- Search heterogeneous NDJSON logs
- Transform data from a legacy database's CDC logs
- Investigate [Zeek](https://zeek.org/) security logs

SuperDB provides a system to make working with data easier and more efficient. The [storage layer](https://superdb.org/formats/intro.html), [type system](https://superdb.org/formats/model.html), [query language](https://superdb.org/super-sql/intro.html), and [CLI tooling](https://superdb.org/command/super.html) are just a few of the tools SuperDB offers to the data community.

## Related Packages

This code repository is actually a [monorepo](https://en.wikipedia.org/wiki/Monorepo) (managed with [nx](https://nx.dev)) that includes several [packages](packages) on which the app depends. They may also be used as standalone tools. These include:

- [**superdb-types**](packages/superdb-types): the JavaScript library for the data types return from a server.
- [**superdb-node-client**](packages/superdb-node-client): the JavaScript library for [Node.js](https://nodejs.org/)
- [**player**](packages/app-player): the end-to-end testing framework for the desktop app

## Need Help?

Please browse the [support resources](https://zui.brimdata.io/docs/support) to review common problems and helpful tips before [opening an issue](https://zui.brimdata.io/docs/support/Troubleshooting#opening-an-issue).

## Contributing

We welcome your contributions! Please refer to our [contributing guide](apps/superdb-desktop/CONTRIBUTING.md) for information on how to get involved in development.

## Join the Community

[Join our public Slack](https://www.brimdata.io/join-slack/) workspace to stay up to date on announcements, ask questions, and exchange tips with other users.
