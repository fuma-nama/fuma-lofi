import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        "fade-out": {
          from: {
            opacity: "1",
          },
          to: {
            opacity: "0",
          },
        },
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
        "dialog-in": {
          from: {
            transform: "translate(-50%, -40%)",
            opacity: "0",
          },
          to: {
            transform: "translate(-50%, -50%)",
            opacity: "1",
          },
        },
        "dialog-out": {
          from: {
            transform: "translate(-50%, -50%)",
            opacity: "1",
          },
          to: {
            transform: "translate(-50%, -40%)",
            opacity: "0",
          },
        },
      },
      animation: {
        "popover-in": "popover-in ease-in-out 0.2s",
        "popover-out": "popover-out ease-out 0.2s",
        "dialog-in": "dialog-in ease-in-out 0.2s",
        "dialog-out": "dialog-out ease-out 0.2s",
        "fade-in": "fade-in ease-in-out 0.2s",
        "fade-out": "fade-out ease-out 0.2s",
      },
    },
  },
  plugins: [],
};
export default config;
