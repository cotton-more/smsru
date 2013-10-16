'use strict';

var Smsru = require('../index.js');
var url = require('url');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var api_id = '123-45-67890';

exports['send request'] = {
    'using fake api_id': function (t) {
        var smsru = new Smsru({
            'api_id': api_id
        });

        smsru.test(1).send( 'text', function (error) {

            t.ok( error );

            t.done();
        });
    },
    'using real api_id': function (t) {
        t.expect(1);

        var smsru = new Smsru('../smsru.json');

        smsru.test(1).send( 'text', function (error, body) {
            var data = body.split( "\n" );

            t.equal( data[0], '100' );

            t.done();
        });
    }
};

exports['url for test'] = {
    'test is true': function (t) {
        var smsru = new Smsru({
            'api_id': api_id
        });

        t.deepEqual(smsru.test(1).getUrl().query, {
            'api_id': api_id,
            'test': 1
        });

        smsru.test(0);
        t.deepEqual(smsru.getUrl().query, {
            'api_id': api_id
        });

        smsru.test(1);
        t.deepEqual(smsru.getUrl().query, {
            'api_id': api_id,
            'test': 1
        });

        t.done();
    }
};

exports['testing constructor'] = {
    'no args': function (test) {
        test.expect(1);
        var smsru;

        test.throws(function () {
            smsru = new Smsru();
        });

        test.done();
    },
    'require data from file': function (t) {
        var smsru = new Smsru('./test/smsru.json');
        t.equal(smsru.param('api_id'), api_id);
        t.equal(smsru.param('test'), 1);
        t.done();
    },
    'object as parameter': function (test) {
        test.expect(2);
        var param;

        param = { 'api_id': '1111' };

        var smsru1 = new Smsru(param);

        test.deepEqual(smsru1.param(), param);

        param = { 'api_id': '2222' };

        var smsru2 = new Smsru(param);
        test.deepEqual(smsru2.param(), param);

        test.done();
    }
};

exports['testing setting auth'] = {
    'default auth type': function (t) {
        var smsru = new Smsru({
            'api_id': api_id
        });

        var auth = smsru.getAuth();

        t.deepEqual(auth, { 'api_id': api_id });
        t.deepEqual(auth, smsru.getAuth('api_id'));

        t.done();
    },
    'auth with password': function (t) {
        var smsru = new Smsru({
            'login': 'foo',
            'password': 'bar'
        });

        var auth = smsru.getAuth('password');

        t.deepEqual(auth, { 'login': 'foo', 'password': 'bar' });
        t.deepEqual(smsru.getAuth(undefined, 1), { 'login': 'foo', 'password': 'bar' });

        t.done();
    }
};

exports['test getting url'] = {
    'url for api_id': function (t) {
        var smsru = new Smsru({
            'api_id': api_id
        });

        var _url = url.format(smsru.getUrl('SEND'));

        t.equal(_url, 'http://sms.ru/sms/send?api_id='+api_id);

        t.done();
    },
    'url for password': function (t) {
        var smsru = new Smsru({
            'password': 'bar',
            'login': 'foo'
        });

        t.deepEqual(smsru.getUrl('SEND').query, smsru.getAuth());

        t.done();
    }
};
