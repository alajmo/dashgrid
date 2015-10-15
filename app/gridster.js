/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	/*globals window __webpack_hash__ */
	"use strict";

	if (false) {
		var lastData;
		var upToDate = function upToDate() {
			return lastData.indexOf(__webpack_hash__) >= 0;
		};
		var check = function check() {
			module.hot.check(true, function (err, updatedModules) {
				if (err) {
					if (module.hot.status() in {
						abort: 1,
						fail: 1
					}) {
						console.warn("[HMR] Cannot apply update. Need to do a full reload!");
						console.warn("[HMR] " + err.stack || err.message);
						window.location.reload();
					} else {
						console.warn("[HMR] Update failed: " + err.stack || err.message);
					}
					return;
				}

				if (!updatedModules) {
					console.warn("[HMR] Cannot find update. Need to do a full reload!");
					console.warn("[HMR] (Probably because of restarting the webpack-dev-server)");
					window.location.reload();
					return;
				}

				if (!upToDate()) {
					check();
				}

				require("./log-apply-result")(updatedModules, updatedModules);

				if (upToDate()) {
					console.log("[HMR] App is up to date.");
				}
			});
		};
		var addEventListener = window.addEventListener ? function (eventName, listener) {
			window.addEventListener(eventName, listener, false);
		} : function (eventName, listener) {
			window.attachEvent("on" + eventName, listener);
		};
		addEventListener("message", function (event) {
			if (typeof event.data === "string" && event.data.indexOf("webpackHotUpdate") === 0) {
				lastData = event.data;
				if (!upToDate() && module.hot.status() === "idle") {
					console.log("[HMR] Checking for updates on the server...");
					check();
				}
			}
		});
		console.log("[HMR] Waiting for update signal from WDS...");
	} else {
		throw new Error("[HMR] Hot Module Replacement is disabled.");
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* CSS */
	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _cssGridCss = __webpack_require__(3);

	var _cssGridCss2 = _interopRequireDefault(_cssGridCss);

	var _cssDemoCss = __webpack_require__(7);

	var _cssDemoCss2 = _interopRequireDefault(_cssDemoCss);

	/* JS */

	var _jsGridJs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./js/grid.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _jsGridJs2 = _interopRequireDefault(_jsGridJs);

	(0, _jsGridJs2['default'])();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./grid.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./grid.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, ".grid {\n    position: absolute;\n    /*top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;*/\n    width: 1200px;\n    height: 800px;\n    z-index: 1;\n    margin: 0;\n    padding: 0;\n}\n.grid-box {\n    position: absolute;\n    -webkit-user-select: none;\n    box-sizing: border-box;\n    z-index: 3;\n    display: block;\n    transition: opacity .3s, left .3s, top .3s, width .3s, height .3s;\n}\n\n.grid-preview-box {\n  position: absolute;\n  display: none;\n  background-color: #E8E8E8;\n  border-color: #fff;\n  opacity: 0.8;\n  z-index: 3;\n}\n.grid-box-moving {\n    z-index: 4;\n}\n.grid-preview-box,\n.grid-box-moving {\n    transition: none;\n}\n\n/* Draw Grid */\n.horizontal-line,\n.vertical-line,\n.horizontal-hash-line,\n.vertical-hash-line {\n  position: absolute;\n}\n\n.grid, .grid-box, .grid-preview-box, .grid-box-moving {\n   -webkit-touch-callout: none;\n    -webkit-user-select: none;\n    -khtml-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n}\n", ""]);

	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	"use strict";

	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(8);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./demo.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./demo.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "body, html {\n  width: 100%;\n  height: 100%;\n  font-size: 0.875em;\n  margin: 0;\n  padding: 0;\n  font-family: verdana;\n  background: #cae2da;\n  background: red;\n}\n\n.grid-container {\n  position: relative;\n  margin: 0 auto;\n  margin-top: 20px;\n  width: 95%;\n  /*max-width: 1000px;*/\n  min-height: 1px;\n  background: #f9f9f9;\n}\n.grid {\n  background: #B5CBC4;\n}\n.grid-box {\n  background: #71d161;\n  opacity: 0.8;\n  /*background: rgba(113, 209, 97, 0.5);*/\n  cursor: default;\n  cursor: move;\n}\n\n/* Draws Grid */\n.helper-grid-container {\n  /*background: none;*/\n  width: 100%;\n  height: 100%;\n}\n.horizontal-line,\n.vertical-line {\n  background: #cae2da;\n  background: #B5CBC4;\n  background: #f9f9f9;\n}\n.horizontal-hash-line,\n.vertical-hash-line {\n  background: red;\n  opacity: 0.4;\n  z-index: 9999;\n}\n\n.grid-centroid {\n  position: absolute;\n  background: red;\n  width: 5px;\n  height: 5px;\n}\n\n/**\n* Grid Options\n**/\n.grid-options-container {\n  position: relative;\n  margin: 0 auto;\n  margin-top: 10px;\n  width: 95%;\n  border: 5px solid #FFF;\n  box-sizing: border-box;\n  font-size: 1.3em;\n\n  height: 200px;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-justify-content: space-around;\n      -ms-flex-pack: distribute;\n          justify-content: space-around;\n}\n\n.grid-options {\n  height: 100%;\n  -webkit-box-flex: 1;\n  -webkit-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  margin: 0 5px 20px 5px;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-flex-wrap: wrap;\n      -ms-flex-wrap: wrap;\n          flex-wrap: wrap;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: space-between;\n      -ms-flex-direction: space-between;\n          flex-direction: space-between;\n  padding-right: 20px;\n  box-sizing: border-box;\n  border-right: 5px solid #FFF;\n}\n.grid-options:last-child {\n  border: none;\n}\n\nh4 {\n  text-align: center;\n}\n\n.grid-option {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: end;\n  -webkit-justify-content: flex-end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n      -ms-flex-align: center;\n          align-items: center;\n  margin-top: 10px;\n  width: 50%;\n}\n.grid-option .label {\n  margin-right: 10px;\n}\n.grid-option input {\n  width: 30px;\n  height: 30px;\n  text-align: center;\n  margin: 0;\n}\n\n/**\n* Box Options\n**/\n.box-options {\n  background: #61d16d;\n  /*background: rgba(113, 209, 97, 0.7);*/\n  opacity: 1;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: start;\n  -webkit-justify-content: flex-start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n  -webkit-box-align: start;\n  -webkit-align-items: flex-start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  -webkit-flex-wrap: wrap;\n      -ms-flex-wrap: wrap;\n          flex-wrap: wrap;\n}\n.box-option {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n      -ms-flex-align: center;\n          align-items: center;\n  margin: 5px 10px 0 10px;\n  height: 50px;\n\n}\n.box-option .label {\n  width: 20px;\n  height: 20px;\n  font-size: 1.3em;\n}\n.box-option input {\n  font-size: 1.3em;\n  width: 30px;\n  height: 30px;\n  border: none;\n  text-align: center;\n  margin: 0;\n}\n\n.box-id {\n  position: absolute;\n  bottom: 10px;\n  right: 10px;\n  font-size: 2em;\n}\n\n.drag-handle {\n\n}", ""]);

	// exports


/***/ }
/******/ ]);