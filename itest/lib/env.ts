

import path from "path";

export const isCI = (): boolean => process.env.GITHUB_ACTIONS === "true";

export const repoDir = (): string => path.resolve(path.join(__dirname, "..", ".."));

export const itestDir = (): string => path.join(process.env.WORKSPACE || "run", "itest");

export const testDataDir = (): string => path.resolve(path.join(repoDir(), "itest", "testdata"));

export const nodeZqDistDir = (): string => path.resolve(path.join(repoDir(), "node_modules", "zq", "dist"));