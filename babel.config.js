module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: 5,
          ie: 9,
        },
      },
    ],
  ],
}
