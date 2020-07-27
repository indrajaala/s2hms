export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "umd",
      name: "s2hms",
    },
    {
      file: "dist/index.esm.js",
      format: "es",
    },
  ],
};
