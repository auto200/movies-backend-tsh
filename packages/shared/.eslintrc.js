/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ["@movies/eslint-config/eslint-base.js"],
  env: {
    node: true,
  },
  parserOptions: {
    project: "tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  root: true,
};
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
module.exports = config;
