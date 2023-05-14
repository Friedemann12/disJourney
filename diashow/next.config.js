module.exports = {
    webpack: (config) => {
        // this will override the experiments
        config.experiments = { ...config.experiments, topLevelAwait: true };
        // this will just update topLevelAwait property of config.experiments
        // config.experiments.topLevelAwait = true
        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.discordapp.com',
                port: '',
            },
        ],
    },
};