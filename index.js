var path = require('path');
var url = require('url');
var request = require('request');

var Smsru = (function () {
    var hostname = 'sms.ru';
    var api = {
        'SEND': 'sms/send',
        'COST': 'sms/cost',
        'BALANCE': 'my/balance',
        'LIMIT': 'my/limit',
        'TOKEN': 'auth/get_token',
        'CHECK': 'auth/check'
    };
    var authAllowed = [ 'api_id', 'password' ];
    var defaultAuthType = 'api_id';

    var responseCode = {
        'SEND': {
            '100': 'Сообщение принято к отправке.',
            '200': 'Неправильный api_id',
            '201': 'Не хватает средств на лицевом счету',
            '202': 'Неправильно указан получатель',
            '203': 'Нет текста сообщения',
            '204': 'Имя отправителя не согласовано с администрацией',
            '205': 'Сообщение слишком длинное (превышает 8 СМС)',
            '206': 'Будет превышен или уже превышен дневной лимит на отправку сообщений',
            '207': 'На этот номер (или один из номеров) нельзя отправлять сообщения, либо указано более 100 номеров в списке получателей',
            '208': 'Параметр time указан неправильно',
            '209': 'Вы добавили этот номер (или один из номеров) в стоп-лист',
            '210': 'Используется GET, где необходимо использовать POST',
            '211': 'Метод не найден',
            '212': 'Текст сообщения необходимо передать в кодировке UTF-8 (вы передали в другой кодировке)',
            '220': 'Сервис временно недоступен, попробуйте чуть позже.',
            '230': 'Сообщение не принято к отправке, так как на один номер в день нельзя отправлять более 250 сообщений.',
            '300': 'Неправильный token (возможно истек срок действия, либо ваш IP изменился)',
            '301': 'Неправильный пароль, либо пользователь не найден',
            '302': 'Пользователь авторизован, но аккаунт не подтвержден (пользователь не ввел код, присланный в регистрационной смс)'
        }
    };


    function Smsru(param) {
        var _param = {};
        var _authType = defaultAuthType;
        var _test = 0;

        switch (typeof param) {
            case 'object':
                for (var key in param) {
                    if (param.hasOwnProperty(key)) {
                        _param[ key ] = param[key];
                    }
                }
                break;
            case 'string':
                try {
                    _param = require(path.resolve(param));
                } catch (e) {
                    _param = {};
                }
                break;
            default:
                _param = {};
        }

        this.param = function (key) {
            if ("undefined" !== typeof key) {
                return _param.hasOwnProperty(key) ? _param[key] : void 0;
            }

            return _param;
        };

        this.guessAuthType = function () {
            for (var i = 0, l = authAllowed.length; i < l; i++) {
                var v = authAllowed[i];
                if (this.param(v)) {
                    return v;
                }
            }

            return _authType;
        };

        this.setAuthType = function (authType) {
            if (0 === ~authAllowed.indexOf(authType)) {
                authType = this.guessAuthType();
            }

            return this;
        };

        this.test = function (v) {
            if ("undefined" === typeof v) {
                return _test;
            } else {
                _test = +(!!v);
                return this;
            }
        };

        return this;
    }

    Smsru.prototype.send = function (text, to, callback) {
        if (null == callback) {
            if ("function" === typeof to) {
                callback = to;
                to = null;
            } else {
                callback = function () {};
            }
        }

        var _url = this.getUrl( 'SEND' );

        _url['query']['text'] = text;
        _url['query']['to'] = to || this.param( 'to' );

        request(url.format(_url), function (error, response, body) {
            if (null === error) {
                var data = body.split( "\n" );
                if ('100' !== data[0]) {
                    error = responseCode['SEND'][data[0]];
                    body = null;
                }
            }

            callback( error, body );
        });
    };

    Smsru.prototype.getAuth = function () {
        var auth = {};

        var authType = this.guessAuthType();

        auth[ authType ] = this.param( authType );

        if ('password' === authType) {
            auth.login = this.param( 'login' );
        }

        return auth;
    };

    Smsru.prototype.getUrl = function (command) {
        var query = this.getAuth();
        var test = this.test();
        if (test) {
            query.test = test;
        }

        return {
            protocol: 'http',
            hostname: hostname,
            pathname: api[command],
            query: query
        };
    };

    return Smsru;

})();

exports = module.exports = Smsru;
