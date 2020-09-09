"use strict";
exports.__esModule = true;
exports.retryUntil = exports.retry = void 0;
function retry(f, attempts, delay) {
    if (attempts === void 0) { attempts = 100; }
    if (delay === void 0) { delay = 100; }
    return new Promise(function (resolve, reject) {
        f().then(function (ret) { return resolve(ret); })["catch"](function (err) {
            setTimeout(function () {
                if (attempts === 1) {
                    reject(err);
                }
                else {
                    retry(f, attempts - 1, delay).then(function (ret) { return resolve(ret); })["catch"](function (err) { return reject(err); });
                }
            }, delay);
        });
    });
}
exports.retry = retry;
exports.retryUntil = function (f, cond_f, attempts, delay) {
    if (attempts === void 0) { attempts = 15; }
    if (delay === void 0) { delay = 1000; }
    // it is resolved and is responsible for examining and returning a boolean to
    // determine if the condition is satisfied.
    return retry(function () { return new Promise(function (resolve, reject) {
        f().then(function (val) {
            if (cond_f(val)) {
                resolve(val);
            }
            else {
                reject(new Error("retryUntil condition failure: " + val));
            }
        })["catch"](function (err) {
            reject("retryUntil promise failure: " + err);
        });
    }); }, attempts, delay);
};
