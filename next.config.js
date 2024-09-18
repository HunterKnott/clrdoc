/** @type {import('next').NextConfig} */
const nextConfig = {
    // domains: [
    //     'clrdoc.com',
    //     'keeneyefamilyvision.clrdoc.com',
    // ],

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
