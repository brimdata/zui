"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var logStep_1 = require("../util/logStep");
var waitForClickable = function (app, selector) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // In testing, it's been shown than there is no need to scroll to
            // elements to make them be visible, as long as the element's
            // container allows scrolling. However, some Internet searches suggest
            // scrolling to the element before trying to click in order to avoid
            // problems like those described in
            // https://github.com/brimsec/brim/issues/668
            return [4 /*yield*/, logStep_1["default"]("wait for element to exist: \"" + selector + "\"", function () { return app.client.waitForExist(selector); })];
            case 1:
                // In testing, it's been shown than there is no need to scroll to
                // elements to make them be visible, as long as the element's
                // container allows scrolling. However, some Internet searches suggest
                // scrolling to the element before trying to click in order to avoid
                // problems like those described in
                // https://github.com/brimsec/brim/issues/668
                _a.sent();
                return [4 /*yield*/, logStep_1["default"]("wait for element to be visible: \"" + selector + "\"", function () { return app.client.waitForVisible(selector); })];
            case 2:
                _a.sent();
                return [2 /*return*/, logStep_1["default"]("scroll to: \"" + selector + "\"", function () { return app.client.scroll(selector); })];
        }
    });
}); };
// export const click = (app: Application, selector: string) => logStep(`click on selector "${selector}"`, async () => {
//   await waitForClickable(app, selector);
//   try {
//     return retryUntil(() => app.client.click(selector), success => success);
//   } catch (e) {
//     LOG.debug("trying to execute script for click: " + e);
//     return app.client.selectorExecute(selector, elem => {
//       elem.click();
//     });
//   }
// });
// export const rightClick = (app: Application, selector: string) => logStep(`right-click on selector "${selector}"`, async () => {
//   await waitForClickable(app, selector);
//   try {
//     return retryUntil(() => app.client.rightClick(selector), success => success);
//   } catch (e) {
//     LOG.debug("trying to execute script for rightClick: " + e);
//     return app.client.selectorExecute(selector, elem => {
//       elem.rightClick();
//     });
//   }
// });
// export const waitForClickableButtonAndClick = async (app: Application, selector: string) => {
//   await waitForClickable(app, selector);
//   // In addition to waitForClickable above, buttons must also be enabled.
//   await logStep(`wait for button ${selector} to be enabled`, () => retryUntil(() => app.client.getAttribute(selector, "disabled"), isDisabled => !isDisabled));
//   // We can use app.client.click() here because we've done the necessary
//   // waiting.
//   try {
//     return retryUntil(() => app.client.click(selector), success => success);
//   } catch (e) {
//     LOG.debug("trying to execute script for click: " + e);
//     return app.client.selectorExecute(selector, elem => {
//       elem.click();
//     });
//   }
// };
