/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./server/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./server/index.js":
/*!*************************!*\
  !*** ./server/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-dom/server */ \"react-dom/server\");\n/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_dom_server__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _src_App__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/App */ \"./src/App.js\");\n\n\n\n\n\n\nconst PORT = process.env.PORT || 3006;\nconst app = express__WEBPACK_IMPORTED_MODULE_3___default()();\napp.get('/', (req, res) => {\n  const app = react_dom_server__WEBPACK_IMPORTED_MODULE_4___default.a.renderToString( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_src_App__WEBPACK_IMPORTED_MODULE_5__[\"default\"], null));\n  const indexFile = path__WEBPACK_IMPORTED_MODULE_0___default.a.resolve('./build/index.html');\n  fs__WEBPACK_IMPORTED_MODULE_1___default.a.readFile(indexFile, 'utf8', (err, data) => {\n    if (err) {\n      console.error('Something went wrong:', err);\n      return res.status(500).send('Oops, better luck next time!');\n    }\n\n    return res.send(data.replace('<div id=\"root\"></div>', `<div id=\"root\">${app}</div>`));\n  });\n});\napp.use(express__WEBPACK_IMPORTED_MODULE_3___default.a.static('./build'));\napp.listen(PORT, () => {\n  console.log(`Server is listening on port ${PORT}`);\n});\n\n//# sourceURL=webpack:///./server/index.js?");

/***/ }),

/***/ "./src/App.css":
/*!*********************!*\
  !*** ./src/App.css ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module parse failed: Unexpected token (1:0)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n> .fade-enter {\\n|   opacity: 0;\\n| }\");\n\n//# sourceURL=webpack:///./src/App.css?");

/***/ }),

/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./App.css */ \"./src/App.css\");\n/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_App_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap */ \"react-bootstrap\");\n/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ \"react-router-dom\");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var react_transition_group__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-transition-group */ \"react-transition-group\");\n/* harmony import */ var react_transition_group__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_transition_group__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _components_Header__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/Header */ \"./src/components/Header.js\");\n/* harmony import */ var _components_Premium__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/Premium */ \"./src/components/Premium.js\");\n/* harmony import */ var _components_Home__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/Home */ \"./src/components/Home.js\");\n/* harmony import */ var _components_Footer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/Footer */ \"./src/components/Footer.js\");\n\n\n\n\n\n\n\n\n\n\nclass App extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  render() {\n    const App = Object(react_router_dom__WEBPACK_IMPORTED_MODULE_3__[\"withRouter\"])(({\n      location\n    }) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__[\"Container\"], {\n      fluid: true,\n      id: \"main-container\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Header__WEBPACK_IMPORTED_MODULE_5__[\"default\"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_transition_group__WEBPACK_IMPORTED_MODULE_4__[\"SwitchTransition\"], {\n      mode: 'out-in'\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_transition_group__WEBPACK_IMPORTED_MODULE_4__[\"CSSTransition\"], {\n      key: location.key,\n      classNames: \"fade\",\n      timeout: 300\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_3__[\"Switch\"], {\n      location: location\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_3__[\"Route\"], {\n      exact: true,\n      path: \"/\",\n      component: _components_Home__WEBPACK_IMPORTED_MODULE_7__[\"default\"]\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_3__[\"Route\"], {\n      path: \"/premium\",\n      component: _components_Premium__WEBPACK_IMPORTED_MODULE_6__[\"default\"]\n    })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Footer__WEBPACK_IMPORTED_MODULE_8__[\"default\"], null)));\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(App, null);\n  }\n\n} // class App extends React.Component {\n//   constructor(props) {\n//     super(props);\n//     this.state = { apiResponse: \"\" };\n//   }\n//   callAPI() {\n//     fetch(\"http://localhost:8080/test\")\n//       .then((res) => res.text())\n//       .then((res) => this.setState({ apiResponse: res }));\n//   }\n//   componentWillMount() {\n//     this.callAPI();\n//   }\n//   render() {\n//     return (\n//       <div className=\"App\">\n//         <header className=\"App-header\">\n//           <img src={logo} className=\"App-logo\" alt=\"logo\" />\n//           <p>\n//             Edit <code>src/App.js</code> and save to reload.\n//           </p>\n//           <a\n//             className=\"App-link\"\n//             href=\"https://reactjs.org\"\n//             target=\"_blank\"\n//             rel=\"noopener noreferrer\"\n//           >\n//             Learn React\n//           </a>\n//           <p className=\"App-intro\">{this.state.apiResponse}</p>\n//         </header>\n//       </div>\n//     );\n//   }\n// }\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (App);\n\n//# sourceURL=webpack:///./src/App.js?");

