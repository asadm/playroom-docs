/** @type {import('tailwindcss').Config} */
export default {
  // prefix: "nx-",
  // darkMode: ["class", 'html[class~="dark"]'],
  content: [
    "./components/**/*.{md,mdx,js,jsx,ts,tsx}",
    "./pages/**/*.{md,mdx,js,jsx,ts,tsx}",
    "./theme.config.tsx",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors:{
        textGrey:'#858898',
         smallTextColor:"#797B86",
        lightBlack:'#0D0D0E',
        primaryBorderColor:'#3F3F48',
        purpleBorder:"#7C65D8",
        purpleCardBackground:"#1B1125"
       
      }
    },
  },
  
  plugins: [require("daisyui")],
};