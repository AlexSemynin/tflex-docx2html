'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _converter = require('./converter');

var _converter2 = _interopRequireDefault(_converter);

var _jszip = require('jszip');

var _jszip2 = _interopRequireDefault(_jszip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createDocument, CSSStyleDeclaration;

var Document = function (_Converter) {
	(0, _inherits3.default)(Document, _Converter);

	function Document() {
		(0, _classCallCheck3.default)(this, Document);
		return (0, _possibleConstructorReturn3.default)(this, (Document.__proto__ || (0, _getPrototypeOf2.default)(Document)).apply(this, arguments));
	}

	(0, _createClass3.default)(Document, [{
		key: 'convert',
		value: function convert() {
			this.doc = this.constructor.create(this.options);
			this.content = this.doc;
			var contentStyle = this.content.style;
			contentStyle.backgroundColor = 'transparent';
			contentStyle.minHeight = '1000px';
			contentStyle.width = '100%';
			contentStyle.paddingTop = '20px';
			contentStyle.overflow = 'auto';

			var style = this.doc.createStyle('*');
			style.margin = '0';
			style.border = '0';
			style.padding = '0';
			style.boxSizing = 'border-box';

			style = this.doc.createStyle('table');
			style.width = '100%';
			style.borderCollapse = 'collapse';
			style.wordBreak = 'break-word';

			style = this.doc.createStyle('section');
			style.margin = 'auto';
			style.backgroundColor = 'white';
			style.color = 'black';
			style.position = 'relative';
			style.zIndex = 0;

			style = this.doc.createStyle('p:empty:before');
			style.content = '""';
			style.display = 'inline-block';

			style = this.doc.createStyle('ul');
			style.listStyle = "none";

			style = this.doc.createStyle('ul>li>p');
			style.position = 'relative';

			style = this.doc.createStyle('ul .marker');
			style.position = 'absolute';

			style = this.doc.createStyle('a');
			style.textDecoration = 'none';

			style = this.doc.createStyle('.unsupported');
			style.outline = "2px red solid";

			style = this.doc.createStyle('.warning');
			style.outline = "1px yellow solid";
			this.convertStyle();
		}
	}, {
		key: 'convertStyle',
		value: function convertStyle() {
			var bgStyle = this.wordModel.getBackgroundStyle();
			if (!bgStyle) return;

			var style = this.doc.createStyle('section');
			switch (typeof bgStyle === 'undefined' ? 'undefined' : (0, _typeof3.default)(bgStyle)) {
				case 'object':
					// fill
					console.warn('not support fill color on document background yet');
					break;
				default:
					style.backgroundColor = bgStyle;
					break;
			}
		}
		/**
  * opt: {
  * 	template: function(style, html, props){ return (html)},
  	extendScript: "http://a.com/a.js"
  	}
  */

	}, {
		key: 'toString',
		value: function toString(opt) {
			return this.doc.toString(opt, this.props);
		}
	}, {
		key: 'release',
		value: function release() {
			this.doc.release();
		}
	}, {
		key: 'asZip',
		value: function asZip(opt) {
			return this.doc.asZip(opt, this.props);
		}
	}, {
		key: 'download',
		value: function download(opt) {
			return this.doc.download(opt, this.props);
		}
		/**
  * opt=extend(toString.opt,{
  	saveImage: function(arrayBuffer, doc.props): promise(url) {},
  	saveHtml: function(){}
  })
  */

	}, {
		key: 'save',
		value: function save(opt) {
			return this.doc.save(opt, this.props);
		}
	}, {
		key: 'tag',
		get: function get() {
			return 'html';
		}
	}], [{
		key: 'create',
		value: function create(opt) {
			var selfConverter = this;
			return function (document) {
				var doc = function browserDoc() {
					var _uid = 0;
					var root = (0, _assign2.default)(document.createElement('div'), {
						id: "A",
						section: null,
						createElement: document.createElement.bind(document),
						createTextNode: document.createTextNode.bind(document),
						createStyleSheet: function createStyleSheet() {
							if (this.stylesheet) return this.stylesheet;
							var elStyle = this.createElement('style');
							this.body.appendChild(elStyle, null);
							return this.stylesheet = elStyle.sheet;
						},
						getStyleText: function getStyleText() {
							var styles = [];
							for (var i = 0, rules = this.stylesheet.cssRules, len = rules.length; i < len; i++) {
								styles.push(rules[i].cssText);
							}return styles.join('\r\n');
						},
						uid: function uid() {
							return this.id + _uid++;
						},
						toString: function toString(opt) {
							var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : selfConverter.props;

							if (opt && typeof opt.template != "undefined" && $.isFunction(opt.template)) return opt.template(this.getStyleText(), this._html(), props);
							var html = ['<!doctype html>\r\n<html><head><meta charset=utf-8><meta key="generator" value="docx2html"><title>' + (props.name || '') + '</title><style>'];
							html.push(this.getStyleText());
							html.push('</style></head><body>');
							html.push(this._html());
							opt && opt.extendScript && html.push('<script src="' + opt.extendScript + '"></script>');
							html.push('</body><html>');
							return html.join('\r\n');
						},
						_html: function _html() {
							var divs = this.querySelectorAll('p>div, span>div');
							if (divs.length == 0) return this.outerHTML;

							/**
       * illegal <p> <div/> </p>
       * DOM operation directly in onload
       */
							var divcontainer = doc.createElement('div'),
							    uid = 0;
							divcontainer.id = 'divcontainer';
							divcontainer.style.display = "none";
							this.appendChild(divcontainer);
							for (var i = divs.length - 1; i > -1; i--) {
								var div = divs[i],
								    parent = div.parentNode;

								if (!div.id) div.id = '_z' + ++uid;

								if (!parent.id) parent.id = '_y' + uid;

								div.setAttribute('data-parent', parent.id);
								div.setAttribute('data-index', indexOf(div, parent.childNodes));

								divcontainer.appendChild(divs[i]);
							}

							var html = this.outerHTML + '\n\r<script>(' + this._transformer.toString() + ')();</script>';
							this._transformer();
							return html;
						},
						_transformer: function _transformer() {
							var a = document.querySelector('#divcontainer');
							for (var divs = a.childNodes, i = divs.length - 1; i > -1; i--) {
								var div = divs[i],
								    parentId = div.getAttribute('data-parent'),
								    index = parseInt(div.getAttribute('data-index')),
								    parent = document.querySelector('#' + parentId);
								parent.insertBefore(div, parent.childNodes[index]);
							}
							a.parentNode.removeChild(a);
						}
					});

					function indexOf(el, els) {
						for (var i = els.length - 1; i > 0; i--) {
							if (el == els[i]) return i;
						}return 0;
					}

					(opt && opt.container || document.body).appendChild(root);
					root.body = root;
					return root;
				}();

				return function mixin(doc) {
					var stylesheet = doc.createStyleSheet();
					var relStyles = {},
					    styles = {};

					return (0, _assign2.default)(selfConverter[$.isNode ? 'nodefy' : 'browserify'](doc, stylesheet, opt), {
						createStyle: function createStyle(selector) {
							if (styles[selector]) return styles[selector];
							var rules = stylesheet.cssRules,
							    len = rules.length;
							stylesheet.insertRule(selector.split(',').map(function (a) {
								return a.trim()[0] == '#' ? a : '#' + this.id + ' ' + a;
							}.bind(this)).join(',') + '{}', len);
							return styles[selector] = stylesheet.cssRules[len].style;
						},
						stylePath: function stylePath(a, parent) {
							if (parent) return relStyles[a] = parent;
							var paths = [a],
							    parent = a;
							while (parent = relStyles[parent]) {
								paths.unshift(parent);
							}return paths.join(' ');
						},
						release: function release() {
							delete this.section;
							this._release();
						}
					});
				}(doc);
			}($.isNode ? createDocument() : document);
		}
	}, {
		key: 'nodefy',
		value: function nodefy(doc, stylesheet, opt) {
			return (0, _assign2.default)(doc, {
				_release: function _release() {},
				asImageURL: function asImageURL(buffer) {
					if (opt && typeof opt.asImageURL != 'undefined') return opt.asImageURL(buffer);
					return "image://notsupport";
				},
				asZip: function asZip() {
					throw new Error('not support');
				},
				download: function download() {
					throw new Error('not support');
				},
				save: function save() {
					throw new Error('not support');
				}
			});
		}
	}, {
		key: 'browserify',
		value: function browserify(doc, stylesheet, opt) {
			var Proto_Blob = function (a) {
				a = URL.createObjectURL(new Blob()).split('/');
				a.pop();
				return a.join('/');
			}(),
			    Reg_Proto_Blob = new RegExp(Proto_Blob + "/([\\w\\d-]+)", "gi");

			return (0, _assign2.default)(doc, {
				asZip: function asZip(opt, props) {
					var zip = new _jszip2.default(),
					    hasImage = false;
					var f = zip.folder('images');
					(0, _keys2.default)(this.images).forEach(function (a) {
						hasImage = true;
						f.file(a.split('/').pop(), this[a]);
					}, this.images);
					zip.file('props.json', (0, _stringify2.default)(props));
					zip.file('main.html', hasImage ? this.toString(opt).replace(Proto_Blob, 'images') : this.toString());
					return zip;
				},
				download: function download(opt, props) {
					var a = document.createElement("a");
					document.body.appendChild(a);
					a.href = URL.createObjectURL(this.asZip(opt, props).generate({ type: 'blob' }));
					a.download = (props.name || "document") + '.zip';
					a.click();
					URL.revokeObjectURL(a.href);
					document.body.removeChild(a);
				},
				save: function save(opt, props) {
					var hasImage = false,
					    images = {},
					    me = this;
					return $.Deferred.when((this.images && (0, _keys2.default)(this.images) || []).map(function (a) {
						hasImage = true;
						return opt.saveImage(this[a], props).then(function (url) {
							return images[a] = url;
						});
					}, this.images)).then(function () {
						var html = me.toString(opt, props);
						if (hasImage) html = html.replace(Reg_Proto_Blob, function (a, id) {
							return images[a];
						});
						return opt.saveHtml(html, props);
					});
				},

				images: {},
				asImageURL: function asImageURL(arrayBuffer) {
					var url = URL.createObjectURL(new Blob([arrayBuffer], { type: "image/" + (typeof arrayBuffer == 'string' ? 'svg+xml' : '*') }));
					this.images[url] = arrayBuffer;
					return url;
				},
				_release: function _release() {
					(0, _keys2.default)(this.images).forEach(function (b) {
						URL.revokeObjectURL(b);
					});
					delete this.images;
				}
			});
		}
	}]);
	return Document;
}(_converter2.default);

exports.default = Document;


(function (isNode, m) {
	if (!isNode) return;

	createDocument = require(m).jsdom;
	var window = createDocument().defaultView;

	global.btoa = window.btoa;
	CSSStyleDeclaration = window.CSSStyleDeclaration;
})($.isNode, "jsdom");
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kb2N4L2h0bWwvZG9jdW1lbnQuanMiXSwibmFtZXMiOlsiY3JlYXRlRG9jdW1lbnQiLCJDU1NTdHlsZURlY2xhcmF0aW9uIiwiRG9jdW1lbnQiLCJkb2MiLCJjb25zdHJ1Y3RvciIsImNyZWF0ZSIsIm9wdGlvbnMiLCJjb250ZW50IiwiY29udGVudFN0eWxlIiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJtaW5IZWlnaHQiLCJ3aWR0aCIsInBhZGRpbmdUb3AiLCJvdmVyZmxvdyIsImNyZWF0ZVN0eWxlIiwibWFyZ2luIiwiYm9yZGVyIiwicGFkZGluZyIsImJveFNpemluZyIsImJvcmRlckNvbGxhcHNlIiwid29yZEJyZWFrIiwiY29sb3IiLCJwb3NpdGlvbiIsInpJbmRleCIsImRpc3BsYXkiLCJsaXN0U3R5bGUiLCJ0ZXh0RGVjb3JhdGlvbiIsIm91dGxpbmUiLCJjb252ZXJ0U3R5bGUiLCJiZ1N0eWxlIiwid29yZE1vZGVsIiwiZ2V0QmFja2dyb3VuZFN0eWxlIiwiY29uc29sZSIsIndhcm4iLCJvcHQiLCJ0b1N0cmluZyIsInByb3BzIiwicmVsZWFzZSIsImFzWmlwIiwiZG93bmxvYWQiLCJzYXZlIiwic2VsZkNvbnZlcnRlciIsImRvY3VtZW50IiwiYnJvd3NlckRvYyIsInVpZCIsInJvb3QiLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJzZWN0aW9uIiwiYmluZCIsImNyZWF0ZVRleHROb2RlIiwiY3JlYXRlU3R5bGVTaGVldCIsInN0eWxlc2hlZXQiLCJlbFN0eWxlIiwiYm9keSIsImFwcGVuZENoaWxkIiwic2hlZXQiLCJnZXRTdHlsZVRleHQiLCJzdHlsZXMiLCJpIiwicnVsZXMiLCJjc3NSdWxlcyIsImxlbiIsImxlbmd0aCIsInB1c2giLCJjc3NUZXh0Iiwiam9pbiIsInRlbXBsYXRlIiwiJCIsImlzRnVuY3Rpb24iLCJfaHRtbCIsImh0bWwiLCJuYW1lIiwiZXh0ZW5kU2NyaXB0IiwiZGl2cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJvdXRlckhUTUwiLCJkaXZjb250YWluZXIiLCJkaXYiLCJwYXJlbnQiLCJwYXJlbnROb2RlIiwic2V0QXR0cmlidXRlIiwiaW5kZXhPZiIsImNoaWxkTm9kZXMiLCJfdHJhbnNmb3JtZXIiLCJhIiwicXVlcnlTZWxlY3RvciIsInBhcmVudElkIiwiZ2V0QXR0cmlidXRlIiwiaW5kZXgiLCJwYXJzZUludCIsImluc2VydEJlZm9yZSIsInJlbW92ZUNoaWxkIiwiZWwiLCJlbHMiLCJjb250YWluZXIiLCJtaXhpbiIsInJlbFN0eWxlcyIsImlzTm9kZSIsInNlbGVjdG9yIiwiaW5zZXJ0UnVsZSIsInNwbGl0IiwibWFwIiwidHJpbSIsInN0eWxlUGF0aCIsInBhdGhzIiwidW5zaGlmdCIsIl9yZWxlYXNlIiwiYXNJbWFnZVVSTCIsImJ1ZmZlciIsIkVycm9yIiwiUHJvdG9fQmxvYiIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsIkJsb2IiLCJwb3AiLCJSZWdfUHJvdG9fQmxvYiIsIlJlZ0V4cCIsInppcCIsIkpTWmlwIiwiaGFzSW1hZ2UiLCJmIiwiZm9sZGVyIiwiaW1hZ2VzIiwiZm9yRWFjaCIsImZpbGUiLCJyZXBsYWNlIiwiaHJlZiIsImdlbmVyYXRlIiwidHlwZSIsImNsaWNrIiwicmV2b2tlT2JqZWN0VVJMIiwibWUiLCJEZWZlcnJlZCIsIndoZW4iLCJzYXZlSW1hZ2UiLCJ0aGVuIiwidXJsIiwic2F2ZUh0bWwiLCJhcnJheUJ1ZmZlciIsImIiLCJDb252ZXJ0ZXIiLCJtIiwicmVxdWlyZSIsImpzZG9tIiwid2luZG93IiwiZGVmYXVsdFZpZXciLCJnbG9iYWwiLCJidG9hIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFJQSxjQUFKLEVBQW9CQyxtQkFBcEI7O0lBRXFCQyxROzs7Ozs7Ozs7OzRCQUdYO0FBQ1IsUUFBS0MsR0FBTCxHQUFTLEtBQUtDLFdBQUwsQ0FBaUJDLE1BQWpC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QUFQO0FBV0EsS0FsQ3VCOztBQW1DeEJ1RixZQUFPLEVBbkNpQjtBQW9DeEJmLGNBcEN3QixzQkFvQ2IrQixXQXBDYSxFQW9DRDtBQUN0QixTQUFJRixNQUFJekIsSUFBSUMsZUFBSixDQUFvQixJQUFJQyxJQUFKLENBQVMsQ0FBQ3lCLFdBQUQsQ0FBVCxFQUMzQixFQUFDVixNQUFLLFlBQVUsT0FBT1UsV0FBUCxJQUFxQixRQUFyQixHQUFnQyxTQUFoQyxHQUE0QyxHQUF0RCxDQUFOLEVBRDJCLENBQXBCLENBQVI7QUFFQSxVQUFLaEIsTUFBTCxDQUFZYyxHQUFaLElBQWlCRSxXQUFqQjtBQUNBLFlBQU9GLEdBQVA7QUFDQSxLQXpDdUI7QUEwQ3hCOUIsWUExQ3dCLHNCQTBDZDtBQUNULHlCQUFZLEtBQUtnQixNQUFqQixFQUF5QkMsT0FBekIsQ0FBaUMsVUFBU2dCLENBQVQsRUFBVztBQUMzQzVCLFVBQUltQixlQUFKLENBQW9CUyxDQUFwQjtBQUNBLE1BRkQ7QUFHQSxZQUFPLEtBQUtqQixNQUFaO0FBQ0E7QUEvQ3VCLElBQWxCLENBQVA7QUFpREE7OztFQS9Tb0NrQixtQjs7a0JBQWpCNUksUTs7O0FBa1RyQixDQUFDLFVBQVNpRyxNQUFULEVBQWlCNEMsQ0FBakIsRUFBbUI7QUFDbkIsS0FBRyxDQUFDNUMsTUFBSixFQUFZOztBQUVabkcsa0JBQWVnSixRQUFRRCxDQUFSLEVBQVdFLEtBQTFCO0FBQ0EsS0FBSUMsU0FBT2xKLGlCQUFpQm1KLFdBQTVCOztBQUVBQyxRQUFPQyxJQUFQLEdBQVlILE9BQU9HLElBQW5CO0FBQ0FwSix1QkFBb0JpSixPQUFPakosbUJBQTNCO0FBQ0EsQ0FSRCxFQVFHb0UsRUFBRThCLE1BUkwsRUFRYSxPQVJiIiwiZmlsZSI6ImRvY3VtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbnZlcnRlciBmcm9tICcuL2NvbnZlcnRlcidcclxuaW1wb3J0IEpTWmlwIGZyb20gJ2pzemlwJ1xyXG5cclxudmFyIGNyZWF0ZURvY3VtZW50LCBDU1NTdHlsZURlY2xhcmF0aW9uXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb2N1bWVudCBleHRlbmRzIENvbnZlcnRlcntcclxuXHRnZXQgdGFnKCl7cmV0dXJuICdodG1sJ31cclxuXHJcblx0Y29udmVydCgpe1xyXG5cdFx0dGhpcy5kb2M9dGhpcy5jb25zdHJ1Y3Rvci5jcmVhdGUodGhpcy5vcHRpb25zKVxyXG5cdFx0dGhpcy5jb250ZW50PXRoaXMuZG9jXHJcblx0XHRsZXQgY29udGVudFN0eWxlPXRoaXMuY29udGVudC5zdHlsZVxyXG5cdFx0Y29udGVudFN0eWxlLmJhY2tncm91bmRDb2xvcj0ndHJhbnNwYXJlbnQnXHJcblx0XHRjb250ZW50U3R5bGUubWluSGVpZ2h0PScxMDAwcHgnXHJcblx0XHRjb250ZW50U3R5bGUud2lkdGg9JzEwMCUnXHJcblx0XHRjb250ZW50U3R5bGUucGFkZGluZ1RvcD0nMjBweCdcclxuXHRcdGNvbnRlbnRTdHlsZS5vdmVyZmxvdz0nYXV0bydcclxuXHJcblx0XHR2YXIgc3R5bGU9dGhpcy5kb2MuY3JlYXRlU3R5bGUoJyonKVxyXG5cdFx0c3R5bGUubWFyZ2luPScwJ1xyXG5cdFx0c3R5bGUuYm9yZGVyPScwJ1xyXG5cdFx0c3R5bGUucGFkZGluZz0nMCdcclxuXHRcdHN0eWxlLmJveFNpemluZz0nYm9yZGVyLWJveCdcclxuXHJcblx0XHRzdHlsZT10aGlzLmRvYy5jcmVhdGVTdHlsZSgndGFibGUnKVxyXG5cdFx0c3R5bGUud2lkdGg9JzEwMCUnXHJcblx0XHRzdHlsZS5ib3JkZXJDb2xsYXBzZT0nY29sbGFwc2UnXHJcblx0XHRzdHlsZS53b3JkQnJlYWs9J2JyZWFrLXdvcmQnXHJcblxyXG5cdFx0c3R5bGU9dGhpcy5kb2MuY3JlYXRlU3R5bGUoJ3NlY3Rpb24nKVxyXG5cdFx0c3R5bGUubWFyZ2luPSdhdXRvJ1xyXG5cdFx0c3R5bGUuYmFja2dyb3VuZENvbG9yPSd3aGl0ZSdcclxuXHRcdHN0eWxlLmNvbG9yPSdibGFjaydcclxuXHRcdHN0eWxlLnBvc2l0aW9uPSdyZWxhdGl2ZSdcclxuXHRcdHN0eWxlLnpJbmRleD0wXHJcblxyXG5cdFx0c3R5bGU9dGhpcy5kb2MuY3JlYXRlU3R5bGUoJ3A6ZW1wdHk6YmVmb3JlJylcclxuXHRcdHN0eWxlLmNvbnRlbnQ9J1wiXCInXHJcblx0XHRzdHlsZS5kaXNwbGF5PSdpbmxpbmUtYmxvY2snXHJcblxyXG5cdFx0c3R5bGU9dGhpcy5kb2MuY3JlYXRlU3R5bGUoJ3VsJylcclxuXHRcdHN0eWxlLmxpc3RTdHlsZT1cIm5vbmVcIlxyXG5cclxuXHRcdHN0eWxlPXRoaXMuZG9jLmNyZWF0ZVN0eWxlKCd1bD5saT5wJylcclxuXHRcdHN0eWxlLnBvc2l0aW9uPSdyZWxhdGl2ZSdcclxuXHJcblx0XHRzdHlsZT10aGlzLmRvYy5jcmVhdGVTdHlsZSgndWwgLm1hcmtlcicpXHJcblx0XHRzdHlsZS5wb3NpdGlvbj0nYWJzb2x1dGUnXHJcblxyXG5cdFx0c3R5bGU9dGhpcy5kb2MuY3JlYXRlU3R5bGUoJ2EnKVxyXG5cdFx0c3R5bGUudGV4dERlY29yYXRpb249J25vbmUnXHJcblxyXG5cdFx0c3R5bGU9dGhpcy5kb2MuY3JlYXRlU3R5bGUoJy51bnN1cHBvcnRlZCcpXHJcblx0XHRzdHlsZS5vdXRsaW5lPVwiMnB4IHJlZCBzb2xpZFwiXHJcblxyXG5cdFx0c3R5bGU9dGhpcy5kb2MuY3JlYXRlU3R5bGUoJy53YXJuaW5nJylcclxuXHRcdHN0eWxlLm91dGxpbmU9XCIxcHggeWVsbG93IHNvbGlkXCJcclxuXHRcdHRoaXMuY29udmVydFN0eWxlKClcclxuXHR9XHJcblx0XHJcblx0Y29udmVydFN0eWxlKCl7XHJcblx0XHR2YXIgYmdTdHlsZT10aGlzLndvcmRNb2RlbC5nZXRCYWNrZ3JvdW5kU3R5bGUoKVxyXG5cdFx0aWYoIWJnU3R5bGUpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0XHJcblx0XHR2YXIgc3R5bGU9dGhpcy5kb2MuY3JlYXRlU3R5bGUoJ3NlY3Rpb24nKVxyXG5cdFx0c3dpdGNoKHR5cGVvZiBiZ1N0eWxlKXtcclxuXHRcdGNhc2UgJ29iamVjdCc6Ly8gZmlsbFxyXG5cdFx0XHRjb25zb2xlLndhcm4oJ25vdCBzdXBwb3J0IGZpbGwgY29sb3Igb24gZG9jdW1lbnQgYmFja2dyb3VuZCB5ZXQnKVxyXG5cdFx0YnJlYWtcclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRcdHN0eWxlLmJhY2tncm91bmRDb2xvcj1iZ1N0eWxlXHJcblx0XHRicmVha1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvKipcclxuXHQqIG9wdDoge1xyXG5cdCogXHR0ZW1wbGF0ZTogZnVuY3Rpb24oc3R5bGUsIGh0bWwsIHByb3BzKXsgcmV0dXJuIChodG1sKX0sXHJcblx0XHRleHRlbmRTY3JpcHQ6IFwiaHR0cDovL2EuY29tL2EuanNcIlxyXG5cdFx0fVxyXG5cdCovXHJcblx0dG9TdHJpbmcob3B0KXtcclxuXHRcdHJldHVybiB0aGlzLmRvYy50b1N0cmluZyhvcHQsdGhpcy5wcm9wcylcclxuXHR9XHJcblx0cmVsZWFzZSgpe1xyXG5cdFx0dGhpcy5kb2MucmVsZWFzZSgpXHJcblx0fVxyXG5cdGFzWmlwKG9wdCl7XHJcblx0XHRyZXR1cm4gdGhpcy5kb2MuYXNaaXAob3B0LHRoaXMucHJvcHMpXHJcblx0fVxyXG5cdGRvd25sb2FkKG9wdCl7XHJcblx0XHRyZXR1cm4gdGhpcy5kb2MuZG93bmxvYWQob3B0LCB0aGlzLnByb3BzKVxyXG5cdH1cclxuXHQvKipcclxuXHQqIG9wdD1leHRlbmQodG9TdHJpbmcub3B0LHtcclxuXHRcdHNhdmVJbWFnZTogZnVuY3Rpb24oYXJyYXlCdWZmZXIsIGRvYy5wcm9wcyk6IHByb21pc2UodXJsKSB7fSxcclxuXHRcdHNhdmVIdG1sOiBmdW5jdGlvbigpe31cclxuXHR9KVxyXG5cdCovXHJcblx0c2F2ZSAob3B0KXtcclxuXHRcdHJldHVybiB0aGlzLmRvYy5zYXZlKG9wdCwgdGhpcy5wcm9wcylcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBjcmVhdGUob3B0KXtcclxuXHRcdHZhciBzZWxmQ29udmVydGVyPXRoaXNcclxuXHRcdHJldHVybiAoZnVuY3Rpb24oZG9jdW1lbnQpe1xyXG5cdFx0XHR2YXIgZG9jPShmdW5jdGlvbiBicm93c2VyRG9jKCl7XHJcblx0XHRcdFx0dmFyIHVpZD0wO1xyXG5cdFx0XHRcdHZhciByb290PU9iamVjdC5hc3NpZ24oZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jykse1xyXG5cdFx0XHRcdFx0aWQgOiBcIkFcIixcclxuXHRcdFx0XHRcdHNlY3Rpb246IG51bGwsXHJcblx0XHRcdFx0XHRjcmVhdGVFbGVtZW50OiBkb2N1bWVudC5jcmVhdGVFbGVtZW50LmJpbmQoZG9jdW1lbnQpLFxyXG5cdFx0XHRcdFx0Y3JlYXRlVGV4dE5vZGU6IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlLmJpbmQoZG9jdW1lbnQpLFxyXG5cdFx0XHRcdFx0Y3JlYXRlU3R5bGVTaGVldCgpe1xyXG5cdFx0XHRcdFx0XHRpZih0aGlzLnN0eWxlc2hlZXQpXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuc3R5bGVzaGVldDtcclxuXHRcdFx0XHRcdFx0dmFyIGVsU3R5bGU9dGhpcy5jcmVhdGVFbGVtZW50KCdzdHlsZScpXHJcblx0XHRcdFx0XHRcdHRoaXMuYm9keS5hcHBlbmRDaGlsZChlbFN0eWxlLG51bGwpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5zdHlsZXNoZWV0PWVsU3R5bGUuc2hlZXRcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRnZXRTdHlsZVRleHQoKXtcclxuXHRcdFx0XHRcdFx0dmFyIHN0eWxlcz1bXVxyXG5cdFx0XHRcdFx0XHRmb3IodmFyIGk9MCwgcnVsZXM9dGhpcy5zdHlsZXNoZWV0LmNzc1J1bGVzLCBsZW49cnVsZXMubGVuZ3RoO2k8bGVuO2krKylcclxuXHRcdFx0XHRcdFx0XHRzdHlsZXMucHVzaChydWxlc1tpXS5jc3NUZXh0KVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gc3R5bGVzLmpvaW4oJ1xcclxcbicpXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0dWlkKCl7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLmlkKyh1aWQrKylcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHR0b1N0cmluZyhvcHQsIHByb3BzPXNlbGZDb252ZXJ0ZXIucHJvcHMpe1xyXG5cdFx0XHRcdFx0XHRpZihvcHQgJiYgdHlwZW9mIG9wdC50ZW1wbGF0ZSE9XCJ1bmRlZmluZWRcIiAmJiAkLmlzRnVuY3Rpb24ob3B0LnRlbXBsYXRlKSlcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gb3B0LnRlbXBsYXRlKHRoaXMuZ2V0U3R5bGVUZXh0KCksIHRoaXMuX2h0bWwoKSwgcHJvcHMpXHJcblx0XHRcdFx0XHRcdHZhciBodG1sPVsnPCFkb2N0eXBlIGh0bWw+XFxyXFxuPGh0bWw+PGhlYWQ+PG1ldGEgY2hhcnNldD11dGYtOD48bWV0YSBrZXk9XCJnZW5lcmF0b3JcIiB2YWx1ZT1cImRvY3gyaHRtbFwiPjx0aXRsZT4nKyhwcm9wcy5uYW1lfHwnJykrJzwvdGl0bGU+PHN0eWxlPiddXHJcblx0XHRcdFx0XHRcdGh0bWwucHVzaCh0aGlzLmdldFN0eWxlVGV4dCgpKVxyXG5cdFx0XHRcdFx0XHRodG1sLnB1c2goJzwvc3R5bGU+PC9oZWFkPjxib2R5PicpXHJcblx0XHRcdFx0XHRcdGh0bWwucHVzaCh0aGlzLl9odG1sKCkpXHJcblx0XHRcdFx0XHRcdG9wdCAmJiBvcHQuZXh0ZW5kU2NyaXB0ICYmIGh0bWwucHVzaCgnPHNjcmlwdCBzcmM9XCInK29wdC5leHRlbmRTY3JpcHQrJ1wiPjwvc2NyaXB0PicpXHJcblx0XHRcdFx0XHRcdGh0bWwucHVzaCgnPC9ib2R5PjxodG1sPicpXHJcblx0XHRcdFx0XHRcdHJldHVybiBodG1sLmpvaW4oJ1xcclxcbicpXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0X2h0bWwoKXtcclxuXHRcdFx0XHRcdFx0dmFyIGRpdnM9dGhpcy5xdWVyeVNlbGVjdG9yQWxsKCdwPmRpdiwgc3Bhbj5kaXYnKVxyXG5cdFx0XHRcdFx0XHRpZihkaXZzLmxlbmd0aD09MClcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5vdXRlckhUTUxcclxuXHJcblx0XHRcdFx0XHRcdC8qKlxyXG5cdFx0XHRcdFx0XHQqIGlsbGVnYWwgPHA+IDxkaXYvPiA8L3A+XHJcblx0XHRcdFx0XHRcdCogRE9NIG9wZXJhdGlvbiBkaXJlY3RseSBpbiBvbmxvYWRcclxuXHRcdFx0XHRcdFx0Ki9cclxuXHRcdFx0XHRcdFx0dmFyIGRpdmNvbnRhaW5lcj1kb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksIHVpZD0wXHJcblx0XHRcdFx0XHRcdGRpdmNvbnRhaW5lci5pZD0nZGl2Y29udGFpbmVyJ1xyXG5cdFx0XHRcdFx0XHRkaXZjb250YWluZXIuc3R5bGUuZGlzcGxheT1cIm5vbmVcIlxyXG5cdFx0XHRcdFx0XHR0aGlzLmFwcGVuZENoaWxkKGRpdmNvbnRhaW5lcilcclxuXHRcdFx0XHRcdFx0Zm9yKHZhciBpPWRpdnMubGVuZ3RoLTE7aT4tMTtpLS0pe1xyXG5cdFx0XHRcdFx0XHRcdHZhciBkaXY9ZGl2c1tpXSxcclxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudD1kaXYucGFyZW50Tm9kZTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYoIWRpdi5pZClcclxuXHRcdFx0XHRcdFx0XHRcdGRpdi5pZD0nX3onKygrK3VpZClcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYoIXBhcmVudC5pZClcclxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudC5pZD0nX3knK3VpZFxyXG5cclxuXHRcdFx0XHRcdFx0XHRkaXYuc2V0QXR0cmlidXRlKCdkYXRhLXBhcmVudCcscGFyZW50LmlkKVxyXG5cdFx0XHRcdFx0XHRcdGRpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLGluZGV4T2YoZGl2LHBhcmVudC5jaGlsZE5vZGVzKSlcclxuXHJcblx0XHRcdFx0XHRcdFx0ZGl2Y29udGFpbmVyLmFwcGVuZENoaWxkKGRpdnNbaV0pXHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdHZhciBodG1sPXRoaXMub3V0ZXJIVE1MKydcXG5cXHI8c2NyaXB0PignK3RoaXMuX3RyYW5zZm9ybWVyLnRvU3RyaW5nKCkrJykoKTs8L3NjcmlwdD4nXHJcblx0XHRcdFx0XHRcdHRoaXMuX3RyYW5zZm9ybWVyKCk7XHJcblx0XHRcdFx0XHRcdHJldHVybiBodG1sXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0X3RyYW5zZm9ybWVyKCl7XHJcblx0XHRcdFx0XHRcdHZhciBhPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkaXZjb250YWluZXInKVxyXG5cdFx0XHRcdFx0XHRmb3IodmFyIGRpdnM9YS5jaGlsZE5vZGVzLCBpPWRpdnMubGVuZ3RoLTE7aT4tMTtpLS0pe1xyXG5cdFx0XHRcdFx0XHRcdHZhciBkaXY9ZGl2c1tpXSxcclxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudElkPWRpdi5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGFyZW50JyksXHJcblx0XHRcdFx0XHRcdFx0XHRpbmRleD1wYXJzZUludChkaXYuZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JykpLFxyXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50PWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnK3BhcmVudElkKTtcclxuXHRcdFx0XHRcdFx0XHRwYXJlbnQuaW5zZXJ0QmVmb3JlKGRpdixwYXJlbnQuY2hpbGROb2Rlc1tpbmRleF0pXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGEpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdGZ1bmN0aW9uIGluZGV4T2YoZWwsIGVscyl7XHJcblx0XHRcdFx0XHRmb3IodmFyIGk9ZWxzLmxlbmd0aC0xO2k+MDtpLS0pXHJcblx0XHRcdFx0XHRcdGlmKGVsPT1lbHNbaV0pXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGlcclxuXHRcdFx0XHRcdHJldHVybiAwXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQob3B0ICYmIG9wdC5jb250YWluZXIgfHwgZG9jdW1lbnQuYm9keSkuYXBwZW5kQ2hpbGQocm9vdCk7XHJcblx0XHRcdFx0cm9vdC5ib2R5PXJvb3RcclxuXHRcdFx0XHRyZXR1cm4gcm9vdFxyXG5cdFx0XHR9KSgpO1xyXG5cclxuXHRcdFx0cmV0dXJuIChmdW5jdGlvbiBtaXhpbihkb2Mpe1xyXG5cdFx0XHRcdHZhciBzdHlsZXNoZWV0PWRvYy5jcmVhdGVTdHlsZVNoZWV0KClcclxuXHRcdFx0XHR2YXIgcmVsU3R5bGVzPXt9LCBzdHlsZXM9e31cclxuXHJcblx0XHRcdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oc2VsZkNvbnZlcnRlclskLmlzTm9kZSA/ICdub2RlZnknIDogJ2Jyb3dzZXJpZnknXShkb2Msc3R5bGVzaGVldCwgb3B0KSx7XHJcblx0XHRcdFx0XHRjcmVhdGVTdHlsZShzZWxlY3Rvcil7XHJcblx0XHRcdFx0XHRcdGlmKHN0eWxlc1tzZWxlY3Rvcl0pXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHN0eWxlc1tzZWxlY3Rvcl1cclxuXHRcdFx0XHRcdFx0dmFyIHJ1bGVzPXN0eWxlc2hlZXQuY3NzUnVsZXMsbGVuPXJ1bGVzLmxlbmd0aFxyXG5cdFx0XHRcdFx0XHRzdHlsZXNoZWV0Lmluc2VydFJ1bGUoc2VsZWN0b3Iuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24oYSl7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gYS50cmltKClbMF09PScjJyA/IGEgOiAnIycrdGhpcy5pZCsnICcrYVxyXG5cdFx0XHRcdFx0XHRcdH0uYmluZCh0aGlzKSkuam9pbignLCcpKyd7fScsbGVuKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gIHN0eWxlc1tzZWxlY3Rvcl09c3R5bGVzaGVldC5jc3NSdWxlc1tsZW5dLnN0eWxlXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0c3R5bGVQYXRoKGEsIHBhcmVudCl7XHJcblx0XHRcdFx0XHRcdGlmKHBhcmVudClcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVsU3R5bGVzW2FdPXBhcmVudFxyXG5cdFx0XHRcdFx0XHR2YXIgcGF0aHM9W2FdLHBhcmVudD1hXHJcblx0XHRcdFx0XHRcdHdoaWxlKHBhcmVudD1yZWxTdHlsZXNbcGFyZW50XSlcclxuXHRcdFx0XHRcdFx0XHRwYXRocy51bnNoaWZ0KHBhcmVudClcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHBhdGhzLmpvaW4oJyAnKVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdHJlbGVhc2UoKXtcclxuXHRcdFx0XHRcdFx0ZGVsZXRlIHRoaXMuc2VjdGlvblxyXG5cdFx0XHRcdFx0XHR0aGlzLl9yZWxlYXNlKClcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KShkb2MpXHJcblx0XHR9KSgkLmlzTm9kZSA/IGNyZWF0ZURvY3VtZW50KCkgOiBkb2N1bWVudClcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBub2RlZnkoZG9jLCBzdHlsZXNoZWV0LCBvcHQpe1xyXG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oZG9jLHtcclxuXHRcdFx0X3JlbGVhc2UoKXtcclxuXHJcblx0XHRcdH0sXHJcblx0XHRcdGFzSW1hZ2VVUkwoYnVmZmVyKXtcclxuXHRcdFx0XHRpZihvcHQgJiYgdHlwZW9mKG9wdC5hc0ltYWdlVVJMKSE9J3VuZGVmaW5lZCcpXHJcblx0XHRcdFx0XHRyZXR1cm4gb3B0LmFzSW1hZ2VVUkwoYnVmZmVyKVxyXG5cdFx0XHRcdHJldHVybiBcImltYWdlOi8vbm90c3VwcG9ydFwiXHJcblx0XHRcdH0sXHJcblx0XHRcdGFzWmlwKCl7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdub3Qgc3VwcG9ydCcpXHJcblx0XHRcdH0sXHJcblx0XHRcdGRvd25sb2FkKCl7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdub3Qgc3VwcG9ydCcpXHJcblx0XHRcdH0sXHJcblx0XHRcdHNhdmUoKXtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ25vdCBzdXBwb3J0JylcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBicm93c2VyaWZ5KGRvYywgc3R5bGVzaGVldCwgb3B0KXtcclxuXHRcdHZhciBQcm90b19CbG9iPShmdW5jdGlvbihhKXtcclxuXHRcdFx0XHRhPVVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoKSkuc3BsaXQoJy8nKTtcclxuXHRcdFx0XHRhLnBvcCgpO1xyXG5cdFx0XHRcdHJldHVybiBhLmpvaW4oJy8nKVxyXG5cdFx0XHR9KSgpLFxyXG5cdFx0XHRSZWdfUHJvdG9fQmxvYj1uZXcgUmVnRXhwKFByb3RvX0Jsb2IrXCIvKFtcXFxcd1xcXFxkLV0rKVwiLFwiZ2lcIik7XHJcblxyXG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oZG9jLHtcclxuXHRcdFx0YXNaaXAob3B0LCBwcm9wcyl7XHJcblx0XHRcdFx0dmFyIHppcD1uZXcgSlNaaXAoKSxoYXNJbWFnZT1mYWxzZTtcclxuXHRcdFx0XHR2YXIgZj16aXAuZm9sZGVyKCdpbWFnZXMnKVxyXG5cdFx0XHRcdE9iamVjdC5rZXlzKHRoaXMuaW1hZ2VzKS5mb3JFYWNoKGZ1bmN0aW9uKGEpe1xyXG5cdFx0XHRcdFx0aGFzSW1hZ2U9dHJ1ZVxyXG5cdFx0XHRcdFx0Zi5maWxlKGEuc3BsaXQoJy8nKS5wb3AoKSx0aGlzW2FdKVxyXG5cdFx0XHRcdH0sdGhpcy5pbWFnZXMpXHJcblx0XHRcdFx0emlwLmZpbGUoJ3Byb3BzLmpzb24nLEpTT04uc3RyaW5naWZ5KHByb3BzKSk7XHJcblx0XHRcdFx0emlwLmZpbGUoJ21haW4uaHRtbCcsaGFzSW1hZ2UgPyB0aGlzLnRvU3RyaW5nKG9wdCkucmVwbGFjZShQcm90b19CbG9iLCdpbWFnZXMnKSA6IHRoaXMudG9TdHJpbmcoKSlcclxuXHRcdFx0XHRyZXR1cm4gemlwXHJcblx0XHRcdH0sXHJcblx0XHRcdGRvd25sb2FkKG9wdCwgcHJvcHMpe1xyXG5cdFx0XHRcdHZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpXHJcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKVxyXG5cdFx0XHRcdGEuaHJlZj1VUkwuY3JlYXRlT2JqZWN0VVJMKHRoaXMuYXNaaXAob3B0LHByb3BzKS5nZW5lcmF0ZSh7dHlwZTonYmxvYid9KSlcclxuXHRcdFx0XHRhLmRvd25sb2FkPShwcm9wcy5uYW1lfHxcImRvY3VtZW50XCIpKycuemlwJ1xyXG5cdFx0XHRcdGEuY2xpY2soKVxyXG5cdFx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwoYS5ocmVmKVxyXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYSlcclxuXHRcdFx0fSxcclxuXHRcdFx0c2F2ZShvcHQsIHByb3BzKXtcclxuXHRcdFx0XHR2YXIgaGFzSW1hZ2U9ZmFsc2UsIGltYWdlcz17fSwgbWU9dGhpcztcclxuXHRcdFx0XHRyZXR1cm4gJC5EZWZlcnJlZC53aGVuKCh0aGlzLmltYWdlcyAmJiBPYmplY3Qua2V5cyh0aGlzLmltYWdlcyl8fFtdKS5tYXAoZnVuY3Rpb24oYSl7XHJcblx0XHRcdFx0XHRoYXNJbWFnZT10cnVlXHJcblx0XHRcdFx0XHRyZXR1cm4gb3B0LnNhdmVJbWFnZSh0aGlzW2FdLHByb3BzKVxyXG5cdFx0XHRcdFx0XHQudGhlbihmdW5jdGlvbih1cmwpe3JldHVybiBpbWFnZXNbYV09dXJsfSlcclxuXHRcdFx0XHR9LHRoaXMuaW1hZ2VzKSlcclxuXHRcdFx0XHQudGhlbihmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0dmFyIGh0bWw9bWUudG9TdHJpbmcob3B0LCBwcm9wcyk7XHJcblx0XHRcdFx0XHRpZihoYXNJbWFnZSlcclxuXHRcdFx0XHRcdFx0aHRtbD1odG1sLnJlcGxhY2UoUmVnX1Byb3RvX0Jsb2IsZnVuY3Rpb24oYSxpZCl7cmV0dXJuIGltYWdlc1thXX0pO1xyXG5cdFx0XHRcdFx0cmV0dXJuIG9wdC5zYXZlSHRtbChodG1sLCBwcm9wcylcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRpbWFnZXM6e30sXHJcblx0XHRcdGFzSW1hZ2VVUkwoYXJyYXlCdWZmZXIpe1xyXG5cdFx0XHRcdHZhciB1cmw9VVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbYXJyYXlCdWZmZXJdLFxyXG5cdFx0XHRcdFx0e3R5cGU6XCJpbWFnZS9cIisodHlwZW9mKGFycmF5QnVmZmVyKT09J3N0cmluZycgPyAnc3ZnK3htbCcgOiAnKicpfSkpO1xyXG5cdFx0XHRcdHRoaXMuaW1hZ2VzW3VybF09YXJyYXlCdWZmZXJcclxuXHRcdFx0XHRyZXR1cm4gdXJsXHJcblx0XHRcdH0sXHJcblx0XHRcdF9yZWxlYXNlKCl7XHJcblx0XHRcdFx0T2JqZWN0LmtleXModGhpcy5pbWFnZXMpLmZvckVhY2goZnVuY3Rpb24oYil7XHJcblx0XHRcdFx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKGIpXHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHRkZWxldGUgdGhpcy5pbWFnZXNcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcbn1cclxuXHJcbihmdW5jdGlvbihpc05vZGUsIG0pe1xyXG5cdGlmKCFpc05vZGUpXHRyZXR1cm47XHJcblxyXG5cdGNyZWF0ZURvY3VtZW50PXJlcXVpcmUobSkuanNkb21cclxuXHRsZXQgd2luZG93PWNyZWF0ZURvY3VtZW50KCkuZGVmYXVsdFZpZXdcclxuXHJcblx0Z2xvYmFsLmJ0b2E9d2luZG93LmJ0b2FcclxuXHRDU1NTdHlsZURlY2xhcmF0aW9uPXdpbmRvdy5DU1NTdHlsZURlY2xhcmF0aW9uXHJcbn0pKCQuaXNOb2RlLCBcImpzZG9tXCIpXHJcbiJdfQ==