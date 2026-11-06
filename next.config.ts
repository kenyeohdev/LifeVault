import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Every route here is personalized/auth-gated, so there's little to gain
     from Next 16's static-first Cache Components model — keep plain
     per-request rendering instead, which is simpler to reason about. */
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