/***/ }),

/***/ "./src/assets/img/crewmate_brown.png":
/*!*******************************************!*\
  !*** ./src/assets/img/crewmate_brown.png ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module parse failed: Unexpected character '�' (1:0)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n(Source code omitted for this binary file)\");\n\n//# sourceURL=webpack:///./src/assets/img/crewmate_brown.png?");

/***/ }),

/***/ "./src/assets/img/crewmate_cyan.png":
/*!******************************************!*\
  !*** ./src/assets/img/crewmate_cyan.png ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module parse failed: Unexpected character '�' (1:0)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n(Source code omitted for this binary file)\");\n\n//# sourceURL=webpack:///./src/assets/img/crewmate_cyan.png?");

/***/ }),

/***/ "./src/assets/img/crewmate_white.png":
/*!*******************************************!*\
  !*** ./src/assets/img/crewmate_white.png ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module parse failed: Unexpected character '�' (1:0)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n(Source code omitted for this binary file)\");\n\n//# sourceURL=webpack:///./src/assets/img/crewmate_white.png?");

/***/ }),

/***/ "./src/assets/img/crewmate_yellow.png":
/*!********************************************!*\
  !*** ./src/assets/img/crewmate_yellow.png ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module parse failed: Unexpected character '�' (1:0)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n(Source code omitted for this binary file)\");\n\n//# sourceURL=webpack:///./src/assets/img/crewmate_yellow.png?");

/***/ }),

/***/ "./src/assets/img/logo_embed.png":
/*!***************************************!*\
  !*** ./src/assets/img/logo_embed.png ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module parse failed: Unexpected character '�' (1:0)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n(Source code omitted for this binary file)\");\n\n//# sourceURL=webpack:///./src/assets/img/logo_embed.png?");

/***/ }),

/***/ "./src/assets/img/svg/amus_crewmate_santa.svg":
/*!****************************************************!*\
  !*** ./src/assets/img/svg/amus_crewmate_santa.svg ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module parse failed: Unexpected token (1:0)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n> <?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\" standalone=\\\"no\\\"?>\\n| <!DOCTYPE svg PUBLIC \\\"-//W3C//DTD SVG 1.1//EN\\\" \\\"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\\\">\\n| <svg width=\\\"100%\\\" height=\\\"100%\\\" viewBox=\\\"0 0 1031 972\\\" version=\\\"1.1\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" xmlns:xlink=\\\"http://www.w3.org/1999/xlink\\\" xml:space=\\\"preserve\\\" xmlns:serif=\\\"http://www.serif.com/\\\" style=\\\"fill-rule:evenodd;clip-rule:evenodd;\\\">\");\n\n//# sourceURL=webpack:///./src/assets/img/svg/amus_crewmate_santa.svg?");

/***/ }),

/***/ "./src/components/EffectToggle.js":
/*!****************************************!*\
  !*** ./src/components/EffectToggle.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return EffectToggle; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ \"react-bootstrap\");\n/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__);\n\n\nclass EffectToggle extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  render() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"OverlayTrigger\"], {\n      placement: \"top\",\n      delay: {\n        show: 0,\n        hide: 0\n      },\n      trigger: ['hover', 'focus'],\n      overlay: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Tooltip\"], {\n        id: this.props.name + \"tooltip\"\n      }, this.props.tooltip)\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      className: \"d-inline-block\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Form\"].Switch, {\n      id: this.props.name,\n      label: this.props.label,\n      onClick: this.props.toggle,\n      defaultChecked: !this.props.init\n    })));\n  }\n\n}\n\n//# sourceURL=webpack:///./src/components/EffectToggle.js?");

/***/ }),

