/*!

 handlebars v1.3.0

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/
/* exported Handlebars */
var Handlebars = (function () {
  // handlebars/safe-string.js
  var __module3__ = (function () {
    "use strict";
    var __exports__;
    // Build out our basic SafeString type
    function SafeString(string) {
      this.string = string;
    }

    SafeString.prototype.toString = function () {
      return "" + this.string;
    };

    __exports__ = SafeString;
    return __exports__;
  })();

  // handlebars/utils.js
  var __module2__ = (function (__dependency1__) {
    "use strict";
    var __exports__ = {};
    /*jshint -W004 */
    var SafeString = __dependency1__;

    var escape = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "`": "&#x60;",
    };

    var badChars = /[&<>"'`]/g;
    var possible = /[&<>"'`]/;

    function escapeChar(chr) {
      return escape[chr] || "&amp;";
    }

    function extend(obj, value) {
      for (var key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          obj[key] = value[key];
        }
      }
    }

    __exports__.extend = extend;
    var toString = Object.prototype.toString;
    __exports__.toString = toString;
    // Sourced from lodash
    // https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
    var isFunction = function (value) {
      return typeof value === "function";
    };
    // fallback for older versions of Chrome and Safari
    if (isFunction(/x/)) {
      isFunction = function (value) {
        return (
          typeof value === "function" &&
          toString.call(value) === "[object Function]"
        );
      };
    }
    var isFunction;
    __exports__.isFunction = isFunction;
    var isArray =
      Array.isArray ||
      function (value) {
        return value && typeof value === "object"
          ? toString.call(value) === "[object Array]"
          : false;
      };
    __exports__.isArray = isArray;

    function escapeExpression(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof SafeString) {
        return string.toString();
      } else if (!string && string !== 0) {
        return "";
      }

      // Force a string conversion as this will be done by the append regardless and
      // the regex test will do this transparently behind the scenes, causing issues if
      // an object's to string has escaped characters in it.
      string = "" + string;

      if (!possible.test(string)) {
        return string;
      }
      return string.replace(badChars, escapeChar);
    }

    __exports__.escapeExpression = escapeExpression;
    function isEmpty(value) {
      if (!value && value !== 0) {
        return true;
      } else if (isArray(value) && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }

    __exports__.isEmpty = isEmpty;
    return __exports__;
  })(__module3__);

  // handlebars/exception.js
  var __module4__ = (function () {
    "use strict";
    var __exports__;

    var errorProps = [
      "description",
      "fileName",
      "lineNumber",
      "message",
      "name",
      "number",
      "stack",
    ];

    function Exception(message, node) {
      var line;
      if (node && node.firstLine) {
        line = node.firstLine;

        message += " - " + line + ":" + node.firstColumn;
      }

      var tmp = Error.prototype.constructor.call(this, message);

      // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
      for (var idx = 0; idx < errorProps.length; idx++) {
        this[errorProps[idx]] = tmp[errorProps[idx]];
      }

      if (line) {
        this.lineNumber = line;
        this.column = node.firstColumn;
      }
    }

    Exception.prototype = new Error();

    __exports__ = Exception;
    return __exports__;
  })();

  // handlebars/base.js
  var __module1__ = (function (__dependency1__, __dependency2__) {
    "use strict";
    var __exports__ = {};
    var Utils = __dependency1__;
    var Exception = __dependency2__;

    var VERSION = "1.3.0";
    __exports__.VERSION = VERSION;
    var COMPILER_REVISION = 4;
    __exports__.COMPILER_REVISION = COMPILER_REVISION;
    var REVISION_CHANGES = {
      1: "<= 1.0.rc.2", // 1.0.rc.2 is actually rev2 but doesn't report it
      2: "== 1.0.0-rc.3",
      3: "== 1.0.0-rc.4",
      4: ">= 1.0.0",
    };
    __exports__.REVISION_CHANGES = REVISION_CHANGES;
    var isArray = Utils.isArray,
      isFunction = Utils.isFunction,
      toString = Utils.toString,
      objectType = "[object Object]";

    function HandlebarsEnvironment(helpers, partials) {
      this.helpers = helpers || {};
      this.partials = partials || {};

      registerDefaultHelpers(this);
    }

    __exports__.HandlebarsEnvironment = HandlebarsEnvironment;
    HandlebarsEnvironment.prototype = {
      constructor: HandlebarsEnvironment,

      logger: logger,
      log: log,

      registerHelper: function (name, fn, inverse) {
        if (toString.call(name) === objectType) {
          if (inverse || fn) {
            throw new Exception("Arg not supported with multiple helpers");
          }
          Utils.extend(this.helpers, name);
        } else {
          if (inverse) {
            fn.not = inverse;
          }
          this.helpers[name] = fn;
        }
      },

      registerPartial: function (name, str) {
        if (toString.call(name) === objectType) {
          Utils.extend(this.partials, name);
        } else {
          this.partials[name] = str;
        }
      },
    };

    function registerDefaultHelpers(instance) {
      instance.registerHelper("helperMissing", function (arg) {
        if (arguments.length === 2) {
          return undefined;
        } else {
          throw new Exception("Missing helper: '" + arg + "'");
        }
      });

      instance.registerHelper(
        "blockHelperMissing",
        function (context, options) {
          var inverse = options.inverse || function () {},
            fn = options.fn;

          if (isFunction(context)) {
            context = context.call(this);
          }

          if (context === true) {
            return fn(this);
          } else if (context === false || context == null) {
            return inverse(this);
          } else if (isArray(context)) {
            if (context.length > 0) {
              return instance.helpers.each(context, options);
            } else {
              return inverse(this);
            }
          } else {
            return fn(context);
          }
        }
      );

      instance.registerHelper("each", function (context, options) {
        var fn = options.fn,
          inverse = options.inverse;
        var i = 0,
          ret = "",
          data;

        if (isFunction(context)) {
          context = context.call(this);
        }

        if (options.data) {
          data = createFrame(options.data);
        }

        if (context && typeof context === "object") {
          if (isArray(context)) {
            for (var j = context.length; i < j; i++) {
              if (data) {
                data.index = i;
                data.first = i === 0;
                data.last = i === context.length - 1;
              }
              ret = ret + fn(context[i], { data: data });
            }
          } else {
            for (var key in context) {
              if (context.hasOwnProperty(key)) {
                if (data) {
                  data.key = key;
                  data.index = i;
                  data.first = i === 0;
                }
                ret = ret + fn(context[key], { data: data });
                i++;
              }
            }
          }
        }

        if (i === 0) {
          ret = inverse(this);
        }

        return ret;
      });

      instance.registerHelper("if", function (conditional, options) {
        if (isFunction(conditional)) {
          conditional = conditional.call(this);
        }

        // Default behavior is to render the positive path if the value is truthy and not empty.
        // The `includeZero` option may be set to treat the condtional as purely not empty based on the
        // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
        if (
          (!options.hash.includeZero && !conditional) ||
          Utils.isEmpty(conditional)
        ) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      });

      instance.registerHelper("unless", function (conditional, options) {
        return instance.helpers["if"].call(this, conditional, {
          fn: options.inverse,
          inverse: options.fn,
          hash: options.hash,
        });
      });

      instance.registerHelper("with", function (context, options) {
        if (isFunction(context)) {
          context = context.call(this);
        }

        if (!Utils.isEmpty(context)) return options.fn(context);
      });

      instance.registerHelper("log", function (context, options) {
        var level =
          options.data && options.data.level != null
            ? parseInt(options.data.level, 10)
            : 1;
        instance.log(level, context);
      });
    }

    var logger = {
      methodMap: { 0: "debug", 1: "info", 2: "warn", 3: "error" },

      // State enum
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
      level: 3,

      // can be overridden in the host environment
      log: function (level, obj) {
        if (logger.level <= level) {
          var method = logger.methodMap[level];
          if (typeof console !== "undefined" && console[method]) {
            console[method].call(console, obj);
          }
        }
      },
    };
    __exports__.logger = logger;
    function log(level, obj) {
      logger.log(level, obj);
    }

    __exports__.log = log;
    var createFrame = function (object) {
      var obj = {};
      Utils.extend(obj, object);
      return obj;
    };
    __exports__.createFrame = createFrame;
    return __exports__;
  })(__module2__, __module4__);

  // handlebars/runtime.js
  var __module5__ = (function (
    __dependency1__,
    __dependency2__,
    __dependency3__
  ) {
    "use strict";
    var __exports__ = {};
    var Utils = __dependency1__;
    var Exception = __dependency2__;
    var COMPILER_REVISION = __dependency3__.COMPILER_REVISION;
    var REVISION_CHANGES = __dependency3__.REVISION_CHANGES;

    function checkRevision(compilerInfo) {
      var compilerRevision = (compilerInfo && compilerInfo[0]) || 1,
        currentRevision = COMPILER_REVISION;

      if (compilerRevision !== currentRevision) {
        if (compilerRevision < currentRevision) {
          var runtimeVersions = REVISION_CHANGES[currentRevision],
            compilerVersions = REVISION_CHANGES[compilerRevision];
          throw new Exception(
            "Template was precompiled with an older version of Handlebars than the current runtime. " +
              "Please update your precompiler to a newer version (" +
              runtimeVersions +
              ") or downgrade your runtime to an older version (" +
              compilerVersions +
              ")."
          );
        } else {
          // Use the embedded version info since the runtime doesn't know about this revision yet
          throw new Exception(
            "Template was precompiled with a newer version of Handlebars than the current runtime. " +
              "Please update your runtime to a newer version (" +
              compilerInfo[1] +
              ")."
          );
        }
      }
    }

    __exports__.checkRevision = checkRevision; // TODO: Remove this line and break up compilePartial

    function template(templateSpec, env) {
      if (!env) {
        throw new Exception("No environment passed to template");
      }

      // Note: Using env.VM references rather than local var references throughout this section to allow
      // for external users to override these as psuedo-supported APIs.
      var invokePartialWrapper = function (
        partial,
        name,
        context,
        helpers,
        partials,
        data
      ) {
        var result = env.VM.invokePartial.apply(this, arguments);
        if (result != null) {
          return result;
        }

        if (env.compile) {
          var options = { helpers: helpers, partials: partials, data: data };
          partials[name] = env.compile(
            partial,
            { data: data !== undefined },
            env
          );
          return partials[name](context, options);
        } else {
          throw new Exception(
            "The partial " +
              name +
              " could not be compiled when running in runtime-only mode"
          );
        }
      };

      // Just add water
      var container = {
        escapeExpression: Utils.escapeExpression,
        invokePartial: invokePartialWrapper,
        programs: [],
        program: function (i, fn, data) {
          var programWrapper = this.programs[i];
          if (data) {
            programWrapper = program(i, fn, data);
          } else if (!programWrapper) {
            programWrapper = this.programs[i] = program(i, fn);
          }
          return programWrapper;
        },
        merge: function (param, common) {
          var ret = param || common;

          if (param && common && param !== common) {
            ret = {};
            Utils.extend(ret, common);
            Utils.extend(ret, param);
          }
          return ret;
        },
        programWithDepth: env.VM.programWithDepth,
        noop: env.VM.noop,
        compilerInfo: null,
      };

      return function (context, options) {
        options = options || {};
        var namespace = options.partial ? options : env,
          helpers,
          partials;

        if (!options.partial) {
          helpers = options.helpers;
          partials = options.partials;
        }
        var result = templateSpec.call(
          container,
          namespace,
          context,
          helpers,
          partials,
          options.data
        );

        if (!options.partial) {
          env.VM.checkRevision(container.compilerInfo);
        }

        return result;
      };
    }

    __exports__.template = template;
    function programWithDepth(i, fn, data /*, $depth */) {
      var args = Array.prototype.slice.call(arguments, 3);

      var prog = function (context, options) {
        options = options || {};

        return fn.apply(this, [context, options.data || data].concat(args));
      };
      prog.program = i;
      prog.depth = args.length;
      return prog;
    }

    __exports__.programWithDepth = programWithDepth;
    function program(i, fn, data) {
      var prog = function (context, options) {
        options = options || {};

        return fn(context, options.data || data);
      };
      prog.program = i;
      prog.depth = 0;
      return prog;
    }

    __exports__.program = program;
    function invokePartial(partial, name, context, helpers, partials, data) {
      var options = {
        partial: true,
        helpers: helpers,
        partials: partials,
        data: data,
      };

      if (partial === undefined) {
        throw new Exception("The partial " + name + " could not be found");
      } else if (partial instanceof Function) {
        return partial(context, options);
      }
    }

    __exports__.invokePartial = invokePartial;
    function noop() {
      return "";
    }

    __exports__.noop = noop;
    return __exports__;
  })(__module2__, __module4__, __module1__);

  // handlebars.runtime.js
  var __module0__ = (function (
    __dependency1__,
    __dependency2__,
    __dependency3__,
    __dependency4__,
    __dependency5__
  ) {
    "use strict";
    var __exports__;
    /*globals Handlebars: true */
    var base = __dependency1__;

    // Each of these augment the Handlebars object. No need to setup here.
    // (This is done to easily share code between commonjs and browse envs)
    var SafeString = __dependency2__;
    var Exception = __dependency3__;
    var Utils = __dependency4__;
    var runtime = __dependency5__;

    // For compatibility and usage outside of module systems, make the Handlebars object a namespace
    var create = function () {
      var hb = new base.HandlebarsEnvironment();

      Utils.extend(hb, base);
      hb.SafeString = SafeString;
      hb.Exception = Exception;
      hb.Utils = Utils;

      hb.VM = runtime;
      hb.template = function (spec) {
        return runtime.template(spec, hb);
      };

      return hb;
    };

    var Handlebars = create();
    Handlebars.create = create;

    __exports__ = Handlebars;
    return __exports__;
  })(__module1__, __module3__, __module4__, __module2__, __module5__);

  return __module0__;
})();

