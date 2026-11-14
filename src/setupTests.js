// Create React App runs this file before every test file.
// react-router v7 needs TextEncoder, which the jsdom version of Jest 27 does not provide.
import { TextDecoder, TextEncoder } from "util";

if (typeof global.TextEncoder === "undefined") global.TextEncoder = TextEncoder;
if (typeof global.TextDecoder === "undefined") global.TextDecoder = TextDecoder;
