"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fuselage_1 = require("@rocket.chat/fuselage");
var react_1 = __importDefault(require("react"));
var Surface_1 = require("./Surface");
var ModalSurface = function (_a) {
    var children = _a.children;
    return (react_1.default.createElement(Surface_1.Surface, { type: 'modal' },
        react_1.default.createElement(fuselage_1.Margins, { blockEnd: 'x16' }, children)));
};
exports.default = ModalSurface;
//# sourceMappingURL=ModalSurface.js.map