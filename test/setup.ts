import { afterEach, expect, mock } from "bun:test";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

mock.module("server-only", () => ({}));

mock.module("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react");
    return React.createElement("a", { href, ...props }, children);
  },
}));

mock.module("next/image", () => ({
  default: ({
    src,
    alt,
    width,
    height,
    priority,
    unoptimized,
    ...props
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
    unoptimized?: boolean;
    [key: string]: unknown;
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react");
    return React.createElement("img", {
      src,
      alt,
      width,
      height,
      ...(priority && { "data-priority": "true" }),
      ...(unoptimized && { "data-unoptimized": "true" }),
      ...props,
    });
  },
}));

mock.module("next-image-export-optimizer", () => ({
  default: ({
    src,
    alt,
    width,
    height,
    priority,
    ...props
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
    [key: string]: unknown;
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react");
    return React.createElement("img", {
      src,
      alt,
      width,
      height,
      ...(priority && { "data-priority": "true" }),
      ...props,
    });
  },
}));

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
