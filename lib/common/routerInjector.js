'use strict';
var fs = require('fs');
var util = require('util');
var path = require('path');
var errors = require('./errors');
var Router = require('./web/router');

module.exports = function routerInjector(config) {
    validateObject(config);

    var files = getFiles(config.dirname);

    files.forEach(file => {
        let fileName = getFileNameWithoutExtensions(file);
        let inject = getInjector(config.dirname, file);
        let model = inject(config.globalConfig);

        injectRoute({
            app:config.app,
            routerPath: (fileName === 'index') ? '/' : `/${fileName}`,
            router: Router({schemaConfig: model})
        });
    });
};


function validateObject(config) {
    if (!config) {
        throw new errors.UnexpectedArgument('Injector should be have a config');
    }

    if (!util.isFunction(config.app) || !util.isFunction(config.app.use)) {
        throw new errors.UnexpectedArgument('Injector should be have a config with app express [config.app]');
    }

    if (!util.isObject(config.globalConfig)) {
        throw new errors.UnexpectedArgument('Injector should be have a config with globalConfig [config.globalConfig]');
    }

    if (!util.isString(config.dirname)) {
        throw new errors.UnexpectedArgument('Injector should be have a config with dirName [config.dirname]');
    }
}


function getFiles(dirname) {
    return fs.readdirSync(dirname);
}


function getFileNameWithoutExtensions(file) {
    return file.replace(/\.[^/.]+$/, '');
}


function getInjector(dirname, file) {
    return require(path.resolve(dirname, file));
}


function injectRoute(config) {
    config.app.use(config.routerPath, config.router);
}
