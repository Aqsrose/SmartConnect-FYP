import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          secondary: "#8696a0",
          "teal-light": "#7ae3c3",

          "red-500": "#F44336",
          "photopicker-overlay-background": "rgba(30,42,49,0.8)",
          "dropdown-background": "#233138",
          "dropdown-background-hover": "#182229",
          "input-background": " #2a3942",
          "primary-strong": "#e9edef",
          "panel-header-background": "#202c33",
          "panel-header-icon": "#aebac1",
          "icon-lighter": "#8696a0",
          "icon-green": "#00a884",
          "search-input-container-background": "#111b21",
          "conversation-border": "rgba(134,150,160,0.15)",
          "conversation-panel-background": "#0b141a",
          "background-default-hover": "#202c33",
          "incoming-background": "#202c33",
          "outgoing-background": "#005c4b",
          "bubble-meta": "hsla(0,0%,100%,0.6)",
          "icon-ack": "#53bdeb",
          white: "#FFFFFF",
          black: "#000000",
          blue: {
            950: "#3fa4a1",
            1000: "#b2f7ec",
            1050: "#66B1FF",
            1100: "#3396ff",
          },
          gray: {
            1000: "#747A88",
          },
          pink: {
            1000: "#ECE5DD",
          },
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      screens: {
        sb: "292px",
        xs: "320px",
        sbb: "356px",
        tb: "407px",
        tbbb: "510px",
        tbb: "650px",
        mdd: "1024px",
        lg:"1050px"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "chat-background": "url('/chat-bg.png')",
      },
      gridTemplateColumns: {
        main: "1fr 2.4fr",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
