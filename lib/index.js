"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setRpc = setRpc;
exports.isSwitchFinish = exports.getNodeUrl = exports.getWeb3 = exports.getFastWeb3 = void 0;

require("regenerator-runtime/runtime.js");

var _web = _interopRequireDefault(require("web3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var nodeUrlsTestnet = ['wss://apitest.wanchain.org:8443/ws/v3/627f78bd371c3980a8782a505ffb7ec263ae0031213bb0cd2d10ed32e25b4f29', 'https://gwan-ssl.wandevs.org:46891', 'https://demodex.wandevs.org:48545'];
var nodeUrlsMainnet = ['wss://api.wanchain.org:8443/ws/v3/627f78bd371c3980a8782a505ffb7ec263ae0031213bb0cd2d10ed32e25b4f29', 'wss://api.wanglutech.net:8443/ws/v3/627f78bd371c3980a8782a505ffb7ec263ae0031213bb0cd2d10ed32e25b4f29'];
var web3s = [];
var web3select = 0;
var switchFinish = false;
var nodeUrls;

function setRpc(urls) {
  var networkId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  if (networkId === 1) {
    nodeUrlsMainnet = urls;
  } else {
    nodeUrlsTestnet = urls;
  }
}

var getFastWeb3 = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var networkId,
        i,
        timeout,
        funcs,
        _loop,
        _i,
        ret,
        _args2 = arguments;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            networkId = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : 1;
            nodeUrls = networkId === 1 ? nodeUrlsMainnet : nodeUrlsTestnet; // console.log('ready to new web3...');

            for (i = 0; i < nodeUrls.length; i++) {
              try {
                if (nodeUrls[i].indexOf('ws') === 0) {
                  web3s.push(new _web["default"](new _web["default"].providers.WebsocketProvider(nodeUrls[i])));
                } else {
                  web3s.push(new _web["default"](new _web["default"].providers.HttpProvider(nodeUrls[i])));
                }
              } catch (err) {
                console.log(err);
              }
            }

            timeout = 5000; // console.log('Search fast web3...timeout:', timeout);

            funcs = [];

            _loop = function _loop(_i) {
              var func = /*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                  var t0, tmpFunc, _ret, t1;

                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          t0 = Date.now();
                          tmpFunc = [];
                          _context.prev = 2;
                          tmpFunc.push(new Promise(function (resolve, reject) {
                            setTimeout(resolve, timeout, 'timeout');
                          }));
                          tmpFunc.push(web3s[_i].eth.net.getId());
                          _context.next = 7;
                          return Promise.race(tmpFunc);

                        case 7:
                          _ret = _context.sent;

                          if (!(_ret === 'timeout')) {
                            _context.next = 11;
                            break;
                          }

                          console.log('timeout:', _i, nodeUrls[_i], Date.now() - t0);
                          return _context.abrupt("return", {
                            delay: 100000,
                            index: _i
                          });

                        case 11:
                          _context.next = 17;
                          break;

                        case 13:
                          _context.prev = 13;
                          _context.t0 = _context["catch"](2);
                          console.log('net error:', _i, nodeUrls[_i]);
                          return _context.abrupt("return", {
                            delay: 100000,
                            index: _i
                          });

                        case 17:
                          t1 = Date.now() - t0;
                          return _context.abrupt("return", {
                            delay: t1,
                            index: _i,
                            url: nodeUrls[_i]
                          });

                        case 19:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, null, [[2, 13]]);
                }));

                return function func() {
                  return _ref2.apply(this, arguments);
                };
              }();

              funcs.push(func());
            };

            for (_i = 0; _i < web3s.length; _i++) {
              _loop(_i);
            }

            _context2.next = 9;
            return Promise.all(funcs);

          case 9:
            ret = _context2.sent;
            ret.sort(function (a, b) {
              return a.delay - b.delay;
            }); // console.log(ret);

            web3select = ret[0].index; // console.log('web3select', web3select, nodeUrls[web3select]);

            switchFinish = true;
            return _context2.abrupt("return", getWeb3());

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getFastWeb3() {
    return _ref.apply(this, arguments);
  };
}();

exports.getFastWeb3 = getFastWeb3;

var getWeb3 = function getWeb3() {
  return web3s[web3select];
};

exports.getWeb3 = getWeb3;

var getNodeUrl = function getNodeUrl() {
  return nodeUrls[web3select];
};

exports.getNodeUrl = getNodeUrl;

var isSwitchFinish = function isSwitchFinish() {
  return switchFinish;
};

exports.isSwitchFinish = isSwitchFinish;