/***/ "./src/components/Footer.css":
/*!***********************************!*\
  !*** ./src/components/Footer.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module parse failed: Unexpected token (4:7)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n| \\n| \\n> footer {\\n|   padding: 1em;\\n|   margin-top: auto;\");\n\n//# sourceURL=webpack:///./src/components/Footer.css?");

/***/ }),

/***/ "./src/components/Footer.js":
/*!**********************************!*\
  !*** ./src/components/Footer.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Footer; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _EffectToggle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EffectToggle */ \"./src/components/EffectToggle.js\");\n/* harmony import */ var _Footer_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Footer.css */ \"./src/components/Footer.css\");\n/* harmony import */ var _Footer_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Footer_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react_snowfall__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-snowfall */ \"react-snowfall\");\n/* harmony import */ var react_snowfall__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_snowfall__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ \"@fortawesome/free-solid-svg-icons\");\n/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ \"@fortawesome/react-fontawesome\");\n/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\n\n\nclass Footer extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      snowActive: true\n    };\n    this.onToggle = this.onToggle.bind(this);\n  }\n\n  onToggle(e) {\n    this.setState({\n      snowActive: e.target.checked\n    });\n  }\n\n  render() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"footer\", {\n      className: \"text-right muted-snow\"\n    }, this.state.snowActive && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_snowfall__WEBPACK_IMPORTED_MODULE_3___default.a, {\n      snowflakeCount: 75\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_EffectToggle__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n      name: \"snow-switch\",\n      init: this.snowActive,\n      tooltip: \"Toggle snow\",\n      toggle: this.onToggle,\n      label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__[\"FontAwesomeIcon\"], {\n        icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__[\"faSnowflake\"]\n      })\n    }));\n  }\n\n}\n\n//# sourceURL=webpack:///./src/components/Footer.js?");

/***/ }),

/***/ "./src/components/Header.css":
/*!***********************************!*\
  !*** ./src/components/Header.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module parse failed: Unexpected token (1:0)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n> .navbar {\\n|   font-family: \\\"Poppins\\\", sans-serif !important;\\n|   font-weight: 700 !important;\");\n\n//# sourceURL=webpack:///./src/components/Header.css?");

/***/ }),

/***/ "./src/components/Header.js":
/*!**********************************!*\
  !*** ./src/components/Header.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ \"react-bootstrap\");\n/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _Header_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Header.css */ \"./src/components/Header.css\");\n/* harmony import */ var _Header_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Header_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ \"@fortawesome/react-fontawesome\");\n/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _fortawesome_free_brands_svg_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/free-brands-svg-icons */ \"@fortawesome/free-brands-svg-icons\");\n/* harmony import */ var _fortawesome_free_brands_svg_icons__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_free_brands_svg_icons__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _assets_img_logo_embed_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../assets/img/logo_embed.png */ \"./src/assets/img/logo_embed.png\");\n/* harmony import */ var _assets_img_logo_embed_png__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_assets_img_logo_embed_png__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-router-dom */ \"react-router-dom\");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_6__);\n\n\n\n\n\n\n\n\nclass Header extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  render() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Navbar\"], {\n      bg: \"transparent\",\n      variant: \"dark\",\n      expand: \"lg\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Navbar\"].Toggle, {\n      \"aria-controls\": \"primary-navbar-nav\"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_6__[\"Link\"], {\n      to: \"/\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Navbar\"].Brand, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"img\", {\n      src: _assets_img_logo_embed_png__WEBPACK_IMPORTED_MODULE_5___default.a,\n      width: \"50\",\n      height: \"50\",\n      className: \"d-inline-block align-top\",\n      alt: \"AutoMuteUs\"\n    }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Navbar\"].Collapse, {\n      id: \"primary-navbar-nav\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Nav\"], {\n      className: \"mr-auto\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Nav\"].Link, {\n      href: \"https://discord.gg/vwWXs8Z\",\n      target: \"_blank\"\n    }, \"Discord Support Server\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Nav\"].Link, {\n      href: \"https://github.com/denverquane/automuteus#commands\"\n    }, \"Commands\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Nav\"].Link, {\n      href: \"https://youtu.be/kO4cqMKV2yI\"\n    }, \"Tutorials\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Nav\"].Link, {\n      href: \"https://github.com/denverquane/automuteus\",\n      target: \"_blank\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__[\"FontAwesomeIcon\"], {\n      icon: _fortawesome_free_brands_svg_icons__WEBPACK_IMPORTED_MODULE_4__[\"faGithub\"],\n      size: \"lg\",\n      className: \"mr-2\"\n    }), \"GitHub\")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"hr\", {\n      className: \"d-lg-none border border-white\"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Nav\"], {\n      className: \"d-none\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Nav\"].Link, {\n      to: \"./auth\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__[\"FontAwesomeIcon\"], {\n      icon: _fortawesome_free_brands_svg_icons__WEBPACK_IMPORTED_MODULE_4__[\"faDiscord\"],\n      size: \"lg\",\n      className: \"mr-2\"\n    }), \"Log In\"))));\n  }\n\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Header);\n\n//# sourceURL=webpack:///./src/components/Header.js?");

