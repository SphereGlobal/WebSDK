"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const blackLogoSrc = 'https://firebasestorage.googleapis.com/v0/b/sphereone-testing.appspot.com/o/BlackLogo.png?alt=media&token=60ba8159-273a-4d01-9473-5a82685d9054';
const LoginButton = (_a) => {
    var { buttonStyle, imageStyles } = _a, props = __rest(_a, ["buttonStyle", "imageStyles"]);
    return (react_1.default.createElement("button", Object.assign({ style: Object.assign({ backgroundColor: '#7ACBFF', paddingTop: '0.625rem', paddingBottom: '0.625rem', borderRadius: '0.5rem', alignItems: 'center', display: 'inline-flex', paddingLeft: '1.25rem', paddingRight: '1.25rem' }, buttonStyle) }, props),
        react_1.default.createElement("img", { height: "20px", src: blackLogoSrc, alt: "SphereOne logo", style: Object.assign({ height: "20px" }, imageStyles) })));
};
exports.default = LoginButton;
