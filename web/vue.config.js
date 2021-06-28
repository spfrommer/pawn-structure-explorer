module.exports = {
    runtimeCompiler: true,
    css: {
        loaderOptions: {
            scss: {
                data: '@import "~@/styles/global.scss";',
            },
        },
    },
};
