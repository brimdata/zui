"use strict";
exports.__esModule = true;
exports.nodeZqDistDir = exports.testDataDir = exports.itestDir = exports.repoDir = exports.isCI = void 0;
var path_1 = require("path");
exports.isCI = function () { return process.env.GITHUB_ACTIONS === "true"; };
exports.repoDir = function () { return path_1["default"].resolve(path_1["default"].join(__dirname, "..", "..")); };
exports.itestDir = function () { return path_1["default"].join(process.env.WORKSPACE || "run", "itest"); };
exports.testDataDir = function () { return path_1["default"].resolve(path_1["default"].join(exports.repoDir(), "itest", "testdata")); };
exports.nodeZqDistDir = function () { return path_1["default"].resolve(path_1["default"].join(exports.repoDir(), "node_modules", "zq", "dist")); };
