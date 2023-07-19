export type Point = {time: Date; count: number; group: string}
export type WidePoint = {time: Date; sum: number} & {[group: string]: number}
