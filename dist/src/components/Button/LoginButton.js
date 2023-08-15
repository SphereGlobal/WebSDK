"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const BlackLogo_png_1 = __importDefault(require("../../assets/BlackLogo.png"));
const WhiteLogo_png_1 = __importDefault(require("../../assets/WhiteLogo.png"));
const LoginButton = ({ onClick, buttonStyle, isLogoDark = false }) => {
    return (react_1.default.createElement("button", { style: buttonStyle, onClick: onClick },
        react_1.default.createElement("img", { src: isLogoDark ? BlackLogo_png_1.default : WhiteLogo_png_1.default, alt: "logo" })));
};
exports.default = LoginButton;
