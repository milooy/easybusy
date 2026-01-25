import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          background: { value: "oklch(1 0 0)" },
          foreground: { value: "oklch(0.145 0 0)" },
          card: {
            DEFAULT: { value: "oklch(1 0 0)" },
            foreground: { value: "oklch(0.145 0 0)" },
          },
          popover: {
            DEFAULT: { value: "oklch(1 0 0)" },
            foreground: { value: "oklch(0.145 0 0)" },
          },
          primary: {
            DEFAULT: { value: "oklch(0.205 0 0)" },
            foreground: { value: "oklch(0.985 0 0)" },
          },
          secondary: {
            DEFAULT: { value: "oklch(0.97 0 0)" },
            foreground: { value: "oklch(0.205 0 0)" },
          },
          muted: {
            DEFAULT: { value: "oklch(0.97 0 0)" },
            foreground: { value: "oklch(0.556 0 0)" },
          },
          accent: {
            DEFAULT: { value: "oklch(0.97 0 0)" },
            foreground: { value: "oklch(0.205 0 0)" },
          },
          destructive: {
            DEFAULT: { value: "oklch(0.577 0.245 27.325)" },
            foreground: { value: "white" },
          },
          border: { value: "oklch(0.922 0 0)" },
          input: { value: "oklch(0.922 0 0)" },
          ring: { value: "oklch(0.708 0 0)" },
          chart: {
            1: { value: "oklch(0.646 0.222 41.116)" },
            2: { value: "oklch(0.6 0.118 184.704)" },
            3: { value: "oklch(0.398 0.07 227.392)" },
            4: { value: "oklch(0.828 0.189 84.429)" },
            5: { value: "oklch(0.769 0.188 70.08)" },
          },
          sidebar: {
            DEFAULT: { value: "oklch(0.985 0 0)" },
            foreground: { value: "oklch(0.145 0 0)" },
            primary: { 
              DEFAULT: { value: "oklch(0.205 0 0)" },
              foreground: { value: "oklch(0.985 0 0)" },
            },
            accent: {
              DEFAULT: { value: "oklch(0.97 0 0)" },
              foreground: { value: "oklch(0.205 0 0)" },
            },
            border: { value: "oklch(0.922 0 0)" },
            ring: { value: "oklch(0.708 0 0)" },
          },
        },
        radii: {
          DEFAULT: { value: "0.625rem" },
          sm: { value: "calc(0.625rem - 4px)" },
          md: { value: "calc(0.625rem - 2px)" },
          lg: { value: "0.625rem" },
          xl: { value: "calc(0.625rem + 4px)" },
        },
        fonts: {
          sans: { value: "var(--font-geist-sans)" },
          mono: { value: "var(--font-geist-mono)" },
        },
      },
      semanticTokens: {
        colors: {
          dark: {
            background: { value: "oklch(0.145 0 0)" },
            foreground: { value: "oklch(0.985 0 0)" },
            card: {
              DEFAULT: { value: "oklch(0.205 0 0)" },
              foreground: { value: "oklch(0.985 0 0)" },
            },
            popover: {
              DEFAULT: { value: "oklch(0.205 0 0)" },
              foreground: { value: "oklch(0.985 0 0)" },
            },
            primary: {
              DEFAULT: { value: "oklch(0.922 0 0)" },
              foreground: { value: "oklch(0.205 0 0)" },
            },
            secondary: {
              DEFAULT: { value: "oklch(0.269 0 0)" },
              foreground: { value: "oklch(0.985 0 0)" },
            },
            muted: {
              DEFAULT: { value: "oklch(0.269 0 0)" },
              foreground: { value: "oklch(0.708 0 0)" },
            },
            accent: {
              DEFAULT: { value: "oklch(0.269 0 0)" },
              foreground: { value: "oklch(0.985 0 0)" },
            },
            destructive: {
              DEFAULT: { value: "oklch(0.704 0.191 22.216)" },
            },
            border: { value: "oklch(1 0 0 / 10%)" },
            input: { value: "oklch(1 0 0 / 15%)" },
            ring: { value: "oklch(0.556 0 0)" },
            chart: {
              1: { value: "oklch(0.488 0.243 264.376)" },
              2: { value: "oklch(0.696 0.17 162.48)" },
              3: { value: "oklch(0.769 0.188 70.08)" },
              4: { value: "oklch(0.627 0.265 303.9)" },
              5: { value: "oklch(0.645 0.246 16.439)" },
            },
            sidebar: {
              DEFAULT: { value: "oklch(0.205 0 0)" },
              foreground: { value: "oklch(0.985 0 0)" },
              primary: {
                DEFAULT: { value: "oklch(0.488 0.243 264.376)" },
                foreground: { value: "oklch(0.985 0 0)" },
              },
              accent: {
                DEFAULT: { value: "oklch(0.269 0 0)" },
                foreground: { value: "oklch(0.985 0 0)" },
              },
              border: { value: "oklch(1 0 0 / 10%)" },
              ring: { value: "oklch(0.556 0 0)" },
            },
          },
        },
      },
      recipes: {
        button: {
          className: "button",
          description: "Button styles",
          base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2",
            whiteSpace: "nowrap",
            borderRadius: "md",
            fontSize: "sm",
            fontWeight: "medium",
            transition: "all",
            cursor: "pointer",
            outline: "none",
            _disabled: {
              pointerEvents: "none",
              opacity: "0.5",
            },
            "& svg": {
              pointerEvents: "none",
              flexShrink: 0,
            },
            "& svg:not([class*='size-'])": {
              width: "4",
              height: "4",
            },
            flexShrink: 0,
            _focusVisible: {
              borderColor: "ring",
              ringColor: "ring/50",
              ringWidth: "3px",
              ringOffsetWidth: "0",
            },
            _invalid: {
              ringColor: { base: "destructive/20", _dark: "destructive/40" },
              borderColor: "destructive",
            },
          },
          variants: {
            variant: {
              default: {
                bg: "primary",
                color: "primary.foreground",
                boxShadow: "xs",
                _hover: {
                  bg: "primary/90",
                },
              },
              destructive: {
                bg: { base: "destructive", _dark: "destructive/60" },
                color: "white",
                boxShadow: "xs",
                _hover: {
                  bg: "destructive/90",
                },
                _focusVisible: {
                  ringColor: { base: "destructive/20", _dark: "destructive/40" },
                },
              },
              outline: {
                borderWidth: "1px",
                borderStyle: "solid",
                bg: { base: "background", _dark: "input/30" },
                borderColor: { base: "border", _dark: "input" },
                boxShadow: "xs",
                _hover: {
                  bg: { base: "accent", _dark: "input/50" },
                  color: "accent.foreground",
                },
              },
              secondary: {
                bg: "secondary",
                color: "secondary.foreground",
                boxShadow: "xs",
                _hover: {
                  bg: "secondary/80",
                },
              },
              ghost: {
                _hover: {
                  bg: { base: "accent", _dark: "accent/50" },
                  color: "accent.foreground",
                },
              },
              link: {
                color: "primary",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                _hover: {
                  textDecoration: "underline",
                },
              },
            },
            size: {
              default: {
                height: "9",
                px: "4",
                py: "2",
                _has: {
                  "& > svg": {
                    px: "3",
                  },
                },
              },
              sm: {
                height: "8",
                borderRadius: "md",
                gap: "1.5",
                px: "3",
                _has: {
                  "& > svg": {
                    px: "2.5",
                  },
                },
              },
              lg: {
                height: "10",
                borderRadius: "md",
                px: "6",
                _has: {
                  "& > svg": {
                    px: "4",
                  },
                },
              },
              icon: {
                width: "9",
                height: "9",
              },
            },
          },
          defaultVariants: {
            variant: "default",
            size: "default",
          },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
  
  // Dark mode config
  conditions: {
    dark: ".dark &",
  },
  
  // Global styles
  globalCss: {
    "*, *::before, *::after": {
      borderColor: "border",
      outlineColor: "ring/50",
    },
    body: {
      bg: "background",
      color: "foreground",
    },
  },
});