// leanModal v1.1 by Ray Stone - http://finelysliced.com.au
// Dual licensed under the MIT and GPL

(function ($) {
  $.fn.extend({
    leanModal: function (options) {
      var defaults = { top: 100, overlay: 0.5, closeButton: null };
      var overlay = $("<div id='lean_overlay'></div>");
      $("body").append(overlay);
      options = $.extend(defaults, options);
      return this.each(function () {
        var o = options;
        $(this).click(function (e) {
          var modal_id = $(this).attr("href");
          $("#lean_overlay").click(function () {
            close_modal(modal_id);
          });
          $(o.closeButton).click(function () {
            close_modal(modal_id);
          });
          var modal_height = $(modal_id).outerHeight();
          var modal_width = $(modal_id).outerWidth();
          $("#lean_overlay").css({ display: "block", opacity: 0 });
          $("#lean_overlay").fadeTo(200, o.overlay);
          $(modal_id).css({
            display: "block",
            position: "absolute",
            opacity: 0,
            zIndex: 11000,
            top: o.top + "px",
          });
          $(modal_id).fadeTo(200, 1);
          e.preventDefault();
        });
      });
      function close_modal(modal_id) {
        $("#lean_overlay").fadeOut(200);
        $(modal_id).css({ display: "none" });
      }
    },
  });
})(jQuery);

/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-cssclasses-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-css_filters-load
 */
