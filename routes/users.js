'use strict';
var util = require('util');

var express = require('express');
var errors = require('../lib/common/errors');
var User = require('../lib/users/repository/User');

module.exports = function () {

    var router = express.Router();

    router.get('/', getUsers);
    router.get('/:username', getUserByUsername);
    router.post('/', postUsers);
    router.put('/:username', putUser);
    router.delete('/:username', deleteUser);

    return router;
};


function getUsers(req, res, next) {
    User.find(onUserFound.bind(this, res, next));
}


function getUserByUsername(req, res, next) {
    User.find(getUsernameQuery(req.params), onUserFound.bind(this, res, next));
}


function onUserFound(res, next, err, users) {
    if (handlerError(err, next)) return false;
    res.send(users);
}


function postUsers(req, res, next) {
    let user = new User(req.body);

    user.validate((err) => {
        if (handlerError(err, next)) return false;

        user.save((err) => {
            if (handlerError(err, next)) return false;

            res.status(200).send('Save');
        });
    });
}


function putUser(req, res, next) {
    let userUpdateObject = getUserUpdateObject(req);


    User.validate(userUpdateObject, (err) => {
        if (handlerError(err, next)) return false;

        User.update(getUsernameQuery(req.params), userUpdateObject, (err, user) => {

            if (handlerError(err, next)) return false;
            res.status(200).send('Update');
        });
    });

}


function getUserUpdateObject(req) {
    if (!req.body || !util.isObject(req.body) || Object.keys(req.body).length ===0) throw new errors.UnexpectedArgument('invalid user update object');
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


function deleteUser(req, res) {

}


function handlerError(err, next) {
    if (err) {
        next(err);
        return true;
    }
    return false;
}