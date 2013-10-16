# smsru [![Build Status](https://secure.travis-ci.org/vansanblch/smsru.png?branch=master)](http://travis-ci.org/vansanblch/smsru)

The best project ever.

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

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Ivan Nikulin  
Licensed under the MIT license.
