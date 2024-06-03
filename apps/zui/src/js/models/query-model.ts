import {Query} from "src/js/state/Queries/types"
import {isEmpty, last, sortedIndex} from "lodash"
import {QueryPinInterface} from "../state/Editor/types"
import buildPin from "src/js/state/Editor/models/build-pin"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import {QuerySource} from "src/js/api/queries/types"

export class QueryModel implements Query {
  id: string
  name: string
  description?: string
  tags?: string[]
  isReadOnly?: boolean
  current: QueryVersion
  versions: QueryVersion[]
  source: QuerySource

  constructor(raw: Query, versions: QueryVersion[], source: QuerySource) {
    this.id = raw.id
    this.name = raw.name
    this.source = source
    this.versions = versions
    this.description = raw.description || ""
    this.tags = raw.tags || []
    this.isReadOnly = raw.isReadOnly || false
    this.current = last(versions)
  }

  get value() {
    return this.current?.value ?? ""
  }

  get pins() {
    return this.current?.pins ?? []
  }

  hasVersion(version: string): boolean {
    return !!this.versions?.map((v) => v.version).includes(version)
  }

  latestVersion(): QueryVersion {
    return last(this.versions) ?? null
  }

  latestVersionId() {
    if (this.latestVersion()) {
      return this.latestVersion().version
    } else {
      return null
    }
  }

  serialize(): Query {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      tags: this.tags,
      isReadOnly: this.isReadOnly,
    }
  }

  static versionToZed(version: QueryVersion): string {
    let pinS = []
    if (!isEmpty(version?.pins))
      pinS = version.pins
        .filter((p) => !p.disabled)
        .map<QueryPinInterface>(buildPin)
        .map((p) => p.toZed())
    let s = pinS
      .concat(version?.value ?? "")
      .filter((s) => s.trim() !== "")
      .join(" | ")
      .trim()

    if (isEmpty(s)) s = "*"

    return s
  }

  static versionToSourceSet(version: QueryVersion): SourceSet {
    let pins = []
    if (!isEmpty(version?.pins)) {
      pins = version.pins
        .filter((p) => !p.disabled)
        .map<QueryPinInterface>(buildPin)
        .map((p) => p.toZed())
    }
    return new SourceSet(pins, version?.value ?? "")
  }

  toString(): string {
    return QueryModel.versionToZed(this.current)
  }
}


// SourceSet is used to map an error offset from the Zed API to a position in
// the augmented query.
export class SourceSet {
  sources: Source[]
  contents: string
  constructor(pins: string[], src: string) {
    this.sources = []
    this.contents = ""
    for (let i = 0; i < pins.length; i++) {
      let s = pins[i]
      if (i > 0) {
        s = "| " + s
      }
      this._add(s, false)
    }
    if (this.contents.length == 0 && isEmpty(src)) {
      src = "*"
    }
    if (this.contents.length > 0) {
      this.contents += "| "
    }
    this._add(src, true)
  }
  _add(s: string, isMain: boolean) {
    this.sources.push(new Source(this.contents.length, s, isMain))
    this.contents += s
  }
  sourceOf(pos: number) {
    return this.sources.find(s => pos >= s.start && pos < s.start+s.length)
  }
}

export type Position = {
  column: number
  lineNumber: number
}

export class Source {
  start: number
  length: number
  isMain: boolean
  lines: number[]
  constructor(start: number, s: string, isMain: boolean) {
    this.start = start
    this.length = s.length
    this.isMain = isMain
    this.lines = [0]
    for (let k = 0; k < s.length; k++) {
      if (s[k] === "\n") {
        this.lines.push(k+1)
      }
    }
  }
  position(pos: number): Position {
    let offset  = pos - this.start
    let i = sortedIndex(this.lines, offset) - 1
    return {
      column: offset-this.lines[i]+1,
      lineNumber: i+1
    }
  }
}
