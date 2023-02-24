module.exports = {
    experimental: {
        outputStandalone: true,
    },
    async rewrites() {
        return [
            {
                source: "/api/bot/:path*",
                destination: "https://api.automute.us/bot/:path*",
            },
        ];
    },
};