/***/ }),

/***/ "./src/components/Home.css":
/*!*********************************!*\
  !*** ./src/components/Home.css ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module parse failed: Unexpected token (1:0)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n> .title {\\n|   line-height: 60px !important;\\n|   margin-bottom: 4px !important;\");\n\n//# sourceURL=webpack:///./src/components/Home.css?");

/***/ }),

/***/ "./src/components/Home.js":
/*!********************************!*\
  !*** ./src/components/Home.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ \"react-bootstrap\");\n/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ \"react-router-dom\");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ \"@fortawesome/react-fontawesome\");\n/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ \"@fortawesome/free-solid-svg-icons\");\n/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _fortawesome_free_brands_svg_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/free-brands-svg-icons */ \"@fortawesome/free-brands-svg-icons\");\n/* harmony import */ var _fortawesome_free_brands_svg_icons__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_free_brands_svg_icons__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _Home_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Home.css */ \"./src/components/Home.css\");\n/* harmony import */ var _Home_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_Home_css__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _ServerStats__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ServerStats */ \"./src/components/ServerStats.js\");\n/* harmony import */ var _assets_img_svg_amus_crewmate_santa_svg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../assets/img/svg/amus_crewmate_santa.svg */ \"./src/assets/img/svg/amus_crewmate_santa.svg\");\n/* harmony import */ var _assets_img_svg_amus_crewmate_santa_svg__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_assets_img_svg_amus_crewmate_santa_svg__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var react_meta_tags__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-meta-tags */ \"react-meta-tags\");\n/* harmony import */ var react_meta_tags__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_meta_tags__WEBPACK_IMPORTED_MODULE_9__);\n\n\n\n\n\n\n\n\n\n\n\nclass Home extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  render() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      className: \"d-flex flex-lg-row flex-column align-items-center p-3\",\n      id: \"main-content\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_meta_tags__WEBPACK_IMPORTED_MODULE_9___default.a, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"title\", null, \"AutoMuteUs\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n      property: \"og:title\",\n      content: \"AutoMuteUs\"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n      property: \"og:type\",\n      content: \"website\"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n      property: \"og:url\",\n      content: \"https://automute.us\"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n      property: \"og:image\",\n      content: \"https://github.com/automuteus/react-web/blob/main/client/src/assets/img/logo_embed.png?raw=true\"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n      property: \"og:description\",\n      content: \"AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!\"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n      name: \"theme-color\",\n      content: \"#7289DA\"\n    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      id: \"home-text\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"h2\", {\n      className: \"title\"\n    }, \"Use AutoMuteUs for hands free muting\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", {\n      className: \"subtitle\"\n    }, \"AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      id: \"home-links\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Button\"], {\n      href: \"https://add.automute.us/\",\n      className: \"btn btn-primary btn-lg\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__[\"FontAwesomeIcon\"], {\n      icon: _fortawesome_free_brands_svg_icons__WEBPACK_IMPORTED_MODULE_5__[\"faDiscord\"],\n      size: \"lg\",\n      className: \"mr-2\"\n    }), \"Add to Discord\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Button\"], {\n      href: \"https://github.com/denverquane/amonguscapture/releases/latest/download/AmongUsCapture.zip\",\n      className: \"btn btn-primary btn-lg\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__[\"FontAwesomeIcon\"], {\n      icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__[\"faCamera\"],\n      size: \"lg\",\n      className: \"mr-2\"\n    }), \"Capture Software\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__[\"Link\"], {\n      to: \"./premium\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Button\"], {\n      className: \"btn btn-premium btn-lg\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__[\"FontAwesomeIcon\"], {\n      icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__[\"faGem\"],\n      size: \"lg\",\n      className: \"mr-2\"\n    }), \"AutoMuteUs Premium\"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_ServerStats__WEBPACK_IMPORTED_MODULE_7__[\"default\"], null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      id: \"home-crewmate\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"object\", {\n      id: \"crewmate\",\n      alt: \"\",\n      type: \"image/svg+xml\",\n      data: _assets_img_svg_amus_crewmate_santa_svg__WEBPACK_IMPORTED_MODULE_8___default.a,\n      className: \"floating\",\n      \"aria-label\": \"AutoMuteUs\"\n    })));\n  }\n\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Home);\n\n//# sourceURL=webpack:///./src/components/Home.js?");

