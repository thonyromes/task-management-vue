/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#1B2B65", // Navy blue from the logo/buttons
          secondary: "#FFB800", // Yellow/gold accent color
          accent: "#FFB800", // Same as secondary for consistency
          neutral: "#3D4451",
          "base-100": "#FFFFFF",
          "base-content": "#1B2B65",
        },
      },
      "dark",
    ],
  },
};