window.Modernizr = (function (window, document, undefined) {
  var version = "2.6.2",
    Modernizr = {},
    enableClasses = true,
    docElement = document.documentElement,
    mod = "modernizr",
    modElem = document.createElement(mod),
    mStyle = modElem.style,
    inputElem = document.createElement("input"),
    smile = ":)",
    toString = {}.toString,
    prefixes = " -webkit- -moz- -o- -ms- ".split(" "),
    omPrefixes = "Webkit Moz O ms",
    cssomPrefixes = omPrefixes.split(" "),
    domPrefixes = omPrefixes.toLowerCase().split(" "),
    ns = { svg: "http://www.w3.org/2000/svg" },
    tests = {},
    inputs = {},
    attrs = {},
    classes = [],
    slice = classes.slice,
    featureName,
    injectElementWithStyles = function (rule, callback, nodes, testnames) {
      var style,
        ret,
        node,
        docOverflow,
        div = document.createElement("div"),
        body = document.body,
        fakeBody = body || document.createElement("body");

      if (parseInt(nodes, 10)) {
        while (nodes--) {
          node = document.createElement("div");
          node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
          div.appendChild(node);
        }
      }

      style = ["&#173;", '<style id="s', mod, '">', rule, "</style>"].join("");
      div.id = mod;
      (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if (!body) {
        fakeBody.style.background = "";
        fakeBody.style.overflow = "hidden";
        docOverflow = docElement.style.overflow;
        docElement.style.overflow = "hidden";
        docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
      if (!body) {
        fakeBody.parentNode.removeChild(fakeBody);
        docElement.style.overflow = docOverflow;
      } else {
        div.parentNode.removeChild(div);
      }

      return !!ret;
    },
    isEventSupported = (function () {
      var TAGNAMES = {
        select: "input",
        change: "input",
        submit: "form",
        reset: "form",
        error: "img",
        load: "img",
        abort: "img",
      };

      function isEventSupported(eventName, element) {
        element =
          element || document.createElement(TAGNAMES[eventName] || "div");
        eventName = "on" + eventName;

        var isSupported = eventName in element;

        if (!isSupported) {
          if (!element.setAttribute) {
            element = document.createElement("div");
          }
          if (element.setAttribute && element.removeAttribute) {
            element.setAttribute(eventName, "");
            isSupported = is(element[eventName], "function");

            if (!is(element[eventName], "undefined")) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })(),
    _hasOwnProperty = {}.hasOwnProperty,
    hasOwnProp;

  if (
    !is(_hasOwnProperty, "undefined") &&
    !is(_hasOwnProperty.call, "undefined")
  ) {
    hasOwnProp = function (object, property) {
      return _hasOwnProperty.call(object, property);
    };
  } else {
    hasOwnProp = function (object, property) {
      return (
        property in object &&
        is(object.constructor.prototype[property], "undefined")
      );
    };
  }

  if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) {
      var target = this;

      if (typeof target != "function") {
        throw new TypeError();
      }

      var args = slice.call(arguments, 1),
        bound = function () {
          if (this instanceof bound) {
            var F = function () {};
            F.prototype = target.prototype;
            var self = new F();

            var result = target.apply(self, args.concat(slice.call(arguments)));
            if (Object(result) === result) {
              return result;
            }
            return self;
          } else {
            return target.apply(that, args.concat(slice.call(arguments)));
          }
        };

      return bound;
    };
  }

  function setCss(str) {
    mStyle.cssText = str;
  }

  function setCssAll(str1, str2) {
    return setCss(prefixes.join(str1 + ";") + (str2 || ""));
  }

  function is(obj, type) {
    return typeof obj === type;
  }

  function contains(str, substr) {
    return !!~("" + str).indexOf(substr);
  }

  function testProps(props, prefixed) {
    for (var i in props) {
      var prop = props[i];
      if (!contains(prop, "-") && mStyle[prop] !== undefined) {
        return prefixed == "pfx" ? prop : true;
      }
    }
    return false;
  }

  function testDOMProps(props, obj, elem) {
    for (var i in props) {
      var item = obj[props[i]];
      if (item !== undefined) {
        if (elem === false) return props[i];

        if (is(item, "function")) {
          return item.bind(elem || obj);
        }

        return item;
      }
    }
    return false;
  }

  function testPropsAll(prop, prefixed, elem) {
    var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
      props = (prop + " " + cssomPrefixes.join(ucProp + " ") + ucProp).split(
        " "
      );

    if (is(prefixed, "string") || is(prefixed, "undefined")) {
      return testProps(props, prefixed);
    } else {
      props = (prop + " " + domPrefixes.join(ucProp + " ") + ucProp).split(" ");
      return testDOMProps(props, prefixed, elem);
    }
  }
  tests["flexbox"] = function () {
    return testPropsAll("flexWrap");
  };
  tests["canvas"] = function () {
    var elem = document.createElement("canvas");
    return !!(elem.getContext && elem.getContext("2d"));
  };

  tests["canvastext"] = function () {
    return !!(
      Modernizr["canvas"] &&
      is(document.createElement("canvas").getContext("2d").fillText, "function")
    );
  };

  tests["webgl"] = function () {
    return !!window.WebGLRenderingContext;
  };

  tests["touch"] = function () {
    var bool;

    if (
      "ontouchstart" in window ||
      (window.DocumentTouch && document instanceof DocumentTouch)
    ) {
      bool = true;
    } else {
      injectElementWithStyles(
        [
          "@media (",
          prefixes.join("touch-enabled),("),
          mod,
          ")",
          "{#modernizr{top:9px;position:absolute}}",
        ].join(""),
        function (node) {
          bool = node.offsetTop === 9;
        }
      );
    }

    return bool;
  };

  tests["geolocation"] = function () {
    return "geolocation" in navigator;
  };

  tests["postmessage"] = function () {
    return !!window.postMessage;
  };

  tests["websqldatabase"] = function () {
    return !!window.openDatabase;
  };

  tests["indexedDB"] = function () {
    return !!testPropsAll("indexedDB", window);
  };

  tests["hashchange"] = function () {
    return (
      isEventSupported("hashchange", window) &&
      (document.documentMode === undefined || document.documentMode > 7)
    );
  };

  tests["history"] = function () {
    return !!(window.history && history.pushState);
  };

  tests["draganddrop"] = function () {
    var div = document.createElement("div");
    return "draggable" in div || ("ondragstart" in div && "ondrop" in div);
  };

  tests["websockets"] = function () {
    return "WebSocket" in window || "MozWebSocket" in window;
  };

  tests["rgba"] = function () {
    setCss("background-color:rgba(150,255,150,.5)");

    return contains(mStyle.backgroundColor, "rgba");
  };

  tests["hsla"] = function () {
    setCss("background-color:hsla(120,40%,100%,.5)");

    return (
      contains(mStyle.backgroundColor, "rgba") ||
      contains(mStyle.backgroundColor, "hsla")
    );
  };

  tests["multiplebgs"] = function () {
    setCss("background:url(https://),url(https://),red url(https://)");

    return /(url\s*\(.*?){3}/.test(mStyle.background);
  };
  tests["backgroundsize"] = function () {
    return testPropsAll("backgroundSize");
  };

  tests["borderimage"] = function () {
    return testPropsAll("borderImage");
  };

  tests["borderradius"] = function () {
    return testPropsAll("borderRadius");
  };

  tests["boxshadow"] = function () {
    return testPropsAll("boxShadow");
  };

  tests["textshadow"] = function () {
    return document.createElement("div").style.textShadow === "";
  };

  tests["opacity"] = function () {
    setCssAll("opacity:.55");

    return /^0.55$/.test(mStyle.opacity);
  };

  tests["cssanimations"] = function () {
    return testPropsAll("animationName");
  };

  tests["csscolumns"] = function () {
    return testPropsAll("columnCount");
  };

  tests["cssgradients"] = function () {
    var str1 = "background-image:",
      str2 = "gradient(linear,left top,right bottom,from(#9f9),to(white));",
      str3 = "linear-gradient(left top,#9f9, white);";

    setCss(
      (
        str1 +
        "-webkit- ".split(" ").join(str2 + str1) +
        prefixes.join(str3 + str1)
      ).slice(0, -str1.length)
    );

    return contains(mStyle.backgroundImage, "gradient");
  };

  tests["cssreflections"] = function () {
    return testPropsAll("boxReflect");
  };

  tests["csstransforms"] = function () {
    return !!testPropsAll("transform");
  };

  tests["csstransforms3d"] = function () {
    var ret = !!testPropsAll("perspective");

    if (ret && "webkitPerspective" in docElement.style) {
      injectElementWithStyles(
        "@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",
        function (node, rule) {
          ret = node.offsetLeft === 9 && node.offsetHeight === 3;
        }
      );
    }
    return ret;
  };

  tests["csstransitions"] = function () {
    return testPropsAll("transition");
  };

  tests["fontface"] = function () {
    var bool;

    injectElementWithStyles(
      '@font-face {font-family:"font";src:url("https://")}',
      function (node, rule) {
        var style = document.getElementById("smodernizr"),
          sheet = style.sheet || style.styleSheet,
          cssText = sheet
            ? sheet.cssRules && sheet.cssRules[0]
              ? sheet.cssRules[0].cssText
              : sheet.cssText || ""
            : "";

        bool =
          /src/i.test(cssText) && cssText.indexOf(rule.split(" ")[0]) === 0;
      }
    );

    return bool;
  };

  tests["generatedcontent"] = function () {
    var bool;

    injectElementWithStyles(
      [
        "#",
        mod,
        "{font:0/0 a}#",
        mod,
        ':after{content:"',
        smile,
        '";visibility:hidden;font:3px/1 a}',
      ].join(""),
      function (node) {
        bool = node.offsetHeight >= 3;
      }
    );

    return bool;
  };
  tests["video"] = function () {
    var elem = document.createElement("video"),
      bool = false;

    try {
      if ((bool = !!elem.canPlayType)) {
        bool = new Boolean(bool);
        bool.ogg = elem
          .canPlayType('video/ogg; codecs="theora"')
          .replace(/^no$/, "");

        bool.h264 = elem
          .canPlayType('video/mp4; codecs="avc1.42E01E"')
          .replace(/^no$/, "");

        bool.webm = elem
          .canPlayType('video/webm; codecs="vp8, vorbis"')
          .replace(/^no$/, "");
      }
    } catch (e) {}

    return bool;
  };

  tests["audio"] = function () {
    var elem = document.createElement("audio"),
      bool = false;

    try {
      if ((bool = !!elem.canPlayType)) {
        bool = new Boolean(bool);
        bool.ogg = elem
          .canPlayType('audio/ogg; codecs="vorbis"')
          .replace(/^no$/, "");
        bool.mp3 = elem.canPlayType("audio/mpeg;").replace(/^no$/, "");

        bool.wav = elem
          .canPlayType('audio/wav; codecs="1"')
          .replace(/^no$/, "");
        bool.m4a = (
          elem.canPlayType("audio/x-m4a;") || elem.canPlayType("audio/aac;")
        ).replace(/^no$/, "");
      }
    } catch (e) {}

    return bool;
  };

  tests["localstorage"] = function () {
    try {
      localStorage.setItem(mod, mod);
      localStorage.removeItem(mod);
      return true;
    } catch (e) {
      return false;
    }
  };

  tests["sessionstorage"] = function () {
    try {
      sessionStorage.setItem(mod, mod);
      sessionStorage.removeItem(mod);
      return true;
    } catch (e) {
      return false;
    }
  };

  tests["webworkers"] = function () {
    return !!window.Worker;
  };

  tests["applicationcache"] = function () {
    return !!window.applicationCache;
  };

  tests["svg"] = function () {
    return (
      !!document.createElementNS &&
      !!document.createElementNS(ns.svg, "svg").createSVGRect
    );
  };

  tests["inlinesvg"] = function () {
    var div = document.createElement("div");
    div.innerHTML = "<svg/>";
    return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
  };

  tests["smil"] = function () {
    return (
      !!document.createElementNS &&
      /SVGAnimate/.test(
        toString.call(document.createElementNS(ns.svg, "animate"))
      )
    );
  };

  tests["svgclippaths"] = function () {
    return (
      !!document.createElementNS &&
      /SVGClipPath/.test(
        toString.call(document.createElementNS(ns.svg, "clipPath"))
      )
    );
  };

  function webforms() {
    Modernizr["input"] = (function (props) {
      for (var i = 0, len = props.length; i < len; i++) {
        attrs[props[i]] = !!(props[i] in inputElem);
      }
      if (attrs.list) {
        attrs.list = !!(
          document.createElement("datalist") && window.HTMLDataListElement
        );
      }
      return attrs;
    })(
      "autocomplete autofocus list placeholder max min multiple pattern required step".split(
        " "
      )
    );
    Modernizr["inputtypes"] = (function (props) {
      for (
        var i = 0, bool, inputElemType, defaultView, len = props.length;
        i < len;
        i++
      ) {
        inputElem.setAttribute("type", (inputElemType = props[i]));
        bool = inputElem.type !== "text";

        if (bool) {
          inputElem.value = smile;
          inputElem.style.cssText = "position:absolute;visibility:hidden;";

          if (
            /^range$/.test(inputElemType) &&
            inputElem.style.WebkitAppearance !== undefined
          ) {
            docElement.appendChild(inputElem);
            defaultView = document.defaultView;

            bool =
              defaultView.getComputedStyle &&
              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !==
                "textfield" &&
              inputElem.offsetHeight !== 0;

            docElement.removeChild(inputElem);
          } else if (/^(search|tel)$/.test(inputElemType)) {
          } else if (/^(url|email)$/.test(inputElemType)) {
            bool =
              inputElem.checkValidity && inputElem.checkValidity() === false;
          } else {
            bool = inputElem.value != smile;
          }
        }

        inputs[props[i]] = !!bool;
      }
      return inputs;
    })(
      "search tel url email datetime date month week time datetime-local number range color".split(
        " "
      )
    );
  }
  for (var feature in tests) {
    if (hasOwnProp(tests, feature)) {
      featureName = feature.toLowerCase();
      Modernizr[featureName] = tests[feature]();

      classes.push((Modernizr[featureName] ? "" : "no-") + featureName);
    }
  }

  Modernizr.input || webforms();

  Modernizr.addTest = function (feature, test) {
    if (typeof feature == "object") {
      for (var key in feature) {
        if (hasOwnProp(feature, key)) {
          Modernizr.addTest(key, feature[key]);
        }
      }
    } else {
      feature = feature.toLowerCase();

      if (Modernizr[feature] !== undefined) {
        return Modernizr;
      }

      test = typeof test == "function" ? test() : test;

      if (typeof enableClasses !== "undefined" && enableClasses) {
        docElement.className += " " + (test ? "" : "no-") + feature;
      }
      Modernizr[feature] = test;
    }

    return Modernizr;
  };

  setCss("");
  modElem = inputElem = null;

  (function (window, document) {
    var options = window.html5 || {};

    var reSkip =
      /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

    var saveClones =
      /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

    var supportsHtml5Styles;

    var expando = "_html5shiv";

    var expanID = 0;

    var expandoData = {};

    var supportsUnknownElements;

    (function () {
      try {
        var a = document.createElement("a");
        a.innerHTML = "<xyz></xyz>";
        supportsHtml5Styles = "hidden" in a;

        supportsUnknownElements =
          a.childNodes.length == 1 ||
          (function () {
            document.createElement("a");
            var frag = document.createDocumentFragment();
            return (
              typeof frag.cloneNode == "undefined" ||
              typeof frag.createDocumentFragment == "undefined" ||
              typeof frag.createElement == "undefined"
            );
          })();
      } catch (e) {
        supportsHtml5Styles = true;
        supportsUnknownElements = true;
      }
    })();
    function addStyleSheet(ownerDocument, cssText) {
      var p = ownerDocument.createElement("p"),
        parent =
          ownerDocument.getElementsByTagName("head")[0] ||
          ownerDocument.documentElement;

      p.innerHTML = "x<style>" + cssText + "</style>";
      return parent.insertBefore(p.lastChild, parent.firstChild);
    }

    function getElements() {
      var elements = html5.elements;
      return typeof elements == "string" ? elements.split(" ") : elements;
    }

    function getExpandoData(ownerDocument) {
      var data = expandoData[ownerDocument[expando]];
      if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
      }
      return data;
    }

    function createElement(nodeName, ownerDocument, data) {
      if (!ownerDocument) {
        ownerDocument = document;
      }
      if (supportsUnknownElements) {
        return ownerDocument.createElement(nodeName);
      }
      if (!data) {
        data = getExpandoData(ownerDocument);
      }
      var node;

      if (data.cache[nodeName]) {
        node = data.cache[nodeName].cloneNode();
      } else if (saveClones.test(nodeName)) {
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
      } else {
        node = data.createElem(nodeName);
      }

      return node.canHaveChildren && !reSkip.test(nodeName)
        ? data.frag.appendChild(node)
        : node;
    }

    function createDocumentFragment(ownerDocument, data) {
      if (!ownerDocument) {
        ownerDocument = document;
      }
      if (supportsUnknownElements) {
        return ownerDocument.createDocumentFragment();
      }
      data = data || getExpandoData(ownerDocument);
      var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;
      for (; i < l; i++) {
        clone.createElement(elems[i]);
      }
      return clone;
    }

    function shivMethods(ownerDocument, data) {
      if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
      }

      ownerDocument.createElement = function (nodeName) {
        if (!html5.shivMethods) {
          return data.createElem(nodeName);
        }
        return createElement(nodeName, ownerDocument, data);
      };

      ownerDocument.createDocumentFragment = Function(
        "h,f",
        "return function(){" +
          "var n=f.cloneNode(),c=n.createElement;" +
          "h.shivMethods&&(" +
          getElements()
            .join()
            .replace(/\w+/g, function (nodeName) {
              data.createElem(nodeName);
              data.frag.createElement(nodeName);
              return 'c("' + nodeName + '")';
            }) +
          ");return n}"
      )(html5, data.frag);
    }
    function shivDocument(ownerDocument) {
      if (!ownerDocument) {
        ownerDocument = document;
      }
      var data = getExpandoData(ownerDocument);

      if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
        data.hasCSS = !!addStyleSheet(
          ownerDocument,
          "article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}" +
            "mark{background:#FF0;color:#000}"
        );
      }
      if (!supportsUnknownElements) {
        shivMethods(ownerDocument, data);
      }
      return ownerDocument;
    }
    var html5 = {
      elements:
        options.elements ||
        "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",

      shivCSS: options.shivCSS !== false,

      supportsUnknownElements: supportsUnknownElements,

      shivMethods: options.shivMethods !== false,

      type: "default",

      shivDocument: shivDocument,

      createElement: createElement,

      createDocumentFragment: createDocumentFragment,
    };
    window.html5 = html5;

    shivDocument(document);
  })(this, document);

  Modernizr._version = version;

  Modernizr._prefixes = prefixes;
  Modernizr._domPrefixes = domPrefixes;
  Modernizr._cssomPrefixes = cssomPrefixes;

  Modernizr.hasEvent = isEventSupported;

  Modernizr.testProp = function (prop) {
    return testProps([prop]);
  };

  Modernizr.testAllProps = testPropsAll;

  Modernizr.testStyles = injectElementWithStyles;
  Modernizr.prefixed = function (prop, obj, elem) {
    if (!obj) {
      return testPropsAll(prop, "pfx");
    } else {
      return testPropsAll(prop, obj, elem);
    }
  };

  docElement.className =
    docElement.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") +
    (enableClasses ? " js " + classes.join(" ") : "");

  return Modernizr;
})(this, this.document);
/*yepnope1.5.4|WTFPL*/
(function (a, b, c) {
  function d(a) {
    return "[object Function]" == o.call(a);
  }
  function e(a) {
    return "string" == typeof a;
  }
  function f() {}
  function g(a) {
    return !a || "loaded" == a || "complete" == a || "uninitialized" == a;
  }
  function h() {
    var a = p.shift();
    (q = 1),
      a
        ? a.t
          ? m(function () {
              ("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1);
            }, 0)
          : (a(), h())
        : (q = 0);
  }
  function i(a, c, d, e, f, i, j) {
    function k(b) {
      if (
        !o &&
        g(l.readyState) &&
        ((u.r = o = 1), !q && h(), (l.onload = l.onreadystatechange = null), b)
      ) {
        "img" != a &&
          m(function () {
            t.removeChild(l);
          }, 50);
        for (var d in y[c]) y[c].hasOwnProperty(d) && y[c][d].onload();
      }
    }
    var j = j || B.errorTimeout,
      l = b.createElement(a),
      o = 0,
      r = 0,
      u = { t: d, s: c, e: f, a: i, x: j };
    1 === y[c] && ((r = 1), (y[c] = [])),
      "object" == a ? (l.data = c) : ((l.src = c), (l.type = a)),
      (l.width = l.height = "0"),
      (l.onerror =
        l.onload =
        l.onreadystatechange =
          function () {
            k.call(this, r);
          }),
      p.splice(e, 0, u),
      "img" != a &&
        (r || 2 === y[c]
          ? (t.insertBefore(l, s ? null : n), m(k, j))
          : y[c].push(l));
  }
  function j(a, b, c, d, f) {
    return (
      (q = 0),
      (b = b || "j"),
      e(a)
        ? i("c" == b ? v : u, a, b, this.i++, c, d, f)
        : (p.splice(this.i++, 0, a), 1 == p.length && h()),
      this
    );
  }
  function k() {
    var a = B;
    return (a.loader = { load: j, i: 0 }), a;
  }
  var l = b.documentElement,
    m = a.setTimeout,
    n = b.getElementsByTagName("script")[0],
    o = {}.toString,
    p = [],
    q = 0,
    r = "MozAppearance" in l.style,
    s = r && !!b.createRange().compareNode,
    t = s ? l : n.parentNode,
    l = a.opera && "[object Opera]" == o.call(a.opera),
    l = !!b.attachEvent && !l,
    u = r ? "object" : l ? "script" : "img",
    v = l ? "script" : u,
    w =
      Array.isArray ||
      function (a) {
        return "[object Array]" == o.call(a);
      },
    x = [],
    y = {},
    z = {
      timeout: function (a, b) {
        return b.length && (a.timeout = b[0]), a;
      },
    },
    A,
    B;
  (B = function (a) {
    function b(a) {
      var a = a.split("!"),
        b = x.length,
        c = a.pop(),
        d = a.length,
        c = { url: c, origUrl: c, prefixes: a },
        e,
        f,
        g;
      for (f = 0; f < d; f++)
        (g = a[f].split("=")), (e = z[g.shift()]) && (c = e(c, g));
      for (f = 0; f < b; f++) c = x[f](c);
      return c;
    }
    function g(a, e, f, g, h) {
      var i = b(a),
        j = i.autoCallback;
      i.url.split(".").pop().split("?").shift(),
        i.bypass ||
          (e &&
            (e = d(e)
              ? e
              : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]),
          i.instead
            ? i.instead(a, e, f, g, h)
            : (y[i.url] ? (i.noexec = !0) : (y[i.url] = 1),
              f.load(
                i.url,
                i.forceCSS ||
                  (!i.forceJS &&
                    "css" == i.url.split(".").pop().split("?").shift())
                  ? "c"
                  : c,
                i.noexec,
                i.attrs,
                i.timeout
              ),
              (d(e) || d(j)) &&
                f.load(function () {
                  k(),
                    e && e(i.origUrl, h, g),
                    j && j(i.origUrl, h, g),
                    (y[i.url] = 2);
                })));
    }
    function h(a, b) {
      function c(a, c) {
        if (a) {
          if (e(a))
            c ||
              (j = function () {
                var a = [].slice.call(arguments);
                k.apply(this, a), l();
              }),
              g(a, j, b, 0, h);
          else if (Object(a) === a)
            for (n in ((m = (function () {
              var b = 0,
                c;
              for (c in a) a.hasOwnProperty(c) && b++;
              return b;
            })()),
            a))
              a.hasOwnProperty(n) &&
                (!c &&
                  !--m &&
                  (d(j)
                    ? (j = function () {
                        var a = [].slice.call(arguments);
                        k.apply(this, a), l();
                      })
                    : (j[n] = (function (a) {
                        return function () {
                          var b = [].slice.call(arguments);
                          a && a.apply(this, b), l();
                        };
                      })(k[n]))),
                g(a[n], j, b, n, h));
        } else !c && l();
      }
      var h = !!a.test,
        i = a.load || a.both,
        j = a.callback || f,
        k = j,
        l = a.complete || f,
        m,
        n;
      c(h ? a.yep : a.nope, !!i), i && c(i);
    }
    var i,
      j,
      l = this.yepnope.loader;
    if (e(a)) g(a, 0, l, 0);
    else if (w(a))
      for (i = 0; i < a.length; i++)
        (j = a[i]),
          e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l);
    else Object(a) === a && h(a, l);
  }),
    (B.addPrefix = function (a, b) {
      z[a] = b;
    }),
    (B.addFilter = function (a) {
      x.push(a);
    }),
    (B.errorTimeout = 1e4),
    null == b.readyState &&
      b.addEventListener &&
      ((b.readyState = "loading"),
      b.addEventListener(
        "DOMContentLoaded",
        (A = function () {
          b.removeEventListener("DOMContentLoaded", A, 0),
            (b.readyState = "complete");
        }),
        0
      )),
    (a.yepnope = k()),
    (a.yepnope.executeStack = h),
    (a.yepnope.injectJs = function (a, c, d, e, i, j) {
      var k = b.createElement("script"),
        l,
        o,
        e = e || B.errorTimeout;
      k.src = a;
      for (o in d) k.setAttribute(o, d[o]);
      (c = j ? h : c || f),
        (k.onreadystatechange = k.onload =
          function () {
            !l &&
              g(k.readyState) &&
              ((l = 1), c(), (k.onload = k.onreadystatechange = null));
          }),
        m(function () {
          l || ((l = 1), c(1));
        }, e),
        i ? k.onload() : n.parentNode.insertBefore(k, n);
    }),
    (a.yepnope.injectCss = function (a, c, d, e, g, i) {
      var e = b.createElement("link"),
        j,
        c = i ? h : c || f;
      (e.href = a), (e.rel = "stylesheet"), (e.type = "text/css");
      for (j in d) e.setAttribute(j, d[j]);
      g || (n.parentNode.insertBefore(e, n), m(c, 0));
    });
})(this, document);
Modernizr.load = function () {
  yepnope.apply(window, [].slice.call(arguments, 0));
};
// https://github.com/Modernizr/Modernizr/issues/615
// documentMode is needed for false positives in oldIE, please see issue above
Modernizr.addTest("cssfilters", function () {
  var el = document.createElement("div");
  el.style.cssText = Modernizr._prefixes.join("filter" + ":blur(2px); ");
  return (
    !!el.style.length &&
    (document.documentMode === undefined || document.documentMode > 9)
  );
});

