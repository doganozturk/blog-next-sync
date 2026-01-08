/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");
const createMDX = require("@next/mdx");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  transpilePackages: ["next-image-export-optimizer"],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/images",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: "80",
    nextImageExportOptimizer_storePicturesInWEBP: "true",
    nextImageExportOptimizer_generateAndUseBlurImages: "true",
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  serverExternalPackages: ["gray-matter"],
  typedRoutes: true,
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ["date-fns"],
  },
  turbopack: {
    resolveAlias: {
      "~": path.resolve(__dirname, "src"),
      "@": path.resolve(__dirname, "src"),
      "@content": path.resolve(__dirname, "content"),
    },
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-mdx-frontmatter"],
    rehypePlugins: [
      [
        "rehype-pretty-code",
        {
          theme: "dark-plus",
          keepBackground: true,
        },
      ],
    ],
  },
});

module.exports = withMDX(nextConfig);
