/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var util = require('util');
var errors = require('../errors');
var mongoose = require('mongoose');
var async = require('async');


module.exports = function (config) {
    validateSchemaConfig(config);

    let schema = new mongoose.Schema(config.schema);
    let Model = mongoose.model(config.name, schema);


    Model.validate = function validate(doc, callback) {
        async.each(getKeysFromDoc(doc), (k, next) => {
            let path = getSchemaPath.call(this, k);

            if (!path) {
                return next(new errors.UnexpectedArgument(`${k} is not present in User doc`));
            }

            if (!path.options.validate.validator(doc[k])) {
                return next(new errors.UnexpectedArgument(`${k} is an invalid object for User doc`));
            }

            next && next();
        }, callback);
    };


    Model.save = function save(doc, callback) {
        if (!doc) {
            return callback(new errors.UnexpectedArgument('Model doc cannot be null'));
        }

        let instance = new Model(doc);

        instance.validate((err) => {
            if (err) return callback(err);

            instance.save((err) => {
                if (err) return callback(err);

                callback(null, instance);
            });
        });
    };


    Model.upgrade = function upgrade(filter, updateDoc, callback) {
        if (!updateDoc) {
            return callback(new errors.UnexpectedArgument('Model doc cannot be null'));
        }

        Model.validate(updateDoc, (err) => {
            if (err) return callback(err);

            Model.update(filter, updateDoc, (err, doc) => {
                if (err) return callback(err);
                callback(null, doc);
            });
        });
    };


    return Model;
};


function validateSchemaConfig(config) {
    if (!config) {
        throw new errors.UnexpectedArgument('Schema should have a config object');
    }
    if (!config.name) {
        throw new errors.UnexpectedArgument('Schema should have a config with name model');
    }
    if (!util.isObject(config.schema)) {
        throw new errors.UnexpectedArgument('Schema should have a config with schema');
    }
}


function getKeysFromDoc(doc) {
    return Object.keys(doc);
}


function getSchemaPath(key) {
    return this.schema.path(key);
}