(function (Modernizr, win) {
  Modernizr.addTest("csstransformspreserve3d", function () {
    var prop = Modernizr.prefixed("transformStyle");
    var val = "preserve-3d";
    var computedStyle;
    if (!prop) return false;

    prop = prop
      .replace(/([A-Z])/g, function (str, m1) {
        return "-" + m1.toLowerCase();
      })
      .replace(/^ms-/, "-ms-");

    Modernizr.testStyles(
      "#modernizr{" + prop + ":" + val + ";}",
      function (el, rule) {
        computedStyle = win.getComputedStyle
          ? getComputedStyle(el, null).getPropertyValue(prop)
          : "";
      }
    );

    return computedStyle === val;
  });
})(Modernizr, window);
(function () {
  "use strict";

  /**
   * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
   *
   * @codingstandard ftlabs-jsv2
   * @copyright The Financial Times Limited [All Rights Reserved]
   * @license MIT License (see LICENSE.txt)
   */

  /*jslint browser:true, node:true*/
  /*global define, Event, Node*/

  /**
   * Instantiate fast-clicking listeners on the specified layer.
   *
   * @constructor
   * @param {Element} layer The layer to listen on
   * @param {Object} [options={}] The options to override the defaults
   */
  function FastClick(layer, options) {
    var oldOnClick;

    options = options || {};

    /**
     * Whether a click is currently being tracked.
     *
     * @type boolean
     */
    this.trackingClick = false;

    /**
     * Timestamp for when click tracking started.
     *
     * @type number
     */
    this.trackingClickStart = 0;

    /**
     * The element being tracked for a click.
     *
     * @type EventTarget
     */
    this.targetElement = null;

    /**
     * X-coordinate of touch start event.
     *
     * @type number
     */
    this.touchStartX = 0;

    /**
     * Y-coordinate of touch start event.
     *
     * @type number
     */
    this.touchStartY = 0;

    /**
     * ID of the last touch, retrieved from Touch.identifier.
     *
     * @type number
     */
    this.lastTouchIdentifier = 0;

    /**
     * Touchmove boundary, beyond which a click will be cancelled.
     *
     * @type number
     */
    this.touchBoundary = options.touchBoundary || 10;

    /**
     * The FastClick layer.
     *
     * @type Element
     */
    this.layer = layer;

    /**
     * The minimum time between tap(touchstart and touchend) events
     *
     * @type number
     */
    this.tapDelay = options.tapDelay || 200;

    /**
     * The maximum time for a tap
     *
     * @type number
     */
    this.tapTimeout = options.tapTimeout || 700;

    if (FastClick.notNeeded(layer)) {
      return;
    }

    // Some old versions of Android don't have Function.prototype.bind
    function bind(method, context) {
      return function () {
        return method.apply(context, arguments);
      };
    }

    var methods = [
      "onMouse",
      "onClick",
      "onTouchStart",
      "onTouchMove",
      "onTouchEnd",
      "onTouchCancel",
    ];
    var context = this;
    for (var i = 0, l = methods.length; i < l; i++) {
      context[methods[i]] = bind(context[methods[i]], context);
    }

    // Set up event handlers as required
    if (deviceIsAndroid) {
      layer.addEventListener("mouseover", this.onMouse, true);
      layer.addEventListener("mousedown", this.onMouse, true);
      layer.addEventListener("mouseup", this.onMouse, true);
    }

    layer.addEventListener("click", this.onClick, true);
    layer.addEventListener("touchstart", this.onTouchStart, false);
    layer.addEventListener("touchmove", this.onTouchMove, false);
    layer.addEventListener("touchend", this.onTouchEnd, false);
    layer.addEventListener("touchcancel", this.onTouchCancel, false);

    // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
    // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
    // layer when they are cancelled.
    if (!Event.prototype.stopImmediatePropagation) {
      layer.removeEventListener = function (type, callback, capture) {
        var rmv = Node.prototype.removeEventListener;
        if (type === "click") {
          rmv.call(layer, type, callback.hijacked || callback, capture);
        } else {
          rmv.call(layer, type, callback, capture);
        }
      };

      layer.addEventListener = function (type, callback, capture) {
        var adv = Node.prototype.addEventListener;
        if (type === "click") {
          adv.call(
            layer,
            type,
            callback.hijacked ||
              (callback.hijacked = function (event) {
                if (!event.propagationStopped) {
                  callback(event);
                }
              }),
            capture
          );
        } else {
          adv.call(layer, type, callback, capture);
        }
      };
    }

    // If a handler is already declared in the element's onclick attribute, it will be fired before
    // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
    // adding it as listener.
    if (typeof layer.onclick === "function") {
      // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
      // - the old one won't work if passed to addEventListener directly.
      oldOnClick = layer.onclick;
      layer.addEventListener(
        "click",
        function (event) {
          oldOnClick(event);
        },
        false
      );
      layer.onclick = null;
    }
  }

  /**
   * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
   *
   * @type boolean
   */
  var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

  /**
   * Android requires exceptions.
   *
   * @type boolean
   */
  var deviceIsAndroid =
    navigator.userAgent.indexOf("Android") > 0 && !deviceIsWindowsPhone;

  /**
   * iOS requires exceptions.
   *
   * @type boolean
   */
  var deviceIsIOS =
    /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;

  /**
   * iOS 4 requires an exception for select elements.
   *
   * @type boolean
   */
  var deviceIsIOS4 = deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent);

  /**
   * iOS 6.0-7.* requires the target element to be manually derived
   *
   * @type boolean
   */
  var deviceIsIOSWithBadTarget =
    deviceIsIOS && /OS [6-7]_\d/.test(navigator.userAgent);

  /**
   * BlackBerry requires exceptions.
   *
   * @type boolean
   */
  var deviceIsBlackBerry10 = navigator.userAgent.indexOf("BB10") > 0;

  /**
   * Determine whether a given element requires a native click.
   *
   * @param {EventTarget|Element} target Target DOM element
   * @returns {boolean} Returns true if the element needs a native click
   */
  FastClick.prototype.needsClick = function (target) {
    switch (target.nodeName.toLowerCase()) {
      // Don't send a synthetic click to disabled inputs (issue #62)
      case "button":
      case "select":
      case "textarea":
        if (target.disabled) {
          return true;
        }

        break;
      case "input":
        // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
        if ((deviceIsIOS && target.type === "file") || target.disabled) {
          return true;
        }

        break;
      case "label":
      case "iframe": // iOS8 homescreen apps can prevent events bubbling into frames
      case "video":
        return true;
    }

    return /\bneedsclick\b/.test(target.className);
  };

  /**
   * Determine whether a given element requires a call to focus to simulate click into element.
   *
   * @param {EventTarget|Element} target Target DOM element
   * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
   */
  FastClick.prototype.needsFocus = function (target) {
    switch (target.nodeName.toLowerCase()) {
      case "textarea":
        return true;
      case "select":
        return !deviceIsAndroid;
      case "input":
        switch (target.type) {
          case "button":
          case "checkbox":
          case "file":
          case "image":
          case "radio":
          case "submit":
            return false;
        }

        // No point in attempting to focus disabled inputs
        return !target.disabled && !target.readOnly;
      default:
        return /\bneedsfocus\b/.test(target.className);
    }
  };

  /**
   * Send a click event to the specified element.
   *
   * @param {EventTarget|Element} targetElement
   * @param {Event} event
   */
  FastClick.prototype.sendClick = function (targetElement, event) {
    var clickEvent, touch;

    // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
    if (document.activeElement && document.activeElement !== targetElement) {
      document.activeElement.blur();
    }

    touch = event.changedTouches[0];

    // Synthesise a click event, with an extra attribute so it can be tracked
    clickEvent = document.createEvent("MouseEvents");
    clickEvent.initMouseEvent(
      this.determineEventType(targetElement),
      true,
      true,
      window,
      1,
      touch.screenX,
      touch.screenY,
      touch.clientX,
      touch.clientY,
      false,
      false,
      false,
      false,
      0,
      null
    );
    clickEvent.forwardedTouchEvent = true;
    targetElement.dispatchEvent(clickEvent);
  };

  FastClick.prototype.determineEventType = function (targetElement) {
    //Issue #159: Android Chrome Select Box does not open with a synthetic click event
    if (deviceIsAndroid && targetElement.tagName.toLowerCase() === "select") {
      return "mousedown";
    }

    return "click";
  };

  /**
   * @param {EventTarget|Element} targetElement
   */
  FastClick.prototype.focus = function (targetElement) {
    var length;

    // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
    if (
      deviceIsIOS &&
      targetElement.setSelectionRange &&
      targetElement.type.indexOf("date") !== 0 &&
      targetElement.type !== "time" &&
      targetElement.type !== "month"
    ) {
      length = targetElement.value.length;
      targetElement.setSelectionRange(length, length);
    } else {
      targetElement.focus();
    }
  };

  /**
   * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
   *
   * @param {EventTarget|Element} targetElement
   */
  FastClick.prototype.updateScrollParent = function (targetElement) {
    var scrollParent, parentElement;

    scrollParent = targetElement.fastClickScrollParent;

    // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
    // target element was moved to another parent.
    if (!scrollParent || !scrollParent.contains(targetElement)) {
      parentElement = targetElement;
      do {
        if (parentElement.scrollHeight > parentElement.offsetHeight) {
          scrollParent = parentElement;
          targetElement.fastClickScrollParent = parentElement;
          break;
        }

        parentElement = parentElement.parentElement;
      } while (parentElement);
    }

    // Always update the scroll top tracker if possible.
    if (scrollParent) {
      scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
    }
  };

  /**
   * @param {EventTarget} targetElement
   * @returns {Element|EventTarget}
   */
  FastClick.prototype.getTargetElementFromEventTarget = function (eventTarget) {
    // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
    if (eventTarget.nodeType === Node.TEXT_NODE) {
      return eventTarget.parentNode;
    }

    return eventTarget;
  };

  /**
   * On touch start, record the position and scroll offset.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onTouchStart = function (event) {
    var targetElement, touch, selection;

    // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
    if (event.targetTouches.length > 1) {
      return true;
    }

    targetElement = this.getTargetElementFromEventTarget(event.target);
    touch = event.targetTouches[0];

    if (deviceIsIOS) {
      // Only trusted events will deselect text on iOS (issue #49)
      selection = window.getSelection();
      if (selection.rangeCount && !selection.isCollapsed) {
        return true;
      }

      if (!deviceIsIOS4) {
        // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
        // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
        // with the same identifier as the touch event that previously triggered the click that triggered the alert.
        // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
        // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
        // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
        // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
        // random integers, it's safe to to continue if the identifier is 0 here.
        if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
          event.preventDefault();
          return false;
        }

        this.lastTouchIdentifier = touch.identifier;

        // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
        // 1) the user does a fling scroll on the scrollable layer
        // 2) the user stops the fling scroll with another tap
        // then the event.target of the last 'touchend' event will be the element that was under the user's finger
        // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
        // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
        this.updateScrollParent(targetElement);
      }
    }

    this.trackingClick = true;
    this.trackingClickStart = event.timeStamp;
    this.targetElement = targetElement;

    this.touchStartX = touch.pageX;
    this.touchStartY = touch.pageY;

    // Prevent phantom clicks on fast double-tap (issue #36)
    if (event.timeStamp - this.lastClickTime < this.tapDelay) {
      event.preventDefault();
    }

    return true;
  };

  /**
   * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.touchHasMoved = function (event) {
    var touch = event.changedTouches[0],
      boundary = this.touchBoundary;

    if (
      Math.abs(touch.pageX - this.touchStartX) > boundary ||
      Math.abs(touch.pageY - this.touchStartY) > boundary
    ) {
      return true;
    }

    return false;
  };

  /**
   * Update the last position.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onTouchMove = function (event) {
    if (!this.trackingClick) {
      return true;
    }

    // If the touch has moved, cancel the click tracking
    if (
      this.targetElement !==
        this.getTargetElementFromEventTarget(event.target) ||
      this.touchHasMoved(event)
    ) {
      this.trackingClick = false;
      this.targetElement = null;
    }

    return true;
  };

  /**
   * Attempt to find the labelled control for the given label element.
   *
   * @param {EventTarget|HTMLLabelElement} labelElement
   * @returns {Element|null}
   */
  FastClick.prototype.findControl = function (labelElement) {
    // Fast path for newer browsers supporting the HTML5 control attribute
    if (labelElement.control !== undefined) {
      return labelElement.control;
    }

    // All browsers under test that support touch events also support the HTML5 htmlFor attribute
    if (labelElement.htmlFor) {
      return document.getElementById(labelElement.htmlFor);
    }

    // If no for attribute exists, attempt to retrieve the first labellable descendant element
    // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
    return labelElement.querySelector(
      "button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea"
    );
  };

  /**
   * On touch end, determine whether to send a click event at once.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onTouchEnd = function (event) {
    var forElement,
      trackingClickStart,
      targetTagName,
      scrollParent,
      touch,
      targetElement = this.targetElement;

    if (!this.trackingClick) {
      return true;
    }

    // Prevent phantom clicks on fast double-tap (issue #36)
    if (event.timeStamp - this.lastClickTime < this.tapDelay) {
      this.cancelNextClick = true;
      return true;
    }

    if (event.timeStamp - this.trackingClickStart > this.tapTimeout) {
      return true;
    }

    // Reset to prevent wrong click cancel on input (issue #156).
    this.cancelNextClick = false;

    this.lastClickTime = event.timeStamp;

    trackingClickStart = this.trackingClickStart;
    this.trackingClick = false;
    this.trackingClickStart = 0;

    // On some iOS devices, the targetElement supplied with the event is invalid if the layer
    // is performing a transition or scroll, and has to be re-detected manually. Note that
    // for this to function correctly, it must be called *after* the event target is checked!
    // See issue #57; also filed as rdar://13048589 .
    if (deviceIsIOSWithBadTarget) {
      touch = event.changedTouches[0];

      // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
      targetElement =
        document.elementFromPoint(
          touch.pageX - window.pageXOffset,
          touch.pageY - window.pageYOffset
        ) || targetElement;
      targetElement.fastClickScrollParent =
        this.targetElement.fastClickScrollParent;
    }

    targetTagName = targetElement.tagName.toLowerCase();
    if (targetTagName === "label") {
      forElement = this.findControl(targetElement);
      if (forElement) {
        this.focus(targetElement);
        if (deviceIsAndroid) {
          return false;
        }

        targetElement = forElement;
      }
    } else if (this.needsFocus(targetElement)) {
      // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
      // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
      if (
        event.timeStamp - trackingClickStart > 100 ||
        (deviceIsIOS && window.top !== window && targetTagName === "input")
      ) {
        this.targetElement = null;
        return false;
      }

      this.focus(targetElement);
      this.sendClick(targetElement, event);

      // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
      // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
      if (!deviceIsIOS || targetTagName !== "select") {
        this.targetElement = null;
        event.preventDefault();
      }

      return false;
    }

    if (deviceIsIOS && !deviceIsIOS4) {
      // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
      // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
      scrollParent = targetElement.fastClickScrollParent;
      if (
        scrollParent &&
        scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop
      ) {
        return true;
      }
    }

    // Prevent the actual click from going though - unless the target node is marked as requiring
    // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
    if (!this.needsClick(targetElement)) {
      event.preventDefault();
      this.sendClick(targetElement, event);
    }

    return false;
  };

  /**
   * On touch cancel, stop tracking the click.
   *
   * @returns {void}
   */
  FastClick.prototype.onTouchCancel = function () {
    this.trackingClick = false;
    this.targetElement = null;
  };

  /**
   * Determine mouse events which should be permitted.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onMouse = function (event) {
    // If a target element was never set (because a touch event was never fired) allow the event
    if (!this.targetElement) {
      return true;
    }

    if (event.forwardedTouchEvent) {
      return true;
    }

    // Programmatically generated events targeting a specific element should be permitted
    if (!event.cancelable) {
      return true;
    }

    // Derive and check the target element to see whether the mouse event needs to be permitted;
    // unless explicitly enabled, prevent non-touch click events from triggering actions,
    // to prevent ghost/doubleclicks.
    if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
      // Prevent any user-added listeners declared on FastClick element from being fired.
      if (event.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      } else {
        // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
        event.propagationStopped = true;
      }

      // Cancel the event
      event.stopPropagation();
      event.preventDefault();

      return false;
    }

    // If the mouse event is permitted, return true for the action to go through.
    return true;
  };

  /**
   * On actual clicks, determine whether this is a touch-generated click, a click action occurring
   * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
   * an actual click which should be permitted.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onClick = function (event) {
    var permitted;

    // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
    if (this.trackingClick) {
      this.targetElement = null;
      this.trackingClick = false;
      return true;
    }

    // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
    if (event.target.type === "submit" && event.detail === 0) {
      return true;
    }

    permitted = this.onMouse(event);

    // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
    if (!permitted) {
      this.targetElement = null;
    }

    // If clicks are permitted, return true for the action to go through.
    return permitted;
  };

  /**
   * Remove all FastClick's event listeners.
   *
   * @returns {void}
   */
  FastClick.prototype.destroy = function () {
    var layer = this.layer;

    if (deviceIsAndroid) {
      layer.removeEventListener("mouseover", this.onMouse, true);
      layer.removeEventListener("mousedown", this.onMouse, true);
      layer.removeEventListener("mouseup", this.onMouse, true);
    }

    layer.removeEventListener("click", this.onClick, true);
    layer.removeEventListener("touchstart", this.onTouchStart, false);
    layer.removeEventListener("touchmove", this.onTouchMove, false);
    layer.removeEventListener("touchend", this.onTouchEnd, false);
    layer.removeEventListener("touchcancel", this.onTouchCancel, false);
  };

  /**
   * Check whether FastClick is needed.
   *
   * @param {Element} layer The layer to listen on
   */
  FastClick.notNeeded = function (layer) {
    var metaViewport;
    var chromeVersion;
    var blackberryVersion;
    var firefoxVersion;

    // Devices that don't support touch don't need FastClick
    if (typeof window.ontouchstart === "undefined") {
      return true;
    }

    // Chrome version - zero for other browsers
    chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

    if (chromeVersion) {
      if (deviceIsAndroid) {
        metaViewport = document.querySelector("meta[name=viewport]");

        if (metaViewport) {
          // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
          if (metaViewport.content.indexOf("user-scalable=no") !== -1) {
            return true;
          }
          // Chrome 32 and above with width=device-width or less don't need FastClick
          if (
            chromeVersion > 31 &&
            document.documentElement.scrollWidth <= window.outerWidth
          ) {
            return true;
          }
        }

        // Chrome desktop doesn't need FastClick (issue #15)
      } else {
        return true;
      }
    }

    if (deviceIsBlackBerry10) {
      blackberryVersion = navigator.userAgent.match(
        /Version\/([0-9]*)\.([0-9]*)/
      );

      // BlackBerry 10.3+ does not require Fastclick library.
      // https://github.com/ftlabs/fastclick/issues/251
      if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
        metaViewport = document.querySelector("meta[name=viewport]");

        if (metaViewport) {
          // user-scalable=no eliminates click delay.
          if (metaViewport.content.indexOf("user-scalable=no") !== -1) {
            return true;
          }
          // width=device-width (or less than device-width) eliminates click delay.
          if (document.documentElement.scrollWidth <= window.outerWidth) {
            return true;
          }
        }
      }
    }

    // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
    if (
      layer.style.msTouchAction === "none" ||
      layer.style.touchAction === "manipulation"
    ) {
      return true;
    }

    // Firefox version - zero for other browsers
    firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [
      ,
      0,
    ])[1];

    if (firefoxVersion >= 27) {
      // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

      metaViewport = document.querySelector("meta[name=viewport]");
      if (
        metaViewport &&
        (metaViewport.content.indexOf("user-scalable=no") !== -1 ||
          document.documentElement.scrollWidth <= window.outerWidth)
      ) {
        return true;
      }
    }

    // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
    // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
    if (
      layer.style.touchAction === "none" ||
      layer.style.touchAction === "manipulation"
    ) {
      return true;
    }

    return false;
  };

  /**
   * Factory method for creating a FastClick object
   *
   * @param {Element} layer The layer to listen on
   * @param {Object} [options={}] The options to override the defaults
   */
  FastClick.attach = function (layer, options) {
    return new FastClick(layer, options);
  };

  if (
    typeof define === "function" &&
    typeof define.amd === "object" &&
    define.amd
  ) {
    // AMD. Register as an anonymous module.
    define(function () {
      return FastClick;
    });
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = FastClick.attach;
    module.exports.FastClick = FastClick;
  } else {
    window.FastClick = FastClick;
  }
})();
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["card"] = Handlebars.template(function (
  Handlebars,
  depth0,
  helpers,
  partials,
  data
) {
  this.compilerInfo = [4, ">= 1.0.0"];
  helpers = this.merge(helpers, Handlebars.helpers);
  data = data || {};
  var buffer = "",
    stack1,
    helper,
    functionType = "function",
    escapeExpression = this.escapeExpression;

  buffer += '<div class="card">\n  <div class="content" id="';
  if ((helper = helpers.css_id)) {
    stack1 = helper.call(depth0, { hash: {}, data: data });
  } else {
    helper = depth0 && depth0.css_id;
    stack1 =
      typeof helper === functionType
        ? helper.call(depth0, { hash: {}, data: data })
        : helper;
  }
  buffer +=
    escapeExpression(stack1) +
    '">\n    <div class="cardface front">\n      <a href="';
  if ((helper = helpers.link)) {
    stack1 = helper.call(depth0, { hash: {}, data: data });
  } else {
    helper = depth0 && depth0.link;
    stack1 =
      typeof helper === functionType
        ? helper.call(depth0, { hash: {}, data: data })
        : helper;
  }
  buffer += escapeExpression(stack1) + '" class="track-main">\n        <h2>';
  if ((helper = helpers.title)) {
    stack1 = helper.call(depth0, { hash: {}, data: data });
  } else {
    helper = depth0 && depth0.title;
    stack1 =
      typeof helper === functionType
        ? helper.call(depth0, { hash: {}, data: data })
        : helper;
  }
  buffer += escapeExpression(stack1) + '</h2>\n        <i class="pictogram ';
  if ((helper = helpers.pictogram)) {
    stack1 = helper.call(depth0, { hash: {}, data: data });
  } else {
    helper = depth0 && depth0.pictogram;
    stack1 =
      typeof helper === functionType
        ? helper.call(depth0, { hash: {}, data: data })
        : helper;
  }
  buffer +=
    escapeExpression(stack1) +
    '"></i>\n      </a>\n      <i class="flip-button info flip-open"></i>\n    </div>\n    <div class="cardface back">\n      <a href="';
  if ((helper = helpers.link)) {
    stack1 = helper.call(depth0, { hash: {}, data: data });
  } else {
    helper = depth0 && depth0.link;
    stack1 =
      typeof helper === functionType
        ? helper.call(depth0, { hash: {}, data: data })
        : helper;
  }
  buffer += escapeExpression(stack1) + '" class="track-main"><h2>';
  if ((helper = helpers.title)) {
    stack1 = helper.call(depth0, { hash: {}, data: data });
  } else {
    helper = depth0 && depth0.title;
    stack1 =
      typeof helper === functionType
        ? helper.call(depth0, { hash: {}, data: data })
        : helper;
  }
  buffer += escapeExpression(stack1) + "</h2></a>\n      <p>";
  if ((helper = helpers.description)) {
    stack1 = helper.call(depth0, { hash: {}, data: data });
  } else {
    helper = depth0 && depth0.description;
    stack1 =
      typeof helper === functionType
        ? helper.call(depth0, { hash: {}, data: data })
        : helper;
  }
  if (stack1 || stack1 === 0) {
    buffer += stack1;
  }
  buffer +=
    '</p>\n      <i class="flip-button close"></i>\n    </div>\n  </div>\n</div>';
  return buffer;
});