/***/ }),

/***/ "./src/components/Premium.css":
/*!************************************!*\
  !*** ./src/components/Premium.css ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module parse failed: Unexpected token (1:0)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n> .sub-card {\\n|   color: rgba(255, 255, 255, 0.863) !important;\\n|   font-size: 17px;\");\n\n//# sourceURL=webpack:///./src/components/Premium.css?");

/***/ }),

/***/ "./src/components/Premium.js":
/*!***********************************!*\
  !*** ./src/components/Premium.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ \"react-bootstrap\");\n/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _SubscriptionCard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SubscriptionCard */ \"./src/components/SubscriptionCard.js\");\n/* harmony import */ var _Premium_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Premium.css */ \"./src/components/Premium.css\");\n/* harmony import */ var _Premium_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Premium_css__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _assets_img_crewmate_brown_png__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../assets/img/crewmate_brown.png */ \"./src/assets/img/crewmate_brown.png\");\n/* harmony import */ var _assets_img_crewmate_brown_png__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_assets_img_crewmate_brown_png__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _assets_img_crewmate_white_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../assets/img/crewmate_white.png */ \"./src/assets/img/crewmate_white.png\");\n/* harmony import */ var _assets_img_crewmate_white_png__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_assets_img_crewmate_white_png__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _assets_img_crewmate_yellow_png__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../assets/img/crewmate_yellow.png */ \"./src/assets/img/crewmate_yellow.png\");\n/* harmony import */ var _assets_img_crewmate_yellow_png__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_assets_img_crewmate_yellow_png__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _assets_img_crewmate_cyan_png__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../assets/img/crewmate_cyan.png */ \"./src/assets/img/crewmate_cyan.png\");\n/* harmony import */ var _assets_img_crewmate_cyan_png__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_assets_img_crewmate_cyan_png__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var react_meta_tags__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-meta-tags */ \"react-meta-tags\");\n/* harmony import */ var react_meta_tags__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_meta_tags__WEBPACK_IMPORTED_MODULE_8__);\n\n\n\n\n\n\n\n\n\n\nclass Premium extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  render() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      className: \"text-center\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_meta_tags__WEBPACK_IMPORTED_MODULE_8___default.a, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"title\", null, \"AutoMuteUs Premium\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n      property: \"og:title\",\n      content: \"AutoMuteUs Premium\"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n      property: \"og:type\",\n      content: \"website\"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n      property: \"og:url\",\n      content: \"https://automute.us/premium\"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n      property: \"og:image\",\n      content: \"https://github.com/automuteus/react-web/blob/main/client/src/assets/img/logo_premium.png?raw=true\"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n      property: \"og:description\",\n      content: \"Avoid the game cap and more with AutoMuteUs Premium\"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n      name: \"theme-color\",\n      content: \"#7289DA\"\n    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"h1\", null, \"\\u2B50 Premium Tiers \\u2B50\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"h6\", {\n      className: \"text-muted mb-4\"\n    }, \"Game cap is full, and you want faster muting? Try these!\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Row\"], {\n      xs: 1,\n      lg: 3,\n      className: \"justify-content-center\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_SubscriptionCard__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n      color: \"#71491E\",\n      title: \"AutoMuteUs Bronze\",\n      paypal_id: \"M8D39PF5ADGJW\",\n      show_fee: \"true\",\n      image: _assets_img_crewmate_brown_png__WEBPACK_IMPORTED_MODULE_4___default.a\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, \"Offers Basic Premium features for AutoMuteUs! ($1.50* a month)\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"ul\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"em\", null, \"Priority Game Access:\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, \"Always be able to make new games, even when the bot is under high load!\")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"em\", null, \"Stats and Leaderboards \", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"small\", null, \"(BETA)\"), \":\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, \"View Among Us stats and leaderboards for the players on your server!\"))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_SubscriptionCard__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n      color: \"#D6E0F0\",\n      title: \"AutoMuteUs Silver\",\n      paypal_id: \"CPZMEL7ZA6PHN\",\n      show_fee: \"true\",\n      image: _assets_img_crewmate_white_png__WEBPACK_IMPORTED_MODULE_5___default.a\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, \"Offers Standard Premium features for AutoMuteUs! ($3.50* a month)\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"ul\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"em\", null, \" Includes AutoMuteUs Bronze, but also:\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, \"1 Priority Muting Bot: Issues requests alongside the main bot; this drastically improves the speed of mutes/deafens in your games!\")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"em\", null, \"General Support:\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, \"Access to Premium-Only channels and chats in our Official Discord!\"))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_SubscriptionCard__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n      color: \"#F6F658\",\n      title: \"AutoMuteUs Gold\",\n      paypal_id: \"PYFCA7562KHB6\",\n      show_fee: \"true\",\n      image: _assets_img_crewmate_yellow_png__WEBPACK_IMPORTED_MODULE_6___default.a\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, \"Offers Enhanced Premium features for AutoMuteUs! ($5.50* a month)\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"ul\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"em\", null, \"Includes previous tiers, but also:\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, \"Multiple Server Premium Status: Get your Gold AutoMuteUs status in 2 servers of your choosing!\")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"em\", null, \"3 Priority Muting Bots:\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, \"3 total Mute Bots to go even further in speeding up your games! Ideal for servers that run multiple games simultaneously!\")))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"h1\", {\n      className: \"mb-4\"\n    }, \"\\uD83D\\uDC8E Super Awesome Donator Tier \\uD83D\\uDC8E\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Row\"], {\n      xs: 1,\n      lg: 3,\n      className: \"justify-content-center\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_SubscriptionCard__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n      color: \"#38fedc\",\n      title: \"Donation\",\n      paypal_id: \"YM72RY5TF6WZU\",\n      image: _assets_img_crewmate_cyan_png__WEBPACK_IMPORTED_MODULE_7___default.a\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, \"Chip in any amount you wish \\u2764\\uFE0F\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"ul\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"em\", null, \"Includes:\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, \"No special bot privileges, but rather our thanks for making this Open Source Project possible!\")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"em\", null, \"Why this means so much:\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, \"Turns out, servers are expensive! This money goes back into the cost of paying for our servers.\")))))));\n  }\n\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Premium);\n\n//# sourceURL=webpack:///./src/components/Premium.js?");

