"use strict";
var mongoose = require('mongoose');

var model = Symbol();

class Model {
    constructor(config) {
        this[model] = mongoose.model();
    }

    getObject() {

    }

    postObject() {

    }

    putObject() {

    }

    deleteObject() {

    }
}
