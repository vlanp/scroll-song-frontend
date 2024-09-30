module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "@welldone-software/why-did-you-render",
          runtime: "automatic",
          development: process.env.NODE_ENV === "development" || false,
        },
      ],
    ],
  };
};
