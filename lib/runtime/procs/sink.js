'use strict';

var fanin = require('./fanin');
var Promise = require('bluebird');

var SINK_INFO = {
    type: 'sink',
    options: {}   // documented, non-deprecated options only
};

// base class for all sinks (both client-side views and adapter write procs)
class sink extends fanin {
    constructor(options, params, location, program) {
        super(options, params, location, program);
        // To indicate when the sink is finished, stash a completion trigger in
        // this.done() that resolves the `isDone` promise.
        //
        // The runtime will use this promise to wait until all the sinks have
        // gotten an eof to declare that the program is complete.
        var self = this;
        this.isDone = new Promise(function(resolve, reject) {
            self.done = resolve;
        });
    }

    static get info() {
        return SINK_INFO;
    }
}

module.exports = sink;
