(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

function init () {
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
}

init()

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
'use strict';
// For more information about browser field, check out the browser field at https://github.com/substack/browserify-handbook#browser-field.

module.exports = {
    // Create a <link> tag with optional data attributes
    createLink: function(href, attributes) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var link = document.createElement('link');

        link.href = href;
        link.rel = 'stylesheet';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            link.setAttribute('data-' + key, value);
        }

        head.appendChild(link);
    },
    // Create a <style> tag with optional data attributes
    createStyle: function(cssText, attributes) {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            style.setAttribute('data-' + key, value);
        }
        
        if (style.sheet) { // for jsdom and IE9+
            style.innerHTML = cssText;
            style.sheet.cssText = cssText;
            head.appendChild(style);
        } else if (style.styleSheet) { // for IE8 and below
            head.appendChild(style);
            style.styleSheet.cssText = cssText;
        } else { // for Chrome, Firefox, and Safari
            style.appendChild(document.createTextNode(cssText));
            head.appendChild(style);
        }
    }
};

},{}],4:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],5:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    this.length = 0
    this.parent = undefined
  }

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(array)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
} else {
  // pre-set for values that may exist in the future
  Buffer.prototype.length = undefined
  Buffer.prototype.parent = undefined
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"base64-js":1,"ieee754":29,"isarray":6}],6:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],7:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})

},{"../../is-buffer/index.js":31}],8:[function(require,module,exports){
(function (global){
/*!
 * deep-diff.
 * Licensed under the MIT License.
 */
;(function(root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.DeepDiff = factory();
  }
}(this, function(undefined) {
  'use strict';

  var $scope, conflict, conflictResolution = [];
  if (typeof global === 'object' && global) {
    $scope = global;
  } else if (typeof window !== 'undefined') {
    $scope = window;
  } else {
    $scope = {};
  }
  conflict = $scope.DeepDiff;
  if (conflict) {
    conflictResolution.push(
      function() {
        if ('undefined' !== typeof conflict && $scope.DeepDiff === accumulateDiff) {
          $scope.DeepDiff = conflict;
          conflict = undefined;
        }
      });
  }

  // nodejs compatible on server side and in the browser.
  function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  }

  function Diff(kind, path) {
    Object.defineProperty(this, 'kind', {
      value: kind,
      enumerable: true
    });
    if (path && path.length) {
      Object.defineProperty(this, 'path', {
        value: path,
        enumerable: true
      });
    }
  }

  function DiffEdit(path, origin, value) {
    DiffEdit.super_.call(this, 'E', path);
    Object.defineProperty(this, 'lhs', {
      value: origin,
      enumerable: true
    });
    Object.defineProperty(this, 'rhs', {
      value: value,
      enumerable: true
    });
  }
  inherits(DiffEdit, Diff);

  function DiffNew(path, value) {
    DiffNew.super_.call(this, 'N', path);
    Object.defineProperty(this, 'rhs', {
      value: value,
      enumerable: true
    });
  }
  inherits(DiffNew, Diff);

  function DiffDeleted(path, value) {
    DiffDeleted.super_.call(this, 'D', path);
    Object.defineProperty(this, 'lhs', {
      value: value,
      enumerable: true
    });
  }
  inherits(DiffDeleted, Diff);

  function DiffArray(path, index, item) {
    DiffArray.super_.call(this, 'A', path);
    Object.defineProperty(this, 'index', {
      value: index,
      enumerable: true
    });
    Object.defineProperty(this, 'item', {
      value: item,
      enumerable: true
    });
  }
  inherits(DiffArray, Diff);

  function arrayRemove(arr, from, to) {
    var rest = arr.slice((to || from) + 1 || arr.length);
    arr.length = from < 0 ? arr.length + from : from;
    arr.push.apply(arr, rest);
    return arr;
  }

  function realTypeOf(subject) {
    var type = typeof subject;
    if (type !== 'object') {
      return type;
    }

    if (subject === Math) {
      return 'math';
    } else if (subject === null) {
      return 'null';
    } else if (Array.isArray(subject)) {
      return 'array';
    } else if (subject instanceof Date) {
      return 'date';
    } else if (/^\/.*\//.test(subject.toString())) {
      return 'regexp';
    }
    return 'object';
  }

  function deepDiff(lhs, rhs, changes, prefilter, path, key, stack) {
    path = path || [];
    var currentPath = path.slice(0);
    if (typeof key !== 'undefined') {
      if (prefilter && prefilter(currentPath, key, { lhs: lhs, rhs: rhs })) {
        return;
      }
      currentPath.push(key);
    }
    var ltype = typeof lhs;
    var rtype = typeof rhs;
    if (ltype === 'undefined') {
      if (rtype !== 'undefined') {
        changes(new DiffNew(currentPath, rhs));
      }
    } else if (rtype === 'undefined') {
      changes(new DiffDeleted(currentPath, lhs));
    } else if (realTypeOf(lhs) !== realTypeOf(rhs)) {
      changes(new DiffEdit(currentPath, lhs, rhs));
    } else if (lhs instanceof Date && rhs instanceof Date && ((lhs - rhs) !== 0)) {
      changes(new DiffEdit(currentPath, lhs, rhs));
    } else if (ltype === 'object' && lhs !== null && rhs !== null) {
      stack = stack || [];
      if (stack.indexOf(lhs) < 0) {
        stack.push(lhs);
        if (Array.isArray(lhs)) {
          var i, len = lhs.length;
          for (i = 0; i < lhs.length; i++) {
            if (i >= rhs.length) {
              changes(new DiffArray(currentPath, i, new DiffDeleted(undefined, lhs[i])));
            } else {
              deepDiff(lhs[i], rhs[i], changes, prefilter, currentPath, i, stack);
            }
          }
          while (i < rhs.length) {
            changes(new DiffArray(currentPath, i, new DiffNew(undefined, rhs[i++])));
          }
        } else {
          var akeys = Object.keys(lhs);
          var pkeys = Object.keys(rhs);
          akeys.forEach(function(k, i) {
            var other = pkeys.indexOf(k);
            if (other >= 0) {
              deepDiff(lhs[k], rhs[k], changes, prefilter, currentPath, k, stack);
              pkeys = arrayRemove(pkeys, other);
            } else {
              deepDiff(lhs[k], undefined, changes, prefilter, currentPath, k, stack);
            }
          });
          pkeys.forEach(function(k) {
            deepDiff(undefined, rhs[k], changes, prefilter, currentPath, k, stack);
          });
        }
        stack.length = stack.length - 1;
      }
    } else if (lhs !== rhs) {
      if (!(ltype === 'number' && isNaN(lhs) && isNaN(rhs))) {
        changes(new DiffEdit(currentPath, lhs, rhs));
      }
    }
  }

  function accumulateDiff(lhs, rhs, prefilter, accum) {
    accum = accum || [];
    deepDiff(lhs, rhs,
      function(diff) {
        if (diff) {
          accum.push(diff);
        }
      },
      prefilter);
    return (accum.length) ? accum : undefined;
  }

  function applyArrayChange(arr, index, change) {
    if (change.path && change.path.length) {
      var it = arr[index],
        i, u = change.path.length - 1;
      for (i = 0; i < u; i++) {
        it = it[change.path[i]];
      }
      switch (change.kind) {
        case 'A':
          applyArrayChange(it[change.path[i]], change.index, change.item);
          break;
        case 'D':
          delete it[change.path[i]];
          break;
        case 'E':
        case 'N':
          it[change.path[i]] = change.rhs;
          break;
      }
    } else {
      switch (change.kind) {
        case 'A':
          applyArrayChange(arr[index], change.index, change.item);
          break;
        case 'D':
          arr = arrayRemove(arr, index);
          break;
        case 'E':
        case 'N':
          arr[index] = change.rhs;
          break;
      }
    }
    return arr;
  }

  function applyChange(target, source, change) {
    if (target && source && change && change.kind) {
      var it = target,
        i = -1,
        last = change.path ? change.path.length - 1 : 0;
      while (++i < last) {
        if (typeof it[change.path[i]] === 'undefined') {
          it[change.path[i]] = (typeof change.path[i] === 'number') ? [] : {};
        }
        it = it[change.path[i]];
      }
      switch (change.kind) {
        case 'A':
          applyArrayChange(change.path ? it[change.path[i]] : it, change.index, change.item);
          break;
        case 'D':
          delete it[change.path[i]];
          break;
        case 'E':
        case 'N':
          it[change.path[i]] = change.rhs;
          break;
      }
    }
  }

  function revertArrayChange(arr, index, change) {
    if (change.path && change.path.length) {
      // the structure of the object at the index has changed...
      var it = arr[index],
        i, u = change.path.length - 1;
      for (i = 0; i < u; i++) {
        it = it[change.path[i]];
      }
      switch (change.kind) {
        case 'A':
          revertArrayChange(it[change.path[i]], change.index, change.item);
          break;
        case 'D':
          it[change.path[i]] = change.lhs;
          break;
        case 'E':
          it[change.path[i]] = change.lhs;
          break;
        case 'N':
          delete it[change.path[i]];
          break;
      }
    } else {
      // the array item is different...
      switch (change.kind) {
        case 'A':
          revertArrayChange(arr[index], change.index, change.item);
          break;
        case 'D':
          arr[index] = change.lhs;
          break;
        case 'E':
          arr[index] = change.lhs;
          break;
        case 'N':
          arr = arrayRemove(arr, index);
          break;
      }
    }
    return arr;
  }

  function revertChange(target, source, change) {
    if (target && source && change && change.kind) {
      var it = target,
        i, u;
      u = change.path.length - 1;
      for (i = 0; i < u; i++) {
        if (typeof it[change.path[i]] === 'undefined') {
          it[change.path[i]] = {};
        }
        it = it[change.path[i]];
      }
      switch (change.kind) {
        case 'A':
          // Array was modified...
          // it will be an array...
          revertArrayChange(it[change.path[i]], change.index, change.item);
          break;
        case 'D':
          // Item was deleted...
          it[change.path[i]] = change.lhs;
          break;
        case 'E':
          // Item was edited...
          it[change.path[i]] = change.lhs;
          break;
        case 'N':
          // Item is new...
          delete it[change.path[i]];
          break;
      }
    }
  }

  function applyDiff(target, source, filter) {
    if (target && source) {
      var onChange = function(change) {
        if (!filter || filter(target, source, change)) {
          applyChange(target, source, change);
        }
      };
      deepDiff(target, source, onChange);
    }
  }

  Object.defineProperties(accumulateDiff, {

    diff: {
      value: accumulateDiff,
      enumerable: true
    },
    observableDiff: {
      value: deepDiff,
      enumerable: true
    },
    applyDiff: {
      value: applyDiff,
      enumerable: true
    },
    applyChange: {
      value: applyChange,
      enumerable: true
    },
    revertChange: {
      value: revertChange,
      enumerable: true
    },
    isConflict: {
      value: function() {
        return 'undefined' !== typeof conflict;
      },
      enumerable: true
    },
    noConflict: {
      value: function() {
        if (conflictResolution) {
          conflictResolution.forEach(function(it) {
            it();
          });
          conflictResolution = null;
        }
        return accumulateDiff;
      },
      enumerable: true
    }
  });

  return accumulateDiff;
}));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],9:[function(require,module,exports){
var pSlice = Array.prototype.slice;
var objectKeys = require('./lib/keys.js');
var isArguments = require('./lib/is_arguments.js');

var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
    return opts.strict ? actual === expected : actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, opts);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer (x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b, opts);
  }
  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b);
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return typeof a === typeof b;
}

},{"./lib/is_arguments.js":10,"./lib/keys.js":11}],10:[function(require,module,exports){
var supportsArgumentsClass = (function(){
  return Object.prototype.toString.call(arguments)
})() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
};

exports.unsupported = unsupported;
function unsupported(object){
  return object &&
    typeof object == 'object' &&
    typeof object.length == 'number' &&
    Object.prototype.hasOwnProperty.call(object, 'callee') &&
    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
    false;
};

},{}],11:[function(require,module,exports){
exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}

},{}],12:[function(require,module,exports){
module.exports = require('./lib');

},{"./lib":14}],13:[function(require,module,exports){
(function (Buffer){
'use strict';

exports.__esModule = true;

var _polyfill = require('./polyfill');

var toString = Object.prototype.toString;

function copy(target, customizer) {
  var resultValue = copyValue(target);

  if (resultValue !== null) {
    return copyValue(target);
  }

  return copyCollection(target, customizer);
}

function copyCollection(target, customizer) {
  if (typeof customizer !== 'function') {
    throw new TypeError('customizer is must be a Function');
  }

  if (typeof target === 'function') {
    var source = String(target);

    // NOTE:
    //
    //   https://gist.github.com/jdalton/5e34d890105aca44399f
    //
    //   - https://gist.github.com/jdalton/5e34d890105aca44399f#gistcomment-1283831
    //   - http://es5.github.io/#x15
    //
    //   native functions does not have prototype:
    //
    //       Object.toString.prototype  // => undefined
    //       (function() {}).prototype  // => {}
    //
    //   but cannot detect native constructor:
    //
    //       typeof Object     // => 'function'
    //       Object.prototype  // => {}
    //
    //   and cannot detect null binded function:
    //
    //       String(Math.abs)
    //         // => 'function abs() { [native code] }'
    //
    //     Firefox, Safari:
    //       String((function abs() {}).bind(null))
    //         // => 'function abs() { [native code] }'
    //
    //     Chrome:
    //       String((function abs() {}).bind(null))
    //         // => 'function () { [native code] }'
    if (/^\s*function\s*\S*\([^\)]*\)\s*{\s*\[native code\]\s*}/.test(source)) {
      // native function
      return target;
    } else {
      // user defined function
      return new Function('return ' + source)();
    }
  }

  var targetClass = toString.call(target);

  if (targetClass === '[object Array]') {
    return [];
  }

  if (targetClass === '[object Object]' && target.constructor === Object) {
    return {};
  }

  if (targetClass === '[object Date]') {
    // NOTE:
    //
    //   Firefox need to convert
    //
    //   Firefox:
    //     var date = new Date;
    //     +date;            // 1420909365967
    //     +new Date(date);  // 1420909365000
    //     +new Date(+date); // 1420909365967
    //
    //   Chrome:
    //     var date = new Date;
    //     +date;            // 1420909757913
    //     +new Date(date);  // 1420909757913
    //     +new Date(+date); // 1420909757913
    return new Date(+target);
  }

  if (targetClass === '[object RegExp]') {
    // NOTE:
    //
    //   Chrome, Safari:
    //     (new RegExp).source => "(?:)"
    //
    //   Firefox:
    //     (new RegExp).source => ""
    //
    //   Chrome, Safari, Firefox:
    //     String(new RegExp) => "/(?:)/"
    var regexpText = String(target),
        slashIndex = regexpText.lastIndexOf('/');

    return new RegExp(regexpText.slice(1, slashIndex), regexpText.slice(slashIndex + 1));
  }

  if (_polyfill.isBuffer(target)) {
    var buffer = new Buffer(target.length);

    target.copy(buffer);

    return buffer;
  }

  var customizerResult = customizer(target);

  if (customizerResult !== void 0) {
    return customizerResult;
  }

  return null;
}

function copyValue(target) {
  var targetType = typeof target;

  // copy String, Number, Boolean, undefined and Symbol
  // without null and Function
  if (target !== null && targetType !== 'object' && targetType !== 'function') {
    return target;
  }

  return null;
}

exports['default'] = {
  copy: copy,
  copyCollection: copyCollection,
  copyValue: copyValue
};
module.exports = exports['default'];
}).call(this,require("buffer").Buffer)

},{"./polyfill":15,"buffer":5}],14:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _copy = require('./copy');

var _polyfill = require('./polyfill');

function defaultCustomizer(target) {
  return void 0;
}

function deepcopy(target) {
  var customizer = arguments.length <= 1 || arguments[1] === undefined ? defaultCustomizer : arguments[1];

  if (target === null) {
    // copy null
    return null;
  }

  var resultValue = _copy.copyValue(target);

  if (resultValue !== null) {
    // copy some primitive types
    return resultValue;
  }

  var resultCollection = _copy.copyCollection(target, customizer),
      clone = resultCollection !== null ? resultCollection : target;

  var visited = [target],
      reference = [clone];

  // recursively copy from collection
  return recursiveCopy(target, customizer, clone, visited, reference);
}

function recursiveCopy(target, customizer, clone, visited, reference) {
  if (target === null) {
    // copy null
    return null;
  }

  var resultValue = _copy.copyValue(target);

  if (resultValue !== null) {
    // copy some primitive types
    return resultValue;
  }

  var keys = _polyfill.getKeys(target).concat(_polyfill.getSymbols(target));

  var i = undefined,
      len = undefined;

  var key = undefined,
      value = undefined,
      index = undefined,
      resultCopy = undefined,
      result = undefined,
      ref = undefined;

  for (i = 0, len = keys.length; i < len; ++i) {
    key = keys[i];
    value = target[key];
    index = _polyfill.indexOf(visited, value);

    if (index === -1) {
      resultCopy = _copy.copy(value, customizer);
      result = resultCopy !== null ? resultCopy : value;

      if (value !== null && /^(?:function|object)$/.test(typeof value)) {
        visited.push(value);
        reference.push(result);
      }
    } else {
      // circular reference
      ref = reference[index];
    }

    clone[key] = ref || recursiveCopy(value, customizer, result, visited, reference);
  }

  return clone;
}

exports['default'] = deepcopy;
module.exports = exports['default'];
},{"./copy":13,"./polyfill":15}],15:[function(require,module,exports){
(function (Buffer){
'use strict';

exports.__esModule = true;
var toString = Object.prototype.toString;

var isBuffer = typeof Buffer !== 'undefined' ? function isBuffer(obj) {
  return Buffer.isBuffer(obj);
} : function isBuffer() {
  // always return false in browsers
  return false;
};

var getKeys = Object.keys ? function getKeys(obj) {
  return Object.keys(obj);
} : function getKeys(obj) {
  var objType = typeof obj;

  if (obj === null || objType !== 'function' || objType !== 'object') {
    throw new TypeError('obj must be an Object');
  }

  var resultKeys = [],
      key = undefined;

  for (key in obj) {
    obj.hasOwnProperty(key) && resultKeys.push(key);
  }

  return resultKeys;
};

var getSymbols = typeof Symbol === 'function' ? function getSymbols(obj) {
  return Object.getOwnPropertySymbols(obj);
} : function getSymbols() {
  // always return empty Array when Symbol is not supported
  return [];
};

// NOTE:
//
//   Array.prototype.indexOf is cannot find NaN (in Chrome)
//   Array.prototype.includes is can find NaN (in Chrome)
//
//   this function can find NaN, because use SameValue algorithm
function indexOf(array, s) {
  if (toString.call(array) !== '[object Array]') {
    throw new TypeError('array must be an Array');
  }

  var i = undefined,
      len = undefined,
      value = undefined;

  for (i = 0, len = array.length; i < len; ++i) {
    value = array[i];

    // it is SameValue algorithm
    // http://stackoverflow.com/questions/27144277/comparing-a-variable-with-itself
    if (value === s || value !== value && s !== s) {
      // eslint-disable-line no-self-compare
      return i;
    }
  }

  return -1;
}

exports['default'] = {
  getKeys: getKeys,
  getSymbols: getSymbols,
  indexOf: indexOf,
  isBuffer: isBuffer
};
module.exports = exports['default'];
}).call(this,require("buffer").Buffer)

},{"buffer":5}],16:[function(require,module,exports){
'use strict';

var keys = require('object-keys');
var foreach = require('foreach');
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

var toStr = Object.prototype.toString;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
        /* eslint-disable no-unused-vars, no-restricted-syntax */
        for (var _ in obj) { return false; }
        /* eslint-enable no-unused-vars, no-restricted-syntax */
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		Object.defineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys(map);
	if (hasSymbols) {
		props = props.concat(Object.getOwnPropertySymbols(map));
	}
	foreach(props, function (name) {
		defineProperty(object, name, map[name], predicates[name]);
	});
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;

},{"foreach":25,"object-keys":35}],17:[function(require,module,exports){
module.exports = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) return arguments[i];
    }
};

},{}],18:[function(require,module,exports){
'use strict';

var $isNaN = Number.isNaN || function (a) { return a !== a; };
var $isFinite = require('./helpers/isFinite');

var sign = require('./helpers/sign');
var mod = require('./helpers/mod');

var IsCallable = require('is-callable');
var toPrimitive = require('es-to-primitive/es5');

// https://es5.github.io/#x9
var ES5 = {
	ToPrimitive: toPrimitive,

	ToBoolean: function ToBoolean(value) {
		return Boolean(value);
	},
	ToNumber: function ToNumber(value) {
		return Number(value);
	},
	ToInteger: function ToInteger(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number)) { return 0; }
		if (number === 0 || !$isFinite(number)) { return number; }
		return sign(number) * Math.floor(Math.abs(number));
	},
	ToInt32: function ToInt32(x) {
		return this.ToNumber(x) >> 0;
	},
	ToUint32: function ToUint32(x) {
		return this.ToNumber(x) >>> 0;
	},
	ToUint16: function ToUint16(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x10000);
	},
	ToString: function ToString(value) {
		return String(value);
	},
	ToObject: function ToObject(value) {
		this.CheckObjectCoercible(value);
		return Object(value);
	},
	CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
		/* jshint eqnull:true */
		if (value == null) {
			throw new TypeError(optMessage || 'Cannot call method on ' + value);
		}
		return value;
	},
	IsCallable: IsCallable,
	SameValue: function SameValue(x, y) {
		if (x === y) { // 0 === -0, but they are not identical.
			if (x === 0) { return 1 / x === 1 / y; }
			return true;
		}
        return $isNaN(x) && $isNaN(y);
	}
};

module.exports = ES5;

},{"./helpers/isFinite":19,"./helpers/mod":20,"./helpers/sign":21,"es-to-primitive/es5":22,"is-callable":32}],19:[function(require,module,exports){
var $isNaN = Number.isNaN || function (a) { return a !== a; };

module.exports = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };

},{}],20:[function(require,module,exports){
module.exports = function mod(number, modulo) {
	var remain = number % modulo;
	return Math.floor(remain >= 0 ? remain : remain + modulo);
};

},{}],21:[function(require,module,exports){
module.exports = function sign(number) {
	return number >= 0 ? 1 : -1;
};

},{}],22:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;

var isPrimitive = require('./helpers/isPrimitive');

var isCallable = require('is-callable');

// https://es5.github.io/#x8.12
var ES5internalSlots = {
	'[[DefaultValue]]': function (O, hint) {
		var actualHint = hint || (toStr.call(O) === '[object Date]' ? String : Number);

		if (actualHint === String || actualHint === Number) {
			var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
			var value, i;
			for (i = 0; i < methods.length; ++i) {
				if (isCallable(O[methods[i]])) {
					value = O[methods[i]]();
					if (isPrimitive(value)) {
						return value;
					}
				}
			}
			throw new TypeError('No default value');
		}
		throw new TypeError('invalid [[DefaultValue]] hint supplied');
	}
};

// https://es5.github.io/#x9
module.exports = function ToPrimitive(input, PreferredType) {
	if (isPrimitive(input)) {
		return input;
	}
	return ES5internalSlots['[[DefaultValue]]'](input, PreferredType);
};

},{"./helpers/isPrimitive":23,"is-callable":32}],23:[function(require,module,exports){
module.exports = function isPrimitive(value) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};

},{}],24:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],25:[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],26:[function(require,module,exports){
var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],27:[function(require,module,exports){
var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":26}],28:[function(require,module,exports){
var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":27}],29:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],30:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],31:[function(require,module,exports){
/**
 * Determine if an object is Buffer
 *
 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * License:  MIT
 *
 * `npm install is-buffer`
 */

module.exports = function (obj) {
  return !!(obj != null &&
    (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
      (obj.constructor &&
      typeof obj.constructor.isBuffer === 'function' &&
      obj.constructor.isBuffer(obj))
    ))
}

},{}],32:[function(require,module,exports){
'use strict';

var fnToStr = Function.prototype.toString;

var constructorRegex = /^\s*class /;
var isES6ClassFn = function isES6ClassFn(value) {
	try {
		var fnStr = fnToStr.call(value);
		var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
		var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
		var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
		return constructorRegex.test(spaceStripped);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionObject(value) {
	try {
		if (isES6ClassFn(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isCallable(value) {
	if (!value) { return false; }
	if (typeof value !== 'function' && typeof value !== 'object') { return false; }
	if (hasToStringTag) { return tryFunctionObject(value); }
	if (isES6ClassFn(value)) { return false; }
	var strClass = toStr.call(value);
	return strClass === fnClass || strClass === genClass;
};

},{}],33:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],34:[function(require,module,exports){
var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;

module.exports = function inspect_ (obj, opts, depth, seen) {
    if (!opts) opts = {};
    
    var maxDepth = opts.depth === undefined ? 5 : opts.depth;
    if (depth === undefined) depth = 0;
    if (depth >= maxDepth && maxDepth > 0
    && obj && typeof obj === 'object') {
        return '[Object]';
    }
    
    if (seen === undefined) seen = [];
    else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }
    
    function inspect (value, from) {
        if (from) {
            seen = seen.slice();
            seen.push(from);
        }
        return inspect_(value, opts, depth + 1, seen);
    }
    
    if (typeof obj === 'string') {
        return inspectString(obj);
    }
    else if (typeof obj === 'function') {
        var name = nameOf(obj);
        return '[Function' + (name ? ': ' + name : '') + ']';
    }
    else if (obj === null) {
        return 'null';
    }
    else if (isSymbol(obj)) {
        var symString = Symbol.prototype.toString.call(obj);
        return typeof obj === 'object' ? 'Object(' + symString + ')' : symString;
    }
    else if (isElement(obj)) {
        var s = '<' + String(obj.nodeName).toLowerCase();
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '="' + quote(attrs[i].value) + '"';
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) s += '...';
        s += '</' + String(obj.nodeName).toLowerCase() + '>';
        return s;
    }
    else if (isArray(obj)) {
        if (obj.length === 0) return '[]';
        var xs = Array(obj.length);
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
        return '[ ' + xs.join(', ') + ' ]';
    }
    else if (isError(obj)) {
        var parts = [];
        for (var key in obj) {
            if (!has(obj, key)) continue;
            
            if (/[^\w$]/.test(key)) {
                parts.push(inspect(key) + ': ' + inspect(obj[key]));
            }
            else {
                parts.push(key + ': ' + inspect(obj[key]));
            }
        }
        if (parts.length === 0) return '[' + obj + ']';
        return '{ [' + obj + '] ' + parts.join(', ') + ' }';
    }
    else if (typeof obj === 'object' && typeof obj.inspect === 'function') {
        return obj.inspect();
    }
    else if (isMap(obj)) {
        var parts = [];
        mapForEach.call(obj, function (value, key) {
            parts.push(inspect(key, obj) + ' => ' + inspect(value, obj));
        });
        return 'Map (' + mapSize.call(obj) + ') {' + parts.join(', ') + '}';
    }
    else if (isSet(obj)) {
        var parts = [];
        setForEach.call(obj, function (value ) {
            parts.push(inspect(value, obj));
        });
        return 'Set (' + setSize.call(obj) + ') {' + parts.join(', ') + '}';
    }
    else if (typeof obj === 'object' && !isDate(obj) && !isRegExp(obj)) {
        var xs = [], keys = [];
        for (var key in obj) {
            if (has(obj, key)) keys.push(key);
        }
        keys.sort();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (/[^\w$]/.test(key)) {
                xs.push(inspect(key) + ': ' + inspect(obj[key], obj));
            }
            else xs.push(key + ': ' + inspect(obj[key], obj));
        }
        if (xs.length === 0) return '{}';
        return '{ ' + xs.join(', ') + ' }';
    }
    else return String(obj);
};

function quote (s) {
    return String(s).replace(/"/g, '&quot;');
}

function isArray (obj) { return toStr(obj) === '[object Array]' }
function isDate (obj) { return toStr(obj) === '[object Date]' }
function isRegExp (obj) { return toStr(obj) === '[object RegExp]' }
function isError (obj) { return toStr(obj) === '[object Error]' }
function isSymbol (obj) { return toStr(obj) === '[object Symbol]' }

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has (obj, key) {
    return hasOwn.call(obj, key);
}

function toStr (obj) {
    return Object.prototype.toString.call(obj);
}

function nameOf (f) {
    if (f.name) return f.name;
    var m = f.toString().match(/^function\s*([\w$]+)/);
    if (m) return m[1];
}

function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) return i;
    }
    return -1;
}

function isMap (x) {
    if (!mapSize) {
        return false;
    }
    try {
        mapSize.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isSet (x) {
    if (!setSize) {
        return false;
    }
    try {
        setSize.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isElement (x) {
    if (!x || typeof x !== 'object') return false;
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string'
        && typeof x.getAttribute === 'function'
    ;
}

function inspectString (str) {
    var s = str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte);
    return "'" + s + "'";
    
    function lowbyte (c) {
        var n = c.charCodeAt(0);
        var x = { 8: 'b', 9: 't', 10: 'n', 12: 'f', 13: 'r' }[n];
        if (x) return '\\' + x;
        return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16);
    }
}

},{}],35:[function(require,module,exports){
'use strict';

// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = require('./isArguments');
var hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString');
var hasProtoEnumBug = function () {}.propertyIsEnumerable('prototype');
var dontEnums = [
	'toString',
	'toLocaleString',
	'valueOf',
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'constructor'
];
var equalsConstructorPrototype = function (o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var blacklistedKeys = {
	$console: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$parent: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = (function () {
	/* global window */
	if (typeof window === 'undefined') { return false; }
	for (var k in window) {
		try {
			if (!blacklistedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}());
var equalsConstructorPrototypeIfNotBuggy = function (o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2));
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

},{"./isArguments":36}],36:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

},{}],37:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":39}],38:[function(require,module,exports){
(function (process){
'use strict';

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn) {
  var args = new Array(arguments.length - 1);
  var i = 0;
  while (i < args.length) {
    args[i++] = arguments[i];
  }
  process.nextTick(function afterTick() {
    fn.apply(null, args);
  });
}

}).call(this,require('_process'))

},{"_process":39}],39:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],40:[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":41}],41:[function(require,module,exports){
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}
},{"./_stream_readable":43,"./_stream_writable":45,"core-util-is":7,"inherits":30,"process-nextick-args":38}],42:[function(require,module,exports){
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":44,"core-util-is":7,"inherits":30}],43:[function(require,module,exports){
(function (process){
'use strict';

module.exports = Readable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/

/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Readable.ReadableState = ReadableState;

var EE = require('events');

/*<replacement>*/
var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream;
(function () {
  try {
    Stream = require('st' + 'ream');
  } catch (_) {} finally {
    if (!Stream) Stream = require('events').EventEmitter;
  }
})();
/*</replacement>*/

var Buffer = require('buffer').Buffer;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var debugUtil = require('util');
var debug = undefined;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var StringDecoder;

util.inherits(Readable, Stream);

var Duplex;
function ReadableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

var Duplex;
function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options && typeof options.read === 'function') this._read = options.read;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;

  if (!state.objectMode && typeof chunk === 'string') {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      var skipAdd;
      if (state.decoder && !addToFront && !encoding) {
        chunk = state.decoder.write(chunk);
        skipAdd = !state.objectMode && chunk.length === 0;
      }

      if (!addToFront) state.reading = false;

      // Don't add to the buffer if we've decoded to an empty string chunk and
      // we're not in object mode
      if (!skipAdd) {
        // if we want the data now, just emit it.
        if (state.flowing && state.length === 0 && !state.sync) {
          stream.emit('data', chunk);
          stream.read(0);
        } else {
          // update the buffer info.
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

          if (state.needReadable) emitReadable(stream);
        }
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended) return 0;

  if (state.objectMode) return n === 0 ? 0 : 1;

  if (n === null || isNaN(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length) return state.buffer[0].length;else return state.length;
  }

  if (n <= 0) return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else {
      return state.length;
    }
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  var state = this._readableState;
  var nOrig = n;

  if (typeof n !== 'number' || n > 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  }

  if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read pushed data synchronously, then `reading` will be false,
  // and we need to re-evaluate how much data we can return to the user.
  if (doRead && !state.reading) n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended) state.needReadable = true;

  // If we tried to read() past the EOF, then emit end on the next tick.
  if (nOrig !== n && state.ended && state.length === 0) endReadable(this);

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    if (false === ret) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      if (state.pipesCount === 1 && state.pipes[0] === dest && src.listenerCount('data') === 1 && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
  if (!dest._events || !dest._events.error) dest.on('error', onerror);else if (isArray(dest._events.error)) dest._events.error.unshift(onerror);else dest._events.error = [onerror, dest._events.error];

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var _i = 0; _i < len; _i++) {
      dests[_i].emit('unpipe', this);
    }return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1) return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  // If listening to data, and it has not explicitly been paused,
  // then call resume to start the flow of data on the next tick.
  if (ev === 'data' && false !== this._readableState.flowing) {
    this.resume();
  }

  if (ev === 'readable' && !this._readableState.endEmitted) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  if (state.flowing) {
    do {
      var chunk = stream.read();
    } while (null !== chunk && state.flowing);
  }
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function (ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0) return null;

  if (length === 0) ret = null;else if (objectMode) ret = list.shift();else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode) ret = list.join('');else if (list.length === 1) ret = list[0];else ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode) ret = '';else ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode) ret += buf.slice(0, cpy);else buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length) list[0] = buf.slice(cpy);else list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this,require('_process'))

},{"./_stream_duplex":41,"_process":39,"buffer":5,"core-util-is":7,"events":24,"inherits":30,"isarray":33,"process-nextick-args":38,"string_decoder/":56,"util":2}],44:[function(require,module,exports){
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er) {
      done(stream, er);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

function done(stream, er) {
  if (er) return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('calling transform done when still transforming');

  return stream.push(null);
}
},{"./_stream_duplex":41,"core-util-is":7,"inherits":30}],45:[function(require,module,exports){
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

module.exports = Writable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var asyncWrite = !true ? setImmediate : processNextTick;
/*</replacement>*/

/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/
var Stream;
(function () {
  try {
    Stream = require('st' + 'ream');
  } catch (_) {} finally {
    if (!Stream) Stream = require('events').EventEmitter;
  }
})();
/*</replacement>*/

var Buffer = require('buffer').Buffer;

util.inherits(Writable, Stream);

function nop() {}

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

var Duplex;
function WritableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // create the two objects needed to store the corked requests
  // they are not a linked list, as no new elements are inserted in there
  this.corkedRequestsFree = new CorkedRequest(this);
  this.corkedRequestsFree.next = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function writableStateGetBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
    });
  } catch (_) {}
})();

var Duplex;
function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex)) return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;

  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync) processNextTick(cb, er);else cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
        afterWrite(stream, state, finished, cb);
      }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    while (entry) {
      buffer[count] = entry;
      entry = entry.next;
      count += 1;
    }

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    state.corkedRequestsFree = holder.next;
    holder.next = null;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else {
      prefinish(stream, state);
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function (err) {
    var entry = _this.entry;
    _this.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    if (state.corkedRequestsFree) {
      state.corkedRequestsFree.next = _this;
    } else {
      state.corkedRequestsFree = _this;
    }
  };
}
},{"./_stream_duplex":41,"buffer":5,"core-util-is":7,"events":24,"inherits":30,"process-nextick-args":38,"util-deprecate":62}],46:[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":42}],47:[function(require,module,exports){
var Stream = (function (){
  try {
    return require('st' + 'ream'); // hack to fix a circular dependency issue when used with browserify
  } catch(_){}
}());
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = Stream || exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

// inline-process-browser and unreachable-branch-transform make sure this is
// removed in browserify builds
if (!true) {
  module.exports = require('stream');
}

},{"./lib/_stream_duplex.js":41,"./lib/_stream_passthrough.js":42,"./lib/_stream_readable.js":43,"./lib/_stream_transform.js":44,"./lib/_stream_writable.js":45,"stream":51}],48:[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":44}],49:[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":45}],50:[function(require,module,exports){
(function (process){
var through = require('through');
var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

module.exports = function (write, end) {
    var tr = through(write, end);
    tr.pause();
    var resume = tr.resume;
    var pause = tr.pause;
    var paused = false;
    
    tr.pause = function () {
        paused = true;
        return pause.apply(this, arguments);
    };
    
    tr.resume = function () {
        paused = false;
        return resume.apply(this, arguments);
    };
    
    nextTick(function () {
        if (!paused) tr.resume();
    });
    
    return tr;
};

}).call(this,require('_process'))

},{"_process":39,"through":61}],51:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":24,"inherits":30,"readable-stream/duplex.js":40,"readable-stream/passthrough.js":46,"readable-stream/readable.js":47,"readable-stream/transform.js":48,"readable-stream/writable.js":49}],52:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var ES = require('es-abstract/es5');
var replace = bind.call(Function.call, String.prototype.replace);

var leftWhitespace = /^[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+/;
var rightWhitespace = /[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+$/;

module.exports = function trim() {
	var S = ES.ToString(ES.CheckObjectCoercible(this));
	return replace(replace(S, leftWhitespace, ''), rightWhitespace, '');
};

},{"es-abstract/es5":18,"function-bind":27}],53:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var define = require('define-properties');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');

var boundTrim = bind.call(Function.call, getPolyfill());

define(boundTrim, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = boundTrim;

},{"./implementation":52,"./polyfill":54,"./shim":55,"define-properties":16,"function-bind":27}],54:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

var zeroWidthSpace = '\u200b';

module.exports = function getPolyfill() {
	if (String.prototype.trim && zeroWidthSpace.trim() === zeroWidthSpace) {
		return String.prototype.trim;
	}
	return implementation;
};

},{"./implementation":52}],55:[function(require,module,exports){
'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimStringTrim() {
	var polyfill = getPolyfill();
	define(String.prototype, { trim: polyfill }, { trim: function () { return String.prototype.trim !== polyfill; } });
	return polyfill;
};

},{"./polyfill":54,"define-properties":16}],56:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":5}],57:[function(require,module,exports){
(function (process){
var defined = require('defined');
var createDefaultStream = require('./lib/default_stream');
var Test = require('./lib/test');
var createResult = require('./lib/results');
var through = require('through');

var canEmitExit = typeof process !== 'undefined' && process
    && typeof process.on === 'function' && process.browser !== true
;
var canExit = typeof process !== 'undefined' && process
    && typeof process.exit === 'function'
;

var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

exports = module.exports = (function () {
    var harness;
    var lazyLoad = function () {
        return getHarness().apply(this, arguments);
    };
    
    lazyLoad.only = function () {
        return getHarness().only.apply(this, arguments);
    };
    
    lazyLoad.createStream = function (opts) {
        if (!opts) opts = {};
        if (!harness) {
            var output = through();
            getHarness({ stream: output, objectMode: opts.objectMode });
            return output;
        }
        return harness.createStream(opts);
    };
    
    lazyLoad.onFinish = function () {
        return getHarness().onFinish.apply(this, arguments);
    };

    lazyLoad.getHarness = getHarness

    return lazyLoad

    function getHarness (opts) {
        if (!opts) opts = {};
        opts.autoclose = !canEmitExit;
        if (!harness) harness = createExitHarness(opts);
        return harness;
    }
})();

function createExitHarness (conf) {
    if (!conf) conf = {};
    var harness = createHarness({
        autoclose: defined(conf.autoclose, false)
    });
    
    var stream = harness.createStream({ objectMode: conf.objectMode });
    var es = stream.pipe(conf.stream || createDefaultStream());
    if (canEmitExit) {
        es.on('error', function (err) { harness._exitCode = 1 });
    }
    
    var ended = false;
    stream.on('end', function () { ended = true });
    
    if (conf.exit === false) return harness;
    if (!canEmitExit || !canExit) return harness;

    var inErrorState = false;

    process.on('exit', function (code) {
        // let the process exit cleanly.
        if (code !== 0) {
            return
        }

        if (!ended) {
            var only = harness._results._only;
            for (var i = 0; i < harness._tests.length; i++) {
                var t = harness._tests[i];
                if (only && t.name !== only) continue;
                t._exit();
            }
        }
        harness.close();
        process.exit(code || harness._exitCode);
    });
    
    return harness;
}

exports.createHarness = createHarness;
exports.Test = Test;
exports.test = exports; // tap compat
exports.test.skip = Test.skip;

var exitInterval;

function createHarness (conf_) {
    if (!conf_) conf_ = {};
    var results = createResult();
    if (conf_.autoclose !== false) {
        results.once('done', function () { results.close() });
    }
    
    var test = function (name, conf, cb) {
        var t = new Test(name, conf, cb);
        test._tests.push(t);
        
        (function inspectCode (st) {
            st.on('test', function sub (st_) {
                inspectCode(st_);
            });
            st.on('result', function (r) {
                if (!r.ok && typeof r !== 'string') test._exitCode = 1
            });
        })(t);
        
        results.push(t);
        return t;
    };
    test._results = results;
    
    test._tests = [];
    
    test.createStream = function (opts) {
        return results.createStream(opts);
    };

    test.onFinish = function (cb) {
        results.on('done', cb);
    };
    
    var only = false;
    test.only = function (name) {
        if (only) throw new Error('there can only be one only test');
        results.only(name);
        only = true;
        return test.apply(null, arguments);
    };
    test._exitCode = 0;
    
    test.close = function () { results.close() };
    
    return test;
}

}).call(this,require('_process'))

},{"./lib/default_stream":58,"./lib/results":59,"./lib/test":60,"_process":39,"defined":17,"through":61}],58:[function(require,module,exports){
(function (process){
var through = require('through');
var fs = require('fs');

module.exports = function () {
    var line = '';
    var stream = through(write, flush);
    return stream;
    
    function write (buf) {
        for (var i = 0; i < buf.length; i++) {
            var c = typeof buf === 'string'
                ? buf.charAt(i)
                : String.fromCharCode(buf[i])
            ;
            if (c === '\n') flush();
            else line += c;
        }
    }
    
    function flush () {
        if (fs.writeSync && /^win/.test(process.platform)) {
            try { fs.writeSync(1, line + '\n'); }
            catch (e) { stream.emit('error', e) }
        }
        else {
            try { console.log(line) }
            catch (e) { stream.emit('error', e) }
        }
        line = '';
    }
};

}).call(this,require('_process'))

},{"_process":39,"fs":4,"through":61}],59:[function(require,module,exports){
(function (process){
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var through = require('through');
var resumer = require('resumer');
var inspect = require('object-inspect');
var bind = require('function-bind');
var has = require('has');
var regexpTest = bind.call(Function.call, RegExp.prototype.test);
var yamlIndicators = /\:|\-|\?/;
var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

module.exports = Results;
inherits(Results, EventEmitter);

function Results () {
    if (!(this instanceof Results)) return new Results;
    this.count = 0;
    this.fail = 0;
    this.pass = 0;
    this._stream = through();
    this.tests = [];
}

Results.prototype.createStream = function (opts) {
    if (!opts) opts = {};
    var self = this;
    var output, testId = 0;
    if (opts.objectMode) {
        output = through();
        self.on('_push', function ontest (t, extra) {
            if (!extra) extra = {};
            var id = testId++;
            t.once('prerun', function () {
                var row = {
                    type: 'test',
                    name: t.name,
                    id: id
                };
                if (has(extra, 'parent')) {
                    row.parent = extra.parent;
                }
                output.queue(row);
            });
            t.on('test', function (st) {
                ontest(st, { parent: id });
            });
            t.on('result', function (res) {
                res.test = id;
                res.type = 'assert';
                output.queue(res);
            });
            t.on('end', function () {
                output.queue({ type: 'end', test: id });
            });
        });
        self.on('done', function () { output.queue(null) });
    }
    else {
        output = resumer();
        output.queue('TAP version 13\n');
        self._stream.pipe(output);
    }
    
    nextTick(function next() {
        var t;
        while (t = getNextTest(self)) {
            t.run();
            if (!t.ended) return t.once('end', function(){ nextTick(next); });
        }
        self.emit('done');
    });
    
    return output;
};

Results.prototype.push = function (t) {
    var self = this;
    self.tests.push(t);
    self._watch(t);
    self.emit('_push', t);
};

Results.prototype.only = function (name) {
    this._only = name;
};

Results.prototype._watch = function (t) {
    var self = this;
    var write = function (s) { self._stream.queue(s) };
    t.once('prerun', function () {
        write('# ' + t.name + '\n');
    });
    
    t.on('result', function (res) {
        if (typeof res === 'string') {
            write('# ' + res + '\n');
            return;
        }
        write(encodeResult(res, self.count + 1));
        self.count ++;

        if (res.ok) self.pass ++
        else self.fail ++
    });
    
    t.on('test', function (st) { self._watch(st) });
};

Results.prototype.close = function () {
    var self = this;
    if (self.closed) self._stream.emit('error', new Error('ALREADY CLOSED'));
    self.closed = true;
    var write = function (s) { self._stream.queue(s) };
    
    write('\n1..' + self.count + '\n');
    write('# tests ' + self.count + '\n');
    write('# pass  ' + self.pass + '\n');
    if (self.fail) write('# fail  ' + self.fail + '\n')
    else write('\n# ok\n')

    self._stream.queue(null);
};

function encodeResult (res, count) {
    var output = '';
    output += (res.ok ? 'ok ' : 'not ok ') + count;
    output += res.name ? ' ' + res.name.toString().replace(/\s+/g, ' ') : '';
    
    if (res.skip) output += ' # SKIP';
    else if (res.todo) output += ' # TODO';
    
    output += '\n';
    if (res.ok) return output;
    
    var outer = '  ';
    var inner = outer + '  ';
    output += outer + '---\n';
    output += inner + 'operator: ' + res.operator + '\n';
    
    if (has(res, 'expected') || has(res, 'actual')) {
        var ex = inspect(res.expected);
        var ac = inspect(res.actual);
        
        if (Math.max(ex.length, ac.length) > 65 || invalidYaml(ex) || invalidYaml(ac)) {
            output += inner + 'expected: |-\n' + inner + '  ' + ex + '\n';
            output += inner + 'actual: |-\n' + inner + '  ' + ac + '\n';
        }
        else {
            output += inner + 'expected: ' + ex + '\n';
            output += inner + 'actual:   ' + ac + '\n';
        }
    }
    if (res.at) {
        output += inner + 'at: ' + res.at + '\n';
    }
    if (res.operator === 'error' && res.actual && res.actual.stack) {
        var lines = String(res.actual.stack).split('\n');
        output += inner + 'stack: |-\n';
        for (var i = 0; i < lines.length; i++) {
            output += inner + '  ' + lines[i] + '\n';
        }
    }
    
    output += outer + '...\n';
    return output;
}

function getNextTest (results) {
    if (!results._only) {
        return results.tests.shift();
    }
    
    do {
        var t = results.tests.shift();
        if (!t) continue;
        if (results._only === t.name) {
            return t;
        }
    } while (results.tests.length !== 0)
}

function invalidYaml (str) {
    return regexpTest(yamlIndicators, str);
}

}).call(this,require('_process'))

},{"_process":39,"events":24,"function-bind":27,"has":28,"inherits":30,"object-inspect":34,"resumer":50,"through":61}],60:[function(require,module,exports){
(function (process,__dirname){
var deepEqual = require('deep-equal');
var defined = require('defined');
var path = require('path');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var has = require('has');
var trim = require('string.prototype.trim');

module.exports = Test;

var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

inherits(Test, EventEmitter);

var getTestArgs = function (name_, opts_, cb_) {
    var name = '(anonymous)';
    var opts = {};
    var cb;

    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        var t = typeof arg;
        if (t === 'string') {
            name = arg;
        }
        else if (t === 'object') {
            opts = arg || opts;
        }
        else if (t === 'function') {
            cb = arg;
        }
    }
    return { name: name, opts: opts, cb: cb };
};

function Test (name_, opts_, cb_) {
    if (! (this instanceof Test)) {
        return new Test(name_, opts_, cb_);
    }

    var args = getTestArgs(name_, opts_, cb_);

    this.readable = true;
    this.name = args.name || '(anonymous)';
    this.assertCount = 0;
    this.pendingCount = 0;
    this._skip = args.opts.skip || false;
    this._timeout = args.opts.timeout;
    this._plan = undefined;
    this._cb = args.cb;
    this._progeny = [];
    this._ok = true;

    for (var prop in this) {
        this[prop] = (function bind(self, val) {
            if (typeof val === 'function') {
                return function bound() {
                    return val.apply(self, arguments);
                };
            }
            else return val;
        })(this, this[prop]);
    }
}

Test.prototype.run = function () {
    if (this._skip) {
        this.comment('SKIP ' + this.name);
    }
    if (!this._cb || this._skip) {
        return this._end();
    }
    if (this._timeout != null) {
        this.timeoutAfter(this._timeout);
    }
    this.emit('prerun');
    this._cb(this);
    this.emit('run');
};

Test.prototype.test = function (name, opts, cb) {
    var self = this;
    var t = new Test(name, opts, cb);
    this._progeny.push(t);
    this.pendingCount++;
    this.emit('test', t);
    t.on('prerun', function () {
        self.assertCount++;
    })
    
    if (!self._pendingAsserts()) {
        nextTick(function () {
            self._end();
        });
    }
    
    nextTick(function() {
        if (!self._plan && self.pendingCount == self._progeny.length) {
            self._end();
        }
    });
};

Test.prototype.comment = function (msg) {
    var that = this;
    trim(msg).split('\n').forEach(function (aMsg) {
        that.emit('result', trim(aMsg).replace(/^#\s*/, ''));
    });
};

Test.prototype.plan = function (n) {
    this._plan = n;
    this.emit('plan', n);
};

Test.prototype.timeoutAfter = function(ms) {
    if (!ms) throw new Error('timeoutAfter requires a timespan');
    var self = this;
    var timeout = setTimeout(function() {
        self.fail('test timed out after ' + ms + 'ms');
        self.end();
    }, ms);
    this.once('end', function() {
        clearTimeout(timeout);
    });
}

Test.prototype.end = function (err) { 
    var self = this;
    if (arguments.length >= 1 && !!err) {
        this.ifError(err);
    }
    
    if (this.calledEnd) {
        this.fail('.end() called twice');
    }
    this.calledEnd = true;
    this._end();
};

Test.prototype._end = function (err) {
    var self = this;
    if (this._progeny.length) {
        var t = this._progeny.shift();
        t.on('end', function () { self._end() });
        t.run();
        return;
    }
    
    if (!this.ended) this.emit('end');
    var pendingAsserts = this._pendingAsserts();
    if (!this._planError && this._plan !== undefined && pendingAsserts) {
        this._planError = true;
        this.fail('plan != count', {
            expected : this._plan,
            actual : this.assertCount
        });
    }
    this.ended = true;
};

Test.prototype._exit = function () {
    if (this._plan !== undefined &&
        !this._planError && this.assertCount !== this._plan) {
        this._planError = true;
        this.fail('plan != count', {
            expected : this._plan,
            actual : this.assertCount,
            exiting : true
        });
    }
    else if (!this.ended) {
        this.fail('test exited without ending', {
            exiting: true
        });
    }
};

Test.prototype._pendingAsserts = function () {
    if (this._plan === undefined) {
        return 1;
    }
    else {
        return this._plan - (this._progeny.length + this.assertCount);
    }
};

Test.prototype._assert = function assert (ok, opts) {
    var self = this;
    var extra = opts.extra || {};
    
    var res = {
        id : self.assertCount ++,
        ok : Boolean(ok),
        skip : defined(extra.skip, opts.skip),
        name : defined(extra.message, opts.message, '(unnamed assert)'),
        operator : defined(extra.operator, opts.operator)
    };
    if (has(opts, 'actual') || has(extra, 'actual')) {
        res.actual = defined(extra.actual, opts.actual);
    }
    if (has(opts, 'expected') || has(extra, 'expected')) {
        res.expected = defined(extra.expected, opts.expected);
    }
    this._ok = Boolean(this._ok && ok);
    
    if (!ok) {
        res.error = defined(extra.error, opts.error, new Error(res.name));
    }
    
    if (!ok) {
        var e = new Error('exception');
        var err = (e.stack || '').split('\n');
        var dir = path.dirname(__dirname) + '/';
        
        for (var i = 0; i < err.length; i++) {
            var m = /^[^\s]*\s*\bat\s+(.+)/.exec(err[i]);
            if (!m) {
                continue;
            }
            
            var s = m[1].split(/\s+/);
            var filem = /(\/[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[1]);
            if (!filem) {
                filem = /(\/[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[2]);
                
                if (!filem) {
                    filem = /(\/[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[3]);

                    if (!filem) {
                        continue;
                    }
                }
            }
            
            if (filem[1].slice(0, dir.length) === dir) {
                continue;
            }
            
            res.functionName = s[0];
            res.file = filem[1];
            res.line = Number(filem[2]);
            if (filem[3]) res.column = filem[3];
            
            res.at = m[1];
            break;
        }
    }

    self.emit('result', res);
    
    var pendingAsserts = self._pendingAsserts();
    if (!pendingAsserts) {
        if (extra.exiting) {
            self._end();
        } else {
            nextTick(function () {
                self._end();
            });
        }
    }
    
    if (!self._planError && pendingAsserts < 0) {
        self._planError = true;
        self.fail('plan != count', {
            expected : self._plan,
            actual : self._plan - pendingAsserts
        });
    }
};

Test.prototype.fail = function (msg, extra) {
    this._assert(false, {
        message : msg,
        operator : 'fail',
        extra : extra
    });
};

Test.prototype.pass = function (msg, extra) {
    this._assert(true, {
        message : msg,
        operator : 'pass',
        extra : extra
    });
};

Test.prototype.skip = function (msg, extra) {
    this._assert(true, {
        message : msg,
        operator : 'skip',
        skip : true,
        extra : extra
    });
};

Test.prototype.ok
= Test.prototype['true']
= Test.prototype.assert
= function (value, msg, extra) {
    this._assert(value, {
        message : msg,
        operator : 'ok',
        expected : true,
        actual : value,
        extra : extra
    });
};

Test.prototype.notOk
= Test.prototype['false']
= Test.prototype.notok
= function (value, msg, extra) {
    this._assert(!value, {
        message : msg,
        operator : 'notOk',
        expected : false,
        actual : value,
        extra : extra
    });
};

Test.prototype.error
= Test.prototype.ifError
= Test.prototype.ifErr
= Test.prototype.iferror
= function (err, msg, extra) {
    this._assert(!err, {
        message : defined(msg, String(err)),
        operator : 'error',
        actual : err,
        extra : extra
    });
};

Test.prototype.equal
= Test.prototype.equals
= Test.prototype.isEqual
= Test.prototype.is
= Test.prototype.strictEqual
= Test.prototype.strictEquals
= function (a, b, msg, extra) {
    this._assert(a === b, {
        message : defined(msg, 'should be equal'),
        operator : 'equal',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype.notEqual
= Test.prototype.notEquals
= Test.prototype.notStrictEqual
= Test.prototype.notStrictEquals
= Test.prototype.isNotEqual
= Test.prototype.isNot
= Test.prototype.not
= Test.prototype.doesNotEqual
= Test.prototype.isInequal
= function (a, b, msg, extra) {
    this._assert(a !== b, {
        message : defined(msg, 'should not be equal'),
        operator : 'notEqual',
        actual : a,
        notExpected : b,
        extra : extra
    });
};

Test.prototype.deepEqual
= Test.prototype.deepEquals
= Test.prototype.isEquivalent
= Test.prototype.same
= function (a, b, msg, extra) {
    this._assert(deepEqual(a, b, { strict: true }), {
        message : defined(msg, 'should be equivalent'),
        operator : 'deepEqual',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype.deepLooseEqual
= Test.prototype.looseEqual
= Test.prototype.looseEquals
= function (a, b, msg, extra) {
    this._assert(deepEqual(a, b), {
        message : defined(msg, 'should be equivalent'),
        operator : 'deepLooseEqual',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype.notDeepEqual
= Test.prototype.notEquivalent
= Test.prototype.notDeeply
= Test.prototype.notSame
= Test.prototype.isNotDeepEqual
= Test.prototype.isNotDeeply
= Test.prototype.isNotEquivalent
= Test.prototype.isInequivalent
= function (a, b, msg, extra) {
    this._assert(!deepEqual(a, b, { strict: true }), {
        message : defined(msg, 'should not be equivalent'),
        operator : 'notDeepEqual',
        actual : a,
        notExpected : b,
        extra : extra
    });
};

Test.prototype.notDeepLooseEqual
= Test.prototype.notLooseEqual
= Test.prototype.notLooseEquals
= function (a, b, msg, extra) {
    this._assert(!deepEqual(a, b), {
        message : defined(msg, 'should be equivalent'),
        operator : 'notDeepLooseEqual',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype['throws'] = function (fn, expected, msg, extra) {
    if (typeof expected === 'string') {
        msg = expected;
        expected = undefined;
    }

    var caught = undefined;

    try {
        fn();
    } catch (err) {
        caught = { error : err };
        var message = err.message;
        delete err.message;
        err.message = message;
    }

    var passed = caught;

    if (expected instanceof RegExp) {
        passed = expected.test(caught && caught.error);
        expected = String(expected);
    }

    if (typeof expected === 'function' && caught) {
        passed = caught.error instanceof expected;
        caught.error = caught.error.constructor;
    }

    this._assert(typeof fn === 'function' && passed, {
        message : defined(msg, 'should throw'),
        operator : 'throws',
        actual : caught && caught.error,
        expected : expected,
        error: !passed && caught && caught.error,
        extra : extra
    });
};

Test.prototype.doesNotThrow = function (fn, expected, msg, extra) {
    if (typeof expected === 'string') {
        msg = expected;
        expected = undefined;
    }
    var caught = undefined;
    try {
        fn();
    }
    catch (err) {
        caught = { error : err };
    }
    this._assert(!caught, {
        message : defined(msg, 'should not throw'),
        operator : 'throws',
        actual : caught && caught.error,
        expected : expected,
        error : caught && caught.error,
        extra : extra
    });
};

Test.skip = function (name_, _opts, _cb) {
    var args = getTestArgs.apply(null, arguments);
    args.opts.skip = true;
    return Test(args.name, args.opts, args.cb);
};

// vim: set softtabstop=4 shiftwidth=4:


}).call(this,require('_process'),"/node_modules/tape/lib")

},{"_process":39,"deep-equal":9,"defined":17,"events":24,"has":28,"inherits":30,"path":37,"string.prototype.trim":53}],61:[function(require,module,exports){
(function (process){
var Stream = require('stream')

// through
//
// a stream that does nothing but re-emit the input.
// useful for aggregating a series of changing but not ending streams into one stream)

exports = module.exports = through
through.through = through

//create a readable writable stream.

function through (write, end, opts) {
  write = write || function (data) { this.queue(data) }
  end = end || function () { this.queue(null) }

  var ended = false, destroyed = false, buffer = [], _ended = false
  var stream = new Stream()
  stream.readable = stream.writable = true
  stream.paused = false

//  stream.autoPause   = !(opts && opts.autoPause   === false)
  stream.autoDestroy = !(opts && opts.autoDestroy === false)

  stream.write = function (data) {
    write.call(this, data)
    return !stream.paused
  }

  function drain() {
    while(buffer.length && !stream.paused) {
      var data = buffer.shift()
      if(null === data)
        return stream.emit('end')
      else
        stream.emit('data', data)
    }
  }

  stream.queue = stream.push = function (data) {
//    console.error(ended)
    if(_ended) return stream
    if(data === null) _ended = true
    buffer.push(data)
    drain()
    return stream
  }

  //this will be registered as the first 'end' listener
  //must call destroy next tick, to make sure we're after any
  //stream piped from here.
  //this is only a problem if end is not emitted synchronously.
  //a nicer way to do this is to make sure this is the last listener for 'end'

  stream.on('end', function () {
    stream.readable = false
    if(!stream.writable && stream.autoDestroy)
      process.nextTick(function () {
        stream.destroy()
      })
  })

  function _end () {
    stream.writable = false
    end.call(stream)
    if(!stream.readable && stream.autoDestroy)
      stream.destroy()
  }

  stream.end = function (data) {
    if(ended) return
    ended = true
    if(arguments.length) stream.write(data)
    _end() // will emit or queue
    return stream
  }

  stream.destroy = function () {
    if(destroyed) return
    destroyed = true
    ended = true
    buffer.length = 0
    stream.writable = stream.readable = false
    stream.emit('close')
    return stream
  }

  stream.pause = function () {
    if(stream.paused) return
    stream.paused = true
    return stream
  }

  stream.resume = function () {
    if(stream.paused) {
      stream.paused = false
      stream.emit('resume')
    }
    drain()
    //may have become paused again,
    //as drain emits 'data'.
    if(!stream.paused)
      stream.emit('drain')
    return stream
  }
  return stream
}


}).call(this,require('_process'))

},{"_process":39,"stream":51}],62:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],63:[function(require,module,exports){
var css = "body,\nhtml {\n  width: 100%;\n  height: 100%;\n  font-size: 1.25em;\n  margin: 0;\n  padding: 0;\n  font-family: arial;\n  color: #444444;\n}\n.dashgridContainer {\n  position: relative;\n  /*top: 1%;*/\n  /*margin: 0 auto;*/\n  width: 100%;\n  height: 100%;\n  /*height: 800px;*/\n  /*height: 800px;*/\n}\n.dashgridBox {\n  background: #E1E1E1;\n  position: absolute;\n  top: 20%;\n  left: 0;\n  width: 100%;\n  height: 80%;\n}\n/**\n * Dashgrid relevant classes.\n */\n.dashgrid {\n  background: #F9F9F9;\n}\n.dashgrid-box {\n  background: red;\n}\n.dashgrid-shadow-box {\n  background-color: #E8E8E8;\n  opacity: 0.5;\n}\n/**\n * GRID DRAW HELPERS.\n */\n.dashgrid-horizontal-line,\n.dashgrid-vertical-line {\n  background: #FFFFFF;\n}\n.dashgrid-grid-centroid {\n  background: #000000;\n  width: 5px;\n  height: 5px;\n}\n/**\n * Resize Handlers\n */\n\n\n\n\n\n\n\n\n"; (require("browserify-css").createStyle(css, { "href": "specs/demo.css"})); module.exports = css;
},{"browserify-css":3}],64:[function(require,module,exports){
'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

require('./demo.css');

var _dashgrid = require('../src/dashgrid.js');

var _dashgrid2 = _interopRequireDefault(_dashgrid);

var _util = require('./util.js');

var _initGridTest = require('./tests/initGrid.test.js');

var _initGridTest2 = _interopRequireDefault(_initGridTest);

var _boxAddRemoveTest = require('./tests/boxAddRemove.test.js');

var _boxAddRemoveTest2 = _interopRequireDefault(_boxAddRemoveTest);

var _boxMoveTest = require('./tests/boxMove.test.js');

var _boxMoveTest2 = _interopRequireDefault(_boxMoveTest);

var _boxCollisionTest = require('./tests/boxCollision.test.js');

var _boxCollisionTest2 = _interopRequireDefault(_boxCollisionTest);

var _boxResizeTest = require('./tests/boxResize.test.js');

var _boxResizeTest2 = _interopRequireDefault(_boxResizeTest);

var _gridResizeTest = require('./tests/gridResize.test.js');

var _gridResizeTest2 = _interopRequireDefault(_gridResizeTest);

var _draggerTest = require('./tests/dragger.test.js');

var _draggerTest2 = _interopRequireDefault(_draggerTest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Util.


// Dashgrid.


document.addEventListener('DOMContentLoaded', function () {
    tests();
});

/** Testing is done feature wise:
 *    Move / resize box:
 *        - Inside border edge.
 *        - Outside border edge.
 *        - Dragging disabled, globally and box-wise.
 *        - Collisions.
 *
 *    Insert / remove box:
 *        - Valid insert.
 *        - Non-valid insert.
 *
 *    Toggle properties:
 *        - Initialization.
 */


// Tests.
function tests() {
    var t = {
        initGrid: function initGrid() {
            (0, _initGridTest2.default)(_dashgrid2.default, _tape2.default);
        },
        boxMove: function boxMove() {
            (0, _boxMoveTest2.default)(_dashgrid2.default, _tape2.default);
        },
        boxResize: function boxResize() {
            (0, _boxResizeTest2.default)(_dashgrid2.default, _tape2.default);
        },
        boxAddRemove: function boxAddRemove() {
            (0, _boxAddRemoveTest2.default)(_dashgrid2.default, _tape2.default);
        },
        boxCollisions: function boxCollisions() {
            (0, _boxCollisionTest2.default)(_dashgrid2.default, _tape2.default);
        }
    };

    // propertyToggle: () => {propertyToggle(dashGridGlobal, test)}
    (0, _util.decorateRunAll)(t, _dashgrid2.default, _tape2.default);

    t.initGrid();
    // t.boxMove();
}

},{"../src/dashgrid.js":74,"./demo.css":63,"./tests/boxAddRemove.test.js":65,"./tests/boxCollision.test.js":66,"./tests/boxMove.test.js":67,"./tests/boxResize.test.js":68,"./tests/dragger.test.js":69,"./tests/gridResize.test.js":70,"./tests/initGrid.test.js":71,"./util.js":72,"tape":57}],65:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = boxAddRemove;

var _util = require('../util.js');

var diff = require('deep-diff').diff;
var deepcopy = require('deepcopy');

function boxAddRemove(dashGridGlobal, test) {

    test('Valid box inserts', function (t) {
        // Mockup.
        var differences = void 0,
            prevState = void 0;
        var boxes = [{ row: 0, column: 0, rowspan: 3, columnspan: 3 }];
        var grid = dashGridGlobal('#grid', { boxes: boxes });

        t.plan(4);
        /**
         * Valid Add / Remove.
         */
        prevState = deepcopy(grid.grid);
        grid.insertBox({ row: 0, column: 0, rowspan: 1, columnspan: 1 });
        differences = diff(grid.grid, prevState);
        t.equal(differences.length, 2, 'Inserted box on a non-empty cell');

        prevState = deepcopy(grid.grid);
        grid.insertBox({ row: 4, column: 4, rowspan: 1, columnspan: 1 });
        differences = diff(grid.grid, prevState);
        t.equal(differences.length, 1, 'Inserted box on an empty cell');

        prevState = deepcopy(grid.grid);
        grid.removeBox(1);
        differences = diff(grid.grid, prevState);
        // TODO: checkout difference
        t.equal(differences.length, 3, 'Removing an inserted box');

        prevState = deepcopy(grid.grid);
        grid.removeBox(0);
        differences = diff(grid.grid, prevState);
        t.equal(differences.length, 5, 'Removing an initial box');

        t.end();
    });
}

},{"../util.js":72,"deep-diff":8,"deepcopy":12}],66:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = boxCollisions;

var _util = require('../util.js');

var diff = require('deep-diff').diff;
var deepcopy = require('deepcopy');

function boxCollisions(dashGridGlobal, test) {
    test('Propogated row collision', function (t) {
        var differences = void 0,
            prevState = void 0;

        // Mockup.
        var boxes = [{ 'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 3 }, { 'row': 2, 'column': 0, 'rowspan': 1, 'columnspan': 4 }, { 'row': 3, 'column': 0, 'rowspan': 1, 'columnspan': 4 }];
        var grid = dashGridGlobal('#grid', { boxes: boxes });

        // Tests.
        t.plan(4);

        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[0], { row: 1 });
        t.equal(boxes[0].row, 1, 'Should move.');
        t.equal(boxes[1].row, 3, 'Should move.');
        t.equal(boxes[2].row, 4, 'Should move.');
        differences = diff(grid.grid, prevState);
        t.equal(differences.length, 3, 'Only 3 boxes moved.');

        t.end();
    });

    test('Another simple collision', function (t) {
        // Mockup.
        var differences = void 0,
            prevState = void 0;

        var boxes = [{ 'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 3 }, { 'row': 2, 'column': 0, 'rowspan': 1, 'columnspan': 4 }, { 'row': 3, 'column': 0, 'rowspan': 1, 'columnspan': 4 }];
        var grid = dashGridGlobal('#grid', { boxes: boxes });

        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[0], { row: 2 });
        differences = diff(grid.grid, prevState);

        // Tests.
        t.plan(4);

        t.equal(boxes[0].row, 2, 'Should move.');
        t.equal(boxes[1].row, 4, 'Should move.');
        t.equal(boxes[2].row, 5, 'Should move.');
        t.equal(differences.length, 3, 'Should move.');

        t.end();
    });

    test('Column collision', function (t) {
        var differences = void 0,
            prevState = void 0;

        // Mockup.
        var boxes = [{ 'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 2 }, { 'row': 0, 'column': 2, 'rowspan': 2, 'columnspan': 1 }, { 'row': 1, 'column': 3, 'rowspan': 2, 'columnspan': 1 }];
        var grid = dashGridGlobal('#grid', { boxes: boxes });

        // Tests.
        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[0], { column: 2 });
        differences = diff(grid.grid, prevState);

        t.plan(4);

        t.equal(boxes[0].column, 2, 'Should move.');
        t.equal(boxes[1].row, 2, 'Should move.');
        t.equal(boxes[2].row, 2, 'Should move.');
        t.equal(differences.length, 3, 'Should move.');

        t.end();
    });

    test('Complete collision', function (t) {
        var differences = void 0,
            prevState = void 0;

        // Mockup.
        var boxes = [{ 'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 2 }, { 'row': 2, 'column': 2, 'rowspan': 2, 'columnspan': 2 }];

        var grid = dashGridGlobal('#grid', { boxes: boxes });

        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[0], { row: 2, column: 2 });
        differences = diff(grid.grid, prevState);

        // Tests.
        t.plan(5);
        t.equal(boxes[0].row, 2, 'Should move.');
        t.equal(boxes[0].column, 2, 'Should move.');
        t.equal(boxes[1].row, 4, 'Should move.');
        t.equal(boxes[1].column, 2, 'Should move.');
        t.equal(differences.length, 3, 'Should move.');
        t.end();
    });

    test('Collision outside boundary.', function (t) {
        var differences = void 0,
            prevState = void 0;

        // Mockup.
        var boxes = [{ 'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 2 }, { 'row': 2, 'column': 0, 'rowspan': 4, 'columnspan': 2 }];
        var grid = dashGridGlobal('#grid', { boxes: boxes, maxRows: 6 });

        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[0], { row: 1 });
        differences = diff(grid.grid, prevState);

        // Tests.
        t.plan(3);

        t.equal(boxes[0].row, 0, 'Should not move.');
        t.equal(boxes[1].row, 2, 'Should not move.');
        t.equal(differences, undefined, 'Should not move.');

        t.end();
    });

    test('Collision from under.', function (t) {
        var differences = void 0,
            prevState = void 0;

        var boxes = [{ 'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 2 }, { 'row': 2, 'column': 0, 'rowspan': 4, 'columnspan': 2 }];

        var grid = dashGridGlobal('#grid', { boxes: boxes, maxRows: 6 });
        t.plan(12);

        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[1], { row: 1 });
        differences = diff(grid.grid, prevState);
        t.equal(boxes[0].row, 0, 'Should not move.');
        t.equal(boxes[1].row, 2, 'Should not move.');
        t.equal(differences, undefined, 'Should not move.');

        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[1], { row: 0 });
        differences = diff(grid.grid, prevState);
        t.equal(boxes[0].row, 4, 'Should move.');
        t.equal(boxes[1].row, 0, 'Should move.');
        t.equal(differences.length, 2, 'Should not move.');

        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[0], { row: 3 });
        differences = diff(grid.grid, prevState);
        t.equal(boxes[0].row, 4, 'Should not move.');
        t.equal(boxes[1].row, 0, 'Should not move.');
        t.equal(differences, undefined, 'Should not move.');

        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[0], { row: 0 });
        differences = diff(grid.grid, prevState);
        t.equal(boxes[0].row, 0, 'Should not move.');
        t.equal(boxes[1].row, 2, 'Should not move.');
        t.equal(differences.length, 2, 'Should not move.');

        t.end();
    });
}

},{"../util.js":72,"deep-diff":8,"deepcopy":12}],67:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = boxMove;

var _util = require('../util.js');

var diff = require('deep-diff').diff;
var deepcopy = require('deepcopy');

// TODO: move row AND column.

function boxMove(dashGridGlobal, test) {

    test('Moving box outside visible window.', function (t) {
        // Mockup.
        var differences = void 0,
            prevState = void 0;
        var boxes = [{ 'row': 0, 'column': 8, 'rowspan': 3, 'columnspan': 3 }];
        var grid = dashGridGlobal(document.getElementById('grid'), { boxes: boxes });

        t.plan(28);

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { column: grid.grid.boxes[0].column + 9999 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].column, 0, 'Move 1 step north outside boundary');
        t.equal(differences, undefined, 'Move 1 step north outside boundary');
    });

    test('Move boxes', function (t) {

        // Mockup.
        var differences = void 0,
            prevState = void 0;
        var boxes = [{ 'row': 0, 'column': 0, 'rowspan': 3, 'columnspan': 3 }];
        var grid = dashGridGlobal('#grid', { boxes: boxes });

        t.plan(28);
        /**
         * Moving inside boundary.
         */
        // Move down 1 row.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { row: grid.grid.boxes[0].row + 1 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].row, 1, 'Move down 1 step');
        t.equal(differences.length, 1, 'Move down 1 step');

        // Move up 1 row.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { row: grid.grid.boxes[0].row - 1 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].row, 0, 'Move up 1 step');
        t.equal(differences.length, 1, 'Move down 1 step');

        // Move down 2 rows.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { row: grid.grid.boxes[0].row + 2 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].row, 2, 'Move up 2 step');
        t.equal(differences.length, 1, 'Move down 2 step');

        // Move up 2 rows.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { row: grid.grid.boxes[0].row - 2 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].row, 0, 'Move up 2 step');
        t.equal(differences.length, 1, 'Move down 2 step');

        // Move to right 1 column.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { column: grid.grid.boxes[0].column + 1 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].column, 1, 'Move 1 step right');
        t.equal(differences.length, 1, 'Move 1 step right');

        // Move to left 1 column.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { column: grid.grid.boxes[0].column - 1 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].column, 0, 'Move 1 step left');
        t.equal(differences.length, 1, 'Move 1 step left');

        // Move to right 2 columns.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { column: grid.grid.boxes[0].column + 2 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].column, 2, 'Move 2 step right');
        t.equal(differences.length, 1, 'Move 2 step right');

        // Move to left 2 columns.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { column: grid.grid.boxes[0].column - 2 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].column, 0, 'Move 2 step left');
        t.equal(differences.length, 1, 'Move 2 step left');

        /**
         * Out-of-bound up-down left-right
         */
        // Attempt to move part of box outside top border.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { row: grid.grid.boxes[0].row - 1 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].row, 0, 'Move 1 step north outside boundary');
        t.equal(differences, undefined, 'Move 1 step north outside boundary');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { row: grid.grid.boxes[0].row - 9999 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].row, 0, 'Move 1 step north outside boundary');
        t.equal(differences, undefined, 'Move 1 step north outside boundary');

        // Attempt to move out of bound row-wise (+).
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { row: grid.grid.boxes[0].row + 9999 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].row, 0, 'Move 1 step north outside boundary');
        t.equal(differences, undefined, 'Move 1 step north outside boundary');

        // Attempt to move part of box outside left border.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { column: grid.grid.boxes[0].column - 1 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].column, 0, 'Move 1 step north outside boundary');
        t.equal(differences, undefined, 'Move 1 step north outside boundary');

        // Attempt to move whole box outside left border.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { column: grid.grid.boxes[0].column - 9999 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].column, 0, 'Move 1 step north outside boundary');
        t.equal(differences, undefined, 'Move 1 step north outside boundary');

        // Attempt to move whole box outside right border.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { column: grid.grid.boxes[0].column + 9999 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].column, 0, 'Move 1 step north outside boundary');
        t.equal(differences, undefined, 'Move 1 step north outside boundary');

        t.end();
    });
}

},{"../util.js":72,"deep-diff":8,"deepcopy":12}],68:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = boxResize;

var _util = require('../util.js');

var diff = require('deep-diff').diff;
var deepcopy = require('deepcopy');

// TODO: resize columnspan AND rowspan test.
function boxResize(dashGridGlobal, test) {
    test('Resize boxes', function (t) {
        // Mockup.
        var differences = void 0,
            prevState = void 0;
        var boxes = [{ 'row': 0, 'column': 0, 'rowspan': 3, 'columnspan': 3 }];
        var grid = dashGridGlobal('#grid', { boxes: boxes });

        t.plan(44);
        /**
         * VALID MOVES.
         */

        // Resize down 1 row.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { rowspan: grid.grid.boxes[0].rowspan + 1 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].rowspan, 4, 'Positive rowspan resize');
        t.equal(differences.length, 1, 'Positive rowspan resize');

        // Resize up 1 row.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { rowspan: grid.grid.boxes[0].rowspan - 1 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].rowspan, 3, 'Negative rowspan resize');
        t.equal(differences.length, 1, 'Negative rowspan resize');

        // Resize down 2 row.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { rowspan: grid.grid.boxes[0].rowspan + 2 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].rowspan, 5, 'Positive rowspan resize');
        t.equal(differences.length, 1, 'Positive rowspan resize');

        // Resize up 2 row.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { rowspan: grid.grid.boxes[0].rowspan - 2 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].rowspan, 3, 'Negative rowspan resize');
        t.equal(differences.length, 1, 'Negative rowspan resize');

        // Resize to right 1 columnspan.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { columnspan: grid.grid.boxes[0].columnspan + 1 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, 4, 'Resize 1 step columnspan');
        t.equal(differences.length, 1, 'Resize 1 step columnspan');

        // Resize to left 1 columnspan.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { columnspan: grid.grid.boxes[0].columnspan - 1 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, 3, 'Resize 1 step left');
        t.equal(differences.length, 1, 'Resize 1 step left');

        // Resize to columnspan 2 columns.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { columnspan: grid.grid.boxes[0].columnspan + 2 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, 5, 'Resize 2 step columnspan');
        t.equal(differences.length, 1, 'Resize 2 step columnspan');

        // Resize to left 2 columns.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { columnspan: grid.grid.boxes[0].columnspan - 2 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, 3, 'Resize 2 step columnspan');
        t.equal(differences.length, 1, 'Resize 2 step columnspan');

        /**
         * NONE VALID MOVES.
         */
        // Attempt to Resize part of box outside top border.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { rowspan: grid.grid.boxes[0].rowspan - 3 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].rowspan, prevState.boxes[0].rowspan, 'Resize 0 rowspan');
        t.equal(differences, undefined, 'Resize 0 rowspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { rowspan: grid.grid.boxes[0].rowspan - 9999 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].rowspan, prevState.boxes[0].rowspan, 'Resize - rowspan');
        t.equal(differences, undefined, 'Resize - rowspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { rowspan: grid.grid.boxes[0].rowspan + 9999 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].rowspan, prevState.boxes[0].rowspan, 'Resize + rowspan');
        t.equal(differences, undefined, 'Resize + rowspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { columnspan: grid.grid.boxes[0].columnspan - 3 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, prevState.boxes[0].columnspan, 'Resize 0 columnspan');
        t.equal(differences, undefined, 'Resize 0 columnspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { columnspan: grid.grid.boxes[0].columnspan - 9999 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, prevState.boxes[0].columnspan, 'Resize - columnspan');
        t.equal(differences, undefined, 'Resize - columnspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { columnspan: grid.grid.boxes[0].columnspan + 9999 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, prevState.boxes[0].columnspan, 'Resize + columnspan');
        t.equal(differences, undefined, 'Resize + columnspan');

        /**
         * Testing min/max Columnspan and min/max Rowspan.
         */
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { columnspan: grid.grid.boxes[0].columnspan - 9999 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, prevState.boxes[0].columnspan, 'Resize - columnspan');
        t.equal(differences, undefined, 'Resize - columnspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { columnspan: grid.grid.boxes[0].columnspan + 9999 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, prevState.boxes[0].columnspan, 'Resize + columnspan');
        t.equal(differences, undefined, 'Resize + columnspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { columnspan: grid.grid.boxes[0].columnspan - 9999 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, prevState.boxes[0].columnspan, 'Resize - columnspan');
        t.equal(differences, undefined, 'Resize - columnspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { columnspan: grid.grid.boxes[0].columnspan + 9999 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, prevState.boxes[0].columnspan, 'Resize + columnspan');
        t.equal(differences, undefined, 'Resize + columnspan');

        boxes = [{ 'row': 0, 'column': 0, 'rowspan': 3, 'columnspan': 3 }];
        grid = dashGridGlobal('#grid', { boxes: boxes, 'minRowspan': 2, 'maxRowspan': 4, 'minColumnspan': 2, 'maxColumnspan': 4 });
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { rowspan: grid.grid.boxes[0].rowspan - 2 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].rowspan, prevState.boxes[0].rowspan, 'Resize - rowspan');
        t.equal(differences, undefined, 'Resize - rowspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { rowspan: grid.grid.boxes[0].rowspan + 2 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].rowspan, prevState.boxes[0].rowspan, 'Resize - rowspan');
        t.equal(differences, undefined, 'Resize - rowspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { columnspan: grid.grid.boxes[0].columnspan - 2 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, prevState.boxes[0].columnspan, 'Resize - columnspan');
        t.equal(differences, undefined, 'Resize - columnspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], { columnspan: grid.grid.boxes[0].columnspan + 2 });
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, prevState.boxes[0].columnspan, 'Resize - columnspan');
        t.equal(differences, undefined, 'Resize - columnspan');

        // Valid and invalid move at the same time

        // Valid and valid move at the same time

        // Invalid and invalid move at the same time

        t.end();
    });
}

},{"../util.js":72,"deep-diff":8,"deepcopy":12}],69:[function(require,module,exports){
"use strict";

},{}],70:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = gridResize;

var _util = require('../util.js');

var diff = require('deep-diff').diff;
var deepcopy = require('deepcopy');

function gridResize(dashGridGlobal, test) {
    // Mockup.
    var differences = void 0,
        prevState = void 0;
    var boxes = [{ row: 0, column: 0, rowspan: 3, columnspan: 3 }];
    var grid = dashGridGlobal('#grid', { boxes: boxes });
}

},{"../util.js":72,"deep-diff":8,"deepcopy":12}],71:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = initGrid;

var _util = require('../util.js');

function initGrid(dashGridGlobal, test) {
    // Mockup.
    var boxes = [{ 'row': 0, 'column': 0, 'rowspan': 3, 'columnspan': 3, 'floating': false, 'swapping': false, 'pushable': true, 'resizable': true, 'draggable': true }];

    test('Initialize Grid using default values', function (t) {
        var dashgrid = dashGridGlobal(document.getElementById('grid'), {});

        // Check that grid object gets all properties.
        t.notEqual(dashgrid.dashgrid, undefined, 'Returns object');
        t.notEqual(dashgrid.dashgrid, undefined, 'Has grid options');
        t.notEqual(dashgrid.updateBox, undefined, 'Has API updateBox');
        t.notEqual(dashgrid.insertBox, undefined, 'Has API insertBox');
        t.notEqual(dashgrid.removeBox, undefined, 'Has API removeBox');

        t.equal(dashgrid.dashgrid._element.nodeName, 'DIV', 'Grid Element initialized');
        t.equal(Array.isArray(dashgrid.dashgrid.boxes), true, 'Boxes is array');

        t.equal((0, _util.isNumber)(dashgrid.dashgrid.numRows), true, 'numRows initialized');
        t.equal((0, _util.isNumber)(dashgrid.dashgrid.minRows), true, 'minRows initialized');
        t.equal((0, _util.isNumber)(dashgrid.dashgrid.maxRows), true, 'maxRows initialized');

        t.equal((0, _util.isNumber)(dashgrid.dashgrid.numColumns), true, 'numColumns initialized');
        t.equal((0, _util.isNumber)(dashgrid.dashgrid.minColumns), true, 'minColumns initialized');
        t.equal((0, _util.isNumber)(dashgrid.dashgrid.maxColumns), true, 'maxColumns initialized');

        t.equal((0, _util.isNumber)(dashgrid.dashgrid.minRowspan), true, 'minRowspan initialized');
        t.equal((0, _util.isNumber)(dashgrid.dashgrid.maxRowspan), true, 'maxRowspan initialized');
        t.equal((0, _util.isNumber)(dashgrid.dashgrid.minColumnspan), true, 'minColumnspan initialized');
        t.equal((0, _util.isNumber)(dashgrid.dashgrid.maxColumnspan), true, 'maxColumnspan initialized');

        t.equal((0, _util.isNumber)(dashgrid.dashgrid.xMargin), true, 'xMargin initialized');
        t.equal((0, _util.isNumber)(dashgrid.dashgrid.yMargin), true, 'yMargin initialized');

        // t.equal(typeof grid.pushable, 'boolean', 'pushable initialized');
        // t.equal(typeof grid.floating, 'boolean', 'floating initialized');
        // t.equal(typeof grid.stacking, 'boolean', 'stacking initialized');
        // t.equal(typeof grid.swapping, 'boolean', 'swapping initialized');

        t.equal(_typeof(dashgrid.dashgrid.animate), 'boolean', 'animate initialized');
        t.equal(_typeof(dashgrid.dashgrid.liveChanges), 'boolean', 'liveChanges initialized');
        // t.equal(isNumber(dashgrid.dashgrid.mobileBreakPoint), true, 'mobileBreakPoint initialized');
        // t.equal(typeof grid.mobileBreakPointEnabled, 'boolean', 'mobileBreakPointEnabled initialized');

        t.equal((0, _util.isNumber)(dashgrid.dashgrid.scrollSensitivity), true, 'scrollSensitivity initialized');
        t.equal((0, _util.isNumber)(dashgrid.dashgrid.scrollSpeed), true, 'scrollSpeed initialized');

        t.equal((0, _util.isNumber)(dashgrid.dashgrid.snapBackTime), true, 'snapBackTime initialized');
        t.equal(_typeof(dashgrid.dashgrid.showGridLines), 'boolean', 'showGridLines initialized');
        t.equal(_typeof(dashgrid.dashgrid.showGridCentroids), 'boolean', 'showGridCentroids initialized');

        t.equal(_typeof(dashgrid.dashgrid.draggable), 'object', 'draggable initialized');
        t.equal(_typeof(dashgrid.dashgrid.draggable.enabled), 'boolean', 'draggable.enabled initialized');
        t.equal(dashgrid.dashgrid.draggable.handle, 'dashgrid-box', 'draggable.handles initialized');
        t.equal(dashgrid.dashgrid.draggable.dragStart, undefined, 'dragStart initialized');
        t.equal(dashgrid.dashgrid.draggable.dragging, undefined, 'dragging initialized');
        t.equal(dashgrid.dashgrid.draggable.dragEnd, undefined, 'dragEnd initialized');

        t.equal(_typeof(dashgrid.dashgrid.resizable), 'object', 'resizable initialized');
        t.equal(_typeof(dashgrid.dashgrid.resizable.enabled), 'boolean', 'enabled initialized');
        t.equal(Array.isArray(dashgrid.dashgrid.resizable.handle), true, 'resizable handles initialized');
        t.equal((0, _util.isNumber)(dashgrid.dashgrid.resizable.handleWidth), true, 'handleWidth initialized');
        t.equal(dashgrid.dashgrid.resizable.resizeStart, undefined, 'resizeStart initialized');
        t.equal(dashgrid.dashgrid.resizable.resizing, undefined, 'resizing initialized');
        t.equal(dashgrid.dashgrid.resizable.resizeEnd, undefined, 'resize initialized');

        t.end();
    });

    test('Initialize Grid using manually entered values', function (t) {

        var gs = {
            boxes: [],
            rowHeight: 80,
            numRows: 10,
            minRows: 10,
            maxRows: 10,
            columnWidth: 120,
            numColumns: 6,
            minColumns: 6,
            maxColumns: 10,
            xMargin: 20,
            yMargin: 10,
            draggable: {
                enabled: true,
                handle: undefined,
                dragStart: function dragStart() {},
                dragging: function dragging() {},
                dragEnd: function dragEnd() {}
            },
            resizable: {
                enabled: true,
                handle: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
                handleWidth: 10,
                resizeStart: function resizeStart() {},
                resizing: function resizing() {},
                resizeEnd: function resizeEnd() {}
            },
            minRowspan: 1,
            maxRowspan: 10,
            minColumnspan: 1,
            maxColumnspan: 10,
            pushable: true,
            floating: false,
            stacking: false,
            swapping: false,
            animate: true,
            liveChanges: true,
            mobileBreakPoint: 600,
            mobileBreakPointEnabled: false,
            scrollSensitivity: 20,
            scrollSpeed: 10,
            snapBackTime: 400,
            showGridLines: true,
            showGridCentroids: true
        };
        var dashgrid = dashGridGlobal(document.getElementById('grid'), gs);

        // Check that grid object gets all properties.
        t.notEqual(dashgrid.dashgrid, undefined, 'Returns object');
        t.notEqual(dashgrid.dashgrid, undefined, 'Has grid options');
        t.notEqual(dashgrid.updateBox, undefined, 'Has API updateBox');
        t.notEqual(dashgrid.insertBox, undefined, 'Has API insertBox');
        t.notEqual(dashgrid.removeBox, undefined, 'Has API removeBox');

        t.equal(dashgrid.dashgrid._element.nodeName, 'DIV', 'Grid Element initialized');
        t.equal(Array.isArray(dashgrid.dashgrid.boxes), true, 'Boxes is array');

        t.equal(dashgrid.dashgrid.rowHeight, gs.rowHeight, 'RowHeight initialized');
        t.equal(dashgrid.dashgrid.numRows, gs.numRows, 'numRows initialized');
        t.equal(dashgrid.dashgrid.minRows, gs.minRows, 'minRows initialized');
        t.equal(dashgrid.dashgrid.maxRows, gs.maxRows, 'maxRows initialized');

        t.equal(dashgrid.dashgrid.columnWidth, gs.columnWidth, 'columnWidth initialized');
        t.equal(dashgrid.dashgrid.numColumns, gs.numColumns, 'numColumns initialized');
        t.equal(dashgrid.dashgrid.minColumns, gs.minColumns, 'minColumns initialized');
        t.equal(dashgrid.dashgrid.maxColumns, gs.maxColumns, 'maxColumns initialized');

        t.equal(dashgrid.dashgrid.minRowspan, gs.minRowspan, 'minRowspan initialized');
        t.equal(dashgrid.dashgrid.maxRowspan, gs.maxRowspan, 'maxRowspan initialized');
        t.equal(dashgrid.dashgrid.minColumnspan, gs.minColumnspan, 'minColumnspan initialized');
        t.equal(dashgrid.dashgrid.maxColumnspan, gs.maxColumnspan, 'maxColumnspan initialized');

        t.equal(dashgrid.dashgrid.xMargin, gs.xMargin, 'xMargin initialized');
        t.equal(dashgrid.dashgrid.yMargin, gs.yMargin, 'yMargin initialized');

        t.equal(dashgrid.dashgrid.pushable, gs.pushable, 'pushable initialized');
        t.equal(dashgrid.dashgrid.floating, gs.floating, 'floating initialized');
        t.equal(dashgrid.dashgrid.stacking, gs.stacking, 'stacking initialized');
        t.equal(dashgrid.dashgrid.swapping, gs.swapping, 'swapping initialized');

        t.equal(dashgrid.dashgrid.animate, gs.animate, 'animate initialized');
        t.equal(dashgrid.dashgrid.liveChanges, gs.liveChanges, 'liveChanges initialized');

        // t.equal(dashgrid.dashgrid.mobileBreakPoint, gs.mobileBreakPoint, 'mobileBreakPoint initialized');
        // t.equal(dashgrid.dashgrid.mobileBreakPointEnabled, gs.mobileBreakPointEnabled, 'mobileBreakPointEnabled initialized');

        t.equal(dashgrid.dashgrid.scrollSensitivity, gs.scrollSensitivity, 'scrollSensitivity initialized');
        t.equal(dashgrid.dashgrid.scrollSpeed, gs.scrollSpeed, 'scrollSpeed initialized');

        t.equal(dashgrid.dashgrid.snapBackTime, gs.snapBackTime, 'snapBackTime initialized');
        t.equal(dashgrid.dashgrid.showGridLines, gs.showGridLines, 'showGridLines initialized');
        t.equal(dashgrid.dashgrid.showGridCentroids, gs.showGridCentroids, 'showGridCentroids initialized');

        t.equal(_typeof(dashgrid.dashgrid.draggable), 'object', 'draggable initialized');
        t.equal(dashgrid.dashgrid.draggable.enabled, true, 'draggable.enabled initialized');
        t.equal(dashgrid.dashgrid.draggable.handle, 'dashgrid-box', 'draggable.handle initialized');
        t.equal(_typeof(dashgrid.dashgrid.draggable.dragStart), 'function', 'dragStart initialized');
        t.equal(_typeof(dashgrid.dashgrid.draggable.dragging), 'function', 'dragging initialized');
        t.equal(_typeof(dashgrid.dashgrid.draggable.dragEnd), 'function', 'dragEnd initialized');

        t.equal(_typeof(dashgrid.dashgrid.resizable), 'object', 'resizable initialized');
        t.equal(dashgrid.dashgrid.resizable.enabled, gs.resizable.enabled, 'resizable enabled initialized');
        t.equal((0, _util.arraysEqual)(dashgrid.dashgrid.resizable.handle, ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw']), true, 'resizable handles initialized');
        t.equal(dashgrid.dashgrid.resizable.handleWidth, gs.resizable.handleWidth, 'handleWidth initialized');
        t.equal(_typeof(dashgrid.dashgrid.resizable.resizeStart), 'function', 'resizeStart initialized');
        t.equal(_typeof(dashgrid.dashgrid.resizable.resizing), 'function', 'resizing initialized');
        t.equal(_typeof(dashgrid.dashgrid.resizable.resizeEnd), 'function', 'resize initialized');

        t.end();
    });
}

},{"../util.js":72}],72:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.eventFire = eventFire;
exports.decorateRunAll = decorateRunAll;
exports.isNumber = isNumber;
exports.isFunction = isFunction;
exports.arraysEqual = arraysEqual;
function eventFire(el, etype) {
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

function decorateRunAll(t, o1, o2) {
    t.all = function () {
        Object.keys(t).forEach(function (key) {
            if (key !== 'all') {
                t[key](o1, o2);
            }
        });
    };
}

function isNumber(obj) {
    return !Array.isArray(obj) && obj - parseFloat(obj) + 1 >= 0;
}

function isFunction(object) {
    // return object && getClass.call(object) == '[object Function]';
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

},{}],73:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Box;

/**
 *
 * @param {}
 * @returns
 */

function Box(comp) {
    var dashgrid = comp.dashgrid;

    /**
     * Create Box element.
     * @param {Object} box box.
     */

    var createBox = function createBox(box) {
        Object.assign(box, boxSettings(box, dashgrid));
        if (box.content) {
            box._element.appendChild(box.content);
        }

        dashgrid._boxesElement.appendChild(box._element);
    };

    /**
     * Creates the shadow box element which is used when dragging / resizing
     *     a box. It gets attached to the dragging / resizing box, while
     *     box gets to move / resize freely and snaps back to its original
     *     or new position at drag / resize stop. Append it to the grid.
     */
    var createShadowBox = function createShadowBox() {
        if (document.getElementById('dashgrid-shadow-box') === null) {
            dashgrid._shadowBoxElement = document.createElement('div');
            dashgrid._shadowBoxElement.id = 'dashgrid-shadow-box';

            dashgrid._shadowBoxElement.className = 'dashgrid-shadow-box';
            dashgrid._shadowBoxElement.style.position = 'absolute';
            dashgrid._shadowBoxElement.style.display = '';
            dashgrid._shadowBoxElement.style.zIndex = 1002;
            dashgrid._element.appendChild(dashgrid._shadowBoxElement);
        }
    };

    return Object.freeze({ createBox: createBox, createShadowBox: createShadowBox });
}

/**
 * Box properties and events.
 */
function boxSettings(boxElement, dashgrid) {
    return {
        _element: function () {
            var el = document.createElement('div');
            el.className = 'dashgrid-box';
            el.style.position = 'absolute';
            el.style.cursor = 'move';
            el.style.transition = dashgrid.transition;
            el.style.zIndex = 1003;
            createBoxResizeHandlers(el, dashgrid);

            return el;
        }(),

        row: boxElement.row,
        column: boxElement.column,
        rowspan: boxElement.rowspan || 1,
        columnspan: boxElement.columnspan || 1,
        draggable: boxElement.draggable === false ? false : true,
        resizable: boxElement.resizable === false ? false : true,
        pushable: boxElement.pushable === false ? false : true,
        floating: boxElement.floating === true ? true : false,
        stacking: boxElement.stacking === true ? true : false,
        swapping: boxElement.swapping === true ? true : false,
        inherit: boxElement.inherit === true ? true : false
    };
}

/**
 * Creates box resize handlers and appends them to box.
 */
function createBoxResizeHandlers(boxElement, dashgrid) {
    var handle = void 0;

    /**
     * TOP Handler.
     */
    if (dashgrid.resizable.handle.indexOf('n') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-n';
        handle.style.left = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = '100%';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 'n-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * BOTTOM Handler.
     */
    if (dashgrid.resizable.handle.indexOf('s') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-s';
        handle.style.left = 0 + 'px';
        handle.style.bottom = 0 + 'px';
        handle.style.width = '100%';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 's-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * WEST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('w') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-w';
        handle.style.left = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = '100%';
        handle.style.cursor = 'w-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * EAST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('e') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-e';
        handle.style.right = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = '100%';
        handle.style.cursor = 'e-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * NORTH-EAST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('ne') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-ne';
        handle.style.right = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 'ne-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * SOUTH-EAST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('se') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-se';
        handle.style.right = 0 + 'px';
        handle.style.bottom = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 'se-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * SOUTH-WEST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('sw') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-sw';
        handle.style.left = 0 + 'px';
        handle.style.bottom = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 'sw-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * NORTH-WEST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('nw') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-nw';
        handle.style.left = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 'nw-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }
}

},{}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('./shims.js');

var _grid = require('./grid.js');

var _grid2 = _interopRequireDefault(_grid);

var _box = require('./box.js');

var _box2 = _interopRequireDefault(_box);

var _renderer = require('./renderer.js');

var _renderer2 = _interopRequireDefault(_renderer);

var _mouse = require('./mouse.js');

var _mouse2 = _interopRequireDefault(_mouse);

var _drag = require('./drag.js');

var _drag2 = _interopRequireDefault(_drag);

var _resize = require('./resize.js');

var _resize2 = _interopRequireDefault(_resize);

var _utils = require('./utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Dashgrid;

/**
 * The DOM representation is:
 *    <div class="dashgrid">
 *        <!-- Boxes -->
 *        <div class="dashgrid-boxes">
 *            <div class="dashgrid-box">
 *                <div class="content-element"></div>
 *                <div class="dashgrid-box-resize-handle-n"></div>
 *                <div class="dashgrid-box-resize-handle-e"></div>
 *                <div class="dashgrid-box-resize-handle-w"></div>
 *                <div class="dashgrid-box-resize-handle-s"></div>
 *                <div class="dashgrid-box-resize-handle-ne"></div>
 *                <div class="dashgrid-box-resize-handle-nw"></div>
 *                <div class="dashgrid-box-resize-handle-se"></div>
 *                <div class="dashgrid-box-resize-handle-sw"></div>
 *            </div>
 *        </div>
 *
 *        <!-- Shadow Box -->
 *        <div class="dashgrid-shadow-box"></div>
 *
 *        <!-- Grid Lines -->
 *        <div class="dashgrid-grid-lines"></div>
 *
 *        <!-- Grid Centroids -->
 *        <div class="dashgrid-grid-centroids"></div>
 *    </div>
 * @param {Object} element The dashgrid element.
 * @param {Object} gs Grid settings.
 */

function Dashgrid(element, gs) {
    var dashgrid = Object.assign({}, dashgridSettings(gs, element));

    var renderer = (0, _renderer2.default)({ dashgrid: dashgrid });
    var boxHandler = (0, _box2.default)({ dashgrid: dashgrid });
    var grid = (0, _grid2.default)({ dashgrid: dashgrid, renderer: renderer, boxHandler: boxHandler });
    var dragger = (0, _drag2.default)({ dashgrid: dashgrid, renderer: renderer, grid: grid });
    var resizer = (0, _resize2.default)({ dashgrid: dashgrid, renderer: renderer, grid: grid });
    var mouse = (0, _mouse2.default)({ dragger: dragger, resizer: resizer, dashgrid: dashgrid, grid: grid });

    // Initialize.
    boxHandler.createShadowBox();
    grid.init();
    mouse.init();

    // Event listeners.
    (0, _utils.addEvent)(window, 'resize', function () {
        renderer.setColumnWidth();
        renderer.setRowHeight();
        grid.refreshGrid();
    });

    // User event after grid is done loading.
    if (dashgrid.onGridReady) {
        dashgrid.onGridReady();
    } // user event.

    // API.
    return Object.freeze({
        updateBox: grid.updateBox,
        insertBox: grid.insertBox,
        removeBox: grid.removeBox,
        getBoxes: grid.getBoxes,
        refreshGrid: grid.refreshGrid,
        dashgrid: dashgrid
    });
}

/**
 * Grid properties and events.
 */
function dashgridSettings(gs, element) {
    var dashgrid = {
        _element: function () {
            element.style.position = 'absolute';
            element.style.top = '0px';
            element.style.left = '0px';
            element.style.display = 'block';
            element.style.zIndex = '1000';
            (0, _utils.removeNodes)(element);
            return element;
        }(),

        boxes: gs.boxes || [],

        rowHeight: gs.rowHeight,
        numRows: gs.numRows !== undefined ? gs.numRows : 6,
        minRows: gs.minRows !== undefined ? gs.minRows : 6,
        maxRows: gs.maxRows !== undefined ? gs.maxRows : 10,

        extraRows: 0,
        extraColumns: 0,

        columnWidth: gs.columnWidth,
        numColumns: gs.numColumns !== undefined ? gs.numColumns : 6,
        minColumns: gs.minColumns !== undefined ? gs.minColumns : 6,
        maxColumns: gs.maxColumns !== undefined ? gs.maxColumns : 10,

        xMargin: gs.xMargin !== undefined ? gs.xMargin : 20,
        yMargin: gs.yMargin !== undefined ? gs.yMargin : 20,

        defaultBoxRowspan: 2,
        defaultBoxColumnspan: 1,

        minRowspan: gs.minRowspan !== undefined ? gs.minRowspan : 1,
        maxRowspan: gs.maxRowspan !== undefined ? gs.maxRowspan : 9999,

        minColumnspan: gs.minColumnspan !== undefined ? gs.minColumnspan : 1,
        maxColumnspan: gs.maxColumnspan !== undefined ? gs.maxColumnspan : 9999,

        pushable: gs.pushable === false ? false : true,
        floating: gs.floating === true ? true : false,
        stacking: gs.stacking === true ? true : false,
        swapping: gs.swapping === true ? true : false,
        animate: gs.animate === true ? true : false,

        liveChanges: gs.liveChanges === false ? false : true,

        // Drag handle can be a custom classname or if not set revers to the
        // box container with classname 'dashgrid-box'.
        draggable: {
            enabled: gs.draggable && gs.draggable.enabled === false ? false : true,
            handle: gs.draggable && gs.draggable.handle || 'dashgrid-box',

            // user cb's.
            dragStart: gs.draggable && gs.draggable.dragStart,
            dragging: gs.draggable && gs.draggable.dragging,
            dragEnd: gs.draggable && gs.draggable.dragEnd
        },

        resizable: {
            enabled: gs.resizable && gs.resizable.enabled === false ? false : true,
            handle: gs.resizable && gs.resizable.handle || ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
            handleWidth: gs.resizable && gs.resizable.handleWidth !== undefined ? gs.resizable.handleWidth : 10,

            // user cb's.
            resizeStart: gs.resizable && gs.resizable.resizeStart,
            resizing: gs.resizable && gs.resizable.resizing,
            resizeEnd: gs.resizable && gs.resizable.resizeEnd
        },

        onUpdate: function onUpdate() {},

        transition: 'opacity .3s, left .3s, top .3s, width .3s, height .3s',
        scrollSensitivity: 20,
        scrollSpeed: 10,
        snapBackTime: gs.snapBackTime === undefined ? 300 : gs.snapBackTime,

        showGridLines: gs.showGridLines === false ? false : true,
        showGridCentroids: gs.showGridCentroids === false ? false : true
    };

    dashgrid._boxesElement = function () {
        var boxesElement = document.createElement('div');
        boxesElement.className = 'dashgrid-boxes';
        dashgrid._element.appendChild(boxesElement);
        return boxesElement;
    }();

    dashgrid;

    return dashgrid;
}

},{"./box.js":73,"./drag.js":75,"./grid.js":76,"./mouse.js":79,"./renderer.js":80,"./resize.js":81,"./shims.js":82,"./utils.js":83}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Dragger;


function Dragger(comp) {
    var dashgrid = comp.dashgrid;
    var renderer = comp.renderer;
    var grid = comp.grid;


    var eX = void 0,
        eY = void 0,
        eW = void 0,
        eH = void 0,
        mouseX = 0,
        mouseY = 0,
        lastMouseX = 0,
        lastMouseY = 0,
        mOffX = 0,
        mOffY = 0,
        minTop = dashgrid.yMargin,
        minLeft = dashgrid.xMargin,
        currState = {},
        prevState = {};

    /**
     * Create shadowbox, remove smooth transitions for box,
     * and init mouse variables. Finally, make call to api to check if,
     * any box is close to bottom / right
     * @param {Object} box
     * @param {Object} e
     */
    var dragStart = function dragStart(box, e) {
        box._element.style.zIndex = 1004;
        box._element.style.transition = '';
        dashgrid._shadowBoxElement.style.left = box._element.style.left;
        dashgrid._shadowBoxElement.style.top = box._element.style.top;
        dashgrid._shadowBoxElement.style.width = box._element.style.width;
        dashgrid._shadowBoxElement.style.height = box._element.style.height;
        dashgrid._shadowBoxElement.style.display = '';

        // Mouse values.
        lastMouseX = e.pageX;
        lastMouseY = e.pageY;
        eX = parseInt(box._element.offsetLeft, 10);
        eY = parseInt(box._element.offsetTop, 10);
        eW = parseInt(box._element.offsetWidth, 10);
        eH = parseInt(box._element.offsetHeight, 10);

        grid.updateStart(box);

        if (dashgrid.draggable.dragStart) {
            dashgrid.draggable.dragStart();
        } // user event.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    var drag = function drag(box, e) {
        updateMovingElement(box, e);
        grid.updating(box);

        if (dashgrid.liveChanges) {
            // Which cell to snap preview box to.
            currState = renderer.getClosestCells({
                left: box._element.offsetLeft,
                right: box._element.offsetLeft + box._element.offsetWidth,
                top: box._element.offsetTop,
                bottom: box._element.offsetTop + box._element.offsetHeight
            });
            moveBox(box, e);
        }

        if (dashgrid.draggable.dragging) {
            dashgrid.draggable.dragging();
        } // user event.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    var dragEnd = function dragEnd(box, e) {
        if (!dashgrid.liveChanges) {
            // Which cell to snap preview box to.
            currState = renderer.getClosestCells({
                left: box._element.offsetLeft,
                right: box._element.offsetLeft + box._element.offsetWidth,
                top: box._element.offsetTop,
                bottom: box._element.offsetTop + box._element.offsetHeight
            });
            moveBox(box, e);
        }

        // Set box style.
        box._element.style.transition = dashgrid.transition;
        box._element.style.left = dashgrid._shadowBoxElement.style.left;
        box._element.style.top = dashgrid._shadowBoxElement.style.top;

        // Give time for previewbox to snap back to tile.
        setTimeout(function () {
            box._element.style.zIndex = 1003;
            dashgrid._shadowBoxElement.style.display = 'none';
            grid.updateEnd();
        }, dashgrid.snapBackTime);

        if (dashgrid.draggable.dragEnd) {
            dashgrid.draggable.dragEnd();
        } // user event.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    var moveBox = function moveBox(box, e) {
        if (currState.row !== prevState.row || currState.column !== prevState.column) {

            var prevScrollHeight = dashgrid._element.offsetHeight - window.innerHeight;
            var prevScrollWidth = dashgrid._element.offsetWidth - window.innerWidth;
            var validMove = grid.updateBox(box, currState, box);

            // updateGridDimension preview box.
            if (validMove) {

                renderer.setBoxElementYPosition(dashgrid._shadowBoxElement, currState.row);
                renderer.setBoxElementXPosition(dashgrid._shadowBoxElement, currState.column);

                var postScrollHeight = dashgrid._element.offsetHeight - window.innerHeight;
                var postScrollWidth = dashgrid._element.offsetWidth - window.innerWidth;

                // Account for minimizing scroll height when moving box upwards.
                // Otherwise bug happens where the dragged box is changed but directly
                // afterwards the dashgrid element dimension is changed.
                if (Math.abs(dashgrid._element.offsetHeight - window.innerHeight - window.scrollY) < 30 && window.scrollY > 0 && prevScrollHeight !== postScrollHeight) {
                    box._element.style.top = box._element.offsetTop - 100 + 'px';
                }

                if (Math.abs(dashgrid._element.offsetWidth - window.innerWidth - window.scrollX) < 30 && window.scrollX > 0 && prevScrollWidth !== postScrollWidth) {

                    box._element.style.left = box._element.offsetLeft - 100 + 'px';
                }
            }
        }

        // No point in attempting move if not switched to new cell.
        prevState = { row: currState.row, column: currState.column };
    };

    /**
     * The moving element,
     * @param {Object} box
     * @param {Object} e
     */
    var updateMovingElement = function updateMovingElement(box, e) {
        var maxLeft = dashgrid._element.offsetWidth - dashgrid.xMargin;
        var maxTop = dashgrid._element.offsetHeight - dashgrid.yMargin;

        // Get the current mouse position.
        mouseX = e.pageX;
        mouseY = e.pageY;

        // Get the deltas
        var diffX = mouseX - lastMouseX + mOffX;
        var diffY = mouseY - lastMouseY + mOffY;

        mOffX = 0;
        mOffY = 0;

        // Update last processed mouse positions.
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        var dX = diffX;
        var dY = diffY;
        if (eX + dX < minLeft) {
            diffX = minLeft - eX;
            mOffX = dX - diffX;
        } else if (eX + eW + dX > maxLeft) {
            diffX = maxLeft - eX - eW;
            mOffX = dX - diffX;
        }

        if (eY + dY < minTop) {
            diffY = minTop - eY;
            mOffY = dY - diffY;
        } else if (eY + eH + dY > maxTop) {
            diffY = maxTop - eY - eH;
            mOffY = dY - diffY;
        }
        eX += diffX;
        eY += diffY;

        box._element.style.top = eY + 'px';
        box._element.style.left = eX + 'px';

        // Scrolling when close to bottom boundary.
        if (e.pageY - document.body.scrollTop < dashgrid.scrollSensitivity) {
            document.body.scrollTop = document.body.scrollTop - dashgrid.scrollSpeed;
        } else if (window.innerHeight - (e.pageY - document.body.scrollTop) < dashgrid.scrollSensitivity) {
            document.body.scrollTop = document.body.scrollTop + dashgrid.scrollSpeed;
        }

        // Scrolling when close to right boundary.
        if (e.pageX - document.body.scrollLeft < dashgrid.scrollSensitivity) {
            document.body.scrollLeft = document.body.scrollLeft - dashgrid.scrollSpeed;
        } else if (window.innerWidth - (e.pageX - document.body.scrollLeft) < dashgrid.scrollSensitivity) {
            document.body.scrollLeft = document.body.scrollLeft + dashgrid.scrollSpeed;
        }
    };

    return Object.freeze({
        dragStart: dragStart,
        drag: drag,
        dragEnd: dragEnd
    });
}

},{}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _gridView = require('./gridView.js');

var _gridView2 = _interopRequireDefault(_gridView);

var _gridEngine = require('./gridEngine.js');

var _gridEngine2 = _interopRequireDefault(_gridEngine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Grid;

/**
 *
 * @param {Object} dashgrid
 * @param {Object} renderer
 * @param {Object} boxHandler
 * @returns {Function} init Initialize Grid.
 * @returns {Function} updateBox API for updating box, moving / resizing.
 * @returns {Function} insertBox Insert a new box.
 * @returns {Function} removeBox Remove a box.
 * @returns {Function} getBox Return box object given DOM element.
 * @returns {Function} updateStart When drag / resize starts.
 * @returns {Function} updating During dragging / resizing.
 * @returns {Function} updateEnd After drag / resize ends.
 * @returns {Function} renderGrid Update grid element.
 */

function Grid(obj) {
    var dashgrid = obj.dashgrid;
    var renderer = obj.renderer;
    var boxHandler = obj.boxHandler;


    var gridView = (0, _gridView2.default)({ dashgrid: dashgrid, renderer: renderer });
    var gridEngine = (0, _gridEngine2.default)({ dashgrid: dashgrid, boxHandler: boxHandler });

    /**
     * creates the necessary box elements and checks that the boxes input is
     * correct.
     * 1. Create box elements.
     * 2. Update the dashgrid since newly created boxes may lie outside the
     *    initial dashgrid state.
     * 3. Render the dashgrid.
     */
    var init = function init() {
        // Create the box elements and update number of rows / columns.
        gridEngine.init();

        // Update the Grid View.
        gridView.init();
    };

    /**
     *
     * @param {Object} box
     * @param {Object} updateTo
     * @param {Object} excludeBox Optional parameter, if updateBox is triggered
     *                            by drag / resize event, then don't update
     *                            the element.
     * @returns {boolean} If update succeeded.
     */
    var updateBox = function updateBox(box, updateTo, excludeBox) {
        var movedBoxes = gridEngine.updateBox(box, updateTo);

        if (movedBoxes.length > 0) {
            gridView.renderBox(movedBoxes, excludeBox);
            gridView.renderGrid();

            return true;
        }

        return false;
    };

    /**
     * Removes a box.
     * @param {Object} box
     */
    var removeBox = function removeBox(box) {
        gridEngine.removeBox(box);
        gridView.renderGrid();
    };

    /**
     * Resizes a box.
     * @param {Object} box
     */
    var resizeBox = function resizeBox(box) {
        // In case box is not updated by dragging / resizing.
        gridView.renderBox(movedBoxes);
        gridView.renderGrid();
    };

    /**
     * Called when either resize or drag starts.
     * @param {Object} box
     */
    var updateStart = function updateStart(box) {
        gridEngine.increaseNumRows(box, 1);
        gridEngine.increaseNumColumns(box, 1);
        gridView.renderGrid();
    };

    /**
     * When dragging / resizing is dropped.
     * @param {Object} box
     */
    var updating = function updating(box) {
        // gridEngine.increaseNumRows(box, 1);
        // gridEngine.increaseNumColumns(box, 1);
        // gridView.renderGrid();
    };

    /**
     * When dragging / resizing is dropped.
     */
    var updateEnd = function updateEnd() {
        gridEngine.decreaseNumRows();
        gridEngine.decreaseNumColumns();
        gridView.renderGrid();
    };

    var refreshGrid = function refreshGrid() {
        gridView.renderBox(dashgrid.boxes);
        gridView.renderGrid();
    };

    return Object.freeze({
        init: init,
        updateBox: updateBox,
        insertBox: gridEngine.insertBox,
        removeBox: gridEngine.removeBox,
        getBox: gridEngine.getBox,
        updateStart: updateStart,
        updating: updating,
        updateEnd: updateEnd,
        refreshGrid: refreshGrid
    });
}

},{"./gridEngine.js":77,"./gridView.js":78}],77:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils.js');

exports.default = GridEngine;
/**
 * @description Handles collision logic and dashgrid dimension.
 * @param {Object} obj
 */

function GridEngine(obj) {
    var dashgrid = obj.dashgrid;
    var boxHandler = obj.boxHandler;

    var boxes = void 0,
        movingBox = void 0,
        movedBoxes = void 0;

    var init = function init() {
        createBoxElements();
        updateNumRows();
        updateNumColumns();
    };

    /**
     * Create box elements.
     */
    var createBoxElements = function createBoxElements() {
        for (var i = 0, len = dashgrid.boxes.length; i < len; i++) {
            boxHandler.createBox(dashgrid.boxes[i]);
        }
        boxes = dashgrid.boxes;
    };

    /**
     * Given a DOM element, retrieve corresponding js object from boxes.
     * @param {Object} element DOM element.
     * @returns {Object} box Given a DOM element, return corresponding box object.
     */
    var getBox = function getBox(element) {
        for (var i = 0, len = boxes.length; i < len; i++) {
            if (boxes[i]._element === element) {
                return boxes[i];
            }
        };
    };

    /**
     * Copy box positions.
     * @returns {Array.<Object>} Previous box positions.
     */
    var copyBoxes = function copyBoxes() {
        var prevPositions = [];
        for (var i = 0; i < boxes.length; i++) {
            prevPositions.push({
                row: boxes[i].row,
                column: boxes[i].column,
                columnspan: boxes[i].columnspan,
                rowspan: boxes[i].rowspan
            });
        };

        return prevPositions;
    };

    /**
     * Restore Old positions.
     * @param {Array.<Object>} Previous positions.
     */
    var restoreOldPositions = function restoreOldPositions(prevPositions) {
        for (var i = 0; i < boxes.length; i++) {
            boxes[i].row = prevPositions[i].row, boxes[i].column = prevPositions[i].column, boxes[i].columnspan = prevPositions[i].columnspan, boxes[i].rowspan = prevPositions[i].rowspan;
        };
    };

    /**
     * Remove a box given its index in the boxes array.
     * @param {number} boxIndex.
     */
    var removeBox = function removeBox(boxIndex) {
        var elem = boxes[boxIndex]._element;
        elem.parentNode.removeChild(elem);
        boxes.splice(boxIndex, 1);

        // In case floating is on.
        updateNumRows();
        updateNumColumns();
    };

    /**
     * Insert a box. Box must contain at least the size and position of the box,
     * content element is optional.
     * @param {Object} box Box dimensions.
     * @returns {boolean} If insert was possible.
     */
    var insertBox = function insertBox(box) {
        movingBox = box;

        if (box.rows === undefined && box.column === undefined && box.rowspan === undefined && box.columnspan === undefined) {
            return false;
        }

        if (!isUpdateValid(box)) {
            return false;
        }

        var prevPositions = copyBoxes();

        var movedBoxes = [box];
        var validMove = moveBox(box, box, movedBoxes);
        movingBox = undefined;

        if (validMove) {
            boxHandler.createBox(box);
            boxes.push(box);

            updateNumRows();
            updateNumColumns();
            return box;
        }

        restoreOldPositions(prevPositions);

        return false;
    };

    /**
     * Updates a position or size of box.
     *
     * Works in posterior fashion, akin to ask for forgiveness rather than for
     * permission.
     * Logic:
     *
     * 1. Is updateTo a valid state?
     *    1.1 No: Return false.
     * 2. Save positions.
     * 3. Move box.
     *      3.1. Is box outside border?
     *          3.1.1. Yes: Can border be pushed?
     *              3.1.1.1. Yes: Expand border.
     *              3.1.1.2. No: Return false.
     *      3.2. Does box collide?
     *          3.2.1. Yes: Calculate new box position and
     *                 go back to step 1 with the new collided box.
     *          3.2.2. No: Return true.
     * 4. Is move valid?
     *    4.1. Yes: Update number rows / columns.
     *    4.2. No: Revert to old positions.
     *
     * @param {Object} box The box being updated.
     * @param {Object} updateTo The new state.
     * @returns {Array.<Object>} movedBoxes
     */
    var updateBox = function updateBox(box, updateTo) {
        movingBox = box;

        var prevPositions = copyBoxes();

        Object.assign(box, updateTo);
        if (!isUpdateValid(box)) {
            restoreOldPositions(prevPositions);
            return false;
        }

        var movedBoxes = [box];
        var validMove = moveBox(box, box, movedBoxes);

        if (validMove) {
            updateNumRows();
            updateNumColumns();

            return movedBoxes;
        }

        restoreOldPositions(prevPositions);

        return [];
    };

    /**
     * Checks and handles collisions with wall and boxes.
     * Works as a tree, propagating moves down the collision tree and returns
     *     true or false depending if the box infront is able to move.
     * @param {Object} box
     * @param {Array.<Object>} excludeBox
     * @param {Array.<Object>} movedBoxes
     * @return {boolean} true if move is possible, false otherwise.
     */
    var moveBox = function moveBox(box, excludeBox, movedBoxes) {
        if (isBoxOutsideBoundary(box)) {
            return false;
        }

        var intersectedBoxes = getIntersectedBoxes(box, excludeBox, movedBoxes);

        // Handle box Collision, recursive model.
        for (var i = 0, len = intersectedBoxes.length; i < len; i++) {
            if (!collisionHandler(box, intersectedBoxes[i], excludeBox, movedBoxes)) {
                return false;
            }
        }

        return true;
    };

    /**
     * Propagates box collisions.
     * @param {Object} box
     * @param {Object} boxB
     * @param {Object} excludeBox
     * @param {Array.<Object>} movedBoxes
     * @return {boolean} If move is allowed
     */
    var collisionHandler = function collisionHandler(box, boxB, excludeBox, movedBoxes) {
        setBoxPosition(box, boxB);
        return moveBox(boxB, excludeBox, movedBoxes);
    };

    /**
     * Calculates new box position based on the box that pushed it.
     * @param {Object} box Box which has moved.
     * @param {Object} boxB Box which is to be moved.
     */
    var setBoxPosition = function setBoxPosition(box, boxB) {
        boxB.row += box.row + box.rowspan - boxB.row;
    };

    /**
     * Given a box, finds other boxes which intersect with it.
     * @param {Object} box
     * @param {Array.<Object>} excludeBox Array of boxes.
     */
    var getIntersectedBoxes = function getIntersectedBoxes(box, excludeBox, movedBoxes) {
        var intersectedBoxes = [];
        for (var i = 0, len = boxes.length; i < len; i++) {
            // Don't check moving box and the box itself.
            if (box !== boxes[i] && boxes[i] !== excludeBox) {
                if (doBoxesIntersect(box, boxes[i])) {
                    movedBoxes.push(boxes[i]);
                    intersectedBoxes.push(boxes[i]);
                }
            }
        }
        (0, _utils.insertionSort)(intersectedBoxes, 'row');

        return intersectedBoxes;
    };

    /**
     * Checks whether 2 boxes intersect using bounding box method.
     * @param {Object} boxA
     * @param {Object} boxB
     * @returns boolean True if intersect else false.
     */
    var doBoxesIntersect = function doBoxesIntersect(box, boxB) {
        return box.column < boxB.column + boxB.columnspan && box.column + box.columnspan > boxB.column && box.row < boxB.row + boxB.rowspan && box.rowspan + box.row > boxB.row;
    };

    /**
     * Updates the number of columns.
     */
    var updateNumColumns = function updateNumColumns() {
        var maxColumn = (0, _utils.getMaxNum)(boxes, 'column', 'columnspan');

        if (maxColumn >= dashgrid.minColumns) {
            dashgrid.numColumns = maxColumn;
        }

        if (!movingBox) {
            return;
        }

        if (dashgrid.numColumns - movingBox.column - movingBox.columnspan === 0 && dashgrid.numColumns < dashgrid.maxColumns) {
            dashgrid.numColumns += 1;
        } else if (dashgrid.numColumns - movingBox.column - movingBox.columnspan > 1 && movingBox.column + movingBox.columnspan === maxColumn && dashgrid.numColumns > dashgrid.minColumns && dashgrid.numColumns < dashgrid.maxColumns) {
            dashgrid.numColumns = maxColumn + 1;
        }
    };

    /**
     * Increases number of dashgrid.numRows if box touches bottom of wall.
     * @param {Object} box
     * @param {number} numColumns
     * @returns {boolean} true if increase else false.
     */
    var increaseNumColumns = function increaseNumColumns(box, numColumns) {
        // Determine when to add extra row to be able to move down:
        // 1. Anytime dragging starts.
        // 2. When dragging starts and moving box is close to bottom border.
        if (box.column + box.columnspan === dashgrid.numColumns && dashgrid.numColumns < dashgrid.maxColumns) {
            dashgrid.numColumns += 1;
            return true;
        }

        return false;
    };

    /**
     * Decreases number of dashgrid.numRows to furthest leftward box.
     * @returns boolean true if increase else false.
     */
    var decreaseNumColumns = function decreaseNumColumns() {
        var maxColumnNum = 0;

        boxes.forEach(function (box) {
            if (maxColumnNum < box.column + box.columnspan) {
                maxColumnNum = box.column + box.columnspan;
            }
        });

        if (maxColumnNum < dashgrid.numColumns) {
            dashgrid.numColumns = maxColumnNum;
        }
        if (maxColumnNum < dashgrid.minColumns) {
            dashgrid.numColumns = dashgrid.minColumns;
        }

        return true;
    };

    /**
     * Number rows depends on three things.
     * <ul>
     *     <li>Min / Max Rows.</li>
     *     <li>Max Box.</li>
     *     <li>Dragging box near bottom border.</li>
     * </ul>
     *
     */
    var updateNumRows = function updateNumRows() {
        var maxRow = (0, _utils.getMaxNum)(boxes, 'row', 'rowspan');

        if (maxRow >= dashgrid.minRows) {
            dashgrid.numRows = maxRow;
        }

        if (!movingBox) {
            return;
        }

        // Moving box when close to border.
        if (dashgrid.numRows - movingBox.row - movingBox.rowspan === 0 && dashgrid.numRows < dashgrid.maxRows) {
            dashgrid.numRows += 1;
        } else if (dashgrid.numRows - movingBox.row - movingBox.rowspan > 1 && movingBox.row + movingBox.rowspan === maxRow && dashgrid.numRows > dashgrid.minRows && dashgrid.numRows < dashgrid.maxRows) {
            dashgrid.numRows = maxRow + 1;
        }
    };

    /**
     * Increases number of dashgrid.numRows if box touches bottom of wall.
     * @param box {Object}
     * @returns {boolean} true if increase else false.
     */
    var increaseNumRows = function increaseNumRows(box, numRows) {
        // Determine when to add extra row to be able to move down:
        // 1. Anytime dragging starts.
        // 2. When dragging starts AND moving box is close to bottom border.
        if (box.row + box.rowspan === dashgrid.numRows && dashgrid.numRows < dashgrid.maxRows) {
            dashgrid.numRows += 1;
            return true;
        }

        return false;
    };

    /**
     * Decreases number of dashgrid.numRows to furthest downward box.
     * @returns {boolean} true if increase else false.
     */
    var decreaseNumRows = function decreaseNumRows() {
        var maxRowNum = 0;

        boxes.forEach(function (box) {
            if (maxRowNum < box.row + box.rowspan) {
                maxRowNum = box.row + box.rowspan;
            }
        });

        if (maxRowNum < dashgrid.numRows) {
            dashgrid.numRows = maxRowNum;
        }
        if (maxRowNum < dashgrid.minRows) {
            dashgrid.numRows = dashgrid.minRows;
        }

        return true;
    };

    /**
     * Checks min, max box-size.
     * @param {Object} box
     * @returns {boolean}
     */
    var isUpdateValid = function isUpdateValid(box) {
        if (box.rowspan < dashgrid.minRowspan || box.rowspan > dashgrid.maxRowspan || box.columnspan < dashgrid.minColumnspan || box.columnspan > dashgrid.maxColumnspan) {
            return false;
        }

        return true;
    };

    /**
     * Handles border collisions by reverting back to closest edge point.
     * @param {Object} box
     * @returns {boolean} True if collided and cannot move wall else false.
     */
    var isBoxOutsideBoundary = function isBoxOutsideBoundary(box) {
        // Top and left border.
        if (box.column < 0 || box.row < 0) {
            return true;
        }

        // Right and bottom border.
        if (box.row + box.rowspan > dashgrid.maxRows || box.column + box.columnspan > dashgrid.maxColumns) {
            return true;
        }

        return false;
    };

    return Object.freeze({
        init: init,
        updateBox: updateBox,
        updateNumRows: updateNumRows,
        increaseNumRows: increaseNumRows,
        decreaseNumRows: decreaseNumRows,
        updateNumColumns: updateNumColumns,
        increaseNumColumns: increaseNumColumns,
        decreaseNumColumns: decreaseNumColumns,
        getBox: getBox,
        insertBox: insertBox,
        removeBox: removeBox
    });
}

},{"./utils.js":83}],78:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils.js');

exports.default = GridView;

/**
 * Handles the rendering from javascript to DOM.
 *
 * @param {Object} dashgrid.
 * @param {renderer} renderer.
 */

function GridView(obj) {
    var dashgrid = obj.dashgrid;
    var renderer = obj.renderer;

    var gridLinesElement = void 0;
    var gridCentroidsElement = void 0;

    var init = function init() {
        if (dashgrid.showGridLines) {
            createGridLinesElement();
        }
        if (dashgrid.showGridCentroids) {
            createGridCentroidsElement();
        }

        renderer.setColumnWidth();
        renderer.setRowHeight();

        renderGrid();
        renderBox(dashgrid.boxes);
    };

    /**
     * Create vertical and horizontal line elements.
     */
    var createGridLinesElement = function createGridLinesElement() {
        var lineElementID = 'dashgrid-grid-lines';
        if (document.getElementById(lineElementID) === null) {
            gridLinesElement = document.createElement('div');
            gridLinesElement.id = lineElementID;
            dashgrid._element.appendChild(gridLinesElement);
        }
    };

    /**
     * Create vertical and horizontal line elements.
     */
    var createGridCentroidsElement = function createGridCentroidsElement() {
        var centroidElementID = 'dashgrid-grid-centroids';
        if (document.getElementById(centroidElementID) === null) {
            gridCentroidsElement = document.createElement('div');
            gridCentroidsElement.id = centroidElementID;
            dashgrid._element.appendChild(gridCentroidsElement);
        }
    };

    /**
     * Draw horizontal and vertical grid lines with the thickness of xMargin
     * yMargin.
     */
    var renderGridLines = function renderGridLines() {
        if (gridLinesElement === null) {
            return;
        }

        (0, _utils.removeNodes)(gridLinesElement);
        var columnWidth = renderer.getColumnWidth();
        var rowHeight = renderer.getRowHeight();

        var htmlString = '';
        // Horizontal lines
        for (var i = 0; i <= dashgrid.numRows; i += 1) {
            htmlString += '<div class=\'dashgrid-horizontal-line\'\n                style=\'top: ' + i * (rowHeight + dashgrid.yMargin) + 'px;\n                    left: 0px;\n                    width: 100%;\n                    height: ' + dashgrid.yMargin + 'px;\n                    position: absolute;\'>\n                </div>';
        }

        // Vertical lines
        for (var _i = 0; _i <= dashgrid.numColumns; _i += 1) {
            htmlString += '<div class=\'dashgrid-vertical-line\'\n                style=\'top: 0px;\n                    left: ' + _i * (columnWidth + dashgrid.xMargin) + 'px;\n                    height: 100%;\n                    width: ' + dashgrid.xMargin + 'px;\n                    position: absolute;\'>\n                </div>';
        }

        gridLinesElement.innerHTML = htmlString;
    };

    /**
     * Draw horizontal and vertical grid lines with the thickness of xMargin
     * yMargin.
     */
    var renderGridCentroids = function renderGridCentroids() {
        if (gridCentroidsElement === null) {
            return;
        };

        (0, _utils.removeNodes)(gridCentroidsElement);
        var columnWidth = renderer.getColumnWidth();
        var rowHeight = renderer.getRowHeight();

        var htmlString = '';
        // Draw centroids
        for (var i = 0; i < dashgrid.numRows; i += 1) {
            for (var j = 0; j < dashgrid.numColumns; j += 1) {
                htmlString += '<div class=\'dashgrid-grid-centroid\'\n                    style=\'top: ' + (i * (rowHeight + dashgrid.yMargin) + rowHeight / 2 + dashgrid.yMargin) + 'px;\n                        left: ' + (j * (columnWidth + dashgrid.xMargin) + columnWidth / 2 + dashgrid.xMargin) + 'px;\n                            position: absolute;\'>\n                    </div>';
            }
        }

        gridCentroidsElement.innerHTML = htmlString;
    };

    /**
     * Render the dashgrid:
     *    1. Setting grid and cell height / width
     *    2. Painting.
     */
    var renderGrid = function renderGrid() {
        renderer.setGridElementHeight();
        renderer.setGridElementWidth();
        renderer.setCellCentroids();

        if (dashgrid.showGridLines) {
            renderGridLines();
        }
        if (dashgrid.showGridCentroids) {
            renderGridCentroids();
        }
    };

    /**
     * @param {Array.<Object>} boxes List of boxes to redraw.
     * @param {Object} excludeBox Don't redraw this box.
     */
    var renderBox = function renderBox(boxes, excludeBox) {
        window.requestAnimFrame(function () {
            // updateGridDimension moved boxes css.
            boxes.forEach(function (box) {
                if (excludeBox !== box) {
                    renderer.setBoxElementYPosition(box._element, box.row);
                    renderer.setBoxElementXPosition(box._element, box.column);
                    renderer.setBoxElementHeight(box._element, box.rowspan);
                    renderer.setBoxElementWidth(box._element, box.columnspan);
                }
            });
        });
    };

    return Object.freeze({
        init: init,
        renderGrid: renderGrid,
        renderBox: renderBox,
        createGridLinesElement: createGridLinesElement,
        createGridCentroidsElement: createGridCentroidsElement
    });
}

},{"./utils.js":83}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = MouseHandler;

var _utils = require('./utils');

function MouseHandler(comp) {
    var dragger = comp.dragger;
    var resizer = comp.resizer;
    var dashgrid = comp.dashgrid;
    var grid = comp.grid;


    var inputTags = ['select', 'input', 'textarea', 'button'];

    function init() {
        dashgrid._element.addEventListener('mousedown', function (e) {
            mouseDown(e, dashgrid._element);e.preventDefault();
        }, false);
    }

    function mouseDown(e, element) {
        var node = e.target;

        // Exit if:
        // 1. the target has it's own click event or
        // 2. target has onclick attribute or
        // 3. Right / middle button clicked instead of left.
        if (inputTags.indexOf(node.nodeName.toLowerCase()) > -1) {
            return;
        }
        if (node.hasAttribute('onclick')) {
            return;
        }
        if (e.which === 2 || e.which === 3) {
            return;
        }

        // Handle drag / resize event.
        if (node.className.search(/dashgrid-box-resize-handle/) > -1) {
            handleEvent(e, resizeEvent);
        } else if (node.className.search(dashgrid.draggable.handle) > -1) {
            handleEvent(e, dragEvent);
        }
    }

    /**
     * Handle mouse event, click or resize.
     * @param {Object} e
     * @param {Function} cb
     */
    function handleEvent(e, cb) {
        var boxElement = (0, _utils.findParent)(e.target, /^dashgrid-box$/);
        var box = grid.getBox(boxElement);
        if (box) {
            cb(box, e);
        }
    }

    /**
     * Drag event, sets off start drag, during drag and end drag.
     * @param {Object} box
     * @param {Object} e
     */
    function dragEvent(box, e) {
        if (!dashgrid.draggable.enabled || !box.draggable) {
            return;
        }

        // console.log('dragstart');
        dragger.dragStart(box, e);

        document.addEventListener('mouseup', dragEnd, false);
        document.addEventListener('mousemove', drag, false);

        function drag(e) {
            // console.log('drag');
            dragger.drag(box, e);
            e.preventDefault();
        }

        function dragEnd(e) {
            // console.log('dragend');
            dragger.dragEnd(box, e);
            e.preventDefault();
            document.removeEventListener('mouseup', dragEnd, false);
            document.removeEventListener('mousemove', drag, false);
        }
    }

    /**
     * Resize event, sets off start resize, during resize and end resize.
     * @param {Object} box
     * @param {Object} e
     */
    function resizeEvent(box, e) {
        if (!dashgrid.resizable.enabled || !box.resizable) {
            return;
        }
        resizer.resizeStart(box, e);

        document.addEventListener('mouseup', resizeEnd, false);
        document.addEventListener('mousemove', resize, false);

        function resize(e) {
            resizer.resize(box, e);e.preventDefault();
        }

        function resizeEnd(e) {
            document.removeEventListener('mouseup', resizeEnd, false);
            document.removeEventListener('mousemove', resize, false);

            resizer.resizeEnd(box, e);
            e.preventDefault();
        }
    }

    return Object.freeze({
        init: init
    });
} /**
   * mouseHandler.js: Initializes and sets up the events for dragging / resizing.
   */

},{"./utils":83}],80:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils.js');

exports.default = Render;


function Render(comp) {
    var dashgrid = comp.dashgrid;

    // Start row / column denotes the pixel at which each cell starts at.

    var startColumn = [];
    var startRow = [];
    var columnWidth = void 0,
        rowHeight = void 0;

    /**
    * @returns 
    */
    var getColumnWidth = function getColumnWidth() {
        return columnWidth;
    };

    /**
    * @returns 
    */
    var getRowHeight = function getRowHeight() {
        return rowHeight;
    };

    /**
    *
    * @param {}
    * @returns
    */
    var setGridElementWidth = function setGridElementWidth() {
        dashgrid._element.style.width = columnWidth ? columnWidth * dashgrid.numColumns + (dashgrid.numColumns + 1) * dashgrid.xMargin + 'px' : dashgrid._element.parentNode.offsetWidth + 'px';
    };

    /**
    *
    * @param {}
    * @returns
    */
    var setColumnWidth = function setColumnWidth() {
        columnWidth = dashgrid.columnWidth !== 'auto' ? dashgrid.columnWidth : (dashgrid._element.parentNode.offsetWidth - (dashgrid.numColumns + 1) * dashgrid.xMargin) / dashgrid.numColumns;
    };

    /**
    *
    * @param {}
    * @returns
    */
    var setGridElementHeight = function setGridElementHeight() {
        dashgrid._element.style.height = rowHeight ? rowHeight * dashgrid.numRows + (dashgrid.numRows + 1) * dashgrid.yMargin + 'px' : dashgrid._element.parentNode.offsetHeight + 'px';
    };

    /**
    *
    * @param {}
    * @returns
    */
    var setRowHeight = function setRowHeight() {
        rowHeight = dashgrid.rowHeight !== 'auto' ? dashgrid.rowHeight : (dashgrid._element.parentNode.offsetHeight - (dashgrid.numRows + 1) * dashgrid.yMargin) / dashgrid.numRows;
    };

    /**
    *
    * @param {}
    * @returns
    */
    var setBoxElementXPosition = function setBoxElementXPosition(element, column) {
        element.style.left = column * columnWidth + dashgrid.xMargin * (column + 1) + 'px';
    };

    /**
    *
    * @param {}
    * @returns
    */
    var setBoxElementYPosition = function setBoxElementYPosition(element, row) {
        element.style.top = row * rowHeight + dashgrid.yMargin * (row + 1) + 'px';
    };

    /**
    *
    * @param {}
    * @returns
    */
    var setBoxElementWidth = function setBoxElementWidth(element, columnspan) {
        element.style.width = columnspan * columnWidth + dashgrid.xMargin * (columnspan - 1) + 'px';
    };

    /**
    *
    * @param {}
    * @returns
    */
    var setBoxElementHeight = function setBoxElementHeight(element, rowspan) {
        element.style.height = rowspan * rowHeight + dashgrid.yMargin * (rowspan - 1) + 'px';
    };

    /**
     * Initializes cell centroids which are used to compute closest cell
     *     when dragging a box.
     * @param {Number} numRows The total number of rows.
     * @param {Number} numColumns The total number of rows.
     */
    var setCellCentroids = function setCellCentroids() {
        startRow = [];
        startColumn = [];
        var start = void 0;
        var stop = void 0;

        for (var i = 0; i < dashgrid.numRows; i += 1) {
            start = i * (rowHeight + dashgrid.yMargin) + dashgrid.yMargin / 2;
            stop = start + rowHeight + dashgrid.yMargin;
            startRow.push([Math.floor(start), Math.ceil(stop)]);
        }

        for (var _i = 0; _i < dashgrid.numColumns; _i += 1) {
            start = _i * (columnWidth + dashgrid.xMargin) + dashgrid.xMargin / 2;
            stop = start + columnWidth + dashgrid.xMargin;
            startColumn.push([Math.floor(start), Math.ceil(stop)]);
        }
    };

    /**
     * Finds which cells box intersects with.
     * @param {Object} boxPosition Contains top/bottom/left/right box position
     *     in px.
     * @param {Number} numRows How many rows the box spans.
     * @param {Number} numColumns How many rows the box spans.
     * @return {Object} The row or column which each side is found in.
     *     For instance, boxLeft: column = 0, boxRight: column = 1,
     *     BoxTop: row = 0, BoxBottom: row = 3.
     */
    var findIntersectedCells = function findIntersectedCells(comp) {
        var top = comp.top;
        var right = comp.right;
        var bottom = comp.bottom;
        var left = comp.left;

        var boxLeft = void 0,
            boxRight = void 0,
            boxTop = void 0,
            boxBottom = void 0;

        // Find top and bottom intersection cell row.
        for (var i = 0; i < dashgrid.numRows; i += 1) {
            if (top >= startRow[i][0] && top <= startRow[i][1]) {
                boxTop = i;
            }
            if (bottom >= startRow[i][0] && bottom <= startRow[i][1]) {
                boxBottom = i;
            }
        }

        // Find left and right intersection cell column.
        for (var j = 0; j < dashgrid.numColumns; j += 1) {
            if (left >= startColumn[j][0] && left <= startColumn[j][1]) {
                boxLeft = j;
            }
            if (right >= startColumn[j][0] && right <= startColumn[j][1]) {
                boxRight = j;
            }
        }

        return { boxLeft: boxLeft, boxRight: boxRight, boxTop: boxTop, boxBottom: boxBottom };
    };

    /**
     * Get closest cell given (row, column) position in px.
     * @param {Object} boxPosition Contains top/bottom/left/right box position
     *     in px.
     * @param {Number} numRows
     * @param {Number} numColumns
     * @returns {Object}
     */
    var getClosestCells = function getClosestCells(comp) {
        var top = comp.top;
        var right = comp.right;
        var bottom = comp.bottom;
        var left = comp.left;

        var _findIntersectedCells = findIntersectedCells(comp);

        var boxLeft = _findIntersectedCells.boxLeft;
        var boxRight = _findIntersectedCells.boxRight;
        var boxTop = _findIntersectedCells.boxTop;
        var boxBottom = _findIntersectedCells.boxBottom;


        var column = void 0;
        var leftOverlap = void 0;
        var rightOverlap = void 0;
        // Determine if enough overlap for horizontal move.
        if (boxLeft !== undefined && boxRight !== undefined) {
            leftOverlap = Math.abs(left - startColumn[boxLeft][0]);
            rightOverlap = Math.abs(right - startColumn[boxRight][1] - dashgrid.xMargin);
            if (leftOverlap <= rightOverlap) {
                column = boxLeft;
            } else {
                column = boxLeft + 1;
            }
        }

        var row = void 0;
        var topOverlap = void 0;
        var bottomOverlap = void 0;
        // Determine if enough overlap for vertical move.
        if (boxTop !== undefined && boxBottom !== undefined) {
            topOverlap = Math.abs(top - startRow[boxTop][0]);
            bottomOverlap = Math.abs(bottom - startRow[boxBottom][1] - dashgrid.yMargin);
            if (topOverlap <= bottomOverlap) {
                row = boxTop;
            } else {
                row = boxTop + 1;
            }
        }

        return { row: row, column: column };
    };

    return Object.freeze({
        getColumnWidth: getColumnWidth,
        getRowHeight: getRowHeight,
        setColumnWidth: setColumnWidth,
        setRowHeight: setRowHeight,
        setGridElementHeight: setGridElementHeight,
        setGridElementWidth: setGridElementWidth,
        setBoxElementXPosition: setBoxElementXPosition,
        setBoxElementYPosition: setBoxElementYPosition,
        setBoxElementWidth: setBoxElementWidth,
        setBoxElementHeight: setBoxElementHeight,
        findIntersectedCells: findIntersectedCells,
        setCellCentroids: setCellCentroids,
        getClosestCells: getClosestCells
    });
}

},{"./utils.js":83}],81:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Resizer;


function Resizer(comp) {
    var dashgrid = comp.dashgrid;
    var renderer = comp.renderer;
    var grid = comp.grid;


    var minWidth = void 0,
        minHeight = void 0,
        elementLeft = void 0,
        elementTop = void 0,
        elementWidth = void 0,
        elementHeight = void 0,
        minTop = void 0,
        maxTop = void 0,
        minLeft = void 0,
        maxLeft = void 0,
        className = void 0,
        mouseX = 0,
        mouseY = 0,
        lastMouseX = 0,
        lastMouseY = 0,
        mOffX = 0,
        mOffY = 0,
        newState = {},
        prevState = {};

    /**
     * @param {Object} box
     * @param {Object} e
     */
    var resizeStart = function resizeStart(box, e) {
        className = e.target.className;

        // Removes transitions, displays and inits positions for preview box.
        box._element.style.zIndex = 1004;
        box._element.style.transition = '';
        dashgrid._shadowBoxElement.style.left = box._element.style.left;
        dashgrid._shadowBoxElement.style.top = box._element.style.top;
        dashgrid._shadowBoxElement.style.width = box._element.style.width;
        dashgrid._shadowBoxElement.style.height = box._element.style.height;
        dashgrid._shadowBoxElement.style.display = '';

        // Mouse values.
        minWidth = renderer.getColumnWidth();
        minHeight = renderer.getRowHeight();
        lastMouseX = e.pageX;
        lastMouseY = e.pageY;
        elementLeft = parseInt(box._element.style.left, 10);
        elementTop = parseInt(box._element.style.top, 10);
        elementWidth = box._element.offsetWidth;
        elementHeight = box._element.offsetHeight;

        grid.updateStart(box);

        if (dashgrid.resizable.resizeStart) {
            dashgrid.resizable.resizeStart();
        } // user cb.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    var resize = function resize(box, e) {
        updateResizingElement(box, e);
        grid.updating(box);

        if (dashgrid.liveChanges) {
            // Which cell to snap shadowbox to.

            var _renderer$findInterse = renderer.findIntersectedCells({
                left: box._element.offsetLeft,
                right: box._element.offsetLeft + box._element.offsetWidth,
                top: box._element.offsetTop,
                bottom: box._element.offsetTop + box._element.offsetHeight
            });

            var boxLeft = _renderer$findInterse.boxLeft;
            var boxRight = _renderer$findInterse.boxRight;
            var boxTop = _renderer$findInterse.boxTop;
            var boxBottom = _renderer$findInterse.boxBottom;

            newState = { row: boxTop, column: boxLeft, rowspan: boxBottom - boxTop + 1, columnspan: boxRight - boxLeft + 1 };

            resizeBox(box, e);
        }

        if (dashgrid.resizable.resizing) {
            dashgrid.resizable.resizing();
        } // user cb.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    var resizeEnd = function resizeEnd(box, e) {
        if (!dashgrid.liveChanges) {
            var _renderer$findInterse2 = renderer.findIntersectedCells({
                left: box._element.offsetLeft,
                right: box._element.offsetLeft + box._element.offsetWidth,
                top: box._element.offsetTop,
                bottom: box._element.offsetTop + box._element.offsetHeight,
                numRows: grid.getNumRows(),
                numColumns: grid.getNumColumns()
            });

            var boxLeft = _renderer$findInterse2.boxLeft;
            var boxRight = _renderer$findInterse2.boxRight;
            var boxTop = _renderer$findInterse2.boxTop;
            var boxBottom = _renderer$findInterse2.boxBottom;

            newState = { row: boxTop, column: boxLeft, rowspan: boxBottom - boxTop + 1, columnspan: boxRight - boxLeft + 1 };
            resizeBox(box, e);
        }

        // Set box style.
        box._element.style.transition = dashgrid.transition;
        box._element.style.left = dashgrid._shadowBoxElement.style.left;
        box._element.style.top = dashgrid._shadowBoxElement.style.top;
        box._element.style.width = dashgrid._shadowBoxElement.style.width;
        box._element.style.height = dashgrid._shadowBoxElement.style.height;

        // Give time for previewbox to snap back to tile.
        setTimeout(function () {
            box._element.style.zIndex = 1003;
            dashgrid._shadowBoxElement.style.display = '';
            grid.updateEnd();
        }, dashgrid.snapBackTime);

        if (dashgrid.resizable.resizeEnd) {
            dashgrid.resizable.resizeEnd();
        } // user cb.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    var resizeBox = function resizeBox(box, e) {
        if (newState.row !== prevState.row || newState.column !== prevState.column || newState.rowspan !== prevState.rowspan || newState.columnspan !== prevState.columnspan) {

            var update = grid.updateBox(box, newState, box);

            // updateGridDimension preview box.
            if (update) {
                renderer.setBoxElementXPosition(dashgrid._shadowBoxElement, newState.column);
                renderer.setBoxElementYPosition(dashgrid._shadowBoxElement, newState.row);
                renderer.setBoxElementWidth(dashgrid._shadowBoxElement, newState.columnspan);
                renderer.setBoxElementHeight(dashgrid._shadowBoxElement, newState.rowspan);
            }
        }

        // No point in attempting update if not switched to new cell.
        prevState.row = newState.row;
        prevState.column = newState.column;
        prevState.rowspan = newState.rowspan;
        prevState.columnspan = newState.columnspan;

        if (dashgrid.resizable.resizing) {
            dashgrid.resizable.resizing();
        } // user cb.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    var updateResizingElement = function updateResizingElement(box, e) {
        // Get the current mouse position.
        mouseX = e.pageX;
        mouseY = e.pageY;

        // Get the deltas
        var diffX = mouseX - lastMouseX + mOffX;
        var diffY = mouseY - lastMouseY + mOffY;
        mOffX = mOffY = 0;

        // Update last processed mouse positions.
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        var dY = diffY;
        var dX = diffX;

        minTop = dashgrid.yMargin;
        maxTop = dashgrid._element.offsetHeight - dashgrid.yMargin;
        minLeft = dashgrid.xMargin;
        maxLeft = dashgrid._element.offsetWidth - dashgrid.xMargin;

        if (className.indexOf('dashgrid-box-resize-handle-w') > -1 || className.indexOf('dashgrid-box-resize-handle-nw') > -1 || className.indexOf('dashgrid-box-resize-handle-sw') > -1) {
            if (elementWidth - dX < minWidth) {
                diffX = elementWidth - minWidth;
                mOffX = dX - diffX;
            } else if (elementLeft + dX < minLeft) {
                diffX = minLeft - elementLeft;
                mOffX = dX - diffX;
            }
            elementLeft += diffX;
            elementWidth -= diffX;
        }

        if (className.indexOf('dashgrid-box-resize-handle-e') > -1 || className.indexOf('dashgrid-box-resize-handle-ne') > -1 || className.indexOf('dashgrid-box-resize-handle-se') > -1) {

            if (elementWidth + dX < minWidth) {
                diffX = minWidth - elementWidth;
                mOffX = dX - diffX;
            } else if (elementLeft + elementWidth + dX > maxLeft) {
                diffX = maxLeft - elementLeft - elementWidth;
                mOffX = dX - diffX;
            }
            elementWidth += diffX;
        }

        if (className.indexOf('dashgrid-box-resize-handle-n') > -1 || className.indexOf('dashgrid-box-resize-handle-nw') > -1 || className.indexOf('dashgrid-box-resize-handle-ne') > -1) {
            if (elementHeight - dY < minHeight) {
                diffY = elementHeight - minHeight;
                mOffY = dY - diffY;
            } else if (elementTop + dY < minTop) {
                diffY = minTop - elementTop;
                mOffY = dY - diffY;
            }
            elementTop += diffY;
            elementHeight -= diffY;
        }

        if (className.indexOf('dashgrid-box-resize-handle-s') > -1 || className.indexOf('dashgrid-box-resize-handle-sw') > -1 || className.indexOf('dashgrid-box-resize-handle-se') > -1) {
            if (elementHeight + dY < minHeight) {
                diffY = minHeight - elementHeight;
                mOffY = dY - diffY;
            } else if (elementTop + elementHeight + dY > maxTop) {
                diffY = maxTop - elementTop - elementHeight;
                mOffY = dY - diffY;
            }
            elementHeight += diffY;
        }

        box._element.style.top = elementTop + 'px';
        box._element.style.left = elementLeft + 'px';
        box._element.style.width = elementWidth + 'px';
        box._element.style.height = elementHeight + 'px';

        // Scrolling when close to bottom boundary.
        if (e.pageY - document.body.scrollTop < dashgrid.scrollSensitivity) {
            document.body.scrollTop = document.body.scrollTop - dashgrid.scrollSpeed;
        } else if (window.innerHeight - (e.pageY - document.body.scrollTop) < dashgrid.scrollSensitivity) {
            document.body.scrollTop = document.body.scrollTop + dashgrid.scrollSpeed;
        }

        // Scrolling when close to right boundary.
        if (e.pageX - document.body.scrollLeft < dashgrid.scrollSensitivity) {
            document.body.scrollLeft = document.body.scrollLeft - dashgrid.scrollSpeed;
        } else if (window.innerWidth - (e.pageX - document.body.scrollLeft) < dashgrid.scrollSensitivity) {
            document.body.scrollLeft = document.body.scrollLeft + dashgrid.scrollSpeed;
        }
    };

    return Object.freeze({
        resizeStart: resizeStart,
        resize: resize,
        resizeEnd: resizeEnd
    });
}

},{}],82:[function(require,module,exports){
"use strict";

// shim layer with setTimeout fallback for requiestAnimationFrame
window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (cb) {
        cb = cb || function () {};
        window.setTimeout(cb, 1000 / 60);
    };
}();

},{}],83:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getMaxNum = getMaxNum;
exports.getSortedArr = getSortedArr;
exports.insertByOrder = insertByOrder;
exports.insertionSort = insertionSort;
exports.ObjectLength = ObjectLength;
exports.addEvent = addEvent;
exports.removeNodes = removeNodes;
exports.findParent = findParent;

/**
 *
 * @param {Object} box
 * @param {string} at1
 * @param {string} at2
 * @returns {Number}
 */
function getMaxNum(box, at1, at2) {
    var maxVal = 0;
    for (var i = 0, len = box.length; i < len; i++) {
        if (box[i][at1] + box[i][at2] >= maxVal) {
            maxVal = box[i][at1] + box[i][at2];
        }
    }

    return maxVal;
}

/**
 *
 * @param {string} order
 * @param {string} attr
 * @param {Array.<Object>} objs
 * @returns {Array.<Object>}
 */
function getSortedArr(order, attr, objs) {
    var key = void 0;
    var arr = [];

    Object.keys(objs).forEach(function (i) {
        insertByOrder(order, attr, objs[i], arr);
    });

    return arr;
}

/**
 * Sort array with newly inserted object.
 * @param {string} box
 * @param {string} at1
 * @param {Object} at2
 */
function insertByOrder(order, attr, o, arr) {
    var len = arr.length;

    if (len === 0) {
        arr.push(o);
    } else {
        // Insert by order, start furthest down.
        // Insert between 0 and n -1.
        for (var i = 0; i < len; i += 1) {
            if (order === 'desc') {
                if (o.row > arr[i].row) {
                    arr.splice(i, 0, o);
                    break;
                }
            } else {
                if (o.row < arr[i].row) {
                    arr.splice(i, 0, o);
                    break;
                }
            }
        }

        // If not inbetween 0 and n - 1, insert last.
        if (len === arr.length) {
            arr.push(o);
        }
    }
}

/**
 *
 * @param {Array.<Object>} a
 * @param {string} a
 */
function insertionSort(a, attr) {
    if (a.length < 2) {
        return;
    }

    var i = a.length;
    var temp;
    var j;
    while (i--) {
        j = i;
        while (j > 0 && a[j - 1][attr] < a[j][attr]) {
            temp = a[j];
            a[j] = a[j - 1];
            a[j - 1] = temp;
            j -= 1;
        }
    }
}

/**
 *
 * @param {Object} obj
 * @returns {number} Number of properties in object.
 */
function ObjectLength(obj) {
    var length = 0,
        key = void 0;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            length += 1;
        }
    }
    return length;
}

/**
 * Add event, and not overwrite.
 * @param {Object} element
 * @param {string} type
 * @param {Function} eventHandle
 * @returns
 */
function addEvent(element, type, eventHandle) {
    if (element === null || typeof element === 'undefined') return;
    if (element.addEventListener) {
        element.addEventListener(type, eventHandle, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + type, eventHandle);
    } else {
        element['on' + type] = eventHandle;
    }
}

/**
 * Remove nodes from element.
 * @param {Object} element
 */
function removeNodes(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 *
 * @param {Object} node
 * @param {string} className
 * @returns {Object|Boolean} DOM element object or false if not found. 
 */
function findParent(node, className) {
    while (node.nodeType === 1 && node !== document.body) {
        if (node.className.search(className) > -1) {
            return node;
        }
        node = node.parentNode;
    }
    return false;
}

},{}]},{},[64])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnktY3NzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaXNhcnJheS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLXV0aWwtaXMvbGliL3V0aWwuanMiLCJub2RlX21vZHVsZXMvZGVlcC1kaWZmL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RlZXAtZXF1YWwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZGVlcC1lcXVhbC9saWIvaXNfYXJndW1lbnRzLmpzIiwibm9kZV9tb2R1bGVzL2RlZXAtZXF1YWwvbGliL2tleXMuanMiLCJub2RlX21vZHVsZXMvZGVlcGNvcHkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZGVlcGNvcHkvbGliL2NvcHkuanMiLCJub2RlX21vZHVsZXMvZGVlcGNvcHkvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RlZXBjb3B5L2xpYi9wb2x5ZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9kZWZpbmUtcHJvcGVydGllcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kZWZpbmVkL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0L2VzNS5qcyIsIm5vZGVfbW9kdWxlcy9lcy1hYnN0cmFjdC9oZWxwZXJzL2lzRmluaXRlLmpzIiwibm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0L2hlbHBlcnMvbW9kLmpzIiwibm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0L2hlbHBlcnMvc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9lcy10by1wcmltaXRpdmUvZXM1LmpzIiwibm9kZV9tb2R1bGVzL2VzLXRvLXByaW1pdGl2ZS9oZWxwZXJzL2lzUHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mdW5jdGlvbi1iaW5kL2ltcGxlbWVudGF0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2Z1bmN0aW9uLWJpbmQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaGFzL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2lzLWNhbGxhYmxlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1pbnNwZWN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1rZXlzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1rZXlzL2lzQXJndW1lbnRzLmpzIiwibm9kZV9tb2R1bGVzL3BhdGgtYnJvd3NlcmlmeS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzLW5leHRpY2stYXJncy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2R1cGxleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL19zdHJlYW1fZHVwbGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV9wYXNzdGhyb3VnaC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL19zdHJlYW1fcmVhZGFibGUuanMiLCJub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3RyYW5zZm9ybS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL19zdHJlYW1fd3JpdGFibGUuanMiLCJub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL3Bhc3N0aHJvdWdoLmpzIiwibm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9yZWFkYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vdHJhbnNmb3JtLmpzIiwibm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS93cml0YWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9yZXN1bWVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3N0cmVhbS1icm93c2VyaWZ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3N0cmluZy5wcm90b3R5cGUudHJpbS9pbXBsZW1lbnRhdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9zdHJpbmcucHJvdG90eXBlLnRyaW0vaW5kZXguanMiLCJub2RlX21vZHVsZXMvc3RyaW5nLnByb3RvdHlwZS50cmltL3BvbHlmaWxsLmpzIiwibm9kZV9tb2R1bGVzL3N0cmluZy5wcm90b3R5cGUudHJpbS9zaGltLmpzIiwibm9kZV9tb2R1bGVzL3N0cmluZ19kZWNvZGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RhcGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGFwZS9saWIvZGVmYXVsdF9zdHJlYW0uanMiLCJub2RlX21vZHVsZXMvdGFwZS9saWIvcmVzdWx0cy5qcyIsIm5vZGVfbW9kdWxlcy90YXBlL2xpYi90ZXN0LmpzIiwibm9kZV9tb2R1bGVzL3Rocm91Z2gvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdXRpbC1kZXByZWNhdGUvYnJvd3Nlci5qcyIsInNwZWNzL2RlbW8uY3NzIiwic3BlY3MvdGVzdC5qcyIsInNwZWNzL3Rlc3RzL2JveEFkZFJlbW92ZS50ZXN0LmpzIiwic3BlY3MvdGVzdHMvYm94Q29sbGlzaW9uLnRlc3QuanMiLCJzcGVjcy90ZXN0cy9ib3hNb3ZlLnRlc3QuanMiLCJzcGVjcy90ZXN0cy9ib3hSZXNpemUudGVzdC5qcyIsInNwZWNzL3Rlc3RzL2RyYWdnZXIudGVzdC5qcyIsInNwZWNzL3Rlc3RzL2dyaWRSZXNpemUudGVzdC5qcyIsInNwZWNzL3Rlc3RzL2luaXRHcmlkLnRlc3QuanMiLCJzcGVjcy91dGlsLmpzIiwic3JjL2JveC5qcyIsInNyYy9kYXNoZ3JpZC5qcyIsInNyYy9kcmFnLmpzIiwic3JjL2dyaWQuanMiLCJzcmMvZ3JpZEVuZ2luZS5qcyIsInNyYy9ncmlkVmlldy5qcyIsInNyYy9tb3VzZS5qcyIsInNyYy9yZW5kZXJlci5qcyIsInNyYy9yZXNpemUuanMiLCJzcmMvc2hpbXMuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDblpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTs7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQy8yQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmdCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBOztBQ0RBO0FBQ0E7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDcGZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LEVBQTJCLElBQTNCLEVBQWlDLFdBQWpDLEVBQThDO0FBQ2pELFFBQUksWUFBWSxJQUFaLElBQW9CLE9BQU8sT0FBUCxLQUFvQixXQUFwQixFQUFpQyxPQUF6RDtBQUNBLFFBQUksUUFBUSxnQkFBUixFQUEwQjtBQUMxQixnQkFBUSxnQkFBUixDQUEwQixJQUExQixFQUFnQyxXQUFoQyxFQUE2QyxLQUE3QyxFQUQwQjtLQUE5QixNQUVPLElBQUksUUFBUSxXQUFSLEVBQXFCO0FBQzVCLGdCQUFRLFdBQVIsQ0FBcUIsT0FBTyxJQUFQLEVBQWEsV0FBbEMsRUFENEI7S0FBekIsTUFFQTtBQUNILGdCQUFRLE9BQU8sSUFBUCxDQUFSLEdBQXVCLFdBQXZCLENBREc7S0FGQTtDQUpKOzs7Ozs7QUFlQSxTQUFTLFdBQVQsQ0FBcUIsT0FBckIsRUFBOEI7QUFDakMsV0FBTyxRQUFRLFVBQVIsRUFBb0I7QUFBQyxnQkFBUSxXQUFSLENBQW9CLFFBQVEsVUFBUixDQUFwQixDQUFEO0tBQTNCO0NBREc7Ozs7Ozs7O0FBVUEsU0FBUyxVQUFULENBQW9CLElBQXBCLEVBQTBCLFNBQTFCLEVBQXFDO0FBQ3hDLFdBQU8sS0FBSyxRQUFMLEtBQWtCLENBQWxCLElBQXVCLFNBQVMsU0FBUyxJQUFULEVBQWU7QUFDbEQsWUFBSSxLQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLFNBQXRCLElBQW1DLENBQUMsQ0FBRCxFQUFJO0FBQUMsbUJBQU8sSUFBUCxDQUFEO1NBQTNDO0FBQ0EsZUFBTyxLQUFLLFVBQUwsQ0FGMkM7S0FBdEQ7QUFJQSxXQUFPLEtBQVAsQ0FMd0M7Q0FBckMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheVxuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gZnJvbUJ5dGVBcnJheVxuXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxuXG5mdW5jdGlvbiBpbml0ICgpIHtcbiAgdmFyIGNvZGUgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLydcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBsb29rdXBbaV0gPSBjb2RlW2ldXG4gICAgcmV2TG9va3VwW2NvZGUuY2hhckNvZGVBdChpKV0gPSBpXG4gIH1cblxuICByZXZMb29rdXBbJy0nLmNoYXJDb2RlQXQoMCldID0gNjJcbiAgcmV2TG9va3VwWydfJy5jaGFyQ29kZUF0KDApXSA9IDYzXG59XG5cbmluaXQoKVxuXG5mdW5jdGlvbiB0b0J5dGVBcnJheSAoYjY0KSB7XG4gIHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cbiAgaWYgKGxlbiAlIDQgPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0JylcbiAgfVxuXG4gIC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG4gIC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcbiAgLy8gcmVwcmVzZW50IG9uZSBieXRlXG4gIC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuICAvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG4gIHBsYWNlSG9sZGVycyA9IGI2NFtsZW4gLSAyXSA9PT0gJz0nID8gMiA6IGI2NFtsZW4gLSAxXSA9PT0gJz0nID8gMSA6IDBcblxuICAvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcbiAgYXJyID0gbmV3IEFycihsZW4gKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuICAvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG4gIGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gbGVuIC0gNCA6IGxlblxuXG4gIHZhciBMID0gMFxuXG4gIGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxOCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildIDw8IDYpIHwgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAzKV1cbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gMTYpICYgMHhGRlxuICAgIGFycltMKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAyKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA+PiA0KVxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDEwKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCA0KSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA+PiAyKVxuICAgIGFycltMKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcbiAgcmV0dXJuIGxvb2t1cFtudW0gPj4gMTggJiAweDNGXSArIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICsgbG9va3VwW251bSAmIDB4M0ZdXG59XG5cbmZ1bmN0aW9uIGVuY29kZUNodW5rICh1aW50OCwgc3RhcnQsIGVuZCkge1xuICB2YXIgdG1wXG4gIHZhciBvdXRwdXQgPSBbXVxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkgKz0gMykge1xuICAgIHRtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcbiAgICBvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSlcbiAgfVxuICByZXR1cm4gb3V0cHV0LmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGZyb21CeXRlQXJyYXkgKHVpbnQ4KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbiA9IHVpbnQ4Lmxlbmd0aFxuICB2YXIgZXh0cmFCeXRlcyA9IGxlbiAlIDMgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcbiAgdmFyIG91dHB1dCA9ICcnXG4gIHZhciBwYXJ0cyA9IFtdXG4gIHZhciBtYXhDaHVua0xlbmd0aCA9IDE2MzgzIC8vIG11c3QgYmUgbXVsdGlwbGUgb2YgM1xuXG4gIC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbjIgPSBsZW4gLSBleHRyYUJ5dGVzOyBpIDwgbGVuMjsgaSArPSBtYXhDaHVua0xlbmd0aCkge1xuICAgIHBhcnRzLnB1c2goZW5jb2RlQ2h1bmsodWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKSkpXG4gIH1cblxuICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgdG1wID0gdWludDhbbGVuIC0gMV1cbiAgICBvdXRwdXQgKz0gbG9va3VwW3RtcCA+PiAyXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9ICc9PSdcbiAgfSBlbHNlIGlmIChleHRyYUJ5dGVzID09PSAyKSB7XG4gICAgdG1wID0gKHVpbnQ4W2xlbiAtIDJdIDw8IDgpICsgKHVpbnQ4W2xlbiAtIDFdKVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDEwXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA+PiA0KSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDIpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz0nXG4gIH1cblxuICBwYXJ0cy5wdXNoKG91dHB1dClcblxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cbiIsIiIsIid1c2Ugc3RyaWN0Jztcbi8vIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IGJyb3dzZXIgZmllbGQsIGNoZWNrIG91dCB0aGUgYnJvd3NlciBmaWVsZCBhdCBodHRwczovL2dpdGh1Yi5jb20vc3Vic3RhY2svYnJvd3NlcmlmeS1oYW5kYm9vayNicm93c2VyLWZpZWxkLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvLyBDcmVhdGUgYSA8bGluaz4gdGFnIHdpdGggb3B0aW9uYWwgZGF0YSBhdHRyaWJ1dGVzXG4gICAgY3JlYXRlTGluazogZnVuY3Rpb24oaHJlZiwgYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG5cbiAgICAgICAgbGluay5ocmVmID0gaHJlZjtcbiAgICAgICAgbGluay5yZWwgPSAnc3R5bGVzaGVldCc7XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGlmICggISBhdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdkYXRhLScgKyBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgfSxcbiAgICAvLyBDcmVhdGUgYSA8c3R5bGU+IHRhZyB3aXRoIG9wdGlvbmFsIGRhdGEgYXR0cmlidXRlc1xuICAgIGNyZWF0ZVN0eWxlOiBmdW5jdGlvbihjc3NUZXh0LCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLFxuICAgICAgICAgICAgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG4gICAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBpZiAoICEgYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoc3R5bGUuc2hlZXQpIHsgLy8gZm9yIGpzZG9tIGFuZCBJRTkrXG4gICAgICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBjc3NUZXh0O1xuICAgICAgICAgICAgc3R5bGUuc2hlZXQuY3NzVGV4dCA9IGNzc1RleHQ7XG4gICAgICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7IC8vIGZvciBJRTggYW5kIGJlbG93XG4gICAgICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzc1RleHQ7XG4gICAgICAgIH0gZWxzZSB7IC8vIGZvciBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmlcbiAgICAgICAgICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzc1RleHQpKTtcbiAgICAgICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbid1c2Ugc3RyaWN0J1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gU2xvd0J1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxudmFyIHJvb3RQYXJlbnQgPSB7fVxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBEdWUgdG8gdmFyaW91cyBicm93c2VyIGJ1Z3MsIHNvbWV0aW1lcyB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uIHdpbGwgYmUgdXNlZCBldmVuXG4gKiB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHR5cGVkIGFycmF5cy5cbiAqXG4gKiBOb3RlOlxuICpcbiAqICAgLSBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsXG4gKiAgICAgU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzguXG4gKlxuICogICAtIENocm9tZSA5LTEwIGlzIG1pc3NpbmcgdGhlIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24uXG4gKlxuICogICAtIElFMTAgaGFzIGEgYnJva2VuIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhcnJheXMgb2ZcbiAqICAgICBpbmNvcnJlY3QgbGVuZ3RoIGluIHNvbWUgc2l0dWF0aW9ucy5cblxuICogV2UgZGV0ZWN0IHRoZXNlIGJ1Z2d5IGJyb3dzZXJzIGFuZCBzZXQgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYCB0byBgZmFsc2VgIHNvIHRoZXlcbiAqIGdldCB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uLCB3aGljaCBpcyBzbG93ZXIgYnV0IGJlaGF2ZXMgY29ycmVjdGx5LlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUICE9PSB1bmRlZmluZWRcbiAgPyBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVFxuICA6IHR5cGVkQXJyYXlTdXBwb3J0KClcblxuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDIgJiYgLy8gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWRcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAmJiAvLyBjaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgICAgICAgYXJyLnN1YmFycmF5KDEsIDEpLmJ5dGVMZW5ndGggPT09IDAgLy8gaWUxMCBoYXMgYnJva2VuIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIGtNYXhMZW5ndGggKCkge1xuICByZXR1cm4gQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgICA/IDB4N2ZmZmZmZmZcbiAgICA6IDB4M2ZmZmZmZmZcbn1cblxuLyoqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGhhdmUgdGhlaXJcbiAqIHByb3RvdHlwZSBjaGFuZ2VkIHRvIGBCdWZmZXIucHJvdG90eXBlYC4gRnVydGhlcm1vcmUsIGBCdWZmZXJgIGlzIGEgc3ViY2xhc3Mgb2ZcbiAqIGBVaW50OEFycmF5YCwgc28gdGhlIHJldHVybmVkIGluc3RhbmNlcyB3aWxsIGhhdmUgYWxsIHRoZSBub2RlIGBCdWZmZXJgIG1ldGhvZHNcbiAqIGFuZCB0aGUgYFVpbnQ4QXJyYXlgIG1ldGhvZHMuIFNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0XG4gKiByZXR1cm5zIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIFRoZSBgVWludDhBcnJheWAgcHJvdG90eXBlIHJlbWFpbnMgdW5tb2RpZmllZC5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChhcmcpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICAvLyBBdm9pZCBnb2luZyB0aHJvdWdoIGFuIEFyZ3VtZW50c0FkYXB0b3JUcmFtcG9saW5lIGluIHRoZSBjb21tb24gY2FzZS5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHJldHVybiBuZXcgQnVmZmVyKGFyZywgYXJndW1lbnRzWzFdKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKGFyZylcbiAgfVxuXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzLmxlbmd0aCA9IDBcbiAgICB0aGlzLnBhcmVudCA9IHVuZGVmaW5lZFxuICB9XG5cbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBmcm9tTnVtYmVyKHRoaXMsIGFyZylcbiAgfVxuXG4gIC8vIFNsaWdodGx5IGxlc3MgY29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHRoaXMsIGFyZywgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiAndXRmOCcpXG4gIH1cblxuICAvLyBVbnVzdWFsLlxuICByZXR1cm4gZnJvbU9iamVjdCh0aGlzLCBhcmcpXG59XG5cbi8vIFRPRE86IExlZ2FjeSwgbm90IG5lZWRlZCBhbnltb3JlLiBSZW1vdmUgaW4gbmV4dCBtYWpvciB2ZXJzaW9uLlxuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIGZyb21OdW1iZXIgKHRoYXQsIGxlbmd0aCkge1xuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGxlbmd0aCkgfCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdGhhdFtpXSA9IDBcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbVN0cmluZyAodGhhdCwgc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJyB8fCBlbmNvZGluZyA9PT0gJycpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgLy8gQXNzdW1wdGlvbjogYnl0ZUxlbmd0aCgpIHJldHVybiB2YWx1ZSBpcyBhbHdheXMgPCBrTWF4TGVuZ3RoLlxuICB2YXIgbGVuZ3RoID0gYnl0ZUxlbmd0aChzdHJpbmcsIGVuY29kaW5nKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcblxuICB0aGF0LndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKHRoYXQsIG9iamVjdCkge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iamVjdCkpIHJldHVybiBmcm9tQnVmZmVyKHRoYXQsIG9iamVjdClcblxuICBpZiAoaXNBcnJheShvYmplY3QpKSByZXR1cm4gZnJvbUFycmF5KHRoYXQsIG9iamVjdClcblxuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHN0YXJ0IHdpdGggbnVtYmVyLCBidWZmZXIsIGFycmF5IG9yIHN0cmluZycpXG4gIH1cblxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChvYmplY3QuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBmcm9tVHlwZWRBcnJheSh0aGF0LCBvYmplY3QpXG4gICAgfVxuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih0aGF0LCBvYmplY3QpXG4gICAgfVxuICB9XG5cbiAgaWYgKG9iamVjdC5sZW5ndGgpIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iamVjdClcblxuICByZXR1cm4gZnJvbUpzb25PYmplY3QodGhhdCwgb2JqZWN0KVxufVxuXG5mdW5jdGlvbiBmcm9tQnVmZmVyICh0aGF0LCBidWZmZXIpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYnVmZmVyLmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBhbGxvY2F0ZSh0aGF0LCBsZW5ndGgpXG4gIGJ1ZmZlci5jb3B5KHRoYXQsIDAsIDAsIGxlbmd0aClcbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5ICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuLy8gRHVwbGljYXRlIG9mIGZyb21BcnJheSgpIHRvIGtlZXAgZnJvbUFycmF5KCkgbW9ub21vcnBoaWMuXG5mdW5jdGlvbiBmcm9tVHlwZWRBcnJheSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcbiAgLy8gVHJ1bmNhdGluZyB0aGUgZWxlbWVudHMgaXMgcHJvYmFibHkgbm90IHdoYXQgcGVvcGxlIGV4cGVjdCBmcm9tIHR5cGVkXG4gIC8vIGFycmF5cyB3aXRoIEJZVEVTX1BFUl9FTEVNRU5UID4gMSBidXQgaXQncyBjb21wYXRpYmxlIHdpdGggdGhlIGJlaGF2aW9yXG4gIC8vIG9mIHRoZSBvbGQgQnVmZmVyIGNvbnN0cnVjdG9yLlxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyICh0aGF0LCBhcnJheSkge1xuICBhcnJheS5ieXRlTGVuZ3RoIC8vIHRoaXMgdGhyb3dzIGlmIGBhcnJheWAgaXMgbm90IGEgdmFsaWQgQXJyYXlCdWZmZXJcblxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXkpXG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIHRoYXQgPSBmcm9tVHlwZWRBcnJheSh0aGF0LCBuZXcgVWludDhBcnJheShhcnJheSkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIHRoYXRbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbi8vIERlc2VyaWFsaXplIHsgdHlwZTogJ0J1ZmZlcicsIGRhdGE6IFsxLDIsMywuLi5dIH0gaW50byBhIEJ1ZmZlciBvYmplY3QuXG4vLyBSZXR1cm5zIGEgemVyby1sZW5ndGggYnVmZmVyIGZvciBpbnB1dHMgdGhhdCBkb24ndCBjb25mb3JtIHRvIHRoZSBzcGVjLlxuZnVuY3Rpb24gZnJvbUpzb25PYmplY3QgKHRoYXQsIG9iamVjdCkge1xuICB2YXIgYXJyYXlcbiAgdmFyIGxlbmd0aCA9IDBcblxuICBpZiAob2JqZWN0LnR5cGUgPT09ICdCdWZmZXInICYmIGlzQXJyYXkob2JqZWN0LmRhdGEpKSB7XG4gICAgYXJyYXkgPSBvYmplY3QuZGF0YVxuICAgIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgfVxuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0aGF0W2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5pZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuICBCdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnNwZWNpZXMgJiZcbiAgICAgIEJ1ZmZlcltTeW1ib2wuc3BlY2llc10gPT09IEJ1ZmZlcikge1xuICAgIC8vIEZpeCBzdWJhcnJheSgpIGluIEVTMjAxNi4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzk3XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlciwgU3ltYm9sLnNwZWNpZXMsIHtcbiAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSlcbiAgfVxufSBlbHNlIHtcbiAgLy8gcHJlLXNldCBmb3IgdmFsdWVzIHRoYXQgbWF5IGV4aXN0IGluIHRoZSBmdXR1cmVcbiAgQnVmZmVyLnByb3RvdHlwZS5sZW5ndGggPSB1bmRlZmluZWRcbiAgQnVmZmVyLnByb3RvdHlwZS5wYXJlbnQgPSB1bmRlZmluZWRcbn1cblxuZnVuY3Rpb24gYWxsb2NhdGUgKHRoYXQsIGxlbmd0aCkge1xuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gbmV3IFVpbnQ4QXJyYXkobGVuZ3RoKVxuICAgIHRoYXQuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gYW4gb2JqZWN0IGluc3RhbmNlIG9mIHRoZSBCdWZmZXIgY2xhc3NcbiAgICB0aGF0Lmxlbmd0aCA9IGxlbmd0aFxuICB9XG5cbiAgdmFyIGZyb21Qb29sID0gbGVuZ3RoICE9PSAwICYmIGxlbmd0aCA8PSBCdWZmZXIucG9vbFNpemUgPj4+IDFcbiAgaWYgKGZyb21Qb29sKSB0aGF0LnBhcmVudCA9IHJvb3RQYXJlbnRcblxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwga01heExlbmd0aGAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBrTWF4TGVuZ3RoKCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsga01heExlbmd0aCgpLnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmZ1bmN0aW9uIFNsb3dCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTbG93QnVmZmVyKSkgcmV0dXJuIG5ldyBTbG93QnVmZmVyKHN1YmplY3QsIGVuY29kaW5nKVxuXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nKVxuICBkZWxldGUgYnVmLnBhcmVudFxuICByZXR1cm4gYnVmXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIG11c3QgYmUgQnVmZmVycycpXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICB2YXIgeCA9IGEubGVuZ3RoXG4gIHZhciB5ID0gYi5sZW5ndGhcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXVxuICAgICAgeSA9IGJbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIGlzRW5jb2RpbmcgKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0IChsaXN0LCBsZW5ndGgpIHtcbiAgaWYgKCFpc0FycmF5KGxpc3QpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdsaXN0IGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycy4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH1cblxuICB2YXIgaVxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBsZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykgc3RyaW5nID0gJycgKyBzdHJpbmdcblxuICB2YXIgbGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAobGVuID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIFVzZSBhIGZvciBsb29wIHRvIGF2b2lkIHJlY3Vyc2lvblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIC8vIERlcHJlY2F0ZWRcbiAgICAgIGNhc2UgJ3Jhdyc6XG4gICAgICBjYXNlICdyYXdzJzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuQnVmZmVyLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5cbmZ1bmN0aW9uIHNsb3dUb1N0cmluZyAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcblxuICBzdGFydCA9IHN0YXJ0IHwgMFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCB8fCBlbmQgPT09IEluZmluaXR5ID8gdGhpcy5sZW5ndGggOiBlbmQgfCAwXG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcbiAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKGVuZCA8PSBzdGFydCkgcmV0dXJuICcnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gYmluYXJ5U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1dGYxNmxlU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKGVuY29kaW5nICsgJycpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbi8vIFRoZSBwcm9wZXJ0eSBpcyB1c2VkIGJ5IGBCdWZmZXIuaXNCdWZmZXJgIGFuZCBgaXMtYnVmZmVyYCAoaW4gU2FmYXJpIDUtNykgdG8gZGV0ZWN0XG4vLyBCdWZmZXIgaW5zdGFuY2VzLlxuQnVmZmVyLnByb3RvdHlwZS5faXNCdWZmZXIgPSB0cnVlXG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCB8IDBcbiAgaWYgKGxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIDAsIGxlbmd0aClcbiAgcmV0dXJuIHNsb3dUb1N0cmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gZXF1YWxzIChiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiB0cnVlXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKSA9PT0gMFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgdmFyIHN0ciA9ICcnXG4gIHZhciBtYXggPSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTXG4gIGlmICh0aGlzLmxlbmd0aCA+IDApIHtcbiAgICBzdHIgPSB0aGlzLnRvU3RyaW5nKCdoZXgnLCAwLCBtYXgpLm1hdGNoKC8uezJ9L2cpLmpvaW4oJyAnKVxuICAgIGlmICh0aGlzLmxlbmd0aCA+IG1heCkgc3RyICs9ICcgLi4uICdcbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIHN0ciArICc+J1xufVxuXG5CdWZmZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlIChiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCkge1xuICBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIGJ5dGVPZmZzZXQgPSAweDdmZmZmZmZmXG4gIGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkgYnl0ZU9mZnNldCA9IC0weDgwMDAwMDAwXG4gIGJ5dGVPZmZzZXQgPj49IDBcblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVybiAtMVxuICBpZiAoYnl0ZU9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuIC0xXG5cbiAgLy8gTmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBNYXRoLm1heCh0aGlzLmxlbmd0aCArIGJ5dGVPZmZzZXQsIDApXG5cbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDApIHJldHVybiAtMSAvLyBzcGVjaWFsIGNhc2U6IGxvb2tpbmcgZm9yIGVtcHR5IHN0cmluZyBhbHdheXMgZmFpbHNcbiAgICByZXR1cm4gU3RyaW5nLnByb3RvdHlwZS5pbmRleE9mLmNhbGwodGhpcywgdmFsLCBieXRlT2Zmc2V0KVxuICB9XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgIHJldHVybiBhcnJheUluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0KVxuICB9XG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKHRoaXMsIHZhbCwgYnl0ZU9mZnNldClcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZih0aGlzLCBbIHZhbCBdLCBieXRlT2Zmc2V0KVxuICB9XG5cbiAgZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCkge1xuICAgIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKHZhciBpID0gMDsgYnl0ZU9mZnNldCArIGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhcnJbYnl0ZU9mZnNldCArIGldID09PSB2YWxbZm91bmRJbmRleCA9PT0gLTEgPyAwIDogaSAtIGZvdW5kSW5kZXhdKSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ID09PSAtMSkgZm91bmRJbmRleCA9IGlcbiAgICAgICAgaWYgKGkgLSBmb3VuZEluZGV4ICsgMSA9PT0gdmFsLmxlbmd0aCkgcmV0dXJuIGJ5dGVPZmZzZXQgKyBmb3VuZEluZGV4XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2YWwgbXVzdCBiZSBzdHJpbmcsIG51bWJlciBvciBCdWZmZXInKVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChzdHJMZW4gJSAyICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKHBhcnNlZCkpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgbGVuZ3RoID0gbGVuZ3RoIHwgMFxuICAgICAgaWYgKGVuY29kaW5nID09PSB1bmRlZmluZWQpIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIC8vIGxlZ2FjeSB3cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aCkgLSByZW1vdmUgaW4gdjAuMTNcbiAgfSBlbHNlIHtcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBvZmZzZXQgPSBsZW5ndGggfCAwXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCB8fCBsZW5ndGggPiByZW1haW5pbmcpIGxlbmd0aCA9IHJlbWFpbmluZ1xuXG4gIGlmICgoc3RyaW5nLmxlbmd0aCA+IDAgJiYgKGxlbmd0aCA8IDAgfHwgb2Zmc2V0IDwgMCkpIHx8IG9mZnNldCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2F0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBiaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGJpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpICsgMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgdmFyIG5ld0J1ZlxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBuZXdCdWYgPSB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpXG4gICAgbmV3QnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfVxuXG4gIGlmIChuZXdCdWYubGVuZ3RoKSBuZXdCdWYucGFyZW50ID0gdGhpcy5wYXJlbnQgfHwgdGhpc1xuXG4gIHJldHVybiBuZXdCdWZcbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdvZmZzZXQgaXMgbm90IHVpbnQnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gbGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRSA9IGZ1bmN0aW9uIHJlYWRVSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludExFID0gZnVuY3Rpb24gcmVhZEludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoXG4gIHZhciBtdWwgPSAxXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSkgcmV0dXJuICh0aGlzW29mZnNldF0pXG4gIHJldHVybiAoKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gcmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiByZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYnVmZmVyIG11c3QgYmUgYSBCdWZmZXIgaW5zdGFuY2UnKVxuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHRocm93IG5ldyBSYW5nZUVycm9yKCd2YWx1ZSBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdpbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSwgMClcblxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludEJFID0gZnVuY3Rpb24gd3JpdGVVSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSwgMClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiB3cml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4ZmYsIDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IHZhbHVlIDwgMCA/IDEgOiAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gdmFsdWUgPCAwID8gMSA6IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdpbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG4gIHZhciBpXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yIChpID0gbGVuIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2UgaWYgKGxlbiA8IDEwMDAgfHwgIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gYXNjZW5kaW5nIGNvcHkgZnJvbSBzdGFydFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmIChlbmQgPCBzdGFydCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDAgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdlbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICB0aGlzW2ldID0gdmFsdWVcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJ5dGVzID0gdXRmOFRvQnl0ZXModmFsdWUudG9TdHJpbmcoKSlcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgdGhpc1tpXSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rXFwvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyaW5ndHJpbShzdHIpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoYmFzZTY0Y2xlYW4oc3RyKSlcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5cbmZ1bmN0aW9uIGlzQXJyYXkoYXJnKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXJnKTtcbiAgfVxuICByZXR1cm4gb2JqZWN0VG9TdHJpbmcoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IEJ1ZmZlci5pc0J1ZmZlcjtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuIiwiLyohXG4gKiBkZWVwLWRpZmYuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cbjsoZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICAndXNlIHN0cmljdCc7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcbiAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcbiAgICAvLyBsaWtlIE5vZGUuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICByb290LkRlZXBEaWZmID0gZmFjdG9yeSgpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uKHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyICRzY29wZSwgY29uZmxpY3QsIGNvbmZsaWN0UmVzb2x1dGlvbiA9IFtdO1xuICBpZiAodHlwZW9mIGdsb2JhbCA9PT0gJ29iamVjdCcgJiYgZ2xvYmFsKSB7XG4gICAgJHNjb3BlID0gZ2xvYmFsO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgJHNjb3BlID0gd2luZG93O1xuICB9IGVsc2Uge1xuICAgICRzY29wZSA9IHt9O1xuICB9XG4gIGNvbmZsaWN0ID0gJHNjb3BlLkRlZXBEaWZmO1xuICBpZiAoY29uZmxpY3QpIHtcbiAgICBjb25mbGljdFJlc29sdXRpb24ucHVzaChcbiAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBjb25mbGljdCAmJiAkc2NvcGUuRGVlcERpZmYgPT09IGFjY3VtdWxhdGVEaWZmKSB7XG4gICAgICAgICAgJHNjb3BlLkRlZXBEaWZmID0gY29uZmxpY3Q7XG4gICAgICAgICAgY29uZmxpY3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgLy8gbm9kZWpzIGNvbXBhdGlibGUgb24gc2VydmVyIHNpZGUgYW5kIGluIHRoZSBicm93c2VyLlxuICBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvcjtcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBEaWZmKGtpbmQsIHBhdGgpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2tpbmQnLCB7XG4gICAgICB2YWx1ZToga2luZCxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdwYXRoJywge1xuICAgICAgICB2YWx1ZTogcGF0aCxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gRGlmZkVkaXQocGF0aCwgb3JpZ2luLCB2YWx1ZSkge1xuICAgIERpZmZFZGl0LnN1cGVyXy5jYWxsKHRoaXMsICdFJywgcGF0aCk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdsaHMnLCB7XG4gICAgICB2YWx1ZTogb3JpZ2luLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAncmhzJywge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9XG4gIGluaGVyaXRzKERpZmZFZGl0LCBEaWZmKTtcblxuICBmdW5jdGlvbiBEaWZmTmV3KHBhdGgsIHZhbHVlKSB7XG4gICAgRGlmZk5ldy5zdXBlcl8uY2FsbCh0aGlzLCAnTicsIHBhdGgpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAncmhzJywge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9XG4gIGluaGVyaXRzKERpZmZOZXcsIERpZmYpO1xuXG4gIGZ1bmN0aW9uIERpZmZEZWxldGVkKHBhdGgsIHZhbHVlKSB7XG4gICAgRGlmZkRlbGV0ZWQuc3VwZXJfLmNhbGwodGhpcywgJ0QnLCBwYXRoKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2xocycsIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9KTtcbiAgfVxuICBpbmhlcml0cyhEaWZmRGVsZXRlZCwgRGlmZik7XG5cbiAgZnVuY3Rpb24gRGlmZkFycmF5KHBhdGgsIGluZGV4LCBpdGVtKSB7XG4gICAgRGlmZkFycmF5LnN1cGVyXy5jYWxsKHRoaXMsICdBJywgcGF0aCk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdpbmRleCcsIHtcbiAgICAgIHZhbHVlOiBpbmRleCxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2l0ZW0nLCB7XG4gICAgICB2YWx1ZTogaXRlbSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9KTtcbiAgfVxuICBpbmhlcml0cyhEaWZmQXJyYXksIERpZmYpO1xuXG4gIGZ1bmN0aW9uIGFycmF5UmVtb3ZlKGFyciwgZnJvbSwgdG8pIHtcbiAgICB2YXIgcmVzdCA9IGFyci5zbGljZSgodG8gfHwgZnJvbSkgKyAxIHx8IGFyci5sZW5ndGgpO1xuICAgIGFyci5sZW5ndGggPSBmcm9tIDwgMCA/IGFyci5sZW5ndGggKyBmcm9tIDogZnJvbTtcbiAgICBhcnIucHVzaC5hcHBseShhcnIsIHJlc3QpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICBmdW5jdGlvbiByZWFsVHlwZU9mKHN1YmplY3QpIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0O1xuICAgIGlmICh0eXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuXG4gICAgaWYgKHN1YmplY3QgPT09IE1hdGgpIHtcbiAgICAgIHJldHVybiAnbWF0aCc7XG4gICAgfSBlbHNlIGlmIChzdWJqZWN0ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gJ251bGwnO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShzdWJqZWN0KSkge1xuICAgICAgcmV0dXJuICdhcnJheSc7XG4gICAgfSBlbHNlIGlmIChzdWJqZWN0IGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgcmV0dXJuICdkYXRlJztcbiAgICB9IGVsc2UgaWYgKC9eXFwvLipcXC8vLnRlc3Qoc3ViamVjdC50b1N0cmluZygpKSkge1xuICAgICAgcmV0dXJuICdyZWdleHAnO1xuICAgIH1cbiAgICByZXR1cm4gJ29iamVjdCc7XG4gIH1cblxuICBmdW5jdGlvbiBkZWVwRGlmZihsaHMsIHJocywgY2hhbmdlcywgcHJlZmlsdGVyLCBwYXRoLCBrZXksIHN0YWNrKSB7XG4gICAgcGF0aCA9IHBhdGggfHwgW107XG4gICAgdmFyIGN1cnJlbnRQYXRoID0gcGF0aC5zbGljZSgwKTtcbiAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmIChwcmVmaWx0ZXIgJiYgcHJlZmlsdGVyKGN1cnJlbnRQYXRoLCBrZXksIHsgbGhzOiBsaHMsIHJoczogcmhzIH0pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGN1cnJlbnRQYXRoLnB1c2goa2V5KTtcbiAgICB9XG4gICAgdmFyIGx0eXBlID0gdHlwZW9mIGxocztcbiAgICB2YXIgcnR5cGUgPSB0eXBlb2YgcmhzO1xuICAgIGlmIChsdHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmIChydHlwZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY2hhbmdlcyhuZXcgRGlmZk5ldyhjdXJyZW50UGF0aCwgcmhzKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChydHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNoYW5nZXMobmV3IERpZmZEZWxldGVkKGN1cnJlbnRQYXRoLCBsaHMpKTtcbiAgICB9IGVsc2UgaWYgKHJlYWxUeXBlT2YobGhzKSAhPT0gcmVhbFR5cGVPZihyaHMpKSB7XG4gICAgICBjaGFuZ2VzKG5ldyBEaWZmRWRpdChjdXJyZW50UGF0aCwgbGhzLCByaHMpKTtcbiAgICB9IGVsc2UgaWYgKGxocyBpbnN0YW5jZW9mIERhdGUgJiYgcmhzIGluc3RhbmNlb2YgRGF0ZSAmJiAoKGxocyAtIHJocykgIT09IDApKSB7XG4gICAgICBjaGFuZ2VzKG5ldyBEaWZmRWRpdChjdXJyZW50UGF0aCwgbGhzLCByaHMpKTtcbiAgICB9IGVsc2UgaWYgKGx0eXBlID09PSAnb2JqZWN0JyAmJiBsaHMgIT09IG51bGwgJiYgcmhzICE9PSBudWxsKSB7XG4gICAgICBzdGFjayA9IHN0YWNrIHx8IFtdO1xuICAgICAgaWYgKHN0YWNrLmluZGV4T2YobGhzKSA8IDApIHtcbiAgICAgICAgc3RhY2sucHVzaChsaHMpO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShsaHMpKSB7XG4gICAgICAgICAgdmFyIGksIGxlbiA9IGxocy5sZW5ndGg7XG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxocy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgPj0gcmhzLmxlbmd0aCkge1xuICAgICAgICAgICAgICBjaGFuZ2VzKG5ldyBEaWZmQXJyYXkoY3VycmVudFBhdGgsIGksIG5ldyBEaWZmRGVsZXRlZCh1bmRlZmluZWQsIGxoc1tpXSkpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGRlZXBEaWZmKGxoc1tpXSwgcmhzW2ldLCBjaGFuZ2VzLCBwcmVmaWx0ZXIsIGN1cnJlbnRQYXRoLCBpLCBzdGFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHdoaWxlIChpIDwgcmhzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2hhbmdlcyhuZXcgRGlmZkFycmF5KGN1cnJlbnRQYXRoLCBpLCBuZXcgRGlmZk5ldyh1bmRlZmluZWQsIHJoc1tpKytdKSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgYWtleXMgPSBPYmplY3Qua2V5cyhsaHMpO1xuICAgICAgICAgIHZhciBwa2V5cyA9IE9iamVjdC5rZXlzKHJocyk7XG4gICAgICAgICAgYWtleXMuZm9yRWFjaChmdW5jdGlvbihrLCBpKSB7XG4gICAgICAgICAgICB2YXIgb3RoZXIgPSBwa2V5cy5pbmRleE9mKGspO1xuICAgICAgICAgICAgaWYgKG90aGVyID49IDApIHtcbiAgICAgICAgICAgICAgZGVlcERpZmYobGhzW2tdLCByaHNba10sIGNoYW5nZXMsIHByZWZpbHRlciwgY3VycmVudFBhdGgsIGssIHN0YWNrKTtcbiAgICAgICAgICAgICAgcGtleXMgPSBhcnJheVJlbW92ZShwa2V5cywgb3RoZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZGVlcERpZmYobGhzW2tdLCB1bmRlZmluZWQsIGNoYW5nZXMsIHByZWZpbHRlciwgY3VycmVudFBhdGgsIGssIHN0YWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwa2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgIGRlZXBEaWZmKHVuZGVmaW5lZCwgcmhzW2tdLCBjaGFuZ2VzLCBwcmVmaWx0ZXIsIGN1cnJlbnRQYXRoLCBrLCBzdGFjayk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc3RhY2subGVuZ3RoID0gc3RhY2subGVuZ3RoIC0gMTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGxocyAhPT0gcmhzKSB7XG4gICAgICBpZiAoIShsdHlwZSA9PT0gJ251bWJlcicgJiYgaXNOYU4obGhzKSAmJiBpc05hTihyaHMpKSkge1xuICAgICAgICBjaGFuZ2VzKG5ldyBEaWZmRWRpdChjdXJyZW50UGF0aCwgbGhzLCByaHMpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhY2N1bXVsYXRlRGlmZihsaHMsIHJocywgcHJlZmlsdGVyLCBhY2N1bSkge1xuICAgIGFjY3VtID0gYWNjdW0gfHwgW107XG4gICAgZGVlcERpZmYobGhzLCByaHMsXG4gICAgICBmdW5jdGlvbihkaWZmKSB7XG4gICAgICAgIGlmIChkaWZmKSB7XG4gICAgICAgICAgYWNjdW0ucHVzaChkaWZmKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHByZWZpbHRlcik7XG4gICAgcmV0dXJuIChhY2N1bS5sZW5ndGgpID8gYWNjdW0gOiB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBhcHBseUFycmF5Q2hhbmdlKGFyciwgaW5kZXgsIGNoYW5nZSkge1xuICAgIGlmIChjaGFuZ2UucGF0aCAmJiBjaGFuZ2UucGF0aC5sZW5ndGgpIHtcbiAgICAgIHZhciBpdCA9IGFycltpbmRleF0sXG4gICAgICAgIGksIHUgPSBjaGFuZ2UucGF0aC5sZW5ndGggLSAxO1xuICAgICAgZm9yIChpID0gMDsgaSA8IHU7IGkrKykge1xuICAgICAgICBpdCA9IGl0W2NoYW5nZS5wYXRoW2ldXTtcbiAgICAgIH1cbiAgICAgIHN3aXRjaCAoY2hhbmdlLmtpbmQpIHtcbiAgICAgICAgY2FzZSAnQSc6XG4gICAgICAgICAgYXBwbHlBcnJheUNoYW5nZShpdFtjaGFuZ2UucGF0aFtpXV0sIGNoYW5nZS5pbmRleCwgY2hhbmdlLml0ZW0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdEJzpcbiAgICAgICAgICBkZWxldGUgaXRbY2hhbmdlLnBhdGhbaV1dO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdFJzpcbiAgICAgICAgY2FzZSAnTic6XG4gICAgICAgICAgaXRbY2hhbmdlLnBhdGhbaV1dID0gY2hhbmdlLnJocztcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3dpdGNoIChjaGFuZ2Uua2luZCkge1xuICAgICAgICBjYXNlICdBJzpcbiAgICAgICAgICBhcHBseUFycmF5Q2hhbmdlKGFycltpbmRleF0sIGNoYW5nZS5pbmRleCwgY2hhbmdlLml0ZW0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdEJzpcbiAgICAgICAgICBhcnIgPSBhcnJheVJlbW92ZShhcnIsIGluZGV4KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnRSc6XG4gICAgICAgIGNhc2UgJ04nOlxuICAgICAgICAgIGFycltpbmRleF0gPSBjaGFuZ2UucmhzO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgZnVuY3Rpb24gYXBwbHlDaGFuZ2UodGFyZ2V0LCBzb3VyY2UsIGNoYW5nZSkge1xuICAgIGlmICh0YXJnZXQgJiYgc291cmNlICYmIGNoYW5nZSAmJiBjaGFuZ2Uua2luZCkge1xuICAgICAgdmFyIGl0ID0gdGFyZ2V0LFxuICAgICAgICBpID0gLTEsXG4gICAgICAgIGxhc3QgPSBjaGFuZ2UucGF0aCA/IGNoYW5nZS5wYXRoLmxlbmd0aCAtIDEgOiAwO1xuICAgICAgd2hpbGUgKCsraSA8IGxhc3QpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdFtjaGFuZ2UucGF0aFtpXV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgaXRbY2hhbmdlLnBhdGhbaV1dID0gKHR5cGVvZiBjaGFuZ2UucGF0aFtpXSA9PT0gJ251bWJlcicpID8gW10gOiB7fTtcbiAgICAgICAgfVxuICAgICAgICBpdCA9IGl0W2NoYW5nZS5wYXRoW2ldXTtcbiAgICAgIH1cbiAgICAgIHN3aXRjaCAoY2hhbmdlLmtpbmQpIHtcbiAgICAgICAgY2FzZSAnQSc6XG4gICAgICAgICAgYXBwbHlBcnJheUNoYW5nZShjaGFuZ2UucGF0aCA/IGl0W2NoYW5nZS5wYXRoW2ldXSA6IGl0LCBjaGFuZ2UuaW5kZXgsIGNoYW5nZS5pdGVtKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnRCc6XG4gICAgICAgICAgZGVsZXRlIGl0W2NoYW5nZS5wYXRoW2ldXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnRSc6XG4gICAgICAgIGNhc2UgJ04nOlxuICAgICAgICAgIGl0W2NoYW5nZS5wYXRoW2ldXSA9IGNoYW5nZS5yaHM7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmV2ZXJ0QXJyYXlDaGFuZ2UoYXJyLCBpbmRleCwgY2hhbmdlKSB7XG4gICAgaWYgKGNoYW5nZS5wYXRoICYmIGNoYW5nZS5wYXRoLmxlbmd0aCkge1xuICAgICAgLy8gdGhlIHN0cnVjdHVyZSBvZiB0aGUgb2JqZWN0IGF0IHRoZSBpbmRleCBoYXMgY2hhbmdlZC4uLlxuICAgICAgdmFyIGl0ID0gYXJyW2luZGV4XSxcbiAgICAgICAgaSwgdSA9IGNoYW5nZS5wYXRoLmxlbmd0aCAtIDE7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdTsgaSsrKSB7XG4gICAgICAgIGl0ID0gaXRbY2hhbmdlLnBhdGhbaV1dO1xuICAgICAgfVxuICAgICAgc3dpdGNoIChjaGFuZ2Uua2luZCkge1xuICAgICAgICBjYXNlICdBJzpcbiAgICAgICAgICByZXZlcnRBcnJheUNoYW5nZShpdFtjaGFuZ2UucGF0aFtpXV0sIGNoYW5nZS5pbmRleCwgY2hhbmdlLml0ZW0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdEJzpcbiAgICAgICAgICBpdFtjaGFuZ2UucGF0aFtpXV0gPSBjaGFuZ2UubGhzO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdFJzpcbiAgICAgICAgICBpdFtjaGFuZ2UucGF0aFtpXV0gPSBjaGFuZ2UubGhzO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdOJzpcbiAgICAgICAgICBkZWxldGUgaXRbY2hhbmdlLnBhdGhbaV1dO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyB0aGUgYXJyYXkgaXRlbSBpcyBkaWZmZXJlbnQuLi5cbiAgICAgIHN3aXRjaCAoY2hhbmdlLmtpbmQpIHtcbiAgICAgICAgY2FzZSAnQSc6XG4gICAgICAgICAgcmV2ZXJ0QXJyYXlDaGFuZ2UoYXJyW2luZGV4XSwgY2hhbmdlLmluZGV4LCBjaGFuZ2UuaXRlbSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0QnOlxuICAgICAgICAgIGFycltpbmRleF0gPSBjaGFuZ2UubGhzO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdFJzpcbiAgICAgICAgICBhcnJbaW5kZXhdID0gY2hhbmdlLmxocztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTic6XG4gICAgICAgICAgYXJyID0gYXJyYXlSZW1vdmUoYXJyLCBpbmRleCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICBmdW5jdGlvbiByZXZlcnRDaGFuZ2UodGFyZ2V0LCBzb3VyY2UsIGNoYW5nZSkge1xuICAgIGlmICh0YXJnZXQgJiYgc291cmNlICYmIGNoYW5nZSAmJiBjaGFuZ2Uua2luZCkge1xuICAgICAgdmFyIGl0ID0gdGFyZ2V0LFxuICAgICAgICBpLCB1O1xuICAgICAgdSA9IGNoYW5nZS5wYXRoLmxlbmd0aCAtIDE7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdTsgaSsrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRbY2hhbmdlLnBhdGhbaV1dID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGl0W2NoYW5nZS5wYXRoW2ldXSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGl0ID0gaXRbY2hhbmdlLnBhdGhbaV1dO1xuICAgICAgfVxuICAgICAgc3dpdGNoIChjaGFuZ2Uua2luZCkge1xuICAgICAgICBjYXNlICdBJzpcbiAgICAgICAgICAvLyBBcnJheSB3YXMgbW9kaWZpZWQuLi5cbiAgICAgICAgICAvLyBpdCB3aWxsIGJlIGFuIGFycmF5Li4uXG4gICAgICAgICAgcmV2ZXJ0QXJyYXlDaGFuZ2UoaXRbY2hhbmdlLnBhdGhbaV1dLCBjaGFuZ2UuaW5kZXgsIGNoYW5nZS5pdGVtKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnRCc6XG4gICAgICAgICAgLy8gSXRlbSB3YXMgZGVsZXRlZC4uLlxuICAgICAgICAgIGl0W2NoYW5nZS5wYXRoW2ldXSA9IGNoYW5nZS5saHM7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0UnOlxuICAgICAgICAgIC8vIEl0ZW0gd2FzIGVkaXRlZC4uLlxuICAgICAgICAgIGl0W2NoYW5nZS5wYXRoW2ldXSA9IGNoYW5nZS5saHM7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ04nOlxuICAgICAgICAgIC8vIEl0ZW0gaXMgbmV3Li4uXG4gICAgICAgICAgZGVsZXRlIGl0W2NoYW5nZS5wYXRoW2ldXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhcHBseURpZmYodGFyZ2V0LCBzb3VyY2UsIGZpbHRlcikge1xuICAgIGlmICh0YXJnZXQgJiYgc291cmNlKSB7XG4gICAgICB2YXIgb25DaGFuZ2UgPSBmdW5jdGlvbihjaGFuZ2UpIHtcbiAgICAgICAgaWYgKCFmaWx0ZXIgfHwgZmlsdGVyKHRhcmdldCwgc291cmNlLCBjaGFuZ2UpKSB7XG4gICAgICAgICAgYXBwbHlDaGFuZ2UodGFyZ2V0LCBzb3VyY2UsIGNoYW5nZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBkZWVwRGlmZih0YXJnZXQsIHNvdXJjZSwgb25DaGFuZ2UpO1xuICAgIH1cbiAgfVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGFjY3VtdWxhdGVEaWZmLCB7XG5cbiAgICBkaWZmOiB7XG4gICAgICB2YWx1ZTogYWNjdW11bGF0ZURpZmYsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSxcbiAgICBvYnNlcnZhYmxlRGlmZjoge1xuICAgICAgdmFsdWU6IGRlZXBEaWZmLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgYXBwbHlEaWZmOiB7XG4gICAgICB2YWx1ZTogYXBwbHlEaWZmLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgYXBwbHlDaGFuZ2U6IHtcbiAgICAgIHZhbHVlOiBhcHBseUNoYW5nZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LFxuICAgIHJldmVydENoYW5nZToge1xuICAgICAgdmFsdWU6IHJldmVydENoYW5nZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LFxuICAgIGlzQ29uZmxpY3Q6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICd1bmRlZmluZWQnICE9PSB0eXBlb2YgY29uZmxpY3Q7XG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgbm9Db25mbGljdDoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoY29uZmxpY3RSZXNvbHV0aW9uKSB7XG4gICAgICAgICAgY29uZmxpY3RSZXNvbHV0aW9uLmZvckVhY2goZnVuY3Rpb24oaXQpIHtcbiAgICAgICAgICAgIGl0KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29uZmxpY3RSZXNvbHV0aW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjdW11bGF0ZURpZmY7XG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGFjY3VtdWxhdGVEaWZmO1xufSkpO1xuIiwidmFyIHBTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBvYmplY3RLZXlzID0gcmVxdWlyZSgnLi9saWIva2V5cy5qcycpO1xudmFyIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9saWIvaXNfYXJndW1lbnRzLmpzJyk7XG5cbnZhciBkZWVwRXF1YWwgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhY3R1YWwsIGV4cGVjdGVkLCBvcHRzKSB7XG4gIGlmICghb3B0cykgb3B0cyA9IHt9O1xuICAvLyA3LjEuIEFsbCBpZGVudGljYWwgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9IGVsc2UgaWYgKGFjdHVhbCBpbnN0YW5jZW9mIERhdGUgJiYgZXhwZWN0ZWQgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5nZXRUaW1lKCkgPT09IGV4cGVjdGVkLmdldFRpbWUoKTtcblxuICAvLyA3LjMuIE90aGVyIHBhaXJzIHRoYXQgZG8gbm90IGJvdGggcGFzcyB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcsXG4gIC8vIGVxdWl2YWxlbmNlIGlzIGRldGVybWluZWQgYnkgPT0uXG4gIH0gZWxzZSBpZiAoIWFjdHVhbCB8fCAhZXhwZWN0ZWQgfHwgdHlwZW9mIGFjdHVhbCAhPSAnb2JqZWN0JyAmJiB0eXBlb2YgZXhwZWN0ZWQgIT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gb3B0cy5zdHJpY3QgPyBhY3R1YWwgPT09IGV4cGVjdGVkIDogYWN0dWFsID09IGV4cGVjdGVkO1xuXG4gIC8vIDcuNC4gRm9yIGFsbCBvdGhlciBPYmplY3QgcGFpcnMsIGluY2x1ZGluZyBBcnJheSBvYmplY3RzLCBlcXVpdmFsZW5jZSBpc1xuICAvLyBkZXRlcm1pbmVkIGJ5IGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoYXMgdmVyaWZpZWRcbiAgLy8gd2l0aCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwpLCB0aGUgc2FtZSBzZXQgb2Yga2V5c1xuICAvLyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSwgZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5XG4gIC8vIGNvcnJlc3BvbmRpbmcga2V5LCBhbmQgYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LiBOb3RlOiB0aGlzXG4gIC8vIGFjY291bnRzIGZvciBib3RoIG5hbWVkIGFuZCBpbmRleGVkIHByb3BlcnRpZXMgb24gQXJyYXlzLlxuICB9IGVsc2Uge1xuICAgIHJldHVybiBvYmpFcXVpdihhY3R1YWwsIGV4cGVjdGVkLCBvcHRzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gaXNCdWZmZXIgKHgpIHtcbiAgaWYgKCF4IHx8IHR5cGVvZiB4ICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgeC5sZW5ndGggIT09ICdudW1iZXInKSByZXR1cm4gZmFsc2U7XG4gIGlmICh0eXBlb2YgeC5jb3B5ICE9PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiB4LnNsaWNlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh4Lmxlbmd0aCA+IDAgJiYgdHlwZW9mIHhbMF0gIT09ICdudW1iZXInKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBvYmpFcXVpdihhLCBiLCBvcHRzKSB7XG4gIHZhciBpLCBrZXk7XG4gIGlmIChpc1VuZGVmaW5lZE9yTnVsbChhKSB8fCBpc1VuZGVmaW5lZE9yTnVsbChiKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vIGFuIGlkZW50aWNhbCAncHJvdG90eXBlJyBwcm9wZXJ0eS5cbiAgaWYgKGEucHJvdG90eXBlICE9PSBiLnByb3RvdHlwZSkgcmV0dXJuIGZhbHNlO1xuICAvL35+fkkndmUgbWFuYWdlZCB0byBicmVhayBPYmplY3Qua2V5cyB0aHJvdWdoIHNjcmV3eSBhcmd1bWVudHMgcGFzc2luZy5cbiAgLy8gICBDb252ZXJ0aW5nIHRvIGFycmF5IHNvbHZlcyB0aGUgcHJvYmxlbS5cbiAgaWYgKGlzQXJndW1lbnRzKGEpKSB7XG4gICAgaWYgKCFpc0FyZ3VtZW50cyhiKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBhID0gcFNsaWNlLmNhbGwoYSk7XG4gICAgYiA9IHBTbGljZS5jYWxsKGIpO1xuICAgIHJldHVybiBkZWVwRXF1YWwoYSwgYiwgb3B0cyk7XG4gIH1cbiAgaWYgKGlzQnVmZmVyKGEpKSB7XG4gICAgaWYgKCFpc0J1ZmZlcihiKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgZm9yIChpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhW2ldICE9PSBiW2ldKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHRyeSB7XG4gICAgdmFyIGthID0gb2JqZWN0S2V5cyhhKSxcbiAgICAgICAga2IgPSBvYmplY3RLZXlzKGIpO1xuICB9IGNhdGNoIChlKSB7Ly9oYXBwZW5zIHdoZW4gb25lIGlzIGEgc3RyaW5nIGxpdGVyYWwgYW5kIHRoZSBvdGhlciBpc24ndFxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGtleXMgaW5jb3Jwb3JhdGVzXG4gIC8vIGhhc093blByb3BlcnR5KVxuICBpZiAoa2EubGVuZ3RoICE9IGtiLmxlbmd0aClcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vdGhlIHNhbWUgc2V0IG9mIGtleXMgKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksXG4gIGthLnNvcnQoKTtcbiAga2Iuc29ydCgpO1xuICAvL35+fmNoZWFwIGtleSB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKGthW2ldICE9IGtiW2ldKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5IGNvcnJlc3BvbmRpbmcga2V5LCBhbmRcbiAgLy9+fn5wb3NzaWJseSBleHBlbnNpdmUgZGVlcCB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAga2V5ID0ga2FbaV07XG4gICAgaWYgKCFkZWVwRXF1YWwoYVtrZXldLCBiW2tleV0sIG9wdHMpKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHR5cGVvZiBhID09PSB0eXBlb2YgYjtcbn1cbiIsInZhciBzdXBwb3J0c0FyZ3VtZW50c0NsYXNzID0gKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJndW1lbnRzKVxufSkoKSA9PSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gc3VwcG9ydHNBcmd1bWVudHNDbGFzcyA/IHN1cHBvcnRlZCA6IHVuc3VwcG9ydGVkO1xuXG5leHBvcnRzLnN1cHBvcnRlZCA9IHN1cHBvcnRlZDtcbmZ1bmN0aW9uIHN1cHBvcnRlZChvYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpID09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xufTtcblxuZXhwb3J0cy51bnN1cHBvcnRlZCA9IHVuc3VwcG9ydGVkO1xuZnVuY3Rpb24gdW5zdXBwb3J0ZWQob2JqZWN0KXtcbiAgcmV0dXJuIG9iamVjdCAmJlxuICAgIHR5cGVvZiBvYmplY3QgPT0gJ29iamVjdCcgJiZcbiAgICB0eXBlb2Ygb2JqZWN0Lmxlbmd0aCA9PSAnbnVtYmVyJyAmJlxuICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsICdjYWxsZWUnKSAmJlxuICAgICFPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqZWN0LCAnY2FsbGVlJykgfHxcbiAgICBmYWxzZTtcbn07XG4iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2YgT2JqZWN0LmtleXMgPT09ICdmdW5jdGlvbidcbiAgPyBPYmplY3Qua2V5cyA6IHNoaW07XG5cbmV4cG9ydHMuc2hpbSA9IHNoaW07XG5mdW5jdGlvbiBzaGltIChvYmopIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikga2V5cy5wdXNoKGtleSk7XG4gIHJldHVybiBrZXlzO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYicpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3BvbHlmaWxsID0gcmVxdWlyZSgnLi9wb2x5ZmlsbCcpO1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5mdW5jdGlvbiBjb3B5KHRhcmdldCwgY3VzdG9taXplcikge1xuICB2YXIgcmVzdWx0VmFsdWUgPSBjb3B5VmFsdWUodGFyZ2V0KTtcblxuICBpZiAocmVzdWx0VmFsdWUgIT09IG51bGwpIHtcbiAgICByZXR1cm4gY29weVZhbHVlKHRhcmdldCk7XG4gIH1cblxuICByZXR1cm4gY29weUNvbGxlY3Rpb24odGFyZ2V0LCBjdXN0b21pemVyKTtcbn1cblxuZnVuY3Rpb24gY29weUNvbGxlY3Rpb24odGFyZ2V0LCBjdXN0b21pemVyKSB7XG4gIGlmICh0eXBlb2YgY3VzdG9taXplciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2N1c3RvbWl6ZXIgaXMgbXVzdCBiZSBhIEZ1bmN0aW9uJyk7XG4gIH1cblxuICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciBzb3VyY2UgPSBTdHJpbmcodGFyZ2V0KTtcblxuICAgIC8vIE5PVEU6XG4gICAgLy9cbiAgICAvLyAgIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2pkYWx0b24vNWUzNGQ4OTAxMDVhY2E0NDM5OWZcbiAgICAvL1xuICAgIC8vICAgLSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9qZGFsdG9uLzVlMzRkODkwMTA1YWNhNDQzOTlmI2dpc3Rjb21tZW50LTEyODM4MzFcbiAgICAvLyAgIC0gaHR0cDovL2VzNS5naXRodWIuaW8vI3gxNVxuICAgIC8vXG4gICAgLy8gICBuYXRpdmUgZnVuY3Rpb25zIGRvZXMgbm90IGhhdmUgcHJvdG90eXBlOlxuICAgIC8vXG4gICAgLy8gICAgICAgT2JqZWN0LnRvU3RyaW5nLnByb3RvdHlwZSAgLy8gPT4gdW5kZWZpbmVkXG4gICAgLy8gICAgICAgKGZ1bmN0aW9uKCkge30pLnByb3RvdHlwZSAgLy8gPT4ge31cbiAgICAvL1xuICAgIC8vICAgYnV0IGNhbm5vdCBkZXRlY3QgbmF0aXZlIGNvbnN0cnVjdG9yOlxuICAgIC8vXG4gICAgLy8gICAgICAgdHlwZW9mIE9iamVjdCAgICAgLy8gPT4gJ2Z1bmN0aW9uJ1xuICAgIC8vICAgICAgIE9iamVjdC5wcm90b3R5cGUgIC8vID0+IHt9XG4gICAgLy9cbiAgICAvLyAgIGFuZCBjYW5ub3QgZGV0ZWN0IG51bGwgYmluZGVkIGZ1bmN0aW9uOlxuICAgIC8vXG4gICAgLy8gICAgICAgU3RyaW5nKE1hdGguYWJzKVxuICAgIC8vICAgICAgICAgLy8gPT4gJ2Z1bmN0aW9uIGFicygpIHsgW25hdGl2ZSBjb2RlXSB9J1xuICAgIC8vXG4gICAgLy8gICAgIEZpcmVmb3gsIFNhZmFyaTpcbiAgICAvLyAgICAgICBTdHJpbmcoKGZ1bmN0aW9uIGFicygpIHt9KS5iaW5kKG51bGwpKVxuICAgIC8vICAgICAgICAgLy8gPT4gJ2Z1bmN0aW9uIGFicygpIHsgW25hdGl2ZSBjb2RlXSB9J1xuICAgIC8vXG4gICAgLy8gICAgIENocm9tZTpcbiAgICAvLyAgICAgICBTdHJpbmcoKGZ1bmN0aW9uIGFicygpIHt9KS5iaW5kKG51bGwpKVxuICAgIC8vICAgICAgICAgLy8gPT4gJ2Z1bmN0aW9uICgpIHsgW25hdGl2ZSBjb2RlXSB9J1xuICAgIGlmICgvXlxccypmdW5jdGlvblxccypcXFMqXFwoW15cXCldKlxcKVxccyp7XFxzKlxcW25hdGl2ZSBjb2RlXFxdXFxzKn0vLnRlc3Qoc291cmNlKSkge1xuICAgICAgLy8gbmF0aXZlIGZ1bmN0aW9uXG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB1c2VyIGRlZmluZWQgZnVuY3Rpb25cbiAgICAgIHJldHVybiBuZXcgRnVuY3Rpb24oJ3JldHVybiAnICsgc291cmNlKSgpO1xuICAgIH1cbiAgfVxuXG4gIHZhciB0YXJnZXRDbGFzcyA9IHRvU3RyaW5nLmNhbGwodGFyZ2V0KTtcblxuICBpZiAodGFyZ2V0Q2xhc3MgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBpZiAodGFyZ2V0Q2xhc3MgPT09ICdbb2JqZWN0IE9iamVjdF0nICYmIHRhcmdldC5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgaWYgKHRhcmdldENsYXNzID09PSAnW29iamVjdCBEYXRlXScpIHtcbiAgICAvLyBOT1RFOlxuICAgIC8vXG4gICAgLy8gICBGaXJlZm94IG5lZWQgdG8gY29udmVydFxuICAgIC8vXG4gICAgLy8gICBGaXJlZm94OlxuICAgIC8vICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlO1xuICAgIC8vICAgICArZGF0ZTsgICAgICAgICAgICAvLyAxNDIwOTA5MzY1OTY3XG4gICAgLy8gICAgICtuZXcgRGF0ZShkYXRlKTsgIC8vIDE0MjA5MDkzNjUwMDBcbiAgICAvLyAgICAgK25ldyBEYXRlKCtkYXRlKTsgLy8gMTQyMDkwOTM2NTk2N1xuICAgIC8vXG4gICAgLy8gICBDaHJvbWU6XG4gICAgLy8gICAgIHZhciBkYXRlID0gbmV3IERhdGU7XG4gICAgLy8gICAgICtkYXRlOyAgICAgICAgICAgIC8vIDE0MjA5MDk3NTc5MTNcbiAgICAvLyAgICAgK25ldyBEYXRlKGRhdGUpOyAgLy8gMTQyMDkwOTc1NzkxM1xuICAgIC8vICAgICArbmV3IERhdGUoK2RhdGUpOyAvLyAxNDIwOTA5NzU3OTEzXG4gICAgcmV0dXJuIG5ldyBEYXRlKCt0YXJnZXQpO1xuICB9XG5cbiAgaWYgKHRhcmdldENsYXNzID09PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgIC8vIE5PVEU6XG4gICAgLy9cbiAgICAvLyAgIENocm9tZSwgU2FmYXJpOlxuICAgIC8vICAgICAobmV3IFJlZ0V4cCkuc291cmNlID0+IFwiKD86KVwiXG4gICAgLy9cbiAgICAvLyAgIEZpcmVmb3g6XG4gICAgLy8gICAgIChuZXcgUmVnRXhwKS5zb3VyY2UgPT4gXCJcIlxuICAgIC8vXG4gICAgLy8gICBDaHJvbWUsIFNhZmFyaSwgRmlyZWZveDpcbiAgICAvLyAgICAgU3RyaW5nKG5ldyBSZWdFeHApID0+IFwiLyg/OikvXCJcbiAgICB2YXIgcmVnZXhwVGV4dCA9IFN0cmluZyh0YXJnZXQpLFxuICAgICAgICBzbGFzaEluZGV4ID0gcmVnZXhwVGV4dC5sYXN0SW5kZXhPZignLycpO1xuXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAocmVnZXhwVGV4dC5zbGljZSgxLCBzbGFzaEluZGV4KSwgcmVnZXhwVGV4dC5zbGljZShzbGFzaEluZGV4ICsgMSkpO1xuICB9XG5cbiAgaWYgKF9wb2x5ZmlsbC5pc0J1ZmZlcih0YXJnZXQpKSB7XG4gICAgdmFyIGJ1ZmZlciA9IG5ldyBCdWZmZXIodGFyZ2V0Lmxlbmd0aCk7XG5cbiAgICB0YXJnZXQuY29weShidWZmZXIpO1xuXG4gICAgcmV0dXJuIGJ1ZmZlcjtcbiAgfVxuXG4gIHZhciBjdXN0b21pemVyUmVzdWx0ID0gY3VzdG9taXplcih0YXJnZXQpO1xuXG4gIGlmIChjdXN0b21pemVyUmVzdWx0ICE9PSB2b2lkIDApIHtcbiAgICByZXR1cm4gY3VzdG9taXplclJlc3VsdDtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBjb3B5VmFsdWUodGFyZ2V0KSB7XG4gIHZhciB0YXJnZXRUeXBlID0gdHlwZW9mIHRhcmdldDtcblxuICAvLyBjb3B5IFN0cmluZywgTnVtYmVyLCBCb29sZWFuLCB1bmRlZmluZWQgYW5kIFN5bWJvbFxuICAvLyB3aXRob3V0IG51bGwgYW5kIEZ1bmN0aW9uXG4gIGlmICh0YXJnZXQgIT09IG51bGwgJiYgdGFyZ2V0VHlwZSAhPT0gJ29iamVjdCcgJiYgdGFyZ2V0VHlwZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0c1snZGVmYXVsdCddID0ge1xuICBjb3B5OiBjb3B5LFxuICBjb3B5Q29sbGVjdGlvbjogY29weUNvbGxlY3Rpb24sXG4gIGNvcHlWYWx1ZTogY29weVZhbHVlXG59O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2NvcHkgPSByZXF1aXJlKCcuL2NvcHknKTtcblxudmFyIF9wb2x5ZmlsbCA9IHJlcXVpcmUoJy4vcG9seWZpbGwnKTtcblxuZnVuY3Rpb24gZGVmYXVsdEN1c3RvbWl6ZXIodGFyZ2V0KSB7XG4gIHJldHVybiB2b2lkIDA7XG59XG5cbmZ1bmN0aW9uIGRlZXBjb3B5KHRhcmdldCkge1xuICB2YXIgY3VzdG9taXplciA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGRlZmF1bHRDdXN0b21pemVyIDogYXJndW1lbnRzWzFdO1xuXG4gIGlmICh0YXJnZXQgPT09IG51bGwpIHtcbiAgICAvLyBjb3B5IG51bGxcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciByZXN1bHRWYWx1ZSA9IF9jb3B5LmNvcHlWYWx1ZSh0YXJnZXQpO1xuXG4gIGlmIChyZXN1bHRWYWx1ZSAhPT0gbnVsbCkge1xuICAgIC8vIGNvcHkgc29tZSBwcmltaXRpdmUgdHlwZXNcbiAgICByZXR1cm4gcmVzdWx0VmFsdWU7XG4gIH1cblxuICB2YXIgcmVzdWx0Q29sbGVjdGlvbiA9IF9jb3B5LmNvcHlDb2xsZWN0aW9uKHRhcmdldCwgY3VzdG9taXplciksXG4gICAgICBjbG9uZSA9IHJlc3VsdENvbGxlY3Rpb24gIT09IG51bGwgPyByZXN1bHRDb2xsZWN0aW9uIDogdGFyZ2V0O1xuXG4gIHZhciB2aXNpdGVkID0gW3RhcmdldF0sXG4gICAgICByZWZlcmVuY2UgPSBbY2xvbmVdO1xuXG4gIC8vIHJlY3Vyc2l2ZWx5IGNvcHkgZnJvbSBjb2xsZWN0aW9uXG4gIHJldHVybiByZWN1cnNpdmVDb3B5KHRhcmdldCwgY3VzdG9taXplciwgY2xvbmUsIHZpc2l0ZWQsIHJlZmVyZW5jZSk7XG59XG5cbmZ1bmN0aW9uIHJlY3Vyc2l2ZUNvcHkodGFyZ2V0LCBjdXN0b21pemVyLCBjbG9uZSwgdmlzaXRlZCwgcmVmZXJlbmNlKSB7XG4gIGlmICh0YXJnZXQgPT09IG51bGwpIHtcbiAgICAvLyBjb3B5IG51bGxcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciByZXN1bHRWYWx1ZSA9IF9jb3B5LmNvcHlWYWx1ZSh0YXJnZXQpO1xuXG4gIGlmIChyZXN1bHRWYWx1ZSAhPT0gbnVsbCkge1xuICAgIC8vIGNvcHkgc29tZSBwcmltaXRpdmUgdHlwZXNcbiAgICByZXR1cm4gcmVzdWx0VmFsdWU7XG4gIH1cblxuICB2YXIga2V5cyA9IF9wb2x5ZmlsbC5nZXRLZXlzKHRhcmdldCkuY29uY2F0KF9wb2x5ZmlsbC5nZXRTeW1ib2xzKHRhcmdldCkpO1xuXG4gIHZhciBpID0gdW5kZWZpbmVkLFxuICAgICAgbGVuID0gdW5kZWZpbmVkO1xuXG4gIHZhciBrZXkgPSB1bmRlZmluZWQsXG4gICAgICB2YWx1ZSA9IHVuZGVmaW5lZCxcbiAgICAgIGluZGV4ID0gdW5kZWZpbmVkLFxuICAgICAgcmVzdWx0Q29weSA9IHVuZGVmaW5lZCxcbiAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZCxcbiAgICAgIHJlZiA9IHVuZGVmaW5lZDtcblxuICBmb3IgKGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAga2V5ID0ga2V5c1tpXTtcbiAgICB2YWx1ZSA9IHRhcmdldFtrZXldO1xuICAgIGluZGV4ID0gX3BvbHlmaWxsLmluZGV4T2YodmlzaXRlZCwgdmFsdWUpO1xuXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgcmVzdWx0Q29weSA9IF9jb3B5LmNvcHkodmFsdWUsIGN1c3RvbWl6ZXIpO1xuICAgICAgcmVzdWx0ID0gcmVzdWx0Q29weSAhPT0gbnVsbCA/IHJlc3VsdENvcHkgOiB2YWx1ZTtcblxuICAgICAgaWYgKHZhbHVlICE9PSBudWxsICYmIC9eKD86ZnVuY3Rpb258b2JqZWN0KSQvLnRlc3QodHlwZW9mIHZhbHVlKSkge1xuICAgICAgICB2aXNpdGVkLnB1c2godmFsdWUpO1xuICAgICAgICByZWZlcmVuY2UucHVzaChyZXN1bHQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjaXJjdWxhciByZWZlcmVuY2VcbiAgICAgIHJlZiA9IHJlZmVyZW5jZVtpbmRleF07XG4gICAgfVxuXG4gICAgY2xvbmVba2V5XSA9IHJlZiB8fCByZWN1cnNpdmVDb3B5KHZhbHVlLCBjdXN0b21pemVyLCByZXN1bHQsIHZpc2l0ZWQsIHJlZmVyZW5jZSk7XG4gIH1cblxuICByZXR1cm4gY2xvbmU7XG59XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGRlZXBjb3B5O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxudmFyIGlzQnVmZmVyID0gdHlwZW9mIEJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgPyBmdW5jdGlvbiBpc0J1ZmZlcihvYmopIHtcbiAgcmV0dXJuIEJ1ZmZlci5pc0J1ZmZlcihvYmopO1xufSA6IGZ1bmN0aW9uIGlzQnVmZmVyKCkge1xuICAvLyBhbHdheXMgcmV0dXJuIGZhbHNlIGluIGJyb3dzZXJzXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnZhciBnZXRLZXlzID0gT2JqZWN0LmtleXMgPyBmdW5jdGlvbiBnZXRLZXlzKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKTtcbn0gOiBmdW5jdGlvbiBnZXRLZXlzKG9iaikge1xuICB2YXIgb2JqVHlwZSA9IHR5cGVvZiBvYmo7XG5cbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCBvYmpUeXBlICE9PSAnZnVuY3Rpb24nIHx8IG9ialR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb2JqIG11c3QgYmUgYW4gT2JqZWN0Jyk7XG4gIH1cblxuICB2YXIgcmVzdWx0S2V5cyA9IFtdLFxuICAgICAga2V5ID0gdW5kZWZpbmVkO1xuXG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHJlc3VsdEtleXMucHVzaChrZXkpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdEtleXM7XG59O1xuXG52YXIgZ2V0U3ltYm9scyA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgPyBmdW5jdGlvbiBnZXRTeW1ib2xzKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmopO1xufSA6IGZ1bmN0aW9uIGdldFN5bWJvbHMoKSB7XG4gIC8vIGFsd2F5cyByZXR1cm4gZW1wdHkgQXJyYXkgd2hlbiBTeW1ib2wgaXMgbm90IHN1cHBvcnRlZFxuICByZXR1cm4gW107XG59O1xuXG4vLyBOT1RFOlxuLy9cbi8vICAgQXJyYXkucHJvdG90eXBlLmluZGV4T2YgaXMgY2Fubm90IGZpbmQgTmFOIChpbiBDaHJvbWUpXG4vLyAgIEFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyBpcyBjYW4gZmluZCBOYU4gKGluIENocm9tZSlcbi8vXG4vLyAgIHRoaXMgZnVuY3Rpb24gY2FuIGZpbmQgTmFOLCBiZWNhdXNlIHVzZSBTYW1lVmFsdWUgYWxnb3JpdGhtXG5mdW5jdGlvbiBpbmRleE9mKGFycmF5LCBzKSB7XG4gIGlmICh0b1N0cmluZy5jYWxsKGFycmF5KSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FycmF5IG11c3QgYmUgYW4gQXJyYXknKTtcbiAgfVxuXG4gIHZhciBpID0gdW5kZWZpbmVkLFxuICAgICAgbGVuID0gdW5kZWZpbmVkLFxuICAgICAgdmFsdWUgPSB1bmRlZmluZWQ7XG5cbiAgZm9yIChpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YWx1ZSA9IGFycmF5W2ldO1xuXG4gICAgLy8gaXQgaXMgU2FtZVZhbHVlIGFsZ29yaXRobVxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjcxNDQyNzcvY29tcGFyaW5nLWEtdmFyaWFibGUtd2l0aC1pdHNlbGZcbiAgICBpZiAodmFsdWUgPT09IHMgfHwgdmFsdWUgIT09IHZhbHVlICYmIHMgIT09IHMpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTE7XG59XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHtcbiAgZ2V0S2V5czogZ2V0S2V5cyxcbiAgZ2V0U3ltYm9sczogZ2V0U3ltYm9scyxcbiAgaW5kZXhPZjogaW5kZXhPZixcbiAgaXNCdWZmZXI6IGlzQnVmZmVyXG59O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIga2V5cyA9IHJlcXVpcmUoJ29iamVjdC1rZXlzJyk7XG52YXIgZm9yZWFjaCA9IHJlcXVpcmUoJ2ZvcmVhY2gnKTtcbnZhciBoYXNTeW1ib2xzID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgU3ltYm9sKCkgPT09ICdzeW1ib2wnO1xuXG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uIChmbikge1xuXHRyZXR1cm4gdHlwZW9mIGZuID09PSAnZnVuY3Rpb24nICYmIHRvU3RyLmNhbGwoZm4pID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufTtcblxudmFyIGFyZVByb3BlcnR5RGVzY3JpcHRvcnNTdXBwb3J0ZWQgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBvYmogPSB7fTtcblx0dHJ5IHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCAneCcsIHsgZW51bWVyYWJsZTogZmFsc2UsIHZhbHVlOiBvYmogfSk7XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzLCBuby1yZXN0cmljdGVkLXN5bnRheCAqL1xuICAgICAgICBmb3IgKHZhciBfIGluIG9iaikgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycywgbm8tcmVzdHJpY3RlZC1zeW50YXggKi9cblx0XHRyZXR1cm4gb2JqLnggPT09IG9iajtcblx0fSBjYXRjaCAoZSkgeyAvKiB0aGlzIGlzIElFIDguICovXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59O1xudmFyIHN1cHBvcnRzRGVzY3JpcHRvcnMgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgYXJlUHJvcGVydHlEZXNjcmlwdG9yc1N1cHBvcnRlZCgpO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lLCB2YWx1ZSwgcHJlZGljYXRlKSB7XG5cdGlmIChuYW1lIGluIG9iamVjdCAmJiAoIWlzRnVuY3Rpb24ocHJlZGljYXRlKSB8fCAhcHJlZGljYXRlKCkpKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGlmIChzdXBwb3J0c0Rlc2NyaXB0b3JzKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge1xuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0ZW51bWVyYWJsZTogZmFsc2UsXG5cdFx0XHR2YWx1ZTogdmFsdWUsXG5cdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdG9iamVjdFtuYW1lXSA9IHZhbHVlO1xuXHR9XG59O1xuXG52YXIgZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIChvYmplY3QsIG1hcCkge1xuXHR2YXIgcHJlZGljYXRlcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDoge307XG5cdHZhciBwcm9wcyA9IGtleXMobWFwKTtcblx0aWYgKGhhc1N5bWJvbHMpIHtcblx0XHRwcm9wcyA9IHByb3BzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG1hcCkpO1xuXHR9XG5cdGZvcmVhY2gocHJvcHMsIGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0ZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCBtYXBbbmFtZV0sIHByZWRpY2F0ZXNbbmFtZV0pO1xuXHR9KTtcbn07XG5cbmRlZmluZVByb3BlcnRpZXMuc3VwcG9ydHNEZXNjcmlwdG9ycyA9ICEhc3VwcG9ydHNEZXNjcmlwdG9ycztcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVQcm9wZXJ0aWVzO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50c1tpXSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gYXJndW1lbnRzW2ldO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciAkaXNOYU4gPSBOdW1iZXIuaXNOYU4gfHwgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGEgIT09IGE7IH07XG52YXIgJGlzRmluaXRlID0gcmVxdWlyZSgnLi9oZWxwZXJzL2lzRmluaXRlJyk7XG5cbnZhciBzaWduID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NpZ24nKTtcbnZhciBtb2QgPSByZXF1aXJlKCcuL2hlbHBlcnMvbW9kJyk7XG5cbnZhciBJc0NhbGxhYmxlID0gcmVxdWlyZSgnaXMtY2FsbGFibGUnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJ2VzLXRvLXByaW1pdGl2ZS9lczUnKTtcblxuLy8gaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OVxudmFyIEVTNSA9IHtcblx0VG9QcmltaXRpdmU6IHRvUHJpbWl0aXZlLFxuXG5cdFRvQm9vbGVhbjogZnVuY3Rpb24gVG9Cb29sZWFuKHZhbHVlKSB7XG5cdFx0cmV0dXJuIEJvb2xlYW4odmFsdWUpO1xuXHR9LFxuXHRUb051bWJlcjogZnVuY3Rpb24gVG9OdW1iZXIodmFsdWUpIHtcblx0XHRyZXR1cm4gTnVtYmVyKHZhbHVlKTtcblx0fSxcblx0VG9JbnRlZ2VyOiBmdW5jdGlvbiBUb0ludGVnZXIodmFsdWUpIHtcblx0XHR2YXIgbnVtYmVyID0gdGhpcy5Ub051bWJlcih2YWx1ZSk7XG5cdFx0aWYgKCRpc05hTihudW1iZXIpKSB7IHJldHVybiAwOyB9XG5cdFx0aWYgKG51bWJlciA9PT0gMCB8fCAhJGlzRmluaXRlKG51bWJlcikpIHsgcmV0dXJuIG51bWJlcjsgfVxuXHRcdHJldHVybiBzaWduKG51bWJlcikgKiBNYXRoLmZsb29yKE1hdGguYWJzKG51bWJlcikpO1xuXHR9LFxuXHRUb0ludDMyOiBmdW5jdGlvbiBUb0ludDMyKHgpIHtcblx0XHRyZXR1cm4gdGhpcy5Ub051bWJlcih4KSA+PiAwO1xuXHR9LFxuXHRUb1VpbnQzMjogZnVuY3Rpb24gVG9VaW50MzIoeCkge1xuXHRcdHJldHVybiB0aGlzLlRvTnVtYmVyKHgpID4+PiAwO1xuXHR9LFxuXHRUb1VpbnQxNjogZnVuY3Rpb24gVG9VaW50MTYodmFsdWUpIHtcblx0XHR2YXIgbnVtYmVyID0gdGhpcy5Ub051bWJlcih2YWx1ZSk7XG5cdFx0aWYgKCRpc05hTihudW1iZXIpIHx8IG51bWJlciA9PT0gMCB8fCAhJGlzRmluaXRlKG51bWJlcikpIHsgcmV0dXJuIDA7IH1cblx0XHR2YXIgcG9zSW50ID0gc2lnbihudW1iZXIpICogTWF0aC5mbG9vcihNYXRoLmFicyhudW1iZXIpKTtcblx0XHRyZXR1cm4gbW9kKHBvc0ludCwgMHgxMDAwMCk7XG5cdH0sXG5cdFRvU3RyaW5nOiBmdW5jdGlvbiBUb1N0cmluZyh2YWx1ZSkge1xuXHRcdHJldHVybiBTdHJpbmcodmFsdWUpO1xuXHR9LFxuXHRUb09iamVjdDogZnVuY3Rpb24gVG9PYmplY3QodmFsdWUpIHtcblx0XHR0aGlzLkNoZWNrT2JqZWN0Q29lcmNpYmxlKHZhbHVlKTtcblx0XHRyZXR1cm4gT2JqZWN0KHZhbHVlKTtcblx0fSxcblx0Q2hlY2tPYmplY3RDb2VyY2libGU6IGZ1bmN0aW9uIENoZWNrT2JqZWN0Q29lcmNpYmxlKHZhbHVlLCBvcHRNZXNzYWdlKSB7XG5cdFx0LyoganNoaW50IGVxbnVsbDp0cnVlICovXG5cdFx0aWYgKHZhbHVlID09IG51bGwpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3Iob3B0TWVzc2FnZSB8fCAnQ2Fubm90IGNhbGwgbWV0aG9kIG9uICcgKyB2YWx1ZSk7XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZTtcblx0fSxcblx0SXNDYWxsYWJsZTogSXNDYWxsYWJsZSxcblx0U2FtZVZhbHVlOiBmdW5jdGlvbiBTYW1lVmFsdWUoeCwgeSkge1xuXHRcdGlmICh4ID09PSB5KSB7IC8vIDAgPT09IC0wLCBidXQgdGhleSBhcmUgbm90IGlkZW50aWNhbC5cblx0XHRcdGlmICh4ID09PSAwKSB7IHJldHVybiAxIC8geCA9PT0gMSAvIHk7IH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cbiAgICAgICAgcmV0dXJuICRpc05hTih4KSAmJiAkaXNOYU4oeSk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRVM1O1xuIiwidmFyICRpc05hTiA9IE51bWJlci5pc05hTiB8fCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gYSAhPT0gYTsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBOdW1iZXIuaXNGaW5pdGUgfHwgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHR5cGVvZiB4ID09PSAnbnVtYmVyJyAmJiAhJGlzTmFOKHgpICYmIHggIT09IEluZmluaXR5ICYmIHggIT09IC1JbmZpbml0eTsgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbW9kKG51bWJlciwgbW9kdWxvKSB7XG5cdHZhciByZW1haW4gPSBudW1iZXIgJSBtb2R1bG87XG5cdHJldHVybiBNYXRoLmZsb29yKHJlbWFpbiA+PSAwID8gcmVtYWluIDogcmVtYWluICsgbW9kdWxvKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNpZ24obnVtYmVyKSB7XG5cdHJldHVybiBudW1iZXIgPj0gMCA/IDEgOiAtMTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbnZhciBpc1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vaGVscGVycy9pc1ByaW1pdGl2ZScpO1xuXG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJ2lzLWNhbGxhYmxlJyk7XG5cbi8vIGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDguMTJcbnZhciBFUzVpbnRlcm5hbFNsb3RzID0ge1xuXHQnW1tEZWZhdWx0VmFsdWVdXSc6IGZ1bmN0aW9uIChPLCBoaW50KSB7XG5cdFx0dmFyIGFjdHVhbEhpbnQgPSBoaW50IHx8ICh0b1N0ci5jYWxsKE8pID09PSAnW29iamVjdCBEYXRlXScgPyBTdHJpbmcgOiBOdW1iZXIpO1xuXG5cdFx0aWYgKGFjdHVhbEhpbnQgPT09IFN0cmluZyB8fCBhY3R1YWxIaW50ID09PSBOdW1iZXIpIHtcblx0XHRcdHZhciBtZXRob2RzID0gYWN0dWFsSGludCA9PT0gU3RyaW5nID8gWyd0b1N0cmluZycsICd2YWx1ZU9mJ10gOiBbJ3ZhbHVlT2YnLCAndG9TdHJpbmcnXTtcblx0XHRcdHZhciB2YWx1ZSwgaTtcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBtZXRob2RzLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdGlmIChpc0NhbGxhYmxlKE9bbWV0aG9kc1tpXV0pKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBPW21ldGhvZHNbaV1dKCk7XG5cdFx0XHRcdFx0aWYgKGlzUHJpbWl0aXZlKHZhbHVlKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignTm8gZGVmYXVsdCB2YWx1ZScpO1xuXHRcdH1cblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIFtbRGVmYXVsdFZhbHVlXV0gaGludCBzdXBwbGllZCcpO1xuXHR9XG59O1xuXG4vLyBodHRwczovL2VzNS5naXRodWIuaW8vI3g5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFRvUHJpbWl0aXZlKGlucHV0LCBQcmVmZXJyZWRUeXBlKSB7XG5cdGlmIChpc1ByaW1pdGl2ZShpbnB1dCkpIHtcblx0XHRyZXR1cm4gaW5wdXQ7XG5cdH1cblx0cmV0dXJuIEVTNWludGVybmFsU2xvdHNbJ1tbRGVmYXVsdFZhbHVlXV0nXShpbnB1dCwgUHJlZmVycmVkVHlwZSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1ByaW1pdGl2ZSh2YWx1ZSkge1xuXHRyZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKTtcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJcbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb3JFYWNoIChvYmosIGZuLCBjdHgpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChmbikgIT09ICdbb2JqZWN0IEZ1bmN0aW9uXScpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaXRlcmF0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgfVxuICAgIHZhciBsID0gb2JqLmxlbmd0aDtcbiAgICBpZiAobCA9PT0gK2wpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGZuLmNhbGwoY3R4LCBvYmpbaV0sIGksIG9iaik7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBrIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKG9iaiwgaykpIHtcbiAgICAgICAgICAgICAgICBmbi5jYWxsKGN0eCwgb2JqW2tdLCBrLCBvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuIiwidmFyIEVSUk9SX01FU1NBR0UgPSAnRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgY2FsbGVkIG9uIGluY29tcGF0aWJsZSAnO1xudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBmdW5jVHlwZSA9ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZCh0aGF0KSB7XG4gICAgdmFyIHRhcmdldCA9IHRoaXM7XG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgIT09ICdmdW5jdGlvbicgfHwgdG9TdHIuY2FsbCh0YXJnZXQpICE9PSBmdW5jVHlwZSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEVSUk9SX01FU1NBR0UgKyB0YXJnZXQpO1xuICAgIH1cbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIHZhciBib3VuZDtcbiAgICB2YXIgYmluZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGFyZ2V0LmFwcGx5KFxuICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChPYmplY3QocmVzdWx0KSA9PT0gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5hcHBseShcbiAgICAgICAgICAgICAgICB0aGF0LFxuICAgICAgICAgICAgICAgIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGJvdW5kTGVuZ3RoID0gTWF0aC5tYXgoMCwgdGFyZ2V0Lmxlbmd0aCAtIGFyZ3MubGVuZ3RoKTtcbiAgICB2YXIgYm91bmRBcmdzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib3VuZExlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJvdW5kQXJncy5wdXNoKCckJyArIGkpO1xuICAgIH1cblxuICAgIGJvdW5kID0gRnVuY3Rpb24oJ2JpbmRlcicsICdyZXR1cm4gZnVuY3Rpb24gKCcgKyBib3VuZEFyZ3Muam9pbignLCcpICsgJyl7IHJldHVybiBiaW5kZXIuYXBwbHkodGhpcyxhcmd1bWVudHMpOyB9JykoYmluZGVyKTtcblxuICAgIGlmICh0YXJnZXQucHJvdG90eXBlKSB7XG4gICAgICAgIHZhciBFbXB0eSA9IGZ1bmN0aW9uIEVtcHR5KCkge307XG4gICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IHRhcmdldC5wcm90b3R5cGU7XG4gICAgICAgIGJvdW5kLnByb3RvdHlwZSA9IG5ldyBFbXB0eSgpO1xuICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBib3VuZDtcbn07XG4iLCJ2YXIgaW1wbGVtZW50YXRpb24gPSByZXF1aXJlKCcuL2ltcGxlbWVudGF0aW9uJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgfHwgaW1wbGVtZW50YXRpb247XG4iLCJ2YXIgYmluZCA9IHJlcXVpcmUoJ2Z1bmN0aW9uLWJpbmQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiaW5kLmNhbGwoRnVuY3Rpb24uY2FsbCwgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSk7XG4iLCJleHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLyoqXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIEJ1ZmZlclxuICpcbiAqIEF1dGhvcjogICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogTGljZW5zZTogIE1JVFxuICpcbiAqIGBucG0gaW5zdGFsbCBpcy1idWZmZXJgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiAhIShvYmogIT0gbnVsbCAmJlxuICAgIChvYmouX2lzQnVmZmVyIHx8IC8vIEZvciBTYWZhcmkgNS03IChtaXNzaW5nIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IpXG4gICAgICAob2JqLmNvbnN0cnVjdG9yICYmXG4gICAgICB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmXG4gICAgICBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKSlcbiAgICApKVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZm5Ub1N0ciA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcblxudmFyIGNvbnN0cnVjdG9yUmVnZXggPSAvXlxccypjbGFzcyAvO1xudmFyIGlzRVM2Q2xhc3NGbiA9IGZ1bmN0aW9uIGlzRVM2Q2xhc3NGbih2YWx1ZSkge1xuXHR0cnkge1xuXHRcdHZhciBmblN0ciA9IGZuVG9TdHIuY2FsbCh2YWx1ZSk7XG5cdFx0dmFyIHNpbmdsZVN0cmlwcGVkID0gZm5TdHIucmVwbGFjZSgvXFwvXFwvLipcXG4vZywgJycpO1xuXHRcdHZhciBtdWx0aVN0cmlwcGVkID0gc2luZ2xlU3RyaXBwZWQucmVwbGFjZSgvXFwvXFwqWy5cXHNcXFNdKlxcKlxcLy9nLCAnJyk7XG5cdFx0dmFyIHNwYWNlU3RyaXBwZWQgPSBtdWx0aVN0cmlwcGVkLnJlcGxhY2UoL1xcbi9tZywgJyAnKS5yZXBsYWNlKC8gezJ9L2csICcgJyk7XG5cdFx0cmV0dXJuIGNvbnN0cnVjdG9yUmVnZXgudGVzdChzcGFjZVN0cmlwcGVkKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdHJldHVybiBmYWxzZTsgLy8gbm90IGEgZnVuY3Rpb25cblx0fVxufTtcblxudmFyIHRyeUZ1bmN0aW9uT2JqZWN0ID0gZnVuY3Rpb24gdHJ5RnVuY3Rpb25PYmplY3QodmFsdWUpIHtcblx0dHJ5IHtcblx0XHRpZiAoaXNFUzZDbGFzc0ZuKHZhbHVlKSkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRmblRvU3RyLmNhbGwodmFsdWUpO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59O1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBmbkNsYXNzID0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbnZhciBnZW5DbGFzcyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXSc7XG52YXIgaGFzVG9TdHJpbmdUYWcgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQ2FsbGFibGUodmFsdWUpIHtcblx0aWYgKCF2YWx1ZSkgeyByZXR1cm4gZmFsc2U7IH1cblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7IHJldHVybiBmYWxzZTsgfVxuXHRpZiAoaGFzVG9TdHJpbmdUYWcpIHsgcmV0dXJuIHRyeUZ1bmN0aW9uT2JqZWN0KHZhbHVlKTsgfVxuXHRpZiAoaXNFUzZDbGFzc0ZuKHZhbHVlKSkgeyByZXR1cm4gZmFsc2U7IH1cblx0dmFyIHN0ckNsYXNzID0gdG9TdHIuY2FsbCh2YWx1ZSk7XG5cdHJldHVybiBzdHJDbGFzcyA9PT0gZm5DbGFzcyB8fCBzdHJDbGFzcyA9PT0gZ2VuQ2xhc3M7XG59O1xuIiwidmFyIGhhc01hcCA9IHR5cGVvZiBNYXAgPT09ICdmdW5jdGlvbicgJiYgTWFwLnByb3RvdHlwZTtcbnZhciBtYXBTaXplRGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgJiYgaGFzTWFwID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihNYXAucHJvdG90eXBlLCAnc2l6ZScpIDogbnVsbDtcbnZhciBtYXBTaXplID0gaGFzTWFwICYmIG1hcFNpemVEZXNjcmlwdG9yICYmIHR5cGVvZiBtYXBTaXplRGVzY3JpcHRvci5nZXQgPT09ICdmdW5jdGlvbicgPyBtYXBTaXplRGVzY3JpcHRvci5nZXQgOiBudWxsO1xudmFyIG1hcEZvckVhY2ggPSBoYXNNYXAgJiYgTWFwLnByb3RvdHlwZS5mb3JFYWNoO1xudmFyIGhhc1NldCA9IHR5cGVvZiBTZXQgPT09ICdmdW5jdGlvbicgJiYgU2V0LnByb3RvdHlwZTtcbnZhciBzZXRTaXplRGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgJiYgaGFzU2V0ID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihTZXQucHJvdG90eXBlLCAnc2l6ZScpIDogbnVsbDtcbnZhciBzZXRTaXplID0gaGFzU2V0ICYmIHNldFNpemVEZXNjcmlwdG9yICYmIHR5cGVvZiBzZXRTaXplRGVzY3JpcHRvci5nZXQgPT09ICdmdW5jdGlvbicgPyBzZXRTaXplRGVzY3JpcHRvci5nZXQgOiBudWxsO1xudmFyIHNldEZvckVhY2ggPSBoYXNTZXQgJiYgU2V0LnByb3RvdHlwZS5mb3JFYWNoO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluc3BlY3RfIChvYmosIG9wdHMsIGRlcHRoLCBzZWVuKSB7XG4gICAgaWYgKCFvcHRzKSBvcHRzID0ge307XG4gICAgXG4gICAgdmFyIG1heERlcHRoID0gb3B0cy5kZXB0aCA9PT0gdW5kZWZpbmVkID8gNSA6IG9wdHMuZGVwdGg7XG4gICAgaWYgKGRlcHRoID09PSB1bmRlZmluZWQpIGRlcHRoID0gMDtcbiAgICBpZiAoZGVwdGggPj0gbWF4RGVwdGggJiYgbWF4RGVwdGggPiAwXG4gICAgJiYgb2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiAnW09iamVjdF0nO1xuICAgIH1cbiAgICBcbiAgICBpZiAoc2VlbiA9PT0gdW5kZWZpbmVkKSBzZWVuID0gW107XG4gICAgZWxzZSBpZiAoaW5kZXhPZihzZWVuLCBvYmopID49IDApIHtcbiAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gaW5zcGVjdCAodmFsdWUsIGZyb20pIHtcbiAgICAgICAgaWYgKGZyb20pIHtcbiAgICAgICAgICAgIHNlZW4gPSBzZWVuLnNsaWNlKCk7XG4gICAgICAgICAgICBzZWVuLnB1c2goZnJvbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluc3BlY3RfKHZhbHVlLCBvcHRzLCBkZXB0aCArIDEsIHNlZW4pO1xuICAgIH1cbiAgICBcbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGluc3BlY3RTdHJpbmcob2JqKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgbmFtZSA9IG5hbWVPZihvYmopO1xuICAgICAgICByZXR1cm4gJ1tGdW5jdGlvbicgKyAobmFtZSA/ICc6ICcgKyBuYW1lIDogJycpICsgJ10nO1xuICAgIH1cbiAgICBlbHNlIGlmIChvYmogPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuICdudWxsJztcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNTeW1ib2wob2JqKSkge1xuICAgICAgICB2YXIgc3ltU3RyaW5nID0gU3ltYm9sLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaik7XG4gICAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyA/ICdPYmplY3QoJyArIHN5bVN0cmluZyArICcpJyA6IHN5bVN0cmluZztcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNFbGVtZW50KG9iaikpIHtcbiAgICAgICAgdmFyIHMgPSAnPCcgKyBTdHJpbmcob2JqLm5vZGVOYW1lKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB2YXIgYXR0cnMgPSBvYmouYXR0cmlidXRlcyB8fCBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcyArPSAnICcgKyBhdHRyc1tpXS5uYW1lICsgJz1cIicgKyBxdW90ZShhdHRyc1tpXS52YWx1ZSkgKyAnXCInO1xuICAgICAgICB9XG4gICAgICAgIHMgKz0gJz4nO1xuICAgICAgICBpZiAob2JqLmNoaWxkTm9kZXMgJiYgb2JqLmNoaWxkTm9kZXMubGVuZ3RoKSBzICs9ICcuLi4nO1xuICAgICAgICBzICs9ICc8LycgKyBTdHJpbmcob2JqLm5vZGVOYW1lKS50b0xvd2VyQ2FzZSgpICsgJz4nO1xuICAgICAgICByZXR1cm4gcztcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAgIGlmIChvYmoubGVuZ3RoID09PSAwKSByZXR1cm4gJ1tdJztcbiAgICAgICAgdmFyIHhzID0gQXJyYXkob2JqLmxlbmd0aCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB4c1tpXSA9IGhhcyhvYmosIGkpID8gaW5zcGVjdChvYmpbaV0sIG9iaikgOiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ1sgJyArIHhzLmpvaW4oJywgJykgKyAnIF0nO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc0Vycm9yKG9iaikpIHtcbiAgICAgICAgdmFyIHBhcnRzID0gW107XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmICghaGFzKG9iaiwga2V5KSkgY29udGludWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICgvW15cXHckXS8udGVzdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgcGFydHMucHVzaChpbnNwZWN0KGtleSkgKyAnOiAnICsgaW5zcGVjdChvYmpba2V5XSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFydHMucHVzaChrZXkgKyAnOiAnICsgaW5zcGVjdChvYmpba2V5XSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDApIHJldHVybiAnWycgKyBvYmogKyAnXSc7XG4gICAgICAgIHJldHVybiAneyBbJyArIG9iaiArICddICcgKyBwYXJ0cy5qb2luKCcsICcpICsgJyB9JztcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG9iai5pbnNwZWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBvYmouaW5zcGVjdCgpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc01hcChvYmopKSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IFtdO1xuICAgICAgICBtYXBGb3JFYWNoLmNhbGwob2JqLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgcGFydHMucHVzaChpbnNwZWN0KGtleSwgb2JqKSArICcgPT4gJyArIGluc3BlY3QodmFsdWUsIG9iaikpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuICdNYXAgKCcgKyBtYXBTaXplLmNhbGwob2JqKSArICcpIHsnICsgcGFydHMuam9pbignLCAnKSArICd9JztcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNTZXQob2JqKSkge1xuICAgICAgICB2YXIgcGFydHMgPSBbXTtcbiAgICAgICAgc2V0Rm9yRWFjaC5jYWxsKG9iaiwgZnVuY3Rpb24gKHZhbHVlICkge1xuICAgICAgICAgICAgcGFydHMucHVzaChpbnNwZWN0KHZhbHVlLCBvYmopKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiAnU2V0ICgnICsgc2V0U2l6ZS5jYWxsKG9iaikgKyAnKSB7JyArIHBhcnRzLmpvaW4oJywgJykgKyAnfSc7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmICFpc0RhdGUob2JqKSAmJiAhaXNSZWdFeHAob2JqKSkge1xuICAgICAgICB2YXIgeHMgPSBbXSwga2V5cyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAoaGFzKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAga2V5cy5zb3J0KCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgICBpZiAoL1teXFx3JF0vLnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgIHhzLnB1c2goaW5zcGVjdChrZXkpICsgJzogJyArIGluc3BlY3Qob2JqW2tleV0sIG9iaikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB4cy5wdXNoKGtleSArICc6ICcgKyBpbnNwZWN0KG9ialtrZXldLCBvYmopKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeHMubGVuZ3RoID09PSAwKSByZXR1cm4gJ3t9JztcbiAgICAgICAgcmV0dXJuICd7ICcgKyB4cy5qb2luKCcsICcpICsgJyB9JztcbiAgICB9XG4gICAgZWxzZSByZXR1cm4gU3RyaW5nKG9iaik7XG59O1xuXG5mdW5jdGlvbiBxdW90ZSAocykge1xuICAgIHJldHVybiBTdHJpbmcocykucmVwbGFjZSgvXCIvZywgJyZxdW90OycpO1xufVxuXG5mdW5jdGlvbiBpc0FycmF5IChvYmopIHsgcmV0dXJuIHRvU3RyKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XScgfVxuZnVuY3Rpb24gaXNEYXRlIChvYmopIHsgcmV0dXJuIHRvU3RyKG9iaikgPT09ICdbb2JqZWN0IERhdGVdJyB9XG5mdW5jdGlvbiBpc1JlZ0V4cCAob2JqKSB7IHJldHVybiB0b1N0cihvYmopID09PSAnW29iamVjdCBSZWdFeHBdJyB9XG5mdW5jdGlvbiBpc0Vycm9yIChvYmopIHsgcmV0dXJuIHRvU3RyKG9iaikgPT09ICdbb2JqZWN0IEVycm9yXScgfVxuZnVuY3Rpb24gaXNTeW1ib2wgKG9iaikgeyByZXR1cm4gdG9TdHIob2JqKSA9PT0gJ1tvYmplY3QgU3ltYm9sXScgfVxuXG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSB8fCBmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBrZXkgaW4gdGhpczsgfTtcbmZ1bmN0aW9uIGhhcyAob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gaGFzT3duLmNhbGwob2JqLCBrZXkpO1xufVxuXG5mdW5jdGlvbiB0b1N0ciAob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopO1xufVxuXG5mdW5jdGlvbiBuYW1lT2YgKGYpIHtcbiAgICBpZiAoZi5uYW1lKSByZXR1cm4gZi5uYW1lO1xuICAgIHZhciBtID0gZi50b1N0cmluZygpLm1hdGNoKC9eZnVuY3Rpb25cXHMqKFtcXHckXSspLyk7XG4gICAgaWYgKG0pIHJldHVybiBtWzFdO1xufVxuXG5mdW5jdGlvbiBpbmRleE9mICh4cywgeCkge1xuICAgIGlmICh4cy5pbmRleE9mKSByZXR1cm4geHMuaW5kZXhPZih4KTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHhzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoeHNbaV0gPT09IHgpIHJldHVybiBpO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5cbmZ1bmN0aW9uIGlzTWFwICh4KSB7XG4gICAgaWYgKCFtYXBTaXplKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgbWFwU2l6ZS5jYWxsKHgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNTZXQgKHgpIHtcbiAgICBpZiAoIXNldFNpemUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBzZXRTaXplLmNhbGwoeCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc0VsZW1lbnQgKHgpIHtcbiAgICBpZiAoIXggfHwgdHlwZW9mIHggIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKHR5cGVvZiBIVE1MRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgeCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZW9mIHgubm9kZU5hbWUgPT09ICdzdHJpbmcnXG4gICAgICAgICYmIHR5cGVvZiB4LmdldEF0dHJpYnV0ZSA9PT0gJ2Z1bmN0aW9uJ1xuICAgIDtcbn1cblxuZnVuY3Rpb24gaW5zcGVjdFN0cmluZyAoc3RyKSB7XG4gICAgdmFyIHMgPSBzdHIucmVwbGFjZSgvKFsnXFxcXF0pL2csICdcXFxcJDEnKS5yZXBsYWNlKC9bXFx4MDAtXFx4MWZdL2csIGxvd2J5dGUpO1xuICAgIHJldHVybiBcIidcIiArIHMgKyBcIidcIjtcbiAgICBcbiAgICBmdW5jdGlvbiBsb3dieXRlIChjKSB7XG4gICAgICAgIHZhciBuID0gYy5jaGFyQ29kZUF0KDApO1xuICAgICAgICB2YXIgeCA9IHsgODogJ2InLCA5OiAndCcsIDEwOiAnbicsIDEyOiAnZicsIDEzOiAncicgfVtuXTtcbiAgICAgICAgaWYgKHgpIHJldHVybiAnXFxcXCcgKyB4O1xuICAgICAgICByZXR1cm4gJ1xcXFx4JyArIChuIDwgMHgxMCA/ICcwJyA6ICcnKSArIG4udG9TdHJpbmcoMTYpO1xuICAgIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gbW9kaWZpZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW1cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBpc0FyZ3MgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyk7XG52YXIgaGFzRG9udEVudW1CdWcgPSAhKHsgdG9TdHJpbmc6IG51bGwgfSkucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyk7XG52YXIgaGFzUHJvdG9FbnVtQnVnID0gZnVuY3Rpb24gKCkge30ucHJvcGVydHlJc0VudW1lcmFibGUoJ3Byb3RvdHlwZScpO1xudmFyIGRvbnRFbnVtcyA9IFtcblx0J3RvU3RyaW5nJyxcblx0J3RvTG9jYWxlU3RyaW5nJyxcblx0J3ZhbHVlT2YnLFxuXHQnaGFzT3duUHJvcGVydHknLFxuXHQnaXNQcm90b3R5cGVPZicsXG5cdCdwcm9wZXJ0eUlzRW51bWVyYWJsZScsXG5cdCdjb25zdHJ1Y3Rvcidcbl07XG52YXIgZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGUgPSBmdW5jdGlvbiAobykge1xuXHR2YXIgY3RvciA9IG8uY29uc3RydWN0b3I7XG5cdHJldHVybiBjdG9yICYmIGN0b3IucHJvdG90eXBlID09PSBvO1xufTtcbnZhciBibGFja2xpc3RlZEtleXMgPSB7XG5cdCRjb25zb2xlOiB0cnVlLFxuXHQkZnJhbWU6IHRydWUsXG5cdCRmcmFtZUVsZW1lbnQ6IHRydWUsXG5cdCRmcmFtZXM6IHRydWUsXG5cdCRwYXJlbnQ6IHRydWUsXG5cdCRzZWxmOiB0cnVlLFxuXHQkd2Via2l0SW5kZXhlZERCOiB0cnVlLFxuXHQkd2Via2l0U3RvcmFnZUluZm86IHRydWUsXG5cdCR3aW5kb3c6IHRydWVcbn07XG52YXIgaGFzQXV0b21hdGlvbkVxdWFsaXR5QnVnID0gKGZ1bmN0aW9uICgpIHtcblx0LyogZ2xvYmFsIHdpbmRvdyAqL1xuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdGZvciAodmFyIGsgaW4gd2luZG93KSB7XG5cdFx0dHJ5IHtcblx0XHRcdGlmICghYmxhY2tsaXN0ZWRLZXlzWyckJyArIGtdICYmIGhhcy5jYWxsKHdpbmRvdywgaykgJiYgd2luZG93W2tdICE9PSBudWxsICYmIHR5cGVvZiB3aW5kb3dba10gPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGUod2luZG93W2tdKTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBmYWxzZTtcbn0oKSk7XG52YXIgZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGVJZk5vdEJ1Z2d5ID0gZnVuY3Rpb24gKG8pIHtcblx0LyogZ2xvYmFsIHdpbmRvdyAqL1xuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgIWhhc0F1dG9tYXRpb25FcXVhbGl0eUJ1Zykge1xuXHRcdHJldHVybiBlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZShvKTtcblx0fVxuXHR0cnkge1xuXHRcdHJldHVybiBlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZShvKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufTtcblxudmFyIGtleXNTaGltID0gZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcblx0dmFyIGlzT2JqZWN0ID0gb2JqZWN0ICE9PSBudWxsICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnO1xuXHR2YXIgaXNGdW5jdGlvbiA9IHRvU3RyLmNhbGwob2JqZWN0KSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblx0dmFyIGlzQXJndW1lbnRzID0gaXNBcmdzKG9iamVjdCk7XG5cdHZhciBpc1N0cmluZyA9IGlzT2JqZWN0ICYmIHRvU3RyLmNhbGwob2JqZWN0KSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XG5cdHZhciB0aGVLZXlzID0gW107XG5cblx0aWYgKCFpc09iamVjdCAmJiAhaXNGdW5jdGlvbiAmJiAhaXNBcmd1bWVudHMpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3Qua2V5cyBjYWxsZWQgb24gYSBub24tb2JqZWN0Jyk7XG5cdH1cblxuXHR2YXIgc2tpcFByb3RvID0gaGFzUHJvdG9FbnVtQnVnICYmIGlzRnVuY3Rpb247XG5cdGlmIChpc1N0cmluZyAmJiBvYmplY3QubGVuZ3RoID4gMCAmJiAhaGFzLmNhbGwob2JqZWN0LCAwKSkge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgb2JqZWN0Lmxlbmd0aDsgKytpKSB7XG5cdFx0XHR0aGVLZXlzLnB1c2goU3RyaW5nKGkpKTtcblx0XHR9XG5cdH1cblxuXHRpZiAoaXNBcmd1bWVudHMgJiYgb2JqZWN0Lmxlbmd0aCA+IDApIHtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IG9iamVjdC5sZW5ndGg7ICsraikge1xuXHRcdFx0dGhlS2V5cy5wdXNoKFN0cmluZyhqKSk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGZvciAodmFyIG5hbWUgaW4gb2JqZWN0KSB7XG5cdFx0XHRpZiAoIShza2lwUHJvdG8gJiYgbmFtZSA9PT0gJ3Byb3RvdHlwZScpICYmIGhhcy5jYWxsKG9iamVjdCwgbmFtZSkpIHtcblx0XHRcdFx0dGhlS2V5cy5wdXNoKFN0cmluZyhuYW1lKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKGhhc0RvbnRFbnVtQnVnKSB7XG5cdFx0dmFyIHNraXBDb25zdHJ1Y3RvciA9IGVxdWFsc0NvbnN0cnVjdG9yUHJvdG90eXBlSWZOb3RCdWdneShvYmplY3QpO1xuXG5cdFx0Zm9yICh2YXIgayA9IDA7IGsgPCBkb250RW51bXMubGVuZ3RoOyArK2spIHtcblx0XHRcdGlmICghKHNraXBDb25zdHJ1Y3RvciAmJiBkb250RW51bXNba10gPT09ICdjb25zdHJ1Y3RvcicpICYmIGhhcy5jYWxsKG9iamVjdCwgZG9udEVudW1zW2tdKSkge1xuXHRcdFx0XHR0aGVLZXlzLnB1c2goZG9udEVudW1zW2tdKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIHRoZUtleXM7XG59O1xuXG5rZXlzU2hpbS5zaGltID0gZnVuY3Rpb24gc2hpbU9iamVjdEtleXMoKSB7XG5cdGlmIChPYmplY3Qua2V5cykge1xuXHRcdHZhciBrZXlzV29ya3NXaXRoQXJndW1lbnRzID0gKGZ1bmN0aW9uICgpIHtcblx0XHRcdC8vIFNhZmFyaSA1LjAgYnVnXG5cdFx0XHRyZXR1cm4gKE9iamVjdC5rZXlzKGFyZ3VtZW50cykgfHwgJycpLmxlbmd0aCA9PT0gMjtcblx0XHR9KDEsIDIpKTtcblx0XHRpZiAoIWtleXNXb3Jrc1dpdGhBcmd1bWVudHMpIHtcblx0XHRcdHZhciBvcmlnaW5hbEtleXMgPSBPYmplY3Qua2V5cztcblx0XHRcdE9iamVjdC5rZXlzID0gZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcblx0XHRcdFx0aWYgKGlzQXJncyhvYmplY3QpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9yaWdpbmFsS2V5cyhzbGljZS5jYWxsKG9iamVjdCkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBvcmlnaW5hbEtleXMob2JqZWN0KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0T2JqZWN0LmtleXMgPSBrZXlzU2hpbTtcblx0fVxuXHRyZXR1cm4gT2JqZWN0LmtleXMgfHwga2V5c1NoaW07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXNTaGltO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG5cdHZhciBzdHIgPSB0b1N0ci5jYWxsKHZhbHVlKTtcblx0dmFyIGlzQXJncyA9IHN0ciA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cdGlmICghaXNBcmdzKSB7XG5cdFx0aXNBcmdzID0gc3RyICE9PSAnW29iamVjdCBBcnJheV0nICYmXG5cdFx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdFx0dHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcicgJiZcblx0XHRcdHZhbHVlLmxlbmd0aCA+PSAwICYmXG5cdFx0XHR0b1N0ci5jYWxsKHZhbHVlLmNhbGxlZSkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cdH1cblx0cmV0dXJuIGlzQXJncztcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gcmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIGFycmF5IHdpdGggZGlyZWN0b3J5IG5hbWVzIHRoZXJlXG4vLyBtdXN0IGJlIG5vIHNsYXNoZXMsIGVtcHR5IGVsZW1lbnRzLCBvciBkZXZpY2UgbmFtZXMgKGM6XFwpIGluIHRoZSBhcnJheVxuLy8gKHNvIGFsc28gbm8gbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlcyAtIGl0IGRvZXMgbm90IGRpc3Rpbmd1aXNoXG4vLyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgcGF0aHMpXG5mdW5jdGlvbiBub3JtYWxpemVBcnJheShwYXJ0cywgYWxsb3dBYm92ZVJvb3QpIHtcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIGxhc3QgPSBwYXJ0c1tpXTtcbiAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgIHBhcnRzLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG4vLyBTcGxpdCBhIGZpbGVuYW1lIGludG8gW3Jvb3QsIGRpciwgYmFzZW5hbWUsIGV4dF0sIHVuaXggdmVyc2lvblxuLy8gJ3Jvb3QnIGlzIGp1c3QgYSBzbGFzaCwgb3Igbm90aGluZy5cbnZhciBzcGxpdFBhdGhSZSA9XG4gICAgL14oXFwvP3wpKFtcXHNcXFNdKj8pKCg/OlxcLnsxLDJ9fFteXFwvXSs/fCkoXFwuW14uXFwvXSp8KSkoPzpbXFwvXSopJC87XG52YXIgc3BsaXRQYXRoID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aFJlLmV4ZWMoZmlsZW5hbWUpLnNsaWNlKDEpO1xufTtcblxuLy8gcGF0aC5yZXNvbHZlKFtmcm9tIC4uLl0sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZXNvbHZlID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNvbHZlZFBhdGggPSAnJyxcbiAgICAgIHJlc29sdmVkQWJzb2x1dGUgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gLTEgJiYgIXJlc29sdmVkQWJzb2x1dGU7IGktLSkge1xuICAgIHZhciBwYXRoID0gKGkgPj0gMCkgPyBhcmd1bWVudHNbaV0gOiBwcm9jZXNzLmN3ZCgpO1xuXG4gICAgLy8gU2tpcCBlbXB0eSBhbmQgaW52YWxpZCBlbnRyaWVzXG4gICAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9IGVsc2UgaWYgKCFwYXRoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgIHJlc29sdmVkQWJzb2x1dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICB9XG5cbiAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAvLyBoYW5kbGUgcmVsYXRpdmUgcGF0aHMgdG8gYmUgc2FmZSAobWlnaHQgaGFwcGVuIHdoZW4gcHJvY2Vzcy5jd2QoKSBmYWlscylcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHJlc29sdmVkUGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFyZXNvbHZlZEFic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgcmV0dXJuICgocmVzb2x2ZWRBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHJlc29sdmVkUGF0aCkgfHwgJy4nO1xufTtcblxuLy8gcGF0aC5ub3JtYWxpemUocGF0aClcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMubm9ybWFsaXplID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgaXNBYnNvbHV0ZSA9IGV4cG9ydHMuaXNBYnNvbHV0ZShwYXRoKSxcbiAgICAgIHRyYWlsaW5nU2xhc2ggPSBzdWJzdHIocGF0aCwgLTEpID09PSAnLyc7XG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFpc0Fic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgaWYgKCFwYXRoICYmICFpc0Fic29sdXRlKSB7XG4gICAgcGF0aCA9ICcuJztcbiAgfVxuICBpZiAocGF0aCAmJiB0cmFpbGluZ1NsYXNoKSB7XG4gICAgcGF0aCArPSAnLyc7XG4gIH1cblxuICByZXR1cm4gKGlzQWJzb2x1dGUgPyAnLycgOiAnJykgKyBwYXRoO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5pc0Fic29sdXRlID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuam9pbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcGF0aHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gZXhwb3J0cy5ub3JtYWxpemUoZmlsdGVyKHBhdGhzLCBmdW5jdGlvbihwLCBpbmRleCkge1xuICAgIGlmICh0eXBlb2YgcCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLmpvaW4gbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfVxuICAgIHJldHVybiBwO1xuICB9KS5qb2luKCcvJykpO1xufTtcblxuXG4vLyBwYXRoLnJlbGF0aXZlKGZyb20sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZWxhdGl2ZSA9IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gIGZyb20gPSBleHBvcnRzLnJlc29sdmUoZnJvbSkuc3Vic3RyKDEpO1xuICB0byA9IGV4cG9ydHMucmVzb2x2ZSh0bykuc3Vic3RyKDEpO1xuXG4gIGZ1bmN0aW9uIHRyaW0oYXJyKSB7XG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICBmb3IgKDsgc3RhcnQgPCBhcnIubGVuZ3RoOyBzdGFydCsrKSB7XG4gICAgICBpZiAoYXJyW3N0YXJ0XSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBlbmQgPSBhcnIubGVuZ3RoIC0gMTtcbiAgICBmb3IgKDsgZW5kID49IDA7IGVuZC0tKSB7XG4gICAgICBpZiAoYXJyW2VuZF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoc3RhcnQgPiBlbmQpIHJldHVybiBbXTtcbiAgICByZXR1cm4gYXJyLnNsaWNlKHN0YXJ0LCBlbmQgLSBzdGFydCArIDEpO1xuICB9XG5cbiAgdmFyIGZyb21QYXJ0cyA9IHRyaW0oZnJvbS5zcGxpdCgnLycpKTtcbiAgdmFyIHRvUGFydHMgPSB0cmltKHRvLnNwbGl0KCcvJykpO1xuXG4gIHZhciBsZW5ndGggPSBNYXRoLm1pbihmcm9tUGFydHMubGVuZ3RoLCB0b1BhcnRzLmxlbmd0aCk7XG4gIHZhciBzYW1lUGFydHNMZW5ndGggPSBsZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZnJvbVBhcnRzW2ldICE9PSB0b1BhcnRzW2ldKSB7XG4gICAgICBzYW1lUGFydHNMZW5ndGggPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdmFyIG91dHB1dFBhcnRzID0gW107XG4gIGZvciAodmFyIGkgPSBzYW1lUGFydHNMZW5ndGg7IGkgPCBmcm9tUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXRQYXJ0cy5wdXNoKCcuLicpO1xuICB9XG5cbiAgb3V0cHV0UGFydHMgPSBvdXRwdXRQYXJ0cy5jb25jYXQodG9QYXJ0cy5zbGljZShzYW1lUGFydHNMZW5ndGgpKTtcblxuICByZXR1cm4gb3V0cHV0UGFydHMuam9pbignLycpO1xufTtcblxuZXhwb3J0cy5zZXAgPSAnLyc7XG5leHBvcnRzLmRlbGltaXRlciA9ICc6JztcblxuZXhwb3J0cy5kaXJuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgcmVzdWx0ID0gc3BsaXRQYXRoKHBhdGgpLFxuICAgICAgcm9vdCA9IHJlc3VsdFswXSxcbiAgICAgIGRpciA9IHJlc3VsdFsxXTtcblxuICBpZiAoIXJvb3QgJiYgIWRpcikge1xuICAgIC8vIE5vIGRpcm5hbWUgd2hhdHNvZXZlclxuICAgIHJldHVybiAnLic7XG4gIH1cblxuICBpZiAoZGlyKSB7XG4gICAgLy8gSXQgaGFzIGEgZGlybmFtZSwgc3RyaXAgdHJhaWxpbmcgc2xhc2hcbiAgICBkaXIgPSBkaXIuc3Vic3RyKDAsIGRpci5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIHJldHVybiByb290ICsgZGlyO1xufTtcblxuXG5leHBvcnRzLmJhc2VuYW1lID0gZnVuY3Rpb24ocGF0aCwgZXh0KSB7XG4gIHZhciBmID0gc3BsaXRQYXRoKHBhdGgpWzJdO1xuICAvLyBUT0RPOiBtYWtlIHRoaXMgY29tcGFyaXNvbiBjYXNlLWluc2Vuc2l0aXZlIG9uIHdpbmRvd3M/XG4gIGlmIChleHQgJiYgZi5zdWJzdHIoLTEgKiBleHQubGVuZ3RoKSA9PT0gZXh0KSB7XG4gICAgZiA9IGYuc3Vic3RyKDAsIGYubGVuZ3RoIC0gZXh0Lmxlbmd0aCk7XG4gIH1cbiAgcmV0dXJuIGY7XG59O1xuXG5cbmV4cG9ydHMuZXh0bmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aChwYXRoKVszXTtcbn07XG5cbmZ1bmN0aW9uIGZpbHRlciAoeHMsIGYpIHtcbiAgICBpZiAoeHMuZmlsdGVyKSByZXR1cm4geHMuZmlsdGVyKGYpO1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChmKHhzW2ldLCBpLCB4cykpIHJlcy5wdXNoKHhzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuLy8gU3RyaW5nLnByb3RvdHlwZS5zdWJzdHIgLSBuZWdhdGl2ZSBpbmRleCBkb24ndCB3b3JrIGluIElFOFxudmFyIHN1YnN0ciA9ICdhYicuc3Vic3RyKC0xKSA9PT0gJ2InXG4gICAgPyBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7IHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pIH1cbiAgICA6IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSBzdHIubGVuZ3RoICsgc3RhcnQ7XG4gICAgICAgIHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pO1xuICAgIH1cbjtcbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKCFwcm9jZXNzLnZlcnNpb24gfHxcbiAgICBwcm9jZXNzLnZlcnNpb24uaW5kZXhPZigndjAuJykgPT09IDAgfHxcbiAgICBwcm9jZXNzLnZlcnNpb24uaW5kZXhPZigndjEuJykgPT09IDAgJiYgcHJvY2Vzcy52ZXJzaW9uLmluZGV4T2YoJ3YxLjguJykgIT09IDApIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBuZXh0VGljaztcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcHJvY2Vzcy5uZXh0VGljaztcbn1cblxuZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICB2YXIgaSA9IDA7XG4gIHdoaWxlIChpIDwgYXJncy5sZW5ndGgpIHtcbiAgICBhcmdzW2krK10gPSBhcmd1bWVudHNbaV07XG4gIH1cbiAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiBhZnRlclRpY2soKSB7XG4gICAgZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gIH0pO1xufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2xpYi9fc3RyZWFtX2R1cGxleC5qc1wiKVxuIiwiLy8gYSBkdXBsZXggc3RyZWFtIGlzIGp1c3QgYSBzdHJlYW0gdGhhdCBpcyBib3RoIHJlYWRhYmxlIGFuZCB3cml0YWJsZS5cbi8vIFNpbmNlIEpTIGRvZXNuJ3QgaGF2ZSBtdWx0aXBsZSBwcm90b3R5cGFsIGluaGVyaXRhbmNlLCB0aGlzIGNsYXNzXG4vLyBwcm90b3R5cGFsbHkgaW5oZXJpdHMgZnJvbSBSZWFkYWJsZSwgYW5kIHRoZW4gcGFyYXNpdGljYWxseSBmcm9tXG4vLyBXcml0YWJsZS5cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjxyZXBsYWNlbWVudD4qL1xuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGtleXMucHVzaChrZXkpO1xuICB9cmV0dXJuIGtleXM7XG59O1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbm1vZHVsZS5leHBvcnRzID0gRHVwbGV4O1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIHByb2Nlc3NOZXh0VGljayA9IHJlcXVpcmUoJ3Byb2Nlc3MtbmV4dGljay1hcmdzJyk7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciB1dGlsID0gcmVxdWlyZSgnY29yZS11dGlsLWlzJyk7XG51dGlsLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG52YXIgUmVhZGFibGUgPSByZXF1aXJlKCcuL19zdHJlYW1fcmVhZGFibGUnKTtcbnZhciBXcml0YWJsZSA9IHJlcXVpcmUoJy4vX3N0cmVhbV93cml0YWJsZScpO1xuXG51dGlsLmluaGVyaXRzKER1cGxleCwgUmVhZGFibGUpO1xuXG52YXIga2V5cyA9IG9iamVjdEtleXMoV3JpdGFibGUucHJvdG90eXBlKTtcbmZvciAodmFyIHYgPSAwOyB2IDwga2V5cy5sZW5ndGg7IHYrKykge1xuICB2YXIgbWV0aG9kID0ga2V5c1t2XTtcbiAgaWYgKCFEdXBsZXgucHJvdG90eXBlW21ldGhvZF0pIER1cGxleC5wcm90b3R5cGVbbWV0aG9kXSA9IFdyaXRhYmxlLnByb3RvdHlwZVttZXRob2RdO1xufVxuXG5mdW5jdGlvbiBEdXBsZXgob3B0aW9ucykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRHVwbGV4KSkgcmV0dXJuIG5ldyBEdXBsZXgob3B0aW9ucyk7XG5cbiAgUmVhZGFibGUuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgV3JpdGFibGUuY2FsbCh0aGlzLCBvcHRpb25zKTtcblxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJlYWRhYmxlID09PSBmYWxzZSkgdGhpcy5yZWFkYWJsZSA9IGZhbHNlO1xuXG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMud3JpdGFibGUgPT09IGZhbHNlKSB0aGlzLndyaXRhYmxlID0gZmFsc2U7XG5cbiAgdGhpcy5hbGxvd0hhbGZPcGVuID0gdHJ1ZTtcbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5hbGxvd0hhbGZPcGVuID09PSBmYWxzZSkgdGhpcy5hbGxvd0hhbGZPcGVuID0gZmFsc2U7XG5cbiAgdGhpcy5vbmNlKCdlbmQnLCBvbmVuZCk7XG59XG5cbi8vIHRoZSBuby1oYWxmLW9wZW4gZW5mb3JjZXJcbmZ1bmN0aW9uIG9uZW5kKCkge1xuICAvLyBpZiB3ZSBhbGxvdyBoYWxmLW9wZW4gc3RhdGUsIG9yIGlmIHRoZSB3cml0YWJsZSBzaWRlIGVuZGVkLFxuICAvLyB0aGVuIHdlJ3JlIG9rLlxuICBpZiAodGhpcy5hbGxvd0hhbGZPcGVuIHx8IHRoaXMuX3dyaXRhYmxlU3RhdGUuZW5kZWQpIHJldHVybjtcblxuICAvLyBubyBtb3JlIGRhdGEgY2FuIGJlIHdyaXR0ZW4uXG4gIC8vIEJ1dCBhbGxvdyBtb3JlIHdyaXRlcyB0byBoYXBwZW4gaW4gdGhpcyB0aWNrLlxuICBwcm9jZXNzTmV4dFRpY2sob25FbmROVCwgdGhpcyk7XG59XG5cbmZ1bmN0aW9uIG9uRW5kTlQoc2VsZikge1xuICBzZWxmLmVuZCgpO1xufVxuXG5mdW5jdGlvbiBmb3JFYWNoKHhzLCBmKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0geHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZih4c1tpXSwgaSk7XG4gIH1cbn0iLCIvLyBhIHBhc3N0aHJvdWdoIHN0cmVhbS5cbi8vIGJhc2ljYWxseSBqdXN0IHRoZSBtb3N0IG1pbmltYWwgc29ydCBvZiBUcmFuc2Zvcm0gc3RyZWFtLlxuLy8gRXZlcnkgd3JpdHRlbiBjaHVuayBnZXRzIG91dHB1dCBhcy1pcy5cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhc3NUaHJvdWdoO1xuXG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi9fc3RyZWFtX3RyYW5zZm9ybScpO1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIHV0aWwgPSByZXF1aXJlKCdjb3JlLXV0aWwtaXMnKTtcbnV0aWwuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbnV0aWwuaW5oZXJpdHMoUGFzc1Rocm91Z2gsIFRyYW5zZm9ybSk7XG5cbmZ1bmN0aW9uIFBhc3NUaHJvdWdoKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFBhc3NUaHJvdWdoKSkgcmV0dXJuIG5ldyBQYXNzVGhyb3VnaChvcHRpb25zKTtcblxuICBUcmFuc2Zvcm0uY2FsbCh0aGlzLCBvcHRpb25zKTtcbn1cblxuUGFzc1Rocm91Z2gucHJvdG90eXBlLl90cmFuc2Zvcm0gPSBmdW5jdGlvbiAoY2h1bmssIGVuY29kaW5nLCBjYikge1xuICBjYihudWxsLCBjaHVuayk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFkYWJsZTtcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBwcm9jZXNzTmV4dFRpY2sgPSByZXF1aXJlKCdwcm9jZXNzLW5leHRpY2stYXJncycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKTtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG5SZWFkYWJsZS5SZWFkYWJsZVN0YXRlID0gUmVhZGFibGVTdGF0ZTtcblxudmFyIEVFID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgRUVsaXN0ZW5lckNvdW50ID0gZnVuY3Rpb24gKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJzKHR5cGUpLmxlbmd0aDtcbn07XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBTdHJlYW07XG4oZnVuY3Rpb24gKCkge1xuICB0cnkge1xuICAgIFN0cmVhbSA9IHJlcXVpcmUoJ3N0JyArICdyZWFtJyk7XG4gIH0gY2F0Y2ggKF8pIHt9IGZpbmFsbHkge1xuICAgIGlmICghU3RyZWFtKSBTdHJlYW0gPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG4gIH1cbn0pKCk7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciB1dGlsID0gcmVxdWlyZSgnY29yZS11dGlsLWlzJyk7XG51dGlsLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIGRlYnVnVXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBkZWJ1ZyA9IHVuZGVmaW5lZDtcbmlmIChkZWJ1Z1V0aWwgJiYgZGVidWdVdGlsLmRlYnVnbG9nKSB7XG4gIGRlYnVnID0gZGVidWdVdGlsLmRlYnVnbG9nKCdzdHJlYW0nKTtcbn0gZWxzZSB7XG4gIGRlYnVnID0gZnVuY3Rpb24gKCkge307XG59XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxudmFyIFN0cmluZ0RlY29kZXI7XG5cbnV0aWwuaW5oZXJpdHMoUmVhZGFibGUsIFN0cmVhbSk7XG5cbnZhciBEdXBsZXg7XG5mdW5jdGlvbiBSZWFkYWJsZVN0YXRlKG9wdGlvbnMsIHN0cmVhbSkge1xuICBEdXBsZXggPSBEdXBsZXggfHwgcmVxdWlyZSgnLi9fc3RyZWFtX2R1cGxleCcpO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIC8vIG9iamVjdCBzdHJlYW0gZmxhZy4gVXNlZCB0byBtYWtlIHJlYWQobikgaWdub3JlIG4gYW5kIHRvXG4gIC8vIG1ha2UgYWxsIHRoZSBidWZmZXIgbWVyZ2luZyBhbmQgbGVuZ3RoIGNoZWNrcyBnbyBhd2F5XG4gIHRoaXMub2JqZWN0TW9kZSA9ICEhb3B0aW9ucy5vYmplY3RNb2RlO1xuXG4gIGlmIChzdHJlYW0gaW5zdGFuY2VvZiBEdXBsZXgpIHRoaXMub2JqZWN0TW9kZSA9IHRoaXMub2JqZWN0TW9kZSB8fCAhIW9wdGlvbnMucmVhZGFibGVPYmplY3RNb2RlO1xuXG4gIC8vIHRoZSBwb2ludCBhdCB3aGljaCBpdCBzdG9wcyBjYWxsaW5nIF9yZWFkKCkgdG8gZmlsbCB0aGUgYnVmZmVyXG4gIC8vIE5vdGU6IDAgaXMgYSB2YWxpZCB2YWx1ZSwgbWVhbnMgXCJkb24ndCBjYWxsIF9yZWFkIHByZWVtcHRpdmVseSBldmVyXCJcbiAgdmFyIGh3bSA9IG9wdGlvbnMuaGlnaFdhdGVyTWFyaztcbiAgdmFyIGRlZmF1bHRId20gPSB0aGlzLm9iamVjdE1vZGUgPyAxNiA6IDE2ICogMTAyNDtcbiAgdGhpcy5oaWdoV2F0ZXJNYXJrID0gaHdtIHx8IGh3bSA9PT0gMCA/IGh3bSA6IGRlZmF1bHRId207XG5cbiAgLy8gY2FzdCB0byBpbnRzLlxuICB0aGlzLmhpZ2hXYXRlck1hcmsgPSB+IH50aGlzLmhpZ2hXYXRlck1hcms7XG5cbiAgdGhpcy5idWZmZXIgPSBbXTtcbiAgdGhpcy5sZW5ndGggPSAwO1xuICB0aGlzLnBpcGVzID0gbnVsbDtcbiAgdGhpcy5waXBlc0NvdW50ID0gMDtcbiAgdGhpcy5mbG93aW5nID0gbnVsbDtcbiAgdGhpcy5lbmRlZCA9IGZhbHNlO1xuICB0aGlzLmVuZEVtaXR0ZWQgPSBmYWxzZTtcbiAgdGhpcy5yZWFkaW5nID0gZmFsc2U7XG5cbiAgLy8gYSBmbGFnIHRvIGJlIGFibGUgdG8gdGVsbCBpZiB0aGUgb253cml0ZSBjYiBpcyBjYWxsZWQgaW1tZWRpYXRlbHksXG4gIC8vIG9yIG9uIGEgbGF0ZXIgdGljay4gIFdlIHNldCB0aGlzIHRvIHRydWUgYXQgZmlyc3QsIGJlY2F1c2UgYW55XG4gIC8vIGFjdGlvbnMgdGhhdCBzaG91bGRuJ3QgaGFwcGVuIHVudGlsIFwibGF0ZXJcIiBzaG91bGQgZ2VuZXJhbGx5IGFsc29cbiAgLy8gbm90IGhhcHBlbiBiZWZvcmUgdGhlIGZpcnN0IHdyaXRlIGNhbGwuXG4gIHRoaXMuc3luYyA9IHRydWU7XG5cbiAgLy8gd2hlbmV2ZXIgd2UgcmV0dXJuIG51bGwsIHRoZW4gd2Ugc2V0IGEgZmxhZyB0byBzYXlcbiAgLy8gdGhhdCB3ZSdyZSBhd2FpdGluZyBhICdyZWFkYWJsZScgZXZlbnQgZW1pc3Npb24uXG4gIHRoaXMubmVlZFJlYWRhYmxlID0gZmFsc2U7XG4gIHRoaXMuZW1pdHRlZFJlYWRhYmxlID0gZmFsc2U7XG4gIHRoaXMucmVhZGFibGVMaXN0ZW5pbmcgPSBmYWxzZTtcbiAgdGhpcy5yZXN1bWVTY2hlZHVsZWQgPSBmYWxzZTtcblxuICAvLyBDcnlwdG8gaXMga2luZCBvZiBvbGQgYW5kIGNydXN0eS4gIEhpc3RvcmljYWxseSwgaXRzIGRlZmF1bHQgc3RyaW5nXG4gIC8vIGVuY29kaW5nIGlzICdiaW5hcnknIHNvIHdlIGhhdmUgdG8gbWFrZSB0aGlzIGNvbmZpZ3VyYWJsZS5cbiAgLy8gRXZlcnl0aGluZyBlbHNlIGluIHRoZSB1bml2ZXJzZSB1c2VzICd1dGY4JywgdGhvdWdoLlxuICB0aGlzLmRlZmF1bHRFbmNvZGluZyA9IG9wdGlvbnMuZGVmYXVsdEVuY29kaW5nIHx8ICd1dGY4JztcblxuICAvLyB3aGVuIHBpcGluZywgd2Ugb25seSBjYXJlIGFib3V0ICdyZWFkYWJsZScgZXZlbnRzIHRoYXQgaGFwcGVuXG4gIC8vIGFmdGVyIHJlYWQoKWluZyBhbGwgdGhlIGJ5dGVzIGFuZCBub3QgZ2V0dGluZyBhbnkgcHVzaGJhY2suXG4gIHRoaXMucmFuT3V0ID0gZmFsc2U7XG5cbiAgLy8gdGhlIG51bWJlciBvZiB3cml0ZXJzIHRoYXQgYXJlIGF3YWl0aW5nIGEgZHJhaW4gZXZlbnQgaW4gLnBpcGUoKXNcbiAgdGhpcy5hd2FpdERyYWluID0gMDtcblxuICAvLyBpZiB0cnVlLCBhIG1heWJlUmVhZE1vcmUgaGFzIGJlZW4gc2NoZWR1bGVkXG4gIHRoaXMucmVhZGluZ01vcmUgPSBmYWxzZTtcblxuICB0aGlzLmRlY29kZXIgPSBudWxsO1xuICB0aGlzLmVuY29kaW5nID0gbnVsbDtcbiAgaWYgKG9wdGlvbnMuZW5jb2RpbmcpIHtcbiAgICBpZiAoIVN0cmluZ0RlY29kZXIpIFN0cmluZ0RlY29kZXIgPSByZXF1aXJlKCdzdHJpbmdfZGVjb2Rlci8nKS5TdHJpbmdEZWNvZGVyO1xuICAgIHRoaXMuZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKG9wdGlvbnMuZW5jb2RpbmcpO1xuICAgIHRoaXMuZW5jb2RpbmcgPSBvcHRpb25zLmVuY29kaW5nO1xuICB9XG59XG5cbnZhciBEdXBsZXg7XG5mdW5jdGlvbiBSZWFkYWJsZShvcHRpb25zKSB7XG4gIER1cGxleCA9IER1cGxleCB8fCByZXF1aXJlKCcuL19zdHJlYW1fZHVwbGV4Jyk7XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJlYWRhYmxlKSkgcmV0dXJuIG5ldyBSZWFkYWJsZShvcHRpb25zKTtcblxuICB0aGlzLl9yZWFkYWJsZVN0YXRlID0gbmV3IFJlYWRhYmxlU3RhdGUob3B0aW9ucywgdGhpcyk7XG5cbiAgLy8gbGVnYWN5XG4gIHRoaXMucmVhZGFibGUgPSB0cnVlO1xuXG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnJlYWQgPT09ICdmdW5jdGlvbicpIHRoaXMuX3JlYWQgPSBvcHRpb25zLnJlYWQ7XG5cbiAgU3RyZWFtLmNhbGwodGhpcyk7XG59XG5cbi8vIE1hbnVhbGx5IHNob3ZlIHNvbWV0aGluZyBpbnRvIHRoZSByZWFkKCkgYnVmZmVyLlxuLy8gVGhpcyByZXR1cm5zIHRydWUgaWYgdGhlIGhpZ2hXYXRlck1hcmsgaGFzIG5vdCBiZWVuIGhpdCB5ZXQsXG4vLyBzaW1pbGFyIHRvIGhvdyBXcml0YWJsZS53cml0ZSgpIHJldHVybnMgdHJ1ZSBpZiB5b3Ugc2hvdWxkXG4vLyB3cml0ZSgpIHNvbWUgbW9yZS5cblJlYWRhYmxlLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKGNodW5rLCBlbmNvZGluZykge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuXG4gIGlmICghc3RhdGUub2JqZWN0TW9kZSAmJiB0eXBlb2YgY2h1bmsgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBlbmNvZGluZyB8fCBzdGF0ZS5kZWZhdWx0RW5jb2Rpbmc7XG4gICAgaWYgKGVuY29kaW5nICE9PSBzdGF0ZS5lbmNvZGluZykge1xuICAgICAgY2h1bmsgPSBuZXcgQnVmZmVyKGNodW5rLCBlbmNvZGluZyk7XG4gICAgICBlbmNvZGluZyA9ICcnO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZWFkYWJsZUFkZENodW5rKHRoaXMsIHN0YXRlLCBjaHVuaywgZW5jb2RpbmcsIGZhbHNlKTtcbn07XG5cbi8vIFVuc2hpZnQgc2hvdWxkICphbHdheXMqIGJlIHNvbWV0aGluZyBkaXJlY3RseSBvdXQgb2YgcmVhZCgpXG5SZWFkYWJsZS5wcm90b3R5cGUudW5zaGlmdCA9IGZ1bmN0aW9uIChjaHVuaykge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICByZXR1cm4gcmVhZGFibGVBZGRDaHVuayh0aGlzLCBzdGF0ZSwgY2h1bmssICcnLCB0cnVlKTtcbn07XG5cblJlYWRhYmxlLnByb3RvdHlwZS5pc1BhdXNlZCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZyA9PT0gZmFsc2U7XG59O1xuXG5mdW5jdGlvbiByZWFkYWJsZUFkZENodW5rKHN0cmVhbSwgc3RhdGUsIGNodW5rLCBlbmNvZGluZywgYWRkVG9Gcm9udCkge1xuICB2YXIgZXIgPSBjaHVua0ludmFsaWQoc3RhdGUsIGNodW5rKTtcbiAgaWYgKGVyKSB7XG4gICAgc3RyZWFtLmVtaXQoJ2Vycm9yJywgZXIpO1xuICB9IGVsc2UgaWYgKGNodW5rID09PSBudWxsKSB7XG4gICAgc3RhdGUucmVhZGluZyA9IGZhbHNlO1xuICAgIG9uRW9mQ2h1bmsoc3RyZWFtLCBzdGF0ZSk7XG4gIH0gZWxzZSBpZiAoc3RhdGUub2JqZWN0TW9kZSB8fCBjaHVuayAmJiBjaHVuay5sZW5ndGggPiAwKSB7XG4gICAgaWYgKHN0YXRlLmVuZGVkICYmICFhZGRUb0Zyb250KSB7XG4gICAgICB2YXIgZSA9IG5ldyBFcnJvcignc3RyZWFtLnB1c2goKSBhZnRlciBFT0YnKTtcbiAgICAgIHN0cmVhbS5lbWl0KCdlcnJvcicsIGUpO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUuZW5kRW1pdHRlZCAmJiBhZGRUb0Zyb250KSB7XG4gICAgICB2YXIgZSA9IG5ldyBFcnJvcignc3RyZWFtLnVuc2hpZnQoKSBhZnRlciBlbmQgZXZlbnQnKTtcbiAgICAgIHN0cmVhbS5lbWl0KCdlcnJvcicsIGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc2tpcEFkZDtcbiAgICAgIGlmIChzdGF0ZS5kZWNvZGVyICYmICFhZGRUb0Zyb250ICYmICFlbmNvZGluZykge1xuICAgICAgICBjaHVuayA9IHN0YXRlLmRlY29kZXIud3JpdGUoY2h1bmspO1xuICAgICAgICBza2lwQWRkID0gIXN0YXRlLm9iamVjdE1vZGUgJiYgY2h1bmsubGVuZ3RoID09PSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWFkZFRvRnJvbnQpIHN0YXRlLnJlYWRpbmcgPSBmYWxzZTtcblxuICAgICAgLy8gRG9uJ3QgYWRkIHRvIHRoZSBidWZmZXIgaWYgd2UndmUgZGVjb2RlZCB0byBhbiBlbXB0eSBzdHJpbmcgY2h1bmsgYW5kXG4gICAgICAvLyB3ZSdyZSBub3QgaW4gb2JqZWN0IG1vZGVcbiAgICAgIGlmICghc2tpcEFkZCkge1xuICAgICAgICAvLyBpZiB3ZSB3YW50IHRoZSBkYXRhIG5vdywganVzdCBlbWl0IGl0LlxuICAgICAgICBpZiAoc3RhdGUuZmxvd2luZyAmJiBzdGF0ZS5sZW5ndGggPT09IDAgJiYgIXN0YXRlLnN5bmMpIHtcbiAgICAgICAgICBzdHJlYW0uZW1pdCgnZGF0YScsIGNodW5rKTtcbiAgICAgICAgICBzdHJlYW0ucmVhZCgwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyB1cGRhdGUgdGhlIGJ1ZmZlciBpbmZvLlxuICAgICAgICAgIHN0YXRlLmxlbmd0aCArPSBzdGF0ZS5vYmplY3RNb2RlID8gMSA6IGNodW5rLmxlbmd0aDtcbiAgICAgICAgICBpZiAoYWRkVG9Gcm9udCkgc3RhdGUuYnVmZmVyLnVuc2hpZnQoY2h1bmspO2Vsc2Ugc3RhdGUuYnVmZmVyLnB1c2goY2h1bmspO1xuXG4gICAgICAgICAgaWYgKHN0YXRlLm5lZWRSZWFkYWJsZSkgZW1pdFJlYWRhYmxlKHN0cmVhbSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbWF5YmVSZWFkTW9yZShzdHJlYW0sIHN0YXRlKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoIWFkZFRvRnJvbnQpIHtcbiAgICBzdGF0ZS5yZWFkaW5nID0gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gbmVlZE1vcmVEYXRhKHN0YXRlKTtcbn1cblxuLy8gaWYgaXQncyBwYXN0IHRoZSBoaWdoIHdhdGVyIG1hcmssIHdlIGNhbiBwdXNoIGluIHNvbWUgbW9yZS5cbi8vIEFsc28sIGlmIHdlIGhhdmUgbm8gZGF0YSB5ZXQsIHdlIGNhbiBzdGFuZCBzb21lXG4vLyBtb3JlIGJ5dGVzLiAgVGhpcyBpcyB0byB3b3JrIGFyb3VuZCBjYXNlcyB3aGVyZSBod209MCxcbi8vIHN1Y2ggYXMgdGhlIHJlcGwuICBBbHNvLCBpZiB0aGUgcHVzaCgpIHRyaWdnZXJlZCBhXG4vLyByZWFkYWJsZSBldmVudCwgYW5kIHRoZSB1c2VyIGNhbGxlZCByZWFkKGxhcmdlTnVtYmVyKSBzdWNoIHRoYXRcbi8vIG5lZWRSZWFkYWJsZSB3YXMgc2V0LCB0aGVuIHdlIG91Z2h0IHRvIHB1c2ggbW9yZSwgc28gdGhhdCBhbm90aGVyXG4vLyAncmVhZGFibGUnIGV2ZW50IHdpbGwgYmUgdHJpZ2dlcmVkLlxuZnVuY3Rpb24gbmVlZE1vcmVEYXRhKHN0YXRlKSB7XG4gIHJldHVybiAhc3RhdGUuZW5kZWQgJiYgKHN0YXRlLm5lZWRSZWFkYWJsZSB8fCBzdGF0ZS5sZW5ndGggPCBzdGF0ZS5oaWdoV2F0ZXJNYXJrIHx8IHN0YXRlLmxlbmd0aCA9PT0gMCk7XG59XG5cbi8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuUmVhZGFibGUucHJvdG90eXBlLnNldEVuY29kaW5nID0gZnVuY3Rpb24gKGVuYykge1xuICBpZiAoIVN0cmluZ0RlY29kZXIpIFN0cmluZ0RlY29kZXIgPSByZXF1aXJlKCdzdHJpbmdfZGVjb2Rlci8nKS5TdHJpbmdEZWNvZGVyO1xuICB0aGlzLl9yZWFkYWJsZVN0YXRlLmRlY29kZXIgPSBuZXcgU3RyaW5nRGVjb2RlcihlbmMpO1xuICB0aGlzLl9yZWFkYWJsZVN0YXRlLmVuY29kaW5nID0gZW5jO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIERvbid0IHJhaXNlIHRoZSBod20gPiA4TUJcbnZhciBNQVhfSFdNID0gMHg4MDAwMDA7XG5mdW5jdGlvbiBjb21wdXRlTmV3SGlnaFdhdGVyTWFyayhuKSB7XG4gIGlmIChuID49IE1BWF9IV00pIHtcbiAgICBuID0gTUFYX0hXTTtcbiAgfSBlbHNlIHtcbiAgICAvLyBHZXQgdGhlIG5leHQgaGlnaGVzdCBwb3dlciBvZiAyXG4gICAgbi0tO1xuICAgIG4gfD0gbiA+Pj4gMTtcbiAgICBuIHw9IG4gPj4+IDI7XG4gICAgbiB8PSBuID4+PiA0O1xuICAgIG4gfD0gbiA+Pj4gODtcbiAgICBuIHw9IG4gPj4+IDE2O1xuICAgIG4rKztcbiAgfVxuICByZXR1cm4gbjtcbn1cblxuZnVuY3Rpb24gaG93TXVjaFRvUmVhZChuLCBzdGF0ZSkge1xuICBpZiAoc3RhdGUubGVuZ3RoID09PSAwICYmIHN0YXRlLmVuZGVkKSByZXR1cm4gMDtcblxuICBpZiAoc3RhdGUub2JqZWN0TW9kZSkgcmV0dXJuIG4gPT09IDAgPyAwIDogMTtcblxuICBpZiAobiA9PT0gbnVsbCB8fCBpc05hTihuKSkge1xuICAgIC8vIG9ubHkgZmxvdyBvbmUgYnVmZmVyIGF0IGEgdGltZVxuICAgIGlmIChzdGF0ZS5mbG93aW5nICYmIHN0YXRlLmJ1ZmZlci5sZW5ndGgpIHJldHVybiBzdGF0ZS5idWZmZXJbMF0ubGVuZ3RoO2Vsc2UgcmV0dXJuIHN0YXRlLmxlbmd0aDtcbiAgfVxuXG4gIGlmIChuIDw9IDApIHJldHVybiAwO1xuXG4gIC8vIElmIHdlJ3JlIGFza2luZyBmb3IgbW9yZSB0aGFuIHRoZSB0YXJnZXQgYnVmZmVyIGxldmVsLFxuICAvLyB0aGVuIHJhaXNlIHRoZSB3YXRlciBtYXJrLiAgQnVtcCB1cCB0byB0aGUgbmV4dCBoaWdoZXN0XG4gIC8vIHBvd2VyIG9mIDIsIHRvIHByZXZlbnQgaW5jcmVhc2luZyBpdCBleGNlc3NpdmVseSBpbiB0aW55XG4gIC8vIGFtb3VudHMuXG4gIGlmIChuID4gc3RhdGUuaGlnaFdhdGVyTWFyaykgc3RhdGUuaGlnaFdhdGVyTWFyayA9IGNvbXB1dGVOZXdIaWdoV2F0ZXJNYXJrKG4pO1xuXG4gIC8vIGRvbid0IGhhdmUgdGhhdCBtdWNoLiAgcmV0dXJuIG51bGwsIHVubGVzcyB3ZSd2ZSBlbmRlZC5cbiAgaWYgKG4gPiBzdGF0ZS5sZW5ndGgpIHtcbiAgICBpZiAoIXN0YXRlLmVuZGVkKSB7XG4gICAgICBzdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzdGF0ZS5sZW5ndGg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG47XG59XG5cbi8vIHlvdSBjYW4gb3ZlcnJpZGUgZWl0aGVyIHRoaXMgbWV0aG9kLCBvciB0aGUgYXN5bmMgX3JlYWQobikgYmVsb3cuXG5SZWFkYWJsZS5wcm90b3R5cGUucmVhZCA9IGZ1bmN0aW9uIChuKSB7XG4gIGRlYnVnKCdyZWFkJywgbik7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG4gIHZhciBuT3JpZyA9IG47XG5cbiAgaWYgKHR5cGVvZiBuICE9PSAnbnVtYmVyJyB8fCBuID4gMCkgc3RhdGUuZW1pdHRlZFJlYWRhYmxlID0gZmFsc2U7XG5cbiAgLy8gaWYgd2UncmUgZG9pbmcgcmVhZCgwKSB0byB0cmlnZ2VyIGEgcmVhZGFibGUgZXZlbnQsIGJ1dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYSBidW5jaCBvZiBkYXRhIGluIHRoZSBidWZmZXIsIHRoZW4ganVzdCB0cmlnZ2VyXG4gIC8vIHRoZSAncmVhZGFibGUnIGV2ZW50IGFuZCBtb3ZlIG9uLlxuICBpZiAobiA9PT0gMCAmJiBzdGF0ZS5uZWVkUmVhZGFibGUgJiYgKHN0YXRlLmxlbmd0aCA+PSBzdGF0ZS5oaWdoV2F0ZXJNYXJrIHx8IHN0YXRlLmVuZGVkKSkge1xuICAgIGRlYnVnKCdyZWFkOiBlbWl0UmVhZGFibGUnLCBzdGF0ZS5sZW5ndGgsIHN0YXRlLmVuZGVkKTtcbiAgICBpZiAoc3RhdGUubGVuZ3RoID09PSAwICYmIHN0YXRlLmVuZGVkKSBlbmRSZWFkYWJsZSh0aGlzKTtlbHNlIGVtaXRSZWFkYWJsZSh0aGlzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIG4gPSBob3dNdWNoVG9SZWFkKG4sIHN0YXRlKTtcblxuICAvLyBpZiB3ZSd2ZSBlbmRlZCwgYW5kIHdlJ3JlIG5vdyBjbGVhciwgdGhlbiBmaW5pc2ggaXQgdXAuXG4gIGlmIChuID09PSAwICYmIHN0YXRlLmVuZGVkKSB7XG4gICAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMCkgZW5kUmVhZGFibGUodGhpcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBBbGwgdGhlIGFjdHVhbCBjaHVuayBnZW5lcmF0aW9uIGxvZ2ljIG5lZWRzIHRvIGJlXG4gIC8vICpiZWxvdyogdGhlIGNhbGwgdG8gX3JlYWQuICBUaGUgcmVhc29uIGlzIHRoYXQgaW4gY2VydGFpblxuICAvLyBzeW50aGV0aWMgc3RyZWFtIGNhc2VzLCBzdWNoIGFzIHBhc3N0aHJvdWdoIHN0cmVhbXMsIF9yZWFkXG4gIC8vIG1heSBiZSBhIGNvbXBsZXRlbHkgc3luY2hyb25vdXMgb3BlcmF0aW9uIHdoaWNoIG1heSBjaGFuZ2VcbiAgLy8gdGhlIHN0YXRlIG9mIHRoZSByZWFkIGJ1ZmZlciwgcHJvdmlkaW5nIGVub3VnaCBkYXRhIHdoZW5cbiAgLy8gYmVmb3JlIHRoZXJlIHdhcyAqbm90KiBlbm91Z2guXG4gIC8vXG4gIC8vIFNvLCB0aGUgc3RlcHMgYXJlOlxuICAvLyAxLiBGaWd1cmUgb3V0IHdoYXQgdGhlIHN0YXRlIG9mIHRoaW5ncyB3aWxsIGJlIGFmdGVyIHdlIGRvXG4gIC8vIGEgcmVhZCBmcm9tIHRoZSBidWZmZXIuXG4gIC8vXG4gIC8vIDIuIElmIHRoYXQgcmVzdWx0aW5nIHN0YXRlIHdpbGwgdHJpZ2dlciBhIF9yZWFkLCB0aGVuIGNhbGwgX3JlYWQuXG4gIC8vIE5vdGUgdGhhdCB0aGlzIG1heSBiZSBhc3luY2hyb25vdXMsIG9yIHN5bmNocm9ub3VzLiAgWWVzLCBpdCBpc1xuICAvLyBkZWVwbHkgdWdseSB0byB3cml0ZSBBUElzIHRoaXMgd2F5LCBidXQgdGhhdCBzdGlsbCBkb2Vzbid0IG1lYW5cbiAgLy8gdGhhdCB0aGUgUmVhZGFibGUgY2xhc3Mgc2hvdWxkIGJlaGF2ZSBpbXByb3Blcmx5LCBhcyBzdHJlYW1zIGFyZVxuICAvLyBkZXNpZ25lZCB0byBiZSBzeW5jL2FzeW5jIGFnbm9zdGljLlxuICAvLyBUYWtlIG5vdGUgaWYgdGhlIF9yZWFkIGNhbGwgaXMgc3luYyBvciBhc3luYyAoaWUsIGlmIHRoZSByZWFkIGNhbGxcbiAgLy8gaGFzIHJldHVybmVkIHlldCksIHNvIHRoYXQgd2Uga25vdyB3aGV0aGVyIG9yIG5vdCBpdCdzIHNhZmUgdG8gZW1pdFxuICAvLyAncmVhZGFibGUnIGV0Yy5cbiAgLy9cbiAgLy8gMy4gQWN0dWFsbHkgcHVsbCB0aGUgcmVxdWVzdGVkIGNodW5rcyBvdXQgb2YgdGhlIGJ1ZmZlciBhbmQgcmV0dXJuLlxuXG4gIC8vIGlmIHdlIG5lZWQgYSByZWFkYWJsZSBldmVudCwgdGhlbiB3ZSBuZWVkIHRvIGRvIHNvbWUgcmVhZGluZy5cbiAgdmFyIGRvUmVhZCA9IHN0YXRlLm5lZWRSZWFkYWJsZTtcbiAgZGVidWcoJ25lZWQgcmVhZGFibGUnLCBkb1JlYWQpO1xuXG4gIC8vIGlmIHdlIGN1cnJlbnRseSBoYXZlIGxlc3MgdGhhbiB0aGUgaGlnaFdhdGVyTWFyaywgdGhlbiBhbHNvIHJlYWQgc29tZVxuICBpZiAoc3RhdGUubGVuZ3RoID09PSAwIHx8IHN0YXRlLmxlbmd0aCAtIG4gPCBzdGF0ZS5oaWdoV2F0ZXJNYXJrKSB7XG4gICAgZG9SZWFkID0gdHJ1ZTtcbiAgICBkZWJ1ZygnbGVuZ3RoIGxlc3MgdGhhbiB3YXRlcm1hcmsnLCBkb1JlYWQpO1xuICB9XG5cbiAgLy8gaG93ZXZlciwgaWYgd2UndmUgZW5kZWQsIHRoZW4gdGhlcmUncyBubyBwb2ludCwgYW5kIGlmIHdlJ3JlIGFscmVhZHlcbiAgLy8gcmVhZGluZywgdGhlbiBpdCdzIHVubmVjZXNzYXJ5LlxuICBpZiAoc3RhdGUuZW5kZWQgfHwgc3RhdGUucmVhZGluZykge1xuICAgIGRvUmVhZCA9IGZhbHNlO1xuICAgIGRlYnVnKCdyZWFkaW5nIG9yIGVuZGVkJywgZG9SZWFkKTtcbiAgfVxuXG4gIGlmIChkb1JlYWQpIHtcbiAgICBkZWJ1ZygnZG8gcmVhZCcpO1xuICAgIHN0YXRlLnJlYWRpbmcgPSB0cnVlO1xuICAgIHN0YXRlLnN5bmMgPSB0cnVlO1xuICAgIC8vIGlmIHRoZSBsZW5ndGggaXMgY3VycmVudGx5IHplcm8sIHRoZW4gd2UgKm5lZWQqIGEgcmVhZGFibGUgZXZlbnQuXG4gICAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMCkgc3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcbiAgICAvLyBjYWxsIGludGVybmFsIHJlYWQgbWV0aG9kXG4gICAgdGhpcy5fcmVhZChzdGF0ZS5oaWdoV2F0ZXJNYXJrKTtcbiAgICBzdGF0ZS5zeW5jID0gZmFsc2U7XG4gIH1cblxuICAvLyBJZiBfcmVhZCBwdXNoZWQgZGF0YSBzeW5jaHJvbm91c2x5LCB0aGVuIGByZWFkaW5nYCB3aWxsIGJlIGZhbHNlLFxuICAvLyBhbmQgd2UgbmVlZCB0byByZS1ldmFsdWF0ZSBob3cgbXVjaCBkYXRhIHdlIGNhbiByZXR1cm4gdG8gdGhlIHVzZXIuXG4gIGlmIChkb1JlYWQgJiYgIXN0YXRlLnJlYWRpbmcpIG4gPSBob3dNdWNoVG9SZWFkKG5PcmlnLCBzdGF0ZSk7XG5cbiAgdmFyIHJldDtcbiAgaWYgKG4gPiAwKSByZXQgPSBmcm9tTGlzdChuLCBzdGF0ZSk7ZWxzZSByZXQgPSBudWxsO1xuXG4gIGlmIChyZXQgPT09IG51bGwpIHtcbiAgICBzdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuICAgIG4gPSAwO1xuICB9XG5cbiAgc3RhdGUubGVuZ3RoIC09IG47XG5cbiAgLy8gSWYgd2UgaGF2ZSBub3RoaW5nIGluIHRoZSBidWZmZXIsIHRoZW4gd2Ugd2FudCB0byBrbm93XG4gIC8vIGFzIHNvb24gYXMgd2UgKmRvKiBnZXQgc29tZXRoaW5nIGludG8gdGhlIGJ1ZmZlci5cbiAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMCAmJiAhc3RhdGUuZW5kZWQpIHN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG5cbiAgLy8gSWYgd2UgdHJpZWQgdG8gcmVhZCgpIHBhc3QgdGhlIEVPRiwgdGhlbiBlbWl0IGVuZCBvbiB0aGUgbmV4dCB0aWNrLlxuICBpZiAobk9yaWcgIT09IG4gJiYgc3RhdGUuZW5kZWQgJiYgc3RhdGUubGVuZ3RoID09PSAwKSBlbmRSZWFkYWJsZSh0aGlzKTtcblxuICBpZiAocmV0ICE9PSBudWxsKSB0aGlzLmVtaXQoJ2RhdGEnLCByZXQpO1xuXG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBjaHVua0ludmFsaWQoc3RhdGUsIGNodW5rKSB7XG4gIHZhciBlciA9IG51bGw7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGNodW5rKSAmJiB0eXBlb2YgY2h1bmsgIT09ICdzdHJpbmcnICYmIGNodW5rICE9PSBudWxsICYmIGNodW5rICE9PSB1bmRlZmluZWQgJiYgIXN0YXRlLm9iamVjdE1vZGUpIHtcbiAgICBlciA9IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgbm9uLXN0cmluZy9idWZmZXIgY2h1bmsnKTtcbiAgfVxuICByZXR1cm4gZXI7XG59XG5cbmZ1bmN0aW9uIG9uRW9mQ2h1bmsoc3RyZWFtLCBzdGF0ZSkge1xuICBpZiAoc3RhdGUuZW5kZWQpIHJldHVybjtcbiAgaWYgKHN0YXRlLmRlY29kZXIpIHtcbiAgICB2YXIgY2h1bmsgPSBzdGF0ZS5kZWNvZGVyLmVuZCgpO1xuICAgIGlmIChjaHVuayAmJiBjaHVuay5sZW5ndGgpIHtcbiAgICAgIHN0YXRlLmJ1ZmZlci5wdXNoKGNodW5rKTtcbiAgICAgIHN0YXRlLmxlbmd0aCArPSBzdGF0ZS5vYmplY3RNb2RlID8gMSA6IGNodW5rLmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgc3RhdGUuZW5kZWQgPSB0cnVlO1xuXG4gIC8vIGVtaXQgJ3JlYWRhYmxlJyBub3cgdG8gbWFrZSBzdXJlIGl0IGdldHMgcGlja2VkIHVwLlxuICBlbWl0UmVhZGFibGUoc3RyZWFtKTtcbn1cblxuLy8gRG9uJ3QgZW1pdCByZWFkYWJsZSByaWdodCBhd2F5IGluIHN5bmMgbW9kZSwgYmVjYXVzZSB0aGlzIGNhbiB0cmlnZ2VyXG4vLyBhbm90aGVyIHJlYWQoKSBjYWxsID0+IHN0YWNrIG92ZXJmbG93LiAgVGhpcyB3YXksIGl0IG1pZ2h0IHRyaWdnZXJcbi8vIGEgbmV4dFRpY2sgcmVjdXJzaW9uIHdhcm5pbmcsIGJ1dCB0aGF0J3Mgbm90IHNvIGJhZC5cbmZ1bmN0aW9uIGVtaXRSZWFkYWJsZShzdHJlYW0pIHtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuICBzdGF0ZS5uZWVkUmVhZGFibGUgPSBmYWxzZTtcbiAgaWYgKCFzdGF0ZS5lbWl0dGVkUmVhZGFibGUpIHtcbiAgICBkZWJ1ZygnZW1pdFJlYWRhYmxlJywgc3RhdGUuZmxvd2luZyk7XG4gICAgc3RhdGUuZW1pdHRlZFJlYWRhYmxlID0gdHJ1ZTtcbiAgICBpZiAoc3RhdGUuc3luYykgcHJvY2Vzc05leHRUaWNrKGVtaXRSZWFkYWJsZV8sIHN0cmVhbSk7ZWxzZSBlbWl0UmVhZGFibGVfKHN0cmVhbSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZW1pdFJlYWRhYmxlXyhzdHJlYW0pIHtcbiAgZGVidWcoJ2VtaXQgcmVhZGFibGUnKTtcbiAgc3RyZWFtLmVtaXQoJ3JlYWRhYmxlJyk7XG4gIGZsb3coc3RyZWFtKTtcbn1cblxuLy8gYXQgdGhpcyBwb2ludCwgdGhlIHVzZXIgaGFzIHByZXN1bWFibHkgc2VlbiB0aGUgJ3JlYWRhYmxlJyBldmVudCxcbi8vIGFuZCBjYWxsZWQgcmVhZCgpIHRvIGNvbnN1bWUgc29tZSBkYXRhLiAgdGhhdCBtYXkgaGF2ZSB0cmlnZ2VyZWRcbi8vIGluIHR1cm4gYW5vdGhlciBfcmVhZChuKSBjYWxsLCBpbiB3aGljaCBjYXNlIHJlYWRpbmcgPSB0cnVlIGlmXG4vLyBpdCdzIGluIHByb2dyZXNzLlxuLy8gSG93ZXZlciwgaWYgd2UncmUgbm90IGVuZGVkLCBvciByZWFkaW5nLCBhbmQgdGhlIGxlbmd0aCA8IGh3bSxcbi8vIHRoZW4gZ28gYWhlYWQgYW5kIHRyeSB0byByZWFkIHNvbWUgbW9yZSBwcmVlbXB0aXZlbHkuXG5mdW5jdGlvbiBtYXliZVJlYWRNb3JlKHN0cmVhbSwgc3RhdGUpIHtcbiAgaWYgKCFzdGF0ZS5yZWFkaW5nTW9yZSkge1xuICAgIHN0YXRlLnJlYWRpbmdNb3JlID0gdHJ1ZTtcbiAgICBwcm9jZXNzTmV4dFRpY2sobWF5YmVSZWFkTW9yZV8sIHN0cmVhbSwgc3RhdGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1heWJlUmVhZE1vcmVfKHN0cmVhbSwgc3RhdGUpIHtcbiAgdmFyIGxlbiA9IHN0YXRlLmxlbmd0aDtcbiAgd2hpbGUgKCFzdGF0ZS5yZWFkaW5nICYmICFzdGF0ZS5mbG93aW5nICYmICFzdGF0ZS5lbmRlZCAmJiBzdGF0ZS5sZW5ndGggPCBzdGF0ZS5oaWdoV2F0ZXJNYXJrKSB7XG4gICAgZGVidWcoJ21heWJlUmVhZE1vcmUgcmVhZCAwJyk7XG4gICAgc3RyZWFtLnJlYWQoMCk7XG4gICAgaWYgKGxlbiA9PT0gc3RhdGUubGVuZ3RoKVxuICAgICAgLy8gZGlkbid0IGdldCBhbnkgZGF0YSwgc3RvcCBzcGlubmluZy5cbiAgICAgIGJyZWFrO2Vsc2UgbGVuID0gc3RhdGUubGVuZ3RoO1xuICB9XG4gIHN0YXRlLnJlYWRpbmdNb3JlID0gZmFsc2U7XG59XG5cbi8vIGFic3RyYWN0IG1ldGhvZC4gIHRvIGJlIG92ZXJyaWRkZW4gaW4gc3BlY2lmaWMgaW1wbGVtZW50YXRpb24gY2xhc3Nlcy5cbi8vIGNhbGwgY2IoZXIsIGRhdGEpIHdoZXJlIGRhdGEgaXMgPD0gbiBpbiBsZW5ndGguXG4vLyBmb3IgdmlydHVhbCAobm9uLXN0cmluZywgbm9uLWJ1ZmZlcikgc3RyZWFtcywgXCJsZW5ndGhcIiBpcyBzb21ld2hhdFxuLy8gYXJiaXRyYXJ5LCBhbmQgcGVyaGFwcyBub3QgdmVyeSBtZWFuaW5nZnVsLlxuUmVhZGFibGUucHJvdG90eXBlLl9yZWFkID0gZnVuY3Rpb24gKG4pIHtcbiAgdGhpcy5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJykpO1xufTtcblxuUmVhZGFibGUucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbiAoZGVzdCwgcGlwZU9wdHMpIHtcbiAgdmFyIHNyYyA9IHRoaXM7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG5cbiAgc3dpdGNoIChzdGF0ZS5waXBlc0NvdW50KSB7XG4gICAgY2FzZSAwOlxuICAgICAgc3RhdGUucGlwZXMgPSBkZXN0O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAxOlxuICAgICAgc3RhdGUucGlwZXMgPSBbc3RhdGUucGlwZXMsIGRlc3RdO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHN0YXRlLnBpcGVzLnB1c2goZGVzdCk7XG4gICAgICBicmVhaztcbiAgfVxuICBzdGF0ZS5waXBlc0NvdW50ICs9IDE7XG4gIGRlYnVnKCdwaXBlIGNvdW50PSVkIG9wdHM9JWonLCBzdGF0ZS5waXBlc0NvdW50LCBwaXBlT3B0cyk7XG5cbiAgdmFyIGRvRW5kID0gKCFwaXBlT3B0cyB8fCBwaXBlT3B0cy5lbmQgIT09IGZhbHNlKSAmJiBkZXN0ICE9PSBwcm9jZXNzLnN0ZG91dCAmJiBkZXN0ICE9PSBwcm9jZXNzLnN0ZGVycjtcblxuICB2YXIgZW5kRm4gPSBkb0VuZCA/IG9uZW5kIDogY2xlYW51cDtcbiAgaWYgKHN0YXRlLmVuZEVtaXR0ZWQpIHByb2Nlc3NOZXh0VGljayhlbmRGbik7ZWxzZSBzcmMub25jZSgnZW5kJywgZW5kRm4pO1xuXG4gIGRlc3Qub24oJ3VucGlwZScsIG9udW5waXBlKTtcbiAgZnVuY3Rpb24gb251bnBpcGUocmVhZGFibGUpIHtcbiAgICBkZWJ1Zygnb251bnBpcGUnKTtcbiAgICBpZiAocmVhZGFibGUgPT09IHNyYykge1xuICAgICAgY2xlYW51cCgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uZW5kKCkge1xuICAgIGRlYnVnKCdvbmVuZCcpO1xuICAgIGRlc3QuZW5kKCk7XG4gIH1cblxuICAvLyB3aGVuIHRoZSBkZXN0IGRyYWlucywgaXQgcmVkdWNlcyB0aGUgYXdhaXREcmFpbiBjb3VudGVyXG4gIC8vIG9uIHRoZSBzb3VyY2UuICBUaGlzIHdvdWxkIGJlIG1vcmUgZWxlZ2FudCB3aXRoIGEgLm9uY2UoKVxuICAvLyBoYW5kbGVyIGluIGZsb3coKSwgYnV0IGFkZGluZyBhbmQgcmVtb3ZpbmcgcmVwZWF0ZWRseSBpc1xuICAvLyB0b28gc2xvdy5cbiAgdmFyIG9uZHJhaW4gPSBwaXBlT25EcmFpbihzcmMpO1xuICBkZXN0Lm9uKCdkcmFpbicsIG9uZHJhaW4pO1xuXG4gIHZhciBjbGVhbmVkVXAgPSBmYWxzZTtcbiAgZnVuY3Rpb24gY2xlYW51cCgpIHtcbiAgICBkZWJ1ZygnY2xlYW51cCcpO1xuICAgIC8vIGNsZWFudXAgZXZlbnQgaGFuZGxlcnMgb25jZSB0aGUgcGlwZSBpcyBicm9rZW5cbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9uY2xvc2UpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2ZpbmlzaCcsIG9uZmluaXNoKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdkcmFpbicsIG9uZHJhaW4pO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25lcnJvcik7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcigndW5waXBlJywgb251bnBpcGUpO1xuICAgIHNyYy5yZW1vdmVMaXN0ZW5lcignZW5kJywgb25lbmQpO1xuICAgIHNyYy5yZW1vdmVMaXN0ZW5lcignZW5kJywgY2xlYW51cCk7XG4gICAgc3JjLnJlbW92ZUxpc3RlbmVyKCdkYXRhJywgb25kYXRhKTtcblxuICAgIGNsZWFuZWRVcCA9IHRydWU7XG5cbiAgICAvLyBpZiB0aGUgcmVhZGVyIGlzIHdhaXRpbmcgZm9yIGEgZHJhaW4gZXZlbnQgZnJvbSB0aGlzXG4gICAgLy8gc3BlY2lmaWMgd3JpdGVyLCB0aGVuIGl0IHdvdWxkIGNhdXNlIGl0IHRvIG5ldmVyIHN0YXJ0XG4gICAgLy8gZmxvd2luZyBhZ2Fpbi5cbiAgICAvLyBTbywgaWYgdGhpcyBpcyBhd2FpdGluZyBhIGRyYWluLCB0aGVuIHdlIGp1c3QgY2FsbCBpdCBub3cuXG4gICAgLy8gSWYgd2UgZG9uJ3Qga25vdywgdGhlbiBhc3N1bWUgdGhhdCB3ZSBhcmUgd2FpdGluZyBmb3Igb25lLlxuICAgIGlmIChzdGF0ZS5hd2FpdERyYWluICYmICghZGVzdC5fd3JpdGFibGVTdGF0ZSB8fCBkZXN0Ll93cml0YWJsZVN0YXRlLm5lZWREcmFpbikpIG9uZHJhaW4oKTtcbiAgfVxuXG4gIHNyYy5vbignZGF0YScsIG9uZGF0YSk7XG4gIGZ1bmN0aW9uIG9uZGF0YShjaHVuaykge1xuICAgIGRlYnVnKCdvbmRhdGEnKTtcbiAgICB2YXIgcmV0ID0gZGVzdC53cml0ZShjaHVuayk7XG4gICAgaWYgKGZhbHNlID09PSByZXQpIHtcbiAgICAgIC8vIElmIHRoZSB1c2VyIHVucGlwZWQgZHVyaW5nIGBkZXN0LndyaXRlKClgLCBpdCBpcyBwb3NzaWJsZVxuICAgICAgLy8gdG8gZ2V0IHN0dWNrIGluIGEgcGVybWFuZW50bHkgcGF1c2VkIHN0YXRlIGlmIHRoYXQgd3JpdGVcbiAgICAgIC8vIGFsc28gcmV0dXJuZWQgZmFsc2UuXG4gICAgICBpZiAoc3RhdGUucGlwZXNDb3VudCA9PT0gMSAmJiBzdGF0ZS5waXBlc1swXSA9PT0gZGVzdCAmJiBzcmMubGlzdGVuZXJDb3VudCgnZGF0YScpID09PSAxICYmICFjbGVhbmVkVXApIHtcbiAgICAgICAgZGVidWcoJ2ZhbHNlIHdyaXRlIHJlc3BvbnNlLCBwYXVzZScsIHNyYy5fcmVhZGFibGVTdGF0ZS5hd2FpdERyYWluKTtcbiAgICAgICAgc3JjLl9yZWFkYWJsZVN0YXRlLmF3YWl0RHJhaW4rKztcbiAgICAgIH1cbiAgICAgIHNyYy5wYXVzZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBkZXN0IGhhcyBhbiBlcnJvciwgdGhlbiBzdG9wIHBpcGluZyBpbnRvIGl0LlxuICAvLyBob3dldmVyLCBkb24ndCBzdXBwcmVzcyB0aGUgdGhyb3dpbmcgYmVoYXZpb3IgZm9yIHRoaXMuXG4gIGZ1bmN0aW9uIG9uZXJyb3IoZXIpIHtcbiAgICBkZWJ1Zygnb25lcnJvcicsIGVyKTtcbiAgICB1bnBpcGUoKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uZXJyb3IpO1xuICAgIGlmIChFRWxpc3RlbmVyQ291bnQoZGVzdCwgJ2Vycm9yJykgPT09IDApIGRlc3QuZW1pdCgnZXJyb3InLCBlcik7XG4gIH1cbiAgLy8gVGhpcyBpcyBhIGJydXRhbGx5IHVnbHkgaGFjayB0byBtYWtlIHN1cmUgdGhhdCBvdXIgZXJyb3IgaGFuZGxlclxuICAvLyBpcyBhdHRhY2hlZCBiZWZvcmUgYW55IHVzZXJsYW5kIG9uZXMuICBORVZFUiBETyBUSElTLlxuICBpZiAoIWRlc3QuX2V2ZW50cyB8fCAhZGVzdC5fZXZlbnRzLmVycm9yKSBkZXN0Lm9uKCdlcnJvcicsIG9uZXJyb3IpO2Vsc2UgaWYgKGlzQXJyYXkoZGVzdC5fZXZlbnRzLmVycm9yKSkgZGVzdC5fZXZlbnRzLmVycm9yLnVuc2hpZnQob25lcnJvcik7ZWxzZSBkZXN0Ll9ldmVudHMuZXJyb3IgPSBbb25lcnJvciwgZGVzdC5fZXZlbnRzLmVycm9yXTtcblxuICAvLyBCb3RoIGNsb3NlIGFuZCBmaW5pc2ggc2hvdWxkIHRyaWdnZXIgdW5waXBlLCBidXQgb25seSBvbmNlLlxuICBmdW5jdGlvbiBvbmNsb3NlKCkge1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2ZpbmlzaCcsIG9uZmluaXNoKTtcbiAgICB1bnBpcGUoKTtcbiAgfVxuICBkZXN0Lm9uY2UoJ2Nsb3NlJywgb25jbG9zZSk7XG4gIGZ1bmN0aW9uIG9uZmluaXNoKCkge1xuICAgIGRlYnVnKCdvbmZpbmlzaCcpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgb25jbG9zZSk7XG4gICAgdW5waXBlKCk7XG4gIH1cbiAgZGVzdC5vbmNlKCdmaW5pc2gnLCBvbmZpbmlzaCk7XG5cbiAgZnVuY3Rpb24gdW5waXBlKCkge1xuICAgIGRlYnVnKCd1bnBpcGUnKTtcbiAgICBzcmMudW5waXBlKGRlc3QpO1xuICB9XG5cbiAgLy8gdGVsbCB0aGUgZGVzdCB0aGF0IGl0J3MgYmVpbmcgcGlwZWQgdG9cbiAgZGVzdC5lbWl0KCdwaXBlJywgc3JjKTtcblxuICAvLyBzdGFydCB0aGUgZmxvdyBpZiBpdCBoYXNuJ3QgYmVlbiBzdGFydGVkIGFscmVhZHkuXG4gIGlmICghc3RhdGUuZmxvd2luZykge1xuICAgIGRlYnVnKCdwaXBlIHJlc3VtZScpO1xuICAgIHNyYy5yZXN1bWUoKTtcbiAgfVxuXG4gIHJldHVybiBkZXN0O1xufTtcblxuZnVuY3Rpb24gcGlwZU9uRHJhaW4oc3JjKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN0YXRlID0gc3JjLl9yZWFkYWJsZVN0YXRlO1xuICAgIGRlYnVnKCdwaXBlT25EcmFpbicsIHN0YXRlLmF3YWl0RHJhaW4pO1xuICAgIGlmIChzdGF0ZS5hd2FpdERyYWluKSBzdGF0ZS5hd2FpdERyYWluLS07XG4gICAgaWYgKHN0YXRlLmF3YWl0RHJhaW4gPT09IDAgJiYgRUVsaXN0ZW5lckNvdW50KHNyYywgJ2RhdGEnKSkge1xuICAgICAgc3RhdGUuZmxvd2luZyA9IHRydWU7XG4gICAgICBmbG93KHNyYyk7XG4gICAgfVxuICB9O1xufVxuXG5SZWFkYWJsZS5wcm90b3R5cGUudW5waXBlID0gZnVuY3Rpb24gKGRlc3QpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcblxuICAvLyBpZiB3ZSdyZSBub3QgcGlwaW5nIGFueXdoZXJlLCB0aGVuIGRvIG5vdGhpbmcuXG4gIGlmIChzdGF0ZS5waXBlc0NvdW50ID09PSAwKSByZXR1cm4gdGhpcztcblxuICAvLyBqdXN0IG9uZSBkZXN0aW5hdGlvbi4gIG1vc3QgY29tbW9uIGNhc2UuXG4gIGlmIChzdGF0ZS5waXBlc0NvdW50ID09PSAxKSB7XG4gICAgLy8gcGFzc2VkIGluIG9uZSwgYnV0IGl0J3Mgbm90IHRoZSByaWdodCBvbmUuXG4gICAgaWYgKGRlc3QgJiYgZGVzdCAhPT0gc3RhdGUucGlwZXMpIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKCFkZXN0KSBkZXN0ID0gc3RhdGUucGlwZXM7XG5cbiAgICAvLyBnb3QgYSBtYXRjaC5cbiAgICBzdGF0ZS5waXBlcyA9IG51bGw7XG4gICAgc3RhdGUucGlwZXNDb3VudCA9IDA7XG4gICAgc3RhdGUuZmxvd2luZyA9IGZhbHNlO1xuICAgIGlmIChkZXN0KSBkZXN0LmVtaXQoJ3VucGlwZScsIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc2xvdyBjYXNlLiBtdWx0aXBsZSBwaXBlIGRlc3RpbmF0aW9ucy5cblxuICBpZiAoIWRlc3QpIHtcbiAgICAvLyByZW1vdmUgYWxsLlxuICAgIHZhciBkZXN0cyA9IHN0YXRlLnBpcGVzO1xuICAgIHZhciBsZW4gPSBzdGF0ZS5waXBlc0NvdW50O1xuICAgIHN0YXRlLnBpcGVzID0gbnVsbDtcbiAgICBzdGF0ZS5waXBlc0NvdW50ID0gMDtcbiAgICBzdGF0ZS5mbG93aW5nID0gZmFsc2U7XG5cbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGVuOyBfaSsrKSB7XG4gICAgICBkZXN0c1tfaV0uZW1pdCgndW5waXBlJywgdGhpcyk7XG4gICAgfXJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gdHJ5IHRvIGZpbmQgdGhlIHJpZ2h0IG9uZS5cbiAgdmFyIGkgPSBpbmRleE9mKHN0YXRlLnBpcGVzLCBkZXN0KTtcbiAgaWYgKGkgPT09IC0xKSByZXR1cm4gdGhpcztcblxuICBzdGF0ZS5waXBlcy5zcGxpY2UoaSwgMSk7XG4gIHN0YXRlLnBpcGVzQ291bnQgLT0gMTtcbiAgaWYgKHN0YXRlLnBpcGVzQ291bnQgPT09IDEpIHN0YXRlLnBpcGVzID0gc3RhdGUucGlwZXNbMF07XG5cbiAgZGVzdC5lbWl0KCd1bnBpcGUnLCB0aGlzKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIHNldCB1cCBkYXRhIGV2ZW50cyBpZiB0aGV5IGFyZSBhc2tlZCBmb3Jcbi8vIEVuc3VyZSByZWFkYWJsZSBsaXN0ZW5lcnMgZXZlbnR1YWxseSBnZXQgc29tZXRoaW5nXG5SZWFkYWJsZS5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoZXYsIGZuKSB7XG4gIHZhciByZXMgPSBTdHJlYW0ucHJvdG90eXBlLm9uLmNhbGwodGhpcywgZXYsIGZuKTtcblxuICAvLyBJZiBsaXN0ZW5pbmcgdG8gZGF0YSwgYW5kIGl0IGhhcyBub3QgZXhwbGljaXRseSBiZWVuIHBhdXNlZCxcbiAgLy8gdGhlbiBjYWxsIHJlc3VtZSB0byBzdGFydCB0aGUgZmxvdyBvZiBkYXRhIG9uIHRoZSBuZXh0IHRpY2suXG4gIGlmIChldiA9PT0gJ2RhdGEnICYmIGZhbHNlICE9PSB0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmcpIHtcbiAgICB0aGlzLnJlc3VtZSgpO1xuICB9XG5cbiAgaWYgKGV2ID09PSAncmVhZGFibGUnICYmICF0aGlzLl9yZWFkYWJsZVN0YXRlLmVuZEVtaXR0ZWQpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICAgIGlmICghc3RhdGUucmVhZGFibGVMaXN0ZW5pbmcpIHtcbiAgICAgIHN0YXRlLnJlYWRhYmxlTGlzdGVuaW5nID0gdHJ1ZTtcbiAgICAgIHN0YXRlLmVtaXR0ZWRSZWFkYWJsZSA9IGZhbHNlO1xuICAgICAgc3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcbiAgICAgIGlmICghc3RhdGUucmVhZGluZykge1xuICAgICAgICBwcm9jZXNzTmV4dFRpY2soblJlYWRpbmdOZXh0VGljaywgdGhpcyk7XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmxlbmd0aCkge1xuICAgICAgICBlbWl0UmVhZGFibGUodGhpcywgc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXM7XG59O1xuUmVhZGFibGUucHJvdG90eXBlLmFkZExpc3RlbmVyID0gUmVhZGFibGUucHJvdG90eXBlLm9uO1xuXG5mdW5jdGlvbiBuUmVhZGluZ05leHRUaWNrKHNlbGYpIHtcbiAgZGVidWcoJ3JlYWRhYmxlIG5leHR0aWNrIHJlYWQgMCcpO1xuICBzZWxmLnJlYWQoMCk7XG59XG5cbi8vIHBhdXNlKCkgYW5kIHJlc3VtZSgpIGFyZSByZW1uYW50cyBvZiB0aGUgbGVnYWN5IHJlYWRhYmxlIHN0cmVhbSBBUElcbi8vIElmIHRoZSB1c2VyIHVzZXMgdGhlbSwgdGhlbiBzd2l0Y2ggaW50byBvbGQgbW9kZS5cblJlYWRhYmxlLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG4gIGlmICghc3RhdGUuZmxvd2luZykge1xuICAgIGRlYnVnKCdyZXN1bWUnKTtcbiAgICBzdGF0ZS5mbG93aW5nID0gdHJ1ZTtcbiAgICByZXN1bWUodGhpcywgc3RhdGUpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuZnVuY3Rpb24gcmVzdW1lKHN0cmVhbSwgc3RhdGUpIHtcbiAgaWYgKCFzdGF0ZS5yZXN1bWVTY2hlZHVsZWQpIHtcbiAgICBzdGF0ZS5yZXN1bWVTY2hlZHVsZWQgPSB0cnVlO1xuICAgIHByb2Nlc3NOZXh0VGljayhyZXN1bWVfLCBzdHJlYW0sIHN0YXRlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZXN1bWVfKHN0cmVhbSwgc3RhdGUpIHtcbiAgaWYgKCFzdGF0ZS5yZWFkaW5nKSB7XG4gICAgZGVidWcoJ3Jlc3VtZSByZWFkIDAnKTtcbiAgICBzdHJlYW0ucmVhZCgwKTtcbiAgfVxuXG4gIHN0YXRlLnJlc3VtZVNjaGVkdWxlZCA9IGZhbHNlO1xuICBzdHJlYW0uZW1pdCgncmVzdW1lJyk7XG4gIGZsb3coc3RyZWFtKTtcbiAgaWYgKHN0YXRlLmZsb3dpbmcgJiYgIXN0YXRlLnJlYWRpbmcpIHN0cmVhbS5yZWFkKDApO1xufVxuXG5SZWFkYWJsZS5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gIGRlYnVnKCdjYWxsIHBhdXNlIGZsb3dpbmc9JWonLCB0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmcpO1xuICBpZiAoZmFsc2UgIT09IHRoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZykge1xuICAgIGRlYnVnKCdwYXVzZScpO1xuICAgIHRoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZyA9IGZhbHNlO1xuICAgIHRoaXMuZW1pdCgncGF1c2UnKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbmZ1bmN0aW9uIGZsb3coc3RyZWFtKSB7XG4gIHZhciBzdGF0ZSA9IHN0cmVhbS5fcmVhZGFibGVTdGF0ZTtcbiAgZGVidWcoJ2Zsb3cnLCBzdGF0ZS5mbG93aW5nKTtcbiAgaWYgKHN0YXRlLmZsb3dpbmcpIHtcbiAgICBkbyB7XG4gICAgICB2YXIgY2h1bmsgPSBzdHJlYW0ucmVhZCgpO1xuICAgIH0gd2hpbGUgKG51bGwgIT09IGNodW5rICYmIHN0YXRlLmZsb3dpbmcpO1xuICB9XG59XG5cbi8vIHdyYXAgYW4gb2xkLXN0eWxlIHN0cmVhbSBhcyB0aGUgYXN5bmMgZGF0YSBzb3VyY2UuXG4vLyBUaGlzIGlzICpub3QqIHBhcnQgb2YgdGhlIHJlYWRhYmxlIHN0cmVhbSBpbnRlcmZhY2UuXG4vLyBJdCBpcyBhbiB1Z2x5IHVuZm9ydHVuYXRlIG1lc3Mgb2YgaGlzdG9yeS5cblJlYWRhYmxlLnByb3RvdHlwZS53cmFwID0gZnVuY3Rpb24gKHN0cmVhbSkge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICB2YXIgcGF1c2VkID0gZmFsc2U7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzdHJlYW0ub24oJ2VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBkZWJ1Zygnd3JhcHBlZCBlbmQnKTtcbiAgICBpZiAoc3RhdGUuZGVjb2RlciAmJiAhc3RhdGUuZW5kZWQpIHtcbiAgICAgIHZhciBjaHVuayA9IHN0YXRlLmRlY29kZXIuZW5kKCk7XG4gICAgICBpZiAoY2h1bmsgJiYgY2h1bmsubGVuZ3RoKSBzZWxmLnB1c2goY2h1bmspO1xuICAgIH1cblxuICAgIHNlbGYucHVzaChudWxsKTtcbiAgfSk7XG5cbiAgc3RyZWFtLm9uKCdkYXRhJywgZnVuY3Rpb24gKGNodW5rKSB7XG4gICAgZGVidWcoJ3dyYXBwZWQgZGF0YScpO1xuICAgIGlmIChzdGF0ZS5kZWNvZGVyKSBjaHVuayA9IHN0YXRlLmRlY29kZXIud3JpdGUoY2h1bmspO1xuXG4gICAgLy8gZG9uJ3Qgc2tpcCBvdmVyIGZhbHN5IHZhbHVlcyBpbiBvYmplY3RNb2RlXG4gICAgaWYgKHN0YXRlLm9iamVjdE1vZGUgJiYgKGNodW5rID09PSBudWxsIHx8IGNodW5rID09PSB1bmRlZmluZWQpKSByZXR1cm47ZWxzZSBpZiAoIXN0YXRlLm9iamVjdE1vZGUgJiYgKCFjaHVuayB8fCAhY2h1bmsubGVuZ3RoKSkgcmV0dXJuO1xuXG4gICAgdmFyIHJldCA9IHNlbGYucHVzaChjaHVuayk7XG4gICAgaWYgKCFyZXQpIHtcbiAgICAgIHBhdXNlZCA9IHRydWU7XG4gICAgICBzdHJlYW0ucGF1c2UoKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIHByb3h5IGFsbCB0aGUgb3RoZXIgbWV0aG9kcy5cbiAgLy8gaW1wb3J0YW50IHdoZW4gd3JhcHBpbmcgZmlsdGVycyBhbmQgZHVwbGV4ZXMuXG4gIGZvciAodmFyIGkgaW4gc3RyZWFtKSB7XG4gICAgaWYgKHRoaXNbaV0gPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygc3RyZWFtW2ldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzW2ldID0gZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBzdHJlYW1bbWV0aG9kXS5hcHBseShzdHJlYW0sIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICB9KGkpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHByb3h5IGNlcnRhaW4gaW1wb3J0YW50IGV2ZW50cy5cbiAgdmFyIGV2ZW50cyA9IFsnZXJyb3InLCAnY2xvc2UnLCAnZGVzdHJveScsICdwYXVzZScsICdyZXN1bWUnXTtcbiAgZm9yRWFjaChldmVudHMsIGZ1bmN0aW9uIChldikge1xuICAgIHN0cmVhbS5vbihldiwgc2VsZi5lbWl0LmJpbmQoc2VsZiwgZXYpKTtcbiAgfSk7XG5cbiAgLy8gd2hlbiB3ZSB0cnkgdG8gY29uc3VtZSBzb21lIG1vcmUgYnl0ZXMsIHNpbXBseSB1bnBhdXNlIHRoZVxuICAvLyB1bmRlcmx5aW5nIHN0cmVhbS5cbiAgc2VsZi5fcmVhZCA9IGZ1bmN0aW9uIChuKSB7XG4gICAgZGVidWcoJ3dyYXBwZWQgX3JlYWQnLCBuKTtcbiAgICBpZiAocGF1c2VkKSB7XG4gICAgICBwYXVzZWQgPSBmYWxzZTtcbiAgICAgIHN0cmVhbS5yZXN1bWUoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHNlbGY7XG59O1xuXG4vLyBleHBvc2VkIGZvciB0ZXN0aW5nIHB1cnBvc2VzIG9ubHkuXG5SZWFkYWJsZS5fZnJvbUxpc3QgPSBmcm9tTGlzdDtcblxuLy8gUGx1Y2sgb2ZmIG4gYnl0ZXMgZnJvbSBhbiBhcnJheSBvZiBidWZmZXJzLlxuLy8gTGVuZ3RoIGlzIHRoZSBjb21iaW5lZCBsZW5ndGhzIG9mIGFsbCB0aGUgYnVmZmVycyBpbiB0aGUgbGlzdC5cbmZ1bmN0aW9uIGZyb21MaXN0KG4sIHN0YXRlKSB7XG4gIHZhciBsaXN0ID0gc3RhdGUuYnVmZmVyO1xuICB2YXIgbGVuZ3RoID0gc3RhdGUubGVuZ3RoO1xuICB2YXIgc3RyaW5nTW9kZSA9ICEhc3RhdGUuZGVjb2RlcjtcbiAgdmFyIG9iamVjdE1vZGUgPSAhIXN0YXRlLm9iamVjdE1vZGU7XG4gIHZhciByZXQ7XG5cbiAgLy8gbm90aGluZyBpbiB0aGUgbGlzdCwgZGVmaW5pdGVseSBlbXB0eS5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblxuICBpZiAobGVuZ3RoID09PSAwKSByZXQgPSBudWxsO2Vsc2UgaWYgKG9iamVjdE1vZGUpIHJldCA9IGxpc3Quc2hpZnQoKTtlbHNlIGlmICghbiB8fCBuID49IGxlbmd0aCkge1xuICAgIC8vIHJlYWQgaXQgYWxsLCB0cnVuY2F0ZSB0aGUgYXJyYXkuXG4gICAgaWYgKHN0cmluZ01vZGUpIHJldCA9IGxpc3Quam9pbignJyk7ZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHJldCA9IGxpc3RbMF07ZWxzZSByZXQgPSBCdWZmZXIuY29uY2F0KGxpc3QsIGxlbmd0aCk7XG4gICAgbGlzdC5sZW5ndGggPSAwO1xuICB9IGVsc2Uge1xuICAgIC8vIHJlYWQganVzdCBzb21lIG9mIGl0LlxuICAgIGlmIChuIDwgbGlzdFswXS5sZW5ndGgpIHtcbiAgICAgIC8vIGp1c3QgdGFrZSBhIHBhcnQgb2YgdGhlIGZpcnN0IGxpc3QgaXRlbS5cbiAgICAgIC8vIHNsaWNlIGlzIHRoZSBzYW1lIGZvciBidWZmZXJzIGFuZCBzdHJpbmdzLlxuICAgICAgdmFyIGJ1ZiA9IGxpc3RbMF07XG4gICAgICByZXQgPSBidWYuc2xpY2UoMCwgbik7XG4gICAgICBsaXN0WzBdID0gYnVmLnNsaWNlKG4pO1xuICAgIH0gZWxzZSBpZiAobiA9PT0gbGlzdFswXS5sZW5ndGgpIHtcbiAgICAgIC8vIGZpcnN0IGxpc3QgaXMgYSBwZXJmZWN0IG1hdGNoXG4gICAgICByZXQgPSBsaXN0LnNoaWZ0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNvbXBsZXggY2FzZS5cbiAgICAgIC8vIHdlIGhhdmUgZW5vdWdoIHRvIGNvdmVyIGl0LCBidXQgaXQgc3BhbnMgcGFzdCB0aGUgZmlyc3QgYnVmZmVyLlxuICAgICAgaWYgKHN0cmluZ01vZGUpIHJldCA9ICcnO2Vsc2UgcmV0ID0gbmV3IEJ1ZmZlcihuKTtcblxuICAgICAgdmFyIGMgPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0Lmxlbmd0aDsgaSA8IGwgJiYgYyA8IG47IGkrKykge1xuICAgICAgICB2YXIgYnVmID0gbGlzdFswXTtcbiAgICAgICAgdmFyIGNweSA9IE1hdGgubWluKG4gLSBjLCBidWYubGVuZ3RoKTtcblxuICAgICAgICBpZiAoc3RyaW5nTW9kZSkgcmV0ICs9IGJ1Zi5zbGljZSgwLCBjcHkpO2Vsc2UgYnVmLmNvcHkocmV0LCBjLCAwLCBjcHkpO1xuXG4gICAgICAgIGlmIChjcHkgPCBidWYubGVuZ3RoKSBsaXN0WzBdID0gYnVmLnNsaWNlKGNweSk7ZWxzZSBsaXN0LnNoaWZ0KCk7XG5cbiAgICAgICAgYyArPSBjcHk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gZW5kUmVhZGFibGUoc3RyZWFtKSB7XG4gIHZhciBzdGF0ZSA9IHN0cmVhbS5fcmVhZGFibGVTdGF0ZTtcblxuICAvLyBJZiB3ZSBnZXQgaGVyZSBiZWZvcmUgY29uc3VtaW5nIGFsbCB0aGUgYnl0ZXMsIHRoZW4gdGhhdCBpcyBhXG4gIC8vIGJ1ZyBpbiBub2RlLiAgU2hvdWxkIG5ldmVyIGhhcHBlbi5cbiAgaWYgKHN0YXRlLmxlbmd0aCA+IDApIHRocm93IG5ldyBFcnJvcignZW5kUmVhZGFibGUgY2FsbGVkIG9uIG5vbi1lbXB0eSBzdHJlYW0nKTtcblxuICBpZiAoIXN0YXRlLmVuZEVtaXR0ZWQpIHtcbiAgICBzdGF0ZS5lbmRlZCA9IHRydWU7XG4gICAgcHJvY2Vzc05leHRUaWNrKGVuZFJlYWRhYmxlTlQsIHN0YXRlLCBzdHJlYW0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGVuZFJlYWRhYmxlTlQoc3RhdGUsIHN0cmVhbSkge1xuICAvLyBDaGVjayB0aGF0IHdlIGRpZG4ndCBnZXQgb25lIGxhc3QgdW5zaGlmdC5cbiAgaWYgKCFzdGF0ZS5lbmRFbWl0dGVkICYmIHN0YXRlLmxlbmd0aCA9PT0gMCkge1xuICAgIHN0YXRlLmVuZEVtaXR0ZWQgPSB0cnVlO1xuICAgIHN0cmVhbS5yZWFkYWJsZSA9IGZhbHNlO1xuICAgIHN0cmVhbS5lbWl0KCdlbmQnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JFYWNoKHhzLCBmKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0geHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZih4c1tpXSwgaSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5kZXhPZih4cywgeCkge1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHhzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGlmICh4c1tpXSA9PT0geCkgcmV0dXJuIGk7XG4gIH1cbiAgcmV0dXJuIC0xO1xufSIsIi8vIGEgdHJhbnNmb3JtIHN0cmVhbSBpcyBhIHJlYWRhYmxlL3dyaXRhYmxlIHN0cmVhbSB3aGVyZSB5b3UgZG9cbi8vIHNvbWV0aGluZyB3aXRoIHRoZSBkYXRhLiAgU29tZXRpbWVzIGl0J3MgY2FsbGVkIGEgXCJmaWx0ZXJcIixcbi8vIGJ1dCB0aGF0J3Mgbm90IGEgZ3JlYXQgbmFtZSBmb3IgaXQsIHNpbmNlIHRoYXQgaW1wbGllcyBhIHRoaW5nIHdoZXJlXG4vLyBzb21lIGJpdHMgcGFzcyB0aHJvdWdoLCBhbmQgb3RoZXJzIGFyZSBzaW1wbHkgaWdub3JlZC4gIChUaGF0IHdvdWxkXG4vLyBiZSBhIHZhbGlkIGV4YW1wbGUgb2YgYSB0cmFuc2Zvcm0sIG9mIGNvdXJzZS4pXG4vL1xuLy8gV2hpbGUgdGhlIG91dHB1dCBpcyBjYXVzYWxseSByZWxhdGVkIHRvIHRoZSBpbnB1dCwgaXQncyBub3QgYVxuLy8gbmVjZXNzYXJpbHkgc3ltbWV0cmljIG9yIHN5bmNocm9ub3VzIHRyYW5zZm9ybWF0aW9uLiAgRm9yIGV4YW1wbGUsXG4vLyBhIHpsaWIgc3RyZWFtIG1pZ2h0IHRha2UgbXVsdGlwbGUgcGxhaW4tdGV4dCB3cml0ZXMoKSwgYW5kIHRoZW5cbi8vIGVtaXQgYSBzaW5nbGUgY29tcHJlc3NlZCBjaHVuayBzb21lIHRpbWUgaW4gdGhlIGZ1dHVyZS5cbi8vXG4vLyBIZXJlJ3MgaG93IHRoaXMgd29ya3M6XG4vL1xuLy8gVGhlIFRyYW5zZm9ybSBzdHJlYW0gaGFzIGFsbCB0aGUgYXNwZWN0cyBvZiB0aGUgcmVhZGFibGUgYW5kIHdyaXRhYmxlXG4vLyBzdHJlYW0gY2xhc3Nlcy4gIFdoZW4geW91IHdyaXRlKGNodW5rKSwgdGhhdCBjYWxscyBfd3JpdGUoY2h1bmssY2IpXG4vLyBpbnRlcm5hbGx5LCBhbmQgcmV0dXJucyBmYWxzZSBpZiB0aGVyZSdzIGEgbG90IG9mIHBlbmRpbmcgd3JpdGVzXG4vLyBidWZmZXJlZCB1cC4gIFdoZW4geW91IGNhbGwgcmVhZCgpLCB0aGF0IGNhbGxzIF9yZWFkKG4pIHVudGlsXG4vLyB0aGVyZSdzIGVub3VnaCBwZW5kaW5nIHJlYWRhYmxlIGRhdGEgYnVmZmVyZWQgdXAuXG4vL1xuLy8gSW4gYSB0cmFuc2Zvcm0gc3RyZWFtLCB0aGUgd3JpdHRlbiBkYXRhIGlzIHBsYWNlZCBpbiBhIGJ1ZmZlci4gIFdoZW5cbi8vIF9yZWFkKG4pIGlzIGNhbGxlZCwgaXQgdHJhbnNmb3JtcyB0aGUgcXVldWVkIHVwIGRhdGEsIGNhbGxpbmcgdGhlXG4vLyBidWZmZXJlZCBfd3JpdGUgY2IncyBhcyBpdCBjb25zdW1lcyBjaHVua3MuICBJZiBjb25zdW1pbmcgYSBzaW5nbGVcbi8vIHdyaXR0ZW4gY2h1bmsgd291bGQgcmVzdWx0IGluIG11bHRpcGxlIG91dHB1dCBjaHVua3MsIHRoZW4gdGhlIGZpcnN0XG4vLyBvdXRwdXR0ZWQgYml0IGNhbGxzIHRoZSByZWFkY2IsIGFuZCBzdWJzZXF1ZW50IGNodW5rcyBqdXN0IGdvIGludG9cbi8vIHRoZSByZWFkIGJ1ZmZlciwgYW5kIHdpbGwgY2F1c2UgaXQgdG8gZW1pdCAncmVhZGFibGUnIGlmIG5lY2Vzc2FyeS5cbi8vXG4vLyBUaGlzIHdheSwgYmFjay1wcmVzc3VyZSBpcyBhY3R1YWxseSBkZXRlcm1pbmVkIGJ5IHRoZSByZWFkaW5nIHNpZGUsXG4vLyBzaW5jZSBfcmVhZCBoYXMgdG8gYmUgY2FsbGVkIHRvIHN0YXJ0IHByb2Nlc3NpbmcgYSBuZXcgY2h1bmsuICBIb3dldmVyLFxuLy8gYSBwYXRob2xvZ2ljYWwgaW5mbGF0ZSB0eXBlIG9mIHRyYW5zZm9ybSBjYW4gY2F1c2UgZXhjZXNzaXZlIGJ1ZmZlcmluZ1xuLy8gaGVyZS4gIEZvciBleGFtcGxlLCBpbWFnaW5lIGEgc3RyZWFtIHdoZXJlIGV2ZXJ5IGJ5dGUgb2YgaW5wdXQgaXNcbi8vIGludGVycHJldGVkIGFzIGFuIGludGVnZXIgZnJvbSAwLTI1NSwgYW5kIHRoZW4gcmVzdWx0cyBpbiB0aGF0IG1hbnlcbi8vIGJ5dGVzIG9mIG91dHB1dC4gIFdyaXRpbmcgdGhlIDQgYnl0ZXMge2ZmLGZmLGZmLGZmfSB3b3VsZCByZXN1bHQgaW5cbi8vIDFrYiBvZiBkYXRhIGJlaW5nIG91dHB1dC4gIEluIHRoaXMgY2FzZSwgeW91IGNvdWxkIHdyaXRlIGEgdmVyeSBzbWFsbFxuLy8gYW1vdW50IG9mIGlucHV0LCBhbmQgZW5kIHVwIHdpdGggYSB2ZXJ5IGxhcmdlIGFtb3VudCBvZiBvdXRwdXQuICBJblxuLy8gc3VjaCBhIHBhdGhvbG9naWNhbCBpbmZsYXRpbmcgbWVjaGFuaXNtLCB0aGVyZSdkIGJlIG5vIHdheSB0byB0ZWxsXG4vLyB0aGUgc3lzdGVtIHRvIHN0b3AgZG9pbmcgdGhlIHRyYW5zZm9ybS4gIEEgc2luZ2xlIDRNQiB3cml0ZSBjb3VsZFxuLy8gY2F1c2UgdGhlIHN5c3RlbSB0byBydW4gb3V0IG9mIG1lbW9yeS5cbi8vXG4vLyBIb3dldmVyLCBldmVuIGluIHN1Y2ggYSBwYXRob2xvZ2ljYWwgY2FzZSwgb25seSBhIHNpbmdsZSB3cml0dGVuIGNodW5rXG4vLyB3b3VsZCBiZSBjb25zdW1lZCwgYW5kIHRoZW4gdGhlIHJlc3Qgd291bGQgd2FpdCAodW4tdHJhbnNmb3JtZWQpIHVudGlsXG4vLyB0aGUgcmVzdWx0cyBvZiB0aGUgcHJldmlvdXMgdHJhbnNmb3JtZWQgY2h1bmsgd2VyZSBjb25zdW1lZC5cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zZm9ybTtcblxudmFyIER1cGxleCA9IHJlcXVpcmUoJy4vX3N0cmVhbV9kdXBsZXgnKTtcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciB1dGlsID0gcmVxdWlyZSgnY29yZS11dGlsLWlzJyk7XG51dGlsLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG51dGlsLmluaGVyaXRzKFRyYW5zZm9ybSwgRHVwbGV4KTtcblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RhdGUoc3RyZWFtKSB7XG4gIHRoaXMuYWZ0ZXJUcmFuc2Zvcm0gPSBmdW5jdGlvbiAoZXIsIGRhdGEpIHtcbiAgICByZXR1cm4gYWZ0ZXJUcmFuc2Zvcm0oc3RyZWFtLCBlciwgZGF0YSk7XG4gIH07XG5cbiAgdGhpcy5uZWVkVHJhbnNmb3JtID0gZmFsc2U7XG4gIHRoaXMudHJhbnNmb3JtaW5nID0gZmFsc2U7XG4gIHRoaXMud3JpdGVjYiA9IG51bGw7XG4gIHRoaXMud3JpdGVjaHVuayA9IG51bGw7XG4gIHRoaXMud3JpdGVlbmNvZGluZyA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIGFmdGVyVHJhbnNmb3JtKHN0cmVhbSwgZXIsIGRhdGEpIHtcbiAgdmFyIHRzID0gc3RyZWFtLl90cmFuc2Zvcm1TdGF0ZTtcbiAgdHMudHJhbnNmb3JtaW5nID0gZmFsc2U7XG5cbiAgdmFyIGNiID0gdHMud3JpdGVjYjtcblxuICBpZiAoIWNiKSByZXR1cm4gc3RyZWFtLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdubyB3cml0ZWNiIGluIFRyYW5zZm9ybSBjbGFzcycpKTtcblxuICB0cy53cml0ZWNodW5rID0gbnVsbDtcbiAgdHMud3JpdGVjYiA9IG51bGw7XG5cbiAgaWYgKGRhdGEgIT09IG51bGwgJiYgZGF0YSAhPT0gdW5kZWZpbmVkKSBzdHJlYW0ucHVzaChkYXRhKTtcblxuICBjYihlcik7XG5cbiAgdmFyIHJzID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuICBycy5yZWFkaW5nID0gZmFsc2U7XG4gIGlmIChycy5uZWVkUmVhZGFibGUgfHwgcnMubGVuZ3RoIDwgcnMuaGlnaFdhdGVyTWFyaykge1xuICAgIHN0cmVhbS5fcmVhZChycy5oaWdoV2F0ZXJNYXJrKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBUcmFuc2Zvcm0ob3B0aW9ucykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVHJhbnNmb3JtKSkgcmV0dXJuIG5ldyBUcmFuc2Zvcm0ob3B0aW9ucyk7XG5cbiAgRHVwbGV4LmNhbGwodGhpcywgb3B0aW9ucyk7XG5cbiAgdGhpcy5fdHJhbnNmb3JtU3RhdGUgPSBuZXcgVHJhbnNmb3JtU3RhdGUodGhpcyk7XG5cbiAgLy8gd2hlbiB0aGUgd3JpdGFibGUgc2lkZSBmaW5pc2hlcywgdGhlbiBmbHVzaCBvdXQgYW55dGhpbmcgcmVtYWluaW5nLlxuICB2YXIgc3RyZWFtID0gdGhpcztcblxuICAvLyBzdGFydCBvdXQgYXNraW5nIGZvciBhIHJlYWRhYmxlIGV2ZW50IG9uY2UgZGF0YSBpcyB0cmFuc2Zvcm1lZC5cbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuXG4gIC8vIHdlIGhhdmUgaW1wbGVtZW50ZWQgdGhlIF9yZWFkIG1ldGhvZCwgYW5kIGRvbmUgdGhlIG90aGVyIHRoaW5nc1xuICAvLyB0aGF0IFJlYWRhYmxlIHdhbnRzIGJlZm9yZSB0aGUgZmlyc3QgX3JlYWQgY2FsbCwgc28gdW5zZXQgdGhlXG4gIC8vIHN5bmMgZ3VhcmQgZmxhZy5cbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5zeW5jID0gZmFsc2U7XG5cbiAgaWYgKG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMudHJhbnNmb3JtID09PSAnZnVuY3Rpb24nKSB0aGlzLl90cmFuc2Zvcm0gPSBvcHRpb25zLnRyYW5zZm9ybTtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5mbHVzaCA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5fZmx1c2ggPSBvcHRpb25zLmZsdXNoO1xuICB9XG5cbiAgdGhpcy5vbmNlKCdwcmVmaW5pc2gnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9mbHVzaCA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5fZmx1c2goZnVuY3Rpb24gKGVyKSB7XG4gICAgICBkb25lKHN0cmVhbSwgZXIpO1xuICAgIH0pO2Vsc2UgZG9uZShzdHJlYW0pO1xuICB9KTtcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKGNodW5rLCBlbmNvZGluZykge1xuICB0aGlzLl90cmFuc2Zvcm1TdGF0ZS5uZWVkVHJhbnNmb3JtID0gZmFsc2U7XG4gIHJldHVybiBEdXBsZXgucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLCBjaHVuaywgZW5jb2RpbmcpO1xufTtcblxuLy8gVGhpcyBpcyB0aGUgcGFydCB3aGVyZSB5b3UgZG8gc3R1ZmYhXG4vLyBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uIGluIGltcGxlbWVudGF0aW9uIGNsYXNzZXMuXG4vLyAnY2h1bmsnIGlzIGFuIGlucHV0IGNodW5rLlxuLy9cbi8vIENhbGwgYHB1c2gobmV3Q2h1bmspYCB0byBwYXNzIGFsb25nIHRyYW5zZm9ybWVkIG91dHB1dFxuLy8gdG8gdGhlIHJlYWRhYmxlIHNpZGUuICBZb3UgbWF5IGNhbGwgJ3B1c2gnIHplcm8gb3IgbW9yZSB0aW1lcy5cbi8vXG4vLyBDYWxsIGBjYihlcnIpYCB3aGVuIHlvdSBhcmUgZG9uZSB3aXRoIHRoaXMgY2h1bmsuICBJZiB5b3UgcGFzc1xuLy8gYW4gZXJyb3IsIHRoZW4gdGhhdCdsbCBwdXQgdGhlIGh1cnQgb24gdGhlIHdob2xlIG9wZXJhdGlvbi4gIElmIHlvdVxuLy8gbmV2ZXIgY2FsbCBjYigpLCB0aGVuIHlvdSdsbCBuZXZlciBnZXQgYW5vdGhlciBjaHVuay5cblRyYW5zZm9ybS5wcm90b3R5cGUuX3RyYW5zZm9ybSA9IGZ1bmN0aW9uIChjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG59O1xuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLl93cml0ZSA9IGZ1bmN0aW9uIChjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHZhciB0cyA9IHRoaXMuX3RyYW5zZm9ybVN0YXRlO1xuICB0cy53cml0ZWNiID0gY2I7XG4gIHRzLndyaXRlY2h1bmsgPSBjaHVuaztcbiAgdHMud3JpdGVlbmNvZGluZyA9IGVuY29kaW5nO1xuICBpZiAoIXRzLnRyYW5zZm9ybWluZykge1xuICAgIHZhciBycyA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG4gICAgaWYgKHRzLm5lZWRUcmFuc2Zvcm0gfHwgcnMubmVlZFJlYWRhYmxlIHx8IHJzLmxlbmd0aCA8IHJzLmhpZ2hXYXRlck1hcmspIHRoaXMuX3JlYWQocnMuaGlnaFdhdGVyTWFyayk7XG4gIH1cbn07XG5cbi8vIERvZXNuJ3QgbWF0dGVyIHdoYXQgdGhlIGFyZ3MgYXJlIGhlcmUuXG4vLyBfdHJhbnNmb3JtIGRvZXMgYWxsIHRoZSB3b3JrLlxuLy8gVGhhdCB3ZSBnb3QgaGVyZSBtZWFucyB0aGF0IHRoZSByZWFkYWJsZSBzaWRlIHdhbnRzIG1vcmUgZGF0YS5cblRyYW5zZm9ybS5wcm90b3R5cGUuX3JlYWQgPSBmdW5jdGlvbiAobikge1xuICB2YXIgdHMgPSB0aGlzLl90cmFuc2Zvcm1TdGF0ZTtcblxuICBpZiAodHMud3JpdGVjaHVuayAhPT0gbnVsbCAmJiB0cy53cml0ZWNiICYmICF0cy50cmFuc2Zvcm1pbmcpIHtcbiAgICB0cy50cmFuc2Zvcm1pbmcgPSB0cnVlO1xuICAgIHRoaXMuX3RyYW5zZm9ybSh0cy53cml0ZWNodW5rLCB0cy53cml0ZWVuY29kaW5nLCB0cy5hZnRlclRyYW5zZm9ybSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gbWFyayB0aGF0IHdlIG5lZWQgYSB0cmFuc2Zvcm0sIHNvIHRoYXQgYW55IGRhdGEgdGhhdCBjb21lcyBpblxuICAgIC8vIHdpbGwgZ2V0IHByb2Nlc3NlZCwgbm93IHRoYXQgd2UndmUgYXNrZWQgZm9yIGl0LlxuICAgIHRzLm5lZWRUcmFuc2Zvcm0gPSB0cnVlO1xuICB9XG59O1xuXG5mdW5jdGlvbiBkb25lKHN0cmVhbSwgZXIpIHtcbiAgaWYgKGVyKSByZXR1cm4gc3RyZWFtLmVtaXQoJ2Vycm9yJywgZXIpO1xuXG4gIC8vIGlmIHRoZXJlJ3Mgbm90aGluZyBpbiB0aGUgd3JpdGUgYnVmZmVyLCB0aGVuIHRoYXQgbWVhbnNcbiAgLy8gdGhhdCBub3RoaW5nIG1vcmUgd2lsbCBldmVyIGJlIHByb3ZpZGVkXG4gIHZhciB3cyA9IHN0cmVhbS5fd3JpdGFibGVTdGF0ZTtcbiAgdmFyIHRzID0gc3RyZWFtLl90cmFuc2Zvcm1TdGF0ZTtcblxuICBpZiAod3MubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ2NhbGxpbmcgdHJhbnNmb3JtIGRvbmUgd2hlbiB3cy5sZW5ndGggIT0gMCcpO1xuXG4gIGlmICh0cy50cmFuc2Zvcm1pbmcpIHRocm93IG5ldyBFcnJvcignY2FsbGluZyB0cmFuc2Zvcm0gZG9uZSB3aGVuIHN0aWxsIHRyYW5zZm9ybWluZycpO1xuXG4gIHJldHVybiBzdHJlYW0ucHVzaChudWxsKTtcbn0iLCIvLyBBIGJpdCBzaW1wbGVyIHRoYW4gcmVhZGFibGUgc3RyZWFtcy5cbi8vIEltcGxlbWVudCBhbiBhc3luYyAuX3dyaXRlKGNodW5rLCBlbmNvZGluZywgY2IpLCBhbmQgaXQnbGwgaGFuZGxlIGFsbFxuLy8gdGhlIGRyYWluIGV2ZW50IGVtaXNzaW9uIGFuZCBidWZmZXJpbmcuXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBXcml0YWJsZTtcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBwcm9jZXNzTmV4dFRpY2sgPSByZXF1aXJlKCdwcm9jZXNzLW5leHRpY2stYXJncycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgYXN5bmNXcml0ZSA9ICF0cnVlID8gc2V0SW1tZWRpYXRlIDogcHJvY2Vzc05leHRUaWNrO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbldyaXRhYmxlLldyaXRhYmxlU3RhdGUgPSBXcml0YWJsZVN0YXRlO1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIHV0aWwgPSByZXF1aXJlKCdjb3JlLXV0aWwtaXMnKTtcbnV0aWwuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgaW50ZXJuYWxVdGlsID0ge1xuICBkZXByZWNhdGU6IHJlcXVpcmUoJ3V0aWwtZGVwcmVjYXRlJylcbn07XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBTdHJlYW07XG4oZnVuY3Rpb24gKCkge1xuICB0cnkge1xuICAgIFN0cmVhbSA9IHJlcXVpcmUoJ3N0JyArICdyZWFtJyk7XG4gIH0gY2F0Y2ggKF8pIHt9IGZpbmFsbHkge1xuICAgIGlmICghU3RyZWFtKSBTdHJlYW0gPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG4gIH1cbn0pKCk7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcblxudXRpbC5pbmhlcml0cyhXcml0YWJsZSwgU3RyZWFtKTtcblxuZnVuY3Rpb24gbm9wKCkge31cblxuZnVuY3Rpb24gV3JpdGVSZXEoY2h1bmssIGVuY29kaW5nLCBjYikge1xuICB0aGlzLmNodW5rID0gY2h1bms7XG4gIHRoaXMuZW5jb2RpbmcgPSBlbmNvZGluZztcbiAgdGhpcy5jYWxsYmFjayA9IGNiO1xuICB0aGlzLm5leHQgPSBudWxsO1xufVxuXG52YXIgRHVwbGV4O1xuZnVuY3Rpb24gV3JpdGFibGVTdGF0ZShvcHRpb25zLCBzdHJlYW0pIHtcbiAgRHVwbGV4ID0gRHVwbGV4IHx8IHJlcXVpcmUoJy4vX3N0cmVhbV9kdXBsZXgnKTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAvLyBvYmplY3Qgc3RyZWFtIGZsYWcgdG8gaW5kaWNhdGUgd2hldGhlciBvciBub3QgdGhpcyBzdHJlYW1cbiAgLy8gY29udGFpbnMgYnVmZmVycyBvciBvYmplY3RzLlxuICB0aGlzLm9iamVjdE1vZGUgPSAhIW9wdGlvbnMub2JqZWN0TW9kZTtcblxuICBpZiAoc3RyZWFtIGluc3RhbmNlb2YgRHVwbGV4KSB0aGlzLm9iamVjdE1vZGUgPSB0aGlzLm9iamVjdE1vZGUgfHwgISFvcHRpb25zLndyaXRhYmxlT2JqZWN0TW9kZTtcblxuICAvLyB0aGUgcG9pbnQgYXQgd2hpY2ggd3JpdGUoKSBzdGFydHMgcmV0dXJuaW5nIGZhbHNlXG4gIC8vIE5vdGU6IDAgaXMgYSB2YWxpZCB2YWx1ZSwgbWVhbnMgdGhhdCB3ZSBhbHdheXMgcmV0dXJuIGZhbHNlIGlmXG4gIC8vIHRoZSBlbnRpcmUgYnVmZmVyIGlzIG5vdCBmbHVzaGVkIGltbWVkaWF0ZWx5IG9uIHdyaXRlKClcbiAgdmFyIGh3bSA9IG9wdGlvbnMuaGlnaFdhdGVyTWFyaztcbiAgdmFyIGRlZmF1bHRId20gPSB0aGlzLm9iamVjdE1vZGUgPyAxNiA6IDE2ICogMTAyNDtcbiAgdGhpcy5oaWdoV2F0ZXJNYXJrID0gaHdtIHx8IGh3bSA9PT0gMCA/IGh3bSA6IGRlZmF1bHRId207XG5cbiAgLy8gY2FzdCB0byBpbnRzLlxuICB0aGlzLmhpZ2hXYXRlck1hcmsgPSB+IH50aGlzLmhpZ2hXYXRlck1hcms7XG5cbiAgdGhpcy5uZWVkRHJhaW4gPSBmYWxzZTtcbiAgLy8gYXQgdGhlIHN0YXJ0IG9mIGNhbGxpbmcgZW5kKClcbiAgdGhpcy5lbmRpbmcgPSBmYWxzZTtcbiAgLy8gd2hlbiBlbmQoKSBoYXMgYmVlbiBjYWxsZWQsIGFuZCByZXR1cm5lZFxuICB0aGlzLmVuZGVkID0gZmFsc2U7XG4gIC8vIHdoZW4gJ2ZpbmlzaCcgaXMgZW1pdHRlZFxuICB0aGlzLmZpbmlzaGVkID0gZmFsc2U7XG5cbiAgLy8gc2hvdWxkIHdlIGRlY29kZSBzdHJpbmdzIGludG8gYnVmZmVycyBiZWZvcmUgcGFzc2luZyB0byBfd3JpdGU/XG4gIC8vIHRoaXMgaXMgaGVyZSBzbyB0aGF0IHNvbWUgbm9kZS1jb3JlIHN0cmVhbXMgY2FuIG9wdGltaXplIHN0cmluZ1xuICAvLyBoYW5kbGluZyBhdCBhIGxvd2VyIGxldmVsLlxuICB2YXIgbm9EZWNvZGUgPSBvcHRpb25zLmRlY29kZVN0cmluZ3MgPT09IGZhbHNlO1xuICB0aGlzLmRlY29kZVN0cmluZ3MgPSAhbm9EZWNvZGU7XG5cbiAgLy8gQ3J5cHRvIGlzIGtpbmQgb2Ygb2xkIGFuZCBjcnVzdHkuICBIaXN0b3JpY2FsbHksIGl0cyBkZWZhdWx0IHN0cmluZ1xuICAvLyBlbmNvZGluZyBpcyAnYmluYXJ5JyBzbyB3ZSBoYXZlIHRvIG1ha2UgdGhpcyBjb25maWd1cmFibGUuXG4gIC8vIEV2ZXJ5dGhpbmcgZWxzZSBpbiB0aGUgdW5pdmVyc2UgdXNlcyAndXRmOCcsIHRob3VnaC5cbiAgdGhpcy5kZWZhdWx0RW5jb2RpbmcgPSBvcHRpb25zLmRlZmF1bHRFbmNvZGluZyB8fCAndXRmOCc7XG5cbiAgLy8gbm90IGFuIGFjdHVhbCBidWZmZXIgd2Uga2VlcCB0cmFjayBvZiwgYnV0IGEgbWVhc3VyZW1lbnRcbiAgLy8gb2YgaG93IG11Y2ggd2UncmUgd2FpdGluZyB0byBnZXQgcHVzaGVkIHRvIHNvbWUgdW5kZXJseWluZ1xuICAvLyBzb2NrZXQgb3IgZmlsZS5cbiAgdGhpcy5sZW5ndGggPSAwO1xuXG4gIC8vIGEgZmxhZyB0byBzZWUgd2hlbiB3ZSdyZSBpbiB0aGUgbWlkZGxlIG9mIGEgd3JpdGUuXG4gIHRoaXMud3JpdGluZyA9IGZhbHNlO1xuXG4gIC8vIHdoZW4gdHJ1ZSBhbGwgd3JpdGVzIHdpbGwgYmUgYnVmZmVyZWQgdW50aWwgLnVuY29yaygpIGNhbGxcbiAgdGhpcy5jb3JrZWQgPSAwO1xuXG4gIC8vIGEgZmxhZyB0byBiZSBhYmxlIHRvIHRlbGwgaWYgdGhlIG9ud3JpdGUgY2IgaXMgY2FsbGVkIGltbWVkaWF0ZWx5LFxuICAvLyBvciBvbiBhIGxhdGVyIHRpY2suICBXZSBzZXQgdGhpcyB0byB0cnVlIGF0IGZpcnN0LCBiZWNhdXNlIGFueVxuICAvLyBhY3Rpb25zIHRoYXQgc2hvdWxkbid0IGhhcHBlbiB1bnRpbCBcImxhdGVyXCIgc2hvdWxkIGdlbmVyYWxseSBhbHNvXG4gIC8vIG5vdCBoYXBwZW4gYmVmb3JlIHRoZSBmaXJzdCB3cml0ZSBjYWxsLlxuICB0aGlzLnN5bmMgPSB0cnVlO1xuXG4gIC8vIGEgZmxhZyB0byBrbm93IGlmIHdlJ3JlIHByb2Nlc3NpbmcgcHJldmlvdXNseSBidWZmZXJlZCBpdGVtcywgd2hpY2hcbiAgLy8gbWF5IGNhbGwgdGhlIF93cml0ZSgpIGNhbGxiYWNrIGluIHRoZSBzYW1lIHRpY2ssIHNvIHRoYXQgd2UgZG9uJ3RcbiAgLy8gZW5kIHVwIGluIGFuIG92ZXJsYXBwZWQgb253cml0ZSBzaXR1YXRpb24uXG4gIHRoaXMuYnVmZmVyUHJvY2Vzc2luZyA9IGZhbHNlO1xuXG4gIC8vIHRoZSBjYWxsYmFjayB0aGF0J3MgcGFzc2VkIHRvIF93cml0ZShjaHVuayxjYilcbiAgdGhpcy5vbndyaXRlID0gZnVuY3Rpb24gKGVyKSB7XG4gICAgb253cml0ZShzdHJlYW0sIGVyKTtcbiAgfTtcblxuICAvLyB0aGUgY2FsbGJhY2sgdGhhdCB0aGUgdXNlciBzdXBwbGllcyB0byB3cml0ZShjaHVuayxlbmNvZGluZyxjYilcbiAgdGhpcy53cml0ZWNiID0gbnVsbDtcblxuICAvLyB0aGUgYW1vdW50IHRoYXQgaXMgYmVpbmcgd3JpdHRlbiB3aGVuIF93cml0ZSBpcyBjYWxsZWQuXG4gIHRoaXMud3JpdGVsZW4gPSAwO1xuXG4gIHRoaXMuYnVmZmVyZWRSZXF1ZXN0ID0gbnVsbDtcbiAgdGhpcy5sYXN0QnVmZmVyZWRSZXF1ZXN0ID0gbnVsbDtcblxuICAvLyBudW1iZXIgb2YgcGVuZGluZyB1c2VyLXN1cHBsaWVkIHdyaXRlIGNhbGxiYWNrc1xuICAvLyB0aGlzIG11c3QgYmUgMCBiZWZvcmUgJ2ZpbmlzaCcgY2FuIGJlIGVtaXR0ZWRcbiAgdGhpcy5wZW5kaW5nY2IgPSAwO1xuXG4gIC8vIGVtaXQgcHJlZmluaXNoIGlmIHRoZSBvbmx5IHRoaW5nIHdlJ3JlIHdhaXRpbmcgZm9yIGlzIF93cml0ZSBjYnNcbiAgLy8gVGhpcyBpcyByZWxldmFudCBmb3Igc3luY2hyb25vdXMgVHJhbnNmb3JtIHN0cmVhbXNcbiAgdGhpcy5wcmVmaW5pc2hlZCA9IGZhbHNlO1xuXG4gIC8vIFRydWUgaWYgdGhlIGVycm9yIHdhcyBhbHJlYWR5IGVtaXR0ZWQgYW5kIHNob3VsZCBub3QgYmUgdGhyb3duIGFnYWluXG4gIHRoaXMuZXJyb3JFbWl0dGVkID0gZmFsc2U7XG5cbiAgLy8gY291bnQgYnVmZmVyZWQgcmVxdWVzdHNcbiAgdGhpcy5idWZmZXJlZFJlcXVlc3RDb3VudCA9IDA7XG5cbiAgLy8gY3JlYXRlIHRoZSB0d28gb2JqZWN0cyBuZWVkZWQgdG8gc3RvcmUgdGhlIGNvcmtlZCByZXF1ZXN0c1xuICAvLyB0aGV5IGFyZSBub3QgYSBsaW5rZWQgbGlzdCwgYXMgbm8gbmV3IGVsZW1lbnRzIGFyZSBpbnNlcnRlZCBpbiB0aGVyZVxuICB0aGlzLmNvcmtlZFJlcXVlc3RzRnJlZSA9IG5ldyBDb3JrZWRSZXF1ZXN0KHRoaXMpO1xuICB0aGlzLmNvcmtlZFJlcXVlc3RzRnJlZS5uZXh0ID0gbmV3IENvcmtlZFJlcXVlc3QodGhpcyk7XG59XG5cbldyaXRhYmxlU3RhdGUucHJvdG90eXBlLmdldEJ1ZmZlciA9IGZ1bmN0aW9uIHdyaXRhYmxlU3RhdGVHZXRCdWZmZXIoKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5idWZmZXJlZFJlcXVlc3Q7XG4gIHZhciBvdXQgPSBbXTtcbiAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICBvdXQucHVzaChjdXJyZW50KTtcbiAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0O1xuICB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4oZnVuY3Rpb24gKCkge1xuICB0cnkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0YWJsZVN0YXRlLnByb3RvdHlwZSwgJ2J1ZmZlcicsIHtcbiAgICAgIGdldDogaW50ZXJuYWxVdGlsLmRlcHJlY2F0ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEJ1ZmZlcigpO1xuICAgICAgfSwgJ193cml0YWJsZVN0YXRlLmJ1ZmZlciBpcyBkZXByZWNhdGVkLiBVc2UgX3dyaXRhYmxlU3RhdGUuZ2V0QnVmZmVyICcgKyAnaW5zdGVhZC4nKVxuICAgIH0pO1xuICB9IGNhdGNoIChfKSB7fVxufSkoKTtcblxudmFyIER1cGxleDtcbmZ1bmN0aW9uIFdyaXRhYmxlKG9wdGlvbnMpIHtcbiAgRHVwbGV4ID0gRHVwbGV4IHx8IHJlcXVpcmUoJy4vX3N0cmVhbV9kdXBsZXgnKTtcblxuICAvLyBXcml0YWJsZSBjdG9yIGlzIGFwcGxpZWQgdG8gRHVwbGV4ZXMsIHRob3VnaCB0aGV5J3JlIG5vdFxuICAvLyBpbnN0YW5jZW9mIFdyaXRhYmxlLCB0aGV5J3JlIGluc3RhbmNlb2YgUmVhZGFibGUuXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBXcml0YWJsZSkgJiYgISh0aGlzIGluc3RhbmNlb2YgRHVwbGV4KSkgcmV0dXJuIG5ldyBXcml0YWJsZShvcHRpb25zKTtcblxuICB0aGlzLl93cml0YWJsZVN0YXRlID0gbmV3IFdyaXRhYmxlU3RhdGUob3B0aW9ucywgdGhpcyk7XG5cbiAgLy8gbGVnYWN5LlxuICB0aGlzLndyaXRhYmxlID0gdHJ1ZTtcblxuICBpZiAob3B0aW9ucykge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy53cml0ZSA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5fd3JpdGUgPSBvcHRpb25zLndyaXRlO1xuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLndyaXRldiA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5fd3JpdGV2ID0gb3B0aW9ucy53cml0ZXY7XG4gIH1cblxuICBTdHJlYW0uY2FsbCh0aGlzKTtcbn1cblxuLy8gT3RoZXJ3aXNlIHBlb3BsZSBjYW4gcGlwZSBXcml0YWJsZSBzdHJlYW1zLCB3aGljaCBpcyBqdXN0IHdyb25nLlxuV3JpdGFibGUucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ0Nhbm5vdCBwaXBlLiBOb3QgcmVhZGFibGUuJykpO1xufTtcblxuZnVuY3Rpb24gd3JpdGVBZnRlckVuZChzdHJlYW0sIGNiKSB7XG4gIHZhciBlciA9IG5ldyBFcnJvcignd3JpdGUgYWZ0ZXIgZW5kJyk7XG4gIC8vIFRPRE86IGRlZmVyIGVycm9yIGV2ZW50cyBjb25zaXN0ZW50bHkgZXZlcnl3aGVyZSwgbm90IGp1c3QgdGhlIGNiXG4gIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVyKTtcbiAgcHJvY2Vzc05leHRUaWNrKGNiLCBlcik7XG59XG5cbi8vIElmIHdlIGdldCBzb21ldGhpbmcgdGhhdCBpcyBub3QgYSBidWZmZXIsIHN0cmluZywgbnVsbCwgb3IgdW5kZWZpbmVkLFxuLy8gYW5kIHdlJ3JlIG5vdCBpbiBvYmplY3RNb2RlLCB0aGVuIHRoYXQncyBhbiBlcnJvci5cbi8vIE90aGVyd2lzZSBzdHJlYW0gY2h1bmtzIGFyZSBhbGwgY29uc2lkZXJlZCB0byBiZSBvZiBsZW5ndGg9MSwgYW5kIHRoZVxuLy8gd2F0ZXJtYXJrcyBkZXRlcm1pbmUgaG93IG1hbnkgb2JqZWN0cyB0byBrZWVwIGluIHRoZSBidWZmZXIsIHJhdGhlciB0aGFuXG4vLyBob3cgbWFueSBieXRlcyBvciBjaGFyYWN0ZXJzLlxuZnVuY3Rpb24gdmFsaWRDaHVuayhzdHJlYW0sIHN0YXRlLCBjaHVuaywgY2IpIHtcbiAgdmFyIHZhbGlkID0gdHJ1ZTtcblxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihjaHVuaykgJiYgdHlwZW9mIGNodW5rICE9PSAnc3RyaW5nJyAmJiBjaHVuayAhPT0gbnVsbCAmJiBjaHVuayAhPT0gdW5kZWZpbmVkICYmICFzdGF0ZS5vYmplY3RNb2RlKSB7XG4gICAgdmFyIGVyID0gbmV3IFR5cGVFcnJvcignSW52YWxpZCBub24tc3RyaW5nL2J1ZmZlciBjaHVuaycpO1xuICAgIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVyKTtcbiAgICBwcm9jZXNzTmV4dFRpY2soY2IsIGVyKTtcbiAgICB2YWxpZCA9IGZhbHNlO1xuICB9XG4gIHJldHVybiB2YWxpZDtcbn1cblxuV3JpdGFibGUucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fd3JpdGFibGVTdGF0ZTtcbiAgdmFyIHJldCA9IGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYiA9IGVuY29kaW5nO1xuICAgIGVuY29kaW5nID0gbnVsbDtcbiAgfVxuXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoY2h1bmspKSBlbmNvZGluZyA9ICdidWZmZXInO2Vsc2UgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSBzdGF0ZS5kZWZhdWx0RW5jb2Rpbmc7XG5cbiAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykgY2IgPSBub3A7XG5cbiAgaWYgKHN0YXRlLmVuZGVkKSB3cml0ZUFmdGVyRW5kKHRoaXMsIGNiKTtlbHNlIGlmICh2YWxpZENodW5rKHRoaXMsIHN0YXRlLCBjaHVuaywgY2IpKSB7XG4gICAgc3RhdGUucGVuZGluZ2NiKys7XG4gICAgcmV0ID0gd3JpdGVPckJ1ZmZlcih0aGlzLCBzdGF0ZSwgY2h1bmssIGVuY29kaW5nLCBjYik7XG4gIH1cblxuICByZXR1cm4gcmV0O1xufTtcblxuV3JpdGFibGUucHJvdG90eXBlLmNvcmsgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3dyaXRhYmxlU3RhdGU7XG5cbiAgc3RhdGUuY29ya2VkKys7XG59O1xuXG5Xcml0YWJsZS5wcm90b3R5cGUudW5jb3JrID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc3RhdGUgPSB0aGlzLl93cml0YWJsZVN0YXRlO1xuXG4gIGlmIChzdGF0ZS5jb3JrZWQpIHtcbiAgICBzdGF0ZS5jb3JrZWQtLTtcblxuICAgIGlmICghc3RhdGUud3JpdGluZyAmJiAhc3RhdGUuY29ya2VkICYmICFzdGF0ZS5maW5pc2hlZCAmJiAhc3RhdGUuYnVmZmVyUHJvY2Vzc2luZyAmJiBzdGF0ZS5idWZmZXJlZFJlcXVlc3QpIGNsZWFyQnVmZmVyKHRoaXMsIHN0YXRlKTtcbiAgfVxufTtcblxuV3JpdGFibGUucHJvdG90eXBlLnNldERlZmF1bHRFbmNvZGluZyA9IGZ1bmN0aW9uIHNldERlZmF1bHRFbmNvZGluZyhlbmNvZGluZykge1xuICAvLyBub2RlOjpQYXJzZUVuY29kaW5nKCkgcmVxdWlyZXMgbG93ZXIgY2FzZS5cbiAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycpIGVuY29kaW5nID0gZW5jb2RpbmcudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCEoWydoZXgnLCAndXRmOCcsICd1dGYtOCcsICdhc2NpaScsICdiaW5hcnknLCAnYmFzZTY0JywgJ3VjczInLCAndWNzLTInLCAndXRmMTZsZScsICd1dGYtMTZsZScsICdyYXcnXS5pbmRleE9mKChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpKSA+IC0xKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKTtcbiAgdGhpcy5fd3JpdGFibGVTdGF0ZS5kZWZhdWx0RW5jb2RpbmcgPSBlbmNvZGluZztcbn07XG5cbmZ1bmN0aW9uIGRlY29kZUNodW5rKHN0YXRlLCBjaHVuaywgZW5jb2RpbmcpIHtcbiAgaWYgKCFzdGF0ZS5vYmplY3RNb2RlICYmIHN0YXRlLmRlY29kZVN0cmluZ3MgIT09IGZhbHNlICYmIHR5cGVvZiBjaHVuayA9PT0gJ3N0cmluZycpIHtcbiAgICBjaHVuayA9IG5ldyBCdWZmZXIoY2h1bmssIGVuY29kaW5nKTtcbiAgfVxuICByZXR1cm4gY2h1bms7XG59XG5cbi8vIGlmIHdlJ3JlIGFscmVhZHkgd3JpdGluZyBzb21ldGhpbmcsIHRoZW4ganVzdCBwdXQgdGhpc1xuLy8gaW4gdGhlIHF1ZXVlLCBhbmQgd2FpdCBvdXIgdHVybi4gIE90aGVyd2lzZSwgY2FsbCBfd3JpdGVcbi8vIElmIHdlIHJldHVybiBmYWxzZSwgdGhlbiB3ZSBuZWVkIGEgZHJhaW4gZXZlbnQsIHNvIHNldCB0aGF0IGZsYWcuXG5mdW5jdGlvbiB3cml0ZU9yQnVmZmVyKHN0cmVhbSwgc3RhdGUsIGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgY2h1bmsgPSBkZWNvZGVDaHVuayhzdGF0ZSwgY2h1bmssIGVuY29kaW5nKTtcblxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKGNodW5rKSkgZW5jb2RpbmcgPSAnYnVmZmVyJztcbiAgdmFyIGxlbiA9IHN0YXRlLm9iamVjdE1vZGUgPyAxIDogY2h1bmsubGVuZ3RoO1xuXG4gIHN0YXRlLmxlbmd0aCArPSBsZW47XG5cbiAgdmFyIHJldCA9IHN0YXRlLmxlbmd0aCA8IHN0YXRlLmhpZ2hXYXRlck1hcms7XG4gIC8vIHdlIG11c3QgZW5zdXJlIHRoYXQgcHJldmlvdXMgbmVlZERyYWluIHdpbGwgbm90IGJlIHJlc2V0IHRvIGZhbHNlLlxuICBpZiAoIXJldCkgc3RhdGUubmVlZERyYWluID0gdHJ1ZTtcblxuICBpZiAoc3RhdGUud3JpdGluZyB8fCBzdGF0ZS5jb3JrZWQpIHtcbiAgICB2YXIgbGFzdCA9IHN0YXRlLmxhc3RCdWZmZXJlZFJlcXVlc3Q7XG4gICAgc3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdCA9IG5ldyBXcml0ZVJlcShjaHVuaywgZW5jb2RpbmcsIGNiKTtcbiAgICBpZiAobGFzdCkge1xuICAgICAgbGFzdC5uZXh0ID0gc3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUuYnVmZmVyZWRSZXF1ZXN0ID0gc3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdDtcbiAgICB9XG4gICAgc3RhdGUuYnVmZmVyZWRSZXF1ZXN0Q291bnQgKz0gMTtcbiAgfSBlbHNlIHtcbiAgICBkb1dyaXRlKHN0cmVhbSwgc3RhdGUsIGZhbHNlLCBsZW4sIGNodW5rLCBlbmNvZGluZywgY2IpO1xuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gZG9Xcml0ZShzdHJlYW0sIHN0YXRlLCB3cml0ZXYsIGxlbiwgY2h1bmssIGVuY29kaW5nLCBjYikge1xuICBzdGF0ZS53cml0ZWxlbiA9IGxlbjtcbiAgc3RhdGUud3JpdGVjYiA9IGNiO1xuICBzdGF0ZS53cml0aW5nID0gdHJ1ZTtcbiAgc3RhdGUuc3luYyA9IHRydWU7XG4gIGlmICh3cml0ZXYpIHN0cmVhbS5fd3JpdGV2KGNodW5rLCBzdGF0ZS5vbndyaXRlKTtlbHNlIHN0cmVhbS5fd3JpdGUoY2h1bmssIGVuY29kaW5nLCBzdGF0ZS5vbndyaXRlKTtcbiAgc3RhdGUuc3luYyA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBvbndyaXRlRXJyb3Ioc3RyZWFtLCBzdGF0ZSwgc3luYywgZXIsIGNiKSB7XG4gIC0tc3RhdGUucGVuZGluZ2NiO1xuICBpZiAoc3luYykgcHJvY2Vzc05leHRUaWNrKGNiLCBlcik7ZWxzZSBjYihlcik7XG5cbiAgc3RyZWFtLl93cml0YWJsZVN0YXRlLmVycm9yRW1pdHRlZCA9IHRydWU7XG4gIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVyKTtcbn1cblxuZnVuY3Rpb24gb253cml0ZVN0YXRlVXBkYXRlKHN0YXRlKSB7XG4gIHN0YXRlLndyaXRpbmcgPSBmYWxzZTtcbiAgc3RhdGUud3JpdGVjYiA9IG51bGw7XG4gIHN0YXRlLmxlbmd0aCAtPSBzdGF0ZS53cml0ZWxlbjtcbiAgc3RhdGUud3JpdGVsZW4gPSAwO1xufVxuXG5mdW5jdGlvbiBvbndyaXRlKHN0cmVhbSwgZXIpIHtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl93cml0YWJsZVN0YXRlO1xuICB2YXIgc3luYyA9IHN0YXRlLnN5bmM7XG4gIHZhciBjYiA9IHN0YXRlLndyaXRlY2I7XG5cbiAgb253cml0ZVN0YXRlVXBkYXRlKHN0YXRlKTtcblxuICBpZiAoZXIpIG9ud3JpdGVFcnJvcihzdHJlYW0sIHN0YXRlLCBzeW5jLCBlciwgY2IpO2Vsc2Uge1xuICAgIC8vIENoZWNrIGlmIHdlJ3JlIGFjdHVhbGx5IHJlYWR5IHRvIGZpbmlzaCwgYnV0IGRvbid0IGVtaXQgeWV0XG4gICAgdmFyIGZpbmlzaGVkID0gbmVlZEZpbmlzaChzdGF0ZSk7XG5cbiAgICBpZiAoIWZpbmlzaGVkICYmICFzdGF0ZS5jb3JrZWQgJiYgIXN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcgJiYgc3RhdGUuYnVmZmVyZWRSZXF1ZXN0KSB7XG4gICAgICBjbGVhckJ1ZmZlcihzdHJlYW0sIHN0YXRlKTtcbiAgICB9XG5cbiAgICBpZiAoc3luYykge1xuICAgICAgLyo8cmVwbGFjZW1lbnQ+Ki9cbiAgICAgIGFzeW5jV3JpdGUoYWZ0ZXJXcml0ZSwgc3RyZWFtLCBzdGF0ZSwgZmluaXNoZWQsIGNiKTtcbiAgICAgIC8qPC9yZXBsYWNlbWVudD4qL1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGFmdGVyV3JpdGUoc3RyZWFtLCBzdGF0ZSwgZmluaXNoZWQsIGNiKTtcbiAgICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBhZnRlcldyaXRlKHN0cmVhbSwgc3RhdGUsIGZpbmlzaGVkLCBjYikge1xuICBpZiAoIWZpbmlzaGVkKSBvbndyaXRlRHJhaW4oc3RyZWFtLCBzdGF0ZSk7XG4gIHN0YXRlLnBlbmRpbmdjYi0tO1xuICBjYigpO1xuICBmaW5pc2hNYXliZShzdHJlYW0sIHN0YXRlKTtcbn1cblxuLy8gTXVzdCBmb3JjZSBjYWxsYmFjayB0byBiZSBjYWxsZWQgb24gbmV4dFRpY2ssIHNvIHRoYXQgd2UgZG9uJ3Rcbi8vIGVtaXQgJ2RyYWluJyBiZWZvcmUgdGhlIHdyaXRlKCkgY29uc3VtZXIgZ2V0cyB0aGUgJ2ZhbHNlJyByZXR1cm5cbi8vIHZhbHVlLCBhbmQgaGFzIGEgY2hhbmNlIHRvIGF0dGFjaCBhICdkcmFpbicgbGlzdGVuZXIuXG5mdW5jdGlvbiBvbndyaXRlRHJhaW4oc3RyZWFtLCBzdGF0ZSkge1xuICBpZiAoc3RhdGUubGVuZ3RoID09PSAwICYmIHN0YXRlLm5lZWREcmFpbikge1xuICAgIHN0YXRlLm5lZWREcmFpbiA9IGZhbHNlO1xuICAgIHN0cmVhbS5lbWl0KCdkcmFpbicpO1xuICB9XG59XG5cbi8vIGlmIHRoZXJlJ3Mgc29tZXRoaW5nIGluIHRoZSBidWZmZXIgd2FpdGluZywgdGhlbiBwcm9jZXNzIGl0XG5mdW5jdGlvbiBjbGVhckJ1ZmZlcihzdHJlYW0sIHN0YXRlKSB7XG4gIHN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcgPSB0cnVlO1xuICB2YXIgZW50cnkgPSBzdGF0ZS5idWZmZXJlZFJlcXVlc3Q7XG5cbiAgaWYgKHN0cmVhbS5fd3JpdGV2ICYmIGVudHJ5ICYmIGVudHJ5Lm5leHQpIHtcbiAgICAvLyBGYXN0IGNhc2UsIHdyaXRlIGV2ZXJ5dGhpbmcgdXNpbmcgX3dyaXRldigpXG4gICAgdmFyIGwgPSBzdGF0ZS5idWZmZXJlZFJlcXVlc3RDb3VudDtcbiAgICB2YXIgYnVmZmVyID0gbmV3IEFycmF5KGwpO1xuICAgIHZhciBob2xkZXIgPSBzdGF0ZS5jb3JrZWRSZXF1ZXN0c0ZyZWU7XG4gICAgaG9sZGVyLmVudHJ5ID0gZW50cnk7XG5cbiAgICB2YXIgY291bnQgPSAwO1xuICAgIHdoaWxlIChlbnRyeSkge1xuICAgICAgYnVmZmVyW2NvdW50XSA9IGVudHJ5O1xuICAgICAgZW50cnkgPSBlbnRyeS5uZXh0O1xuICAgICAgY291bnQgKz0gMTtcbiAgICB9XG5cbiAgICBkb1dyaXRlKHN0cmVhbSwgc3RhdGUsIHRydWUsIHN0YXRlLmxlbmd0aCwgYnVmZmVyLCAnJywgaG9sZGVyLmZpbmlzaCk7XG5cbiAgICAvLyBkb1dyaXRlIGlzIGFsd2F5cyBhc3luYywgZGVmZXIgdGhlc2UgdG8gc2F2ZSBhIGJpdCBvZiB0aW1lXG4gICAgLy8gYXMgdGhlIGhvdCBwYXRoIGVuZHMgd2l0aCBkb1dyaXRlXG4gICAgc3RhdGUucGVuZGluZ2NiKys7XG4gICAgc3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdCA9IG51bGw7XG4gICAgc3RhdGUuY29ya2VkUmVxdWVzdHNGcmVlID0gaG9sZGVyLm5leHQ7XG4gICAgaG9sZGVyLm5leHQgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIC8vIFNsb3cgY2FzZSwgd3JpdGUgY2h1bmtzIG9uZS1ieS1vbmVcbiAgICB3aGlsZSAoZW50cnkpIHtcbiAgICAgIHZhciBjaHVuayA9IGVudHJ5LmNodW5rO1xuICAgICAgdmFyIGVuY29kaW5nID0gZW50cnkuZW5jb2Rpbmc7XG4gICAgICB2YXIgY2IgPSBlbnRyeS5jYWxsYmFjaztcbiAgICAgIHZhciBsZW4gPSBzdGF0ZS5vYmplY3RNb2RlID8gMSA6IGNodW5rLmxlbmd0aDtcblxuICAgICAgZG9Xcml0ZShzdHJlYW0sIHN0YXRlLCBmYWxzZSwgbGVuLCBjaHVuaywgZW5jb2RpbmcsIGNiKTtcbiAgICAgIGVudHJ5ID0gZW50cnkubmV4dDtcbiAgICAgIC8vIGlmIHdlIGRpZG4ndCBjYWxsIHRoZSBvbndyaXRlIGltbWVkaWF0ZWx5LCB0aGVuXG4gICAgICAvLyBpdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gd2FpdCB1bnRpbCBpdCBkb2VzLlxuICAgICAgLy8gYWxzbywgdGhhdCBtZWFucyB0aGF0IHRoZSBjaHVuayBhbmQgY2IgYXJlIGN1cnJlbnRseVxuICAgICAgLy8gYmVpbmcgcHJvY2Vzc2VkLCBzbyBtb3ZlIHRoZSBidWZmZXIgY291bnRlciBwYXN0IHRoZW0uXG4gICAgICBpZiAoc3RhdGUud3JpdGluZykge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZW50cnkgPT09IG51bGwpIHN0YXRlLmxhc3RCdWZmZXJlZFJlcXVlc3QgPSBudWxsO1xuICB9XG5cbiAgc3RhdGUuYnVmZmVyZWRSZXF1ZXN0Q291bnQgPSAwO1xuICBzdGF0ZS5idWZmZXJlZFJlcXVlc3QgPSBlbnRyeTtcbiAgc3RhdGUuYnVmZmVyUHJvY2Vzc2luZyA9IGZhbHNlO1xufVxuXG5Xcml0YWJsZS5wcm90b3R5cGUuX3dyaXRlID0gZnVuY3Rpb24gKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgY2IobmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKSk7XG59O1xuXG5Xcml0YWJsZS5wcm90b3R5cGUuX3dyaXRldiA9IG51bGw7XG5cbldyaXRhYmxlLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbiAoY2h1bmssIGVuY29kaW5nLCBjYikge1xuICB2YXIgc3RhdGUgPSB0aGlzLl93cml0YWJsZVN0YXRlO1xuXG4gIGlmICh0eXBlb2YgY2h1bmsgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYiA9IGNodW5rO1xuICAgIGNodW5rID0gbnVsbDtcbiAgICBlbmNvZGluZyA9IG51bGw7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2IgPSBlbmNvZGluZztcbiAgICBlbmNvZGluZyA9IG51bGw7XG4gIH1cblxuICBpZiAoY2h1bmsgIT09IG51bGwgJiYgY2h1bmsgIT09IHVuZGVmaW5lZCkgdGhpcy53cml0ZShjaHVuaywgZW5jb2RpbmcpO1xuXG4gIC8vIC5lbmQoKSBmdWxseSB1bmNvcmtzXG4gIGlmIChzdGF0ZS5jb3JrZWQpIHtcbiAgICBzdGF0ZS5jb3JrZWQgPSAxO1xuICAgIHRoaXMudW5jb3JrKCk7XG4gIH1cblxuICAvLyBpZ25vcmUgdW5uZWNlc3NhcnkgZW5kKCkgY2FsbHMuXG4gIGlmICghc3RhdGUuZW5kaW5nICYmICFzdGF0ZS5maW5pc2hlZCkgZW5kV3JpdGFibGUodGhpcywgc3RhdGUsIGNiKTtcbn07XG5cbmZ1bmN0aW9uIG5lZWRGaW5pc2goc3RhdGUpIHtcbiAgcmV0dXJuIHN0YXRlLmVuZGluZyAmJiBzdGF0ZS5sZW5ndGggPT09IDAgJiYgc3RhdGUuYnVmZmVyZWRSZXF1ZXN0ID09PSBudWxsICYmICFzdGF0ZS5maW5pc2hlZCAmJiAhc3RhdGUud3JpdGluZztcbn1cblxuZnVuY3Rpb24gcHJlZmluaXNoKHN0cmVhbSwgc3RhdGUpIHtcbiAgaWYgKCFzdGF0ZS5wcmVmaW5pc2hlZCkge1xuICAgIHN0YXRlLnByZWZpbmlzaGVkID0gdHJ1ZTtcbiAgICBzdHJlYW0uZW1pdCgncHJlZmluaXNoJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluaXNoTWF5YmUoc3RyZWFtLCBzdGF0ZSkge1xuICB2YXIgbmVlZCA9IG5lZWRGaW5pc2goc3RhdGUpO1xuICBpZiAobmVlZCkge1xuICAgIGlmIChzdGF0ZS5wZW5kaW5nY2IgPT09IDApIHtcbiAgICAgIHByZWZpbmlzaChzdHJlYW0sIHN0YXRlKTtcbiAgICAgIHN0YXRlLmZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgIHN0cmVhbS5lbWl0KCdmaW5pc2gnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJlZmluaXNoKHN0cmVhbSwgc3RhdGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmVlZDtcbn1cblxuZnVuY3Rpb24gZW5kV3JpdGFibGUoc3RyZWFtLCBzdGF0ZSwgY2IpIHtcbiAgc3RhdGUuZW5kaW5nID0gdHJ1ZTtcbiAgZmluaXNoTWF5YmUoc3RyZWFtLCBzdGF0ZSk7XG4gIGlmIChjYikge1xuICAgIGlmIChzdGF0ZS5maW5pc2hlZCkgcHJvY2Vzc05leHRUaWNrKGNiKTtlbHNlIHN0cmVhbS5vbmNlKCdmaW5pc2gnLCBjYik7XG4gIH1cbiAgc3RhdGUuZW5kZWQgPSB0cnVlO1xuICBzdHJlYW0ud3JpdGFibGUgPSBmYWxzZTtcbn1cblxuLy8gSXQgc2VlbXMgYSBsaW5rZWQgbGlzdCBidXQgaXQgaXMgbm90XG4vLyB0aGVyZSB3aWxsIGJlIG9ubHkgMiBvZiB0aGVzZSBmb3IgZWFjaCBzdHJlYW1cbmZ1bmN0aW9uIENvcmtlZFJlcXVlc3Qoc3RhdGUpIHtcbiAgdmFyIF90aGlzID0gdGhpcztcblxuICB0aGlzLm5leHQgPSBudWxsO1xuICB0aGlzLmVudHJ5ID0gbnVsbDtcblxuICB0aGlzLmZpbmlzaCA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICB2YXIgZW50cnkgPSBfdGhpcy5lbnRyeTtcbiAgICBfdGhpcy5lbnRyeSA9IG51bGw7XG4gICAgd2hpbGUgKGVudHJ5KSB7XG4gICAgICB2YXIgY2IgPSBlbnRyeS5jYWxsYmFjaztcbiAgICAgIHN0YXRlLnBlbmRpbmdjYi0tO1xuICAgICAgY2IoZXJyKTtcbiAgICAgIGVudHJ5ID0gZW50cnkubmV4dDtcbiAgICB9XG4gICAgaWYgKHN0YXRlLmNvcmtlZFJlcXVlc3RzRnJlZSkge1xuICAgICAgc3RhdGUuY29ya2VkUmVxdWVzdHNGcmVlLm5leHQgPSBfdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUuY29ya2VkUmVxdWVzdHNGcmVlID0gX3RoaXM7XG4gICAgfVxuICB9O1xufSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vbGliL19zdHJlYW1fcGFzc3Rocm91Z2guanNcIilcbiIsInZhciBTdHJlYW0gPSAoZnVuY3Rpb24gKCl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHJlcXVpcmUoJ3N0JyArICdyZWFtJyk7IC8vIGhhY2sgdG8gZml4IGEgY2lyY3VsYXIgZGVwZW5kZW5jeSBpc3N1ZSB3aGVuIHVzZWQgd2l0aCBicm93c2VyaWZ5XG4gIH0gY2F0Y2goXyl7fVxufSgpKTtcbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL19zdHJlYW1fcmVhZGFibGUuanMnKTtcbmV4cG9ydHMuU3RyZWFtID0gU3RyZWFtIHx8IGV4cG9ydHM7XG5leHBvcnRzLlJlYWRhYmxlID0gZXhwb3J0cztcbmV4cG9ydHMuV3JpdGFibGUgPSByZXF1aXJlKCcuL2xpYi9fc3RyZWFtX3dyaXRhYmxlLmpzJyk7XG5leHBvcnRzLkR1cGxleCA9IHJlcXVpcmUoJy4vbGliL19zdHJlYW1fZHVwbGV4LmpzJyk7XG5leHBvcnRzLlRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vbGliL19zdHJlYW1fdHJhbnNmb3JtLmpzJyk7XG5leHBvcnRzLlBhc3NUaHJvdWdoID0gcmVxdWlyZSgnLi9saWIvX3N0cmVhbV9wYXNzdGhyb3VnaC5qcycpO1xuXG4vLyBpbmxpbmUtcHJvY2Vzcy1icm93c2VyIGFuZCB1bnJlYWNoYWJsZS1icmFuY2gtdHJhbnNmb3JtIG1ha2Ugc3VyZSB0aGlzIGlzXG4vLyByZW1vdmVkIGluIGJyb3dzZXJpZnkgYnVpbGRzXG5pZiAoIXRydWUpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdzdHJlYW0nKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vbGliL19zdHJlYW1fdHJhbnNmb3JtLmpzXCIpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2xpYi9fc3RyZWFtX3dyaXRhYmxlLmpzXCIpXG4iLCJ2YXIgdGhyb3VnaCA9IHJlcXVpcmUoJ3Rocm91Z2gnKTtcbnZhciBuZXh0VGljayA9IHR5cGVvZiBzZXRJbW1lZGlhdGUgIT09ICd1bmRlZmluZWQnXG4gICAgPyBzZXRJbW1lZGlhdGVcbiAgICA6IHByb2Nlc3MubmV4dFRpY2tcbjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAod3JpdGUsIGVuZCkge1xuICAgIHZhciB0ciA9IHRocm91Z2god3JpdGUsIGVuZCk7XG4gICAgdHIucGF1c2UoKTtcbiAgICB2YXIgcmVzdW1lID0gdHIucmVzdW1lO1xuICAgIHZhciBwYXVzZSA9IHRyLnBhdXNlO1xuICAgIHZhciBwYXVzZWQgPSBmYWxzZTtcbiAgICBcbiAgICB0ci5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHBhdXNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBcbiAgICB0ci5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBhdXNlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gcmVzdW1lLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBcbiAgICBuZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghcGF1c2VkKSB0ci5yZXN1bWUoKTtcbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gdHI7XG59O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbm1vZHVsZS5leHBvcnRzID0gU3RyZWFtO1xuXG52YXIgRUUgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5pbmhlcml0cyhTdHJlYW0sIEVFKTtcblN0cmVhbS5SZWFkYWJsZSA9IHJlcXVpcmUoJ3JlYWRhYmxlLXN0cmVhbS9yZWFkYWJsZS5qcycpO1xuU3RyZWFtLldyaXRhYmxlID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL3dyaXRhYmxlLmpzJyk7XG5TdHJlYW0uRHVwbGV4ID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL2R1cGxleC5qcycpO1xuU3RyZWFtLlRyYW5zZm9ybSA9IHJlcXVpcmUoJ3JlYWRhYmxlLXN0cmVhbS90cmFuc2Zvcm0uanMnKTtcblN0cmVhbS5QYXNzVGhyb3VnaCA9IHJlcXVpcmUoJ3JlYWRhYmxlLXN0cmVhbS9wYXNzdGhyb3VnaC5qcycpO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjQueFxuU3RyZWFtLlN0cmVhbSA9IFN0cmVhbTtcblxuXG5cbi8vIG9sZC1zdHlsZSBzdHJlYW1zLiAgTm90ZSB0aGF0IHRoZSBwaXBlIG1ldGhvZCAodGhlIG9ubHkgcmVsZXZhbnRcbi8vIHBhcnQgb2YgdGhpcyBjbGFzcykgaXMgb3ZlcnJpZGRlbiBpbiB0aGUgUmVhZGFibGUgY2xhc3MuXG5cbmZ1bmN0aW9uIFN0cmVhbSgpIHtcbiAgRUUuY2FsbCh0aGlzKTtcbn1cblxuU3RyZWFtLnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24oZGVzdCwgb3B0aW9ucykge1xuICB2YXIgc291cmNlID0gdGhpcztcblxuICBmdW5jdGlvbiBvbmRhdGEoY2h1bmspIHtcbiAgICBpZiAoZGVzdC53cml0YWJsZSkge1xuICAgICAgaWYgKGZhbHNlID09PSBkZXN0LndyaXRlKGNodW5rKSAmJiBzb3VyY2UucGF1c2UpIHtcbiAgICAgICAgc291cmNlLnBhdXNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc291cmNlLm9uKCdkYXRhJywgb25kYXRhKTtcblxuICBmdW5jdGlvbiBvbmRyYWluKCkge1xuICAgIGlmIChzb3VyY2UucmVhZGFibGUgJiYgc291cmNlLnJlc3VtZSkge1xuICAgICAgc291cmNlLnJlc3VtZSgpO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Qub24oJ2RyYWluJywgb25kcmFpbik7XG5cbiAgLy8gSWYgdGhlICdlbmQnIG9wdGlvbiBpcyBub3Qgc3VwcGxpZWQsIGRlc3QuZW5kKCkgd2lsbCBiZSBjYWxsZWQgd2hlblxuICAvLyBzb3VyY2UgZ2V0cyB0aGUgJ2VuZCcgb3IgJ2Nsb3NlJyBldmVudHMuICBPbmx5IGRlc3QuZW5kKCkgb25jZS5cbiAgaWYgKCFkZXN0Ll9pc1N0ZGlvICYmICghb3B0aW9ucyB8fCBvcHRpb25zLmVuZCAhPT0gZmFsc2UpKSB7XG4gICAgc291cmNlLm9uKCdlbmQnLCBvbmVuZCk7XG4gICAgc291cmNlLm9uKCdjbG9zZScsIG9uY2xvc2UpO1xuICB9XG5cbiAgdmFyIGRpZE9uRW5kID0gZmFsc2U7XG4gIGZ1bmN0aW9uIG9uZW5kKCkge1xuICAgIGlmIChkaWRPbkVuZCkgcmV0dXJuO1xuICAgIGRpZE9uRW5kID0gdHJ1ZTtcblxuICAgIGRlc3QuZW5kKCk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIG9uY2xvc2UoKSB7XG4gICAgaWYgKGRpZE9uRW5kKSByZXR1cm47XG4gICAgZGlkT25FbmQgPSB0cnVlO1xuXG4gICAgaWYgKHR5cGVvZiBkZXN0LmRlc3Ryb3kgPT09ICdmdW5jdGlvbicpIGRlc3QuZGVzdHJveSgpO1xuICB9XG5cbiAgLy8gZG9uJ3QgbGVhdmUgZGFuZ2xpbmcgcGlwZXMgd2hlbiB0aGVyZSBhcmUgZXJyb3JzLlxuICBmdW5jdGlvbiBvbmVycm9yKGVyKSB7XG4gICAgY2xlYW51cCgpO1xuICAgIGlmIChFRS5saXN0ZW5lckNvdW50KHRoaXMsICdlcnJvcicpID09PSAwKSB7XG4gICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkIHN0cmVhbSBlcnJvciBpbiBwaXBlLlxuICAgIH1cbiAgfVxuXG4gIHNvdXJjZS5vbignZXJyb3InLCBvbmVycm9yKTtcbiAgZGVzdC5vbignZXJyb3InLCBvbmVycm9yKTtcblxuICAvLyByZW1vdmUgYWxsIHRoZSBldmVudCBsaXN0ZW5lcnMgdGhhdCB3ZXJlIGFkZGVkLlxuICBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignZGF0YScsIG9uZGF0YSk7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignZHJhaW4nLCBvbmRyYWluKTtcblxuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignZW5kJywgb25lbmQpO1xuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBvbmNsb3NlKTtcblxuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbmVycm9yKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uZXJyb3IpO1xuXG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdlbmQnLCBjbGVhbnVwKTtcbiAgICBzb3VyY2UucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgY2xlYW51cCk7XG5cbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsZWFudXApO1xuICB9XG5cbiAgc291cmNlLm9uKCdlbmQnLCBjbGVhbnVwKTtcbiAgc291cmNlLm9uKCdjbG9zZScsIGNsZWFudXApO1xuXG4gIGRlc3Qub24oJ2Nsb3NlJywgY2xlYW51cCk7XG5cbiAgZGVzdC5lbWl0KCdwaXBlJywgc291cmNlKTtcblxuICAvLyBBbGxvdyBmb3IgdW5peC1saWtlIHVzYWdlOiBBLnBpcGUoQikucGlwZShDKVxuICByZXR1cm4gZGVzdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnZnVuY3Rpb24tYmluZCcpO1xudmFyIEVTID0gcmVxdWlyZSgnZXMtYWJzdHJhY3QvZXM1Jyk7XG52YXIgcmVwbGFjZSA9IGJpbmQuY2FsbChGdW5jdGlvbi5jYWxsLCBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2UpO1xuXG52YXIgbGVmdFdoaXRlc3BhY2UgPSAvXltcXHgwOVxceDBBXFx4MEJcXHgwQ1xceDBEXFx4MjBcXHhBMFxcdTE2ODBcXHUxODBFXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTMwMDBcXHUyMDI4XFx1MjAyOVxcdUZFRkZdKy87XG52YXIgcmlnaHRXaGl0ZXNwYWNlID0gL1tcXHgwOVxceDBBXFx4MEJcXHgwQ1xceDBEXFx4MjBcXHhBMFxcdTE2ODBcXHUxODBFXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTMwMDBcXHUyMDI4XFx1MjAyOVxcdUZFRkZdKyQvO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyaW0oKSB7XG5cdHZhciBTID0gRVMuVG9TdHJpbmcoRVMuQ2hlY2tPYmplY3RDb2VyY2libGUodGhpcykpO1xuXHRyZXR1cm4gcmVwbGFjZShyZXBsYWNlKFMsIGxlZnRXaGl0ZXNwYWNlLCAnJyksIHJpZ2h0V2hpdGVzcGFjZSwgJycpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCdmdW5jdGlvbi1iaW5kJyk7XG52YXIgZGVmaW5lID0gcmVxdWlyZSgnZGVmaW5lLXByb3BlcnRpZXMnKTtcblxudmFyIGltcGxlbWVudGF0aW9uID0gcmVxdWlyZSgnLi9pbXBsZW1lbnRhdGlvbicpO1xudmFyIGdldFBvbHlmaWxsID0gcmVxdWlyZSgnLi9wb2x5ZmlsbCcpO1xudmFyIHNoaW0gPSByZXF1aXJlKCcuL3NoaW0nKTtcblxudmFyIGJvdW5kVHJpbSA9IGJpbmQuY2FsbChGdW5jdGlvbi5jYWxsLCBnZXRQb2x5ZmlsbCgpKTtcblxuZGVmaW5lKGJvdW5kVHJpbSwge1xuXHRnZXRQb2x5ZmlsbDogZ2V0UG9seWZpbGwsXG5cdGltcGxlbWVudGF0aW9uOiBpbXBsZW1lbnRhdGlvbixcblx0c2hpbTogc2hpbVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYm91bmRUcmltO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW1wbGVtZW50YXRpb24gPSByZXF1aXJlKCcuL2ltcGxlbWVudGF0aW9uJyk7XG5cbnZhciB6ZXJvV2lkdGhTcGFjZSA9ICdcXHUyMDBiJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRQb2x5ZmlsbCgpIHtcblx0aWYgKFN0cmluZy5wcm90b3R5cGUudHJpbSAmJiB6ZXJvV2lkdGhTcGFjZS50cmltKCkgPT09IHplcm9XaWR0aFNwYWNlKSB7XG5cdFx0cmV0dXJuIFN0cmluZy5wcm90b3R5cGUudHJpbTtcblx0fVxuXHRyZXR1cm4gaW1wbGVtZW50YXRpb247XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVmaW5lID0gcmVxdWlyZSgnZGVmaW5lLXByb3BlcnRpZXMnKTtcbnZhciBnZXRQb2x5ZmlsbCA9IHJlcXVpcmUoJy4vcG9seWZpbGwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzaGltU3RyaW5nVHJpbSgpIHtcblx0dmFyIHBvbHlmaWxsID0gZ2V0UG9seWZpbGwoKTtcblx0ZGVmaW5lKFN0cmluZy5wcm90b3R5cGUsIHsgdHJpbTogcG9seWZpbGwgfSwgeyB0cmltOiBmdW5jdGlvbiAoKSB7IHJldHVybiBTdHJpbmcucHJvdG90eXBlLnRyaW0gIT09IHBvbHlmaWxsOyB9IH0pO1xuXHRyZXR1cm4gcG9seWZpbGw7XG59O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG5cbnZhciBpc0J1ZmZlckVuY29kaW5nID0gQnVmZmVyLmlzRW5jb2RpbmdcbiAgfHwgZnVuY3Rpb24oZW5jb2RpbmcpIHtcbiAgICAgICBzd2l0Y2ggKGVuY29kaW5nICYmIGVuY29kaW5nLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgIGNhc2UgJ2hleCc6IGNhc2UgJ3V0ZjgnOiBjYXNlICd1dGYtOCc6IGNhc2UgJ2FzY2lpJzogY2FzZSAnYmluYXJ5JzogY2FzZSAnYmFzZTY0JzogY2FzZSAndWNzMic6IGNhc2UgJ3Vjcy0yJzogY2FzZSAndXRmMTZsZSc6IGNhc2UgJ3V0Zi0xNmxlJzogY2FzZSAncmF3JzogcmV0dXJuIHRydWU7XG4gICAgICAgICBkZWZhdWx0OiByZXR1cm4gZmFsc2U7XG4gICAgICAgfVxuICAgICB9XG5cblxuZnVuY3Rpb24gYXNzZXJ0RW5jb2RpbmcoZW5jb2RpbmcpIHtcbiAgaWYgKGVuY29kaW5nICYmICFpc0J1ZmZlckVuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKTtcbiAgfVxufVxuXG4vLyBTdHJpbmdEZWNvZGVyIHByb3ZpZGVzIGFuIGludGVyZmFjZSBmb3IgZWZmaWNpZW50bHkgc3BsaXR0aW5nIGEgc2VyaWVzIG9mXG4vLyBidWZmZXJzIGludG8gYSBzZXJpZXMgb2YgSlMgc3RyaW5ncyB3aXRob3V0IGJyZWFraW5nIGFwYXJ0IG11bHRpLWJ5dGVcbi8vIGNoYXJhY3RlcnMuIENFU1UtOCBpcyBoYW5kbGVkIGFzIHBhcnQgb2YgdGhlIFVURi04IGVuY29kaW5nLlxuLy9cbi8vIEBUT0RPIEhhbmRsaW5nIGFsbCBlbmNvZGluZ3MgaW5zaWRlIGEgc2luZ2xlIG9iamVjdCBtYWtlcyBpdCB2ZXJ5IGRpZmZpY3VsdFxuLy8gdG8gcmVhc29uIGFib3V0IHRoaXMgY29kZSwgc28gaXQgc2hvdWxkIGJlIHNwbGl0IHVwIGluIHRoZSBmdXR1cmUuXG4vLyBAVE9ETyBUaGVyZSBzaG91bGQgYmUgYSB1dGY4LXN0cmljdCBlbmNvZGluZyB0aGF0IHJlamVjdHMgaW52YWxpZCBVVEYtOCBjb2RlXG4vLyBwb2ludHMgYXMgdXNlZCBieSBDRVNVLTguXG52YXIgU3RyaW5nRGVjb2RlciA9IGV4cG9ydHMuU3RyaW5nRGVjb2RlciA9IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gIHRoaXMuZW5jb2RpbmcgPSAoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1stX10vLCAnJyk7XG4gIGFzc2VydEVuY29kaW5nKGVuY29kaW5nKTtcbiAgc3dpdGNoICh0aGlzLmVuY29kaW5nKSB7XG4gICAgY2FzZSAndXRmOCc6XG4gICAgICAvLyBDRVNVLTggcmVwcmVzZW50cyBlYWNoIG9mIFN1cnJvZ2F0ZSBQYWlyIGJ5IDMtYnl0ZXNcbiAgICAgIHRoaXMuc3Vycm9nYXRlU2l6ZSA9IDM7XG4gICAgICBicmVhaztcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIC8vIFVURi0xNiByZXByZXNlbnRzIGVhY2ggb2YgU3Vycm9nYXRlIFBhaXIgYnkgMi1ieXRlc1xuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMjtcbiAgICAgIHRoaXMuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSB1dGYxNkRldGVjdEluY29tcGxldGVDaGFyO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIC8vIEJhc2UtNjQgc3RvcmVzIDMgYnl0ZXMgaW4gNCBjaGFycywgYW5kIHBhZHMgdGhlIHJlbWFpbmRlci5cbiAgICAgIHRoaXMuc3Vycm9nYXRlU2l6ZSA9IDM7XG4gICAgICB0aGlzLmRldGVjdEluY29tcGxldGVDaGFyID0gYmFzZTY0RGV0ZWN0SW5jb21wbGV0ZUNoYXI7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpcy53cml0ZSA9IHBhc3NUaHJvdWdoV3JpdGU7XG4gICAgICByZXR1cm47XG4gIH1cblxuICAvLyBFbm91Z2ggc3BhY2UgdG8gc3RvcmUgYWxsIGJ5dGVzIG9mIGEgc2luZ2xlIGNoYXJhY3Rlci4gVVRGLTggbmVlZHMgNFxuICAvLyBieXRlcywgYnV0IENFU1UtOCBtYXkgcmVxdWlyZSB1cCB0byA2ICgzIGJ5dGVzIHBlciBzdXJyb2dhdGUpLlxuICB0aGlzLmNoYXJCdWZmZXIgPSBuZXcgQnVmZmVyKDYpO1xuICAvLyBOdW1iZXIgb2YgYnl0ZXMgcmVjZWl2ZWQgZm9yIHRoZSBjdXJyZW50IGluY29tcGxldGUgbXVsdGktYnl0ZSBjaGFyYWN0ZXIuXG4gIHRoaXMuY2hhclJlY2VpdmVkID0gMDtcbiAgLy8gTnVtYmVyIG9mIGJ5dGVzIGV4cGVjdGVkIGZvciB0aGUgY3VycmVudCBpbmNvbXBsZXRlIG11bHRpLWJ5dGUgY2hhcmFjdGVyLlxuICB0aGlzLmNoYXJMZW5ndGggPSAwO1xufTtcblxuXG4vLyB3cml0ZSBkZWNvZGVzIHRoZSBnaXZlbiBidWZmZXIgYW5kIHJldHVybnMgaXQgYXMgSlMgc3RyaW5nIHRoYXQgaXNcbi8vIGd1YXJhbnRlZWQgdG8gbm90IGNvbnRhaW4gYW55IHBhcnRpYWwgbXVsdGktYnl0ZSBjaGFyYWN0ZXJzLiBBbnkgcGFydGlhbFxuLy8gY2hhcmFjdGVyIGZvdW5kIGF0IHRoZSBlbmQgb2YgdGhlIGJ1ZmZlciBpcyBidWZmZXJlZCB1cCwgYW5kIHdpbGwgYmVcbi8vIHJldHVybmVkIHdoZW4gY2FsbGluZyB3cml0ZSBhZ2FpbiB3aXRoIHRoZSByZW1haW5pbmcgYnl0ZXMuXG4vL1xuLy8gTm90ZTogQ29udmVydGluZyBhIEJ1ZmZlciBjb250YWluaW5nIGFuIG9ycGhhbiBzdXJyb2dhdGUgdG8gYSBTdHJpbmdcbi8vIGN1cnJlbnRseSB3b3JrcywgYnV0IGNvbnZlcnRpbmcgYSBTdHJpbmcgdG8gYSBCdWZmZXIgKHZpYSBgbmV3IEJ1ZmZlcmAsIG9yXG4vLyBCdWZmZXIjd3JpdGUpIHdpbGwgcmVwbGFjZSBpbmNvbXBsZXRlIHN1cnJvZ2F0ZXMgd2l0aCB0aGUgdW5pY29kZVxuLy8gcmVwbGFjZW1lbnQgY2hhcmFjdGVyLiBTZWUgaHR0cHM6Ly9jb2RlcmV2aWV3LmNocm9taXVtLm9yZy8xMjExNzMwMDkvIC5cblN0cmluZ0RlY29kZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gIHZhciBjaGFyU3RyID0gJyc7XG4gIC8vIGlmIG91ciBsYXN0IHdyaXRlIGVuZGVkIHdpdGggYW4gaW5jb21wbGV0ZSBtdWx0aWJ5dGUgY2hhcmFjdGVyXG4gIHdoaWxlICh0aGlzLmNoYXJMZW5ndGgpIHtcbiAgICAvLyBkZXRlcm1pbmUgaG93IG1hbnkgcmVtYWluaW5nIGJ5dGVzIHRoaXMgYnVmZmVyIGhhcyB0byBvZmZlciBmb3IgdGhpcyBjaGFyXG4gICAgdmFyIGF2YWlsYWJsZSA9IChidWZmZXIubGVuZ3RoID49IHRoaXMuY2hhckxlbmd0aCAtIHRoaXMuY2hhclJlY2VpdmVkKSA/XG4gICAgICAgIHRoaXMuY2hhckxlbmd0aCAtIHRoaXMuY2hhclJlY2VpdmVkIDpcbiAgICAgICAgYnVmZmVyLmxlbmd0aDtcblxuICAgIC8vIGFkZCB0aGUgbmV3IGJ5dGVzIHRvIHRoZSBjaGFyIGJ1ZmZlclxuICAgIGJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgdGhpcy5jaGFyUmVjZWl2ZWQsIDAsIGF2YWlsYWJsZSk7XG4gICAgdGhpcy5jaGFyUmVjZWl2ZWQgKz0gYXZhaWxhYmxlO1xuXG4gICAgaWYgKHRoaXMuY2hhclJlY2VpdmVkIDwgdGhpcy5jaGFyTGVuZ3RoKSB7XG4gICAgICAvLyBzdGlsbCBub3QgZW5vdWdoIGNoYXJzIGluIHRoaXMgYnVmZmVyPyB3YWl0IGZvciBtb3JlIC4uLlxuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBieXRlcyBiZWxvbmdpbmcgdG8gdGhlIGN1cnJlbnQgY2hhcmFjdGVyIGZyb20gdGhlIGJ1ZmZlclxuICAgIGJ1ZmZlciA9IGJ1ZmZlci5zbGljZShhdmFpbGFibGUsIGJ1ZmZlci5sZW5ndGgpO1xuXG4gICAgLy8gZ2V0IHRoZSBjaGFyYWN0ZXIgdGhhdCB3YXMgc3BsaXRcbiAgICBjaGFyU3RyID0gdGhpcy5jaGFyQnVmZmVyLnNsaWNlKDAsIHRoaXMuY2hhckxlbmd0aCkudG9TdHJpbmcodGhpcy5lbmNvZGluZyk7XG5cbiAgICAvLyBDRVNVLTg6IGxlYWQgc3Vycm9nYXRlIChEODAwLURCRkYpIGlzIGFsc28gdGhlIGluY29tcGxldGUgY2hhcmFjdGVyXG4gICAgdmFyIGNoYXJDb2RlID0gY2hhclN0ci5jaGFyQ29kZUF0KGNoYXJTdHIubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGNoYXJDb2RlID49IDB4RDgwMCAmJiBjaGFyQ29kZSA8PSAweERCRkYpIHtcbiAgICAgIHRoaXMuY2hhckxlbmd0aCArPSB0aGlzLnN1cnJvZ2F0ZVNpemU7XG4gICAgICBjaGFyU3RyID0gJyc7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgdGhpcy5jaGFyUmVjZWl2ZWQgPSB0aGlzLmNoYXJMZW5ndGggPSAwO1xuXG4gICAgLy8gaWYgdGhlcmUgYXJlIG5vIG1vcmUgYnl0ZXMgaW4gdGhpcyBidWZmZXIsIGp1c3QgZW1pdCBvdXIgY2hhclxuICAgIGlmIChidWZmZXIubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY2hhclN0cjtcbiAgICB9XG4gICAgYnJlYWs7XG4gIH1cblxuICAvLyBkZXRlcm1pbmUgYW5kIHNldCBjaGFyTGVuZ3RoIC8gY2hhclJlY2VpdmVkXG4gIHRoaXMuZGV0ZWN0SW5jb21wbGV0ZUNoYXIoYnVmZmVyKTtcblxuICB2YXIgZW5kID0gYnVmZmVyLmxlbmd0aDtcbiAgaWYgKHRoaXMuY2hhckxlbmd0aCkge1xuICAgIC8vIGJ1ZmZlciB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXIgYnl0ZXMgd2UgZ290XG4gICAgYnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCAwLCBidWZmZXIubGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQsIGVuZCk7XG4gICAgZW5kIC09IHRoaXMuY2hhclJlY2VpdmVkO1xuICB9XG5cbiAgY2hhclN0ciArPSBidWZmZXIudG9TdHJpbmcodGhpcy5lbmNvZGluZywgMCwgZW5kKTtcblxuICB2YXIgZW5kID0gY2hhclN0ci5sZW5ndGggLSAxO1xuICB2YXIgY2hhckNvZGUgPSBjaGFyU3RyLmNoYXJDb2RlQXQoZW5kKTtcbiAgLy8gQ0VTVS04OiBsZWFkIHN1cnJvZ2F0ZSAoRDgwMC1EQkZGKSBpcyBhbHNvIHRoZSBpbmNvbXBsZXRlIGNoYXJhY3RlclxuICBpZiAoY2hhckNvZGUgPj0gMHhEODAwICYmIGNoYXJDb2RlIDw9IDB4REJGRikge1xuICAgIHZhciBzaXplID0gdGhpcy5zdXJyb2dhdGVTaXplO1xuICAgIHRoaXMuY2hhckxlbmd0aCArPSBzaXplO1xuICAgIHRoaXMuY2hhclJlY2VpdmVkICs9IHNpemU7XG4gICAgdGhpcy5jaGFyQnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCBzaXplLCAwLCBzaXplKTtcbiAgICBidWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIDAsIDAsIHNpemUpO1xuICAgIHJldHVybiBjaGFyU3RyLnN1YnN0cmluZygwLCBlbmQpO1xuICB9XG5cbiAgLy8gb3IganVzdCBlbWl0IHRoZSBjaGFyU3RyXG4gIHJldHVybiBjaGFyU3RyO1xufTtcblxuLy8gZGV0ZWN0SW5jb21wbGV0ZUNoYXIgZGV0ZXJtaW5lcyBpZiB0aGVyZSBpcyBhbiBpbmNvbXBsZXRlIFVURi04IGNoYXJhY3RlciBhdFxuLy8gdGhlIGVuZCBvZiB0aGUgZ2l2ZW4gYnVmZmVyLiBJZiBzbywgaXQgc2V0cyB0aGlzLmNoYXJMZW5ndGggdG8gdGhlIGJ5dGVcbi8vIGxlbmd0aCB0aGF0IGNoYXJhY3RlciwgYW5kIHNldHMgdGhpcy5jaGFyUmVjZWl2ZWQgdG8gdGhlIG51bWJlciBvZiBieXRlc1xuLy8gdGhhdCBhcmUgYXZhaWxhYmxlIGZvciB0aGlzIGNoYXJhY3Rlci5cblN0cmluZ0RlY29kZXIucHJvdG90eXBlLmRldGVjdEluY29tcGxldGVDaGFyID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gIC8vIGRldGVybWluZSBob3cgbWFueSBieXRlcyB3ZSBoYXZlIHRvIGNoZWNrIGF0IHRoZSBlbmQgb2YgdGhpcyBidWZmZXJcbiAgdmFyIGkgPSAoYnVmZmVyLmxlbmd0aCA+PSAzKSA/IDMgOiBidWZmZXIubGVuZ3RoO1xuXG4gIC8vIEZpZ3VyZSBvdXQgaWYgb25lIG9mIHRoZSBsYXN0IGkgYnl0ZXMgb2Ygb3VyIGJ1ZmZlciBhbm5vdW5jZXMgYW5cbiAgLy8gaW5jb21wbGV0ZSBjaGFyLlxuICBmb3IgKDsgaSA+IDA7IGktLSkge1xuICAgIHZhciBjID0gYnVmZmVyW2J1ZmZlci5sZW5ndGggLSBpXTtcblxuICAgIC8vIFNlZSBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1VURi04I0Rlc2NyaXB0aW9uXG5cbiAgICAvLyAxMTBYWFhYWFxuICAgIGlmIChpID09IDEgJiYgYyA+PiA1ID09IDB4MDYpIHtcbiAgICAgIHRoaXMuY2hhckxlbmd0aCA9IDI7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyAxMTEwWFhYWFxuICAgIGlmIChpIDw9IDIgJiYgYyA+PiA0ID09IDB4MEUpIHtcbiAgICAgIHRoaXMuY2hhckxlbmd0aCA9IDM7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyAxMTExMFhYWFxuICAgIGlmIChpIDw9IDMgJiYgYyA+PiAzID09IDB4MUUpIHtcbiAgICAgIHRoaXMuY2hhckxlbmd0aCA9IDQ7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSBpO1xufTtcblxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gIHZhciByZXMgPSAnJztcbiAgaWYgKGJ1ZmZlciAmJiBidWZmZXIubGVuZ3RoKVxuICAgIHJlcyA9IHRoaXMud3JpdGUoYnVmZmVyKTtcblxuICBpZiAodGhpcy5jaGFyUmVjZWl2ZWQpIHtcbiAgICB2YXIgY3IgPSB0aGlzLmNoYXJSZWNlaXZlZDtcbiAgICB2YXIgYnVmID0gdGhpcy5jaGFyQnVmZmVyO1xuICAgIHZhciBlbmMgPSB0aGlzLmVuY29kaW5nO1xuICAgIHJlcyArPSBidWYuc2xpY2UoMCwgY3IpLnRvU3RyaW5nKGVuYyk7XG4gIH1cblxuICByZXR1cm4gcmVzO1xufTtcblxuZnVuY3Rpb24gcGFzc1Rocm91Z2hXcml0ZShidWZmZXIpIHtcbiAgcmV0dXJuIGJ1ZmZlci50b1N0cmluZyh0aGlzLmVuY29kaW5nKTtcbn1cblxuZnVuY3Rpb24gdXRmMTZEZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpIHtcbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSBidWZmZXIubGVuZ3RoICUgMjtcbiAgdGhpcy5jaGFyTGVuZ3RoID0gdGhpcy5jaGFyUmVjZWl2ZWQgPyAyIDogMDtcbn1cblxuZnVuY3Rpb24gYmFzZTY0RGV0ZWN0SW5jb21wbGV0ZUNoYXIoYnVmZmVyKSB7XG4gIHRoaXMuY2hhclJlY2VpdmVkID0gYnVmZmVyLmxlbmd0aCAlIDM7XG4gIHRoaXMuY2hhckxlbmd0aCA9IHRoaXMuY2hhclJlY2VpdmVkID8gMyA6IDA7XG59XG4iLCJ2YXIgZGVmaW5lZCA9IHJlcXVpcmUoJ2RlZmluZWQnKTtcbnZhciBjcmVhdGVEZWZhdWx0U3RyZWFtID0gcmVxdWlyZSgnLi9saWIvZGVmYXVsdF9zdHJlYW0nKTtcbnZhciBUZXN0ID0gcmVxdWlyZSgnLi9saWIvdGVzdCcpO1xudmFyIGNyZWF0ZVJlc3VsdCA9IHJlcXVpcmUoJy4vbGliL3Jlc3VsdHMnKTtcbnZhciB0aHJvdWdoID0gcmVxdWlyZSgndGhyb3VnaCcpO1xuXG52YXIgY2FuRW1pdEV4aXQgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzc1xuICAgICYmIHR5cGVvZiBwcm9jZXNzLm9uID09PSAnZnVuY3Rpb24nICYmIHByb2Nlc3MuYnJvd3NlciAhPT0gdHJ1ZVxuO1xudmFyIGNhbkV4aXQgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzc1xuICAgICYmIHR5cGVvZiBwcm9jZXNzLmV4aXQgPT09ICdmdW5jdGlvbidcbjtcblxudmFyIG5leHRUaWNrID0gdHlwZW9mIHNldEltbWVkaWF0ZSAhPT0gJ3VuZGVmaW5lZCdcbiAgICA/IHNldEltbWVkaWF0ZVxuICAgIDogcHJvY2Vzcy5uZXh0VGlja1xuO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBoYXJuZXNzO1xuICAgIHZhciBsYXp5TG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGdldEhhcm5lc3MoKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gICAgXG4gICAgbGF6eUxvYWQub25seSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGdldEhhcm5lc3MoKS5vbmx5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBcbiAgICBsYXp5TG9hZC5jcmVhdGVTdHJlYW0gPSBmdW5jdGlvbiAob3B0cykge1xuICAgICAgICBpZiAoIW9wdHMpIG9wdHMgPSB7fTtcbiAgICAgICAgaWYgKCFoYXJuZXNzKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gdGhyb3VnaCgpO1xuICAgICAgICAgICAgZ2V0SGFybmVzcyh7IHN0cmVhbTogb3V0cHV0LCBvYmplY3RNb2RlOiBvcHRzLm9iamVjdE1vZGUgfSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYXJuZXNzLmNyZWF0ZVN0cmVhbShvcHRzKTtcbiAgICB9O1xuICAgIFxuICAgIGxhenlMb2FkLm9uRmluaXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZ2V0SGFybmVzcygpLm9uRmluaXNoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIGxhenlMb2FkLmdldEhhcm5lc3MgPSBnZXRIYXJuZXNzXG5cbiAgICByZXR1cm4gbGF6eUxvYWRcblxuICAgIGZ1bmN0aW9uIGdldEhhcm5lc3MgKG9wdHMpIHtcbiAgICAgICAgaWYgKCFvcHRzKSBvcHRzID0ge307XG4gICAgICAgIG9wdHMuYXV0b2Nsb3NlID0gIWNhbkVtaXRFeGl0O1xuICAgICAgICBpZiAoIWhhcm5lc3MpIGhhcm5lc3MgPSBjcmVhdGVFeGl0SGFybmVzcyhvcHRzKTtcbiAgICAgICAgcmV0dXJuIGhhcm5lc3M7XG4gICAgfVxufSkoKTtcblxuZnVuY3Rpb24gY3JlYXRlRXhpdEhhcm5lc3MgKGNvbmYpIHtcbiAgICBpZiAoIWNvbmYpIGNvbmYgPSB7fTtcbiAgICB2YXIgaGFybmVzcyA9IGNyZWF0ZUhhcm5lc3Moe1xuICAgICAgICBhdXRvY2xvc2U6IGRlZmluZWQoY29uZi5hdXRvY2xvc2UsIGZhbHNlKVxuICAgIH0pO1xuICAgIFxuICAgIHZhciBzdHJlYW0gPSBoYXJuZXNzLmNyZWF0ZVN0cmVhbSh7IG9iamVjdE1vZGU6IGNvbmYub2JqZWN0TW9kZSB9KTtcbiAgICB2YXIgZXMgPSBzdHJlYW0ucGlwZShjb25mLnN0cmVhbSB8fCBjcmVhdGVEZWZhdWx0U3RyZWFtKCkpO1xuICAgIGlmIChjYW5FbWl0RXhpdCkge1xuICAgICAgICBlcy5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7IGhhcm5lc3MuX2V4aXRDb2RlID0gMSB9KTtcbiAgICB9XG4gICAgXG4gICAgdmFyIGVuZGVkID0gZmFsc2U7XG4gICAgc3RyZWFtLm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7IGVuZGVkID0gdHJ1ZSB9KTtcbiAgICBcbiAgICBpZiAoY29uZi5leGl0ID09PSBmYWxzZSkgcmV0dXJuIGhhcm5lc3M7XG4gICAgaWYgKCFjYW5FbWl0RXhpdCB8fCAhY2FuRXhpdCkgcmV0dXJuIGhhcm5lc3M7XG5cbiAgICB2YXIgaW5FcnJvclN0YXRlID0gZmFsc2U7XG5cbiAgICBwcm9jZXNzLm9uKCdleGl0JywgZnVuY3Rpb24gKGNvZGUpIHtcbiAgICAgICAgLy8gbGV0IHRoZSBwcm9jZXNzIGV4aXQgY2xlYW5seS5cbiAgICAgICAgaWYgKGNvZGUgIT09IDApIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFlbmRlZCkge1xuICAgICAgICAgICAgdmFyIG9ubHkgPSBoYXJuZXNzLl9yZXN1bHRzLl9vbmx5O1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoYXJuZXNzLl90ZXN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciB0ID0gaGFybmVzcy5fdGVzdHNbaV07XG4gICAgICAgICAgICAgICAgaWYgKG9ubHkgJiYgdC5uYW1lICE9PSBvbmx5KSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB0Ll9leGl0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaGFybmVzcy5jbG9zZSgpO1xuICAgICAgICBwcm9jZXNzLmV4aXQoY29kZSB8fCBoYXJuZXNzLl9leGl0Q29kZSk7XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIGhhcm5lc3M7XG59XG5cbmV4cG9ydHMuY3JlYXRlSGFybmVzcyA9IGNyZWF0ZUhhcm5lc3M7XG5leHBvcnRzLlRlc3QgPSBUZXN0O1xuZXhwb3J0cy50ZXN0ID0gZXhwb3J0czsgLy8gdGFwIGNvbXBhdFxuZXhwb3J0cy50ZXN0LnNraXAgPSBUZXN0LnNraXA7XG5cbnZhciBleGl0SW50ZXJ2YWw7XG5cbmZ1bmN0aW9uIGNyZWF0ZUhhcm5lc3MgKGNvbmZfKSB7XG4gICAgaWYgKCFjb25mXykgY29uZl8gPSB7fTtcbiAgICB2YXIgcmVzdWx0cyA9IGNyZWF0ZVJlc3VsdCgpO1xuICAgIGlmIChjb25mXy5hdXRvY2xvc2UgIT09IGZhbHNlKSB7XG4gICAgICAgIHJlc3VsdHMub25jZSgnZG9uZScsIGZ1bmN0aW9uICgpIHsgcmVzdWx0cy5jbG9zZSgpIH0pO1xuICAgIH1cbiAgICBcbiAgICB2YXIgdGVzdCA9IGZ1bmN0aW9uIChuYW1lLCBjb25mLCBjYikge1xuICAgICAgICB2YXIgdCA9IG5ldyBUZXN0KG5hbWUsIGNvbmYsIGNiKTtcbiAgICAgICAgdGVzdC5fdGVzdHMucHVzaCh0KTtcbiAgICAgICAgXG4gICAgICAgIChmdW5jdGlvbiBpbnNwZWN0Q29kZSAoc3QpIHtcbiAgICAgICAgICAgIHN0Lm9uKCd0ZXN0JywgZnVuY3Rpb24gc3ViIChzdF8pIHtcbiAgICAgICAgICAgICAgICBpbnNwZWN0Q29kZShzdF8pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzdC5vbigncmVzdWx0JywgZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXIub2sgJiYgdHlwZW9mIHIgIT09ICdzdHJpbmcnKSB0ZXN0Ll9leGl0Q29kZSA9IDFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KSh0KTtcbiAgICAgICAgXG4gICAgICAgIHJlc3VsdHMucHVzaCh0KTtcbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICB0ZXN0Ll9yZXN1bHRzID0gcmVzdWx0cztcbiAgICBcbiAgICB0ZXN0Ll90ZXN0cyA9IFtdO1xuICAgIFxuICAgIHRlc3QuY3JlYXRlU3RyZWFtID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHMuY3JlYXRlU3RyZWFtKG9wdHMpO1xuICAgIH07XG5cbiAgICB0ZXN0Lm9uRmluaXNoID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgIHJlc3VsdHMub24oJ2RvbmUnLCBjYik7XG4gICAgfTtcbiAgICBcbiAgICB2YXIgb25seSA9IGZhbHNlO1xuICAgIHRlc3Qub25seSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIGlmIChvbmx5KSB0aHJvdyBuZXcgRXJyb3IoJ3RoZXJlIGNhbiBvbmx5IGJlIG9uZSBvbmx5IHRlc3QnKTtcbiAgICAgICAgcmVzdWx0cy5vbmx5KG5hbWUpO1xuICAgICAgICBvbmx5ID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRlc3QuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIHRlc3QuX2V4aXRDb2RlID0gMDtcbiAgICBcbiAgICB0ZXN0LmNsb3NlID0gZnVuY3Rpb24gKCkgeyByZXN1bHRzLmNsb3NlKCkgfTtcbiAgICBcbiAgICByZXR1cm4gdGVzdDtcbn1cbiIsInZhciB0aHJvdWdoID0gcmVxdWlyZSgndGhyb3VnaCcpO1xudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxpbmUgPSAnJztcbiAgICB2YXIgc3RyZWFtID0gdGhyb3VnaCh3cml0ZSwgZmx1c2gpO1xuICAgIHJldHVybiBzdHJlYW07XG4gICAgXG4gICAgZnVuY3Rpb24gd3JpdGUgKGJ1Zikge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1Zi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGMgPSB0eXBlb2YgYnVmID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgID8gYnVmLmNoYXJBdChpKVxuICAgICAgICAgICAgICAgIDogU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICAgICAgICA7XG4gICAgICAgICAgICBpZiAoYyA9PT0gJ1xcbicpIGZsdXNoKCk7XG4gICAgICAgICAgICBlbHNlIGxpbmUgKz0gYztcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBmbHVzaCAoKSB7XG4gICAgICAgIGlmIChmcy53cml0ZVN5bmMgJiYgL153aW4vLnRlc3QocHJvY2Vzcy5wbGF0Zm9ybSkpIHtcbiAgICAgICAgICAgIHRyeSB7IGZzLndyaXRlU3luYygxLCBsaW5lICsgJ1xcbicpOyB9XG4gICAgICAgICAgICBjYXRjaCAoZSkgeyBzdHJlYW0uZW1pdCgnZXJyb3InLCBlKSB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0cnkgeyBjb25zb2xlLmxvZyhsaW5lKSB9XG4gICAgICAgICAgICBjYXRjaCAoZSkgeyBzdHJlYW0uZW1pdCgnZXJyb3InLCBlKSB9XG4gICAgICAgIH1cbiAgICAgICAgbGluZSA9ICcnO1xuICAgIH1cbn07XG4iLCJ2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbnZhciB0aHJvdWdoID0gcmVxdWlyZSgndGhyb3VnaCcpO1xudmFyIHJlc3VtZXIgPSByZXF1aXJlKCdyZXN1bWVyJyk7XG52YXIgaW5zcGVjdCA9IHJlcXVpcmUoJ29iamVjdC1pbnNwZWN0Jyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJ2Z1bmN0aW9uLWJpbmQnKTtcbnZhciBoYXMgPSByZXF1aXJlKCdoYXMnKTtcbnZhciByZWdleHBUZXN0ID0gYmluZC5jYWxsKEZ1bmN0aW9uLmNhbGwsIFJlZ0V4cC5wcm90b3R5cGUudGVzdCk7XG52YXIgeWFtbEluZGljYXRvcnMgPSAvXFw6fFxcLXxcXD8vO1xudmFyIG5leHRUaWNrID0gdHlwZW9mIHNldEltbWVkaWF0ZSAhPT0gJ3VuZGVmaW5lZCdcbiAgICA/IHNldEltbWVkaWF0ZVxuICAgIDogcHJvY2Vzcy5uZXh0VGlja1xuO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3VsdHM7XG5pbmhlcml0cyhSZXN1bHRzLCBFdmVudEVtaXR0ZXIpO1xuXG5mdW5jdGlvbiBSZXN1bHRzICgpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmVzdWx0cykpIHJldHVybiBuZXcgUmVzdWx0cztcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICB0aGlzLmZhaWwgPSAwO1xuICAgIHRoaXMucGFzcyA9IDA7XG4gICAgdGhpcy5fc3RyZWFtID0gdGhyb3VnaCgpO1xuICAgIHRoaXMudGVzdHMgPSBbXTtcbn1cblxuUmVzdWx0cy5wcm90b3R5cGUuY3JlYXRlU3RyZWFtID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICBpZiAoIW9wdHMpIG9wdHMgPSB7fTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG91dHB1dCwgdGVzdElkID0gMDtcbiAgICBpZiAob3B0cy5vYmplY3RNb2RlKSB7XG4gICAgICAgIG91dHB1dCA9IHRocm91Z2goKTtcbiAgICAgICAgc2VsZi5vbignX3B1c2gnLCBmdW5jdGlvbiBvbnRlc3QgKHQsIGV4dHJhKSB7XG4gICAgICAgICAgICBpZiAoIWV4dHJhKSBleHRyYSA9IHt9O1xuICAgICAgICAgICAgdmFyIGlkID0gdGVzdElkKys7XG4gICAgICAgICAgICB0Lm9uY2UoJ3ByZXJ1bicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGVzdCcsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHQubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGlkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoaGFzKGV4dHJhLCAncGFyZW50JykpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93LnBhcmVudCA9IGV4dHJhLnBhcmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3V0cHV0LnF1ZXVlKHJvdyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHQub24oJ3Rlc3QnLCBmdW5jdGlvbiAoc3QpIHtcbiAgICAgICAgICAgICAgICBvbnRlc3Qoc3QsIHsgcGFyZW50OiBpZCB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdC5vbigncmVzdWx0JywgZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgIHJlcy50ZXN0ID0gaWQ7XG4gICAgICAgICAgICAgICAgcmVzLnR5cGUgPSAnYXNzZXJ0JztcbiAgICAgICAgICAgICAgICBvdXRwdXQucXVldWUocmVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdC5vbignZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG91dHB1dC5xdWV1ZSh7IHR5cGU6ICdlbmQnLCB0ZXN0OiBpZCB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgc2VsZi5vbignZG9uZScsIGZ1bmN0aW9uICgpIHsgb3V0cHV0LnF1ZXVlKG51bGwpIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgb3V0cHV0ID0gcmVzdW1lcigpO1xuICAgICAgICBvdXRwdXQucXVldWUoJ1RBUCB2ZXJzaW9uIDEzXFxuJyk7XG4gICAgICAgIHNlbGYuX3N0cmVhbS5waXBlKG91dHB1dCk7XG4gICAgfVxuICAgIFxuICAgIG5leHRUaWNrKGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgIHZhciB0O1xuICAgICAgICB3aGlsZSAodCA9IGdldE5leHRUZXN0KHNlbGYpKSB7XG4gICAgICAgICAgICB0LnJ1bigpO1xuICAgICAgICAgICAgaWYgKCF0LmVuZGVkKSByZXR1cm4gdC5vbmNlKCdlbmQnLCBmdW5jdGlvbigpeyBuZXh0VGljayhuZXh0KTsgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5lbWl0KCdkb25lJyk7XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cblJlc3VsdHMucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAodCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLnRlc3RzLnB1c2godCk7XG4gICAgc2VsZi5fd2F0Y2godCk7XG4gICAgc2VsZi5lbWl0KCdfcHVzaCcsIHQpO1xufTtcblxuUmVzdWx0cy5wcm90b3R5cGUub25seSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhpcy5fb25seSA9IG5hbWU7XG59O1xuXG5SZXN1bHRzLnByb3RvdHlwZS5fd2F0Y2ggPSBmdW5jdGlvbiAodCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgd3JpdGUgPSBmdW5jdGlvbiAocykgeyBzZWxmLl9zdHJlYW0ucXVldWUocykgfTtcbiAgICB0Lm9uY2UoJ3ByZXJ1bicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd3JpdGUoJyMgJyArIHQubmFtZSArICdcXG4nKTtcbiAgICB9KTtcbiAgICBcbiAgICB0Lm9uKCdyZXN1bHQnLCBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgd3JpdGUoJyMgJyArIHJlcyArICdcXG4nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB3cml0ZShlbmNvZGVSZXN1bHQocmVzLCBzZWxmLmNvdW50ICsgMSkpO1xuICAgICAgICBzZWxmLmNvdW50ICsrO1xuXG4gICAgICAgIGlmIChyZXMub2spIHNlbGYucGFzcyArK1xuICAgICAgICBlbHNlIHNlbGYuZmFpbCArK1xuICAgIH0pO1xuICAgIFxuICAgIHQub24oJ3Rlc3QnLCBmdW5jdGlvbiAoc3QpIHsgc2VsZi5fd2F0Y2goc3QpIH0pO1xufTtcblxuUmVzdWx0cy5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLmNsb3NlZCkgc2VsZi5fc3RyZWFtLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdBTFJFQURZIENMT1NFRCcpKTtcbiAgICBzZWxmLmNsb3NlZCA9IHRydWU7XG4gICAgdmFyIHdyaXRlID0gZnVuY3Rpb24gKHMpIHsgc2VsZi5fc3RyZWFtLnF1ZXVlKHMpIH07XG4gICAgXG4gICAgd3JpdGUoJ1xcbjEuLicgKyBzZWxmLmNvdW50ICsgJ1xcbicpO1xuICAgIHdyaXRlKCcjIHRlc3RzICcgKyBzZWxmLmNvdW50ICsgJ1xcbicpO1xuICAgIHdyaXRlKCcjIHBhc3MgICcgKyBzZWxmLnBhc3MgKyAnXFxuJyk7XG4gICAgaWYgKHNlbGYuZmFpbCkgd3JpdGUoJyMgZmFpbCAgJyArIHNlbGYuZmFpbCArICdcXG4nKVxuICAgIGVsc2Ugd3JpdGUoJ1xcbiMgb2tcXG4nKVxuXG4gICAgc2VsZi5fc3RyZWFtLnF1ZXVlKG51bGwpO1xufTtcblxuZnVuY3Rpb24gZW5jb2RlUmVzdWx0IChyZXMsIGNvdW50KSB7XG4gICAgdmFyIG91dHB1dCA9ICcnO1xuICAgIG91dHB1dCArPSAocmVzLm9rID8gJ29rICcgOiAnbm90IG9rICcpICsgY291bnQ7XG4gICAgb3V0cHV0ICs9IHJlcy5uYW1lID8gJyAnICsgcmVzLm5hbWUudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHMrL2csICcgJykgOiAnJztcbiAgICBcbiAgICBpZiAocmVzLnNraXApIG91dHB1dCArPSAnICMgU0tJUCc7XG4gICAgZWxzZSBpZiAocmVzLnRvZG8pIG91dHB1dCArPSAnICMgVE9ETyc7XG4gICAgXG4gICAgb3V0cHV0ICs9ICdcXG4nO1xuICAgIGlmIChyZXMub2spIHJldHVybiBvdXRwdXQ7XG4gICAgXG4gICAgdmFyIG91dGVyID0gJyAgJztcbiAgICB2YXIgaW5uZXIgPSBvdXRlciArICcgICc7XG4gICAgb3V0cHV0ICs9IG91dGVyICsgJy0tLVxcbic7XG4gICAgb3V0cHV0ICs9IGlubmVyICsgJ29wZXJhdG9yOiAnICsgcmVzLm9wZXJhdG9yICsgJ1xcbic7XG4gICAgXG4gICAgaWYgKGhhcyhyZXMsICdleHBlY3RlZCcpIHx8IGhhcyhyZXMsICdhY3R1YWwnKSkge1xuICAgICAgICB2YXIgZXggPSBpbnNwZWN0KHJlcy5leHBlY3RlZCk7XG4gICAgICAgIHZhciBhYyA9IGluc3BlY3QocmVzLmFjdHVhbCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoTWF0aC5tYXgoZXgubGVuZ3RoLCBhYy5sZW5ndGgpID4gNjUgfHwgaW52YWxpZFlhbWwoZXgpIHx8IGludmFsaWRZYW1sKGFjKSkge1xuICAgICAgICAgICAgb3V0cHV0ICs9IGlubmVyICsgJ2V4cGVjdGVkOiB8LVxcbicgKyBpbm5lciArICcgICcgKyBleCArICdcXG4nO1xuICAgICAgICAgICAgb3V0cHV0ICs9IGlubmVyICsgJ2FjdHVhbDogfC1cXG4nICsgaW5uZXIgKyAnICAnICsgYWMgKyAnXFxuJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG91dHB1dCArPSBpbm5lciArICdleHBlY3RlZDogJyArIGV4ICsgJ1xcbic7XG4gICAgICAgICAgICBvdXRwdXQgKz0gaW5uZXIgKyAnYWN0dWFsOiAgICcgKyBhYyArICdcXG4nO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChyZXMuYXQpIHtcbiAgICAgICAgb3V0cHV0ICs9IGlubmVyICsgJ2F0OiAnICsgcmVzLmF0ICsgJ1xcbic7XG4gICAgfVxuICAgIGlmIChyZXMub3BlcmF0b3IgPT09ICdlcnJvcicgJiYgcmVzLmFjdHVhbCAmJiByZXMuYWN0dWFsLnN0YWNrKSB7XG4gICAgICAgIHZhciBsaW5lcyA9IFN0cmluZyhyZXMuYWN0dWFsLnN0YWNrKS5zcGxpdCgnXFxuJyk7XG4gICAgICAgIG91dHB1dCArPSBpbm5lciArICdzdGFjazogfC1cXG4nO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBvdXRwdXQgKz0gaW5uZXIgKyAnICAnICsgbGluZXNbaV0gKyAnXFxuJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBvdXRwdXQgKz0gb3V0ZXIgKyAnLi4uXFxuJztcbiAgICByZXR1cm4gb3V0cHV0O1xufVxuXG5mdW5jdGlvbiBnZXROZXh0VGVzdCAocmVzdWx0cykge1xuICAgIGlmICghcmVzdWx0cy5fb25seSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0cy50ZXN0cy5zaGlmdCgpO1xuICAgIH1cbiAgICBcbiAgICBkbyB7XG4gICAgICAgIHZhciB0ID0gcmVzdWx0cy50ZXN0cy5zaGlmdCgpO1xuICAgICAgICBpZiAoIXQpIGNvbnRpbnVlO1xuICAgICAgICBpZiAocmVzdWx0cy5fb25seSA9PT0gdC5uYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdDtcbiAgICAgICAgfVxuICAgIH0gd2hpbGUgKHJlc3VsdHMudGVzdHMubGVuZ3RoICE9PSAwKVxufVxuXG5mdW5jdGlvbiBpbnZhbGlkWWFtbCAoc3RyKSB7XG4gICAgcmV0dXJuIHJlZ2V4cFRlc3QoeWFtbEluZGljYXRvcnMsIHN0cik7XG59XG4iLCJ2YXIgZGVlcEVxdWFsID0gcmVxdWlyZSgnZGVlcC1lcXVhbCcpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCdkZWZpbmVkJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xudmFyIGhhcyA9IHJlcXVpcmUoJ2hhcycpO1xudmFyIHRyaW0gPSByZXF1aXJlKCdzdHJpbmcucHJvdG90eXBlLnRyaW0nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXN0O1xuXG52YXIgbmV4dFRpY2sgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlICE9PSAndW5kZWZpbmVkJ1xuICAgID8gc2V0SW1tZWRpYXRlXG4gICAgOiBwcm9jZXNzLm5leHRUaWNrXG47XG5cbmluaGVyaXRzKFRlc3QsIEV2ZW50RW1pdHRlcik7XG5cbnZhciBnZXRUZXN0QXJncyA9IGZ1bmN0aW9uIChuYW1lXywgb3B0c18sIGNiXykge1xuICAgIHZhciBuYW1lID0gJyhhbm9ueW1vdXMpJztcbiAgICB2YXIgb3B0cyA9IHt9O1xuICAgIHZhciBjYjtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG4gICAgICAgIHZhciB0ID0gdHlwZW9mIGFyZztcbiAgICAgICAgaWYgKHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBuYW1lID0gYXJnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBvcHRzID0gYXJnIHx8IG9wdHM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2IgPSBhcmc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgbmFtZTogbmFtZSwgb3B0czogb3B0cywgY2I6IGNiIH07XG59O1xuXG5mdW5jdGlvbiBUZXN0IChuYW1lXywgb3B0c18sIGNiXykge1xuICAgIGlmICghICh0aGlzIGluc3RhbmNlb2YgVGVzdCkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUZXN0KG5hbWVfLCBvcHRzXywgY2JfKTtcbiAgICB9XG5cbiAgICB2YXIgYXJncyA9IGdldFRlc3RBcmdzKG5hbWVfLCBvcHRzXywgY2JfKTtcblxuICAgIHRoaXMucmVhZGFibGUgPSB0cnVlO1xuICAgIHRoaXMubmFtZSA9IGFyZ3MubmFtZSB8fCAnKGFub255bW91cyknO1xuICAgIHRoaXMuYXNzZXJ0Q291bnQgPSAwO1xuICAgIHRoaXMucGVuZGluZ0NvdW50ID0gMDtcbiAgICB0aGlzLl9za2lwID0gYXJncy5vcHRzLnNraXAgfHwgZmFsc2U7XG4gICAgdGhpcy5fdGltZW91dCA9IGFyZ3Mub3B0cy50aW1lb3V0O1xuICAgIHRoaXMuX3BsYW4gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fY2IgPSBhcmdzLmNiO1xuICAgIHRoaXMuX3Byb2dlbnkgPSBbXTtcbiAgICB0aGlzLl9vayA9IHRydWU7XG5cbiAgICBmb3IgKHZhciBwcm9wIGluIHRoaXMpIHtcbiAgICAgICAgdGhpc1twcm9wXSA9IChmdW5jdGlvbiBiaW5kKHNlbGYsIHZhbCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gYm91bmQoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWwuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gdmFsO1xuICAgICAgICB9KSh0aGlzLCB0aGlzW3Byb3BdKTtcbiAgICB9XG59XG5cblRlc3QucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fc2tpcCkge1xuICAgICAgICB0aGlzLmNvbW1lbnQoJ1NLSVAgJyArIHRoaXMubmFtZSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5fY2IgfHwgdGhpcy5fc2tpcCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZW5kKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLl90aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0QWZ0ZXIodGhpcy5fdGltZW91dCk7XG4gICAgfVxuICAgIHRoaXMuZW1pdCgncHJlcnVuJyk7XG4gICAgdGhpcy5fY2IodGhpcyk7XG4gICAgdGhpcy5lbWl0KCdydW4nKTtcbn07XG5cblRlc3QucHJvdG90eXBlLnRlc3QgPSBmdW5jdGlvbiAobmFtZSwgb3B0cywgY2IpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHQgPSBuZXcgVGVzdChuYW1lLCBvcHRzLCBjYik7XG4gICAgdGhpcy5fcHJvZ2VueS5wdXNoKHQpO1xuICAgIHRoaXMucGVuZGluZ0NvdW50Kys7XG4gICAgdGhpcy5lbWl0KCd0ZXN0JywgdCk7XG4gICAgdC5vbigncHJlcnVuJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLmFzc2VydENvdW50Kys7XG4gICAgfSlcbiAgICBcbiAgICBpZiAoIXNlbGYuX3BlbmRpbmdBc3NlcnRzKCkpIHtcbiAgICAgICAgbmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5fZW5kKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBuZXh0VGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCFzZWxmLl9wbGFuICYmIHNlbGYucGVuZGluZ0NvdW50ID09IHNlbGYuX3Byb2dlbnkubGVuZ3RoKSB7XG4gICAgICAgICAgICBzZWxmLl9lbmQoKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuVGVzdC5wcm90b3R5cGUuY29tbWVudCA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdHJpbShtc2cpLnNwbGl0KCdcXG4nKS5mb3JFYWNoKGZ1bmN0aW9uIChhTXNnKSB7XG4gICAgICAgIHRoYXQuZW1pdCgncmVzdWx0JywgdHJpbShhTXNnKS5yZXBsYWNlKC9eI1xccyovLCAnJykpO1xuICAgIH0pO1xufTtcblxuVGVzdC5wcm90b3R5cGUucGxhbiA9IGZ1bmN0aW9uIChuKSB7XG4gICAgdGhpcy5fcGxhbiA9IG47XG4gICAgdGhpcy5lbWl0KCdwbGFuJywgbik7XG59O1xuXG5UZXN0LnByb3RvdHlwZS50aW1lb3V0QWZ0ZXIgPSBmdW5jdGlvbihtcykge1xuICAgIGlmICghbXMpIHRocm93IG5ldyBFcnJvcigndGltZW91dEFmdGVyIHJlcXVpcmVzIGEgdGltZXNwYW4nKTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLmZhaWwoJ3Rlc3QgdGltZWQgb3V0IGFmdGVyICcgKyBtcyArICdtcycpO1xuICAgICAgICBzZWxmLmVuZCgpO1xuICAgIH0sIG1zKTtcbiAgICB0aGlzLm9uY2UoJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgfSk7XG59XG5cblRlc3QucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uIChlcnIpIHsgXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDEgJiYgISFlcnIpIHtcbiAgICAgICAgdGhpcy5pZkVycm9yKGVycik7XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLmNhbGxlZEVuZCkge1xuICAgICAgICB0aGlzLmZhaWwoJy5lbmQoKSBjYWxsZWQgdHdpY2UnKTtcbiAgICB9XG4gICAgdGhpcy5jYWxsZWRFbmQgPSB0cnVlO1xuICAgIHRoaXMuX2VuZCgpO1xufTtcblxuVGVzdC5wcm90b3R5cGUuX2VuZCA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHRoaXMuX3Byb2dlbnkubGVuZ3RoKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcy5fcHJvZ2VueS5zaGlmdCgpO1xuICAgICAgICB0Lm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7IHNlbGYuX2VuZCgpIH0pO1xuICAgICAgICB0LnJ1bigpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGlmICghdGhpcy5lbmRlZCkgdGhpcy5lbWl0KCdlbmQnKTtcbiAgICB2YXIgcGVuZGluZ0Fzc2VydHMgPSB0aGlzLl9wZW5kaW5nQXNzZXJ0cygpO1xuICAgIGlmICghdGhpcy5fcGxhbkVycm9yICYmIHRoaXMuX3BsYW4gIT09IHVuZGVmaW5lZCAmJiBwZW5kaW5nQXNzZXJ0cykge1xuICAgICAgICB0aGlzLl9wbGFuRXJyb3IgPSB0cnVlO1xuICAgICAgICB0aGlzLmZhaWwoJ3BsYW4gIT0gY291bnQnLCB7XG4gICAgICAgICAgICBleHBlY3RlZCA6IHRoaXMuX3BsYW4sXG4gICAgICAgICAgICBhY3R1YWwgOiB0aGlzLmFzc2VydENvdW50XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmVuZGVkID0gdHJ1ZTtcbn07XG5cblRlc3QucHJvdG90eXBlLl9leGl0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9wbGFuICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgIXRoaXMuX3BsYW5FcnJvciAmJiB0aGlzLmFzc2VydENvdW50ICE9PSB0aGlzLl9wbGFuKSB7XG4gICAgICAgIHRoaXMuX3BsYW5FcnJvciA9IHRydWU7XG4gICAgICAgIHRoaXMuZmFpbCgncGxhbiAhPSBjb3VudCcsIHtcbiAgICAgICAgICAgIGV4cGVjdGVkIDogdGhpcy5fcGxhbixcbiAgICAgICAgICAgIGFjdHVhbCA6IHRoaXMuYXNzZXJ0Q291bnQsXG4gICAgICAgICAgICBleGl0aW5nIDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIXRoaXMuZW5kZWQpIHtcbiAgICAgICAgdGhpcy5mYWlsKCd0ZXN0IGV4aXRlZCB3aXRob3V0IGVuZGluZycsIHtcbiAgICAgICAgICAgIGV4aXRpbmc6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuVGVzdC5wcm90b3R5cGUuX3BlbmRpbmdBc3NlcnRzID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9wbGFuID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGxhbiAtICh0aGlzLl9wcm9nZW55Lmxlbmd0aCArIHRoaXMuYXNzZXJ0Q291bnQpO1xuICAgIH1cbn07XG5cblRlc3QucHJvdG90eXBlLl9hc3NlcnQgPSBmdW5jdGlvbiBhc3NlcnQgKG9rLCBvcHRzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBleHRyYSA9IG9wdHMuZXh0cmEgfHwge307XG4gICAgXG4gICAgdmFyIHJlcyA9IHtcbiAgICAgICAgaWQgOiBzZWxmLmFzc2VydENvdW50ICsrLFxuICAgICAgICBvayA6IEJvb2xlYW4ob2spLFxuICAgICAgICBza2lwIDogZGVmaW5lZChleHRyYS5za2lwLCBvcHRzLnNraXApLFxuICAgICAgICBuYW1lIDogZGVmaW5lZChleHRyYS5tZXNzYWdlLCBvcHRzLm1lc3NhZ2UsICcodW5uYW1lZCBhc3NlcnQpJyksXG4gICAgICAgIG9wZXJhdG9yIDogZGVmaW5lZChleHRyYS5vcGVyYXRvciwgb3B0cy5vcGVyYXRvcilcbiAgICB9O1xuICAgIGlmIChoYXMob3B0cywgJ2FjdHVhbCcpIHx8IGhhcyhleHRyYSwgJ2FjdHVhbCcpKSB7XG4gICAgICAgIHJlcy5hY3R1YWwgPSBkZWZpbmVkKGV4dHJhLmFjdHVhbCwgb3B0cy5hY3R1YWwpO1xuICAgIH1cbiAgICBpZiAoaGFzKG9wdHMsICdleHBlY3RlZCcpIHx8IGhhcyhleHRyYSwgJ2V4cGVjdGVkJykpIHtcbiAgICAgICAgcmVzLmV4cGVjdGVkID0gZGVmaW5lZChleHRyYS5leHBlY3RlZCwgb3B0cy5leHBlY3RlZCk7XG4gICAgfVxuICAgIHRoaXMuX29rID0gQm9vbGVhbih0aGlzLl9vayAmJiBvayk7XG4gICAgXG4gICAgaWYgKCFvaykge1xuICAgICAgICByZXMuZXJyb3IgPSBkZWZpbmVkKGV4dHJhLmVycm9yLCBvcHRzLmVycm9yLCBuZXcgRXJyb3IocmVzLm5hbWUpKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKCFvaykge1xuICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcignZXhjZXB0aW9uJyk7XG4gICAgICAgIHZhciBlcnIgPSAoZS5zdGFjayB8fCAnJykuc3BsaXQoJ1xcbicpO1xuICAgICAgICB2YXIgZGlyID0gcGF0aC5kaXJuYW1lKF9fZGlybmFtZSkgKyAnLyc7XG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG0gPSAvXlteXFxzXSpcXHMqXFxiYXRcXHMrKC4rKS8uZXhlYyhlcnJbaV0pO1xuICAgICAgICAgICAgaWYgKCFtKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzID0gbVsxXS5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgICAgdmFyIGZpbGVtID0gLyhcXC9bXjpcXHNdKzooXFxkKykoPzo6KFxcZCspKT8pLy5leGVjKHNbMV0pO1xuICAgICAgICAgICAgaWYgKCFmaWxlbSkge1xuICAgICAgICAgICAgICAgIGZpbGVtID0gLyhcXC9bXjpcXHNdKzooXFxkKykoPzo6KFxcZCspKT8pLy5leGVjKHNbMl0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICghZmlsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZW0gPSAvKFxcL1teOlxcc10rOihcXGQrKSg/OjooXFxkKykpPykvLmV4ZWMoc1szXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmaWxlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChmaWxlbVsxXS5zbGljZSgwLCBkaXIubGVuZ3RoKSA9PT0gZGlyKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlcy5mdW5jdGlvbk5hbWUgPSBzWzBdO1xuICAgICAgICAgICAgcmVzLmZpbGUgPSBmaWxlbVsxXTtcbiAgICAgICAgICAgIHJlcy5saW5lID0gTnVtYmVyKGZpbGVtWzJdKTtcbiAgICAgICAgICAgIGlmIChmaWxlbVszXSkgcmVzLmNvbHVtbiA9IGZpbGVtWzNdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXMuYXQgPSBtWzFdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxmLmVtaXQoJ3Jlc3VsdCcsIHJlcyk7XG4gICAgXG4gICAgdmFyIHBlbmRpbmdBc3NlcnRzID0gc2VsZi5fcGVuZGluZ0Fzc2VydHMoKTtcbiAgICBpZiAoIXBlbmRpbmdBc3NlcnRzKSB7XG4gICAgICAgIGlmIChleHRyYS5leGl0aW5nKSB7XG4gICAgICAgICAgICBzZWxmLl9lbmQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9lbmQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGlmICghc2VsZi5fcGxhbkVycm9yICYmIHBlbmRpbmdBc3NlcnRzIDwgMCkge1xuICAgICAgICBzZWxmLl9wbGFuRXJyb3IgPSB0cnVlO1xuICAgICAgICBzZWxmLmZhaWwoJ3BsYW4gIT0gY291bnQnLCB7XG4gICAgICAgICAgICBleHBlY3RlZCA6IHNlbGYuX3BsYW4sXG4gICAgICAgICAgICBhY3R1YWwgOiBzZWxmLl9wbGFuIC0gcGVuZGluZ0Fzc2VydHNcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuVGVzdC5wcm90b3R5cGUuZmFpbCA9IGZ1bmN0aW9uIChtc2csIGV4dHJhKSB7XG4gICAgdGhpcy5fYXNzZXJ0KGZhbHNlLCB7XG4gICAgICAgIG1lc3NhZ2UgOiBtc2csXG4gICAgICAgIG9wZXJhdG9yIDogJ2ZhaWwnLFxuICAgICAgICBleHRyYSA6IGV4dHJhXG4gICAgfSk7XG59O1xuXG5UZXN0LnByb3RvdHlwZS5wYXNzID0gZnVuY3Rpb24gKG1zZywgZXh0cmEpIHtcbiAgICB0aGlzLl9hc3NlcnQodHJ1ZSwge1xuICAgICAgICBtZXNzYWdlIDogbXNnLFxuICAgICAgICBvcGVyYXRvciA6ICdwYXNzJyxcbiAgICAgICAgZXh0cmEgOiBleHRyYVxuICAgIH0pO1xufTtcblxuVGVzdC5wcm90b3R5cGUuc2tpcCA9IGZ1bmN0aW9uIChtc2csIGV4dHJhKSB7XG4gICAgdGhpcy5fYXNzZXJ0KHRydWUsIHtcbiAgICAgICAgbWVzc2FnZSA6IG1zZyxcbiAgICAgICAgb3BlcmF0b3IgOiAnc2tpcCcsXG4gICAgICAgIHNraXAgOiB0cnVlLFxuICAgICAgICBleHRyYSA6IGV4dHJhXG4gICAgfSk7XG59O1xuXG5UZXN0LnByb3RvdHlwZS5va1xuPSBUZXN0LnByb3RvdHlwZVsndHJ1ZSddXG49IFRlc3QucHJvdG90eXBlLmFzc2VydFxuPSBmdW5jdGlvbiAodmFsdWUsIG1zZywgZXh0cmEpIHtcbiAgICB0aGlzLl9hc3NlcnQodmFsdWUsIHtcbiAgICAgICAgbWVzc2FnZSA6IG1zZyxcbiAgICAgICAgb3BlcmF0b3IgOiAnb2snLFxuICAgICAgICBleHBlY3RlZCA6IHRydWUsXG4gICAgICAgIGFjdHVhbCA6IHZhbHVlLFxuICAgICAgICBleHRyYSA6IGV4dHJhXG4gICAgfSk7XG59O1xuXG5UZXN0LnByb3RvdHlwZS5ub3RPa1xuPSBUZXN0LnByb3RvdHlwZVsnZmFsc2UnXVxuPSBUZXN0LnByb3RvdHlwZS5ub3Rva1xuPSBmdW5jdGlvbiAodmFsdWUsIG1zZywgZXh0cmEpIHtcbiAgICB0aGlzLl9hc3NlcnQoIXZhbHVlLCB7XG4gICAgICAgIG1lc3NhZ2UgOiBtc2csXG4gICAgICAgIG9wZXJhdG9yIDogJ25vdE9rJyxcbiAgICAgICAgZXhwZWN0ZWQgOiBmYWxzZSxcbiAgICAgICAgYWN0dWFsIDogdmFsdWUsXG4gICAgICAgIGV4dHJhIDogZXh0cmFcbiAgICB9KTtcbn07XG5cblRlc3QucHJvdG90eXBlLmVycm9yXG49IFRlc3QucHJvdG90eXBlLmlmRXJyb3Jcbj0gVGVzdC5wcm90b3R5cGUuaWZFcnJcbj0gVGVzdC5wcm90b3R5cGUuaWZlcnJvclxuPSBmdW5jdGlvbiAoZXJyLCBtc2csIGV4dHJhKSB7XG4gICAgdGhpcy5fYXNzZXJ0KCFlcnIsIHtcbiAgICAgICAgbWVzc2FnZSA6IGRlZmluZWQobXNnLCBTdHJpbmcoZXJyKSksXG4gICAgICAgIG9wZXJhdG9yIDogJ2Vycm9yJyxcbiAgICAgICAgYWN0dWFsIDogZXJyLFxuICAgICAgICBleHRyYSA6IGV4dHJhXG4gICAgfSk7XG59O1xuXG5UZXN0LnByb3RvdHlwZS5lcXVhbFxuPSBUZXN0LnByb3RvdHlwZS5lcXVhbHNcbj0gVGVzdC5wcm90b3R5cGUuaXNFcXVhbFxuPSBUZXN0LnByb3RvdHlwZS5pc1xuPSBUZXN0LnByb3RvdHlwZS5zdHJpY3RFcXVhbFxuPSBUZXN0LnByb3RvdHlwZS5zdHJpY3RFcXVhbHNcbj0gZnVuY3Rpb24gKGEsIGIsIG1zZywgZXh0cmEpIHtcbiAgICB0aGlzLl9hc3NlcnQoYSA9PT0gYiwge1xuICAgICAgICBtZXNzYWdlIDogZGVmaW5lZChtc2csICdzaG91bGQgYmUgZXF1YWwnKSxcbiAgICAgICAgb3BlcmF0b3IgOiAnZXF1YWwnLFxuICAgICAgICBhY3R1YWwgOiBhLFxuICAgICAgICBleHBlY3RlZCA6IGIsXG4gICAgICAgIGV4dHJhIDogZXh0cmFcbiAgICB9KTtcbn07XG5cblRlc3QucHJvdG90eXBlLm5vdEVxdWFsXG49IFRlc3QucHJvdG90eXBlLm5vdEVxdWFsc1xuPSBUZXN0LnByb3RvdHlwZS5ub3RTdHJpY3RFcXVhbFxuPSBUZXN0LnByb3RvdHlwZS5ub3RTdHJpY3RFcXVhbHNcbj0gVGVzdC5wcm90b3R5cGUuaXNOb3RFcXVhbFxuPSBUZXN0LnByb3RvdHlwZS5pc05vdFxuPSBUZXN0LnByb3RvdHlwZS5ub3Rcbj0gVGVzdC5wcm90b3R5cGUuZG9lc05vdEVxdWFsXG49IFRlc3QucHJvdG90eXBlLmlzSW5lcXVhbFxuPSBmdW5jdGlvbiAoYSwgYiwgbXNnLCBleHRyYSkge1xuICAgIHRoaXMuX2Fzc2VydChhICE9PSBiLCB7XG4gICAgICAgIG1lc3NhZ2UgOiBkZWZpbmVkKG1zZywgJ3Nob3VsZCBub3QgYmUgZXF1YWwnKSxcbiAgICAgICAgb3BlcmF0b3IgOiAnbm90RXF1YWwnLFxuICAgICAgICBhY3R1YWwgOiBhLFxuICAgICAgICBub3RFeHBlY3RlZCA6IGIsXG4gICAgICAgIGV4dHJhIDogZXh0cmFcbiAgICB9KTtcbn07XG5cblRlc3QucHJvdG90eXBlLmRlZXBFcXVhbFxuPSBUZXN0LnByb3RvdHlwZS5kZWVwRXF1YWxzXG49IFRlc3QucHJvdG90eXBlLmlzRXF1aXZhbGVudFxuPSBUZXN0LnByb3RvdHlwZS5zYW1lXG49IGZ1bmN0aW9uIChhLCBiLCBtc2csIGV4dHJhKSB7XG4gICAgdGhpcy5fYXNzZXJ0KGRlZXBFcXVhbChhLCBiLCB7IHN0cmljdDogdHJ1ZSB9KSwge1xuICAgICAgICBtZXNzYWdlIDogZGVmaW5lZChtc2csICdzaG91bGQgYmUgZXF1aXZhbGVudCcpLFxuICAgICAgICBvcGVyYXRvciA6ICdkZWVwRXF1YWwnLFxuICAgICAgICBhY3R1YWwgOiBhLFxuICAgICAgICBleHBlY3RlZCA6IGIsXG4gICAgICAgIGV4dHJhIDogZXh0cmFcbiAgICB9KTtcbn07XG5cblRlc3QucHJvdG90eXBlLmRlZXBMb29zZUVxdWFsXG49IFRlc3QucHJvdG90eXBlLmxvb3NlRXF1YWxcbj0gVGVzdC5wcm90b3R5cGUubG9vc2VFcXVhbHNcbj0gZnVuY3Rpb24gKGEsIGIsIG1zZywgZXh0cmEpIHtcbiAgICB0aGlzLl9hc3NlcnQoZGVlcEVxdWFsKGEsIGIpLCB7XG4gICAgICAgIG1lc3NhZ2UgOiBkZWZpbmVkKG1zZywgJ3Nob3VsZCBiZSBlcXVpdmFsZW50JyksXG4gICAgICAgIG9wZXJhdG9yIDogJ2RlZXBMb29zZUVxdWFsJyxcbiAgICAgICAgYWN0dWFsIDogYSxcbiAgICAgICAgZXhwZWN0ZWQgOiBiLFxuICAgICAgICBleHRyYSA6IGV4dHJhXG4gICAgfSk7XG59O1xuXG5UZXN0LnByb3RvdHlwZS5ub3REZWVwRXF1YWxcbj0gVGVzdC5wcm90b3R5cGUubm90RXF1aXZhbGVudFxuPSBUZXN0LnByb3RvdHlwZS5ub3REZWVwbHlcbj0gVGVzdC5wcm90b3R5cGUubm90U2FtZVxuPSBUZXN0LnByb3RvdHlwZS5pc05vdERlZXBFcXVhbFxuPSBUZXN0LnByb3RvdHlwZS5pc05vdERlZXBseVxuPSBUZXN0LnByb3RvdHlwZS5pc05vdEVxdWl2YWxlbnRcbj0gVGVzdC5wcm90b3R5cGUuaXNJbmVxdWl2YWxlbnRcbj0gZnVuY3Rpb24gKGEsIGIsIG1zZywgZXh0cmEpIHtcbiAgICB0aGlzLl9hc3NlcnQoIWRlZXBFcXVhbChhLCBiLCB7IHN0cmljdDogdHJ1ZSB9KSwge1xuICAgICAgICBtZXNzYWdlIDogZGVmaW5lZChtc2csICdzaG91bGQgbm90IGJlIGVxdWl2YWxlbnQnKSxcbiAgICAgICAgb3BlcmF0b3IgOiAnbm90RGVlcEVxdWFsJyxcbiAgICAgICAgYWN0dWFsIDogYSxcbiAgICAgICAgbm90RXhwZWN0ZWQgOiBiLFxuICAgICAgICBleHRyYSA6IGV4dHJhXG4gICAgfSk7XG59O1xuXG5UZXN0LnByb3RvdHlwZS5ub3REZWVwTG9vc2VFcXVhbFxuPSBUZXN0LnByb3RvdHlwZS5ub3RMb29zZUVxdWFsXG49IFRlc3QucHJvdG90eXBlLm5vdExvb3NlRXF1YWxzXG49IGZ1bmN0aW9uIChhLCBiLCBtc2csIGV4dHJhKSB7XG4gICAgdGhpcy5fYXNzZXJ0KCFkZWVwRXF1YWwoYSwgYiksIHtcbiAgICAgICAgbWVzc2FnZSA6IGRlZmluZWQobXNnLCAnc2hvdWxkIGJlIGVxdWl2YWxlbnQnKSxcbiAgICAgICAgb3BlcmF0b3IgOiAnbm90RGVlcExvb3NlRXF1YWwnLFxuICAgICAgICBhY3R1YWwgOiBhLFxuICAgICAgICBleHBlY3RlZCA6IGIsXG4gICAgICAgIGV4dHJhIDogZXh0cmFcbiAgICB9KTtcbn07XG5cblRlc3QucHJvdG90eXBlWyd0aHJvd3MnXSA9IGZ1bmN0aW9uIChmbiwgZXhwZWN0ZWQsIG1zZywgZXh0cmEpIHtcbiAgICBpZiAodHlwZW9mIGV4cGVjdGVkID09PSAnc3RyaW5nJykge1xuICAgICAgICBtc2cgPSBleHBlY3RlZDtcbiAgICAgICAgZXhwZWN0ZWQgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdmFyIGNhdWdodCA9IHVuZGVmaW5lZDtcblxuICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNhdWdodCA9IHsgZXJyb3IgOiBlcnIgfTtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBlcnIubWVzc2FnZTtcbiAgICAgICAgZGVsZXRlIGVyci5tZXNzYWdlO1xuICAgICAgICBlcnIubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgfVxuXG4gICAgdmFyIHBhc3NlZCA9IGNhdWdodDtcblxuICAgIGlmIChleHBlY3RlZCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICBwYXNzZWQgPSBleHBlY3RlZC50ZXN0KGNhdWdodCAmJiBjYXVnaHQuZXJyb3IpO1xuICAgICAgICBleHBlY3RlZCA9IFN0cmluZyhleHBlY3RlZCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBleHBlY3RlZCA9PT0gJ2Z1bmN0aW9uJyAmJiBjYXVnaHQpIHtcbiAgICAgICAgcGFzc2VkID0gY2F1Z2h0LmVycm9yIGluc3RhbmNlb2YgZXhwZWN0ZWQ7XG4gICAgICAgIGNhdWdodC5lcnJvciA9IGNhdWdodC5lcnJvci5jb25zdHJ1Y3RvcjtcbiAgICB9XG5cbiAgICB0aGlzLl9hc3NlcnQodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nICYmIHBhc3NlZCwge1xuICAgICAgICBtZXNzYWdlIDogZGVmaW5lZChtc2csICdzaG91bGQgdGhyb3cnKSxcbiAgICAgICAgb3BlcmF0b3IgOiAndGhyb3dzJyxcbiAgICAgICAgYWN0dWFsIDogY2F1Z2h0ICYmIGNhdWdodC5lcnJvcixcbiAgICAgICAgZXhwZWN0ZWQgOiBleHBlY3RlZCxcbiAgICAgICAgZXJyb3I6ICFwYXNzZWQgJiYgY2F1Z2h0ICYmIGNhdWdodC5lcnJvcixcbiAgICAgICAgZXh0cmEgOiBleHRyYVxuICAgIH0pO1xufTtcblxuVGVzdC5wcm90b3R5cGUuZG9lc05vdFRocm93ID0gZnVuY3Rpb24gKGZuLCBleHBlY3RlZCwgbXNnLCBleHRyYSkge1xuICAgIGlmICh0eXBlb2YgZXhwZWN0ZWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG1zZyA9IGV4cGVjdGVkO1xuICAgICAgICBleHBlY3RlZCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdmFyIGNhdWdodCA9IHVuZGVmaW5lZDtcbiAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNhdWdodCA9IHsgZXJyb3IgOiBlcnIgfTtcbiAgICB9XG4gICAgdGhpcy5fYXNzZXJ0KCFjYXVnaHQsIHtcbiAgICAgICAgbWVzc2FnZSA6IGRlZmluZWQobXNnLCAnc2hvdWxkIG5vdCB0aHJvdycpLFxuICAgICAgICBvcGVyYXRvciA6ICd0aHJvd3MnLFxuICAgICAgICBhY3R1YWwgOiBjYXVnaHQgJiYgY2F1Z2h0LmVycm9yLFxuICAgICAgICBleHBlY3RlZCA6IGV4cGVjdGVkLFxuICAgICAgICBlcnJvciA6IGNhdWdodCAmJiBjYXVnaHQuZXJyb3IsXG4gICAgICAgIGV4dHJhIDogZXh0cmFcbiAgICB9KTtcbn07XG5cblRlc3Quc2tpcCA9IGZ1bmN0aW9uIChuYW1lXywgX29wdHMsIF9jYikge1xuICAgIHZhciBhcmdzID0gZ2V0VGVzdEFyZ3MuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICBhcmdzLm9wdHMuc2tpcCA9IHRydWU7XG4gICAgcmV0dXJuIFRlc3QoYXJncy5uYW1lLCBhcmdzLm9wdHMsIGFyZ3MuY2IpO1xufTtcblxuLy8gdmltOiBzZXQgc29mdHRhYnN0b3A9NCBzaGlmdHdpZHRoPTQ6XG5cbiIsInZhciBTdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKVxuXG4vLyB0aHJvdWdoXG4vL1xuLy8gYSBzdHJlYW0gdGhhdCBkb2VzIG5vdGhpbmcgYnV0IHJlLWVtaXQgdGhlIGlucHV0LlxuLy8gdXNlZnVsIGZvciBhZ2dyZWdhdGluZyBhIHNlcmllcyBvZiBjaGFuZ2luZyBidXQgbm90IGVuZGluZyBzdHJlYW1zIGludG8gb25lIHN0cmVhbSlcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gdGhyb3VnaFxudGhyb3VnaC50aHJvdWdoID0gdGhyb3VnaFxuXG4vL2NyZWF0ZSBhIHJlYWRhYmxlIHdyaXRhYmxlIHN0cmVhbS5cblxuZnVuY3Rpb24gdGhyb3VnaCAod3JpdGUsIGVuZCwgb3B0cykge1xuICB3cml0ZSA9IHdyaXRlIHx8IGZ1bmN0aW9uIChkYXRhKSB7IHRoaXMucXVldWUoZGF0YSkgfVxuICBlbmQgPSBlbmQgfHwgZnVuY3Rpb24gKCkgeyB0aGlzLnF1ZXVlKG51bGwpIH1cblxuICB2YXIgZW5kZWQgPSBmYWxzZSwgZGVzdHJveWVkID0gZmFsc2UsIGJ1ZmZlciA9IFtdLCBfZW5kZWQgPSBmYWxzZVxuICB2YXIgc3RyZWFtID0gbmV3IFN0cmVhbSgpXG4gIHN0cmVhbS5yZWFkYWJsZSA9IHN0cmVhbS53cml0YWJsZSA9IHRydWVcbiAgc3RyZWFtLnBhdXNlZCA9IGZhbHNlXG5cbi8vICBzdHJlYW0uYXV0b1BhdXNlICAgPSAhKG9wdHMgJiYgb3B0cy5hdXRvUGF1c2UgICA9PT0gZmFsc2UpXG4gIHN0cmVhbS5hdXRvRGVzdHJveSA9ICEob3B0cyAmJiBvcHRzLmF1dG9EZXN0cm95ID09PSBmYWxzZSlcblxuICBzdHJlYW0ud3JpdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHdyaXRlLmNhbGwodGhpcywgZGF0YSlcbiAgICByZXR1cm4gIXN0cmVhbS5wYXVzZWRcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYWluKCkge1xuICAgIHdoaWxlKGJ1ZmZlci5sZW5ndGggJiYgIXN0cmVhbS5wYXVzZWQpIHtcbiAgICAgIHZhciBkYXRhID0gYnVmZmVyLnNoaWZ0KClcbiAgICAgIGlmKG51bGwgPT09IGRhdGEpXG4gICAgICAgIHJldHVybiBzdHJlYW0uZW1pdCgnZW5kJylcbiAgICAgIGVsc2VcbiAgICAgICAgc3RyZWFtLmVtaXQoJ2RhdGEnLCBkYXRhKVxuICAgIH1cbiAgfVxuXG4gIHN0cmVhbS5xdWV1ZSA9IHN0cmVhbS5wdXNoID0gZnVuY3Rpb24gKGRhdGEpIHtcbi8vICAgIGNvbnNvbGUuZXJyb3IoZW5kZWQpXG4gICAgaWYoX2VuZGVkKSByZXR1cm4gc3RyZWFtXG4gICAgaWYoZGF0YSA9PT0gbnVsbCkgX2VuZGVkID0gdHJ1ZVxuICAgIGJ1ZmZlci5wdXNoKGRhdGEpXG4gICAgZHJhaW4oKVxuICAgIHJldHVybiBzdHJlYW1cbiAgfVxuXG4gIC8vdGhpcyB3aWxsIGJlIHJlZ2lzdGVyZWQgYXMgdGhlIGZpcnN0ICdlbmQnIGxpc3RlbmVyXG4gIC8vbXVzdCBjYWxsIGRlc3Ryb3kgbmV4dCB0aWNrLCB0byBtYWtlIHN1cmUgd2UncmUgYWZ0ZXIgYW55XG4gIC8vc3RyZWFtIHBpcGVkIGZyb20gaGVyZS5cbiAgLy90aGlzIGlzIG9ubHkgYSBwcm9ibGVtIGlmIGVuZCBpcyBub3QgZW1pdHRlZCBzeW5jaHJvbm91c2x5LlxuICAvL2EgbmljZXIgd2F5IHRvIGRvIHRoaXMgaXMgdG8gbWFrZSBzdXJlIHRoaXMgaXMgdGhlIGxhc3QgbGlzdGVuZXIgZm9yICdlbmQnXG5cbiAgc3RyZWFtLm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgc3RyZWFtLnJlYWRhYmxlID0gZmFsc2VcbiAgICBpZighc3RyZWFtLndyaXRhYmxlICYmIHN0cmVhbS5hdXRvRGVzdHJveSlcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBzdHJlYW0uZGVzdHJveSgpXG4gICAgICB9KVxuICB9KVxuXG4gIGZ1bmN0aW9uIF9lbmQgKCkge1xuICAgIHN0cmVhbS53cml0YWJsZSA9IGZhbHNlXG4gICAgZW5kLmNhbGwoc3RyZWFtKVxuICAgIGlmKCFzdHJlYW0ucmVhZGFibGUgJiYgc3RyZWFtLmF1dG9EZXN0cm95KVxuICAgICAgc3RyZWFtLmRlc3Ryb3koKVxuICB9XG5cbiAgc3RyZWFtLmVuZCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgaWYoZW5kZWQpIHJldHVyblxuICAgIGVuZGVkID0gdHJ1ZVxuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGgpIHN0cmVhbS53cml0ZShkYXRhKVxuICAgIF9lbmQoKSAvLyB3aWxsIGVtaXQgb3IgcXVldWVcbiAgICByZXR1cm4gc3RyZWFtXG4gIH1cblxuICBzdHJlYW0uZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZihkZXN0cm95ZWQpIHJldHVyblxuICAgIGRlc3Ryb3llZCA9IHRydWVcbiAgICBlbmRlZCA9IHRydWVcbiAgICBidWZmZXIubGVuZ3RoID0gMFxuICAgIHN0cmVhbS53cml0YWJsZSA9IHN0cmVhbS5yZWFkYWJsZSA9IGZhbHNlXG4gICAgc3RyZWFtLmVtaXQoJ2Nsb3NlJylcbiAgICByZXR1cm4gc3RyZWFtXG4gIH1cblxuICBzdHJlYW0ucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYoc3RyZWFtLnBhdXNlZCkgcmV0dXJuXG4gICAgc3RyZWFtLnBhdXNlZCA9IHRydWVcbiAgICByZXR1cm4gc3RyZWFtXG4gIH1cblxuICBzdHJlYW0ucmVzdW1lID0gZnVuY3Rpb24gKCkge1xuICAgIGlmKHN0cmVhbS5wYXVzZWQpIHtcbiAgICAgIHN0cmVhbS5wYXVzZWQgPSBmYWxzZVxuICAgICAgc3RyZWFtLmVtaXQoJ3Jlc3VtZScpXG4gICAgfVxuICAgIGRyYWluKClcbiAgICAvL21heSBoYXZlIGJlY29tZSBwYXVzZWQgYWdhaW4sXG4gICAgLy9hcyBkcmFpbiBlbWl0cyAnZGF0YScuXG4gICAgaWYoIXN0cmVhbS5wYXVzZWQpXG4gICAgICBzdHJlYW0uZW1pdCgnZHJhaW4nKVxuICAgIHJldHVybiBzdHJlYW1cbiAgfVxuICByZXR1cm4gc3RyZWFtXG59XG5cbiIsIlxuLyoqXG4gKiBNb2R1bGUgZXhwb3J0cy5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlcHJlY2F0ZTtcblxuLyoqXG4gKiBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuICogUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbiAqXG4gKiBJZiBgbG9jYWxTdG9yYWdlLm5vRGVwcmVjYXRpb24gPSB0cnVlYCBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbiAqXG4gKiBJZiBgbG9jYWxTdG9yYWdlLnRocm93RGVwcmVjYXRpb24gPSB0cnVlYCBpcyBzZXQsIHRoZW4gZGVwcmVjYXRlZCBmdW5jdGlvbnNcbiAqIHdpbGwgdGhyb3cgYW4gRXJyb3Igd2hlbiBpbnZva2VkLlxuICpcbiAqIElmIGBsb2NhbFN0b3JhZ2UudHJhY2VEZXByZWNhdGlvbiA9IHRydWVgIGlzIHNldCwgdGhlbiBkZXByZWNhdGVkIGZ1bmN0aW9uc1xuICogd2lsbCBpbnZva2UgYGNvbnNvbGUudHJhY2UoKWAgaW5zdGVhZCBvZiBgY29uc29sZS5lcnJvcigpYC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiAtIHRoZSBmdW5jdGlvbiB0byBkZXByZWNhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBtc2cgLSB0aGUgc3RyaW5nIHRvIHByaW50IHRvIHRoZSBjb25zb2xlIHdoZW4gYGZuYCBpcyBpbnZva2VkXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IGEgbmV3IFwiZGVwcmVjYXRlZFwiIHZlcnNpb24gb2YgYGZuYFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkZXByZWNhdGUgKGZuLCBtc2cpIHtcbiAgaWYgKGNvbmZpZygnbm9EZXByZWNhdGlvbicpKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAoY29uZmlnKCd0aHJvd0RlcHJlY2F0aW9uJykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKGNvbmZpZygndHJhY2VEZXByZWNhdGlvbicpKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2Fybihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgYGxvY2FsU3RvcmFnZWAgZm9yIGJvb2xlYW4gdmFsdWVzIGZvciB0aGUgZ2l2ZW4gYG5hbWVgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGNvbmZpZyAobmFtZSkge1xuICAvLyBhY2Nlc3NpbmcgZ2xvYmFsLmxvY2FsU3RvcmFnZSBjYW4gdHJpZ2dlciBhIERPTUV4Y2VwdGlvbiBpbiBzYW5kYm94ZWQgaWZyYW1lc1xuICB0cnkge1xuICAgIGlmICghZ2xvYmFsLmxvY2FsU3RvcmFnZSkgcmV0dXJuIGZhbHNlO1xuICB9IGNhdGNoIChfKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB2YWwgPSBnbG9iYWwubG9jYWxTdG9yYWdlW25hbWVdO1xuICBpZiAobnVsbCA9PSB2YWwpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIFN0cmluZyh2YWwpLnRvTG93ZXJDYXNlKCkgPT09ICd0cnVlJztcbn1cbiIsInZhciBjc3MgPSBcImJvZHksXFxuaHRtbCB7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGZvbnQtc2l6ZTogMS4yNWVtO1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGZvbnQtZmFtaWx5OiBhcmlhbDtcXG4gIGNvbG9yOiAjNDQ0NDQ0O1xcbn1cXG4uZGFzaGdyaWRDb250YWluZXIge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgLyp0b3A6IDElOyovXFxuICAvKm1hcmdpbjogMCBhdXRvOyovXFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIC8qaGVpZ2h0OiA4MDBweDsqL1xcbiAgLypoZWlnaHQ6IDgwMHB4OyovXFxufVxcbi5kYXNoZ3JpZEJveCB7XFxuICBiYWNrZ3JvdW5kOiAjRTFFMUUxO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAyMCU7XFxuICBsZWZ0OiAwO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDgwJTtcXG59XFxuLyoqXFxuICogRGFzaGdyaWQgcmVsZXZhbnQgY2xhc3Nlcy5cXG4gKi9cXG4uZGFzaGdyaWQge1xcbiAgYmFja2dyb3VuZDogI0Y5RjlGOTtcXG59XFxuLmRhc2hncmlkLWJveCB7XFxuICBiYWNrZ3JvdW5kOiByZWQ7XFxufVxcbi5kYXNoZ3JpZC1zaGFkb3ctYm94IHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNFOEU4RTg7XFxuICBvcGFjaXR5OiAwLjU7XFxufVxcbi8qKlxcbiAqIEdSSUQgRFJBVyBIRUxQRVJTLlxcbiAqL1xcbi5kYXNoZ3JpZC1ob3Jpem9udGFsLWxpbmUsXFxuLmRhc2hncmlkLXZlcnRpY2FsLWxpbmUge1xcbiAgYmFja2dyb3VuZDogI0ZGRkZGRjtcXG59XFxuLmRhc2hncmlkLWdyaWQtY2VudHJvaWQge1xcbiAgYmFja2dyb3VuZDogIzAwMDAwMDtcXG4gIHdpZHRoOiA1cHg7XFxuICBoZWlnaHQ6IDVweDtcXG59XFxuLyoqXFxuICogUmVzaXplIEhhbmRsZXJzXFxuICovXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXCI7IChyZXF1aXJlKFwiYnJvd3NlcmlmeS1jc3NcIikuY3JlYXRlU3R5bGUoY3NzLCB7IFwiaHJlZlwiOiBcInNwZWNzL2RlbW8uY3NzXCJ9KSk7IG1vZHVsZS5leHBvcnRzID0gY3NzOyIsImltcG9ydCB0ZXN0IGZyb20gJ3RhcGUnO1xuXG4vLyBEYXNoZ3JpZC5cbmltcG9ydCAnLi9kZW1vLmNzcyc7XG5pbXBvcnQgZGFzaEdyaWRHbG9iYWwgZnJvbSAnLi4vc3JjL2Rhc2hncmlkLmpzJztcblxuLy8gVXRpbC5cbmltcG9ydCB7ZGVjb3JhdGVSdW5BbGx9IGZyb20gJy4vdXRpbC5qcyc7XG5cbi8vIFRlc3RzLlxuaW1wb3J0IGluaXRHcmlkIGZyb20gJy4vdGVzdHMvaW5pdEdyaWQudGVzdC5qcyc7XG5pbXBvcnQgYm94QWRkUmVtb3ZlIGZyb20gJy4vdGVzdHMvYm94QWRkUmVtb3ZlLnRlc3QuanMnO1xuaW1wb3J0IGJveE1vdmUgZnJvbSAnLi90ZXN0cy9ib3hNb3ZlLnRlc3QuanMnO1xuaW1wb3J0IGJveENvbGxpc2lvbnMgZnJvbSAnLi90ZXN0cy9ib3hDb2xsaXNpb24udGVzdC5qcyc7XG5pbXBvcnQgYm94UmVzaXplIGZyb20gJy4vdGVzdHMvYm94UmVzaXplLnRlc3QuanMnO1xuaW1wb3J0IGdyaWRSZXNpemUgZnJvbSAnLi90ZXN0cy9ncmlkUmVzaXplLnRlc3QuanMnO1xuaW1wb3J0IGRyYWdnZXIgZnJvbSAnLi90ZXN0cy9kcmFnZ2VyLnRlc3QuanMnO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgdGVzdHMoKTtcbn0pO1xuXG4vKiogVGVzdGluZyBpcyBkb25lIGZlYXR1cmUgd2lzZTpcbiAqICAgIE1vdmUgLyByZXNpemUgYm94OlxuICogICAgICAgIC0gSW5zaWRlIGJvcmRlciBlZGdlLlxuICogICAgICAgIC0gT3V0c2lkZSBib3JkZXIgZWRnZS5cbiAqICAgICAgICAtIERyYWdnaW5nIGRpc2FibGVkLCBnbG9iYWxseSBhbmQgYm94LXdpc2UuXG4gKiAgICAgICAgLSBDb2xsaXNpb25zLlxuICpcbiAqICAgIEluc2VydCAvIHJlbW92ZSBib3g6XG4gKiAgICAgICAgLSBWYWxpZCBpbnNlcnQuXG4gKiAgICAgICAgLSBOb24tdmFsaWQgaW5zZXJ0LlxuICpcbiAqICAgIFRvZ2dsZSBwcm9wZXJ0aWVzOlxuICogICAgICAgIC0gSW5pdGlhbGl6YXRpb24uXG4gKi9cbmZ1bmN0aW9uIHRlc3RzICgpe1xuICAgIGxldCB0ID0ge1xuICAgICAgICBpbml0R3JpZDogKCkgPT4ge2luaXRHcmlkKGRhc2hHcmlkR2xvYmFsLCB0ZXN0KX0sXG4gICAgICAgIGJveE1vdmU6ICgpID0+IHtib3hNb3ZlKGRhc2hHcmlkR2xvYmFsLCB0ZXN0KX0sXG4gICAgICAgIGJveFJlc2l6ZTogKCkgPT4ge2JveFJlc2l6ZShkYXNoR3JpZEdsb2JhbCwgdGVzdCl9LFxuICAgICAgICBib3hBZGRSZW1vdmU6ICgpID0+IHtib3hBZGRSZW1vdmUoZGFzaEdyaWRHbG9iYWwsIHRlc3QpfSxcbiAgICAgICAgYm94Q29sbGlzaW9uczogKCkgPT4ge2JveENvbGxpc2lvbnMoZGFzaEdyaWRHbG9iYWwsIHRlc3QpfSxcbiAgICAgICAgLy8gcHJvcGVydHlUb2dnbGU6ICgpID0+IHtwcm9wZXJ0eVRvZ2dsZShkYXNoR3JpZEdsb2JhbCwgdGVzdCl9XG4gICAgfTtcblxuICAgIGRlY29yYXRlUnVuQWxsKHQsIGRhc2hHcmlkR2xvYmFsLCB0ZXN0KTtcblxuICAgIHQuaW5pdEdyaWQoKTtcbiAgICAvLyB0LmJveE1vdmUoKTtcblxufVxuIiwidmFyIGRpZmYgPSByZXF1aXJlKCdkZWVwLWRpZmYnKS5kaWZmO1xudmFyIGRlZXBjb3B5ID0gcmVxdWlyZSgnZGVlcGNvcHknKTtcblxuaW1wb3J0IHtpc051bWJlciwgYXJyYXlzRXF1YWx9IGZyb20gJy4uL3V0aWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBib3hBZGRSZW1vdmUoZGFzaEdyaWRHbG9iYWwsIHRlc3QpIHtcblxuICAgIHRlc3QoJ1ZhbGlkIGJveCBpbnNlcnRzJywgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgLy8gTW9ja3VwLlxuICAgICAgICBsZXQgZGlmZmVyZW5jZXMsIHByZXZTdGF0ZTtcbiAgICAgICAgbGV0IGJveGVzID0gW3tyb3c6IDAsIGNvbHVtbjogMCwgcm93c3BhbjogMywgY29sdW1uc3BhbjogM31dO1xuICAgICAgICBsZXQgZ3JpZCA9IGRhc2hHcmlkR2xvYmFsKCcjZ3JpZCcsIHtib3hlczogYm94ZXN9KTtcblxuICAgICAgICB0LnBsYW4oNCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBWYWxpZCBBZGQgLyBSZW1vdmUuXG4gICAgICAgICAqL1xuICAgICAgICBwcmV2U3RhdGUgPSBkZWVwY29weShncmlkLmdyaWQpO1xuICAgICAgICBncmlkLmluc2VydEJveCh7cm93OiAwLCBjb2x1bW46IDAsIHJvd3NwYW46IDEsIGNvbHVtbnNwYW46IDF9KTtcbiAgICAgICAgZGlmZmVyZW5jZXMgPSBkaWZmKGdyaWQuZ3JpZCwgcHJldlN0YXRlKTtcbiAgICAgICAgdC5lcXVhbChkaWZmZXJlbmNlcy5sZW5ndGgsIDIsICdJbnNlcnRlZCBib3ggb24gYSBub24tZW1wdHkgY2VsbCcpO1xuXG4gICAgICAgIHByZXZTdGF0ZSA9IGRlZXBjb3B5KGdyaWQuZ3JpZCk7XG4gICAgICAgIGdyaWQuaW5zZXJ0Qm94KHtyb3c6IDQsIGNvbHVtbjogNCwgcm93c3BhbjogMSwgY29sdW1uc3BhbjogMX0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLmxlbmd0aCwgMSwgJ0luc2VydGVkIGJveCBvbiBhbiBlbXB0eSBjZWxsJyk7XG5cbiAgICAgICAgcHJldlN0YXRlID0gZGVlcGNvcHkoZ3JpZC5ncmlkKTtcbiAgICAgICAgZ3JpZC5yZW1vdmVCb3goMSk7XG4gICAgICAgIGRpZmZlcmVuY2VzID0gZGlmZihncmlkLmdyaWQsIHByZXZTdGF0ZSk7XG4gICAgICAgIC8vIFRPRE86IGNoZWNrb3V0IGRpZmZlcmVuY2VcbiAgICAgICAgdC5lcXVhbChkaWZmZXJlbmNlcy5sZW5ndGgsIDMsICdSZW1vdmluZyBhbiBpbnNlcnRlZCBib3gnKTtcblxuICAgICAgICBwcmV2U3RhdGUgPSBkZWVwY29weShncmlkLmdyaWQpO1xuICAgICAgICBncmlkLnJlbW92ZUJveCgwKTtcbiAgICAgICAgZGlmZmVyZW5jZXMgPSBkaWZmKGdyaWQuZ3JpZCwgcHJldlN0YXRlKTtcbiAgICAgICAgdC5lcXVhbChkaWZmZXJlbmNlcy5sZW5ndGgsIDUsICdSZW1vdmluZyBhbiBpbml0aWFsIGJveCcpO1xuXG4gICAgICAgIHQuZW5kKCk7XG4gICAgfSk7XG59XG4iLCJ2YXIgZGlmZiA9IHJlcXVpcmUoJ2RlZXAtZGlmZicpLmRpZmY7XG52YXIgZGVlcGNvcHkgPSByZXF1aXJlKCdkZWVwY29weScpO1xuXG5pbXBvcnQge2lzTnVtYmVyLCBhcnJheXNFcXVhbH0gZnJvbSAnLi4vdXRpbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJveENvbGxpc2lvbnMoZGFzaEdyaWRHbG9iYWwsIHRlc3QpIHtcbiAgICB0ZXN0KCdQcm9wb2dhdGVkIHJvdyBjb2xsaXNpb24nLCBmdW5jdGlvbiAodCkge1xuICAgICAgICBsZXQgZGlmZmVyZW5jZXMsIHByZXZTdGF0ZTtcblxuICAgICAgICAvLyBNb2NrdXAuXG4gICAgICAgIGxldCBib3hlcyA9IFtcbiAgICAgICAgICAgIHsncm93JzogMCwgJ2NvbHVtbic6IDAsICdyb3dzcGFuJzogMiwgJ2NvbHVtbnNwYW4nOiAzfSxcbiAgICAgICAgICAgIHsncm93JzogMiwgJ2NvbHVtbic6IDAsICdyb3dzcGFuJzogMSwgJ2NvbHVtbnNwYW4nOiA0fSxcbiAgICAgICAgICAgIHsncm93JzogMywgJ2NvbHVtbic6IDAsICdyb3dzcGFuJzogMSwgJ2NvbHVtbnNwYW4nOiA0fVxuICAgICAgICBdO1xuICAgICAgICBsZXQgZ3JpZCA9IGRhc2hHcmlkR2xvYmFsKCcjZ3JpZCcsIHtib3hlczogYm94ZXN9KTtcblxuICAgICAgICAvLyBUZXN0cy5cbiAgICAgICAgdC5wbGFuKDQpO1xuXG4gICAgICAgIHByZXZTdGF0ZSA9IGRlZXBjb3B5KGdyaWQuZ3JpZCk7XG4gICAgICAgIGdyaWQudXBkYXRlQm94KGJveGVzWzBdLCB7cm93OiAxfSk7XG4gICAgICAgIHQuZXF1YWwoYm94ZXNbMF0ucm93LCAxLCAnU2hvdWxkIG1vdmUuJyk7XG4gICAgICAgIHQuZXF1YWwoYm94ZXNbMV0ucm93LCAzLCAnU2hvdWxkIG1vdmUuJyk7XG4gICAgICAgIHQuZXF1YWwoYm94ZXNbMl0ucm93LCA0LCAnU2hvdWxkIG1vdmUuJyk7XG4gICAgICAgIGRpZmZlcmVuY2VzID0gZGlmZihncmlkLmdyaWQsIHByZXZTdGF0ZSk7XG4gICAgICAgIHQuZXF1YWwoZGlmZmVyZW5jZXMubGVuZ3RoLCAzLCAnT25seSAzIGJveGVzIG1vdmVkLicpO1xuXG4gICAgICAgIHQuZW5kKCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdBbm90aGVyIHNpbXBsZSBjb2xsaXNpb24nLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAvLyBNb2NrdXAuXG4gICAgICAgIGxldCBkaWZmZXJlbmNlcywgcHJldlN0YXRlO1xuXG4gICAgICAgIGxldCBib3hlcyA9IFtcbiAgICAgICAgICAgIHsncm93JzogMCwgJ2NvbHVtbic6IDAsICdyb3dzcGFuJzogMiwgJ2NvbHVtbnNwYW4nOiAzfSxcbiAgICAgICAgICAgIHsncm93JzogMiwgJ2NvbHVtbic6IDAsICdyb3dzcGFuJzogMSwgJ2NvbHVtbnNwYW4nOiA0fSxcbiAgICAgICAgICAgIHsncm93JzogMywgJ2NvbHVtbic6IDAsICdyb3dzcGFuJzogMSwgJ2NvbHVtbnNwYW4nOiA0fVxuICAgICAgICBdO1xuICAgICAgICBsZXQgZ3JpZCA9IGRhc2hHcmlkR2xvYmFsKCcjZ3JpZCcsIHtib3hlczogYm94ZXN9KTtcblxuICAgICAgICBwcmV2U3RhdGUgPSBkZWVwY29weShncmlkLmdyaWQpO1xuICAgICAgICBncmlkLnVwZGF0ZUJveChib3hlc1swXSwge3JvdzogMn0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuXG4gICAgICAgIC8vIFRlc3RzLlxuICAgICAgICB0LnBsYW4oNCk7XG5cbiAgICAgICAgdC5lcXVhbChib3hlc1swXS5yb3csIDIsICdTaG91bGQgbW92ZS4nKTtcbiAgICAgICAgdC5lcXVhbChib3hlc1sxXS5yb3csIDQsICdTaG91bGQgbW92ZS4nKTtcbiAgICAgICAgdC5lcXVhbChib3hlc1syXS5yb3csIDUsICdTaG91bGQgbW92ZS4nKTtcbiAgICAgICAgdC5lcXVhbChkaWZmZXJlbmNlcy5sZW5ndGgsIDMsICdTaG91bGQgbW92ZS4nKTtcblxuICAgICAgICB0LmVuZCgpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnQ29sdW1uIGNvbGxpc2lvbicsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGxldCBkaWZmZXJlbmNlcywgcHJldlN0YXRlO1xuXG4gICAgICAgIC8vIE1vY2t1cC5cbiAgICAgICAgbGV0IGJveGVzID0gW1xuICAgICAgICAgICAgeydyb3cnOiAwLCAnY29sdW1uJzogMCwgJ3Jvd3NwYW4nOiAyLCAnY29sdW1uc3Bhbic6IDJ9LFxuICAgICAgICAgICAgeydyb3cnOiAwLCAnY29sdW1uJzogMiwgJ3Jvd3NwYW4nOiAyLCAnY29sdW1uc3Bhbic6IDF9LFxuICAgICAgICAgICAgeydyb3cnOiAxLCAnY29sdW1uJzogMywgJ3Jvd3NwYW4nOiAyLCAnY29sdW1uc3Bhbic6IDF9XG4gICAgICAgIF07XG4gICAgICAgIGxldCBncmlkID0gZGFzaEdyaWRHbG9iYWwoJyNncmlkJywge2JveGVzOiBib3hlc30pO1xuXG4gICAgICAgIC8vIFRlc3RzLlxuICAgICAgICBwcmV2U3RhdGUgPSBkZWVwY29weShncmlkLmdyaWQpO1xuICAgICAgICBncmlkLnVwZGF0ZUJveChib3hlc1swXSwge2NvbHVtbjogMn0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuXG4gICAgICAgIHQucGxhbig0KTtcblxuICAgICAgICB0LmVxdWFsKGJveGVzWzBdLmNvbHVtbiwgMiwgJ1Nob3VsZCBtb3ZlLicpO1xuICAgICAgICB0LmVxdWFsKGJveGVzWzFdLnJvdywgMiwgJ1Nob3VsZCBtb3ZlLicpO1xuICAgICAgICB0LmVxdWFsKGJveGVzWzJdLnJvdywgMiwgJ1Nob3VsZCBtb3ZlLicpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLmxlbmd0aCwgMywgJ1Nob3VsZCBtb3ZlLicpO1xuXG4gICAgICAgIHQuZW5kKCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdDb21wbGV0ZSBjb2xsaXNpb24nLCBmdW5jdGlvbiAodCkge1xuICAgICAgICBsZXQgZGlmZmVyZW5jZXMsIHByZXZTdGF0ZTtcblxuICAgICAgICAvLyBNb2NrdXAuXG4gICAgICAgIGxldCBib3hlcyA9IFtcbiAgICAgICAgICAgIHsncm93JzogMCwgJ2NvbHVtbic6IDAsICdyb3dzcGFuJzogMiwgJ2NvbHVtbnNwYW4nOiAyfSxcbiAgICAgICAgICAgIHsncm93JzogMiwgJ2NvbHVtbic6IDIsICdyb3dzcGFuJzogMiwgJ2NvbHVtbnNwYW4nOiAyfVxuICAgICAgICBdO1xuXG4gICAgICAgIGxldCBncmlkID0gZGFzaEdyaWRHbG9iYWwoJyNncmlkJywge2JveGVzOiBib3hlc30pO1xuXG4gICAgICAgIHByZXZTdGF0ZSA9IGRlZXBjb3B5KGdyaWQuZ3JpZCk7XG4gICAgICAgIGdyaWQudXBkYXRlQm94KGJveGVzWzBdLCB7cm93OiAyLCBjb2x1bW46IDJ9KTtcbiAgICAgICAgZGlmZmVyZW5jZXMgPSBkaWZmKGdyaWQuZ3JpZCwgcHJldlN0YXRlKTtcblxuICAgICAgICAvLyBUZXN0cy5cbiAgICAgICAgdC5wbGFuKDUpO1xuICAgICAgICB0LmVxdWFsKGJveGVzWzBdLnJvdywgMiwgJ1Nob3VsZCBtb3ZlLicpO1xuICAgICAgICB0LmVxdWFsKGJveGVzWzBdLmNvbHVtbiwgMiwgJ1Nob3VsZCBtb3ZlLicpO1xuICAgICAgICB0LmVxdWFsKGJveGVzWzFdLnJvdywgNCwgJ1Nob3VsZCBtb3ZlLicpO1xuICAgICAgICB0LmVxdWFsKGJveGVzWzFdLmNvbHVtbiwgMiwgJ1Nob3VsZCBtb3ZlLicpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLmxlbmd0aCwgMywgJ1Nob3VsZCBtb3ZlLicpO1xuICAgICAgICB0LmVuZCgpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnQ29sbGlzaW9uIG91dHNpZGUgYm91bmRhcnkuJywgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgbGV0IGRpZmZlcmVuY2VzLCBwcmV2U3RhdGU7XG5cbiAgICAgICAgLy8gTW9ja3VwLlxuICAgICAgICBsZXQgYm94ZXMgPSBbXG4gICAgICAgICAgICB7J3Jvdyc6IDAsICdjb2x1bW4nOiAwLCAncm93c3Bhbic6IDIsICdjb2x1bW5zcGFuJzogMn0sXG4gICAgICAgICAgICB7J3Jvdyc6IDIsICdjb2x1bW4nOiAwLCAncm93c3Bhbic6IDQsICdjb2x1bW5zcGFuJzogMn1cbiAgICAgICAgXTtcbiAgICAgICAgbGV0IGdyaWQgPSBkYXNoR3JpZEdsb2JhbCgnI2dyaWQnLCB7Ym94ZXM6IGJveGVzLCBtYXhSb3dzOiA2fSk7XG5cbiAgICAgICAgcHJldlN0YXRlID0gZGVlcGNvcHkoZ3JpZC5ncmlkKTtcbiAgICAgICAgZ3JpZC51cGRhdGVCb3goYm94ZXNbMF0sIHtyb3c6IDF9KTtcbiAgICAgICAgZGlmZmVyZW5jZXMgPSBkaWZmKGdyaWQuZ3JpZCwgcHJldlN0YXRlKTtcblxuICAgICAgICAvLyBUZXN0cy5cbiAgICAgICAgdC5wbGFuKDMpO1xuXG4gICAgICAgIHQuZXF1YWwoYm94ZXNbMF0ucm93LCAwLCAnU2hvdWxkIG5vdCBtb3ZlLicpO1xuICAgICAgICB0LmVxdWFsKGJveGVzWzFdLnJvdywgMiwgJ1Nob3VsZCBub3QgbW92ZS4nKTtcbiAgICAgICAgdC5lcXVhbChkaWZmZXJlbmNlcywgdW5kZWZpbmVkLCAnU2hvdWxkIG5vdCBtb3ZlLicpO1xuXG4gICAgICAgIHQuZW5kKCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdDb2xsaXNpb24gZnJvbSB1bmRlci4nLCBmdW5jdGlvbiAodCkge1xuICAgICAgICBsZXQgZGlmZmVyZW5jZXMsIHByZXZTdGF0ZTtcblxuICAgICAgICBsZXQgYm94ZXMgPSBbXG4gICAgICAgICAgICB7J3Jvdyc6IDAsICdjb2x1bW4nOiAwLCAncm93c3Bhbic6IDIsICdjb2x1bW5zcGFuJzogMn0sXG4gICAgICAgICAgICB7J3Jvdyc6IDIsICdjb2x1bW4nOiAwLCAncm93c3Bhbic6IDQsICdjb2x1bW5zcGFuJzogMn1cbiAgICAgICAgXTtcblxuICAgICAgICBsZXQgZ3JpZCA9IGRhc2hHcmlkR2xvYmFsKCcjZ3JpZCcsIHtib3hlczogYm94ZXMsIG1heFJvd3M6IDZ9KTtcbiAgICAgICAgdC5wbGFuKDEyKTtcblxuICAgICAgICBwcmV2U3RhdGUgPSBkZWVwY29weShncmlkLmdyaWQpO1xuICAgICAgICBncmlkLnVwZGF0ZUJveChib3hlc1sxXSwge3JvdzogMX0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuICAgICAgICB0LmVxdWFsKGJveGVzWzBdLnJvdywgMCwgJ1Nob3VsZCBub3QgbW92ZS4nKTtcbiAgICAgICAgdC5lcXVhbChib3hlc1sxXS5yb3csIDIsICdTaG91bGQgbm90IG1vdmUuJyk7XG4gICAgICAgIHQuZXF1YWwoZGlmZmVyZW5jZXMsIHVuZGVmaW5lZCwgJ1Nob3VsZCBub3QgbW92ZS4nKTtcblxuICAgICAgICBwcmV2U3RhdGUgPSBkZWVwY29weShncmlkLmdyaWQpO1xuICAgICAgICBncmlkLnVwZGF0ZUJveChib3hlc1sxXSwge3JvdzogMH0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuICAgICAgICB0LmVxdWFsKGJveGVzWzBdLnJvdywgNCwgJ1Nob3VsZCBtb3ZlLicpO1xuICAgICAgICB0LmVxdWFsKGJveGVzWzFdLnJvdywgMCwgJ1Nob3VsZCBtb3ZlLicpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLmxlbmd0aCwgMiwgJ1Nob3VsZCBub3QgbW92ZS4nKTtcblxuICAgICAgICBwcmV2U3RhdGUgPSBkZWVwY29weShncmlkLmdyaWQpO1xuICAgICAgICBncmlkLnVwZGF0ZUJveChib3hlc1swXSwge3JvdzogM30pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuICAgICAgICB0LmVxdWFsKGJveGVzWzBdLnJvdywgNCwgJ1Nob3VsZCBub3QgbW92ZS4nKTtcbiAgICAgICAgdC5lcXVhbChib3hlc1sxXS5yb3csIDAsICdTaG91bGQgbm90IG1vdmUuJyk7XG4gICAgICAgIHQuZXF1YWwoZGlmZmVyZW5jZXMsIHVuZGVmaW5lZCwgJ1Nob3VsZCBub3QgbW92ZS4nKTtcblxuICAgICAgICBwcmV2U3RhdGUgPSBkZWVwY29weShncmlkLmdyaWQpO1xuICAgICAgICBncmlkLnVwZGF0ZUJveChib3hlc1swXSwge3JvdzogMH0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuICAgICAgICB0LmVxdWFsKGJveGVzWzBdLnJvdywgMCwgJ1Nob3VsZCBub3QgbW92ZS4nKTtcbiAgICAgICAgdC5lcXVhbChib3hlc1sxXS5yb3csIDIsICdTaG91bGQgbm90IG1vdmUuJyk7XG4gICAgICAgIHQuZXF1YWwoZGlmZmVyZW5jZXMubGVuZ3RoLCAyLCAnU2hvdWxkIG5vdCBtb3ZlLicpO1xuXG4gICAgICAgIHQuZW5kKCk7XG4gICAgfSk7XG5cbn0iLCJ2YXIgZGlmZiA9IHJlcXVpcmUoJ2RlZXAtZGlmZicpLmRpZmY7XG52YXIgZGVlcGNvcHkgPSByZXF1aXJlKCdkZWVwY29weScpO1xuXG5pbXBvcnQge2lzTnVtYmVyLCBhcnJheXNFcXVhbH0gZnJvbSAnLi4vdXRpbC5qcyc7XG5cbi8vIFRPRE86IG1vdmUgcm93IEFORCBjb2x1bW4uXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJveE1vdmUoZGFzaEdyaWRHbG9iYWwsIHRlc3QpIHtcblxuICAgIHRlc3QoJ01vdmluZyBib3ggb3V0c2lkZSB2aXNpYmxlIHdpbmRvdy4nLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAvLyBNb2NrdXAuXG4gICAgICAgIGxldCBkaWZmZXJlbmNlcywgcHJldlN0YXRlO1xuICAgICAgICBsZXQgYm94ZXMgPSBbXG4gICAgICAgICAgICB7J3Jvdyc6IDAsICdjb2x1bW4nOiA4LCAncm93c3Bhbic6IDMsICdjb2x1bW5zcGFuJzogM31cbiAgICAgICAgXTtcbiAgICAgICAgbGV0IGdyaWQgPSBkYXNoR3JpZEdsb2JhbChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZCcpLCB7Ym94ZXM6IGJveGVzfSk7XG5cbiAgICAgICAgdC5wbGFuKDI4KTtcblxuICAgICAgICBwcmV2U3RhdGUgPSBkZWVwY29weShncmlkLmdyaWQpO1xuICAgICAgICBncmlkLnVwZGF0ZUJveChncmlkLmdyaWQuYm94ZXNbMF0sIHtjb2x1bW46IGdyaWQuZ3JpZC5ib3hlc1swXS5jb2x1bW4gKyA5OTk5fSk7XG4gICAgICAgIGRpZmZlcmVuY2VzID0gZGlmZihncmlkLmdyaWQsIHByZXZTdGF0ZSk7XG4gICAgICAgIHQuZXF1YWwoZ3JpZC5ncmlkLmJveGVzWzBdLmNvbHVtbiwgMCwgJ01vdmUgMSBzdGVwIG5vcnRoIG91dHNpZGUgYm91bmRhcnknKTtcbiAgICAgICAgdC5lcXVhbChkaWZmZXJlbmNlcywgdW5kZWZpbmVkLCAnTW92ZSAxIHN0ZXAgbm9ydGggb3V0c2lkZSBib3VuZGFyeScpO1xuXG4gICAgfSlcblxuICAgIHRlc3QoJ01vdmUgYm94ZXMnLCBmdW5jdGlvbiAodCkge1xuXG4gICAgICAgIC8vIE1vY2t1cC5cbiAgICAgICAgbGV0IGRpZmZlcmVuY2VzLCBwcmV2U3RhdGU7XG4gICAgICAgIGxldCBib3hlcyA9IFtcbiAgICAgICAgICAgIHsncm93JzogMCwgJ2NvbHVtbic6IDAsICdyb3dzcGFuJzogMywgJ2NvbHVtbnNwYW4nOiAzfVxuICAgICAgICBdO1xuICAgICAgICBsZXQgZ3JpZCA9IGRhc2hHcmlkR2xvYmFsKCcjZ3JpZCcsIHtib3hlczogYm94ZXN9KTtcblxuICAgICAgICB0LnBsYW4oMjgpO1xuICAgICAgICAvKipcbiAgICAgICAgICogTW92aW5nIGluc2lkZSBib3VuZGFyeS5cbiAgICAgICAgICovXG4gICAgICAgIC8vIE1vdmUgZG93biAxIHJvdy5cbiAgICAgICAgcHJldlN0YXRlID0gZGVlcGNvcHkoZ3JpZC5ncmlkKTtcbiAgICAgICAgZ3JpZC51cGRhdGVCb3goZ3JpZC5ncmlkLmJveGVzWzBdLCB7cm93OiBncmlkLmdyaWQuYm94ZXNbMF0ucm93ICsgMX0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuICAgICAgICB0LmVxdWFsKGdyaWQuZ3JpZC5ib3hlc1swXS5yb3csIDEsICdNb3ZlIGRvd24gMSBzdGVwJyk7XG4gICAgICAgIHQuZXF1YWwoZGlmZmVyZW5jZXMubGVuZ3RoLCAxLCAnTW92ZSBkb3duIDEgc3RlcCcpO1xuXG4gICAgICAgIC8vIE1vdmUgdXAgMSByb3cuXG4gICAgICAgIHByZXZTdGF0ZSA9IGRlZXBjb3B5KGdyaWQuZ3JpZCk7XG4gICAgICAgIGdyaWQudXBkYXRlQm94KGdyaWQuZ3JpZC5ib3hlc1swXSwge3JvdzogZ3JpZC5ncmlkLmJveGVzWzBdLnJvdyAtIDF9KTtcbiAgICAgICAgZGlmZmVyZW5jZXMgPSBkaWZmKGdyaWQuZ3JpZCwgcHJldlN0YXRlKTtcbiAgICAgICAgdC5lcXVhbChncmlkLmdyaWQuYm94ZXNbMF0ucm93LCAwLCAnTW92ZSB1cCAxIHN0ZXAnKTtcbiAgICAgICAgdC5lcXVhbChkaWZmZXJlbmNlcy5sZW5ndGgsIDEsICdNb3ZlIGRvd24gMSBzdGVwJyk7XG5cbiAgICAgICAgLy8gTW92ZSBkb3duIDIgcm93cy5cbiAgICAgICAgcHJldlN0YXRlID0gZGVlcGNvcHkoZ3JpZC5ncmlkKTtcbiAgICAgICAgZ3JpZC51cGRhdGVCb3goZ3JpZC5ncmlkLmJveGVzWzBdLCB7cm93OiBncmlkLmdyaWQuYm94ZXNbMF0ucm93ICsgMn0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuICAgICAgICB0LmVxdWFsKGdyaWQuZ3JpZC5ib3hlc1swXS5yb3csIDIsICdNb3ZlIHVwIDIgc3RlcCcpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLmxlbmd0aCwgMSwgJ01vdmUgZG93biAyIHN0ZXAnKTtcblxuICAgICAgICAvLyBNb3ZlIHVwIDIgcm93cy5cbiAgICAgICAgcHJldlN0YXRlID0gZGVlcGNvcHkoZ3JpZC5ncmlkKTtcbiAgICAgICAgZ3JpZC51cGRhdGVCb3goZ3JpZC5ncmlkLmJveGVzWzBdLCB7cm93OiBncmlkLmdyaWQuYm94ZXNbMF0ucm93IC0gMn0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuICAgICAgICB0LmVxdWFsKGdyaWQuZ3JpZC5ib3hlc1swXS5yb3csIDAsICdNb3ZlIHVwIDIgc3RlcCcpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLmxlbmd0aCwgMSwgJ01vdmUgZG93biAyIHN0ZXAnKTtcblxuICAgICAgICAvLyBNb3ZlIHRvIHJpZ2h0IDEgY29sdW1uLlxuICAgICAgICBwcmV2U3RhdGUgPSBkZWVwY29weShncmlkLmdyaWQpO1xuICAgICAgICBncmlkLnVwZGF0ZUJveChncmlkLmdyaWQuYm94ZXNbMF0sIHtjb2x1bW46IGdyaWQuZ3JpZC5ib3hlc1swXS5jb2x1bW4gKyAxfSk7XG4gICAgICAgIGRpZmZlcmVuY2VzID0gZGlmZihncmlkLmdyaWQsIHByZXZTdGF0ZSk7XG4gICAgICAgIHQuZXF1YWwoZ3JpZC5ncmlkLmJveGVzWzBdLmNvbHVtbiwgMSwgJ01vdmUgMSBzdGVwIHJpZ2h0Jyk7XG4gICAgICAgIHQuZXF1YWwoZGlmZmVyZW5jZXMubGVuZ3RoLCAxLCAnTW92ZSAxIHN0ZXAgcmlnaHQnKTtcblxuICAgICAgICAvLyBNb3ZlIHRvIGxlZnQgMSBjb2x1bW4uXG4gICAgICAgIHByZXZTdGF0ZSA9IGRlZXBjb3B5KGdyaWQuZ3JpZCk7XG4gICAgICAgIGdyaWQudXBkYXRlQm94KGdyaWQuZ3JpZC5ib3hlc1swXSwge2NvbHVtbjogZ3JpZC5ncmlkLmJveGVzWzBdLmNvbHVtbiAtIDF9KTtcbiAgICAgICAgZGlmZmVyZW5jZXMgPSBkaWZmKGdyaWQuZ3JpZCwgcHJldlN0YXRlKTtcbiAgICAgICAgdC5lcXVhbChncmlkLmdyaWQuYm94ZXNbMF0uY29sdW1uLCAwLCAnTW92ZSAxIHN0ZXAgbGVmdCcpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLmxlbmd0aCwgMSwgJ01vdmUgMSBzdGVwIGxlZnQnKTtcblxuICAgICAgICAvLyBNb3ZlIHRvIHJpZ2h0IDIgY29sdW1ucy5cbiAgICAgICAgcHJldlN0YXRlID0gZGVlcGNvcHkoZ3JpZC5ncmlkKTtcbiAgICAgICAgZ3JpZC51cGRhdGVCb3goZ3JpZC5ncmlkLmJveGVzWzBdLCB7Y29sdW1uOiBncmlkLmdyaWQuYm94ZXNbMF0uY29sdW1uICsgMn0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuICAgICAgICB0LmVxdWFsKGdyaWQuZ3JpZC5ib3hlc1swXS5jb2x1bW4sIDIsICdNb3ZlIDIgc3RlcCByaWdodCcpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLmxlbmd0aCwgMSwgJ01vdmUgMiBzdGVwIHJpZ2h0Jyk7XG5cbiAgICAgICAgLy8gTW92ZSB0byBsZWZ0IDIgY29sdW1ucy5cbiAgICAgICAgcHJldlN0YXRlID0gZGVlcGNvcHkoZ3JpZC5ncmlkKTtcbiAgICAgICAgZ3JpZC51cGRhdGVCb3goZ3JpZC5ncmlkLmJveGVzWzBdLCB7Y29sdW1uOiBncmlkLmdyaWQuYm94ZXNbMF0uY29sdW1uIC0gMn0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuICAgICAgICB0LmVxdWFsKGdyaWQuZ3JpZC5ib3hlc1swXS5jb2x1bW4sIDAsICdNb3ZlIDIgc3RlcCBsZWZ0Jyk7XG4gICAgICAgIHQuZXF1YWwoZGlmZmVyZW5jZXMubGVuZ3RoLCAxLCAnTW92ZSAyIHN0ZXAgbGVmdCcpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPdXQtb2YtYm91bmQgdXAtZG93biBsZWZ0LXJpZ2h0XG4gICAgICAgICAqL1xuICAgICAgICAvLyBBdHRlbXB0IHRvIG1vdmUgcGFydCBvZiBib3ggb3V0c2lkZSB0b3AgYm9yZGVyLlxuICAgICAgICBwcmV2U3RhdGUgPSBkZWVwY29weShncmlkLmdyaWQpO1xuICAgICAgICBncmlkLnVwZGF0ZUJveChncmlkLmdyaWQuYm94ZXNbMF0sIHtyb3c6IGdyaWQuZ3JpZC5ib3hlc1swXS5yb3cgLSAxfSk7XG4gICAgICAgIGRpZmZlcmVuY2VzID0gZGlmZihncmlkLmdyaWQsIHByZXZTdGF0ZSk7XG4gICAgICAgIHQuZXF1YWwoZ3JpZC5ncmlkLmJveGVzWzBdLnJvdywgMCwgJ01vdmUgMSBzdGVwIG5vcnRoIG91dHNpZGUgYm91bmRhcnknKTtcbiAgICAgICAgdC5lcXVhbChkaWZmZXJlbmNlcywgdW5kZWZpbmVkLCAnTW92ZSAxIHN0ZXAgbm9ydGggb3V0c2lkZSBib3VuZGFyeScpO1xuXG4gICAgICAgIHByZXZTdGF0ZSA9IGRlZXBjb3B5KGdyaWQuZ3JpZCk7XG4gICAgICAgIGdyaWQudXBkYXRlQm94KGdyaWQuZ3JpZC5ib3hlc1swXSwge3JvdzogZ3JpZC5ncmlkLmJveGVzWzBdLnJvdyAtIDk5OTl9KTtcbiAgICAgICAgZGlmZmVyZW5jZXMgPSBkaWZmKGdyaWQuZ3JpZCwgcHJldlN0YXRlKTtcbiAgICAgICAgdC5lcXVhbChncmlkLmdyaWQuYm94ZXNbMF0ucm93LCAwLCAnTW92ZSAxIHN0ZXAgbm9ydGggb3V0c2lkZSBib3VuZGFyeScpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLCB1bmRlZmluZWQsICdNb3ZlIDEgc3RlcCBub3J0aCBvdXRzaWRlIGJvdW5kYXJ5Jyk7XG5cbiAgICAgICAgLy8gQXR0ZW1wdCB0byBtb3ZlIG91dCBvZiBib3VuZCByb3ctd2lzZSAoKykuXG4gICAgICAgIHByZXZTdGF0ZSA9IGRlZXBjb3B5KGdyaWQuZ3JpZCk7XG4gICAgICAgIGdyaWQudXBkYXRlQm94KGdyaWQuZ3JpZC5ib3hlc1swXSwge3JvdzogZ3JpZC5ncmlkLmJveGVzWzBdLnJvdyArIDk5OTl9KTtcbiAgICAgICAgZGlmZmVyZW5jZXMgPSBkaWZmKGdyaWQuZ3JpZCwgcHJldlN0YXRlKTtcbiAgICAgICAgdC5lcXVhbChncmlkLmdyaWQuYm94ZXNbMF0ucm93LCAwLCAnTW92ZSAxIHN0ZXAgbm9ydGggb3V0c2lkZSBib3VuZGFyeScpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLCB1bmRlZmluZWQsICdNb3ZlIDEgc3RlcCBub3J0aCBvdXRzaWRlIGJvdW5kYXJ5Jyk7XG5cbiAgICAgICAgLy8gQXR0ZW1wdCB0byBtb3ZlIHBhcnQgb2YgYm94IG91dHNpZGUgbGVmdCBib3JkZXIuXG4gICAgICAgIHByZXZTdGF0ZSA9IGRlZXBjb3B5KGdyaWQuZ3JpZCk7XG4gICAgICAgIGdyaWQudXBkYXRlQm94KGdyaWQuZ3JpZC5ib3hlc1swXSwge2NvbHVtbjogZ3JpZC5ncmlkLmJveGVzWzBdLmNvbHVtbiAtIDF9KTtcbiAgICAgICAgZGlmZmVyZW5jZXMgPSBkaWZmKGdyaWQuZ3JpZCwgcHJldlN0YXRlKTtcbiAgICAgICAgdC5lcXVhbChncmlkLmdyaWQuYm94ZXNbMF0uY29sdW1uLCAwLCAnTW92ZSAxIHN0ZXAgbm9ydGggb3V0c2lkZSBib3VuZGFyeScpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLCB1bmRlZmluZWQsICdNb3ZlIDEgc3RlcCBub3J0aCBvdXRzaWRlIGJvdW5kYXJ5Jyk7XG5cbiAgICAgICAgLy8gQXR0ZW1wdCB0byBtb3ZlIHdob2xlIGJveCBvdXRzaWRlIGxlZnQgYm9yZGVyLlxuICAgICAgICBwcmV2U3RhdGUgPSBkZWVwY29weShncmlkLmdyaWQpO1xuICAgICAgICBncmlkLnVwZGF0ZUJveChncmlkLmdyaWQuYm94ZXNbMF0sIHtjb2x1bW46IGdyaWQuZ3JpZC5ib3hlc1swXS5jb2x1bW4gLSA5OTk5fSk7XG4gICAgICAgIGRpZmZlcmVuY2VzID0gZGlmZihncmlkLmdyaWQsIHByZXZTdGF0ZSk7XG4gICAgICAgIHQuZXF1YWwoZ3JpZC5ncmlkLmJveGVzWzBdLmNvbHVtbiwgMCwgJ01vdmUgMSBzdGVwIG5vcnRoIG91dHNpZGUgYm91bmRhcnknKTtcbiAgICAgICAgdC5lcXVhbChkaWZmZXJlbmNlcywgdW5kZWZpbmVkLCAnTW92ZSAxIHN0ZXAgbm9ydGggb3V0c2lkZSBib3VuZGFyeScpO1xuXG4gICAgICAgIC8vIEF0dGVtcHQgdG8gbW92ZSB3aG9sZSBib3ggb3V0c2lkZSByaWdodCBib3JkZXIuXG4gICAgICAgIHByZXZTdGF0ZSA9IGRlZXBjb3B5KGdyaWQuZ3JpZCk7XG4gICAgICAgIGdyaWQudXBkYXRlQm94KGdyaWQuZ3JpZC5ib3hlc1swXSwge2NvbHVtbjogZ3JpZC5ncmlkLmJveGVzWzBdLmNvbHVtbiArIDk5OTl9KTtcbiAgICAgICAgZGlmZmVyZW5jZXMgPSBkaWZmKGdyaWQuZ3JpZCwgcHJldlN0YXRlKTtcbiAgICAgICAgdC5lcXVhbChncmlkLmdyaWQuYm94ZXNbMF0uY29sdW1uLCAwLCAnTW92ZSAxIHN0ZXAgbm9ydGggb3V0c2lkZSBib3VuZGFyeScpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLCB1bmRlZmluZWQsICdNb3ZlIDEgc3RlcCBub3J0aCBvdXRzaWRlIGJvdW5kYXJ5Jyk7XG5cbiAgICAgICAgdC5lbmQoKTtcbiAgICB9KTtcblxufVxuIiwidmFyIGRpZmYgPSByZXF1aXJlKCdkZWVwLWRpZmYnKS5kaWZmO1xudmFyIGRlZXBjb3B5ID0gcmVxdWlyZSgnZGVlcGNvcHknKTtcblxuaW1wb3J0IHtpc051bWJlciwgYXJyYXlzRXF1YWx9IGZyb20gJy4uL3V0aWwuanMnO1xuXG4vLyBUT0RPOiByZXNpemUgY29sdW1uc3BhbiBBTkQgcm93c3BhbiB0ZXN0LlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYm94UmVzaXplKGRhc2hHcmlkR2xvYmFsLCB0ZXN0KSB7XG4gICAgdGVzdCgnUmVzaXplIGJveGVzJywgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgLy8gTW9ja3VwLlxuICAgICAgICBsZXQgZGlmZmVyZW5jZXMsIHByZXZTdGF0ZTtcbiAgICAgICAgbGV0IGJveGVzID0gW1xuICAgICAgICAgICAgeydyb3cnOiAwLCAnY29sdW1uJzogMCwgJ3Jvd3NwYW4nOiAzLCAnY29sdW1uc3Bhbic6IDN9XG4gICAgICAgIF07XG4gICAgICAgIGxldCBncmlkID0gZGFzaEdyaWRHbG9iYWwoJyNncmlkJywge2JveGVzOiBib3hlc30pO1xuXG4gICAgICAgIHQucGxhbig0NCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBWQUxJRCBNT1ZFUy5cbiAgICAgICAgICovXG5cbiAgICAgICAgLy8gUmVzaXplIGRvd24gMSByb3cuXG4gICAgICAgIHByZXZTdGF0ZSA9IGRlZXBjb3B5KGdyaWQuZ3JpZCk7XG4gICAgICAgIGdyaWQudXBkYXRlQm94KGdyaWQuZ3JpZC5ib3hlc1swXSwge3Jvd3NwYW46IGdyaWQuZ3JpZC5ib3hlc1swXS5yb3dzcGFuICsgMX0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuICAgICAgICB0LmVxdWFsKGdyaWQuZ3JpZC5ib3hlc1swXS5yb3dzcGFuLCA0LCAnUG9zaXRpdmUgcm93c3BhbiByZXNpemUnKTtcbiAgICAgICAgdC5lcXVhbChkaWZmZXJlbmNlcy5sZW5ndGgsIDEsICdQb3NpdGl2ZSByb3dzcGFuIHJlc2l6ZScpO1xuXG4gICAgICAgIC8vIFJlc2l6ZSB1cCAxIHJvdy5cbiAgICAgICAgcHJldlN0YXRlID0gZGVlcGNvcHkoZ3JpZC5ncmlkKTtcbiAgICAgICAgZ3JpZC51cGRhdGVCb3goZ3JpZC5ncmlkLmJveGVzWzBdLCB7cm93c3BhbjogZ3JpZC5ncmlkLmJveGVzWzBdLnJvd3NwYW4gLSAxfSk7XG4gICAgICAgIGRpZmZlcmVuY2VzID0gZGlmZihncmlkLmdyaWQsIHByZXZTdGF0ZSk7XG4gICAgICAgIHQuZXF1YWwoZ3JpZC5ncmlkLmJveGVzWzBdLnJvd3NwYW4sIDMsICdOZWdhdGl2ZSByb3dzcGFuIHJlc2l6ZScpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLmxlbmd0aCwgMSwgJ05lZ2F0aXZlIHJvd3NwYW4gcmVzaXplJyk7XG5cbiAgICAgICAgLy8gUmVzaXplIGRvd24gMiByb3cuXG4gICAgICAgIHByZXZTdGF0ZSA9IGRlZXBjb3B5KGdyaWQuZ3JpZCk7XG4gICAgICAgIGdyaWQudXBkYXRlQm94KGdyaWQuZ3JpZC5ib3hlc1swXSwge3Jvd3NwYW46IGdyaWQuZ3JpZC5ib3hlc1swXS5yb3dzcGFuICsgMn0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuICAgICAgICB0LmVxdWFsKGdyaWQuZ3JpZC5ib3hlc1swXS5yb3dzcGFuLCA1LCAnUG9zaXRpdmUgcm93c3BhbiByZXNpemUnKTtcbiAgICAgICAgdC5lcXVhbChkaWZmZXJlbmNlcy5sZW5ndGgsIDEsICdQb3NpdGl2ZSByb3dzcGFuIHJlc2l6ZScpO1xuXG4gICAgICAgIC8vIFJlc2l6ZSB1cCAyIHJvdy5cbiAgICAgICAgcHJldlN0YXRlID0gZGVlcGNvcHkoZ3JpZC5ncmlkKTtcbiAgICAgICAgZ3JpZC51cGRhdGVCb3goZ3JpZC5ncmlkLmJveGVzWzBdLCB7cm93c3BhbjogZ3JpZC5ncmlkLmJveGVzWzBdLnJvd3NwYW4gLSAyfSk7XG4gICAgICAgIGRpZmZlcmVuY2VzID0gZGlmZihncmlkLmdyaWQsIHByZXZTdGF0ZSk7XG4gICAgICAgIHQuZXF1YWwoZ3JpZC5ncmlkLmJveGVzWzBdLnJvd3NwYW4sIDMsICdOZWdhdGl2ZSByb3dzcGFuIHJlc2l6ZScpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLmxlbmd0aCwgMSwgJ05lZ2F0aXZlIHJvd3NwYW4gcmVzaXplJyk7XG5cbiAgICAgICAgLy8gUmVzaXplIHRvIHJpZ2h0IDEgY29sdW1uc3Bhbi5cbiAgICAgICAgcHJldlN0YXRlID0gZGVlcGNvcHkoZ3JpZC5ncmlkKTtcbiAgICAgICAgZ3JpZC51cGRhdGVCb3goZ3JpZC5ncmlkLmJveGVzWzBdLCB7Y29sdW1uc3BhbjogZ3JpZC5ncmlkLmJveGVzWzBdLmNvbHVtbnNwYW4gKyAxfSk7XG4gICAgICAgIGRpZmZlcmVuY2VzID0gZGlmZihncmlkLmdyaWQsIHByZXZTdGF0ZSk7XG4gICAgICAgIHQuZXF1YWwoZ3JpZC5ncmlkLmJveGVzWzBdLmNvbHVtbnNwYW4sIDQsICdSZXNpemUgMSBzdGVwIGNvbHVtbnNwYW4nKTtcbiAgICAgICAgdC5lcXVhbChkaWZmZXJlbmNlcy5sZW5ndGgsIDEsICdSZXNpemUgMSBzdGVwIGNvbHVtbnNwYW4nKTtcblxuICAgICAgICAvLyBSZXNpemUgdG8gbGVmdCAxIGNvbHVtbnNwYW4uXG4gICAgICAgIHByZXZTdGF0ZSA9IGRlZXBjb3B5KGdyaWQuZ3JpZCk7XG4gICAgICAgIGdyaWQudXBkYXRlQm94KGdyaWQuZ3JpZC5ib3hlc1swXSwge2NvbHVtbnNwYW46IGdyaWQuZ3JpZC5ib3hlc1swXS5jb2x1bW5zcGFuIC0gMX0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuICAgICAgICB0LmVxdWFsKGdyaWQuZ3JpZC5ib3hlc1swXS5jb2x1bW5zcGFuLCAzLCAnUmVzaXplIDEgc3RlcCBsZWZ0Jyk7XG4gICAgICAgIHQuZXF1YWwoZGlmZmVyZW5jZXMubGVuZ3RoLCAxLCAnUmVzaXplIDEgc3RlcCBsZWZ0Jyk7XG5cbiAgICAgICAgLy8gUmVzaXplIHRvIGNvbHVtbnNwYW4gMiBjb2x1bW5zLlxuICAgICAgICBwcmV2U3RhdGUgPSBkZWVwY29weShncmlkLmdyaWQpO1xuICAgICAgICBncmlkLnVwZGF0ZUJveChncmlkLmdyaWQuYm94ZXNbMF0sIHtjb2x1bW5zcGFuOiBncmlkLmdyaWQuYm94ZXNbMF0uY29sdW1uc3BhbiArIDJ9KTtcbiAgICAgICAgZGlmZmVyZW5jZXMgPSBkaWZmKGdyaWQuZ3JpZCwgcHJldlN0YXRlKTtcbiAgICAgICAgdC5lcXVhbChncmlkLmdyaWQuYm94ZXNbMF0uY29sdW1uc3BhbiwgNSwgJ1Jlc2l6ZSAyIHN0ZXAgY29sdW1uc3BhbicpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLmxlbmd0aCwgMSwgJ1Jlc2l6ZSAyIHN0ZXAgY29sdW1uc3BhbicpO1xuXG4gICAgICAgIC8vIFJlc2l6ZSB0byBsZWZ0IDIgY29sdW1ucy5cbiAgICAgICAgcHJldlN0YXRlID0gZGVlcGNvcHkoZ3JpZC5ncmlkKTtcbiAgICAgICAgZ3JpZC51cGRhdGVCb3goZ3JpZC5ncmlkLmJveGVzWzBdLCB7Y29sdW1uc3BhbjogZ3JpZC5ncmlkLmJveGVzWzBdLmNvbHVtbnNwYW4gLSAyfSk7XG4gICAgICAgIGRpZmZlcmVuY2VzID0gZGlmZihncmlkLmdyaWQsIHByZXZTdGF0ZSk7XG4gICAgICAgIHQuZXF1YWwoZ3JpZC5ncmlkLmJveGVzWzBdLmNvbHVtbnNwYW4sIDMsICdSZXNpemUgMiBzdGVwIGNvbHVtbnNwYW4nKTtcbiAgICAgICAgdC5lcXVhbChkaWZmZXJlbmNlcy5sZW5ndGgsIDEsICdSZXNpemUgMiBzdGVwIGNvbHVtbnNwYW4nKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTk9ORSBWQUxJRCBNT1ZFUy5cbiAgICAgICAgICovXG4gICAgICAgIC8vIEF0dGVtcHQgdG8gUmVzaXplIHBhcnQgb2YgYm94IG91dHNpZGUgdG9wIGJvcmRlci5cbiAgICAgICAgcHJldlN0YXRlID0gZGVlcGNvcHkoZ3JpZC5ncmlkKTtcbiAgICAgICAgZ3JpZC51cGRhdGVCb3goZ3JpZC5ncmlkLmJveGVzWzBdLCB7cm93c3BhbjogZ3JpZC5ncmlkLmJveGVzWzBdLnJvd3NwYW4gLSAzfSk7XG4gICAgICAgIGRpZmZlcmVuY2VzID0gZGlmZihncmlkLmdyaWQsIHByZXZTdGF0ZSk7XG4gICAgICAgIHQuZXF1YWwoZ3JpZC5ncmlkLmJveGVzWzBdLnJvd3NwYW4sIHByZXZTdGF0ZS5ib3hlc1swXS5yb3dzcGFuLCAnUmVzaXplIDAgcm93c3BhbicpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLCB1bmRlZmluZWQsICdSZXNpemUgMCByb3dzcGFuJyk7XG5cbiAgICAgICAgcHJldlN0YXRlID0gZGVlcGNvcHkoZ3JpZC5ncmlkKTtcbiAgICAgICAgZ3JpZC51cGRhdGVCb3goZ3JpZC5ncmlkLmJveGVzWzBdLCB7cm93c3BhbjogZ3JpZC5ncmlkLmJveGVzWzBdLnJvd3NwYW4gLSA5OTk5fSk7XG4gICAgICAgIGRpZmZlcmVuY2VzID0gZGlmZihncmlkLmdyaWQsIHByZXZTdGF0ZSk7XG4gICAgICAgIHQuZXF1YWwoZ3JpZC5ncmlkLmJveGVzWzBdLnJvd3NwYW4sIHByZXZTdGF0ZS5ib3hlc1swXS5yb3dzcGFuLCAnUmVzaXplIC0gcm93c3BhbicpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLCB1bmRlZmluZWQsICdSZXNpemUgLSByb3dzcGFuJyk7XG5cbiAgICAgICAgcHJldlN0YXRlID0gZGVlcGNvcHkoZ3JpZC5ncmlkKTtcbiAgICAgICAgZ3JpZC51cGRhdGVCb3goZ3JpZC5ncmlkLmJveGVzWzBdLCB7cm93c3BhbjogZ3JpZC5ncmlkLmJveGVzWzBdLnJvd3NwYW4gKyA5OTk5fSk7XG4gICAgICAgIGRpZmZlcmVuY2VzID0gZGlmZihncmlkLmdyaWQsIHByZXZTdGF0ZSk7XG4gICAgICAgIHQuZXF1YWwoZ3JpZC5ncmlkLmJveGVzWzBdLnJvd3NwYW4sIHByZXZTdGF0ZS5ib3hlc1swXS5yb3dzcGFuLCAnUmVzaXplICsgcm93c3BhbicpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLCB1bmRlZmluZWQsICdSZXNpemUgKyByb3dzcGFuJyk7XG5cbiAgICAgICAgcHJldlN0YXRlID0gZGVlcGNvcHkoZ3JpZC5ncmlkKTtcbiAgICAgICAgZ3JpZC51cGRhdGVCb3goZ3JpZC5ncmlkLmJveGVzWzBdLCB7Y29sdW1uc3BhbjogZ3JpZC5ncmlkLmJveGVzWzBdLmNvbHVtbnNwYW4gLSAzfSk7XG4gICAgICAgIGRpZmZlcmVuY2VzID0gZGlmZihncmlkLmdyaWQsIHByZXZTdGF0ZSk7XG4gICAgICAgIHQuZXF1YWwoZ3JpZC5ncmlkLmJveGVzWzBdLmNvbHVtbnNwYW4sIHByZXZTdGF0ZS5ib3hlc1swXS5jb2x1bW5zcGFuLCAnUmVzaXplIDAgY29sdW1uc3BhbicpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLCB1bmRlZmluZWQsICdSZXNpemUgMCBjb2x1bW5zcGFuJyk7XG5cbiAgICAgICAgcHJldlN0YXRlID0gZGVlcGNvcHkoZ3JpZC5ncmlkKTtcbiAgICAgICAgZ3JpZC51cGRhdGVCb3goZ3JpZC5ncmlkLmJveGVzWzBdLCB7Y29sdW1uc3BhbjogZ3JpZC5ncmlkLmJveGVzWzBdLmNvbHVtbnNwYW4gLSA5OTk5fSk7XG4gICAgICAgIGRpZmZlcmVuY2VzID0gZGlmZihncmlkLmdyaWQsIHByZXZTdGF0ZSk7XG4gICAgICAgIHQuZXF1YWwoZ3JpZC5ncmlkLmJveGVzWzBdLmNvbHVtbnNwYW4sIHByZXZTdGF0ZS5ib3hlc1swXS5jb2x1bW5zcGFuLCAnUmVzaXplIC0gY29sdW1uc3BhbicpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLCB1bmRlZmluZWQsICdSZXNpemUgLSBjb2x1bW5zcGFuJyk7XG5cbiAgICAgICAgcHJldlN0YXRlID0gZGVlcGNvcHkoZ3JpZC5ncmlkKTtcbiAgICAgICAgZ3JpZC51cGRhdGVCb3goZ3JpZC5ncmlkLmJveGVzWzBdLCB7Y29sdW1uc3BhbjogZ3JpZC5ncmlkLmJveGVzWzBdLmNvbHVtbnNwYW4gKyA5OTk5fSk7XG4gICAgICAgIGRpZmZlcmVuY2VzID0gZGlmZihncmlkLmdyaWQsIHByZXZTdGF0ZSk7XG4gICAgICAgIHQuZXF1YWwoZ3JpZC5ncmlkLmJveGVzWzBdLmNvbHVtbnNwYW4sIHByZXZTdGF0ZS5ib3hlc1swXS5jb2x1bW5zcGFuLCAnUmVzaXplICsgY29sdW1uc3BhbicpO1xuICAgICAgICB0LmVxdWFsKGRpZmZlcmVuY2VzLCB1bmRlZmluZWQsICdSZXNpemUgKyBjb2x1bW5zcGFuJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRlc3RpbmcgbWluL21heCBDb2x1bW5zcGFuIGFuZCBtaW4vbWF4IFJvd3NwYW4uXG4gICAgICAgICAqL1xuICAgICAgICBwcmV2U3RhdGUgPSBkZWVwY29weShncmlkLmdyaWQpO1xuICAgICAgICBncmlkLnVwZGF0ZUJveChncmlkLmdyaWQuYm94ZXNbMF0sIHtjb2x1bW5zcGFuOiBncmlkLmdyaWQuYm94ZXNbMF0uY29sdW1uc3BhbiAtIDk5OTl9KTtcbiAgICAgICAgZGlmZmVyZW5jZXMgPSBkaWZmKGdyaWQuZ3JpZCwgcHJldlN0YXRlKTtcbiAgICAgICAgdC5lcXVhbChncmlkLmdyaWQuYm94ZXNbMF0uY29sdW1uc3BhbiwgcHJldlN0YXRlLmJveGVzWzBdLmNvbHVtbnNwYW4sICdSZXNpemUgLSBjb2x1bW5zcGFuJyk7XG4gICAgICAgIHQuZXF1YWwoZGlmZmVyZW5jZXMsIHVuZGVmaW5lZCwgJ1Jlc2l6ZSAtIGNvbHVtbnNwYW4nKTtcblxuICAgICAgICBwcmV2U3RhdGUgPSBkZWVwY29weShncmlkLmdyaWQpO1xuICAgICAgICBncmlkLnVwZGF0ZUJveChncmlkLmdyaWQuYm94ZXNbMF0sIHtjb2x1bW5zcGFuOiBncmlkLmdyaWQuYm94ZXNbMF0uY29sdW1uc3BhbiArIDk5OTl9KTtcbiAgICAgICAgZGlmZmVyZW5jZXMgPSBkaWZmKGdyaWQuZ3JpZCwgcHJldlN0YXRlKTtcbiAgICAgICAgdC5lcXVhbChncmlkLmdyaWQuYm94ZXNbMF0uY29sdW1uc3BhbiwgcHJldlN0YXRlLmJveGVzWzBdLmNvbHVtbnNwYW4sICdSZXNpemUgKyBjb2x1bW5zcGFuJyk7XG4gICAgICAgIHQuZXF1YWwoZGlmZmVyZW5jZXMsIHVuZGVmaW5lZCwgJ1Jlc2l6ZSArIGNvbHVtbnNwYW4nKTtcblxuICAgICAgICBwcmV2U3RhdGUgPSBkZWVwY29weShncmlkLmdyaWQpO1xuICAgICAgICBncmlkLnVwZGF0ZUJveChncmlkLmdyaWQuYm94ZXNbMF0sIHtjb2x1bW5zcGFuOiBncmlkLmdyaWQuYm94ZXNbMF0uY29sdW1uc3BhbiAtIDk5OTl9KTtcbiAgICAgICAgZGlmZmVyZW5jZXMgPSBkaWZmKGdyaWQuZ3JpZCwgcHJldlN0YXRlKTtcbiAgICAgICAgdC5lcXVhbChncmlkLmdyaWQuYm94ZXNbMF0uY29sdW1uc3BhbiwgcHJldlN0YXRlLmJveGVzWzBdLmNvbHVtbnNwYW4sICdSZXNpemUgLSBjb2x1bW5zcGFuJyk7XG4gICAgICAgIHQuZXF1YWwoZGlmZmVyZW5jZXMsIHVuZGVmaW5lZCwgJ1Jlc2l6ZSAtIGNvbHVtbnNwYW4nKTtcblxuICAgICAgICBwcmV2U3RhdGUgPSBkZWVwY29weShncmlkLmdyaWQpO1xuICAgICAgICBncmlkLnVwZGF0ZUJveChncmlkLmdyaWQuYm94ZXNbMF0sIHtjb2x1bW5zcGFuOiBncmlkLmdyaWQuYm94ZXNbMF0uY29sdW1uc3BhbiArIDk5OTl9KTtcbiAgICAgICAgZGlmZmVyZW5jZXMgPSBkaWZmKGdyaWQuZ3JpZCwgcHJldlN0YXRlKTtcbiAgICAgICAgdC5lcXVhbChncmlkLmdyaWQuYm94ZXNbMF0uY29sdW1uc3BhbiwgcHJldlN0YXRlLmJveGVzWzBdLmNvbHVtbnNwYW4sICdSZXNpemUgKyBjb2x1bW5zcGFuJyk7XG4gICAgICAgIHQuZXF1YWwoZGlmZmVyZW5jZXMsIHVuZGVmaW5lZCwgJ1Jlc2l6ZSArIGNvbHVtbnNwYW4nKTtcblxuICAgICAgICBib3hlcyA9IFtcbiAgICAgICAgICAgIHsncm93JzogMCwgJ2NvbHVtbic6IDAsICdyb3dzcGFuJzogMywgJ2NvbHVtbnNwYW4nOiAzfVxuICAgICAgICBdO1xuICAgICAgICBncmlkID0gZGFzaEdyaWRHbG9iYWwoJyNncmlkJywge2JveGVzOiBib3hlcywgJ21pblJvd3NwYW4nOiAyLCAnbWF4Um93c3Bhbic6IDQsICdtaW5Db2x1bW5zcGFuJzogMiwgJ21heENvbHVtbnNwYW4nOiA0fSk7XG4gICAgICAgIHByZXZTdGF0ZSA9IGRlZXBjb3B5KGdyaWQuZ3JpZCk7XG4gICAgICAgIGdyaWQudXBkYXRlQm94KGdyaWQuZ3JpZC5ib3hlc1swXSwge3Jvd3NwYW46IGdyaWQuZ3JpZC5ib3hlc1swXS5yb3dzcGFuIC0gMn0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuICAgICAgICB0LmVxdWFsKGdyaWQuZ3JpZC5ib3hlc1swXS5yb3dzcGFuLCBwcmV2U3RhdGUuYm94ZXNbMF0ucm93c3BhbiwgJ1Jlc2l6ZSAtIHJvd3NwYW4nKTtcbiAgICAgICAgdC5lcXVhbChkaWZmZXJlbmNlcywgdW5kZWZpbmVkLCAnUmVzaXplIC0gcm93c3BhbicpO1xuXG4gICAgICAgIHByZXZTdGF0ZSA9IGRlZXBjb3B5KGdyaWQuZ3JpZCk7XG4gICAgICAgIGdyaWQudXBkYXRlQm94KGdyaWQuZ3JpZC5ib3hlc1swXSwge3Jvd3NwYW46IGdyaWQuZ3JpZC5ib3hlc1swXS5yb3dzcGFuICsgMn0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuICAgICAgICB0LmVxdWFsKGdyaWQuZ3JpZC5ib3hlc1swXS5yb3dzcGFuLCBwcmV2U3RhdGUuYm94ZXNbMF0ucm93c3BhbiwgJ1Jlc2l6ZSAtIHJvd3NwYW4nKTtcbiAgICAgICAgdC5lcXVhbChkaWZmZXJlbmNlcywgdW5kZWZpbmVkLCAnUmVzaXplIC0gcm93c3BhbicpO1xuXG4gICAgICAgIHByZXZTdGF0ZSA9IGRlZXBjb3B5KGdyaWQuZ3JpZCk7XG4gICAgICAgIGdyaWQudXBkYXRlQm94KGdyaWQuZ3JpZC5ib3hlc1swXSwge2NvbHVtbnNwYW46IGdyaWQuZ3JpZC5ib3hlc1swXS5jb2x1bW5zcGFuIC0gMn0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuICAgICAgICB0LmVxdWFsKGdyaWQuZ3JpZC5ib3hlc1swXS5jb2x1bW5zcGFuLCBwcmV2U3RhdGUuYm94ZXNbMF0uY29sdW1uc3BhbiwgJ1Jlc2l6ZSAtIGNvbHVtbnNwYW4nKTtcbiAgICAgICAgdC5lcXVhbChkaWZmZXJlbmNlcywgdW5kZWZpbmVkLCAnUmVzaXplIC0gY29sdW1uc3BhbicpO1xuXG4gICAgICAgIHByZXZTdGF0ZSA9IGRlZXBjb3B5KGdyaWQuZ3JpZCk7XG4gICAgICAgIGdyaWQudXBkYXRlQm94KGdyaWQuZ3JpZC5ib3hlc1swXSwge2NvbHVtbnNwYW46IGdyaWQuZ3JpZC5ib3hlc1swXS5jb2x1bW5zcGFuICsgMn0pO1xuICAgICAgICBkaWZmZXJlbmNlcyA9IGRpZmYoZ3JpZC5ncmlkLCBwcmV2U3RhdGUpO1xuICAgICAgICB0LmVxdWFsKGdyaWQuZ3JpZC5ib3hlc1swXS5jb2x1bW5zcGFuLCBwcmV2U3RhdGUuYm94ZXNbMF0uY29sdW1uc3BhbiwgJ1Jlc2l6ZSAtIGNvbHVtbnNwYW4nKTtcbiAgICAgICAgdC5lcXVhbChkaWZmZXJlbmNlcywgdW5kZWZpbmVkLCAnUmVzaXplIC0gY29sdW1uc3BhbicpO1xuXG4gICAgICAgIC8vIFZhbGlkIGFuZCBpbnZhbGlkIG1vdmUgYXQgdGhlIHNhbWUgdGltZVxuXG4gICAgICAgIC8vIFZhbGlkIGFuZCB2YWxpZCBtb3ZlIGF0IHRoZSBzYW1lIHRpbWVcblxuICAgICAgICAvLyBJbnZhbGlkIGFuZCBpbnZhbGlkIG1vdmUgYXQgdGhlIHNhbWUgdGltZVxuXG4gICAgICAgIHQuZW5kKCk7XG4gICAgfSk7XG5cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lKa2NtRm5aMlZ5TG5SbGMzUXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2VzExOSIsInZhciBkaWZmID0gcmVxdWlyZSgnZGVlcC1kaWZmJykuZGlmZjtcbnZhciBkZWVwY29weSA9IHJlcXVpcmUoJ2RlZXBjb3B5Jyk7XG5cbmltcG9ydCB7aXNOdW1iZXIsIGFycmF5c0VxdWFsfSBmcm9tICcuLi91dGlsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ3JpZFJlc2l6ZShkYXNoR3JpZEdsb2JhbCwgdGVzdCkge1xuICAgIC8vIE1vY2t1cC5cbiAgICBsZXQgZGlmZmVyZW5jZXMsIHByZXZTdGF0ZTtcbiAgICBsZXQgYm94ZXMgPSBbe3JvdzogMCwgY29sdW1uOiAwLCByb3dzcGFuOiAzLCBjb2x1bW5zcGFuOiAzfV07XG4gICAgbGV0IGdyaWQgPSBkYXNoR3JpZEdsb2JhbCgnI2dyaWQnLCB7Ym94ZXM6IGJveGVzfSk7XG59XG4iLCJpbXBvcnQge2lzTnVtYmVyLCBhcnJheXNFcXVhbH0gZnJvbSAnLi4vdXRpbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluaXRHcmlkKGRhc2hHcmlkR2xvYmFsLCB0ZXN0KSB7XG4gICAgLy8gTW9ja3VwLlxuICAgIGxldCBib3hlcyA9IFtcbiAgICAgICAgeydyb3cnOiAwLCAnY29sdW1uJzogMCwgJ3Jvd3NwYW4nOiAzLCAnY29sdW1uc3Bhbic6IDMsICdmbG9hdGluZyc6IGZhbHNlLCAnc3dhcHBpbmcnOiBmYWxzZSwgJ3B1c2hhYmxlJzogdHJ1ZSwgJ3Jlc2l6YWJsZSc6IHRydWUsICdkcmFnZ2FibGUnOiB0cnVlfVxuICAgIF07XG5cbiAgICB0ZXN0KCdJbml0aWFsaXplIEdyaWQgdXNpbmcgZGVmYXVsdCB2YWx1ZXMnLCBmdW5jdGlvbiAodCkge1xuICAgICAgICBsZXQgZGFzaGdyaWQgPSBkYXNoR3JpZEdsb2JhbChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZCcpLCB7fSk7XG5cbiAgICAgICAgLy8gQ2hlY2sgdGhhdCBncmlkIG9iamVjdCBnZXRzIGFsbCBwcm9wZXJ0aWVzLlxuICAgICAgICB0Lm5vdEVxdWFsKGRhc2hncmlkLmRhc2hncmlkLCB1bmRlZmluZWQsICdSZXR1cm5zIG9iamVjdCcpO1xuICAgICAgICB0Lm5vdEVxdWFsKGRhc2hncmlkLmRhc2hncmlkLCB1bmRlZmluZWQsICdIYXMgZ3JpZCBvcHRpb25zJyk7XG4gICAgICAgIHQubm90RXF1YWwoZGFzaGdyaWQudXBkYXRlQm94LCB1bmRlZmluZWQsICdIYXMgQVBJIHVwZGF0ZUJveCcpO1xuICAgICAgICB0Lm5vdEVxdWFsKGRhc2hncmlkLmluc2VydEJveCwgdW5kZWZpbmVkLCAnSGFzIEFQSSBpbnNlcnRCb3gnKTtcbiAgICAgICAgdC5ub3RFcXVhbChkYXNoZ3JpZC5yZW1vdmVCb3gsIHVuZGVmaW5lZCwgJ0hhcyBBUEkgcmVtb3ZlQm94Jyk7XG5cbiAgICAgICAgdC5lcXVhbChkYXNoZ3JpZC5kYXNoZ3JpZC5fZWxlbWVudC5ub2RlTmFtZSwgJ0RJVicsICdHcmlkIEVsZW1lbnQgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbChBcnJheS5pc0FycmF5KGRhc2hncmlkLmRhc2hncmlkLmJveGVzKSwgdHJ1ZSwgJ0JveGVzIGlzIGFycmF5Jyk7XG5cbiAgICAgICAgdC5lcXVhbChpc051bWJlcihkYXNoZ3JpZC5kYXNoZ3JpZC5udW1Sb3dzKSwgdHJ1ZSwgJ251bVJvd3MgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbChpc051bWJlcihkYXNoZ3JpZC5kYXNoZ3JpZC5taW5Sb3dzKSwgdHJ1ZSwgJ21pblJvd3MgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbChpc051bWJlcihkYXNoZ3JpZC5kYXNoZ3JpZC5tYXhSb3dzKSwgdHJ1ZSwgJ21heFJvd3MgaW5pdGlhbGl6ZWQnKTtcblxuICAgICAgICB0LmVxdWFsKGlzTnVtYmVyKGRhc2hncmlkLmRhc2hncmlkLm51bUNvbHVtbnMpLCB0cnVlLCAnbnVtQ29sdW1ucyBpbml0aWFsaXplZCcpO1xuICAgICAgICB0LmVxdWFsKGlzTnVtYmVyKGRhc2hncmlkLmRhc2hncmlkLm1pbkNvbHVtbnMpLCB0cnVlLCAnbWluQ29sdW1ucyBpbml0aWFsaXplZCcpO1xuICAgICAgICB0LmVxdWFsKGlzTnVtYmVyKGRhc2hncmlkLmRhc2hncmlkLm1heENvbHVtbnMpLCB0cnVlLCAnbWF4Q29sdW1ucyBpbml0aWFsaXplZCcpO1xuXG4gICAgICAgIHQuZXF1YWwoaXNOdW1iZXIoZGFzaGdyaWQuZGFzaGdyaWQubWluUm93c3BhbiksIHRydWUsICdtaW5Sb3dzcGFuIGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwoaXNOdW1iZXIoZGFzaGdyaWQuZGFzaGdyaWQubWF4Um93c3BhbiksIHRydWUsICdtYXhSb3dzcGFuIGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwoaXNOdW1iZXIoZGFzaGdyaWQuZGFzaGdyaWQubWluQ29sdW1uc3BhbiksIHRydWUsICdtaW5Db2x1bW5zcGFuIGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwoaXNOdW1iZXIoZGFzaGdyaWQuZGFzaGdyaWQubWF4Q29sdW1uc3BhbiksIHRydWUsICdtYXhDb2x1bW5zcGFuIGluaXRpYWxpemVkJyk7XG5cbiAgICAgICAgdC5lcXVhbChpc051bWJlcihkYXNoZ3JpZC5kYXNoZ3JpZC54TWFyZ2luKSwgdHJ1ZSwgJ3hNYXJnaW4gaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbChpc051bWJlcihkYXNoZ3JpZC5kYXNoZ3JpZC55TWFyZ2luKSwgdHJ1ZSwgJ3lNYXJnaW4gaW5pdGlhbGl6ZWQnKTtcblxuICAgICAgICAvLyB0LmVxdWFsKHR5cGVvZiBncmlkLnB1c2hhYmxlLCAnYm9vbGVhbicsICdwdXNoYWJsZSBpbml0aWFsaXplZCcpO1xuICAgICAgICAvLyB0LmVxdWFsKHR5cGVvZiBncmlkLmZsb2F0aW5nLCAnYm9vbGVhbicsICdmbG9hdGluZyBpbml0aWFsaXplZCcpO1xuICAgICAgICAvLyB0LmVxdWFsKHR5cGVvZiBncmlkLnN0YWNraW5nLCAnYm9vbGVhbicsICdzdGFja2luZyBpbml0aWFsaXplZCcpO1xuICAgICAgICAvLyB0LmVxdWFsKHR5cGVvZiBncmlkLnN3YXBwaW5nLCAnYm9vbGVhbicsICdzd2FwcGluZyBpbml0aWFsaXplZCcpO1xuXG4gICAgICAgIHQuZXF1YWwodHlwZW9mIGRhc2hncmlkLmRhc2hncmlkLmFuaW1hdGUsICdib29sZWFuJywgJ2FuaW1hdGUgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbCh0eXBlb2YgZGFzaGdyaWQuZGFzaGdyaWQubGl2ZUNoYW5nZXMsICdib29sZWFuJywgJ2xpdmVDaGFuZ2VzIGluaXRpYWxpemVkJyk7XG4gICAgICAgIC8vIHQuZXF1YWwoaXNOdW1iZXIoZGFzaGdyaWQuZGFzaGdyaWQubW9iaWxlQnJlYWtQb2ludCksIHRydWUsICdtb2JpbGVCcmVha1BvaW50IGluaXRpYWxpemVkJyk7XG4gICAgICAgIC8vIHQuZXF1YWwodHlwZW9mIGdyaWQubW9iaWxlQnJlYWtQb2ludEVuYWJsZWQsICdib29sZWFuJywgJ21vYmlsZUJyZWFrUG9pbnRFbmFibGVkIGluaXRpYWxpemVkJyk7XG5cbiAgICAgICAgdC5lcXVhbChpc051bWJlcihkYXNoZ3JpZC5kYXNoZ3JpZC5zY3JvbGxTZW5zaXRpdml0eSksIHRydWUsICdzY3JvbGxTZW5zaXRpdml0eSBpbml0aWFsaXplZCcpO1xuICAgICAgICB0LmVxdWFsKGlzTnVtYmVyKGRhc2hncmlkLmRhc2hncmlkLnNjcm9sbFNwZWVkKSwgdHJ1ZSwgJ3Njcm9sbFNwZWVkIGluaXRpYWxpemVkJyk7XG5cbiAgICAgICAgdC5lcXVhbChpc051bWJlcihkYXNoZ3JpZC5kYXNoZ3JpZC5zbmFwQmFja1RpbWUpLCB0cnVlLCAnc25hcEJhY2tUaW1lIGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwodHlwZW9mIGRhc2hncmlkLmRhc2hncmlkLnNob3dHcmlkTGluZXMsICdib29sZWFuJywgJ3Nob3dHcmlkTGluZXMgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbCh0eXBlb2YgZGFzaGdyaWQuZGFzaGdyaWQuc2hvd0dyaWRDZW50cm9pZHMsICdib29sZWFuJywgJ3Nob3dHcmlkQ2VudHJvaWRzIGluaXRpYWxpemVkJyk7XG5cbiAgICAgICAgdC5lcXVhbCh0eXBlb2YgZGFzaGdyaWQuZGFzaGdyaWQuZHJhZ2dhYmxlLCAnb2JqZWN0JywgJ2RyYWdnYWJsZSBpbml0aWFsaXplZCcpO1xuICAgICAgICB0LmVxdWFsKHR5cGVvZiBkYXNoZ3JpZC5kYXNoZ3JpZC5kcmFnZ2FibGUuZW5hYmxlZCwgJ2Jvb2xlYW4nLCAnZHJhZ2dhYmxlLmVuYWJsZWQgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbChkYXNoZ3JpZC5kYXNoZ3JpZC5kcmFnZ2FibGUuaGFuZGxlLCAnZGFzaGdyaWQtYm94JywgJ2RyYWdnYWJsZS5oYW5kbGVzIGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwoZGFzaGdyaWQuZGFzaGdyaWQuZHJhZ2dhYmxlLmRyYWdTdGFydCwgdW5kZWZpbmVkLCAnZHJhZ1N0YXJ0IGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwoZGFzaGdyaWQuZGFzaGdyaWQuZHJhZ2dhYmxlLmRyYWdnaW5nLCB1bmRlZmluZWQsICdkcmFnZ2luZyBpbml0aWFsaXplZCcpO1xuICAgICAgICB0LmVxdWFsKGRhc2hncmlkLmRhc2hncmlkLmRyYWdnYWJsZS5kcmFnRW5kLCB1bmRlZmluZWQsICdkcmFnRW5kIGluaXRpYWxpemVkJyk7XG5cbiAgICAgICAgdC5lcXVhbCh0eXBlb2YgZGFzaGdyaWQuZGFzaGdyaWQucmVzaXphYmxlLCAnb2JqZWN0JywgJ3Jlc2l6YWJsZSBpbml0aWFsaXplZCcpO1xuICAgICAgICB0LmVxdWFsKHR5cGVvZiBkYXNoZ3JpZC5kYXNoZ3JpZC5yZXNpemFibGUuZW5hYmxlZCwgJ2Jvb2xlYW4nLCAnZW5hYmxlZCBpbml0aWFsaXplZCcpO1xuICAgICAgICB0LmVxdWFsKEFycmF5LmlzQXJyYXkoZGFzaGdyaWQuZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZSksIHRydWUsICdyZXNpemFibGUgaGFuZGxlcyBpbml0aWFsaXplZCcpO1xuICAgICAgICB0LmVxdWFsKGlzTnVtYmVyKGRhc2hncmlkLmRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCksIHRydWUsICdoYW5kbGVXaWR0aCBpbml0aWFsaXplZCcpO1xuICAgICAgICB0LmVxdWFsKGRhc2hncmlkLmRhc2hncmlkLnJlc2l6YWJsZS5yZXNpemVTdGFydCwgdW5kZWZpbmVkLCAncmVzaXplU3RhcnQgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbChkYXNoZ3JpZC5kYXNoZ3JpZC5yZXNpemFibGUucmVzaXppbmcsIHVuZGVmaW5lZCwgJ3Jlc2l6aW5nIGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwoZGFzaGdyaWQuZGFzaGdyaWQucmVzaXphYmxlLnJlc2l6ZUVuZCwgdW5kZWZpbmVkLCAncmVzaXplIGluaXRpYWxpemVkJyk7XG5cbiAgICAgICAgdC5lbmQoKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ0luaXRpYWxpemUgR3JpZCB1c2luZyBtYW51YWxseSBlbnRlcmVkIHZhbHVlcycsIGZ1bmN0aW9uICh0KSB7XG5cbiAgICAgICAgbGV0IGdzID0ge1xuICAgICAgICAgICAgYm94ZXM6IFtdLFxuICAgICAgICAgICAgcm93SGVpZ2h0OiA4MCxcbiAgICAgICAgICAgIG51bVJvd3M6IDEwLFxuICAgICAgICAgICAgbWluUm93czogMTAsXG4gICAgICAgICAgICBtYXhSb3dzOiAxMCxcbiAgICAgICAgICAgIGNvbHVtbldpZHRoOiAxMjAsXG4gICAgICAgICAgICBudW1Db2x1bW5zOiA2LFxuICAgICAgICAgICAgbWluQ29sdW1uczogNixcbiAgICAgICAgICAgIG1heENvbHVtbnM6IDEwLFxuICAgICAgICAgICAgeE1hcmdpbjogMjAsXG4gICAgICAgICAgICB5TWFyZ2luOiAxMCxcbiAgICAgICAgICAgIGRyYWdnYWJsZToge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgaGFuZGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZHJhZ1N0YXJ0OiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgICAgICAgICBkcmFnZ2luZzogZnVuY3Rpb24gKCkge30sXG4gICAgICAgICAgICAgICAgZHJhZ0VuZDogZnVuY3Rpb24gKCkge31cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNpemFibGU6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhhbmRsZTogWyduJywgJ2UnLCAncycsICd3JywgJ25lJywgJ3NlJywgJ3N3JywgJ253J10sXG4gICAgICAgICAgICAgICAgaGFuZGxlV2lkdGg6IDEwLFxuICAgICAgICAgICAgICAgIHJlc2l6ZVN0YXJ0OiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgICAgICAgICByZXNpemluZzogZnVuY3Rpb24gKCkge30sXG4gICAgICAgICAgICAgICAgcmVzaXplRW5kOiBmdW5jdGlvbiAoKSB7fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1pblJvd3NwYW46IDEsXG4gICAgICAgICAgICBtYXhSb3dzcGFuOiAxMCxcbiAgICAgICAgICAgIG1pbkNvbHVtbnNwYW46IDEsXG4gICAgICAgICAgICBtYXhDb2x1bW5zcGFuOiAxMCxcbiAgICAgICAgICAgIHB1c2hhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZmxvYXRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgc3RhY2tpbmc6IGZhbHNlLFxuICAgICAgICAgICAgc3dhcHBpbmc6IGZhbHNlLFxuICAgICAgICAgICAgYW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgIGxpdmVDaGFuZ2VzOiB0cnVlLFxuICAgICAgICAgICAgbW9iaWxlQnJlYWtQb2ludDogNjAwLFxuICAgICAgICAgICAgbW9iaWxlQnJlYWtQb2ludEVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgc2Nyb2xsU2Vuc2l0aXZpdHk6IDIwLFxuICAgICAgICAgICAgc2Nyb2xsU3BlZWQ6IDEwLFxuICAgICAgICAgICAgc25hcEJhY2tUaW1lOiA0MDAsXG4gICAgICAgICAgICBzaG93R3JpZExpbmVzOiB0cnVlLFxuICAgICAgICAgICAgc2hvd0dyaWRDZW50cm9pZHM6IHRydWVcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGRhc2hncmlkID0gZGFzaEdyaWRHbG9iYWwoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQnKSwgZ3MpO1xuXG4gICAgICAgIC8vIENoZWNrIHRoYXQgZ3JpZCBvYmplY3QgZ2V0cyBhbGwgcHJvcGVydGllcy5cbiAgICAgICAgdC5ub3RFcXVhbChkYXNoZ3JpZC5kYXNoZ3JpZCwgdW5kZWZpbmVkLCAnUmV0dXJucyBvYmplY3QnKTtcbiAgICAgICAgdC5ub3RFcXVhbChkYXNoZ3JpZC5kYXNoZ3JpZCwgdW5kZWZpbmVkLCAnSGFzIGdyaWQgb3B0aW9ucycpO1xuICAgICAgICB0Lm5vdEVxdWFsKGRhc2hncmlkLnVwZGF0ZUJveCwgdW5kZWZpbmVkLCAnSGFzIEFQSSB1cGRhdGVCb3gnKTtcbiAgICAgICAgdC5ub3RFcXVhbChkYXNoZ3JpZC5pbnNlcnRCb3gsIHVuZGVmaW5lZCwgJ0hhcyBBUEkgaW5zZXJ0Qm94Jyk7XG4gICAgICAgIHQubm90RXF1YWwoZGFzaGdyaWQucmVtb3ZlQm94LCB1bmRlZmluZWQsICdIYXMgQVBJIHJlbW92ZUJveCcpO1xuXG4gICAgICAgIHQuZXF1YWwoZGFzaGdyaWQuZGFzaGdyaWQuX2VsZW1lbnQubm9kZU5hbWUsICdESVYnLCAnR3JpZCBFbGVtZW50IGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwoQXJyYXkuaXNBcnJheShkYXNoZ3JpZC5kYXNoZ3JpZC5ib3hlcyksIHRydWUsICdCb3hlcyBpcyBhcnJheScpO1xuXG4gICAgICAgIHQuZXF1YWwoZGFzaGdyaWQuZGFzaGdyaWQucm93SGVpZ2h0LCBncy5yb3dIZWlnaHQsICdSb3dIZWlnaHQgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbChkYXNoZ3JpZC5kYXNoZ3JpZC5udW1Sb3dzLCBncy5udW1Sb3dzLCAnbnVtUm93cyBpbml0aWFsaXplZCcpO1xuICAgICAgICB0LmVxdWFsKGRhc2hncmlkLmRhc2hncmlkLm1pblJvd3MsIGdzLm1pblJvd3MsICdtaW5Sb3dzIGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwoZGFzaGdyaWQuZGFzaGdyaWQubWF4Um93cywgZ3MubWF4Um93cywgJ21heFJvd3MgaW5pdGlhbGl6ZWQnKTtcblxuICAgICAgICB0LmVxdWFsKGRhc2hncmlkLmRhc2hncmlkLmNvbHVtbldpZHRoLCBncy5jb2x1bW5XaWR0aCwgJ2NvbHVtbldpZHRoIGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwoZGFzaGdyaWQuZGFzaGdyaWQubnVtQ29sdW1ucywgZ3MubnVtQ29sdW1ucywgJ251bUNvbHVtbnMgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbChkYXNoZ3JpZC5kYXNoZ3JpZC5taW5Db2x1bW5zLCBncy5taW5Db2x1bW5zLCAnbWluQ29sdW1ucyBpbml0aWFsaXplZCcpO1xuICAgICAgICB0LmVxdWFsKGRhc2hncmlkLmRhc2hncmlkLm1heENvbHVtbnMsIGdzLm1heENvbHVtbnMsICdtYXhDb2x1bW5zIGluaXRpYWxpemVkJyk7XG5cbiAgICAgICAgdC5lcXVhbChkYXNoZ3JpZC5kYXNoZ3JpZC5taW5Sb3dzcGFuLCBncy5taW5Sb3dzcGFuLCAnbWluUm93c3BhbiBpbml0aWFsaXplZCcpO1xuICAgICAgICB0LmVxdWFsKGRhc2hncmlkLmRhc2hncmlkLm1heFJvd3NwYW4sIGdzLm1heFJvd3NwYW4sICdtYXhSb3dzcGFuIGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwoZGFzaGdyaWQuZGFzaGdyaWQubWluQ29sdW1uc3BhbiwgZ3MubWluQ29sdW1uc3BhbiwgJ21pbkNvbHVtbnNwYW4gaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbChkYXNoZ3JpZC5kYXNoZ3JpZC5tYXhDb2x1bW5zcGFuLCBncy5tYXhDb2x1bW5zcGFuLCAnbWF4Q29sdW1uc3BhbiBpbml0aWFsaXplZCcpO1xuXG4gICAgICAgIHQuZXF1YWwoZGFzaGdyaWQuZGFzaGdyaWQueE1hcmdpbiwgZ3MueE1hcmdpbiwgJ3hNYXJnaW4gaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbChkYXNoZ3JpZC5kYXNoZ3JpZC55TWFyZ2luLCBncy55TWFyZ2luLCAneU1hcmdpbiBpbml0aWFsaXplZCcpO1xuXG4gICAgICAgIHQuZXF1YWwoZGFzaGdyaWQuZGFzaGdyaWQucHVzaGFibGUsIGdzLnB1c2hhYmxlLCAncHVzaGFibGUgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbChkYXNoZ3JpZC5kYXNoZ3JpZC5mbG9hdGluZywgZ3MuZmxvYXRpbmcsICdmbG9hdGluZyBpbml0aWFsaXplZCcpO1xuICAgICAgICB0LmVxdWFsKGRhc2hncmlkLmRhc2hncmlkLnN0YWNraW5nLCBncy5zdGFja2luZywgJ3N0YWNraW5nIGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwoZGFzaGdyaWQuZGFzaGdyaWQuc3dhcHBpbmcsIGdzLnN3YXBwaW5nLCAnc3dhcHBpbmcgaW5pdGlhbGl6ZWQnKTtcblxuICAgICAgICB0LmVxdWFsKGRhc2hncmlkLmRhc2hncmlkLmFuaW1hdGUsIGdzLmFuaW1hdGUsICdhbmltYXRlIGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwoZGFzaGdyaWQuZGFzaGdyaWQubGl2ZUNoYW5nZXMsIGdzLmxpdmVDaGFuZ2VzLCAnbGl2ZUNoYW5nZXMgaW5pdGlhbGl6ZWQnKTtcblxuICAgICAgICAvLyB0LmVxdWFsKGRhc2hncmlkLmRhc2hncmlkLm1vYmlsZUJyZWFrUG9pbnQsIGdzLm1vYmlsZUJyZWFrUG9pbnQsICdtb2JpbGVCcmVha1BvaW50IGluaXRpYWxpemVkJyk7XG4gICAgICAgIC8vIHQuZXF1YWwoZGFzaGdyaWQuZGFzaGdyaWQubW9iaWxlQnJlYWtQb2ludEVuYWJsZWQsIGdzLm1vYmlsZUJyZWFrUG9pbnRFbmFibGVkLCAnbW9iaWxlQnJlYWtQb2ludEVuYWJsZWQgaW5pdGlhbGl6ZWQnKTtcblxuICAgICAgICB0LmVxdWFsKGRhc2hncmlkLmRhc2hncmlkLnNjcm9sbFNlbnNpdGl2aXR5LCBncy5zY3JvbGxTZW5zaXRpdml0eSwgJ3Njcm9sbFNlbnNpdGl2aXR5IGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwoZGFzaGdyaWQuZGFzaGdyaWQuc2Nyb2xsU3BlZWQsIGdzLnNjcm9sbFNwZWVkLCAnc2Nyb2xsU3BlZWQgaW5pdGlhbGl6ZWQnKTtcblxuICAgICAgICB0LmVxdWFsKGRhc2hncmlkLmRhc2hncmlkLnNuYXBCYWNrVGltZSwgZ3Muc25hcEJhY2tUaW1lLCAnc25hcEJhY2tUaW1lIGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwoZGFzaGdyaWQuZGFzaGdyaWQuc2hvd0dyaWRMaW5lcywgZ3Muc2hvd0dyaWRMaW5lcywgJ3Nob3dHcmlkTGluZXMgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbChkYXNoZ3JpZC5kYXNoZ3JpZC5zaG93R3JpZENlbnRyb2lkcywgZ3Muc2hvd0dyaWRDZW50cm9pZHMsICdzaG93R3JpZENlbnRyb2lkcyBpbml0aWFsaXplZCcpO1xuXG4gICAgICAgIHQuZXF1YWwodHlwZW9mIGRhc2hncmlkLmRhc2hncmlkLmRyYWdnYWJsZSwgJ29iamVjdCcsICdkcmFnZ2FibGUgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbChkYXNoZ3JpZC5kYXNoZ3JpZC5kcmFnZ2FibGUuZW5hYmxlZCwgdHJ1ZSwgJ2RyYWdnYWJsZS5lbmFibGVkIGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwoZGFzaGdyaWQuZGFzaGdyaWQuZHJhZ2dhYmxlLmhhbmRsZSwgJ2Rhc2hncmlkLWJveCcsICdkcmFnZ2FibGUuaGFuZGxlIGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwodHlwZW9mIGRhc2hncmlkLmRhc2hncmlkLmRyYWdnYWJsZS5kcmFnU3RhcnQsICdmdW5jdGlvbicsICdkcmFnU3RhcnQgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbCh0eXBlb2YgZGFzaGdyaWQuZGFzaGdyaWQuZHJhZ2dhYmxlLmRyYWdnaW5nLCAnZnVuY3Rpb24nLCAnZHJhZ2dpbmcgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbCh0eXBlb2YgZGFzaGdyaWQuZGFzaGdyaWQuZHJhZ2dhYmxlLmRyYWdFbmQsICdmdW5jdGlvbicsICdkcmFnRW5kIGluaXRpYWxpemVkJyk7XG5cbiAgICAgICAgdC5lcXVhbCh0eXBlb2YgZGFzaGdyaWQuZGFzaGdyaWQucmVzaXphYmxlLCAnb2JqZWN0JywgJ3Jlc2l6YWJsZSBpbml0aWFsaXplZCcpO1xuICAgICAgICB0LmVxdWFsKGRhc2hncmlkLmRhc2hncmlkLnJlc2l6YWJsZS5lbmFibGVkLCBncy5yZXNpemFibGUuZW5hYmxlZCwgJ3Jlc2l6YWJsZSBlbmFibGVkIGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwoYXJyYXlzRXF1YWwoZGFzaGdyaWQuZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZSwgWyduJywgJ2UnLCAncycsICd3JywgJ25lJywgJ3NlJywgJ3N3JywgJ253J10pLCB0cnVlLCAncmVzaXphYmxlIGhhbmRsZXMgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgdC5lcXVhbChkYXNoZ3JpZC5kYXNoZ3JpZC5yZXNpemFibGUuaGFuZGxlV2lkdGgsIGdzLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCwgJ2hhbmRsZVdpZHRoIGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwodHlwZW9mIGRhc2hncmlkLmRhc2hncmlkLnJlc2l6YWJsZS5yZXNpemVTdGFydCwgJ2Z1bmN0aW9uJywgJ3Jlc2l6ZVN0YXJ0IGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwodHlwZW9mIGRhc2hncmlkLmRhc2hncmlkLnJlc2l6YWJsZS5yZXNpemluZywgJ2Z1bmN0aW9uJywgJ3Jlc2l6aW5nIGluaXRpYWxpemVkJyk7XG4gICAgICAgIHQuZXF1YWwodHlwZW9mIGRhc2hncmlkLmRhc2hncmlkLnJlc2l6YWJsZS5yZXNpemVFbmQsICdmdW5jdGlvbicsICdyZXNpemUgaW5pdGlhbGl6ZWQnKTtcblxuICAgICAgICB0LmVuZCgpO1xuICAgIH0pO1xuXG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZXZlbnRGaXJlKGVsLCBldHlwZSl7XG4gICAgaWYgKGVsLmZpcmVFdmVudCkge1xuICAgICAgICBlbC5maXJlRXZlbnQoJ29uJyArIGV0eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZXZPYmogPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnRzJyk7XG4gICAgICAgIGV2T2JqLmluaXRFdmVudChldHlwZSwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KGV2T2JqKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZVJ1bkFsbCh0LCBvMSwgbzIpIHtcbiAgICB0LmFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgT2JqZWN0LmtleXModCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAoa2V5ICE9PSAnYWxsJykge3Rba2V5XShvMSwgbzIpO31cbiAgICAgICAgfSk7XG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtYmVyKG9iaikge1xuICAgIHJldHVybiAhQXJyYXkuaXNBcnJheShvYmopICYmIChvYmogLSBwYXJzZUZsb2F0KG9iaikgKyAxKSA+PSAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbihvYmplY3QpIHtcbiAgICAvLyByZXR1cm4gb2JqZWN0ICYmIGdldENsYXNzLmNhbGwob2JqZWN0KSA9PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlzRXF1YWwoYSwgYikge1xuICBpZiAoYSA9PT0gYikgcmV0dXJuIHRydWU7XG4gIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gIGlmIChhLmxlbmd0aCAhPSBiLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIElmIHlvdSBkb24ndCBjYXJlIGFib3V0IHRoZSBvcmRlciBvZiB0aGUgZWxlbWVudHMgaW5zaWRlXG4gIC8vIHRoZSBhcnJheSwgeW91IHNob3VsZCBzb3J0IGJvdGggYXJyYXlzIGhlcmUuXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IEJveDtcblxuLyoqXG4gKlxuICogQHBhcmFtIHt9XG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBCb3goY29tcCkge1xuICAgIGxldCB7ZGFzaGdyaWR9ID0gY29tcDtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBCb3ggZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94IGJveC5cbiAgICAgKi9cbiAgICBsZXQgY3JlYXRlQm94ID0gZnVuY3Rpb24gKGJveCkge1xuICAgICAgICBPYmplY3QuYXNzaWduKGJveCwgYm94U2V0dGluZ3MoYm94LCBkYXNoZ3JpZCkpO1xuICAgICAgICBpZiAoYm94LmNvbnRlbnQpIHtcbiAgICAgICAgICAgIGJveC5fZWxlbWVudC5hcHBlbmRDaGlsZChib3guY29udGVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBkYXNoZ3JpZC5fYm94ZXNFbGVtZW50LmFwcGVuZENoaWxkKGJveC5fZWxlbWVudCk7XG4gICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIHRoZSBzaGFkb3cgYm94IGVsZW1lbnQgd2hpY2ggaXMgdXNlZCB3aGVuIGRyYWdnaW5nIC8gcmVzaXppbmdcbiAgICAgKiAgICAgYSBib3guIEl0IGdldHMgYXR0YWNoZWQgdG8gdGhlIGRyYWdnaW5nIC8gcmVzaXppbmcgYm94LCB3aGlsZVxuICAgICAqICAgICBib3ggZ2V0cyB0byBtb3ZlIC8gcmVzaXplIGZyZWVseSBhbmQgc25hcHMgYmFjayB0byBpdHMgb3JpZ2luYWxcbiAgICAgKiAgICAgb3IgbmV3IHBvc2l0aW9uIGF0IGRyYWcgLyByZXNpemUgc3RvcC4gQXBwZW5kIGl0IHRvIHRoZSBncmlkLlxuICAgICAqL1xuICAgIGxldCBjcmVhdGVTaGFkb3dCb3ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGFzaGdyaWQtc2hhZG93LWJveCcpID09PSBudWxsKSB7XG4gICAgICAgICAgICBkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuaWQgPSAnZGFzaGdyaWQtc2hhZG93LWJveCc7XG5cbiAgICAgICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LmNsYXNzTmFtZSA9ICdkYXNoZ3JpZC1zaGFkb3ctYm94JztcbiAgICAgICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLnpJbmRleCA9IDEwMDI7XG4gICAgICAgICAgICBkYXNoZ3JpZC5fZWxlbWVudC5hcHBlbmRDaGlsZChkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe2NyZWF0ZUJveCwgY3JlYXRlU2hhZG93Qm94fSk7XG59XG5cbi8qKlxuICogQm94IHByb3BlcnRpZXMgYW5kIGV2ZW50cy5cbiAqL1xuZnVuY3Rpb24gYm94U2V0dGluZ3MoYm94RWxlbWVudCwgZGFzaGdyaWQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBfZWxlbWVudDogKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZWwuY2xhc3NOYW1lID0gJ2Rhc2hncmlkLWJveCc7XG4gICAgICAgICAgICBlbC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICBlbC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XG4gICAgICAgICAgICBlbC5zdHlsZS50cmFuc2l0aW9uID0gZGFzaGdyaWQudHJhbnNpdGlvbjtcbiAgICAgICAgICAgIGVsLnN0eWxlLnpJbmRleCA9IDEwMDM7XG4gICAgICAgICAgICBjcmVhdGVCb3hSZXNpemVIYW5kbGVycyhlbCwgZGFzaGdyaWQpO1xuXG4gICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgIH0oKSksXG5cbiAgICAgICAgcm93OiBib3hFbGVtZW50LnJvdyxcbiAgICAgICAgY29sdW1uOiBib3hFbGVtZW50LmNvbHVtbixcbiAgICAgICAgcm93c3BhbjogYm94RWxlbWVudC5yb3dzcGFuIHx8IDEsXG4gICAgICAgIGNvbHVtbnNwYW46IGJveEVsZW1lbnQuY29sdW1uc3BhbiB8fCAxLFxuICAgICAgICBkcmFnZ2FibGU6IChib3hFbGVtZW50LmRyYWdnYWJsZSA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICByZXNpemFibGU6IChib3hFbGVtZW50LnJlc2l6YWJsZSA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICBwdXNoYWJsZTogKGJveEVsZW1lbnQucHVzaGFibGUgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgZmxvYXRpbmc6IChib3hFbGVtZW50LmZsb2F0aW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgc3RhY2tpbmc6IChib3hFbGVtZW50LnN0YWNraW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgc3dhcHBpbmc6IChib3hFbGVtZW50LnN3YXBwaW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgaW5oZXJpdDogKGJveEVsZW1lbnQuaW5oZXJpdCA9PT0gdHJ1ZSkgPyB0cnVlIDogZmFsc2UsXG4gICAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGJveCByZXNpemUgaGFuZGxlcnMgYW5kIGFwcGVuZHMgdGhlbSB0byBib3guXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJveFJlc2l6ZUhhbmRsZXJzKGJveEVsZW1lbnQsIGRhc2hncmlkKSB7XG4gICAgbGV0IGhhbmRsZTtcblxuICAgIC8qKlxuICAgICAqIFRPUCBIYW5kbGVyLlxuICAgICAqL1xuICAgIGlmIChkYXNoZ3JpZC5yZXNpemFibGUuaGFuZGxlLmluZGV4T2YoJ24nKSAhPT0gLTEpIHtcbiAgICAgICAgaGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhhbmRsZS5jbGFzc05hbWUgPSAnZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtbic7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5sZWZ0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS50b3AgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuaGVpZ2h0ID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmN1cnNvciA9ICduLXJlc2l6ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnpJbmRleCA9IDEwMDM7XG4gICAgICAgIGJveEVsZW1lbnQuYXBwZW5kQ2hpbGQoaGFuZGxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCT1RUT00gSGFuZGxlci5cbiAgICAgKi9cbiAgICBpZiAoZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZS5pbmRleE9mKCdzJykgIT09IC0xKSB7XG4gICAgICAgIGhhbmRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBoYW5kbGUuY2xhc3NOYW1lID0gJ2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLXMnO1xuICAgICAgICBoYW5kbGUuc3R5bGUubGVmdCA9IDAgKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuYm90dG9tID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9IGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5jdXJzb3IgPSAncy1yZXNpemUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS56SW5kZXggPSAxMDAzO1xuICAgICAgICBib3hFbGVtZW50LmFwcGVuZENoaWxkKGhhbmRsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV0VTVCBIYW5kbGVyLlxuICAgICAqL1xuICAgIGlmIChkYXNoZ3JpZC5yZXNpemFibGUuaGFuZGxlLmluZGV4T2YoJ3cnKSAhPT0gLTEpIHtcbiAgICAgICAgaGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhhbmRsZS5jbGFzc05hbWUgPSAnZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtdyc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5sZWZ0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS50b3AgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmN1cnNvciA9ICd3LXJlc2l6ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnpJbmRleCA9IDEwMDM7XG4gICAgICAgIGJveEVsZW1lbnQuYXBwZW5kQ2hpbGQoaGFuZGxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFQVNUIEhhbmRsZXIuXG4gICAgICovXG4gICAgaWYgKGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGUuaW5kZXhPZignZScpICE9PSAtMSkge1xuICAgICAgICBoYW5kbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaGFuZGxlLmNsYXNzTmFtZSA9ICdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1lJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnJpZ2h0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS50b3AgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmN1cnNvciA9ICdlLXJlc2l6ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnpJbmRleCA9IDEwMDM7XG4gICAgICAgIGJveEVsZW1lbnQuYXBwZW5kQ2hpbGQoaGFuZGxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBOT1JUSC1FQVNUIEhhbmRsZXIuXG4gICAgICovXG4gICAgaWYgKGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGUuaW5kZXhPZignbmUnKSAhPT0gLTEpIHtcbiAgICAgICAgaGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhhbmRsZS5jbGFzc05hbWUgPSAnZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtbmUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUucmlnaHQgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnRvcCA9IDAgKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUud2lkdGggPSBkYXNoZ3JpZC5yZXNpemFibGUuaGFuZGxlV2lkdGggKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuaGVpZ2h0ID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmN1cnNvciA9ICduZS1yZXNpemUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS56SW5kZXggPSAxMDAzO1xuICAgICAgICBib3hFbGVtZW50LmFwcGVuZENoaWxkKGhhbmRsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU09VVEgtRUFTVCBIYW5kbGVyLlxuICAgICAqL1xuICAgIGlmIChkYXNoZ3JpZC5yZXNpemFibGUuaGFuZGxlLmluZGV4T2YoJ3NlJykgIT09IC0xKSB7XG4gICAgICAgIGhhbmRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBoYW5kbGUuY2xhc3NOYW1lID0gJ2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLXNlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnJpZ2h0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5ib3R0b20gPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9IGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5jdXJzb3IgPSAnc2UtcmVzaXplJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBoYW5kbGUuc3R5bGUuekluZGV4ID0gMTAwMztcbiAgICAgICAgYm94RWxlbWVudC5hcHBlbmRDaGlsZChoYW5kbGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNPVVRILVdFU1QgSGFuZGxlci5cbiAgICAgKi9cbiAgICBpZiAoZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZS5pbmRleE9mKCdzdycpICE9PSAtMSkge1xuICAgICAgICBoYW5kbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaGFuZGxlLmNsYXNzTmFtZSA9ICdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1zdyc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5sZWZ0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5ib3R0b20gPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9IGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5jdXJzb3IgPSAnc3ctcmVzaXplJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBoYW5kbGUuc3R5bGUuekluZGV4ID0gMTAwMztcbiAgICAgICAgYm94RWxlbWVudC5hcHBlbmRDaGlsZChoYW5kbGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE5PUlRILVdFU1QgSGFuZGxlci5cbiAgICAgKi9cbiAgICBpZiAoZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZS5pbmRleE9mKCdudycpICE9PSAtMSkge1xuICAgICAgICBoYW5kbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaGFuZGxlLmNsYXNzTmFtZSA9ICdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1udyc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5sZWZ0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS50b3AgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9IGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5jdXJzb3IgPSAnbnctcmVzaXplJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBoYW5kbGUuc3R5bGUuekluZGV4ID0gMTAwMztcbiAgICAgICAgYm94RWxlbWVudC5hcHBlbmRDaGlsZChoYW5kbGUpO1xuICAgIH1cbn1cbiIsImltcG9ydCAnLi9zaGltcy5qcyc7XG5cbmltcG9ydCBHcmlkIGZyb20gJy4vZ3JpZC5qcyc7XG5pbXBvcnQgQm94IGZyb20gXCIuL2JveC5qc1wiO1xuaW1wb3J0IFJlbmRlciBmcm9tICcuL3JlbmRlcmVyLmpzJztcbmltcG9ydCBNb3VzZSBmcm9tICcuL21vdXNlLmpzJztcbmltcG9ydCBEcmFnZ2VyIGZyb20gJy4vZHJhZy5qcyc7XG5pbXBvcnQgUmVzaXplciBmcm9tICcuL3Jlc2l6ZS5qcyc7XG5pbXBvcnQge2FkZEV2ZW50LCByZW1vdmVOb2Rlc30gZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IERhc2hncmlkO1xuXG4vKipcbiAqIFRoZSBET00gcmVwcmVzZW50YXRpb24gaXM6XG4gKiAgICA8ZGl2IGNsYXNzPVwiZGFzaGdyaWRcIj5cbiAqICAgICAgICA8IS0tIEJveGVzIC0tPlxuICogICAgICAgIDxkaXYgY2xhc3M9XCJkYXNoZ3JpZC1ib3hlc1wiPlxuICogICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGFzaGdyaWQtYm94XCI+XG4gKiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1lbGVtZW50XCI+PC9kaXY+XG4gKiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtblwiPjwvZGl2PlxuICogICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLWVcIj48L2Rpdj5cbiAqICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS13XCI+PC9kaXY+XG4gKiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtc1wiPjwvZGl2PlxuICogICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLW5lXCI+PC9kaXY+XG4gKiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtbndcIj48L2Rpdj5cbiAqICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1zZVwiPjwvZGl2PlxuICogICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLXN3XCI+PC9kaXY+XG4gKiAgICAgICAgICAgIDwvZGl2PlxuICogICAgICAgIDwvZGl2PlxuICpcbiAqICAgICAgICA8IS0tIFNoYWRvdyBCb3ggLS0+XG4gKiAgICAgICAgPGRpdiBjbGFzcz1cImRhc2hncmlkLXNoYWRvdy1ib3hcIj48L2Rpdj5cbiAqXG4gKiAgICAgICAgPCEtLSBHcmlkIExpbmVzIC0tPlxuICogICAgICAgIDxkaXYgY2xhc3M9XCJkYXNoZ3JpZC1ncmlkLWxpbmVzXCI+PC9kaXY+XG4gKlxuICogICAgICAgIDwhLS0gR3JpZCBDZW50cm9pZHMgLS0+XG4gKiAgICAgICAgPGRpdiBjbGFzcz1cImRhc2hncmlkLWdyaWQtY2VudHJvaWRzXCI+PC9kaXY+XG4gKiAgICA8L2Rpdj5cbiAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IFRoZSBkYXNoZ3JpZCBlbGVtZW50LlxuICogQHBhcmFtIHtPYmplY3R9IGdzIEdyaWQgc2V0dGluZ3MuXG4gKi9cbmZ1bmN0aW9uIERhc2hncmlkKGVsZW1lbnQsIGdzKSB7XG4gICAgbGV0IGRhc2hncmlkID0gT2JqZWN0LmFzc2lnbih7fSwgZGFzaGdyaWRTZXR0aW5ncyhncywgZWxlbWVudCkpO1xuXG4gICAgbGV0IHJlbmRlcmVyID0gUmVuZGVyKHtkYXNoZ3JpZH0pO1xuICAgIGxldCBib3hIYW5kbGVyID0gQm94KHtkYXNoZ3JpZH0pO1xuICAgIGxldCBncmlkID0gR3JpZCh7ZGFzaGdyaWQsIHJlbmRlcmVyLCBib3hIYW5kbGVyfSk7XG4gICAgbGV0IGRyYWdnZXIgPSBEcmFnZ2VyKHtkYXNoZ3JpZCwgcmVuZGVyZXIsIGdyaWR9KTtcbiAgICBsZXQgcmVzaXplciA9IFJlc2l6ZXIoe2Rhc2hncmlkLCByZW5kZXJlciwgZ3JpZH0pO1xuICAgIGxldCBtb3VzZSA9IE1vdXNlKHtkcmFnZ2VyLCByZXNpemVyLCBkYXNoZ3JpZCwgZ3JpZH0pO1xuXG4gICAgLy8gSW5pdGlhbGl6ZS5cbiAgICBib3hIYW5kbGVyLmNyZWF0ZVNoYWRvd0JveCgpO1xuICAgIGdyaWQuaW5pdCgpO1xuICAgIG1vdXNlLmluaXQoKTtcblxuICAgIC8vIEV2ZW50IGxpc3RlbmVycy5cbiAgICBhZGRFdmVudCh3aW5kb3csICdyZXNpemUnLCAoKSA9PiB7XG4gICAgICAgIHJlbmRlcmVyLnNldENvbHVtbldpZHRoKCk7XG4gICAgICAgIHJlbmRlcmVyLnNldFJvd0hlaWdodCgpO1xuICAgICAgICBncmlkLnJlZnJlc2hHcmlkKCk7XG4gICAgfSk7XG5cbiAgICAvLyBVc2VyIGV2ZW50IGFmdGVyIGdyaWQgaXMgZG9uZSBsb2FkaW5nLlxuICAgIGlmIChkYXNoZ3JpZC5vbkdyaWRSZWFkeSkge2Rhc2hncmlkLm9uR3JpZFJlYWR5KCk7fSAvLyB1c2VyIGV2ZW50LlxuXG4gICAgLy8gQVBJLlxuICAgIHJldHVybiBPYmplY3QuZnJlZXplKHtcbiAgICAgICAgdXBkYXRlQm94OiBncmlkLnVwZGF0ZUJveCxcbiAgICAgICAgaW5zZXJ0Qm94OiBncmlkLmluc2VydEJveCxcbiAgICAgICAgcmVtb3ZlQm94OiBncmlkLnJlbW92ZUJveCxcbiAgICAgICAgZ2V0Qm94ZXM6IGdyaWQuZ2V0Qm94ZXMsXG4gICAgICAgIHJlZnJlc2hHcmlkOiBncmlkLnJlZnJlc2hHcmlkLFxuICAgICAgICBkYXNoZ3JpZDogZGFzaGdyaWRcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBHcmlkIHByb3BlcnRpZXMgYW5kIGV2ZW50cy5cbiAqL1xuZnVuY3Rpb24gZGFzaGdyaWRTZXR0aW5ncyhncywgZWxlbWVudCkge1xuICAgIGxldCBkYXNoZ3JpZCA9IHtcbiAgICAgICAgX2VsZW1lbnQ6IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gJzBweCc7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSAnMHB4JztcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnpJbmRleCA9ICcxMDAwJztcbiAgICAgICAgICAgIHJlbW92ZU5vZGVzKGVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgIH0oKSksXG5cbiAgICAgICAgYm94ZXM6IGdzLmJveGVzIHx8IFtdLFxuXG4gICAgICAgIHJvd0hlaWdodDogZ3Mucm93SGVpZ2h0LFxuICAgICAgICBudW1Sb3dzOiAoZ3MubnVtUm93cyAhPT0gdW5kZWZpbmVkKSA/IGdzLm51bVJvd3MgOiA2LFxuICAgICAgICBtaW5Sb3dzOiAoZ3MubWluUm93cyAhPT0gdW5kZWZpbmVkKSA/IGdzLm1pblJvd3MgOiA2LFxuICAgICAgICBtYXhSb3dzOiAoZ3MubWF4Um93cyAhPT0gdW5kZWZpbmVkKSA/IGdzLm1heFJvd3MgOiAxMCxcblxuICAgICAgICBleHRyYVJvd3M6IDAsXG4gICAgICAgIGV4dHJhQ29sdW1uczogMCxcblxuICAgICAgICBjb2x1bW5XaWR0aDogZ3MuY29sdW1uV2lkdGgsXG4gICAgICAgIG51bUNvbHVtbnM6IChncy5udW1Db2x1bW5zICE9PSB1bmRlZmluZWQpID8gZ3MubnVtQ29sdW1ucyA6IDYsXG4gICAgICAgIG1pbkNvbHVtbnM6IChncy5taW5Db2x1bW5zICE9PSB1bmRlZmluZWQpID8gZ3MubWluQ29sdW1ucyA6IDYsXG4gICAgICAgIG1heENvbHVtbnM6IChncy5tYXhDb2x1bW5zICE9PSB1bmRlZmluZWQpID8gZ3MubWF4Q29sdW1ucyA6IDEwLFxuXG4gICAgICAgIHhNYXJnaW46IChncy54TWFyZ2luICE9PSB1bmRlZmluZWQpID8gZ3MueE1hcmdpbiA6IDIwLFxuICAgICAgICB5TWFyZ2luOiAoZ3MueU1hcmdpbiAhPT0gdW5kZWZpbmVkKSA/IGdzLnlNYXJnaW4gOiAyMCxcblxuICAgICAgICBkZWZhdWx0Qm94Um93c3BhbjogMixcbiAgICAgICAgZGVmYXVsdEJveENvbHVtbnNwYW46IDEsXG5cbiAgICAgICAgbWluUm93c3BhbjogKGdzLm1pblJvd3NwYW4gIT09IHVuZGVmaW5lZCkgPyBncy5taW5Sb3dzcGFuIDogMSxcbiAgICAgICAgbWF4Um93c3BhbjogKGdzLm1heFJvd3NwYW4gIT09IHVuZGVmaW5lZCkgPyBncy5tYXhSb3dzcGFuIDogOTk5OSxcblxuICAgICAgICBtaW5Db2x1bW5zcGFuOiAoZ3MubWluQ29sdW1uc3BhbiAhPT0gdW5kZWZpbmVkKSA/IGdzLm1pbkNvbHVtbnNwYW4gOiAxLFxuICAgICAgICBtYXhDb2x1bW5zcGFuOiAoZ3MubWF4Q29sdW1uc3BhbiAhPT0gdW5kZWZpbmVkKSA/IGdzLm1heENvbHVtbnNwYW4gOiA5OTk5LFxuXG4gICAgICAgIHB1c2hhYmxlOiAoZ3MucHVzaGFibGUgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgZmxvYXRpbmc6IChncy5mbG9hdGluZyA9PT0gdHJ1ZSkgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgIHN0YWNraW5nOiAoZ3Muc3RhY2tpbmcgPT09IHRydWUpID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICBzd2FwcGluZzogKGdzLnN3YXBwaW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgYW5pbWF0ZTogKGdzLmFuaW1hdGUgPT09IHRydWUpID8gdHJ1ZSA6IGZhbHNlLFxuXG4gICAgICAgIGxpdmVDaGFuZ2VzOiAoZ3MubGl2ZUNoYW5nZXMgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZSxcblxuICAgICAgICAvLyBEcmFnIGhhbmRsZSBjYW4gYmUgYSBjdXN0b20gY2xhc3NuYW1lIG9yIGlmIG5vdCBzZXQgcmV2ZXJzIHRvIHRoZVxuICAgICAgICAvLyBib3ggY29udGFpbmVyIHdpdGggY2xhc3NuYW1lICdkYXNoZ3JpZC1ib3gnLlxuICAgICAgICBkcmFnZ2FibGU6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiAoZ3MuZHJhZ2dhYmxlICYmIGdzLmRyYWdnYWJsZS5lbmFibGVkID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWUsXG4gICAgICAgICAgICAgICAgaGFuZGxlOiAoZ3MuZHJhZ2dhYmxlICYmIGdzLmRyYWdnYWJsZS5oYW5kbGUpIHx8ICdkYXNoZ3JpZC1ib3gnLFxuXG4gICAgICAgICAgICAgICAgLy8gdXNlciBjYidzLlxuICAgICAgICAgICAgICAgIGRyYWdTdGFydDogZ3MuZHJhZ2dhYmxlICYmIGdzLmRyYWdnYWJsZS5kcmFnU3RhcnQsXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmc6IGdzLmRyYWdnYWJsZSAmJiBncy5kcmFnZ2FibGUuZHJhZ2dpbmcsXG4gICAgICAgICAgICAgICAgZHJhZ0VuZDogZ3MuZHJhZ2dhYmxlICYmIGdzLmRyYWdnYWJsZS5kcmFnRW5kXG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVzaXphYmxlOiB7XG4gICAgICAgICAgICBlbmFibGVkOiAoZ3MucmVzaXphYmxlICYmIGdzLnJlc2l6YWJsZS5lbmFibGVkID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWUsXG4gICAgICAgICAgICBoYW5kbGU6IChncy5yZXNpemFibGUgJiYgZ3MucmVzaXphYmxlLmhhbmRsZSkgfHwgWyduJywgJ2UnLCAncycsICd3JywgJ25lJywgJ3NlJywgJ3N3JywgJ253J10sXG4gICAgICAgICAgICBoYW5kbGVXaWR0aDogKGdzLnJlc2l6YWJsZSAmJiAgZ3MucmVzaXphYmxlLmhhbmRsZVdpZHRoICE9PSB1bmRlZmluZWQpID8gZ3MucmVzaXphYmxlLmhhbmRsZVdpZHRoIDogMTAsXG5cbiAgICAgICAgICAgIC8vIHVzZXIgY2Incy5cbiAgICAgICAgICAgIHJlc2l6ZVN0YXJ0OiBncy5yZXNpemFibGUgJiYgZ3MucmVzaXphYmxlLnJlc2l6ZVN0YXJ0LFxuICAgICAgICAgICAgcmVzaXppbmc6IGdzLnJlc2l6YWJsZSAmJiBncy5yZXNpemFibGUucmVzaXppbmcsXG4gICAgICAgICAgICByZXNpemVFbmQ6IGdzLnJlc2l6YWJsZSAmJiBncy5yZXNpemFibGUucmVzaXplRW5kXG4gICAgICAgIH0sXG5cbiAgICAgICAgb25VcGRhdGU6ICgpID0+IHt9LFxuXG4gICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IC4zcywgbGVmdCAuM3MsIHRvcCAuM3MsIHdpZHRoIC4zcywgaGVpZ2h0IC4zcycsXG4gICAgICAgIHNjcm9sbFNlbnNpdGl2aXR5OiAyMCxcbiAgICAgICAgc2Nyb2xsU3BlZWQ6IDEwLFxuICAgICAgICBzbmFwQmFja1RpbWU6IChncy5zbmFwQmFja1RpbWUgPT09IHVuZGVmaW5lZCkgPyAzMDAgOiBncy5zbmFwQmFja1RpbWUsXG5cbiAgICAgICAgc2hvd0dyaWRMaW5lczogKGdzLnNob3dHcmlkTGluZXMgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgc2hvd0dyaWRDZW50cm9pZHM6IChncy5zaG93R3JpZENlbnRyb2lkcyA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlXG4gICAgfTtcblxuICAgIGRhc2hncmlkLl9ib3hlc0VsZW1lbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IGJveGVzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgYm94ZXNFbGVtZW50LmNsYXNzTmFtZSA9ICdkYXNoZ3JpZC1ib3hlcyc7XG4gICAgICAgICAgICBkYXNoZ3JpZC5fZWxlbWVudC5hcHBlbmRDaGlsZChib3hlc0VsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIGJveGVzRWxlbWVudDtcbiAgICAgICAgfSgpKTtcblxuICAgIGRhc2hncmlkXG5cbiAgICByZXR1cm4gZGFzaGdyaWQ7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBEcmFnZ2VyO1xuXG5mdW5jdGlvbiBEcmFnZ2VyKGNvbXApIHtcbiAgICBsZXQge2Rhc2hncmlkLCByZW5kZXJlciwgZ3JpZH0gPSBjb21wO1xuXG4gICAgbGV0IGVYLCBlWSwgZVcsIGVILFxuICAgICAgICBtb3VzZVggPSAwLFxuICAgICAgICBtb3VzZVkgPSAwLFxuICAgICAgICBsYXN0TW91c2VYID0gMCxcbiAgICAgICAgbGFzdE1vdXNlWSA9IDAsXG4gICAgICAgIG1PZmZYID0gMCxcbiAgICAgICAgbU9mZlkgPSAwLFxuICAgICAgICBtaW5Ub3AgPSBkYXNoZ3JpZC55TWFyZ2luLFxuICAgICAgICBtaW5MZWZ0ID0gZGFzaGdyaWQueE1hcmdpbixcbiAgICAgICAgY3VyclN0YXRlID0ge30sXG4gICAgICAgIHByZXZTdGF0ZSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHNoYWRvd2JveCwgcmVtb3ZlIHNtb290aCB0cmFuc2l0aW9ucyBmb3IgYm94LFxuICAgICAqIGFuZCBpbml0IG1vdXNlIHZhcmlhYmxlcy4gRmluYWxseSwgbWFrZSBjYWxsIHRvIGFwaSB0byBjaGVjayBpZixcbiAgICAgKiBhbnkgYm94IGlzIGNsb3NlIHRvIGJvdHRvbSAvIHJpZ2h0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlXG4gICAgICovXG4gICAgbGV0IGRyYWdTdGFydCA9IGZ1bmN0aW9uIChib3gsIGUpIHtcbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLnpJbmRleCA9IDEwMDQ7XG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gJyc7XG4gICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLmxlZnQgPSBib3guX2VsZW1lbnQuc3R5bGUubGVmdDtcbiAgICAgICAgZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUudG9wID0gYm94Ll9lbGVtZW50LnN0eWxlLnRvcDtcbiAgICAgICAgZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUud2lkdGggPSBib3guX2VsZW1lbnQuc3R5bGUud2lkdGg7XG4gICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLmhlaWdodCA9IGJveC5fZWxlbWVudC5zdHlsZS5oZWlnaHQ7XG4gICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnJztcblxuICAgICAgICAvLyBNb3VzZSB2YWx1ZXMuXG4gICAgICAgIGxhc3RNb3VzZVggPSBlLnBhZ2VYO1xuICAgICAgICBsYXN0TW91c2VZID0gZS5wYWdlWTtcbiAgICAgICAgZVggPSBwYXJzZUludChib3guX2VsZW1lbnQub2Zmc2V0TGVmdCwgMTApO1xuICAgICAgICBlWSA9IHBhcnNlSW50KGJveC5fZWxlbWVudC5vZmZzZXRUb3AsIDEwKTtcbiAgICAgICAgZVcgPSBwYXJzZUludChib3guX2VsZW1lbnQub2Zmc2V0V2lkdGgsIDEwKTtcbiAgICAgICAgZUggPSBwYXJzZUludChib3guX2VsZW1lbnQub2Zmc2V0SGVpZ2h0LCAxMCk7XG5cbiAgICAgICAgZ3JpZC51cGRhdGVTdGFydChib3gpO1xuXG4gICAgICAgIGlmIChkYXNoZ3JpZC5kcmFnZ2FibGUuZHJhZ1N0YXJ0KSB7ZGFzaGdyaWQuZHJhZ2dhYmxlLmRyYWdTdGFydCgpO30gLy8gdXNlciBldmVudC5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKi9cbiAgICBsZXQgZHJhZyA9IGZ1bmN0aW9uIChib3gsIGUpIHtcbiAgICAgICAgdXBkYXRlTW92aW5nRWxlbWVudChib3gsIGUpO1xuICAgICAgICBncmlkLnVwZGF0aW5nKGJveCk7XG5cbiAgICAgICAgaWYgKGRhc2hncmlkLmxpdmVDaGFuZ2VzKSB7XG4gICAgICAgICAgICAvLyBXaGljaCBjZWxsIHRvIHNuYXAgcHJldmlldyBib3ggdG8uXG4gICAgICAgICAgICBjdXJyU3RhdGUgPSByZW5kZXJlci5nZXRDbG9zZXN0Q2VsbHMoe1xuICAgICAgICAgICAgICAgIGxlZnQ6IGJveC5fZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgIHJpZ2h0OiBib3guX2VsZW1lbnQub2Zmc2V0TGVmdCArIGJveC5fZWxlbWVudC5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgICAgICB0b3A6IGJveC5fZWxlbWVudC5vZmZzZXRUb3AsXG4gICAgICAgICAgICAgICAgYm90dG9tOiBib3guX2VsZW1lbnQub2Zmc2V0VG9wICsgYm94Ll9lbGVtZW50Lm9mZnNldEhlaWdodFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtb3ZlQm94KGJveCwgZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGFzaGdyaWQuZHJhZ2dhYmxlLmRyYWdnaW5nKSB7ZGFzaGdyaWQuZHJhZ2dhYmxlLmRyYWdnaW5nKCk7fSAvLyB1c2VyIGV2ZW50LlxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZVxuICAgICAqL1xuICAgIGxldCBkcmFnRW5kID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICBpZiAoIWRhc2hncmlkLmxpdmVDaGFuZ2VzKSB7XG4gICAgICAgICAgICAvLyBXaGljaCBjZWxsIHRvIHNuYXAgcHJldmlldyBib3ggdG8uXG4gICAgICAgICAgICBjdXJyU3RhdGUgPSByZW5kZXJlci5nZXRDbG9zZXN0Q2VsbHMoe1xuICAgICAgICAgICAgICAgIGxlZnQ6IGJveC5fZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgIHJpZ2h0OiBib3guX2VsZW1lbnQub2Zmc2V0TGVmdCArIGJveC5fZWxlbWVudC5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgICAgICB0b3A6IGJveC5fZWxlbWVudC5vZmZzZXRUb3AsXG4gICAgICAgICAgICAgICAgYm90dG9tOiBib3guX2VsZW1lbnQub2Zmc2V0VG9wICsgYm94Ll9lbGVtZW50Lm9mZnNldEhlaWdodFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtb3ZlQm94KGJveCwgZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgYm94IHN0eWxlLlxuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9IGRhc2hncmlkLnRyYW5zaXRpb247XG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUubGVmdDtcbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLnRvcCA9IGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLnRvcDtcblxuICAgICAgICAvLyBHaXZlIHRpbWUgZm9yIHByZXZpZXdib3ggdG8gc25hcCBiYWNrIHRvIHRpbGUuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLnpJbmRleCA9IDEwMDM7XG4gICAgICAgICAgICBkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgZ3JpZC51cGRhdGVFbmQoKTtcbiAgICAgICAgfSwgZGFzaGdyaWQuc25hcEJhY2tUaW1lKTtcblxuICAgICAgICBpZiAoZGFzaGdyaWQuZHJhZ2dhYmxlLmRyYWdFbmQpIHtkYXNoZ3JpZC5kcmFnZ2FibGUuZHJhZ0VuZCgpO30gLy8gdXNlciBldmVudC5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKi9cbiAgICBsZXQgbW92ZUJveCA9IGZ1bmN0aW9uIChib3gsIGUpIHtcbiAgICAgICAgaWYgKGN1cnJTdGF0ZS5yb3cgIT09IHByZXZTdGF0ZS5yb3cgfHxcbiAgICAgICAgICAgIGN1cnJTdGF0ZS5jb2x1bW4gIT09IHByZXZTdGF0ZS5jb2x1bW4pIHtcblxuICAgICAgICAgICAgbGV0IHByZXZTY3JvbGxIZWlnaHQgPSBkYXNoZ3JpZC5fZWxlbWVudC5vZmZzZXRIZWlnaHQgLSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgICAgICBsZXQgcHJldlNjcm9sbFdpZHRoID0gZGFzaGdyaWQuX2VsZW1lbnQub2Zmc2V0V2lkdGggLSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgICAgICAgICAgbGV0IHZhbGlkTW92ZSA9IGdyaWQudXBkYXRlQm94KGJveCwgY3VyclN0YXRlLCBib3gpO1xuXG4gICAgICAgICAgICAvLyB1cGRhdGVHcmlkRGltZW5zaW9uIHByZXZpZXcgYm94LlxuICAgICAgICAgICAgaWYgKHZhbGlkTW92ZSkge1xuXG4gICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0Qm94RWxlbWVudFlQb3NpdGlvbihkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudCwgY3VyclN0YXRlLnJvdyk7XG4gICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0Qm94RWxlbWVudFhQb3NpdGlvbihkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudCwgY3VyclN0YXRlLmNvbHVtbik7XG5cbiAgICAgICAgICAgICAgICBsZXQgcG9zdFNjcm9sbEhlaWdodCA9IGRhc2hncmlkLl9lbGVtZW50Lm9mZnNldEhlaWdodCAtIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICAgICAgICBsZXQgcG9zdFNjcm9sbFdpZHRoID0gZGFzaGdyaWQuX2VsZW1lbnQub2Zmc2V0V2lkdGggLSB3aW5kb3cuaW5uZXJXaWR0aDtcblxuICAgICAgICAgICAgICAgIC8vIEFjY291bnQgZm9yIG1pbmltaXppbmcgc2Nyb2xsIGhlaWdodCB3aGVuIG1vdmluZyBib3ggdXB3YXJkcy5cbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UgYnVnIGhhcHBlbnMgd2hlcmUgdGhlIGRyYWdnZWQgYm94IGlzIGNoYW5nZWQgYnV0IGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgLy8gYWZ0ZXJ3YXJkcyB0aGUgZGFzaGdyaWQgZWxlbWVudCBkaW1lbnNpb24gaXMgY2hhbmdlZC5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGFzaGdyaWQuX2VsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gd2luZG93LmlubmVySGVpZ2h0IC0gd2luZG93LnNjcm9sbFkpIDwgMzAgJiZcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFkgPiAwICYmXG4gICAgICAgICAgICAgICAgICAgIHByZXZTY3JvbGxIZWlnaHQgIT09IHBvc3RTY3JvbGxIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLnRvcCA9IGJveC5fZWxlbWVudC5vZmZzZXRUb3AgLSAxMDAgICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGFzaGdyaWQuX2VsZW1lbnQub2Zmc2V0V2lkdGggLSB3aW5kb3cuaW5uZXJXaWR0aCAtIHdpbmRvdy5zY3JvbGxYKSA8IDMwICYmXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxYID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICBwcmV2U2Nyb2xsV2lkdGggIT09IHBvc3RTY3JvbGxXaWR0aCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gYm94Ll9lbGVtZW50Lm9mZnNldExlZnQgLSAxMDAgICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBObyBwb2ludCBpbiBhdHRlbXB0aW5nIG1vdmUgaWYgbm90IHN3aXRjaGVkIHRvIG5ldyBjZWxsLlxuICAgICAgICBwcmV2U3RhdGUgPSB7cm93OiBjdXJyU3RhdGUucm93LCBjb2x1bW46IGN1cnJTdGF0ZS5jb2x1bW59O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbW92aW5nIGVsZW1lbnQsXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlXG4gICAgICovXG4gICAgbGV0IHVwZGF0ZU1vdmluZ0VsZW1lbnQgPSBmdW5jdGlvbiAoYm94LCBlKSB7XG4gICAgICAgIGxldCBtYXhMZWZ0ID0gZGFzaGdyaWQuX2VsZW1lbnQub2Zmc2V0V2lkdGggLSBkYXNoZ3JpZC54TWFyZ2luO1xuICAgICAgICBsZXQgbWF4VG9wID0gZGFzaGdyaWQuX2VsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gZGFzaGdyaWQueU1hcmdpbjtcblxuICAgICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgbW91c2UgcG9zaXRpb24uXG4gICAgICAgIG1vdXNlWCA9IGUucGFnZVg7XG4gICAgICAgIG1vdXNlWSA9IGUucGFnZVk7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBkZWx0YXNcbiAgICAgICAgbGV0IGRpZmZYID0gbW91c2VYIC0gbGFzdE1vdXNlWCArIG1PZmZYO1xuICAgICAgICBsZXQgZGlmZlkgPSBtb3VzZVkgLSBsYXN0TW91c2VZICsgbU9mZlk7XG5cbiAgICAgICAgbU9mZlggPSAwO1xuICAgICAgICBtT2ZmWSA9IDA7XG5cbiAgICAgICAgLy8gVXBkYXRlIGxhc3QgcHJvY2Vzc2VkIG1vdXNlIHBvc2l0aW9ucy5cbiAgICAgICAgbGFzdE1vdXNlWCA9IG1vdXNlWDtcbiAgICAgICAgbGFzdE1vdXNlWSA9IG1vdXNlWTtcblxuICAgICAgICBsZXQgZFggPSBkaWZmWDtcbiAgICAgICAgbGV0IGRZID0gZGlmZlk7XG4gICAgICAgIGlmIChlWCArIGRYIDwgbWluTGVmdCkge1xuICAgICAgICAgICAgZGlmZlggPSBtaW5MZWZ0IC0gZVg7XG4gICAgICAgICAgICBtT2ZmWCA9IGRYIC0gZGlmZlg7XG4gICAgICAgIH0gZWxzZSBpZiAoZVggKyBlVyArIGRYID4gbWF4TGVmdCkge1xuICAgICAgICAgICAgZGlmZlggPSBtYXhMZWZ0IC0gZVggLSBlVztcbiAgICAgICAgICAgIG1PZmZYID0gZFggLSBkaWZmWDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlWSArIGRZIDwgbWluVG9wKSB7XG4gICAgICAgICAgICBkaWZmWSA9IG1pblRvcCAtIGVZO1xuICAgICAgICAgICAgbU9mZlkgPSBkWSAtIGRpZmZZO1xuICAgICAgICB9IGVsc2UgaWYgKGVZICsgZUggKyBkWSA+IG1heFRvcCkge1xuICAgICAgICAgICAgZGlmZlkgPSBtYXhUb3AgLSBlWSAtIGVIO1xuICAgICAgICAgICAgbU9mZlkgPSBkWSAtIGRpZmZZO1xuICAgICAgICB9XG4gICAgICAgIGVYICs9IGRpZmZYO1xuICAgICAgICBlWSArPSBkaWZmWTtcblxuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUudG9wID0gZVkgKyAncHgnO1xuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUubGVmdCA9IGVYICsgJ3B4JztcblxuICAgICAgICAvLyBTY3JvbGxpbmcgd2hlbiBjbG9zZSB0byBib3R0b20gYm91bmRhcnkuXG4gICAgICAgIGlmIChlLnBhZ2VZIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPCBkYXNoZ3JpZC5zY3JvbGxTZW5zaXRpdml0eSkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCAtIGRhc2hncmlkLnNjcm9sbFNwZWVkO1xuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5pbm5lckhlaWdodCAtIChlLnBhZ2VZIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIDwgZGFzaGdyaWQuc2Nyb2xsU2Vuc2l0aXZpdHkpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgKyBkYXNoZ3JpZC5zY3JvbGxTcGVlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNjcm9sbGluZyB3aGVuIGNsb3NlIHRvIHJpZ2h0IGJvdW5kYXJ5LlxuICAgICAgICBpZiAoZS5wYWdlWCAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCA8IGRhc2hncmlkLnNjcm9sbFNlbnNpdGl2aXR5KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgPSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgLSBkYXNoZ3JpZC5zY3JvbGxTcGVlZDtcbiAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuaW5uZXJXaWR0aCAtIChlLnBhZ2VYIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0KSA8IGRhc2hncmlkLnNjcm9sbFNlbnNpdGl2aXR5KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgPSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgKyBkYXNoZ3JpZC5zY3JvbGxTcGVlZDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7XG4gICAgICAgIGRyYWdTdGFydCxcbiAgICAgICAgZHJhZyxcbiAgICAgICAgZHJhZ0VuZFxuICAgIH0pO1xufVxuIiwiaW1wb3J0IEdyaWRWaWV3IGZyb20gJy4vZ3JpZFZpZXcuanMnO1xuaW1wb3J0IEdyaWRFbmdpbmUgZnJvbSAnLi9ncmlkRW5naW5lLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgR3JpZDtcblxuLyoqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRhc2hncmlkXG4gKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBib3hIYW5kbGVyXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IGluaXQgSW5pdGlhbGl6ZSBHcmlkLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSB1cGRhdGVCb3ggQVBJIGZvciB1cGRhdGluZyBib3gsIG1vdmluZyAvIHJlc2l6aW5nLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBpbnNlcnRCb3ggSW5zZXJ0IGEgbmV3IGJveC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gcmVtb3ZlQm94IFJlbW92ZSBhIGJveC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gZ2V0Qm94IFJldHVybiBib3ggb2JqZWN0IGdpdmVuIERPTSBlbGVtZW50LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSB1cGRhdGVTdGFydCBXaGVuIGRyYWcgLyByZXNpemUgc3RhcnRzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSB1cGRhdGluZyBEdXJpbmcgZHJhZ2dpbmcgLyByZXNpemluZy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gdXBkYXRlRW5kIEFmdGVyIGRyYWcgLyByZXNpemUgZW5kcy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gcmVuZGVyR3JpZCBVcGRhdGUgZ3JpZCBlbGVtZW50LlxuICovXG5mdW5jdGlvbiBHcmlkKG9iaikge1xuICAgIGxldCB7ZGFzaGdyaWQsIHJlbmRlcmVyLCBib3hIYW5kbGVyfSA9IG9iajtcblxuICAgIGxldCBncmlkVmlldyA9IEdyaWRWaWV3KHtkYXNoZ3JpZCwgcmVuZGVyZXJ9KTtcbiAgICBsZXQgZ3JpZEVuZ2luZSA9IEdyaWRFbmdpbmUoe2Rhc2hncmlkLCBib3hIYW5kbGVyfSk7XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGVzIHRoZSBuZWNlc3NhcnkgYm94IGVsZW1lbnRzIGFuZCBjaGVja3MgdGhhdCB0aGUgYm94ZXMgaW5wdXQgaXNcbiAgICAgKiBjb3JyZWN0LlxuICAgICAqIDEuIENyZWF0ZSBib3ggZWxlbWVudHMuXG4gICAgICogMi4gVXBkYXRlIHRoZSBkYXNoZ3JpZCBzaW5jZSBuZXdseSBjcmVhdGVkIGJveGVzIG1heSBsaWUgb3V0c2lkZSB0aGVcbiAgICAgKiAgICBpbml0aWFsIGRhc2hncmlkIHN0YXRlLlxuICAgICAqIDMuIFJlbmRlciB0aGUgZGFzaGdyaWQuXG4gICAgICovXG4gICAgbGV0IGluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgYm94IGVsZW1lbnRzIGFuZCB1cGRhdGUgbnVtYmVyIG9mIHJvd3MgLyBjb2x1bW5zLlxuICAgICAgICBncmlkRW5naW5lLmluaXQoKTtcblxuICAgICAgICAvLyBVcGRhdGUgdGhlIEdyaWQgVmlldy5cbiAgICAgICAgZ3JpZFZpZXcuaW5pdCgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdXBkYXRlVG9cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXhjbHVkZUJveCBPcHRpb25hbCBwYXJhbWV0ZXIsIGlmIHVwZGF0ZUJveCBpcyB0cmlnZ2VyZWRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBieSBkcmFnIC8gcmVzaXplIGV2ZW50LCB0aGVuIGRvbid0IHVwZGF0ZVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBJZiB1cGRhdGUgc3VjY2VlZGVkLlxuICAgICAqL1xuICAgIGxldCB1cGRhdGVCb3ggPSBmdW5jdGlvbiAoYm94LCB1cGRhdGVUbywgZXhjbHVkZUJveCkge1xuICAgICAgICBsZXQgbW92ZWRCb3hlcyA9IGdyaWRFbmdpbmUudXBkYXRlQm94KGJveCwgdXBkYXRlVG8pO1xuXG4gICAgICAgIGlmIChtb3ZlZEJveGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGdyaWRWaWV3LnJlbmRlckJveChtb3ZlZEJveGVzLCBleGNsdWRlQm94KTtcbiAgICAgICAgICAgIGdyaWRWaWV3LnJlbmRlckdyaWQoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBib3guXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqL1xuICAgIGxldCByZW1vdmVCb3ggPSBmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgIGdyaWRFbmdpbmUucmVtb3ZlQm94KGJveCk7XG4gICAgICAgIGdyaWRWaWV3LnJlbmRlckdyaWQoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzaXplcyBhIGJveC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICovXG4gICAgbGV0IHJlc2l6ZUJveCA9IGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgLy8gSW4gY2FzZSBib3ggaXMgbm90IHVwZGF0ZWQgYnkgZHJhZ2dpbmcgLyByZXNpemluZy5cbiAgICAgICAgZ3JpZFZpZXcucmVuZGVyQm94KG1vdmVkQm94ZXMpO1xuICAgICAgICBncmlkVmlldy5yZW5kZXJHcmlkKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGVpdGhlciByZXNpemUgb3IgZHJhZyBzdGFydHMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqL1xuICAgIGxldCB1cGRhdGVTdGFydCA9IGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgZ3JpZEVuZ2luZS5pbmNyZWFzZU51bVJvd3MoYm94LCAxKTtcbiAgICAgICAgZ3JpZEVuZ2luZS5pbmNyZWFzZU51bUNvbHVtbnMoYm94LCAxKTtcbiAgICAgICAgZ3JpZFZpZXcucmVuZGVyR3JpZCgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGRyYWdnaW5nIC8gcmVzaXppbmcgaXMgZHJvcHBlZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICovXG4gICAgbGV0IHVwZGF0aW5nID0gZnVuY3Rpb24gKGJveCkge1xuICAgICAgICAvLyBncmlkRW5naW5lLmluY3JlYXNlTnVtUm93cyhib3gsIDEpO1xuICAgICAgICAvLyBncmlkRW5naW5lLmluY3JlYXNlTnVtQ29sdW1ucyhib3gsIDEpO1xuICAgICAgICAvLyBncmlkVmlldy5yZW5kZXJHcmlkKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFdoZW4gZHJhZ2dpbmcgLyByZXNpemluZyBpcyBkcm9wcGVkLlxuICAgICAqL1xuICAgIGxldCB1cGRhdGVFbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdyaWRFbmdpbmUuZGVjcmVhc2VOdW1Sb3dzKCk7XG4gICAgICAgIGdyaWRFbmdpbmUuZGVjcmVhc2VOdW1Db2x1bW5zKCk7XG4gICAgICAgIGdyaWRWaWV3LnJlbmRlckdyaWQoKTtcbiAgICB9O1xuXG4gICAgbGV0IHJlZnJlc2hHcmlkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBncmlkVmlldy5yZW5kZXJCb3goZGFzaGdyaWQuYm94ZXMpO1xuICAgICAgICBncmlkVmlldy5yZW5kZXJHcmlkKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBPYmplY3QuZnJlZXplKHtcbiAgICAgICAgaW5pdDogaW5pdCxcbiAgICAgICAgdXBkYXRlQm94OiB1cGRhdGVCb3gsXG4gICAgICAgIGluc2VydEJveDogZ3JpZEVuZ2luZS5pbnNlcnRCb3gsXG4gICAgICAgIHJlbW92ZUJveDogZ3JpZEVuZ2luZS5yZW1vdmVCb3gsXG4gICAgICAgIGdldEJveDogZ3JpZEVuZ2luZS5nZXRCb3gsXG4gICAgICAgIHVwZGF0ZVN0YXJ0OiB1cGRhdGVTdGFydCxcbiAgICAgICAgdXBkYXRpbmc6IHVwZGF0aW5nLFxuICAgICAgICB1cGRhdGVFbmQ6IHVwZGF0ZUVuZCxcbiAgICAgICAgcmVmcmVzaEdyaWQ6IHJlZnJlc2hHcmlkXG4gICAgfSk7XG59XG4iLCJpbXBvcnQge3JlbW92ZU5vZGVzLCBpbnNlcnRpb25Tb3J0LCBnZXRNYXhOdW19IGZyb20gJy4vdXRpbHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBHcmlkRW5naW5lO1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gSGFuZGxlcyBjb2xsaXNpb24gbG9naWMgYW5kIGRhc2hncmlkIGRpbWVuc2lvbi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqL1xuZnVuY3Rpb24gR3JpZEVuZ2luZShvYmopIHtcbiAgICBsZXQge2Rhc2hncmlkLCBib3hIYW5kbGVyfSA9IG9iajtcbiAgICBsZXQgYm94ZXMsIG1vdmluZ0JveCwgbW92ZWRCb3hlcztcblxuICAgIGxldCBpbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjcmVhdGVCb3hFbGVtZW50cygpO1xuICAgICAgICB1cGRhdGVOdW1Sb3dzKCk7XG4gICAgICAgIHVwZGF0ZU51bUNvbHVtbnMoKTtcbiAgICAgfTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBib3ggZWxlbWVudHMuXG4gICAgICovXG4gICAgbGV0IGNyZWF0ZUJveEVsZW1lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gZGFzaGdyaWQuYm94ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGJveEhhbmRsZXIuY3JlYXRlQm94KGRhc2hncmlkLmJveGVzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBib3hlcyA9IGRhc2hncmlkLmJveGVzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIERPTSBlbGVtZW50LCByZXRyaWV2ZSBjb3JyZXNwb25kaW5nIGpzIG9iamVjdCBmcm9tIGJveGVzLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IERPTSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IGJveCBHaXZlbiBhIERPTSBlbGVtZW50LCByZXR1cm4gY29ycmVzcG9uZGluZyBib3ggb2JqZWN0LlxuICAgICAqL1xuICAgIGxldCBnZXRCb3ggPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYm94ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChib3hlc1tpXS5fZWxlbWVudCA9PT0gZWxlbWVudCkge3JldHVybiBib3hlc1tpXX1cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ29weSBib3ggcG9zaXRpb25zLlxuICAgICAqIEByZXR1cm5zIHtBcnJheS48T2JqZWN0Pn0gUHJldmlvdXMgYm94IHBvc2l0aW9ucy5cbiAgICAgKi9cbiAgICBsZXQgY29weUJveGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgcHJldlBvc2l0aW9ucyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJveGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBwcmV2UG9zaXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgIHJvdzogYm94ZXNbaV0ucm93LFxuICAgICAgICAgICAgICAgIGNvbHVtbjogYm94ZXNbaV0uY29sdW1uLFxuICAgICAgICAgICAgICAgIGNvbHVtbnNwYW46IGJveGVzW2ldLmNvbHVtbnNwYW4sXG4gICAgICAgICAgICAgICAgcm93c3BhbjogYm94ZXNbaV0ucm93c3BhblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHByZXZQb3NpdGlvbnM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlc3RvcmUgT2xkIHBvc2l0aW9ucy5cbiAgICAgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBQcmV2aW91cyBwb3NpdGlvbnMuXG4gICAgICovXG4gICAgbGV0IHJlc3RvcmVPbGRQb3NpdGlvbnMgPSBmdW5jdGlvbiAocHJldlBvc2l0aW9ucykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJveGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBib3hlc1tpXS5yb3cgPSBwcmV2UG9zaXRpb25zW2ldLnJvdyxcbiAgICAgICAgICAgIGJveGVzW2ldLmNvbHVtbiA9IHByZXZQb3NpdGlvbnNbaV0uY29sdW1uLFxuICAgICAgICAgICAgYm94ZXNbaV0uY29sdW1uc3BhbiA9IHByZXZQb3NpdGlvbnNbaV0uY29sdW1uc3BhbixcbiAgICAgICAgICAgIGJveGVzW2ldLnJvd3NwYW4gPSBwcmV2UG9zaXRpb25zW2ldLnJvd3NwYW5cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgYm94IGdpdmVuIGl0cyBpbmRleCBpbiB0aGUgYm94ZXMgYXJyYXkuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJveEluZGV4LlxuICAgICAqL1xuICAgIGxldCByZW1vdmVCb3ggPSBmdW5jdGlvbiAoYm94SW5kZXgpIHtcbiAgICAgICAgbGV0IGVsZW0gPSBib3hlc1tib3hJbmRleF0uX2VsZW1lbnQ7XG4gICAgICAgIGVsZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtKTtcbiAgICAgICAgYm94ZXMuc3BsaWNlKGJveEluZGV4LCAxKTtcblxuICAgICAgICAvLyBJbiBjYXNlIGZsb2F0aW5nIGlzIG9uLlxuICAgICAgICB1cGRhdGVOdW1Sb3dzKCk7XG4gICAgICAgIHVwZGF0ZU51bUNvbHVtbnMoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0IGEgYm94LiBCb3ggbXVzdCBjb250YWluIGF0IGxlYXN0IHRoZSBzaXplIGFuZCBwb3NpdGlvbiBvZiB0aGUgYm94LFxuICAgICAqIGNvbnRlbnQgZWxlbWVudCBpcyBvcHRpb25hbC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94IEJveCBkaW1lbnNpb25zLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBJZiBpbnNlcnQgd2FzIHBvc3NpYmxlLlxuICAgICAqL1xuICAgIGxldCBpbnNlcnRCb3ggPSBmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgIG1vdmluZ0JveCA9IGJveDtcblxuICAgICAgICBpZiAoYm94LnJvd3MgPT09IHVuZGVmaW5lZCAmJiBib3guY29sdW1uID09PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIGJveC5yb3dzcGFuID09PSB1bmRlZmluZWQgJiYgYm94LmNvbHVtbnNwYW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc1VwZGF0ZVZhbGlkKGJveCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwcmV2UG9zaXRpb25zID0gY29weUJveGVzKCk7XG5cbiAgICAgICAgbGV0IG1vdmVkQm94ZXMgPSBbYm94XTtcbiAgICAgICAgbGV0IHZhbGlkTW92ZSA9IG1vdmVCb3goYm94LCBib3gsIG1vdmVkQm94ZXMpO1xuICAgICAgICBtb3ZpbmdCb3ggPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgaWYgKHZhbGlkTW92ZSkge1xuICAgICAgICAgICAgYm94SGFuZGxlci5jcmVhdGVCb3goYm94KTtcbiAgICAgICAgICAgIGJveGVzLnB1c2goYm94KTtcblxuICAgICAgICAgICAgdXBkYXRlTnVtUm93cygpO1xuICAgICAgICAgICAgdXBkYXRlTnVtQ29sdW1ucygpO1xuICAgICAgICAgICAgcmV0dXJuIGJveDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3RvcmVPbGRQb3NpdGlvbnMocHJldlBvc2l0aW9ucyk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIGEgcG9zaXRpb24gb3Igc2l6ZSBvZiBib3guXG4gICAgICpcbiAgICAgKiBXb3JrcyBpbiBwb3N0ZXJpb3IgZmFzaGlvbiwgYWtpbiB0byBhc2sgZm9yIGZvcmdpdmVuZXNzIHJhdGhlciB0aGFuIGZvclxuICAgICAqIHBlcm1pc3Npb24uXG4gICAgICogTG9naWM6XG4gICAgICpcbiAgICAgKiAxLiBJcyB1cGRhdGVUbyBhIHZhbGlkIHN0YXRlP1xuICAgICAqICAgIDEuMSBObzogUmV0dXJuIGZhbHNlLlxuICAgICAqIDIuIFNhdmUgcG9zaXRpb25zLlxuICAgICAqIDMuIE1vdmUgYm94LlxuICAgICAqICAgICAgMy4xLiBJcyBib3ggb3V0c2lkZSBib3JkZXI/XG4gICAgICogICAgICAgICAgMy4xLjEuIFllczogQ2FuIGJvcmRlciBiZSBwdXNoZWQ/XG4gICAgICogICAgICAgICAgICAgIDMuMS4xLjEuIFllczogRXhwYW5kIGJvcmRlci5cbiAgICAgKiAgICAgICAgICAgICAgMy4xLjEuMi4gTm86IFJldHVybiBmYWxzZS5cbiAgICAgKiAgICAgIDMuMi4gRG9lcyBib3ggY29sbGlkZT9cbiAgICAgKiAgICAgICAgICAzLjIuMS4gWWVzOiBDYWxjdWxhdGUgbmV3IGJveCBwb3NpdGlvbiBhbmRcbiAgICAgKiAgICAgICAgICAgICAgICAgZ28gYmFjayB0byBzdGVwIDEgd2l0aCB0aGUgbmV3IGNvbGxpZGVkIGJveC5cbiAgICAgKiAgICAgICAgICAzLjIuMi4gTm86IFJldHVybiB0cnVlLlxuICAgICAqIDQuIElzIG1vdmUgdmFsaWQ/XG4gICAgICogICAgNC4xLiBZZXM6IFVwZGF0ZSBudW1iZXIgcm93cyAvIGNvbHVtbnMuXG4gICAgICogICAgNC4yLiBObzogUmV2ZXJ0IHRvIG9sZCBwb3NpdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94IFRoZSBib3ggYmVpbmcgdXBkYXRlZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdXBkYXRlVG8gVGhlIG5ldyBzdGF0ZS5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXkuPE9iamVjdD59IG1vdmVkQm94ZXNcbiAgICAgKi9cbiAgICBsZXQgdXBkYXRlQm94ID0gZnVuY3Rpb24gKGJveCwgdXBkYXRlVG8pIHtcbiAgICAgICAgbW92aW5nQm94ID0gYm94O1xuXG4gICAgICAgIGxldCBwcmV2UG9zaXRpb25zID0gY29weUJveGVzKClcblxuICAgICAgICBPYmplY3QuYXNzaWduKGJveCwgdXBkYXRlVG8pO1xuICAgICAgICBpZiAoIWlzVXBkYXRlVmFsaWQoYm94KSkge1xuICAgICAgICAgICAgcmVzdG9yZU9sZFBvc2l0aW9ucyhwcmV2UG9zaXRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtb3ZlZEJveGVzID0gW2JveF07XG4gICAgICAgIGxldCB2YWxpZE1vdmUgPSBtb3ZlQm94KGJveCwgYm94LCBtb3ZlZEJveGVzKTtcblxuICAgICAgICBpZiAodmFsaWRNb3ZlKSB7XG4gICAgICAgICAgICB1cGRhdGVOdW1Sb3dzKCk7XG4gICAgICAgICAgICB1cGRhdGVOdW1Db2x1bW5zKCk7XG5cbiAgICAgICAgICAgIHJldHVybiBtb3ZlZEJveGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdG9yZU9sZFBvc2l0aW9ucyhwcmV2UG9zaXRpb25zKTtcblxuICAgICAgICByZXR1cm4gW107XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBhbmQgaGFuZGxlcyBjb2xsaXNpb25zIHdpdGggd2FsbCBhbmQgYm94ZXMuXG4gICAgICogV29ya3MgYXMgYSB0cmVlLCBwcm9wYWdhdGluZyBtb3ZlcyBkb3duIHRoZSBjb2xsaXNpb24gdHJlZSBhbmQgcmV0dXJuc1xuICAgICAqICAgICB0cnVlIG9yIGZhbHNlIGRlcGVuZGluZyBpZiB0aGUgYm94IGluZnJvbnQgaXMgYWJsZSB0byBtb3ZlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBleGNsdWRlQm94XG4gICAgICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gbW92ZWRCb3hlc1xuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgbW92ZSBpcyBwb3NzaWJsZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIGxldCBtb3ZlQm94ID0gZnVuY3Rpb24gKGJveCwgZXhjbHVkZUJveCwgbW92ZWRCb3hlcykge1xuICAgICAgICBpZiAoaXNCb3hPdXRzaWRlQm91bmRhcnkoYm94KSkge3JldHVybiBmYWxzZTt9XG5cbiAgICAgICAgbGV0IGludGVyc2VjdGVkQm94ZXMgPSBnZXRJbnRlcnNlY3RlZEJveGVzKGJveCwgZXhjbHVkZUJveCwgbW92ZWRCb3hlcyk7XG5cbiAgICAgICAgLy8gSGFuZGxlIGJveCBDb2xsaXNpb24sIHJlY3Vyc2l2ZSBtb2RlbC5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGludGVyc2VjdGVkQm94ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmICghY29sbGlzaW9uSGFuZGxlcihib3gsIGludGVyc2VjdGVkQm94ZXNbaV0sIGV4Y2x1ZGVCb3gsIG1vdmVkQm94ZXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFByb3BhZ2F0ZXMgYm94IGNvbGxpc2lvbnMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hCXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGV4Y2x1ZGVCb3hcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBtb3ZlZEJveGVzXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gSWYgbW92ZSBpcyBhbGxvd2VkXG4gICAgICovXG4gICAgbGV0IGNvbGxpc2lvbkhhbmRsZXIgPSBmdW5jdGlvbiAoYm94LCBib3hCLCBleGNsdWRlQm94LCBtb3ZlZEJveGVzKSB7XG4gICAgICAgIHNldEJveFBvc2l0aW9uKGJveCwgYm94QilcbiAgICAgICAgcmV0dXJuIG1vdmVCb3goYm94QiwgZXhjbHVkZUJveCwgbW92ZWRCb3hlcyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgbmV3IGJveCBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgYm94IHRoYXQgcHVzaGVkIGl0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3ggQm94IHdoaWNoIGhhcyBtb3ZlZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94QiBCb3ggd2hpY2ggaXMgdG8gYmUgbW92ZWQuXG4gICAgICovXG4gICAgbGV0IHNldEJveFBvc2l0aW9uID0gZnVuY3Rpb24gKGJveCwgYm94Qikge1xuICAgICAgICBib3hCLnJvdyArPSBib3gucm93ICsgYm94LnJvd3NwYW4gLSBib3hCLnJvdztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSBib3gsIGZpbmRzIG90aGVyIGJveGVzIHdoaWNoIGludGVyc2VjdCB3aXRoIGl0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBleGNsdWRlQm94IEFycmF5IG9mIGJveGVzLlxuICAgICAqL1xuICAgIGxldCBnZXRJbnRlcnNlY3RlZEJveGVzID0gZnVuY3Rpb24gKGJveCwgZXhjbHVkZUJveCwgbW92ZWRCb3hlcykge1xuICAgICAgICBsZXQgaW50ZXJzZWN0ZWRCb3hlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYm94ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIC8vIERvbid0IGNoZWNrIG1vdmluZyBib3ggYW5kIHRoZSBib3ggaXRzZWxmLlxuICAgICAgICAgICAgaWYgKGJveCAhPT0gYm94ZXNbaV0gJiYgYm94ZXNbaV0gIT09IGV4Y2x1ZGVCb3gpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9Cb3hlc0ludGVyc2VjdChib3gsIGJveGVzW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICBtb3ZlZEJveGVzLnB1c2goYm94ZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnNlY3RlZEJveGVzLnB1c2goYm94ZXNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpbnNlcnRpb25Tb3J0KGludGVyc2VjdGVkQm94ZXMsICdyb3cnKTtcblxuICAgICAgICByZXR1cm4gaW50ZXJzZWN0ZWRCb3hlcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgMiBib3hlcyBpbnRlcnNlY3QgdXNpbmcgYm91bmRpbmcgYm94IG1ldGhvZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94QVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hCXG4gICAgICogQHJldHVybnMgYm9vbGVhbiBUcnVlIGlmIGludGVyc2VjdCBlbHNlIGZhbHNlLlxuICAgICAqL1xuICAgIGxldCBkb0JveGVzSW50ZXJzZWN0ID0gZnVuY3Rpb24gKGJveCwgYm94Qikge1xuICAgICAgICByZXR1cm4gKGJveC5jb2x1bW4gPCBib3hCLmNvbHVtbiArIGJveEIuY29sdW1uc3BhbiAmJlxuICAgICAgICAgICAgICAgIGJveC5jb2x1bW4gKyBib3guY29sdW1uc3BhbiA+IGJveEIuY29sdW1uICYmXG4gICAgICAgICAgICAgICAgYm94LnJvdyA8IGJveEIucm93ICsgYm94Qi5yb3dzcGFuICYmXG4gICAgICAgICAgICAgICAgYm94LnJvd3NwYW4gKyBib3gucm93ID4gYm94Qi5yb3cpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBudW1iZXIgb2YgY29sdW1ucy5cbiAgICAgKi9cbiAgICBsZXQgdXBkYXRlTnVtQ29sdW1ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG1heENvbHVtbiA9IGdldE1heE51bShib3hlcywgJ2NvbHVtbicsICdjb2x1bW5zcGFuJyk7XG5cbiAgICAgICAgaWYgKG1heENvbHVtbiA+PSBkYXNoZ3JpZC5taW5Db2x1bW5zKSB7XG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Db2x1bW5zID0gbWF4Q29sdW1uO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFtb3ZpbmdCb3gpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXNoZ3JpZC5udW1Db2x1bW5zIC0gbW92aW5nQm94LmNvbHVtbiAtIG1vdmluZ0JveC5jb2x1bW5zcGFuID09PSAwICYmXG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Db2x1bW5zIDwgZGFzaGdyaWQubWF4Q29sdW1ucykge1xuICAgICAgICAgICAgZGFzaGdyaWQubnVtQ29sdW1ucyArPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKGRhc2hncmlkLm51bUNvbHVtbnMgLSBtb3ZpbmdCb3guY29sdW1uLSBtb3ZpbmdCb3guY29sdW1uc3BhbiA+IDEgJiZcbiAgICAgICAgICAgIG1vdmluZ0JveC5jb2x1bW4gKyBtb3ZpbmdCb3guY29sdW1uc3BhbiA9PT0gbWF4Q29sdW1uICYmXG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Db2x1bW5zID4gZGFzaGdyaWQubWluQ29sdW1ucyAmJlxuICAgICAgICAgICAgZGFzaGdyaWQubnVtQ29sdW1ucyA8IGRhc2hncmlkLm1heENvbHVtbnMpIHtcbiAgICAgICAgICAgIGRhc2hncmlkLm51bUNvbHVtbnMgPSBtYXhDb2x1bW4gKyAxO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEluY3JlYXNlcyBudW1iZXIgb2YgZGFzaGdyaWQubnVtUm93cyBpZiBib3ggdG91Y2hlcyBib3R0b20gb2Ygd2FsbC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bUNvbHVtbnNcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpbmNyZWFzZSBlbHNlIGZhbHNlLlxuICAgICAqL1xuICAgIGxldCBpbmNyZWFzZU51bUNvbHVtbnMgPSBmdW5jdGlvbiAoYm94LCBudW1Db2x1bW5zKSB7XG4gICAgICAgIC8vIERldGVybWluZSB3aGVuIHRvIGFkZCBleHRyYSByb3cgdG8gYmUgYWJsZSB0byBtb3ZlIGRvd246XG4gICAgICAgIC8vIDEuIEFueXRpbWUgZHJhZ2dpbmcgc3RhcnRzLlxuICAgICAgICAvLyAyLiBXaGVuIGRyYWdnaW5nIHN0YXJ0cyBhbmQgbW92aW5nIGJveCBpcyBjbG9zZSB0byBib3R0b20gYm9yZGVyLlxuICAgICAgICBpZiAoKGJveC5jb2x1bW4gKyBib3guY29sdW1uc3BhbikgPT09IGRhc2hncmlkLm51bUNvbHVtbnMgJiZcbiAgICAgICAgICAgIGRhc2hncmlkLm51bUNvbHVtbnMgPCBkYXNoZ3JpZC5tYXhDb2x1bW5zKSB7XG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Db2x1bW5zICs9IDE7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVjcmVhc2VzIG51bWJlciBvZiBkYXNoZ3JpZC5udW1Sb3dzIHRvIGZ1cnRoZXN0IGxlZnR3YXJkIGJveC5cbiAgICAgKiBAcmV0dXJucyBib29sZWFuIHRydWUgaWYgaW5jcmVhc2UgZWxzZSBmYWxzZS5cbiAgICAgKi9cbiAgICBsZXQgZGVjcmVhc2VOdW1Db2x1bW5zID0gZnVuY3Rpb24gICgpIHtcbiAgICAgICAgbGV0IG1heENvbHVtbk51bSA9IDA7XG5cbiAgICAgICAgYm94ZXMuZm9yRWFjaChmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgICAgICBpZiAobWF4Q29sdW1uTnVtIDwgKGJveC5jb2x1bW4gKyBib3guY29sdW1uc3BhbikpIHtcbiAgICAgICAgICAgICAgICBtYXhDb2x1bW5OdW0gPSBib3guY29sdW1uICsgYm94LmNvbHVtbnNwYW47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChtYXhDb2x1bW5OdW0gPCBkYXNoZ3JpZC5udW1Db2x1bW5zKSB7ZGFzaGdyaWQubnVtQ29sdW1ucyA9IG1heENvbHVtbk51bTt9XG4gICAgICAgIGlmIChtYXhDb2x1bW5OdW0gPCBkYXNoZ3JpZC5taW5Db2x1bW5zKSB7ZGFzaGdyaWQubnVtQ29sdW1ucyA9IGRhc2hncmlkLm1pbkNvbHVtbnM7fVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBOdW1iZXIgcm93cyBkZXBlbmRzIG9uIHRocmVlIHRoaW5ncy5cbiAgICAgKiA8dWw+XG4gICAgICogICAgIDxsaT5NaW4gLyBNYXggUm93cy48L2xpPlxuICAgICAqICAgICA8bGk+TWF4IEJveC48L2xpPlxuICAgICAqICAgICA8bGk+RHJhZ2dpbmcgYm94IG5lYXIgYm90dG9tIGJvcmRlci48L2xpPlxuICAgICAqIDwvdWw+XG4gICAgICpcbiAgICAgKi9cbiAgICBsZXQgdXBkYXRlTnVtUm93cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG1heFJvdyA9IGdldE1heE51bShib3hlcywgJ3JvdycsICdyb3dzcGFuJyk7XG5cbiAgICAgICAgaWYgKG1heFJvdyA+PSBkYXNoZ3JpZC5taW5Sb3dzKSB7XG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Sb3dzID0gbWF4Um93O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFtb3ZpbmdCb3gpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1vdmluZyBib3ggd2hlbiBjbG9zZSB0byBib3JkZXIuXG4gICAgICAgIGlmIChkYXNoZ3JpZC5udW1Sb3dzIC0gbW92aW5nQm94LnJvdyAtIG1vdmluZ0JveC5yb3dzcGFuID09PSAwICYmXG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Sb3dzIDwgZGFzaGdyaWQubWF4Um93cykge1xuICAgICAgICAgICAgZGFzaGdyaWQubnVtUm93cyArPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKGRhc2hncmlkLm51bVJvd3MgLSBtb3ZpbmdCb3gucm93IC0gbW92aW5nQm94LnJvd3NwYW4gPiAxICYmXG4gICAgICAgICAgICBtb3ZpbmdCb3gucm93ICsgbW92aW5nQm94LnJvd3NwYW4gPT09IG1heFJvdyAmJlxuICAgICAgICAgICAgZGFzaGdyaWQubnVtUm93cyA+IGRhc2hncmlkLm1pblJvd3MgJiZcbiAgICAgICAgICAgIGRhc2hncmlkLm51bVJvd3MgPCBkYXNoZ3JpZC5tYXhSb3dzKSB7XG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Sb3dzID0gbWF4Um93ICsgMTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEluY3JlYXNlcyBudW1iZXIgb2YgZGFzaGdyaWQubnVtUm93cyBpZiBib3ggdG91Y2hlcyBib3R0b20gb2Ygd2FsbC5cbiAgICAgKiBAcGFyYW0gYm94IHtPYmplY3R9XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaW5jcmVhc2UgZWxzZSBmYWxzZS5cbiAgICAgKi9cbiAgICBsZXQgaW5jcmVhc2VOdW1Sb3dzID0gZnVuY3Rpb24gKGJveCwgbnVtUm93cykge1xuICAgICAgICAvLyBEZXRlcm1pbmUgd2hlbiB0byBhZGQgZXh0cmEgcm93IHRvIGJlIGFibGUgdG8gbW92ZSBkb3duOlxuICAgICAgICAvLyAxLiBBbnl0aW1lIGRyYWdnaW5nIHN0YXJ0cy5cbiAgICAgICAgLy8gMi4gV2hlbiBkcmFnZ2luZyBzdGFydHMgQU5EIG1vdmluZyBib3ggaXMgY2xvc2UgdG8gYm90dG9tIGJvcmRlci5cbiAgICAgICAgaWYgKChib3gucm93ICsgYm94LnJvd3NwYW4pID09PSBkYXNoZ3JpZC5udW1Sb3dzICYmXG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Sb3dzIDwgZGFzaGdyaWQubWF4Um93cykge1xuICAgICAgICAgICAgZGFzaGdyaWQubnVtUm93cyArPSAxO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlY3JlYXNlcyBudW1iZXIgb2YgZGFzaGdyaWQubnVtUm93cyB0byBmdXJ0aGVzdCBkb3dud2FyZCBib3guXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaW5jcmVhc2UgZWxzZSBmYWxzZS5cbiAgICAgKi9cbiAgICBsZXQgZGVjcmVhc2VOdW1Sb3dzID0gZnVuY3Rpb24gICgpIHtcbiAgICAgICAgbGV0IG1heFJvd051bSA9IDA7XG5cbiAgICAgICAgYm94ZXMuZm9yRWFjaChmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgICAgICBpZiAobWF4Um93TnVtIDwgKGJveC5yb3cgKyBib3gucm93c3BhbikpIHtcbiAgICAgICAgICAgICAgICBtYXhSb3dOdW0gPSBib3gucm93ICsgYm94LnJvd3NwYW47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChtYXhSb3dOdW0gPCBkYXNoZ3JpZC5udW1Sb3dzKSB7ZGFzaGdyaWQubnVtUm93cyA9IG1heFJvd051bTt9XG4gICAgICAgIGlmIChtYXhSb3dOdW0gPCBkYXNoZ3JpZC5taW5Sb3dzKSB7ZGFzaGdyaWQubnVtUm93cyA9IGRhc2hncmlkLm1pblJvd3M7fVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgbWluLCBtYXggYm94LXNpemUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGxldCBpc1VwZGF0ZVZhbGlkID0gZnVuY3Rpb24gKGJveCkge1xuICAgICAgICBpZiAoYm94LnJvd3NwYW4gPCBkYXNoZ3JpZC5taW5Sb3dzcGFuIHx8XG4gICAgICAgICAgICBib3gucm93c3BhbiA+IGRhc2hncmlkLm1heFJvd3NwYW4gfHxcbiAgICAgICAgICAgIGJveC5jb2x1bW5zcGFuIDwgZGFzaGdyaWQubWluQ29sdW1uc3BhbiB8fFxuICAgICAgICAgICAgYm94LmNvbHVtbnNwYW4gPiBkYXNoZ3JpZC5tYXhDb2x1bW5zcGFuKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBib3JkZXIgY29sbGlzaW9ucyBieSByZXZlcnRpbmcgYmFjayB0byBjbG9zZXN0IGVkZ2UgcG9pbnQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIGNvbGxpZGVkIGFuZCBjYW5ub3QgbW92ZSB3YWxsIGVsc2UgZmFsc2UuXG4gICAgICovXG4gICAgbGV0IGlzQm94T3V0c2lkZUJvdW5kYXJ5ID0gZnVuY3Rpb24gKGJveCkge1xuICAgICAgICAvLyBUb3AgYW5kIGxlZnQgYm9yZGVyLlxuICAgICAgICBpZiAoYm94LmNvbHVtbiA8IDAgfHxcbiAgICAgICAgICAgIGJveC5yb3cgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJpZ2h0IGFuZCBib3R0b20gYm9yZGVyLlxuICAgICAgICBpZiAoYm94LnJvdyArIGJveC5yb3dzcGFuID4gZGFzaGdyaWQubWF4Um93cyB8fFxuICAgICAgICAgICAgYm94LmNvbHVtbiArIGJveC5jb2x1bW5zcGFuID4gZGFzaGdyaWQubWF4Q29sdW1ucykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIHJldHVybiBPYmplY3QuZnJlZXplKHtcbiAgICAgICAgaW5pdCxcbiAgICAgICAgdXBkYXRlQm94LFxuICAgICAgICB1cGRhdGVOdW1Sb3dzLFxuICAgICAgICBpbmNyZWFzZU51bVJvd3MsXG4gICAgICAgIGRlY3JlYXNlTnVtUm93cyxcbiAgICAgICAgdXBkYXRlTnVtQ29sdW1ucyxcbiAgICAgICAgaW5jcmVhc2VOdW1Db2x1bW5zLFxuICAgICAgICBkZWNyZWFzZU51bUNvbHVtbnMsXG4gICAgICAgIGdldEJveCxcbiAgICAgICAgaW5zZXJ0Qm94LFxuICAgICAgICByZW1vdmVCb3hcbiAgICB9KTtcbn1cbiIsImltcG9ydCB7cmVtb3ZlTm9kZXN9IGZyb20gJy4vdXRpbHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBHcmlkVmlldztcblxuLyoqXG4gKiBIYW5kbGVzIHRoZSByZW5kZXJpbmcgZnJvbSBqYXZhc2NyaXB0IHRvIERPTS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGFzaGdyaWQuXG4gKiBAcGFyYW0ge3JlbmRlcmVyfSByZW5kZXJlci5cbiAqL1xuZnVuY3Rpb24gR3JpZFZpZXcob2JqKSB7XG4gICAgbGV0IHtkYXNoZ3JpZCwgcmVuZGVyZXJ9ID0gb2JqO1xuICAgIGxldCBncmlkTGluZXNFbGVtZW50O1xuICAgIGxldCBncmlkQ2VudHJvaWRzRWxlbWVudDtcblxuICAgIGxldCBpbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoZGFzaGdyaWQuc2hvd0dyaWRMaW5lcykge2NyZWF0ZUdyaWRMaW5lc0VsZW1lbnQoKTt9XG4gICAgICAgIGlmIChkYXNoZ3JpZC5zaG93R3JpZENlbnRyb2lkcykge2NyZWF0ZUdyaWRDZW50cm9pZHNFbGVtZW50KCk7fVxuXG4gICAgICAgIHJlbmRlcmVyLnNldENvbHVtbldpZHRoKCk7XG4gICAgICAgIHJlbmRlcmVyLnNldFJvd0hlaWdodCgpO1xuXG4gICAgICAgIHJlbmRlckdyaWQoKTtcbiAgICAgICAgcmVuZGVyQm94KGRhc2hncmlkLmJveGVzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHZlcnRpY2FsIGFuZCBob3Jpem9udGFsIGxpbmUgZWxlbWVudHMuXG4gICAgICovXG4gICAgbGV0IGNyZWF0ZUdyaWRMaW5lc0VsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBsaW5lRWxlbWVudElEID0gJ2Rhc2hncmlkLWdyaWQtbGluZXMnO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGluZUVsZW1lbnRJRCkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGdyaWRMaW5lc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGdyaWRMaW5lc0VsZW1lbnQuaWQgPSBsaW5lRWxlbWVudElEO1xuICAgICAgICAgICAgZGFzaGdyaWQuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZ3JpZExpbmVzRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHZlcnRpY2FsIGFuZCBob3Jpem9udGFsIGxpbmUgZWxlbWVudHMuXG4gICAgICovXG4gICAgbGV0IGNyZWF0ZUdyaWRDZW50cm9pZHNFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgY2VudHJvaWRFbGVtZW50SUQgPSAnZGFzaGdyaWQtZ3JpZC1jZW50cm9pZHMnO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2VudHJvaWRFbGVtZW50SUQpID09PSBudWxsKSB7XG4gICAgICAgICAgICBncmlkQ2VudHJvaWRzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZ3JpZENlbnRyb2lkc0VsZW1lbnQuaWQgPSBjZW50cm9pZEVsZW1lbnRJRDtcbiAgICAgICAgICAgIGRhc2hncmlkLl9lbGVtZW50LmFwcGVuZENoaWxkKGdyaWRDZW50cm9pZHNFbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGhvcml6b250YWwgYW5kIHZlcnRpY2FsIGdyaWQgbGluZXMgd2l0aCB0aGUgdGhpY2tuZXNzIG9mIHhNYXJnaW5cbiAgICAgKiB5TWFyZ2luLlxuICAgICAqL1xuICAgIGxldCByZW5kZXJHcmlkTGluZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChncmlkTGluZXNFbGVtZW50ID09PSBudWxsKSB7cmV0dXJuO31cblxuICAgICAgICByZW1vdmVOb2RlcyhncmlkTGluZXNFbGVtZW50KTtcbiAgICAgICAgbGV0IGNvbHVtbldpZHRoID0gcmVuZGVyZXIuZ2V0Q29sdW1uV2lkdGgoKTtcbiAgICAgICAgbGV0IHJvd0hlaWdodCA9IHJlbmRlcmVyLmdldFJvd0hlaWdodCgpO1xuXG4gICAgICAgIGxldCBodG1sU3RyaW5nID0gJyc7XG4gICAgICAgIC8vIEhvcml6b250YWwgbGluZXNcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gZGFzaGdyaWQubnVtUm93czsgaSArPSAxKSB7XG4gICAgICAgICAgICBodG1sU3RyaW5nICs9IGA8ZGl2IGNsYXNzPSdkYXNoZ3JpZC1ob3Jpem9udGFsLWxpbmUnXG4gICAgICAgICAgICAgICAgc3R5bGU9J3RvcDogJHtpICogKHJvd0hlaWdodCArIGRhc2hncmlkLnlNYXJnaW4pfXB4O1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwcHg7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICR7ZGFzaGdyaWQueU1hcmdpbn1weDtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyc+XG4gICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFZlcnRpY2FsIGxpbmVzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGRhc2hncmlkLm51bUNvbHVtbnM7IGkgKz0gMSkge1xuICAgICAgICAgICAgaHRtbFN0cmluZyArPSBgPGRpdiBjbGFzcz0nZGFzaGdyaWQtdmVydGljYWwtbGluZSdcbiAgICAgICAgICAgICAgICBzdHlsZT0ndG9wOiAwcHg7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7aSAqIChjb2x1bW5XaWR0aCArIGRhc2hncmlkLnhNYXJnaW4pfXB4O1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAke2Rhc2hncmlkLnhNYXJnaW59cHg7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsnPlxuICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgICAgIH1cblxuICAgICAgICBncmlkTGluZXNFbGVtZW50LmlubmVySFRNTCA9IGh0bWxTdHJpbmc7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERyYXcgaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgZ3JpZCBsaW5lcyB3aXRoIHRoZSB0aGlja25lc3Mgb2YgeE1hcmdpblxuICAgICAqIHlNYXJnaW4uXG4gICAgICovXG4gICAgbGV0IHJlbmRlckdyaWRDZW50cm9pZHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChncmlkQ2VudHJvaWRzRWxlbWVudCA9PT0gbnVsbCkge3JldHVybn07XG5cbiAgICAgICAgcmVtb3ZlTm9kZXMoZ3JpZENlbnRyb2lkc0VsZW1lbnQpO1xuICAgICAgICBsZXQgY29sdW1uV2lkdGggPSByZW5kZXJlci5nZXRDb2x1bW5XaWR0aCgpO1xuICAgICAgICBsZXQgcm93SGVpZ2h0ID0gcmVuZGVyZXIuZ2V0Um93SGVpZ2h0KCk7XG5cbiAgICAgICAgbGV0IGh0bWxTdHJpbmcgPSAnJztcbiAgICAgICAgLy8gRHJhdyBjZW50cm9pZHNcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXNoZ3JpZC5udW1Sb3dzOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZGFzaGdyaWQubnVtQ29sdW1uczsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgaHRtbFN0cmluZyArPSBgPGRpdiBjbGFzcz0nZGFzaGdyaWQtZ3JpZC1jZW50cm9pZCdcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9J3RvcDogJHsoaSAqIChyb3dIZWlnaHQgICsgZGFzaGdyaWQueU1hcmdpbikgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd0hlaWdodCAvIDIgKyBkYXNoZ3JpZC55TWFyZ2luICl9cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAkeyhqICogKGNvbHVtbldpZHRoICArIGRhc2hncmlkLnhNYXJnaW4pICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5XaWR0aCAvIDIgKyBkYXNoZ3JpZC54TWFyZ2luKX1weDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7Jz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdyaWRDZW50cm9pZHNFbGVtZW50LmlubmVySFRNTCA9IGh0bWxTdHJpbmc7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbmRlciB0aGUgZGFzaGdyaWQ6XG4gICAgICogICAgMS4gU2V0dGluZyBncmlkIGFuZCBjZWxsIGhlaWdodCAvIHdpZHRoXG4gICAgICogICAgMi4gUGFpbnRpbmcuXG4gICAgICovXG4gICAgbGV0IHJlbmRlckdyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldEdyaWRFbGVtZW50SGVpZ2h0KCk7XG4gICAgICAgIHJlbmRlcmVyLnNldEdyaWRFbGVtZW50V2lkdGgoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Q2VsbENlbnRyb2lkcygpO1xuXG4gICAgICAgIGlmIChkYXNoZ3JpZC5zaG93R3JpZExpbmVzKSB7cmVuZGVyR3JpZExpbmVzKCk7fVxuICAgICAgICBpZiAoZGFzaGdyaWQuc2hvd0dyaWRDZW50cm9pZHMpIHtyZW5kZXJHcmlkQ2VudHJvaWRzKCk7fVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBib3hlcyBMaXN0IG9mIGJveGVzIHRvIHJlZHJhdy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXhjbHVkZUJveCBEb24ndCByZWRyYXcgdGhpcyBib3guXG4gICAgICovXG4gICAgbGV0IHJlbmRlckJveCA9IGZ1bmN0aW9uIChib3hlcywgZXhjbHVkZUJveCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAvLyB1cGRhdGVHcmlkRGltZW5zaW9uIG1vdmVkIGJveGVzIGNzcy5cbiAgICAgICAgICAgIGJveGVzLmZvckVhY2goZnVuY3Rpb24gKGJveCkge1xuICAgICAgICAgICAgICAgIGlmIChleGNsdWRlQm94ICE9PSBib3gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0Qm94RWxlbWVudFlQb3NpdGlvbihib3guX2VsZW1lbnQsIGJveC5yb3cpO1xuICAgICAgICAgICAgICAgICAgICByZW5kZXJlci5zZXRCb3hFbGVtZW50WFBvc2l0aW9uKGJveC5fZWxlbWVudCwgYm94LmNvbHVtbik7XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLnNldEJveEVsZW1lbnRIZWlnaHQoYm94Ll9lbGVtZW50LCBib3gucm93c3Bhbik7XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLnNldEJveEVsZW1lbnRXaWR0aChib3guX2VsZW1lbnQsIGJveC5jb2x1bW5zcGFuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe1xuICAgICAgICBpbml0LFxuICAgICAgICByZW5kZXJHcmlkLFxuICAgICAgICByZW5kZXJCb3gsXG4gICAgICAgIGNyZWF0ZUdyaWRMaW5lc0VsZW1lbnQsXG4gICAgICAgIGNyZWF0ZUdyaWRDZW50cm9pZHNFbGVtZW50XG4gICAgfSk7XG59XG4iLCIvKipcbiAqIG1vdXNlSGFuZGxlci5qczogSW5pdGlhbGl6ZXMgYW5kIHNldHMgdXAgdGhlIGV2ZW50cyBmb3IgZHJhZ2dpbmcgLyByZXNpemluZy5cbiAqL1xuXG5pbXBvcnQge2ZpbmRQYXJlbnR9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNb3VzZUhhbmRsZXIoY29tcCkge1xuICAgIGxldCB7ZHJhZ2dlciwgcmVzaXplciwgZGFzaGdyaWQsIGdyaWR9ID0gY29tcDtcblxuICAgIGxldCBpbnB1dFRhZ3MgPSBbJ3NlbGVjdCcsICdpbnB1dCcsICd0ZXh0YXJlYScsICdidXR0b24nXTtcblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7ZGFzaGdyaWQuX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKGUpIHttb3VzZURvd24oZSwgZGFzaGdyaWQuX2VsZW1lbnQpOyBlLnByZXZlbnREZWZhdWx0KCk7fSwgZmFsc2UpO31cblxuICAgIGZ1bmN0aW9uIG1vdXNlRG93bihlLCBlbGVtZW50KSB7XG4gICAgICAgIGxldCBub2RlID0gZS50YXJnZXQ7XG5cbiAgICAgICAgLy8gRXhpdCBpZjpcbiAgICAgICAgLy8gMS4gdGhlIHRhcmdldCBoYXMgaXQncyBvd24gY2xpY2sgZXZlbnQgb3JcbiAgICAgICAgLy8gMi4gdGFyZ2V0IGhhcyBvbmNsaWNrIGF0dHJpYnV0ZSBvclxuICAgICAgICAvLyAzLiBSaWdodCAvIG1pZGRsZSBidXR0b24gY2xpY2tlZCBpbnN0ZWFkIG9mIGxlZnQuXG4gICAgICAgIGlmIChpbnB1dFRhZ3MuaW5kZXhPZihub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpID4gLTEpIHtyZXR1cm47fVxuICAgICAgICBpZiAobm9kZS5oYXNBdHRyaWJ1dGUoJ29uY2xpY2snKSkge3JldHVybjt9XG4gICAgICAgIGlmIChlLndoaWNoID09PSAyIHx8IGUud2hpY2ggPT09IDMpIHtyZXR1cm47fVxuXG4gICAgICAgIC8vIEhhbmRsZSBkcmFnIC8gcmVzaXplIGV2ZW50LlxuICAgICAgICBpZiAobm9kZS5jbGFzc05hbWUuc2VhcmNoKC9kYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS8pID4gLTEpIHtoYW5kbGVFdmVudChlLCByZXNpemVFdmVudCk7fVxuICAgICAgICBlbHNlIGlmIChub2RlLmNsYXNzTmFtZS5zZWFyY2goZGFzaGdyaWQuZHJhZ2dhYmxlLmhhbmRsZSkgPiAtMSkge2hhbmRsZUV2ZW50KGUsIGRyYWdFdmVudCk7fVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBtb3VzZSBldmVudCwgY2xpY2sgb3IgcmVzaXplLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoYW5kbGVFdmVudChlLCBjYikge1xuICAgICAgICBsZXQgYm94RWxlbWVudCA9IGZpbmRQYXJlbnQoZS50YXJnZXQsIC9eZGFzaGdyaWQtYm94JC8pO1xuICAgICAgICBsZXQgYm94ID0gZ3JpZC5nZXRCb3goYm94RWxlbWVudCk7XG4gICAgICAgIGlmIChib3gpIHsgY2IoYm94LCBlKTsgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyYWcgZXZlbnQsIHNldHMgb2ZmIHN0YXJ0IGRyYWcsIGR1cmluZyBkcmFnIGFuZCBlbmQgZHJhZy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkcmFnRXZlbnQoYm94LCBlKSB7XG4gICAgICAgIGlmICghZGFzaGdyaWQuZHJhZ2dhYmxlLmVuYWJsZWQgfHwgIWJveC5kcmFnZ2FibGUpIHtyZXR1cm47fVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdkcmFnc3RhcnQnKTtcbiAgICAgICAgZHJhZ2dlci5kcmFnU3RhcnQoYm94LCBlKTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZHJhZ0VuZCwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkcmFnLCBmYWxzZSk7XG5cbiAgICAgICAgZnVuY3Rpb24gZHJhZyhlKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZHJhZycpO1xuICAgICAgICAgICAgZHJhZ2dlci5kcmFnKGJveCwgZSk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkcmFnRW5kKGUpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdkcmFnZW5kJyk7XG4gICAgICAgICAgICBkcmFnZ2VyLmRyYWdFbmQoYm94LCBlKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBkcmFnRW5kLCBmYWxzZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkcmFnLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNpemUgZXZlbnQsIHNldHMgb2ZmIHN0YXJ0IHJlc2l6ZSwgZHVyaW5nIHJlc2l6ZSBhbmQgZW5kIHJlc2l6ZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZXNpemVFdmVudChib3gsIGUpIHtcbiAgICAgICAgaWYgKCFkYXNoZ3JpZC5yZXNpemFibGUuZW5hYmxlZCB8fCAhYm94LnJlc2l6YWJsZSkge3JldHVybjt9XG4gICAgICAgIHJlc2l6ZXIucmVzaXplU3RhcnQoYm94LCBlKTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgcmVzaXplRW5kLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHJlc2l6ZSwgZmFsc2UpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlc2l6ZShlKSB7cmVzaXplci5yZXNpemUoYm94LCBlKTtlLnByZXZlbnREZWZhdWx0KCk7fVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlc2l6ZUVuZChlKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgcmVzaXplRW5kLCBmYWxzZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCByZXNpemUsIGZhbHNlKTtcblxuICAgICAgICAgICAgcmVzaXplci5yZXNpemVFbmQoYm94LCBlKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuZnJlZXplKHtcbiAgICAgICAgaW5pdFxuICAgIH0pO1xuXG59XG4iLCJpbXBvcnQge3JlbW92ZU5vZGVzfSBmcm9tICcuL3V0aWxzLmpzJztcbmV4cG9ydCBkZWZhdWx0IFJlbmRlcjtcblxuZnVuY3Rpb24gUmVuZGVyKGNvbXApIHtcbiAgICBsZXQge2Rhc2hncmlkfSA9IGNvbXA7XG5cbiAgICAvLyBTdGFydCByb3cgLyBjb2x1bW4gZGVub3RlcyB0aGUgcGl4ZWwgYXQgd2hpY2ggZWFjaCBjZWxsIHN0YXJ0cyBhdC5cbiAgICBsZXQgc3RhcnRDb2x1bW4gPSBbXTtcbiAgICBsZXQgc3RhcnRSb3cgPSBbXTtcbiAgICBsZXQgY29sdW1uV2lkdGgsIHJvd0hlaWdodDtcblxuICAgIC8qKlxuICAgICogQHJldHVybnMgXG4gICAgKi9cbiAgICBsZXQgZ2V0Q29sdW1uV2lkdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5XaWR0aDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKiBAcmV0dXJucyBcbiAgICAqL1xuICAgIGxldCBnZXRSb3dIZWlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiByb3dIZWlnaHQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICpcbiAgICAqIEBwYXJhbSB7fVxuICAgICogQHJldHVybnNcbiAgICAqL1xuICAgIGxldCBzZXRHcmlkRWxlbWVudFdpZHRoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBkYXNoZ3JpZC5fZWxlbWVudC5zdHlsZS53aWR0aCA9IChjb2x1bW5XaWR0aCkgP1xuICAgICAgICAgICAgY29sdW1uV2lkdGggKiBkYXNoZ3JpZC5udW1Db2x1bW5zICsgKGRhc2hncmlkLm51bUNvbHVtbnMgKyAxKSAqIGRhc2hncmlkLnhNYXJnaW4gKyAncHgnIDpcbiAgICAgICAgICAgIGRhc2hncmlkLl9lbGVtZW50LnBhcmVudE5vZGUub2Zmc2V0V2lkdGggKyAncHgnO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAqXG4gICAgKiBAcGFyYW0ge31cbiAgICAqIEByZXR1cm5zXG4gICAgKi9cbiAgICBsZXQgc2V0Q29sdW1uV2lkdGggPSBmdW5jdGlvbiAoKSB7ICAgICAgICAgICAgXG4gICAgICAgIGNvbHVtbldpZHRoID0gKGRhc2hncmlkLmNvbHVtbldpZHRoICE9PSAnYXV0bycpID9cbiAgICAgICAgICAgIGRhc2hncmlkLmNvbHVtbldpZHRoIDpcbiAgICAgICAgICAgIChkYXNoZ3JpZC5fZWxlbWVudC5wYXJlbnROb2RlLm9mZnNldFdpZHRoIC0gKGRhc2hncmlkLm51bUNvbHVtbnMgKyAxKSAqIGRhc2hncmlkLnhNYXJnaW4pIC8gZGFzaGdyaWQubnVtQ29sdW1ucztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKlxuICAgICogQHBhcmFtIHt9XG4gICAgKiBAcmV0dXJuc1xuICAgICovXG4gICAgbGV0IHNldEdyaWRFbGVtZW50SGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBkYXNoZ3JpZC5fZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAocm93SGVpZ2h0KSA/XG4gICAgICAgICAgICByb3dIZWlnaHQgKiBkYXNoZ3JpZC5udW1Sb3dzICsgKGRhc2hncmlkLm51bVJvd3MgKyAxKSAqIGRhc2hncmlkLnlNYXJnaW4gKyAncHgnIDpcbiAgICAgICAgICAgIGRhc2hncmlkLl9lbGVtZW50LnBhcmVudE5vZGUub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKlxuICAgICogQHBhcmFtIHt9XG4gICAgKiBAcmV0dXJuc1xuICAgICovXG4gICAgbGV0IHNldFJvd0hlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcm93SGVpZ2h0ID0gKGRhc2hncmlkLnJvd0hlaWdodCAhPT0gJ2F1dG8nKSA/XG4gICAgICAgICAgICBkYXNoZ3JpZC5yb3dIZWlnaHQgOlxuICAgICAgICAgICAgKGRhc2hncmlkLl9lbGVtZW50LnBhcmVudE5vZGUub2Zmc2V0SGVpZ2h0IC0gKGRhc2hncmlkLm51bVJvd3MgKyAxKSAqIGRhc2hncmlkLnlNYXJnaW4pIC8gZGFzaGdyaWQubnVtUm93cztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKlxuICAgICogQHBhcmFtIHt9XG4gICAgKiBAcmV0dXJuc1xuICAgICovXG4gICAgbGV0IHNldEJveEVsZW1lbnRYUG9zaXRpb24gPSBmdW5jdGlvbiAoZWxlbWVudCwgY29sdW1uKSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IGNvbHVtbiAqIGNvbHVtbldpZHRoICsgZGFzaGdyaWQueE1hcmdpbiAqIChjb2x1bW4gKyAxKSArICdweCc7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICpcbiAgICAqIEBwYXJhbSB7fVxuICAgICogQHJldHVybnNcbiAgICAqL1xuICAgIGxldCBzZXRCb3hFbGVtZW50WVBvc2l0aW9uID0gZnVuY3Rpb24gKGVsZW1lbnQsIHJvdykge1xuICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IHJvdyAqIHJvd0hlaWdodCArIGRhc2hncmlkLnlNYXJnaW4gKiAocm93ICsgMSkgKyAncHgnO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAqXG4gICAgKiBAcGFyYW0ge31cbiAgICAqIEByZXR1cm5zXG4gICAgKi9cbiAgICBsZXQgc2V0Qm94RWxlbWVudFdpZHRoID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNvbHVtbnNwYW4pIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS53aWR0aCA9IGNvbHVtbnNwYW4gKiBjb2x1bW5XaWR0aCArIGRhc2hncmlkLnhNYXJnaW4gKiAoY29sdW1uc3BhbiAtIDEpICsgJ3B4JztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKlxuICAgICogQHBhcmFtIHt9XG4gICAgKiBAcmV0dXJuc1xuICAgICovXG4gICAgbGV0IHNldEJveEVsZW1lbnRIZWlnaHQgPSBmdW5jdGlvbiAoZWxlbWVudCwgcm93c3Bhbikge1xuICAgICAgICBlbGVtZW50LnN0eWxlLmhlaWdodCA9IHJvd3NwYW4gKiByb3dIZWlnaHQgKyBkYXNoZ3JpZC55TWFyZ2luICogKHJvd3NwYW4gLSAxKSArICdweCc7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIGNlbGwgY2VudHJvaWRzIHdoaWNoIGFyZSB1c2VkIHRvIGNvbXB1dGUgY2xvc2VzdCBjZWxsXG4gICAgICogICAgIHdoZW4gZHJhZ2dpbmcgYSBib3guXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bVJvd3MgVGhlIHRvdGFsIG51bWJlciBvZiByb3dzLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBudW1Db2x1bW5zIFRoZSB0b3RhbCBudW1iZXIgb2Ygcm93cy5cbiAgICAgKi9cbiAgICBsZXQgc2V0Q2VsbENlbnRyb2lkcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3RhcnRSb3cgPSBbXTtcbiAgICAgICAgc3RhcnRDb2x1bW4gPSBbXTtcbiAgICAgICAgbGV0IHN0YXJ0O1xuICAgICAgICBsZXQgc3RvcDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhc2hncmlkLm51bVJvd3M7IGkgKz0gMSkge1xuICAgICAgICAgICAgc3RhcnQgPSBpICogKHJvd0hlaWdodCArIGRhc2hncmlkLnlNYXJnaW4pICsgZGFzaGdyaWQueU1hcmdpbiAvIDI7XG4gICAgICAgICAgICBzdG9wID0gc3RhcnQgKyByb3dIZWlnaHQgKyBkYXNoZ3JpZC55TWFyZ2luO1xuICAgICAgICAgICAgc3RhcnRSb3cucHVzaChbTWF0aC5mbG9vcihzdGFydCksIE1hdGguY2VpbChzdG9wKV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXNoZ3JpZC5udW1Db2x1bW5zOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gaSAqIChjb2x1bW5XaWR0aCArIGRhc2hncmlkLnhNYXJnaW4pICsgZGFzaGdyaWQueE1hcmdpbiAvIDI7XG4gICAgICAgICAgICBzdG9wID0gc3RhcnQgKyBjb2x1bW5XaWR0aCArIGRhc2hncmlkLnhNYXJnaW47XG4gICAgICAgICAgICBzdGFydENvbHVtbi5wdXNoKFtNYXRoLmZsb29yKHN0YXJ0KSwgTWF0aC5jZWlsKHN0b3ApXSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmluZHMgd2hpY2ggY2VsbHMgYm94IGludGVyc2VjdHMgd2l0aC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94UG9zaXRpb24gQ29udGFpbnMgdG9wL2JvdHRvbS9sZWZ0L3JpZ2h0IGJveCBwb3NpdGlvblxuICAgICAqICAgICBpbiBweC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbnVtUm93cyBIb3cgbWFueSByb3dzIHRoZSBib3ggc3BhbnMuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bUNvbHVtbnMgSG93IG1hbnkgcm93cyB0aGUgYm94IHNwYW5zLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJvdyBvciBjb2x1bW4gd2hpY2ggZWFjaCBzaWRlIGlzIGZvdW5kIGluLlxuICAgICAqICAgICBGb3IgaW5zdGFuY2UsIGJveExlZnQ6IGNvbHVtbiA9IDAsIGJveFJpZ2h0OiBjb2x1bW4gPSAxLFxuICAgICAqICAgICBCb3hUb3A6IHJvdyA9IDAsIEJveEJvdHRvbTogcm93ID0gMy5cbiAgICAgKi9cbiAgICBsZXQgZmluZEludGVyc2VjdGVkQ2VsbHMgPSBmdW5jdGlvbiAoY29tcCkge1xuICAgICAgICBsZXQge3RvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdH0gPSBjb21wO1xuICAgICAgICBsZXQgYm94TGVmdCwgYm94UmlnaHQsIGJveFRvcCwgYm94Qm90dG9tO1xuXG4gICAgICAgIC8vIEZpbmQgdG9wIGFuZCBib3R0b20gaW50ZXJzZWN0aW9uIGNlbGwgcm93LlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhc2hncmlkLm51bVJvd3M7IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKHRvcCA+PSBzdGFydFJvd1tpXVswXSAmJiB0b3AgPD0gc3RhcnRSb3dbaV1bMV0pIHtib3hUb3AgPSBpO31cbiAgICAgICAgICAgIGlmIChib3R0b20gPj0gc3RhcnRSb3dbaV1bMF0gJiYgYm90dG9tIDw9IHN0YXJ0Um93W2ldWzFdKSB7Ym94Qm90dG9tID0gaTt9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaW5kIGxlZnQgYW5kIHJpZ2h0IGludGVyc2VjdGlvbiBjZWxsIGNvbHVtbi5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBkYXNoZ3JpZC5udW1Db2x1bW5zOyBqICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChsZWZ0ID49IHN0YXJ0Q29sdW1uW2pdWzBdICYmIGxlZnQgPD0gc3RhcnRDb2x1bW5bal1bMV0pIHtib3hMZWZ0ID0gajt9XG4gICAgICAgICAgICBpZiAocmlnaHQgPj0gc3RhcnRDb2x1bW5bal1bMF0gJiYgcmlnaHQgPD0gc3RhcnRDb2x1bW5bal1bMV0pIHtib3hSaWdodCA9IGo7fVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtib3hMZWZ0LCBib3hSaWdodCwgYm94VG9wLCBib3hCb3R0b219O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHZXQgY2xvc2VzdCBjZWxsIGdpdmVuIChyb3csIGNvbHVtbikgcG9zaXRpb24gaW4gcHguXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFBvc2l0aW9uIENvbnRhaW5zIHRvcC9ib3R0b20vbGVmdC9yaWdodCBib3ggcG9zaXRpb25cbiAgICAgKiAgICAgaW4gcHguXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bVJvd3NcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbnVtQ29sdW1uc1xuICAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgICovXG4gICAgbGV0IGdldENsb3Nlc3RDZWxscyA9IGZ1bmN0aW9uIChjb21wKSB7XG4gICAgICAgIGxldCB7dG9wLCByaWdodCwgYm90dG9tLCBsZWZ0fSA9IGNvbXA7XG4gICAgICAgIGxldCB7Ym94TGVmdCwgYm94UmlnaHQsIGJveFRvcCwgYm94Qm90dG9tfSA9IGZpbmRJbnRlcnNlY3RlZENlbGxzKGNvbXApO1xuXG4gICAgICAgIGxldCBjb2x1bW47XG4gICAgICAgIGxldCBsZWZ0T3ZlcmxhcDtcbiAgICAgICAgbGV0IHJpZ2h0T3ZlcmxhcDtcbiAgICAgICAgLy8gRGV0ZXJtaW5lIGlmIGVub3VnaCBvdmVybGFwIGZvciBob3Jpem9udGFsIG1vdmUuXG4gICAgICAgIGlmIChib3hMZWZ0ICE9PSB1bmRlZmluZWQgJiYgYm94UmlnaHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbGVmdE92ZXJsYXAgPSBNYXRoLmFicyhsZWZ0IC0gc3RhcnRDb2x1bW5bYm94TGVmdF1bMF0pO1xuICAgICAgICAgICAgcmlnaHRPdmVybGFwID0gTWF0aC5hYnMocmlnaHQgLSBzdGFydENvbHVtbltib3hSaWdodF1bMV0gLSBkYXNoZ3JpZC54TWFyZ2luKTtcbiAgICAgICAgICAgIGlmIChsZWZ0T3ZlcmxhcCA8PSByaWdodE92ZXJsYXApIHtjb2x1bW4gPSBib3hMZWZ0O31cbiAgICAgICAgICAgIGVsc2Uge2NvbHVtbiA9IGJveExlZnQgKyAxO31cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByb3c7XG4gICAgICAgIGxldCB0b3BPdmVybGFwO1xuICAgICAgICBsZXQgYm90dG9tT3ZlcmxhcDtcbiAgICAgICAgLy8gRGV0ZXJtaW5lIGlmIGVub3VnaCBvdmVybGFwIGZvciB2ZXJ0aWNhbCBtb3ZlLlxuICAgICAgICBpZiAoYm94VG9wICE9PSB1bmRlZmluZWQgJiYgYm94Qm90dG9tICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRvcE92ZXJsYXAgPSBNYXRoLmFicyh0b3AgLSBzdGFydFJvd1tib3hUb3BdWzBdKTtcbiAgICAgICAgICAgIGJvdHRvbU92ZXJsYXAgPSBNYXRoLmFicyhib3R0b20gLSBzdGFydFJvd1tib3hCb3R0b21dWzFdIC0gZGFzaGdyaWQueU1hcmdpbik7XG4gICAgICAgICAgICBpZiAodG9wT3ZlcmxhcCA8PSBib3R0b21PdmVybGFwKSB7cm93ID0gYm94VG9wO31cbiAgICAgICAgICAgIGVsc2Uge3JvdyA9IGJveFRvcCArIDE7fVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtyb3csIGNvbHVtbn07XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe1xuICAgICAgICBnZXRDb2x1bW5XaWR0aCxcbiAgICAgICAgZ2V0Um93SGVpZ2h0LFxuICAgICAgICBzZXRDb2x1bW5XaWR0aCxcbiAgICAgICAgc2V0Um93SGVpZ2h0LFxuICAgICAgICBzZXRHcmlkRWxlbWVudEhlaWdodCxcbiAgICAgICAgc2V0R3JpZEVsZW1lbnRXaWR0aCxcbiAgICAgICAgc2V0Qm94RWxlbWVudFhQb3NpdGlvbixcbiAgICAgICAgc2V0Qm94RWxlbWVudFlQb3NpdGlvbixcbiAgICAgICAgc2V0Qm94RWxlbWVudFdpZHRoLFxuICAgICAgICBzZXRCb3hFbGVtZW50SGVpZ2h0LFxuICAgICAgICBmaW5kSW50ZXJzZWN0ZWRDZWxscyxcbiAgICAgICAgc2V0Q2VsbENlbnRyb2lkcyxcbiAgICAgICAgZ2V0Q2xvc2VzdENlbGxzXG4gICB9KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IFJlc2l6ZXI7XG5cbmZ1bmN0aW9uIFJlc2l6ZXIoY29tcCkge1xuICAgIGxldCB7ZGFzaGdyaWQsIHJlbmRlcmVyLCBncmlkfSA9IGNvbXA7XG5cbiAgICBsZXQgbWluV2lkdGgsIG1pbkhlaWdodCwgZWxlbWVudExlZnQsIGVsZW1lbnRUb3AsIGVsZW1lbnRXaWR0aCwgZWxlbWVudEhlaWdodCwgbWluVG9wLCBtYXhUb3AsIG1pbkxlZnQsIG1heExlZnQsIGNsYXNzTmFtZSxcbiAgICBtb3VzZVggPSAwLFxuICAgIG1vdXNlWSA9IDAsXG4gICAgbGFzdE1vdXNlWCA9IDAsXG4gICAgbGFzdE1vdXNlWSA9IDAsXG4gICAgbU9mZlggPSAwLFxuICAgIG1PZmZZID0gMCxcbiAgICBuZXdTdGF0ZSA9IHt9LFxuICAgIHByZXZTdGF0ZSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlXG4gICAgICovXG4gICAgbGV0IHJlc2l6ZVN0YXJ0ID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICBjbGFzc05hbWUgPSBlLnRhcmdldC5jbGFzc05hbWU7XG5cbiAgICAgICAgLy8gUmVtb3ZlcyB0cmFuc2l0aW9ucywgZGlzcGxheXMgYW5kIGluaXRzIHBvc2l0aW9ucyBmb3IgcHJldmlldyBib3guXG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS56SW5kZXggPSAxMDA0O1xuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9ICcnO1xuICAgICAgICBkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudC5zdHlsZS5sZWZ0ID0gYm94Ll9lbGVtZW50LnN0eWxlLmxlZnQ7XG4gICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLnRvcCA9IGJveC5fZWxlbWVudC5zdHlsZS50b3A7XG4gICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLndpZHRoID0gYm94Ll9lbGVtZW50LnN0eWxlLndpZHRoO1xuICAgICAgICBkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudC5zdHlsZS5oZWlnaHQgPSBib3guX2VsZW1lbnQuc3R5bGUuaGVpZ2h0O1xuICAgICAgICBkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cbiAgICAgICAgLy8gTW91c2UgdmFsdWVzLlxuICAgICAgICBtaW5XaWR0aCA9IHJlbmRlcmVyLmdldENvbHVtbldpZHRoKCk7XG4gICAgICAgIG1pbkhlaWdodCA9IHJlbmRlcmVyLmdldFJvd0hlaWdodCgpO1xuICAgICAgICBsYXN0TW91c2VYID0gZS5wYWdlWDtcbiAgICAgICAgbGFzdE1vdXNlWSA9IGUucGFnZVk7XG4gICAgICAgIGVsZW1lbnRMZWZ0ID0gcGFyc2VJbnQoYm94Ll9lbGVtZW50LnN0eWxlLmxlZnQsIDEwKTtcbiAgICAgICAgZWxlbWVudFRvcCA9IHBhcnNlSW50KGJveC5fZWxlbWVudC5zdHlsZS50b3AsIDEwKTtcbiAgICAgICAgZWxlbWVudFdpZHRoID0gYm94Ll9lbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICBlbGVtZW50SGVpZ2h0ID0gYm94Ll9lbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgICAgICBncmlkLnVwZGF0ZVN0YXJ0KGJveCk7XG5cbiAgICAgICAgaWYgKGRhc2hncmlkLnJlc2l6YWJsZS5yZXNpemVTdGFydCkge2Rhc2hncmlkLnJlc2l6YWJsZS5yZXNpemVTdGFydCgpO30gLy8gdXNlciBjYi5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKi9cbiAgICBsZXQgcmVzaXplID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICB1cGRhdGVSZXNpemluZ0VsZW1lbnQoYm94LCBlKTtcbiAgICAgICAgZ3JpZC51cGRhdGluZyhib3gpO1xuXG4gICAgICAgIGlmIChkYXNoZ3JpZC5saXZlQ2hhbmdlcykge1xuICAgICAgICAgICAgLy8gV2hpY2ggY2VsbCB0byBzbmFwIHNoYWRvd2JveCB0by5cbiAgICAgICAgICAgIGxldCB7Ym94TGVmdCwgYm94UmlnaHQsIGJveFRvcCwgYm94Qm90dG9tfSA9IHJlbmRlcmVyLlxuICAgICAgICAgICAgICAgIGZpbmRJbnRlcnNlY3RlZENlbGxzKHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogYm94Ll9lbGVtZW50Lm9mZnNldExlZnQsXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiBib3guX2VsZW1lbnQub2Zmc2V0TGVmdCArIGJveC5fZWxlbWVudC5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBib3guX2VsZW1lbnQub2Zmc2V0VG9wLFxuICAgICAgICAgICAgICAgICAgICBib3R0b206IGJveC5fZWxlbWVudC5vZmZzZXRUb3AgKyBib3guX2VsZW1lbnQub2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbmV3U3RhdGUgPSB7cm93OiBib3hUb3AsIGNvbHVtbjogYm94TGVmdCwgcm93c3BhbjogYm94Qm90dG9tIC0gYm94VG9wICsgMSwgY29sdW1uc3BhbjogYm94UmlnaHQgLSBib3hMZWZ0ICsgMX07XG5cbiAgICAgICAgICAgIHJlc2l6ZUJveChib3gsIGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhc2hncmlkLnJlc2l6YWJsZS5yZXNpemluZykge2Rhc2hncmlkLnJlc2l6YWJsZS5yZXNpemluZygpO30gLy8gdXNlciBjYi5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKi9cbiAgICBsZXQgcmVzaXplRW5kID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICBpZiAoIWRhc2hncmlkLmxpdmVDaGFuZ2VzKSB7XG4gICAgICAgICAgICBsZXQge2JveExlZnQsIGJveFJpZ2h0LCBib3hUb3AsIGJveEJvdHRvbX0gPSByZW5kZXJlci5cbiAgICAgICAgICAgICAgICBmaW5kSW50ZXJzZWN0ZWRDZWxscyh7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGJveC5fZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgICAgICByaWdodDogYm94Ll9lbGVtZW50Lm9mZnNldExlZnQgKyBib3guX2VsZW1lbnQub2Zmc2V0V2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogYm94Ll9lbGVtZW50Lm9mZnNldFRvcCxcbiAgICAgICAgICAgICAgICAgICAgYm90dG9tOiBib3guX2VsZW1lbnQub2Zmc2V0VG9wICsgYm94Ll9lbGVtZW50Lm9mZnNldEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgbnVtUm93czogZ3JpZC5nZXROdW1Sb3dzKCksXG4gICAgICAgICAgICAgICAgICAgIG51bUNvbHVtbnM6IGdyaWQuZ2V0TnVtQ29sdW1ucygpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuZXdTdGF0ZSA9IHtyb3c6IGJveFRvcCwgY29sdW1uOiBib3hMZWZ0LCByb3dzcGFuOiBib3hCb3R0b20gLSBib3hUb3AgKyAxLCBjb2x1bW5zcGFuOiBib3hSaWdodCAtIGJveExlZnQgKyAxfTtcbiAgICAgICAgICAgIHJlc2l6ZUJveChib3gsIGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IGJveCBzdHlsZS5cbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSBkYXNoZ3JpZC50cmFuc2l0aW9uO1xuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUubGVmdCA9IGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLmxlZnQ7XG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS50b3AgPSBkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudC5zdHlsZS50b3A7XG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS53aWR0aCA9IGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLndpZHRoO1xuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUuaGVpZ2h0O1xuXG4gICAgICAgIC8vIEdpdmUgdGltZSBmb3IgcHJldmlld2JveCB0byBzbmFwIGJhY2sgdG8gdGlsZS5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUuekluZGV4ID0gMTAwMztcbiAgICAgICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgICAgIGdyaWQudXBkYXRlRW5kKCk7XG4gICAgICAgIH0sIGRhc2hncmlkLnNuYXBCYWNrVGltZSk7XG5cbiAgICAgICAgaWYgKGRhc2hncmlkLnJlc2l6YWJsZS5yZXNpemVFbmQpIHtkYXNoZ3JpZC5yZXNpemFibGUucmVzaXplRW5kKCk7fSAvLyB1c2VyIGNiLlxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZVxuICAgICAqL1xuICAgIGxldCByZXNpemVCb3ggPSBmdW5jdGlvbiAoYm94LCBlKSB7XG4gICAgICAgIGlmIChuZXdTdGF0ZS5yb3cgIT09IHByZXZTdGF0ZS5yb3cgIHx8XG4gICAgICAgICAgICBuZXdTdGF0ZS5jb2x1bW4gIT09IHByZXZTdGF0ZS5jb2x1bW4gIHx8XG4gICAgICAgICAgICBuZXdTdGF0ZS5yb3dzcGFuICE9PSBwcmV2U3RhdGUucm93c3BhbiAgfHxcbiAgICAgICAgICAgIG5ld1N0YXRlLmNvbHVtbnNwYW4gIT09IHByZXZTdGF0ZS5jb2x1bW5zcGFuICkge1xuXG4gICAgICAgICAgICBsZXQgdXBkYXRlID0gZ3JpZC51cGRhdGVCb3goYm94LCBuZXdTdGF0ZSwgYm94KTtcblxuICAgICAgICAgICAgLy8gdXBkYXRlR3JpZERpbWVuc2lvbiBwcmV2aWV3IGJveC5cbiAgICAgICAgICAgIGlmICh1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZW5kZXJlci5zZXRCb3hFbGVtZW50WFBvc2l0aW9uKGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LCBuZXdTdGF0ZS5jb2x1bW4pO1xuICAgICAgICAgICAgICAgIHJlbmRlcmVyLnNldEJveEVsZW1lbnRZUG9zaXRpb24oZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQsIG5ld1N0YXRlLnJvdyk7XG4gICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0Qm94RWxlbWVudFdpZHRoKGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LCBuZXdTdGF0ZS5jb2x1bW5zcGFuKTtcbiAgICAgICAgICAgICAgICByZW5kZXJlci5zZXRCb3hFbGVtZW50SGVpZ2h0KGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LCBuZXdTdGF0ZS5yb3dzcGFuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vIHBvaW50IGluIGF0dGVtcHRpbmcgdXBkYXRlIGlmIG5vdCBzd2l0Y2hlZCB0byBuZXcgY2VsbC5cbiAgICAgICAgcHJldlN0YXRlLnJvdyA9IG5ld1N0YXRlLnJvdztcbiAgICAgICAgcHJldlN0YXRlLmNvbHVtbiA9IG5ld1N0YXRlLmNvbHVtbjtcbiAgICAgICAgcHJldlN0YXRlLnJvd3NwYW4gPSBuZXdTdGF0ZS5yb3dzcGFuO1xuICAgICAgICBwcmV2U3RhdGUuY29sdW1uc3BhbiA9IG5ld1N0YXRlLmNvbHVtbnNwYW47XG5cbiAgICAgICAgaWYgKGRhc2hncmlkLnJlc2l6YWJsZS5yZXNpemluZykge2Rhc2hncmlkLnJlc2l6YWJsZS5yZXNpemluZygpO30gLy8gdXNlciBjYi5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKi9cbiAgICBsZXQgdXBkYXRlUmVzaXppbmdFbGVtZW50ID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgbW91c2UgcG9zaXRpb24uXG4gICAgICAgIG1vdXNlWCA9IGUucGFnZVg7XG4gICAgICAgIG1vdXNlWSA9IGUucGFnZVk7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBkZWx0YXNcbiAgICAgICAgbGV0IGRpZmZYID0gbW91c2VYIC0gbGFzdE1vdXNlWCArIG1PZmZYO1xuICAgICAgICBsZXQgZGlmZlkgPSBtb3VzZVkgLSBsYXN0TW91c2VZICsgbU9mZlk7XG4gICAgICAgIG1PZmZYID0gbU9mZlkgPSAwO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBsYXN0IHByb2Nlc3NlZCBtb3VzZSBwb3NpdGlvbnMuXG4gICAgICAgIGxhc3RNb3VzZVggPSBtb3VzZVg7XG4gICAgICAgIGxhc3RNb3VzZVkgPSBtb3VzZVk7XG5cbiAgICAgICAgbGV0IGRZID0gZGlmZlk7XG4gICAgICAgIGxldCBkWCA9IGRpZmZYO1xuXG4gICAgICAgIG1pblRvcCA9IGRhc2hncmlkLnlNYXJnaW47XG4gICAgICAgIG1heFRvcCA9IGRhc2hncmlkLl9lbGVtZW50Lm9mZnNldEhlaWdodCAtIGRhc2hncmlkLnlNYXJnaW47XG4gICAgICAgIG1pbkxlZnQgPSBkYXNoZ3JpZC54TWFyZ2luO1xuICAgICAgICBtYXhMZWZ0ID0gZGFzaGdyaWQuX2VsZW1lbnQub2Zmc2V0V2lkdGggLSBkYXNoZ3JpZC54TWFyZ2luO1xuXG4gICAgICAgIGlmIChjbGFzc05hbWUuaW5kZXhPZignZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtdycpID4gLTEgfHxcbiAgICAgICAgICAgIGNsYXNzTmFtZS5pbmRleE9mKCdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1udycpID4gLTEgfHxcbiAgICAgICAgICAgIGNsYXNzTmFtZS5pbmRleE9mKCdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1zdycpID4gLTEpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50V2lkdGggLSBkWCA8IG1pbldpZHRoKSB7XG4gICAgICAgICAgICAgICAgZGlmZlggPSBlbGVtZW50V2lkdGggLSBtaW5XaWR0aDtcbiAgICAgICAgICAgICAgICBtT2ZmWCA9IGRYIC0gZGlmZlg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnRMZWZ0ICsgZFggPCBtaW5MZWZ0KSB7XG4gICAgICAgICAgICAgICAgZGlmZlggPSBtaW5MZWZ0IC0gZWxlbWVudExlZnQ7XG4gICAgICAgICAgICAgICAgbU9mZlggPSBkWCAtIGRpZmZYO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudExlZnQgKz0gZGlmZlg7XG4gICAgICAgICAgICBlbGVtZW50V2lkdGggLT0gZGlmZlg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xhc3NOYW1lLmluZGV4T2YoJ2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLWUnKSA+IC0xIHx8XG4gICAgICAgICAgICBjbGFzc05hbWUuaW5kZXhPZignZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtbmUnKSA+IC0xIHx8XG4gICAgICAgICAgICBjbGFzc05hbWUuaW5kZXhPZignZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtc2UnKSA+IC0xKSB7XG5cbiAgICAgICAgICAgIGlmIChlbGVtZW50V2lkdGggKyBkWCA8IG1pbldpZHRoKSB7XG4gICAgICAgICAgICAgICAgZGlmZlggPSBtaW5XaWR0aCAtIGVsZW1lbnRXaWR0aDtcbiAgICAgICAgICAgICAgICBtT2ZmWCA9IGRYIC0gZGlmZlg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnRMZWZ0ICsgZWxlbWVudFdpZHRoICsgZFggPiBtYXhMZWZ0KSB7XG4gICAgICAgICAgICAgICAgZGlmZlggPSBtYXhMZWZ0IC0gZWxlbWVudExlZnQgLSBlbGVtZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgbU9mZlggPSBkWCAtIGRpZmZYO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudFdpZHRoICs9IGRpZmZYO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsYXNzTmFtZS5pbmRleE9mKCdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1uJykgPiAtMSB8fFxuICAgICAgICAgICAgY2xhc3NOYW1lLmluZGV4T2YoJ2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLW53JykgPiAtMSB8fFxuICAgICAgICAgICAgY2xhc3NOYW1lLmluZGV4T2YoJ2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLW5lJykgPiAtMSkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnRIZWlnaHQgLSBkWSA8IG1pbkhlaWdodCkge1xuICAgICAgICAgICAgICAgIGRpZmZZID0gZWxlbWVudEhlaWdodCAtIG1pbkhlaWdodDtcbiAgICAgICAgICAgICAgICBtT2ZmWSA9IGRZIC0gZGlmZlk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnRUb3AgKyBkWSA8IG1pblRvcCkge1xuICAgICAgICAgICAgICAgIGRpZmZZID0gbWluVG9wIC0gZWxlbWVudFRvcDtcbiAgICAgICAgICAgICAgICBtT2ZmWSA9IGRZIC0gZGlmZlk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50VG9wICs9IGRpZmZZO1xuICAgICAgICAgICAgZWxlbWVudEhlaWdodCAtPSBkaWZmWTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGFzc05hbWUuaW5kZXhPZignZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtcycpID4gLTEgfHxcbiAgICAgICAgICAgIGNsYXNzTmFtZS5pbmRleE9mKCdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1zdycpID4gLTEgfHxcbiAgICAgICAgICAgIGNsYXNzTmFtZS5pbmRleE9mKCdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1zZScpID4gLTEpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50SGVpZ2h0ICsgZFkgPCBtaW5IZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBkaWZmWSA9IG1pbkhlaWdodCAtIGVsZW1lbnRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgbU9mZlkgPSBkWSAtIGRpZmZZO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50VG9wICsgZWxlbWVudEhlaWdodCArIGRZID4gbWF4VG9wKSB7XG4gICAgICAgICAgICAgICAgZGlmZlkgPSBtYXhUb3AgLSBlbGVtZW50VG9wIC0gZWxlbWVudEhlaWdodDtcbiAgICAgICAgICAgICAgICBtT2ZmWSA9IGRZIC0gZGlmZlk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50SGVpZ2h0ICs9IGRpZmZZO1xuICAgICAgICB9XG5cbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLnRvcCA9IGVsZW1lbnRUb3AgKyAncHgnO1xuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUubGVmdCA9IGVsZW1lbnRMZWZ0ICsgJ3B4JztcbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLndpZHRoID0gZWxlbWVudFdpZHRoICsgJ3B4JztcbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLmhlaWdodCA9IGVsZW1lbnRIZWlnaHQgKyAncHgnO1xuXG4gICAgICAgIC8vIFNjcm9sbGluZyB3aGVuIGNsb3NlIHRvIGJvdHRvbSBib3VuZGFyeS5cbiAgICAgICAgaWYgKGUucGFnZVkgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA8IGRhc2hncmlkLnNjcm9sbFNlbnNpdGl2aXR5KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIC0gZGFzaGdyaWQuc2Nyb2xsU3BlZWQ7XG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93LmlubmVySGVpZ2h0IC0gKGUucGFnZVkgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgPCBkYXNoZ3JpZC5zY3JvbGxTZW5zaXRpdml0eSkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCArIGRhc2hncmlkLnNjcm9sbFNwZWVkO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2Nyb2xsaW5nIHdoZW4gY2xvc2UgdG8gcmlnaHQgYm91bmRhcnkuXG4gICAgICAgIGlmIChlLnBhZ2VYIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0IDwgZGFzaGdyaWQuc2Nyb2xsU2Vuc2l0aXZpdHkpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCAtIGRhc2hncmlkLnNjcm9sbFNwZWVkO1xuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5pbm5lcldpZHRoIC0gKGUucGFnZVggLSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQpIDwgZGFzaGdyaWQuc2Nyb2xsU2Vuc2l0aXZpdHkpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCArIGRhc2hncmlkLnNjcm9sbFNwZWVkO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBPYmplY3QuZnJlZXplKHtcbiAgICAgICAgcmVzaXplU3RhcnQsXG4gICAgICAgIHJlc2l6ZSxcbiAgICAgICAgcmVzaXplRW5kXG4gICAgfSk7XG59XG4iLCIvLyBzaGltIGxheWVyIHdpdGggc2V0VGltZW91dCBmYWxsYmFjayBmb3IgcmVxdWllc3RBbmltYXRpb25GcmFtZVxud2luZG93LnJlcXVlc3RBbmltRnJhbWUgPSAoZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIGZ1bmN0aW9uIChjYil7XG4gICAgICAgICAgICBjYiA9IGNiIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoY2IsIDEwMDAgLyA2MCk7XG4gICAgICAgIH07XG59KSgpO1xuIiwiXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYm94XG4gKiBAcGFyYW0ge3N0cmluZ30gYXQxXG4gKiBAcGFyYW0ge3N0cmluZ30gYXQyXG4gKiBAcmV0dXJucyB7TnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF4TnVtKGJveCwgYXQxLCBhdDIpIHtcbiAgICBsZXQgbWF4VmFsID0gMDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYm94Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChib3hbaV1bYXQxXSArIGJveFtpXVthdDJdID49IG1heFZhbCkge1xuICAgICAgICAgICAgbWF4VmFsID0gYm94W2ldW2F0MV0gKyBib3hbaV1bYXQyXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtYXhWYWw7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcmRlclxuICogQHBhcmFtIHtzdHJpbmd9IGF0dHJcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IG9ianNcbiAqIEByZXR1cm5zIHtBcnJheS48T2JqZWN0Pn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNvcnRlZEFycihvcmRlciwgYXR0ciwgb2Jqcykge1xuICAgIGxldCBrZXk7XG4gICAgbGV0IGFyciA9IFtdO1xuXG4gICAgT2JqZWN0LmtleXMob2JqcykuZm9yRWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICBpbnNlcnRCeU9yZGVyKG9yZGVyLCBhdHRyLCBvYmpzW2ldLCBhcnIpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFycjtcbn1cblxuLyoqXG4gKiBTb3J0IGFycmF5IHdpdGggbmV3bHkgaW5zZXJ0ZWQgb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IGJveFxuICogQHBhcmFtIHtzdHJpbmd9IGF0MVxuICogQHBhcmFtIHtPYmplY3R9IGF0MlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0QnlPcmRlcihvcmRlciwgYXR0ciwgbywgYXJyKSB7XG4gICAgbGV0IGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICAgIGFyci5wdXNoKG8pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEluc2VydCBieSBvcmRlciwgc3RhcnQgZnVydGhlc3QgZG93bi5cbiAgICAgICAgLy8gSW5zZXJ0IGJldHdlZW4gMCBhbmQgbiAtMS5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKG9yZGVyID09PSAnZGVzYycpIHtcbiAgICAgICAgICAgICAgICBpZiAoby5yb3cgPiBhcnJbaV0ucm93KSB7XG4gICAgICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMCwgbyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG8ucm93IDwgYXJyW2ldLnJvdykge1xuICAgICAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksIDAsIG8pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBub3QgaW5iZXR3ZWVuIDAgYW5kIG4gLSAxLCBpbnNlcnQgbGFzdC5cbiAgICAgICAgaWYgKGxlbiA9PT0gYXJyLmxlbmd0aCkge2Fyci5wdXNoKG8pO31cbiAgICB9XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGFcbiAqIEBwYXJhbSB7c3RyaW5nfSBhXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRpb25Tb3J0KGEsIGF0dHIpIHtcbiAgICBpZiAoYS5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaSA9IGEubGVuZ3RoO1xuICAgIHZhciB0ZW1wO1xuICAgIHZhciBqO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgaiA9IGk7XG4gICAgICAgIHdoaWxlIChqID4gMCAmJiBhW2ogLSAxXVthdHRyXSA8IGFbal1bYXR0cl0pIHtcbiAgICAgICAgICAgIHRlbXAgPSBhW2pdO1xuICAgICAgICAgICAgYVtqXSA9IGFbaiAtIDFdO1xuICAgICAgICAgICAgYVtqIC0gMV0gPSB0ZW1wO1xuICAgICAgICAgICAgaiAtPSAxO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBOdW1iZXIgb2YgcHJvcGVydGllcyBpbiBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBPYmplY3RMZW5ndGgob2JqKSB7XG4gICAgbGV0IGxlbmd0aCA9IDAsXG4gICAgICAgIGtleTtcbiAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBsZW5ndGggKz0gMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGVuZ3RoO1xufVxuXG4vKipcbiAqIEFkZCBldmVudCwgYW5kIG5vdCBvdmVyd3JpdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudFxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV2ZW50SGFuZGxlXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRXZlbnQoZWxlbWVudCwgdHlwZSwgZXZlbnRIYW5kbGUpIHtcbiAgICBpZiAoZWxlbWVudCA9PT0gbnVsbCB8fCB0eXBlb2YoZWxlbWVudCkgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG4gICAgaWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoIHR5cGUsIGV2ZW50SGFuZGxlLCBmYWxzZSApO1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRhY2hFdmVudCkge1xuICAgICAgICBlbGVtZW50LmF0dGFjaEV2ZW50KCAnb24nICsgdHlwZSwgZXZlbnRIYW5kbGUgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50WydvbicgKyB0eXBlXSA9IGV2ZW50SGFuZGxlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgbm9kZXMgZnJvbSBlbGVtZW50LlxuICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZU5vZGVzKGVsZW1lbnQpIHtcbiAgICB3aGlsZSAoZWxlbWVudC5maXJzdENoaWxkKSB7ZWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50LmZpcnN0Q2hpbGQpO31cbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG5vZGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAqIEByZXR1cm5zIHtPYmplY3R8Qm9vbGVhbn0gRE9NIGVsZW1lbnQgb2JqZWN0IG9yIGZhbHNlIGlmIG5vdCBmb3VuZC4gXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kUGFyZW50KG5vZGUsIGNsYXNzTmFtZSkge1xuICAgIHdoaWxlIChub2RlLm5vZGVUeXBlID09PSAxICYmIG5vZGUgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgaWYgKG5vZGUuY2xhc3NOYW1lLnNlYXJjaChjbGFzc05hbWUpID4gLTEpIHtyZXR1cm4gbm9kZTt9XG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbiJdfQ==