this["Handlebars"]["templates"]["tagline"] = Handlebars.template(function (
  Handlebars,
  depth0,
  helpers,
  partials,
  data
) {
  this.compilerInfo = [4, ">= 1.0.0"];
  helpers = this.merge(helpers, Handlebars.helpers);
  data = data || {};
  var stack1,
    helper,
    functionType = "function";

  if ((helper = helpers.tagline)) {
    stack1 = helper.call(depth0, { hash: {}, data: data });
  } else {
    helper = depth0 && depth0.tagline;
    stack1 =
      typeof helper === functionType
        ? helper.call(depth0, { hash: {}, data: data })
        : helper;
  }
  if (stack1 || stack1 === 0) {
    return stack1;
  } else {
    return "";
  }
});
var s,
  Card = {
    settings: {
      cards: null,
      infoBtn: null,
      jqueryFlip: {
        shrink: null,
        expand: null,
      },
    },

    init: function () {
      s = this.settings;
      this.createCards(function () {
        // Initialize some settings variables
        s.cards = $(".card");
        s.infoBtn = $(".flip-button");

        // jQuery flip setup
        if (!Modernizr.csstransforms3d || !Modernizr.csstransformspreserve3d) {
          Card.setJQueryFlipSettings();
          $(".back").css(s.jqueryFlip.shrink).hide();
        }

        Card.bindUIActions();
        Card.resizeCards();
      });
    },

    createCards: function (callback) {
      var template = Handlebars.templates["card"];
      for (var i = 0; i < data.cards.length; i++) {
        var html = template(data.cards[i]);
        $("#grid").append(html);
      }

      callback();
    },

    bindUIActions: function () {
      $(window).resize(function () {
        // Resize the cards if the browser window is resized
        Card.resizeCards();

        // Insert intelligent comment here
        if (!Modernizr.csstransforms3d || !Modernizr.csstransformspreserve3d) {
          Card.setJQueryFlipSettings();
        }
      });

      // Animation when a card is clicked
      Card.cardClickedAnimation();

      // Flip card by clicking the info button
      s.infoBtn.click(function () {
        if (Modernizr.csstransforms3d && Modernizr.csstransformspreserve3d) {
          Card.flipCardWithCSS($(this));
        } else {
          Card.flipCardWithJQuery($(this));
        }
      });
    },

    resizeCards: function () {
      var width = s.cards.outerWidth();
      s.cards.css("height", width);
    },

    cardClickedAnimation: function () {
      // Mouse button clicked
      $(".front a").mousedown(function () {
        $(this).parents(".card").addClass("active");
      });

      // Mouse button released
      s.cards.on("mouseleave mouseup", function () {
        $(this).removeClass("active");
      });
    },

    flipCardWithCSS: function (infoBtn) {
      // Display the back of the cards (hidden by default to prevent flashing on load)
      $(".back").show();

      var cardContent = infoBtn.parents(".content");

      // If this card is already flipped, then just flip it back
      if (cardContent.hasClass("flipped")) {
        cardContent.removeClass("flipped");
      }
      // Else, flip all cards that have already been flipped, then flip this card
      else {
        $(".flipped").removeClass("flipped");
        cardContent.addClass("flipped");
      }
      return false;
    },

    flipCardWithJQuery: function (infoBtn) {
      var cardFace = infoBtn.parent();
      var previouslyFlippedCard = $(".back:visible");

      if (cardFace.hasClass("back")) {
        Card.animateJQueryFlip(previouslyFlippedCard);
      } else {
        Card.animateJQueryFlip(previouslyFlippedCard);
        Card.animateJQueryFlip(cardFace);
      }
    },

    animateJQueryFlip: function (cardFace) {
      var otherCardFace = cardFace.siblings(".cardface");

      cardFace.animate(s.jqueryFlip.shrink, 100, function () {
        cardFace.hide();
        otherCardFace.show();

        otherCardFace.animate(s.jqueryFlip.expand, 100, function () {
          $(this).width("");
        });
      });
    },

    setJQueryFlipSettings: function () {
      s.jqueryFlip.shrink = {
        width: 0,
        marginLeft: s.cards.width() / 2 + "px",
        opacity: 0.4,
      };

      s.jqueryFlip.expand = {
        width: s.cards.width() + "px",
        marginLeft: 0,
        opacity: 1,
      };
    },
  };

