# smsru [![Build Status](https://secure.travis-ci.org/vansanblch/smsru.png?branch=master)](http://travis-ci.org/vansanblch/smsru)

Send sms using [sms.ru](http://sms.ru) API.

## Getting Started
Install the module with: `npm install smsru`

```javascript
var Smsru = require('smsru');
var smsru = new Smsru({
    api_id: '123-45-67890'
});

smsru.send('text', 'recipient', function (error, body) {
    var data;

    if (null !== error) {
        data = body.split("\n");
    }
});
```

## Examples

Include module:
```js
// include module
var Smsru = require('smsru');
```

Parameters for authentication could be passed as an object:
```js
var smsru = new Smsru({
    login: '71231234567',
    password: 'foobar'
});
```
or as path to a json file:
```js
var smsru = new Smsru('./smsru.json');
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
 * 2013-10-17   v0.1.0  Initial release. Main functionality

## License
Copyright (c) 2013 Ivan Nikulin  
Licensed under the MIT license.
