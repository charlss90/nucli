'use strict';
var mongoose = require('mongoose');
var async = require('async');
var errors = require('../../common/errors');

const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return value.length >= 3 &&
                    value.indexOf(' ') === -1;
            },
            message: '{VALUE} should be a string of at less 3 character without spaces'
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return value.length >= 3;
            },
            message: '{VALUE} should be tree characters'
        }
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return EMAIL_REGEX.test(value);
            },
            message: '{VALUE} should be a email'
        }
    }
});


var User = mongoose.model('User', userSchema);


User.validate = function (doc, callback) {
    async.each(getKeysFromDoc(doc), (k, next) => {
        let path = getSchemaPath.call(this, k);

        if (!path) {
            return next(new errors.UnexpectedArgument(`${k} is not present in User doc`));
        }

        if (!path.options.validate.validator(doc[k])) {
            return next(new errors.UnexpectedArgument(`${k} is an invalid object for User doc`));
        }
        next();
    }, callback);
};


function getKeysFromDoc(doc) {
    return Object.keys(doc);
}


function getSchemaPath(key) {
    return this.schema.path(key);
}


module.exports = User;