/***/ }),

/***/ "./src/components/ServerStats.css":
/*!****************************************!*\
  !*** ./src/components/ServerStats.css ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module parse failed: Unexpected token (1:0)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n> .stat-card {\\n|   text-align: center;\\n|   font-family: \\\"Poppins\\\";\");\n\n//# sourceURL=webpack:///./src/components/ServerStats.css?");

/***/ }),

/***/ "./src/components/ServerStats.js":
/*!***************************************!*\
  !*** ./src/components/ServerStats.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ServerStats; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _ServerStats_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ServerStats.css */ \"./src/components/ServerStats.css\");\n/* harmony import */ var _ServerStats_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ServerStats_css__WEBPACK_IMPORTED_MODULE_1__);\n\n\nclass ServerStats extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      error: null,\n      isLoaded: false,\n      guilds: 0,\n      activeGames: 0\n    };\n  }\n\n  async fetchData() {\n    try {\n      const response = await fetch(\"https://stats.automute.us/stats/api\");\n      const json = await response.json();\n      this.setState({\n        isLoaded: true,\n        guilds: json.totalGuilds,\n        activeGames: json.activeGames\n      });\n    } catch (error) {\n      this.setState({\n        isLoaded: true,\n        error\n      });\n    }\n  }\n\n  componentDidMount() {\n    this.fetchData();\n    this.interval = setInterval(() => {\n      this.fetchData();\n    }, 7000);\n  }\n\n  componentWillUnmount() {\n    clearInterval(this.interval);\n  }\n\n  render() {\n    const {\n      error,\n      isLoaded,\n      guilds,\n      activeGames\n    } = this.state;\n\n    if (error) {\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        id: \"home-stats\",\n        className: \"d-flex align-content-center align-content-lg-start flex-column flex-lg-row\"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(StatCard, {\n        label: \"Servers\",\n        stat: \"Such\",\n        loaded: true\n      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(StatCard, {\n        label: \"Active Games\",\n        stat: \"Very\",\n        loaded: true\n      }));\n    } else {\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        id: \"home-stats\",\n        className: \"d-flex align-content-center align-content-lg-start flex-column flex-lg-row\"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(StatCard, {\n        label: \"Servers\",\n        stat: guilds,\n        loaded: isLoaded\n      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(StatCard, {\n        label: \"Active Games\",\n        stat: activeGames,\n        loaded: isLoaded\n      }));\n    }\n  }\n\n}\n\nfunction StatCard(props) {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"stat-card p-3 p-lg-5 pb-0\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"stat-data\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: props.loaded ? \"fadeIn\" : \"fadeOut\"\n  }, props.stat)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"stat-label\"\n  }, props.label));\n}\n\n//# sourceURL=webpack:///./src/components/ServerStats.js?");

