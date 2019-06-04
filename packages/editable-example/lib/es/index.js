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

/* eslint-disable react/no-multi-comp */
import styled from '@emotion/styled';
import React, { useRef, useMemo, useEffect } from 'react';
import holderjs from 'holderjs';
import useMergeState from '@restart/hooks/useMergeState';
import useCallbackRef from '@restart/hooks/useCallbackRef';
import { LiveProvider, LiveEditor, LiveError, LivePreview, withLive } from 'react-live';
export var Error = styled(LiveError)(_templateObject());
export var InfoMessage = styled('div')(_templateObject2());
var uid = 0;
export function Editor(_ref) {
  var _ref$infoComponent = _ref.infoComponent,
      Info = _ref$infoComponent === void 0 ? InfoMessage : _ref$infoComponent;
  var mouseDown = useRef(false);

  var _useMergeState = useMergeState({
    visible: false,
    ignoreTab: false,
    keyboardFocused: false
  }),
      _useMergeState$ = _useMergeState[0],
      visible = _useMergeState$.visible,
      ignoreTab = _useMergeState$.ignoreTab,
      keyboardFocused = _useMergeState$.keyboardFocused,
      setState = _useMergeState[1];

  var id = useMemo(function () {
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

  return React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, React.createElement(LiveEditor, {
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    onMouseDown: handleMouseDown,
    ignoreTabKey: ignoreTab,
    "aria-describedby": id,
    "aria-label": "Example code editor"
  }), visible && (keyboardFocused || !ignoreTab) && React.createElement(Info, {
    id: id,
    "aria-live": "polite"
  }, ignoreTab ? React.createElement(React.Fragment, null, "Press ", React.createElement("kbd", null, "enter"), " or type a key to enable tab-to-indent") : React.createElement(React.Fragment, null, "Press ", React.createElement("kbd", null, "esc"), " to disable tab trapping")));
}
var prettierComment = /(\{\s*\/\*\s+prettier-ignore\s+\*\/\s*\})|(\/\/\s+prettier-ignore)/gim;
export var Preview = withLive(function (_ref2) {
  var className = _ref2.className,
      live = _ref2.live,
      holderTheme = _ref2.holderTheme;

  var _useCallbackRef = useCallbackRef(),
      example = _useCallbackRef[0],
      attachRef = _useCallbackRef[1];

  var hasTheme = !!holderTheme;
  useEffect(function () {
    holderjs.addTheme('userTheme', holderTheme);
  }, [hasTheme]);
  useEffect(function () {
    if (!example) return;
    holderjs.run({
      theme: hasTheme ? 'userTheme' : undefined,
      images: example.querySelectorAll('img')
    });
  }, [live.element, example]); // prevent links in examples from navigating

  var handleClick = function handleClick(e) {
    if (e.target.tagName === 'A') e.preventDefault();
  };

  return React.createElement("div", {
    role: "region",
    "aria-label": "Code Example",
    ref: attachRef,
    className: className,
    onClick: handleClick
  }, React.createElement(LivePreview, null));
});
export function Provider(props) {
  var codeText = props.code,
      scope = props.scope,
      children = props.children; // Remove the prettier comments and the trailing semicolons in JSX in displayed code.

  var code = codeText.replace(prettierComment, '').trim().replace(/>;$/, '>');
  return React.createElement(LiveProvider, {
    scope: scope,
    code: code,
    noInline: codeText.includes('render(')
  }, children);
}