var Modal = {
  init: function () {},

  show: function (id) {
    $(id).fadeIn(200);
    $("#lean_overlay").fadeTo(200, 0.7);

    // Close modal when clicking the background or close button
    $(".modal_close, #lean_overlay").click(function () {
      Modal.hide(id);
    });
  },

  hide: function (id) {
    $(id).fadeOut(100);
    $("#lean_overlay").fadeOut(200);
  },
};
var data = {
  cards: [
    {
      title: "Blackboard",
      pictogram: "blackboard",
      css_id: "blackboard",
      link: "https://innsida.ntnu.no/blackboard",
      description:
        "Kanskje den viktigste siden i hverdagen - forelesningsfoiler, øvings-oppgaver og beskjeder fra foreleserne legges her.",
    },
    {
      title: "Epost",
      pictogram: "email",
      css_id: "email",
      link: "https://outlook.office365.com/owa/?realm=ntnu.no#path=/mail",
      description:
        'Det forventes at du sjekker NTNU-mailen din jevnlig. Et tips er å videresende disse epostene til din private epostadresse - les hvordan <a href="https://innsida.ntnu.no/wiki/-/wiki/Norsk/Slik+bruker+du+webmail#section-Slik+bruker+du+webmail-Videresende" id="track-email-extra">her</a>.',
    },
    {
      title: "Timeplan",
      pictogram: "schedule",
      css_id: "schedule",
      link: "http://ntnu.1024.no/",
      description:
        "Denne kjekke tjenesten lager timeplanen din for deg, hvis du forteller den hvilke   emner du tar. Bruk gjerne NTNU brukernavnet ditt.",
    },
    {
      title: "Office 365",
      pictogram: "office",
      css_id: "office",
      link: "http://innsida.ntnu.no/o365",
      description:
        "Word, Excel og Powerpoint, både i online- og offline-utgave. Samarbeid om dokumenter, og nyt dine 100TB(!) lagringsplass.",
    },
    {
      title: "Studweb",
      pictogram: "studweb",
      css_id: "studweb",
      link: "https://fsweb.no/studentweb/index.jsf?inst=FSNTNU",
      description:
        "Meld deg på (og av) emner, godkjenn studieplan, betal semesteravgift, og finn ut hvor hardt du failet på eksamen.",
    },
    {
      title: "Mat",
      pictogram: "dinner",
      css_id: "dinner",
      link: "https://www.sit.no/mat",
      description: "Hva disker din lokale SIT-kantine opp med i dag?",
    },
    {
      title: "MazeMap",
      pictogram: "map",
      css_id: "map",
      link: "http://use.mazemap.com/?campuses=ntnu",
      description:
        "Hjelp, hvor er datasalen Sprokkit? Hva er dette «Kjelhuset» alle snakker om? MazeMap  viser vei!",
    },
    {
      title: "Book rom",
      pictogram: "romres",
      css_id: "romres",
      link: "https://tp.uio.no/ntnu/rombestilling/",
      description:
        'Reservér grupperom og auditorier et halvt år i forveien. Timeplaner for enkeltrom   finner du <a href="https://tp.uio.no/ntnu/timeplan/?type=room" id="track-romres-extra">her</a>.',
    },
    {
      title: "Programvare",
      pictogram: "software",
      css_id: "software",
      link: "https://software.ntnu.no",
      description:
        "Mange programmer er gratis tilgjengelig for NTNU-studenter. Trenger du Matlab, for eksempel? Endnote? Clue?",
    },
    {
      title: "Farm",
      pictogram: "farm",
      css_id: "farm",
      link: "https://farm.ntnu.no/",
      description:
        'Savner du Word? Farm gir deg tilgang til programmene, filene og nettsidene du ville hatt på en datasal. Kort innføring finner du <a href="https://innsida.ntnu.no/wiki/-/wiki/Norsk/Programfarm" id="track-farm-extra">her</a>.',
    },
    {
      title: "Karakterstat.",
      pictogram: "grades",
      css_id: "grades",
      link: "http://grades.no",
      description:
        "Karakterstatistikk for flere år bakover. Hvilke av emnene du tar i år er typiske strykemner?",
    },
    {
      title: "Trening",
      pictogram: "training",
      css_id: "training",
      link: "https://www.sit.no/trening/gruppe",
      description:
        "Meld deg på SITs mange gruppetimer her. Påmelding åpner kl 21:00 to dager før timene. Akkurat nok tid til å gro en tredagersstubb",
    },
  ],

  taglines: [
    //{
    //  tagline: 'Har du mobil? Er den smart? Last ned appen til <a href="https://itunes.apple.com/no/app/instabart/id903592925?mt=8" id="track-ios">iOS</a> og <a href="https://play.google.com/store/apps/details?id=com.mvn.instabart" id="track-android">Android</a>!'
    //},
    {
      tagline: "Kjekke NTNU-tjenester. Umiddel<strong>bart</strong>.",
    },
    {
      tagline: "Favoritt blant bartebyens studenter siden 1917!",
    },
    {
      tagline: "Hele NTNU samlet under én bart!",
    },
    {
      tagline: "Dekker alle dine behov som NTNU-student... bortsett fra kaffe",
    },
    {
      tagline: "La barten bane vei i NTNUs frodige IT-jungel!",
    },
    {
      tagline: "NTNUs IT-tjenester? Gotta know 'em all!",
    },
    {
      tagline: "Du och jag, NTNU. Du och jag...",
    },
    {
      tagline: "Alle lenkene du trenger... og et par til",
    },
    {
      tagline: "Bli itj fart utn bart!",
    },
  ],
};