/***/ }),

/***/ "./src/components/SubscriptionCard.js":
/*!********************************************!*\
  !*** ./src/components/SubscriptionCard.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return SubscriptionCard; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ \"react-bootstrap\");\n/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _fortawesome_free_brands_svg_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fortawesome/free-brands-svg-icons */ \"@fortawesome/free-brands-svg-icons\");\n/* harmony import */ var _fortawesome_free_brands_svg_icons__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_free_brands_svg_icons__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ \"@fortawesome/react-fontawesome\");\n/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nclass SubscriptionCard extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      guild_id: null\n    };\n    this.getGuild = this.getGuild.bind(this);\n  }\n\n  onComponentMount() {\n    this.getGuild();\n  }\n\n  getGuild(e) {\n    const urlParams = new URLSearchParams(window.location.search);\n    let guild;\n\n    if (!this.props.show_fee) {\n      this.setState({\n        guild_id: \"donation\"\n      });\n    } else if ((guild = urlParams.get(\"guild\")) != null && !(guild === null || guild === \"\" || !this.validateId(guild, false))) {\n      this.setState({\n        guild_id: guild\n      });\n    } else {\n      // alert('guild id needed');\n      let pretext = guild !== null ? guild + \" (from URL)\" : \"(17-20 digit guild ID)\";\n      guild = prompt(\"Please provide the Server ID you want premium for:\", pretext);\n      if (guild === null || guild === \"\" || !this.validateId(guild, true)) e.preventDefault();\n      this.setState({\n        guild_id: guild\n      });\n    }\n  }\n\n  validateId(id, notice) {\n    let message = false;\n    if (id.length < 17 || id.length > 20 || isNaN(id)) message = \"Invalid ID. You can get your Server ID with developer tools in discord.\";\n\n    if (message) {\n      if (notice) alert(message);\n      return false;\n    } else {\n      return true;\n    }\n  }\n\n  render() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Col\"], {\n      className: \"mb-4\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Card\"], {\n      className: \"text-center bg-dark text-white sub-card h-100\",\n      style: {\n        borderColor: this.props.color\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Card\"].Body, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Card\"].Title, {\n      style: {\n        color: this.props.color\n      }\n    }, this.props.title, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Image\"], {\n      src: this.props.image\n    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Card\"].Text, {\n      className: \"text-left\",\n      as: \"div\"\n    }, this.props.children)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Card\"].Footer, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__[\"Button\"], {\n      href: \"https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=\" + this.props.paypal_id + \"&custom=\" + this.state.guild_id,\n      target: \"_blank\",\n      className: \"btn btn-premium m-0\",\n      onClick: this.getGuild\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__[\"FontAwesomeIcon\"], {\n      icon: _fortawesome_free_brands_svg_icons__WEBPACK_IMPORTED_MODULE_2__[\"faPaypal\"],\n      size: \"lg\",\n      className: \"mr-2\"\n    }), \" \", \"Checkout\"), this.props.show_fee && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"small\", {\n      className: \"d-block mt-2 text-muted\"\n    }, \"*includes 50\\xA2 paypal processing fee\"))));\n  }\n\n}\n\n//# sourceURL=webpack:///./src/components/SubscriptionCard.js?");

