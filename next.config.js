/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "smart-connect-fyp-bucket.s3.ap-south-1.amazonaws.com",
      "ipfs.io",
      "img.clerk.com"
    ],
  },
}

module.exports = nextConfig
