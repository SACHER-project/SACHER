/*
SpiderGL Computer Graphics Library
Copyright (c) 2010, Marco Di Benedetto - Visual Computing Lab, ISTI - CNR
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of SpiderGL nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL PAUL BRUNT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var SpiderGL = {};
SpiderGL.TAG = 0, SpiderGL.openNamespace = function (a) {
    function c(a) {
        return b.test(a)
    }

    function e(a) {
        return d.test(a) && !c(a)
    }

    function g(a) {
        return f.test(a)
    }

    function h(a) {
        return a.substr(0, 1).toUpperCase() + a.substr(1)
    }

    function l(a) {
        if (a) for (var b in a) if ("_" != b.substr(0, 1)) {
            var d = a[b];
            e(b) ? i[b] = d : g(b) ? j[b] = d : c(b) && (k[b] = d)
        }
    }

    a = SpiderGL.Utility.getDefaultObject({
        globalObject: SpiderGL.openNamespace.DEFAULT_GLOBAL_OBJECT,
        constantPrefix: SpiderGL.openNamespace.DEFAULT_CONSTANT_PREFIX,
        functionPrefix: SpiderGL.openNamespace.DEFAULT_FUNCTION_PREFIX,
        classPrefix: SpiderGL.openNamespace.DEFAULT_CLASS_PREFIX
    }, a);
    var b = new RegExp("^(([_$0-9A-Z])+)$"), d = new RegExp("^([A-Z])"), f = new RegExp("^(([a-z])+([_$0-9A-Za-z])*)$"),
        i = {}, j = {}, k = {},
        m = ["Core", "DOM", "IO", "Math", "Mesh", "Model", "Semantic", "Space", "Type", "UserInterface", "Utility", "Version", "WebGL"];
    for (var n in m) l(SpiderGL[m[n]]);
    for (var n in i) {
        var o = a.classPrefix + h(n);
        a.globalObject[o] = i[n]
    }
    for (var n in j) {
        var o = a.functionPrefix + h(n);
        a.globalObject[o] = j[n]
    }
    for (var n in k) {
        var o = a.constantPrefix + h(n);
        a.globalObject[o] = k[n]
    }
}, SpiderGL.openNamespace.DEFAULT_GLOBAL_OBJECT = window, SpiderGL.openNamespace.DEFAULT_CONSTANT_PREFIX = "SGL_", SpiderGL.openNamespace.DEFAULT_FUNCTION_PREFIX = "sgl", SpiderGL.openNamespace.DEFAULT_CLASS_PREFIX = "Sgl", SpiderGL.Version = {}, SpiderGL.Version.VERSION_MAJOR = 0, SpiderGL.Version.VERSION_MINOR = 2, SpiderGL.Version.VERSION_REVISION = 1, SpiderGL.Version.VERSION_STRING = SpiderGL.Version.VERSION_MAJOR + "." + SpiderGL.Version.VERSION_MINOR + "." + SpiderGL.Version.VERSION_REVISION, SpiderGL.Core = {}, SpiderGL.Core.DEFAULT = {}, SpiderGL.Core.DONT_CARE = {}, SpiderGL.Core.EMPTY_STRING = "", SpiderGL.Core.EMPTY_OBJECT = {}, SpiderGL.Core.EMPTY_ARRAY = [], SpiderGL.Core.EMPTY_FUNCTION = function () {
}, SpiderGL.Core.generateUID = function () {
    return SpiderGL.Core.generateUID._lastUID++, SpiderGL.Core.generateUID._lastUID
}, SpiderGL.Core.generateUID._lastUID = 0, SpiderGL.Core.ObjectBase = function () {
    this._uid = SpiderGL.Core.generateUID()
}, SpiderGL.Core.ObjectBase.prototype = {
    get uid() {
        return this._uid
    }
}, SpiderGL.Type = {}, SpiderGL.Type.LITTLE_ENDIAN = function () {
    var a = new Uint8Array([18, 52]), b = new Uint16Array(a.buffer);
    return 13330 == b[0]
}(), SpiderGL.Type.BIG_ENDIAN = !SpiderGL.Type.BIG_ENDIAN, SpiderGL.Type.NO_TYPE = 0, SpiderGL.Type.INT8 = 1, SpiderGL.Type.UINT8 = 2, SpiderGL.Type.INT16 = 3, SpiderGL.Type.UINT16 = 4, SpiderGL.Type.INT32 = 5, SpiderGL.Type.UINT32 = 6, SpiderGL.Type.FLOAT32 = 7, SpiderGL.Type.SIZEOF_INT8 = Int8Array.BYTES_PER_ELEMENT, SpiderGL.Type.SIZEOF_UINT8 = Uint8Array.BYTES_PER_ELEMENT, SpiderGL.Type.SIZEOF_INT16 = Int16Array.BYTES_PER_ELEMENT, SpiderGL.Type.SIZEOF_UINT16 = Uint16Array.BYTES_PER_ELEMENT, SpiderGL.Type.SIZEOF_INT32 = Int32Array.BYTES_PER_ELEMENT, SpiderGL.Type.SIZEOF_UINT32 = Uint32Array.BYTES_PER_ELEMENT, SpiderGL.Type.SIZEOF_FLOAT32 = Float32Array.BYTES_PER_ELEMENT, SpiderGL.Type.typeSize = function () {
    var a = {};
    return a[SpiderGL.Type.NO_TYPE] = 0, a[SpiderGL.Type.INT8] = SpiderGL.Type.SIZEOF_INT8, a[SpiderGL.Type.UINT8] = SpiderGL.Type.SIZEOF_UINT8, a[SpiderGL.Type.INT16] = SpiderGL.Type.SIZEOF_INT16, a[SpiderGL.Type.UINT16] = SpiderGL.Type.SIZEOF_UINT16, a[SpiderGL.Type.INT32] = SpiderGL.Type.SIZEOF_INT32, a[SpiderGL.Type.UINT32] = SpiderGL.Type.SIZEOF_UINT32, a[SpiderGL.Type.FLOAT32] = SpiderGL.Type.SIZEOF_FLOAT32, function (b) {
        return a[b]
    }
}(), SpiderGL.Type.typeToGL = function () {
    var a = {};
    return a[SpiderGL.Type.NO_TYPE] = WebGLRenderingContext.prototype.NONE, a[SpiderGL.Type.INT8] = WebGLRenderingContext.prototype.BYTE, a[SpiderGL.Type.UINT8] = WebGLRenderingContext.prototype.UNSIGNED_BYTE, a[SpiderGL.Type.INT16] = WebGLRenderingContext.prototype.SHORT, a[SpiderGL.Type.UINT16] = WebGLRenderingContext.prototype.UNSIGNED_SHORT, a[SpiderGL.Type.INT32] = WebGLRenderingContext.prototype.INT, a[SpiderGL.Type.UINT32] = WebGLRenderingContext.prototype.UNSIGNED_INT, a[SpiderGL.Type.FLOAT32] = WebGLRenderingContext.prototype.FLOAT, function (b) {
        return a[b]
    }
}(), SpiderGL.Type.typeFromGL = function () {
    var a = {};
    return a[WebGLRenderingContext.prototype.NONE] = SpiderGL.Type.NO_TYPE, a[WebGLRenderingContext.prototype.BYTE] = SpiderGL.Type.INT8, a[WebGLRenderingContext.prototype.UNSIGNED_BYTE] = SpiderGL.Type.UINT8, a[WebGLRenderingContext.prototype.SHORT] = SpiderGL.Type.INT16, a[WebGLRenderingContext.prototype.UNSIGNED_SHORT] = SpiderGL.Type.UINT16, a[WebGLRenderingContext.prototype.INT] = SpiderGL.Type.INT32, a[WebGLRenderingContext.prototype.UNSIGNED_INT] = SpiderGL.Type.UINT32, a[WebGLRenderingContext.prototype.FLOAT] = SpiderGL.Type.FLOAT32, function (b) {
        return a[b]
    }
}(), SpiderGL.Type.typeSizeFromGL = function (a) {
    var b = SpiderGL.Type.typeFromGL(a);
    return SpiderGL.Type.typeSize(b)
}, SpiderGL.Type.typeToTypedArrayConstructor = function () {
    var a = {};
    return a[SpiderGL.Type.NO_TYPE] = ArrayBuffer, a[SpiderGL.Type.INT8] = Int8Array, a[SpiderGL.Type.UINT8] = Uint8Array, a[SpiderGL.Type.INT16] = Int16Array, a[SpiderGL.Type.UINT16] = Uint16Array, a[SpiderGL.Type.INT32] = Int32Array, a[SpiderGL.Type.UINT32] = Uint32Array, a[SpiderGL.Type.FLOAT32] = Float32Array, function (b) {
        return a[b]
    }
}(), SpiderGL.Type.POINTS = 0, SpiderGL.Type.LINES = 1, SpiderGL.Type.LINE_LOOP = 2, SpiderGL.Type.LINE_STRIP = 3, SpiderGL.Type.TRIANGLES = 4, SpiderGL.Type.TRIANGLE_FAN = 5, SpiderGL.Type.TRIANGLE_STRIP = 6, SpiderGL.Type.primitiveToGL = function () {
    var a = {};
    return a[SpiderGL.Type.POINTS] = WebGLRenderingContext.prototype.POINTS, a[SpiderGL.Type.LINES] = WebGLRenderingContext.prototype.LINES, a[SpiderGL.Type.LINE_LOOP] = WebGLRenderingContext.prototype.LINE_LOOP, a[SpiderGL.Type.LINE_STRIP] = WebGLRenderingContext.prototype.LINE_STRIP, a[SpiderGL.Type.TRIANGLES] = WebGLRenderingContext.prototype.TRIANGLES, a[SpiderGL.Type.TRIANGLE_FAN] = WebGLRenderingContext.prototype.TRIANGLE_FAN, a[SpiderGL.Type.TRIANGLE_STRIP] = WebGLRenderingContext.prototype.TRIANGLE_STRIP, function (b) {
        return a[b]
    }
}(), SpiderGL.Type.instanceOf = function (a, b) {
    return a instanceof b
}, SpiderGL.Type.isNumber = function (a) {
    return "number" == typeof a
}, SpiderGL.Type.isString = function (a) {
    return "string" == typeof a
}, SpiderGL.Type.isFunction = function (a) {
    return "function" == typeof a
}, SpiderGL.Type.isArray = function (a) {
    return a && a.constructor === Array
}, SpiderGL.Type.isTypedArray = function (a) {
    return a && "undefined" != typeof a.buffer && a.buffer instanceof ArrayBuffer
}, SpiderGL.Type.extend = function (a, b) {
    function c() {
    }

    c.prototype = b.prototype;
    var d = a.prototype, e = new c;
    e.constructor = a;
    var f = null, g = null;
    for (var h in d) f = d.__lookupGetter__(h), f && e.__defineGetter__(h, f), g = d.__lookupSetter__(h), g && e.__defineSetter__(h, g), f || g || (e[h] = d[h]);
    a.prototype = e
}, SpiderGL.Type.defineClassGetter = function (a, b, c) {
    a.prototype.__defineGetter__(b, c)
}, SpiderGL.Type.defineClassSetter = function (a, b, c) {
    a.prototype.__defineSetter__(b, c)
}, SpiderGL.Type.defineObjectGetter = function (a, b, c) {
    a.__defineGetter__(b, c)
}, SpiderGL.Type.defineObjectSetter = function (a, b, c) {
    a.__defineSetter__(b, c)
}, SpiderGL.Utility = {}, SpiderGL.Utility.getDefaultValue = function (a, b) {
    return void 0 === a || a === SpiderGL.Core.DEFAULT ? b : a
}, SpiderGL.Utility.getDefaultObject = function (a, b) {
    if (b) {
        var c = SpiderGL.Core.DEFAULT;
        for (var d in b) b[d] != c && (a[d] = b[d])
    }
    return a
}, SpiderGL.Utility.setDefaultValues = function (a, b) {
    if (!b) return a;
    var c = SpiderGL.Core.DEFAULT;
    for (var d in b) b[d] == c && "undefined" != typeof a[d] && (b[d] = a[d]);
    for (var d in a) "undefined" == typeof b[d] && (b[d] = a[d]);
    return b
}, SpiderGL.Utility.getAttrib4fv = function (a) {
    return SpiderGL.Type.isNumber(a) ? [a, 0, 0, 1] : a ? [void 0 != a[0] ? a[0] : 0, void 0 != a[1] ? a[1] : 0, void 0 != a[2] ? a[2] : 0, void 0 != a[3] ? a[3] : 1] : [0, 0, 0, 1]
}, SpiderGL.Utility.getTime = function () {
    return (new Date).getTime()
}, SpiderGL.Utility.Timer = function () {
    this._tStart = -1, this._tElapsed = 0
}, SpiderGL.Utility.Timer.prototype = {
    _accumElapsed: function () {
        this._tElapsed += this.now - this._tStart
    }, get now() {
        return Date.now()
    }, start: function () {
        this.isStarted || this.isPaused || (this._tStart = this.now, this._tElapsed = 0)
    }, restart: function () {
        var a = this.elapsed;
        return this._tStart = this.now, this._tElapsed = 0, a
    }, stop: function () {
        this.isStarted && (this.isPaused || (this._accumElapsed(), this._tStart = -1))
    }, get isStarted() {
        return this._tStart >= 0
    }, pause: function () {
        this.isStarted && (this.isPaused || (this._accumElapsed(), this._tStart = -2))
    }, resume: function () {
        this.isStarted && this.isPaused && (this._tStart = this.now)
    }, get isPaused() {
        return this._tStart == -2
    }, get elapsed() {
        return this.isStarted ? this._tElapsed + (this.now - this._tStart) : this._tElapsed
    }
}, SpiderGL.DOM = {}, SpiderGL.DOM.getElementById = function (a) {
    return document.getElementById(a)
}, SpiderGL.DOM.getElementText = function (a) {
    var b = document.getElementById(a);
    if (!b) return null;
    var c = "";
    for (b = b.firstChild; b;) 3 == b.nodeType && (c += b.textContent), b = b.nextSibling;
    return c
}, SpiderGL.IO = {}, SpiderGL.IO.Request = function (a, b) {
    SpiderGL.Core.ObjectBase.call(this), b = SpiderGL.Utility.getDefaultObject({
        async: SpiderGL.IO.Request.DEFAULT_ASYNC,
        send: SpiderGL.IO.Request.DEFAULT_SEND,
        onProgress: null,
        onCancel: null,
        onError: null,
        onSuccess: null,
        onFinish: null
    }, b), this._url = a, this._async = b.async, this._status = SpiderGL.IO.Request.NONE, this._sent = !1, this._aborted = !1, this._data = null, this._loaded = 0, this._total = 0, this._events = {
        progress: {
            main: null,
            listeners: []
        },
        cancel: {main: null, listeners: []},
        error: {main: null, listeners: []},
        success: {main: null, listeners: []},
        finish: {main: null, listeners: []}
    }, this.onProgress = b.onProgress, this.onCancel = b.onCancel, this.onError = b.onError, this.onSuccess = b.onSuccess, this.onFinish = b.onFinish
}, SpiderGL.IO.Request.NONE = 0, SpiderGL.IO.Request.ONGOING = 1, SpiderGL.IO.Request.CANCELLED = 2, SpiderGL.IO.Request.FAILED = 3, SpiderGL.IO.Request.SUCCEEDED = 4, SpiderGL.IO.Request.DEFAULT_ASYNC = !0, SpiderGL.IO.Request.DEFAULT_SEND = !0, SpiderGL.IO.Request.prototype = {
    _indexOf: function (a, b) {
        for (var c = 0, d = a.length; c < d; ++c) if (a[c] == b) return c;
        return -1
    }, _setMainListener: function (a, b) {
        var c = this._events[a];
        c && c.main != b && (b ? this.addEventListener(a, b) : this.removeEventListener(a, b), c.main = b)
    }, _dispatch: function () {
        var a = arguments[0], b = this._events[a];
        if (b) {
            var c = Array.prototype.slice.call(arguments, 1);
            c.push(this);
            for (var d = b.listeners, e = 0, f = d.length; e < f; ++e) d[e].apply(null, c)
        }
    }, _doPostProgress: function () {
    }, _doPostCancel: function () {
    }, _doPostError: function () {
    }, _doPostSuccess: function () {
    }, _doPostFinish: function () {
    }, _doOnProgress: function (a, b) {
        this._aborted || (this._loaded = a, this._total = b, this._doPostProgress(), this._dispatch("progress", this._loaded, this._total))
    }, _doOnCancel: function () {
        this._aborted || (this._status = SpiderGL.IO.Request.CANCELLED, this._finishTime = SpiderGL.Utility.getTime(), this._doPostCancel(), this._dispatch("cancel"))
    }, _doOnError: function () {
        this._aborted || (this._status = SpiderGL.IO.Request.FAILED, this._finishTime = SpiderGL.Utility.getTime(), this._doPostError(), this._dispatch("error"))
    }, _doOnSuccess: function () {
        this._aborted || (this._status = SpiderGL.IO.Request.SUCCEEDED, this._finishTime = SpiderGL.Utility.getTime(), this._doPostSuccess(), this._dispatch("success"))
    }, _doOnFinish: function () {
        this._doPostFinish(), this._dispatch("finish")
    }, _doSend: function () {
        return !1
    }, _doCancel: function () {
        return !1
    }, get canSend() {
        return this._url && !this._sent
    }, get url() {
        return this._url
    }, set url(a) {
        this.cancel(), this._url = a
    }, get status() {
        return this._status
    }, get data() {
        return this._data
    }, get bytesLoaded() {
        return this._loaded
    }, get bytesTotal() {
        return this._total
    }, get sent() {
        return this._sent
    }, get ongoing() {
        return this._status == SpiderGL.IO.Request.ONGOING
    }, get cancelled() {
        return this._status == SpiderGL.IO.Request.CANCELLED
    }, get failed() {
        return this._status == SpiderGL.IO.Request.FAILED
    }, get succeeded() {
        return this._status == SpiderGL.IO.Request.SUCCEEDED
    }, get finished() {
        return this.succeeded || this.failed || this.cancelled
    }, get startTime() {
        return this._startTime
    }, get finishTime() {
        return this._finishTime
    }, get elapsedTime() {
        return this._startTime < 0 ? 0 : this._finishTime < 0 ? SpiderGL.Utility.getTime() - this._startTime : this._finishTime - this._startTime
    }, addEventListener: function (a, b) {
        if (b) {
            var c = this._events[a];
            if (c) {
                var d = this._indexOf(c.listeners, b);
                d >= 0 || c.listeners.push(b)
            }
        }
    }, removeEventListener: function (a, b) {
        var c = this._events[a];
        if (c) {
            var d = this._indexOf(c.listeners, b);
            d < 0 || c.listeners.splice(d, 1)
        }
    }, get onProgress() {
        return this._events.progress.main
    }, set onProgress(a) {
        this._setMainListener("progress", a)
    }, get onCancel() {
        return this._events.cancel.main
    }, set onCancel(a) {
        this._setMainListener("cancel", a)
    }, get onError() {
        return this._events.error.main
    }, set onError(a) {
        this._setMainListener("error", a)
    }, get onSuccess() {
        return this._events.success.main
    }, set onSuccess(a) {
        this._setMainListener("success", a)
    }, get onFinish() {
        return this._events.finish.main
    }, set onFinish(a) {
        this._setMainListener("finish", a)
    }, cancel: function () {
        if (!this.ongoing) return !1;
        this._status = SpiderGL.IO.Request.CANCELLED, this._aborted = !0;
        var a = this._doCancel();
        return this._finishTime = SpiderGL.Utility.getTime(), a
    }, send: function () {
        if (!this.canSend) return !1;
        this._data = null, this._status = SpiderGL.IO.Request.ONGOING, this._aborted = !1, this._sent = !0, this._finishTime = -1, this._startTime = SpiderGL.Utility.getTime();
        var a = this._doSend();
        return a || (this._startTime = -1, this._status = SpiderGL.IO.Request.NONE, this._sent = !1), a
    }
}, SpiderGL.Type.extend(SpiderGL.IO.Request, SpiderGL.Core.ObjectBase), SpiderGL.IO.XHRRequestBase = function (a, b) {
    b = b || {}, SpiderGL.IO.Request.call(this, a, b);
    var c = this, d = new XMLHttpRequest;
    if (this._xhr = d, d.onprogress = function (a) {
            c._xhrOnProgress(a)
        }, d.onabort = function () {
            c._doOnCancel(), c._doOnFinish()
        }, d.onerror = function () {
            c._doOnError(), c._doOnFinish()
        }, d.onload = function () {
            var a = d.status;
            0 === a || 200 === a || c._range && 206 == a ? c._doOnSuccess() : c._doOnError(), c._doOnFinish()
        }, this._range = null, this._xhr.open("GET", this._url, this._async), "range" in b) {
        this._range = [b.range[0], b.range[1]];
        var e = "bytes=" + b.range[0] + "-" + b.range[1];
        d.setRequestHeader("Range", e)
    }
    this._prepareXHR();
    var f = SpiderGL.Utility.getDefaultValue(b.send, SpiderGL.IO.Request.DEFAULT_SEND);
    f && this.send()
}, SpiderGL.IO.XHRRequestBase.prototype = {
    _prepareXHR: function () {
    }, _doCancel: function () {
        return this._xhr.abort(), this._xhr = new XMLHttpRequest, this._xhr.open("GET", this._url, this._async), this._prepareXHR(), !0
    }, _doSend: function () {
        return this._xhr.send(), !0
    }, _xhrOnProgress: function (a) {
        var b = 0, c = 0;
        a && a.lengthComputable && (b = a.loaded, c = a.total), this._doOnProgress(b, c)
    }
}, SpiderGL.Type.extend(SpiderGL.IO.XHRRequestBase, SpiderGL.IO.Request), SpiderGL.IO.XHRRequest = function (a, b) {
    SpiderGL.IO.XHRRequestBase.call(this, a, b)
}, SpiderGL.IO.XHRRequest.prototype = {
    _doPostSuccess: function () {
        this._data = this._xhr.responseText
    }, get xhr() {
        return this._xhr
    }, get response() {
        return this.data
    }
}, SpiderGL.Type.extend(SpiderGL.IO.XHRRequest, SpiderGL.IO.XHRRequestBase), SpiderGL.IO.TextRequest = function (a, b) {
    SpiderGL.IO.XHRRequestBase.call(this, a, b)
}, SpiderGL.IO.TextRequest.prototype = {
    _doPostSuccess: function () {
        this._data = this._xhr.responseText
    }, get text() {
        return this.data
    }
}, SpiderGL.Type.extend(SpiderGL.IO.TextRequest, SpiderGL.IO.XHRRequestBase), SpiderGL.IO.readText = function (a) {
    var b = new SpiderGL.IO.TextRequest(a, {async: !1});
    return b.text
}, SpiderGL.IO.requestText = function (a, b) {
    b = SpiderGL.Utility.getDefaultObject({}, b), b.async = !0, b.send = !0;
    var c = new SpiderGL.IO.TextRequest(a, b);
    return c
}, SpiderGL.IO.JSONRequest = function (a, b) {
    SpiderGL.IO.XHRRequestBase.call(this, a, b)
}, SpiderGL.IO.JSONRequest.prototype = {
    _doPostSuccess: function () {
        this._data = JSON.parse(this._xhr.responseText)
    }, get text() {
        return this._xhr.responseText
    }, get json() {
        return this.data
    }
}, SpiderGL.Type.extend(SpiderGL.IO.JSONRequest, SpiderGL.IO.XHRRequestBase), SpiderGL.IO.readJSON = function (a) {
    var b = new SpiderGL.IO.JSONRequest(a, {async: !1});
    return b.json
},SpiderGL.IO.requestJSON = function (a, b) {
    b = SpiderGL.Utility.getDefaultObject({}, b), b.async = !0, b.send = !0;
    var c = new SpiderGL.IO.JSONRequest(a, b);
    return c
},SpiderGL.IO.BinaryRequest = function (a, b) {
    SpiderGL.IO.XHRRequestBase.call(this, a, b)
},SpiderGL.IO.BinaryRequest.prototype = {
    _prepareXHR: function () {
        var a = this._xhr, b = !1;
        b && a.overrideMimeType("text/plain; charset=x-user-defined"), a.responseType = "arraybuffer"
    }, _setArrayBuffer: function () {
        var a = this._xhr;
        if ("arraybuffer" == a.responseType) this._data = a.response; else if (null != a.mozResponseArrayBuffer) this._data = a.mozResponseArrayBuffer; else if (null != a.responseText) {
            for (var b = new String(a.responseText), c = new Array(b.length), d = 0, e = b.length; d < e; ++d) c[d] = 255 & b.charCodeAt(d);
            this._data = new Uint8Array(c).buffer
        } else this._data = null
    }, _doPostSuccess: function () {
        this._setArrayBuffer()
    }, get data() {
        return this.ongoing && this._setArrayBuffer(), this._data
    }, get buffer() {
        return this.data
    }
},SpiderGL.Type.extend(SpiderGL.IO.BinaryRequest, SpiderGL.IO.XHRRequestBase),SpiderGL.IO.readBinary = function (a) {
    var b = new SpiderGL.IO.BinaryRequest(a, {async: !1});
    return b.buffer
},SpiderGL.IO.requestBinary = function (a, b) {
    b = SpiderGL.Utility.getDefaultObject({}, b), b.async = !0, b.send = !0;
    var c = new SpiderGL.IO.BinaryRequest(a, b);
    return c
},SpiderGL.IO.ImageRequest = function (a, b) {
    b = b || {}, SpiderGL.IO.Request.call(this, a, b);
    var c = this, d = new Image;
    this._img = d, this._data = d, d.onabort = function () {
        c._doOnCancel(), c._doOnFinish()
    }, d.onerror = function () {
        c._doOnError(), c._doOnFinish()
    }, d.onload = function () {
        c._doOnSuccess(), c._doOnFinish()
    }, "undefined" != typeof d.onprogress && (d.onprogress = function (a) {
        c._imgOnProgress(a)
    });
    var e = SpiderGL.Utility.getDefaultValue(b.send, SpiderGL.IO.Request.DEFAULT_SEND);
    e && this.send()
},SpiderGL.IO.ImageRequest.prototype = {
    _doPostSuccess: function () {
        this._data = this._img
    }, _doCancel: function () {
        return this._img.src = null, this._img = new Image, !0
    }, _doSend: function () {
        return this._img.src = this._url, !0
    }, _imgOnProgress: function (a) {
        var b = 0, c = 0;
        a && a.lengthComputable && (b = a.loaded, c = a.total), this._doOnProgress(b, c)
    }, get image() {
        return this.data
    }
},SpiderGL.Type.extend(SpiderGL.IO.ImageRequest, SpiderGL.IO.Request),SpiderGL.IO.requestImage = function (a, b) {
    b = SpiderGL.Utility.getDefaultObject({}, b), b.async = !0, b.send = !0;
    var c = new SpiderGL.IO.ImageRequest(a, b);
    return c
},SpiderGL.IO.AggregateRequest = function (a) {
    a = a || {}, SpiderGL.IO.Request.call(this, "*", a);
    var b = this;
    this._proxyOnProgress = function (a, c, d) {
        b._reqOnProgress(a, c, d)
    }, this._proxyOnCancel = function (a) {
        b._reqOnCancel(a)
    }, this._proxyOnError = function (a) {
        b._reqOnError(a)
    }, this._proxyOnSuccess = function (a) {
        b._reqOnSuccess(a)
    }, this._proxyOnFinish = function (a) {
        b._reqOnFinish(a)
    }, this._aggrStartTime = -1, this._aggrFinishTime = -1, this._eventReq = null, this._cancelledReqs = 0, this._failedReqs = 0, this._succeededReqs = 0, this._requests = [];
    var c = a.requests;
    if (c) for (var d = 0, e = c.length; d < e; ++d) {
        var f = c[d];
        f && !f.sent && (this._installProxies(f), this.addRequest(f))
    }
    var g = SpiderGL.Utility.getDefaultValue(a.send, SpiderGL.IO.Request.DEFAULT_SEND);
    g && this.send()
},SpiderGL.IO.AggregateRequest.prototype = {
    _doPostCancel: function () {
        this._requestsFinished || (this._status = SpiderGL.IO.Request.ONGOING)
    }, _doPostError: function () {
        this._requestsFinished || (this._status = SpiderGL.IO.Request.ONGOING)
    }, _doPostSuccess: function () {
        this._requestsFinished || (this._status = SpiderGL.IO.Request.ONGOING)
    }, _doCancel: function () {
        for (var a = this._requests, b = 0, c = a.length; b < c; ++b) a[b].cancel();
        this._aggrFinishTime = SpiderGL.Utility.getTime()
    }, _doSend: function () {
        this._aggrStartTime = SpiderGL.Utility.getTime();
        for (var a = this._requests, b = 0, c = a.length; b < c; ++b) a[b].send()
    }, get _requestsFinished() {
        return this._cancelledReqs + this._failedReqs + this._succeededReqs == this._requests.length
    }, _installProxies: function (a) {
        a.addEventListener("progress", this._proxyOnProgress), a.addEventListener("cancel", this._proxyOnCancel), a.addEventListener("error", this._proxyOnError), a.addEventListener("success", this._proxyOnSuccess), a.addEventListener("finish", this._proxyOnFinish)
    }, _uninstallProxies: function (a) {
        a.removeEventListener("progress", this._proxyOnProgress), a.removeEventListener("cancel", this._proxyOnCancel), a.removeEventListener("error", this._proxyOnError), a.removeEventListener("success", this._proxyOnSuccess), a.removeEventListener("finish", this._proxyOnFinish)
    }, _reqOnProgress: function (a, b, c) {
        var d = this._indexOf(this._requests, c);
        d < 0 || (this._eventReq = c, this._doOnProgress(a, b), this._eventReq = null)
    }, _reqOnCancel: function (a) {
        var b = this._indexOf(this._requests, a);
        b < 0 || (this._eventReq = a, this._cancelledReqs++, this._requestsFinished && (this._aggrFinishTime = SpiderGL.Utility.getTime(), this._cancelledReqs == this._requests.length && (this._eventReq = this, this._doOnCancel())), this._eventReq = null)
    }, _reqOnError: function (a) {
        var b = this._indexOf(this._requests, a);
        b < 0 || (this._eventReq = a, this._failedReqs++, this._requestsFinished && (this._aggrFinishTime = SpiderGL.Utility.getTime(), this._eventReq = this, this._doOnError()), this._eventReq = null)
    }, _reqOnSuccess: function (a) {
        var b = this._indexOf(this._requests, a);
        b < 0 || (this._eventReq = a, this._succeededReqs++, this._requestsFinished && (this._aggrFinishTime = SpiderGL.Utility.getTime(), this._eventReq = this, this._failedReqs > 0 ? this._doOnError() : this._doOnSuccess()), this._eventReq = null)
    }, _reqOnFinish: function (a) {
        var b = this._indexOf(this._requests, a);
        b < 0 || (this._uninstallProxies(a), this._eventReq = a, this._requestsFinished && (this._eventReq = this, this._doOnFinish()), this._eventReq = null)
    }, get eventSenderRequest() {
        return this._eventReq
    }, get requests() {
        return this._requests.slice()
    }, get requests$() {
        return this._requests
    }, get startTime() {
        return this._aggrStartTime
    }, get finishTime() {
        return this._aggrFinishTime
    }, get elapsedTime() {
        return this._aggrStartTime < 0 ? 0 : this._aggrFinishTime < 0 ? SpiderGL.Utility.getTime() - this._aggrStartTime : this._aggrFinishTime - this._aggrStartTime
    }, addRequest: function (a) {
        if (a && !this._sent) {
            var b = this._indexOf(this._requests, a);
            b >= 0 || this._requests.push(a)
        }
    }, removeRequest: function (a) {
        if (a && !this._sent) {
            var b = this._indexOf(this._requests, a);
            b < 0 || this._requests.splice(b, 1)
        }
    }
},SpiderGL.Type.extend(SpiderGL.IO.AggregateRequest, SpiderGL.IO.Request),SpiderGL.Math = {},SpiderGL.Math.DEG_TO_RAD = Math.PI / 180,SpiderGL.Math.E = Math.E,SpiderGL.Math.LN2 = Math.LN2,SpiderGL.Math.LN10 = Math.LN10,SpiderGL.Math.LOG2E = Math.LOG2E,SpiderGL.Math.LOG10E = Math.LOG10E,SpiderGL.Math.PI = Math.PI,SpiderGL.Math.RAD_TO_DEG = 180 / Math.PI,SpiderGL.Math.SQRT2 = Math.SQRT2,SpiderGL.Math.MAX_VALUE = Number.MAX_VALUE,SpiderGL.Math.MIN_VALUE = Number.MIN_VALUE,SpiderGL.Math.MAX_NUMBER = SpiderGL.Math.MAX_VALUE,SpiderGL.Math.MIN_NUMBER = -SpiderGL.Math.MAX_VALUE,SpiderGL.Math.NAN = Number.NaN,SpiderGL.Math.INFINITY = 1 / 0,SpiderGL.Math.abs = function (a) {
    return Math.abs(a)
},SpiderGL.Math.acos = function (a) {
    return Math.acos(a)
},SpiderGL.Math.asin = function (a) {
    return Math.asin(a)
},SpiderGL.Math.atan = function (a) {
    return Math.atan(a)
},SpiderGL.Math.atan2 = function (a, b) {
    return Math.atan2(a, b)
},SpiderGL.Math.ceil = function (a) {
    return Math.ceil(a)
},SpiderGL.Math.clamp = function (a, b, c) {
    return a <= b ? b : a >= c ? c : a
},SpiderGL.Math.cos = function (a) {
    return Math.cos(a)
},SpiderGL.Math.degToRad = function (a) {
    return a * SpiderGL.Math.DEG_TO_RAD
},SpiderGL.Math.exp = function (a) {
    return Math.exp(a)
},SpiderGL.Math.floor = function (a) {
    return Math.floor(a)
},SpiderGL.Math.lerp = function (a, b, c) {
    return a + c * (b - a)
},SpiderGL.Math.ln = function (a) {
    return Math.log(a)
},SpiderGL.Math.log = function (a) {
    return Math.log(a)
},SpiderGL.Math.log2 = function (a) {
    return SpiderGL.Math.log(a) / SpiderGL.Math.LN2
},SpiderGL.Math.log10 = function (a) {
    return SpiderGL.Math.log(a) / SpiderGL.Math.LN10
},SpiderGL.Math.max = function (a) {
    return Math.max.apply(Math, arguments)
},SpiderGL.Math.min = function (a) {
    return Math.min.apply(Math, arguments)
},SpiderGL.Math.pow = function (a, b) {
    return Math.pow(a, b)
},SpiderGL.Math.radToDeg = function (a) {
    return a * SpiderGL.Math.RAD_TO_DEG
},SpiderGL.Math.random = function () {
    return Math.random()
},SpiderGL.Math.random01 = function () {
    return SpiderGL.Math.random()
},SpiderGL.Math.random11 = function () {
    return 2 * SpiderGL.Math.random() - 1
},SpiderGL.Math.randomRange = function (a, b) {
    return a + SpiderGL.Math.random() * (b - a)
},SpiderGL.Math.round = function (a) {
    return Math.sqrt(a)
},SpiderGL.Math.sin = function (a) {
    return Math.sin(a)
},SpiderGL.Math.sqrt = function (a) {
    return Math.sqrt(a)
},SpiderGL.Math.tan = function (a) {
    return Math.tan(a)
},SpiderGL.Math.Vec2 = {},SpiderGL.Math.Vec2.dup = function (a) {
    return a.slice(0, 2)
},SpiderGL.Math.Vec2.scalar = function (a) {
    return [a, a]
},SpiderGL.Math.Vec2.zero = function () {
    return [0, 0]
},SpiderGL.Math.Vec2.one = function () {
    return [1, 1]
},SpiderGL.Math.Vec2.maxNumber = function () {
    return [SpiderGL.Math.MAX_NUMBER, SpiderGL.Math.MAX_NUMBER]
},SpiderGL.Math.Vec2.minNumber = function () {
    return [SpiderGL.Math.MIN_NUMBER, SpiderGL.Math.MIN_NUMBER]
},SpiderGL.Math.Vec2.to3 = function (a, b) {
    return [a[0], a[1], void 0 != b ? b : 0]
},SpiderGL.Math.Vec2.to4 = function (a, b, c) {
    return [a[0], a[1], a[2], void 0 != b ? b : 0, void 0 != c ? c : 1]
},SpiderGL.Math.Vec2.neg = function (a) {
    return [-a[0], -a[1]]
},SpiderGL.Math.Vec2.add = function (a, b) {
    return [a[0] + b[0], a[1] + b[1]]
},SpiderGL.Math.Vec2.adds = function (a, b) {
    return [a[0] + b, a[1] + b]
},SpiderGL.Math.Vec2.sub = function (a, b) {
    return [a[0] - b[0], a[1] - b[1]]
},SpiderGL.Math.Vec2.subs = function (a, b) {
    return [a[0] - b, a[1] - b]
},SpiderGL.Math.Vec2.ssub = function (a, b) {
    return [a - b[0], a - b[1]]
},SpiderGL.Math.Vec2.mul = function (a, b) {
    return [a[0] * b[0], a[1] * b[1]]
},SpiderGL.Math.Vec2.muls = function (a, b) {
    return [a[0] * b, a[1] * b]
},SpiderGL.Math.Vec2.div = function (a, b) {
    return [a[0] / b[0], a[1] / b[1]]
},SpiderGL.Math.Vec2.divs = function (a, b) {
    return [a[0] / b, a[1] / b]
},SpiderGL.Math.Vec2.sdiv = function (a, b) {
    return [a / b[0], a / b[1]]
},SpiderGL.Math.Vec2.rcp = function (a) {
    return [1 / a[0], 1 / a[1]]
},SpiderGL.Math.Vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1]
},SpiderGL.Math.Vec2.cross = function (a, b) {
    return a[0] * b[1] - a[1] * b[0]
},SpiderGL.Math.Vec2.perp = function (a) {
    return [a[1], -a[0]]
},SpiderGL.Math.Vec2.sqLength = function (a) {
    return SpiderGL.Math.Vec2.dot(a, a)
},SpiderGL.Math.Vec2.length = function (a) {
    return SpiderGL.Math.sqrt(SpiderGL.Math.Vec2.sqLength(a))
},SpiderGL.Math.Vec2.normalize = function (a) {
    var b = 1 / SpiderGL.Math.Vec2.length(a);
    return SpiderGL.Math.Vec2.muls(a, b)
},SpiderGL.Math.Vec2.abs = function (a) {
    return [SpiderGL.Math.abs(a[0]), SpiderGL.Math.abs(a[1])]
},SpiderGL.Math.Vec2.acos = function (a) {
    return [SpiderGL.Math.acos(a[0]), SpiderGL.Math.acos(a[1])]
},SpiderGL.Math.Vec2.asin = function (a) {
    return [SpiderGL.Math.asin(a[0]), SpiderGL.Math.asin(a[1])]
},SpiderGL.Math.Vec2.atan = function (a) {
    return [SpiderGL.Math.atan(a[0]), SpiderGL.Math.atan(a[1])]
},SpiderGL.Math.Vec2.atan2 = function (a, b) {
    return [SpiderGL.Math.atan2(a[0], b[0]), SpiderGL.Math.atan2(a[1], b[1])]
},SpiderGL.Math.Vec2.ceil = function (a) {
    return [SpiderGL.Math.ceil(a[0]), SpiderGL.Math.ceil(a[1])]
},SpiderGL.Math.Vec2.clamp = function (a, b, c) {
    return [SpiderGL.Math.clamp(a[0], b[0], c[0]), SpiderGL.Math.clamp(a[1], b[1], c[1])]
},SpiderGL.Math.Vec2.cos = function (a) {
    return [SpiderGL.Math.cos(a[0]), SpiderGL.Math.cos(a[1])]
},SpiderGL.Math.Vec2.degToRad = function (a) {
    return [SpiderGL.Math.degToRad(a[0]), SpiderGL.Math.degToRad(a[1])]
},SpiderGL.Math.Vec2.exp = function (a) {
    return [SpiderGL.Math.exp(a[0]), SpiderGL.Math.exp(a[1])]
},SpiderGL.Math.Vec2.floor = function (a) {
    return [SpiderGL.Math.floor(a[0]), SpiderGL.Math.floor(a[1])]
},SpiderGL.Math.Vec2.lerp = function (a, b, c) {
    return [SpiderGL.Math.lerp(a[0], b[0], c), SpiderGL.Math.lerp(a[1], b[1], c)]
},SpiderGL.Math.Vec2.ln = function (a) {
    return [SpiderGL.Math.ln(a[0]), SpiderGL.Math.ln(a[1])]
},SpiderGL.Math.Vec2.log = function (a) {
    return [SpiderGL.Math.log(a[0]), SpiderGL.Math.log(a[1])]
},SpiderGL.Math.Vec2.log2 = function (a) {
    return [SpiderGL.Math.log2(a[0]), SpiderGL.Math.log2(a[1])]
};
SpiderGL.Math.Vec2.log10 = function (a) {
    return [SpiderGL.Math.log10(a[0]), SpiderGL.Math.log10(a[1])]
};
SpiderGL.Math.Vec2.max = function (a, b) {
    return [SpiderGL.Math.max(a[0], b[0]), SpiderGL.Math.max(a[1], b[1])]
}, SpiderGL.Math.Vec2.min = function (a, b) {
    return [SpiderGL.Math.min(a[0], b[0]), SpiderGL.Math.min(a[1], b[1])]
}, SpiderGL.Math.Vec2.pow = function (a, b) {
    return [SpiderGL.Math.pow(a[0], b[0]), SpiderGL.Math.pow(a[1], b[1])]
}, SpiderGL.Math.Vec2.radToDeg = function (a) {
    return [SpiderGL.Math.radToDeg(a[0]), SpiderGL.Math.radToDeg(a[1])]
}, SpiderGL.Math.Vec2.random = function () {
    return [SpiderGL.Math.random(), SpiderGL.Math.random()]
}, SpiderGL.Math.Vec2.random01 = function () {
    return [SpiderGL.Math.random01(), SpiderGL.Math.random01()]
}, SpiderGL.Math.Vec2.random11 = function () {
    return [SpiderGL.Math.random11(), SpiderGL.Math.random11()]
}, SpiderGL.Math.Vec2.randomRange = function (a, b) {
    return [SpiderGL.Math.randomRange(a[0], b[0]), SpiderGL.Math.randomRange(a[1], b[1])]
}, SpiderGL.Math.Vec2.round = function (a) {
    return [SpiderGL.Math.round(a[0]), SpiderGL.Math.round(a[1])]
}, SpiderGL.Math.Vec2.sin = function (a) {
    return [SpiderGL.Math.sin(a[0]), SpiderGL.Math.sin(a[1])]
}, SpiderGL.Math.Vec2.sqrt = function (a) {
    return [SpiderGL.Math.sqrt(a[0]), SpiderGL.Math.sqrt(a[1])]
}, SpiderGL.Math.Vec2.tan = function (a) {
    return [SpiderGL.Math.tan(a[0]), SpiderGL.Math.tan(a[1])]
}, SpiderGL.Math.Vec2.copy$ = function (a, b) {
    return a[0] = b[0], a[1] = b[1], a
}, SpiderGL.Math.Vec2.neg$ = function (a) {
    return a[0] = -a[0], a[1] = -a[1], a
}, SpiderGL.Math.Vec2.add$ = function (a, b) {
    return a[0] += b[0], a[1] += b[1], a
}, SpiderGL.Math.Vec2.adds$ = function (a, b) {
    return a[0] += b, a[1] += b, a
}, SpiderGL.Math.Vec2.sub$ = function (a, b) {
    return a[0] -= b[0], a[1] -= b[1], a
}, SpiderGL.Math.Vec2.subs$ = function (a, b) {
    return a[0] -= b, a[1] -= b, a
}, SpiderGL.Math.Vec2.ssub$ = function (a, b) {
    return b[0] = a - b[0], b[1] = a - b[1], b
}, SpiderGL.Math.Vec2.mul$ = function (a, b) {
    return a[0] *= b[0], a[1] *= b[1], a
}, SpiderGL.Math.Vec2.muls$ = function (a, b) {
    return a[0] *= b, a[1] *= b, a
}, SpiderGL.Math.Vec2.div$ = function (a, b) {
    return a[0] /= b[0], a[1] /= b[1], a
}, SpiderGL.Math.Vec2.divs$ = function (a, b) {
    return a[0] /= b, a[1] /= b, a
}, SpiderGL.Math.Vec2.sdiv$ = function (a, b) {
    return a[0] = b / a[0], a[1] = b / a[1], a
}, SpiderGL.Math.Vec2.perp$ = function (a) {
    var b = a[0];
    return a[0] = a[1], a[1] = -b, a
}, SpiderGL.Math.Vec2.normalize$ = function (a) {
    var b = 1 / SpiderGL.Math.Vec2.length(a);
    return SpiderGL.Math.Vec2.muls$(a, b)
}, SpiderGL.Math.Vec3 = {}, SpiderGL.Math.Vec3.dup = function (a) {
    return a.slice(0, 3)
}, SpiderGL.Math.Vec3.scalar = function (a) {
    return [a, a, a]
}, SpiderGL.Math.Vec3.zero = function () {
    return [0, 0, 0]
}, SpiderGL.Math.Vec3.one = function () {
    return [1, 1, 1]
}, SpiderGL.Math.Vec3.maxNumber = function () {
    return [SpiderGL.Math.MAX_NUMBER, SpiderGL.Math.MAX_NUMBER, SpiderGL.Math.MAX_NUMBER]
}, SpiderGL.Math.Vec3.minNumber = function () {
    return [SpiderGL.Math.MIN_NUMBER, SpiderGL.Math.MIN_NUMBER, SpiderGL.Math.MIN_NUMBER]
}, SpiderGL.Math.Vec3.to2 = function (a) {
    return [a[0], a[1]]
}, SpiderGL.Math.Vec3.to4 = function (a, b) {
    return [a[0], a[1], a[2], void 0 != b ? b : 1]
}, SpiderGL.Math.Vec3.neg = function (a) {
    return [-a[0], -a[1], -a[2]]
}, SpiderGL.Math.Vec3.add = function (a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}, SpiderGL.Math.Vec3.adds = function (a, b) {
    return [a[0] + b, a[1] + b, a[2] + b]
}, SpiderGL.Math.Vec3.sub = function (a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}, SpiderGL.Math.Vec3.subs = function (a, b) {
    return [a[0] - b, a[1] - b, a[2] - b]
}, SpiderGL.Math.Vec3.ssub = function (a, b) {
    return [a - b[0], a - b[1], a - b[2]]
}, SpiderGL.Math.Vec3.mul = function (a, b) {
    return [a[0] * b[0], a[1] * b[1], a[2] * b[2]]
}, SpiderGL.Math.Vec3.muls = function (a, b) {
    return [a[0] * b, a[1] * b, a[2] * b]
}, SpiderGL.Math.Vec3.div = function (a, b) {
    return [a[0] / b[0], a[1] / b[1], a[2] / b[2]]
}, SpiderGL.Math.Vec3.divs = function (a, b) {
    return [a[0] / b, a[1] / b, a[2] / b]
}, SpiderGL.Math.Vec3.sdiv = function (a, b) {
    return [a / b[0], a / b[1], a / b[2]]
}, SpiderGL.Math.Vec3.rcp = function (a) {
    return [1 / a[0], 1 / a[1], 1 / a[2]]
}, SpiderGL.Math.Vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}, SpiderGL.Math.Vec3.cross = function (a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}, SpiderGL.Math.Vec3.sqLength = function (a) {
    return SpiderGL.Math.Vec3.dot(a, a)
}, SpiderGL.Math.Vec3.length = function (a) {
    return SpiderGL.Math.sqrt(SpiderGL.Math.Vec3.sqLength(a))
}, SpiderGL.Math.Vec3.normalize = function (a) {
    var b = 1 / SpiderGL.Math.Vec3.length(a);
    return SpiderGL.Math.Vec3.muls(a, b)
}, SpiderGL.Math.Vec3.abs = function (a) {
    return [SpiderGL.Math.abs(a[0]), SpiderGL.Math.abs(a[1]), SpiderGL.Math.abs(a[2])]
}, SpiderGL.Math.Vec3.acos = function (a) {
    return [SpiderGL.Math.acos(a[0]), SpiderGL.Math.acos(a[1]), SpiderGL.Math.acos(a[2])]
}, SpiderGL.Math.Vec3.asin = function (a) {
    return [SpiderGL.Math.asin(a[0]), SpiderGL.Math.asin(a[1]), SpiderGL.Math.asin(a[2])]
}, SpiderGL.Math.Vec3.atan = function (a) {
    return [SpiderGL.Math.atan(a[0]), SpiderGL.Math.atan(a[1]), SpiderGL.Math.atan(a[2])]
}, SpiderGL.Math.Vec3.atan2 = function (a, b) {
    return [SpiderGL.Math.atan2(a[0], b[0]), SpiderGL.Math.atan2(a[1], b[1]), SpiderGL.Math.atan2(a[2], b[2])]
}, SpiderGL.Math.Vec3.ceil = function (a) {
    return [SpiderGL.Math.ceil(a[0]), SpiderGL.Math.ceil(a[1]), SpiderGL.Math.ceil(a[2])]
}, SpiderGL.Math.Vec3.clamp = function (a, b, c) {
    return [SpiderGL.Math.clamp(a[0], b[0], c[0]), SpiderGL.Math.clamp(a[1], b[1], c[1]), SpiderGL.Math.clamp(a[2], b[2], c[2])];
}, SpiderGL.Math.Vec3.cos = function (a) {
    return [SpiderGL.Math.cos(a[0]), SpiderGL.Math.cos(a[1]), SpiderGL.Math.cos(a[2])]
}, SpiderGL.Math.Vec3.degToRad = function (a) {
    return [SpiderGL.Math.degToRad(a[0]), SpiderGL.Math.degToRad(a[1]), SpiderGL.Math.degToRad(a[2])]
}, SpiderGL.Math.Vec3.exp = function (a) {
    return [SpiderGL.Math.exp(a[0]), SpiderGL.Math.exp(a[1]), SpiderGL.Math.exp(a[2])]
}, SpiderGL.Math.Vec3.floor = function (a) {
    return [SpiderGL.Math.floor(a[0]), SpiderGL.Math.floor(a[1]), SpiderGL.Math.floor(a[2])]
}, SpiderGL.Math.Vec3.lerp = function (a, b, c) {
    return [SpiderGL.Math.lerp(a[0], b[0], c), SpiderGL.Math.lerp(a[1], b[1], c), SpiderGL.Math.lerp(a[2], b[2], c)]
}, SpiderGL.Math.Vec3.ln = function (a) {
    return [SpiderGL.Math.ln(a[0]), SpiderGL.Math.ln(a[1]), SpiderGL.Math.ln(a[2])]
}, SpiderGL.Math.Vec3.log = function (a) {
    return [SpiderGL.Math.log(a[0]), SpiderGL.Math.log(a[1]), SpiderGL.Math.log(a[2])]
}, SpiderGL.Math.Vec3.log2 = function (a) {
    return [SpiderGL.Math.log2(a[0]), SpiderGL.Math.log2(a[1]), SpiderGL.Math.log2(a[2])]
}, SpiderGL.Math.Vec3.log10 = function (a) {
    return [SpiderGL.Math.log10(a[0]), SpiderGL.Math.log10(a[1]), SpiderGL.Math.log10(a[2])]
}, SpiderGL.Math.Vec3.max = function (a, b) {
    return [SpiderGL.Math.max(a[0], b[0]), SpiderGL.Math.max(a[1], b[1]), SpiderGL.Math.max(a[2], b[2])]
}, SpiderGL.Math.Vec3.min = function (a, b) {
    return [SpiderGL.Math.min(a[0], b[0]), SpiderGL.Math.min(a[1], b[1]), SpiderGL.Math.min(a[2], b[2])]
}, SpiderGL.Math.Vec3.pow = function (a, b) {
    return [SpiderGL.Math.pow(a[0], b[0]), SpiderGL.Math.pow(a[1], b[1]), SpiderGL.Math.pow(a[2], b[2])]
}, SpiderGL.Math.Vec3.radToDeg = function (a) {
    return [SpiderGL.Math.radToDeg(a[0]), SpiderGL.Math.radToDeg(a[1]), SpiderGL.Math.radToDeg(a[2])]
}, SpiderGL.Math.Vec3.random = function () {
    return [SpiderGL.Math.random(), SpiderGL.Math.random(), SpiderGL.Math.random()]
}, SpiderGL.Math.Vec3.random01 = function () {
    return [SpiderGL.Math.random01(), SpiderGL.Math.random01(), SpiderGL.Math.random01()]
}, SpiderGL.Math.Vec3.random11 = function () {
    return [SpiderGL.Math.random11(), SpiderGL.Math.random11(), SpiderGL.Math.random11()]
}, SpiderGL.Math.Vec3.randomRange = function (a, b) {
    return [SpiderGL.Math.randomRange(a[0], b[0]), SpiderGL.Math.randomRange(a[1], b[1]), SpiderGL.Math.randomRange(a[2], b[2])]
}, SpiderGL.Math.Vec3.round = function (a) {
    return [SpiderGL.Math.round(a[0]), SpiderGL.Math.round(a[1]), SpiderGL.Math.round(a[2])]
}, SpiderGL.Math.Vec3.sin = function (a) {
    return [SpiderGL.Math.sin(a[0]), SpiderGL.Math.sin(a[1]), SpiderGL.Math.sin(a[2])]
}, SpiderGL.Math.Vec3.sqrt = function (a) {
    return [SpiderGL.Math.sqrt(a[0]), SpiderGL.Math.sqrt(a[1]), SpiderGL.Math.sqrt(a[2])]
}, SpiderGL.Math.Vec3.tan = function (a) {
    return [SpiderGL.Math.tan(a[0]), SpiderGL.Math.tan(a[1]), SpiderGL.Math.tan(a[2])]
}, SpiderGL.Math.Vec3.copy$ = function (a, b) {
    return a[0] = b[0], a[1] = b[1], a[2] = b[2], a
}, SpiderGL.Math.Vec3.neg$ = function (a) {
    return a[0] = -a[0], a[1] = -a[1], a[2] = -a[2], a
}, SpiderGL.Math.Vec3.add$ = function (a, b) {
    return a[0] += b[0], a[1] += b[1], a[2] += b[2], a
}, SpiderGL.Math.Vec3.adds$ = function (a, b) {
    return a[0] += b, a[1] += b, a[2] += b, a
}, SpiderGL.Math.Vec3.sub$ = function (a, b) {
    return a[0] -= b[0], a[1] -= b[1], a[2] -= b[2], a
}, SpiderGL.Math.Vec3.subs$ = function (a, b) {
    return a[0] -= b, a[1] -= b, a[2] -= b, a
}, SpiderGL.Math.Vec3.ssub$ = function (a, b) {
    return b[0] = a - b[0], b[1] = a - b[1], b[2] = a - b[2], b
}, SpiderGL.Math.Vec3.mul$ = function (a, b) {
    return a[0] *= b[0], a[1] *= b[1], a[2] *= b[2], a
}, SpiderGL.Math.Vec3.muls$ = function (a, b) {
    return a[0] *= b, a[1] *= b, a[2] *= b, a
}, SpiderGL.Math.Vec3.div$ = function (a, b) {
    return a[0] /= b[0], a[1] /= b[1], a[2] /= b[2], a
}, SpiderGL.Math.Vec3.divs$ = function (a, b) {
    return a[0] /= b, a[1] /= b, a[2] /= b, a
}, SpiderGL.Math.Vec3.sdiv$ = function (a, b) {
    return a[0] = b / a[0], a[1] = b / a[1], a[2] = b / a[2], a
}, SpiderGL.Math.Vec3.normalize$ = function (a) {
    var b = 1 / SpiderGL.Math.Vec3.length(a);
    return SpiderGL.Math.Vec3.muls$(a, b)
}, SpiderGL.Math.Vec4 = {}, SpiderGL.Math.Vec4.dup = function (a) {
    return a.slice(0, 4)
}, SpiderGL.Math.Vec4.scalar = function (a) {
    return [a, a, a, a]
}, SpiderGL.Math.Vec4.zero = function () {
    return [0, 0, 0, 0]
}, SpiderGL.Math.Vec4.one = function () {
    return [1, 1, 1, 1]
}, SpiderGL.Math.Vec4.maxNumber = function () {
    return [SpiderGL.Math.MAX_NUMBER, SpiderGL.Math.MAX_NUMBER, SpiderGL.Math.MAX_NUMBER, SpiderGL.Math.MAX_NUMBER]
}, SpiderGL.Math.Vec4.minNumber = function () {
    return [SpiderGL.Math.MIN_NUMBER, SpiderGL.Math.MIN_NUMBER, SpiderGL.Math.MIN_NUMBER, SpiderGL.Math.MIN_NUMBER]
}, SpiderGL.Math.Vec4.to2 = function (a) {
    return [a[0], a[1]]
},SpiderGL.Math.Vec4.to3 = function (a) {
    return [a[0], a[1], a[2]]
},SpiderGL.Math.Vec4.neg = function (a) {
    return [-a[0], -a[1], -a[2], -a[3]]
},SpiderGL.Math.Vec4.add = function (a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]]
},SpiderGL.Math.Vec4.adds = function (a, b) {
    return [a[0] + b, a[1] + b, a[2] + b, a[3] + b]
},SpiderGL.Math.Vec4.sub = function (a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3]]
},SpiderGL.Math.Vec4.subs = function (a, b) {
    return [a[0] - b, a[1] - b, a[2] - b, a[3] - b]
},SpiderGL.Math.Vec4.ssub = function (a, b) {
    return [a - b[0], a - b[1], a - b[2], a - b[3]]
},SpiderGL.Math.Vec4.mul = function (a, b) {
    return [a[0] * b[0], a[1] * b[1], a[2] * b[2], a[3] * b[3]]
},SpiderGL.Math.Vec4.muls = function (a, b) {
    return [a[0] * b, a[1] * b, a[2] * b, a[3] * b]
},SpiderGL.Math.Vec4.div = function (a, b) {
    return [a[0] / b[0], a[1] / b[1], a[2] / b[2], a[3] / b[3]]
},SpiderGL.Math.Vec4.divs = function (a, b) {
    return [a[0] / b, a[1] / b, a[2] / b, a[3] / b]
},SpiderGL.Math.Vec4.sdiv = function (a, b) {
    return [a / b[0], a / b[1], a / b[2], a / b[3]]
},SpiderGL.Math.Vec4.rcp = function (a) {
    return [1 / a[0], 1 / a[1], 1 / a[2], 1 / a[3]]
},SpiderGL.Math.Vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
},SpiderGL.Math.Vec4.cross = function (a, b, c) {
    var d = b[0] * c[1] - b[1] * c[0], e = b[0] * c[2] - b[2] * c[0], f = b[0] * c[3] - b[3] * c[0],
        g = b[1] * c[2] - b[2] * c[1], h = b[1] * c[3] - b[3] * c[1], i = b[2] * c[3] - b[3] * c[2];
    return [a[1] * i - a[2] * h + a[3] * g, a[0] * i + a[2] * f - a[3] * e, a[0] * h - a[1] * f + a[3] * d, a[0] * g + a[1] * e - a[2] * d]
},SpiderGL.Math.Vec4.sqLength = function (a) {
    return SpiderGL.Math.Vec4.dot(a, a)
},SpiderGL.Math.Vec4.length = function (a) {
    return SpiderGL.Math.sqrt(SpiderGL.Math.Vec4.sqLength(a))
},SpiderGL.Math.Vec4.normalize = function (a) {
    var b = 1 / SpiderGL.Math.Vec4.length(a);
    return SpiderGL.Math.Vec4.muls(a, b)
},SpiderGL.Math.Vec4.project = function (a) {
    var b = 1 / a[3];
    return [a[0] * b, a[1] * b, a[2] * b, 1]
},SpiderGL.Math.Vec4.abs = function (a) {
    return [SpiderGL.Math.abs(a[0]), SpiderGL.Math.abs(a[1]), SpiderGL.Math.abs(a[2]), SpiderGL.Math.abs(a[3])]
},SpiderGL.Math.Vec4.acos = function (a) {
    return [SpiderGL.Math.acos(a[0]), SpiderGL.Math.acos(a[1]), SpiderGL.Math.acos(a[2]), SpiderGL.Math.acos(a[3])]
},SpiderGL.Math.Vec4.asin = function (a) {
    return [SpiderGL.Math.asin(a[0]), SpiderGL.Math.asin(a[1]), SpiderGL.Math.asin(a[2]), SpiderGL.Math.asin(a[3])]
},SpiderGL.Math.Vec4.atan = function (a) {
    return [SpiderGL.Math.atan(a[0]), SpiderGL.Math.atan(a[1]), SpiderGL.Math.atan(a[2]), SpiderGL.Math.atan(a[3])]
},SpiderGL.Math.Vec4.atan2 = function (a, b) {
    return [SpiderGL.Math.atan2(a[0], b[0]), SpiderGL.Math.atan2(a[1], b[1]), SpiderGL.Math.atan2(a[2], b[2]), SpiderGL.Math.atan2(a[3], b[3])]
},SpiderGL.Math.Vec4.ceil = function (a) {
    return [SpiderGL.Math.ceil(a[0]), SpiderGL.Math.ceil(a[1]), SpiderGL.Math.ceil(a[2]), SpiderGL.Math.ceil(a[3])]
},SpiderGL.Math.Vec4.clamp = function (a, b, c) {
    return [SpiderGL.Math.clamp(a[0], b[0], c[0]), SpiderGL.Math.clamp(a[1], b[1], c[1]), SpiderGL.Math.clamp(a[2], b[2], c[2]), SpiderGL.Math.clamp(a[3], b[3], c[3])]
},SpiderGL.Math.Vec4.cos = function (a) {
    return [SpiderGL.Math.cos(a[0]), SpiderGL.Math.cos(a[1]), SpiderGL.Math.cos(a[2]), SpiderGL.Math.cos(a[3])]
},SpiderGL.Math.Vec4.degToRad = function (a) {
    return [SpiderGL.Math.degToRad(a[0]), SpiderGL.Math.degToRad(a[1]), SpiderGL.Math.degToRad(a[2]), SpiderGL.Math.degToRad(a[3])]
},SpiderGL.Math.Vec4.exp = function (a) {
    return [SpiderGL.Math.exp(a[0]), SpiderGL.Math.exp(a[1]), SpiderGL.Math.exp(a[2]), SpiderGL.Math.exp(a[3])]
},SpiderGL.Math.Vec4.floor = function (a) {
    return [SpiderGL.Math.floor(a[0]), SpiderGL.Math.floor(a[1]), SpiderGL.Math.floor(a[2]), SpiderGL.Math.floor(a[3])]
},SpiderGL.Math.Vec4.lerp = function (a, b, c) {
    return [SpiderGL.Math.lerp(a[0], b[0], c), SpiderGL.Math.lerp(a[1], b[1], c), SpiderGL.Math.lerp(a[2], b[2], c), SpiderGL.Math.lerp(a[3], b[3], c)]
},SpiderGL.Math.Vec4.ln = function (a) {
    return [SpiderGL.Math.ln(a[0]), SpiderGL.Math.ln(a[1]), SpiderGL.Math.ln(a[2]), SpiderGL.Math.ln(a[3])]
},SpiderGL.Math.Vec4.log = function (a) {
    return [SpiderGL.Math.log(a[0]), SpiderGL.Math.log(a[1]), SpiderGL.Math.log(a[2]), SpiderGL.Math.log(a[3])]
},SpiderGL.Math.Vec4.log2 = function (a) {
    return [SpiderGL.Math.log2(a[0]), SpiderGL.Math.log2(a[1]), SpiderGL.Math.log2(a[2]), SpiderGL.Math.log2(a[3])]
},SpiderGL.Math.Vec4.log10 = function (a) {
    return [SpiderGL.Math.log10(a[0]), SpiderGL.Math.log10(a[1]), SpiderGL.Math.log10(a[2]), SpiderGL.Math.log10(a[3])]
},SpiderGL.Math.Vec4.max = function (a, b) {
    return [SpiderGL.Math.max(a[0], b[0]), SpiderGL.Math.max(a[1], b[1]), SpiderGL.Math.max(a[2], b[2]), SpiderGL.Math.max(a[3], b[3])]
},SpiderGL.Math.Vec4.min = function (a, b) {
    return [SpiderGL.Math.min(a[0], b[0]), SpiderGL.Math.min(a[1], b[1]), SpiderGL.Math.min(a[2], b[2]), SpiderGL.Math.min(a[3], b[3])]
},SpiderGL.Math.Vec4.pow = function (a, b) {
    return [SpiderGL.Math.pow(a[0], b[0]), SpiderGL.Math.pow(a[1], b[1]), SpiderGL.Math.pow(a[2], b[2]), SpiderGL.Math.pow(a[3], b[3])]
},SpiderGL.Math.Vec4.radToDeg = function (a) {
    return [SpiderGL.Math.radToDeg(a[0]), SpiderGL.Math.radToDeg(a[1]), SpiderGL.Math.radToDeg(a[2]), SpiderGL.Math.radToDeg(a[3])]
},SpiderGL.Math.Vec4.random = function () {
    return [SpiderGL.Math.random(), SpiderGL.Math.random(), SpiderGL.Math.random(), SpiderGL.Math.random()]
},SpiderGL.Math.Vec4.random01 = function () {
    return [SpiderGL.Math.random01(), SpiderGL.Math.random01(), SpiderGL.Math.random01(), SpiderGL.Math.random01()]
},SpiderGL.Math.Vec4.random11 = function () {
    return [SpiderGL.Math.random11(), SpiderGL.Math.random11(), SpiderGL.Math.random11(), SpiderGL.Math.random11()]
},SpiderGL.Math.Vec4.randomRange = function (a, b) {
    return [SpiderGL.Math.randomRange(a[0], b[0]), SpiderGL.Math.randomRange(a[1], b[1]), SpiderGL.Math.randomRange(a[2], b[2]), SpiderGL.Math.randomRange(a[3], b[3])]
},SpiderGL.Math.Vec4.round = function (a) {
    return [SpiderGL.Math.round(a[0]), SpiderGL.Math.round(a[1]), SpiderGL.Math.round(a[2]), SpiderGL.Math.round(a[3])]
},SpiderGL.Math.Vec4.sin = function (a) {
    return [SpiderGL.Math.sin(a[0]), SpiderGL.Math.sin(a[1]), SpiderGL.Math.sin(a[2]), SpiderGL.Math.sin(a[3])]
},SpiderGL.Math.Vec4.sqrt = function (a) {
    return [SpiderGL.Math.sqrt(a[0]), SpiderGL.Math.sqrt(a[1]), SpiderGL.Math.sqrt(a[2]), SpiderGL.Math.sqrt(a[3])]
},SpiderGL.Math.Vec4.tan = function (a) {
    return [SpiderGL.Math.tan(a[0]), SpiderGL.Math.tan(a[1]), SpiderGL.Math.tan(a[2]), SpiderGL.Math.tan(a[3])]
},SpiderGL.Math.Vec4.copy$ = function (a, b) {
    return a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3], a
},SpiderGL.Math.Vec4.neg$ = function (a) {
    return a[0] = -a[0], a[1] = -a[1], a[2] = -a[2], a[3] = -a[3], a
},SpiderGL.Math.Vec4.add$ = function (a, b) {
    return a[0] += b[0], a[1] += b[1], a[2] += b[2], a[3] += b[3], a
},SpiderGL.Math.Vec4.adds$ = function (a, b) {
    return a[0] += b, a[1] += b, a[2] += b, a[3] += b, a
},SpiderGL.Math.Vec4.sub$ = function (a, b) {
    return a[0] -= b[0], a[1] -= b[1], a[2] -= b[2], a[3] -= b[3], a
},SpiderGL.Math.Vec4.subs$ = function (a, b) {
    return a[0] -= b, a[1] -= b, a[2] -= b, a[3] -= b, a
},SpiderGL.Math.Vec4.ssub$ = function (a, b) {
    return b[0] = a - b[0], b[1] = a - b[1], b[2] = a - b[2], b[3] = a - b[3], b
},SpiderGL.Math.Vec4.mul$ = function (a, b) {
    return a[0] *= b[0], a[1] *= b[1], a[2] *= b[2], a[3] *= b[3], a
},SpiderGL.Math.Vec4.muls$ = function (a, b) {
    return a[0] *= b, a[1] *= b, a[2] *= b, a[3] *= b, a
},SpiderGL.Math.Vec4.div$ = function (a, b) {
    return a[0] /= b[0], a[1] /= b[1], a[2] /= b[2], a[3] /= b[3], a
},SpiderGL.Math.Vec4.divs$ = function (a, b) {
    return a[0] /= b, a[1] /= b, a[2] /= b, a[3] /= b, a
},SpiderGL.Math.Vec4.sdiv$ = function (a, b) {
    return a[0] = b / a[0], a[1] = b / a[1], a[2] = b / a[2], a[3] = b / a[3], a
},SpiderGL.Math.Vec4.normalize$ = function (a) {
    var b = 1 / SpiderGL.Math.Vec4.length(a);
    return SpiderGL.Math.Vec4.muls$(a, b)
},SpiderGL.Math.Mat3 = {},SpiderGL.Math.Mat3.dup = function (a) {
    return a.slice(0, 9)
},SpiderGL.Math.Mat3.scalar = function (a) {
    return [a, a, a, a, a, a, a, a, a]
},SpiderGL.Math.Mat3.zero = function () {
    return [0, 0, 0, 0, 0, 0, 0, 0, 0]
},SpiderGL.Math.Mat3.one = function () {
    return [1, 1, 1, 1, 1, 1, 1, 1, 1]
},SpiderGL.Math.Mat3.diag = function (a) {
    return [a[0], 0, 0, 0, a[0], 0, 0, 0, a[0]]
},SpiderGL.Math.Mat3.identity = function () {
    return [1, 0, 0, 0, 1, 0, 0, 0, 1]
},SpiderGL.Math.Mat3.to44 = function (a) {
    return [a[0], a[1], a[2], 0, a[3], a[4], a[5], 0, a[6], a[7], a[8], 0, 0, 0, 0, 1]
},SpiderGL.Math.Mat3.mul2 = function (a, b, c) {
    return c = void 0 == c ? 0 : c, [a[0] * b[0] + a[3] * b[1] + a[6] * c, a[1] * b[0] + a[4] * b[1] + a[7] * c]
},SpiderGL.Math.Mat3.mul3 = function (a, b) {
    return [a[0] * b[0] + a[3] * b[1] + a[6] * b[2], a[1] * b[0] + a[4] * b[1] + a[7] * b[2], a[2] * b[0] + a[5] * b[1] + a[8] * b[2]]
},SpiderGL.Math.Mat3.transpose = function (a) {
    return [a[0], a[3], a[6], a[1], a[4], a[7], a[2], a[5], a[8]]
},SpiderGL.Math.Mat4 = {},SpiderGL.Math.Mat4.dup = function (a) {
    return a.slice(0, 16)
},SpiderGL.Math.Mat4.scalar = function (a) {
    return [a, a, a, a, a, a, a, a, a, a, a, a, a, a, a, a]
},SpiderGL.Math.Mat4.zero = function () {
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
},SpiderGL.Math.Mat4.one = function () {
    return [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
},SpiderGL.Math.Mat4.diag = function (a) {
    return [a[0], 0, 0, 0, 0, a[0], 0, 0, 0, 0, a[0], 0, 0, 0, 0, a[0]]
},SpiderGL.Math.Mat4.identity = function () {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
},SpiderGL.Math.Mat4.to33 = function (a) {
    return [a[0], a[1], a[2], a[4], a[5], a[6], a[8], a[9], a[10]]
},SpiderGL.Math.Mat4.elem = function (a, b, c) {
    return a[b + 4 * c]
},SpiderGL.Math.Mat4.elem$ = function (a, b, c, d) {
    a[b + 4 * c] = d
},SpiderGL.Math.Mat4.row = function (a, b) {
    return [a[b + 0], a[b + 4], a[b + 8], a[b + 12]]
},SpiderGL.Math.Mat4.row$ = function (a, b, c) {
    a[b + 0] = c[0], a[b + 4] = c[1], a[b + 8] = c[2], a[b + 12] = c[3]
},SpiderGL.Math.Mat4.col = function (a, b) {
    var c = 4 * b;
    return [a[c + 0], a[c + 1], a[c + 2], a[c + 3]]
},SpiderGL.Math.Mat4.col$ = function (a, b, c) {
    var d = 4 * b;
    a[d + 0] = c[0], a[d + 1] = c[1], a[d + 2] = c[2], a[d + 3] = c[3]
},SpiderGL.Math.Mat4.isIdentity = function (a) {
    return 1 === a[0] && 0 === a[1] && 0 === a[2] && 0 === a[3] && 0 === a[4] && 1 === a[5] && 0 === a[6] && 0 === a[7] && 0 === a[8] && 0 === a[9] && 1 === a[10] && 0 === a[11] && 0 === a[12] && 0 === a[13] && 0 === a[14] && 1 === a[15]
},SpiderGL.Math.Mat4.neg = function (a) {
    return [-a[0], -a[1], -a[2], -a[3], -a[4], -a[5], -a[6], -a[7], -a[8], -a[9], -a[10], -a[11], -a[12], -a[13], -a[14], -a[15]]
},SpiderGL.Math.Mat4.add = function (a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3], a[4] + b[4], a[5] + b[5], a[6] + b[6], a[7] + b[7], a[8] + b[8], a[9] + b[9], a[10] + b[10], a[11] + b[11], a[12] + b[12], a[13] + b[13], a[14] + b[14], a[15] + b[15]]
},SpiderGL.Math.Mat4.sub = function (a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3], a[4] - b[4], a[5] - b[5], a[6] - b[6], a[7] - b[7], a[8] - b[8], a[9] - b[9], a[10] - b[10], a[11] - b[11], a[12] - b[12], a[13] - b[13], a[14] - b[14], a[15] - b[15]]
},SpiderGL.Math.Mat4.mul = function (a, b) {
    var c = a[0], d = a[1], e = a[2], f = a[3], g = a[4], h = a[5], i = a[6], j = a[7], k = a[8], l = a[9], m = a[10],
        n = a[11], o = a[12], p = a[13], q = a[14], r = a[15], s = b[0], t = b[1], u = b[2], v = b[3], w = b[4],
        x = b[5], y = b[6], z = b[7], A = b[8], B = b[9], C = b[10], D = b[11], E = b[12], F = b[13], G = b[14],
        H = b[15];
    return [c * s + g * t + k * u + o * v, d * s + h * t + l * u + p * v, e * s + i * t + m * u + q * v, f * s + j * t + n * u + r * v, c * w + g * x + k * y + o * z, d * w + h * x + l * y + p * z, e * w + i * x + m * y + q * z, f * w + j * x + n * y + r * z, c * A + g * B + k * C + o * D, d * A + h * B + l * C + p * D, e * A + i * B + m * C + q * D, f * A + j * B + n * C + r * D, c * E + g * F + k * G + o * H, d * E + h * F + l * G + p * H, e * E + i * F + m * G + q * H, f * E + j * F + n * G + r * H]
},SpiderGL.Math.Mat4.muls = function (a, b) {
    return [a[0] * b, a[1] * b, a[2] * b, a[3] * b, a[4] * b, a[5] * b, a[6] * b, a[7] * b, a[8] * b, a[9] * b, a[10] * b, a[11] * b, a[12] * b, a[13] * b, a[14] * b, a[15] * b]
},SpiderGL.Math.Mat4.mul3 = function (a, b, c) {
    return c = void 0 == c ? 1 : c, [a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * c, a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * c, a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * c]
},SpiderGL.Math.Mat4.mul4 = function (a, b) {
    return [a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3], a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3], a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3], a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3]]
},SpiderGL.Math.Mat4.rcp = function (a) {
    return [1 / a[0], 1 / a[1], 1 / a[2], 1 / a[3], 1 / a[4], 1 / a[5], 1 / a[6], 1 / a[7], 1 / a[8], 1 / a[9], 1 / a[10], 1 / a[11], 1 / a[12], 1 / a[13], 1 / a[14], 1 / a[15]]
},SpiderGL.Math.Mat4.compMul = function (a, b) {
    return [a[0] * b[0], a[1] * b[1], a[2] * b[2], a[3] * b[3], a[4] * b[4], a[5] * b[5], a[6] * b[6], a[7] * b[7], a[8] * b[8], a[9] * b[9], a[10] * b[10], a[11] * b[11], a[12] * b[12], a[13] * b[13], a[14] * b[14], a[15] * b[15]]
},SpiderGL.Math.Mat4.compDiv = function (a, b) {
    return [a[0] / b[0], a[1] / b[1], a[2] / b[2], a[3] / b[3], a[4] / b[4], a[5] / b[5], a[6] / b[6], a[7] / b[7], a[8] / b[8], a[9] / b[9], a[10] / b[10], a[11] / b[11], a[12] / b[12], a[13] / b[13], a[14] / b[14], a[15] / b[15]]
},SpiderGL.Math.Mat4.transpose = function (a) {
    return [a[0], a[4], a[8], a[12], a[1], a[5], a[9], a[13], a[2], a[6], a[10], a[14], a[3], a[7], a[11], a[15]]
},SpiderGL.Math.Mat4.determinant = function (a) {
    var b = a[0], c = a[1], d = a[2], e = a[3], f = a[4], g = a[5], h = a[6], i = a[7], j = a[8], k = a[9], l = a[10],
        m = a[11], n = a[12], o = a[13], p = a[14], q = a[15];
    return n * k * h * e - j * o * h * e - n * g * l * e + f * o * l * e + j * g * p * e - f * k * p * e - n * k * d * i + j * o * d * i + n * c * l * i - b * o * l * i - j * c * p * i + b * k * p * i + n * g * d * m - f * o * d * m - n * c * h * m + b * o * h * m + f * c * p * m - b * g * p * m - j * g * d * q + f * k * d * q + j * c * h * q - b * k * h * q - f * c * l * q + b * g * l * q
},SpiderGL.Math.Mat4.inverse = function (a) {
    var b = a[0], c = a[1], d = a[2], e = a[3], f = a[4], g = a[5], h = a[6], i = a[7], j = a[8], k = a[9], l = a[10],
        m = a[11], n = a[12], o = a[13], p = a[14], q = a[15],
        r = 1 / (n * k * h * e - j * o * h * e - n * g * l * e + f * o * l * e + j * g * p * e - f * k * p * e - n * k * d * i + j * o * d * i + n * c * l * i - b * o * l * i - j * c * p * i + b * k * p * i + n * g * d * m - f * o * d * m - n * c * h * m + b * o * h * m + f * c * p * m - b * g * p * m - j * g * d * q + f * k * d * q + j * c * h * q - b * k * h * q - f * c * l * q + b * g * l * q);
    return [r * (k * p * i - o * l * i + o * h * m - g * p * m - k * h * q + g * l * q), r * (o * l * e - k * p * e - o * d * m + c * p * m + k * d * q - c * l * q), r * (g * p * e - o * h * e + o * d * i - c * p * i - g * d * q + c * h * q), r * (k * h * e - g * l * e - k * d * i + c * l * i + g * d * m - c * h * m), r * (n * l * i - j * p * i - n * h * m + f * p * m + j * h * q - f * l * q), r * (j * p * e - n * l * e + n * d * m - b * p * m - j * d * q + b * l * q), r * (n * h * e - f * p * e - n * d * i + b * p * i + f * d * q - b * h * q), r * (f * l * e - j * h * e + j * d * i - b * l * i - f * d * m + b * h * m), r * (j * o * i - n * k * i + n * g * m - f * o * m - j * g * q + f * k * q), r * (n * k * e - j * o * e - n * c * m + b * o * m + j * c * q - b * k * q), r * (f * o * e - n * g * e + n * c * i - b * o * i - f * c * q + b * g * q), r * (j * g * e - f * k * e - j * c * i + b * k * i + f * c * m - b * g * m), r * (n * k * h - j * o * h - n * g * l + f * o * l + j * g * p - f * k * p), r * (j * o * d - n * k * d + n * c * l - b * o * l - j * c * p + b * k * p), r * (n * g * d - f * o * d - n * c * h + b * o * h + f * c * p - b * g * p), r * (f * k * d - j * g * d + j * c * h - b * k * h - f * c * l + b * g * l)]
};
SpiderGL.Math.Mat4.inverseTranspose33 = function (a) {
    var b = a[0], c = a[1], d = a[2], e = a[4], f = a[5], g = a[6], h = a[8], i = a[9], j = a[10],
        k = 1 / (b * (j * f - g * i) - c * (j * e - g * h) + d * (i * e - f * h));
    return [k * (j * f - g * i), k * (g * h - j * e), k * (i * e - f * h), k * (d * i - j * c), k * (j * b - d * h), k * (c * h - i * b), k * (g * c - d * f), k * (d * e - g * b), k * (f * b - c * e)]
};
SpiderGL.Math.Mat4.trace = function (a) {
    return a[0] + a[5] + a[10] + a[15]
}, SpiderGL.Math.Mat4.translation = function (a) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, a[0], a[1], a[2], 1]
}, SpiderGL.Math.Mat4.rotationAngleAxis = function (a, b) {
    var j, k, l, m, n, o, p, q, r, c = SpiderGL.Math.Vec3.normalize(b), d = SpiderGL.Math.sin(a),
        e = SpiderGL.Math.cos(a), f = 1 - e, g = c[0], h = c[1], i = c[2];
    return j = g * g, k = h * h, l = i * i, m = g * h, n = h * i, o = i * g, p = g * d, q = h * d, r = i * d, [f * j + e, f * m + r, f * o - q, 0, f * m - r, f * k + e, f * n + p, 0, f * o + q, f * n - p, f * l + e, 0, 0, 0, 0, 1]
}, SpiderGL.Math.Mat4.scaling = function (a) {
    return [a[0], 0, 0, 0, 0, a[1], 0, 0, 0, 0, a[2], 0, 0, 0, 0, 1]
}, SpiderGL.Math.Mat4.lookAt = function (a, b, c) {
    var d = SpiderGL.Math.Vec3.normalize(SpiderGL.Math.Vec3.sub(b, a)), e = SpiderGL.Math.Vec3.normalize(c),
        f = SpiderGL.Math.Vec3.normalize(SpiderGL.Math.Vec3.cross(d, e));
    e = SpiderGL.Math.Vec3.cross(f, d);
    var g = [f[0], e[0], -d[0], 0, f[1], e[1], -d[1], 0, f[2], e[2], -d[2], 0, 0, 0, 0, 1];
    return SpiderGL.Math.Mat4.translate$(g, SpiderGL.Math.Vec3.neg(a))
}, SpiderGL.Math.Mat4.ortho = function (a, b) {
    var c = SpiderGL.Math.Vec3.add(b, a), d = SpiderGL.Math.Vec3.sub(b, a);
    return [2 / d[0], 0, 0, 0, 0, 2 / d[1], 0, 0, 0, 0, -2 / d[2], 0, -c[0] / d[0], -c[1] / d[1], -c[2] / d[2], 1]
}, SpiderGL.Math.Mat4.frustum = function (a, b) {
    var c = SpiderGL.Math.Vec3.add(b, a), d = SpiderGL.Math.Vec3.sub(b, a), e = 2 * a[2];
    return [e / d[0], 0, 0, 0, 0, e / d[1], 0, 0, c[0] / d[0], c[1] / d[1], -c[2] / d[2], -1, 0, 0, -e * b[2] / d[2], 0]
}, SpiderGL.Math.Mat4.perspective = function (a, b, c, d) {
    var e = c * SpiderGL.Math.tan(a / 2), f = e * b;
    return SpiderGL.Math.Mat4.frustum([-f, -e, c], [f, e, d])
}, SpiderGL.Math.Mat4.copy$ = function (a, b) {
    for (var c = 0; c < 16; ++c) a[c] = b[c];
    return a
}, SpiderGL.Math.Mat4.identity$ = function (a) {
    return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = 1, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = 1, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a
}, SpiderGL.Math.Mat4.neg$ = function (a) {
    for (var b = 0; b < 16; ++b) a[b] = -a[b];
    return a
}, SpiderGL.Math.Mat4.add$ = function (a, b) {
    for (var c = 0; c < 16; ++c) a[c] += b[c];
    return a
}, SpiderGL.Math.Mat4.sub$ = function (a, b) {
    for (var c = 0; c < 16; ++c) a[c] -= b[c];
    return a
}, SpiderGL.Math.Mat4.mul$ = function (a, b) {
    var c = a[0], d = a[1], e = a[2], f = a[3], g = a[4], h = a[5], i = a[6], j = a[7], k = a[8], l = a[9], m = a[10],
        n = a[11], o = a[12], p = a[13], q = a[14], r = a[15], s = b[0], t = b[1], u = b[2], v = b[3], w = b[4],
        x = b[5], y = b[6], z = b[7], A = b[8], B = b[9], C = b[10], D = b[11], E = b[12], F = b[13], G = b[14],
        H = b[15];
    return a[0] = c * s + g * t + k * u + o * v, a[1] = d * s + h * t + l * u + p * v, a[2] = e * s + i * t + m * u + q * v, a[3] = f * s + j * t + n * u + r * v, a[4] = c * w + g * x + k * y + o * z, a[5] = d * w + h * x + l * y + p * z, a[6] = e * w + i * x + m * y + q * z, a[7] = f * w + j * x + n * y + r * z, a[8] = c * A + g * B + k * C + o * D, a[9] = d * A + h * B + l * C + p * D, a[10] = e * A + i * B + m * C + q * D, a[11] = f * A + j * B + n * C + r * D, a[12] = c * E + g * F + k * G + o * H, a[13] = d * E + h * F + l * G + p * H, a[14] = e * E + i * F + m * G + q * H, a[15] = f * E + j * F + n * G + r * H, a
}, SpiderGL.Math.Mat4.muls$ = function (a, b) {
    for (var c = 0; c < 16; ++c) a[c] *= b;
    return a
}, SpiderGL.Math.Mat4.compMul$ = function (a, b) {
    for (var c = 0; c < 16; ++c) a[c] *= b[c];
    return a
}, SpiderGL.Math.Mat4.compDiv$ = function (a, b) {
    for (var c = 0; c < 16; ++c) a[c] /= b[c];
    return a
}, SpiderGL.Math.Mat4.transpose$ = function (a) {
    var b;
    return b = a[1], a[1] = a[4], a[4] = b, b = a[2], a[2] = a[8], a[8] = b, b = a[3], a[3] = a[12], a[12] = b, b = a[6], a[6] = a[9], a[9] = b, b = a[7], a[7] = a[13], a[13] = b, b = a[11], a[11] = a[14], a[14] = b, a
}, SpiderGL.Math.Mat4.invert$ = function (a) {
    var b = a[0], c = a[1], d = a[2], e = a[3], f = a[4], g = a[5], h = a[6], i = a[7], j = a[8], k = a[9], l = a[10],
        m = a[11], n = a[12], o = a[13], p = a[14], q = a[15],
        r = 1 / (n * k * h * e - j * o * h * e - n * g * l * e + f * o * l * e + j * g * p * e - f * k * p * e - n * k * d * i + j * o * d * i + n * c * l * i - b * o * l * i - j * c * p * i + b * k * p * i + n * g * d * m - f * o * d * m - n * c * h * m + b * o * h * m + f * c * p * m - b * g * p * m - j * g * d * q + f * k * d * q + j * c * h * q - b * k * h * q - f * c * l * q + b * g * l * q);
    return a[0] = r * (k * p * i - o * l * i + o * h * m - g * p * m - k * h * q + g * l * q), a[1] = r * (o * l * e - k * p * e - o * d * m + c * p * m + k * d * q - c * l * q), a[2] = r * (g * p * e - o * h * e + o * d * i - c * p * i - g * d * q + c * h * q), a[3] = r * (k * h * e - g * l * e - k * d * i + c * l * i + g * d * m - c * h * m), a[4] = r * (n * l * i - j * p * i - n * h * m + f * p * m + j * h * q - f * l * q), a[5] = r * (j * p * e - n * l * e + n * d * m - b * p * m - j * d * q + b * l * q), a[6] = r * (n * h * e - f * p * e - n * d * i + b * p * i + f * d * q - b * h * q), a[7] = r * (f * l * e - j * h * e + j * d * i - b * l * i - f * d * m + b * h * m), a[8] = r * (j * o * i - n * k * i + n * g * m - f * o * m - j * g * q + f * k * q), a[9] = r * (n * k * e - j * o * e - n * c * m + b * o * m + j * c * q - b * k * q), a[10] = r * (f * o * e - n * g * e + n * c * i - b * o * i - f * c * q + b * g * q), a[11] = r * (j * g * e - f * k * e - j * c * i + b * k * i + f * c * m - b * g * m), a[12] = r * (n * k * h - j * o * h - n * g * l + f * o * l + j * g * p - f * k * p), a[13] = r * (j * o * d - n * k * d + n * c * l - b * o * l - j * c * p + b * k * p), a[14] = r * (n * g * d - f * o * d - n * c * h + b * o * h + f * c * p - b * g * p), a[15] = r * (f * k * d - j * g * d + j * c * h - b * k * h - f * c * l + b * g * l), a
}, SpiderGL.Math.Mat4.translate$ = function (a, b) {
    var c = b[0], d = b[1], e = b[2];
    return a[12] = a[0] * c + a[4] * d + a[8] * e + a[12], a[13] = a[1] * c + a[5] * d + a[9] * e + a[13], a[14] = a[2] * c + a[6] * d + a[10] * e + a[14], a[15] = a[3] * c + a[7] * d + a[11] * e + a[15], a
}, SpiderGL.Math.Mat4.rotateAngleAxis$ = function (a, b, c) {
    var d = SpiderGL.Math.Mat4.rotationAngleAxis(b, c);
    return SpiderGL.Math.Mat4.mul$(a, d)
}, SpiderGL.Math.Mat4.scale$ = function (a, b) {
    var c = b[0], d = b[1], e = b[2];
    return a[0] *= c, a[1] *= c, a[2] *= c, a[3] *= c, a[4] *= d, a[5] *= d, a[6] *= d, a[7] *= d, a[8] *= e, a[9] *= e, a[10] *= e, a[11] *= e, a
}, SpiderGL.Math.Quat = {}, SpiderGL.Math.Quat.dup = function (a) {
    return a.slice(0, 4)
}, SpiderGL.Math.Quat.identity = function () {
    return [0, 0, 0, 1]
}, SpiderGL.Math.Quat.inverse = function (a) {
    return [-a[0], -a[1], -a[2], a[3]]
}, SpiderGL.Math.Quat.mul = function (a, b) {
    var c = a[0], d = a[1], e = a[2], f = a[3], g = b[0], h = b[1], i = b[2], j = b[3];
    return [c * j + f * g + e * h - d * i, d * j + f * h + c * i - e * g, e * j + f * i + d * g - c * h, f * j - c * g - d * h - e * i]
}, SpiderGL.Math.Quat.muls = function (a, b) {
    return [a[0] * b, a[1] * b, a[2] * b, a[3] * b]
}, SpiderGL.Math.Quat.normalize = function (a) {
    var b = 1 / SpiderGL.Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]);
    return SpiderGL.Math.Quat.muls(a, b)
}, SpiderGL.Math.Quat.from33 = function (a) {
    var l, b = a[0], c = a[1], d = a[2], e = a[3], f = a[4], g = a[5], h = a[6], i = a[7], j = a[8], k = b + f + j;
    return k > 0 ? (k += 1, l = .5 / SpiderGL.Math.sqrt(k), [(g - i) * l, (h - d) * l, (c - e) * l, k * l]) : b > f && b > j ? (k = b - f - j + 1, l = .5 / SpiderGL.Math.sqrt(k), [k * l, (c + e) * l, (h + d) * l, (g - i) * l]) : f > j ? (k = -b + f - j + 1, l = .5 / SpiderGL.Math.sqrt(k), [(c + e) * l, k * l, (g + i) * l, (h - d) * l]) : (k = -b - f + j + 1, l = .5 / SpiderGL.Math.sqrt(k), [(h + d) * l, (g + i) * l, k * l, (c - e) * l])
}, SpiderGL.Math.Quat.to33 = function (a) {
    var b = a[0], c = a[1], d = a[2], e = a[3], f = b * b, g = b * c, h = b * d, i = b * e, j = c * c, k = c * d,
        l = c * e, m = d * d, n = d * e;
    return [1 - 2 * (j + m), 2 * (g + n), 2 * (h - l), 2 * (g - n), 1 - 2 * (f + m), 2 * (k + i), 2 * (h + l), 2 * (k - i), 1 - 2 * (f + j)]
}, SpiderGL.Math.Quat.from44 = function (a) {
    return SpiderGL.Math.Quat.from33(SpiderGL.Math.Mat4.to33(a))
}, SpiderGL.Math.Quat.to44 = function (a) {
    return SpiderGL.Math.Mat3.to44(SpiderGL.Math.Quat.to33(a))
}, SpiderGL.Math.Quat.fromAngleAxis = function (a, b) {
    return [0, 0, 0, 1]
}, SpiderGL.Math.Quat.toAngleAxis = function (a) {
    return [0, 0, 0, 1]
}, SpiderGL.Math.Quat.fromEulerAngles = function (a, b, c) {
    return [0, 0, 0, 1]
}, SpiderGL.Math.Quat.toEulerAngles = function (a) {
    return [0, 0, 0, 1]
}, SpiderGL.Math.Quat.copy$ = function (a, b) {
    return a[0] = b[0], a[1] = b[1], a[2] = b[2], a[3] = b[3], a
}, SpiderGL.Math.Quat.identity$ = function (a) {
    return a[0] = 0, a[1] = 0, a[2] = 0, a[3] = 1, a
}, SpiderGL.Math.Quat.invert$ = function (a) {
    return a[0] = -a[0], a[1] = -a[1], a[2] = -a[2], a
}, SpiderGL.Math.Quat.mul$ = function (a) {
    var b = p[0], c = p[1], d = p[2], e = p[3], f = a[0], g = a[1], h = a[2], i = a[3];
    return a[0] = b * i + e * f + d * g - c * h, a[1] = c * i + e * g + b * h - d * f, a[2] = d * i + e * h + c * f - b * g, a[3] = e * i - b * f - c * g - d * h, a
}, SpiderGL.Math.Quat.muls$ = function (a, b) {
    return a[0] *= b, a[1] *= b, a[2] *= b, a[3] *= b, a
}, SpiderGL.Math.Quat.normalize$ = function (a) {
    var b = 1 / SpiderGL.Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]);
    return SpiderGL.Math.Quat.muls$(a, b)
}, SpiderGL.Math.project = function (a, b, c, d) {
    var e = SpiderGL.Math.Vec3, f = SpiderGL.Math.Mat4, g = f.mul4(b, a), h = 1 / g[3];
    return g[3] = h, e.muls$(g, h / 2), e.adds$(g, .5), e.mul$(g, [c[2], c[3], d[1] - d[0]]), e.add$(g, [c[0], c[1], d[0]]), g
}, SpiderGL.Math.unproject = function (a, b, c, d) {
    var e = SpiderGL.Math.Vec3, f = SpiderGL.Math.Mat4, g = e.to4(a, 1);
    e.sub$(g, [c[0], c[1], d[0]]), e.div$(g, [c[2], c[3], d[1] - d[0]]), e.muls$(g, 2), e.subs$(g, 1), g = f.mul4(b, g);
    var h = 1 / g[3];
    return g[3] = h, e.muls$(g, h), g
}, SpiderGL.Space = {}, SpiderGL.Space.MatrixStack = function (a) {
    SpiderGL.Core.ObjectBase.call(this), this._onChange = null, this.reset(), this._onChange = a
}, SpiderGL.Space.MatrixStack.prototype = {
    _invalidate: function () {
        this._i = null, this._t = null, this._it = null, this._onChange && this._onChange(this)
    }, reset: function () {
        var a = SpiderGL.Math.Mat4.identity();
        this._s = [a], this._l = 1, this._m = a, this._i = a, this._t = a, this._it = a, this._onChange && this._onChange(this)
    }, get onChange() {
        return this._onChange
    }, set onChange(a) {
        this._onChange = a
    }, get size() {
        return this._l
    }, get matrix$() {
        return this._m
    }, get matrix() {
        return SpiderGL.Math.Mat4.dup(this.matrix$)
    }, get top$() {
        return this.matrix$
    }, get top() {
        return this.matrix
    }, get inverse$() {
        return this._i || (this._i = SpiderGL.Math.Mat4.inverse(this._m))
    }, get inverse() {
        return SpiderGL.Math.Mat4.dup(this.inverse$)
    }, get transpose$() {
        return this._t || (this._t = SpiderGL.Math.Mat4.transpose(this._m))
    }, get transpose() {
        return SpiderGL.Math.Mat4.dup(this.transpose$)
    }, get inverseTranspose$() {
        return this._it || (this._it = SpiderGL.Math.Mat4.transpose(this.inverse$))
    }, get inverseTranspose() {
        return SpiderGL.Math.Mat4.dup(this.inverseTranspose$)
    }, push: function () {
        var a = SpiderGL.Math.Mat4.dup(this._m);
        this._s.push(a), this._l++, this._m = a
    }, pop: function () {
        this._l <= 1 || (this._s.pop(), this._l--, this._m = this._s[this._l - 1], this._invalidate())
    }, load: function (a) {
        a = SpiderGL.Math.Mat4.dup(a), this._s[this._l - 1] = a, this._m = a, this._invalidate()
    }, loadIdentity: function () {
        var a = SpiderGL.Math.Mat4.identity$(this._m);
        this._i = a, this._t = a, this._it = a
    }, multiply: function (a) {
        SpiderGL.Math.Mat4.mul$(this._m, a), this._invalidate()
    }, ortho: function (a, b) {
        SpiderGL.Math.Mat4.mul$(this._m, SpiderGL.Math.Mat4.ortho(a, b)), this._invalidate()
    }, frustum: function (a, b) {
        SpiderGL.Math.Mat4.mul$(this._m, SpiderGL.Math.Mat4.frustum(a, b)), this._invalidate()
    }, perspective: function (a, b, c, d) {
        SpiderGL.Math.Mat4.mul$(this._m, SpiderGL.Math.Mat4.perspective(a, b, c, d)), this._invalidate()
    }, lookAt: function (a, b, c) {
        SpiderGL.Math.Mat4.mul$(this._m, SpiderGL.Math.Mat4.lookAt(a, b, c)), this._invalidate()
    }, translate: function (a) {
        SpiderGL.Math.Mat4.translate$(this._m, a), this._invalidate()
    }, rotate: function (a, b) {
        SpiderGL.Math.Mat4.rotateAngleAxis$(this._m, a, b), this._invalidate()
    }, scale: function (a) {
        SpiderGL.Math.Mat4.scale$(this._m, a), this._invalidate()
    }
}, SpiderGL.Type.extend(SpiderGL.Space.MatrixStack, SpiderGL.Core.ObjectBase), SpiderGL.Space.ViewportStack = function (a) {
    SpiderGL.Core.ObjectBase.call(this), this._onChange = null, this.reset(), this._onChange = a
}, SpiderGL.Space.ViewportStack.prototype = {
    _invalidate: function () {
        this._onChange && this._onChange(this)
    }, reset: function () {
        var a = [0, 0, 1, 1];
        this._s = [a], this._l = 1, this._r = a, this._onChange && this._onChange(this)
    }, get onChange() {
        return this._onChange
    }, set onChange(a) {
        this._onChange = a
    }, get size() {
        return this._l
    }, get rect$() {
        return this._r
    }, get rect() {
        return this.rect$.slice(0, 4)
    }, get top$() {
        return this.rect$
    }, get top() {
        return this.rect
    }, push: function () {
        var a = this._r.slice(0, 4);
        this._s.push(a), this._l++, this._r = a
    }, pop: function () {
        this._l <= 1 || (this._s.pop(), this._l--, this._r = this._s[this._l - 1], this._invalidate())
    }, load: function (a) {
        a = a.slice(0, 4), this._s[this._l - 1] = a, this._r = a, this._invalidate()
    }, loadIdentity: function () {
        var a = [0, 0, 1, 1];
        this._r = a
    }, inner: function (a) {
        this._r[0] += a[0], this._r[1] += a[1], this._r[2] = a[2], this._r[3] = a[3], this._invalidate()
    }
}, SpiderGL.Type.extend(SpiderGL.Space.ViewportStack, SpiderGL.Core.ObjectBase), SpiderGL.Space.DepthRangeStack = function (a) {
    SpiderGL.Core.ObjectBase.call(this), this._onChange = null, this.reset(), this._onChange = a
}, SpiderGL.Space.DepthRangeStack.prototype = {
    _invalidate: function () {
        this._onChange && this._onChange(this)
    }, reset: function () {
        var a = [0, 1];
        this._s = [a], this._l = 1, this._r = a, this._onChange && this._onChange(this)
    }, get onChange() {
        return this._onChange
    }, set onChange(a) {
        this._onChange = a
    }, get size() {
        return this._l
    }, get range$() {
        return this._r
    }, get range() {
        return this.range$.slice(0, 2)
    }, get top$() {
        return this.range$
    }, get top() {
        return this.range
    }, push: function () {
        var a = this._r.slice(0, 2);
        this._s.push(a), this._l++, this._r = a
    }, pop: function () {
        this._l <= 1 || (this._s.pop(), this._l--, this._r = this._s[this._l - 1], this._invalidate())
    }, load: function (a) {
        a = a.slice(0, 2), this._s[this._l - 1] = a, this._r = a, this._invalidate()
    }, loadIdentity: function () {
        var a = [0, 1];
        this._r = a
    }, inner: function (a) {
        this._r[0] += a[0], this._r[1] = a[1], this._invalidate()
    }
}, SpiderGL.Type.extend(SpiderGL.Space.DepthRangeStack, SpiderGL.Core.ObjectBase), SpiderGL.Space.TransformationStack = function () {
    SpiderGL.Core.ObjectBase.call(this);
    var a = this;
    this._mv = {}, this._vp = {}, this._mvp = {}, this._n = {}, this._c = {}, this._m = new SpiderGL.Space.MatrixStack(function () {
        a._mv = {}, a._mvp = {}, a._n = {}, a._c = {}
    }), this._v = new SpiderGL.Space.MatrixStack(function () {
        a._mv = {}, a._vp = {}, a._mvp = {}, a._n = {}, a._c = {}
    }), this._p = new SpiderGL.Space.MatrixStack(function () {
        a._vp = {}, a._mvp = {}
    }), this._viewport = new SpiderGL.Space.ViewportStack(function () {
    }), this._depth = new SpiderGL.Space.DepthRangeStack(function () {
    })
}, SpiderGL.Space.TransformationStack.prototype = {
    reset: function () {
        this._m.reset(), this._v.reset(), this._p.reset()
    }, get viewport() {
        return this._viewport
    }, get viewportRect$() {
        return this._viewport.rect$
    }, get viewportRect() {
        return this._viewport.rect
    }, get depth() {
        return this._depth
    }, get depthRange$() {
        return this._depth.range$
    }, get depthRange() {
        return this._depth.range
    }, get model() {
        return this._m
    }, get modelMatrix$() {
        return this._m.matrix$
    }, get modelMatrix() {
        return this._m.matrix
    }, get modelMatrixInverse$() {
        return this._m.inverse$
    }, get modelMatrixInverse() {
        return this._m.inverse
    }, get modelMatrixTranspose$() {
        return this._m.transpose$
    }, get modelMatrixTranspose() {
        return this._m.transpose
    }, get modelMatrixInverseTranspose$() {
        return this._m.inverseTranspose$
    }, get modelMatrixInverseTranspose() {
        return this._m.inverseTranspose
    }, get view() {
        return this._v
    }, get viewMatrix$() {
        return this._v.matrix$
    }, get viewMatrix() {
        return this._v.matrix
    }, get viewMatrixInverse$() {
        return this._v.inverse$
    }, get viewMatrixInverse() {
        return this._v.inverse
    }, get viewMatrixTranspose$() {
        return this._v.transpose$
    }, get viewMatrixTranspose() {
        return this._v.transpose
    }, get viewMatrixInverseTranspose$() {
        return this._v.inverseTranspose$
    }, get viewMatrixInverseTranspose() {
        return this._v.inverseTranspose
    }, get projection() {
        return this._p
    }, get projectionMatrix$() {
        return this._p.matrix$
    }, get projectionMatrix() {
        return this._p.matrix
    }, get projectionMatrixInverse$() {
        return this._p.inverse$
    }, get projectionMatrixInverse() {
        return this._p.inverse
    }, get projectionMatrixTranspose$() {
        return this._p.transpose$
    }, get projectionMatrixTranspose() {
        return this._p.transpose
    }, get projectionMatrixInverseTranspose$() {
        return this._p.inverseTranspose$
    }, get projectionMatrixInverseTranspose() {
        return this._p.inverseTranspose
    }, get modelViewMatrix$() {
        return this._mv.m || (this._mv.m = SpiderGL.Math.Mat4.mul(this.viewMatrix$, this.modelMatrix$))
    }, get modelViewMatrix() {
        return SpiderGL.Math.Mat4.dup(this.modelViewMatrix$);
    }, get modelViewMatrixInverse$() {
        return this._mv.i || (this._mv.i = SpiderGL.Math.Mat4.mul(this.modelMatrixInverse$, this.viewMatrixInverse$))
    }, get modelViewMatrixInverse() {
        return SpiderGL.Math.Mat4.dup(this.modelViewMatrixInverse$)
    }, get modelViewMatrixTranspose$() {
        return this._mv.t || (this._mv.t = SpiderGL.Math.Mat4.transpose(this.modelViewMatrix$))
    }, get modelViewMatrixTranspose() {
        return SpiderGL.Math.Mat4.dup(this.modelViewMatrixTranspose$)
    }, get modelViewMatrixInverseTranspose$() {
        return this._mv.it || (this._mv.it = SpiderGL.Math.Mat4.transpose(this.modelViewMatrixInverse$))
    }, get modelViewMatrixInverseTranspose() {
        return SpiderGL.Math.Mat4.dup(this.modelViewMatrixInverseTranspose$)
    }, get viewProjectionMatrix$() {
        return this._vp.m || (this._vp.m = SpiderGL.Math.Mat4.mul(this.projectionMatrix$, this.viewMatrix$))
    }, get viewProjectionMatrix() {
        return SpiderGL.Math.Mat4.dup(this.viewProjectionMatrix$)
    }, get viewProjectionMatrixInverse$() {
        return this._vp.i || (this._vp.i = SpiderGL.Math.Mat4.mul(this.viewMatrixInverse$, this.projectionMatrixInverse$))
    }, get viewProjectionMatrixInverse() {
        return SpiderGL.Math.Mat4.dup(this.viewProjectionMatrixInverse$)
    }, get viewProjectionMatrixTranspose$() {
        return this._vp.t || (this._vp.t = SpiderGL.Math.Mat4.transpose(this.viewProjectionMatrix$))
    }, get viewProjectionMatrixTranspose() {
        return SpiderGL.Math.Mat4.dup(this.viewProjectionMatrixTranspose$)
    }, get viewProjectionMatrixInverseTranspose$() {
        return this._vp.it || (this._vp.it = SpiderGL.Math.Mat4.transpose(this.viewProjectionMatrixInverse$))
    }, get viewProjectionMatrixInverseTranspose() {
        return SpiderGL.Math.Mat4.dup(this.viewProjectionMatrixInverseTranspose$)
    }, get modelViewProjectionMatrix$() {
        return this._mvp.m || (this._mvp.m = SpiderGL.Math.Mat4.mul(this.viewProjectionMatrix$, this.modelMatrix$))
    }, get modelViewProjectionMatrix() {
        return SpiderGL.Math.Mat4.dup(this.modelViewProjectionMatrix$)
    }, get modelViewProjectionMatrixInverse$() {
        return this._mvp.i || (this._mvp.i = SpiderGL.Math.Mat4.inverse(this.modelViewProjectionMatrix$))
    }, get modelViewProjectionMatrixInverse() {
        return SpiderGL.Math.Mat4.dup(this.modelViewProjectionMatrixInverse$)
    }, get modelViewProjectionMatrixTranspose$() {
        return this._mvp.t || (this._mvp.t = SpiderGL.Math.Mat4.transpose(this.modelViewProjectionMatrix$))
    }, get modelViewProjectionMatrixTranspose() {
        return SpiderGL.Math.Mat4.dup(this.modelViewProjectionMatrixTranspose$)
    }, get modelViewProjectionMatrixInverseTranspose$() {
        return this._mvp.it || (this._mvp.it = SpiderGL.Math.Mat4.transpose(this.modelViewProjectionMatrixInverse$))
    }, get modelViewProjectionMatrixInverseTranspose() {
        return SpiderGL.Math.Mat4.dup(this.modelViewProjectionMatrixInverseTranspose$)
    }, get worldSpaceNormalMatrix$() {
        return this._n.m || (this._n.m = SpiderGL.Math.Mat4.inverseTranspose33(this.modelMatrix$))
    }, get worldSpaceNormalMatrix() {
        return SpiderGL.Math.Mat4.dup(this.worldSpaceNormalMatrix$)
    }, get viewSpaceNormalMatrix$() {
        return this._n.v || (this._n.v = SpiderGL.Math.Mat4.inverseTranspose33(this.modelViewMatrix$))
    }, get viewSpaceNormalMatrix() {
        return SpiderGL.Math.Mat4.dup(this.viewSpaceNormalMatrix$)
    }, get modelSpaceViewerPosition$() {
        return this._c.mp || (this._c.mp = SpiderGL.Math.Vec4.to3(SpiderGL.Math.Mat4.col(this.modelViewMatrixInverse$, 3)))
    }, get modelSpaceViewerPosition() {
        return SpiderGL.Math.Vec3.dup(this.modelSpaceViewerPosition$)
    }, get worldSpaceViewerPosition$() {
        return this._c.wp || (this._c.wp = SpiderGL.Math.Vec4.to3(SpiderGL.Math.Mat4.col(this.viewMatrixInverse$, 3)))
    }, get worldSpaceViewerPosition() {
        return SpiderGL.Math.Vec3.dup(this.worldSpaceViewerPosition$)
    }, get modelSpaceViewDirection$() {
        return this._c.md || (this._c.md = SpiderGL.Math.Vec3.normalize$(SpiderGL.Math.Vec3.neg$(SpiderGL.Math.Vec4.to3(SpiderGL.Math.Mat4.row(this.modelViewMatrixInverse$, 2)))))
    }, get modelSpaceViewDirection() {
        return SpiderGL.Math.Vec3.dup(this.modelSpaceViewDirection$)
    }, get worldSpaceViewDirection$() {
        return this._c.wd || (this._c.wd = SpiderGL.Math.Vec3.normalize$(SpiderGL.Math.Vec3.neg$(SpiderGL.Math.Vec4.to3(SpiderGL.Math.Mat4.row(this.viewMatrixInverse$, 2)))))
    }, get worldSpaceViewDirection() {
        return SpiderGL.Math.Vec3.dup(this.worldSpaceViewDirection$)
    }, project: function (a) {
        return SpiderGL.Math.project(a, this.modelViewProjectionMatrix$, this.viewportRect$, this.depthRange$)
    }, unproject: function (a) {
        return SpiderGL.Math.unproject(a, this.modelViewProjectionMatrixInverse$, this.viewportRect$, this.depthRange$)
    }
}, SpiderGL.Type.extend(SpiderGL.Space.TransformationStack, SpiderGL.Core.ObjectBase), SpiderGL.WebGL = {}, SpiderGL.WebGL.Context = {}, SpiderGL.WebGL.Context.WEBGL_STRING = "experimental-webgl", SpiderGL.WebGL.Context.DEFAULT_UNPACK_FLIP_Y = !0, SpiderGL.WebGL.Context.DEFAULT_UNPACK_PREMULTIPLY_ALPHA = !1, SpiderGL.WebGL.Context.DEFAULT_UNPACK_COLORSPACE_CONVERSION = WebGLRenderingContext.prototype.NONE, SpiderGL.WebGL.Context.get = function (a, b) {
    var c = a;
    if (SpiderGL.Type.isString(c) && (c = SpiderGL.DOM.getElementById(c)), !SpiderGL.Type.instanceOf(c, HTMLCanvasElement)) return null;
    var d = c.getContext(SpiderGL.WebGL.Context.WEBGL_STRING, b);
    return d
}, SpiderGL.WebGL.Context._prepareContex = function (a) {
    if (a) {
        var b = a._spidergl;
        if (!b) {
            b = {}, a._spidergl = b, b.TAG = 0, b.gl = a;
            var c = {};
            b.glFunctions = c;
            for (var d in a) {
                var e = a[e];
                "function" == typeof e && (c[d] = e)
            }
        }
    }
}, SpiderGL.WebGL.Context._addExtension = function (a, b, c, d) {
    if (a) {
        var e = a.getExtension;
        a.getExtension = function (f) {
            if (f == b) {
                var g = this._spidergl;
                if (!g) return null;
                var h = g[c];
                if (!h) {
                    h = {}, h.TAG = 0;
                    var i = {};
                    h._ext = i, i[c] = h, i.sgl = g, i.gl = a;
                    var j = {};
                    if (i.glFunctions = j, !d(a, h)) return null;
                    g[c] = h
                }
                return h
            }
            return e.call(this, f)
        }
    }
}, SpiderGL.WebGL.Context._setup_SGL_current_binding = function (a, b) {
    if (!a) return !1;
    if (!b) return !1;
    if (!a._spidergl) return !1;
    if (a._spidergl.cb) return !1;
    var c = b, d = c._ext, e = d.glFunctions;
    d.currentBuffer = {}, d.currentBuffer[a.ARRAY_BUFFER] = a.getParameter(a.ARRAY_BUFFER_BINDING), d.currentBuffer[a.ELEMENT_ARRAY_BUFFER] = a.getParameter(a.ELEMENT_ARRAY_BUFFER_BINDING), d.bufferStack = {}, d.bufferStack[a.ARRAY_BUFFER] = [], d.bufferStack[a.ELEMENT_ARRAY_BUFFER] = [], e.bindBuffer = a.bindBuffer, a.bindBuffer = function (a, b) {
        var c = this._spidergl.cb._ext, d = c.currentBuffer[a];
        d != b && (c.currentBuffer[a] = b, c.glFunctions.bindBuffer.call(this, a, b))
    }, c.getCurrentBuffer = function (a) {
        return this._ext.currentBuffer[a]
    }, c.pushBuffer = function (a) {
        var b = this._ext, c = b.bufferStack[a], d = b.currentBuffer[a];
        c.push(d)
    }, c.popBuffer = function (a) {
        var b = this._ext, c = b.bufferStack[a];
        if (!(c.length <= 0)) {
            var d = c.pop();
            b.gl.bindBuffer(a, d)
        }
    }, d.currentFramebuffer = {}, d.currentFramebuffer[a.FRAMEBUFFER] = a.getParameter(a.FRAMEBUFFER_BINDING), d.framebufferStack = {}, d.framebufferStack[a.FRAMEBUFFER] = [], e.bindFramebuffer = a.bindFramebuffer, a.bindFramebuffer = function (a, b) {
        var c = this._spidergl.cb._ext, d = c.currentFramebuffer[a];
        d != b && (c.currentFramebuffer[a] = b, c.glFunctions.bindFramebuffer.call(this, a, b))
    }, c.getCurrentFramebuffer = function (a) {
        return this._ext.currentFramebuffer[a]
    }, c.pushFramebuffer = function (a) {
        var b = this._ext, c = b.framebufferStack[a], d = b.currentFramebuffer[a];
        c.push(d)
    }, c.popFramebuffer = function (a) {
        var b = this._ext, c = b.framebufferStack[a];
        if (!(c.length <= 0)) {
            var d = c.pop();
            b.gl.bindFramebuffer(a, d)
        }
    }, d.currentProgram = a.getParameter(a.CURRENT_PROGRAM), d.programStack = [], e.useProgram = a.useProgram, a.useProgram = function (a) {
        var b = this._spidergl.cb._ext, c = b.currentProgram;
        c != a && (b.currentProgram = a, b.glFunctions.useProgram.call(this, a))
    }, c.getCurrentProgram = function () {
        return this._ext.currentProgram
    }, c.pushProgram = function () {
        var a = this._ext, b = a.programStack, c = a.currentProgram;
        b.push(c)
    }, c.popProgram = function () {
        var a = this._ext, b = a.programStack;
        if (!(b.length <= 0)) {
            var c = b.pop();
            a.gl.useProgram(c)
        }
    }, d.currentRenderbuffer = {}, d.currentRenderbuffer[a.RENDERBUFFER] = a.getParameter(a.RENDERBUFFER_BINDING), d.renderbufferStack = {}, d.renderbufferStack[a.RENDERBUFFER] = [], e.bindRenderbuffer = a.bindRenderbuffer, a.bindRenderbuffer = function (a, b) {
        var c = this._spidergl.cb._ext, d = c.currentRenderbuffer[a];
        d != b && (c.currentRenderbuffer[a] = b, c.glFunctions.bindRenderbuffer.call(this, a, b))
    }, c.getCurrentRenderbuffer = function (a) {
        return this._ext.currentRenderbuffer[a]
    }, c.pushRenderbuffer = function (a) {
        var b = this._ext, c = b.renderbufferStack[a], d = b.currentRenderbuffer[a];
        c.push(d)
    }, c.popRenderbuffer = function (a) {
        var b = this._ext, c = b.renderbufferStack[a];
        if (!(c.length <= 0)) {
            var d = c.pop();
            b.gl.bindRenderbuffer(a, d)
        }
    }, d.currentShader = {}, d.currentShader[a.VERTEX_SHADER] = null, d.currentShader[a.FRAGMENT_SHADER] = null, d.shaderStack = {}, d.shaderStack[a.VERTEX_SHADER] = [], d.shaderStack[a.FRAGMENT_SHADER] = [], d.glFunctions.bindShader = function (a, b) {
    }, c.bindShader = function (a, b) {
        var c = this._ext, d = c.currentShader[a];
        d != b && (c.currentShader[a] = b, c.glFunctions.bindShader.call(c.gl, a, b))
    }, c.getCurrentShader = function (a) {
        return this._ext.currentShader[a]
    }, c.pushShader = function (a) {
        var b = this._ext, c = b.shaderStack[a], d = b.currentShader[a];
        c.push(d)
    }, c.popShader = function (a) {
        var b = this._ext, c = b.shaderStack[a];
        if (!(c.length <= 0)) {
            var d = c.pop();
            b.gl.bindShader(a, d)
        }
    }, d.currentTexture = {};
    var f = a.getParameter(a.ACTIVE_TEXTURE), g = a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS);
    d.currentTexture = {}, d.textureStack = {}, d.textureUnitStack = [];
    for (var h = 0; h < g; ++h) {
        var i = a.TEXTURE0 + h;
        a.activeTexture(i);
        var j = {};
        j[a.TEXTURE_2D] = a.getParameter(a.TEXTURE_BINDING_2D), j[a.TEXTURE_CUBE_MAP] = a.getParameter(a.TEXTURE_BINDING_CUBE_MAP), d.currentTexture[i] = j;
        var k = {};
        k[a.TEXTURE_2D] = [], k[a.TEXTURE_CUBE_MAP] = [], d.textureStack[i] = k
    }
    return a.activeTexture(f), d.currentTextureUnit = f, e.activeTexture = a.activeTexture, a.activeTexture = function (a) {
        var b = this._spidergl.cb._ext, c = b.currentTextureUnit;
        c != a && (b.currentTextureUnit = a, b.glFunctions.activeTexture.call(this, a))
    }, c.getCurrentTextureUnit = function () {
        return this._ext.currentTextureUnit
    }, c.pushTextureUnit = function () {
        var a = this._ext, b = a.textureUnitStack, c = a.currentTextureUnit;
        b.push(c)
    }, c.popTextureUnit = function () {
        var a = this._ext, b = a.textureUnitStack;
        if (!(b.length <= 0)) {
            var c = b.pop();
            a.gl.activeTexture(c)
        }
    }, e.bindTexture = a.bindTexture, a.bindTexture = function (a, b) {
        var c = this._spidergl.cb._ext, d = c.currentTextureUnit, e = c.currentTexture[d][a];
        e != b && (c.currentTexture[d][a] = b, c.glFunctions.bindTexture.call(this, a, b))
    }, c.getCurrentTexture = function (a) {
        var b = this._ext, c = b.currentTextureUnit;
        return b.currentTexture[c][a]
    }, c.pushTexture = function (a) {
        var b = this._ext, c = b.currentTextureUnit, d = b.textureStack[c][a], e = b.currentTexture[c][a];
        d.push(e)
    }, c.popTexture = function (a) {
        var b = this._ext, c = b.currentTextureUnit, d = b.textureStack[c][a];
        if (!(d.length <= 0)) {
            var e = d.pop();
            b.gl.bindTexture(a, e)
        }
    }, !0
}, SpiderGL.WebGL.Context._setup_SGL_wrapper_notify = function (a, b) {
    if (!a) return !1;
    if (!b) return !1;
    if (!a._spidergl) return !1;
    if (a._spidergl.wn) return !1;
    var c = b, d = c._ext, e = d.glFunctions;
    return d.cb = a.getExtension("SGL_current_binding"), !!d.cb && (e.deleteBuffer = a.deleteBuffer, a.deleteBuffer = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.deleteBuffer.apply(this, arguments);
        var c = a;
        c && c._spidergl && c._spidergl._gl_deleteBuffer.apply(c._spidergl, arguments)
    }, e.isBuffer = a.isBuffer, a.isBuffer = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.isBuffer.apply(this, arguments), d = a;
        return d && d._spidergl && d._spidergl._gl_isBuffer.apply(d._spidergl, arguments), c
    }, e.bindBuffer = a.bindBuffer, a.bindBuffer = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.bindBuffer.apply(this, arguments);
        var c = b.cb.getCurrentBuffer(a);
        c && c._spidergl && c._spidergl._gl_bindBuffer.apply(c._spidergl, arguments)
    }, e.getBufferParameter = a.getBufferParameter, a.getBufferParameter = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.getBufferParameter.apply(this, arguments),
            d = b.cb.getCurrentBuffer(a);
        return d && d._spidergl && d._spidergl._gl_getBufferParameter.apply(d._spidergl, arguments), c
    }, e.bufferData = a.bufferData, a.bufferData = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.bufferData.apply(this, arguments);
        var c = b.cb.getCurrentBuffer(a);
        c && c._spidergl && c._spidergl._gl_bufferData.apply(c._spidergl, arguments)
    }, e.bufferSubData = a.bufferSubData, a.bufferSubData = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.bufferSubData.apply(this, arguments);
        var c = b.cb.getCurrentBuffer(a);
        c && c._spidergl && c._spidergl._gl_bufferSubData.apply(c._spidergl, arguments)
    }, e.vertexAttribPointer = a.vertexAttribPointer, a.vertexAttribPointer = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.vertexAttribPointer.apply(this, arguments);
        var b = this.ARRAY_BUFFER, c = a.cb.getCurrentBuffer(b);
        c && c._spidergl && c._spidergl._gl_vertexAttribPointer.apply(c._spidergl, arguments)
    }, e.drawElements = a.drawElements, a.drawElements = function (a, b, c, d, e) {
        var f = this._spidergl.wn._ext;
        f.glFunctions.drawElements.apply(this, arguments);
        var g = this.ELEMENT_ARRAY_BUFFER, h = f.cb.getCurrentBuffer(g);
        h && h._spidergl && h._spidergl._gl_drawElements.apply(h._spidergl, arguments)
    }, e.deleteFramebuffer = a.deleteFramebuffer, a.deleteFramebuffer = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.deleteFramebuffer.apply(this, arguments);
        var c = a;
        c && c._spidergl && c._spidergl._gl_deleteFramebuffer.apply(c._spidergl, arguments)
    }, e.isFramebuffer = a.isFramebuffer, a.isFramebuffer = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.isFramebuffer.apply(this, arguments), d = a;
        return d && d._spidergl && d._spidergl._gl_isFramebuffer.apply(d._spidergl, arguments), c
    }, e.bindFramebuffer = a.bindFramebuffer, a.bindFramebuffer = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.bindFramebuffer.apply(this, arguments);
        var c = b.cb.getCurrentFramebuffer(a);
        c && c._spidergl && c._spidergl._gl_bindFramebuffer.apply(c._spidergl, arguments)
    }, e.checkFramebufferStatus = a.checkFramebufferStatus, a.checkFramebufferStatus = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.checkFramebufferStatus.apply(this, arguments),
            d = b.cb.getCurrentFramebuffer(a);
        return d && d._spidergl && d._spidergl._gl_checkFramebufferStatus.apply(d._spidergl, arguments), c
    }, e.getFramebufferAttachmentParameter = a.getFramebufferAttachmentParameter, a.getFramebufferAttachmentParameter = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.getFramebufferAttachmentParameter.apply(this, arguments),
            d = b.cb.getCurrentFramebuffer(a);
        return d && d._spidergl && d._spidergl._gl_getFramebufferAttachmentParameter.apply(d._spidergl, arguments), c
    }, e.framebufferRenderbuffer = a.framebufferRenderbuffer, a.framebufferRenderbuffer = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.framebufferRenderbuffer.apply(this, arguments);
        var c = b.cb.getCurrentFramebuffer(a);
        c && c._spidergl && c._spidergl._gl_framebufferRenderbuffer.apply(c._spidergl, arguments)
    }, e.framebufferTexture2D = a.framebufferTexture2D, a.framebufferTexture2D = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.framebufferTexture2D.apply(this, arguments);
        var c = b.cb.getCurrentFramebuffer(a);
        c && c._spidergl && c._spidergl._gl_framebufferTexture2D.apply(c._spidergl, arguments)
    }, e.clear = a.clear, a.clear = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.clear.apply(this, arguments);
        var b = this.FRAMEBUFFER, c = a.cb.getCurrentFramebuffer(b);
        c && c._spidergl && c._spidergl._gl_clear.apply(c._spidergl, arguments)
    }, e.readPixels = a.readPixels, a.readPixels = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.readPixels.apply(this, arguments);
        var b = this.FRAMEBUFFER, c = a.cb.getCurrentFramebuffer(b);
        c && c._spidergl && c._spidergl._gl_readPixels.apply(c._spidergl, arguments)
    }, e.deleteProgram = a.deleteProgram, a.deleteProgram = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.deleteProgram.apply(this, arguments);
        var c = a;
        c && c._spidergl && c._spidergl._gl_deleteProgram.apply(c._spidergl, arguments)
    }, e.isProgram = a.isProgram, a.isProgram = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.isProgram.apply(this, arguments), d = a;
        return d && d._spidergl && d._spidergl._gl_isProgram.apply(d._spidergl, arguments), c
    }, e.useProgram = a.useProgram, a.useProgram = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.useProgram.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_useProgram.apply(b._spidergl, arguments)
    }, e.getActiveAttrib = a.getActiveAttrib, a.getActiveAttrib = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.getActiveAttrib.apply(this, arguments), d = a;
        return d && d._spidergl && d._spidergl._gl_getActiveAttrib.apply(d._spidergl, arguments), c
    }, e.getActiveUniform = a.getActiveUniform, a.getActiveUniform = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.getActiveUniform.apply(this, arguments), d = a;
        return d && d._spidergl && d._spidergl._gl_getActiveUniform.apply(d._spidergl, arguments), c
    }, e.getAttachedShaders = a.getAttachedShaders, a.getAttachedShaders = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.getAttachedShaders.apply(this, arguments), d = a;
        return d && d._spidergl && d._spidergl._gl_getAttachedShaders.apply(d._spidergl, arguments), c
    }, e.getAttribLocation = a.getAttribLocation, a.getAttribLocation = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.getAttribLocation.apply(this, arguments), d = a;
        return d && d._spidergl && d._spidergl._gl_getAttribLocation.apply(d._spidergl, arguments), c
    }, e.getProgramParameter = a.getProgramParameter, a.getProgramParameter = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.getProgramParameter.apply(this, arguments), d = a;
        return d && d._spidergl && d._spidergl._gl_getProgramParameter.apply(d._spidergl, arguments), c
    }, e.getProgramInfoLog = a.getProgramInfoLog, a.getProgramInfoLog = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.getProgramInfoLog.apply(this, arguments), d = a;
        return d && d._spidergl && d._spidergl._gl_getProgramInfoLog.apply(d._spidergl, arguments), c
    }, e.getUniform = a.getUniform, a.getUniform = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.getUniform.apply(this, arguments), d = a;
        return d && d._spidergl && d._spidergl._gl_getUniform.apply(d._spidergl, arguments), c
    }, e.getUniformLocation = a.getUniformLocation, a.getUniformLocation = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.getUniformLocation.apply(this, arguments), d = a;
        return d && d._spidergl && d._spidergl._gl_getUniformLocation.apply(d._spidergl, arguments), c
    }, e.attachShader = a.attachShader, a.attachShader = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.attachShader.apply(this, arguments);
        var c = a;
        c && c._spidergl && c._spidergl._gl_attachShader.apply(c._spidergl, arguments)
    }, e.bindAttribLocation = a.bindAttribLocation, a.bindAttribLocation = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.bindAttribLocation.apply(this, arguments);
        var c = a;
        c && c._spidergl && c._spidergl._gl_bindAttribLocation.apply(c._spidergl, arguments)
    }, e.detachShader = a.detachShader, a.detachShader = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.detachShader.apply(this, arguments);
        var c = a;
        c && c._spidergl && c._spidergl._gl_detachShader.apply(c._spidergl, arguments)
    }, e.linkProgram = a.linkProgram, a.linkProgram = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.linkProgram.apply(this, arguments);
        var c = a;
        c && c._spidergl && c._spidergl._gl_linkProgram.apply(c._spidergl, arguments)
    }, e.uniform1f = a.uniform1f, a.uniform1f = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniform1f.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniform1f.apply(b._spidergl, arguments)
    }, e.uniform1fv = a.uniform1fv, a.uniform1fv = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniform1fv.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniform1fv.apply(b._spidergl, arguments)
    }, e.uniform1i = a.uniform1i, a.uniform1i = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniform1i.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniform1i.apply(b._spidergl, arguments)
    }, e.uniform1iv = a.uniform1iv, a.uniform1iv = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniform1iv.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniform1iv.apply(b._spidergl, arguments)
    }, e.uniform2f = a.uniform2f, a.uniform2f = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniform2f.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniform2f.apply(b._spidergl, arguments)
    }, e.uniform2fv = a.uniform2fv, a.uniform2fv = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniform2fv.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniform2fv.apply(b._spidergl, arguments)
    }, e.uniform2i = a.uniform2i, a.uniform2i = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniform2i.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniform2i.apply(b._spidergl, arguments)
    }, e.uniform2iv = a.uniform2iv, a.uniform2iv = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniform2iv.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniform2iv.apply(b._spidergl, arguments)
    }, e.uniform3f = a.uniform3f, a.uniform3f = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniform3f.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniform3f.apply(b._spidergl, arguments)
    }, e.uniform3fv = a.uniform3fv, a.uniform3fv = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniform3fv.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniform3fv.apply(b._spidergl, arguments)
    }, e.uniform3i = a.uniform3i, a.uniform3i = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniform3i.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniform3i.apply(b._spidergl, arguments)
    }, e.uniform3iv = a.uniform3iv, a.uniform3iv = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniform3iv.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniform3iv.apply(b._spidergl, arguments)
    }, e.uniform4f = a.uniform4f, a.uniform4f = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniform4f.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniform4f.apply(b._spidergl, arguments)
    }, e.uniform4fv = a.uniform4fv, a.uniform4fv = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniform4fv.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniform4fv.apply(b._spidergl, arguments)
    }, e.uniform4i = a.uniform4i, a.uniform4i = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniform4i.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniform4i.apply(b._spidergl, arguments)
    }, e.uniform4iv = a.uniform4iv, a.uniform4iv = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniform4iv.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniform4iv.apply(b._spidergl, arguments)
    }, e.uniformMatrix2fv = a.uniformMatrix2fv, a.uniformMatrix2fv = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniformMatrix2fv.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniformMatrix2fv.apply(b._spidergl, arguments)
    }, e.uniformMatrix3fv = a.uniformMatrix3fv, a.uniformMatrix3fv = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniformMatrix3fv.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniformMatrix3fv.apply(b._spidergl, arguments)
    }, e.uniformMatrix4fv = a.uniformMatrix4fv,a.uniformMatrix4fv = function () {
        var a = this._spidergl.wn._ext;
        a.glFunctions.uniformMatrix4fv.apply(this, arguments);
        var b = a.cb.getCurrentProgram();
        b && b._spidergl && b._spidergl._gl_uniformMatrix4fv.apply(b._spidergl, arguments)
    },e.validateProgram = a.validateProgram,a.validateProgram = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.validateProgram.apply(this, arguments);
        var c = a;
        c && c._spidergl && c._spidergl._gl_validateProgram.apply(c._spidergl, arguments)
    },e.deleteRenderbuffer = a.deleteRenderbuffer,a.deleteRenderbuffer = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.deleteRenderbuffer.apply(this, arguments);
        var c = a;
        c && c._spidergl && c._spidergl._gl_deleteRenderbuffer.apply(c._spidergl, arguments)
    },e.isRenderbuffer = a.isRenderbuffer,a.isRenderbuffer = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.isRenderbuffer.apply(this, arguments), d = a;
        return d && d._spidergl && d._spidergl._gl_isRenderbuffer.apply(d._spidergl, arguments), c
    },e.bindRenderbuffer = a.bindRenderbuffer,a.bindRenderbuffer = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.bindRenderbuffer.apply(this, arguments);
        var c = b.cb.getCurrentRenderbuffer(a);
        c && c._spidergl && c._spidergl._gl_bindRenderbuffer.apply(c._spidergl, arguments)
    },e.getRenderbufferParameter = a.getRenderbufferParameter,a.getRenderbufferParameter = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.getRenderbufferParameter.apply(this, arguments),
            d = b.cb.getCurrentRenderbuffer(a);
        return d && d._spidergl && d._spidergl._gl_getRenderbufferParameter.apply(d._spidergl, arguments), c
    },e.renderbufferStorage = a.renderbufferStorage,a.renderbufferStorage = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.renderbufferStorage.apply(this, arguments);
        var c = b.cb.getCurrentRenderbuffer(a);
        c && c._spidergl && c._spidergl._gl_renderbufferStorage.apply(c._spidergl, arguments)
    },e.deleteShader = a.deleteShader,a.deleteShader = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.deleteShader.apply(this, arguments);
        var c = a;
        c && c._spidergl && c._spidergl._gl_deleteShader.apply(c._spidergl, arguments)
    },e.isShader = a.isShader,a.isShader = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.isShader.apply(this, arguments), d = a;
        return d && d._spidergl && d._spidergl._gl_isShader.apply(d._spidergl, arguments), c
    },e.getShaderParameter = a.getShaderParameter,a.getShaderParameter = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.getShaderParameter.apply(this, arguments), d = a;
        return d && d._spidergl && d._spidergl._gl_getShaderParameter.apply(d._spidergl, arguments), c
    },e.getShaderInfoLog = a.getShaderInfoLog,a.getShaderInfoLog = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.getShaderInfoLog.apply(this, arguments), d = a;
        return d && d._spidergl && d._spidergl._gl_getShaderInfoLog.apply(d._spidergl, arguments), c
    },e.getShaderSource = a.getShaderSource,a.getShaderSource = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.getShaderSource.apply(this, arguments), d = a;
        return d && d._spidergl && d._spidergl._gl_getShaderSource.apply(d._spidergl, arguments), c
    },e.compileShader = a.compileShader,a.compileShader = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.compileShader.apply(this, arguments);
        var c = a;
        c && c._spidergl && c._spidergl._gl_compileShader.apply(c._spidergl, arguments)
    },e.shaderSource = a.shaderSource,a.shaderSource = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.shaderSource.apply(this, arguments);
        var c = a;
        c && c._spidergl && c._spidergl._gl_shaderSource.apply(c._spidergl, arguments)
    },d.textureTargetMap = {},d.textureTargetMap[a.TEXTURE_2D] = a.TEXTURE_2D,d.textureTargetMap[a.TEXTURE_CUBE_MAP] = a.TEXTURE_CUBE_MAP,d.textureTargetMap[a.TEXTURE_CUBE_MAP_POSITIVE_X] = a.TEXTURE_CUBE_MAP,d.textureTargetMap[a.TEXTURE_CUBE_MAP_NEGATIVE_X] = a.TEXTURE_CUBE_MAP,d.textureTargetMap[a.TEXTURE_CUBE_MAP_POSITIVE_Y] = a.TEXTURE_CUBE_MAP,d.textureTargetMap[a.TEXTURE_CUBE_MAP_NEGATIVE_Y] = a.TEXTURE_CUBE_MAP,d.textureTargetMap[a.TEXTURE_CUBE_MAP_POSITIVE_Z] = a.TEXTURE_CUBE_MAP,d.textureTargetMap[a.TEXTURE_CUBE_MAP_NEGATIVE_Z] = a.TEXTURE_CUBE_MAP,e.deleteTexture = a.deleteTexture,a.deleteTexture = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.deleteTexture.apply(this, arguments);
        var c = a;
        c && c._spidergl && c._spidergl._gl_deleteTexture.apply(c._spidergl, arguments)
    },e.isTexture = a.isTexture,a.isTexture = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.isTexture.apply(this, arguments), d = a;
        return d && d._spidergl && d._spidergl._gl_isTexture.apply(d._spidergl, arguments), c
    },e.bindTexture = a.bindTexture,a.bindTexture = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.bindTexture.apply(this, arguments);
        var c = b.cb.getCurrentTexture(a);
        c && c._spidergl && c._spidergl._gl_bindTexture.apply(c._spidergl, arguments)
    },e.getTexParameter = a.getTexParameter,a.getTexParameter = function (a) {
        var b = this._spidergl.wn._ext, c = b.glFunctions.getTexParameter.apply(this, arguments),
            d = b.cb.getCurrentTexture(a);
        return d && d._spidergl && d._spidergl._gl_getTexParameter.apply(d._spidergl, arguments), c
    },e.copyTexImage2D = a.copyTexImage2D,a.copyTexImage2D = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.copyTexImage2D.apply(this, arguments);
        var c = b.textureTargetMap[a], d = b.cb.getCurrentTexture(c);
        d && d._spidergl && d._spidergl._gl_copyTexImage2D.apply(d._spidergl, arguments)
    },e.copyTexSubImage2D = a.copyTexSubImage2D,a.copyTexSubImage2D = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.copyTexSubImage2D.apply(this, arguments);
        var c = b.textureTargetMap[a], d = b.cb.getCurrentTexture(c);
        d && d._spidergl && d._spidergl._gl_copyTexSubImage2D.apply(d._spidergl, arguments)
    },e.generateMipmap = a.generateMipmap,a.generateMipmap = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.generateMipmap.apply(this, arguments);
        var c = b.cb.getCurrentTexture(a);
        c && c._spidergl && c._spidergl._gl_generateMipmap.apply(c._spidergl, arguments)
    },e.texImage2D = a.texImage2D,a.texImage2D = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.texImage2D.apply(this, arguments);
        var c = b.textureTargetMap[a], d = b.cb.getCurrentTexture(c);
        d && d._spidergl && d._spidergl._gl_texImage2D.apply(d._spidergl, arguments)
    },e.texParameterf = a.texParameterf,a.texParameterf = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.texParameterf.apply(this, arguments);
        var c = b.cb.getCurrentTexture(a);
        c && c._spidergl && c._spidergl._gl_texParameterf.apply(c._spidergl, arguments)
    },e.texParameteri = a.texParameteri,a.texParameteri = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.texParameteri.apply(this, arguments);
        var c = b.cb.getCurrentTexture(a);
        c && c._spidergl && c._spidergl._gl_texParameteri.apply(c._spidergl, arguments)
    },e.texSubImage2D = a.texSubImage2D,a.texSubImage2D = function (a) {
        var b = this._spidergl.wn._ext;
        b.glFunctions.texSubImage2D.apply(this, arguments);
        var c = b.textureTargetMap[a], d = b.cb.getCurrentTexture(c);
        d && d._spidergl && d._spidergl._gl_texSubImage2D.apply(d._spidergl, arguments)
    },!0)
}, SpiderGL.WebGL.Context._setup_SGL_direct_state_access = function (a, b) {
    if (!a) return !1;
    if (!b) return !1;
    if (!a._spidergl) return !1;
    if (a._spidergl.dsa) return !1;
    var c = b, d = c._ext;
    d.glFunctions;
    return d.cb = a.getExtension("SGL_current_binding"), !!d.cb && (c.getBufferParameter = function (a, b, c) {
        var d = this._ext, e = d.gl, f = d.cb.getCurrentBuffer(b);
        f != a && e.bindBuffer(b, a);
        var g = e.getBufferParameter(b, c);
        return f != a && e.bindBuffer(b, f), g
    }, c.bufferData = function (a, b, c, d) {
        var e = this._ext, f = e.gl, g = e.cb.getCurrentBuffer(b);
        g != a && f.bindBuffer(b, a), f.bufferData(b, c, d), g != a && f.bindBuffer(b, g)
    }, c.bufferSubData = function (a, b, c, d) {
        var e = this._ext, f = e.gl, g = e.cb.getCurrentBuffer(b);
        g != a && f.bindBuffer(b, a), f.bufferSubData(b, c, d), g != a && f.bindBuffer(b, g)
    }, c.vertexAttribPointer = function (a, b, c, d, e, f, g) {
        var h = this._ext, i = h.gl, j = i.ARRAY_BUFFER, k = h.cb.getCurrentBuffer(j);
        k != a && i.bindBuffer(j, a), i.vertexAttribPointer(b, c, d, e, f, g), k != a && i.bindBuffer(j, k)
    }, c.drawElements = function (a, b, c, d, e) {
        var f = this._ext, g = f.gl, h = g.ELEMENT_ARRAY_BUFFER, i = f.cb.getCurrentBuffer(h);
        i != a && g.bindBuffer(h, a), g.drawElements(b, c, d, e), i != a && g.bindBuffer(h, i)
    }, c.checkFramebufferStatus = function (a, b) {
        var c = this._ext, d = c.gl, e = c.cb.getCurrentFramebuffer(b);
        e != a && d.bindFramebuffer(b, a);
        var f = d.checkFramebufferStatus(b);
        return e != a && d.bindFramebuffer(b, e), f
    }, c.getFramebufferAttachmentParameter = function (a, b, c, d) {
        var e = this._ext, f = e.gl, g = e.cb.getCurrentFramebuffer(b);
        g != a && f.bindFramebuffer(b, a);
        var h = f.getFramebufferAttachmentParameter(b, c, d);
        return g != a && f.bindFramebuffer(b, g), h
    }, c.framebufferRenderbuffer = function (a, b, c, d, e) {
        var f = this._ext, g = f.gl, h = f.cb.getCurrentFramebuffer(b);
        h != a && g.bindFramebuffer(b, a), g.framebufferRenderbuffer(b, c, d, e), h != a && g.bindFramebuffer(b, h)
    }, c.framebufferTexture2D = function (a, b, c, d, e, f) {
        var g = this._ext, h = g.gl, i = g.cb.getCurrentFramebuffer(b);
        i != a && h.bindFramebuffer(b, a), h.framebufferTexture2D(b, c, d, e, f), i != a && h.bindFramebuffer(b, i)
    }, c.clear = function (a, b) {
        var c = this._ext, d = c.gl, e = d.FRAMEBUFFER, f = c.cb.getCurrentFramebuffer(e);
        f != a && d.bindFramebuffer(e, a), d.clear(b), f != a && d.bindFramebuffer(e, f)
    }, c.readPixels = function (a, b, c, d, e, f, g, h) {
        var i = this._ext, j = i.gl, k = j.FRAMEBUFFER, l = i.cb.getCurrentFramebuffer(k);
        l != a && j.bindFramebuffer(k, a), j.readPixels(b, c, d, e, f, g, h), l != a && j.bindFramebuffer(k, l)
    }, c.uniform1f = function (a, b, c) {
        var d = this._ext, e = d.gl, f = d.cb.getCurrentProgram();
        f != a && e.useProgram(a), e.uniform1f(b, c), f != a && e.useProgram(f)
    },
        c.uniform1fv = function (a, b, c) {
            var d = this._ext, e = d.gl, f = d.cb.getCurrentProgram();
            f != a && e.useProgram(a), e.uniform1fv(b, c), f != a && e.useProgram(f)
        }, c.uniform1i = function (a, b, c) {
        var d = this._ext, e = d.gl, f = d.cb.getCurrentProgram();
        f != a && e.useProgram(a), e.uniform1i(b, c), f != a && e.useProgram(f)
    }, c.uniform1iv = function (a, b, c) {
        var d = this._ext, e = d.gl, f = d.cb.getCurrentProgram();
        f != a && e.useProgram(a), e.uniform1iv(b, c), f != a && e.useProgram(f)
    }, c.uniform2f = function (a, b, c, d) {
        var e = this._ext, f = e.gl, g = e.cb.getCurrentProgram();
        g != a && f.useProgram(a), f.uniform2f(b, c, d), g != a && f.useProgram(g)
    }, c.uniform2fv = function (a, b, c) {
        var d = this._ext, e = d.gl, f = d.cb.getCurrentProgram();
        f != a && e.useProgram(a), e.uniform2fv(b, c), f != a && e.useProgram(f)
    }, c.uniform2i = function (a, b, c, d) {
        var e = this._ext, f = e.gl, g = e.cb.getCurrentProgram();
        g != a && f.useProgram(a), f.uniform2i(b, c, d), g != a && f.useProgram(g)
    }, c.uniform2iv = function (a, b, c) {
        var d = this._ext, e = d.gl, f = d.cb.getCurrentProgram();
        f != a && e.useProgram(a), e.uniform2iv(b, c), f != a && e.useProgram(f)
    }, c.uniform3f = function (a, b, c, d, e) {
        var f = this._ext, g = f.gl, h = f.cb.getCurrentProgram();
        h != a && g.useProgram(a), g.uniform3f(b, c, d, e), h != a && g.useProgram(h)
    }, c.uniform3fv = function (a, b, c) {
        var d = this._ext, e = d.gl, f = d.cb.getCurrentProgram();
        f != a && e.useProgram(a), e.uniform3fv(b, c), f != a && e.useProgram(f)
    }, c.uniform3i = function (a, b, c, d, e) {
        var f = this._ext, g = f.gl, h = f.cb.getCurrentProgram();
        h != a && g.useProgram(a), g.uniform3i(b, c, d, e), h != a && g.useProgram(h)
    }, c.uniform3iv = function (a, b, c) {
        var d = this._ext, e = d.gl, f = d.cb.getCurrentProgram();
        f != a && e.useProgram(a), e.uniform3iv(b, c), f != a && e.useProgram(f)
    }, c.uniform4f = function (a, b, c, d, e, f) {
        var g = this._ext, h = g.gl, i = g.cb.getCurrentProgram();
        i != a && h.useProgram(a), h.uniform4f(b, c, d, e, f), i != a && h.useProgram(i)
    }, c.uniform4fv = function (a, b, c) {
        var d = this._ext, e = d.gl, f = d.cb.getCurrentProgram();
        f != a && e.useProgram(a), e.uniform4fv(b, c), f != a && e.useProgram(f)
    }, c.uniform4i = function (a, b, c, d, e, f) {
        var g = this._ext, h = g.gl, i = g.cb.getCurrentProgram();
        i != a && h.useProgram(a), h.uniform4i(b, c, d, e, f), i != a && h.useProgram(i)
    }, c.uniform4iv = function (a, b, c) {
        var d = this._ext, e = d.gl, f = d.cb.getCurrentProgram();
        f != a && e.useProgram(a), e.uniform4iv(b, c), f != a && e.useProgram(f)
    }, c.uniformMatrix2fv = function (a, b, c, d) {
        var e = this._ext, f = e.gl, g = e.cb.getCurrentProgram();
        g != a && f.useProgram(a), f.uniformMatrix2fv(b, c, d), g != a && f.useProgram(g)
    }, c.uniformMatrix3fv = function (a, b, c, d) {
        var e = this._ext, f = e.gl, g = e.cb.getCurrentProgram();
        g != a && f.useProgram(a), f.uniformMatrix3fv(b, c, d), g != a && f.useProgram(g)
    }, c.uniformMatrix4fv = function (a, b, c, d) {
        var e = this._ext, f = e.gl, g = e.cb.getCurrentProgram();
        g != a && f.useProgram(a), f.uniformMatrix4fv(b, c, d), g != a && f.useProgram(g)
    }, c.getRenderbufferParameter = function (a, b, c) {
        var d = this._ext, e = d.gl, f = d.cb.getCurrentRenderbuffer(b);
        f != a && e.bindRenderbuffer(b, a);
        var g = e.getRenderbufferParameter.call(e, b, c);
        return f != a && e.bindRenderbuffer(b, f), g
    }, c.renderbufferStorage = function (a, b, c, d, e) {
        var f = this._ext, g = f.gl, h = f.cb.getCurrentRenderbuffer(b);
        h != a && g.bindRenderbuffer(b, a), g.renderbufferStorage(b, c, d, e), h != a && g.bindRenderbuffer(b, h)
    }, c.shaderIsNull = function (a) {
        return null == a
    }, d.textureTargetMap = {}, d.textureTargetMap[a.TEXTURE_2D] = a.TEXTURE_2D, d.textureTargetMap[a.TEXTURE_CUBE_MAP] = a.TEXTURE_CUBE_MAP, d.textureTargetMap[a.TEXTURE_CUBE_MAP_POSITIVE_X] = a.TEXTURE_CUBE_MAP, d.textureTargetMap[a.TEXTURE_CUBE_MAP_NEGATIVE_X] = a.TEXTURE_CUBE_MAP, d.textureTargetMap[a.TEXTURE_CUBE_MAP_POSITIVE_Y] = a.TEXTURE_CUBE_MAP, d.textureTargetMap[a.TEXTURE_CUBE_MAP_NEGATIVE_Y] = a.TEXTURE_CUBE_MAP, d.textureTargetMap[a.TEXTURE_CUBE_MAP_POSITIVE_Z] = a.TEXTURE_CUBE_MAP, d.textureTargetMap[a.TEXTURE_CUBE_MAP_NEGATIVE_Z] = a.TEXTURE_CUBE_MAP, c.getTexParameter = function (a, b, c) {
        var d = this._ext, e = d.gl, f = d.cb.getCurrentTexture(b);
        f != a && e.bindTexture(b, a);
        var g = e.getTexParameter(b, c);
        return f != a && e.bindTexture(b, f), g
    }, c.copyTexImage2D = function (a, b, c, d, e, f, g, h, i) {
        var j = this._ext, k = j.gl, l = j.textureTargetMap[b], m = j.cb.getCurrentTexture(l);
        m != a && k.bindTexture(l, a), k.copyTexImage2D(b, c, d, e, f, g, h, i), m != a && k.bindTexture(l, m)
    }, c.copyTexSubImage2D = function (a, b, c, d, e, f, g, h, i, j) {
        var k = this._ext, l = k.gl, m = k.textureTargetMap[b], n = k.cb.getCurrentTexture(m);
        n != a && l.bindTexture(m, a), l.copyTexSubImage2D(b, c, d, e, f, g, h, i, j), n != a && l.bindTexture(m, n)
    }, c.generateMipmap = function (a, b) {
        var c = this._ext, d = c.gl, e = c.cb.getCurrentTexture(b);
        e != a && d.bindTexture(b, a), d.generateMipmap(b), e != a && d.bindTexture(b, e)
    }, c.texImage2D = function (a, b) {
        var c = this._ext, d = c.gl, e = c.textureTargetMap[b], f = c.cb.getCurrentTexture(e);
        f != a && d.bindTexture(e, a);
        var g = Array.prototype.slice.call(arguments, 1);
        d.texImage2D.apply(d, g), f != a && d.bindTexture(e, f)
    }, c.texParameterf = function (a, b, c, d) {
        var e = this._ext, f = e.gl, g = e.cb.getCurrentTexture(b);
        g != a && f.bindTexture(b, a), f.texParameterf(b, c, d), g != a && f.bindTexture(b, g)
    }, c.texParameteri = function (a, b, c, d) {
        var e = this._ext, f = e.gl, g = e.cb.getCurrentTexture(b);
        g != a && f.bindTexture(b, a), f.texParameteri(b, c, d), g != a && f.bindTexture(b, g)
    }, c.texSubImage2D = function (a, b) {
        var c = this._ext, d = c.gl, e = c.textureTargetMap[b], f = c.cb.getCurrentTexture(e);
        f != a && d.bindTexture(e, a);
        var g = Array.prototype.slice.call(arguments, 1);
        d.texSubImage2D.apply(d, g), f != a && d.bindTexture(e, f)
    }, c.bindTexture = function (a, b, c) {
        var d = this._ext, e = d.gl, f = d.cb, g = f.getCurrentTextureUnit();
        g != a && e.activeTexture(a), e.bindTexture(b, c), g != a && e.activeTexture(g)
    }, !0)
}, SpiderGL.WebGL.Context.hijack = function (a) {
    if (a._spidergl) return !1;
    SpiderGL.WebGL.Context._prepareContex(a), SpiderGL.WebGL.Context._addExtension(a, "SGL_current_binding", "cb", SpiderGL.WebGL.Context._setup_SGL_current_binding), SpiderGL.WebGL.Context._addExtension(a, "SGL_wrapper_notify", "wn", SpiderGL.WebGL.Context._setup_SGL_wrapper_notify), SpiderGL.WebGL.Context._addExtension(a, "SGL_direct_state_access", "dsa", SpiderGL.WebGL.Context._setup_SGL_direct_state_access);
    var b = a.getExtension("SGL_current_binding"), c = a.getExtension("SGL_wrapper_notify"),
        d = a.getExtension("SGL_direct_state_access"), e = !!b && !!c && !!d;
    return e
}, SpiderGL.WebGL.Context.isHijacked = function (a) {
    return !!a && !!a._spidergl
}, SpiderGL.WebGL.Context.getHijacked = function (a, b) {
    var c = SpiderGL.WebGL.Context.get(a, b);
    return SpiderGL.WebGL.Context.hijack(c), c
}, SpiderGL.WebGL.Context.setStandardGLUnpack = function (a) {
    a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, !0), a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), a.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL, WebGLRenderingContext.prototype.NONE)
}, SpiderGL.WebGL.ObjectGL = function (a, b, c) {
    if (!SpiderGL.WebGL.Context.isHijacked(a)) return null;
    c = SpiderGL.Utility.getDefaultObject({handle: null}, c), SpiderGL.Core.ObjectBase.call(this);
    a.getExtension("SGL_wrapper_notify");
    this._gl = a, this._cb = a.getExtension("SGL_current_binding"), this._dsa = a.getExtension("SGL_direct_state_access"), this._h = c.handle, this._t = b
}, SpiderGL.WebGL.ObjectGL.TARGET = WebGLRenderingContext.prototype.NONE, SpiderGL.WebGL.ObjectGL.unbind = function (a) {
}, SpiderGL.WebGL.ObjectGL.prototype = {
    get gl() {
        return this._gl
    }, get handle() {
        return this._h
    }, get target() {
        return this._t
    }, get isValid() {
        return null != this._h
    }, get isReady() {
        return !1
    }, destroy: function () {
    }, bind: function () {
    }, unbind: function () {
    }
}, SpiderGL.Type.extend(SpiderGL.WebGL.ObjectGL, SpiderGL.Core.ObjectBase), SpiderGL.WebGL.Buffer = function (a, b, c) {
    if (!SpiderGL.WebGL.Context.isHijacked(a)) return null;
    if (SpiderGL.Type.instanceOf(c, WebGLBuffer) ? c = {handle: c} : SpiderGL.Type.instanceOf(c, ArrayBuffer) || SpiderGL.Type.isTypedArray(c) ? c = {data: c} : SpiderGL.Type.isNumber(c) && (c = {size: c}), c = SpiderGL.Utility.getDefaultObject({
            handle: null,
            data: null,
            size: 0,
            usage: SpiderGL.WebGL.Buffer.DEFAULT_USAGE
        }, c), SpiderGL.WebGL.ObjectGL.call(this, a, b, c), this._h && this._h._spidergl && this._h._spidergl != this) return this._h._spidergl;
    var a = this._gl, d = this._cb, f = (this._dsa, this._t), g = this._h;
    d.pushBuffer(f), g ? (a.bindBuffer(f, g), c.size = a.getBufferParameter(f, a.BUFFER_SIZE), c.usage = a.getBufferParameter(f, a.BUFFER_USAGE)) : (g = a.createBuffer(), a.bindBuffer(f, g), this._h = g), d.popBuffer(f), g._spidergl = this, this._size = c.size, this._usage = c.usage, c.data ? this.setData(c.data, c.usage) : c.size && this.setSize(c.size, c.usage)
}, SpiderGL.WebGL.Buffer.TARGET = WebGLRenderingContext.prototype.NONE, SpiderGL.WebGL.Buffer.DEFAULT_USAGE = WebGLRenderingContext.prototype.STATIC_DRAW, SpiderGL.WebGL.Buffer.DEFAULT_SUB_DATA_OFFSET = 0, SpiderGL.WebGL.Buffer.unbind = function (a) {
}, SpiderGL.WebGL.Buffer.prototype = {
    _gl_deleteBuffer: function () {
        this._h = null
    }, _gl_isBuffer: function () {
    }, _gl_bindBuffer: function () {
    }, _gl_getBufferParameter: function () {
    }, _gl_bufferData: function () {
        var a = arguments[1], b = arguments[2];
        this._size = SpiderGL.Type.isNumber(a) ? a : a.byteLength, this._usage = b
    }, _gl_bufferSubData: function () {
    }, _gl_vertexAttribPointer: function () {
    }, _gl_drawElements: function () {
    }, get isReady() {
        return this._size > 0
    }, get size() {
        return this._size
    }, get usage() {
        return this._usage
    }, setSize: function (a, b) {
        b = SpiderGL.Utility.getDefaultValue(b, SpiderGL.WebGL.Buffer.DEFAULT_USAGE), this._dsa.bufferData(this._h, this._t, a, b)
    }, setData: function (a, b) {
        b = SpiderGL.Utility.getDefaultValue(b, SpiderGL.WebGL.Buffer.DEFAULT_USAGE), this._dsa.bufferData(this._h, this._t, a, b)
    }, setSubData: function (a, b) {
        b = SpiderGL.Utility.getDefaultValue(b, SpiderGL.WebGL.Buffer.DEFAULT_SUB_DATA_OFFSET), this._dsa.bufferSubData(this._h, this._t, b, a)
    }, destroy: function () {
        this._gl.deleteBuffer(this._h)
    }, bind: function () {
        this._gl.bindBuffer(this._t, this._h)
    }, unbind: function () {
        this._gl.bindBuffer(this._t, null)
    }
}, SpiderGL.Type.extend(SpiderGL.WebGL.Buffer, SpiderGL.WebGL.ObjectGL), SpiderGL.WebGL.VertexBuffer = function (a, b) {
    return SpiderGL.WebGL.Context.isHijacked(a) ? (SpiderGL.WebGL.Buffer.call(this, a, SpiderGL.WebGL.VertexBuffer.TARGET, b), this._h && this._h._spidergl && this._h._spidergl != this ? this._h._spidergl : void 0) : null
}, SpiderGL.WebGL.VertexBuffer.TARGET = WebGLRenderingContext.prototype.ARRAY_BUFFER, SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_INDEX = 0, SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_SIZE = 3, SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_TYPE = WebGLRenderingContext.prototype.FLOAT, SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_NORMALIZED = !1, SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_STRIDE = 0, SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_OFFSET = 0, SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_ENABLE = !0, SpiderGL.WebGL.VertexBuffer.unbind = function (a) {
    a.bindBuffer(SpiderGL.WebGL.VertexBuffer.TARGET, null)
}, SpiderGL.WebGL.VertexBuffer.prototype = {
    vertexAttribPointer: function (a) {
        a = SpiderGL.Utility.getDefaultObject({
            index: SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_INDEX,
            size: SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_SIZE,
            glType: SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_TYPE,
            normalized: SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_NORMALIZED,
            stride: SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_STRIDE,
            offset: SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_OFFSET,
            enable: SpiderGL.WebGL.VertexBuffer.DEFAULT_ATTRIBUTE_ENABLE
        }, a), this._dsa.vertexAttribPointer(this._h, a.index, a.size, a.glType, a.normalized, a.stride, a.offset), a.enable && this._gl.enableVertexAttribArray(a.index)
    }
}, SpiderGL.Type.extend(SpiderGL.WebGL.VertexBuffer, SpiderGL.WebGL.Buffer), SpiderGL.WebGL.IndexBuffer = function (a, b) {
    return SpiderGL.WebGL.Context.isHijacked(a) ? (SpiderGL.WebGL.Buffer.call(this, a, SpiderGL.WebGL.IndexBuffer.TARGET, b), this._h && this._h._spidergl && this._h._spidergl != this ? this._h._spidergl : void 0) : null
}, SpiderGL.WebGL.IndexBuffer.TARGET = WebGLRenderingContext.prototype.ELEMENT_ARRAY_BUFFER, SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_MODE = WebGLRenderingContext.prototype.TRIANGLES,SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_COUNT = -1,SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_TYPE = WebGLRenderingContext.prototype.UNSIGNED_SHORT,SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_OFFSET = 0,SpiderGL.WebGL.IndexBuffer.unbind = function (a) {
    a.bindBuffer(SpiderGL.WebGL.IndexBuffer.TARGET, null)
},SpiderGL.WebGL.IndexBuffer.prototype = {
    drawElements: function (a) {
        if (a = SpiderGL.Utility.getDefaultObject({
                glMode: SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_MODE,
                count: SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_COUNT,
                glType: SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_TYPE,
                offset: SpiderGL.WebGL.IndexBuffer.DEFAULT_DRAW_ELEMENTS_OFFSET
            }, a), a.count < 1) {
            var b = SpiderGL.Type.typeSizeFromGL(a.glType);
            a.count = (this._size - a.offset) / b
        }
        this._dsa.drawElements(this._h, a.glMode, a.count, a.glType, a.offset)
    }
},SpiderGL.Type.extend(SpiderGL.WebGL.IndexBuffer, SpiderGL.WebGL.Buffer),SpiderGL.WebGL.Framebuffer = function (a, b) {
    if (!SpiderGL.WebGL.Context.isHijacked(a)) return null;
    SpiderGL.Type.instanceOf(b, WebGLFramebuffer) && (b = {handle: b}), b = SpiderGL.Utility.getDefaultObject({
        handle: null,
        autoViewport: SpiderGL.WebGL.Framebuffer.DEFAULT_AUTO_VIEWPORT
    }, b);
    SpiderGL.WebGL.ObjectGL.call(this, a, SpiderGL.WebGL.Framebuffer.TARGET, b);
    if (this._h && this._h._spidergl && this._h._spidergl != this) return this._h._spidergl;
    var a = this._gl, d = this._cb, f = (this._dsa, this._t), g = this._h, h = !1;
    if (g ? h = !0 : (g = a.createFramebuffer(), this._h = g), g._spidergl = this, this._attachments = {}, this._status = 0, this._autoViewport = b.autoViewport, this._viewport = [0, 0, 1, 1], d.pushFramebuffer(f), a.bindFramebuffer(f, g), h) {
        var i = null, j = 0, k = 0, l = 0;
        for (var m in SpiderGL.WebGL.Framebuffer._attachmentName) switch (i = a.getFramebufferAttachmentParameter(f, att, a.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME), j = a.getFramebufferAttachmentParameter(f, att, a.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE)) {
            case a.RENDERBUFFER:
                l = a.RENDERBUFFER, this._importRenderbuffer(f, m, l, i);
                break;
            case a.TEXTURE:
                k = a.getFramebufferAttachmentParameter(f, att, a.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL), l = a.getFramebufferAttachmentParameter(f, att, a.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE), 0 == l && (l = a.TEXTURE_2D), this._importTexture(f, m, l, i, k)
        }
    }
    this._status = a.checkFramebufferStatus(f), d.popFramebuffer(f), this.setAttachments(b)
},SpiderGL.WebGL.Framebuffer.TARGET = WebGLRenderingContext.prototype.FRAMEBUFFER,SpiderGL.WebGL.Framebuffer.DEFAULT_AUTO_VIEWPORT = !0,SpiderGL.WebGL.Framebuffer.DEFAULT_ATTACHMENT_TEXTURE_LEVEL = 0,SpiderGL.WebGL.Framebuffer.DEFAULT_ATTACHMENT_CUBE_MAP_FACE = WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_POSITIVE_X,SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_X = 0,SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_Y = 0,SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_WIDTH = -1,SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_HEIGHT = -1,SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_FORMAT = WebGLRenderingContext.prototype.RGBA,SpiderGL.WebGL.Framebuffer.DEFAULT_CLEAR_MASK = WebGLRenderingContext.prototype.COLOR_BUFFER_BIT | WebGLRenderingContext.prototype.DEPTH_BUFFER_BIT | WebGLRenderingContext.prototype.STENCIL_BUFFER_BIT,SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_TYPE = WebGLRenderingContext.UNSIGNED_BYTE,SpiderGL.WebGL.Framebuffer.unbind = function (a) {
    a.bindFramebuffer(SpiderGL.WebGL.Framebuffer.TARGET, null)
},SpiderGL.WebGL.Framebuffer._attachmentName = {},SpiderGL.WebGL.Framebuffer._attachmentName[WebGLRenderingContext.prototype.COLOR_ATTACHMENT0] = "color",SpiderGL.WebGL.Framebuffer._attachmentName[WebGLRenderingContext.prototype.DEPTH_ATTACHMENT] = "depth",SpiderGL.WebGL.Framebuffer._attachmentName[WebGLRenderingContext.prototype.STENCIL_ATTACHMENT] = "stencil",SpiderGL.WebGL.Framebuffer._attachmentName[WebGLRenderingContext.prototype.DEPTH_STENCIL_ATTACHMENT] = "depthStencil",SpiderGL.WebGL.Framebuffer.prototype = {
    _gl_deleteFramebuffer: function (a) {
        this._h = null
    }, _gl_isFramebuffer: function (a) {
    }, _gl_bindFramebuffer: function (a, b) {
    }, _gl_checkFramebufferStatus: function (a) {
    }, _gl_getFramebufferAttachmentParameter: function (a, b, c) {
    }, _gl_framebufferRenderbuffer: function (a, b, c, d) {
        this._importRenderbuffer.apply(this, arguments), this._status = this._gl.checkFramebufferStatus(this._t)
    }, _gl_framebufferTexture2D: function (a, b, c, d, e) {
        this._importTexture.apply(this, arguments), this._status = this._gl.checkFramebufferStatus(this._t)
    }, _gl_clear: function (a) {
    }, _gl_readPixels: function (a, b, c, d, e, f, g) {
    }, _importTexture: function (a, b, c, d, e) {
        var f = SpiderGL.WebGL.Framebuffer._attachmentName[b];
        if (f) {
            if (!d) return void delete this._attachments[f];
            var g = this._gl, h = {attachment: b, resource: null, target: c, level: e, face: g.NONE};
            this._attachments[f] = h, c == g.TEXTURE_2D ? h.resource = new SpiderGL.WebGL.Texture2D(g, {handle: d}) : (h.resource = new SpiderGL.WebGL.TextureCubeMap(g, {handle: d}), h.face = c), this._viewport = [0, 0, SpiderGL.Math.max(h.resource.width, 1), SpiderGL.Math.max(h.resource.height, 1)]
        }
    }, _importRenderbuffer: function (a, b, c, d) {
        var e = SpiderGL.WebGL.Framebuffer._attachmentName[b];
        if (e) {
            if (!d) return void delete this._attachments[e];
            var f = this._gl, g = {attachment: b, resource: null, target: c, level: 0, face: f.NONE};
            this._attachments[e] = g, g.resource = new SpiderGL.WebGL.Renderbuffer(f, {handle: d}), this._viewport = [0, 0, SpiderGL.Math.max(g.resource.width, 1), SpiderGL.Math.max(g.resource.height, 1)]
        }
    }, _setAttachment: function (a, b) {
        var c = SpiderGL.WebGL.Framebuffer._attachmentName[a];
        if (!c) return !1;
        var d = this._gl, e = !b || "resource" in b && !b.resource;
        if (e) {
            var f = this._attachments[c];
            return void(f && (f.target === d.RENDERBUFFER ? d.framebufferRenderbuffer(i, f.attachment, d.RENDERBUFFER, null) : d.framebufferTexture2D(i, f.attachment, d.TEXTURE_2D, null, 0)))
        }
        var g = d.NONE;
        SpiderGL.Type.instanceOf(b, WebGLTexture) ? (b = {resource: b}, g = d.TEXTURE) : SpiderGL.Type.instanceOf(b, WebGLRenderbuffer) ? (b = {resource: b}, g = d.RENDERBUFFER) : SpiderGL.Type.instanceOf(b, SpiderGL.WebGL.Texture) ? (b = {resource: b.handle}, g = d.TEXTURE) : SpiderGL.Type.instanceOf(b, SpiderGL.WebGL.Renderbuffer) && (b = {resource: b.handle}, g = d.RENDERBUFFER);
        var h = !!b && "undefined" != typeof b.face;
        b = SpiderGL.Utility.getDefaultObject({
            resource: null,
            level: SpiderGL.WebGL.Framebuffer.DEFAULT_ATTACHMENT_TEXTURE_LEVEL,
            face: SpiderGL.WebGL.Framebuffer.DEFAULT_ATTACHMENT_CUBE_MAP_FACE
        }, b);
        var i = this._t;
        switch (g) {
            case d.TEXTURE:
                var j = SpiderGL.Type.instanceOf(b, SpiderGL.WebGL.TextureCubeMap) || h, k = j ? b.face : d.TEXTURE_2D;
                d.framebufferTexture2D(i, a, k, b.resource, b.level);
                break;
            case d.RENDERBUFFER:
                d.framebufferRenderbuffer(i, a, d.RENDERBUFFER, b.resource)
        }
        return !0
    }, get isReady() {
        return this.isComplete
    }, get status() {
        return this._status
    }, get isComplete() {
        return this._status === this._gl.FRAMEBUFFER_COMPLETE
    }, get viewport() {
        return this._viewport.slice()
    }, get width() {
        return this._viewport[2]
    }, get height() {
        return this._viewport[3]
    }, get autoViewport() {
        return this._autoViewport
    }, set autoViewport(a) {
        this._autoViewport = !!a
    }, setAttachments: function (a) {
        a = a || {};
        var b = this._gl, c = this._cb, d = this._t, e = this._h;
        return c.pushFramebuffer(d), b.bindFramebuffer(d, e), "color" in a && this._setAttachment(b.COLOR_ATTACHMENT0, a.color), "depthStencil" in a ? (this._setAttachment(b.DEPTH_ATTACHMENT, null), this._setAttachment(b.STENCIL_ATTACHMENT, null), this._setAttachment(b.DEPTH_STENCIL_ATTACHMENT, a.depthStencil)) : "depth" in a ? (this._setAttachment(b.DEPTH_STENCIL_ATTACHMENT, null), this._setAttachment(b.STENCIL_ATTACHMENT, null), this._setAttachment(b.DEPTH_ATTACHMENT, a.depth)) : "stencil" in a && (this._setAttachment(b.DEPTH_STENCIL_ATTACHMENT, null), this._setAttachment(b.DEPTH_ATTACHMENT, null), this._setAttachment(b.STENCIL_ATTACHMENT, a.stencil)), this._status = b.checkFramebufferStatus(d), c.popFramebuffer(d), this.isComplete
    }, getAttachments: function () {
        var a = {}, b = null;
        for (var c in this._attachments) b = this._attachments[c], a[c] = {
            attachment: b.attachment,
            resource: b.resource,
            target: b.target,
            level: b.level
        };
        return a
    }, detachAll: function () {
        this.setAttachments({color: null, depthStencil: null})
    }, get colorTarget() {
        var a = this._attachments.color;
        return a ? a.resource : null
    }, set colorTarget(a) {
        this.setAttachments({color: a})
    }, get depthTarget() {
        var a = this._attachments.depth;
        return a ? a.resource : null
    }, set depthTarget(a) {
        this.setAttachments({depth: a})
    }, get stencilTarget() {
        var a = this._attachments.stencil;
        return a ? a.resource : null
    }, set stencilTarget(a) {
        this.setAttachments({stencil: a})
    }, get depthStencilTarget() {
        var a = this._attachments.depthStencil;
        return a ? a.resource : null
    }, set depthStencilTarget(a) {
        this.setAttachments({depthStencil: a})
    }, clear: function (a) {
        a = SpiderGL.Utility.getDefaultValue(a, SpiderGL.WebGL.Framebuffer.DEFAULT_CLEAR_MASK), this._dsa.clear(this._h, a)
    }, readPixels: function (a, b) {
        b = SpiderGL.Utility.getDefaultObject({
            x: SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_X,
            y: SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_Y,
            width: SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_WIDTH,
            height: SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_HEIGHT,
            format: SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_FORMAT,
            type: SpiderGL.WebGL.Framebuffer.DEFAULT_READ_PIXELS_TYPE
        }, b), b.width < 0 && (b.width = this._viewport[2]), b.height < 0 && (b.height = this._viewport[3]), this._dsa.readPixels(this._h, b.x, b.y, b.width, b.height, b.format, b.type, a)
    }, applyViewport: function () {
        var a = this._gl, b = this._viewport;
        a.viewport(b[0], b[1], b[2], b[3])
    }, destroy: function () {
        this._gl.deleteFramebuffer(this._h)
    }, bind: function (a) {
        var b = this._gl;
        b.bindFramebuffer(this._t, this._h);
        var c = SpiderGL.Utility.getDefaultValue(a, this._autoViewport);
        if (c) {
            var d = this._viewport;
            b.viewport(d[0], d[1], d[2], d[3])
        }
    }, unbind: function () {
        this._gl.bindFramebuffer(this._t, null)
    }
},SpiderGL.Type.extend(SpiderGL.WebGL.Framebuffer, SpiderGL.WebGL.ObjectGL),SpiderGL.WebGL.Program = function (a, b) {
    if (!SpiderGL.WebGL.Context.isHijacked(a)) return null;
    if (SpiderGL.Type.instanceOf(b, WebGLProgram) && (b = {handle: b}), b = SpiderGL.Utility.getDefaultObject({
            handle: null,
            autoLink: SpiderGL.WebGL.Program.DEFAULT_AUTO_LINK
        }, b), SpiderGL.WebGL.ObjectGL.call(this, a, SpiderGL.WebGL.Program.TARGET, b), this._h && this._h._spidergl && this._h._spidergl != this) return this._h._spidergl;
    var a = this._gl, e = (this._cb, this._dsa, this._h), f = !1, g = "", h = !1;
    if (e ? (h = !0, f = !!a.getProgramParameter(e, a.LINK_STATUS), g = a.getProgramInfoLog(e), g || (g = "")) : (e = a.createProgram(), this._h = e), e._spidergl = this, this._shaders = [], this._linked = f, this._log = g, this._autoLink = b.autoLink, this._attributes = {}, this._uniforms = {}, h) for (var i = a.getAttachedShaders(e), j = 0, k = i.length; j < k; ++j) this._importShader(i[j]);
    var l = !1;
    this._addShaders(b.shaders) && (l = !0), this._setAttributes(b.attributes) && (l = !0), l && this._autoLink ? this.link() : h && this._postLink(), this.setUniforms(b.uniforms)
},SpiderGL.WebGL.Program.TARGET = WebGLRenderingContext.prototype.NONE,SpiderGL.WebGL.Program.DEFAULT_AUTO_LINK = !0,SpiderGL.WebGL.Program.unbind = function (a) {
    a.useProgram(null)
},SpiderGL.WebGL.Program._uniformSetFunctions = {},SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.prototype.BOOL] = function (a, b, c) {
    a.uniform1i(b, this.location, c)
},SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.prototype.BOOL_VEC2] = function (a, b, c) {
    a.uniform2iv(b, this.location, c)
},SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.prototype.BOOL_VEC3] = function (a, b, c) {
    a.uniform3iv(b, this.location, c)
},SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.prototype.BOOL_VEC4] = function (a, b, c) {
    a.uniform4iv(b, this.location, c)
},SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.prototype.INT] = function (a, b, c) {
    a.uniform1i(b, this.location, c)
},SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.prototype.INT_VEC2] = function (a, b, c) {
    a.uniform2iv(b, this.location, c)
},SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.prototype.INT_VEC3] = function (a, b, c) {
    a.uniform3iv(b, this.location, c)
},SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.prototype.INT_VEC4] = function (a, b, c) {
    a.uniform4iv(b, this.location, c)
},SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.prototype.FLOAT] = function (a, b, c) {
    a.uniform1f(b, this.location, c)
},SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.prototype.FLOAT_VEC2] = function (a, b, c) {
    a.uniform2fv(b, this.location, c)
},SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.prototype.FLOAT_VEC3] = function (a, b, c) {
    a.uniform3fv(b, this.location, c)
},SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.prototype.FLOAT_VEC4] = function (a, b, c) {
    a.uniform4fv(b, this.location, c)
},SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.prototype.FLOAT_MAT2] = function (a, b, c) {
    a.uniformMatrix2fv(b, this.location, !1, c)
},SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.prototype.FLOAT_MAT3] = function (a, b, c) {
    a.uniformMatrix3fv(b, this.location, !1, c)
},SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.prototype.FLOAT_MAT4] = function (a, b, c) {
    a.uniformMatrix4fv(b, this.location, !1, c)
},SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.prototype.SAMPLER_2D] = function (a, b, c) {
    a.uniform1i(b, this.location, c)
},SpiderGL.WebGL.Program._uniformSetFunctions[WebGLRenderingContext.prototype.SAMPLER_CUBE] = function (a, b, c) {
    a.uniform1i(b, this.location, c)
},SpiderGL.WebGL.Program.prototype = {
    _gl_deleteProgram: function (a) {
        this._h = null
    }, _gl_isProgram: function (a) {
    }, _gl_useProgram: function (a) {
    }, _gl_getActiveAttrib: function (a, b) {
    }, _gl_getActiveUniform: function (a, b) {
    }, _gl_getAttachedShaders: function (a) {
    }, _gl_getAttribLocation: function (a, b) {
    }, _gl_getProgramParameter: function (a, b) {
    }, _gl_getProgramInfoLog: function (a) {
    }, _gl_getUniform: function (a, b) {
    }, _gl_getUniformLocation: function (a, b) {
    }, _gl_attachShader: function (a, b) {
        this._importShader(b)
    }, _gl_bindAttribLocation: function (a, b, c) {
    }, _gl_detachShader: function (a, b) {
        if (b) {
            var c = this._shaderHandleIndex(b);
            c < 0 || this._shaders.splice(c, 1)
        }
    }, _gl_linkProgram: function (a) {
        this._postLink()
    }, _gl_uniform1f: function (a, b) {
    }, _gl_uniform1fv: function (a, b) {
    }, _gl_uniform1i: function (a, b) {
    }, _gl_uniform1iv: function (a, b) {
    }, _gl_uniform2f: function (a, b, c) {
    }, _gl_uniform2fv: function (a, b) {
    }, _gl_uniform2i: function (a, b, c) {
    }, _gl_uniform2iv: function (a, b) {
    }, _gl_uniform3f: function (a, b, c, d) {
    }, _gl_uniform3fv: function (a, b) {
    }, _gl_uniform3i: function (a, b, c, d) {
    }, _gl_uniform3iv: function (a, b) {
    }, _gl_uniform4f: function (a, b, c, d, e) {
    }, _gl_uniform4fv: function (a, b) {
    }, _gl_uniform4i: function (a, b, c, d, e) {
    }, _gl_uniform4iv: function (a, b) {
    }, _gl_uniformMatrix2fv: function (a, b, c) {
    }, _gl_uniformMatrix3fv: function (a, b, c) {
    }, _gl_uniformMatrix4fv: function (a, b, c) {
    }, _gl_validateProgram: function (a) {
    }, _shaderHandleIndex: function (a) {
        for (var b = 0, c = this._shaders.length; b < c; ++b) if (this._shaders[b].handle === a) return b;
        return -1
    }, _shaderIndex: function (a) {
        if (this._shaders.indexOf) return this._shaders.indexOf(a);
        for (var b = 0, c = this._shaders.length; b < c; ++b) if (this._shaders[b] === a) return b;
        return -1
    }, _importShader: function (a) {
        if (a && !(this._shaderHandleIndex(a) >= 0)) {
            var b = this._gl, c = a._spidergl;
            if (!c) {
                var d = b.getShaderParameter(a, b.SHADER_TYPE);
                switch (d) {
                    case b.VERTEX_SHADER:
                        c = new SpiderGL.WebGL.VertexShader(b, {handle: a});
                        break;
                    case b.FRAGMENT_SHADER:
                        c = new SpiderGL.WebGL.FragmentShader(b, {handle: a});
                        break;
                    default:
                        return
                }
            }
            this._shaders.push(c)
        }
    }, _updateActiveInfo: function () {
        var a = this._gl, b = this._h, c = 0, d = null, e = null, f = null, g = {};
        c = a.getProgramParameter(b, a.ACTIVE_ATTRIBUTES);
        for (var h = 0; h < c; ++h) d = a.getActiveAttrib(b, h), e = d.name, f = a.getAttribLocation(b, e), g[e] = {
            index: h,
            name: e,
            size: d.size,
            type: d.type,
            location: f
        };
        var i = {};
        c = a.getProgramParameter(b, a.ACTIVE_UNIFORMS);
        for (var h = 0; h < c; ++h) if (d = a.getActiveUniform(b, h), e = d.name, f = a.getUniformLocation(b, e), i[e] = {
                index: h,
                name: e,
                size: d.size,
                type: d.type,
                location: f,
                setValue: SpiderGL.WebGL.Program._uniformSetFunctions[d.type]
            }, d.size > 1) {
            var j = e.lastIndexOf("[0]");
            if (j == e.length - 3) for (var k = e.slice(0, j), l = 1; l < d.size; ++l) {
                var m = k + "[" + l + "]";
                f = a.getUniformLocation(b, m), i[m] = {
                    index: h,
                    name: m,
                    size: d.size,
                    type: d.type,
                    location: f,
                    setValue: SpiderGL.WebGL.Program._uniformSetFunctions[d.type]
                }
            }
        }
        this._attributes = g, this._uniforms = i
    }, _postLink: function () {
        var a = this._gl, b = this._h;
        this._linked = !!a.getProgramParameter(b, a.LINK_STATUS), this._log = a.getProgramInfoLog(b), this._log || (this._log = ""), this._updateActiveInfo()
    }, _addShaders: function (a) {
        if (!a) return !1;
        for (var b = this._gl, c = this._h, d = null, e = null, f = 0, g = a.length; f < g; ++f) d = a[f], e = null, SpiderGL.Type.instanceOf(d, SpiderGL.WebGL.Shader) && (e = d.handle), SpiderGL.Type.instanceOf(d, WebGLShader) && (e = d), e && b.attachShader(c, e);
        return !0
    }, _removeShaders: function (a) {
        if (!a) return !1;
        for (var b = this._gl, c = this._h, d = null, e = null, f = 0, g = a.length; f < g; ++f) d = a[f], e = null, SpiderGL.Type.instanceOf(d, SpiderGL.WebGL.Shader) && (e = d.handle), SpiderGL.Type.instanceOf(d, SpiderGL.WebGL.Shader) && (e = d), e && b.detachShader(c, e);
        return !0
    }, _setAttributes: function (a) {
        if (!a) return !1;
        var b = this._gl, c = this._h;
        for (var d in a) b.bindAttribLocation(c, a[d], d);
        return !0
    }, get isReady() {
        return this.isLinked
    }, get isLinked() {
        return this._linked
    }, get log() {
        return this._log
    }, get autoLink() {
        return this._autoLink
    }, set autoLink(a) {
        this._autoLink = !!a
    }, addShaders: function (a, b) {
        var c = this._addShaders(a);
        return !c || (c = SpiderGL.Utility.getDefaultValue(b, this._autoLink), !c || this.link())
    }, removeShaders: function (a, b) {
        var c = this._removeShaders(a);
        return !c || (c = SpiderGL.Utility.getDefaultValue(b, this._autoLink), !c || this.link())
    }, hasShader: function (a) {
        return this._shaderIndex(a) >= 0
    }, getShaders: function () {
        return this._shaders.slice()
    }, link: function () {
        return this._gl.linkProgram(this._h), this._linked
    }, validate: function () {
        var a = this._gl, b = this._h;
        a.validateProgram(b);
        var c = !!a.getProgramParameter(b, a.VALIDATE_STATUS);
        return c
    }, setAttributes: function (a) {
        return !!this._setAttributes(a) && (!this._autoLink || this.link())
    }, getAttributesNames: function () {
        var a = this._attributes, b = [];
        for (var c in a) b.push(a[c].name);
        return b
    }, getAttributesIndices: function () {
        var a = this._attributes, b = {};
        for (var c in a) b[c] = a[c].location;
        return b
    }, getAttributesInfo: function () {
        var a = this._attributes, b = null, c = {};
        for (var d in a) b = a[d], c[d] = {
            index: b.index,
            name: b.name,
            size: b.size,
            type: b.type,
            location: b.location
        };
        return c
    }, setUniforms: function (a) {
        if (!a) return !1;
        var b = this._gl, c = this._cb, d = this._dsa, e = this._h;
        c.pushProgram(), b.useProgram(e);
        var f = this._uniforms, g = null;
        for (var i in a) g = f[i], g && g.setValue(d, e, a[i]);
        return c.popProgram(), !0
    }, getUniformsNames: function () {
        var a = this._uniforms, b = [];
        for (var c in a) b.push(a[c].name);
        return b
    }, getUniformsValues: function () {
        var a = this._gl, b = this._h, c = this._uniforms, d = {};
        for (var e in c) d[e] = a.getUniform(b, c[e].location);
        return d
    }, getUniformsInfo: function () {
        var a = this._uniforms, b = null, d = {};
        for (var e in a) b = a[e], d[e] = {
            index: b.index,
            name: b.name,
            size: b.size,
            type: b.type,
            location: b.location
        };
        return d
    }, destroy: function () {
        this._gl.deleteProgram(this._h)
    }, bind: function () {
        this._gl.useProgram(this._h)
    }, unbind: function () {
        this._gl.useProgram(null)
    }
},SpiderGL.Type.extend(SpiderGL.WebGL.Program, SpiderGL.WebGL.ObjectGL),SpiderGL.WebGL.Renderbuffer = function (a, b) {
    if (!SpiderGL.WebGL.Context.isHijacked(a)) return null;
    if (SpiderGL.Type.instanceOf(f, WebGLRenderbuffer) && (b = {handle: b}), b = SpiderGL.Utility.getDefaultObject({handle: null}, b), SpiderGL.WebGL.ObjectGL.call(this, a, SpiderGL.WebGL.Renderbuffer.TARGET, b), this._h && this._h._spidergl && this._h._spidergl != this) return this._h._spidergl;
    var a = this._gl, c = this._cb, e = (this._dsa, this._t), f = this._h, g = a.NONE, h = 0, i = 0;
    f ? (c.pushRenderbuffer(e), a.bindRenderbuffer(e, f), g = a.getRenderbufferParameter(e, a.RENDERBUFFER_INTERNAL_FORMAT), h = a.getRenderbufferParameter(e, a.RENDERBUFFER_WIDTH), i = a.getRenderbufferParameter(e, a.RENDERBUFFER_HEIGHT), c.popRenderbuffer(e)) : (f = a.createRenderbuffer(), this._h = f), f._spidergl = this, this._width = h, this._height = i, this._format = g, SpiderGL.Type.isNumber(b.internalFormat) && SpiderGL.Type.isNumber(b.width) && SpiderGL.Type.isNumber(b.height) && this.setStorage(b.internalFormat, b.width, b.height, b.format)
},SpiderGL.WebGL.Renderbuffer.TARGET = WebGLRenderingContext.prototype.RENDERBUFFER,SpiderGL.WebGL.Renderbuffer.unbind = function (a) {
    a.bindRenderbuffer(SpiderGL.WebGL.Renderbuffer.TARGET, null)
},SpiderGL.WebGL.Renderbuffer.prototype = {
    _gl_deleteRenderbuffer: function (a) {
        this._h = null
    }, _gl_isRenderbuffer: function (a) {
    }, _gl_bindRenderbuffer: function (a, b) {
    }, _gl_getRenderbufferParameter: function (a, b) {
    }, _gl_renderbufferStorage: function (a, b, c, d) {
        this._format = b, this._width = c, this._height = d
    }, get isReady() {
        return this._width > 0 && this._height > 0
    }, get format() {
        return this._format
    }, get width() {
        return this._width
    }, get height() {
        return this._height
    }, setStorage: function (a, b, c) {
        this._dsa.renderbufferStorage(this._h, this._t, a, b, c)
    }, destroy: function () {
        this._gl.deleteRenderbuffer(this._h)
    }, bind: function () {
        this._gl.bindRenderbuffer(this._t, this._h)
    }, unbind: function () {
        this._gl.bindRenderbuffer(this._t, null)
    }
},SpiderGL.Type.extend(SpiderGL.WebGL.Renderbuffer, SpiderGL.WebGL.ObjectGL),
SpiderGL.WebGL.Shader = function (a, b, c, d) {
    if (!SpiderGL.WebGL.Context.isHijacked(a)) return null;
    if (SpiderGL.Type.instanceOf(d, WebGLShader) ? d = {handle: d} : SpiderGL.Type.isString(d) && (d = {source: d}), d = SpiderGL.Utility.getDefaultObject({
            handle: null,
            source: null,
            autoCompile: SpiderGL.WebGL.Shader.DEFAULT_AUTO_COMPILE
        }, d), SpiderGL.WebGL.ObjectGL.call(this, a, b, d), this._h && this._h._spidergl && this._h._spidergl != this) return this._h._spidergl;
    var a = this._gl, g = (this._cb, this._dsa, ""), h = !1, i = !1, j = "", k = this._h;
    k ? (g = a.getShaderSource(k), g || (g = ""), h = !!a.getShaderParameter(k, a.COMPILE_STATUS), i = !!a.getShaderParameter(k, a.DELETE_STATUS), j = a.getShaderInfoLog(k), j || (j = "")) : (k = a.createShader(c), this._h = k), k._spidergl = this, this._source = g, this._compiled = h, this._log = j, this._autoCompile = d.autoCompile, d.source && this.setSource(d.source)
},SpiderGL.WebGL.Shader.TARGET = WebGLRenderingContext.prototype.NONE,SpiderGL.WebGL.Shader.DEFAULT_AUTO_COMPILE = !0,SpiderGL.WebGL.Shader.unbind = function (a) {
},SpiderGL.WebGL.Shader.prototype = {
    _gl_deleteShader: function (a) {
        this._h = null
    }, _gl_isShader: function (a) {
    }, _gl_getShaderParameter: function (a, b) {
    }, _gl_getShaderInfoLog: function (a) {
    }, _gl_getShaderSource: function (a) {
    }, _gl_compileShader: function (a) {
        this._postCompile()
    }, _gl_shaderSource: function (a, b) {
        this._source = b, this._source || (this._source = "")
    }, _postCompile: function () {
        var a = this._gl, b = this._h;
        this._compiled = !!a.getShaderParameter(b, a.COMPILE_STATUS), this._log = a.getShaderInfoLog(b), this._log || (this._log = "")
    }, get isReady() {
        return this.isCompiled
    }, get isCompiled() {
        return this._compiled
    }, get log() {
        return this._log
    }, get autoCompile() {
        return this._autoCompile
    }, set autoCompile(a) {
        this._autoCompile = !!a
    }, setSource: function (a, b) {
        var c = this._gl, d = this._h;
        c.shaderSource(d, a);
        SpiderGL.Utility.getDefaultValue(b, this._autoCompile);
        return this.compile()
    }, get source() {
        return this._source
    }, set source(a) {
        this.setSource(a)
    }, compile: function () {
        return this._gl.compileShader(this._h), this._compiled
    }, destroy: function () {
        this._gl.deleteShader(this._h)
    }, bind: function () {
    }, unbind: function () {
    }
},SpiderGL.Type.extend(SpiderGL.WebGL.Shader, SpiderGL.WebGL.ObjectGL),SpiderGL.WebGL.VertexShader = function (a, b) {
    return SpiderGL.WebGL.Context.isHijacked(a) ? (SpiderGL.WebGL.Shader.call(this, a, SpiderGL.WebGL.VertexShader.TARGET, a.VERTEX_SHADER, b), this._h && this._h._spidergl && this._h._spidergl != this ? this._h._spidergl : void 0) : null
},SpiderGL.WebGL.VertexShader.TARGET = WebGLRenderingContext.prototype.NONE,SpiderGL.WebGL.VertexShader.unbind = function (a) {
},SpiderGL.WebGL.VertexShader.prototype = {},SpiderGL.Type.extend(SpiderGL.WebGL.VertexShader, SpiderGL.WebGL.Shader),SpiderGL.WebGL.FragmentShader = function (a, b) {
    return SpiderGL.WebGL.Context.isHijacked(a) ? (SpiderGL.WebGL.Shader.call(this, a, SpiderGL.WebGL.FragmentShader.TARGET, a.FRAGMENT_SHADER, b), this._h && this._h._spidergl && this._h._spidergl != this ? this._h._spidergl : void 0) : null
},SpiderGL.WebGL.FragmentShader.TARGET = WebGLRenderingContext.prototype.NONE,SpiderGL.WebGL.FragmentShader.unbind = function (a) {
},SpiderGL.WebGL.FragmentShader.prototype = {},SpiderGL.Type.extend(SpiderGL.WebGL.FragmentShader, SpiderGL.WebGL.Shader),SpiderGL.WebGL.Texture = function (a, b, c) {
    if (!SpiderGL.WebGL.Context.isHijacked(a)) return null;
    if (SpiderGL.Type.instanceOf(c, WebGLTexture) ? c = {handle: c} : SpiderGL.Type.isString(c) && (c = {url: c}), c = SpiderGL.Utility.getDefaultObject({
            handle: null,
            magFilter: SpiderGL.WebGL.Texture.DEFAULT_MAG_FILTER,
            minFilter: SpiderGL.WebGL.Texture.DEFAULT_MIN_FILTER,
            wrapS: SpiderGL.WebGL.Texture.DEFAULT_WRAP_S,
            wrapT: SpiderGL.WebGL.Texture.DEFAULT_WRAP_T,
            flipYPolicy: SpiderGL.WebGL.Context.DEFAULT_UNPACK_FLIP_Y,
            premultiplyAlphaPolicy: SpiderGL.WebGL.Context.DEFAULT_UNPACK_PREMULTIPLY_ALPHA,
            colorspaceConversionPolicy: SpiderGL.WebGL.Context.DEFAULT_UNPACK_COLORSPACE_CONVERSION,
            autoMipmap: SpiderGL.WebGL.Texture.DEFAULT_AUTO_GENERATE_MIPMAP,
            format: a.NONE,
            width: 0,
            height: 0
        }, c), SpiderGL.WebGL.ObjectGL.call(this, a, b, c), this._h && this._h._spidergl && this._h._spidergl != this) return this._h._spidergl;
    var a = this._gl, d = this._cb, f = (this._dsa, this._t), g = this._h;
    g || (g = a.createTexture(), this._h = g), d.pushTexture(f), a.bindTexture(f, g), this._magFilter = a.getTexParameter(f, a.TEXTURE_MAG_FILTER), this._minFilter = a.getTexParameter(f, a.TEXTURE_MIN_FILTER), this._wrapS = a.getTexParameter(f, a.TEXTURE_WRAP_S), this._wrapT = a.getTexParameter(f, a.TEXTURE_WRAP_T), d.popTexture(f), g._spidergl = this, this._format = c.format, this._width = c.width, this._height = c.height, this._flipY = c.flipYPolicy, this._premultiplyAlpha = c.premultiplyAlphaPolicy, this._colorspaceConversion = c.colorspaceConversionPolicy, this._autoMipmap = c.autoMipmap, this._missingFaces = SpiderGL.WebGL.Texture._FACE_ALL_BITS, this.setSampler(c)
},SpiderGL.WebGL.Texture.TARGET = WebGLRenderingContext.prototype.NONE,SpiderGL.WebGL.Texture.DEFAULT_BORDER = 0,SpiderGL.WebGL.Texture.DEFAULT_FORMAT = WebGLRenderingContext.prototype.RGBA,SpiderGL.WebGL.Texture.DEFAULT_AUTO_GENERATE_MIPMAP = !1,SpiderGL.WebGL.Texture.DEFAULT_INTERNAL_FORMAT = WebGLRenderingContext.prototype.RGBA,SpiderGL.WebGL.Texture.DEFAULT_LEVEL = 0,SpiderGL.WebGL.Texture.DEFAULT_MAG_FILTER = WebGLRenderingContext.prototype.LINEAR,SpiderGL.WebGL.Texture.DEFAULT_MIN_FILTER = WebGLRenderingContext.prototype.LINEAR,SpiderGL.WebGL.Texture.DEFAULT_TYPE = WebGLRenderingContext.prototype.UNSIGNED_BYTE,SpiderGL.WebGL.Texture.DEFAULT_WRAP_S = WebGLRenderingContext.prototype.REPEAT,SpiderGL.WebGL.Texture.DEFAULT_WRAP_T = WebGLRenderingContext.prototype.REPEAT,SpiderGL.WebGL.Texture.DEFAULT_X_OFFSET = 0,SpiderGL.WebGL.Texture.DEFAULT_Y_OFFSET = 0,SpiderGL.WebGL.Texture.DEFAULT_UNPACK_FLIP_Y = !0,SpiderGL.WebGL.Texture.DEFAULT_UNPACK_PREMULTIPLY_ALPHA = !1,SpiderGL.WebGL.Texture.DEFAULT_UNPACK_COLORSPACE_CONVERSION = WebGLRenderingContext.prototype.NONE,SpiderGL.WebGL.Texture.unbind = function (a) {
},SpiderGL.WebGL.Texture._FACE_POSITIVE_X_BIT = 1,SpiderGL.WebGL.Texture._FACE_NEGATIVE_X_BIT = 2,SpiderGL.WebGL.Texture._FACE_POSITIVE_Y_BIT = 4,SpiderGL.WebGL.Texture._FACE_NEGATIVE_Y_BIT = 8,SpiderGL.WebGL.Texture._FACE_POSITIVE_Z_BIT = 16,SpiderGL.WebGL.Texture._FACE_NEGATIVE_Z_BIT = 32,SpiderGL.WebGL.Texture._FACE_ALL_BITS = SpiderGL.WebGL.Texture._FACE_POSITIVE_X_BIT | SpiderGL.WebGL.Texture._FACE_NEGATIVE_X_BIT | SpiderGL.WebGL.Texture._FACE_POSITIVE_Y_BIT | SpiderGL.WebGL.Texture._FACE_NEGATIVE_Y_BIT | SpiderGL.WebGL.Texture._FACE_POSITIVE_Z_BIT | SpiderGL.WebGL.Texture._FACE_NEGATIVE_Z_BIT,SpiderGL.WebGL.Texture._faceBits = {},SpiderGL.WebGL.Texture._faceBits[WebGLRenderingContext.prototype.TEXTURE_2D] = SpiderGL.WebGL.Texture._FACE_ALL_BITS,SpiderGL.WebGL.Texture._faceBits[WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP] = SpiderGL.WebGL.Texture._FACE_ALL_BITS;
SpiderGL.WebGL.Texture._faceBits[WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_POSITIVE_X] = SpiderGL.WebGL.Texture._FACE_POSITIVE_X_BIT;
SpiderGL.WebGL.Texture._faceBits[WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_NEGATIVE_X] = SpiderGL.WebGL.Texture._FACE_NEGATIVE_X_BIT, SpiderGL.WebGL.Texture._faceBits[WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_POSITIVE_Y] = SpiderGL.WebGL.Texture._FACE_POSITIVE_Y_BIT, SpiderGL.WebGL.Texture._faceBits[WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_NEGATIVE_Y] = SpiderGL.WebGL.Texture._FACE_NEGATIVE_Y_BIT, SpiderGL.WebGL.Texture._faceBits[WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_POSITIVE_Z] = SpiderGL.WebGL.Texture._FACE_POSITIVE_Z_BIT, SpiderGL.WebGL.Texture._faceBits[WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_NEGATIVE_Z] = SpiderGL.WebGL.Texture._FACE_NEGATIVE_Z_BIT, SpiderGL.WebGL.Texture.prototype = {
    _gl_deleteTexture: function (a) {
        this._h = null
    }, _gl_isTexture: function (a) {
    }, _gl_bindTexture: function (a, b) {
    }, _gl_getTexParameter: function (a, b) {
    }, _gl_copyTexImage2D: function (a, b, c, d, e, f, g, h) {
        0 == b && (this._format = c, this._width = f, this._height = g)
    }, _gl_copyTexSubImage2D: function (a, b, c, d, e, f, g, h, i) {
    }, _gl_generateMipmap: function (a) {
    }, _gl_texImage2D: function (a) {
        var b = arguments.length;
        6 === b ? 0 === arguments[1] && (this._format = arguments[2], this._width = arguments[5].width, this._height = arguments[5].height) : 9 === b && 0 === arguments[1] && (this._format = arguments[2], this._width = arguments[3], this._height = arguments[4])
    }, _gl_texParameterf: function (a, b, c) {
        this._setTexParameter(b, c)
    }, _gl_texParameteri: function (a, b, c) {
        this._setTexParameter(b, c)
    }, _gl_texSubImage2D: function (a) {
    }, _setTexParameter: function (a, b) {
        var c = this._gl;
        switch (a) {
            case c.TEXTURE_MAG_FILTER:
                this._magFilter = b;
                break;
            case c.TEXTURE_MIN_FILTER:
                this._minFilter = b;
                break;
            case c.TEXTURE_WRAP_S:
                this._wrapS = b;
                break;
            case c.TEXTURE_WRAP_T:
                this._wrapT = b
        }
    }, _setImageData: function (a, b, c) {
        c = SpiderGL.Utility.getDefaultObject({
            internalFormat: SpiderGL.WebGL.Texture.DEFAULT_INTERNAL_FORMAT,
            border: SpiderGL.WebGL.Texture.DEFAULT_BORDER,
            xoffset: SpiderGL.WebGL.Texture.DEFAULT_X_OFFSET,
            yoffset: SpiderGL.WebGL.Texture.DEFAULT_Y_OFFSET,
            level: SpiderGL.WebGL.Texture.DEFAULT_LEVEL,
            format: SpiderGL.WebGL.Texture.DEFAULT_FORMAT,
            type: SpiderGL.WebGL.Texture.DEFAULT_TYPE,
            width: 0,
            height: 0,
            generateMipmap: this._autoMipmap,
            flipY: this._flipY,
            premultiplyAlpha: this._premultiplyAlpha,
            colorspaceConversion: this._colorspaceConversion,
            data: null,
            url: null,
            onCancel: null,
            onError: null,
            onProgress: null,
            onSuccess: null
        }, c);
        var d = !!c.url, e = !1;
        d || (e = !c.data || SpiderGL.Type.isTypedArray(c.data));
        var f = !1;
        d || e || (f = SpiderGL.Type.instanceOf(c.data, HTMLImageElement) || SpiderGL.Type.instanceOf(c.data, HTMLCanvasElement) || SpiderGL.Type.instanceOf(c.data, HTMLVideoElement), f || "undefined" != typeof ImageData && (f = SpiderGL.Type.instanceOf(c.data, ImageData)));
        var g = this._gl, i = (this._cb, this._dsa), j = b, k = this._h, l = -1, m = -1, n = -1, o = -1, p = -1, q = -1;
        (e || f) && (l = c.flipY, l != SpiderGL.Core.DONT_CARE && (m = g.getParameter(g.UNPACK_FLIP_Y_WEBGL), l == m ? m = -1 : g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, l)), n = c.premultiplyAlpha, n != SpiderGL.Core.DONT_CARE && (o = g.getParameter(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL), n == o ? o = -1 : g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL, n)), p = c.colorspaceConversion, p != SpiderGL.Core.DONT_CARE && (q = g.getParameter(g.UNPACK_COLORSPACE_CONVERSION_WEBGL), p == q ? q = -1 : g.pixelStorei(g.UNPACK_COLORSPACE_CONVERSION_WEBGL, p)));
        var r = !1;
        if (d) {
            var s = {
                internalFormat: c.internalFormat,
                border: c.border,
                xoffset: c.xoffset,
                yoffset: c.yoffset,
                level: c.level,
                format: c.format,
                type: c.type,
                generateMipmap: c.generateMipmap,
                flipY: c.flipY,
                premultiplyAlpha: c.premultiplyAlpha,
                colorspaceConversion: c.colorspaceConversion,
                data: null
            }, t = this, u = c.onSuccess, v = new SpiderGL.IO.ImageRequest(c.url, {
                onCancel: c.onCancel,
                onError: c.onError,
                onProgress: c.onProgress,
                onSuccess: function () {
                    s.data = v.image, a ? t._setImage(b, s) : t._setSubImage(b, s), u && u()
                },
                send: !0
            });
            return !0
        }
        if (e) {
            if (c.width <= 0 || c.height <= 0) return !1;
            a ? (i.texImage2D(k, j, c.level, c.internalFormat, c.width, c.height, c.border, c.format, c.type, c.data), r = !0) : i.texSubImage2D(k, j, c.level, c.xoffset, c.yoffset, c.width, c.height, c.format, c.type, c.data)
        } else {
            if (!f) return !1;
            a ? (i.texImage2D(k, j, c.level, c.internalFormat, c.format, c.type, c.data), r = !0) : i.texSubImage2D(k, j, c.level, c.xoffset, c.yoffset, c.format, c.type, c.data)
        }
        return r && (this._missingFaces &= ~SpiderGL.WebGL.Texture._faceBits[j]), (e || f) && (m != -1 && g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, m), o != -1 && g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL, o), q != -1 && g.pixelStorei(g.UNPACK_COLORSPACE_CONVERSION_WEBGL, q)), c.generateMipmap && this.generateMipmap(), !0
    }, _setImage: function (a, b) {
        return this._setImageData(!0, a, b)
    }, _setSubImage: function (a, b) {
        return this._setImageData(!1, a, b)
    }, get isReady() {
        return 0 == this._missingFaces && this._width > 0 && this._height > 0
    }, get flipYPolicy() {
        return this._flipY
    }, set flipYPolicy(a) {
        this._flipY = SpiderGL.Utility.getDefaultValue(a, SpiderGL.WebGL.Context.DEFAULT_UNPACK_FLIP_Y)
    }, get premultuplyAlphaPolicy() {
        return this._premultuplyAlpha
    }, set premultuplyAlphaPolicy(a) {
        this._premultuplyAlpha = SpiderGL.Utility.getDefaultValue(a, SpiderGL.WebGL.Context.DEFAULT_UNPACK_PREMULTIPLY_ALPHA)
    }, get colorspaceConversionPolicy() {
        return this._colorspaceConversion
    }, set colorspaceConversionPolicy(a) {
        this._colorspaceConversion = SpiderGL.Utility.getDefaultValue(a, SpiderGL.WebGL.Context.DEFAULT_UNPACK_COLORSPACE_CONVERSION)
    }, get autoMipmap() {
        return this._autoMipmap
    }, set autoMipmap(a) {
        this._autoMipmap = a
    }, get format() {
        return this._format
    }, get width() {
        return this._width
    }, get height() {
        return this._height
    }, get magFilter() {
        return this._magFilter
    }, set magFilter(a) {
        a = SpiderGL.Utility.getDefaultValue(w, SpiderGL.WebGL.Texture.DEFAULT_MAG_FILTER), this._dsa.texParameteri(this._h, this._t, gl.TEXTURE_MAG_FILTER, a)
    }, get minFilter() {
        return this._minFilter
    }, set minFilter(a) {
        a = SpiderGL.Utility.getDefaultValue(w, SpiderGL.WebGL.Texture.DEFAULT_MIN_FILTER), this._dsa.texParameteri(this._h, this._t, gl.TEXTURE_MIN_FILTER, a)
    }, get wrapS() {
        return this._wrapS
    }, set wrapS(a) {
        a = SpiderGL.Utility.getDefaultValue(a, SpiderGL.WebGL.Texture.DEFAULT_WRAP_S), this._dsa.texParameteri(this._h, this._t, gl.TEXTURE_WRAP_S, a)
    }, get wrapT() {
        return this._wrapT
    }, set wrapT(a) {
        a = SpiderGL.Utility.getDefaultValue(a, SpiderGL.WebGL.Texture.DEFAULT_WRAP_T), this._dsa.texParameteri(this._h, this._t, gl.TEXTURE_WRAP_T, a)
    }, setSampler: function (a) {
        if (!a) return !1;
        var b = this._gl, c = this._cb, e = (this._dsa, this._t), f = this._h;
        c.pushTexture(e), b.bindTexture(e, f);
        var g = 0;
        return "magFilter" in a && (g = SpiderGL.Utility.getDefaultValue(a.magFilter, SpiderGL.WebGL.Texture.DEFAULT_MAG_FILTER), b.texParameteri(e, b.TEXTURE_MAG_FILTER, g)), "minFilter" in a && (g = SpiderGL.Utility.getDefaultValue(a.minFilter, SpiderGL.WebGL.Texture.DEFAULT_MIN_FILTER), b.texParameteri(e, b.TEXTURE_MIN_FILTER, g)), "wrapS" in a && (g = SpiderGL.Utility.getDefaultValue(a.wrapS, SpiderGL.WebGL.Texture.DEFAULT_WRAP_S), b.texParameteri(e, b.TEXTURE_WRAP_S, g)), "wrapT" in a && (g = SpiderGL.Utility.getDefaultValue(a.wrapT, SpiderGL.WebGL.Texture.DEFAULT_WRAP_T), b.texParameteri(e, b.TEXTURE_WRAP_T, g)), c.popTexture(e), !0
    }, getSampler: function () {
        return {magFilter: this._magFilter, minFilter: this._minFilter, wrapS: this._wrapS, wrapT: this._wrapT}
    }, generateMipmap: function () {
        0 == this._missingFaces && this._dsa.generateMipmap(this._h, this._t)
    }, destroy: function () {
        this._gl.deleteTexture(this._h)
    }, bind: function (a) {
        var b = this._gl, d = (this._cb, this._dsa);
        "undefined" == typeof a ? b.bindTexture(this._t, this._h) : d.bindTexture(b.TEXTURE0 + a, this._t, this._h)
    }, unbind: function (a) {
        var b = this._gl, d = (this._cb, this._dsa);
        "undefined" == typeof a ? b.bindTexture(this._t, null) : d.bindTexture(b.TEXTURE0 + a, this._t, null)
    }
}, SpiderGL.Type.extend(SpiderGL.WebGL.Texture, SpiderGL.WebGL.ObjectGL), SpiderGL.WebGL.Texture2D = function (a, b) {
    return SpiderGL.WebGL.Context.isHijacked(a) ? (SpiderGL.WebGL.Texture.call(this, a, SpiderGL.WebGL.Texture2D.TARGET, b), this._h && this._h._spidergl && this._h._spidergl != this ? this._h._spidergl : (b = b || {}, SpiderGL.Type.instanceOf(b, WebGLTexture) ? b = {handle: b} : SpiderGL.Type.isString(b) && (b = {url: b}), void(("url" in b || "data" in b || "width" in b && "height" in b) && this.setImage(b)))) : null
}, SpiderGL.WebGL.Texture2D.TARGET = WebGLRenderingContext.prototype.TEXTURE_2D, SpiderGL.WebGL.Texture2D.unbind = function (a, b) {
    var d = (a.getExtension("SGL_current_binding"), a.getExtension("SGL_direct_state_access"));
    "undefined" == typeof b ? a.bindTexture(SpiderGL.WebGL.Texture2D.TARGET, null) : d.bindTexture(a.TEXTURE0 + b, SpiderGL.WebGL.Texture2D.TARGET, null)
}, SpiderGL.WebGL.Texture2D.prototype = {
    setImage: function (a) {
        return this._setImage(this._t, a)
    }, setSubImage: function (a) {
        return this._setSubImage(this._t, a)
    }
}, SpiderGL.Type.extend(SpiderGL.WebGL.Texture2D, SpiderGL.WebGL.Texture), SpiderGL.WebGL.TextureCubeMap = function (a, b) {
    if (!SpiderGL.WebGL.Context.isHijacked(a)) return null;
    if (SpiderGL.WebGL.Texture.call(this, a, SpiderGL.WebGL.TextureCubeMap.TARGET, b), this._h && this._h._spidergl && this._h._spidergl != this) return this._h._spidergl;
    b = b || {}, SpiderGL.Type.instanceOf(b, WebGLTexture) ? b = {handle: b} : SpiderGL.Type.isString(b) && (b = {url: b});
    var c = SpiderGL.WebGL.TextureCubeMap._faceTargets;
    if (b.url) {
        var d = b.url, e = b.onSuccess;
        e && (b.onSuccess = function () {
            var a = 6;
            return function () {
                --a, 0 == a && e.apply(b, null)
            }
        }());
        for (var f = 0; f < 6; ++f) b.url = d[f], this.setImage(c[f], b);
        b.onSuccess = e
    } else if (b.data) for (var g = b.data, f = 0; f < 6; ++f) b.data = g[f], this.setImage(c[f], b); else if (b.width > 0 && b.height > 0) for (var f = 0; f < 6; ++f) this.setImage(c[f], b)
}, SpiderGL.WebGL.TextureCubeMap.TARGET = WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP, SpiderGL.WebGL.TextureCubeMap.unbind = function (a, b) {
    var d = (a.getExtension("SGL_current_binding"), a.getExtension("SGL_direct_state_access"));
    "undefined" == typeof b ? a.bindTexture(SpiderGL.WebGL.TextureCubeMap.TARGET, null) : d.bindTexture(a.TEXTURE0 + b, SpiderGL.WebGL.TextureCubeMap.TARGET, null)
}, SpiderGL.WebGL.TextureCubeMap._faceTargets = [WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_POSITIVE_X, WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_NEGATIVE_X, WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_POSITIVE_Y, WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_NEGATIVE_Y, WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_POSITIVE_Z, WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_NEGATIVE_Z], SpiderGL.WebGL.TextureCubeMap.prototype = {
    setImage: function (a, b) {
        return this._setImage(a, b)
    }, setSubImage: function (a, b) {
        return this._setSubImage(a, b)
    }
}, SpiderGL.Type.extend(SpiderGL.WebGL.TextureCubeMap, SpiderGL.WebGL.Texture), SpiderGL.Model = {}, SpiderGL.Model.Model = function (a, b, c) {
    SpiderGL.Core.ObjectBase.call(this), c = SpiderGL.Utility.getDefaultObject({}, c), b && "vertices" in b && (b = SpiderGL.Model.Model._createSimpleDescriptor(b)), this._descriptor = SpiderGL.Model.Model._fixDescriptor(b), this._gl = null, this._renderData = {}, a && (this.updateGL(a, c), this.updateRenderData())
}, SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_SIZE = 3, SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_TYPE = SpiderGL.Type.FLOAT32, SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_NORMALIZED = !1, SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_STRIDE = 0, SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_OFFSET = 0, SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_MODE = SpiderGL.Type.TRIANGLES, SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_FIRST = 0, SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_COUNT = -1, SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_TYPE = SpiderGL.Type.UINT16, SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_OFFSET = 0, SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_VERTEX_MAP = {}, SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_VERTEX_MAP.position = {
    size: 3,
    type: SpiderGL.Type.FLOAT32,
    normalized: !1,
    semantic: "POSITION",
    index: 0,
    value: [0, 0, 0, 1]
}, SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_VERTEX_MAP.normal = {
    size: 3,
    type: SpiderGL.Type.FLOAT32,
    normalized: !1,
    semantic: "NORMAL",
    index: 0,
    value: [0, 0, 1, 0]
}, SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_VERTEX_MAP.color = {
    size: 4,
    type: SpiderGL.Type.UINT8,
    normalized: !0,
    semantic: "COLOR",
    index: 0,
    value: [0, 0, 0, 255]
}, SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_VERTEX_MAP.texcoord = {
    size: 2,
    type: SpiderGL.Type.FLOAT32,
    normalized: !1,
    semantic: "TEXCOORD",
    index: 0,
    value: [0, 0, 0, 1]
}, SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_VERTEX_MAP.user = {
    size: 3,
    type: SpiderGL.Type.FLOAT32,
    normalized: !1,
    semantic: "USER",
    index: 0,
    value: [0, 0, 0, 1]
}, SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP = {}, SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP.triangles = {
    mode: SpiderGL.Type.TRIANGLES,
    type: SpiderGL.Type.UINT16,
    count: -1,
    semantic: "FILL"
}, SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP.triangleStrip = {
    mode: SpiderGL.Type.TRIANGLE_STRIP,
    type: SpiderGL.Type.UINT16,
    count: -1,
    semantic: "FILL"
}, SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP.triangleFan = {
    mode: SpiderGL.Type.TRIANGLE_FAN,
    type: SpiderGL.Type.UINT16,
    count: -1,
    semantic: "FILL"
}, SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP.lines = {
    mode: SpiderGL.Type.LINES,
    type: SpiderGL.Type.UINT16,
    count: -1,
    semantic: "LINE"
}, SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP.lineStrip = {
    mode: SpiderGL.Type.LINE_STRIP,
    type: SpiderGL.Type.UINT16,
    count: -1,
    semantic: "LINE"
}, SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP.lineLoop = {
    mode: SpiderGL.Type.LINE_LOOP,
    type: SpiderGL.Type.UINT16,
    count: -1,
    semantic: "LINE"
}, SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP.points = {
    mode: SpiderGL.Type.POINTS,
    type: SpiderGL.Type.UINT16,
    count: -1,
    semantic: "POINT"
}, SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP.user = {
    mode: SpiderGL.Type.TRIANGLES,
    type: SpiderGL.Type.UINT16,
    count: -1,
    semantic: "FILL"
}, SpiderGL.Model.Model._fixDescriptor = function (a) {
    return a = SpiderGL.Utility.getDefaultObject({
        version: "0.0.0.1 EXP",
        meta: null,
        data: null,
        access: null,
        semantic: null,
        logic: null
    }, a), a.meta = SpiderGL.Model.Model._fixDescriptorMeta(a.meta), a.data = SpiderGL.Model.Model._fixDescriptorData(a.data), a.access = SpiderGL.Model.Model._fixDescriptorAccess(a.access), a.semantic = SpiderGL.Model.Model._fixDescriptorSemantic(a.semantic), a.logic = SpiderGL.Model.Model._fixDescriptorLogic(a.logic), a
}, SpiderGL.Model.Model._fixDescriptorMeta = function (a) {
    return a = SpiderGL.Utility.getDefaultObject({author: null, date: null, description: null}, a)
}, SpiderGL.Model.Model._fixDescriptorData = function (a) {
    return a = SpiderGL.Utility.getDefaultObject({
        vertexBuffers: null,
        indexBuffers: null
    }, a), a.vertexBuffers = SpiderGL.Model.Model._fixDescriptorDataVertexBuffers(a.vertexBuffers), a.indexBuffers = SpiderGL.Model.Model._fixDescriptorDataIndexBuffers(a.indexBuffers), a
}, SpiderGL.Model.Model._fixDescriptorDataVertexBuffers = function (a) {
    a = SpiderGL.Utility.getDefaultObject({}, a);
    for (var b in a) a[b] = SpiderGL.Model.Model._fixDescriptorDataVertexBuffer(a[b]);
    return a
}, SpiderGL.Model.Model._fixDescriptorDataVertexBuffer = function (a) {
    return SpiderGL.Model.Model._fixDescriptorDataBuffer(a)
}, SpiderGL.Model.Model._fixDescriptorDataIndexBuffers = function (a) {
    a = SpiderGL.Utility.getDefaultObject({}, a);
    for (var b in a) a[b] = SpiderGL.Model.Model._fixDescriptorDataIndexBuffer(a[b]);
    return a
}, SpiderGL.Model.Model._fixDescriptorDataIndexBuffer = function (a) {
    return SpiderGL.Model.Model._fixDescriptorDataBuffer(a)
}, SpiderGL.Model.Model._fixDescriptorDataBuffer = function (a) {
    return a = SpiderGL.Utility.getDefaultObject({
        type: SpiderGL.Type.NO_TYPE,
        glType: WebGLRenderingContext.prototype.NONE,
        untypedArray: null,
        typedArray: null,
        glBuffer: null
    }, a)
}, SpiderGL.Model.Model._fixDescriptorAccess = function (a) {
    return a = SpiderGL.Utility.getDefaultObject({
        vertexStreams: null,
        primitiveStreams: null
    }, a), a.vertexStreams = SpiderGL.Model.Model._fixDescriptorAccessVertexStreams(a.vertexStreams), a.primitiveStreams = SpiderGL.Model.Model._fixDescriptorAccessPrimitiveStreams(a.primitiveStreams), a
}, SpiderGL.Model.Model._fixDescriptorAccessVertexStreams = function (a) {
    a = SpiderGL.Utility.getDefaultObject({}, a);
    for (var b in a) a[b] = SpiderGL.Model.Model._fixDescriptorAccessVertexStream(a[b]);
    return a
}, SpiderGL.Model.Model._fixDescriptorAccessVertexStream = function (a) {
    return a = SpiderGL.Utility.getDefaultObject({
        buffer: null,
        size: SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_SIZE,
        type: SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_TYPE,
        glType: SpiderGL.Type.typeToGL(SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_TYPE),
        normalized: SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_NORMALIZED,
        stride: SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_STRIDE,
        offset: SpiderGL.Model.Model.DEFAULT_VERTEX_STREAM_OFFSET
    }, a)
}, SpiderGL.Model.Model._fixDescriptorAccessPrimitiveStreams = function (a) {
    a = SpiderGL.Utility.getDefaultObject({}, a);
    for (var b in a) a[b] = SpiderGL.Model.Model._fixDescriptorAccessPrimitiveStream(a[b]);
    return a
}, SpiderGL.Model.Model._fixDescriptorAccessPrimitiveStream = function (a) {
    return a = SpiderGL.Utility.getDefaultObject({
        buffer: null,
        mode: SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_MODE,
        first: SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_FIRST,
        count: SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_COUNT,
        type: SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_TYPE,
        glType: SpiderGL.Type.typeToGL(SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_TYPE),
        offset: SpiderGL.Model.Model.DEFAULT_PRIMITIVE_STREAM_OFFSET
    }, a)
}, SpiderGL.Model.Model._fixDescriptorSemantic = function (a) {
    return a = SpiderGL.Utility.getDefaultObject({
        bindings: null,
        chunks: null
    }, a), a.bindings = SpiderGL.Model.Model._fixDescriptorSemanticBindings(a.bindings), a.chunks = SpiderGL.Model.Model._fixDescriptorSemanticChunks(a.chunks), a
}, SpiderGL.Model.Model._fixDescriptorSemanticBindings = function (a) {
    a = SpiderGL.Utility.getDefaultObject({}, a);
    for (var b in a) a[b] = SpiderGL.Model.Model._fixDescriptorSemanticBinding(a[b]);
    return a
}, SpiderGL.Model.Model._fixDescriptorSemanticBinding = function (a) {
    return a = SpiderGL.Utility.getDefaultObject({
        vertexStreams: null,
        primitiveStreams: null
    }, a), a.vertexStreams = SpiderGL.Model.Model._fixDescriptorSemanticBindingVertexStreams(a.vertexStreams), a.primitiveStreams = SpiderGL.Model.Model._fixDescriptorSemanticBindingPrimitiveStreams(a.primitiveStreams), a
}, SpiderGL.Model.Model._fixDescriptorSemanticBindingVertexStreams = function (a) {
    a = SpiderGL.Utility.getDefaultObject({}, a);
    for (var b in a) a[b] = SpiderGL.Model.Model._fixDescriptorSemanticBindingVertexStream(a[b]);
    return a
}, SpiderGL.Model.Model._fixDescriptorSemanticBindingVertexStream = function (a) {
    return a ? SpiderGL.Type.isArray(a) ? a.slice() : [a] : null
}, SpiderGL.Model.Model._fixDescriptorSemanticBindingPrimitiveStreams = function (a) {
    a = SpiderGL.Utility.getDefaultObject({}, a);
    for (var b in a) a[b] = SpiderGL.Model.Model._fixDescriptorSemanticBindingPrimitiveStream(a[b]);
    return a
}, SpiderGL.Model.Model._fixDescriptorSemanticBindingPrimitiveStream = function (a) {
    return a ? SpiderGL.Type.isArray(a) ? a.slice() : [a] : null
}, SpiderGL.Model.Model._fixDescriptorSemanticChunks = function (a) {
    a = SpiderGL.Utility.getDefaultObject({}, a);
    for (var b in a) a[b] = SpiderGL.Model.Model._fixDescriptorSemanticChunk(a[b]);
    return a
}, SpiderGL.Model.Model._fixDescriptorSemanticChunk = function (a) {
    return a = SpiderGL.Utility.getDefaultObject({techniques: null}, a), a.techniques = SpiderGL.Model.Model._fixDescriptorSemanticChunkTechniques(a.techniques), a
}, SpiderGL.Model.Model._fixDescriptorSemanticChunkTechniques = function (a) {
    a = SpiderGL.Utility.getDefaultObject({}, a);
    for (var b in a) a[b] = SpiderGL.Model.Model._fixDescriptorSemanticChunkTechnique(a[b]);
    return a
}, SpiderGL.Model.Model._fixDescriptorSemanticChunkTechnique = function (a) {
    return a = SpiderGL.Utility.getDefaultObject({binding: null}, a)
}, SpiderGL.Model.Model._fixDescriptorLogic = function (a) {
    return a = SpiderGL.Utility.getDefaultObject({parts: null}, a), a.parts = SpiderGL.Model.Model._fixDescriptorLogicParts(a.parts), a
}, SpiderGL.Model.Model._fixDescriptorLogicParts = function (a) {
    a = SpiderGL.Utility.getDefaultObject({}, a);
    for (var b in a) a[b] = SpiderGL.Model.Model._fixDescriptorLogicPart(a[b]);
    return a
}, SpiderGL.Model.Model._fixDescriptorLogicPart = function (a) {
    return a = SpiderGL.Utility.getDefaultObject({chunks: null}, a), a.chunks = SpiderGL.Model.Model._fixDescriptorLogicPartChunks(a.chunks), a
}, SpiderGL.Model.Model._fixDescriptorLogicPartChunks = function (a) {
    return a ? SpiderGL.Type.isArray(a) ? a.slice() : [a] : null
}, SpiderGL.Model.Model._createSimpleDescriptor = function (a) {
    a = SpiderGL.Utility.getDefaultObject({vertices: null, primitives: null, options: null}, a);
    var b = "mainBinding", c = "mainChunk", d = "mainPart", e = "VertexBuffer", f = "IndexBuffer", g = {
        data: {vertexBuffers: {}, indexBuffers: {}},
        access: {vertexStreams: {}, primitiveStreams: {}},
        semantic: {bindings: {}, chunks: {}},
        logic: {parts: {}}
    }, h = {vertexStreams: {}, primitiveStreams: {}};
    g.semantic.bindings[b] = h;
    var i = {techniques: {common: {binding: b}}};
    g.semantic.chunks[c] = i;
    var j = {chunks: [c]};
    g.logic.parts[d] = j;
    var k = -1, l = !1, m = !1;
    for (var n in a.vertices) {
        var o = a.vertices[n];
        if (o) {
            (SpiderGL.Type.isArray(o) || SpiderGL.Type.isTypedArray(o) || SpiderGL.Type.instanceOf(o, ArrayBuffer)) && (o = {data: o});
            var p = SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_VERTEX_MAP[n], q = null;
            p ? q = p.semantic : (p = SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_VERTEX_MAP.user, q = n.toUpperCase());
            var r = SpiderGL.Utility.getDefaultObject({
                size: p.size,
                type: p.type,
                normalized: p.normalized,
                semantic: q,
                index: p.index,
                data: null,
                value: p.value.slice()
            }, o), s = {
                buffer: null,
                size: r.size,
                type: r.type,
                normalized: r.normalized,
                stride: 0,
                offset: 0,
                value: r.value.slice()
            };
            if (r.data) {
                var t = {type: r.type}, u = 0;
                if (SpiderGL.Type.isArray(r.data)) t.untypedArray = r.data, u = t.untypedArray.length / s.size; else {
                    if (!SpiderGL.Type.isTypedArray(o) && !SpiderGL.Type.instanceOf(o, ArrayBuffer)) continue;
                    t.typedArray = r.data, u = (t.typedArray.byteLength - s.offset) / (s.size * SpiderGL.Type.typeSize(s.type))
                }
                u = SpiderGL.Math.floor(u), l = !0, k = k >= 0 ? SpiderGL.Math.min(k, u) : u;
                var v = n + e;
                g.data.vertexBuffers[v] = t, s.buffer = v
            } else m = !0;
            var w = n;
            g.access.vertexStreams[w] = s;
            var x = new Array(r.index + 1);
            x[r.index] = w, h.vertexStreams[r.semantic] = x
        }
    }
    var y = 0;
    l ? y = k : m && (y = 1);
    var z = a.primitives;
    if (SpiderGL.Type.isString(z) && (z = [z]), SpiderGL.Type.isArray(z)) {
        var A = z;
        z = {};
        for (var B = 0, C = A.length; B < C; ++B) {
            var D = A[B];
            SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP[D] && (z[D] = {})
        }
    }
    for (var n in z) {
        var o = z[n];
        if (o) {
            (SpiderGL.Type.isArray(o) || SpiderGL.Type.isTypedArray(o) || SpiderGL.Type.instanceOf(o, ArrayBuffer)) && (o = {data: o});
            var p = SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP[n];
            p || (p = SpiderGL.Model.Model.DEFAULT_SIMPLE_MODEL_PRIMITIVE_MAP.user);
            var r = SpiderGL.Utility.getDefaultObject({
                mode: p.mode,
                type: p.type,
                count: p.count >= 0 ? p.count : y,
                semantic: p.semantic
            }, o), s = {buffer: null, mode: r.mode, first: 0, count: r.count, type: r.type, offset: 0};
            if (r.data) {
                var t = {type: r.type}, u = 0;
                if (SpiderGL.Type.isArray(r.data)) t.untypedArray = r.data, u = t.untypedArray.length; else {
                    if (!SpiderGL.Type.isTypedArray(o) && !SpiderGL.Type.instanceOf(o, ArrayBuffer)) continue;
                    t.typedArray = r.data, u = (t.typedArray.byteLength - s.offset) / SpiderGL.Type.typeSize(s.type)
                }
                u = SpiderGL.Math.floor(u);
                var v = n + f;
                g.data.indexBuffers[v] = t, s.buffer = v, s.count = u
            }
            var w = n;
            g.access.primitiveStreams[w] = s;
            var x = new Array(1);
            x[0] = w, h.primitiveStreams[r.semantic] = x
        }
    }
    return g
}, SpiderGL.Model.Model.prototype = {
    get descriptor() {
        return this._descriptor
    }, get isReady() {
        return !!this._descriptor
    }, get gl() {
        return this._gl
    }, get renderData() {
        return this._renderData
    }, updateTypedArrays: function () {
        var a = this._descriptor;
        if (!a) return !1;
        var b = null, c = null, d = a.data.vertexBuffers;
        for (var e in d) b = d[e], b.untypedArray && (c = SpiderGL.Type.typeToTypedArrayConstructor(b.type), b.typedArray = new c(b.untypedArray));
        var f = a.data.indexBuffers;
        for (var e in f) b = f[e], b.untypedArray && (c = SpiderGL.Type.typeToTypedArrayConstructor(b.type), b.typedArray = new c(b.untypedArray));
        return !0
    }, updateGL: function (a, b) {
        if (!a) return !1;
        var c = this._descriptor;
        if (!c) return !1;
        this._gl = a;
        var d = null, f = null, g = SpiderGL.Utility.getDefaultObject({data: null, usage: SpiderGL.Core.DEFAULT}, b);
        g.data = null;
        for (var h in c.data.vertexBuffers) d = c.data.vertexBuffers[h], g.data = d.typedArray, g.data || (f = SpiderGL.Type.typeToTypedArrayConstructor(d.type), g.data = new f(d.untypedArray)), d.glBuffer && (d.glBuffer.destroy(), d.glBuffer = null), d.glBuffer = new SpiderGL.WebGL.VertexBuffer(a, g);
        for (var h in c.data.indexBuffers) d = c.data.indexBuffers[h], g.data = d.typedArray, g.data || (f = SpiderGL.Type.typeToTypedArrayConstructor(d.type), g.data = new f(d.untypedArray)), d.glBuffer && (d.glBuffer.destroy(), d.glBuffer = null), d.glBuffer = new SpiderGL.WebGL.IndexBuffer(a, g);
        var i = null;
        for (var h in c.access.vertexStreams) i = c.access.vertexStreams[h], i.glType = SpiderGL.Type.typeToGL(i.type);
        for (var h in c.access.primitiveStreams) i = c.access.primitiveStreams[h], i.glMode = SpiderGL.Type.primitiveToGL(i.mode), i.glType = SpiderGL.Type.typeToGL(i.type);
        return !0
    }, destroyGL: function () {
        var a = this._descriptor;
        if (!a) return !1;
        var b = null;
        for (var c in a.data.vertexBuffers) b = a.data.vertexBuffers[c], b.glBuffer && (b.glBuffer.destroy(), b.glBuffer = null);
        for (var c in a.data.indexBuffers) b = a.data.indexBuffers[c], b.glBuffer && (b.glBuffer.destroy(), b.glBuffer = null)
    }, updateRenderData: function () {
        var a = this._descriptor;
        if (!a) return !1;
        var b = {partMap: {}};
        for (var c in a.logic.parts) {
            var d = a.logic.parts[c], e = d.chunks, f = {};
            b.partMap[c] = f;
            for (var g = 0, h = e.length; g < h; ++g) {
                var i = e[g], j = a.semantic.chunks[i], k = {};
                f[i] = k;
                var l = j.techniques;
                for (var m in l) {
                    var n = l[m], o = {vertexStreams: {buffered: [], constant: []}, primitiveStreams: {}};
                    k[m] = o;
                    var p = a.semantic.bindings[n.binding], q = p.vertexStreams, r = {};
                    for (var s in q) for (var t = q[s], u = 0, v = t.length; u < v; ++u) {
                        var w = t[u], x = a.access.vertexStreams[w], y = {semantic: s, index: u, stream: x},
                            z = x.buffer;
                        z ? (r[z] = r[z] || [], r[z].push(y)) : o.vertexStreams.constant.push(y)
                    }
                    for (var z in r) {
                        var A = {buffer: a.data.vertexBuffers[z], streams: r[z].slice()};
                        o.vertexStreams.buffered.push(A)
                    }
                    var q = p.primitiveStreams;
                    for (var s in q) {
                        var r = {}, B = {buffered: [], array: []};
                        o.primitiveStreams[s] = B;
                        for (var t = q[s], u = 0, v = t.length; u < v; ++u) {
                            var w = t[u], x = a.access.primitiveStreams[w], z = x.buffer;
                            z ? (r[z] = r[z] || [], r[z].push(x)) : B.array.push(x)
                        }
                        for (var z in r) {
                            var A = {buffer: a.data.indexBuffers[z], streams: r[z].slice()};
                            B.buffered.push(A)
                        }
                    }
                }
            }
        }
        this._renderData = b
    }
}, SpiderGL.Type.extend(SpiderGL.Model.Model, SpiderGL.Core.ObjectBase), SpiderGL.Model.Technique = function (a, b, c) {
    SpiderGL.Core.ObjectBase.call(this), c = SpiderGL.Utility.getDefaultObject({}, c), b && "vertexShader" in b && "fragmentShader" in b && (b = SpiderGL.Model.Technique._createSimpleDescriptor(a, b)), this._descriptor = SpiderGL.Model.Technique._fixDescriptor(b), this._gl = this._descriptor.program.gl, this._renderData = {}, a && this.updateRenderData()
}, SpiderGL.Model.Technique._fixDescriptor = function (a) {
    return a = SpiderGL.Utility.getDefaultObject({
        name: "common",
        program: null,
        semantic: {}
    }, a), a.vertexStreams && (a.semantic.vertexStreams = a.vertexStreams, delete a.vertexStreams), a.globals && (a.semantic.globals = a.globals, delete a.globals), a.semantic = SpiderGL.Model.Technique._fixSemantic(a.program, a.semantic), a
}, SpiderGL.Model.Technique._fixSemantic = function (a, b) {
    return b = SpiderGL.Utility.getDefaultObject({
        vertexStreams: null,
        globals: null
    }, b), b.vertexStreams = SpiderGL.Model.Technique._fixVertexStreams(a, b.vertexStreams), b.globals = SpiderGL.Model.Technique._fixGlobals(a, b.globals), b
}, SpiderGL.Model.Technique._fixVertexStreams = function (a, b) {
    for (var c = "0123456789", d = a.getAttributesNames(), e = {}, f = 0, g = d.length; f < g; ++f) {
        for (var h = d[f], i = "", j = "", k = h.length - 1; k >= 0; --k) {
            var l = h.charAt(k);
            if (c.indexOf(l, 0) == -1) {
                i = h.substring(0, k + 1);
                break
            }
            j = l + j
        }
        var m = j.length > 0 ? parseInt(j) : 0, n = i.length;
        if (n >= 2 && "a" == i.charAt(0)) {
            var l = i.charAt(1);
            "_" == l && n > 2 ? i = i.substring(2) : l == i.charAt(1).toUpperCase() && (i = i.substring(1))
        }
        var o = i.toUpperCase();
        e[h] = {semantic: o, index: m, value: [0, 0, 0, 1]}
    }
    var p = {};
    for (var q in b) {
        var r = e[q];
        if (r) {
            var s = b[q];
            SpiderGL.Type.isString(s) ? s = {semantic: s} : SpiderGL.Type.isArray(s) || SpiderGL.Type.isTypedArray(s) ? s = {value: s} : SpiderGL.Type.isNumber(s) && (s = {value: [s, s, s, s]}), p[q] = SpiderGL.Utility.getDefaultObject({
                semantic: r.semantic,
                index: r.index,
                value: r.value
            }, s)
        }
    }
    return b = SpiderGL.Utility.getDefaultObject(e, p)
}, SpiderGL.Model.Technique._fixGlobals = function (a, b) {
    var c = a.getUniformsValues(), d = {};
    for (var e in c) {
        var f = e, g = f.length;
        if (g >= 2 && "u" == f.charAt(0)) {
            var h = f.charAt(1);
            "_" == h && g > 2 ? f = f.substring(2) : h == f.charAt(1).toUpperCase() && (f = f.substring(1))
        }
        var i = f.toUpperCase();
        d[e] = {semantic: i, value: c[e]}
    }
    return b = SpiderGL.Utility.getDefaultObject(d, b)
}, SpiderGL.Model.Technique._createSimpleDescriptor = function (a, b) {
    b = SpiderGL.Utility.getDefaultObject({
        name: "common",
        vertexShader: null,
        fragmentShader: null,
        attributes: null,
        uniforms: null,
        semantic: {},
        vertexStreams: null,
        globals: null,
        options: null
    }, b), b.vertexStreams && (b.semantic.vertexStreams = b.vertexStreams, delete b.vertexStreams), b.globals && (b.semantic.globals = b.globals, delete b.globals);
    var c = {name: b.name, program: null, semantic: b.semantic};
    if (!a) return c;
    var d = b.vertexShader, e = b.fragmentShader;
    if (!d || !e) return c;
    if (SpiderGL.Type.isString(d)) d = new SpiderGL.WebGL.VertexShader(a, d); else if (!SpiderGL.Type.instanceOf(d, SpiderGL.WebGL.VertexShader)) return c;
    if (SpiderGL.Type.isString(e)) e = new SpiderGL.WebGL.FragmentShader(a, e); else if (!SpiderGL.Type.instanceOf(e, SpiderGL.WebGL.FragmentShader)) return c;
    var f = new SpiderGL.WebGL.Program(a, {shaders: [d, e], attributes: b.attributes, uniforms: b.uniforms});
    return c.program = f, c
}, SpiderGL.Model.Technique.prototype = {
    get descriptor() {
        return this._descriptor
    }, get isReady() {
        return !!this._descriptor
    }, get gl() {
        return this._gl
    }, get name() {
        return this._descriptor.name
    }, get renderData() {
        return this._renderData
    }, get program() {
        return this._descriptor.program
    }, setUniforms: function (a) {
        this._descriptor.program.setUniforms(a)
    }, updateRenderData: function () {
        var a = this._descriptor, b = {};
        this._renderData = b;
        var c = {};
        b.attributesMap = c;
        var d = a.program.getAttributesIndices();
        for (var e in a.semantic.vertexStreams) {
            var f = a.semantic.vertexStreams[e], g = f.semantic, h = c[g];
            h || (h = [], c[g] = h), h[f.index] = {index: d[e], value: f.value}
        }
        var i = {};
        b.globalsMap = i;
        for (var j in a.semantic.globals) {
            var f = a.semantic.globals[j];
            i[f.semantic] = {name: j, value: f.value}
        }
    }
}, SpiderGL.Model.ModelRenderer = function (a) {
    this._gl = a, this._vertexAttributesCount = a.getParameter(a.MAX_VERTEX_ATTRIBS), this._textureUnitsCount = a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS), this._internalFramebuffer = new SpiderGL.WebGL.Framebuffer(a), this._reset()
}, SpiderGL.Model.ModelRenderer.prototype = {
    _reset: function () {
        this._technique = null, this._model = null, this._partName = null, this._chunkName = null, this._primMode = null, this._framebuffer = null, this._inBegin = !1, this._enabledArrays = [], this._boundTextures = [], this._attribValues = [], this._primitiveStreams = [], this._techniqueDirty = !0, this._modelDirty = !0, this._modelPartDirty = !0, this._modelChunkDirty = !0, this._primModeDirty = !0, this._framebufferDirty = !0, this._viewportDirty = !0, this._dirty = !0
    }, _resetContext: function () {
        for (var a = this._gl, b = 0, c = this._vertexAttributesCount; b < c; ++b) a.disableVertexAttribArray(b);
        for (var b = this._textureUnitsCount - 1; b >= 0; --b) a.activeTexture(a.TEXTURE0 + b), a.bindTexture(a.TEXTURE_2D, null), a.bindTexture(a.TEXTURE_CUBE_MAP, null);
        SpiderGL.WebGL.VertexBuffer.unbind(a), SpiderGL.WebGL.IndexBuffer.unbind(a), SpiderGL.WebGL.Program.unbind(a), SpiderGL.WebGL.Framebuffer.unbind(a)
    }, _update: function () {
        if (!this._dirty) return !0;
        var a = this._gl;
        if (this._techniqueDirty) {
            var b = this._technique;
            if (!b) return !1;
            var c = b.renderData, d = c.attributesMap, e = [];
            for (var f in d) {
                var g = d[f];
                for (var h in g) {
                    var i = g[h], j = null;
                    i && (j = {index: i.index, value: i.value}), e.push(j)
                }
            }
            this._attribValues = e, b.program.bind(), this._techniqueDirty = !1
        }
        if (this._modelDirty) {
            var k = this._model;
            if (!k) return !1;
            for (var e = this._attribValues, h = 0, l = e.length; h < l; ++h) {
                var j = e[h];
                j && a.vertexAttrib4fv(j.index, j.value)
            }
            var m = k.renderData, b = this._technique;
            if (!b) return !1;
            var c = b.renderData;
            if (!c) return !1;
            var d = c.attributesMap;
            if (this._modelPartDirty) {
                var n = this._partName;
                if (!n) return !1;
                this._modelPartDirty = !1
            }
            if (this._modelChunkDirty) {
                var o = this._chunkName;
                if (!o) return !1;
                var p = m.partMap[this._partName];
                if (!p) return !1;
                var q = p[o];
                if (!q) return !1;
                var r = q[b.name];
                if (r || (r = q.common), !r) return !1;
                for (var s = this._enabledArrays, h = 0, l = s.length; h < l; ++h) a.disableVertexAttribArray(s[h]);
                s = [];
                for (var t = r.vertexStreams.buffered, h = 0, l = t.length; h < l; ++h) {
                    var u = t[h], v = u.buffer.glBuffer;
                    v.bind();
                    for (var w = u.streams, x = 0, y = w.length; x < y; ++x) {
                        var z = w[x];
                        if (d[z.semantic] && d[z.semantic][z.index]) {
                            var A = d[z.semantic][z.index].index, B = z.stream;
                            B.index = A, s.push(A), v.vertexAttribPointer(B)
                        }
                    }
                }
                this._enabledArrays = s;
                for (var w = r.vertexStreams.constant, x = 0, l = w.length; x < l; ++x) {
                    var z = w[x];
                    if (d[z.semantic] && d[z.semantic][z.index]) {
                        var A = d[z.semantic][z.index].index, B = z.stream;
                        a.vertexAttrib4fv(A, B.value)
                    }
                }
                this._modelChunkDirty = !1
            }
            if (this._primModeDirty) {
                var C = this._primMode;
                if (!C) return !1;
                var p = m.partMap[this._partName];
                if (!p) return !1;
                var q = p[this._chunkName];
                if (!q) return !1;
                var r = q[b.name];
                if (r || (r = q.common), !r) return !1;
                var D = r.primitiveStreams[C];
                if (!D) return !1;
                this._primitiveStreams = D, this._primModeDirty = !1
            }
            this._modelDirty = !1
        }
        return this._framebufferDirty && (this._framebuffer ? this._framebuffer.bind() : SpiderGL.WebGL.Framebuffer.unbind(a), this._framebufferDirty = !1), this._viewportDirty && (this._framebuffer && this._framebuffer.autoViewport && this._framebuffer.applyViewport(), this._viewportDirty = !1), this._dirty = !1, !0
    }, get gl() {
        return this._gl
    }, get isValid() {
        return !!this._gl
    }, destroy: function () {
        this.end(), this._internalFramebuffer.destroy(), this._internalFramebuffer = null, this._gl = null
    }, begin: function () {
        this._inBegin || (this._resetContext(), this._inBegin = !0)
    }, end: function () {
        if (this._inBegin) {
            this._inBegin = !1;
            for (var a = this._gl, b = this._enabledArrays, c = 0, d = b.length; c < d; ++c) a.disableVertexAttribArray(b[c]);
            for (var e = this._boundTextures, c = 0, d = e.length; c < d; ++c) {
                var f = e[c];
                f && (f.target == a.TEXTURE_2D ? SpiderGL.WebGL.Texture2D.unbind(a, f.unit) : f.target == a.TEXTURE_CUBE_MAP && SpiderGL.WebGL.TextureCubeMap.unbind(a, f.unit))
            }
            this._framebuffer && SpiderGL.WebGL.Framebuffer.unbind(this._gl), this._internalFramebuffer.detachAll(), this._reset(), this._resetContext()
        }
    }, get isInBegin() {
        return this._inBegin
    }, setTechnique: function (a) {
        this._inBegin && this._technique != a && (this._technique = a, this._techniqueDirty = !0, this._dirty = !0, a || SpiderGL.WebGL.Program.unbind(this._gl))
    }, get technique() {
        return this._technique
    }, setModel: function (a) {
        this._inBegin && this._model != a && (this._model = a, this._modelDirty = !0, this._modelPartDirty = !0, this._modelChunkDirty = !0, this._dirty = !0)
    }, get model() {
        return this._model
    }, setPart: function (a) {
        this._inBegin && this._part != a && (this._partName = a, this._modelPartDirty = !0, this._modelDirty = !0, this._dirty = !0)
    }, get part() {
        return this._partName
    }, setChunk: function (a) {
        this._inBegin && this._chunk != a && (this._chunkName = a, this._modelDirty = !0, this._modelChunkDirty = !0, this._primModeDirty = !0, this._dirty = !0)
    }, get chunk() {
        return this._chunkName
    }, setPrimitiveMode: function (a) {
        this._inBegin && this._primMode != a && (this._primMode = a, this._primModeDirty = !0, this._modelDirty = !0, this._dirty = !0)
    }, get primitiveMode() {
        return this._primMode
    }, setUniforms: function (a) {
        this._inBegin && this._technique && this._technique.program.setUniforms(a)
    }, setDefaultGlobals: function () {
        if (this._inBegin) {
            var a = this._technique;
            if (a) {
                var b = a.renderData.globalsMap, c = {};
                for (var d in b) {
                    var e = b[d].name, f = b[d].value;
                    c[e] = f
                }
                a.program.setUniforms(c)
            }
        }
    }, setGlobals: function (a) {
        if (this._inBegin && a) {
            var b = this._technique;
            if (b) {
                var c = b.renderData.globalsMap, d = {};
                for (var e in a) if (c[e]) {
                    var f = c[e].name, g = a[e];
                    d[f] = g
                }
                b.program.setUniforms(d)
            }
        }
    }, setFramebuffer: function (a) {
        this._inBegin && this._framebuffer != a && (this._framebuffer = a, this._framebufferDirty = !0, this._viewportDirty = !0, this._dirty = !0, a ? a.bind() : SpiderGL.WebGL.Framebuffer.unbind(this._gl))
    }, activateOffScreenFramebuffer: function () {
        this.setFramebuffer(this._internalFramebuffer)
    }, activateMainFramebuffer: function () {
        return this.setFramebuffer(null)
    }, setFramebufferAttachments: function (a) {
        this._inBegin && this._framebuffer && (this._framebuffer.setAttachments(a), this._framebufferDirty = !0, this._viewportDirty = !0)
    }, setColorRenderTarget: function (a) {
        this._inBegin && this._framebuffer && (this._framebuffer.colorTarget = a, this._viewportDirty = !0, this._dirty = !0)
    }, setDepthRenderTarget: function (a) {
        this._inBegin && this._framebuffer && (this._framebuffer.depthTarget = a, this._viewportDirty = !0, this._dirty = !0)
    }, setStencilRenderTarget: function (a) {
        this._inBegin && this._framebuffer && (this._framebuffer.stencilTarget = a, this._viewportDirty = !0, this._dirty = !0)
    }, setDepthStencilRenderTarget: function (a) {
        this._inBegin && this._framebuffer && (this._framebuffer.depthStencilTarget = a, this._viewportDirty = !0, this._dirty = !0)
    }, clearFramebuffer: function (a) {
        if (this._inBegin && a) {
            var b = this._gl, c = 0;
            if (SpiderGL.Type.isNumber(a)) c = a; else {
                if ("color" in a) {
                    var d = a.color;
                    d && b.clearColor(d[0], d[1], d[2], d[3]), c |= b.COLOR_BUFFER_BIT
                }
                if ("depth" in a) {
                    var e = a.depth;
                    SpiderGL.Type.isNumber(e) && b.clearDepth(e), c |= b.DEPTH_BUFFER_BIT
                }
                if ("stencil" in a) {
                    var f = a.stencil;
                    SpiderGL.Type.isNumber(f) && b.clearStencil(f), c |= b.Stencil_BUFFER_BIT
                }
            }
            if (c) {
                var g = this._framebuffer;
                g ? g.clear(c) : b.clear(c)
            }
        }
    }, setViewport: function (a, b, c, d) {
        if (this._inBegin) {
            var e = this._gl;
            e.viewport(a, b, c, d)
        }
    }, setTexture: function (a, b) {
        if (b) b.bind(a); else {
            var c = this._gl;
            SpiderGL.WebGL.Texture2D.unbind(c, a), SpiderGL.WebGL.TextureCubeMap.unbind(c, a)
        }
    }, get canRender() {
        return !!(this._inBegin && this._technique && this._model && this._partName && this._chunkName && this._primMode)
    }, render: function () {
        if (this.canRender && this._update()) {
            for (var a = this._gl, b = this._primitiveStreams, c = b.buffered, d = b.array, e = 0, f = c.length; e < f; ++e) {
                var g = c[e], h = g.buffer.glBuffer;
                h.bind();
                for (var i = g.streams, j = 0, k = i.length; j < k; ++j) {
                    var l = i[j];
                    h.drawElements(l)
                }
            }
            for (var j = 0, f = d.length; j < f; ++j) {
                var l = d[j];
                a.drawArrays(l.glMode, l.first, l.count)
            }
        }
    }, renderModelPart: function (a) {
        var b = this.model.descriptor.logic.parts[a];
        this.setPart(a);
        for (var c in b.chunks) {
            var d = b.chunks[c];
            this.setChunk(d), this.render()
        }
    }, renderModel: function () {
        var a = this.model.descriptor.logic.parts;
        for (var b in a) {
            var c = a[b];
            this.setPart(b);
            for (var d in c.chunks) {
                var e = c.chunks[d];
                this.setChunk(e), this.render()
            }
        }
    }
}, SpiderGL.UserInterface = {}, SpiderGL.UserInterface.CanvasHandler = function (a, b, c) {
    SpiderGL.Core.ObjectBase.call(this), c = c || {};
    var d = this, e = a.canvas;
    this._gl = a, this._canvas = e, this._handler = b, this._ignoreKeyRepeat = SpiderGL.Utility.getDefaultValue(c.ignoreKeyRepeat, SpiderGL.UserInterface.CanvasHandler.DEFAULT_IGNORE_KEY_REPEAT), this._keysDown = {}, this._mouseButtonsDown = [!1, !1, !1], this._dragging = [!1, !1, !1], this._dragStartPos = [[0, 0], [0, 0], [0, 0]], this._dragEndPos = [[0, 0], [0, 0], [0, 0]], this._dragDeltaPos = [[0, 0], [0, 0], [0, 0]], this._cursorPos = [0, 0], this._cursorPrevPos = [0, 0], this._cursorDeltaPos = [0, 0], this._drawEventPending = !1, this._drawEventHandler = function () {
        d._onDraw()
    }, this._postDrawEventFunction = function () {
        d._postDrawEvent()
    }, this._animateTime = Date.now(), this._animatePrevTime = this._animateTime, this._animateDeltaTime = 0, this._animateRate = 0, this._animateID = null, this._animateEventHandler = function () {
        d._onAnimate()
    }, this._animateMS = -1, this._animateWithTimeout = !1, this._fastAnimate = !1, this._fpsUpdateMS = 1e3, this._fpsTime = 0, this._fpsCount = 0, this._fps = 0, this._delegateDraw = function (a) {
        d._onDraw(a)
    };
    var f = function (a) {
        a.source == window && (a.data == SpiderGL.UserInterface.CanvasHandler._FAST_ANIMATE_MESSAGE_NAME ? (a.stopPropagation(), d._onAnimate()) : a.data == SpiderGL.UserInterface.CanvasHandler._FAST_DRAW_MESSAGE_NAME && (a.stopPropagation(), d._onDraw()))
    };
    window.addEventListener("message", f, !0),/* e.tabIndex = 0, TODO MODIFICATO */e.addEventListener("unload", function (a) {
        d._onTerminate(a)
    }, !1), e.addEventListener("keydown", function (a) {
        d._onKeyDown(a)
    }, !1), e.addEventListener("keyup", function (a) {
        d._onKeyUp(a)
    }, !1), e.addEventListener("keypress", function (a) {
        d._onKeyPress(a)
    }, !1), e.addEventListener("mousedown", function (a) {
        d._onMouseButtonDown(a)
    }, !1), e.addEventListener("mouseup", function (a) {
        d._onMouseButtonUp(a)
    }, !1), e.addEventListener("mousemove", function (a) {
        d._onMouseMove(a)
    }, !1), e.addEventListener("mouseout", function (a) {
        d._onMouseOut(a)
    }, !1), e.addEventListener("click", function (a) {
        d._onClick(a)
    }, !1), e.addEventListener("dblclick", function (a) {
        d._onDoubleClick(a)
    }, !1), e.addEventListener("resize", function (a) {
        d._onResize(a)
    }, !1), e.addEventListener("DOMMouseScroll", function (a) {
        d._onMouseWheel(a)
    }, !1), e.addEventListener("mousewheel", function (a) {
        d._onMouseWheel(a)
    }, !1), e.addEventListener("blur", function (a) {
        d._onBlur(a)
    }, !1), window.addEventListener("mouseup", function (a) {
        d._onWindowMouseButtonUp(a)
    }, !1), window.addEventListener("mousemove", function (a) {
        d._onWindowMouseMove(a)
    }, !1), e.addEventListener("touchstart", SpiderGL.UserInterface.CanvasHandler._touchHandler, !1), e.addEventListener("touchend", SpiderGL.UserInterface.CanvasHandler._touchHandler, !1), e.addEventListener("touchmove", SpiderGL.UserInterface.CanvasHandler._touchHandler, !1), window.addEventListener("pointerup", function (a) {
        "touch" == a.pointerType ? SpiderGL.UserInterface.CanvasHandler._touchHandler(a) : d._onWindowMouseButtonUp(a)
    }, !1), window.addEventListener("pointermove", function (a) {
        "touch" == a.pointerType ? SpiderGL.UserInterface.CanvasHandler._touchHandler(a) : d._onWindowMouseMove(a)
    }, !1), e.addEventListener("pointerdown", function (a) {
        "touch" == a.pointerType ? SpiderGL.UserInterface.CanvasHandler._touchHandler(a) : d._onMouseButtonDown(a)
    }, !1), e.addEventListener("pointerup", function (a) {
        "touch" == a.pointerType ? SpiderGL.UserInterface.CanvasHandler._touchHandler(a) : d._onMouseButtonUp(a)
    }, !1), e.addEventListener("pointermove", function (a) {
        "touch" == a.pointerType ? SpiderGL.UserInterface.CanvasHandler._touchHandler(a) : d._onMouseMove(a)
    }, !1);
    var g = SpiderGL.Utility.getDefaultValue(c.standardGLUnpack, SpiderGL.UserInterface.CanvasHandler.DEFAULT_STANDARD_GL_UNPACK);
    g && SpiderGL.WebGL.Context.setStandardGLUnpack(a), this.animateRate = SpiderGL.Utility.getDefaultValue(c.animateRate, SpiderGL.UserInterface.CanvasHandler.DEFAULT_ANIMATE_RATE)
}, SpiderGL.UserInterface.CanvasHandler._FAST_DRAW_MESSAGE_NAME = "spidergl-fast-draw-message", SpiderGL.UserInterface.CanvasHandler._FAST_ANIMATE_MESSAGE_NAME = "spidergl-fast-animate-message", SpiderGL.UserInterface.CanvasHandler.DEFAULT_ANIMATE_RATE = 0, SpiderGL.UserInterface.CanvasHandler.DEFAULT_IGNORE_KEY_REPEAT = !0, SpiderGL.UserInterface.CanvasHandler.DEFAULT_STANDARD_GL_UNPACK = !0, SpiderGL.UserInterface.CanvasHandler.DEFAULT_PROPERTY_NAME = "ui", SpiderGL.UserInterface.CanvasHandler._multiTouch = {
    tmp: 0,
    touches: [],
    evt: null,
    pan: !1,
    btn: 0,
    phase: 0
}, SpiderGL.UserInterface.CanvasHandler._touchHandler = function (a) {
    var b, c, d = 1, e = 0, f = "";
    if ("pointerdown" == a.type) SpiderGL.UserInterface.CanvasHandler._multiTouch.touches.push(a); else for (i = 0; i < SpiderGL.UserInterface.CanvasHandler._multiTouch.touches.length; i++) a.pointerId == SpiderGL.UserInterface.CanvasHandler._multiTouch.touches[i].pointerId && (SpiderGL.UserInterface.CanvasHandler._multiTouch.touches[i] = a);
    switch (navigator.userAgent.toLowerCase().indexOf("trident") > -1 ? (b = SpiderGL.UserInterface.CanvasHandler._multiTouch.touches, c = b[0]) : (b = a.touches, c = a.changedTouches[0]), a.type) {
        case"touchstart":
        case"pointerdown":
            f = "mousedown";
            break;
        case"touchmove":
        case"pointermove":
            f = "mousemove";
            break;
        case"touchend":
        case"pointerup":
            f = "mouseup";
            break;
        default:
            return
    }
    var g = document.createEvent("MouseEvent");
    if (b.length >= 2) {
        if (navigator.userAgent.toLowerCase().indexOf("trident") <= -1 && ("draw-canvas" != b[0].target.id || "draw-canvas" != b[1].target.id)) return;
        var h = Math.sqrt(Math.pow(b[0].clientX - b[1].clientX, 2) + Math.pow(b[0].clientY - b[1].clientY, 2));
        if (d = h - SpiderGL.UserInterface.CanvasHandler._multiTouch.tmp, SpiderGL.UserInterface.CanvasHandler._multiTouch.tmp = h, "pointerup" == a.type) e = SpiderGL.UserInterface.CanvasHandler._multiTouch.btn, f = "mousedown"; else {
            if (!(d < -.995 || d > .995)) return;
            d = d > 0 ? 1 : -1, f = "mousewheel"
        }
    } else {
        if (!("pointerup" != a.type && "pointermove" != a.type || c && a.pointerId == c.pointerId)) return;
        if (0 != SpiderGL.UserInterface.CanvasHandler._multiTouch.tmp && "touchend" == a.type && (e = SpiderGL.UserInterface.CanvasHandler._multiTouch.btn, f = "mousedown"), "mousedown" == f) SpiderGL.UserInterface.CanvasHandler._multiTouch.evt = a; else if ("mouseup" == f) SpiderGL.UserInterface.CanvasHandler._multiTouch.pan && (e = 1, SpiderGL.UserInterface.CanvasHandler._multiTouch.pan = !1, SpiderGL.UserInterface.CanvasHandler._multiTouch.phase = 0, navigator.userAgent.toLowerCase().indexOf("firefox") > -1 && SpiderGL.UserInterface.CanvasHandler._touchHandler(a)); else if ("mousemove" == f) if (SpiderGL.UserInterface.CanvasHandler._multiTouch.pan) switch (SpiderGL.UserInterface.CanvasHandler._multiTouch.phase) {
            case 0:
                d = -1, f = navigator.userAgent.toLowerCase().indexOf("firefox") > -1 ? "mousemove" : "mouseup", SpiderGL.UserInterface.CanvasHandler._multiTouch.phase++;
                break;
            case 1:
                e = 1, f = "mousedown", SpiderGL.UserInterface.CanvasHandler._multiTouch.phase++;
                break;
            default:
                e = 1
        } else {
            var j;
            j = navigator.userAgent.toLowerCase().indexOf("trident") > -1 ? SpiderGL.UserInterface.CanvasHandler._multiTouch.evt : SpiderGL.UserInterface.CanvasHandler._multiTouch.evt.touches[0], Math.sqrt(Math.pow(c.clientX - j.clientX, 2) + Math.pow(c.clientY - j.clientY, 2)) <= 2 && a.timeStamp - SpiderGL.UserInterface.CanvasHandler._multiTouch.evt.timeStamp > 400 && (SpiderGL.UserInterface.CanvasHandler._multiTouch.pan = !0)
        }
        SpiderGL.UserInterface.CanvasHandler._multiTouch.tmp = 0, SpiderGL.UserInterface.CanvasHandler._multiTouch.btn = e
    }
    if (c && (g.initMouseEvent(f, !0, !0, window, d, c.screenX, c.screenY, c.clientX, c.clientY, !1, !1, !1, !1, e, null), c.target.dispatchEvent(g)), "pointerup" == a.type) for (i = 0; i < SpiderGL.UserInterface.CanvasHandler._multiTouch.touches.length; i++) SpiderGL.UserInterface.CanvasHandler._multiTouch.touches[i].pointerId >= a.pointerId && (i + 1 == SpiderGL.UserInterface.CanvasHandler._multiTouch.touches.length ? SpiderGL.UserInterface.CanvasHandler._multiTouch.touches.pop() : SpiderGL.UserInterface.CanvasHandler._multiTouch.touches[i] = SpiderGL.UserInterface.CanvasHandler._multiTouch.touches[i + 1]);
    a.preventDefault(), a.stopPropagation()
}, SpiderGL.UserInterface.CanvasHandler.prototype = {
    _firstNotify: function () {
        this._onInitialize(), this._animateRate > 0 && this._onAnimate(), this.postDrawEvent()
    }, _dispatch: function () {
        var a = arguments[0], b = this._handler, c = b[a];
        if (c) {
            var d = Array.prototype.slice.call(arguments, 1);
            c.apply(b, d)
        }
    }, _postDrawEvent: function () {
        this._postDrawCount = 5, this._drawEventPending || (this._drawEventPending = !0, requestAnimationFrame(this._delegateDraw))
    }, _getMouseClientPos: function (a) {
        var b = this._canvas.getBoundingClientRect(), c = this._canvas.width, d = this._canvas.height,
            e = a.clientX - b.left, f = d - (a.clientY - b.top), g = e < 0 || e >= c || f < 0 || f >= d;
        return [e, f, g]
    }, _onInitialize: function () {
        this._dispatch("onInitialize")
    }, _onTerminate: function () {
        this._dispatch("onTerminate")
    }, _onBlur: function (a) {
        var c = (this._gl, this._keysDown);
        for (var d in c) c[d] && (c[d] = !1, this._dispatch("onKeyUp", d, null))
    }, _onKeyDown: function (a) {
        var b = a.keyCode;
        if (b >= 48 && b <= 90) {
            var c = String.fromCharCode(b);
            b = c.toUpperCase()
        }
        var d = this._keysDown[b];
        this._keysDown[b] = !0, d && this._ignoreKeyRepeat || this._dispatch("onKeyDown", b, a)
    }, _onKeyUp: function (a) {
        var b = a.keyCode;
        if (b >= 48 && b <= 90) {
            var c = String.fromCharCode(b);
            b = c.toUpperCase()
        }
        this._keysDown[b] = !1, this._dispatch("onKeyUp", b, a)
    }, _onKeyPress: function (a) {
        var b = a.keyCode;
        if (b >= 48 && b <= 90) {
            var c = String.fromCharCode(b);
            b = c.toUpperCase()
        }
        this._dispatch("onKeyPress", b, a)
    }, _onMouseButtonDown: function (a) {
        this._canvas.focus();
        var b = this._getMouseClientPos(a);
        this._cursorPos = b;
        var c = a.button;
        this._mouseButtonsDown[c] = !0, this._dragStartPos[c] = [b[0], b[1]], this._dispatch("onMouseButtonDown", c, b[0], b[1], a), a.stopPropagation()
    }, _onMouseButtonUp: function (a) {
        var b = this._getMouseClientPos(a);
        this._cursorPos = b;
        var c = a.button;
        if (this._mouseButtonsDown[c] = !1, !(navigator.userAgent.toLowerCase().indexOf("firefox") > -1) || a.isTrusted) {
            if (this._dispatch("onMouseButtonUp", c, b[0], b[1], a), this._dragging[c]) {
                this._dragging[c] = !1;
                var d = this._dragStartPos[c], e = [b[0], b[1]];
                this._dragEndPos[c] = e, this._dragDeltaPos[c] = [e[0] - d[0], e[1] - d[1]], this._dispatch("onDragEnd", c, e[0], e[1])
            }
            a.stopPropagation()
        }
    }, _onWindowMouseButtonUp: function (a) {
        var b = this._getMouseClientPos(a);
        this._cursorPos = b;
        var c = a.button;
        if (this._mouseButtonsDown[c] && (this._mouseButtonsDown[c] = !1, !(navigator.userAgent.toLowerCase().indexOf("firefox") > -1) || a.isTrusted)) {
            if (this._dispatch("onMouseButtonUp", c, b[0], b[1], a), this._dragging[c]) {
                this._dragging[c] = !1;
                var d = this._dragStartPos[c], e = [b[0], b[1]];
                this._dragEndPos[c] = e, this._dragDeltaPos[c] = [e[0] - d[0], e[1] - d[1]], this._dispatch("onDragEnd", c, e[0], e[1])
            }
            a.stopPropagation()
        }
    }, _onMouseMove: function (a) {
        this._cursorPrevPos = this._cursorPos;
        var b = this._getMouseClientPos(a);
        this._cursorPos = b, this._cursorDeltaPos = [this._cursorPos[0] - this._cursorPrevPos[0], this._cursorPos[1] - this._cursorPrevPos[1]];
        for (var c = 0; c < 3; ++c) if (this._mouseButtonsDown[c] && (0 != this._cursorDeltaPos[0] || 0 != this._cursorDeltaPos[1])) {
            var d = this._dragStartPos[c], e = [b[0], b[1]];
            this._dragEndPos[c] = e, this._dragDeltaPos[c] = [e[0] - d[0], e[1] - d[1]], this._dragging[c] ? this._dispatch("onDrag", c, e[0], e[1]) : (this._dragging[c] = !0, this._dispatch("onDragStart", c, d[0], d[1]))
        }
        this._dispatch("onMouseMove", b[0], b[1], a), a.stopPropagation()
    }, _onWindowMouseMove: function (a) {
        this._cursorPrevPos = this._cursorPos;
        var b = this._getMouseClientPos(a);
        this._cursorPos = b, this._cursorDeltaPos = [this._cursorPos[0] - this._cursorPrevPos[0], this._cursorPos[1] - this._cursorPrevPos[1]];
        for (var c = 0; c < 3; ++c) if (this._dragging[c]) {
            var d = this._dragStartPos[c], e = [b[0], b[1]];
            this._dragEndPos[c] = e, this._dragDeltaPos[c] = [e[0] - d[0], e[1] - d[1]], this._dispatch("onDrag", c, e[0], e[1])
        }
        b[2] || (this._dispatch("onMouseMove", b[0], b[1], a), a.stopPropagation())
    }, _onMouseWheel: function (a) {
        var b = this._getMouseClientPos(a), c = 0;
        a || (a = window.event), a.wheelDelta ? (c = a.wheelDelta / 120, window.opera && (c = -c)) : a.detail && (c = a.detail / 3), c && this._dispatch("onMouseWheel", c, b[0], b[1], a), a.preventDefault && a.preventDefault(), a.stopPropagation()
    }, _onMouseOut: function (a) {
        var b = this._getMouseClientPos(a);
        this._dispatch("onMouseOut", b[0], b[1], a)
    }, _onClick: function (a) {
        var b = this._getMouseClientPos(a);
        this._dispatch("onClick", a.button, b[0], b[1], a)
    }, _onDoubleClick: function (a) {
        var b = this._getMouseClientPos(a);
        this._dispatch("onDoubleClick", a.button, b[0], b[1], a)
    }, _onResize: function (a) {
        this._dispatch("onResize", this._canvas.width, this._canvas.height, a)
    }, _onAnimate: function () {
        this._animatePrevTime = this._animateTime, this._animateTime = Date.now(), this._animateDeltaTime = this._animateTime - this._animatePrevTime, this._dispatch("onAnimate", this._animateDeltaTime / 1e3), this._animateMS >= 0 ? this._animateWithTimeout && setTimeout(this._animateEventHandler, this._animateMS) : this._fastAnimate && window.postMessage(SpiderGL.UserInterface.CanvasHandler._FAST_ANIMATE_MESSAGE_NAME, "*")
    }, _onDraw: function (a) {
        if (this._drawEventPending = !1, this._fpsTime && 5 != this.postDrawCount) {
            this._fpsCount++;
            var b = a - this._fpsTime;
            this._fps = .8 * this._fps + .2 * (1e3 / b)
        } else this._fpsCount = 0;
        this._fpsTime = a, this._dispatch("onDraw"), this._postDrawCount-- > 0 && (this._drawEventPending = !0, requestAnimationFrame(this._delegateDraw))
    }, get gl() {
        return this._gl
    }, get canvas() {
        return this._canvas
    }, get width() {
        return this._canvas.width
    }, get height() {
        return this._canvas.height
    }, get postDrawEvent() {
        return this._postDrawEventFunction
    }, get animateTime() {
        return this._animateTime
    }, get animatePrevTime() {
        return this._animatePrevTime
    }, get animateDeltaTime() {
        return this._animateDeltaTime
    }, get animateRate() {
        return this._animateRate
    }, set animateRate(a) {
        a = SpiderGL.Utility.getDefaultValue(a, SpiderGL.UserInterface.CanvasHandler.DEFAULT_ANIMATE_RATE), this._animateRate !== a && (this._fastAnimate = !1, this._animateMS = -1, this._animateTime = Date.now(), this._animatePrevTime = this._animateTime, this._animateDeltaTime = 0, this._animateID && (clearInterval(this._animateID), this._animateID = null), this._animateRate = a, a > 0 ? (this._animateMS = SpiderGL.Math.floor(1e3 / a), this._animateWithTimeout ? setTimeout(this._animateEventHandler, this._animateMS) : this._animateID = setInterval(this._animateEventHandler, this._animateMS)) : a < 0 && (this._fastAnimate = !0, window.postMessage(SpiderGL.UserInterface.CanvasHandler._FAST_ANIMATE_MESSAGE_NAME, "*")))
    }, get framesPerSecond() {
        return this._fps
    }, get ignoreKeyRepeat() {
        return this._ignoreKeyRepeat
    }, set ignoreKeyRepeat(a) {
        this._ignoreKeyRepeat = SpiderGL.Utility.getDefaultValue(a, SpiderGL.UserInterface.CanvasHandler.DEFAULT_IGNORE_KEY_REPEAT)
    }, isKeyDown: function (a) {
        return a.toUpperCase && (a = a.toUpperCase()), this._keysDown[a]
    }, isMouseButtonDown: function (a) {
        return this._mouseButtonsDown[a]
    }, isDragging: function (a) {
        var b = !1;
        if (void 0 !== a) b = this._dragging[a]; else for (i = 0; i < 3; i++) if (this._dragging[i]) return !0;
        return b
    }, dragStartX: function (a) {
        return this._dragStartPos[a][0]
    }, dragStartY: function (a) {
        return this._dragStartPos[a][1]
    }, dragEndX: function (a) {
        return this._dragEndPos[a][0]
    }, dragEndY: function (a) {
        return this._dragEndPos[a][1]
    }, dragDeltaX: function (a) {
        return this._dragDeltaPos[a][0]
    }, dragDeltaY: function (a) {
        return this._dragDeltaPos[a][1]
    }, get cursorX() {
        return this._cursorPos[0]
    }, get cursorY() {
        return this._cursorPos[1]
    }, get cursorPrevX() {
        return this._cursorPrevPos[0]
    }, get cursorPrevY() {
        return this._cursorPrevPos[1]
    }, get cursorDeltaX() {
        return this._cursorDeltaPos[0]
    }, get cursorDeltaY() {
        return this._cursorDeltaPos[1]
    }, draw: function () {
        this._onDraw()
    }
}, SpiderGL.Type.extend(SpiderGL.UserInterface.CanvasHandler, SpiderGL.Core.ObjectBase), SpiderGL.UserInterface.handleCanvas = function (a, b, c) {
    if (!a || !b) return !1;
    c = c || {};
    var d = SpiderGL.WebGL.Context.getHijacked(a, c);
    if (!d) return !1;
    var e = new SpiderGL.UserInterface.CanvasHandler(d, b, c);
    if (!e) return !1;
    var f = SpiderGL.Utility.getDefaultValue(c.uiName, SpiderGL.UserInterface.CanvasHandler.DEFAULT_PROPERTY_NAME);
    return b[f] = e, e._firstNotify(), !0
}, SpiderGL.UserInterface.handleCanvasOnLoad = function (a, b, c) {
    function e() {
        SpiderGL.UserInterface.handleCanvas(a, b, c), d && d()
    }

    if (!a || !b) return !1;
    c = c || {};
    var d = SpiderGL.Utility.getDefaultValue(c.onLoad, null);
    return window.addEventListener("load", e, !1), !0
};