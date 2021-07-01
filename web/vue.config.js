module.exports = {
    runtimeCompiler: true,
    devServer: {
        disableHostCheck: true,
    },
    css: {
        loaderOptions: {
            scss: {
                data: '@import "~@/styles/global.scss";',
            },
        },
    },
};
