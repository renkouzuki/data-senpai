import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

const packageJson = require("./package.json");

const commonPlugins = [
  peerDepsExternal(),
  resolve(),
  commonjs(),
  typescript({ tsconfig: "./tsconfig.json" }),
  terser(),
  postcss(),
];

const commonExternals = ["react", "react-dom", "next"];

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: commonPlugins,
    external: commonExternals,
  },
  {
    input: "src/client.ts",
    output: [
      {
        file: "dist/client.js",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/client.mjs",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: commonPlugins,
    external: commonExternals,
  },

  {
    input: "src/index.ts",
    output: [{ file: packageJson.types }],
    plugins: [dts.default()],
    external: [/\.css$/],
  },
  {
    input: "src/client.ts",
    output: [{ file: "dist/client.d.ts" }],
    plugins: [dts.default()],
    external: [/\.css$/],
  },
];
