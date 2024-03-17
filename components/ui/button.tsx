import { cva } from "cva";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-sm font-medium rounded-md px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400",
  {
    variants: {
      variant: {
        primary: "bg-purple-500 text-purple-100 hover:bg-purple-400",
        ghost: "text-purple-100 hover:bg-purple-200/20",
        secondary: "rounded-full p-1.5 bg-purple-200/10 hover:bg-purple-200/20",
        destructive: "p-1 bg-red-600/50",
      },
    },
  },
);
