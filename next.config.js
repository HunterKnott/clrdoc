/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['assets2.oakley.com'],
    },

    async rewrites() {
        return [
            {
                source: '/:path*',
                destination: '/:path*',
            },
        ];
    },
};

module.exports = nextConfig
