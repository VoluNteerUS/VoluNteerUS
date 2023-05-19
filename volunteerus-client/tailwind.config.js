/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js, jsx, ts, tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", "sans-serif"],
        serif: ["Cambria", "serif"],
      },
      colors: {
        primary: {
          "100": "#fedede",
          "200": "#fecfcf",
          "300": "#ffbcbc",
          "600": "#ff73a4",
          "800": "#ff3860"
        },
        secondary: {
          "600":"#959595",
        },
        info : {
          "600":"#abebff",
        },
        success : {
          "600":"#7ce16b",
        },
        warning : {
          "600":"#fff06d",
        },
        danger : {
          "600":"#d75c5c",
        },
        'pink' : {
          "100": "#fedede",
          "400": "#ff71a3",
          "700": "#ff3860"
        },
        'marine' : {
          "500": "#0C6787",
        },
        'darkblue' : {
          "900": "#111C52",
        }
      }
    },
  },
  plugins: [],
}


