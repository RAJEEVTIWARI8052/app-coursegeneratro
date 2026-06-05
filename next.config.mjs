/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next.js 15: use remotePatterns instead of deprecated domains
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "img.icons8.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
    ],
    // Auto-serve modern formats for smaller payloads
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 60 days
    minimumCacheTTL: 60 * 60 * 24 * 60,
  },
  // Helps Vercel correctly identify the project root when multiple lockfiles are detected
  outputFileTracingRoot: process.cwd(),
  // Compress responses
  compress: true,
};

export default nextConfig;
