"use strict";

exports.__esModule = true;
exports.Editor = Editor;
exports.Provider = Provider;
exports.Preview = exports.InfoMessage = exports.Error = void 0;

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _react = _interopRequireWildcard(require("react"));

var _holderjs = _interopRequireDefault(require("holderjs"));

var _useMergeState2 = _interopRequireDefault(require("@restart/hooks/useMergeState"));

var _useCallbackRef2 = _interopRequireDefault(require("@restart/hooks/useCallbackRef"));

var _reactLive = require("react-live");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject2() {
  var data = _taggedTemplateLiteralLoose(["\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  right: 0;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n  white-space: pre;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }

var Error = (0, _styled.default)(_reactLive.LiveError)(_templateObject());
exports.Error = Error;
var InfoMessage = (0, _styled.default)('div')(_templateObject2());
exports.InfoMessage = InfoMessage;
var uid = 0;

function Editor(_ref) {
  var _ref$infoComponent = _ref.infoComponent,
      Info = _ref$infoComponent === void 0 ? InfoMessage : _ref$infoComponent;
  var mouseDown = (0, _react.useRef)(false);

  var _useMergeState = (0, _useMergeState2.default)({
    visible: false,
    ignoreTab: false,
    keyboardFocused: false
  }),
      _useMergeState$ = _useMergeState[0],
      visible = _useMergeState$.visible,
      ignoreTab = _useMergeState$.ignoreTab,
      keyboardFocused = _useMergeState$.keyboardFocused,
      setState = _useMergeState[1];

  var id = (0, _react.useMemo)(function () {
    return "described-by-" + ++uid;
  }, []);

  var handleKeyDown = function handleKeyDown(event) {
    var key = event.key;

    if (ignoreTab && key !== 'Tab' && key !== 'Shift') {
      if (key === 'Enter') event.preventDefault();
      setState({
        ignoreTab: false
      });
    }

    if (!ignoreTab && key === 'Escape') {
      setState({
        ignoreTab: true
      });
    }
  };

  var handleFocus = function handleFocus(e) {
    if (e.target !== e.currentTarget) return;
    setState({
      visible: true,
      ignoreTab: !mouseDown.current,
      keyboardFocused: !mouseDown.current
    });
  };

  var handleBlur = function handleBlur(e) {
    if (e.target !== e.currentTarget) return;
    setState({
      visible: false
    });
  };

  var handleMouseDown = function handleMouseDown() {
    mouseDown.current = true;
    window.setTimeout(function () {
      mouseDown.current = false;
    });
  };

  return _react.default.createElement("div", {
    style: {
      position: 'relative'
    }
  }, _react.default.createElement(_reactLive.LiveEditor, {
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    onMouseDown: handleMouseDown,
    ignoreTabKey: ignoreTab,
    "aria-describedby": id,
    "aria-label": "Example code editor"
  }), visible && (keyboardFocused || !ignoreTab) && _react.default.createElement(Info, {
    id: id,
    "aria-live": "polite"
  }, ignoreTab ? _react.default.createElement(_react.default.Fragment, null, "Press ", _react.default.createElement("kbd", null, "enter"), " or type a key to enable tab-to-indent") : _react.default.createElement(_react.default.Fragment, null, "Press ", _react.default.createElement("kbd", null, "esc"), " to disable tab trapping")));
}

var prettierComment = /(\{\s*\/\*\s+prettier-ignore\s+\*\/\s*\})|(\/\/\s+prettier-ignore)/gim;
var Preview = (0, _reactLive.withLive)(function (_ref2) {
  var className = _ref2.className,
      live = _ref2.live,
      holderTheme = _ref2.holderTheme;

  var _useCallbackRef = (0, _useCallbackRef2.default)(),
      example = _useCallbackRef[0],
      attachRef = _useCallbackRef[1];

  var hasTheme = !!holderTheme;
  (0, _react.useEffect)(function () {
    _holderjs.default.addTheme('userTheme', holderTheme);
  }, [hasTheme]);
  (0, _react.useEffect)(function () {
    if (!example) return;

    _holderjs.default.run({
      theme: hasTheme ? 'userTheme' : undefined,
      images: example.querySelectorAll('img')
    });
  }, [live.element, example]); // prevent links in examples from navigating

  var handleClick = function handleClick(e) {
    if (e.target.tagName === 'A') e.preventDefault();
  };

  return _react.default.createElement("div", {
    role: "region",
    "aria-label": "Code Example",
    ref: attachRef,
    className: className,
    onClick: handleClick
  }, _react.default.createElement(_reactLive.LivePreview, null));
});
exports.Preview = Preview;

function Provider(props) {
  var codeText = props.code,
      scope = props.scope,
      children = props.children; // Remove the prettier comments and the trailing semicolons in JSX in displayed code.

  var code = codeText.replace(prettierComment, '').trim().replace(/>;$/, '>');
  return _react.default.createElement(_reactLive.LiveProvider, {
    scope: scope,
    code: code,
    noInline: codeText.includes('render(')
  }, children);
}