import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

// Match the legacy `extends: ["next/core-web-vitals", "next/typescript"]` setup
// using the flat-config exports provided by `eslint-config-next`.

const config = [...nextCoreWebVitals, ...nextTypeScript];

export default config;
