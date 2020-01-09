// flow-typed signature: 8d4d1d1782f101f33bfaf7b11941718b
// flow-typed version: c6154227d1/md5_v2.x.x/flow_>=v0.25.x <=v0.103.x

// @flow

declare module "md5" {
  declare module.exports: (
    message: string | Buffer,
    options?: {
      asString?: boolean,
      asBytes?: boolean,
      encoding?: string
    }
  ) => string;
}
