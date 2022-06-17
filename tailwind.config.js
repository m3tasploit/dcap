const { plugin } = require("twrnc");

module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        "font-app": {
          fontFamily: "Poppins_400Regular",
        },
        "font-app-bold": {
          fontFamily: "Poppins_700Bold",
        },
        "font-app-semi": {
          fontFamily: "Poppins_600SemiBold",
        },
        "font-app-thin": {
          fontFamily: "Poppins_100Thin",
        },
      });
    }),
  ],
};
