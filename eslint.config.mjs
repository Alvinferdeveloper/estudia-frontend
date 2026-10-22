import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Colors come from the theme tokens in globals.css (see DESIGN.md), never from the raw Tailwind palette or literals.
const RAW_COLOR_PATTERNS = [
  "(^|[\\s:])([a-z]+-)+(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d\\d",
  "\\b(bg|text|border|ring|from|via|to|fill|stroke|shadow|outline|divide|decoration|placeholder)-(white|black)\\b",
  "\\[[^\\]]*(#[0-9a-fA-F]{3}|rgba?\\(|hsla?\\(|oklch\\()",
];
const RAW_COLOR_MESSAGE = "Use a theme token (globals.css, DESIGN.md) instead of a raw color.";
const NAVIGATION_MESSAGE = "Import Link, useRouter, usePathname and redirect from @/i18n/navigation, which keeps the locale.";

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "react-hooks/exhaustive-deps": "off",
      "prefer-const": "off",
      // These drop the locale from the URL; @/i18n/navigation keeps it.
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "next/link", message: NAVIGATION_MESSAGE },
            { name: "next/navigation", importNames: ["useRouter", "usePathname", "redirect", "permanentRedirect"], message: NAVIGATION_MESSAGE },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        ...RAW_COLOR_PATTERNS.flatMap((pattern) => [
          { selector: `Literal[value=/${pattern}/]`, message: RAW_COLOR_MESSAGE },
          { selector: `TemplateElement[value.raw=/${pattern}/]`, message: RAW_COLOR_MESSAGE },
        ]),
      ],
    },
  },
];

export default eslintConfig;
