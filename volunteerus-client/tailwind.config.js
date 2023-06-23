/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js, jsx, ts, tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", "sans-serif"],
        serif: ["Cambria", "serif"],
      },
      fontWeight: {
        'extra-bold': '800',
      },
      colors: {
        primary: {
          "100": "#fedede",
          "200": "#fecfcf",
          "300": "#ffbcbc",
          "500": "#ff89b3",
          "600": "#ff73a4",
          "800": "#ff3860"
        },
        secondary: {
          "400": "#d9d9d9",
          "500": "#b9b9b9",
          "600": "#959595",
          "700": "#707070",
        },
        info : {
          "600": "#abebff",
        },
        success : {
          "600": "#7ce16b",
        },
        warning : {
          "600": "#fff06d",
        },
        danger : {
          "400": "#f72525",
          "600": "#d75c5c",
        },
        'pink' : {
          "100": "#fedede",
          "200": "#fee1e1",
          "300": "#f6d2d2",
          "400": "#ff71a3",
          "500": "#fd73a4",
          "700": "#ff3860",
        },
        'marine' : {
          "500": "#0C6787",
        },
        'darkblue' : {
          "900": "#111C52",
        },
        'grey' : {
          "100": "#F0F0F0",
          "500": "#D9D9D9",
          "600": "#C9C9C9",
          "800": "#707070",
        }
      }
    },
  },
  plugins: [],
}