/***/ }),

/***/ "@fortawesome/free-brands-svg-icons":
/*!*****************************************************!*\
  !*** external "@fortawesome/free-brands-svg-icons" ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@fortawesome/free-brands-svg-icons\");\n\n//# sourceURL=webpack:///external_%22@fortawesome/free-brands-svg-icons%22?");

/***/ }),

/***/ "@fortawesome/free-solid-svg-icons":
/*!****************************************************!*\
  !*** external "@fortawesome/free-solid-svg-icons" ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@fortawesome/free-solid-svg-icons\");\n\n//# sourceURL=webpack:///external_%22@fortawesome/free-solid-svg-icons%22?");

/***/ }),

/***/ "@fortawesome/react-fontawesome":
/*!*************************************************!*\
  !*** external "@fortawesome/react-fontawesome" ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@fortawesome/react-fontawesome\");\n\n//# sourceURL=webpack:///external_%22@fortawesome/react-fontawesome%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react\");\n\n//# sourceURL=webpack:///external_%22react%22?");

/***/ }),

/***/ "react-bootstrap":
/*!**********************************!*\
  !*** external "react-bootstrap" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react-bootstrap\");\n\n//# sourceURL=webpack:///external_%22react-bootstrap%22?");

/***/ }),

/***/ "react-dom/server":
/*!***********************************!*\
  !*** external "react-dom/server" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react-dom/server\");\n\n//# sourceURL=webpack:///external_%22react-dom/server%22?");

/***/ }),

/***/ "react-meta-tags":
/*!**********************************!*\
  !*** external "react-meta-tags" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react-meta-tags\");\n\n//# sourceURL=webpack:///external_%22react-meta-tags%22?");

/***/ }),

/***/ "react-router-dom":
/*!***********************************!*\
  !*** external "react-router-dom" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react-router-dom\");\n\n//# sourceURL=webpack:///external_%22react-router-dom%22?");

/***/ }),

/***/ "react-snowfall":
/*!*********************************!*\
  !*** external "react-snowfall" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react-snowfall\");\n\n//# sourceURL=webpack:///external_%22react-snowfall%22?");

/***/ }),

/***/ "react-transition-group":
/*!*****************************************!*\
  !*** external "react-transition-group" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react-transition-group\");\n\n//# sourceURL=webpack:///external_%22react-transition-group%22?");

/***/ })

/******/ });