var Schedule = {
  init: function () {
    if (this.supportsLocalStorage()) {
      if (this.firstTimeSetupCompleted()) {
        this.setScheduleLink();
      } else {
        $("#schedule a").click(Schedule.displaySettingsOnClick);
      }

      this.addSettingsButton();
      this.bindUIActions();
      // Fill in the remembered schedule name
      $("#schedule_name").val(localStorage["schedule_name"]);
    }
  },

  supportsLocalStorage: function () {
    return Modernizr.localstorage;
  },

  firstTimeSetupCompleted: function () {
    if (localStorage["schedule_clicked"] === undefined) {
      return false;
    } else {
      return JSON.parse(localStorage["schedule_clicked"]);
    }
  },

  setScheduleLink: function () {
    var scheduleName = localStorage["schedule_name"].toLowerCase();
    var scheduleURL = "http://ntnu.1024.no/" + scheduleName;
    $("#schedule a").prop("href", scheduleURL);
  },

  addSettingsButton: function () {
    var html = '<i id="schedule-settings-button" class="cogwheel"></i>';
    $("#schedule .front").append(html);
  },

  inputValid: function () {
    return $("#schedule_name").val() !== "";
  },

  saveAndRedirect: function (name) {
    localStorage["schedule_clicked"] = "true";
    localStorage["schedule_name"] = name;
    this.setScheduleLink();

    // Clicking the card takes you to the schedule instead of the settings
    $("#schedule a").unbind("click", Schedule.displaySettingsOnClick);
    Modal.hide("#schedule_settings");

    setTimeout(function () {
      document.location.href = $("#schedule a").prop("href");
    }, 100);
  },

  displaySettingsOnClick: function (e) {
    Modal.show("#schedule_settings");
    $("#schedule_name").removeClass("error");
    e.preventDefault();
  },

  bindUIActions: function () {
    // When 'cogwheel' icon is clicked, open the modal
    $("#schedule-settings-button").click(function () {
      Modal.show("#schedule_settings");
      $("#schedule_name").removeClass("error");
      // Fill in the remembered schedule name
      $("#schedule_name").val(localStorage["schedule_name"]);
    });

    // When 'no' button is clicked, forget schedule name and redirect
    $("#schedule-no-button").click(function () {
      Analytics.trackScheduleAnswerNo();
      Schedule.saveAndRedirect("");
    });

    // When 'yes' button is clicked, either save the
    // schedule name and redirect or display an error
    $("#schedule-yes-button").click(function () {
      if (Schedule.inputValid()) {
        Analytics.trackScheduleAnswerYes();
        var scheduleName = $("#schedule_name").val();
        Schedule.saveAndRedirect(scheduleName);
      } else {
        $("#schedule_name").addClass("error");
      }
    });

    // When 'enter' is pressed, remember schedule name and redirect
    $("#schedule_name").keypress(function (e) {
      if (e.which == 13) {
        e.preventDefault();
        if (Schedule.inputValid()) {
          Analytics.trackScheduleAnswerYes();
          var scheduleName = $("#schedule_name").val();
          Schedule.saveAndRedirect(scheduleName);
        } else {
          $("#schedule_name").addClass("error");
        }
      }
    });
  },
};
var Analytics = {
  init: function () {
    this.createEventTrackers();
    this.createScheduleEventTrackers();
  },

  // Helper method to normalEvent() and outBoundEvent()
  sendEvent: function (category, action) {
    try {
      _gaq.push(["_trackEvent", category, action]);
    } catch (err) {}
  },

  // Sends data to Analytics. The 'selector' parameter is optional
  normalEvent: function (category, action, selector) {
    if (selector === undefined) {
      Analytics.sendEvent(category, action);
    } else {
      $(selector).click(function () {
        Analytics.sendEvent(category, action);
      });
    }
  },

  // Sends data to Analytics and redirects (after a slight delay)
  outboundEvent: function (category, action, selector) {
    var eventTrigger = $(selector);

    eventTrigger.click(function (e) {
      // Send tracking information to Google Analytics
      Analytics.sendEvent(category, action);

      // If CTRL or CMD is pressed (to open the link in a new tab),
      // proceed using the browsers default action
      if (e.metaKey || e.ctrlKey) {
        return;
      }

      // Otherwise, stop the motherfucker
      e.preventDefault();

      // Small timeout to ensure that the event is tracked
      // before following the link
      setTimeout(function () {
        document.location.href = eventTrigger.prop("href");
      }, 100);
    });
  },

  createEventTrackers: function () {
    this.outboundEvent("Main Links", "Blackboard", "#blackboard .track-main");
    this.outboundEvent("Main Links", "Email", "#email .track-main");
    // For Schedule tracking, see createScheduleEventTrackers() below
    this.outboundEvent("Main Links", "Office 365", "#office .track-main");
    this.outboundEvent("Main Links", "StudentWeb", "#studweb .track-main");
    this.outboundEvent("Main Links", "SIT Dinner", "#dinner .track-main");
    this.outboundEvent("Main Links", "Campus Map", "#map .track-main");
    this.outboundEvent("Main Links", "Room Reservation", "#romres .track-main");
    this.outboundEvent(
      "Main Links",
      "Software Download",
      "#software .track-main"
    );
    this.outboundEvent("Main Links", "Software Farm", "#farm .track-main");
    this.outboundEvent(
      "Main Links",
      "Grade Statistics (grades.no)",
      "#grades .track-main"
    );
    this.outboundEvent("Main Links", "Training", "#training .track-main");

    // this.normalEvent('Card Flips', 'Itslearning', '#itslearning .flip-open');
    this.normalEvent("Card Flips", "Blackboard", "#blackboard .flip-open");
    this.normalEvent("Card Flips", "Email", "#email .flip-open");
    this.normalEvent("Card Flips", "Schedule", "#schedule .flip-open");
    this.normalEvent("Card Flips", "Office 365", "#office .flip-open");
    this.normalEvent("Card Flips", "StudentWeb", "#studweb .flip-open");
    this.normalEvent("Card Flips", "SIT Dinner", "#dinner .flip-open");
    this.normalEvent("Card Flips", "Campus Map", "#map .flip-open");
    this.normalEvent("Card Flips", "Room Reservation", "#romres .flip-open");
    this.normalEvent("Card Flips", "Software Download", "#software .flip-open");
    this.normalEvent("Card Flips", "Software Farm", "#farm .flip-open");
    this.normalEvent(
      "Card Flips",
      "Grade Statistics (grades.no)",
      "#grades .flip-open"
    );
    this.normalEvent("Card Flips", "Training", "#training .flip-open");

    this.normalEvent("Modal", "Show Modal", "#about-button");
    this.outboundEvent("Modal", "Send Email to Instabart", "#track-email");
    this.outboundEvent("Modal", "Follow on Twitter", "#track-twitter");
    this.outboundEvent("Modal", "Fork on Github", "#track-github");
    this.outboundEvent("Modal", "Online Notifier", "#notifier");
    this.outboundEvent("Modal", "Bartebuss", "#bartebuss");
    this.outboundEvent("Modal", "iBok", "#track-ibok");
    this.outboundEvent("Modal", "FileSender", "#track-filesender");
    this.outboundEvent("Modal", "IT Help", "#track-ithelp");
    this.outboundEvent("Modal", "Kundesenteret", "#track-kundesenteret");
    this.outboundEvent("Modal", "Video Lectures", "#track-videoforelesninger");
    this.outboundEvent("Modal", "jQuery (built with)", "#track-jquery");
    this.outboundEvent("Modal", "Modernizr (built with)", "#track-modernizr");
    this.outboundEvent("Modal", "Sass (built with)", "#track-sass");
    this.outboundEvent("Modal", "Entypo (built with)", "#track-entypo");
    this.outboundEvent("Modal", "Lean Modal (built with)", "#track-leanmodal");
    this.outboundEvent("Modal", "Handlebars (built with)", "#track-handlebars");
    this.outboundEvent("Modal", "Normalize (built with)", "#track-normalize");
    this.outboundEvent("Modal", "Icomoon (built with)", "#track-icomoon");
    this.outboundEvent("Modal", "Glyphicons (built with)", "#track-glyphicons");
    this.outboundEvent("Modal", "Visual Basic (built with)", "#track-vb");

    this.outboundEvent("Other Links", "mvn.no", "#track-mvn");
    this.outboundEvent(
      "Other Links",
      "Download app (Android)",
      "#track-android"
    );
    this.outboundEvent("Other Links", "Download app (iOS)", "#track-ios");
    this.outboundEvent(
      "Other Links",
      "https://innsida.ntnu.no/wiki/-/wiki/Norsk/Programfarm",
      "#track-farm-extra"
    );
    this.outboundEvent(
      "Other Links",
      "http://www.ntnu.no/studieinformasjon/rom/",
      "#track-romres-extra"
    );
    this.outboundEvent(
      "Other Links",
      "https://innsida.ntnu.no/wiki/-/wiki/Norsk/Slik+bruker+du+webmail#section-Slik+bruker+du+webmail-Videresende+epost+til+andre+kontoer",
      "#track-email-extra"
    );
  },

  createScheduleEventTrackers: function () {
    if (
      Schedule.supportsLocalStorage() &&
      !Schedule.firstTimeSetupCompleted()
    ) {
      this.normalEvent(
        "Schedule Settings",
        "Show Settings (first time)",
        "#schedule .track-main"
      );
    } else {
      this.outboundEvent("Main Links", "Schedule", "#schedule .track-main");
    }

    if (Schedule.firstTimeSetupCompleted()) {
      this.normalEvent(
        "Schedule Settings",
        "Show Settings",
        "#schedule-settings-button"
      );
    } else {
      this.normalEvent(
        "Schedule Settings",
        "Show Settings (first time)",
        "#schedule-settings-button"
      );
    }
  },

  // trackScheduleAnswerYes/No is called from 'schedule.js'
  trackScheduleAnswerYes: function () {
    this.normalEvent("Schedule Settings", "Yes (remember schedule)");
  },

  trackScheduleAnswerNo: function () {
    this.normalEvent("Schedule Settings", "No (don't remember schedule)");
  },

  trackAppActivation: function () {
    if (
      Schedule.supportsLocalStorage() &&
      localStorage["app_activated"] === undefined
    ) {
      this.normalEvent("Activations", device.platform);
      localStorage["app_activated"] = "true";
    }
  },
};

