'use strict';
var util = require('util');
var express = require('express');
var schema = require('../database/schema');
var errors = require('../errors');


module.exports = function (config) {
    validateRouterConfig(config);

    var router = express.Router();
    var Model = schema(config.schemaConfig);

    router.get('/', get.bind(this, Model));
    router.get('/:username', getByUsername.bind(this, Model));
    router.post('/', post.bind(this, Model));
    router.put('/:username', put.bind(this, Model));
    router.delete('/:username', deleteObject.bind(this, Model));

    return router;
};


function validateRouterConfig(config) {
    if (!config) {
        throw new errors.UnexpectedArgument('router should have a config');
    }

    if (!util.isObject(config.schemaConfig)) {
        throw new errors.UnexpectedArgument('router config should have schemaConfig');
    }
}


function get(Model, req, res, next) {
    Model.find(onUserFound.bind(this, res, next));
}


function getByUsername(Model, req, res, next) {
    Model.find(getUsernameQuery(req.params), onUserFound.bind(this, res, next));
}


function onUserFound(res, next, err, users) {
    if (handlerError(err, next)) return false;
    res.send(users);
}


function post(Model, req, res, next) {

    Model.save(req.body, (err, user) => {
        if (err) return next(err);

        res.status(201).send(user._id);
    });
}


function put(Model, req, res, next) {
    let userUpdateObject = getUserUpdateObject(req);

    Model.upgrade(getUsernameQuery(req.params), userUpdateObject, (err, doc) => {
        if (err) return next(err);

        let result = 'Not updated';

        if (doc) {
            result = (Array.isArray(doc)) ?
                doc.map(d => d._id).join(', ') : doc._id;
        }

        res.send(result);
    });
}


function getUserUpdateObject(req) {
    if (!req.body || !util.isObject(req.body) || Object.keys(req.body).length === 0) throw new errors.UnexpectedArgument('invalid user update object');
    return req.body;
}


function getUsernameQuery(query) {
    if (query.username) {
        return {
            username: new RegExp(`^${query.username}`, 'g')
        };
    }
    return null;
}


function deleteObject(Model, req, res) {
    res.send('Not Implemented');
}


function handlerError(err, next) {
    if (err) {
        next(err);
        return true;
    }
    return false;
}
