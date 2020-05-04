import 'mocha';
// import parseSims from './src/parser.js'; 
// var assert = require('assert');
// var parseSims = require('../src/parser.js');
// var md5 = require('../src/hello.js');

import md5 from '../src/hello.js';

describe('Parser', function() {
    it('should return -1 when the value is not present', function() {
        console.log('hello')
        // assert.equal([1, 2, 3].indexOf(4), -1);

    });

    it('should return correctly formatted object', function() {
        const geoInput = '06085';
        const parameters = ['incidI','incidH','incidD','incidVent','incidICU'];
        const dates = ['2020-01-31', '2020-02-01', '2020-02-02', '2020-02-03', '2020-02-04', '2020-02-05']
        const expected = {
            'scenario-1': {
                'high': {
                    'dates': dates,
                    'series': {
                        'incidD': [],
                        'incidH': [],
                        'incidI': [],
                        'incidICU': [],
                        'incidVent': [],
                    }
                },
                'med': {
                    'dates': dates,
                    'series': {
                        'incidD': [],
                        'incidH': [],
                        'incidI': [],
                        'incidICU': [],
                        'incidVent': [],
                    }
                },
                'low': {
                    'dates': dates,
                    'series': {
                        'incidD': [],
                        'incidH': [],
                        'incidI': [],
                        'incidICU': [],
                        'incidVent': [],
                    }
                },
            },
            'scenario-2': {
                'high': {
                    'dates': dates,
                    'series': {
                        'incidD': [],
                        'incidH': [],
                        'incidI': [],
                        'incidICU': [],
                        'incidVent': [],
                    }
                },
                'med': {
                    'dates': dates,
                    'series': {
                        'incidD': [],
                        'incidH': [],
                        'incidI': [],
                        'incidICU': [],
                        'incidVent': [],
                    }
                },
                'low': {
                    'dates': dates,
                    'series': {
                        'incidD': [],
                        'incidH': [],
                        'incidI': [],
                        'incidICU': [],
                        'incidVent': [],
                    }
                },
            }
        }

        console.log(parseSims('src/test/fixtures/', geoInput, parameters));
        
        // assert.equal(parseSims('src/test/fixtures/', geoInput, parameters), expected);
    });
});