var Header = {
  init: function () {
    this.createTagline();
    this.bindUIActions();
  },

  createTagline: function () {
    var template = Handlebars.templates["tagline"];
    var random_tagline = Header.randomTagline(data.taglines);
    var html = template(random_tagline);
    $("#tagline").append(html);
  },

  randomTagline: function (taglines) {
    var random_id = Math.floor(Math.random() * taglines.length);
    return taglines[random_id];
  },

  bindUIActions: function () {
    // Display modal when the question button is clicked
    $("#about-button").leanModal({
      top: 0,
      overlay: 0.7,
      closeButton: ".modal_close",
    });
  },
};
/*
  ALERT EXAMPLE (First element in #grid):
  <div class="alert">
      <img class="alert-icon" src="img/alert-scissor.svg" alt="Champagne til alle!">
    <i class="close"></i>
    <h3>Høstbarbering 2014</h3>
    <p>Vi har trimmet vekk en del lenker, og fire nye har grodd fram i stedet! De gamle finner du bak <i class="question alert-inline-icon"></i>-knappen øverst til høyre.</p>
    <div style="clear:both;"></div>
  </div> -->
*/

Alerts = {
  init: function () {
    if (Schedule.supportsLocalStorage()) {
      if (this.shouldAlertBeDisplayed()) {
        this.displayAlert();
      }
    }
  },

  shouldAlertBeDisplayed: function () {
    if (localStorage["office365_alert_closed"] === undefined) {
      return true;
    } else {
      return !JSON.parse(localStorage["office365_alert_closed"]);
    }
  },

  displayAlert: function () {
    $(".alert").show();
    $("#grid").addClass("alert-padding");
    Alerts.bindCloseButton();
  },

  bindCloseButton: function () {
    $(".alert .close").click(function () {
      localStorage["office365_alert_closed"] = "true";
      $(".alert").fadeOut(function () {
        $("#grid").removeClass("alert-padding");
      });
    });
  },
};
var Links = {
  init: function () {
    this.router();
  },

  router: function () {
    var cardUrl = this.getCardLink(this.parseHashUrl());
    if (window.location.hash && cardUrl) this.redirect(cardUrl);
  },

  redirect: function (link) {
    window.location.href = link;
  },

  parseHashUrl: function () {
    return window.location.hash.substr(1);
  },

  getCardLink: function (index) {
    if (data.cards[index - 1] !== undefined) return data.cards[index - 1].link;
    else return false;
  },
};

var Hotkeys = function () {
  var keypress = function (event) {
    var cardUrl = getCardLink(extractKey(event));
    if (cardUrl !== false) window.location.href = cardUrl;
  };

  var getCardLink = function (index) {
    if (data.cards[index - 1] !== undefined) return data.cards[index - 1].link;
    else return false;
  };

  var extractKey = function (event) {
    var keyCode = event.keyCode || event.which;

    if (keyCode > 48 && keyCode < 58) /* 1-9 */ return keyCode - 48;
    else if (keyCode === 48) /*  0  */ return 10;
    else if (keyCode === 81) /*  q  */ return 11;
    else if (keyCode === 87) /*  w  */ return 12;
    else return false;
  };

  $(document).keydown(keypress);
};

(function () {
  function init() {
    Card.init();
    Schedule.init();
    Header.init();
    Analytics.init();
    Alerts.init();
    Links.init();
    new Hotkeys();
  }

  init();
})();
