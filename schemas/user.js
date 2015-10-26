"use strict";

const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

module.exports = function () {
    return {
        name: 'User',
        schema: {
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
        }
    } ;
};
