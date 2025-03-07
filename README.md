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

## Powered By Zed

[Zed](https://zed.brimdata.io/docs) offers an innovative approach to working with data known as "[Super-Structured Data](https://www.brimdata.io/blog/super-structured-data/)".

Behind Zui is a local [Zed Lake](https://zed.brimdata.io/docs/commands/zed) instance where you can load your data into [pools](https://zed.brimdata.io/docs/commands/zed#data-pools) and use the powerful Zed [language](https://zed.brimdata.io/docs/language) to search, analyze, and transform it. Use it to:

- Explore deeply nested JSON objects
- View Parquet and Arrow IPC stream files
- Clean up CSV files by adding type information
- Search heterogeneous NDJSON logs
- Transform data from a legacy database's CDC logs
- Investigate [Zeek](https://zeek.org/) security logs

Zed provides a system to make working with data easier and more efficient. The [storage layer](https://zed.brimdata.io/docs/formats), [type system](https://zed.brimdata.io/docs/formats/zed), [query language](https://zed.brimdata.io/docs/language/overview), and [`zq`](https://zed.brimdata.io/docs/commands/zq) command-line utility are just a few of the tools Zed offers to the data community.

## Formerly Known as "Brim"

For many years, the app was known as Brim, named after the company [Brim Data](https://www.brimdata.io/) that created it. In 2023, it was renamed to Zui (a play on "Zed User Interface") to better reflect its connection to the Zed technology that powers it.

Zui retains the security-specific features that made Brim popular while expanding its reach to anyone who has data to work with. For example, you'll still find the customized views, histograms, and correlations relevant to the security domain appearing in Zui via its nascent plugin system. In the future, developers will be able to create custom plugins that make Zui even more effective for their specific needs.

## Related Packages

This Zui code repository is actually a [monorepo](https://en.wikipedia.org/wiki/Monorepo) (managed with [nx](https://nx.dev)) that includes several [packages](packages) on which the app depends. They may also be used as standalone tools. These include:

- [**zed-js**](packages/zed-js): the JavaScript library for browsers
- [**zed-node**](packages/zed-node): the JavaScript library for [Node.js](https://nodejs.org/)
- [**player**](packages/player): the end-to-end testing framework for Zui

## Need Help?

Please browse the [support resources](https://zui.brimdata.io/docs/support) to review common problems and helpful tips before [opening an issue](https://zui.brimdata.io/docs/support/Troubleshooting#opening-an-issue).

## Contributing

We welcome your contributions! Please refer to our [contributing guide](apps/zui/CONTRIBUTING.md) for information on how to get involved in development.

## Join the Community

[Join our public Slack](https://www.brimdata.io/join-slack/) workspace to stay up to date on announcements, ask questions, and exchange tips with other users.
