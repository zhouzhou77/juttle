'use strict';

var _ = require('underscore');
var columns = require('./columns');
var csv = require('./csv');
var errors = require('../../errors');
var grok = require('./grok');
var json = require('./json');
var jsonl = require('./jsonl');

var parserLookup = {
    'columns': columns,
    'csv': csv,
    'json': json,
    'jsonl': jsonl,
    'grok': grok
};

module.exports = {
    getParser: function(type, options) {
        var parser = parserLookup[type];
        options = options ? options : {};

        // single place that we can put this to make sure that we don't have
        // to duplicate this on every adapter that uses this parser
        if (type !== 'grok' && options.pattern) {
            throw errors.runtimeError('INVALID-OPTION-COMBINATION',{
                option: 'pattern',
                rule: 'format="grok"'
            });
        }

        _.each([
            'separator',
            'commentSymbol',
            'ignoreEmptyLines',
            'allowIncompleteLines'
        ], (option) => {
            if (type !== 'csv' && options[option]) {
                throw errors.runtimeError('INVALID-OPTION-COMBINATION',{
                    option: option,
                    rule: 'format="csv"'
                });
            }
        });

        if (parser) {
            return new parser(options);
        } else {
            throw errors.runtimeError('INVALID-OPTION-VALUE',{
                option: 'format',
                supported: _.keys(parserLookup).join(', ')
            });
        }
    }
};
