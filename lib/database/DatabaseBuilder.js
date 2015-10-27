/// <reference path="../typings/tsd.d.ts" />
'use stritc';
var util = require('util');
var errors = require('../common/errors');
var Sequelize = require('sequelize');

var sequelize = Symbol();
// db password: nexus05

class DatabaseBuilder {


    constructor(builderConfig) {
        validateBuilderConfig(builderConfig);
        this.sequelize = new Sequelize(builderConfig);
    }
    
    
    withSchema(newSchema) {
        
    }
    
    
    build() {
        
    }
}


function validateBuilderConfig(config) {

    if (!util.isObject(config)) {
        throw new errors.UnexpectedArgument('DatabaseBuilder expected a builderConfig object');
    }

    if (!util.isString(config.host)) {
        throw new errors.UnexpectedArgument('DatabaseBuilder expected a builderConfig with host');
    }

    if (!util.isString(config.databaseName)) {
        throw new errors.UnexpectedArgument('DatabaseBuilder expected a builderConfig with databaseName');
    }
    
    if (!util.isString(config.username)) {
        throw new errors.UnexpectedArgument('DatabaseBuilder expected a builderConfig with username');
    }
        
    if (!util.isString(config.password)) {
        throw new errors.UnexpectedArgument('DatabaseBuilder expected a builderConfig with password');
    }
}


module.exports = DatabaseBuilder;
