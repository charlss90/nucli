'use strict';

const PREFIX_MSG = 'Unexpected Argument::';


class UnexpectedArgument extends TypeError {
    constructor(msg) {
        super(`${PREFIX_MSG} ${msg}`);
    }
}


module.exports = UnexpectedArgument;
