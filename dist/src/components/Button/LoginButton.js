"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginButton = void 0;
const react_1 = __importDefault(require("react"));
const blackLogoSrc = 'https://firebasestorage.googleapis.com/v0/b/sphereone-testing.appspot.com/o/BlackLogo.png?alt=media&token=60ba8159-273a-4d01-9473-5a82685d9054';
const whiteLogoSrc = "https://firebasestorage.googleapis.com/v0/b/sphereone-testing.appspot.com/o/WhiteLogo.png?alt=media&token=e796c9fd-db1b-456a-818d-db1bab51c976";
const LoginButton = ({ buttonProps, imageProps, isLogoDark }) => {
    return (react_1.default.createElement("button", Object.assign({}, buttonProps),
        react_1.default.createElement("img", Object.assign({ src: isLogoDark ? blackLogoSrc : whiteLogoSrc, alt: "SphereOne logo" }, imageProps))));
};
exports.LoginButton = LoginButton;
