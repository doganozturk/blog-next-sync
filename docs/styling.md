# Blog styling

Use Tailwind utilities and the current default palette and spacing. [globals.css](../src/app/globals.css) is the presentation entry. It owns the Typography plugin, serif extension, class-based dark variant, and Safari gutter rule.

`next-themes` selects the HTML theme class. Use `dark:` utilities so an explicit choice controls the result.

The post page owns article presentation through its Typography wrapper. Keep MDX content free of layout annotations. Generated Shiki token variables supply syntax colors.

Preserve visible keyboard focus, usable touch targets, and reduced-motion behavior. Theme colors share the current 300 ms fade. Post entrance motion remains separate.

[ESLint configuration](../eslint.config.mjs) owns authoring rules and narrow generated-token exceptions. Use package lint and browser tests. Check mobile media, both themes, route changes, and reduced motion when they are affected.

Package lint first runs the [styling checks](../test/scripts/tailwind-theme.test.ts), then ESLint. The checks require the Blog's serif stack, Typography output, class-based dark mode, and a working shadcn Tailwind compiler. Compiler warnings block lint.
