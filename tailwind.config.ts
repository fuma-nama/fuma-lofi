import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "popover-in": {
          from: {
            transform: "translateY(20px)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0px)",
            opacity: "1",
          },
        },
        "popover-out": {
          from: {
            transform: "translateY(0px)",
            opacity: "1",
          },
          to: {
            transform: "translateY(20px)",
            opacity: "0",
          },
        },
      },
      animation: {
        "popover-in": "popover-in ease-in-out 0.2s",
        "popover-out": "popover-out ease-out 0.2s",
      },
    },
  },
  plugins: [],
};
export default config;
