// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiateAsync, __instantiate;

(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };

  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }

  __instantiateAsync = async (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExpA(m);
  };

  __instantiate = (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExp(m);
  };
})();

var __decorate = (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3
        ? target
        : desc === null
        ? desc = Object.getOwnPropertyDescriptor(target, key)
        : desc,
      d;
    if (
      typeof Reflect === "object" && typeof Reflect.decorate === "function"
    ) {
      r = Reflect.decorate(decorators, target, key, desc);
    } else {
      for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) {
          r = (c < 3
            ? d(r)
            : c > 3
            ? d(target, key, r)
            : d(target, key)) || r;
        }
      }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __param = (this && this.__param) || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
System.register(
  "https://deno.land/x/alosaur/src/http-error/HttpError",
  [],
  function (exports_1, context_1) {
    "use strict";
    var HttpError;
    var __moduleName = context_1 && context_1.id;
    return {
      setters: [],
      execute: function () {
        /**
             * Used to throw HTTP errors.
             * Just do throw new HttpError(code, message) in your controller action and
             * default error handler will catch it and give in your response given code and message .
             */
        HttpError = class HttpError extends Error {
          constructor(httpCode, message) {
            super();
            this.httpCode = undefined;
            Object.setPrototypeOf(this, HttpError.prototype);
            if (httpCode) {
              this.httpCode = httpCode;
            }
            if (message) {
              this.message = message;
            }
            this.stack = new Error().stack;
          }
        };
        exports_1("HttpError", HttpError);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/http-error/InternalServerError",
  ["https://deno.land/x/alosaur/src/http-error/HttpError"],
  function (exports_2, context_2) {
    "use strict";
    var HttpError_ts_1, InternalServerError;
    var __moduleName = context_2 && context_2.id;
    return {
      setters: [
        function (HttpError_ts_1_1) {
          HttpError_ts_1 = HttpError_ts_1_1;
        },
      ],
      execute: function () {
        /**
             * Exception for 500 HTTP error.
             */
        InternalServerError = class InternalServerError
          extends HttpError_ts_1.HttpError {
          constructor(message) {
            super(500);
            this.name = "InternalServerError";
            Object.setPrototypeOf(this, InternalServerError.prototype);
            if (message) {
              this.message = message;
            }
          }
        };
        exports_2("InternalServerError", InternalServerError);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/http-error/BadRequestError",
  ["https://deno.land/x/alosaur/src/http-error/HttpError"],
  function (exports_3, context_3) {
    "use strict";
    var HttpError_ts_2, BadRequestError;
    var __moduleName = context_3 && context_3.id;
    return {
      setters: [
        function (HttpError_ts_2_1) {
          HttpError_ts_2 = HttpError_ts_2_1;
        },
      ],
      execute: function () {
        /**
             * Exception for 400 HTTP error.
             */
        BadRequestError = class BadRequestError
          extends HttpError_ts_2.HttpError {
          constructor(message) {
            super(400);
            this.name = "BadRequestError";
            Object.setPrototypeOf(this, BadRequestError.prototype);
            if (message) {
              this.message = message;
            }
          }
        };
        exports_3("BadRequestError", BadRequestError);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/http-error/ForbiddenError",
  ["https://deno.land/x/alosaur/src/http-error/HttpError"],
  function (exports_4, context_4) {
    "use strict";
    var HttpError_ts_3, ForbiddenError;
    var __moduleName = context_4 && context_4.id;
    return {
      setters: [
        function (HttpError_ts_3_1) {
          HttpError_ts_3 = HttpError_ts_3_1;
        },
      ],
      execute: function () {
        /**
             * Exception for 403 HTTP error.
             */
        ForbiddenError = class ForbiddenError extends HttpError_ts_3.HttpError {
          constructor(message) {
            super(403);
            this.name = "ForbiddenError";
            Object.setPrototypeOf(this, ForbiddenError.prototype);
            if (message) {
              this.message = message;
            }
          }
        };
        exports_4("ForbiddenError", ForbiddenError);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/http-error/NotAcceptableError",
  ["https://deno.land/x/alosaur/src/http-error/HttpError"],
  function (exports_5, context_5) {
    "use strict";
    var HttpError_ts_4, NotAcceptableError;
    var __moduleName = context_5 && context_5.id;
    return {
      setters: [
        function (HttpError_ts_4_1) {
          HttpError_ts_4 = HttpError_ts_4_1;
        },
      ],
      execute: function () {
        /**
             * Exception for 406 HTTP error.
             */
        NotAcceptableError = class NotAcceptableError
          extends HttpError_ts_4.HttpError {
          constructor(message) {
            super(406);
            this.name = "NotAcceptableError";
            Object.setPrototypeOf(this, NotAcceptableError.prototype);
            if (message) {
              this.message = message;
            }
          }
        };
        exports_5("NotAcceptableError", NotAcceptableError);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/http-error/MethodNotAllowedError",
  ["https://deno.land/x/alosaur/src/http-error/HttpError"],
  function (exports_6, context_6) {
    "use strict";
    var HttpError_ts_5, MethodNotAllowedError;
    var __moduleName = context_6 && context_6.id;
    return {
      setters: [
        function (HttpError_ts_5_1) {
          HttpError_ts_5 = HttpError_ts_5_1;
        },
      ],
      execute: function () {
        /**
             * Exception for todo HTTP error.
             */
        MethodNotAllowedError = class MethodNotAllowedError
          extends HttpError_ts_5.HttpError {
          constructor(message) {
            super(405);
            this.name = "MethodNotAllowedError";
            Object.setPrototypeOf(this, MethodNotAllowedError.prototype);
            if (message) {
              this.message = message;
            }
          }
        };
        exports_6("MethodNotAllowedError", MethodNotAllowedError);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/http-error/NotFoundError",
  ["https://deno.land/x/alosaur/src/http-error/HttpError"],
  function (exports_7, context_7) {
    "use strict";
    var HttpError_ts_6, NotFoundError;
    var __moduleName = context_7 && context_7.id;
    return {
      setters: [
        function (HttpError_ts_6_1) {
          HttpError_ts_6 = HttpError_ts_6_1;
        },
      ],
      execute: function () {
        /**
             * Exception for 404 HTTP error.
             */
        NotFoundError = class NotFoundError extends HttpError_ts_6.HttpError {
          constructor(message) {
            super(404);
            this.name = "NotFoundError";
            Object.setPrototypeOf(this, NotFoundError.prototype);
            if (message) {
              this.message = message;
            }
          }
        };
        exports_7("NotFoundError", NotFoundError);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/http-error/UnauthorizedError",
  ["https://deno.land/x/alosaur/src/http-error/HttpError"],
  function (exports_8, context_8) {
    "use strict";
    var HttpError_ts_7, UnauthorizedError;
    var __moduleName = context_8 && context_8.id;
    return {
      setters: [
        function (HttpError_ts_7_1) {
          HttpError_ts_7 = HttpError_ts_7_1;
        },
      ],
      execute: function () {
        /**
             * Exception for 401 HTTP error.
             */
        UnauthorizedError = class UnauthorizedError
          extends HttpError_ts_7.HttpError {
          constructor(message) {
            super(401);
            this.name = "UnauthorizedError";
            Object.setPrototypeOf(this, UnauthorizedError.prototype);
            if (message) {
              this.message = message;
            }
          }
        };
        exports_8("UnauthorizedError", UnauthorizedError);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/http-error/mod",
  [
    "https://deno.land/x/alosaur/src/http-error/HttpError",
    "https://deno.land/x/alosaur/src/http-error/InternalServerError",
    "https://deno.land/x/alosaur/src/http-error/BadRequestError",
    "https://deno.land/x/alosaur/src/http-error/ForbiddenError",
    "https://deno.land/x/alosaur/src/http-error/NotAcceptableError",
    "https://deno.land/x/alosaur/src/http-error/MethodNotAllowedError",
    "https://deno.land/x/alosaur/src/http-error/NotFoundError",
    "https://deno.land/x/alosaur/src/http-error/UnauthorizedError",
  ],
  function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    function exportStar_1(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default") exports[n] = m[n];
      }
      exports_9(exports);
    }
    return {
      setters: [
        function (HttpError_ts_8_1) {
          exportStar_1(HttpError_ts_8_1);
        },
        function (InternalServerError_ts_1_1) {
          exportStar_1(InternalServerError_ts_1_1);
        },
        function (BadRequestError_ts_1_1) {
          exportStar_1(BadRequestError_ts_1_1);
        },
        function (ForbiddenError_ts_1_1) {
          exportStar_1(ForbiddenError_ts_1_1);
        },
        function (NotAcceptableError_ts_1_1) {
          exportStar_1(NotAcceptableError_ts_1_1);
        },
        function (MethodNotAllowedError_ts_1_1) {
          exportStar_1(MethodNotAllowedError_ts_1_1);
        },
        function (NotFoundError_ts_1_1) {
          exportStar_1(NotFoundError_ts_1_1);
        },
        function (UnauthorizedError_ts_1_1) {
          exportStar_1(UnauthorizedError_ts_1_1);
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/encoding/utf8",
  [],
  function (exports_10, context_10) {
    "use strict";
    var encoder, decoder;
    var __moduleName = context_10 && context_10.id;
    /** Shorthand for new TextEncoder().encode() */
    function encode(input) {
      return encoder.encode(input);
    }
    exports_10("encode", encode);
    /** Shorthand for new TextDecoder().decode() */
    function decode(input) {
      return decoder.decode(input);
    }
    exports_10("decode", decode);
    return {
      setters: [],
      execute: function () {
        /** A default TextEncoder instance */
        exports_10("encoder", encoder = new TextEncoder());
        /** A default TextDecoder instance */
        exports_10("decoder", decoder = new TextDecoder());
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
/** This module is browser compatible. */
System.register(
  "https://deno.land/std@0.56.0/path/_constants",
  [],
  function (exports_11, context_11) {
    "use strict";
    var CHAR_UPPERCASE_A,
      CHAR_LOWERCASE_A,
      CHAR_UPPERCASE_Z,
      CHAR_LOWERCASE_Z,
      CHAR_DOT,
      CHAR_FORWARD_SLASH,
      CHAR_BACKWARD_SLASH,
      CHAR_VERTICAL_LINE,
      CHAR_COLON,
      CHAR_QUESTION_MARK,
      CHAR_UNDERSCORE,
      CHAR_LINE_FEED,
      CHAR_CARRIAGE_RETURN,
      CHAR_TAB,
      CHAR_FORM_FEED,
      CHAR_EXCLAMATION_MARK,
      CHAR_HASH,
      CHAR_SPACE,
      CHAR_NO_BREAK_SPACE,
      CHAR_ZERO_WIDTH_NOBREAK_SPACE,
      CHAR_LEFT_SQUARE_BRACKET,
      CHAR_RIGHT_SQUARE_BRACKET,
      CHAR_LEFT_ANGLE_BRACKET,
      CHAR_RIGHT_ANGLE_BRACKET,
      CHAR_LEFT_CURLY_BRACKET,
      CHAR_RIGHT_CURLY_BRACKET,
      CHAR_HYPHEN_MINUS,
      CHAR_PLUS,
      CHAR_DOUBLE_QUOTE,
      CHAR_SINGLE_QUOTE,
      CHAR_PERCENT,
      CHAR_SEMICOLON,
      CHAR_CIRCUMFLEX_ACCENT,
      CHAR_GRAVE_ACCENT,
      CHAR_AT,
      CHAR_AMPERSAND,
      CHAR_EQUAL,
      CHAR_0,
      CHAR_9,
      navigator,
      isWindows;
    var __moduleName = context_11 && context_11.id;
    return {
      setters: [],
      execute: function () {
        // Alphabet chars.
        exports_11("CHAR_UPPERCASE_A", CHAR_UPPERCASE_A = 65); /* A */
        exports_11("CHAR_LOWERCASE_A", CHAR_LOWERCASE_A = 97); /* a */
        exports_11("CHAR_UPPERCASE_Z", CHAR_UPPERCASE_Z = 90); /* Z */
        exports_11("CHAR_LOWERCASE_Z", CHAR_LOWERCASE_Z = 122); /* z */
        // Non-alphabetic chars.
        exports_11("CHAR_DOT", CHAR_DOT = 46); /* . */
        exports_11("CHAR_FORWARD_SLASH", CHAR_FORWARD_SLASH = 47); /* / */
        exports_11("CHAR_BACKWARD_SLASH", CHAR_BACKWARD_SLASH = 92); /* \ */
        exports_11("CHAR_VERTICAL_LINE", CHAR_VERTICAL_LINE = 124); /* | */
        exports_11("CHAR_COLON", CHAR_COLON = 58); /* : */
        exports_11("CHAR_QUESTION_MARK", CHAR_QUESTION_MARK = 63); /* ? */
        exports_11("CHAR_UNDERSCORE", CHAR_UNDERSCORE = 95); /* _ */
        exports_11("CHAR_LINE_FEED", CHAR_LINE_FEED = 10); /* \n */
        exports_11("CHAR_CARRIAGE_RETURN", CHAR_CARRIAGE_RETURN = 13); /* \r */
        exports_11("CHAR_TAB", CHAR_TAB = 9); /* \t */
        exports_11("CHAR_FORM_FEED", CHAR_FORM_FEED = 12); /* \f */
        exports_11("CHAR_EXCLAMATION_MARK", CHAR_EXCLAMATION_MARK = 33); /* ! */
        exports_11("CHAR_HASH", CHAR_HASH = 35); /* # */
        exports_11("CHAR_SPACE", CHAR_SPACE = 32); /*   */
        exports_11(
          "CHAR_NO_BREAK_SPACE",
          CHAR_NO_BREAK_SPACE = 160,
        ); /* \u00A0 */
        exports_11(
          "CHAR_ZERO_WIDTH_NOBREAK_SPACE",
          CHAR_ZERO_WIDTH_NOBREAK_SPACE = 65279,
        ); /* \uFEFF */
        exports_11(
          "CHAR_LEFT_SQUARE_BRACKET",
          CHAR_LEFT_SQUARE_BRACKET = 91,
        ); /* [ */
        exports_11(
          "CHAR_RIGHT_SQUARE_BRACKET",
          CHAR_RIGHT_SQUARE_BRACKET = 93,
        ); /* ] */
        exports_11(
          "CHAR_LEFT_ANGLE_BRACKET",
          CHAR_LEFT_ANGLE_BRACKET = 60,
        ); /* < */
        exports_11(
          "CHAR_RIGHT_ANGLE_BRACKET",
          CHAR_RIGHT_ANGLE_BRACKET = 62,
        ); /* > */
        exports_11(
          "CHAR_LEFT_CURLY_BRACKET",
          CHAR_LEFT_CURLY_BRACKET = 123,
        ); /* { */
        exports_11(
          "CHAR_RIGHT_CURLY_BRACKET",
          CHAR_RIGHT_CURLY_BRACKET = 125,
        ); /* } */
        exports_11("CHAR_HYPHEN_MINUS", CHAR_HYPHEN_MINUS = 45); /* - */
        exports_11("CHAR_PLUS", CHAR_PLUS = 43); /* + */
        exports_11("CHAR_DOUBLE_QUOTE", CHAR_DOUBLE_QUOTE = 34); /* " */
        exports_11("CHAR_SINGLE_QUOTE", CHAR_SINGLE_QUOTE = 39); /* ' */
        exports_11("CHAR_PERCENT", CHAR_PERCENT = 37); /* % */
        exports_11("CHAR_SEMICOLON", CHAR_SEMICOLON = 59); /* ; */
        exports_11(
          "CHAR_CIRCUMFLEX_ACCENT",
          CHAR_CIRCUMFLEX_ACCENT = 94,
        ); /* ^ */
        exports_11("CHAR_GRAVE_ACCENT", CHAR_GRAVE_ACCENT = 96); /* ` */
        exports_11("CHAR_AT", CHAR_AT = 64); /* @ */
        exports_11("CHAR_AMPERSAND", CHAR_AMPERSAND = 38); /* & */
        exports_11("CHAR_EQUAL", CHAR_EQUAL = 61); /* = */
        // Digits
        exports_11("CHAR_0", CHAR_0 = 48); /* 0 */
        exports_11("CHAR_9", CHAR_9 = 57); /* 9 */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigator = globalThis.navigator;
        isWindows = false;
        exports_11("isWindows", isWindows);
        if (globalThis.Deno != null) {
          exports_11("isWindows", isWindows = Deno.build.os == "windows");
        } else if (navigator?.appVersion != null) {
          exports_11(
            "isWindows",
            isWindows = navigator.appVersion.includes("Win"),
          );
        }
      },
    };
  },
);
/** This module is browser compatible. */
System.register(
  "https://deno.land/std@0.56.0/path/_interface",
  [],
  function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
/** This module is browser compatible. */
System.register(
  "https://deno.land/std@0.56.0/path/_util",
  ["https://deno.land/std@0.56.0/path/_constants"],
  function (exports_13, context_13) {
    "use strict";
    var _constants_ts_1;
    var __moduleName = context_13 && context_13.id;
    function assertPath(path) {
      if (typeof path !== "string") {
        throw new TypeError(
          `Path must be a string. Received ${JSON.stringify(path)}`,
        );
      }
    }
    exports_13("assertPath", assertPath);
    function isPosixPathSeparator(code) {
      return code === _constants_ts_1.CHAR_FORWARD_SLASH;
    }
    exports_13("isPosixPathSeparator", isPosixPathSeparator);
    function isPathSeparator(code) {
      return isPosixPathSeparator(code) ||
        code === _constants_ts_1.CHAR_BACKWARD_SLASH;
    }
    exports_13("isPathSeparator", isPathSeparator);
    function isWindowsDeviceRoot(code) {
      return ((code >= _constants_ts_1.CHAR_LOWERCASE_A &&
        code <= _constants_ts_1.CHAR_LOWERCASE_Z) ||
        (code >= _constants_ts_1.CHAR_UPPERCASE_A &&
          code <= _constants_ts_1.CHAR_UPPERCASE_Z));
    }
    exports_13("isWindowsDeviceRoot", isWindowsDeviceRoot);
    // Resolves . and .. elements in a path with directory names
    function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
      let res = "";
      let lastSegmentLength = 0;
      let lastSlash = -1;
      let dots = 0;
      let code;
      for (let i = 0, len = path.length; i <= len; ++i) {
        if (i < len) {
          code = path.charCodeAt(i);
        } else if (isPathSeparator(code)) {
          break;
        } else {
          code = _constants_ts_1.CHAR_FORWARD_SLASH;
        }
        if (isPathSeparator(code)) {
          if (lastSlash === i - 1 || dots === 1) {
            // NOOP
          } else if (lastSlash !== i - 1 && dots === 2) {
            if (
              res.length < 2 ||
              lastSegmentLength !== 2 ||
              res.charCodeAt(res.length - 1) !== _constants_ts_1.CHAR_DOT ||
              res.charCodeAt(res.length - 2) !== _constants_ts_1.CHAR_DOT
            ) {
              if (res.length > 2) {
                const lastSlashIndex = res.lastIndexOf(separator);
                if (lastSlashIndex === -1) {
                  res = "";
                  lastSegmentLength = 0;
                } else {
                  res = res.slice(0, lastSlashIndex);
                  lastSegmentLength = res.length - 1 -
                    res.lastIndexOf(separator);
                }
                lastSlash = i;
                dots = 0;
                continue;
              } else if (res.length === 2 || res.length === 1) {
                res = "";
                lastSegmentLength = 0;
                lastSlash = i;
                dots = 0;
                continue;
              }
            }
            if (allowAboveRoot) {
              if (res.length > 0) {
                res += `${separator}..`;
              } else {
                res = "..";
              }
              lastSegmentLength = 2;
            }
          } else {
            if (res.length > 0) {
              res += separator + path.slice(lastSlash + 1, i);
            } else {
              res = path.slice(lastSlash + 1, i);
            }
            lastSegmentLength = i - lastSlash - 1;
          }
          lastSlash = i;
          dots = 0;
        } else if (code === _constants_ts_1.CHAR_DOT && dots !== -1) {
          ++dots;
        } else {
          dots = -1;
        }
      }
      return res;
    }
    exports_13("normalizeString", normalizeString);
    function _format(sep, pathObject) {
      const dir = pathObject.dir || pathObject.root;
      const base = pathObject.base ||
        (pathObject.name || "") + (pathObject.ext || "");
      if (!dir) {
        return base;
      }
      if (dir === pathObject.root) {
        return dir + base;
      }
      return dir + sep + base;
    }
    exports_13("_format", _format);
    return {
      setters: [
        function (_constants_ts_1_1) {
          _constants_ts_1 = _constants_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/** A module to print ANSI terminal colors. Inspired by chalk, kleur, and colors
 * on npm.
 *
 * ```
 * import { bgBlue, red, bold } from "https://deno.land/std/fmt/colors.ts";
 * console.log(bgBlue(red(bold("Hello world!"))));
 * ```
 *
 * This module supports `NO_COLOR` environmental variable disabling any coloring
 * if `NO_COLOR` is set.
 *
 * This module is browser compatible. */
System.register(
  "https://deno.land/std@0.56.0/fmt/colors",
  [],
  function (exports_14, context_14) {
    "use strict";
    var noColor, enabled, ANSI_PATTERN;
    var __moduleName = context_14 && context_14.id;
    function setColorEnabled(value) {
      if (noColor) {
        return;
      }
      enabled = value;
    }
    exports_14("setColorEnabled", setColorEnabled);
    function getColorEnabled() {
      return enabled;
    }
    exports_14("getColorEnabled", getColorEnabled);
    function code(open, close) {
      return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
      };
    }
    function run(str, code) {
      return enabled
        ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
        : str;
    }
    function reset(str) {
      return run(str, code([0], 0));
    }
    exports_14("reset", reset);
    function bold(str) {
      return run(str, code([1], 22));
    }
    exports_14("bold", bold);
    function dim(str) {
      return run(str, code([2], 22));
    }
    exports_14("dim", dim);
    function italic(str) {
      return run(str, code([3], 23));
    }
    exports_14("italic", italic);
    function underline(str) {
      return run(str, code([4], 24));
    }
    exports_14("underline", underline);
    function inverse(str) {
      return run(str, code([7], 27));
    }
    exports_14("inverse", inverse);
    function hidden(str) {
      return run(str, code([8], 28));
    }
    exports_14("hidden", hidden);
    function strikethrough(str) {
      return run(str, code([9], 29));
    }
    exports_14("strikethrough", strikethrough);
    function black(str) {
      return run(str, code([30], 39));
    }
    exports_14("black", black);
    function red(str) {
      return run(str, code([31], 39));
    }
    exports_14("red", red);
    function green(str) {
      return run(str, code([32], 39));
    }
    exports_14("green", green);
    function yellow(str) {
      return run(str, code([33], 39));
    }
    exports_14("yellow", yellow);
    function blue(str) {
      return run(str, code([34], 39));
    }
    exports_14("blue", blue);
    function magenta(str) {
      return run(str, code([35], 39));
    }
    exports_14("magenta", magenta);
    function cyan(str) {
      return run(str, code([36], 39));
    }
    exports_14("cyan", cyan);
    function white(str) {
      return run(str, code([37], 39));
    }
    exports_14("white", white);
    function gray(str) {
      return run(str, code([90], 39));
    }
    exports_14("gray", gray);
    function bgBlack(str) {
      return run(str, code([40], 49));
    }
    exports_14("bgBlack", bgBlack);
    function bgRed(str) {
      return run(str, code([41], 49));
    }
    exports_14("bgRed", bgRed);
    function bgGreen(str) {
      return run(str, code([42], 49));
    }
    exports_14("bgGreen", bgGreen);
    function bgYellow(str) {
      return run(str, code([43], 49));
    }
    exports_14("bgYellow", bgYellow);
    function bgBlue(str) {
      return run(str, code([44], 49));
    }
    exports_14("bgBlue", bgBlue);
    function bgMagenta(str) {
      return run(str, code([45], 49));
    }
    exports_14("bgMagenta", bgMagenta);
    function bgCyan(str) {
      return run(str, code([46], 49));
    }
    exports_14("bgCyan", bgCyan);
    function bgWhite(str) {
      return run(str, code([47], 49));
    }
    exports_14("bgWhite", bgWhite);
    /* Special Color Sequences */
    function clampAndTruncate(n, max = 255, min = 0) {
      return Math.trunc(Math.max(Math.min(n, max), min));
    }
    /** Set text color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit */
    function rgb8(str, color) {
      return run(str, code([38, 5, clampAndTruncate(color)], 39));
    }
    exports_14("rgb8", rgb8);
    /** Set background color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit */
    function bgRgb8(str, color) {
      return run(str, code([48, 5, clampAndTruncate(color)], 49));
    }
    exports_14("bgRgb8", bgRgb8);
    /** Set text color using 24bit rgb.
     * `color` can be a number in range `0x000000` to `0xffffff` or
     * an `Rgb`.
     *
     * To produce the color magenta:
     *
     *      rgba24("foo", 0xff00ff);
     *      rgba24("foo", {r: 255, g: 0, b: 255});
     */
    function rgb24(str, color) {
      if (typeof color === "number") {
        return run(
          str,
          code(
            [38, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff],
            39,
          ),
        );
      }
      return run(
        str,
        code([
          38,
          2,
          clampAndTruncate(color.r),
          clampAndTruncate(color.g),
          clampAndTruncate(color.b),
        ], 39),
      );
    }
    exports_14("rgb24", rgb24);
    /** Set background color using 24bit rgb.
     * `color` can be a number in range `0x000000` to `0xffffff` or
     * an `Rgb`.
     *
     * To produce the color magenta:
     *
     *      bgRgba24("foo", 0xff00ff);
     *      bgRgba24("foo", {r: 255, g: 0, b: 255});
     */
    function bgRgb24(str, color) {
      if (typeof color === "number") {
        return run(
          str,
          code(
            [48, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff],
            49,
          ),
        );
      }
      return run(
        str,
        code([
          48,
          2,
          clampAndTruncate(color.r),
          clampAndTruncate(color.g),
          clampAndTruncate(color.b),
        ], 49),
      );
    }
    exports_14("bgRgb24", bgRgb24);
    function stripColor(string) {
      return string.replace(ANSI_PATTERN, "");
    }
    exports_14("stripColor", stripColor);
    return {
      setters: [],
      execute: function () {
        noColor = globalThis.Deno?.noColor ?? true;
        enabled = !noColor;
        // https://github.com/chalk/ansi-regex/blob/2b56fb0c7a07108e5b54241e8faec160d393aedb/index.js
        ANSI_PATTERN = new RegExp(
          [
            "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
            "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
          ].join("|"),
          "g",
        );
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/** This module is browser compatible. */
System.register(
  "https://deno.land/std@0.56.0/testing/diff",
  [],
  function (exports_15, context_15) {
    "use strict";
    var DiffType, REMOVED, COMMON, ADDED;
    var __moduleName = context_15 && context_15.id;
    function createCommon(A, B, reverse) {
      const common = [];
      if (A.length === 0 || B.length === 0) {
        return [];
      }
      for (let i = 0; i < Math.min(A.length, B.length); i += 1) {
        if (
          A[reverse ? A.length - i - 1 : i] ===
            B[reverse ? B.length - i - 1 : i]
        ) {
          common.push(A[reverse ? A.length - i - 1 : i]);
        } else {
          return common;
        }
      }
      return common;
    }
    function diff(A, B) {
      const prefixCommon = createCommon(A, B);
      const suffixCommon = createCommon(
        A.slice(prefixCommon.length),
        B.slice(prefixCommon.length),
        true,
      ).reverse();
      A = suffixCommon.length
        ? A.slice(prefixCommon.length, -suffixCommon.length)
        : A.slice(prefixCommon.length);
      B = suffixCommon.length
        ? B.slice(prefixCommon.length, -suffixCommon.length)
        : B.slice(prefixCommon.length);
      const swapped = B.length > A.length;
      [A, B] = swapped ? [B, A] : [A, B];
      const M = A.length;
      const N = B.length;
      if (!M && !N && !suffixCommon.length && !prefixCommon.length) {
        return [];
      }
      if (!N) {
        return [
          ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
          ...A.map((a) => ({
            type: swapped ? DiffType.added : DiffType.removed,
            value: a,
          })),
          ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
        ];
      }
      const offset = N;
      const delta = M - N;
      const size = M + N + 1;
      const fp = new Array(size).fill({ y: -1 });
      /**
         * INFO:
         * This buffer is used to save memory and improve performance.
         * The first half is used to save route and last half is used to save diff
         * type.
         * This is because, when I kept new uint8array area to save type,performance
         * worsened.
         */
      const routes = new Uint32Array((M * N + size + 1) * 2);
      const diffTypesPtrOffset = routes.length / 2;
      let ptr = 0;
      let p = -1;
      function backTrace(A, B, current, swapped) {
        const M = A.length;
        const N = B.length;
        const result = [];
        let a = M - 1;
        let b = N - 1;
        let j = routes[current.id];
        let type = routes[current.id + diffTypesPtrOffset];
        while (true) {
          if (!j && !type) {
            break;
          }
          const prev = j;
          if (type === REMOVED) {
            result.unshift({
              type: swapped ? DiffType.removed : DiffType.added,
              value: B[b],
            });
            b -= 1;
          } else if (type === ADDED) {
            result.unshift({
              type: swapped ? DiffType.added : DiffType.removed,
              value: A[a],
            });
            a -= 1;
          } else {
            result.unshift({ type: DiffType.common, value: A[a] });
            a -= 1;
            b -= 1;
          }
          j = routes[prev];
          type = routes[prev + diffTypesPtrOffset];
        }
        return result;
      }
      function createFP(slide, down, k, M) {
        if (slide && slide.y === -1 && down && down.y === -1) {
          return { y: 0, id: 0 };
        }
        if (
          (down && down.y === -1) ||
          k === M ||
          (slide && slide.y) > (down && down.y) + 1
        ) {
          const prev = slide.id;
          ptr++;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = ADDED;
          return { y: slide.y, id: ptr };
        } else {
          const prev = down.id;
          ptr++;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = REMOVED;
          return { y: down.y + 1, id: ptr };
        }
      }
      function snake(k, slide, down, _offset, A, B) {
        const M = A.length;
        const N = B.length;
        if (k < -N || M < k) {
          return { y: -1, id: -1 };
        }
        const fp = createFP(slide, down, k, M);
        while (fp.y + k < M && fp.y < N && A[fp.y + k] === B[fp.y]) {
          const prev = fp.id;
          ptr++;
          fp.id = ptr;
          fp.y += 1;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = COMMON;
        }
        return fp;
      }
      while (fp[delta + offset].y < N) {
        p = p + 1;
        for (let k = -p; k < delta; ++k) {
          fp[k + offset] = snake(
            k,
            fp[k - 1 + offset],
            fp[k + 1 + offset],
            offset,
            A,
            B,
          );
        }
        for (let k = delta + p; k > delta; --k) {
          fp[k + offset] = snake(
            k,
            fp[k - 1 + offset],
            fp[k + 1 + offset],
            offset,
            A,
            B,
          );
        }
        fp[delta + offset] = snake(
          delta,
          fp[delta - 1 + offset],
          fp[delta + 1 + offset],
          offset,
          A,
          B,
        );
      }
      return [
        ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
        ...backTrace(A, B, fp[delta + offset], swapped),
        ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
      ];
    }
    exports_15("default", diff);
    return {
      setters: [],
      execute: function () {
        (function (DiffType) {
          DiffType["removed"] = "removed";
          DiffType["common"] = "common";
          DiffType["added"] = "added";
        })(DiffType || (DiffType = {}));
        exports_15("DiffType", DiffType);
        REMOVED = 1;
        COMMON = 2;
        ADDED = 3;
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/** This module is browser compatible. Do not rely on good formatting of values
 * for AssertionError messages in browsers. */
System.register(
  "https://deno.land/std@0.56.0/testing/asserts",
  [
    "https://deno.land/std@0.56.0/fmt/colors",
    "https://deno.land/std@0.56.0/testing/diff",
  ],
  function (exports_16, context_16) {
    "use strict";
    var colors_ts_1, diff_ts_1, CAN_NOT_DISPLAY, AssertionError;
    var __moduleName = context_16 && context_16.id;
    function format(v) {
      let string = globalThis.Deno ? Deno.inspect(v) : String(v);
      if (typeof v == "string") {
        string = `"${string.replace(/(?=["\\])/g, "\\")}"`;
      }
      return string;
    }
    function createColor(diffType) {
      switch (diffType) {
        case diff_ts_1.DiffType.added:
          return (s) => colors_ts_1.green(colors_ts_1.bold(s));
        case diff_ts_1.DiffType.removed:
          return (s) => colors_ts_1.red(colors_ts_1.bold(s));
        default:
          return colors_ts_1.white;
      }
    }
    function createSign(diffType) {
      switch (diffType) {
        case diff_ts_1.DiffType.added:
          return "+   ";
        case diff_ts_1.DiffType.removed:
          return "-   ";
        default:
          return "    ";
      }
    }
    function buildMessage(diffResult) {
      const messages = [];
      messages.push("");
      messages.push("");
      messages.push(
        `    ${colors_ts_1.gray(colors_ts_1.bold("[Diff]"))} ${
          colors_ts_1.red(colors_ts_1.bold("Actual"))
        } / ${colors_ts_1.green(colors_ts_1.bold("Expected"))}`,
      );
      messages.push("");
      messages.push("");
      diffResult.forEach((result) => {
        const c = createColor(result.type);
        messages.push(c(`${createSign(result.type)}${result.value}`));
      });
      messages.push("");
      return messages;
    }
    function isKeyedCollection(x) {
      return [Symbol.iterator, "size"].every((k) => k in x);
    }
    function equal(c, d) {
      const seen = new Map();
      return (function compare(a, b) {
        // Have to render RegExp & Date for string comparison
        // unless it's mistreated as object
        if (
          a &&
          b &&
          ((a instanceof RegExp && b instanceof RegExp) ||
            (a instanceof Date && b instanceof Date))
        ) {
          return String(a) === String(b);
        }
        if (Object.is(a, b)) {
          return true;
        }
        if (a && typeof a === "object" && b && typeof b === "object") {
          if (seen.get(a) === b) {
            return true;
          }
          if (Object.keys(a || {}).length !== Object.keys(b || {}).length) {
            return false;
          }
          if (isKeyedCollection(a) && isKeyedCollection(b)) {
            if (a.size !== b.size) {
              return false;
            }
            let unmatchedEntries = a.size;
            for (const [aKey, aValue] of a.entries()) {
              for (const [bKey, bValue] of b.entries()) {
                /* Given that Map keys can be references, we need
                             * to ensure that they are also deeply equal */
                if (
                  (aKey === aValue && bKey === bValue && compare(aKey, bKey)) ||
                  (compare(aKey, bKey) && compare(aValue, bValue))
                ) {
                  unmatchedEntries--;
                }
              }
            }
            return unmatchedEntries === 0;
          }
          const merged = { ...a, ...b };
          for (const key in merged) {
            if (!compare(a && a[key], b && b[key])) {
              return false;
            }
          }
          seen.set(a, b);
          return true;
        }
        return false;
      })(c, d);
    }
    exports_16("equal", equal);
    /** Make an assertion, if not `true`, then throw. */
    function assert(expr, msg = "") {
      if (!expr) {
        throw new AssertionError(msg);
      }
    }
    exports_16("assert", assert);
    /**
     * Make an assertion that `actual` and `expected` are equal, deeply. If not
     * deeply equal, then throw.
     */
    function assertEquals(actual, expected, msg) {
      if (equal(actual, expected)) {
        return;
      }
      let message = "";
      const actualString = format(actual);
      const expectedString = format(expected);
      try {
        const diffResult = diff_ts_1.default(
          actualString.split("\n"),
          expectedString.split("\n"),
        );
        const diffMsg = buildMessage(diffResult).join("\n");
        message = `Values are not equal:\n${diffMsg}`;
      } catch (e) {
        message = `\n${colors_ts_1.red(CAN_NOT_DISPLAY)} + \n\n`;
      }
      if (msg) {
        message = msg;
      }
      throw new AssertionError(message);
    }
    exports_16("assertEquals", assertEquals);
    /**
     * Make an assertion that `actual` and `expected` are not equal, deeply.
     * If not then throw.
     */
    function assertNotEquals(actual, expected, msg) {
      if (!equal(actual, expected)) {
        return;
      }
      let actualString;
      let expectedString;
      try {
        actualString = String(actual);
      } catch (e) {
        actualString = "[Cannot display]";
      }
      try {
        expectedString = String(expected);
      } catch (e) {
        expectedString = "[Cannot display]";
      }
      if (!msg) {
        msg = `actual: ${actualString} expected: ${expectedString}`;
      }
      throw new AssertionError(msg);
    }
    exports_16("assertNotEquals", assertNotEquals);
    /**
     * Make an assertion that `actual` and `expected` are strictly equal.  If
     * not then throw.
     */
    function assertStrictEq(actual, expected, msg) {
      if (actual === expected) {
        return;
      }
      let message;
      if (msg) {
        message = msg;
      } else {
        const actualString = format(actual);
        const expectedString = format(expected);
        if (actualString === expectedString) {
          const withOffset = actualString
            .split("\n")
            .map((l) => `     ${l}`)
            .join("\n");
          message =
            `Values have the same structure but are not reference-equal:\n\n${
              colors_ts_1.red(withOffset)
            }\n`;
        } else {
          try {
            const diffResult = diff_ts_1.default(
              actualString.split("\n"),
              expectedString.split("\n"),
            );
            const diffMsg = buildMessage(diffResult).join("\n");
            message = `Values are not strictly equal:\n${diffMsg}`;
          } catch (e) {
            message = `\n${colors_ts_1.red(CAN_NOT_DISPLAY)} + \n\n`;
          }
        }
      }
      throw new AssertionError(message);
    }
    exports_16("assertStrictEq", assertStrictEq);
    /**
     * Make an assertion that actual contains expected. If not
     * then thrown.
     */
    function assertStrContains(actual, expected, msg) {
      if (!actual.includes(expected)) {
        if (!msg) {
          msg = `actual: "${actual}" expected to contain: "${expected}"`;
        }
        throw new AssertionError(msg);
      }
    }
    exports_16("assertStrContains", assertStrContains);
    /**
     * Make an assertion that `actual` contains the `expected` values
     * If not then thrown.
     */
    function assertArrayContains(actual, expected, msg) {
      const missing = [];
      for (let i = 0; i < expected.length; i++) {
        let found = false;
        for (let j = 0; j < actual.length; j++) {
          if (equal(expected[i], actual[j])) {
            found = true;
            break;
          }
        }
        if (!found) {
          missing.push(expected[i]);
        }
      }
      if (missing.length === 0) {
        return;
      }
      if (!msg) {
        msg = `actual: "${format(actual)}" expected to contain: "${
          format(expected)
        }"\nmissing: ${format(missing)}`;
      }
      throw new AssertionError(msg);
    }
    exports_16("assertArrayContains", assertArrayContains);
    /**
     * Make an assertion that `actual` match RegExp `expected`. If not
     * then thrown
     */
    function assertMatch(actual, expected, msg) {
      if (!expected.test(actual)) {
        if (!msg) {
          msg = `actual: "${actual}" expected to match: "${expected}"`;
        }
        throw new AssertionError(msg);
      }
    }
    exports_16("assertMatch", assertMatch);
    /**
     * Forcefully throws a failed assertion
     */
    function fail(msg) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      assert(false, `Failed assertion${msg ? `: ${msg}` : "."}`);
    }
    exports_16("fail", fail);
    /** Executes a function, expecting it to throw.  If it does not, then it
     * throws.  An error class and a string that should be included in the
     * error message can also be asserted.
     */
    function assertThrows(fn, ErrorClass, msgIncludes = "", msg) {
      let doesThrow = false;
      let error = null;
      try {
        fn();
      } catch (e) {
        if (
          ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)
        ) {
          msg =
            `Expected error to be instance of "${ErrorClass.name}", but was "${e.constructor.name}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        if (
          msgIncludes &&
          !colors_ts_1.stripColor(e.message).includes(
            colors_ts_1.stripColor(msgIncludes),
          )
        ) {
          msg =
            `Expected error message to include "${msgIncludes}", but got "${e.message}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        doesThrow = true;
        error = e;
      }
      if (!doesThrow) {
        msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
        throw new AssertionError(msg);
      }
      return error;
    }
    exports_16("assertThrows", assertThrows);
    async function assertThrowsAsync(fn, ErrorClass, msgIncludes = "", msg) {
      let doesThrow = false;
      let error = null;
      try {
        await fn();
      } catch (e) {
        if (
          ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)
        ) {
          msg =
            `Expected error to be instance of "${ErrorClass.name}", but got "${e.name}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        if (
          msgIncludes &&
          !colors_ts_1.stripColor(e.message).includes(
            colors_ts_1.stripColor(msgIncludes),
          )
        ) {
          msg =
            `Expected error message to include "${msgIncludes}", but got "${e.message}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        doesThrow = true;
        error = e;
      }
      if (!doesThrow) {
        msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
        throw new AssertionError(msg);
      }
      return error;
    }
    exports_16("assertThrowsAsync", assertThrowsAsync);
    /** Use this to stub out methods that will throw when invoked. */
    function unimplemented(msg) {
      throw new AssertionError(msg || "unimplemented");
    }
    exports_16("unimplemented", unimplemented);
    /** Use this to assert unreachable code. */
    function unreachable() {
      throw new AssertionError("unreachable");
    }
    exports_16("unreachable", unreachable);
    return {
      setters: [
        function (colors_ts_1_1) {
          colors_ts_1 = colors_ts_1_1;
        },
        function (diff_ts_1_1) {
          diff_ts_1 = diff_ts_1_1;
        },
      ],
      execute: function () {
        CAN_NOT_DISPLAY = "[Cannot display]";
        AssertionError = class AssertionError extends Error {
          constructor(message) {
            super(message);
            this.name = "AssertionError";
          }
        };
        exports_16("AssertionError", AssertionError);
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
/** This module is browser compatible. */
System.register(
  "https://deno.land/std@0.56.0/path/win32",
  [
    "https://deno.land/std@0.56.0/path/_constants",
    "https://deno.land/std@0.56.0/path/_util",
    "https://deno.land/std@0.56.0/testing/asserts",
  ],
  function (exports_17, context_17) {
    "use strict";
    var _constants_ts_2, _util_ts_1, asserts_ts_1, sep, delimiter;
    var __moduleName = context_17 && context_17.id;
    function resolve(...pathSegments) {
      let resolvedDevice = "";
      let resolvedTail = "";
      let resolvedAbsolute = false;
      for (let i = pathSegments.length - 1; i >= -1; i--) {
        let path;
        if (i >= 0) {
          path = pathSegments[i];
        } else if (!resolvedDevice) {
          if (globalThis.Deno == null) {
            throw new TypeError(
              "Resolved a drive-letter-less path without a CWD.",
            );
          }
          path = Deno.cwd();
        } else {
          if (globalThis.Deno == null) {
            throw new TypeError("Resolved a relative path without a CWD.");
          }
          // Windows has the concept of drive-specific current working
          // directories. If we've resolved a drive letter but not yet an
          // absolute path, get cwd for that drive, or the process cwd if
          // the drive cwd is not available. We're sure the device is not
          // a UNC path at this points, because UNC paths are always absolute.
          path = Deno.env.get(`=${resolvedDevice}`) || Deno.cwd();
          // Verify that a cwd was found and that it actually points
          // to our drive. If not, default to the drive's root.
          if (
            path === undefined ||
            path.slice(0, 3).toLowerCase() !==
              `${resolvedDevice.toLowerCase()}\\`
          ) {
            path = `${resolvedDevice}\\`;
          }
        }
        _util_ts_1.assertPath(path);
        const len = path.length;
        // Skip empty entries
        if (len === 0) {
          continue;
        }
        let rootEnd = 0;
        let device = "";
        let isAbsolute = false;
        const code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
          if (_util_ts_1.isPathSeparator(code)) {
            // Possible UNC root
            // If we started with a separator, we know we at least have an
            // absolute path of some kind (UNC or otherwise)
            isAbsolute = true;
            if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
              // Matched double path separator at beginning
              let j = 2;
              let last = j;
              // Match 1 or more non-path separators
              for (; j < len; ++j) {
                if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                const firstPart = path.slice(last, j);
                // Matched!
                last = j;
                // Match 1 or more path separators
                for (; j < len; ++j) {
                  if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j < len && j !== last) {
                  // Matched!
                  last = j;
                  // Match 1 or more non-path separators
                  for (; j < len; ++j) {
                    if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                      break;
                    }
                  }
                  if (j === len) {
                    // We matched a UNC root only
                    device = `\\\\${firstPart}\\${path.slice(last)}`;
                    rootEnd = j;
                  } else if (j !== last) {
                    // We matched a UNC root with leftovers
                    device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                    rootEnd = j;
                  }
                }
              }
            } else {
              rootEnd = 1;
            }
          } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
            // Possible device root
            if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
              device = path.slice(0, 2);
              rootEnd = 2;
              if (len > 2) {
                if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                  // Treat separator following drive name as an absolute path
                  // indicator
                  isAbsolute = true;
                  rootEnd = 3;
                }
              }
            }
          }
        } else if (_util_ts_1.isPathSeparator(code)) {
          // `path` contains just a path separator
          rootEnd = 1;
          isAbsolute = true;
        }
        if (
          device.length > 0 &&
          resolvedDevice.length > 0 &&
          device.toLowerCase() !== resolvedDevice.toLowerCase()
        ) {
          // This path points to another device so it is not applicable
          continue;
        }
        if (resolvedDevice.length === 0 && device.length > 0) {
          resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
          resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
          resolvedAbsolute = isAbsolute;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) {
          break;
        }
      }
      // At this point the path should be resolved to a full absolute path,
      // but handle relative paths to be safe (might happen when process.cwd()
      // fails)
      // Normalize the tail path
      resolvedTail = _util_ts_1.normalizeString(
        resolvedTail,
        !resolvedAbsolute,
        "\\",
        _util_ts_1.isPathSeparator,
      );
      return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail ||
        ".";
    }
    exports_17("resolve", resolve);
    function normalize(path) {
      _util_ts_1.assertPath(path);
      const len = path.length;
      if (len === 0) {
        return ".";
      }
      let rootEnd = 0;
      let device;
      let isAbsolute = false;
      const code = path.charCodeAt(0);
      // Try to match a root
      if (len > 1) {
        if (_util_ts_1.isPathSeparator(code)) {
          // Possible UNC root
          // If we started with a separator, we know we at least have an absolute
          // path of some kind (UNC or otherwise)
          isAbsolute = true;
          if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
            // Matched double path separator at beginning
            let j = 2;
            let last = j;
            // Match 1 or more non-path separators
            for (; j < len; ++j) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                break;
              }
            }
            if (j < len && j !== last) {
              const firstPart = path.slice(last, j);
              // Matched!
              last = j;
              // Match 1 or more path separators
              for (; j < len; ++j) {
                if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                // Matched!
                last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j === len) {
                  // We matched a UNC root only
                  // Return the normalized version of the UNC root since there
                  // is nothing left to process
                  return `\\\\${firstPart}\\${path.slice(last)}\\`;
                } else if (j !== last) {
                  // We matched a UNC root with leftovers
                  device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                  rootEnd = j;
                }
              }
            }
          } else {
            rootEnd = 1;
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
          // Possible device root
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            device = path.slice(0, 2);
            rootEnd = 2;
            if (len > 2) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                // Treat separator following drive name as an absolute path
                // indicator
                isAbsolute = true;
                rootEnd = 3;
              }
            }
          }
        }
      } else if (_util_ts_1.isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid unnecessary
        // work
        return "\\";
      }
      let tail;
      if (rootEnd < len) {
        tail = _util_ts_1.normalizeString(
          path.slice(rootEnd),
          !isAbsolute,
          "\\",
          _util_ts_1.isPathSeparator,
        );
      } else {
        tail = "";
      }
      if (tail.length === 0 && !isAbsolute) {
        tail = ".";
      }
      if (
        tail.length > 0 &&
        _util_ts_1.isPathSeparator(path.charCodeAt(len - 1))
      ) {
        tail += "\\";
      }
      if (device === undefined) {
        if (isAbsolute) {
          if (tail.length > 0) {
            return `\\${tail}`;
          } else {
            return "\\";
          }
        } else if (tail.length > 0) {
          return tail;
        } else {
          return "";
        }
      } else if (isAbsolute) {
        if (tail.length > 0) {
          return `${device}\\${tail}`;
        } else {
          return `${device}\\`;
        }
      } else if (tail.length > 0) {
        return device + tail;
      } else {
        return device;
      }
    }
    exports_17("normalize", normalize);
    function isAbsolute(path) {
      _util_ts_1.assertPath(path);
      const len = path.length;
      if (len === 0) {
        return false;
      }
      const code = path.charCodeAt(0);
      if (_util_ts_1.isPathSeparator(code)) {
        return true;
      } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
        // Possible device root
        if (len > 2 && path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
          if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
            return true;
          }
        }
      }
      return false;
    }
    exports_17("isAbsolute", isAbsolute);
    function join(...paths) {
      const pathsCount = paths.length;
      if (pathsCount === 0) {
        return ".";
      }
      let joined;
      let firstPart = null;
      for (let i = 0; i < pathsCount; ++i) {
        const path = paths[i];
        _util_ts_1.assertPath(path);
        if (path.length > 0) {
          if (joined === undefined) {
            joined = firstPart = path;
          } else {
            joined += `\\${path}`;
          }
        }
      }
      if (joined === undefined) {
        return ".";
      }
      // Make sure that the joined path doesn't start with two slashes, because
      // normalize() will mistake it for an UNC path then.
      //
      // This step is skipped when it is very clear that the user actually
      // intended to point at an UNC path. This is assumed when the first
      // non-empty string arguments starts with exactly two slashes followed by
      // at least one more non-slash character.
      //
      // Note that for normalize() to treat a path as an UNC path it needs to
      // have at least 2 components, so we don't filter for that here.
      // This means that the user can use join to construct UNC paths from
      // a server name and a share name; for example:
      //   path.join('//server', 'share') -> '\\\\server\\share\\')
      let needsReplace = true;
      let slashCount = 0;
      asserts_ts_1.assert(firstPart != null);
      if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(0))) {
        ++slashCount;
        const firstLen = firstPart.length;
        if (firstLen > 1) {
          if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(1))) {
            ++slashCount;
            if (firstLen > 2) {
              if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(2))) {
                ++slashCount;
              } else {
                // We matched a UNC path in the first part
                needsReplace = false;
              }
            }
          }
        }
      }
      if (needsReplace) {
        // Find any more consecutive slashes we need to replace
        for (; slashCount < joined.length; ++slashCount) {
          if (!_util_ts_1.isPathSeparator(joined.charCodeAt(slashCount))) {
            break;
          }
        }
        // Replace the slashes if needed
        if (slashCount >= 2) {
          joined = `\\${joined.slice(slashCount)}`;
        }
      }
      return normalize(joined);
    }
    exports_17("join", join);
    // It will solve the relative path from `from` to `to`, for instance:
    //  from = 'C:\\orandea\\test\\aaa'
    //  to = 'C:\\orandea\\impl\\bbb'
    // The output of the function should be: '..\\..\\impl\\bbb'
    function relative(from, to) {
      _util_ts_1.assertPath(from);
      _util_ts_1.assertPath(to);
      if (from === to) {
        return "";
      }
      const fromOrig = resolve(from);
      const toOrig = resolve(to);
      if (fromOrig === toOrig) {
        return "";
      }
      from = fromOrig.toLowerCase();
      to = toOrig.toLowerCase();
      if (from === to) {
        return "";
      }
      // Trim any leading backslashes
      let fromStart = 0;
      let fromEnd = from.length;
      for (; fromStart < fromEnd; ++fromStart) {
        if (
          from.charCodeAt(fromStart) !== _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          break;
        }
      }
      // Trim trailing backslashes (applicable to UNC paths only)
      for (; fromEnd - 1 > fromStart; --fromEnd) {
        if (
          from.charCodeAt(fromEnd - 1) !== _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          break;
        }
      }
      const fromLen = fromEnd - fromStart;
      // Trim any leading backslashes
      let toStart = 0;
      let toEnd = to.length;
      for (; toStart < toEnd; ++toStart) {
        if (to.charCodeAt(toStart) !== _constants_ts_2.CHAR_BACKWARD_SLASH) {
          break;
        }
      }
      // Trim trailing backslashes (applicable to UNC paths only)
      for (; toEnd - 1 > toStart; --toEnd) {
        if (to.charCodeAt(toEnd - 1) !== _constants_ts_2.CHAR_BACKWARD_SLASH) {
          break;
        }
      }
      const toLen = toEnd - toStart;
      // Compare paths to find the longest common path from root
      const length = fromLen < toLen ? fromLen : toLen;
      let lastCommonSep = -1;
      let i = 0;
      for (; i <= length; ++i) {
        if (i === length) {
          if (toLen > length) {
            if (
              to.charCodeAt(toStart + i) === _constants_ts_2.CHAR_BACKWARD_SLASH
            ) {
              // We get here if `from` is the exact base path for `to`.
              // For example: from='C:\\foo\\bar'; to='C:\\foo\\bar\\baz'
              return toOrig.slice(toStart + i + 1);
            } else if (i === 2) {
              // We get here if `from` is the device root.
              // For example: from='C:\\'; to='C:\\foo'
              return toOrig.slice(toStart + i);
            }
          }
          if (fromLen > length) {
            if (
              from.charCodeAt(fromStart + i) ===
                _constants_ts_2.CHAR_BACKWARD_SLASH
            ) {
              // We get here if `to` is the exact base path for `from`.
              // For example: from='C:\\foo\\bar'; to='C:\\foo'
              lastCommonSep = i;
            } else if (i === 2) {
              // We get here if `to` is the device root.
              // For example: from='C:\\foo\\bar'; to='C:\\'
              lastCommonSep = 3;
            }
          }
          break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) {
          break;
        } else if (fromCode === _constants_ts_2.CHAR_BACKWARD_SLASH) {
          lastCommonSep = i;
        }
      }
      // We found a mismatch before the first common path separator was seen, so
      // return the original `to`.
      if (i !== length && lastCommonSep === -1) {
        return toOrig;
      }
      let out = "";
      if (lastCommonSep === -1) {
        lastCommonSep = 0;
      }
      // Generate the relative path based on the path difference between `to` and
      // `from`
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (
          i === fromEnd ||
          from.charCodeAt(i) === _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          if (out.length === 0) {
            out += "..";
          } else {
            out += "\\..";
          }
        }
      }
      // Lastly, append the rest of the destination (`to`) path that comes after
      // the common path parts
      if (out.length > 0) {
        return out + toOrig.slice(toStart + lastCommonSep, toEnd);
      } else {
        toStart += lastCommonSep;
        if (
          toOrig.charCodeAt(toStart) === _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          ++toStart;
        }
        return toOrig.slice(toStart, toEnd);
      }
    }
    exports_17("relative", relative);
    function toNamespacedPath(path) {
      // Note: this will *probably* throw somewhere.
      if (typeof path !== "string") {
        return path;
      }
      if (path.length === 0) {
        return "";
      }
      const resolvedPath = resolve(path);
      if (resolvedPath.length >= 3) {
        if (
          resolvedPath.charCodeAt(0) === _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          // Possible UNC root
          if (
            resolvedPath.charCodeAt(1) === _constants_ts_2.CHAR_BACKWARD_SLASH
          ) {
            const code = resolvedPath.charCodeAt(2);
            if (
              code !== _constants_ts_2.CHAR_QUESTION_MARK &&
              code !== _constants_ts_2.CHAR_DOT
            ) {
              // Matched non-long UNC root, convert the path to a long UNC path
              return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
            }
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
          // Possible device root
          if (
            resolvedPath.charCodeAt(1) === _constants_ts_2.CHAR_COLON &&
            resolvedPath.charCodeAt(2) === _constants_ts_2.CHAR_BACKWARD_SLASH
          ) {
            // Matched device root, convert the path to a long UNC path
            return `\\\\?\\${resolvedPath}`;
          }
        }
      }
      return path;
    }
    exports_17("toNamespacedPath", toNamespacedPath);
    function dirname(path) {
      _util_ts_1.assertPath(path);
      const len = path.length;
      if (len === 0) {
        return ".";
      }
      let rootEnd = -1;
      let end = -1;
      let matchedSlash = true;
      let offset = 0;
      const code = path.charCodeAt(0);
      // Try to match a root
      if (len > 1) {
        if (_util_ts_1.isPathSeparator(code)) {
          // Possible UNC root
          rootEnd = offset = 1;
          if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
            // Matched double path separator at beginning
            let j = 2;
            let last = j;
            // Match 1 or more non-path separators
            for (; j < len; ++j) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                break;
              }
            }
            if (j < len && j !== last) {
              // Matched!
              last = j;
              // Match 1 or more path separators
              for (; j < len; ++j) {
                if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                // Matched!
                last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j === len) {
                  // We matched a UNC root only
                  return path;
                }
                if (j !== last) {
                  // We matched a UNC root with leftovers
                  // Offset by 1 to include the separator after the UNC root to
                  // treat it as a "normal root" on top of a (UNC) root
                  rootEnd = offset = j + 1;
                }
              }
            }
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
          // Possible device root
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            rootEnd = offset = 2;
            if (len > 2) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                rootEnd = offset = 3;
              }
            }
          }
        }
      } else if (_util_ts_1.isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid
        // unnecessary work
        return path;
      }
      for (let i = len - 1; i >= offset; --i) {
        if (_util_ts_1.isPathSeparator(path.charCodeAt(i))) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          // We saw the first non-path separator
          matchedSlash = false;
        }
      }
      if (end === -1) {
        if (rootEnd === -1) {
          return ".";
        } else {
          end = rootEnd;
        }
      }
      return path.slice(0, end);
    }
    exports_17("dirname", dirname);
    function basename(path, ext = "") {
      if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
      }
      _util_ts_1.assertPath(path);
      let start = 0;
      let end = -1;
      let matchedSlash = true;
      let i;
      // Check for a drive letter prefix so as not to mistake the following
      // path separator as an extra separator at the end of the path that can be
      // disregarded
      if (path.length >= 2) {
        const drive = path.charCodeAt(0);
        if (_util_ts_1.isWindowsDeviceRoot(drive)) {
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            start = 2;
          }
        }
      }
      if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) {
          return "";
        }
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= start; --i) {
          const code = path.charCodeAt(i);
          if (_util_ts_1.isPathSeparator(code)) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              // We saw the first non-path separator, remember this index in case
              // we need it if the extension ends up not matching
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              // Try to match the explicit extension
              if (code === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  // We matched the extension, so mark this as the end of our path
                  // component
                  end = i;
                }
              } else {
                // Extension does not match, so our result is the entire path
                // component
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end) {
          end = firstNonSlashEnd;
        } else if (end === -1) {
          end = path.length;
        }
        return path.slice(start, end);
      } else {
        for (i = path.length - 1; i >= start; --i) {
          if (_util_ts_1.isPathSeparator(path.charCodeAt(i))) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // path component
            matchedSlash = false;
            end = i + 1;
          }
        }
        if (end === -1) {
          return "";
        }
        return path.slice(start, end);
      }
    }
    exports_17("basename", basename);
    function extname(path) {
      _util_ts_1.assertPath(path);
      let start = 0;
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      // Check for a drive letter prefix so as not to mistake the following
      // path separator as an extra separator at the end of the path that can be
      // disregarded
      if (
        path.length >= 2 &&
        path.charCodeAt(1) === _constants_ts_2.CHAR_COLON &&
        _util_ts_1.isWindowsDeviceRoot(path.charCodeAt(0))
      ) {
        start = startPart = 2;
      }
      for (let i = path.length - 1; i >= start; --i) {
        const code = path.charCodeAt(i);
        if (_util_ts_1.isPathSeparator(code)) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_2.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        return "";
      }
      return path.slice(startDot, end);
    }
    exports_17("extname", extname);
    function format(pathObject) {
      /* eslint-disable max-len */
      if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(
          `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`,
        );
      }
      return _util_ts_1._format("\\", pathObject);
    }
    exports_17("format", format);
    function parse(path) {
      _util_ts_1.assertPath(path);
      const ret = { root: "", dir: "", base: "", ext: "", name: "" };
      const len = path.length;
      if (len === 0) {
        return ret;
      }
      let rootEnd = 0;
      let code = path.charCodeAt(0);
      // Try to match a root
      if (len > 1) {
        if (_util_ts_1.isPathSeparator(code)) {
          // Possible UNC root
          rootEnd = 1;
          if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
            // Matched double path separator at beginning
            let j = 2;
            let last = j;
            // Match 1 or more non-path separators
            for (; j < len; ++j) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                break;
              }
            }
            if (j < len && j !== last) {
              // Matched!
              last = j;
              // Match 1 or more path separators
              for (; j < len; ++j) {
                if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                // Matched!
                last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j === len) {
                  // We matched a UNC root only
                  rootEnd = j;
                } else if (j !== last) {
                  // We matched a UNC root with leftovers
                  rootEnd = j + 1;
                }
              }
            }
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
          // Possible device root
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            rootEnd = 2;
            if (len > 2) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                if (len === 3) {
                  // `path` contains just a drive root, exit early to avoid
                  // unnecessary work
                  ret.root = ret.dir = path;
                  return ret;
                }
                rootEnd = 3;
              }
            } else {
              // `path` contains just a drive root, exit early to avoid
              // unnecessary work
              ret.root = ret.dir = path;
              return ret;
            }
          }
        }
      } else if (_util_ts_1.isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid
        // unnecessary work
        ret.root = ret.dir = path;
        return ret;
      }
      if (rootEnd > 0) {
        ret.root = path.slice(0, rootEnd);
      }
      let startDot = -1;
      let startPart = rootEnd;
      let end = -1;
      let matchedSlash = true;
      let i = path.length - 1;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      // Get non-dir info
      for (; i >= rootEnd; --i) {
        code = path.charCodeAt(i);
        if (_util_ts_1.isPathSeparator(code)) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_2.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        if (end !== -1) {
          ret.base = ret.name = path.slice(startPart, end);
        }
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
        ret.ext = path.slice(startDot, end);
      }
      // If the directory is the root, use the entire root as the `dir` including
      // the trailing slash if any (`C:\abc` -> `C:\`). Otherwise, strip out the
      // trailing slash (`C:\abc\def` -> `C:\abc`).
      if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path.slice(0, startPart - 1);
      } else {
        ret.dir = ret.root;
      }
      return ret;
    }
    exports_17("parse", parse);
    /** Converts a file URL to a path string.
     *
     *      fromFileUrl("file:///C:/Users/foo"); // "C:\\Users\\foo"
     *      fromFileUrl("file:///home/foo"); // "\\home\\foo"
     *
     * Note that non-file URLs are treated as file URLs and irrelevant components
     * are ignored.
     */
    function fromFileUrl(url) {
      return new URL(url).pathname
        .replace(/^\/*([A-Za-z]:)(\/|$)/, "$1/")
        .replace(/\//g, "\\");
    }
    exports_17("fromFileUrl", fromFileUrl);
    return {
      setters: [
        function (_constants_ts_2_1) {
          _constants_ts_2 = _constants_ts_2_1;
        },
        function (_util_ts_1_1) {
          _util_ts_1 = _util_ts_1_1;
        },
        function (asserts_ts_1_1) {
          asserts_ts_1 = asserts_ts_1_1;
        },
      ],
      execute: function () {
        exports_17("sep", sep = "\\");
        exports_17("delimiter", delimiter = ";");
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
/** This module is browser compatible. */
System.register(
  "https://deno.land/std@0.56.0/path/posix",
  [
    "https://deno.land/std@0.56.0/path/_constants",
    "https://deno.land/std@0.56.0/path/_util",
  ],
  function (exports_18, context_18) {
    "use strict";
    var _constants_ts_3, _util_ts_2, sep, delimiter;
    var __moduleName = context_18 && context_18.id;
    // path.resolve([from ...], to)
    function resolve(...pathSegments) {
      let resolvedPath = "";
      let resolvedAbsolute = false;
      for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        let path;
        if (i >= 0) {
          path = pathSegments[i];
        } else {
          if (globalThis.Deno == null) {
            throw new TypeError("Resolved a relative path without a CWD.");
          }
          path = Deno.cwd();
        }
        _util_ts_2.assertPath(path);
        // Skip empty entries
        if (path.length === 0) {
          continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute =
          path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      }
      // At this point the path should be resolved to a full absolute path, but
      // handle relative paths to be safe (might happen when process.cwd() fails)
      // Normalize the path
      resolvedPath = _util_ts_2.normalizeString(
        resolvedPath,
        !resolvedAbsolute,
        "/",
        _util_ts_2.isPosixPathSeparator,
      );
      if (resolvedAbsolute) {
        if (resolvedPath.length > 0) {
          return `/${resolvedPath}`;
        } else {
          return "/";
        }
      } else if (resolvedPath.length > 0) {
        return resolvedPath;
      } else {
        return ".";
      }
    }
    exports_18("resolve", resolve);
    function normalize(path) {
      _util_ts_2.assertPath(path);
      if (path.length === 0) {
        return ".";
      }
      const isAbsolute =
        path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      const trailingSeparator =
        path.charCodeAt(path.length - 1) === _constants_ts_3.CHAR_FORWARD_SLASH;
      // Normalize the path
      path = _util_ts_2.normalizeString(
        path,
        !isAbsolute,
        "/",
        _util_ts_2.isPosixPathSeparator,
      );
      if (path.length === 0 && !isAbsolute) {
        path = ".";
      }
      if (path.length > 0 && trailingSeparator) {
        path += "/";
      }
      if (isAbsolute) {
        return `/${path}`;
      }
      return path;
    }
    exports_18("normalize", normalize);
    function isAbsolute(path) {
      _util_ts_2.assertPath(path);
      return path.length > 0 &&
        path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
    }
    exports_18("isAbsolute", isAbsolute);
    function join(...paths) {
      if (paths.length === 0) {
        return ".";
      }
      let joined;
      for (let i = 0, len = paths.length; i < len; ++i) {
        const path = paths[i];
        _util_ts_2.assertPath(path);
        if (path.length > 0) {
          if (!joined) {
            joined = path;
          } else {
            joined += `/${path}`;
          }
        }
      }
      if (!joined) {
        return ".";
      }
      return normalize(joined);
    }
    exports_18("join", join);
    function relative(from, to) {
      _util_ts_2.assertPath(from);
      _util_ts_2.assertPath(to);
      if (from === to) {
        return "";
      }
      from = resolve(from);
      to = resolve(to);
      if (from === to) {
        return "";
      }
      // Trim any leading backslashes
      let fromStart = 1;
      const fromEnd = from.length;
      for (; fromStart < fromEnd; ++fromStart) {
        if (from.charCodeAt(fromStart) !== _constants_ts_3.CHAR_FORWARD_SLASH) {
          break;
        }
      }
      const fromLen = fromEnd - fromStart;
      // Trim any leading backslashes
      let toStart = 1;
      const toEnd = to.length;
      for (; toStart < toEnd; ++toStart) {
        if (to.charCodeAt(toStart) !== _constants_ts_3.CHAR_FORWARD_SLASH) {
          break;
        }
      }
      const toLen = toEnd - toStart;
      // Compare paths to find the longest common path from root
      const length = fromLen < toLen ? fromLen : toLen;
      let lastCommonSep = -1;
      let i = 0;
      for (; i <= length; ++i) {
        if (i === length) {
          if (toLen > length) {
            if (
              to.charCodeAt(toStart + i) === _constants_ts_3.CHAR_FORWARD_SLASH
            ) {
              // We get here if `from` is the exact base path for `to`.
              // For example: from='/foo/bar'; to='/foo/bar/baz'
              return to.slice(toStart + i + 1);
            } else if (i === 0) {
              // We get here if `from` is the root
              // For example: from='/'; to='/foo'
              return to.slice(toStart + i);
            }
          } else if (fromLen > length) {
            if (
              from.charCodeAt(fromStart + i) ===
                _constants_ts_3.CHAR_FORWARD_SLASH
            ) {
              // We get here if `to` is the exact base path for `from`.
              // For example: from='/foo/bar/baz'; to='/foo/bar'
              lastCommonSep = i;
            } else if (i === 0) {
              // We get here if `to` is the root.
              // For example: from='/foo'; to='/'
              lastCommonSep = 0;
            }
          }
          break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) {
          break;
        } else if (fromCode === _constants_ts_3.CHAR_FORWARD_SLASH) {
          lastCommonSep = i;
        }
      }
      let out = "";
      // Generate the relative path based on the path difference between `to`
      // and `from`
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (
          i === fromEnd ||
          from.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH
        ) {
          if (out.length === 0) {
            out += "..";
          } else {
            out += "/..";
          }
        }
      }
      // Lastly, append the rest of the destination (`to`) path that comes after
      // the common path parts
      if (out.length > 0) {
        return out + to.slice(toStart + lastCommonSep);
      } else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === _constants_ts_3.CHAR_FORWARD_SLASH) {
          ++toStart;
        }
        return to.slice(toStart);
      }
    }
    exports_18("relative", relative);
    function toNamespacedPath(path) {
      // Non-op on posix systems
      return path;
    }
    exports_18("toNamespacedPath", toNamespacedPath);
    function dirname(path) {
      _util_ts_2.assertPath(path);
      if (path.length === 0) {
        return ".";
      }
      const hasRoot = path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      let end = -1;
      let matchedSlash = true;
      for (let i = path.length - 1; i >= 1; --i) {
        if (path.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          // We saw the first non-path separator
          matchedSlash = false;
        }
      }
      if (end === -1) {
        return hasRoot ? "/" : ".";
      }
      if (hasRoot && end === 1) {
        return "//";
      }
      return path.slice(0, end);
    }
    exports_18("dirname", dirname);
    function basename(path, ext = "") {
      if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
      }
      _util_ts_2.assertPath(path);
      let start = 0;
      let end = -1;
      let matchedSlash = true;
      let i;
      if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) {
          return "";
        }
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= 0; --i) {
          const code = path.charCodeAt(i);
          if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              // We saw the first non-path separator, remember this index in case
              // we need it if the extension ends up not matching
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              // Try to match the explicit extension
              if (code === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  // We matched the extension, so mark this as the end of our path
                  // component
                  end = i;
                }
              } else {
                // Extension does not match, so our result is the entire path
                // component
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end) {
          end = firstNonSlashEnd;
        } else if (end === -1) {
          end = path.length;
        }
        return path.slice(start, end);
      } else {
        for (i = path.length - 1; i >= 0; --i) {
          if (path.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // path component
            matchedSlash = false;
            end = i + 1;
          }
        }
        if (end === -1) {
          return "";
        }
        return path.slice(start, end);
      }
    }
    exports_18("basename", basename);
    function extname(path) {
      _util_ts_2.assertPath(path);
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      for (let i = path.length - 1; i >= 0; --i) {
        const code = path.charCodeAt(i);
        if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_3.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        return "";
      }
      return path.slice(startDot, end);
    }
    exports_18("extname", extname);
    function format(pathObject) {
      /* eslint-disable max-len */
      if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(
          `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`,
        );
      }
      return _util_ts_2._format("/", pathObject);
    }
    exports_18("format", format);
    function parse(path) {
      _util_ts_2.assertPath(path);
      const ret = { root: "", dir: "", base: "", ext: "", name: "" };
      if (path.length === 0) {
        return ret;
      }
      const isAbsolute =
        path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      let start;
      if (isAbsolute) {
        ret.root = "/";
        start = 1;
      } else {
        start = 0;
      }
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      let i = path.length - 1;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      // Get non-dir info
      for (; i >= start; --i) {
        const code = path.charCodeAt(i);
        if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_3.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        if (end !== -1) {
          if (startPart === 0 && isAbsolute) {
            ret.base = ret.name = path.slice(1, end);
          } else {
            ret.base = ret.name = path.slice(startPart, end);
          }
        }
      } else {
        if (startPart === 0 && isAbsolute) {
          ret.name = path.slice(1, startDot);
          ret.base = path.slice(1, end);
        } else {
          ret.name = path.slice(startPart, startDot);
          ret.base = path.slice(startPart, end);
        }
        ret.ext = path.slice(startDot, end);
      }
      if (startPart > 0) {
        ret.dir = path.slice(0, startPart - 1);
      } else if (isAbsolute) {
        ret.dir = "/";
      }
      return ret;
    }
    exports_18("parse", parse);
    /** Converts a file URL to a path string.
     *
     *      fromFileUrl("file:///home/foo"); // "/home/foo"
     *
     * Note that non-file URLs are treated as file URLs and irrelevant components
     * are ignored.
     */
    function fromFileUrl(url) {
      return new URL(url).pathname;
    }
    exports_18("fromFileUrl", fromFileUrl);
    return {
      setters: [
        function (_constants_ts_3_1) {
          _constants_ts_3 = _constants_ts_3_1;
        },
        function (_util_ts_2_1) {
          _util_ts_2 = _util_ts_2_1;
        },
      ],
      execute: function () {
        exports_18("sep", sep = "/");
        exports_18("delimiter", delimiter = ":");
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/** This module is browser compatible. */
System.register(
  "https://deno.land/std@0.56.0/path/separator",
  ["https://deno.land/std@0.56.0/path/_constants"],
  function (exports_19, context_19) {
    "use strict";
    var _constants_ts_4, SEP, SEP_PATTERN;
    var __moduleName = context_19 && context_19.id;
    return {
      setters: [
        function (_constants_ts_4_1) {
          _constants_ts_4 = _constants_ts_4_1;
        },
      ],
      execute: function () {
        exports_19("SEP", SEP = _constants_ts_4.isWindows ? "\\" : "/");
        exports_19(
          "SEP_PATTERN",
          SEP_PATTERN = _constants_ts_4.isWindows ? /[\\/]+/ : /\/+/,
        );
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/** This module is browser compatible. */
System.register(
  "https://deno.land/std@0.56.0/path/common",
  ["https://deno.land/std@0.56.0/path/separator"],
  function (exports_20, context_20) {
    "use strict";
    var separator_ts_1;
    var __moduleName = context_20 && context_20.id;
    /** Determines the common path from a set of paths, using an optional separator,
     * which defaults to the OS default separator.
     *
     *       import { common } from "https://deno.land/std/path/mod.ts";
     *       const p = common([
     *         "./deno/std/path/mod.ts",
     *         "./deno/std/fs/mod.ts",
     *       ]);
     *       console.log(p); // "./deno/std/"
     *
     */
    function common(paths, sep = separator_ts_1.SEP) {
      const [first = "", ...remaining] = paths;
      if (first === "" || remaining.length === 0) {
        return first.substring(0, first.lastIndexOf(sep) + 1);
      }
      const parts = first.split(sep);
      let endOfPrefix = parts.length;
      for (const path of remaining) {
        const compare = path.split(sep);
        for (let i = 0; i < endOfPrefix; i++) {
          if (compare[i] !== parts[i]) {
            endOfPrefix = i;
          }
        }
        if (endOfPrefix === 0) {
          return "";
        }
      }
      const prefix = parts.slice(0, endOfPrefix).join(sep);
      return prefix.endsWith(sep) ? prefix : `${prefix}${sep}`;
    }
    exports_20("common", common);
    return {
      setters: [
        function (separator_ts_1_1) {
          separator_ts_1 = separator_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// This file is ported from globrex@0.1.2
// MIT License
// Copyright (c) 2018 Terkel Gjervig Nielsen
/** This module is browser compatible. */
System.register(
  "https://deno.land/std@0.56.0/path/_globrex",
  ["https://deno.land/std@0.56.0/path/_constants"],
  function (exports_21, context_21) {
    "use strict";
    var _constants_ts_5,
      SEP,
      SEP_ESC,
      SEP_RAW,
      GLOBSTAR,
      WILDCARD,
      GLOBSTAR_SEGMENT,
      WILDCARD_SEGMENT;
    var __moduleName = context_21 && context_21.id;
    /**
     * Convert any glob pattern to a JavaScript Regexp object
     * @param glob Glob pattern to convert
     * @param opts Configuration object
     * @returns Converted object with string, segments and RegExp object
     */
    function globrex(
      glob,
      {
        extended = false,
        globstar = false,
        strict = false,
        filepath = false,
        flags = "",
      } = {},
    ) {
      const sepPattern = new RegExp(`^${SEP}${strict ? "" : "+"}$`);
      let regex = "";
      let segment = "";
      let pathRegexStr = "";
      const pathSegments = [];
      // If we are doing extended matching, this boolean is true when we are inside
      // a group (eg {*.html,*.js}), and false otherwise.
      let inGroup = false;
      let inRange = false;
      // extglob stack. Keep track of scope
      const ext = [];
      // Helper function to build string and segments
      function add(str, options = { split: false, last: false, only: "" }) {
        const { split, last, only } = options;
        if (only !== "path") {
          regex += str;
        }
        if (filepath && only !== "regex") {
          pathRegexStr += str.match(sepPattern) ? SEP : str;
          if (split) {
            if (last) {
              segment += str;
            }
            if (segment !== "") {
              // change it 'includes'
              if (!flags.includes("g")) {
                segment = `^${segment}$`;
              }
              pathSegments.push(new RegExp(segment, flags));
            }
            segment = "";
          } else {
            segment += str;
          }
        }
      }
      let c, n;
      for (let i = 0; i < glob.length; i++) {
        c = glob[i];
        n = glob[i + 1];
        if (["\\", "$", "^", ".", "="].includes(c)) {
          add(`\\${c}`);
          continue;
        }
        if (c.match(sepPattern)) {
          add(SEP, { split: true });
          if (n != null && n.match(sepPattern) && !strict) {
            regex += "?";
          }
          continue;
        }
        if (c === "(") {
          if (ext.length) {
            add(`${c}?:`);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === ")") {
          if (ext.length) {
            add(c);
            const type = ext.pop();
            if (type === "@") {
              add("{1}");
            } else if (type === "!") {
              add(WILDCARD);
            } else {
              add(type);
            }
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "|") {
          if (ext.length) {
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "+") {
          if (n === "(" && extended) {
            ext.push(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "@" && extended) {
          if (n === "(") {
            ext.push(c);
            continue;
          }
        }
        if (c === "!") {
          if (extended) {
            if (inRange) {
              add("^");
              continue;
            }
            if (n === "(") {
              ext.push(c);
              add("(?!");
              i++;
              continue;
            }
            add(`\\${c}`);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "?") {
          if (extended) {
            if (n === "(") {
              ext.push(c);
            } else {
              add(".");
            }
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "[") {
          if (inRange && n === ":") {
            i++; // skip [
            let value = "";
            while (glob[++i] !== ":") {
              value += glob[i];
            }
            if (value === "alnum") {
              add("(?:\\w|\\d)");
            } else if (value === "space") {
              add("\\s");
            } else if (value === "digit") {
              add("\\d");
            }
            i++; // skip last ]
            continue;
          }
          if (extended) {
            inRange = true;
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "]") {
          if (extended) {
            inRange = false;
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "{") {
          if (extended) {
            inGroup = true;
            add("(?:");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "}") {
          if (extended) {
            inGroup = false;
            add(")");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === ",") {
          if (inGroup) {
            add("|");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "*") {
          if (n === "(" && extended) {
            ext.push(c);
            continue;
          }
          // Move over all consecutive "*"'s.
          // Also store the previous and next characters
          const prevChar = glob[i - 1];
          let starCount = 1;
          while (glob[i + 1] === "*") {
            starCount++;
            i++;
          }
          const nextChar = glob[i + 1];
          if (!globstar) {
            // globstar is disabled, so treat any number of "*" as one
            add(".*");
          } else {
            // globstar is enabled, so determine if this is a globstar segment
            const isGlobstar = starCount > 1 && // multiple "*"'s
              // from the start of the segment
              [SEP_RAW, "/", undefined].includes(prevChar) &&
              // to the end of the segment
              [SEP_RAW, "/", undefined].includes(nextChar);
            if (isGlobstar) {
              // it's a globstar, so match zero or more path segments
              add(GLOBSTAR, { only: "regex" });
              add(GLOBSTAR_SEGMENT, { only: "path", last: true, split: true });
              i++; // move over the "/"
            } else {
              // it's not a globstar, so only match one path segment
              add(WILDCARD, { only: "regex" });
              add(WILDCARD_SEGMENT, { only: "path" });
            }
          }
          continue;
        }
        add(c);
      }
      // When regexp 'g' flag is specified don't
      // constrain the regular expression with ^ & $
      if (!flags.includes("g")) {
        regex = `^${regex}$`;
        segment = `^${segment}$`;
        if (filepath) {
          pathRegexStr = `^${pathRegexStr}$`;
        }
      }
      const result = { regex: new RegExp(regex, flags) };
      // Push the last segment
      if (filepath) {
        pathSegments.push(new RegExp(segment, flags));
        result.path = {
          regex: new RegExp(pathRegexStr, flags),
          segments: pathSegments,
          globstar: new RegExp(
            !flags.includes("g") ? `^${GLOBSTAR_SEGMENT}$` : GLOBSTAR_SEGMENT,
            flags,
          ),
        };
      }
      return result;
    }
    exports_21("globrex", globrex);
    return {
      setters: [
        function (_constants_ts_5_1) {
          _constants_ts_5 = _constants_ts_5_1;
        },
      ],
      execute: function () {
        SEP = _constants_ts_5.isWindows ? `(?:\\\\|\\/)` : `\\/`;
        SEP_ESC = _constants_ts_5.isWindows ? `\\\\` : `/`;
        SEP_RAW = _constants_ts_5.isWindows ? `\\` : `/`;
        GLOBSTAR = `(?:(?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
        WILDCARD = `(?:[^${SEP_ESC}/]*)`;
        GLOBSTAR_SEGMENT = `((?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
        WILDCARD_SEGMENT = `(?:[^${SEP_ESC}/]*)`;
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/** This module is browser compatible. */
System.register(
  "https://deno.land/std@0.56.0/path/glob",
  [
    "https://deno.land/std@0.56.0/path/separator",
    "https://deno.land/std@0.56.0/path/_globrex",
    "https://deno.land/std@0.56.0/path/mod",
    "https://deno.land/std@0.56.0/testing/asserts",
  ],
  function (exports_22, context_22) {
    "use strict";
    var separator_ts_2, _globrex_ts_1, mod_ts_1, asserts_ts_2;
    var __moduleName = context_22 && context_22.id;
    /**
     * Generate a regex based on glob pattern and options
     * This was meant to be using the the `fs.walk` function
     * but can be used anywhere else.
     * Examples:
     *
     *     Looking for all the `ts` files:
     *     walkSync(".", {
     *       match: [globToRegExp("*.ts")]
     *     })
     *
     *     Looking for all the `.json` files in any subfolder:
     *     walkSync(".", {
     *       match: [globToRegExp(join("a", "**", "*.json"),{
     *         flags: "g",
     *         extended: true,
     *         globstar: true
     *       })]
     *     })
     *
     * @param glob - Glob pattern to be used
     * @param options - Specific options for the glob pattern
     * @returns A RegExp for the glob pattern
     */
    function globToRegExp(glob, { extended = false, globstar = true } = {}) {
      const result = _globrex_ts_1.globrex(glob, {
        extended,
        globstar,
        strict: false,
        filepath: true,
      });
      asserts_ts_2.assert(result.path != null);
      return result.path.regex;
    }
    exports_22("globToRegExp", globToRegExp);
    /** Test whether the given string is a glob */
    function isGlob(str) {
      const chars = { "{": "}", "(": ")", "[": "]" };
      /* eslint-disable-next-line max-len */
      const regex =
        /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
      if (str === "") {
        return false;
      }
      let match;
      while ((match = regex.exec(str))) {
        if (match[2]) {
          return true;
        }
        let idx = match.index + match[0].length;
        // if an open bracket/brace/paren is escaped,
        // set the index to the next closing character
        const open = match[1];
        const close = open ? chars[open] : null;
        if (open && close) {
          const n = str.indexOf(close, idx);
          if (n !== -1) {
            idx = n + 1;
          }
        }
        str = str.slice(idx);
      }
      return false;
    }
    exports_22("isGlob", isGlob);
    /** Like normalize(), but doesn't collapse "**\/.." when `globstar` is true. */
    function normalizeGlob(glob, { globstar = false } = {}) {
      if (!!glob.match(/\0/g)) {
        throw new Error(`Glob contains invalid characters: "${glob}"`);
      }
      if (!globstar) {
        return mod_ts_1.normalize(glob);
      }
      const s = separator_ts_2.SEP_PATTERN.source;
      const badParentPattern = new RegExp(
        `(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`,
        "g",
      );
      return mod_ts_1.normalize(glob.replace(badParentPattern, "\0")).replace(
        /\0/g,
        "..",
      );
    }
    exports_22("normalizeGlob", normalizeGlob);
    /** Like join(), but doesn't collapse "**\/.." when `globstar` is true. */
    function joinGlobs(globs, { extended = false, globstar = false } = {}) {
      if (!globstar || globs.length == 0) {
        return mod_ts_1.join(...globs);
      }
      if (globs.length === 0) {
        return ".";
      }
      let joined;
      for (const glob of globs) {
        const path = glob;
        if (path.length > 0) {
          if (!joined) {
            joined = path;
          } else {
            joined += `${separator_ts_2.SEP}${path}`;
          }
        }
      }
      if (!joined) {
        return ".";
      }
      return normalizeGlob(joined, { extended, globstar });
    }
    exports_22("joinGlobs", joinGlobs);
    return {
      setters: [
        function (separator_ts_2_1) {
          separator_ts_2 = separator_ts_2_1;
        },
        function (_globrex_ts_1_1) {
          _globrex_ts_1 = _globrex_ts_1_1;
        },
        function (mod_ts_1_1) {
          mod_ts_1 = mod_ts_1_1;
        },
        function (asserts_ts_2_1) {
          asserts_ts_2 = asserts_ts_2_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported mostly from https://github.com/browserify/path-browserify/
/** This module is browser compatible. */
System.register(
  "https://deno.land/std@0.56.0/path/mod",
  [
    "https://deno.land/std@0.56.0/path/_constants",
    "https://deno.land/std@0.56.0/path/win32",
    "https://deno.land/std@0.56.0/path/posix",
    "https://deno.land/std@0.56.0/path/common",
    "https://deno.land/std@0.56.0/path/separator",
    "https://deno.land/std@0.56.0/path/_interface",
    "https://deno.land/std@0.56.0/path/glob",
  ],
  function (exports_23, context_23) {
    "use strict";
    var _constants_ts_6,
      _win32,
      _posix,
      path,
      win32,
      posix,
      basename,
      delimiter,
      dirname,
      extname,
      format,
      fromFileUrl,
      isAbsolute,
      join,
      normalize,
      parse,
      relative,
      resolve,
      sep,
      toNamespacedPath;
    var __moduleName = context_23 && context_23.id;
    var exportedNames_1 = {
      "win32": true,
      "posix": true,
      "basename": true,
      "delimiter": true,
      "dirname": true,
      "extname": true,
      "format": true,
      "fromFileUrl": true,
      "isAbsolute": true,
      "join": true,
      "normalize": true,
      "parse": true,
      "relative": true,
      "resolve": true,
      "sep": true,
      "toNamespacedPath": true,
      "SEP": true,
      "SEP_PATTERN": true,
    };
    function exportStar_2(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default" && !exportedNames_1.hasOwnProperty(n)) {
          exports[n] = m[n];
        }
      }
      exports_23(exports);
    }
    return {
      setters: [
        function (_constants_ts_6_1) {
          _constants_ts_6 = _constants_ts_6_1;
        },
        function (_win32_1) {
          _win32 = _win32_1;
        },
        function (_posix_1) {
          _posix = _posix_1;
        },
        function (common_ts_1_1) {
          exportStar_2(common_ts_1_1);
        },
        function (separator_ts_3_1) {
          exports_23({
            "SEP": separator_ts_3_1["SEP"],
            "SEP_PATTERN": separator_ts_3_1["SEP_PATTERN"],
          });
        },
        function (_interface_ts_1_1) {
          exportStar_2(_interface_ts_1_1);
        },
        function (glob_ts_1_1) {
          exportStar_2(glob_ts_1_1);
        },
      ],
      execute: function () {
        path = _constants_ts_6.isWindows ? _win32 : _posix;
        exports_23("win32", win32 = _win32);
        exports_23("posix", posix = _posix);
        exports_23("basename", basename = path.basename),
          exports_23("delimiter", delimiter = path.delimiter),
          exports_23("dirname", dirname = path.dirname),
          exports_23("extname", extname = path.extname),
          exports_23("format", format = path.format),
          exports_23("fromFileUrl", fromFileUrl = path.fromFileUrl),
          exports_23("isAbsolute", isAbsolute = path.isAbsolute),
          exports_23("join", join = path.join),
          exports_23("normalize", normalize = path.normalize),
          exports_23("parse", parse = path.parse),
          exports_23("relative", relative = path.relative),
          exports_23("resolve", resolve = path.resolve),
          exports_23("sep", sep = path.sep),
          exports_23(
            "toNamespacedPath",
            toNamespacedPath = path.toNamespacedPath,
          );
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/io/util",
  [
    "https://deno.land/std@0.56.0/path/mod",
    "https://deno.land/std@0.56.0/encoding/utf8",
  ],
  function (exports_24, context_24) {
    "use strict";
    var Buffer, mkdir, open, path, utf8_ts_1;
    var __moduleName = context_24 && context_24.id;
    /**
     * Copy bytes from one Uint8Array to another.  Bytes from `src` which don't fit
     * into `dst` will not be copied.
     *
     * @param src Source byte array
     * @param dst Destination byte array
     * @param off Offset into `dst` at which to begin writing values from `src`.
     * @return number of bytes copied
     */
    function copyBytes(src, dst, off = 0) {
      off = Math.max(0, Math.min(off, dst.byteLength));
      const dstBytesAvailable = dst.byteLength - off;
      if (src.byteLength > dstBytesAvailable) {
        src = src.subarray(0, dstBytesAvailable);
      }
      dst.set(src, off);
      return src.byteLength;
    }
    exports_24("copyBytes", copyBytes);
    function charCode(s) {
      return s.charCodeAt(0);
    }
    exports_24("charCode", charCode);
    function stringsReader(s) {
      return new Buffer(utf8_ts_1.encode(s).buffer);
    }
    exports_24("stringsReader", stringsReader);
    /** Create or open a temporal file at specified directory with prefix and
     *  postfix
     * */
    async function tempFile(dir, opts = { prefix: "", postfix: "" }) {
      const r = Math.floor(Math.random() * 1000000);
      const filepath = path.resolve(
        `${dir}/${opts.prefix || ""}${r}${opts.postfix || ""}`,
      );
      await mkdir(path.dirname(filepath), { recursive: true });
      const file = await open(filepath, {
        create: true,
        read: true,
        write: true,
        append: true,
      });
      return { file, filepath };
    }
    exports_24("tempFile", tempFile);
    return {
      setters: [
        function (path_1) {
          path = path_1;
        },
        function (utf8_ts_1_1) {
          utf8_ts_1 = utf8_ts_1_1;
        },
      ],
      execute: function () {
        // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
        Buffer = Deno.Buffer, mkdir = Deno.mkdir, open = Deno.open;
      },
    };
  },
);
// Based on https://github.com/golang/go/blob/891682/src/bufio/bufio.go
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
System.register(
  "https://deno.land/std@0.56.0/io/bufio",
  [
    "https://deno.land/std@0.56.0/io/util",
    "https://deno.land/std@0.56.0/testing/asserts",
  ],
  function (exports_25, context_25) {
    "use strict";
    var util_ts_1,
      asserts_ts_3,
      DEFAULT_BUF_SIZE,
      MIN_BUF_SIZE,
      MAX_CONSECUTIVE_EMPTY_READS,
      CR,
      LF,
      BufferFullError,
      PartialReadError,
      BufReader,
      AbstractBufBase,
      BufWriter,
      BufWriterSync;
    var __moduleName = context_25 && context_25.id;
    /** Generate longest proper prefix which is also suffix array. */
    function createLPS(pat) {
      const lps = new Uint8Array(pat.length);
      lps[0] = 0;
      let prefixEnd = 0;
      let i = 1;
      while (i < lps.length) {
        if (pat[i] == pat[prefixEnd]) {
          prefixEnd++;
          lps[i] = prefixEnd;
          i++;
        } else if (prefixEnd === 0) {
          lps[i] = 0;
          i++;
        } else {
          prefixEnd = pat[prefixEnd - 1];
        }
      }
      return lps;
    }
    /** Read delimited bytes from a Reader. */
    async function* readDelim(reader, delim) {
      // Avoid unicode problems
      const delimLen = delim.length;
      const delimLPS = createLPS(delim);
      let inputBuffer = new Deno.Buffer();
      const inspectArr = new Uint8Array(Math.max(1024, delimLen + 1));
      // Modified KMP
      let inspectIndex = 0;
      let matchIndex = 0;
      while (true) {
        const result = await reader.read(inspectArr);
        if (result === null) {
          // Yield last chunk.
          yield inputBuffer.bytes();
          return;
        }
        if (result < 0) {
          // Discard all remaining and silently fail.
          return;
        }
        const sliceRead = inspectArr.subarray(0, result);
        await Deno.writeAll(inputBuffer, sliceRead);
        let sliceToProcess = inputBuffer.bytes();
        while (inspectIndex < sliceToProcess.length) {
          if (sliceToProcess[inspectIndex] === delim[matchIndex]) {
            inspectIndex++;
            matchIndex++;
            if (matchIndex === delimLen) {
              // Full match
              const matchEnd = inspectIndex - delimLen;
              const readyBytes = sliceToProcess.subarray(0, matchEnd);
              // Copy
              const pendingBytes = sliceToProcess.slice(inspectIndex);
              yield readyBytes;
              // Reset match, different from KMP.
              sliceToProcess = pendingBytes;
              inspectIndex = 0;
              matchIndex = 0;
            }
          } else {
            if (matchIndex === 0) {
              inspectIndex++;
            } else {
              matchIndex = delimLPS[matchIndex - 1];
            }
          }
        }
        // Keep inspectIndex and matchIndex.
        inputBuffer = new Deno.Buffer(sliceToProcess);
      }
    }
    exports_25("readDelim", readDelim);
    /** Read delimited strings from a Reader. */
    async function* readStringDelim(reader, delim) {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      for await (const chunk of readDelim(reader, encoder.encode(delim))) {
        yield decoder.decode(chunk);
      }
    }
    exports_25("readStringDelim", readStringDelim);
    /** Read strings line-by-line from a Reader. */
    // eslint-disable-next-line require-await
    async function* readLines(reader) {
      yield* readStringDelim(reader, "\n");
    }
    exports_25("readLines", readLines);
    return {
      setters: [
        function (util_ts_1_1) {
          util_ts_1 = util_ts_1_1;
        },
        function (asserts_ts_3_1) {
          asserts_ts_3 = asserts_ts_3_1;
        },
      ],
      execute: function () {
        DEFAULT_BUF_SIZE = 4096;
        MIN_BUF_SIZE = 16;
        MAX_CONSECUTIVE_EMPTY_READS = 100;
        CR = util_ts_1.charCode("\r");
        LF = util_ts_1.charCode("\n");
        BufferFullError = class BufferFullError extends Error {
          constructor(partial) {
            super("Buffer full");
            this.partial = partial;
            this.name = "BufferFullError";
          }
        };
        exports_25("BufferFullError", BufferFullError);
        PartialReadError = class PartialReadError
          extends Deno.errors.UnexpectedEof {
          constructor() {
            super("Encountered UnexpectedEof, data only partially read");
            this.name = "PartialReadError";
          }
        };
        exports_25("PartialReadError", PartialReadError);
        /** BufReader implements buffering for a Reader object. */
        BufReader = class BufReader {
          constructor(rd, size = DEFAULT_BUF_SIZE) {
            this.r = 0; // buf read position.
            this.w = 0; // buf write position.
            this.eof = false;
            if (size < MIN_BUF_SIZE) {
              size = MIN_BUF_SIZE;
            }
            this._reset(new Uint8Array(size), rd);
          }
          // private lastByte: number;
          // private lastCharSize: number;
          /** return new BufReader unless r is BufReader */
          static create(r, size = DEFAULT_BUF_SIZE) {
            return r instanceof BufReader ? r : new BufReader(r, size);
          }
          /** Returns the size of the underlying buffer in bytes. */
          size() {
            return this.buf.byteLength;
          }
          buffered() {
            return this.w - this.r;
          }
          // Reads a new chunk into the buffer.
          async _fill() {
            // Slide existing data to beginning.
            if (this.r > 0) {
              this.buf.copyWithin(0, this.r, this.w);
              this.w -= this.r;
              this.r = 0;
            }
            if (this.w >= this.buf.byteLength) {
              throw Error("bufio: tried to fill full buffer");
            }
            // Read new data: try a limited number of times.
            for (let i = MAX_CONSECUTIVE_EMPTY_READS; i > 0; i--) {
              const rr = await this.rd.read(this.buf.subarray(this.w));
              if (rr === null) {
                this.eof = true;
                return;
              }
              asserts_ts_3.assert(rr >= 0, "negative read");
              this.w += rr;
              if (rr > 0) {
                return;
              }
            }
            throw new Error(
              `No progress after ${MAX_CONSECUTIVE_EMPTY_READS} read() calls`,
            );
          }
          /** Discards any buffered data, resets all state, and switches
                 * the buffered reader to read from r.
                 */
          reset(r) {
            this._reset(this.buf, r);
          }
          _reset(buf, rd) {
            this.buf = buf;
            this.rd = rd;
            this.eof = false;
            // this.lastByte = -1;
            // this.lastCharSize = -1;
          }
          /** reads data into p.
                 * It returns the number of bytes read into p.
                 * The bytes are taken from at most one Read on the underlying Reader,
                 * hence n may be less than len(p).
                 * To read exactly len(p) bytes, use io.ReadFull(b, p).
                 */
          async read(p) {
            let rr = p.byteLength;
            if (p.byteLength === 0) {
              return rr;
            }
            if (this.r === this.w) {
              if (p.byteLength >= this.buf.byteLength) {
                // Large read, empty buffer.
                // Read directly into p to avoid copy.
                const rr = await this.rd.read(p);
                const nread = rr ?? 0;
                asserts_ts_3.assert(nread >= 0, "negative read");
                // if (rr.nread > 0) {
                //   this.lastByte = p[rr.nread - 1];
                //   this.lastCharSize = -1;
                // }
                return rr;
              }
              // One read.
              // Do not use this.fill, which will loop.
              this.r = 0;
              this.w = 0;
              rr = await this.rd.read(this.buf);
              if (rr === 0 || rr === null) {
                return rr;
              }
              asserts_ts_3.assert(rr >= 0, "negative read");
              this.w += rr;
            }
            // copy as much as we can
            const copied = util_ts_1.copyBytes(
              this.buf.subarray(this.r, this.w),
              p,
              0,
            );
            this.r += copied;
            // this.lastByte = this.buf[this.r - 1];
            // this.lastCharSize = -1;
            return copied;
          }
          /** reads exactly `p.length` bytes into `p`.
                 *
                 * If successful, `p` is returned.
                 *
                 * If the end of the underlying stream has been reached, and there are no more
                 * bytes available in the buffer, `readFull()` returns `null` instead.
                 *
                 * An error is thrown if some bytes could be read, but not enough to fill `p`
                 * entirely before the underlying stream reported an error or EOF. Any error
                 * thrown will have a `partial` property that indicates the slice of the
                 * buffer that has been successfully filled with data.
                 *
                 * Ported from https://golang.org/pkg/io/#ReadFull
                 */
          async readFull(p) {
            let bytesRead = 0;
            while (bytesRead < p.length) {
              try {
                const rr = await this.read(p.subarray(bytesRead));
                if (rr === null) {
                  if (bytesRead === 0) {
                    return null;
                  } else {
                    throw new PartialReadError();
                  }
                }
                bytesRead += rr;
              } catch (err) {
                err.partial = p.subarray(0, bytesRead);
                throw err;
              }
            }
            return p;
          }
          /** Returns the next byte [0, 255] or `null`. */
          async readByte() {
            while (this.r === this.w) {
              if (this.eof) {
                return null;
              }
              await this._fill(); // buffer is empty.
            }
            const c = this.buf[this.r];
            this.r++;
            // this.lastByte = c;
            return c;
          }
          /** readString() reads until the first occurrence of delim in the input,
                 * returning a string containing the data up to and including the delimiter.
                 * If ReadString encounters an error before finding a delimiter,
                 * it returns the data read before the error and the error itself
                 * (often `null`).
                 * ReadString returns err != nil if and only if the returned data does not end
                 * in delim.
                 * For simple uses, a Scanner may be more convenient.
                 */
          async readString(delim) {
            if (delim.length !== 1) {
              throw new Error("Delimiter should be a single character");
            }
            const buffer = await this.readSlice(delim.charCodeAt(0));
            if (buffer === null) {
              return null;
            }
            return new TextDecoder().decode(buffer);
          }
          /** `readLine()` is a low-level line-reading primitive. Most callers should
                 * use `readString('\n')` instead or use a Scanner.
                 *
                 * `readLine()` tries to return a single line, not including the end-of-line
                 * bytes. If the line was too long for the buffer then `more` is set and the
                 * beginning of the line is returned. The rest of the line will be returned
                 * from future calls. `more` will be false when returning the last fragment
                 * of the line. The returned buffer is only valid until the next call to
                 * `readLine()`.
                 *
                 * The text returned from ReadLine does not include the line end ("\r\n" or
                 * "\n").
                 *
                 * When the end of the underlying stream is reached, the final bytes in the
                 * stream are returned. No indication or error is given if the input ends
                 * without a final line end. When there are no more trailing bytes to read,
                 * `readLine()` returns `null`.
                 *
                 * Calling `unreadByte()` after `readLine()` will always unread the last byte
                 * read (possibly a character belonging to the line end) even if that byte is
                 * not part of the line returned by `readLine()`.
                 */
          async readLine() {
            let line;
            try {
              line = await this.readSlice(LF);
            } catch (err) {
              let { partial } = err;
              asserts_ts_3.assert(
                partial instanceof Uint8Array,
                "bufio: caught error from `readSlice()` without `partial` property",
              );
              // Don't throw if `readSlice()` failed with `BufferFullError`, instead we
              // just return whatever is available and set the `more` flag.
              if (!(err instanceof BufferFullError)) {
                throw err;
              }
              // Handle the case where "\r\n" straddles the buffer.
              if (
                !this.eof &&
                partial.byteLength > 0 &&
                partial[partial.byteLength - 1] === CR
              ) {
                // Put the '\r' back on buf and drop it from line.
                // Let the next call to ReadLine check for "\r\n".
                asserts_ts_3.assert(
                  this.r > 0,
                  "bufio: tried to rewind past start of buffer",
                );
                this.r--;
                partial = partial.subarray(0, partial.byteLength - 1);
              }
              return { line: partial, more: !this.eof };
            }
            if (line === null) {
              return null;
            }
            if (line.byteLength === 0) {
              return { line, more: false };
            }
            if (line[line.byteLength - 1] == LF) {
              let drop = 1;
              if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
                drop = 2;
              }
              line = line.subarray(0, line.byteLength - drop);
            }
            return { line, more: false };
          }
          /** `readSlice()` reads until the first occurrence of `delim` in the input,
                 * returning a slice pointing at the bytes in the buffer. The bytes stop
                 * being valid at the next read.
                 *
                 * If `readSlice()` encounters an error before finding a delimiter, or the
                 * buffer fills without finding a delimiter, it throws an error with a
                 * `partial` property that contains the entire buffer.
                 *
                 * If `readSlice()` encounters the end of the underlying stream and there are
                 * any bytes left in the buffer, the rest of the buffer is returned. In other
                 * words, EOF is always treated as a delimiter. Once the buffer is empty,
                 * it returns `null`.
                 *
                 * Because the data returned from `readSlice()` will be overwritten by the
                 * next I/O operation, most clients should use `readString()` instead.
                 */
          async readSlice(delim) {
            let s = 0; // search start index
            let slice;
            while (true) {
              // Search buffer.
              let i = this.buf.subarray(this.r + s, this.w).indexOf(delim);
              if (i >= 0) {
                i += s;
                slice = this.buf.subarray(this.r, this.r + i + 1);
                this.r += i + 1;
                break;
              }
              // EOF?
              if (this.eof) {
                if (this.r === this.w) {
                  return null;
                }
                slice = this.buf.subarray(this.r, this.w);
                this.r = this.w;
                break;
              }
              // Buffer full?
              if (this.buffered() >= this.buf.byteLength) {
                this.r = this.w;
                // #4521 The internal buffer should not be reused across reads because it causes corruption of data.
                const oldbuf = this.buf;
                const newbuf = this.buf.slice(0);
                this.buf = newbuf;
                throw new BufferFullError(oldbuf);
              }
              s = this.w - this.r; // do not rescan area we scanned before
              // Buffer is not full.
              try {
                await this._fill();
              } catch (err) {
                err.partial = slice;
                throw err;
              }
            }
            // Handle last byte, if any.
            // const i = slice.byteLength - 1;
            // if (i >= 0) {
            //   this.lastByte = slice[i];
            //   this.lastCharSize = -1
            // }
            return slice;
          }
          /** `peek()` returns the next `n` bytes without advancing the reader. The
                 * bytes stop being valid at the next read call.
                 *
                 * When the end of the underlying stream is reached, but there are unread
                 * bytes left in the buffer, those bytes are returned. If there are no bytes
                 * left in the buffer, it returns `null`.
                 *
                 * If an error is encountered before `n` bytes are available, `peek()` throws
                 * an error with the `partial` property set to a slice of the buffer that
                 * contains the bytes that were available before the error occurred.
                 */
          async peek(n) {
            if (n < 0) {
              throw Error("negative count");
            }
            let avail = this.w - this.r;
            while (avail < n && avail < this.buf.byteLength && !this.eof) {
              try {
                await this._fill();
              } catch (err) {
                err.partial = this.buf.subarray(this.r, this.w);
                throw err;
              }
              avail = this.w - this.r;
            }
            if (avail === 0 && this.eof) {
              return null;
            } else if (avail < n && this.eof) {
              return this.buf.subarray(this.r, this.r + avail);
            } else if (avail < n) {
              throw new BufferFullError(this.buf.subarray(this.r, this.w));
            }
            return this.buf.subarray(this.r, this.r + n);
          }
        };
        exports_25("BufReader", BufReader);
        AbstractBufBase = class AbstractBufBase {
          constructor() {
            this.usedBufferBytes = 0;
            this.err = null;
          }
          /** Size returns the size of the underlying buffer in bytes. */
          size() {
            return this.buf.byteLength;
          }
          /** Returns how many bytes are unused in the buffer. */
          available() {
            return this.buf.byteLength - this.usedBufferBytes;
          }
          /** buffered returns the number of bytes that have been written into the
                 * current buffer.
                 */
          buffered() {
            return this.usedBufferBytes;
          }
          checkBytesWritten(numBytesWritten) {
            if (numBytesWritten < this.usedBufferBytes) {
              if (numBytesWritten > 0) {
                this.buf.copyWithin(0, numBytesWritten, this.usedBufferBytes);
                this.usedBufferBytes -= numBytesWritten;
              }
              this.err = new Error("Short write");
              throw this.err;
            }
          }
        };
        /** BufWriter implements buffering for an deno.Writer object.
             * If an error occurs writing to a Writer, no more data will be
             * accepted and all subsequent writes, and flush(), will return the error.
             * After all data has been written, the client should call the
             * flush() method to guarantee all data has been forwarded to
             * the underlying deno.Writer.
             */
        BufWriter = class BufWriter extends AbstractBufBase {
          constructor(writer, size = DEFAULT_BUF_SIZE) {
            super();
            this.writer = writer;
            if (size <= 0) {
              size = DEFAULT_BUF_SIZE;
            }
            this.buf = new Uint8Array(size);
          }
          /** return new BufWriter unless writer is BufWriter */
          static create(writer, size = DEFAULT_BUF_SIZE) {
            return writer instanceof BufWriter ? writer
            : new BufWriter(writer, size);
          }
          /** Discards any unflushed buffered data, clears any error, and
                 * resets buffer to write its output to w.
                 */
          reset(w) {
            this.err = null;
            this.usedBufferBytes = 0;
            this.writer = w;
          }
          /** Flush writes any buffered data to the underlying io.Writer. */
          async flush() {
            if (this.err !== null) {
              throw this.err;
            }
            if (this.usedBufferBytes === 0) {
              return;
            }
            let numBytesWritten = 0;
            try {
              numBytesWritten = await this.writer.write(
                this.buf.subarray(0, this.usedBufferBytes),
              );
            } catch (e) {
              this.err = e;
              throw e;
            }
            this.checkBytesWritten(numBytesWritten);
            this.usedBufferBytes = 0;
          }
          /** Writes the contents of `data` into the buffer.  If the contents won't fully
                 * fit into the buffer, those bytes that can are copied into the buffer, the
                 * buffer is the flushed to the writer and the remaining bytes are copied into
                 * the now empty buffer.
                 *
                 * @return the number of bytes written to the buffer.
                 */
          async write(data) {
            if (this.err !== null) {
              throw this.err;
            }
            if (data.length === 0) {
              return 0;
            }
            let totalBytesWritten = 0;
            let numBytesWritten = 0;
            while (data.byteLength > this.available()) {
              if (this.buffered() === 0) {
                // Large write, empty buffer.
                // Write directly from data to avoid copy.
                try {
                  numBytesWritten = await this.writer.write(data);
                } catch (e) {
                  this.err = e;
                  throw e;
                }
              } else {
                numBytesWritten = util_ts_1.copyBytes(
                  data,
                  this.buf,
                  this.usedBufferBytes,
                );
                this.usedBufferBytes += numBytesWritten;
                await this.flush();
              }
              totalBytesWritten += numBytesWritten;
              data = data.subarray(numBytesWritten);
            }
            numBytesWritten = util_ts_1.copyBytes(
              data,
              this.buf,
              this.usedBufferBytes,
            );
            this.usedBufferBytes += numBytesWritten;
            totalBytesWritten += numBytesWritten;
            return totalBytesWritten;
          }
        };
        exports_25("BufWriter", BufWriter);
        /** BufWriterSync implements buffering for a deno.WriterSync object.
             * If an error occurs writing to a WriterSync, no more data will be
             * accepted and all subsequent writes, and flush(), will return the error.
             * After all data has been written, the client should call the
             * flush() method to guarantee all data has been forwarded to
             * the underlying deno.WriterSync.
             */
        BufWriterSync = class BufWriterSync extends AbstractBufBase {
          constructor(writer, size = DEFAULT_BUF_SIZE) {
            super();
            this.writer = writer;
            if (size <= 0) {
              size = DEFAULT_BUF_SIZE;
            }
            this.buf = new Uint8Array(size);
          }
          /** return new BufWriterSync unless writer is BufWriterSync */
          static create(writer, size = DEFAULT_BUF_SIZE) {
            return writer instanceof BufWriterSync
              ? writer
              : new BufWriterSync(writer, size);
          }
          /** Discards any unflushed buffered data, clears any error, and
                 * resets buffer to write its output to w.
                 */
          reset(w) {
            this.err = null;
            this.usedBufferBytes = 0;
            this.writer = w;
          }
          /** Flush writes any buffered data to the underlying io.WriterSync. */
          flush() {
            if (this.err !== null) {
              throw this.err;
            }
            if (this.usedBufferBytes === 0) {
              return;
            }
            let numBytesWritten = 0;
            try {
              numBytesWritten = this.writer.writeSync(
                this.buf.subarray(0, this.usedBufferBytes),
              );
            } catch (e) {
              this.err = e;
              throw e;
            }
            this.checkBytesWritten(numBytesWritten);
            this.usedBufferBytes = 0;
          }
          /** Writes the contents of `data` into the buffer.  If the contents won't fully
                 * fit into the buffer, those bytes that can are copied into the buffer, the
                 * buffer is the flushed to the writer and the remaining bytes are copied into
                 * the now empty buffer.
                 *
                 * @return the number of bytes written to the buffer.
                 */
          writeSync(data) {
            if (this.err !== null) {
              throw this.err;
            }
            if (data.length === 0) {
              return 0;
            }
            let totalBytesWritten = 0;
            let numBytesWritten = 0;
            while (data.byteLength > this.available()) {
              if (this.buffered() === 0) {
                // Large write, empty buffer.
                // Write directly from data to avoid copy.
                try {
                  numBytesWritten = this.writer.writeSync(data);
                } catch (e) {
                  this.err = e;
                  throw e;
                }
              } else {
                numBytesWritten = util_ts_1.copyBytes(
                  data,
                  this.buf,
                  this.usedBufferBytes,
                );
                this.usedBufferBytes += numBytesWritten;
                this.flush();
              }
              totalBytesWritten += numBytesWritten;
              data = data.subarray(numBytesWritten);
            }
            numBytesWritten = util_ts_1.copyBytes(
              data,
              this.buf,
              this.usedBufferBytes,
            );
            this.usedBufferBytes += numBytesWritten;
            totalBytesWritten += numBytesWritten;
            return totalBytesWritten;
          }
        };
        exports_25("BufWriterSync", BufWriterSync);
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/async/deferred",
  [],
  function (exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    /** Creates a Promise with the `reject` and `resolve` functions
     * placed as methods on the promise object itself. It allows you to do:
     *
     *     const p = deferred<number>();
     *     // ...
     *     p.resolve(42);
     */
    function deferred() {
      let methods;
      const promise = new Promise((resolve, reject) => {
        methods = { resolve, reject };
      });
      return Object.assign(promise, methods);
    }
    exports_26("deferred", deferred);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/async/delay",
  [],
  function (exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
    /* Resolves after the given number of milliseconds. */
    function delay(ms) {
      return new Promise((res) =>
        setTimeout(() => {
          res();
        }, ms)
      );
    }
    exports_27("delay", delay);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/async/mux_async_iterator",
  ["https://deno.land/std@0.56.0/async/deferred"],
  function (exports_28, context_28) {
    "use strict";
    var deferred_ts_1, MuxAsyncIterator;
    var __moduleName = context_28 && context_28.id;
    return {
      setters: [
        function (deferred_ts_1_1) {
          deferred_ts_1 = deferred_ts_1_1;
        },
      ],
      execute: function () {
        /** The MuxAsyncIterator class multiplexes multiple async iterators into a
             * single stream. It currently makes a few assumptions:
             * - The iterators do not throw.
             * - The final result (the value returned and not yielded from the iterator)
             *   does not matter; if there is any, it is discarded.
             */
        MuxAsyncIterator = class MuxAsyncIterator {
          constructor() {
            this.iteratorCount = 0;
            this.yields = [];
            this.signal = deferred_ts_1.deferred();
          }
          add(iterator) {
            ++this.iteratorCount;
            this.callIteratorNext(iterator);
          }
          async callIteratorNext(iterator) {
            const { value, done } = await iterator.next();
            if (done) {
              --this.iteratorCount;
            } else {
              this.yields.push({ iterator, value });
            }
            this.signal.resolve();
          }
          async *iterate() {
            while (this.iteratorCount > 0) {
              // Sleep until any of the wrapped iterators yields.
              await this.signal;
              // Note that while we're looping over `yields`, new items may be added.
              for (let i = 0; i < this.yields.length; i++) {
                const { iterator, value } = this.yields[i];
                yield value;
                this.callIteratorNext(iterator);
              }
              // Clear the `yields` list and reset the `signal` promise.
              this.yields.length = 0;
              this.signal = deferred_ts_1.deferred();
            }
          }
          [Symbol.asyncIterator]() {
            return this.iterate();
          }
        };
        exports_28("MuxAsyncIterator", MuxAsyncIterator);
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/async/mod",
  [
    "https://deno.land/std@0.56.0/async/deferred",
    "https://deno.land/std@0.56.0/async/delay",
    "https://deno.land/std@0.56.0/async/mux_async_iterator",
  ],
  function (exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    function exportStar_3(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default") exports[n] = m[n];
      }
      exports_29(exports);
    }
    return {
      setters: [
        function (deferred_ts_2_1) {
          exportStar_3(deferred_ts_2_1);
        },
        function (delay_ts_1_1) {
          exportStar_3(delay_ts_1_1);
        },
        function (mux_async_iterator_ts_1_1) {
          exportStar_3(mux_async_iterator_ts_1_1);
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/bytes/mod",
  ["https://deno.land/std@0.56.0/io/util"],
  function (exports_30, context_30) {
    "use strict";
    var util_ts_2;
    var __moduleName = context_30 && context_30.id;
    /** Find first index of binary pattern from a. If not found, then return -1
     * @param source soruce array
     * @param pat pattern to find in source array
     */
    function findIndex(source, pat) {
      const s = pat[0];
      for (let i = 0; i < source.length; i++) {
        if (source[i] !== s) {
          continue;
        }
        const pin = i;
        let matched = 1;
        let j = i;
        while (matched < pat.length) {
          j++;
          if (source[j] !== pat[j - pin]) {
            break;
          }
          matched++;
        }
        if (matched === pat.length) {
          return pin;
        }
      }
      return -1;
    }
    exports_30("findIndex", findIndex);
    /** Find last index of binary pattern from a. If not found, then return -1.
     * @param source soruce array
     * @param pat pattern to find in source array
     */
    function findLastIndex(source, pat) {
      const e = pat[pat.length - 1];
      for (let i = source.length - 1; i >= 0; i--) {
        if (source[i] !== e) {
          continue;
        }
        const pin = i;
        let matched = 1;
        let j = i;
        while (matched < pat.length) {
          j--;
          if (source[j] !== pat[pat.length - 1 - (pin - j)]) {
            break;
          }
          matched++;
        }
        if (matched === pat.length) {
          return pin - pat.length + 1;
        }
      }
      return -1;
    }
    exports_30("findLastIndex", findLastIndex);
    /** Check whether binary arrays are equal to each other.
     * @param source first array to check equality
     * @param match second array to check equality
     */
    function equal(source, match) {
      if (source.length !== match.length) {
        return false;
      }
      for (let i = 0; i < match.length; i++) {
        if (source[i] !== match[i]) {
          return false;
        }
      }
      return true;
    }
    exports_30("equal", equal);
    /** Check whether binary array starts with prefix.
     * @param source srouce array
     * @param prefix prefix array to check in source
     */
    function hasPrefix(source, prefix) {
      for (let i = 0, max = prefix.length; i < max; i++) {
        if (source[i] !== prefix[i]) {
          return false;
        }
      }
      return true;
    }
    exports_30("hasPrefix", hasPrefix);
    /** Check whether binary array ends with suffix.
     * @param source srouce array
     * @param suffix suffix array to check in source
     */
    function hasSuffix(source, suffix) {
      for (
        let srci = source.length - 1, sfxi = suffix.length - 1;
        sfxi >= 0;
        srci--, sfxi--
      ) {
        if (source[srci] !== suffix[sfxi]) {
          return false;
        }
      }
      return true;
    }
    exports_30("hasSuffix", hasSuffix);
    /** Repeat bytes. returns a new byte slice consisting of `count` copies of `b`.
     * @param origin The origin bytes
     * @param count The count you want to repeat.
     */
    function repeat(origin, count) {
      if (count === 0) {
        return new Uint8Array();
      }
      if (count < 0) {
        throw new Error("bytes: negative repeat count");
      } else if ((origin.length * count) / count !== origin.length) {
        throw new Error("bytes: repeat count causes overflow");
      }
      const int = Math.floor(count);
      if (int !== count) {
        throw new Error("bytes: repeat count must be an integer");
      }
      const nb = new Uint8Array(origin.length * count);
      let bp = util_ts_2.copyBytes(origin, nb);
      for (; bp < nb.length; bp *= 2) {
        util_ts_2.copyBytes(nb.slice(0, bp), nb, bp);
      }
      return nb;
    }
    exports_30("repeat", repeat);
    /** Concatenate two binary arrays and return new one.
     * @param origin origin array to concatenate
     * @param b array to concatenate with origin
     */
    function concat(origin, b) {
      const output = new Uint8Array(origin.length + b.length);
      output.set(origin, 0);
      output.set(b, origin.length);
      return output;
    }
    exports_30("concat", concat);
    /** Check srouce array contains pattern array.
     * @param source srouce array
     * @param pat patter array
     */
    function contains(source, pat) {
      return findIndex(source, pat) != -1;
    }
    exports_30("contains", contains);
    return {
      setters: [
        function (util_ts_2_1) {
          util_ts_2 = util_ts_2_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// Based on https://github.com/golang/go/tree/master/src/net/textproto
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
System.register(
  "https://deno.land/std@0.56.0/textproto/mod",
  [
    "https://deno.land/std@0.56.0/io/util",
    "https://deno.land/std@0.56.0/bytes/mod",
    "https://deno.land/std@0.56.0/encoding/utf8",
  ],
  function (exports_31, context_31) {
    "use strict";
    var util_ts_3, mod_ts_2, utf8_ts_2, invalidHeaderCharRegex, TextProtoReader;
    var __moduleName = context_31 && context_31.id;
    function str(buf) {
      if (buf == null) {
        return "";
      } else {
        return utf8_ts_2.decode(buf);
      }
    }
    return {
      setters: [
        function (util_ts_3_1) {
          util_ts_3 = util_ts_3_1;
        },
        function (mod_ts_2_1) {
          mod_ts_2 = mod_ts_2_1;
        },
        function (utf8_ts_2_1) {
          utf8_ts_2 = utf8_ts_2_1;
        },
      ],
      execute: function () {
        // FROM https://github.com/denoland/deno/blob/b34628a26ab0187a827aa4ebe256e23178e25d39/cli/js/web/headers.ts#L9
        invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/g;
        TextProtoReader = class TextProtoReader {
          constructor(r) {
            this.r = r;
          }
          /** readLine() reads a single line from the TextProtoReader,
                 * eliding the final \n or \r\n from the returned string.
                 */
          async readLine() {
            const s = await this.readLineSlice();
            if (s === null) {
              return null;
            }
            return str(s);
          }
          /** ReadMIMEHeader reads a MIME-style header from r.
                 * The header is a sequence of possibly continued Key: Value lines
                 * ending in a blank line.
                 * The returned map m maps CanonicalMIMEHeaderKey(key) to a
                 * sequence of values in the same order encountered in the input.
                 *
                 * For example, consider this input:
                 *
                 *	My-Key: Value 1
                 *	Long-Key: Even
                 *	       Longer Value
                 *	My-Key: Value 2
                 *
                 * Given that input, ReadMIMEHeader returns the map:
                 *
                 *	map[string][]string{
                 *		"My-Key": {"Value 1", "Value 2"},
                 *		"Long-Key": {"Even Longer Value"},
                 *	}
                 */
          async readMIMEHeader() {
            const m = new Headers();
            let line;
            // The first line cannot start with a leading space.
            let buf = await this.r.peek(1);
            if (buf === null) {
              return null;
            } else if (
              buf[0] == util_ts_3.charCode(" ") ||
              buf[0] == util_ts_3.charCode("\t")
            ) {
              line = (await this.readLineSlice());
            }
            buf = await this.r.peek(1);
            if (buf === null) {
              throw new Deno.errors.UnexpectedEof();
            } else if (
              buf[0] == util_ts_3.charCode(" ") ||
              buf[0] == util_ts_3.charCode("\t")
            ) {
              throw new Deno.errors.InvalidData(
                `malformed MIME header initial line: ${str(line)}`,
              );
            }
            while (true) {
              const kv = await this.readLineSlice(); // readContinuedLineSlice
              if (kv === null) {
                throw new Deno.errors.UnexpectedEof();
              }
              if (kv.byteLength === 0) {
                return m;
              }
              // Key ends at first colon
              let i = kv.indexOf(util_ts_3.charCode(":"));
              if (i < 0) {
                throw new Deno.errors.InvalidData(
                  `malformed MIME header line: ${str(kv)}`,
                );
              }
              //let key = canonicalMIMEHeaderKey(kv.subarray(0, endKey));
              const key = str(kv.subarray(0, i));
              // As per RFC 7230 field-name is a token,
              // tokens consist of one or more chars.
              // We could throw `Deno.errors.InvalidData` here,
              // but better to be liberal in what we
              // accept, so if we get an empty key, skip it.
              if (key == "") {
                continue;
              }
              // Skip initial spaces in value.
              i++; // skip colon
              while (
                i < kv.byteLength &&
                (kv[i] == util_ts_3.charCode(" ") ||
                  kv[i] == util_ts_3.charCode("\t"))
              ) {
                i++;
              }
              const value = str(kv.subarray(i)).replace(
                invalidHeaderCharRegex,
                encodeURI,
              );
              // In case of invalid header we swallow the error
              // example: "Audio Mode" => invalid due to space in the key
              try {
                m.append(key, value);
              } catch {}
            }
          }
          async readLineSlice() {
            // this.closeDot();
            let line;
            while (true) {
              const r = await this.r.readLine();
              if (r === null) {
                return null;
              }
              const { line: l, more } = r;
              // Avoid the copy if the first call produced a full line.
              if (!line && !more) {
                // TODO(ry):
                // This skipSpace() is definitely misplaced, but I don't know where it
                // comes from nor how to fix it.
                if (this.skipSpace(l) === 0) {
                  return new Uint8Array(0);
                }
                return l;
              }
              line = line ? mod_ts_2.concat(line, l) : l;
              if (!more) {
                break;
              }
            }
            return line;
          }
          skipSpace(l) {
            let n = 0;
            for (let i = 0; i < l.length; i++) {
              if (
                l[i] === util_ts_3.charCode(" ") ||
                l[i] === util_ts_3.charCode("\t")
              ) {
                continue;
              }
              n++;
            }
            return n;
          }
        };
        exports_31("TextProtoReader", TextProtoReader);
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.56.0/http/http_status",
  [],
  function (exports_32, context_32) {
    "use strict";
    var Status, STATUS_TEXT;
    var __moduleName = context_32 && context_32.id;
    return {
      setters: [],
      execute: function () {
        /** HTTP status codes */
        (function (Status) {
          /** RFC 7231, 6.2.1 */
          Status[Status["Continue"] = 100] = "Continue";
          /** RFC 7231, 6.2.2 */
          Status[Status["SwitchingProtocols"] = 101] = "SwitchingProtocols";
          /** RFC 2518, 10.1 */
          Status[Status["Processing"] = 102] = "Processing";
          /** RFC 8297 **/
          Status[Status["EarlyHints"] = 103] = "EarlyHints";
          /** RFC 7231, 6.3.1 */
          Status[Status["OK"] = 200] = "OK";
          /** RFC 7231, 6.3.2 */
          Status[Status["Created"] = 201] = "Created";
          /** RFC 7231, 6.3.3 */
          Status[Status["Accepted"] = 202] = "Accepted";
          /** RFC 7231, 6.3.4 */
          Status[Status["NonAuthoritativeInfo"] = 203] = "NonAuthoritativeInfo";
          /** RFC 7231, 6.3.5 */
          Status[Status["NoContent"] = 204] = "NoContent";
          /** RFC 7231, 6.3.6 */
          Status[Status["ResetContent"] = 205] = "ResetContent";
          /** RFC 7233, 4.1 */
          Status[Status["PartialContent"] = 206] = "PartialContent";
          /** RFC 4918, 11.1 */
          Status[Status["MultiStatus"] = 207] = "MultiStatus";
          /** RFC 5842, 7.1 */
          Status[Status["AlreadyReported"] = 208] = "AlreadyReported";
          /** RFC 3229, 10.4.1 */
          Status[Status["IMUsed"] = 226] = "IMUsed";
          /** RFC 7231, 6.4.1 */
          Status[Status["MultipleChoices"] = 300] = "MultipleChoices";
          /** RFC 7231, 6.4.2 */
          Status[Status["MovedPermanently"] = 301] = "MovedPermanently";
          /** RFC 7231, 6.4.3 */
          Status[Status["Found"] = 302] = "Found";
          /** RFC 7231, 6.4.4 */
          Status[Status["SeeOther"] = 303] = "SeeOther";
          /** RFC 7232, 4.1 */
          Status[Status["NotModified"] = 304] = "NotModified";
          /** RFC 7231, 6.4.5 */
          Status[Status["UseProxy"] = 305] = "UseProxy";
          /** RFC 7231, 6.4.7 */
          Status[Status["TemporaryRedirect"] = 307] = "TemporaryRedirect";
          /** RFC 7538, 3 */
          Status[Status["PermanentRedirect"] = 308] = "PermanentRedirect";
          /** RFC 7231, 6.5.1 */
          Status[Status["BadRequest"] = 400] = "BadRequest";
          /** RFC 7235, 3.1 */
          Status[Status["Unauthorized"] = 401] = "Unauthorized";
          /** RFC 7231, 6.5.2 */
          Status[Status["PaymentRequired"] = 402] = "PaymentRequired";
          /** RFC 7231, 6.5.3 */
          Status[Status["Forbidden"] = 403] = "Forbidden";
          /** RFC 7231, 6.5.4 */
          Status[Status["NotFound"] = 404] = "NotFound";
          /** RFC 7231, 6.5.5 */
          Status[Status["MethodNotAllowed"] = 405] = "MethodNotAllowed";
          /** RFC 7231, 6.5.6 */
          Status[Status["NotAcceptable"] = 406] = "NotAcceptable";
          /** RFC 7235, 3.2 */
          Status[Status["ProxyAuthRequired"] = 407] = "ProxyAuthRequired";
          /** RFC 7231, 6.5.7 */
          Status[Status["RequestTimeout"] = 408] = "RequestTimeout";
          /** RFC 7231, 6.5.8 */
          Status[Status["Conflict"] = 409] = "Conflict";
          /** RFC 7231, 6.5.9 */
          Status[Status["Gone"] = 410] = "Gone";
          /** RFC 7231, 6.5.10 */
          Status[Status["LengthRequired"] = 411] = "LengthRequired";
          /** RFC 7232, 4.2 */
          Status[Status["PreconditionFailed"] = 412] = "PreconditionFailed";
          /** RFC 7231, 6.5.11 */
          Status[Status["RequestEntityTooLarge"] = 413] =
            "RequestEntityTooLarge";
          /** RFC 7231, 6.5.12 */
          Status[Status["RequestURITooLong"] = 414] = "RequestURITooLong";
          /** RFC 7231, 6.5.13 */
          Status[Status["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
          /** RFC 7233, 4.4 */
          Status[Status["RequestedRangeNotSatisfiable"] = 416] =
            "RequestedRangeNotSatisfiable";
          /** RFC 7231, 6.5.14 */
          Status[Status["ExpectationFailed"] = 417] = "ExpectationFailed";
          /** RFC 7168, 2.3.3 */
          Status[Status["Teapot"] = 418] = "Teapot";
          /** RFC 7540, 9.1.2 */
          Status[Status["MisdirectedRequest"] = 421] = "MisdirectedRequest";
          /** RFC 4918, 11.2 */
          Status[Status["UnprocessableEntity"] = 422] = "UnprocessableEntity";
          /** RFC 4918, 11.3 */
          Status[Status["Locked"] = 423] = "Locked";
          /** RFC 4918, 11.4 */
          Status[Status["FailedDependency"] = 424] = "FailedDependency";
          /** RFC 8470, 5.2 */
          Status[Status["TooEarly"] = 425] = "TooEarly";
          /** RFC 7231, 6.5.15 */
          Status[Status["UpgradeRequired"] = 426] = "UpgradeRequired";
          /** RFC 6585, 3 */
          Status[Status["PreconditionRequired"] = 428] = "PreconditionRequired";
          /** RFC 6585, 4 */
          Status[Status["TooManyRequests"] = 429] = "TooManyRequests";
          /** RFC 6585, 5 */
          Status[Status["RequestHeaderFieldsTooLarge"] = 431] =
            "RequestHeaderFieldsTooLarge";
          /** RFC 7725, 3 */
          Status[Status["UnavailableForLegalReasons"] = 451] =
            "UnavailableForLegalReasons";
          /** RFC 7231, 6.6.1 */
          Status[Status["InternalServerError"] = 500] = "InternalServerError";
          /** RFC 7231, 6.6.2 */
          Status[Status["NotImplemented"] = 501] = "NotImplemented";
          /** RFC 7231, 6.6.3 */
          Status[Status["BadGateway"] = 502] = "BadGateway";
          /** RFC 7231, 6.6.4 */
          Status[Status["ServiceUnavailable"] = 503] = "ServiceUnavailable";
          /** RFC 7231, 6.6.5 */
          Status[Status["GatewayTimeout"] = 504] = "GatewayTimeout";
          /** RFC 7231, 6.6.6 */
          Status[Status["HTTPVersionNotSupported"] = 505] =
            "HTTPVersionNotSupported";
          /** RFC 2295, 8.1 */
          Status[Status["VariantAlsoNegotiates"] = 506] =
            "VariantAlsoNegotiates";
          /** RFC 4918, 11.5 */
          Status[Status["InsufficientStorage"] = 507] = "InsufficientStorage";
          /** RFC 5842, 7.2 */
          Status[Status["LoopDetected"] = 508] = "LoopDetected";
          /** RFC 2774, 7 */
          Status[Status["NotExtended"] = 510] = "NotExtended";
          /** RFC 6585, 6 */
          Status[Status["NetworkAuthenticationRequired"] = 511] =
            "NetworkAuthenticationRequired";
        })(Status || (Status = {}));
        exports_32("Status", Status);
        exports_32(
          "STATUS_TEXT",
          STATUS_TEXT = new Map([
            [Status.Continue, "Continue"],
            [Status.SwitchingProtocols, "Switching Protocols"],
            [Status.Processing, "Processing"],
            [Status.EarlyHints, "Early Hints"],
            [Status.OK, "OK"],
            [Status.Created, "Created"],
            [Status.Accepted, "Accepted"],
            [Status.NonAuthoritativeInfo, "Non-Authoritative Information"],
            [Status.NoContent, "No Content"],
            [Status.ResetContent, "Reset Content"],
            [Status.PartialContent, "Partial Content"],
            [Status.MultiStatus, "Multi-Status"],
            [Status.AlreadyReported, "Already Reported"],
            [Status.IMUsed, "IM Used"],
            [Status.MultipleChoices, "Multiple Choices"],
            [Status.MovedPermanently, "Moved Permanently"],
            [Status.Found, "Found"],
            [Status.SeeOther, "See Other"],
            [Status.NotModified, "Not Modified"],
            [Status.UseProxy, "Use Proxy"],
            [Status.TemporaryRedirect, "Temporary Redirect"],
            [Status.PermanentRedirect, "Permanent Redirect"],
            [Status.BadRequest, "Bad Request"],
            [Status.Unauthorized, "Unauthorized"],
            [Status.PaymentRequired, "Payment Required"],
            [Status.Forbidden, "Forbidden"],
            [Status.NotFound, "Not Found"],
            [Status.MethodNotAllowed, "Method Not Allowed"],
            [Status.NotAcceptable, "Not Acceptable"],
            [Status.ProxyAuthRequired, "Proxy Authentication Required"],
            [Status.RequestTimeout, "Request Timeout"],
            [Status.Conflict, "Conflict"],
            [Status.Gone, "Gone"],
            [Status.LengthRequired, "Length Required"],
            [Status.PreconditionFailed, "Precondition Failed"],
            [Status.RequestEntityTooLarge, "Request Entity Too Large"],
            [Status.RequestURITooLong, "Request URI Too Long"],
            [Status.UnsupportedMediaType, "Unsupported Media Type"],
            [
              Status.RequestedRangeNotSatisfiable,
              "Requested Range Not Satisfiable",
            ],
            [Status.ExpectationFailed, "Expectation Failed"],
            [Status.Teapot, "I'm a teapot"],
            [Status.MisdirectedRequest, "Misdirected Request"],
            [Status.UnprocessableEntity, "Unprocessable Entity"],
            [Status.Locked, "Locked"],
            [Status.FailedDependency, "Failed Dependency"],
            [Status.TooEarly, "Too Early"],
            [Status.UpgradeRequired, "Upgrade Required"],
            [Status.PreconditionRequired, "Precondition Required"],
            [Status.TooManyRequests, "Too Many Requests"],
            [
              Status.RequestHeaderFieldsTooLarge,
              "Request Header Fields Too Large",
            ],
            [
              Status.UnavailableForLegalReasons,
              "Unavailable For Legal Reasons",
            ],
            [Status.InternalServerError, "Internal Server Error"],
            [Status.NotImplemented, "Not Implemented"],
            [Status.BadGateway, "Bad Gateway"],
            [Status.ServiceUnavailable, "Service Unavailable"],
            [Status.GatewayTimeout, "Gateway Timeout"],
            [Status.HTTPVersionNotSupported, "HTTP Version Not Supported"],
            [Status.VariantAlsoNegotiates, "Variant Also Negotiates"],
            [Status.InsufficientStorage, "Insufficient Storage"],
            [Status.LoopDetected, "Loop Detected"],
            [Status.NotExtended, "Not Extended"],
            [
              Status.NetworkAuthenticationRequired,
              "Network Authentication Required",
            ],
          ]),
        );
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/http/_io",
  [
    "https://deno.land/std@0.56.0/io/bufio",
    "https://deno.land/std@0.56.0/textproto/mod",
    "https://deno.land/std@0.56.0/testing/asserts",
    "https://deno.land/std@0.56.0/encoding/utf8",
    "https://deno.land/std@0.56.0/http/server",
    "https://deno.land/std@0.56.0/http/http_status",
  ],
  function (exports_33, context_33) {
    "use strict";
    var bufio_ts_1,
      mod_ts_3,
      asserts_ts_4,
      utf8_ts_3,
      server_ts_1,
      http_status_ts_1;
    var __moduleName = context_33 && context_33.id;
    function emptyReader() {
      return {
        read(_) {
          return Promise.resolve(null);
        },
      };
    }
    exports_33("emptyReader", emptyReader);
    function bodyReader(contentLength, r) {
      let totalRead = 0;
      let finished = false;
      async function read(buf) {
        if (finished) {
          return null;
        }
        let result;
        const remaining = contentLength - totalRead;
        if (remaining >= buf.byteLength) {
          result = await r.read(buf);
        } else {
          const readBuf = buf.subarray(0, remaining);
          result = await r.read(readBuf);
        }
        if (result !== null) {
          totalRead += result;
        }
        finished = totalRead === contentLength;
        return result;
      }
      return { read };
    }
    exports_33("bodyReader", bodyReader);
    function chunkedBodyReader(h, r) {
      // Based on https://tools.ietf.org/html/rfc2616#section-19.4.6
      const tp = new mod_ts_3.TextProtoReader(r);
      let finished = false;
      const chunks = [];
      async function read(buf) {
        if (finished) {
          return null;
        }
        const [chunk] = chunks;
        if (chunk) {
          const chunkRemaining = chunk.data.byteLength - chunk.offset;
          const readLength = Math.min(chunkRemaining, buf.byteLength);
          for (let i = 0; i < readLength; i++) {
            buf[i] = chunk.data[chunk.offset + i];
          }
          chunk.offset += readLength;
          if (chunk.offset === chunk.data.byteLength) {
            chunks.shift();
            // Consume \r\n;
            if ((await tp.readLine()) === null) {
              throw new Deno.errors.UnexpectedEof();
            }
          }
          return readLength;
        }
        const line = await tp.readLine();
        if (line === null) {
          throw new Deno.errors.UnexpectedEof();
        }
        // TODO: handle chunk extension
        const [chunkSizeString] = line.split(";");
        const chunkSize = parseInt(chunkSizeString, 16);
        if (Number.isNaN(chunkSize) || chunkSize < 0) {
          throw new Error("Invalid chunk size");
        }
        if (chunkSize > 0) {
          if (chunkSize > buf.byteLength) {
            let eof = await r.readFull(buf);
            if (eof === null) {
              throw new Deno.errors.UnexpectedEof();
            }
            const restChunk = new Uint8Array(chunkSize - buf.byteLength);
            eof = await r.readFull(restChunk);
            if (eof === null) {
              throw new Deno.errors.UnexpectedEof();
            } else {
              chunks.push({
                offset: 0,
                data: restChunk,
              });
            }
            return buf.byteLength;
          } else {
            const bufToFill = buf.subarray(0, chunkSize);
            const eof = await r.readFull(bufToFill);
            if (eof === null) {
              throw new Deno.errors.UnexpectedEof();
            }
            // Consume \r\n
            if ((await tp.readLine()) === null) {
              throw new Deno.errors.UnexpectedEof();
            }
            return chunkSize;
          }
        } else {
          asserts_ts_4.assert(chunkSize === 0);
          // Consume \r\n
          if ((await r.readLine()) === null) {
            throw new Deno.errors.UnexpectedEof();
          }
          await readTrailers(h, r);
          finished = true;
          return null;
        }
      }
      return { read };
    }
    exports_33("chunkedBodyReader", chunkedBodyReader);
    function isProhibidedForTrailer(key) {
      const s = new Set(["transfer-encoding", "content-length", "trailer"]);
      return s.has(key.toLowerCase());
    }
    /**
     * Read trailer headers from reader and append values to headers.
     * "trailer" field will be deleted.
     * */
    async function readTrailers(headers, r) {
      const headerKeys = parseTrailer(headers.get("trailer"));
      if (!headerKeys) {
        return;
      }
      const tp = new mod_ts_3.TextProtoReader(r);
      const result = await tp.readMIMEHeader();
      asserts_ts_4.assert(result !== null, "trailer must be set");
      for (const [k, v] of result) {
        if (!headerKeys.has(k)) {
          throw new Error("Undeclared trailer field");
        }
        headerKeys.delete(k);
        headers.append(k, v);
      }
      asserts_ts_4.assert(
        Array.from(headerKeys).length === 0,
        "Missing trailers",
      );
      headers.delete("trailer");
    }
    exports_33("readTrailers", readTrailers);
    function parseTrailer(field) {
      if (field == null) {
        return undefined;
      }
      const keys = field.split(",").map((v) => v.trim().toLowerCase());
      if (keys.length === 0) {
        throw new Error("Empty trailer");
      }
      for (const key of keys) {
        if (isProhibidedForTrailer(key)) {
          throw new Error(`Prohibited field for trailer`);
        }
      }
      return new Headers(keys.map((key) => [key, ""]));
    }
    async function writeChunkedBody(w, r) {
      const writer = bufio_ts_1.BufWriter.create(w);
      for await (const chunk of Deno.iter(r)) {
        if (chunk.byteLength <= 0) {
          continue;
        }
        const start = utf8_ts_3.encoder.encode(
          `${chunk.byteLength.toString(16)}\r\n`,
        );
        const end = utf8_ts_3.encoder.encode("\r\n");
        await writer.write(start);
        await writer.write(chunk);
        await writer.write(end);
      }
      const endChunk = utf8_ts_3.encoder.encode("0\r\n\r\n");
      await writer.write(endChunk);
    }
    exports_33("writeChunkedBody", writeChunkedBody);
    /** write trailer headers to writer. it mostly should be called after writeResponse */
    async function writeTrailers(w, headers, trailers) {
      const trailer = headers.get("trailer");
      if (trailer === null) {
        throw new Error('response headers must have "trailer" header field');
      }
      const transferEncoding = headers.get("transfer-encoding");
      if (transferEncoding === null || !transferEncoding.match(/^chunked/)) {
        throw new Error(
          `trailer headers is only allowed for "transfer-encoding: chunked": got "${transferEncoding}"`,
        );
      }
      const writer = bufio_ts_1.BufWriter.create(w);
      const trailerHeaderFields = trailer
        .split(",")
        .map((s) => s.trim().toLowerCase());
      for (const f of trailerHeaderFields) {
        asserts_ts_4.assert(
          !isProhibidedForTrailer(f),
          `"${f}" is prohibited for trailer header`,
        );
      }
      for (const [key, value] of trailers) {
        asserts_ts_4.assert(
          trailerHeaderFields.includes(key),
          `Not trailer header field: ${key}`,
        );
        await writer.write(utf8_ts_3.encoder.encode(`${key}: ${value}\r\n`));
      }
      await writer.write(utf8_ts_3.encoder.encode("\r\n"));
      await writer.flush();
    }
    exports_33("writeTrailers", writeTrailers);
    async function writeResponse(w, r) {
      const protoMajor = 1;
      const protoMinor = 1;
      const statusCode = r.status || 200;
      const statusText = http_status_ts_1.STATUS_TEXT.get(statusCode);
      const writer = bufio_ts_1.BufWriter.create(w);
      if (!statusText) {
        throw new Deno.errors.InvalidData("Bad status code");
      }
      if (!r.body) {
        r.body = new Uint8Array();
      }
      if (typeof r.body === "string") {
        r.body = utf8_ts_3.encoder.encode(r.body);
      }
      let out =
        `HTTP/${protoMajor}.${protoMinor} ${statusCode} ${statusText}\r\n`;
      const headers = r.headers ?? new Headers();
      if (r.body && !headers.get("content-length")) {
        if (r.body instanceof Uint8Array) {
          out += `content-length: ${r.body.byteLength}\r\n`;
        } else if (!headers.get("transfer-encoding")) {
          out += "transfer-encoding: chunked\r\n";
        }
      }
      for (const [key, value] of headers) {
        out += `${key}: ${value}\r\n`;
      }
      out += `\r\n`;
      const header = utf8_ts_3.encoder.encode(out);
      const n = await writer.write(header);
      asserts_ts_4.assert(n === header.byteLength);
      if (r.body instanceof Uint8Array) {
        const n = await writer.write(r.body);
        asserts_ts_4.assert(n === r.body.byteLength);
      } else if (headers.has("content-length")) {
        const contentLength = headers.get("content-length");
        asserts_ts_4.assert(contentLength != null);
        const bodyLength = parseInt(contentLength);
        const n = await Deno.copy(r.body, writer);
        asserts_ts_4.assert(n === bodyLength);
      } else {
        await writeChunkedBody(writer, r.body);
      }
      if (r.trailers) {
        const t = await r.trailers();
        await writeTrailers(writer, headers, t);
      }
      await writer.flush();
    }
    exports_33("writeResponse", writeResponse);
    /**
     * ParseHTTPVersion parses a HTTP version string.
     * "HTTP/1.0" returns (1, 0).
     * Ported from https://github.com/golang/go/blob/f5c43b9/src/net/http/request.go#L766-L792
     */
    function parseHTTPVersion(vers) {
      switch (vers) {
        case "HTTP/1.1":
          return [1, 1];
        case "HTTP/1.0":
          return [1, 0];
        default: {
          const Big = 1000000; // arbitrary upper bound
          if (!vers.startsWith("HTTP/")) {
            break;
          }
          const dot = vers.indexOf(".");
          if (dot < 0) {
            break;
          }
          const majorStr = vers.substring(vers.indexOf("/") + 1, dot);
          const major = Number(majorStr);
          if (!Number.isInteger(major) || major < 0 || major > Big) {
            break;
          }
          const minorStr = vers.substring(dot + 1);
          const minor = Number(minorStr);
          if (!Number.isInteger(minor) || minor < 0 || minor > Big) {
            break;
          }
          return [major, minor];
        }
      }
      throw new Error(`malformed HTTP version ${vers}`);
    }
    exports_33("parseHTTPVersion", parseHTTPVersion);
    async function readRequest(conn, bufr) {
      const tp = new mod_ts_3.TextProtoReader(bufr);
      const firstLine = await tp.readLine(); // e.g. GET /index.html HTTP/1.0
      if (firstLine === null) {
        return null;
      }
      const headers = await tp.readMIMEHeader();
      if (headers === null) {
        throw new Deno.errors.UnexpectedEof();
      }
      const req = new server_ts_1.ServerRequest();
      req.conn = conn;
      req.r = bufr;
      [req.method, req.url, req.proto] = firstLine.split(" ", 3);
      [req.protoMinor, req.protoMajor] = parseHTTPVersion(req.proto);
      req.headers = headers;
      fixLength(req);
      return req;
    }
    exports_33("readRequest", readRequest);
    function fixLength(req) {
      const contentLength = req.headers.get("Content-Length");
      if (contentLength) {
        const arrClen = contentLength.split(",");
        if (arrClen.length > 1) {
          const distinct = [...new Set(arrClen.map((e) => e.trim()))];
          if (distinct.length > 1) {
            throw Error("cannot contain multiple Content-Length headers");
          } else {
            req.headers.set("Content-Length", distinct[0]);
          }
        }
        const c = req.headers.get("Content-Length");
        if (req.method === "HEAD" && c && c !== "0") {
          throw Error("http: method cannot contain a Content-Length");
        }
        if (c && req.headers.has("transfer-encoding")) {
          // A sender MUST NOT send a Content-Length header field in any message
          // that contains a Transfer-Encoding header field.
          // rfc: https://tools.ietf.org/html/rfc7230#section-3.3.2
          throw new Error(
            "http: Transfer-Encoding and Content-Length cannot be send together",
          );
        }
      }
    }
    return {
      setters: [
        function (bufio_ts_1_1) {
          bufio_ts_1 = bufio_ts_1_1;
        },
        function (mod_ts_3_1) {
          mod_ts_3 = mod_ts_3_1;
        },
        function (asserts_ts_4_1) {
          asserts_ts_4 = asserts_ts_4_1;
        },
        function (utf8_ts_3_1) {
          utf8_ts_3 = utf8_ts_3_1;
        },
        function (server_ts_1_1) {
          server_ts_1 = server_ts_1_1;
        },
        function (http_status_ts_1_1) {
          http_status_ts_1 = http_status_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/http/server",
  [
    "https://deno.land/std@0.56.0/encoding/utf8",
    "https://deno.land/std@0.56.0/io/bufio",
    "https://deno.land/std@0.56.0/testing/asserts",
    "https://deno.land/std@0.56.0/async/mod",
    "https://deno.land/std@0.56.0/http/_io",
  ],
  function (exports_34, context_34) {
    "use strict";
    var utf8_ts_4,
      bufio_ts_2,
      asserts_ts_5,
      mod_ts_4,
      _io_ts_1,
      listen,
      listenTls,
      ServerRequest,
      Server;
    var __moduleName = context_34 && context_34.id;
    /**
     * Create a HTTP server
     *
     *     import { serve } from "https://deno.land/std/http/server.ts";
     *     const body = "Hello World\n";
     *     const server = serve({ port: 8000 });
     *     for await (const req of server) {
     *       req.respond({ body });
     *     }
     */
    function serve(addr) {
      if (typeof addr === "string") {
        const [hostname, port] = addr.split(":");
        addr = { hostname, port: Number(port) };
      }
      const listener = listen(addr);
      return new Server(listener);
    }
    exports_34("serve", serve);
    /**
     * Start an HTTP server with given options and request handler
     *
     *     const body = "Hello World\n";
     *     const options = { port: 8000 };
     *     listenAndServe(options, (req) => {
     *       req.respond({ body });
     *     });
     *
     * @param options Server configuration
     * @param handler Request handler
     */
    async function listenAndServe(addr, handler) {
      const server = serve(addr);
      for await (const request of server) {
        handler(request);
      }
    }
    exports_34("listenAndServe", listenAndServe);
    /**
     * Create an HTTPS server with given options
     *
     *     const body = "Hello HTTPS";
     *     const options = {
     *       hostname: "localhost",
     *       port: 443,
     *       certFile: "./path/to/localhost.crt",
     *       keyFile: "./path/to/localhost.key",
     *     };
     *     for await (const req of serveTLS(options)) {
     *       req.respond({ body });
     *     }
     *
     * @param options Server configuration
     * @return Async iterable server instance for incoming requests
     */
    function serveTLS(options) {
      const tlsOptions = {
        ...options,
        transport: "tcp",
      };
      const listener = listenTls(tlsOptions);
      return new Server(listener);
    }
    exports_34("serveTLS", serveTLS);
    /**
     * Start an HTTPS server with given options and request handler
     *
     *     const body = "Hello HTTPS";
     *     const options = {
     *       hostname: "localhost",
     *       port: 443,
     *       certFile: "./path/to/localhost.crt",
     *       keyFile: "./path/to/localhost.key",
     *     };
     *     listenAndServeTLS(options, (req) => {
     *       req.respond({ body });
     *     });
     *
     * @param options Server configuration
     * @param handler Request handler
     */
    async function listenAndServeTLS(options, handler) {
      const server = serveTLS(options);
      for await (const request of server) {
        handler(request);
      }
    }
    exports_34("listenAndServeTLS", listenAndServeTLS);
    return {
      setters: [
        function (utf8_ts_4_1) {
          utf8_ts_4 = utf8_ts_4_1;
        },
        function (bufio_ts_2_1) {
          bufio_ts_2 = bufio_ts_2_1;
        },
        function (asserts_ts_5_1) {
          asserts_ts_5 = asserts_ts_5_1;
        },
        function (mod_ts_4_1) {
          mod_ts_4 = mod_ts_4_1;
        },
        function (_io_ts_1_1) {
          _io_ts_1 = _io_ts_1_1;
        },
      ],
      execute: function () {
        listen = Deno.listen, listenTls = Deno.listenTls;
        ServerRequest = class ServerRequest {
          constructor() {
            this.done = mod_ts_4.deferred();
            this._contentLength = undefined;
            this._body = null;
            this.finalized = false;
          }
          /**
                 * Value of Content-Length header.
                 * If null, then content length is invalid or not given (e.g. chunked encoding).
                 */
          get contentLength() {
            // undefined means not cached.
            // null means invalid or not provided.
            if (this._contentLength === undefined) {
              const cl = this.headers.get("content-length");
              if (cl) {
                this._contentLength = parseInt(cl);
                // Convert NaN to null (as NaN harder to test)
                if (Number.isNaN(this._contentLength)) {
                  this._contentLength = null;
                }
              } else {
                this._contentLength = null;
              }
            }
            return this._contentLength;
          }
          /**
                 * Body of the request.  The easiest way to consume the body is:
                 *
                 *     const buf: Uint8Array = await Deno.readAll(req.body);
                 */
          get body() {
            if (!this._body) {
              if (this.contentLength != null) {
                this._body = _io_ts_1.bodyReader(this.contentLength, this.r);
              } else {
                const transferEncoding = this.headers.get("transfer-encoding");
                if (transferEncoding != null) {
                  const parts = transferEncoding
                    .split(",")
                    .map((e) => e.trim().toLowerCase());
                  asserts_ts_5.assert(
                    parts.includes("chunked"),
                    'transfer-encoding must include "chunked" if content-length is not set',
                  );
                  this._body = _io_ts_1.chunkedBodyReader(this.headers, this.r);
                } else {
                  // Neither content-length nor transfer-encoding: chunked
                  this._body = _io_ts_1.emptyReader();
                }
              }
            }
            return this._body;
          }
          async respond(r) {
            let err;
            try {
              // Write our response!
              await _io_ts_1.writeResponse(this.w, r);
            } catch (e) {
              try {
                // Eagerly close on error.
                this.conn.close();
              } catch {}
              err = e;
            }
            // Signal that this request has been processed and the next pipelined
            // request on the same connection can be accepted.
            this.done.resolve(err);
            if (err) {
              // Error during responding, rethrow.
              throw err;
            }
          }
          async finalize() {
            if (this.finalized) {
              return;
            }
            // Consume unread body
            const body = this.body;
            const buf = new Uint8Array(1024);
            while ((await body.read(buf)) !== null) {}
            this.finalized = true;
          }
        };
        exports_34("ServerRequest", ServerRequest);
        Server = class Server {
          constructor(listener) {
            this.listener = listener;
            this.closing = false;
            this.connections = [];
          }
          close() {
            this.closing = true;
            this.listener.close();
            for (const conn of this.connections) {
              try {
                conn.close();
              } catch (e) {
                // Connection might have been already closed
                if (!(e instanceof Deno.errors.BadResource)) {
                  throw e;
                }
              }
            }
          }
          // Yields all HTTP requests on a single TCP connection.
          async *iterateHttpRequests(conn) {
            const reader = new bufio_ts_2.BufReader(conn);
            const writer = new bufio_ts_2.BufWriter(conn);
            while (!this.closing) {
              let request;
              try {
                request = await _io_ts_1.readRequest(conn, reader);
              } catch (error) {
                if (
                  error instanceof Deno.errors.InvalidData ||
                  error instanceof Deno.errors.UnexpectedEof
                ) {
                  // An error was thrown while parsing request headers.
                  await _io_ts_1.writeResponse(writer, {
                    status: 400,
                    body: utf8_ts_4.encode(`${error.message}\r\n\r\n`),
                  });
                }
                break;
              }
              if (request === null) {
                break;
              }
              request.w = writer;
              yield request;
              // Wait for the request to be processed before we accept a new request on
              // this connection.
              const responseError = await request.done;
              if (responseError) {
                // Something bad happened during response.
                // (likely other side closed during pipelined req)
                // req.done implies this connection already closed, so we can just return.
                this.untrackConnection(request.conn);
                return;
              }
              // Consume unread body and trailers if receiver didn't consume those data
              await request.finalize();
            }
            this.untrackConnection(conn);
            try {
              conn.close();
            } catch (e) {
              // might have been already closed
            }
          }
          trackConnection(conn) {
            this.connections.push(conn);
          }
          untrackConnection(conn) {
            const index = this.connections.indexOf(conn);
            if (index !== -1) {
              this.connections.splice(index, 1);
            }
          }
          // Accepts a new TCP connection and yields all HTTP requests that arrive on
          // it. When a connection is accepted, it also creates a new iterator of the
          // same kind and adds it to the request multiplexer so that another TCP
          // connection can be accepted.
          async *acceptConnAndIterateHttpRequests(mux) {
            if (this.closing) {
              return;
            }
            // Wait for a new connection.
            let conn;
            try {
              conn = await this.listener.accept();
            } catch (error) {
              if (error instanceof Deno.errors.BadResource) {
                return;
              }
              throw error;
            }
            this.trackConnection(conn);
            // Try to accept another connection and add it to the multiplexer.
            mux.add(this.acceptConnAndIterateHttpRequests(mux));
            // Yield the requests that arrive on the just-accepted connection.
            yield* this.iterateHttpRequests(conn);
          }
          [Symbol.asyncIterator]() {
            const mux = new mod_ts_4.MuxAsyncIterator();
            mux.add(this.acceptConnAndIterateHttpRequests(mux));
            return mux.iterate();
          }
        };
        exports_34("Server", Server);
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/datetime/mod",
  ["https://deno.land/std@0.56.0/testing/asserts"],
  function (exports_35, context_35) {
    "use strict";
    var asserts_ts_6;
    var __moduleName = context_35 && context_35.id;
    function execForce(reg, pat) {
      const v = reg.exec(pat);
      asserts_ts_6.assert(v != null);
      return v;
    }
    /**
     * Parse date from string using format string
     * @param dateStr Date string
     * @param format Format string
     * @return Parsed date
     */
    function parseDate(dateStr, format) {
      let m, d, y;
      let datePattern;
      switch (format) {
        case "mm-dd-yyyy":
          datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;
          [, m, d, y] = execForce(datePattern, dateStr);
          break;
        case "dd-mm-yyyy":
          datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;
          [, d, m, y] = execForce(datePattern, dateStr);
          break;
        case "yyyy-mm-dd":
          datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
          [, y, m, d] = execForce(datePattern, dateStr);
          break;
        default:
          throw new Error("Invalid date format!");
      }
      return new Date(Number(y), Number(m) - 1, Number(d));
    }
    exports_35("parseDate", parseDate);
    /**
     * Parse date & time from string using format string
     * @param dateStr Date & time string
     * @param format Format string
     * @return Parsed date
     */
    function parseDateTime(datetimeStr, format) {
      let m, d, y, ho, mi;
      let datePattern;
      switch (format) {
        case "mm-dd-yyyy hh:mm":
          datePattern = /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/;
          [, m, d, y, ho, mi] = execForce(datePattern, datetimeStr);
          break;
        case "dd-mm-yyyy hh:mm":
          datePattern = /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/;
          [, d, m, y, ho, mi] = execForce(datePattern, datetimeStr);
          break;
        case "yyyy-mm-dd hh:mm":
          datePattern = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/;
          [, y, m, d, ho, mi] = execForce(datePattern, datetimeStr);
          break;
        case "hh:mm mm-dd-yyyy":
          datePattern = /^(\d{2}):(\d{2}) (\d{2})-(\d{2})-(\d{4})$/;
          [, ho, mi, m, d, y] = execForce(datePattern, datetimeStr);
          break;
        case "hh:mm dd-mm-yyyy":
          datePattern = /^(\d{2}):(\d{2}) (\d{2})-(\d{2})-(\d{4})$/;
          [, ho, mi, d, m, y] = execForce(datePattern, datetimeStr);
          break;
        case "hh:mm yyyy-mm-dd":
          datePattern = /^(\d{2}):(\d{2}) (\d{4})-(\d{2})-(\d{2})$/;
          [, ho, mi, y, m, d] = execForce(datePattern, datetimeStr);
          break;
        default:
          throw new Error("Invalid datetime format!");
      }
      return new Date(
        Number(y),
        Number(m) - 1,
        Number(d),
        Number(ho),
        Number(mi),
      );
    }
    exports_35("parseDateTime", parseDateTime);
    /**
     * Get number of the day in the year
     * @return Number of the day in year
     */
    function dayOfYear(date) {
      const dayMs = 1000 * 60 * 60 * 24;
      const yearStart = new Date(date.getFullYear(), 0, 0);
      const diff = date.getTime() -
        yearStart.getTime() +
        (yearStart.getTimezoneOffset() - date.getTimezoneOffset()) * 60 *
          1000;
      return Math.floor(diff / dayMs);
    }
    exports_35("dayOfYear", dayOfYear);
    /**
     * Get number of current day in year
     * @return Number of current day in year
     */
    function currentDayOfYear() {
      return dayOfYear(new Date());
    }
    exports_35("currentDayOfYear", currentDayOfYear);
    /**
     * Parse a date to return a IMF formated string date
     * RFC: https://tools.ietf.org/html/rfc7231#section-7.1.1.1
     * IMF is the time format to use when generating times in HTTP
     * headers. The time being formatted must be in UTC for Format to
     * generate the correct format.
     * @param date Date to parse
     * @return IMF date formated string
     */
    function toIMF(date) {
      function dtPad(v, lPad = 2) {
        return v.padStart(lPad, "0");
      }
      const d = dtPad(date.getUTCDate().toString());
      const h = dtPad(date.getUTCHours().toString());
      const min = dtPad(date.getUTCMinutes().toString());
      const s = dtPad(date.getUTCSeconds().toString());
      const y = date.getUTCFullYear();
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${days[date.getUTCDay()]}, ${d} ${
        months[date.getUTCMonth()]
      } ${y} ${h}:${min}:${s} GMT`;
    }
    exports_35("toIMF", toIMF);
    return {
      setters: [
        function (asserts_ts_6_1) {
          asserts_ts_6 = asserts_ts_6_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/http/cookie",
  [
    "https://deno.land/std@0.56.0/testing/asserts",
    "https://deno.land/std@0.56.0/datetime/mod",
  ],
  function (exports_36, context_36) {
    "use strict";
    var asserts_ts_7, mod_ts_5;
    var __moduleName = context_36 && context_36.id;
    function toString(cookie) {
      if (!cookie.name) {
        return "";
      }
      const out = [];
      out.push(`${cookie.name}=${cookie.value}`);
      // Fallback for invalid Set-Cookie
      // ref: https://tools.ietf.org/html/draft-ietf-httpbis-cookie-prefixes-00#section-3.1
      if (cookie.name.startsWith("__Secure")) {
        cookie.secure = true;
      }
      if (cookie.name.startsWith("__Host")) {
        cookie.path = "/";
        cookie.secure = true;
        delete cookie.domain;
      }
      if (cookie.secure) {
        out.push("Secure");
      }
      if (cookie.httpOnly) {
        out.push("HttpOnly");
      }
      if (
        typeof cookie.maxAge === "number" && Number.isInteger(cookie.maxAge)
      ) {
        asserts_ts_7.assert(
          cookie.maxAge > 0,
          "Max-Age must be an integer superior to 0",
        );
        out.push(`Max-Age=${cookie.maxAge}`);
      }
      if (cookie.domain) {
        out.push(`Domain=${cookie.domain}`);
      }
      if (cookie.sameSite) {
        out.push(`SameSite=${cookie.sameSite}`);
      }
      if (cookie.path) {
        out.push(`Path=${cookie.path}`);
      }
      if (cookie.expires) {
        const dateString = mod_ts_5.toIMF(cookie.expires);
        out.push(`Expires=${dateString}`);
      }
      if (cookie.unparsed) {
        out.push(cookie.unparsed.join("; "));
      }
      return out.join("; ");
    }
    /**
     * Parse the cookies of the Server Request
     * @param req Server Request
     */
    function getCookies(req) {
      const cookie = req.headers.get("Cookie");
      if (cookie != null) {
        const out = {};
        const c = cookie.split(";");
        for (const kv of c) {
          const [cookieKey, ...cookieVal] = kv.split("=");
          asserts_ts_7.assert(cookieKey != null);
          const key = cookieKey.trim();
          out[key] = cookieVal.join("=");
        }
        return out;
      }
      return {};
    }
    exports_36("getCookies", getCookies);
    /**
     * Set the cookie header properly in the Response
     * @param res Server Response
     * @param cookie Cookie to set
     * Example:
     *
     *     setCookie(response, { name: 'deno', value: 'runtime',
     *        httpOnly: true, secure: true, maxAge: 2, domain: "deno.land" });
     */
    function setCookie(res, cookie) {
      if (!res.headers) {
        res.headers = new Headers();
      }
      // TODO (zekth) : Add proper parsing of Set-Cookie headers
      // Parsing cookie headers to make consistent set-cookie header
      // ref: https://tools.ietf.org/html/rfc6265#section-4.1.1
      const v = toString(cookie);
      if (v) {
        res.headers.append("Set-Cookie", v);
      }
    }
    exports_36("setCookie", setCookie);
    /**
     *  Set the cookie header properly in the Response to delete it
     * @param res Server Response
     * @param name Name of the cookie to Delete
     * Example:
     *
     *     delCookie(res,'foo');
     */
    function delCookie(res, name) {
      setCookie(res, {
        name: name,
        value: "",
        expires: new Date(0),
      });
    }
    exports_36("delCookie", delCookie);
    return {
      setters: [
        function (asserts_ts_7_1) {
          asserts_ts_7 = asserts_ts_7_1;
        },
        function (mod_ts_5_1) {
          mod_ts_5 = mod_ts_5_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/media_types@v2.3.5/db",
  [],
  function (exports_37, context_37) {
    "use strict";
    var db;
    var __moduleName = context_37 && context_37.id;
    return {
      setters: [],
      execute: function () {
        exports_37(
          "db",
          db = {
            "application/1d-interleaved-parityfec": {
              source: "iana",
            },
            "application/3gpdash-qoe-report+xml": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
            },
            "application/3gpp-ims+xml": {
              source: "iana",
              compressible: true,
            },
            "application/a2l": {
              source: "iana",
            },
            "application/activemessage": {
              source: "iana",
            },
            "application/activity+json": {
              source: "iana",
              compressible: true,
            },
            "application/alto-costmap+json": {
              source: "iana",
              compressible: true,
            },
            "application/alto-costmapfilter+json": {
              source: "iana",
              compressible: true,
            },
            "application/alto-directory+json": {
              source: "iana",
              compressible: true,
            },
            "application/alto-endpointcost+json": {
              source: "iana",
              compressible: true,
            },
            "application/alto-endpointcostparams+json": {
              source: "iana",
              compressible: true,
            },
            "application/alto-endpointprop+json": {
              source: "iana",
              compressible: true,
            },
            "application/alto-endpointpropparams+json": {
              source: "iana",
              compressible: true,
            },
            "application/alto-error+json": {
              source: "iana",
              compressible: true,
            },
            "application/alto-networkmap+json": {
              source: "iana",
              compressible: true,
            },
            "application/alto-networkmapfilter+json": {
              source: "iana",
              compressible: true,
            },
            "application/alto-updatestreamcontrol+json": {
              source: "iana",
              compressible: true,
            },
            "application/alto-updatestreamparams+json": {
              source: "iana",
              compressible: true,
            },
            "application/aml": {
              source: "iana",
            },
            "application/andrew-inset": {
              source: "iana",
              extensions: ["ez"],
            },
            "application/applefile": {
              source: "iana",
            },
            "application/applixware": {
              source: "apache",
              extensions: ["aw"],
            },
            "application/atf": {
              source: "iana",
            },
            "application/atfx": {
              source: "iana",
            },
            "application/atom+xml": {
              source: "iana",
              compressible: true,
              extensions: ["atom"],
            },
            "application/atomcat+xml": {
              source: "iana",
              compressible: true,
              extensions: ["atomcat"],
            },
            "application/atomdeleted+xml": {
              source: "iana",
              compressible: true,
              extensions: ["atomdeleted"],
            },
            "application/atomicmail": {
              source: "iana",
            },
            "application/atomsvc+xml": {
              source: "iana",
              compressible: true,
              extensions: ["atomsvc"],
            },
            "application/atsc-dwd+xml": {
              source: "iana",
              compressible: true,
              extensions: ["dwd"],
            },
            "application/atsc-dynamic-event-message": {
              source: "iana",
            },
            "application/atsc-held+xml": {
              source: "iana",
              compressible: true,
              extensions: ["held"],
            },
            "application/atsc-rdt+json": {
              source: "iana",
              compressible: true,
            },
            "application/atsc-rsat+xml": {
              source: "iana",
              compressible: true,
              extensions: ["rsat"],
            },
            "application/atxml": {
              source: "iana",
            },
            "application/auth-policy+xml": {
              source: "iana",
              compressible: true,
            },
            "application/bacnet-xdd+zip": {
              source: "iana",
              compressible: false,
            },
            "application/batch-smtp": {
              source: "iana",
            },
            "application/bdoc": {
              compressible: false,
              extensions: ["bdoc"],
            },
            "application/beep+xml": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
            },
            "application/calendar+json": {
              source: "iana",
              compressible: true,
            },
            "application/calendar+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xcs"],
            },
            "application/call-completion": {
              source: "iana",
            },
            "application/cals-1840": {
              source: "iana",
            },
            "application/cap+xml": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
            },
            "application/cbor": {
              source: "iana",
            },
            "application/cbor-seq": {
              source: "iana",
            },
            "application/cccex": {
              source: "iana",
            },
            "application/ccmp+xml": {
              source: "iana",
              compressible: true,
            },
            "application/ccxml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["ccxml"],
            },
            "application/cdfx+xml": {
              source: "iana",
              compressible: true,
              extensions: ["cdfx"],
            },
            "application/cdmi-capability": {
              source: "iana",
              extensions: ["cdmia"],
            },
            "application/cdmi-container": {
              source: "iana",
              extensions: ["cdmic"],
            },
            "application/cdmi-domain": {
              source: "iana",
              extensions: ["cdmid"],
            },
            "application/cdmi-object": {
              source: "iana",
              extensions: ["cdmio"],
            },
            "application/cdmi-queue": {
              source: "iana",
              extensions: ["cdmiq"],
            },
            "application/cdni": {
              source: "iana",
            },
            "application/cea": {
              source: "iana",
            },
            "application/cea-2018+xml": {
              source: "iana",
              compressible: true,
            },
            "application/cellml+xml": {
              source: "iana",
              compressible: true,
            },
            "application/cfw": {
              source: "iana",
            },
            "application/clue+xml": {
              source: "iana",
              compressible: true,
            },
            "application/clue_info+xml": {
              source: "iana",
              compressible: true,
            },
            "application/cms": {
              source: "iana",
            },
            "application/cnrp+xml": {
              source: "iana",
              compressible: true,
            },
            "application/coap-group+json": {
              source: "iana",
              compressible: true,
            },
            "application/coap-payload": {
              source: "iana",
            },
            "application/commonground": {
              source: "iana",
            },
            "application/conference-info+xml": {
              source: "iana",
              compressible: true,
            },
            "application/cose": {
              source: "iana",
            },
            "application/cose-key": {
              source: "iana",
            },
            "application/cose-key-set": {
              source: "iana",
            },
            "application/cpl+xml": {
              source: "iana",
              compressible: true,
            },
            "application/csrattrs": {
              source: "iana",
            },
            "application/csta+xml": {
              source: "iana",
              compressible: true,
            },
            "application/cstadata+xml": {
              source: "iana",
              compressible: true,
            },
            "application/csvm+json": {
              source: "iana",
              compressible: true,
            },
            "application/cu-seeme": {
              source: "apache",
              extensions: ["cu"],
            },
            "application/cwt": {
              source: "iana",
            },
            "application/cybercash": {
              source: "iana",
            },
            "application/dart": {
              compressible: true,
            },
            "application/dash+xml": {
              source: "iana",
              compressible: true,
              extensions: ["mpd"],
            },
            "application/dashdelta": {
              source: "iana",
            },
            "application/davmount+xml": {
              source: "iana",
              compressible: true,
              extensions: ["davmount"],
            },
            "application/dca-rft": {
              source: "iana",
            },
            "application/dcd": {
              source: "iana",
            },
            "application/dec-dx": {
              source: "iana",
            },
            "application/dialog-info+xml": {
              source: "iana",
              compressible: true,
            },
            "application/dicom": {
              source: "iana",
            },
            "application/dicom+json": {
              source: "iana",
              compressible: true,
            },
            "application/dicom+xml": {
              source: "iana",
              compressible: true,
            },
            "application/dii": {
              source: "iana",
            },
            "application/dit": {
              source: "iana",
            },
            "application/dns": {
              source: "iana",
            },
            "application/dns+json": {
              source: "iana",
              compressible: true,
            },
            "application/dns-message": {
              source: "iana",
            },
            "application/docbook+xml": {
              source: "apache",
              compressible: true,
              extensions: ["dbk"],
            },
            "application/dots+cbor": {
              source: "iana",
            },
            "application/dskpp+xml": {
              source: "iana",
              compressible: true,
            },
            "application/dssc+der": {
              source: "iana",
              extensions: ["dssc"],
            },
            "application/dssc+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xdssc"],
            },
            "application/dvcs": {
              source: "iana",
            },
            "application/ecmascript": {
              source: "iana",
              compressible: true,
              extensions: ["ecma", "es"],
            },
            "application/edi-consent": {
              source: "iana",
            },
            "application/edi-x12": {
              source: "iana",
              compressible: false,
            },
            "application/edifact": {
              source: "iana",
              compressible: false,
            },
            "application/efi": {
              source: "iana",
            },
            "application/emergencycalldata.comment+xml": {
              source: "iana",
              compressible: true,
            },
            "application/emergencycalldata.control+xml": {
              source: "iana",
              compressible: true,
            },
            "application/emergencycalldata.deviceinfo+xml": {
              source: "iana",
              compressible: true,
            },
            "application/emergencycalldata.ecall.msd": {
              source: "iana",
            },
            "application/emergencycalldata.providerinfo+xml": {
              source: "iana",
              compressible: true,
            },
            "application/emergencycalldata.serviceinfo+xml": {
              source: "iana",
              compressible: true,
            },
            "application/emergencycalldata.subscriberinfo+xml": {
              source: "iana",
              compressible: true,
            },
            "application/emergencycalldata.veds+xml": {
              source: "iana",
              compressible: true,
            },
            "application/emma+xml": {
              source: "iana",
              compressible: true,
              extensions: ["emma"],
            },
            "application/emotionml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["emotionml"],
            },
            "application/encaprtp": {
              source: "iana",
            },
            "application/epp+xml": {
              source: "iana",
              compressible: true,
            },
            "application/epub+zip": {
              source: "iana",
              compressible: false,
              extensions: ["epub"],
            },
            "application/eshop": {
              source: "iana",
            },
            "application/exi": {
              source: "iana",
              extensions: ["exi"],
            },
            "application/expect-ct-report+json": {
              source: "iana",
              compressible: true,
            },
            "application/fastinfoset": {
              source: "iana",
            },
            "application/fastsoap": {
              source: "iana",
            },
            "application/fdt+xml": {
              source: "iana",
              compressible: true,
              extensions: ["fdt"],
            },
            "application/fhir+json": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
            },
            "application/fhir+xml": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
            },
            "application/fido.trusted-apps+json": {
              compressible: true,
            },
            "application/fits": {
              source: "iana",
            },
            "application/flexfec": {
              source: "iana",
            },
            "application/font-sfnt": {
              source: "iana",
            },
            "application/font-tdpfr": {
              source: "iana",
              extensions: ["pfr"],
            },
            "application/font-woff": {
              source: "iana",
              compressible: false,
            },
            "application/framework-attributes+xml": {
              source: "iana",
              compressible: true,
            },
            "application/geo+json": {
              source: "iana",
              compressible: true,
              extensions: ["geojson"],
            },
            "application/geo+json-seq": {
              source: "iana",
            },
            "application/geopackage+sqlite3": {
              source: "iana",
            },
            "application/geoxacml+xml": {
              source: "iana",
              compressible: true,
            },
            "application/gltf-buffer": {
              source: "iana",
            },
            "application/gml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["gml"],
            },
            "application/gpx+xml": {
              source: "apache",
              compressible: true,
              extensions: ["gpx"],
            },
            "application/gxf": {
              source: "apache",
              extensions: ["gxf"],
            },
            "application/gzip": {
              source: "iana",
              compressible: false,
              extensions: ["gz"],
            },
            "application/h224": {
              source: "iana",
            },
            "application/held+xml": {
              source: "iana",
              compressible: true,
            },
            "application/hjson": {
              extensions: ["hjson"],
            },
            "application/http": {
              source: "iana",
            },
            "application/hyperstudio": {
              source: "iana",
              extensions: ["stk"],
            },
            "application/ibe-key-request+xml": {
              source: "iana",
              compressible: true,
            },
            "application/ibe-pkg-reply+xml": {
              source: "iana",
              compressible: true,
            },
            "application/ibe-pp-data": {
              source: "iana",
            },
            "application/iges": {
              source: "iana",
            },
            "application/im-iscomposing+xml": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
            },
            "application/index": {
              source: "iana",
            },
            "application/index.cmd": {
              source: "iana",
            },
            "application/index.obj": {
              source: "iana",
            },
            "application/index.response": {
              source: "iana",
            },
            "application/index.vnd": {
              source: "iana",
            },
            "application/inkml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["ink", "inkml"],
            },
            "application/iotp": {
              source: "iana",
            },
            "application/ipfix": {
              source: "iana",
              extensions: ["ipfix"],
            },
            "application/ipp": {
              source: "iana",
            },
            "application/isup": {
              source: "iana",
            },
            "application/its+xml": {
              source: "iana",
              compressible: true,
              extensions: ["its"],
            },
            "application/java-archive": {
              source: "apache",
              compressible: false,
              extensions: ["jar", "war", "ear"],
            },
            "application/java-serialized-object": {
              source: "apache",
              compressible: false,
              extensions: ["ser"],
            },
            "application/java-vm": {
              source: "apache",
              compressible: false,
              extensions: ["class"],
            },
            "application/javascript": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
              extensions: ["js", "mjs"],
            },
            "application/jf2feed+json": {
              source: "iana",
              compressible: true,
            },
            "application/jose": {
              source: "iana",
            },
            "application/jose+json": {
              source: "iana",
              compressible: true,
            },
            "application/jrd+json": {
              source: "iana",
              compressible: true,
            },
            "application/json": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
              extensions: ["json", "map"],
            },
            "application/json-patch+json": {
              source: "iana",
              compressible: true,
            },
            "application/json-seq": {
              source: "iana",
            },
            "application/json5": {
              extensions: ["json5"],
            },
            "application/jsonml+json": {
              source: "apache",
              compressible: true,
              extensions: ["jsonml"],
            },
            "application/jwk+json": {
              source: "iana",
              compressible: true,
            },
            "application/jwk-set+json": {
              source: "iana",
              compressible: true,
            },
            "application/jwt": {
              source: "iana",
            },
            "application/kpml-request+xml": {
              source: "iana",
              compressible: true,
            },
            "application/kpml-response+xml": {
              source: "iana",
              compressible: true,
            },
            "application/ld+json": {
              source: "iana",
              compressible: true,
              extensions: ["jsonld"],
            },
            "application/lgr+xml": {
              source: "iana",
              compressible: true,
              extensions: ["lgr"],
            },
            "application/link-format": {
              source: "iana",
            },
            "application/load-control+xml": {
              source: "iana",
              compressible: true,
            },
            "application/lost+xml": {
              source: "iana",
              compressible: true,
              extensions: ["lostxml"],
            },
            "application/lostsync+xml": {
              source: "iana",
              compressible: true,
            },
            "application/lpf+zip": {
              source: "iana",
              compressible: false,
            },
            "application/lxf": {
              source: "iana",
            },
            "application/mac-binhex40": {
              source: "iana",
              extensions: ["hqx"],
            },
            "application/mac-compactpro": {
              source: "apache",
              extensions: ["cpt"],
            },
            "application/macwriteii": {
              source: "iana",
            },
            "application/mads+xml": {
              source: "iana",
              compressible: true,
              extensions: ["mads"],
            },
            "application/manifest+json": {
              charset: "UTF-8",
              compressible: true,
              extensions: ["webmanifest"],
            },
            "application/marc": {
              source: "iana",
              extensions: ["mrc"],
            },
            "application/marcxml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["mrcx"],
            },
            "application/mathematica": {
              source: "iana",
              extensions: ["ma", "nb", "mb"],
            },
            "application/mathml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["mathml"],
            },
            "application/mathml-content+xml": {
              source: "iana",
              compressible: true,
            },
            "application/mathml-presentation+xml": {
              source: "iana",
              compressible: true,
            },
            "application/mbms-associated-procedure-description+xml": {
              source: "iana",
              compressible: true,
            },
            "application/mbms-deregister+xml": {
              source: "iana",
              compressible: true,
            },
            "application/mbms-envelope+xml": {
              source: "iana",
              compressible: true,
            },
            "application/mbms-msk+xml": {
              source: "iana",
              compressible: true,
            },
            "application/mbms-msk-response+xml": {
              source: "iana",
              compressible: true,
            },
            "application/mbms-protection-description+xml": {
              source: "iana",
              compressible: true,
            },
            "application/mbms-reception-report+xml": {
              source: "iana",
              compressible: true,
            },
            "application/mbms-register+xml": {
              source: "iana",
              compressible: true,
            },
            "application/mbms-register-response+xml": {
              source: "iana",
              compressible: true,
            },
            "application/mbms-schedule+xml": {
              source: "iana",
              compressible: true,
            },
            "application/mbms-user-service-description+xml": {
              source: "iana",
              compressible: true,
            },
            "application/mbox": {
              source: "iana",
              extensions: ["mbox"],
            },
            "application/media-policy-dataset+xml": {
              source: "iana",
              compressible: true,
            },
            "application/media_control+xml": {
              source: "iana",
              compressible: true,
            },
            "application/mediaservercontrol+xml": {
              source: "iana",
              compressible: true,
              extensions: ["mscml"],
            },
            "application/merge-patch+json": {
              source: "iana",
              compressible: true,
            },
            "application/metalink+xml": {
              source: "apache",
              compressible: true,
              extensions: ["metalink"],
            },
            "application/metalink4+xml": {
              source: "iana",
              compressible: true,
              extensions: ["meta4"],
            },
            "application/mets+xml": {
              source: "iana",
              compressible: true,
              extensions: ["mets"],
            },
            "application/mf4": {
              source: "iana",
            },
            "application/mikey": {
              source: "iana",
            },
            "application/mipc": {
              source: "iana",
            },
            "application/mmt-aei+xml": {
              source: "iana",
              compressible: true,
              extensions: ["maei"],
            },
            "application/mmt-usd+xml": {
              source: "iana",
              compressible: true,
              extensions: ["musd"],
            },
            "application/mods+xml": {
              source: "iana",
              compressible: true,
              extensions: ["mods"],
            },
            "application/moss-keys": {
              source: "iana",
            },
            "application/moss-signature": {
              source: "iana",
            },
            "application/mosskey-data": {
              source: "iana",
            },
            "application/mosskey-request": {
              source: "iana",
            },
            "application/mp21": {
              source: "iana",
              extensions: ["m21", "mp21"],
            },
            "application/mp4": {
              source: "iana",
              extensions: ["mp4s", "m4p"],
            },
            "application/mpeg4-generic": {
              source: "iana",
            },
            "application/mpeg4-iod": {
              source: "iana",
            },
            "application/mpeg4-iod-xmt": {
              source: "iana",
            },
            "application/mrb-consumer+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xdf"],
            },
            "application/mrb-publish+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xdf"],
            },
            "application/msc-ivr+xml": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
            },
            "application/msc-mixer+xml": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
            },
            "application/msword": {
              source: "iana",
              compressible: false,
              extensions: ["doc", "dot"],
            },
            "application/mud+json": {
              source: "iana",
              compressible: true,
            },
            "application/multipart-core": {
              source: "iana",
            },
            "application/mxf": {
              source: "iana",
              extensions: ["mxf"],
            },
            "application/n-quads": {
              source: "iana",
              extensions: ["nq"],
            },
            "application/n-triples": {
              source: "iana",
              extensions: ["nt"],
            },
            "application/nasdata": {
              source: "iana",
            },
            "application/news-checkgroups": {
              source: "iana",
              charset: "US-ASCII",
            },
            "application/news-groupinfo": {
              source: "iana",
              charset: "US-ASCII",
            },
            "application/news-transmission": {
              source: "iana",
            },
            "application/nlsml+xml": {
              source: "iana",
              compressible: true,
            },
            "application/node": {
              source: "iana",
              extensions: ["cjs"],
            },
            "application/nss": {
              source: "iana",
            },
            "application/ocsp-request": {
              source: "iana",
            },
            "application/ocsp-response": {
              source: "iana",
            },
            "application/octet-stream": {
              source: "iana",
              compressible: false,
              extensions: [
                "bin",
                "dms",
                "lrf",
                "mar",
                "so",
                "dist",
                "distz",
                "pkg",
                "bpk",
                "dump",
                "elc",
                "deploy",
                "exe",
                "dll",
                "deb",
                "dmg",
                "iso",
                "img",
                "msi",
                "msp",
                "msm",
                "buffer",
              ],
            },
            "application/oda": {
              source: "iana",
              extensions: ["oda"],
            },
            "application/odm+xml": {
              source: "iana",
              compressible: true,
            },
            "application/odx": {
              source: "iana",
            },
            "application/oebps-package+xml": {
              source: "iana",
              compressible: true,
              extensions: ["opf"],
            },
            "application/ogg": {
              source: "iana",
              compressible: false,
              extensions: ["ogx"],
            },
            "application/omdoc+xml": {
              source: "apache",
              compressible: true,
              extensions: ["omdoc"],
            },
            "application/onenote": {
              source: "apache",
              extensions: ["onetoc", "onetoc2", "onetmp", "onepkg"],
            },
            "application/oscore": {
              source: "iana",
            },
            "application/oxps": {
              source: "iana",
              extensions: ["oxps"],
            },
            "application/p2p-overlay+xml": {
              source: "iana",
              compressible: true,
              extensions: ["relo"],
            },
            "application/parityfec": {
              source: "iana",
            },
            "application/passport": {
              source: "iana",
            },
            "application/patch-ops-error+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xer"],
            },
            "application/pdf": {
              source: "iana",
              compressible: false,
              extensions: ["pdf"],
            },
            "application/pdx": {
              source: "iana",
            },
            "application/pem-certificate-chain": {
              source: "iana",
            },
            "application/pgp-encrypted": {
              source: "iana",
              compressible: false,
              extensions: ["pgp"],
            },
            "application/pgp-keys": {
              source: "iana",
            },
            "application/pgp-signature": {
              source: "iana",
              extensions: ["asc", "sig"],
            },
            "application/pics-rules": {
              source: "apache",
              extensions: ["prf"],
            },
            "application/pidf+xml": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
            },
            "application/pidf-diff+xml": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
            },
            "application/pkcs10": {
              source: "iana",
              extensions: ["p10"],
            },
            "application/pkcs12": {
              source: "iana",
            },
            "application/pkcs7-mime": {
              source: "iana",
              extensions: ["p7m", "p7c"],
            },
            "application/pkcs7-signature": {
              source: "iana",
              extensions: ["p7s"],
            },
            "application/pkcs8": {
              source: "iana",
              extensions: ["p8"],
            },
            "application/pkcs8-encrypted": {
              source: "iana",
            },
            "application/pkix-attr-cert": {
              source: "iana",
              extensions: ["ac"],
            },
            "application/pkix-cert": {
              source: "iana",
              extensions: ["cer"],
            },
            "application/pkix-crl": {
              source: "iana",
              extensions: ["crl"],
            },
            "application/pkix-pkipath": {
              source: "iana",
              extensions: ["pkipath"],
            },
            "application/pkixcmp": {
              source: "iana",
              extensions: ["pki"],
            },
            "application/pls+xml": {
              source: "iana",
              compressible: true,
              extensions: ["pls"],
            },
            "application/poc-settings+xml": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
            },
            "application/postscript": {
              source: "iana",
              compressible: true,
              extensions: ["ai", "eps", "ps"],
            },
            "application/ppsp-tracker+json": {
              source: "iana",
              compressible: true,
            },
            "application/problem+json": {
              source: "iana",
              compressible: true,
            },
            "application/problem+xml": {
              source: "iana",
              compressible: true,
            },
            "application/provenance+xml": {
              source: "iana",
              compressible: true,
              extensions: ["provx"],
            },
            "application/prs.alvestrand.titrax-sheet": {
              source: "iana",
            },
            "application/prs.cww": {
              source: "iana",
              extensions: ["cww"],
            },
            "application/prs.hpub+zip": {
              source: "iana",
              compressible: false,
            },
            "application/prs.nprend": {
              source: "iana",
            },
            "application/prs.plucker": {
              source: "iana",
            },
            "application/prs.rdf-xml-crypt": {
              source: "iana",
            },
            "application/prs.xsf+xml": {
              source: "iana",
              compressible: true,
            },
            "application/pskc+xml": {
              source: "iana",
              compressible: true,
              extensions: ["pskcxml"],
            },
            "application/pvd+json": {
              source: "iana",
              compressible: true,
            },
            "application/qsig": {
              source: "iana",
            },
            "application/raml+yaml": {
              compressible: true,
              extensions: ["raml"],
            },
            "application/raptorfec": {
              source: "iana",
            },
            "application/rdap+json": {
              source: "iana",
              compressible: true,
            },
            "application/rdf+xml": {
              source: "iana",
              compressible: true,
              extensions: ["rdf", "owl"],
            },
            "application/reginfo+xml": {
              source: "iana",
              compressible: true,
              extensions: ["rif"],
            },
            "application/relax-ng-compact-syntax": {
              source: "iana",
              extensions: ["rnc"],
            },
            "application/remote-printing": {
              source: "iana",
            },
            "application/reputon+json": {
              source: "iana",
              compressible: true,
            },
            "application/resource-lists+xml": {
              source: "iana",
              compressible: true,
              extensions: ["rl"],
            },
            "application/resource-lists-diff+xml": {
              source: "iana",
              compressible: true,
              extensions: ["rld"],
            },
            "application/rfc+xml": {
              source: "iana",
              compressible: true,
            },
            "application/riscos": {
              source: "iana",
            },
            "application/rlmi+xml": {
              source: "iana",
              compressible: true,
            },
            "application/rls-services+xml": {
              source: "iana",
              compressible: true,
              extensions: ["rs"],
            },
            "application/route-apd+xml": {
              source: "iana",
              compressible: true,
              extensions: ["rapd"],
            },
            "application/route-s-tsid+xml": {
              source: "iana",
              compressible: true,
              extensions: ["sls"],
            },
            "application/route-usd+xml": {
              source: "iana",
              compressible: true,
              extensions: ["rusd"],
            },
            "application/rpki-ghostbusters": {
              source: "iana",
              extensions: ["gbr"],
            },
            "application/rpki-manifest": {
              source: "iana",
              extensions: ["mft"],
            },
            "application/rpki-publication": {
              source: "iana",
            },
            "application/rpki-roa": {
              source: "iana",
              extensions: ["roa"],
            },
            "application/rpki-updown": {
              source: "iana",
            },
            "application/rsd+xml": {
              source: "apache",
              compressible: true,
              extensions: ["rsd"],
            },
            "application/rss+xml": {
              source: "apache",
              compressible: true,
              extensions: ["rss"],
            },
            "application/rtf": {
              source: "iana",
              compressible: true,
              extensions: ["rtf"],
            },
            "application/rtploopback": {
              source: "iana",
            },
            "application/rtx": {
              source: "iana",
            },
            "application/samlassertion+xml": {
              source: "iana",
              compressible: true,
            },
            "application/samlmetadata+xml": {
              source: "iana",
              compressible: true,
            },
            "application/sbe": {
              source: "iana",
            },
            "application/sbml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["sbml"],
            },
            "application/scaip+xml": {
              source: "iana",
              compressible: true,
            },
            "application/scim+json": {
              source: "iana",
              compressible: true,
            },
            "application/scvp-cv-request": {
              source: "iana",
              extensions: ["scq"],
            },
            "application/scvp-cv-response": {
              source: "iana",
              extensions: ["scs"],
            },
            "application/scvp-vp-request": {
              source: "iana",
              extensions: ["spq"],
            },
            "application/scvp-vp-response": {
              source: "iana",
              extensions: ["spp"],
            },
            "application/sdp": {
              source: "iana",
              extensions: ["sdp"],
            },
            "application/secevent+jwt": {
              source: "iana",
            },
            "application/senml+cbor": {
              source: "iana",
            },
            "application/senml+json": {
              source: "iana",
              compressible: true,
            },
            "application/senml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["senmlx"],
            },
            "application/senml-etch+cbor": {
              source: "iana",
            },
            "application/senml-etch+json": {
              source: "iana",
              compressible: true,
            },
            "application/senml-exi": {
              source: "iana",
            },
            "application/sensml+cbor": {
              source: "iana",
            },
            "application/sensml+json": {
              source: "iana",
              compressible: true,
            },
            "application/sensml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["sensmlx"],
            },
            "application/sensml-exi": {
              source: "iana",
            },
            "application/sep+xml": {
              source: "iana",
              compressible: true,
            },
            "application/sep-exi": {
              source: "iana",
            },
            "application/session-info": {
              source: "iana",
            },
            "application/set-payment": {
              source: "iana",
            },
            "application/set-payment-initiation": {
              source: "iana",
              extensions: ["setpay"],
            },
            "application/set-registration": {
              source: "iana",
            },
            "application/set-registration-initiation": {
              source: "iana",
              extensions: ["setreg"],
            },
            "application/sgml": {
              source: "iana",
            },
            "application/sgml-open-catalog": {
              source: "iana",
            },
            "application/shf+xml": {
              source: "iana",
              compressible: true,
              extensions: ["shf"],
            },
            "application/sieve": {
              source: "iana",
              extensions: ["siv", "sieve"],
            },
            "application/simple-filter+xml": {
              source: "iana",
              compressible: true,
            },
            "application/simple-message-summary": {
              source: "iana",
            },
            "application/simplesymbolcontainer": {
              source: "iana",
            },
            "application/sipc": {
              source: "iana",
            },
            "application/slate": {
              source: "iana",
            },
            "application/smil": {
              source: "iana",
            },
            "application/smil+xml": {
              source: "iana",
              compressible: true,
              extensions: ["smi", "smil"],
            },
            "application/smpte336m": {
              source: "iana",
            },
            "application/soap+fastinfoset": {
              source: "iana",
            },
            "application/soap+xml": {
              source: "iana",
              compressible: true,
            },
            "application/sparql-query": {
              source: "iana",
              extensions: ["rq"],
            },
            "application/sparql-results+xml": {
              source: "iana",
              compressible: true,
              extensions: ["srx"],
            },
            "application/spirits-event+xml": {
              source: "iana",
              compressible: true,
            },
            "application/sql": {
              source: "iana",
            },
            "application/srgs": {
              source: "iana",
              extensions: ["gram"],
            },
            "application/srgs+xml": {
              source: "iana",
              compressible: true,
              extensions: ["grxml"],
            },
            "application/sru+xml": {
              source: "iana",
              compressible: true,
              extensions: ["sru"],
            },
            "application/ssdl+xml": {
              source: "apache",
              compressible: true,
              extensions: ["ssdl"],
            },
            "application/ssml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["ssml"],
            },
            "application/stix+json": {
              source: "iana",
              compressible: true,
            },
            "application/swid+xml": {
              source: "iana",
              compressible: true,
              extensions: ["swidtag"],
            },
            "application/tamp-apex-update": {
              source: "iana",
            },
            "application/tamp-apex-update-confirm": {
              source: "iana",
            },
            "application/tamp-community-update": {
              source: "iana",
            },
            "application/tamp-community-update-confirm": {
              source: "iana",
            },
            "application/tamp-error": {
              source: "iana",
            },
            "application/tamp-sequence-adjust": {
              source: "iana",
            },
            "application/tamp-sequence-adjust-confirm": {
              source: "iana",
            },
            "application/tamp-status-query": {
              source: "iana",
            },
            "application/tamp-status-response": {
              source: "iana",
            },
            "application/tamp-update": {
              source: "iana",
            },
            "application/tamp-update-confirm": {
              source: "iana",
            },
            "application/tar": {
              compressible: true,
            },
            "application/taxii+json": {
              source: "iana",
              compressible: true,
            },
            "application/td+json": {
              source: "iana",
              compressible: true,
            },
            "application/tei+xml": {
              source: "iana",
              compressible: true,
              extensions: ["tei", "teicorpus"],
            },
            "application/tetra_isi": {
              source: "iana",
            },
            "application/thraud+xml": {
              source: "iana",
              compressible: true,
              extensions: ["tfi"],
            },
            "application/timestamp-query": {
              source: "iana",
            },
            "application/timestamp-reply": {
              source: "iana",
            },
            "application/timestamped-data": {
              source: "iana",
              extensions: ["tsd"],
            },
            "application/tlsrpt+gzip": {
              source: "iana",
            },
            "application/tlsrpt+json": {
              source: "iana",
              compressible: true,
            },
            "application/tnauthlist": {
              source: "iana",
            },
            "application/toml": {
              compressible: true,
              extensions: ["toml"],
            },
            "application/trickle-ice-sdpfrag": {
              source: "iana",
            },
            "application/trig": {
              source: "iana",
            },
            "application/ttml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["ttml"],
            },
            "application/tve-trigger": {
              source: "iana",
            },
            "application/tzif": {
              source: "iana",
            },
            "application/tzif-leap": {
              source: "iana",
            },
            "application/ulpfec": {
              source: "iana",
            },
            "application/urc-grpsheet+xml": {
              source: "iana",
              compressible: true,
            },
            "application/urc-ressheet+xml": {
              source: "iana",
              compressible: true,
              extensions: ["rsheet"],
            },
            "application/urc-targetdesc+xml": {
              source: "iana",
              compressible: true,
            },
            "application/urc-uisocketdesc+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vcard+json": {
              source: "iana",
              compressible: true,
            },
            "application/vcard+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vemmi": {
              source: "iana",
            },
            "application/vividence.scriptfile": {
              source: "apache",
            },
            "application/vnd.1000minds.decision-model+xml": {
              source: "iana",
              compressible: true,
              extensions: ["1km"],
            },
            "application/vnd.3gpp-prose+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp-prose-pc3ch+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp-v2x-local-service-information": {
              source: "iana",
            },
            "application/vnd.3gpp.access-transfer-events+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.bsf+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.gmop+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mc-signalling-ear": {
              source: "iana",
            },
            "application/vnd.3gpp.mcdata-affiliation-command+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcdata-info+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcdata-payload": {
              source: "iana",
            },
            "application/vnd.3gpp.mcdata-service-config+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcdata-signalling": {
              source: "iana",
            },
            "application/vnd.3gpp.mcdata-ue-config+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcdata-user-profile+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcptt-affiliation-command+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcptt-floor-request+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcptt-info+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcptt-location-info+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcptt-service-config+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcptt-signed+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcptt-ue-config+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcptt-ue-init-config+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcptt-user-profile+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcvideo-info+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcvideo-location-info+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcvideo-service-config+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcvideo-transmission-request+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcvideo-ue-config+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mcvideo-user-profile+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.mid-call+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.pic-bw-large": {
              source: "iana",
              extensions: ["plb"],
            },
            "application/vnd.3gpp.pic-bw-small": {
              source: "iana",
              extensions: ["psb"],
            },
            "application/vnd.3gpp.pic-bw-var": {
              source: "iana",
              extensions: ["pvb"],
            },
            "application/vnd.3gpp.sms": {
              source: "iana",
            },
            "application/vnd.3gpp.sms+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.srvcc-ext+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.srvcc-info+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.state-and-event-info+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp.ussd+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp2.bcmcsinfo+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.3gpp2.sms": {
              source: "iana",
            },
            "application/vnd.3gpp2.tcap": {
              source: "iana",
              extensions: ["tcap"],
            },
            "application/vnd.3lightssoftware.imagescal": {
              source: "iana",
            },
            "application/vnd.3m.post-it-notes": {
              source: "iana",
              extensions: ["pwn"],
            },
            "application/vnd.accpac.simply.aso": {
              source: "iana",
              extensions: ["aso"],
            },
            "application/vnd.accpac.simply.imp": {
              source: "iana",
              extensions: ["imp"],
            },
            "application/vnd.acucobol": {
              source: "iana",
              extensions: ["acu"],
            },
            "application/vnd.acucorp": {
              source: "iana",
              extensions: ["atc", "acutc"],
            },
            "application/vnd.adobe.air-application-installer-package+zip": {
              source: "apache",
              compressible: false,
              extensions: ["air"],
            },
            "application/vnd.adobe.flash.movie": {
              source: "iana",
            },
            "application/vnd.adobe.formscentral.fcdt": {
              source: "iana",
              extensions: ["fcdt"],
            },
            "application/vnd.adobe.fxp": {
              source: "iana",
              extensions: ["fxp", "fxpl"],
            },
            "application/vnd.adobe.partial-upload": {
              source: "iana",
            },
            "application/vnd.adobe.xdp+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xdp"],
            },
            "application/vnd.adobe.xfdf": {
              source: "iana",
              extensions: ["xfdf"],
            },
            "application/vnd.aether.imp": {
              source: "iana",
            },
            "application/vnd.afpc.afplinedata": {
              source: "iana",
            },
            "application/vnd.afpc.afplinedata-pagedef": {
              source: "iana",
            },
            "application/vnd.afpc.foca-charset": {
              source: "iana",
            },
            "application/vnd.afpc.foca-codedfont": {
              source: "iana",
            },
            "application/vnd.afpc.foca-codepage": {
              source: "iana",
            },
            "application/vnd.afpc.modca": {
              source: "iana",
            },
            "application/vnd.afpc.modca-formdef": {
              source: "iana",
            },
            "application/vnd.afpc.modca-mediummap": {
              source: "iana",
            },
            "application/vnd.afpc.modca-objectcontainer": {
              source: "iana",
            },
            "application/vnd.afpc.modca-overlay": {
              source: "iana",
            },
            "application/vnd.afpc.modca-pagesegment": {
              source: "iana",
            },
            "application/vnd.ah-barcode": {
              source: "iana",
            },
            "application/vnd.ahead.space": {
              source: "iana",
              extensions: ["ahead"],
            },
            "application/vnd.airzip.filesecure.azf": {
              source: "iana",
              extensions: ["azf"],
            },
            "application/vnd.airzip.filesecure.azs": {
              source: "iana",
              extensions: ["azs"],
            },
            "application/vnd.amadeus+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.amazon.ebook": {
              source: "apache",
              extensions: ["azw"],
            },
            "application/vnd.amazon.mobi8-ebook": {
              source: "iana",
            },
            "application/vnd.americandynamics.acc": {
              source: "iana",
              extensions: ["acc"],
            },
            "application/vnd.amiga.ami": {
              source: "iana",
              extensions: ["ami"],
            },
            "application/vnd.amundsen.maze+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.android.ota": {
              source: "iana",
            },
            "application/vnd.android.package-archive": {
              source: "apache",
              compressible: false,
              extensions: ["apk"],
            },
            "application/vnd.anki": {
              source: "iana",
            },
            "application/vnd.anser-web-certificate-issue-initiation": {
              source: "iana",
              extensions: ["cii"],
            },
            "application/vnd.anser-web-funds-transfer-initiation": {
              source: "apache",
              extensions: ["fti"],
            },
            "application/vnd.antix.game-component": {
              source: "iana",
              extensions: ["atx"],
            },
            "application/vnd.apache.thrift.binary": {
              source: "iana",
            },
            "application/vnd.apache.thrift.compact": {
              source: "iana",
            },
            "application/vnd.apache.thrift.json": {
              source: "iana",
            },
            "application/vnd.api+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.aplextor.warrp+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.apothekende.reservation+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.apple.installer+xml": {
              source: "iana",
              compressible: true,
              extensions: ["mpkg"],
            },
            "application/vnd.apple.keynote": {
              source: "iana",
              extensions: ["keynote"],
            },
            "application/vnd.apple.mpegurl": {
              source: "iana",
              extensions: ["m3u8"],
            },
            "application/vnd.apple.numbers": {
              source: "iana",
              extensions: ["numbers"],
            },
            "application/vnd.apple.pages": {
              source: "iana",
              extensions: ["pages"],
            },
            "application/vnd.apple.pkpass": {
              compressible: false,
              extensions: ["pkpass"],
            },
            "application/vnd.arastra.swi": {
              source: "iana",
            },
            "application/vnd.aristanetworks.swi": {
              source: "iana",
              extensions: ["swi"],
            },
            "application/vnd.artisan+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.artsquare": {
              source: "iana",
            },
            "application/vnd.astraea-software.iota": {
              source: "iana",
              extensions: ["iota"],
            },
            "application/vnd.audiograph": {
              source: "iana",
              extensions: ["aep"],
            },
            "application/vnd.autopackage": {
              source: "iana",
            },
            "application/vnd.avalon+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.avistar+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.balsamiq.bmml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["bmml"],
            },
            "application/vnd.balsamiq.bmpr": {
              source: "iana",
            },
            "application/vnd.banana-accounting": {
              source: "iana",
            },
            "application/vnd.bbf.usp.error": {
              source: "iana",
            },
            "application/vnd.bbf.usp.msg": {
              source: "iana",
            },
            "application/vnd.bbf.usp.msg+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.bekitzur-stech+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.bint.med-content": {
              source: "iana",
            },
            "application/vnd.biopax.rdf+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.blink-idb-value-wrapper": {
              source: "iana",
            },
            "application/vnd.blueice.multipass": {
              source: "iana",
              extensions: ["mpm"],
            },
            "application/vnd.bluetooth.ep.oob": {
              source: "iana",
            },
            "application/vnd.bluetooth.le.oob": {
              source: "iana",
            },
            "application/vnd.bmi": {
              source: "iana",
              extensions: ["bmi"],
            },
            "application/vnd.bpf": {
              source: "iana",
            },
            "application/vnd.bpf3": {
              source: "iana",
            },
            "application/vnd.businessobjects": {
              source: "iana",
              extensions: ["rep"],
            },
            "application/vnd.byu.uapi+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.cab-jscript": {
              source: "iana",
            },
            "application/vnd.canon-cpdl": {
              source: "iana",
            },
            "application/vnd.canon-lips": {
              source: "iana",
            },
            "application/vnd.capasystems-pg+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.cendio.thinlinc.clientconf": {
              source: "iana",
            },
            "application/vnd.century-systems.tcp_stream": {
              source: "iana",
            },
            "application/vnd.chemdraw+xml": {
              source: "iana",
              compressible: true,
              extensions: ["cdxml"],
            },
            "application/vnd.chess-pgn": {
              source: "iana",
            },
            "application/vnd.chipnuts.karaoke-mmd": {
              source: "iana",
              extensions: ["mmd"],
            },
            "application/vnd.ciedi": {
              source: "iana",
            },
            "application/vnd.cinderella": {
              source: "iana",
              extensions: ["cdy"],
            },
            "application/vnd.cirpack.isdn-ext": {
              source: "iana",
            },
            "application/vnd.citationstyles.style+xml": {
              source: "iana",
              compressible: true,
              extensions: ["csl"],
            },
            "application/vnd.claymore": {
              source: "iana",
              extensions: ["cla"],
            },
            "application/vnd.cloanto.rp9": {
              source: "iana",
              extensions: ["rp9"],
            },
            "application/vnd.clonk.c4group": {
              source: "iana",
              extensions: ["c4g", "c4d", "c4f", "c4p", "c4u"],
            },
            "application/vnd.cluetrust.cartomobile-config": {
              source: "iana",
              extensions: ["c11amc"],
            },
            "application/vnd.cluetrust.cartomobile-config-pkg": {
              source: "iana",
              extensions: ["c11amz"],
            },
            "application/vnd.coffeescript": {
              source: "iana",
            },
            "application/vnd.collabio.xodocuments.document": {
              source: "iana",
            },
            "application/vnd.collabio.xodocuments.document-template": {
              source: "iana",
            },
            "application/vnd.collabio.xodocuments.presentation": {
              source: "iana",
            },
            "application/vnd.collabio.xodocuments.presentation-template": {
              source: "iana",
            },
            "application/vnd.collabio.xodocuments.spreadsheet": {
              source: "iana",
            },
            "application/vnd.collabio.xodocuments.spreadsheet-template": {
              source: "iana",
            },
            "application/vnd.collection+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.collection.doc+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.collection.next+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.comicbook+zip": {
              source: "iana",
              compressible: false,
            },
            "application/vnd.comicbook-rar": {
              source: "iana",
            },
            "application/vnd.commerce-battelle": {
              source: "iana",
            },
            "application/vnd.commonspace": {
              source: "iana",
              extensions: ["csp"],
            },
            "application/vnd.contact.cmsg": {
              source: "iana",
              extensions: ["cdbcmsg"],
            },
            "application/vnd.coreos.ignition+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.cosmocaller": {
              source: "iana",
              extensions: ["cmc"],
            },
            "application/vnd.crick.clicker": {
              source: "iana",
              extensions: ["clkx"],
            },
            "application/vnd.crick.clicker.keyboard": {
              source: "iana",
              extensions: ["clkk"],
            },
            "application/vnd.crick.clicker.palette": {
              source: "iana",
              extensions: ["clkp"],
            },
            "application/vnd.crick.clicker.template": {
              source: "iana",
              extensions: ["clkt"],
            },
            "application/vnd.crick.clicker.wordbank": {
              source: "iana",
              extensions: ["clkw"],
            },
            "application/vnd.criticaltools.wbs+xml": {
              source: "iana",
              compressible: true,
              extensions: ["wbs"],
            },
            "application/vnd.cryptii.pipe+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.crypto-shade-file": {
              source: "iana",
            },
            "application/vnd.ctc-posml": {
              source: "iana",
              extensions: ["pml"],
            },
            "application/vnd.ctct.ws+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.cups-pdf": {
              source: "iana",
            },
            "application/vnd.cups-postscript": {
              source: "iana",
            },
            "application/vnd.cups-ppd": {
              source: "iana",
              extensions: ["ppd"],
            },
            "application/vnd.cups-raster": {
              source: "iana",
            },
            "application/vnd.cups-raw": {
              source: "iana",
            },
            "application/vnd.curl": {
              source: "iana",
            },
            "application/vnd.curl.car": {
              source: "apache",
              extensions: ["car"],
            },
            "application/vnd.curl.pcurl": {
              source: "apache",
              extensions: ["pcurl"],
            },
            "application/vnd.cyan.dean.root+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.cybank": {
              source: "iana",
            },
            "application/vnd.d2l.coursepackage1p0+zip": {
              source: "iana",
              compressible: false,
            },
            "application/vnd.dart": {
              source: "iana",
              compressible: true,
              extensions: ["dart"],
            },
            "application/vnd.data-vision.rdz": {
              source: "iana",
              extensions: ["rdz"],
            },
            "application/vnd.datapackage+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.dataresource+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.dbf": {
              source: "iana",
            },
            "application/vnd.debian.binary-package": {
              source: "iana",
            },
            "application/vnd.dece.data": {
              source: "iana",
              extensions: ["uvf", "uvvf", "uvd", "uvvd"],
            },
            "application/vnd.dece.ttml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["uvt", "uvvt"],
            },
            "application/vnd.dece.unspecified": {
              source: "iana",
              extensions: ["uvx", "uvvx"],
            },
            "application/vnd.dece.zip": {
              source: "iana",
              extensions: ["uvz", "uvvz"],
            },
            "application/vnd.denovo.fcselayout-link": {
              source: "iana",
              extensions: ["fe_launch"],
            },
            "application/vnd.desmume.movie": {
              source: "iana",
            },
            "application/vnd.dir-bi.plate-dl-nosuffix": {
              source: "iana",
            },
            "application/vnd.dm.delegation+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.dna": {
              source: "iana",
              extensions: ["dna"],
            },
            "application/vnd.document+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.dolby.mlp": {
              source: "apache",
              extensions: ["mlp"],
            },
            "application/vnd.dolby.mobile.1": {
              source: "iana",
            },
            "application/vnd.dolby.mobile.2": {
              source: "iana",
            },
            "application/vnd.doremir.scorecloud-binary-document": {
              source: "iana",
            },
            "application/vnd.dpgraph": {
              source: "iana",
              extensions: ["dpg"],
            },
            "application/vnd.dreamfactory": {
              source: "iana",
              extensions: ["dfac"],
            },
            "application/vnd.drive+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.ds-keypoint": {
              source: "apache",
              extensions: ["kpxx"],
            },
            "application/vnd.dtg.local": {
              source: "iana",
            },
            "application/vnd.dtg.local.flash": {
              source: "iana",
            },
            "application/vnd.dtg.local.html": {
              source: "iana",
            },
            "application/vnd.dvb.ait": {
              source: "iana",
              extensions: ["ait"],
            },
            "application/vnd.dvb.dvbisl+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.dvb.dvbj": {
              source: "iana",
            },
            "application/vnd.dvb.esgcontainer": {
              source: "iana",
            },
            "application/vnd.dvb.ipdcdftnotifaccess": {
              source: "iana",
            },
            "application/vnd.dvb.ipdcesgaccess": {
              source: "iana",
            },
            "application/vnd.dvb.ipdcesgaccess2": {
              source: "iana",
            },
            "application/vnd.dvb.ipdcesgpdd": {
              source: "iana",
            },
            "application/vnd.dvb.ipdcroaming": {
              source: "iana",
            },
            "application/vnd.dvb.iptv.alfec-base": {
              source: "iana",
            },
            "application/vnd.dvb.iptv.alfec-enhancement": {
              source: "iana",
            },
            "application/vnd.dvb.notif-aggregate-root+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.dvb.notif-container+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.dvb.notif-generic+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.dvb.notif-ia-msglist+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.dvb.notif-ia-registration-request+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.dvb.notif-ia-registration-response+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.dvb.notif-init+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.dvb.pfr": {
              source: "iana",
            },
            "application/vnd.dvb.service": {
              source: "iana",
              extensions: ["svc"],
            },
            "application/vnd.dxr": {
              source: "iana",
            },
            "application/vnd.dynageo": {
              source: "iana",
              extensions: ["geo"],
            },
            "application/vnd.dzr": {
              source: "iana",
            },
            "application/vnd.easykaraoke.cdgdownload": {
              source: "iana",
            },
            "application/vnd.ecdis-update": {
              source: "iana",
            },
            "application/vnd.ecip.rlp": {
              source: "iana",
            },
            "application/vnd.ecowin.chart": {
              source: "iana",
              extensions: ["mag"],
            },
            "application/vnd.ecowin.filerequest": {
              source: "iana",
            },
            "application/vnd.ecowin.fileupdate": {
              source: "iana",
            },
            "application/vnd.ecowin.series": {
              source: "iana",
            },
            "application/vnd.ecowin.seriesrequest": {
              source: "iana",
            },
            "application/vnd.ecowin.seriesupdate": {
              source: "iana",
            },
            "application/vnd.efi.img": {
              source: "iana",
            },
            "application/vnd.efi.iso": {
              source: "iana",
            },
            "application/vnd.emclient.accessrequest+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.enliven": {
              source: "iana",
              extensions: ["nml"],
            },
            "application/vnd.enphase.envoy": {
              source: "iana",
            },
            "application/vnd.eprints.data+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.epson.esf": {
              source: "iana",
              extensions: ["esf"],
            },
            "application/vnd.epson.msf": {
              source: "iana",
              extensions: ["msf"],
            },
            "application/vnd.epson.quickanime": {
              source: "iana",
              extensions: ["qam"],
            },
            "application/vnd.epson.salt": {
              source: "iana",
              extensions: ["slt"],
            },
            "application/vnd.epson.ssf": {
              source: "iana",
              extensions: ["ssf"],
            },
            "application/vnd.ericsson.quickcall": {
              source: "iana",
            },
            "application/vnd.espass-espass+zip": {
              source: "iana",
              compressible: false,
            },
            "application/vnd.eszigno3+xml": {
              source: "iana",
              compressible: true,
              extensions: ["es3", "et3"],
            },
            "application/vnd.etsi.aoc+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.etsi.asic-e+zip": {
              source: "iana",
              compressible: false,
            },
            "application/vnd.etsi.asic-s+zip": {
              source: "iana",
              compressible: false,
            },
            "application/vnd.etsi.cug+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.etsi.iptvcommand+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.etsi.iptvdiscovery+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.etsi.iptvprofile+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.etsi.iptvsad-bc+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.etsi.iptvsad-cod+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.etsi.iptvsad-npvr+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.etsi.iptvservice+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.etsi.iptvsync+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.etsi.iptvueprofile+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.etsi.mcid+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.etsi.mheg5": {
              source: "iana",
            },
            "application/vnd.etsi.overload-control-policy-dataset+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.etsi.pstn+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.etsi.sci+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.etsi.simservs+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.etsi.timestamp-token": {
              source: "iana",
            },
            "application/vnd.etsi.tsl+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.etsi.tsl.der": {
              source: "iana",
            },
            "application/vnd.eudora.data": {
              source: "iana",
            },
            "application/vnd.evolv.ecig.profile": {
              source: "iana",
            },
            "application/vnd.evolv.ecig.settings": {
              source: "iana",
            },
            "application/vnd.evolv.ecig.theme": {
              source: "iana",
            },
            "application/vnd.exstream-empower+zip": {
              source: "iana",
              compressible: false,
            },
            "application/vnd.exstream-package": {
              source: "iana",
            },
            "application/vnd.ezpix-album": {
              source: "iana",
              extensions: ["ez2"],
            },
            "application/vnd.ezpix-package": {
              source: "iana",
              extensions: ["ez3"],
            },
            "application/vnd.f-secure.mobile": {
              source: "iana",
            },
            "application/vnd.fastcopy-disk-image": {
              source: "iana",
            },
            "application/vnd.fdf": {
              source: "iana",
              extensions: ["fdf"],
            },
            "application/vnd.fdsn.mseed": {
              source: "iana",
              extensions: ["mseed"],
            },
            "application/vnd.fdsn.seed": {
              source: "iana",
              extensions: ["seed", "dataless"],
            },
            "application/vnd.ffsns": {
              source: "iana",
            },
            "application/vnd.ficlab.flb+zip": {
              source: "iana",
              compressible: false,
            },
            "application/vnd.filmit.zfc": {
              source: "iana",
            },
            "application/vnd.fints": {
              source: "iana",
            },
            "application/vnd.firemonkeys.cloudcell": {
              source: "iana",
            },
            "application/vnd.flographit": {
              source: "iana",
              extensions: ["gph"],
            },
            "application/vnd.fluxtime.clip": {
              source: "iana",
              extensions: ["ftc"],
            },
            "application/vnd.font-fontforge-sfd": {
              source: "iana",
            },
            "application/vnd.framemaker": {
              source: "iana",
              extensions: ["fm", "frame", "maker", "book"],
            },
            "application/vnd.frogans.fnc": {
              source: "iana",
              extensions: ["fnc"],
            },
            "application/vnd.frogans.ltf": {
              source: "iana",
              extensions: ["ltf"],
            },
            "application/vnd.fsc.weblaunch": {
              source: "iana",
              extensions: ["fsc"],
            },
            "application/vnd.fujitsu.oasys": {
              source: "iana",
              extensions: ["oas"],
            },
            "application/vnd.fujitsu.oasys2": {
              source: "iana",
              extensions: ["oa2"],
            },
            "application/vnd.fujitsu.oasys3": {
              source: "iana",
              extensions: ["oa3"],
            },
            "application/vnd.fujitsu.oasysgp": {
              source: "iana",
              extensions: ["fg5"],
            },
            "application/vnd.fujitsu.oasysprs": {
              source: "iana",
              extensions: ["bh2"],
            },
            "application/vnd.fujixerox.art-ex": {
              source: "iana",
            },
            "application/vnd.fujixerox.art4": {
              source: "iana",
            },
            "application/vnd.fujixerox.ddd": {
              source: "iana",
              extensions: ["ddd"],
            },
            "application/vnd.fujixerox.docuworks": {
              source: "iana",
              extensions: ["xdw"],
            },
            "application/vnd.fujixerox.docuworks.binder": {
              source: "iana",
              extensions: ["xbd"],
            },
            "application/vnd.fujixerox.docuworks.container": {
              source: "iana",
            },
            "application/vnd.fujixerox.hbpl": {
              source: "iana",
            },
            "application/vnd.fut-misnet": {
              source: "iana",
            },
            "application/vnd.futoin+cbor": {
              source: "iana",
            },
            "application/vnd.futoin+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.fuzzysheet": {
              source: "iana",
              extensions: ["fzs"],
            },
            "application/vnd.genomatix.tuxedo": {
              source: "iana",
              extensions: ["txd"],
            },
            "application/vnd.gentics.grd+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.geo+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.geocube+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.geogebra.file": {
              source: "iana",
              extensions: ["ggb"],
            },
            "application/vnd.geogebra.tool": {
              source: "iana",
              extensions: ["ggt"],
            },
            "application/vnd.geometry-explorer": {
              source: "iana",
              extensions: ["gex", "gre"],
            },
            "application/vnd.geonext": {
              source: "iana",
              extensions: ["gxt"],
            },
            "application/vnd.geoplan": {
              source: "iana",
              extensions: ["g2w"],
            },
            "application/vnd.geospace": {
              source: "iana",
              extensions: ["g3w"],
            },
            "application/vnd.gerber": {
              source: "iana",
            },
            "application/vnd.globalplatform.card-content-mgt": {
              source: "iana",
            },
            "application/vnd.globalplatform.card-content-mgt-response": {
              source: "iana",
            },
            "application/vnd.gmx": {
              source: "iana",
              extensions: ["gmx"],
            },
            "application/vnd.google-apps.document": {
              compressible: false,
              extensions: ["gdoc"],
            },
            "application/vnd.google-apps.presentation": {
              compressible: false,
              extensions: ["gslides"],
            },
            "application/vnd.google-apps.spreadsheet": {
              compressible: false,
              extensions: ["gsheet"],
            },
            "application/vnd.google-earth.kml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["kml"],
            },
            "application/vnd.google-earth.kmz": {
              source: "iana",
              compressible: false,
              extensions: ["kmz"],
            },
            "application/vnd.gov.sk.e-form+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.gov.sk.e-form+zip": {
              source: "iana",
              compressible: false,
            },
            "application/vnd.gov.sk.xmldatacontainer+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.grafeq": {
              source: "iana",
              extensions: ["gqf", "gqs"],
            },
            "application/vnd.gridmp": {
              source: "iana",
            },
            "application/vnd.groove-account": {
              source: "iana",
              extensions: ["gac"],
            },
            "application/vnd.groove-help": {
              source: "iana",
              extensions: ["ghf"],
            },
            "application/vnd.groove-identity-message": {
              source: "iana",
              extensions: ["gim"],
            },
            "application/vnd.groove-injector": {
              source: "iana",
              extensions: ["grv"],
            },
            "application/vnd.groove-tool-message": {
              source: "iana",
              extensions: ["gtm"],
            },
            "application/vnd.groove-tool-template": {
              source: "iana",
              extensions: ["tpl"],
            },
            "application/vnd.groove-vcard": {
              source: "iana",
              extensions: ["vcg"],
            },
            "application/vnd.hal+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.hal+xml": {
              source: "iana",
              compressible: true,
              extensions: ["hal"],
            },
            "application/vnd.handheld-entertainment+xml": {
              source: "iana",
              compressible: true,
              extensions: ["zmm"],
            },
            "application/vnd.hbci": {
              source: "iana",
              extensions: ["hbci"],
            },
            "application/vnd.hc+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.hcl-bireports": {
              source: "iana",
            },
            "application/vnd.hdt": {
              source: "iana",
            },
            "application/vnd.heroku+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.hhe.lesson-player": {
              source: "iana",
              extensions: ["les"],
            },
            "application/vnd.hp-hpgl": {
              source: "iana",
              extensions: ["hpgl"],
            },
            "application/vnd.hp-hpid": {
              source: "iana",
              extensions: ["hpid"],
            },
            "application/vnd.hp-hps": {
              source: "iana",
              extensions: ["hps"],
            },
            "application/vnd.hp-jlyt": {
              source: "iana",
              extensions: ["jlt"],
            },
            "application/vnd.hp-pcl": {
              source: "iana",
              extensions: ["pcl"],
            },
            "application/vnd.hp-pclxl": {
              source: "iana",
              extensions: ["pclxl"],
            },
            "application/vnd.httphone": {
              source: "iana",
            },
            "application/vnd.hydrostatix.sof-data": {
              source: "iana",
              extensions: ["sfd-hdstx"],
            },
            "application/vnd.hyper+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.hyper-item+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.hyperdrive+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.hzn-3d-crossword": {
              source: "iana",
            },
            "application/vnd.ibm.afplinedata": {
              source: "iana",
            },
            "application/vnd.ibm.electronic-media": {
              source: "iana",
            },
            "application/vnd.ibm.minipay": {
              source: "iana",
              extensions: ["mpy"],
            },
            "application/vnd.ibm.modcap": {
              source: "iana",
              extensions: ["afp", "listafp", "list3820"],
            },
            "application/vnd.ibm.rights-management": {
              source: "iana",
              extensions: ["irm"],
            },
            "application/vnd.ibm.secure-container": {
              source: "iana",
              extensions: ["sc"],
            },
            "application/vnd.iccprofile": {
              source: "iana",
              extensions: ["icc", "icm"],
            },
            "application/vnd.ieee.1905": {
              source: "iana",
            },
            "application/vnd.igloader": {
              source: "iana",
              extensions: ["igl"],
            },
            "application/vnd.imagemeter.folder+zip": {
              source: "iana",
              compressible: false,
            },
            "application/vnd.imagemeter.image+zip": {
              source: "iana",
              compressible: false,
            },
            "application/vnd.immervision-ivp": {
              source: "iana",
              extensions: ["ivp"],
            },
            "application/vnd.immervision-ivu": {
              source: "iana",
              extensions: ["ivu"],
            },
            "application/vnd.ims.imsccv1p1": {
              source: "iana",
            },
            "application/vnd.ims.imsccv1p2": {
              source: "iana",
            },
            "application/vnd.ims.imsccv1p3": {
              source: "iana",
            },
            "application/vnd.ims.lis.v2.result+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.ims.lti.v2.toolproxy+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.ims.lti.v2.toolproxy.id+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.ims.lti.v2.toolsettings+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.ims.lti.v2.toolsettings.simple+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.informedcontrol.rms+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.informix-visionary": {
              source: "iana",
            },
            "application/vnd.infotech.project": {
              source: "iana",
            },
            "application/vnd.infotech.project+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.innopath.wamp.notification": {
              source: "iana",
            },
            "application/vnd.insors.igm": {
              source: "iana",
              extensions: ["igm"],
            },
            "application/vnd.intercon.formnet": {
              source: "iana",
              extensions: ["xpw", "xpx"],
            },
            "application/vnd.intergeo": {
              source: "iana",
              extensions: ["i2g"],
            },
            "application/vnd.intertrust.digibox": {
              source: "iana",
            },
            "application/vnd.intertrust.nncp": {
              source: "iana",
            },
            "application/vnd.intu.qbo": {
              source: "iana",
              extensions: ["qbo"],
            },
            "application/vnd.intu.qfx": {
              source: "iana",
              extensions: ["qfx"],
            },
            "application/vnd.iptc.g2.catalogitem+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.iptc.g2.conceptitem+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.iptc.g2.knowledgeitem+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.iptc.g2.newsitem+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.iptc.g2.newsmessage+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.iptc.g2.packageitem+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.iptc.g2.planningitem+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.ipunplugged.rcprofile": {
              source: "iana",
              extensions: ["rcprofile"],
            },
            "application/vnd.irepository.package+xml": {
              source: "iana",
              compressible: true,
              extensions: ["irp"],
            },
            "application/vnd.is-xpr": {
              source: "iana",
              extensions: ["xpr"],
            },
            "application/vnd.isac.fcs": {
              source: "iana",
              extensions: ["fcs"],
            },
            "application/vnd.iso11783-10+zip": {
              source: "iana",
              compressible: false,
            },
            "application/vnd.jam": {
              source: "iana",
              extensions: ["jam"],
            },
            "application/vnd.japannet-directory-service": {
              source: "iana",
            },
            "application/vnd.japannet-jpnstore-wakeup": {
              source: "iana",
            },
            "application/vnd.japannet-payment-wakeup": {
              source: "iana",
            },
            "application/vnd.japannet-registration": {
              source: "iana",
            },
            "application/vnd.japannet-registration-wakeup": {
              source: "iana",
            },
            "application/vnd.japannet-setstore-wakeup": {
              source: "iana",
            },
            "application/vnd.japannet-verification": {
              source: "iana",
            },
            "application/vnd.japannet-verification-wakeup": {
              source: "iana",
            },
            "application/vnd.jcp.javame.midlet-rms": {
              source: "iana",
              extensions: ["rms"],
            },
            "application/vnd.jisp": {
              source: "iana",
              extensions: ["jisp"],
            },
            "application/vnd.joost.joda-archive": {
              source: "iana",
              extensions: ["joda"],
            },
            "application/vnd.jsk.isdn-ngn": {
              source: "iana",
            },
            "application/vnd.kahootz": {
              source: "iana",
              extensions: ["ktz", "ktr"],
            },
            "application/vnd.kde.karbon": {
              source: "iana",
              extensions: ["karbon"],
            },
            "application/vnd.kde.kchart": {
              source: "iana",
              extensions: ["chrt"],
            },
            "application/vnd.kde.kformula": {
              source: "iana",
              extensions: ["kfo"],
            },
            "application/vnd.kde.kivio": {
              source: "iana",
              extensions: ["flw"],
            },
            "application/vnd.kde.kontour": {
              source: "iana",
              extensions: ["kon"],
            },
            "application/vnd.kde.kpresenter": {
              source: "iana",
              extensions: ["kpr", "kpt"],
            },
            "application/vnd.kde.kspread": {
              source: "iana",
              extensions: ["ksp"],
            },
            "application/vnd.kde.kword": {
              source: "iana",
              extensions: ["kwd", "kwt"],
            },
            "application/vnd.kenameaapp": {
              source: "iana",
              extensions: ["htke"],
            },
            "application/vnd.kidspiration": {
              source: "iana",
              extensions: ["kia"],
            },
            "application/vnd.kinar": {
              source: "iana",
              extensions: ["kne", "knp"],
            },
            "application/vnd.koan": {
              source: "iana",
              extensions: ["skp", "skd", "skt", "skm"],
            },
            "application/vnd.kodak-descriptor": {
              source: "iana",
              extensions: ["sse"],
            },
            "application/vnd.las": {
              source: "iana",
            },
            "application/vnd.las.las+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.las.las+xml": {
              source: "iana",
              compressible: true,
              extensions: ["lasxml"],
            },
            "application/vnd.laszip": {
              source: "iana",
            },
            "application/vnd.leap+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.liberty-request+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.llamagraphics.life-balance.desktop": {
              source: "iana",
              extensions: ["lbd"],
            },
            "application/vnd.llamagraphics.life-balance.exchange+xml": {
              source: "iana",
              compressible: true,
              extensions: ["lbe"],
            },
            "application/vnd.logipipe.circuit+zip": {
              source: "iana",
              compressible: false,
            },
            "application/vnd.loom": {
              source: "iana",
            },
            "application/vnd.lotus-1-2-3": {
              source: "iana",
              extensions: ["123"],
            },
            "application/vnd.lotus-approach": {
              source: "iana",
              extensions: ["apr"],
            },
            "application/vnd.lotus-freelance": {
              source: "iana",
              extensions: ["pre"],
            },
            "application/vnd.lotus-notes": {
              source: "iana",
              extensions: ["nsf"],
            },
            "application/vnd.lotus-organizer": {
              source: "iana",
              extensions: ["org"],
            },
            "application/vnd.lotus-screencam": {
              source: "iana",
              extensions: ["scm"],
            },
            "application/vnd.lotus-wordpro": {
              source: "iana",
              extensions: ["lwp"],
            },
            "application/vnd.macports.portpkg": {
              source: "iana",
              extensions: ["portpkg"],
            },
            "application/vnd.mapbox-vector-tile": {
              source: "iana",
            },
            "application/vnd.marlin.drm.actiontoken+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.marlin.drm.conftoken+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.marlin.drm.license+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.marlin.drm.mdcf": {
              source: "iana",
            },
            "application/vnd.mason+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.maxmind.maxmind-db": {
              source: "iana",
            },
            "application/vnd.mcd": {
              source: "iana",
              extensions: ["mcd"],
            },
            "application/vnd.medcalcdata": {
              source: "iana",
              extensions: ["mc1"],
            },
            "application/vnd.mediastation.cdkey": {
              source: "iana",
              extensions: ["cdkey"],
            },
            "application/vnd.meridian-slingshot": {
              source: "iana",
            },
            "application/vnd.mfer": {
              source: "iana",
              extensions: ["mwf"],
            },
            "application/vnd.mfmp": {
              source: "iana",
              extensions: ["mfm"],
            },
            "application/vnd.micro+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.micrografx.flo": {
              source: "iana",
              extensions: ["flo"],
            },
            "application/vnd.micrografx.igx": {
              source: "iana",
              extensions: ["igx"],
            },
            "application/vnd.microsoft.portable-executable": {
              source: "iana",
            },
            "application/vnd.microsoft.windows.thumbnail-cache": {
              source: "iana",
            },
            "application/vnd.miele+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.mif": {
              source: "iana",
              extensions: ["mif"],
            },
            "application/vnd.minisoft-hp3000-save": {
              source: "iana",
            },
            "application/vnd.mitsubishi.misty-guard.trustweb": {
              source: "iana",
            },
            "application/vnd.mobius.daf": {
              source: "iana",
              extensions: ["daf"],
            },
            "application/vnd.mobius.dis": {
              source: "iana",
              extensions: ["dis"],
            },
            "application/vnd.mobius.mbk": {
              source: "iana",
              extensions: ["mbk"],
            },
            "application/vnd.mobius.mqy": {
              source: "iana",
              extensions: ["mqy"],
            },
            "application/vnd.mobius.msl": {
              source: "iana",
              extensions: ["msl"],
            },
            "application/vnd.mobius.plc": {
              source: "iana",
              extensions: ["plc"],
            },
            "application/vnd.mobius.txf": {
              source: "iana",
              extensions: ["txf"],
            },
            "application/vnd.mophun.application": {
              source: "iana",
              extensions: ["mpn"],
            },
            "application/vnd.mophun.certificate": {
              source: "iana",
              extensions: ["mpc"],
            },
            "application/vnd.motorola.flexsuite": {
              source: "iana",
            },
            "application/vnd.motorola.flexsuite.adsi": {
              source: "iana",
            },
            "application/vnd.motorola.flexsuite.fis": {
              source: "iana",
            },
            "application/vnd.motorola.flexsuite.gotap": {
              source: "iana",
            },
            "application/vnd.motorola.flexsuite.kmr": {
              source: "iana",
            },
            "application/vnd.motorola.flexsuite.ttc": {
              source: "iana",
            },
            "application/vnd.motorola.flexsuite.wem": {
              source: "iana",
            },
            "application/vnd.motorola.iprm": {
              source: "iana",
            },
            "application/vnd.mozilla.xul+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xul"],
            },
            "application/vnd.ms-3mfdocument": {
              source: "iana",
            },
            "application/vnd.ms-artgalry": {
              source: "iana",
              extensions: ["cil"],
            },
            "application/vnd.ms-asf": {
              source: "iana",
            },
            "application/vnd.ms-cab-compressed": {
              source: "iana",
              extensions: ["cab"],
            },
            "application/vnd.ms-color.iccprofile": {
              source: "apache",
            },
            "application/vnd.ms-excel": {
              source: "iana",
              compressible: false,
              extensions: ["xls", "xlm", "xla", "xlc", "xlt", "xlw"],
            },
            "application/vnd.ms-excel.addin.macroenabled.12": {
              source: "iana",
              extensions: ["xlam"],
            },
            "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
              source: "iana",
              extensions: ["xlsb"],
            },
            "application/vnd.ms-excel.sheet.macroenabled.12": {
              source: "iana",
              extensions: ["xlsm"],
            },
            "application/vnd.ms-excel.template.macroenabled.12": {
              source: "iana",
              extensions: ["xltm"],
            },
            "application/vnd.ms-fontobject": {
              source: "iana",
              compressible: true,
              extensions: ["eot"],
            },
            "application/vnd.ms-htmlhelp": {
              source: "iana",
              extensions: ["chm"],
            },
            "application/vnd.ms-ims": {
              source: "iana",
              extensions: ["ims"],
            },
            "application/vnd.ms-lrm": {
              source: "iana",
              extensions: ["lrm"],
            },
            "application/vnd.ms-office.activex+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.ms-officetheme": {
              source: "iana",
              extensions: ["thmx"],
            },
            "application/vnd.ms-opentype": {
              source: "apache",
              compressible: true,
            },
            "application/vnd.ms-outlook": {
              compressible: false,
              extensions: ["msg"],
            },
            "application/vnd.ms-package.obfuscated-opentype": {
              source: "apache",
            },
            "application/vnd.ms-pki.seccat": {
              source: "apache",
              extensions: ["cat"],
            },
            "application/vnd.ms-pki.stl": {
              source: "apache",
              extensions: ["stl"],
            },
            "application/vnd.ms-playready.initiator+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.ms-powerpoint": {
              source: "iana",
              compressible: false,
              extensions: ["ppt", "pps", "pot"],
            },
            "application/vnd.ms-powerpoint.addin.macroenabled.12": {
              source: "iana",
              extensions: ["ppam"],
            },
            "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
              source: "iana",
              extensions: ["pptm"],
            },
            "application/vnd.ms-powerpoint.slide.macroenabled.12": {
              source: "iana",
              extensions: ["sldm"],
            },
            "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
              source: "iana",
              extensions: ["ppsm"],
            },
            "application/vnd.ms-powerpoint.template.macroenabled.12": {
              source: "iana",
              extensions: ["potm"],
            },
            "application/vnd.ms-printdevicecapabilities+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.ms-printing.printticket+xml": {
              source: "apache",
              compressible: true,
            },
            "application/vnd.ms-printschematicket+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.ms-project": {
              source: "iana",
              extensions: ["mpp", "mpt"],
            },
            "application/vnd.ms-tnef": {
              source: "iana",
            },
            "application/vnd.ms-windows.devicepairing": {
              source: "iana",
            },
            "application/vnd.ms-windows.nwprinting.oob": {
              source: "iana",
            },
            "application/vnd.ms-windows.printerpairing": {
              source: "iana",
            },
            "application/vnd.ms-windows.wsd.oob": {
              source: "iana",
            },
            "application/vnd.ms-wmdrm.lic-chlg-req": {
              source: "iana",
            },
            "application/vnd.ms-wmdrm.lic-resp": {
              source: "iana",
            },
            "application/vnd.ms-wmdrm.meter-chlg-req": {
              source: "iana",
            },
            "application/vnd.ms-wmdrm.meter-resp": {
              source: "iana",
            },
            "application/vnd.ms-word.document.macroenabled.12": {
              source: "iana",
              extensions: ["docm"],
            },
            "application/vnd.ms-word.template.macroenabled.12": {
              source: "iana",
              extensions: ["dotm"],
            },
            "application/vnd.ms-works": {
              source: "iana",
              extensions: ["wps", "wks", "wcm", "wdb"],
            },
            "application/vnd.ms-wpl": {
              source: "iana",
              extensions: ["wpl"],
            },
            "application/vnd.ms-xpsdocument": {
              source: "iana",
              compressible: false,
              extensions: ["xps"],
            },
            "application/vnd.msa-disk-image": {
              source: "iana",
            },
            "application/vnd.mseq": {
              source: "iana",
              extensions: ["mseq"],
            },
            "application/vnd.msign": {
              source: "iana",
            },
            "application/vnd.multiad.creator": {
              source: "iana",
            },
            "application/vnd.multiad.creator.cif": {
              source: "iana",
            },
            "application/vnd.music-niff": {
              source: "iana",
            },
            "application/vnd.musician": {
              source: "iana",
              extensions: ["mus"],
            },
            "application/vnd.muvee.style": {
              source: "iana",
              extensions: ["msty"],
            },
            "application/vnd.mynfc": {
              source: "iana",
              extensions: ["taglet"],
            },
            "application/vnd.ncd.control": {
              source: "iana",
            },
            "application/vnd.ncd.reference": {
              source: "iana",
            },
            "application/vnd.nearst.inv+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.nervana": {
              source: "iana",
            },
            "application/vnd.netfpx": {
              source: "iana",
            },
            "application/vnd.neurolanguage.nlu": {
              source: "iana",
              extensions: ["nlu"],
            },
            "application/vnd.nimn": {
              source: "iana",
            },
            "application/vnd.nintendo.nitro.rom": {
              source: "iana",
            },
            "application/vnd.nintendo.snes.rom": {
              source: "iana",
            },
            "application/vnd.nitf": {
              source: "iana",
              extensions: ["ntf", "nitf"],
            },
            "application/vnd.noblenet-directory": {
              source: "iana",
              extensions: ["nnd"],
            },
            "application/vnd.noblenet-sealer": {
              source: "iana",
              extensions: ["nns"],
            },
            "application/vnd.noblenet-web": {
              source: "iana",
              extensions: ["nnw"],
            },
            "application/vnd.nokia.catalogs": {
              source: "iana",
            },
            "application/vnd.nokia.conml+wbxml": {
              source: "iana",
            },
            "application/vnd.nokia.conml+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.nokia.iptv.config+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.nokia.isds-radio-presets": {
              source: "iana",
            },
            "application/vnd.nokia.landmark+wbxml": {
              source: "iana",
            },
            "application/vnd.nokia.landmark+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.nokia.landmarkcollection+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.nokia.n-gage.ac+xml": {
              source: "iana",
              compressible: true,
              extensions: ["ac"],
            },
            "application/vnd.nokia.n-gage.data": {
              source: "iana",
              extensions: ["ngdat"],
            },
            "application/vnd.nokia.n-gage.symbian.install": {
              source: "iana",
              extensions: ["n-gage"],
            },
            "application/vnd.nokia.ncd": {
              source: "iana",
            },
            "application/vnd.nokia.pcd+wbxml": {
              source: "iana",
            },
            "application/vnd.nokia.pcd+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.nokia.radio-preset": {
              source: "iana",
              extensions: ["rpst"],
            },
            "application/vnd.nokia.radio-presets": {
              source: "iana",
              extensions: ["rpss"],
            },
            "application/vnd.novadigm.edm": {
              source: "iana",
              extensions: ["edm"],
            },
            "application/vnd.novadigm.edx": {
              source: "iana",
              extensions: ["edx"],
            },
            "application/vnd.novadigm.ext": {
              source: "iana",
              extensions: ["ext"],
            },
            "application/vnd.ntt-local.content-share": {
              source: "iana",
            },
            "application/vnd.ntt-local.file-transfer": {
              source: "iana",
            },
            "application/vnd.ntt-local.ogw_remote-access": {
              source: "iana",
            },
            "application/vnd.ntt-local.sip-ta_remote": {
              source: "iana",
            },
            "application/vnd.ntt-local.sip-ta_tcp_stream": {
              source: "iana",
            },
            "application/vnd.oasis.opendocument.chart": {
              source: "iana",
              extensions: ["odc"],
            },
            "application/vnd.oasis.opendocument.chart-template": {
              source: "iana",
              extensions: ["otc"],
            },
            "application/vnd.oasis.opendocument.database": {
              source: "iana",
              extensions: ["odb"],
            },
            "application/vnd.oasis.opendocument.formula": {
              source: "iana",
              extensions: ["odf"],
            },
            "application/vnd.oasis.opendocument.formula-template": {
              source: "iana",
              extensions: ["odft"],
            },
            "application/vnd.oasis.opendocument.graphics": {
              source: "iana",
              compressible: false,
              extensions: ["odg"],
            },
            "application/vnd.oasis.opendocument.graphics-template": {
              source: "iana",
              extensions: ["otg"],
            },
            "application/vnd.oasis.opendocument.image": {
              source: "iana",
              extensions: ["odi"],
            },
            "application/vnd.oasis.opendocument.image-template": {
              source: "iana",
              extensions: ["oti"],
            },
            "application/vnd.oasis.opendocument.presentation": {
              source: "iana",
              compressible: false,
              extensions: ["odp"],
            },
            "application/vnd.oasis.opendocument.presentation-template": {
              source: "iana",
              extensions: ["otp"],
            },
            "application/vnd.oasis.opendocument.spreadsheet": {
              source: "iana",
              compressible: false,
              extensions: ["ods"],
            },
            "application/vnd.oasis.opendocument.spreadsheet-template": {
              source: "iana",
              extensions: ["ots"],
            },
            "application/vnd.oasis.opendocument.text": {
              source: "iana",
              compressible: false,
              extensions: ["odt"],
            },
            "application/vnd.oasis.opendocument.text-master": {
              source: "iana",
              extensions: ["odm"],
            },
            "application/vnd.oasis.opendocument.text-template": {
              source: "iana",
              extensions: ["ott"],
            },
            "application/vnd.oasis.opendocument.text-web": {
              source: "iana",
              extensions: ["oth"],
            },
            "application/vnd.obn": {
              source: "iana",
            },
            "application/vnd.ocf+cbor": {
              source: "iana",
            },
            "application/vnd.oci.image.manifest.v1+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oftn.l10n+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oipf.contentaccessdownload+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oipf.contentaccessstreaming+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oipf.cspg-hexbinary": {
              source: "iana",
            },
            "application/vnd.oipf.dae.svg+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oipf.dae.xhtml+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oipf.mippvcontrolmessage+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oipf.pae.gem": {
              source: "iana",
            },
            "application/vnd.oipf.spdiscovery+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oipf.spdlist+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oipf.ueprofile+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oipf.userprofile+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.olpc-sugar": {
              source: "iana",
              extensions: ["xo"],
            },
            "application/vnd.oma-scws-config": {
              source: "iana",
            },
            "application/vnd.oma-scws-http-request": {
              source: "iana",
            },
            "application/vnd.oma-scws-http-response": {
              source: "iana",
            },
            "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.bcast.drm-trigger+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.bcast.imd+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.bcast.ltkm": {
              source: "iana",
            },
            "application/vnd.oma.bcast.notification+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.bcast.provisioningtrigger": {
              source: "iana",
            },
            "application/vnd.oma.bcast.sgboot": {
              source: "iana",
            },
            "application/vnd.oma.bcast.sgdd+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.bcast.sgdu": {
              source: "iana",
            },
            "application/vnd.oma.bcast.simple-symbol-container": {
              source: "iana",
            },
            "application/vnd.oma.bcast.smartcard-trigger+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.bcast.sprov+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.bcast.stkm": {
              source: "iana",
            },
            "application/vnd.oma.cab-address-book+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.cab-feature-handler+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.cab-pcc+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.cab-subs-invite+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.cab-user-prefs+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.dcd": {
              source: "iana",
            },
            "application/vnd.oma.dcdc": {
              source: "iana",
            },
            "application/vnd.oma.dd2+xml": {
              source: "iana",
              compressible: true,
              extensions: ["dd2"],
            },
            "application/vnd.oma.drm.risd+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.group-usage-list+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.lwm2m+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.lwm2m+tlv": {
              source: "iana",
            },
            "application/vnd.oma.pal+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.poc.detailed-progress-report+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.poc.final-report+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.poc.groups+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.poc.invocation-descriptor+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.poc.optimized-progress-report+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.push": {
              source: "iana",
            },
            "application/vnd.oma.scidm.messages+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oma.xcap-directory+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.omads-email+xml": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
            },
            "application/vnd.omads-file+xml": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
            },
            "application/vnd.omads-folder+xml": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
            },
            "application/vnd.omaloc-supl-init": {
              source: "iana",
            },
            "application/vnd.onepager": {
              source: "iana",
            },
            "application/vnd.onepagertamp": {
              source: "iana",
            },
            "application/vnd.onepagertamx": {
              source: "iana",
            },
            "application/vnd.onepagertat": {
              source: "iana",
            },
            "application/vnd.onepagertatp": {
              source: "iana",
            },
            "application/vnd.onepagertatx": {
              source: "iana",
            },
            "application/vnd.openblox.game+xml": {
              source: "iana",
              compressible: true,
              extensions: ["obgx"],
            },
            "application/vnd.openblox.game-binary": {
              source: "iana",
            },
            "application/vnd.openeye.oeb": {
              source: "iana",
            },
            "application/vnd.openofficeorg.extension": {
              source: "apache",
              extensions: ["oxt"],
            },
            "application/vnd.openstreetmap.data+xml": {
              source: "iana",
              compressible: true,
              extensions: ["osm"],
            },
            "application/vnd.openxmlformats-officedocument.custom-properties+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.customxmlproperties+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.drawing+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.openxmlformats-officedocument.drawingml.chart+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.extended-properties+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.presentationml.comments+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.presentationml.presentation":
              {
                source: "iana",
                compressible: false,
                extensions: ["pptx"],
              },
            "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.presentationml.slide":
              {
                source: "iana",
                extensions: ["sldx"],
              },
            "application/vnd.openxmlformats-officedocument.presentationml.slide+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.presentationml.slideshow":
              {
                source: "iana",
                extensions: ["ppsx"],
              },
            "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.presentationml.tags+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.presentationml.template":
              {
                source: "iana",
                extensions: ["potx"],
              },
            "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
              {
                source: "iana",
                compressible: false,
                extensions: ["xlsx"],
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.template":
              {
                source: "iana",
                extensions: ["xltx"],
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.theme+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.openxmlformats-officedocument.vmldrawing": {
              source: "iana",
            },
            "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              {
                source: "iana",
                compressible: false,
                extensions: ["docx"],
              },
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
              {
                source: "iana",
                extensions: ["dotx"],
              },
            "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-package.core-properties+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml":
              {
                source: "iana",
                compressible: true,
              },
            "application/vnd.openxmlformats-package.relationships+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oracle.resource+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.orange.indata": {
              source: "iana",
            },
            "application/vnd.osa.netdeploy": {
              source: "iana",
            },
            "application/vnd.osgeo.mapguide.package": {
              source: "iana",
              extensions: ["mgp"],
            },
            "application/vnd.osgi.bundle": {
              source: "iana",
            },
            "application/vnd.osgi.dp": {
              source: "iana",
              extensions: ["dp"],
            },
            "application/vnd.osgi.subsystem": {
              source: "iana",
              extensions: ["esa"],
            },
            "application/vnd.otps.ct-kip+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.oxli.countgraph": {
              source: "iana",
            },
            "application/vnd.pagerduty+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.palm": {
              source: "iana",
              extensions: ["pdb", "pqa", "oprc"],
            },
            "application/vnd.panoply": {
              source: "iana",
            },
            "application/vnd.paos.xml": {
              source: "iana",
            },
            "application/vnd.patentdive": {
              source: "iana",
            },
            "application/vnd.patientecommsdoc": {
              source: "iana",
            },
            "application/vnd.pawaafile": {
              source: "iana",
              extensions: ["paw"],
            },
            "application/vnd.pcos": {
              source: "iana",
            },
            "application/vnd.pg.format": {
              source: "iana",
              extensions: ["str"],
            },
            "application/vnd.pg.osasli": {
              source: "iana",
              extensions: ["ei6"],
            },
            "application/vnd.piaccess.application-licence": {
              source: "iana",
            },
            "application/vnd.picsel": {
              source: "iana",
              extensions: ["efif"],
            },
            "application/vnd.pmi.widget": {
              source: "iana",
              extensions: ["wg"],
            },
            "application/vnd.poc.group-advertisement+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.pocketlearn": {
              source: "iana",
              extensions: ["plf"],
            },
            "application/vnd.powerbuilder6": {
              source: "iana",
              extensions: ["pbd"],
            },
            "application/vnd.powerbuilder6-s": {
              source: "iana",
            },
            "application/vnd.powerbuilder7": {
              source: "iana",
            },
            "application/vnd.powerbuilder7-s": {
              source: "iana",
            },
            "application/vnd.powerbuilder75": {
              source: "iana",
            },
            "application/vnd.powerbuilder75-s": {
              source: "iana",
            },
            "application/vnd.preminet": {
              source: "iana",
            },
            "application/vnd.previewsystems.box": {
              source: "iana",
              extensions: ["box"],
            },
            "application/vnd.proteus.magazine": {
              source: "iana",
              extensions: ["mgz"],
            },
            "application/vnd.psfs": {
              source: "iana",
            },
            "application/vnd.publishare-delta-tree": {
              source: "iana",
              extensions: ["qps"],
            },
            "application/vnd.pvi.ptid1": {
              source: "iana",
              extensions: ["ptid"],
            },
            "application/vnd.pwg-multiplexed": {
              source: "iana",
            },
            "application/vnd.pwg-xhtml-print+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.qualcomm.brew-app-res": {
              source: "iana",
            },
            "application/vnd.quarantainenet": {
              source: "iana",
            },
            "application/vnd.quark.quarkxpress": {
              source: "iana",
              extensions: ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"],
            },
            "application/vnd.quobject-quoxdocument": {
              source: "iana",
            },
            "application/vnd.radisys.moml+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.radisys.msml+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.radisys.msml-audit+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.radisys.msml-audit-conf+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.radisys.msml-audit-conn+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.radisys.msml-audit-dialog+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.radisys.msml-audit-stream+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.radisys.msml-conf+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.radisys.msml-dialog+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.radisys.msml-dialog-base+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.radisys.msml-dialog-fax-detect+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.radisys.msml-dialog-group+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.radisys.msml-dialog-speech+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.radisys.msml-dialog-transform+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.rainstor.data": {
              source: "iana",
            },
            "application/vnd.rapid": {
              source: "iana",
            },
            "application/vnd.rar": {
              source: "iana",
            },
            "application/vnd.realvnc.bed": {
              source: "iana",
              extensions: ["bed"],
            },
            "application/vnd.recordare.musicxml": {
              source: "iana",
              extensions: ["mxl"],
            },
            "application/vnd.recordare.musicxml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["musicxml"],
            },
            "application/vnd.renlearn.rlprint": {
              source: "iana",
            },
            "application/vnd.restful+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.rig.cryptonote": {
              source: "iana",
              extensions: ["cryptonote"],
            },
            "application/vnd.rim.cod": {
              source: "apache",
              extensions: ["cod"],
            },
            "application/vnd.rn-realmedia": {
              source: "apache",
              extensions: ["rm"],
            },
            "application/vnd.rn-realmedia-vbr": {
              source: "apache",
              extensions: ["rmvb"],
            },
            "application/vnd.route66.link66+xml": {
              source: "iana",
              compressible: true,
              extensions: ["link66"],
            },
            "application/vnd.rs-274x": {
              source: "iana",
            },
            "application/vnd.ruckus.download": {
              source: "iana",
            },
            "application/vnd.s3sms": {
              source: "iana",
            },
            "application/vnd.sailingtracker.track": {
              source: "iana",
              extensions: ["st"],
            },
            "application/vnd.sar": {
              source: "iana",
            },
            "application/vnd.sbm.cid": {
              source: "iana",
            },
            "application/vnd.sbm.mid2": {
              source: "iana",
            },
            "application/vnd.scribus": {
              source: "iana",
            },
            "application/vnd.sealed.3df": {
              source: "iana",
            },
            "application/vnd.sealed.csf": {
              source: "iana",
            },
            "application/vnd.sealed.doc": {
              source: "iana",
            },
            "application/vnd.sealed.eml": {
              source: "iana",
            },
            "application/vnd.sealed.mht": {
              source: "iana",
            },
            "application/vnd.sealed.net": {
              source: "iana",
            },
            "application/vnd.sealed.ppt": {
              source: "iana",
            },
            "application/vnd.sealed.tiff": {
              source: "iana",
            },
            "application/vnd.sealed.xls": {
              source: "iana",
            },
            "application/vnd.sealedmedia.softseal.html": {
              source: "iana",
            },
            "application/vnd.sealedmedia.softseal.pdf": {
              source: "iana",
            },
            "application/vnd.seemail": {
              source: "iana",
              extensions: ["see"],
            },
            "application/vnd.sema": {
              source: "iana",
              extensions: ["sema"],
            },
            "application/vnd.semd": {
              source: "iana",
              extensions: ["semd"],
            },
            "application/vnd.semf": {
              source: "iana",
              extensions: ["semf"],
            },
            "application/vnd.shade-save-file": {
              source: "iana",
            },
            "application/vnd.shana.informed.formdata": {
              source: "iana",
              extensions: ["ifm"],
            },
            "application/vnd.shana.informed.formtemplate": {
              source: "iana",
              extensions: ["itp"],
            },
            "application/vnd.shana.informed.interchange": {
              source: "iana",
              extensions: ["iif"],
            },
            "application/vnd.shana.informed.package": {
              source: "iana",
              extensions: ["ipk"],
            },
            "application/vnd.shootproof+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.shopkick+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.shp": {
              source: "iana",
            },
            "application/vnd.shx": {
              source: "iana",
            },
            "application/vnd.sigrok.session": {
              source: "iana",
            },
            "application/vnd.simtech-mindmapper": {
              source: "iana",
              extensions: ["twd", "twds"],
            },
            "application/vnd.siren+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.smaf": {
              source: "iana",
              extensions: ["mmf"],
            },
            "application/vnd.smart.notebook": {
              source: "iana",
            },
            "application/vnd.smart.teacher": {
              source: "iana",
              extensions: ["teacher"],
            },
            "application/vnd.snesdev-page-table": {
              source: "iana",
            },
            "application/vnd.software602.filler.form+xml": {
              source: "iana",
              compressible: true,
              extensions: ["fo"],
            },
            "application/vnd.software602.filler.form-xml-zip": {
              source: "iana",
            },
            "application/vnd.solent.sdkm+xml": {
              source: "iana",
              compressible: true,
              extensions: ["sdkm", "sdkd"],
            },
            "application/vnd.spotfire.dxp": {
              source: "iana",
              extensions: ["dxp"],
            },
            "application/vnd.spotfire.sfs": {
              source: "iana",
              extensions: ["sfs"],
            },
            "application/vnd.sqlite3": {
              source: "iana",
            },
            "application/vnd.sss-cod": {
              source: "iana",
            },
            "application/vnd.sss-dtf": {
              source: "iana",
            },
            "application/vnd.sss-ntf": {
              source: "iana",
            },
            "application/vnd.stardivision.calc": {
              source: "apache",
              extensions: ["sdc"],
            },
            "application/vnd.stardivision.draw": {
              source: "apache",
              extensions: ["sda"],
            },
            "application/vnd.stardivision.impress": {
              source: "apache",
              extensions: ["sdd"],
            },
            "application/vnd.stardivision.math": {
              source: "apache",
              extensions: ["smf"],
            },
            "application/vnd.stardivision.writer": {
              source: "apache",
              extensions: ["sdw", "vor"],
            },
            "application/vnd.stardivision.writer-global": {
              source: "apache",
              extensions: ["sgl"],
            },
            "application/vnd.stepmania.package": {
              source: "iana",
              extensions: ["smzip"],
            },
            "application/vnd.stepmania.stepchart": {
              source: "iana",
              extensions: ["sm"],
            },
            "application/vnd.street-stream": {
              source: "iana",
            },
            "application/vnd.sun.wadl+xml": {
              source: "iana",
              compressible: true,
              extensions: ["wadl"],
            },
            "application/vnd.sun.xml.calc": {
              source: "apache",
              extensions: ["sxc"],
            },
            "application/vnd.sun.xml.calc.template": {
              source: "apache",
              extensions: ["stc"],
            },
            "application/vnd.sun.xml.draw": {
              source: "apache",
              extensions: ["sxd"],
            },
            "application/vnd.sun.xml.draw.template": {
              source: "apache",
              extensions: ["std"],
            },
            "application/vnd.sun.xml.impress": {
              source: "apache",
              extensions: ["sxi"],
            },
            "application/vnd.sun.xml.impress.template": {
              source: "apache",
              extensions: ["sti"],
            },
            "application/vnd.sun.xml.math": {
              source: "apache",
              extensions: ["sxm"],
            },
            "application/vnd.sun.xml.writer": {
              source: "apache",
              extensions: ["sxw"],
            },
            "application/vnd.sun.xml.writer.global": {
              source: "apache",
              extensions: ["sxg"],
            },
            "application/vnd.sun.xml.writer.template": {
              source: "apache",
              extensions: ["stw"],
            },
            "application/vnd.sus-calendar": {
              source: "iana",
              extensions: ["sus", "susp"],
            },
            "application/vnd.svd": {
              source: "iana",
              extensions: ["svd"],
            },
            "application/vnd.swiftview-ics": {
              source: "iana",
            },
            "application/vnd.symbian.install": {
              source: "apache",
              extensions: ["sis", "sisx"],
            },
            "application/vnd.syncml+xml": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
              extensions: ["xsm"],
            },
            "application/vnd.syncml.dm+wbxml": {
              source: "iana",
              charset: "UTF-8",
              extensions: ["bdm"],
            },
            "application/vnd.syncml.dm+xml": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
              extensions: ["xdm"],
            },
            "application/vnd.syncml.dm.notification": {
              source: "iana",
            },
            "application/vnd.syncml.dmddf+wbxml": {
              source: "iana",
            },
            "application/vnd.syncml.dmddf+xml": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
              extensions: ["ddf"],
            },
            "application/vnd.syncml.dmtnds+wbxml": {
              source: "iana",
            },
            "application/vnd.syncml.dmtnds+xml": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
            },
            "application/vnd.syncml.ds.notification": {
              source: "iana",
            },
            "application/vnd.tableschema+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.tao.intent-module-archive": {
              source: "iana",
              extensions: ["tao"],
            },
            "application/vnd.tcpdump.pcap": {
              source: "iana",
              extensions: ["pcap", "cap", "dmp"],
            },
            "application/vnd.think-cell.ppttc+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.tmd.mediaflex.api+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.tml": {
              source: "iana",
            },
            "application/vnd.tmobile-livetv": {
              source: "iana",
              extensions: ["tmo"],
            },
            "application/vnd.tri.onesource": {
              source: "iana",
            },
            "application/vnd.trid.tpt": {
              source: "iana",
              extensions: ["tpt"],
            },
            "application/vnd.triscape.mxs": {
              source: "iana",
              extensions: ["mxs"],
            },
            "application/vnd.trueapp": {
              source: "iana",
              extensions: ["tra"],
            },
            "application/vnd.truedoc": {
              source: "iana",
            },
            "application/vnd.ubisoft.webplayer": {
              source: "iana",
            },
            "application/vnd.ufdl": {
              source: "iana",
              extensions: ["ufd", "ufdl"],
            },
            "application/vnd.uiq.theme": {
              source: "iana",
              extensions: ["utz"],
            },
            "application/vnd.umajin": {
              source: "iana",
              extensions: ["umj"],
            },
            "application/vnd.unity": {
              source: "iana",
              extensions: ["unityweb"],
            },
            "application/vnd.uoml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["uoml"],
            },
            "application/vnd.uplanet.alert": {
              source: "iana",
            },
            "application/vnd.uplanet.alert-wbxml": {
              source: "iana",
            },
            "application/vnd.uplanet.bearer-choice": {
              source: "iana",
            },
            "application/vnd.uplanet.bearer-choice-wbxml": {
              source: "iana",
            },
            "application/vnd.uplanet.cacheop": {
              source: "iana",
            },
            "application/vnd.uplanet.cacheop-wbxml": {
              source: "iana",
            },
            "application/vnd.uplanet.channel": {
              source: "iana",
            },
            "application/vnd.uplanet.channel-wbxml": {
              source: "iana",
            },
            "application/vnd.uplanet.list": {
              source: "iana",
            },
            "application/vnd.uplanet.list-wbxml": {
              source: "iana",
            },
            "application/vnd.uplanet.listcmd": {
              source: "iana",
            },
            "application/vnd.uplanet.listcmd-wbxml": {
              source: "iana",
            },
            "application/vnd.uplanet.signal": {
              source: "iana",
            },
            "application/vnd.uri-map": {
              source: "iana",
            },
            "application/vnd.valve.source.material": {
              source: "iana",
            },
            "application/vnd.vcx": {
              source: "iana",
              extensions: ["vcx"],
            },
            "application/vnd.vd-study": {
              source: "iana",
            },
            "application/vnd.vectorworks": {
              source: "iana",
            },
            "application/vnd.vel+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.verimatrix.vcas": {
              source: "iana",
            },
            "application/vnd.veryant.thin": {
              source: "iana",
            },
            "application/vnd.ves.encrypted": {
              source: "iana",
            },
            "application/vnd.vidsoft.vidconference": {
              source: "iana",
            },
            "application/vnd.visio": {
              source: "iana",
              extensions: ["vsd", "vst", "vss", "vsw"],
            },
            "application/vnd.visionary": {
              source: "iana",
              extensions: ["vis"],
            },
            "application/vnd.vividence.scriptfile": {
              source: "iana",
            },
            "application/vnd.vsf": {
              source: "iana",
              extensions: ["vsf"],
            },
            "application/vnd.wap.sic": {
              source: "iana",
            },
            "application/vnd.wap.slc": {
              source: "iana",
            },
            "application/vnd.wap.wbxml": {
              source: "iana",
              charset: "UTF-8",
              extensions: ["wbxml"],
            },
            "application/vnd.wap.wmlc": {
              source: "iana",
              extensions: ["wmlc"],
            },
            "application/vnd.wap.wmlscriptc": {
              source: "iana",
              extensions: ["wmlsc"],
            },
            "application/vnd.webturbo": {
              source: "iana",
              extensions: ["wtb"],
            },
            "application/vnd.wfa.p2p": {
              source: "iana",
            },
            "application/vnd.wfa.wsc": {
              source: "iana",
            },
            "application/vnd.windows.devicepairing": {
              source: "iana",
            },
            "application/vnd.wmc": {
              source: "iana",
            },
            "application/vnd.wmf.bootstrap": {
              source: "iana",
            },
            "application/vnd.wolfram.mathematica": {
              source: "iana",
            },
            "application/vnd.wolfram.mathematica.package": {
              source: "iana",
            },
            "application/vnd.wolfram.player": {
              source: "iana",
              extensions: ["nbp"],
            },
            "application/vnd.wordperfect": {
              source: "iana",
              extensions: ["wpd"],
            },
            "application/vnd.wqd": {
              source: "iana",
              extensions: ["wqd"],
            },
            "application/vnd.wrq-hp3000-labelled": {
              source: "iana",
            },
            "application/vnd.wt.stf": {
              source: "iana",
              extensions: ["stf"],
            },
            "application/vnd.wv.csp+wbxml": {
              source: "iana",
            },
            "application/vnd.wv.csp+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.wv.ssp+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.xacml+json": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.xara": {
              source: "iana",
              extensions: ["xar"],
            },
            "application/vnd.xfdl": {
              source: "iana",
              extensions: ["xfdl"],
            },
            "application/vnd.xfdl.webform": {
              source: "iana",
            },
            "application/vnd.xmi+xml": {
              source: "iana",
              compressible: true,
            },
            "application/vnd.xmpie.cpkg": {
              source: "iana",
            },
            "application/vnd.xmpie.dpkg": {
              source: "iana",
            },
            "application/vnd.xmpie.plan": {
              source: "iana",
            },
            "application/vnd.xmpie.ppkg": {
              source: "iana",
            },
            "application/vnd.xmpie.xlim": {
              source: "iana",
            },
            "application/vnd.yamaha.hv-dic": {
              source: "iana",
              extensions: ["hvd"],
            },
            "application/vnd.yamaha.hv-script": {
              source: "iana",
              extensions: ["hvs"],
            },
            "application/vnd.yamaha.hv-voice": {
              source: "iana",
              extensions: ["hvp"],
            },
            "application/vnd.yamaha.openscoreformat": {
              source: "iana",
              extensions: ["osf"],
            },
            "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
              source: "iana",
              compressible: true,
              extensions: ["osfpvg"],
            },
            "application/vnd.yamaha.remote-setup": {
              source: "iana",
            },
            "application/vnd.yamaha.smaf-audio": {
              source: "iana",
              extensions: ["saf"],
            },
            "application/vnd.yamaha.smaf-phrase": {
              source: "iana",
              extensions: ["spf"],
            },
            "application/vnd.yamaha.through-ngn": {
              source: "iana",
            },
            "application/vnd.yamaha.tunnel-udpencap": {
              source: "iana",
            },
            "application/vnd.yaoweme": {
              source: "iana",
            },
            "application/vnd.yellowriver-custom-menu": {
              source: "iana",
              extensions: ["cmp"],
            },
            "application/vnd.youtube.yt": {
              source: "iana",
            },
            "application/vnd.zul": {
              source: "iana",
              extensions: ["zir", "zirz"],
            },
            "application/vnd.zzazz.deck+xml": {
              source: "iana",
              compressible: true,
              extensions: ["zaz"],
            },
            "application/voicexml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["vxml"],
            },
            "application/voucher-cms+json": {
              source: "iana",
              compressible: true,
            },
            "application/vq-rtcpxr": {
              source: "iana",
            },
            "application/wasm": {
              compressible: true,
              extensions: ["wasm"],
            },
            "application/watcherinfo+xml": {
              source: "iana",
              compressible: true,
            },
            "application/webpush-options+json": {
              source: "iana",
              compressible: true,
            },
            "application/whoispp-query": {
              source: "iana",
            },
            "application/whoispp-response": {
              source: "iana",
            },
            "application/widget": {
              source: "iana",
              extensions: ["wgt"],
            },
            "application/winhlp": {
              source: "apache",
              extensions: ["hlp"],
            },
            "application/wita": {
              source: "iana",
            },
            "application/wordperfect5.1": {
              source: "iana",
            },
            "application/wsdl+xml": {
              source: "iana",
              compressible: true,
              extensions: ["wsdl"],
            },
            "application/wspolicy+xml": {
              source: "iana",
              compressible: true,
              extensions: ["wspolicy"],
            },
            "application/x-7z-compressed": {
              source: "apache",
              compressible: false,
              extensions: ["7z"],
            },
            "application/x-abiword": {
              source: "apache",
              extensions: ["abw"],
            },
            "application/x-ace-compressed": {
              source: "apache",
              extensions: ["ace"],
            },
            "application/x-amf": {
              source: "apache",
            },
            "application/x-apple-diskimage": {
              source: "apache",
              extensions: ["dmg"],
            },
            "application/x-arj": {
              compressible: false,
              extensions: ["arj"],
            },
            "application/x-authorware-bin": {
              source: "apache",
              extensions: ["aab", "x32", "u32", "vox"],
            },
            "application/x-authorware-map": {
              source: "apache",
              extensions: ["aam"],
            },
            "application/x-authorware-seg": {
              source: "apache",
              extensions: ["aas"],
            },
            "application/x-bcpio": {
              source: "apache",
              extensions: ["bcpio"],
            },
            "application/x-bdoc": {
              compressible: false,
              extensions: ["bdoc"],
            },
            "application/x-bittorrent": {
              source: "apache",
              extensions: ["torrent"],
            },
            "application/x-blorb": {
              source: "apache",
              extensions: ["blb", "blorb"],
            },
            "application/x-bzip": {
              source: "apache",
              compressible: false,
              extensions: ["bz"],
            },
            "application/x-bzip2": {
              source: "apache",
              compressible: false,
              extensions: ["bz2", "boz"],
            },
            "application/x-cbr": {
              source: "apache",
              extensions: ["cbr", "cba", "cbt", "cbz", "cb7"],
            },
            "application/x-cdlink": {
              source: "apache",
              extensions: ["vcd"],
            },
            "application/x-cfs-compressed": {
              source: "apache",
              extensions: ["cfs"],
            },
            "application/x-chat": {
              source: "apache",
              extensions: ["chat"],
            },
            "application/x-chess-pgn": {
              source: "apache",
              extensions: ["pgn"],
            },
            "application/x-chrome-extension": {
              extensions: ["crx"],
            },
            "application/x-cocoa": {
              source: "nginx",
              extensions: ["cco"],
            },
            "application/x-compress": {
              source: "apache",
            },
            "application/x-conference": {
              source: "apache",
              extensions: ["nsc"],
            },
            "application/x-cpio": {
              source: "apache",
              extensions: ["cpio"],
            },
            "application/x-csh": {
              source: "apache",
              extensions: ["csh"],
            },
            "application/x-deb": {
              compressible: false,
            },
            "application/x-debian-package": {
              source: "apache",
              extensions: ["deb", "udeb"],
            },
            "application/x-dgc-compressed": {
              source: "apache",
              extensions: ["dgc"],
            },
            "application/x-director": {
              source: "apache",
              extensions: [
                "dir",
                "dcr",
                "dxr",
                "cst",
                "cct",
                "cxt",
                "w3d",
                "fgd",
                "swa",
              ],
            },
            "application/x-doom": {
              source: "apache",
              extensions: ["wad"],
            },
            "application/x-dtbncx+xml": {
              source: "apache",
              compressible: true,
              extensions: ["ncx"],
            },
            "application/x-dtbook+xml": {
              source: "apache",
              compressible: true,
              extensions: ["dtb"],
            },
            "application/x-dtbresource+xml": {
              source: "apache",
              compressible: true,
              extensions: ["res"],
            },
            "application/x-dvi": {
              source: "apache",
              compressible: false,
              extensions: ["dvi"],
            },
            "application/x-envoy": {
              source: "apache",
              extensions: ["evy"],
            },
            "application/x-eva": {
              source: "apache",
              extensions: ["eva"],
            },
            "application/x-font-bdf": {
              source: "apache",
              extensions: ["bdf"],
            },
            "application/x-font-dos": {
              source: "apache",
            },
            "application/x-font-framemaker": {
              source: "apache",
            },
            "application/x-font-ghostscript": {
              source: "apache",
              extensions: ["gsf"],
            },
            "application/x-font-libgrx": {
              source: "apache",
            },
            "application/x-font-linux-psf": {
              source: "apache",
              extensions: ["psf"],
            },
            "application/x-font-pcf": {
              source: "apache",
              extensions: ["pcf"],
            },
            "application/x-font-snf": {
              source: "apache",
              extensions: ["snf"],
            },
            "application/x-font-speedo": {
              source: "apache",
            },
            "application/x-font-sunos-news": {
              source: "apache",
            },
            "application/x-font-type1": {
              source: "apache",
              extensions: ["pfa", "pfb", "pfm", "afm"],
            },
            "application/x-font-vfont": {
              source: "apache",
            },
            "application/x-freearc": {
              source: "apache",
              extensions: ["arc"],
            },
            "application/x-futuresplash": {
              source: "apache",
              extensions: ["spl"],
            },
            "application/x-gca-compressed": {
              source: "apache",
              extensions: ["gca"],
            },
            "application/x-glulx": {
              source: "apache",
              extensions: ["ulx"],
            },
            "application/x-gnumeric": {
              source: "apache",
              extensions: ["gnumeric"],
            },
            "application/x-gramps-xml": {
              source: "apache",
              extensions: ["gramps"],
            },
            "application/x-gtar": {
              source: "apache",
              extensions: ["gtar"],
            },
            "application/x-gzip": {
              source: "apache",
            },
            "application/x-hdf": {
              source: "apache",
              extensions: ["hdf"],
            },
            "application/x-httpd-php": {
              compressible: true,
              extensions: ["php"],
            },
            "application/x-install-instructions": {
              source: "apache",
              extensions: ["install"],
            },
            "application/x-iso9660-image": {
              source: "apache",
              extensions: ["iso"],
            },
            "application/x-java-archive-diff": {
              source: "nginx",
              extensions: ["jardiff"],
            },
            "application/x-java-jnlp-file": {
              source: "apache",
              compressible: false,
              extensions: ["jnlp"],
            },
            "application/x-javascript": {
              compressible: true,
            },
            "application/x-keepass2": {
              extensions: ["kdbx"],
            },
            "application/x-latex": {
              source: "apache",
              compressible: false,
              extensions: ["latex"],
            },
            "application/x-lua-bytecode": {
              extensions: ["luac"],
            },
            "application/x-lzh-compressed": {
              source: "apache",
              extensions: ["lzh", "lha"],
            },
            "application/x-makeself": {
              source: "nginx",
              extensions: ["run"],
            },
            "application/x-mie": {
              source: "apache",
              extensions: ["mie"],
            },
            "application/x-mobipocket-ebook": {
              source: "apache",
              extensions: ["prc", "mobi"],
            },
            "application/x-mpegurl": {
              compressible: false,
            },
            "application/x-ms-application": {
              source: "apache",
              extensions: ["application"],
            },
            "application/x-ms-shortcut": {
              source: "apache",
              extensions: ["lnk"],
            },
            "application/x-ms-wmd": {
              source: "apache",
              extensions: ["wmd"],
            },
            "application/x-ms-wmz": {
              source: "apache",
              extensions: ["wmz"],
            },
            "application/x-ms-xbap": {
              source: "apache",
              extensions: ["xbap"],
            },
            "application/x-msaccess": {
              source: "apache",
              extensions: ["mdb"],
            },
            "application/x-msbinder": {
              source: "apache",
              extensions: ["obd"],
            },
            "application/x-mscardfile": {
              source: "apache",
              extensions: ["crd"],
            },
            "application/x-msclip": {
              source: "apache",
              extensions: ["clp"],
            },
            "application/x-msdos-program": {
              extensions: ["exe"],
            },
            "application/x-msdownload": {
              source: "apache",
              extensions: ["exe", "dll", "com", "bat", "msi"],
            },
            "application/x-msmediaview": {
              source: "apache",
              extensions: ["mvb", "m13", "m14"],
            },
            "application/x-msmetafile": {
              source: "apache",
              extensions: ["wmf", "wmz", "emf", "emz"],
            },
            "application/x-msmoney": {
              source: "apache",
              extensions: ["mny"],
            },
            "application/x-mspublisher": {
              source: "apache",
              extensions: ["pub"],
            },
            "application/x-msschedule": {
              source: "apache",
              extensions: ["scd"],
            },
            "application/x-msterminal": {
              source: "apache",
              extensions: ["trm"],
            },
            "application/x-mswrite": {
              source: "apache",
              extensions: ["wri"],
            },
            "application/x-netcdf": {
              source: "apache",
              extensions: ["nc", "cdf"],
            },
            "application/x-ns-proxy-autoconfig": {
              compressible: true,
              extensions: ["pac"],
            },
            "application/x-nzb": {
              source: "apache",
              extensions: ["nzb"],
            },
            "application/x-perl": {
              source: "nginx",
              extensions: ["pl", "pm"],
            },
            "application/x-pilot": {
              source: "nginx",
              extensions: ["prc", "pdb"],
            },
            "application/x-pkcs12": {
              source: "apache",
              compressible: false,
              extensions: ["p12", "pfx"],
            },
            "application/x-pkcs7-certificates": {
              source: "apache",
              extensions: ["p7b", "spc"],
            },
            "application/x-pkcs7-certreqresp": {
              source: "apache",
              extensions: ["p7r"],
            },
            "application/x-pki-message": {
              source: "iana",
            },
            "application/x-rar-compressed": {
              source: "apache",
              compressible: false,
              extensions: ["rar"],
            },
            "application/x-redhat-package-manager": {
              source: "nginx",
              extensions: ["rpm"],
            },
            "application/x-research-info-systems": {
              source: "apache",
              extensions: ["ris"],
            },
            "application/x-sea": {
              source: "nginx",
              extensions: ["sea"],
            },
            "application/x-sh": {
              source: "apache",
              compressible: true,
              extensions: ["sh"],
            },
            "application/x-shar": {
              source: "apache",
              extensions: ["shar"],
            },
            "application/x-shockwave-flash": {
              source: "apache",
              compressible: false,
              extensions: ["swf"],
            },
            "application/x-silverlight-app": {
              source: "apache",
              extensions: ["xap"],
            },
            "application/x-sql": {
              source: "apache",
              extensions: ["sql"],
            },
            "application/x-stuffit": {
              source: "apache",
              compressible: false,
              extensions: ["sit"],
            },
            "application/x-stuffitx": {
              source: "apache",
              extensions: ["sitx"],
            },
            "application/x-subrip": {
              source: "apache",
              extensions: ["srt"],
            },
            "application/x-sv4cpio": {
              source: "apache",
              extensions: ["sv4cpio"],
            },
            "application/x-sv4crc": {
              source: "apache",
              extensions: ["sv4crc"],
            },
            "application/x-t3vm-image": {
              source: "apache",
              extensions: ["t3"],
            },
            "application/x-tads": {
              source: "apache",
              extensions: ["gam"],
            },
            "application/x-tar": {
              source: "apache",
              compressible: true,
              extensions: ["tar"],
            },
            "application/x-tcl": {
              source: "apache",
              extensions: ["tcl", "tk"],
            },
            "application/x-tex": {
              source: "apache",
              extensions: ["tex"],
            },
            "application/x-tex-tfm": {
              source: "apache",
              extensions: ["tfm"],
            },
            "application/x-texinfo": {
              source: "apache",
              extensions: ["texinfo", "texi"],
            },
            "application/x-tgif": {
              source: "apache",
              extensions: ["obj"],
            },
            "application/x-ustar": {
              source: "apache",
              extensions: ["ustar"],
            },
            "application/x-virtualbox-hdd": {
              compressible: true,
              extensions: ["hdd"],
            },
            "application/x-virtualbox-ova": {
              compressible: true,
              extensions: ["ova"],
            },
            "application/x-virtualbox-ovf": {
              compressible: true,
              extensions: ["ovf"],
            },
            "application/x-virtualbox-vbox": {
              compressible: true,
              extensions: ["vbox"],
            },
            "application/x-virtualbox-vbox-extpack": {
              compressible: false,
              extensions: ["vbox-extpack"],
            },
            "application/x-virtualbox-vdi": {
              compressible: true,
              extensions: ["vdi"],
            },
            "application/x-virtualbox-vhd": {
              compressible: true,
              extensions: ["vhd"],
            },
            "application/x-virtualbox-vmdk": {
              compressible: true,
              extensions: ["vmdk"],
            },
            "application/x-wais-source": {
              source: "apache",
              extensions: ["src"],
            },
            "application/x-web-app-manifest+json": {
              compressible: true,
              extensions: ["webapp"],
            },
            "application/x-www-form-urlencoded": {
              source: "iana",
              compressible: true,
            },
            "application/x-x509-ca-cert": {
              source: "iana",
              extensions: ["der", "crt", "pem"],
            },
            "application/x-x509-ca-ra-cert": {
              source: "iana",
            },
            "application/x-x509-next-ca-cert": {
              source: "iana",
            },
            "application/x-xfig": {
              source: "apache",
              extensions: ["fig"],
            },
            "application/x-xliff+xml": {
              source: "apache",
              compressible: true,
              extensions: ["xlf"],
            },
            "application/x-xpinstall": {
              source: "apache",
              compressible: false,
              extensions: ["xpi"],
            },
            "application/x-xz": {
              source: "apache",
              extensions: ["xz"],
            },
            "application/x-zmachine": {
              source: "apache",
              extensions: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"],
            },
            "application/x400-bp": {
              source: "iana",
            },
            "application/xacml+xml": {
              source: "iana",
              compressible: true,
            },
            "application/xaml+xml": {
              source: "apache",
              compressible: true,
              extensions: ["xaml"],
            },
            "application/xcap-att+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xav"],
            },
            "application/xcap-caps+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xca"],
            },
            "application/xcap-diff+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xdf"],
            },
            "application/xcap-el+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xel"],
            },
            "application/xcap-error+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xer"],
            },
            "application/xcap-ns+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xns"],
            },
            "application/xcon-conference-info+xml": {
              source: "iana",
              compressible: true,
            },
            "application/xcon-conference-info-diff+xml": {
              source: "iana",
              compressible: true,
            },
            "application/xenc+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xenc"],
            },
            "application/xhtml+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xhtml", "xht"],
            },
            "application/xhtml-voice+xml": {
              source: "apache",
              compressible: true,
            },
            "application/xliff+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xlf"],
            },
            "application/xml": {
              source: "iana",
              compressible: true,
              extensions: ["xml", "xsl", "xsd", "rng"],
            },
            "application/xml-dtd": {
              source: "iana",
              compressible: true,
              extensions: ["dtd"],
            },
            "application/xml-external-parsed-entity": {
              source: "iana",
            },
            "application/xml-patch+xml": {
              source: "iana",
              compressible: true,
            },
            "application/xmpp+xml": {
              source: "iana",
              compressible: true,
            },
            "application/xop+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xop"],
            },
            "application/xproc+xml": {
              source: "apache",
              compressible: true,
              extensions: ["xpl"],
            },
            "application/xslt+xml": {
              source: "iana",
              compressible: true,
              extensions: ["xslt"],
            },
            "application/xspf+xml": {
              source: "apache",
              compressible: true,
              extensions: ["xspf"],
            },
            "application/xv+xml": {
              source: "iana",
              compressible: true,
              extensions: ["mxml", "xhvml", "xvml", "xvm"],
            },
            "application/yang": {
              source: "iana",
              extensions: ["yang"],
            },
            "application/yang-data+json": {
              source: "iana",
              compressible: true,
            },
            "application/yang-data+xml": {
              source: "iana",
              compressible: true,
            },
            "application/yang-patch+json": {
              source: "iana",
              compressible: true,
            },
            "application/yang-patch+xml": {
              source: "iana",
              compressible: true,
            },
            "application/yin+xml": {
              source: "iana",
              compressible: true,
              extensions: ["yin"],
            },
            "application/zip": {
              source: "iana",
              compressible: false,
              extensions: ["zip"],
            },
            "application/zlib": {
              source: "iana",
            },
            "application/zstd": {
              source: "iana",
            },
            "audio/1d-interleaved-parityfec": {
              source: "iana",
            },
            "audio/32kadpcm": {
              source: "iana",
            },
            "audio/3gpp": {
              source: "iana",
              compressible: false,
              extensions: ["3gpp"],
            },
            "audio/3gpp2": {
              source: "iana",
            },
            "audio/aac": {
              source: "iana",
            },
            "audio/ac3": {
              source: "iana",
            },
            "audio/adpcm": {
              source: "apache",
              extensions: ["adp"],
            },
            "audio/amr": {
              source: "iana",
            },
            "audio/amr-wb": {
              source: "iana",
            },
            "audio/amr-wb+": {
              source: "iana",
            },
            "audio/aptx": {
              source: "iana",
            },
            "audio/asc": {
              source: "iana",
            },
            "audio/atrac-advanced-lossless": {
              source: "iana",
            },
            "audio/atrac-x": {
              source: "iana",
            },
            "audio/atrac3": {
              source: "iana",
            },
            "audio/basic": {
              source: "iana",
              compressible: false,
              extensions: ["au", "snd"],
            },
            "audio/bv16": {
              source: "iana",
            },
            "audio/bv32": {
              source: "iana",
            },
            "audio/clearmode": {
              source: "iana",
            },
            "audio/cn": {
              source: "iana",
            },
            "audio/dat12": {
              source: "iana",
            },
            "audio/dls": {
              source: "iana",
            },
            "audio/dsr-es201108": {
              source: "iana",
            },
            "audio/dsr-es202050": {
              source: "iana",
            },
            "audio/dsr-es202211": {
              source: "iana",
            },
            "audio/dsr-es202212": {
              source: "iana",
            },
            "audio/dv": {
              source: "iana",
            },
            "audio/dvi4": {
              source: "iana",
            },
            "audio/eac3": {
              source: "iana",
            },
            "audio/encaprtp": {
              source: "iana",
            },
            "audio/evrc": {
              source: "iana",
            },
            "audio/evrc-qcp": {
              source: "iana",
            },
            "audio/evrc0": {
              source: "iana",
            },
            "audio/evrc1": {
              source: "iana",
            },
            "audio/evrcb": {
              source: "iana",
            },
            "audio/evrcb0": {
              source: "iana",
            },
            "audio/evrcb1": {
              source: "iana",
            },
            "audio/evrcnw": {
              source: "iana",
            },
            "audio/evrcnw0": {
              source: "iana",
            },
            "audio/evrcnw1": {
              source: "iana",
            },
            "audio/evrcwb": {
              source: "iana",
            },
            "audio/evrcwb0": {
              source: "iana",
            },
            "audio/evrcwb1": {
              source: "iana",
            },
            "audio/evs": {
              source: "iana",
            },
            "audio/flexfec": {
              source: "iana",
            },
            "audio/fwdred": {
              source: "iana",
            },
            "audio/g711-0": {
              source: "iana",
            },
            "audio/g719": {
              source: "iana",
            },
            "audio/g722": {
              source: "iana",
            },
            "audio/g7221": {
              source: "iana",
            },
            "audio/g723": {
              source: "iana",
            },
            "audio/g726-16": {
              source: "iana",
            },
            "audio/g726-24": {
              source: "iana",
            },
            "audio/g726-32": {
              source: "iana",
            },
            "audio/g726-40": {
              source: "iana",
            },
            "audio/g728": {
              source: "iana",
            },
            "audio/g729": {
              source: "iana",
            },
            "audio/g7291": {
              source: "iana",
            },
            "audio/g729d": {
              source: "iana",
            },
            "audio/g729e": {
              source: "iana",
            },
            "audio/gsm": {
              source: "iana",
            },
            "audio/gsm-efr": {
              source: "iana",
            },
            "audio/gsm-hr-08": {
              source: "iana",
            },
            "audio/ilbc": {
              source: "iana",
            },
            "audio/ip-mr_v2.5": {
              source: "iana",
            },
            "audio/isac": {
              source: "apache",
            },
            "audio/l16": {
              source: "iana",
            },
            "audio/l20": {
              source: "iana",
            },
            "audio/l24": {
              source: "iana",
              compressible: false,
            },
            "audio/l8": {
              source: "iana",
            },
            "audio/lpc": {
              source: "iana",
            },
            "audio/melp": {
              source: "iana",
            },
            "audio/melp1200": {
              source: "iana",
            },
            "audio/melp2400": {
              source: "iana",
            },
            "audio/melp600": {
              source: "iana",
            },
            "audio/mhas": {
              source: "iana",
            },
            "audio/midi": {
              source: "apache",
              extensions: ["mid", "midi", "kar", "rmi"],
            },
            "audio/mobile-xmf": {
              source: "iana",
              extensions: ["mxmf"],
            },
            "audio/mp3": {
              compressible: false,
              extensions: ["mp3"],
            },
            "audio/mp4": {
              source: "iana",
              compressible: false,
              extensions: ["m4a", "mp4a"],
            },
            "audio/mp4a-latm": {
              source: "iana",
            },
            "audio/mpa": {
              source: "iana",
            },
            "audio/mpa-robust": {
              source: "iana",
            },
            "audio/mpeg": {
              source: "iana",
              compressible: false,
              extensions: ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"],
            },
            "audio/mpeg4-generic": {
              source: "iana",
            },
            "audio/musepack": {
              source: "apache",
            },
            "audio/ogg": {
              source: "iana",
              compressible: false,
              extensions: ["oga", "ogg", "spx"],
            },
            "audio/opus": {
              source: "iana",
            },
            "audio/parityfec": {
              source: "iana",
            },
            "audio/pcma": {
              source: "iana",
            },
            "audio/pcma-wb": {
              source: "iana",
            },
            "audio/pcmu": {
              source: "iana",
            },
            "audio/pcmu-wb": {
              source: "iana",
            },
            "audio/prs.sid": {
              source: "iana",
            },
            "audio/qcelp": {
              source: "iana",
            },
            "audio/raptorfec": {
              source: "iana",
            },
            "audio/red": {
              source: "iana",
            },
            "audio/rtp-enc-aescm128": {
              source: "iana",
            },
            "audio/rtp-midi": {
              source: "iana",
            },
            "audio/rtploopback": {
              source: "iana",
            },
            "audio/rtx": {
              source: "iana",
            },
            "audio/s3m": {
              source: "apache",
              extensions: ["s3m"],
            },
            "audio/silk": {
              source: "apache",
              extensions: ["sil"],
            },
            "audio/smv": {
              source: "iana",
            },
            "audio/smv-qcp": {
              source: "iana",
            },
            "audio/smv0": {
              source: "iana",
            },
            "audio/sp-midi": {
              source: "iana",
            },
            "audio/speex": {
              source: "iana",
            },
            "audio/t140c": {
              source: "iana",
            },
            "audio/t38": {
              source: "iana",
            },
            "audio/telephone-event": {
              source: "iana",
            },
            "audio/tetra_acelp": {
              source: "iana",
            },
            "audio/tetra_acelp_bb": {
              source: "iana",
            },
            "audio/tone": {
              source: "iana",
            },
            "audio/uemclip": {
              source: "iana",
            },
            "audio/ulpfec": {
              source: "iana",
            },
            "audio/usac": {
              source: "iana",
            },
            "audio/vdvi": {
              source: "iana",
            },
            "audio/vmr-wb": {
              source: "iana",
            },
            "audio/vnd.3gpp.iufp": {
              source: "iana",
            },
            "audio/vnd.4sb": {
              source: "iana",
            },
            "audio/vnd.audiokoz": {
              source: "iana",
            },
            "audio/vnd.celp": {
              source: "iana",
            },
            "audio/vnd.cisco.nse": {
              source: "iana",
            },
            "audio/vnd.cmles.radio-events": {
              source: "iana",
            },
            "audio/vnd.cns.anp1": {
              source: "iana",
            },
            "audio/vnd.cns.inf1": {
              source: "iana",
            },
            "audio/vnd.dece.audio": {
              source: "iana",
              extensions: ["uva", "uvva"],
            },
            "audio/vnd.digital-winds": {
              source: "iana",
              extensions: ["eol"],
            },
            "audio/vnd.dlna.adts": {
              source: "iana",
            },
            "audio/vnd.dolby.heaac.1": {
              source: "iana",
            },
            "audio/vnd.dolby.heaac.2": {
              source: "iana",
            },
            "audio/vnd.dolby.mlp": {
              source: "iana",
            },
            "audio/vnd.dolby.mps": {
              source: "iana",
            },
            "audio/vnd.dolby.pl2": {
              source: "iana",
            },
            "audio/vnd.dolby.pl2x": {
              source: "iana",
            },
            "audio/vnd.dolby.pl2z": {
              source: "iana",
            },
            "audio/vnd.dolby.pulse.1": {
              source: "iana",
            },
            "audio/vnd.dra": {
              source: "iana",
              extensions: ["dra"],
            },
            "audio/vnd.dts": {
              source: "iana",
              extensions: ["dts"],
            },
            "audio/vnd.dts.hd": {
              source: "iana",
              extensions: ["dtshd"],
            },
            "audio/vnd.dts.uhd": {
              source: "iana",
            },
            "audio/vnd.dvb.file": {
              source: "iana",
            },
            "audio/vnd.everad.plj": {
              source: "iana",
            },
            "audio/vnd.hns.audio": {
              source: "iana",
            },
            "audio/vnd.lucent.voice": {
              source: "iana",
              extensions: ["lvp"],
            },
            "audio/vnd.ms-playready.media.pya": {
              source: "iana",
              extensions: ["pya"],
            },
            "audio/vnd.nokia.mobile-xmf": {
              source: "iana",
            },
            "audio/vnd.nortel.vbk": {
              source: "iana",
            },
            "audio/vnd.nuera.ecelp4800": {
              source: "iana",
              extensions: ["ecelp4800"],
            },
            "audio/vnd.nuera.ecelp7470": {
              source: "iana",
              extensions: ["ecelp7470"],
            },
            "audio/vnd.nuera.ecelp9600": {
              source: "iana",
              extensions: ["ecelp9600"],
            },
            "audio/vnd.octel.sbc": {
              source: "iana",
            },
            "audio/vnd.presonus.multitrack": {
              source: "iana",
            },
            "audio/vnd.qcelp": {
              source: "iana",
            },
            "audio/vnd.rhetorex.32kadpcm": {
              source: "iana",
            },
            "audio/vnd.rip": {
              source: "iana",
              extensions: ["rip"],
            },
            "audio/vnd.rn-realaudio": {
              compressible: false,
            },
            "audio/vnd.sealedmedia.softseal.mpeg": {
              source: "iana",
            },
            "audio/vnd.vmx.cvsd": {
              source: "iana",
            },
            "audio/vnd.wave": {
              compressible: false,
            },
            "audio/vorbis": {
              source: "iana",
              compressible: false,
            },
            "audio/vorbis-config": {
              source: "iana",
            },
            "audio/wav": {
              compressible: false,
              extensions: ["wav"],
            },
            "audio/wave": {
              compressible: false,
              extensions: ["wav"],
            },
            "audio/webm": {
              source: "apache",
              compressible: false,
              extensions: ["weba"],
            },
            "audio/x-aac": {
              source: "apache",
              compressible: false,
              extensions: ["aac"],
            },
            "audio/x-aiff": {
              source: "apache",
              extensions: ["aif", "aiff", "aifc"],
            },
            "audio/x-caf": {
              source: "apache",
              compressible: false,
              extensions: ["caf"],
            },
            "audio/x-flac": {
              source: "apache",
              extensions: ["flac"],
            },
            "audio/x-m4a": {
              source: "nginx",
              extensions: ["m4a"],
            },
            "audio/x-matroska": {
              source: "apache",
              extensions: ["mka"],
            },
            "audio/x-mpegurl": {
              source: "apache",
              extensions: ["m3u"],
            },
            "audio/x-ms-wax": {
              source: "apache",
              extensions: ["wax"],
            },
            "audio/x-ms-wma": {
              source: "apache",
              extensions: ["wma"],
            },
            "audio/x-pn-realaudio": {
              source: "apache",
              extensions: ["ram", "ra"],
            },
            "audio/x-pn-realaudio-plugin": {
              source: "apache",
              extensions: ["rmp"],
            },
            "audio/x-realaudio": {
              source: "nginx",
              extensions: ["ra"],
            },
            "audio/x-tta": {
              source: "apache",
            },
            "audio/x-wav": {
              source: "apache",
              extensions: ["wav"],
            },
            "audio/xm": {
              source: "apache",
              extensions: ["xm"],
            },
            "chemical/x-cdx": {
              source: "apache",
              extensions: ["cdx"],
            },
            "chemical/x-cif": {
              source: "apache",
              extensions: ["cif"],
            },
            "chemical/x-cmdf": {
              source: "apache",
              extensions: ["cmdf"],
            },
            "chemical/x-cml": {
              source: "apache",
              extensions: ["cml"],
            },
            "chemical/x-csml": {
              source: "apache",
              extensions: ["csml"],
            },
            "chemical/x-pdb": {
              source: "apache",
            },
            "chemical/x-xyz": {
              source: "apache",
              extensions: ["xyz"],
            },
            "font/collection": {
              source: "iana",
              extensions: ["ttc"],
            },
            "font/otf": {
              source: "iana",
              compressible: true,
              extensions: ["otf"],
            },
            "font/sfnt": {
              source: "iana",
            },
            "font/ttf": {
              source: "iana",
              compressible: true,
              extensions: ["ttf"],
            },
            "font/woff": {
              source: "iana",
              extensions: ["woff"],
            },
            "font/woff2": {
              source: "iana",
              extensions: ["woff2"],
            },
            "image/aces": {
              source: "iana",
              extensions: ["exr"],
            },
            "image/apng": {
              compressible: false,
              extensions: ["apng"],
            },
            "image/avci": {
              source: "iana",
            },
            "image/avcs": {
              source: "iana",
            },
            "image/bmp": {
              source: "iana",
              compressible: true,
              extensions: ["bmp"],
            },
            "image/cgm": {
              source: "iana",
              extensions: ["cgm"],
            },
            "image/dicom-rle": {
              source: "iana",
              extensions: ["drle"],
            },
            "image/emf": {
              source: "iana",
              extensions: ["emf"],
            },
            "image/fits": {
              source: "iana",
              extensions: ["fits"],
            },
            "image/g3fax": {
              source: "iana",
              extensions: ["g3"],
            },
            "image/gif": {
              source: "iana",
              compressible: false,
              extensions: ["gif"],
            },
            "image/heic": {
              source: "iana",
              extensions: ["heic"],
            },
            "image/heic-sequence": {
              source: "iana",
              extensions: ["heics"],
            },
            "image/heif": {
              source: "iana",
              extensions: ["heif"],
            },
            "image/heif-sequence": {
              source: "iana",
              extensions: ["heifs"],
            },
            "image/hej2k": {
              source: "iana",
              extensions: ["hej2"],
            },
            "image/hsj2": {
              source: "iana",
              extensions: ["hsj2"],
            },
            "image/ief": {
              source: "iana",
              extensions: ["ief"],
            },
            "image/jls": {
              source: "iana",
              extensions: ["jls"],
            },
            "image/jp2": {
              source: "iana",
              compressible: false,
              extensions: ["jp2", "jpg2"],
            },
            "image/jpeg": {
              source: "iana",
              compressible: false,
              extensions: ["jpeg", "jpg", "jpe"],
            },
            "image/jph": {
              source: "iana",
              extensions: ["jph"],
            },
            "image/jphc": {
              source: "iana",
              extensions: ["jhc"],
            },
            "image/jpm": {
              source: "iana",
              compressible: false,
              extensions: ["jpm"],
            },
            "image/jpx": {
              source: "iana",
              compressible: false,
              extensions: ["jpx", "jpf"],
            },
            "image/jxr": {
              source: "iana",
              extensions: ["jxr"],
            },
            "image/jxra": {
              source: "iana",
              extensions: ["jxra"],
            },
            "image/jxrs": {
              source: "iana",
              extensions: ["jxrs"],
            },
            "image/jxs": {
              source: "iana",
              extensions: ["jxs"],
            },
            "image/jxsc": {
              source: "iana",
              extensions: ["jxsc"],
            },
            "image/jxsi": {
              source: "iana",
              extensions: ["jxsi"],
            },
            "image/jxss": {
              source: "iana",
              extensions: ["jxss"],
            },
            "image/ktx": {
              source: "iana",
              extensions: ["ktx"],
            },
            "image/naplps": {
              source: "iana",
            },
            "image/pjpeg": {
              compressible: false,
            },
            "image/png": {
              source: "iana",
              compressible: false,
              extensions: ["png"],
            },
            "image/prs.btif": {
              source: "iana",
              extensions: ["btif"],
            },
            "image/prs.pti": {
              source: "iana",
              extensions: ["pti"],
            },
            "image/pwg-raster": {
              source: "iana",
            },
            "image/sgi": {
              source: "apache",
              extensions: ["sgi"],
            },
            "image/svg+xml": {
              source: "iana",
              compressible: true,
              extensions: ["svg", "svgz"],
            },
            "image/t38": {
              source: "iana",
              extensions: ["t38"],
            },
            "image/tiff": {
              source: "iana",
              compressible: false,
              extensions: ["tif", "tiff"],
            },
            "image/tiff-fx": {
              source: "iana",
              extensions: ["tfx"],
            },
            "image/vnd.adobe.photoshop": {
              source: "iana",
              compressible: true,
              extensions: ["psd"],
            },
            "image/vnd.airzip.accelerator.azv": {
              source: "iana",
              extensions: ["azv"],
            },
            "image/vnd.cns.inf2": {
              source: "iana",
            },
            "image/vnd.dece.graphic": {
              source: "iana",
              extensions: ["uvi", "uvvi", "uvg", "uvvg"],
            },
            "image/vnd.djvu": {
              source: "iana",
              extensions: ["djvu", "djv"],
            },
            "image/vnd.dvb.subtitle": {
              source: "iana",
              extensions: ["sub"],
            },
            "image/vnd.dwg": {
              source: "iana",
              extensions: ["dwg"],
            },
            "image/vnd.dxf": {
              source: "iana",
              extensions: ["dxf"],
            },
            "image/vnd.fastbidsheet": {
              source: "iana",
              extensions: ["fbs"],
            },
            "image/vnd.fpx": {
              source: "iana",
              extensions: ["fpx"],
            },
            "image/vnd.fst": {
              source: "iana",
              extensions: ["fst"],
            },
            "image/vnd.fujixerox.edmics-mmr": {
              source: "iana",
              extensions: ["mmr"],
            },
            "image/vnd.fujixerox.edmics-rlc": {
              source: "iana",
              extensions: ["rlc"],
            },
            "image/vnd.globalgraphics.pgb": {
              source: "iana",
            },
            "image/vnd.microsoft.icon": {
              source: "iana",
              extensions: ["ico"],
            },
            "image/vnd.mix": {
              source: "iana",
            },
            "image/vnd.mozilla.apng": {
              source: "iana",
            },
            "image/vnd.ms-dds": {
              extensions: ["dds"],
            },
            "image/vnd.ms-modi": {
              source: "iana",
              extensions: ["mdi"],
            },
            "image/vnd.ms-photo": {
              source: "apache",
              extensions: ["wdp"],
            },
            "image/vnd.net-fpx": {
              source: "iana",
              extensions: ["npx"],
            },
            "image/vnd.radiance": {
              source: "iana",
            },
            "image/vnd.sealed.png": {
              source: "iana",
            },
            "image/vnd.sealedmedia.softseal.gif": {
              source: "iana",
            },
            "image/vnd.sealedmedia.softseal.jpg": {
              source: "iana",
            },
            "image/vnd.svf": {
              source: "iana",
            },
            "image/vnd.tencent.tap": {
              source: "iana",
              extensions: ["tap"],
            },
            "image/vnd.valve.source.texture": {
              source: "iana",
              extensions: ["vtf"],
            },
            "image/vnd.wap.wbmp": {
              source: "iana",
              extensions: ["wbmp"],
            },
            "image/vnd.xiff": {
              source: "iana",
              extensions: ["xif"],
            },
            "image/vnd.zbrush.pcx": {
              source: "iana",
              extensions: ["pcx"],
            },
            "image/webp": {
              source: "apache",
              extensions: ["webp"],
            },
            "image/wmf": {
              source: "iana",
              extensions: ["wmf"],
            },
            "image/x-3ds": {
              source: "apache",
              extensions: ["3ds"],
            },
            "image/x-cmu-raster": {
              source: "apache",
              extensions: ["ras"],
            },
            "image/x-cmx": {
              source: "apache",
              extensions: ["cmx"],
            },
            "image/x-freehand": {
              source: "apache",
              extensions: ["fh", "fhc", "fh4", "fh5", "fh7"],
            },
            "image/x-icon": {
              source: "apache",
              compressible: true,
              extensions: ["ico"],
            },
            "image/x-jng": {
              source: "nginx",
              extensions: ["jng"],
            },
            "image/x-mrsid-image": {
              source: "apache",
              extensions: ["sid"],
            },
            "image/x-ms-bmp": {
              source: "nginx",
              compressible: true,
              extensions: ["bmp"],
            },
            "image/x-pcx": {
              source: "apache",
              extensions: ["pcx"],
            },
            "image/x-pict": {
              source: "apache",
              extensions: ["pic", "pct"],
            },
            "image/x-portable-anymap": {
              source: "apache",
              extensions: ["pnm"],
            },
            "image/x-portable-bitmap": {
              source: "apache",
              extensions: ["pbm"],
            },
            "image/x-portable-graymap": {
              source: "apache",
              extensions: ["pgm"],
            },
            "image/x-portable-pixmap": {
              source: "apache",
              extensions: ["ppm"],
            },
            "image/x-rgb": {
              source: "apache",
              extensions: ["rgb"],
            },
            "image/x-tga": {
              source: "apache",
              extensions: ["tga"],
            },
            "image/x-xbitmap": {
              source: "apache",
              extensions: ["xbm"],
            },
            "image/x-xcf": {
              compressible: false,
            },
            "image/x-xpixmap": {
              source: "apache",
              extensions: ["xpm"],
            },
            "image/x-xwindowdump": {
              source: "apache",
              extensions: ["xwd"],
            },
            "message/cpim": {
              source: "iana",
            },
            "message/delivery-status": {
              source: "iana",
            },
            "message/disposition-notification": {
              source: "iana",
              extensions: ["disposition-notification"],
            },
            "message/external-body": {
              source: "iana",
            },
            "message/feedback-report": {
              source: "iana",
            },
            "message/global": {
              source: "iana",
              extensions: ["u8msg"],
            },
            "message/global-delivery-status": {
              source: "iana",
              extensions: ["u8dsn"],
            },
            "message/global-disposition-notification": {
              source: "iana",
              extensions: ["u8mdn"],
            },
            "message/global-headers": {
              source: "iana",
              extensions: ["u8hdr"],
            },
            "message/http": {
              source: "iana",
              compressible: false,
            },
            "message/imdn+xml": {
              source: "iana",
              compressible: true,
            },
            "message/news": {
              source: "iana",
            },
            "message/partial": {
              source: "iana",
              compressible: false,
            },
            "message/rfc822": {
              source: "iana",
              compressible: true,
              extensions: ["eml", "mime"],
            },
            "message/s-http": {
              source: "iana",
            },
            "message/sip": {
              source: "iana",
            },
            "message/sipfrag": {
              source: "iana",
            },
            "message/tracking-status": {
              source: "iana",
            },
            "message/vnd.si.simp": {
              source: "iana",
            },
            "message/vnd.wfa.wsc": {
              source: "iana",
              extensions: ["wsc"],
            },
            "model/3mf": {
              source: "iana",
              extensions: ["3mf"],
            },
            "model/gltf+json": {
              source: "iana",
              compressible: true,
              extensions: ["gltf"],
            },
            "model/gltf-binary": {
              source: "iana",
              compressible: true,
              extensions: ["glb"],
            },
            "model/iges": {
              source: "iana",
              compressible: false,
              extensions: ["igs", "iges"],
            },
            "model/mesh": {
              source: "iana",
              compressible: false,
              extensions: ["msh", "mesh", "silo"],
            },
            "model/mtl": {
              source: "iana",
              extensions: ["mtl"],
            },
            "model/obj": {
              source: "iana",
              extensions: ["obj"],
            },
            "model/stl": {
              source: "iana",
              extensions: ["stl"],
            },
            "model/vnd.collada+xml": {
              source: "iana",
              compressible: true,
              extensions: ["dae"],
            },
            "model/vnd.dwf": {
              source: "iana",
              extensions: ["dwf"],
            },
            "model/vnd.flatland.3dml": {
              source: "iana",
            },
            "model/vnd.gdl": {
              source: "iana",
              extensions: ["gdl"],
            },
            "model/vnd.gs-gdl": {
              source: "apache",
            },
            "model/vnd.gs.gdl": {
              source: "iana",
            },
            "model/vnd.gtw": {
              source: "iana",
              extensions: ["gtw"],
            },
            "model/vnd.moml+xml": {
              source: "iana",
              compressible: true,
            },
            "model/vnd.mts": {
              source: "iana",
              extensions: ["mts"],
            },
            "model/vnd.opengex": {
              source: "iana",
              extensions: ["ogex"],
            },
            "model/vnd.parasolid.transmit.binary": {
              source: "iana",
              extensions: ["x_b"],
            },
            "model/vnd.parasolid.transmit.text": {
              source: "iana",
              extensions: ["x_t"],
            },
            "model/vnd.rosette.annotated-data-model": {
              source: "iana",
            },
            "model/vnd.usdz+zip": {
              source: "iana",
              compressible: false,
              extensions: ["usdz"],
            },
            "model/vnd.valve.source.compiled-map": {
              source: "iana",
              extensions: ["bsp"],
            },
            "model/vnd.vtu": {
              source: "iana",
              extensions: ["vtu"],
            },
            "model/vrml": {
              source: "iana",
              compressible: false,
              extensions: ["wrl", "vrml"],
            },
            "model/x3d+binary": {
              source: "apache",
              compressible: false,
              extensions: ["x3db", "x3dbz"],
            },
            "model/x3d+fastinfoset": {
              source: "iana",
              extensions: ["x3db"],
            },
            "model/x3d+vrml": {
              source: "apache",
              compressible: false,
              extensions: ["x3dv", "x3dvz"],
            },
            "model/x3d+xml": {
              source: "iana",
              compressible: true,
              extensions: ["x3d", "x3dz"],
            },
            "model/x3d-vrml": {
              source: "iana",
              extensions: ["x3dv"],
            },
            "multipart/alternative": {
              source: "iana",
              compressible: false,
            },
            "multipart/appledouble": {
              source: "iana",
            },
            "multipart/byteranges": {
              source: "iana",
            },
            "multipart/digest": {
              source: "iana",
            },
            "multipart/encrypted": {
              source: "iana",
              compressible: false,
            },
            "multipart/form-data": {
              source: "iana",
              compressible: false,
            },
            "multipart/header-set": {
              source: "iana",
            },
            "multipart/mixed": {
              source: "iana",
            },
            "multipart/multilingual": {
              source: "iana",
            },
            "multipart/parallel": {
              source: "iana",
            },
            "multipart/related": {
              source: "iana",
              compressible: false,
            },
            "multipart/report": {
              source: "iana",
            },
            "multipart/signed": {
              source: "iana",
              compressible: false,
            },
            "multipart/vnd.bint.med-plus": {
              source: "iana",
            },
            "multipart/voice-message": {
              source: "iana",
            },
            "multipart/x-mixed-replace": {
              source: "iana",
            },
            "text/1d-interleaved-parityfec": {
              source: "iana",
            },
            "text/cache-manifest": {
              source: "iana",
              compressible: true,
              extensions: ["appcache", "manifest"],
            },
            "text/calendar": {
              source: "iana",
              extensions: ["ics", "ifb"],
            },
            "text/calender": {
              compressible: true,
            },
            "text/cmd": {
              compressible: true,
            },
            "text/coffeescript": {
              extensions: ["coffee", "litcoffee"],
            },
            "text/css": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
              extensions: ["css"],
            },
            "text/csv": {
              source: "iana",
              compressible: true,
              extensions: ["csv"],
            },
            "text/csv-schema": {
              source: "iana",
            },
            "text/directory": {
              source: "iana",
            },
            "text/dns": {
              source: "iana",
            },
            "text/ecmascript": {
              source: "iana",
            },
            "text/encaprtp": {
              source: "iana",
            },
            "text/enriched": {
              source: "iana",
            },
            "text/flexfec": {
              source: "iana",
            },
            "text/fwdred": {
              source: "iana",
            },
            "text/grammar-ref-list": {
              source: "iana",
            },
            "text/html": {
              source: "iana",
              compressible: true,
              extensions: ["html", "htm", "shtml"],
            },
            "text/jade": {
              extensions: ["jade"],
            },
            "text/javascript": {
              source: "iana",
              compressible: true,
            },
            "text/jcr-cnd": {
              source: "iana",
            },
            "text/jsx": {
              compressible: true,
              extensions: ["jsx"],
            },
            "text/less": {
              compressible: true,
              extensions: ["less"],
            },
            "text/markdown": {
              source: "iana",
              compressible: true,
              extensions: ["markdown", "md"],
            },
            "text/mathml": {
              source: "nginx",
              extensions: ["mml"],
            },
            "text/mdx": {
              compressible: true,
              extensions: ["mdx"],
            },
            "text/mizar": {
              source: "iana",
            },
            "text/n3": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
              extensions: ["n3"],
            },
            "text/parameters": {
              source: "iana",
              charset: "UTF-8",
            },
            "text/parityfec": {
              source: "iana",
            },
            "text/plain": {
              source: "iana",
              compressible: true,
              extensions: [
                "txt",
                "text",
                "conf",
                "def",
                "list",
                "log",
                "in",
                "ini",
              ],
            },
            "text/provenance-notation": {
              source: "iana",
              charset: "UTF-8",
            },
            "text/prs.fallenstein.rst": {
              source: "iana",
            },
            "text/prs.lines.tag": {
              source: "iana",
              extensions: ["dsc"],
            },
            "text/prs.prop.logic": {
              source: "iana",
            },
            "text/raptorfec": {
              source: "iana",
            },
            "text/red": {
              source: "iana",
            },
            "text/rfc822-headers": {
              source: "iana",
            },
            "text/richtext": {
              source: "iana",
              compressible: true,
              extensions: ["rtx"],
            },
            "text/rtf": {
              source: "iana",
              compressible: true,
              extensions: ["rtf"],
            },
            "text/rtp-enc-aescm128": {
              source: "iana",
            },
            "text/rtploopback": {
              source: "iana",
            },
            "text/rtx": {
              source: "iana",
            },
            "text/sgml": {
              source: "iana",
              extensions: ["sgml", "sgm"],
            },
            "text/shex": {
              extensions: ["shex"],
            },
            "text/slim": {
              extensions: ["slim", "slm"],
            },
            "text/strings": {
              source: "iana",
            },
            "text/stylus": {
              extensions: ["stylus", "styl"],
            },
            "text/t140": {
              source: "iana",
            },
            "text/tab-separated-values": {
              source: "iana",
              compressible: true,
              extensions: ["tsv"],
            },
            "text/troff": {
              source: "iana",
              extensions: ["t", "tr", "roff", "man", "me", "ms"],
            },
            "text/turtle": {
              source: "iana",
              charset: "UTF-8",
              extensions: ["ttl"],
            },
            "text/ulpfec": {
              source: "iana",
            },
            "text/uri-list": {
              source: "iana",
              compressible: true,
              extensions: ["uri", "uris", "urls"],
            },
            "text/vcard": {
              source: "iana",
              compressible: true,
              extensions: ["vcard"],
            },
            "text/vnd.a": {
              source: "iana",
            },
            "text/vnd.abc": {
              source: "iana",
            },
            "text/vnd.ascii-art": {
              source: "iana",
            },
            "text/vnd.curl": {
              source: "iana",
              extensions: ["curl"],
            },
            "text/vnd.curl.dcurl": {
              source: "apache",
              extensions: ["dcurl"],
            },
            "text/vnd.curl.mcurl": {
              source: "apache",
              extensions: ["mcurl"],
            },
            "text/vnd.curl.scurl": {
              source: "apache",
              extensions: ["scurl"],
            },
            "text/vnd.debian.copyright": {
              source: "iana",
              charset: "UTF-8",
            },
            "text/vnd.dmclientscript": {
              source: "iana",
            },
            "text/vnd.dvb.subtitle": {
              source: "iana",
              extensions: ["sub"],
            },
            "text/vnd.esmertec.theme-descriptor": {
              source: "iana",
              charset: "UTF-8",
            },
            "text/vnd.ficlab.flt": {
              source: "iana",
            },
            "text/vnd.fly": {
              source: "iana",
              extensions: ["fly"],
            },
            "text/vnd.fmi.flexstor": {
              source: "iana",
              extensions: ["flx"],
            },
            "text/vnd.gml": {
              source: "iana",
            },
            "text/vnd.graphviz": {
              source: "iana",
              extensions: ["gv"],
            },
            "text/vnd.hgl": {
              source: "iana",
            },
            "text/vnd.in3d.3dml": {
              source: "iana",
              extensions: ["3dml"],
            },
            "text/vnd.in3d.spot": {
              source: "iana",
              extensions: ["spot"],
            },
            "text/vnd.iptc.newsml": {
              source: "iana",
            },
            "text/vnd.iptc.nitf": {
              source: "iana",
            },
            "text/vnd.latex-z": {
              source: "iana",
            },
            "text/vnd.motorola.reflex": {
              source: "iana",
            },
            "text/vnd.ms-mediapackage": {
              source: "iana",
            },
            "text/vnd.net2phone.commcenter.command": {
              source: "iana",
            },
            "text/vnd.radisys.msml-basic-layout": {
              source: "iana",
            },
            "text/vnd.senx.warpscript": {
              source: "iana",
            },
            "text/vnd.si.uricatalogue": {
              source: "iana",
            },
            "text/vnd.sosi": {
              source: "iana",
            },
            "text/vnd.sun.j2me.app-descriptor": {
              source: "iana",
              charset: "UTF-8",
              extensions: ["jad"],
            },
            "text/vnd.trolltech.linguist": {
              source: "iana",
              charset: "UTF-8",
            },
            "text/vnd.wap.si": {
              source: "iana",
            },
            "text/vnd.wap.sl": {
              source: "iana",
            },
            "text/vnd.wap.wml": {
              source: "iana",
              extensions: ["wml"],
            },
            "text/vnd.wap.wmlscript": {
              source: "iana",
              extensions: ["wmls"],
            },
            "text/vtt": {
              source: "iana",
              charset: "UTF-8",
              compressible: true,
              extensions: ["vtt"],
            },
            "text/x-asm": {
              source: "apache",
              extensions: ["s", "asm"],
            },
            "text/x-c": {
              source: "apache",
              extensions: ["c", "cc", "cxx", "cpp", "h", "hh", "dic"],
            },
            "text/x-component": {
              source: "nginx",
              extensions: ["htc"],
            },
            "text/x-fortran": {
              source: "apache",
              extensions: ["f", "for", "f77", "f90"],
            },
            "text/x-gwt-rpc": {
              compressible: true,
            },
            "text/x-handlebars-template": {
              extensions: ["hbs"],
            },
            "text/x-java-source": {
              source: "apache",
              extensions: ["java"],
            },
            "text/x-jquery-tmpl": {
              compressible: true,
            },
            "text/x-lua": {
              extensions: ["lua"],
            },
            "text/x-markdown": {
              compressible: true,
              extensions: ["mkd"],
            },
            "text/x-nfo": {
              source: "apache",
              extensions: ["nfo"],
            },
            "text/x-opml": {
              source: "apache",
              extensions: ["opml"],
            },
            "text/x-org": {
              compressible: true,
              extensions: ["org"],
            },
            "text/x-pascal": {
              source: "apache",
              extensions: ["p", "pas"],
            },
            "text/x-processing": {
              compressible: true,
              extensions: ["pde"],
            },
            "text/x-sass": {
              extensions: ["sass"],
            },
            "text/x-scss": {
              extensions: ["scss"],
            },
            "text/x-setext": {
              source: "apache",
              extensions: ["etx"],
            },
            "text/x-sfv": {
              source: "apache",
              extensions: ["sfv"],
            },
            "text/x-suse-ymp": {
              compressible: true,
              extensions: ["ymp"],
            },
            "text/x-uuencode": {
              source: "apache",
              extensions: ["uu"],
            },
            "text/x-vcalendar": {
              source: "apache",
              extensions: ["vcs"],
            },
            "text/x-vcard": {
              source: "apache",
              extensions: ["vcf"],
            },
            "text/xml": {
              source: "iana",
              compressible: true,
              extensions: ["xml"],
            },
            "text/xml-external-parsed-entity": {
              source: "iana",
            },
            "text/yaml": {
              extensions: ["yaml", "yml"],
            },
            "video/1d-interleaved-parityfec": {
              source: "iana",
            },
            "video/3gpp": {
              source: "iana",
              extensions: ["3gp", "3gpp"],
            },
            "video/3gpp-tt": {
              source: "iana",
            },
            "video/3gpp2": {
              source: "iana",
              extensions: ["3g2"],
            },
            "video/bmpeg": {
              source: "iana",
            },
            "video/bt656": {
              source: "iana",
            },
            "video/celb": {
              source: "iana",
            },
            "video/dv": {
              source: "iana",
            },
            "video/encaprtp": {
              source: "iana",
            },
            "video/flexfec": {
              source: "iana",
            },
            "video/h261": {
              source: "iana",
              extensions: ["h261"],
            },
            "video/h263": {
              source: "iana",
              extensions: ["h263"],
            },
            "video/h263-1998": {
              source: "iana",
            },
            "video/h263-2000": {
              source: "iana",
            },
            "video/h264": {
              source: "iana",
              extensions: ["h264"],
            },
            "video/h264-rcdo": {
              source: "iana",
            },
            "video/h264-svc": {
              source: "iana",
            },
            "video/h265": {
              source: "iana",
            },
            "video/iso.segment": {
              source: "iana",
            },
            "video/jpeg": {
              source: "iana",
              extensions: ["jpgv"],
            },
            "video/jpeg2000": {
              source: "iana",
            },
            "video/jpm": {
              source: "apache",
              extensions: ["jpm", "jpgm"],
            },
            "video/mj2": {
              source: "iana",
              extensions: ["mj2", "mjp2"],
            },
            "video/mp1s": {
              source: "iana",
            },
            "video/mp2p": {
              source: "iana",
            },
            "video/mp2t": {
              source: "iana",
              extensions: ["ts"],
            },
            "video/mp4": {
              source: "iana",
              compressible: false,
              extensions: ["mp4", "mp4v", "mpg4"],
            },
            "video/mp4v-es": {
              source: "iana",
            },
            "video/mpeg": {
              source: "iana",
              compressible: false,
              extensions: ["mpeg", "mpg", "mpe", "m1v", "m2v"],
            },
            "video/mpeg4-generic": {
              source: "iana",
            },
            "video/mpv": {
              source: "iana",
            },
            "video/nv": {
              source: "iana",
            },
            "video/ogg": {
              source: "iana",
              compressible: false,
              extensions: ["ogv"],
            },
            "video/parityfec": {
              source: "iana",
            },
            "video/pointer": {
              source: "iana",
            },
            "video/quicktime": {
              source: "iana",
              compressible: false,
              extensions: ["qt", "mov"],
            },
            "video/raptorfec": {
              source: "iana",
            },
            "video/raw": {
              source: "iana",
            },
            "video/rtp-enc-aescm128": {
              source: "iana",
            },
            "video/rtploopback": {
              source: "iana",
            },
            "video/rtx": {
              source: "iana",
            },
            "video/smpte291": {
              source: "iana",
            },
            "video/smpte292m": {
              source: "iana",
            },
            "video/ulpfec": {
              source: "iana",
            },
            "video/vc1": {
              source: "iana",
            },
            "video/vc2": {
              source: "iana",
            },
            "video/vnd.cctv": {
              source: "iana",
            },
            "video/vnd.dece.hd": {
              source: "iana",
              extensions: ["uvh", "uvvh"],
            },
            "video/vnd.dece.mobile": {
              source: "iana",
              extensions: ["uvm", "uvvm"],
            },
            "video/vnd.dece.mp4": {
              source: "iana",
            },
            "video/vnd.dece.pd": {
              source: "iana",
              extensions: ["uvp", "uvvp"],
            },
            "video/vnd.dece.sd": {
              source: "iana",
              extensions: ["uvs", "uvvs"],
            },
            "video/vnd.dece.video": {
              source: "iana",
              extensions: ["uvv", "uvvv"],
            },
            "video/vnd.directv.mpeg": {
              source: "iana",
            },
            "video/vnd.directv.mpeg-tts": {
              source: "iana",
            },
            "video/vnd.dlna.mpeg-tts": {
              source: "iana",
            },
            "video/vnd.dvb.file": {
              source: "iana",
              extensions: ["dvb"],
            },
            "video/vnd.fvt": {
              source: "iana",
              extensions: ["fvt"],
            },
            "video/vnd.hns.video": {
              source: "iana",
            },
            "video/vnd.iptvforum.1dparityfec-1010": {
              source: "iana",
            },
            "video/vnd.iptvforum.1dparityfec-2005": {
              source: "iana",
            },
            "video/vnd.iptvforum.2dparityfec-1010": {
              source: "iana",
            },
            "video/vnd.iptvforum.2dparityfec-2005": {
              source: "iana",
            },
            "video/vnd.iptvforum.ttsavc": {
              source: "iana",
            },
            "video/vnd.iptvforum.ttsmpeg2": {
              source: "iana",
            },
            "video/vnd.motorola.video": {
              source: "iana",
            },
            "video/vnd.motorola.videop": {
              source: "iana",
            },
            "video/vnd.mpegurl": {
              source: "iana",
              extensions: ["mxu", "m4u"],
            },
            "video/vnd.ms-playready.media.pyv": {
              source: "iana",
              extensions: ["pyv"],
            },
            "video/vnd.nokia.interleaved-multimedia": {
              source: "iana",
            },
            "video/vnd.nokia.mp4vr": {
              source: "iana",
            },
            "video/vnd.nokia.videovoip": {
              source: "iana",
            },
            "video/vnd.objectvideo": {
              source: "iana",
            },
            "video/vnd.radgamettools.bink": {
              source: "iana",
            },
            "video/vnd.radgamettools.smacker": {
              source: "iana",
            },
            "video/vnd.sealed.mpeg1": {
              source: "iana",
            },
            "video/vnd.sealed.mpeg4": {
              source: "iana",
            },
            "video/vnd.sealed.swf": {
              source: "iana",
            },
            "video/vnd.sealedmedia.softseal.mov": {
              source: "iana",
            },
            "video/vnd.uvvu.mp4": {
              source: "iana",
              extensions: ["uvu", "uvvu"],
            },
            "video/vnd.vivo": {
              source: "iana",
              extensions: ["viv"],
            },
            "video/vnd.youtube.yt": {
              source: "iana",
            },
            "video/vp8": {
              source: "iana",
            },
            "video/webm": {
              source: "apache",
              compressible: false,
              extensions: ["webm"],
            },
            "video/x-f4v": {
              source: "apache",
              extensions: ["f4v"],
            },
            "video/x-fli": {
              source: "apache",
              extensions: ["fli"],
            },
            "video/x-flv": {
              source: "apache",
              compressible: false,
              extensions: ["flv"],
            },
            "video/x-m4v": {
              source: "apache",
              extensions: ["m4v"],
            },
            "video/x-matroska": {
              source: "apache",
              compressible: false,
              extensions: ["mkv", "mk3d", "mks"],
            },
            "video/x-mng": {
              source: "apache",
              extensions: ["mng"],
            },
            "video/x-ms-asf": {
              source: "apache",
              extensions: ["asf", "asx"],
            },
            "video/x-ms-vob": {
              source: "apache",
              extensions: ["vob"],
            },
            "video/x-ms-wm": {
              source: "apache",
              extensions: ["wm"],
            },
            "video/x-ms-wmv": {
              source: "apache",
              compressible: false,
              extensions: ["wmv"],
            },
            "video/x-ms-wmx": {
              source: "apache",
              extensions: ["wmx"],
            },
            "video/x-ms-wvx": {
              source: "apache",
              extensions: ["wvx"],
            },
            "video/x-msvideo": {
              source: "apache",
              extensions: ["avi"],
            },
            "video/x-sgi-movie": {
              source: "apache",
              extensions: ["movie"],
            },
            "video/x-smv": {
              source: "apache",
              extensions: ["smv"],
            },
            "x-conference/x-cooltalk": {
              source: "apache",
              extensions: ["ice"],
            },
            "x-shader/x-fragment": {
              compressible: true,
            },
            "x-shader/x-vertex": {
              compressible: true,
            },
          },
        );
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/x/media_types@v2.3.5/deps",
  ["https://deno.land/std@0.56.0/path/mod"],
  function (exports_38, context_38) {
    "use strict";
    var __moduleName = context_38 && context_38.id;
    return {
      setters: [
        function (mod_ts_6_1) {
          exports_38({
            "extname": mod_ts_6_1["extname"],
          });
        },
      ],
      execute: function () {
      },
    };
  },
);
/*!
 * Ported from: https://github.com/jshttp/mime-types and licensed as:
 *
 * (The MIT License)
 *
 * Copyright (c) 2014 Jonathan Ong <me@jongleberry.com>
 * Copyright (c) 2015 Douglas Christopher Wilson <doug@somethingdoug.com>
 * Copyright (c) 2020 the Deno authors
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
System.register(
  "https://deno.land/x/media_types@v2.3.5/mod",
  [
    "https://deno.land/x/media_types@v2.3.5/db",
    "https://deno.land/x/media_types@v2.3.5/deps",
  ],
  function (exports_39, context_39) {
    "use strict";
    var db_ts_1,
      deps_ts_1,
      EXTRACT_TYPE_REGEXP,
      TEXT_TYPE_REGEXP,
      extensions,
      types;
    var __moduleName = context_39 && context_39.id;
    /** Internal function to populate the maps based on the Mime DB */
    function populateMaps(extensions, types) {
      const preference = ["nginx", "apache", undefined, "iana"];
      for (const type of Object.keys(db_ts_1.db)) {
        const mime = db_ts_1.db[type];
        const exts = mime.extensions;
        if (!exts || !exts.length) {
          continue;
        }
        extensions.set(type, exts);
        for (const ext of exts) {
          const current = types.get(ext);
          if (current) {
            const from = preference.indexOf(db_ts_1.db[current].source);
            const to = preference.indexOf(mime.source);
            if (
              current !== "application/octet-stream" &&
              (from > to ||
                (from === to && current.substr(0, 12) === "application/"))
            ) {
              continue;
            }
          }
          types.set(ext, type);
        }
      }
    }
    /** Given a media type return any default charset string.  Returns `undefined`
     * if not resolvable.
     */
    function charset(type) {
      const m = EXTRACT_TYPE_REGEXP.exec(type);
      if (!m) {
        return;
      }
      const [match] = m;
      const mime = db_ts_1.db[match.toLowerCase()];
      if (mime && mime.charset) {
        return mime.charset;
      }
      if (TEXT_TYPE_REGEXP.test(match)) {
        return "UTF-8";
      }
    }
    exports_39("charset", charset);
    /** Given an extension, lookup the appropriate media type for that extension.
     * Likely you should be using `contentType()` though instead.
     */
    function lookup(path) {
      const extension = deps_ts_1.extname("x." + path)
        .toLowerCase()
        .substr(1);
      return types.get(extension);
    }
    exports_39("lookup", lookup);
    /** Given an extension or media type, return the full `Content-Type` header
     * string.  Returns `undefined` if not resolvable.
     */
    function contentType(str) {
      let mime = str.includes("/") ? str : lookup(str);
      if (!mime) {
        return;
      }
      if (!mime.includes("charset")) {
        const cs = charset(mime);
        if (cs) {
          mime += `; charset=${cs.toLowerCase()}`;
        }
      }
      return mime;
    }
    exports_39("contentType", contentType);
    /** Given a media type, return the most appropriate extension or return
     * `undefined` if there is none.
     */
    function extension(type) {
      const match = EXTRACT_TYPE_REGEXP.exec(type);
      if (!match) {
        return;
      }
      const exts = extensions.get(match[1].toLowerCase());
      if (!exts || !exts.length) {
        return;
      }
      return exts[0];
    }
    exports_39("extension", extension);
    return {
      setters: [
        function (db_ts_1_1) {
          db_ts_1 = db_ts_1_1;
        },
        function (deps_ts_1_1) {
          deps_ts_1 = deps_ts_1_1;
        },
      ],
      execute: function () {
        EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
        TEXT_TYPE_REGEXP = /^text\//i;
        /** A map of extensions for a given media type */
        exports_39("extensions", extensions = new Map());
        /** A map of the media type for a given extension */
        exports_39("types", types = new Map());
        // Populate the maps upon module load
        populateMaps(extensions, types);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/deps",
  [
    "https://deno.land/std@0.56.0/http/server",
    "https://deno.land/std@0.56.0/path/mod",
    "https://deno.land/std@0.56.0/http/cookie",
    "https://deno.land/x/media_types@v2.3.5/mod",
  ],
  function (exports_40, context_40) {
    "use strict";
    var __moduleName = context_40 && context_40.id;
    return {
      setters: [
        function (server_ts_2_1) {
          exports_40({
            "serve": server_ts_2_1["serve"],
            "Server": server_ts_2_1["Server"],
            "ServerRequest": server_ts_2_1["ServerRequest"],
          });
        },
        function (mod_ts_7_1) {
          exports_40({
            "normalize": mod_ts_7_1["normalize"],
            "basename": mod_ts_7_1["basename"],
            "extname": mod_ts_7_1["extname"],
            "parse": mod_ts_7_1["parse"],
            "sep": mod_ts_7_1["sep"],
            "join": mod_ts_7_1["join"],
            "resolve": mod_ts_7_1["resolve"],
            "isAbsolute": mod_ts_7_1["isAbsolute"],
          });
        },
        function (cookie_ts_1_1) {
          exports_40({
            "getCookies": cookie_ts_1_1["getCookies"],
          });
        },
        function (mod_ts_8_1) {
          exports_40({
            "contentType": mod_ts_8_1["contentType"],
          });
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/models/response",
  ["https://deno.land/x/alosaur/src/renderer/content"],
  function (exports_41, context_41) {
    "use strict";
    var content_ts_1, Response;
    var __moduleName = context_41 && context_41.id;
    return {
      setters: [
        function (content_ts_1_1) {
          content_ts_1 = content_ts_1_1;
        },
      ],
      execute: function () {
        Response = class Response {
          constructor() {
            this.headers = new Headers();
            this.immediately = false;
          }
          setImmediately() {
            this.immediately = true;
          }
          isImmediately() {
            return this.immediately;
          }
          getRaw() {
            return {
              headers: this.headers,
              body: this.body,
              status: this.status,
            };
          }
          getMergedResult() {
            if (this.body !== undefined) {
              return this.getRaw();
            }
            const result = this.result;
            let response;
            if (result !== undefined && result.__isActionResult) {
              response = result;
            } else {
              response = content_ts_1.Content(result);
            }
            // merge headers
            response.headers = new Headers(
              [...response.headers, ...this.headers],
            );
            delete response.__isActionResult;
            return response;
          }
        };
        exports_41("Response", Response);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/renderer/content",
  ["https://deno.land/x/alosaur/src/deps"],
  function (exports_42, context_42) {
    "use strict";
    var deps_ts_2;
    var __moduleName = context_42 && context_42.id;
    /**
     * Render json, number, boolean, or string content
     */
    function Content(result, status = 200) {
      let body;
      const headers = new Headers();
      switch (typeof result) {
        case "object":
        case "boolean":
        case "number":
          headers.set("content-type", deps_ts_2.contentType("file.json"));
          body = new TextEncoder().encode(JSON.stringify(result));
          break;
        default:
          headers.set("content-type", deps_ts_2.contentType("text/html"));
          body = new TextEncoder().encode(result || "");
          break;
      }
      return {
        body,
        status,
        headers,
        __isActionResult: true,
      };
    }
    exports_42("Content", Content);
    return {
      setters: [
        function (deps_ts_2_1) {
          deps_ts_2 = deps_ts_2_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/log/levels",
  [],
  function (exports_43, context_43) {
    "use strict";
    var LogLevels, LogLevelNames, byLevel;
    var __moduleName = context_43 && context_43.id;
    /** Returns the numeric log level associated with the passed,
     * stringy log level name.
     */
    function getLevelByName(name) {
      switch (name) {
        case "NOTSET":
          return LogLevels.NOTSET;
        case "DEBUG":
          return LogLevels.DEBUG;
        case "INFO":
          return LogLevels.INFO;
        case "WARNING":
          return LogLevels.WARNING;
        case "ERROR":
          return LogLevels.ERROR;
        case "CRITICAL":
          return LogLevels.CRITICAL;
        default:
          throw new Error(`no log level found for "${name}"`);
      }
    }
    exports_43("getLevelByName", getLevelByName);
    /** Returns the stringy log level name provided the numeric log level */
    function getLevelName(level) {
      const levelName = byLevel[level];
      if (levelName) {
        return levelName;
      }
      throw new Error(`no level name found for level: ${level}`);
    }
    exports_43("getLevelName", getLevelName);
    return {
      setters: [],
      execute: function () {
        // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
        /** Get log level numeric values through enum constants
             */
        (function (LogLevels) {
          LogLevels[LogLevels["NOTSET"] = 0] = "NOTSET";
          LogLevels[LogLevels["DEBUG"] = 10] = "DEBUG";
          LogLevels[LogLevels["INFO"] = 20] = "INFO";
          LogLevels[LogLevels["WARNING"] = 30] = "WARNING";
          LogLevels[LogLevels["ERROR"] = 40] = "ERROR";
          LogLevels[LogLevels["CRITICAL"] = 50] = "CRITICAL";
        })(LogLevels || (LogLevels = {}));
        exports_43("LogLevels", LogLevels);
        /** Permitted log level names */
        exports_43(
          "LogLevelNames",
          LogLevelNames = Object.keys(LogLevels).filter((key) =>
            isNaN(Number(key))
          ),
        );
        byLevel = {
          [String(LogLevels.NOTSET)]: "NOTSET",
          [String(LogLevels.DEBUG)]: "DEBUG",
          [String(LogLevels.INFO)]: "INFO",
          [String(LogLevels.WARNING)]: "WARNING",
          [String(LogLevels.ERROR)]: "ERROR",
          [String(LogLevels.CRITICAL)]: "CRITICAL",
        };
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/fs/exists",
  [],
  function (exports_44, context_44) {
    "use strict";
    var lstat, lstatSync;
    var __moduleName = context_44 && context_44.id;
    /**
     * Test whether or not the given path exists by checking with the file system
     */
    async function exists(filePath) {
      try {
        await lstat(filePath);
        return true;
      } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
          return false;
        }
        throw err;
      }
    }
    exports_44("exists", exists);
    /**
     * Test whether or not the given path exists by checking with the file system
     */
    function existsSync(filePath) {
      try {
        lstatSync(filePath);
        return true;
      } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
          return false;
        }
        throw err;
      }
    }
    exports_44("existsSync", existsSync);
    return {
      setters: [],
      execute: function () {
        // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
        lstat = Deno.lstat, lstatSync = Deno.lstatSync;
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/log/handlers",
  [
    "https://deno.land/std@0.56.0/log/levels",
    "https://deno.land/std@0.56.0/fmt/colors",
    "https://deno.land/std@0.56.0/fs/exists",
    "https://deno.land/std@0.56.0/io/bufio",
  ],
  function (exports_45, context_45) {
    "use strict";
    var open,
      openSync,
      close,
      renameSync,
      stat,
      levels_ts_1,
      colors_ts_2,
      exists_ts_1,
      bufio_ts_3,
      DEFAULT_FORMATTER,
      BaseHandler,
      ConsoleHandler,
      WriterHandler,
      FileHandler,
      RotatingFileHandler;
    var __moduleName = context_45 && context_45.id;
    return {
      setters: [
        function (levels_ts_1_1) {
          levels_ts_1 = levels_ts_1_1;
        },
        function (colors_ts_2_1) {
          colors_ts_2 = colors_ts_2_1;
        },
        function (exists_ts_1_1) {
          exists_ts_1 = exists_ts_1_1;
        },
        function (bufio_ts_3_1) {
          bufio_ts_3 = bufio_ts_3_1;
        },
      ],
      execute: function () {
        // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
        open = Deno.open,
          openSync = Deno.openSync,
          close = Deno.close,
          renameSync = Deno.renameSync,
          stat = Deno.stat;
        DEFAULT_FORMATTER = "{levelName} {msg}";
        BaseHandler = class BaseHandler {
          constructor(levelName, options = {}) {
            this.level = levels_ts_1.getLevelByName(levelName);
            this.levelName = levelName;
            this.formatter = options.formatter || DEFAULT_FORMATTER;
          }
          handle(logRecord) {
            if (this.level > logRecord.level) {
              return;
            }
            const msg = this.format(logRecord);
            return this.log(msg);
          }
          format(logRecord) {
            if (this.formatter instanceof Function) {
              return this.formatter(logRecord);
            }
            return this.formatter.replace(/{(\S+)}/g, (match, p1) => {
              const value = logRecord[p1];
              // do not interpolate missing values
              if (!value) {
                return match;
              }
              return String(value);
            });
          }
          log(_msg) {}
          async setup() {}
          async destroy() {}
        };
        exports_45("BaseHandler", BaseHandler);
        ConsoleHandler = class ConsoleHandler extends BaseHandler {
          format(logRecord) {
            let msg = super.format(logRecord);
            switch (logRecord.level) {
              case levels_ts_1.LogLevels.INFO:
                msg = colors_ts_2.blue(msg);
                break;
              case levels_ts_1.LogLevels.WARNING:
                msg = colors_ts_2.yellow(msg);
                break;
              case levels_ts_1.LogLevels.ERROR:
                msg = colors_ts_2.red(msg);
                break;
              case levels_ts_1.LogLevels.CRITICAL:
                msg = colors_ts_2.bold(colors_ts_2.red(msg));
                break;
              default:
                break;
            }
            return msg;
          }
          log(msg) {
            console.log(msg);
          }
        };
        exports_45("ConsoleHandler", ConsoleHandler);
        WriterHandler = class WriterHandler extends BaseHandler {
          constructor() {
            super(...arguments);
            this.#encoder = new TextEncoder();
          }
          #encoder;
        };
        exports_45("WriterHandler", WriterHandler);
        FileHandler = class FileHandler extends WriterHandler {
          constructor(levelName, options) {
            super(levelName, options);
            this._encoder = new TextEncoder();
            this.#intervalId = -1;
            this.#unloadCallback = () => this.destroy();
            this._filename = options.filename;
            // default to append mode, write only
            this._mode = options.mode ? options.mode : "a";
            this._openOptions = {
              createNew: this._mode === "x",
              create: this._mode !== "x",
              append: this._mode === "a",
              truncate: this._mode !== "a",
              write: true,
            };
          }
          #intervalId;
          #unloadCallback;
          async setup() {
            this._file = await open(this._filename, this._openOptions);
            this._writer = this._file;
            this._buf = new bufio_ts_3.BufWriterSync(this._file);
            addEventListener("unload", this.#unloadCallback);
            // flush the buffer every 30 seconds
            this.#intervalId = setInterval(() => this.flush(), 30 * 1000);
          }
          handle(logRecord) {
            super.handle(logRecord);
            // Immediately flush if log level is higher than ERROR
            if (logRecord.level > levels_ts_1.LogLevels.ERROR) {
              this.flush();
            }
          }
          log(msg) {
            this._buf.writeSync(this._encoder.encode(msg + "\n"));
          }
          flush() {
            if (this._buf?.buffered() > 0) {
              this._buf.flush();
            }
          }
          destroy() {
            this.flush();
            this._file?.close();
            this._file = undefined;
            removeEventListener("unload", this.#unloadCallback);
            clearInterval(this.#intervalId);
            return Promise.resolve();
          }
        };
        exports_45("FileHandler", FileHandler);
        RotatingFileHandler = class RotatingFileHandler extends FileHandler {
          constructor(levelName, options) {
            super(levelName, options);
            this.#currentFileSize = 0;
            this.#maxBytes = options.maxBytes;
            this.#maxBackupCount = options.maxBackupCount;
          }
          #maxBytes;
          #maxBackupCount;
          #currentFileSize;
          async setup() {
            if (this.#maxBytes < 1) {
              this.destroy();
              throw new Error("maxBytes cannot be less than 1");
            }
            if (this.#maxBackupCount < 1) {
              this.destroy();
              throw new Error("maxBackupCount cannot be less than 1");
            }
            await super.setup();
            if (this._mode === "w") {
              // Remove old backups too as it doesn't make sense to start with a clean
              // log file, but old backups
              for (let i = 1; i <= this.#maxBackupCount; i++) {
                if (await exists_ts_1.exists(this._filename + "." + i)) {
                  await Deno.remove(this._filename + "." + i);
                }
              }
            } else if (this._mode === "x") {
              // Throw if any backups also exist
              for (let i = 1; i <= this.#maxBackupCount; i++) {
                if (await exists_ts_1.exists(this._filename + "." + i)) {
                  this.destroy();
                  throw new Deno.errors.AlreadyExists(
                    "Backup log file " + this._filename + "." + i +
                      " already exists",
                  );
                }
              }
            } else {
              this.#currentFileSize = (await stat(this._filename)).size;
            }
          }
          log(msg) {
            const msgByteLength = this._encoder.encode(msg).byteLength + 1;
            if (this.#currentFileSize + msgByteLength > this.#maxBytes) {
              this.rotateLogFiles();
              this.#currentFileSize = 0;
            }
            this._buf.writeSync(this._encoder.encode(msg + "\n"));
            this.#currentFileSize += msgByteLength;
          }
          rotateLogFiles() {
            this._buf.flush();
            close(this._file.rid);
            for (let i = this.#maxBackupCount - 1; i >= 0; i--) {
              const source = this._filename + (i === 0 ? "" : "." + i);
              const dest = this._filename + "." + (i + 1);
              if (exists_ts_1.existsSync(source)) {
                renameSync(source, dest);
              }
            }
            this._file = openSync(this._filename, this._openOptions);
            this._writer = this._file;
            this._buf = new bufio_ts_3.BufWriterSync(this._file);
          }
        };
        exports_45("RotatingFileHandler", RotatingFileHandler);
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/log/logger",
  ["https://deno.land/std@0.56.0/log/levels"],
  function (exports_46, context_46) {
    "use strict";
    var levels_ts_2, LogRecord, Logger;
    var __moduleName = context_46 && context_46.id;
    return {
      setters: [
        function (levels_ts_2_1) {
          levels_ts_2 = levels_ts_2_1;
        },
      ],
      execute: function () {
        LogRecord = class LogRecord {
          constructor(msg, args, level) {
            this.msg = msg;
            this.#args = [...args];
            this.level = level;
            this.#datetime = new Date();
            this.levelName = levels_ts_2.getLevelName(level);
          }
          #args;
          #datetime;
          get args() {
            return [...this.#args];
          }
          get datetime() {
            return new Date(this.#datetime.getTime());
          }
        };
        exports_46("LogRecord", LogRecord);
        Logger = class Logger {
          constructor(levelName, handlers) {
            this.level = levels_ts_2.getLevelByName(levelName);
            this.levelName = levelName;
            this.handlers = handlers || [];
          }
          _log(level, msg, ...args) {
            if (this.level > level) {
              return;
            }
            const record = new LogRecord(msg, args, level);
            this.handlers.forEach((handler) => {
              handler.handle(record);
            });
          }
          debug(msg, ...args) {
            this._log(levels_ts_2.LogLevels.DEBUG, msg, ...args);
          }
          info(msg, ...args) {
            this._log(levels_ts_2.LogLevels.INFO, msg, ...args);
          }
          warning(msg, ...args) {
            this._log(levels_ts_2.LogLevels.WARNING, msg, ...args);
          }
          error(msg, ...args) {
            this._log(levels_ts_2.LogLevels.ERROR, msg, ...args);
          }
          critical(msg, ...args) {
            this._log(levels_ts_2.LogLevels.CRITICAL, msg, ...args);
          }
        };
        exports_46("Logger", Logger);
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/log/mod",
  [
    "https://deno.land/std@0.56.0/log/logger",
    "https://deno.land/std@0.56.0/log/handlers",
    "https://deno.land/std@0.56.0/testing/asserts",
    "https://deno.land/std@0.56.0/log/levels",
  ],
  function (exports_47, context_47) {
    "use strict";
    var logger_ts_1,
      handlers_ts_1,
      asserts_ts_8,
      LoggerConfig,
      DEFAULT_LEVEL,
      DEFAULT_CONFIG,
      state,
      handlers,
      debug,
      info,
      warning,
      error,
      critical;
    var __moduleName = context_47 && context_47.id;
    function getLogger(name) {
      if (!name) {
        const d = state.loggers.get("default");
        asserts_ts_8.assert(
          d != null,
          `"default" logger must be set for getting logger without name`,
        );
        return d;
      }
      const result = state.loggers.get(name);
      if (!result) {
        const logger = new logger_ts_1.Logger("NOTSET", []);
        state.loggers.set(name, logger);
        return logger;
      }
      return result;
    }
    exports_47("getLogger", getLogger);
    async function setup(config) {
      state.config = {
        handlers: { ...DEFAULT_CONFIG.handlers, ...config.handlers },
        loggers: { ...DEFAULT_CONFIG.loggers, ...config.loggers },
      };
      // tear down existing handlers
      state.handlers.forEach((handler) => {
        handler.destroy();
      });
      state.handlers.clear();
      // setup handlers
      const handlers = state.config.handlers || {};
      for (const handlerName in handlers) {
        const handler = handlers[handlerName];
        await handler.setup();
        state.handlers.set(handlerName, handler);
      }
      // remove existing loggers
      state.loggers.clear();
      // setup loggers
      const loggers = state.config.loggers || {};
      for (const loggerName in loggers) {
        const loggerConfig = loggers[loggerName];
        const handlerNames = loggerConfig.handlers || [];
        const handlers = [];
        handlerNames.forEach((handlerName) => {
          const handler = state.handlers.get(handlerName);
          if (handler) {
            handlers.push(handler);
          }
        });
        const levelName = loggerConfig.level || DEFAULT_LEVEL;
        const logger = new logger_ts_1.Logger(levelName, handlers);
        state.loggers.set(loggerName, logger);
      }
    }
    exports_47("setup", setup);
    return {
      setters: [
        function (logger_ts_1_1) {
          logger_ts_1 = logger_ts_1_1;
        },
        function (handlers_ts_1_1) {
          handlers_ts_1 = handlers_ts_1_1;
        },
        function (asserts_ts_8_1) {
          asserts_ts_8 = asserts_ts_8_1;
        },
        function (levels_ts_3_1) {
          exports_47({
            "LogLevels": levels_ts_3_1["LogLevels"],
          });
        },
      ],
      execute: async function () {
        LoggerConfig = class LoggerConfig {
        };
        exports_47("LoggerConfig", LoggerConfig);
        DEFAULT_LEVEL = "INFO";
        DEFAULT_CONFIG = {
          handlers: {
            default: new handlers_ts_1.ConsoleHandler(DEFAULT_LEVEL),
          },
          loggers: {
            default: {
              level: DEFAULT_LEVEL,
              handlers: ["default"],
            },
          },
        };
        state = {
          handlers: new Map(),
          loggers: new Map(),
          config: DEFAULT_CONFIG,
        };
        exports_47(
          "handlers",
          handlers = {
            BaseHandler: handlers_ts_1.BaseHandler,
            ConsoleHandler: handlers_ts_1.ConsoleHandler,
            WriterHandler: handlers_ts_1.WriterHandler,
            FileHandler: handlers_ts_1.FileHandler,
            RotatingFileHandler: handlers_ts_1.RotatingFileHandler,
          },
        );
        exports_47(
          "debug",
          debug = (msg, ...args) => getLogger("default").debug(msg, ...args),
        );
        exports_47(
          "info",
          info = (msg, ...args) => getLogger("default").info(msg, ...args),
        );
        exports_47(
          "warning",
          warning = (msg, ...args) =>
            getLogger("default").warning(msg, ...args),
        );
        exports_47(
          "error",
          error = (msg, ...args) => getLogger("default").error(msg, ...args),
        );
        exports_47(
          "critical",
          critical = (msg, ...args) =>
            getLogger("default").critical(msg, ...args),
        );
        await setup(DEFAULT_CONFIG);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/metadata/area",
  [],
  function (exports_48, context_48) {
    "use strict";
    var AreaMetadata;
    var __moduleName = context_48 && context_48.id;
    return {
      setters: [],
      execute: function () {
        AreaMetadata = class AreaMetadata {
          constructor(args) {
            this.target = args.target;
            this.baseRoute = args.baseRoute;
            this.controllers = args.controllers;
          }
        };
        exports_48("AreaMetadata", AreaMetadata);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/metadata/controller",
  [],
  function (exports_49, context_49) {
    "use strict";
    var __moduleName = context_49 && context_49.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/utils/get-body",
  ["https://deno.land/std@0.56.0/log/mod"],
  function (exports_50, context_50) {
    "use strict";
    var log;
    var __moduleName = context_50 && context_50.id;
    async function getBody(request) {
      try {
        let body = await Deno.readAll(request.body);
        const bodyString = new TextDecoder("utf-8").decode(body);
        const contentType = request.headers.get("content-type");
        switch (contentType) {
          case "application/json":
            return JSON.parse(bodyString);
          case "application/x-www-form-urlencoded":
            let formElements = {};
            /*
                    * URLSearchParams is designed to work with the query string of a URL.
                    * Since a form encoded in `application/x-www-form-urlencoded` looks like a URL query,
                    * URLSearchParams will gladly accept it.
                    *
                    * Iterate over the entries of the form, for each entry add its key and value.
                    */
            for (
              const [key, value] of new URLSearchParams(bodyString).entries()
            ) {
              formElements[key] = value;
            }
            return formElements;
          // TODO: handle other content types (maybe get a list?)
          default:
            return body;
        }
      } catch (e) {
        log.warning(e);
        return undefined;
      }
    }
    exports_50("getBody", getBody);
    return {
      setters: [
        function (log_1) {
          log = log_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/models/request",
  ["https://deno.land/x/alosaur/src/utils/get-body"],
  function (exports_51, context_51) {
    "use strict";
    var get_body_ts_1, Request;
    var __moduleName = context_51 && context_51.id;
    return {
      setters: [
        function (get_body_ts_1_1) {
          get_body_ts_1 = get_body_ts_1_1;
        },
      ],
      execute: function () {
        Request = class Request {
          constructor(serverRequest) {
            this.serverRequest = serverRequest;
            this.url = serverRequest.url;
            this.headers = serverRequest.headers;
            this.method = serverRequest.method;
          }
          async body() {
            if (!this._body) {
              this._body = get_body_ts_1.getBody(this.serverRequest);
            }
            return this._body;
          }
        };
        exports_51("Request", Request);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/models/context",
  [
    "https://deno.land/x/alosaur/src/models/request",
    "https://deno.land/x/alosaur/src/models/response",
  ],
  function (exports_52, context_52) {
    "use strict";
    var request_ts_1, response_ts_1, Context;
    var __moduleName = context_52 && context_52.id;
    return {
      setters: [
        function (request_ts_1_1) {
          request_ts_1 = request_ts_1_1;
        },
        function (response_ts_1_1) {
          response_ts_1 = response_ts_1_1;
        },
      ],
      execute: function () {
        Context = class Context {
          constructor(serverRequest) {
            this.request = new request_ts_1.Request(serverRequest);
            this.response = new response_ts_1.Response();
          }
        };
        exports_52("Context", Context);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/models/middleware-target",
  [],
  function (exports_53, context_53) {
    "use strict";
    var __moduleName = context_53 && context_53.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/metadata/middleware",
  [],
  function (exports_54, context_54) {
    "use strict";
    var MiddlewareMetadata;
    var __moduleName = context_54 && context_54.id;
    return {
      setters: [],
      execute: function () {
        MiddlewareMetadata = class MiddlewareMetadata {
          constructor(args) {
            this.target = args.target;
            this.route = args.route;
          }
        };
        exports_54("MiddlewareMetadata", MiddlewareMetadata);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/types/param",
  [],
  function (exports_55, context_55) {
    "use strict";
    var ParamType;
    var __moduleName = context_55 && context_55.id;
    return {
      setters: [],
      execute: function () {
        (function (ParamType) {
          ParamType["Cookie"] = "cookie";
          ParamType["Response"] = "response";
          ParamType["Request"] = "request";
          ParamType["Query"] = "query";
          ParamType["RouteParam"] = "route-param";
          ParamType["Body"] = "body";
        })(ParamType || (ParamType = {}));
        exports_55("ParamType", ParamType);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/metadata/param",
  [],
  function (exports_56, context_56) {
    "use strict";
    var __moduleName = context_56 && context_56.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/types/request-method",
  [],
  function (exports_57, context_57) {
    "use strict";
    var RequestMethod;
    var __moduleName = context_57 && context_57.id;
    return {
      setters: [],
      execute: function () {
        (function (RequestMethod) {
          RequestMethod["Get"] = "GET";
          RequestMethod["Post"] = "POST";
          RequestMethod["Put"] = "PUT";
          RequestMethod["Delete"] = "DELETE";
          RequestMethod["Path"] = "PATCH";
          RequestMethod["Options"] = "OPTIONS";
        })(RequestMethod || (RequestMethod = {}));
        exports_57("RequestMethod", RequestMethod);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/metadata/action",
  [],
  function (exports_58, context_58) {
    "use strict";
    var __moduleName = context_58 && context_58.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/types/business",
  [],
  function (exports_59, context_59) {
    "use strict";
    var BusinessType;
    var __moduleName = context_59 && context_59.id;
    return {
      setters: [],
      execute: function () {
        (function (BusinessType) {
          BusinessType["Controller"] = "controller";
          BusinessType["Action"] = "action";
          BusinessType["Area"] = "area";
        })(BusinessType || (BusinessType = {}));
        exports_59("BusinessType", BusinessType);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/models/hook",
  [],
  function (exports_60, context_60) {
    "use strict";
    var __moduleName = context_60 && context_60.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/metadata/hook",
  [],
  function (exports_61, context_61) {
    "use strict";
    var __moduleName = context_61 && context_61.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/metadata/metadata",
  [],
  function (exports_62, context_62) {
    "use strict";
    var MetadataArgsStorage;
    var __moduleName = context_62 && context_62.id;
    return {
      setters: [],
      execute: function () {
        /**
            * Storage all metadatas read from decorators.
            */
        MetadataArgsStorage = class MetadataArgsStorage {
          constructor() {
            /**
                     * Registered middlewares
                     */
            this.middlewares = [];
            /*
                     * Registered areas
                     */
            this.areas = [];
            /**
                     * Registered controller metadata args.
                     */
            this.controllers = [];
            /**
                     * Registered actions.
                     */
            this.actions = [];
            /**
                     * Registered params.
                     */
            this.params = [];
            /**
                   * Registered params.
                   */
            this.hooks = [];
          }
        };
        exports_62("MetadataArgsStorage", MetadataArgsStorage);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/metadata/route",
  [],
  function (exports_63, context_63) {
    "use strict";
    var __moduleName = context_63 && context_63.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/route/route.models",
  [],
  function (exports_64, context_64) {
    "use strict";
    var __moduleName = context_64 && context_64.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/route/route.utils",
  [],
  function (exports_65, context_65) {
    "use strict";
    var allowedMethod,
      getRouteParams,
      getRouteParamPattern,
      getRouteWithRouteParams,
      getRouteFromFullPath,
      getRouteWithRegex,
      getPathNameFromUrl;
    var __moduleName = context_65 && context_65.id;
    return {
      setters: [],
      execute: function () {
        allowedMethod = (routeMethod, requestMethod) => {
          return !requestMethod || routeMethod === requestMethod;
        };
        /// '/home/test/:id/test' => [{i: 3, el: "id"}]
        exports_65(
          "getRouteParams",
          getRouteParams = (route) =>
            route.split("/").reduce((acc, el, i) => {
              if (/:[A-Za-z1-9]{1,}/.test(el)) {
                const result = el.replace(":", "");
                acc.push({ i, el: result });
              }
              return acc;
            }, []),
        );
        /// '/home/test/:id/test' => \/home\/test\/[A-Za-z1-9]{1,}\/test
        getRouteParamPattern = (route) =>
          route.replace(/\/\:[^/]{1,}/gi, "/[^/]{1,}").replace(/\//g, "\\/");
        exports_65(
          "getRouteWithRouteParams",
          getRouteWithRouteParams = (routes, pathname, method) => {
            return routes
              .filter((r) =>
                r.route.includes("/:") &&
                allowedMethod(r.method.toString(), method)
              )
              .find((r) => {
                return new RegExp("^" + getRouteParamPattern(r.route) + "$")
                  .test(pathname);
              });
          },
        );
        exports_65(
          "getRouteFromFullPath",
          getRouteFromFullPath = (routes, pathname, method) => {
            return routes.find((r) => {
              return allowedMethod(r.method.toString(), method) &&
                r.route === pathname;
            });
          },
        );
        exports_65(
          "getRouteWithRegex",
          getRouteWithRegex = (routes, pathname, method) => {
            return routes
              .filter((r) =>
                r.regexpRoute && allowedMethod(r.method.toString(), method)
              )
              .find((r) => {
                const baseRouteRegex = new RegExp("^" + r.route);
                // @ts-ignore: Object is possibly 'null'.
                return baseRouteRegex.test(pathname) &&
                  r.regexpRoute.test(pathname.replace(baseRouteRegex, ""));
              });
          },
        );
        exports_65(
          "getPathNameFromUrl",
          getPathNameFromUrl = (url) => {
            // TODO: use normal parser
            // need for parse
            return new URL("http://localhost" + url).pathname;
          },
        );
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/route/get-action",
  ["https://deno.land/x/alosaur/src/route/route.utils"],
  function (exports_66, context_66) {
    "use strict";
    var route_utils_ts_1;
    var __moduleName = context_66 && context_66.id;
    // TODO
    //  Add 3 Map route for search:
    //  - full pathes
    //  - with route params (example: 'api/:param')
    //  - regex routes
    // Find action from routes
    function getAction(routes, method, url) {
      const pathname = route_utils_ts_1.getPathNameFromUrl(url);
      const routeParams = {};
      let route = route_utils_ts_1.getRouteFromFullPath(
        routes,
        pathname,
        method,
      );
      if (!route) {
        route = route_utils_ts_1.getRouteWithRegex(routes, pathname, method);
      }
      if (!route) {
        route = route_utils_ts_1.getRouteWithRouteParams(
          routes,
          pathname,
          method,
        );
        // gets route params from route
        if (route) {
          const params = route_utils_ts_1.getRouteParams(route.route);
          const routeMatch = pathname.split("/");
          params.forEach((p) => {
            routeParams[p.el] = routeMatch[p.i];
          });
        }
      }
      if (route) {
        return {
          areaObject: route.areaObject,
          controllerObject: route.controllerObject,
          actionObject: route.actionObject,
          target: route.target,
          action: route.action,
          params: route.params,
          routeParams,
        };
      }
      return null;
    }
    exports_66("getAction", getAction);
    return {
      setters: [
        function (route_utils_ts_1_1) {
          route_utils_ts_1 = route_utils_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/models/transform-config",
  [],
  function (exports_67, context_67) {
    "use strict";
    var __moduleName = context_67 && context_67.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/route/get-action-params",
  ["https://deno.land/x/alosaur/src/deps"],
  function (exports_68, context_68) {
    "use strict";
    var deps_ts_3;
    var __moduleName = context_68 && context_68.id;
    /**
     * Gets action params for routes
     * @param context
     * @param route
     */
    async function getActionParams(context, route, transformConfigMap) {
      const args = [];
      // const body
      const queryParams = findSearchParams(context.request.url);
      const cookies = deps_ts_3.getCookies(context.request.serverRequest) || {};
      const params = route.params.sort((a, b) => a.index - b.index);
      // fill params to resolve
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        switch (param.type) {
          case "query":
            if (queryParams && param.name) {
              const paramsArgs = queryParams.get(param.name);
              args.push(paramsArgs ? paramsArgs : undefined);
            } else {
              args.push(undefined);
            }
            break;
          case "cookie":
            if (param.name) {
              args.push(cookies[param.name]);
            } else {
              args.push(undefined);
            }
            break;
          case "body":
            args.push(
              getTransformedParam(
                await context.request.body(),
                param.transform,
                param.type,
                transformConfigMap,
              ),
            );
            break;
          case "request":
            args.push(context.request);
            break;
          case "response":
            args.push(context.response);
            break;
          case "route-param":
            if (route.routeParams && param.name) {
              args.push(route.routeParams[param.name]);
            } else {
              args.push(undefined);
            }
            break;
          default:
            args.push(undefined);
            break;
        }
      }
      return new Promise((resolve) => resolve(args));
    }
    exports_68("getActionParams", getActionParams);
    /**
     * Finds query search params from full url
     * @param url
     */
    function findSearchParams(url) {
      if (url == undefined) {
        return undefined;
      }
      const searchs = url.split("?")[1];
      if (searchs == undefined) {
        return undefined;
      }
      return new URLSearchParams(searchs);
    }
    exports_68("findSearchParams", findSearchParams);
    function getTransformedParam(body, transform, type, config) {
      if (config !== undefined && transform !== undefined) {
        // @ts-ignore: Object is possibly 'null'.
        return config.get(type).getTransform(transform, body);
      }
      if (transform) {
        return transform(body);
      }
      return body;
    }
    return {
      setters: [
        function (deps_ts_3_1) {
          deps_ts_3 = deps_ts_3_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/models/static-config",
  [],
  function (exports_69, context_69) {
    "use strict";
    var __moduleName = context_69 && context_69.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/models/view-render-config",
  [],
  function (exports_70, context_70) {
    "use strict";
    var __moduleName = context_70 && context_70.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/middlewares/cors-builder",
  [],
  function (exports_71, context_71) {
    "use strict";
    var CorsBuilder;
    var __moduleName = context_71 && context_71.id;
    return {
      setters: [],
      execute: function () {
        CorsBuilder = class CorsBuilder {
          constructor() {
            this.headers = new Map();
            this.allowAnyOrigin = false;
            this.allowAnyMethod = false;
            this.allowAnyHeader = false;
          }
          onPreRequest(context) {
            return new Promise((resolve, reject) => {
              if (this.allowAnyOrigin) {
                this.headers.set(
                  "Access-Control-Allow-Origin",
                  context.request.headers.get("Origin") || "",
                );
              }
              if (this.allowAnyMethod) {
                this.headers.set(
                  "Access-Control-Allow-Methods",
                  context.request.headers.get(
                    "Access-Control-Request-Method",
                  ) || "",
                );
              }
              if (this.allowAnyHeader) {
                this.headers.set(
                  "Access-Control-Allow-Headers",
                  context.request.headers.get(
                    "Access-Control-Request-Headers",
                  ) || "",
                );
              }
              if (context.request.method == "OPTIONS") {
                this.onPostRequest(context);
                context.response.status = 200;
                context.response.setImmediately();
              }
              resolve();
            });
          }
          onPostRequest(context) {
            return new Promise((resolve, rej) => {
              this.headers.forEach((el, key) => {
                context.response.headers.set(key, el);
              });
              resolve();
            });
          }
          WithOrigins(origins) {
            this.headers.set("Access-Control-Allow-Origin", origins);
            return this;
          }
          WithMethods(methods) {
            this.headers.set("Access-Control-Allow-Methods", methods);
            return this;
          }
          WithHeaders(headers) {
            this.headers.set("Access-Control-Allow-Headers", headers);
            return this;
          }
          AllowAnyOrigin() {
            this.allowAnyOrigin = true;
            return this;
          }
          AllowAnyMethod() {
            this.allowAnyMethod = true;
            return this;
          }
          AllowAnyHeader() {
            this.allowAnyHeader = true;
            return this;
          }
          AllowCredentials() {
            this.headers.set("Access-Control-Allow-Credentials", "true");
            return this;
          }
        };
        exports_71("CorsBuilder", CorsBuilder);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/utils/register-areas",
  [],
  function (exports_72, context_72) {
    "use strict";
    var __moduleName = context_72 && context_72.id;
    // Add area to controllers
    function registerAreas(metadata) {
      metadata.controllers.map((controller) => {
        if (controller.area == null) {
          controller.area = metadata.areas.find((area) => {
            if (area.controllers) {
              return !!area.controllers.find((areaController) =>
                areaController === controller.target
              );
            }
            return false;
          });
        }
        return controller;
      });
    }
    exports_72("registerAreas", registerAreas);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/reflect",
  [],
  function (exports_73, context_73) {
    "use strict";
    var Reflect;
    var __moduleName = context_73 && context_73.id;
    return {
      setters: [],
      execute: function () {
        /*! *****************************************************************************
            Copyright (C) Microsoft. All rights reserved.
            Licensed under the Apache License, Version 2.0 (the "License"); you may not use
            this file except in compliance with the License. You may obtain a copy of the
            License at http://www.apache.org/licenses/LICENSE-2.0
            
            THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
            KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
            WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
            MERCHANTABLITY OR NON-INFRINGEMENT.
            
            See the Apache Version 2.0 License for specific language governing permissions
            and limitations under the License.
            ***************************************************************************** */
        (function (Reflect) {
          // Metadata Proposal
          // https://rbuckton.github.io/reflect-metadata/
          (function (factory) {
            const root = typeof global === "object" ? global
            : typeof self === "object"
            ? self
            : typeof this === "object"
            ? this
            : Function("return this;")();
            let exporter = makeExporter(Reflect);
            if (typeof root.Reflect === "undefined") {
              root.Reflect = Reflect;
            } else {
              exporter = makeExporter(root.Reflect, exporter);
            }
            factory(exporter);
            function makeExporter(target, previous) {
              return (key, value) => {
                if (typeof target[key] !== "function") {
                  Object.defineProperty(
                    target,
                    key,
                    { configurable: true, writable: true, value },
                  );
                }
                if (previous) {
                  previous(key, value);
                }
              };
            }
          })(function (exporter) {
            const hasOwn = Object.prototype.hasOwnProperty;
            // feature test for Symbol support
            const supportsSymbol = typeof Symbol === "function";
            const toPrimitiveSymbol =
              supportsSymbol && typeof Symbol.toPrimitive !== "undefined"
                ? Symbol.toPrimitive
                : "@@toPrimitive";
            const iteratorSymbol =
              supportsSymbol && typeof Symbol.iterator !== "undefined"
                ? Symbol.iterator
                : "@@iterator";
            const supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
            const supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
            const downLevel = !supportsCreate && !supportsProto;
            const HashMap = {
              // create an object in dictionary mode (a.k.a. "slow" mode in v8)
              create: supportsCreate
                ? () => MakeDictionary(Object.create(null))
                : supportsProto
                ? () => MakeDictionary({ __proto__: null })
                : () => MakeDictionary({}),
              has: downLevel
                ? (map, key) => hasOwn.call(map, key)
                : (map, key) => key in map,
              get: downLevel
                ? (map, key) => hasOwn.call(map, key) ? map[key] : undefined
                : (map, key) => map[key],
            };
            // Load global or shim versions of Map, Set, and WeakMap
            const functionPrototype = Object.getPrototypeOf(Function);
            const usePolyfill = typeof process === "object" && process.env &&
              process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
            const _Map =
              !usePolyfill && typeof Map === "function" &&
              typeof Map.prototype.entries === "function"
                ? Map
                : CreateMapPolyfill();
            const _Set =
              !usePolyfill && typeof Set === "function" &&
              typeof Set.prototype.entries === "function"
                ? Set
                : CreateSetPolyfill();
            const _WeakMap = !usePolyfill && typeof WeakMap === "function"
              ? WeakMap
              : CreateWeakMapPolyfill();
            // [[Metadata]] internal slot
            // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
            const Metadata = new _WeakMap();
            // function decorate(decorators: ClassDecorator[], target: Function): Function;
            // function decorate(decorators: (PropertyDecorator | MethodDecorator)[], target: any, propertyKey: string | symbol, attributes?: PropertyDescriptor | null): PropertyDescriptor | undefined;
            // function decorate(decorators: (PropertyDecorator | MethodDecorator)[], target: any, propertyKey: string | symbol, attributes: PropertyDescriptor): PropertyDescriptor;
            /**
                     * Applies a set of decorators to a property of a target object.
                     * @param decorators An array of decorators.
                     * @param target The target object.
                     * @param propertyKey (Optional) The property key to decorate.
                     * @param attributes (Optional) The property descriptor for the target key.
                     * @remarks Decorators are applied in reverse order.
                     * @example
                     *
                     *     class Example {
                     *         // property declarations are not part of ES6, though they are valid in TypeScript:
                     *         // static staticProperty;
                     *         // property;
                     *
                     *         constructor(p) { }
                     *         static staticMethod(p) { }
                     *         method(p) { }
                     *     }
                     *
                     *     // constructor
                     *     Example = Reflect.decorate(decoratorsArray, Example);
                     *
                     *     // property (on constructor)
                     *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
                     *
                     *     // property (on prototype)
                     *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
                     *
                     *     // method (on constructor)
                     *     Object.defineProperty(Example, "staticMethod",
                     *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
                     *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
                     *
                     *     // method (on prototype)
                     *     Object.defineProperty(Example.prototype, "method",
                     *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
                     *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
                     *
                     */
            function decorate(decorators, target, propertyKey, attributes) {
              if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators)) {
                  throw new TypeError();
                }
                if (!IsObject(target)) {
                  throw new TypeError();
                }
                if (
                  !IsObject(attributes) && !IsUndefined(attributes) &&
                  !IsNull(attributes)
                ) {
                  throw new TypeError();
                }
                if (IsNull(attributes)) {
                  attributes = undefined;
                }
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(
                  decorators,
                  target,
                  propertyKey,
                  attributes,
                );
              } else {
                if (!IsArray(decorators)) {
                  throw new TypeError();
                }
                if (!IsConstructor(target)) {
                  throw new TypeError();
                }
                return DecorateConstructor(decorators, target);
              }
            }
            exporter("decorate", decorate);
            // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
            // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
            /**
                     * A default metadata decorator factory that can be used on a class, class member, or parameter.
                     * @param metadataKey The key for the metadata entry.
                     * @param metadataValue The value for the metadata entry.
                     * @returns A decorator function.
                     * @remarks
                     * If `metadataKey` is already defined for the target and target key, the
                     * metadataValue for that key will be overwritten.
                     * @example
                     *
                     *     // constructor
                     *     @Reflect.metadata(key, value)
                     *     class Example {
                     *     }
                     *
                     *     // property (on constructor, TypeScript only)
                     *     class Example {
                     *         @Reflect.metadata(key, value)
                     *         static staticProperty;
                     *     }
                     *
                     *     // property (on prototype, TypeScript only)
                     *     class Example {
                     *         @Reflect.metadata(key, value)
                     *         property;
                     *     }
                     *
                     *     // method (on constructor)
                     *     class Example {
                     *         @Reflect.metadata(key, value)
                     *         static staticMethod() { }
                     *     }
                     *
                     *     // method (on prototype)
                     *     class Example {
                     *         @Reflect.metadata(key, value)
                     *         method() { }
                     *     }
                     *
                     */
            function metadata(metadataKey, metadataValue) {
              function decorator(target, propertyKey) {
                if (!IsObject(target)) {
                  throw new TypeError();
                }
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey)) {
                  throw new TypeError();
                }
                OrdinaryDefineOwnMetadata(
                  metadataKey,
                  metadataValue,
                  target,
                  propertyKey,
                );
              }
              return decorator;
            }
            exporter("metadata", metadata);
            /**
                     * Define a unique metadata entry on the target.
                     * @param metadataKey A key used to store and retrieve metadata.
                     * @param metadataValue A value that contains attached metadata.
                     * @param target The target object on which to define metadata.
                     * @param propertyKey (Optional) The property key for the target.
                     * @example
                     *
                     *     class Example {
                     *         // property declarations are not part of ES6, though they are valid in TypeScript:
                     *         // static staticProperty;
                     *         // property;
                     *
                     *         constructor(p) { }
                     *         static staticMethod(p) { }
                     *         method(p) { }
                     *     }
                     *
                     *     // constructor
                     *     Reflect.defineMetadata("custom:annotation", options, Example);
                     *
                     *     // property (on constructor)
                     *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
                     *
                     *     // property (on prototype)
                     *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
                     *
                     *     // method (on constructor)
                     *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
                     *
                     *     // method (on prototype)
                     *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
                     *
                     *     // decorator factory as metadata-producing annotation.
                     *     function MyAnnotation(options): Decorator {
                     *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
                     *     }
                     *
                     */
            function defineMetadata(
              metadataKey,
              metadataValue,
              target,
              propertyKey,
            ) {
              if (!IsObject(target)) {
                throw new TypeError();
              }
              if (!IsUndefined(propertyKey)) {
                propertyKey = ToPropertyKey(propertyKey);
              }
              return OrdinaryDefineOwnMetadata(
                metadataKey,
                metadataValue,
                target,
                propertyKey,
              );
            }
            exporter("defineMetadata", defineMetadata);
            /**
                     * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
                     * @param metadataKey A key used to store and retrieve metadata.
                     * @param target The target object on which the metadata is defined.
                     * @param propertyKey (Optional) The property key for the target.
                     * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
                     * @example
                     *
                     *     class Example {
                     *         // property declarations are not part of ES6, though they are valid in TypeScript:
                     *         // static staticProperty;
                     *         // property;
                     *
                     *         constructor(p) { }
                     *         static staticMethod(p) { }
                     *         method(p) { }
                     *     }
                     *
                     *     // constructor
                     *     result = Reflect.hasMetadata("custom:annotation", Example);
                     *
                     *     // property (on constructor)
                     *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
                     *
                     *     // property (on prototype)
                     *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
                     *
                     *     // method (on constructor)
                     *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
                     *
                     *     // method (on prototype)
                     *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
                     *
                     */
            function hasMetadata(metadataKey, target, propertyKey) {
              if (!IsObject(target)) {
                throw new TypeError();
              }
              if (!IsUndefined(propertyKey)) {
                propertyKey = ToPropertyKey(propertyKey);
              }
              return OrdinaryHasMetadata(metadataKey, target, propertyKey);
            }
            exporter("hasMetadata", hasMetadata);
            /**
                     * Gets a value indicating whether the target object has the provided metadata key defined.
                     * @param metadataKey A key used to store and retrieve metadata.
                     * @param target The target object on which the metadata is defined.
                     * @param propertyKey (Optional) The property key for the target.
                     * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
                     * @example
                     *
                     *     class Example {
                     *         // property declarations are not part of ES6, though they are valid in TypeScript:
                     *         // static staticProperty;
                     *         // property;
                     *
                     *         constructor(p) { }
                     *         static staticMethod(p) { }
                     *         method(p) { }
                     *     }
                     *
                     *     // constructor
                     *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
                     *
                     *     // property (on constructor)
                     *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
                     *
                     *     // property (on prototype)
                     *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
                     *
                     *     // method (on constructor)
                     *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
                     *
                     *     // method (on prototype)
                     *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
                     *
                     */
            function hasOwnMetadata(metadataKey, target, propertyKey) {
              if (!IsObject(target)) {
                throw new TypeError();
              }
              if (!IsUndefined(propertyKey)) {
                propertyKey = ToPropertyKey(propertyKey);
              }
              return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
            }
            exporter("hasOwnMetadata", hasOwnMetadata);
            /**
                     * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
                     * @param metadataKey A key used to store and retrieve metadata.
                     * @param target The target object on which the metadata is defined.
                     * @param propertyKey (Optional) The property key for the target.
                     * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
                     * @example
                     *
                     *     class Example {
                     *         // property declarations are not part of ES6, though they are valid in TypeScript:
                     *         // static staticProperty;
                     *         // property;
                     *
                     *         constructor(p) { }
                     *         static staticMethod(p) { }
                     *         method(p) { }
                     *     }
                     *
                     *     // constructor
                     *     result = Reflect.getMetadata("custom:annotation", Example);
                     *
                     *     // property (on constructor)
                     *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
                     *
                     *     // property (on prototype)
                     *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
                     *
                     *     // method (on constructor)
                     *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
                     *
                     *     // method (on prototype)
                     *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
                     *
                     */
            function getMetadata(metadataKey, target, propertyKey) {
              if (!IsObject(target)) {
                throw new TypeError();
              }
              if (!IsUndefined(propertyKey)) {
                propertyKey = ToPropertyKey(propertyKey);
              }
              return OrdinaryGetMetadata(metadataKey, target, propertyKey);
            }
            exporter("getMetadata", getMetadata);
            /**
                     * Gets the metadata value for the provided metadata key on the target object.
                     * @param metadataKey A key used to store and retrieve metadata.
                     * @param target The target object on which the metadata is defined.
                     * @param propertyKey (Optional) The property key for the target.
                     * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
                     * @example
                     *
                     *     class Example {
                     *         // property declarations are not part of ES6, though they are valid in TypeScript:
                     *         // static staticProperty;
                     *         // property;
                     *
                     *         constructor(p) { }
                     *         static staticMethod(p) { }
                     *         method(p) { }
                     *     }
                     *
                     *     // constructor
                     *     result = Reflect.getOwnMetadata("custom:annotation", Example);
                     *
                     *     // property (on constructor)
                     *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
                     *
                     *     // property (on prototype)
                     *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
                     *
                     *     // method (on constructor)
                     *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
                     *
                     *     // method (on prototype)
                     *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
                     *
                     */
            function getOwnMetadata(metadataKey, target, propertyKey) {
              if (!IsObject(target)) {
                throw new TypeError();
              }
              if (!IsUndefined(propertyKey)) {
                propertyKey = ToPropertyKey(propertyKey);
              }
              return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
            }
            exporter("getOwnMetadata", getOwnMetadata);
            /**
                     * Gets the metadata keys defined on the target object or its prototype chain.
                     * @param target The target object on which the metadata is defined.
                     * @param propertyKey (Optional) The property key for the target.
                     * @returns An array of unique metadata keys.
                     * @example
                     *
                     *     class Example {
                     *         // property declarations are not part of ES6, though they are valid in TypeScript:
                     *         // static staticProperty;
                     *         // property;
                     *
                     *         constructor(p) { }
                     *         static staticMethod(p) { }
                     *         method(p) { }
                     *     }
                     *
                     *     // constructor
                     *     result = Reflect.getMetadataKeys(Example);
                     *
                     *     // property (on constructor)
                     *     result = Reflect.getMetadataKeys(Example, "staticProperty");
                     *
                     *     // property (on prototype)
                     *     result = Reflect.getMetadataKeys(Example.prototype, "property");
                     *
                     *     // method (on constructor)
                     *     result = Reflect.getMetadataKeys(Example, "staticMethod");
                     *
                     *     // method (on prototype)
                     *     result = Reflect.getMetadataKeys(Example.prototype, "method");
                     *
                     */
            function getMetadataKeys(target, propertyKey) {
              if (!IsObject(target)) {
                throw new TypeError();
              }
              if (!IsUndefined(propertyKey)) {
                propertyKey = ToPropertyKey(propertyKey);
              }
              return OrdinaryMetadataKeys(target, propertyKey);
            }
            exporter("getMetadataKeys", getMetadataKeys);
            /**
                     * Gets the unique metadata keys defined on the target object.
                     * @param target The target object on which the metadata is defined.
                     * @param propertyKey (Optional) The property key for the target.
                     * @returns An array of unique metadata keys.
                     * @example
                     *
                     *     class Example {
                     *         // property declarations are not part of ES6, though they are valid in TypeScript:
                     *         // static staticProperty;
                     *         // property;
                     *
                     *         constructor(p) { }
                     *         static staticMethod(p) { }
                     *         method(p) { }
                     *     }
                     *
                     *     // constructor
                     *     result = Reflect.getOwnMetadataKeys(Example);
                     *
                     *     // property (on constructor)
                     *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
                     *
                     *     // property (on prototype)
                     *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
                     *
                     *     // method (on constructor)
                     *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
                     *
                     *     // method (on prototype)
                     *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
                     *
                     */
            function getOwnMetadataKeys(target, propertyKey) {
              if (!IsObject(target)) {
                throw new TypeError();
              }
              if (!IsUndefined(propertyKey)) {
                propertyKey = ToPropertyKey(propertyKey);
              }
              return OrdinaryOwnMetadataKeys(target, propertyKey);
            }
            exporter("getOwnMetadataKeys", getOwnMetadataKeys);
            /**
                     * Deletes the metadata entry from the target object with the provided key.
                     * @param metadataKey A key used to store and retrieve metadata.
                     * @param target The target object on which the metadata is defined.
                     * @param propertyKey (Optional) The property key for the target.
                     * @returns `true` if the metadata entry was found and deleted; otherwise, false.
                     * @example
                     *
                     *     class Example {
                     *         // property declarations are not part of ES6, though they are valid in TypeScript:
                     *         // static staticProperty;
                     *         // property;
                     *
                     *         constructor(p) { }
                     *         static staticMethod(p) { }
                     *         method(p) { }
                     *     }
                     *
                     *     // constructor
                     *     result = Reflect.deleteMetadata("custom:annotation", Example);
                     *
                     *     // property (on constructor)
                     *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
                     *
                     *     // property (on prototype)
                     *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
                     *
                     *     // method (on constructor)
                     *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
                     *
                     *     // method (on prototype)
                     *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
                     *
                     */
            function deleteMetadata(metadataKey, target, propertyKey) {
              if (!IsObject(target)) {
                throw new TypeError();
              }
              if (!IsUndefined(propertyKey)) {
                propertyKey = ToPropertyKey(propertyKey);
              }
              const metadataMap = GetOrCreateMetadataMap(
                target,
                propertyKey, /*Create*/
                false,
              );
              if (IsUndefined(metadataMap)) {
                return false;
              }
              if (!metadataMap.delete(metadataKey)) {
                return false;
              }
              if (metadataMap.size > 0) {
                return true;
              }
              const targetMetadata = Metadata.get(target);
              targetMetadata.delete(propertyKey);
              if (targetMetadata.size > 0) {
                return true;
              }
              Metadata.delete(target);
              return true;
            }
            exporter("deleteMetadata", deleteMetadata);
            function DecorateConstructor(decorators, target) {
              for (let i = decorators.length - 1; i >= 0; --i) {
                const decorator = decorators[i];
                const decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                  if (!IsConstructor(decorated)) {
                    throw new TypeError();
                  }
                  target = decorated;
                }
              }
              return target;
            }
            function DecorateProperty(
              decorators,
              target,
              propertyKey,
              descriptor,
            ) {
              for (let i = decorators.length - 1; i >= 0; --i) {
                const decorator = decorators[i];
                const decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                  if (!IsObject(decorated)) {
                    throw new TypeError();
                  }
                  descriptor = decorated;
                }
              }
              return descriptor;
            }
            function GetOrCreateMetadataMap(O, P, Create) {
              let targetMetadata = Metadata.get(O);
              if (IsUndefined(targetMetadata)) {
                if (!Create) {
                  return undefined;
                }
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
              }
              let metadataMap = targetMetadata.get(P);
              if (IsUndefined(metadataMap)) {
                if (!Create) {
                  return undefined;
                }
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
              }
              return metadataMap;
            }
            // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
            // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
            function OrdinaryHasMetadata(MetadataKey, O, P) {
              const hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
              if (hasOwn) {
                return true;
              }
              const parent = OrdinaryGetPrototypeOf(O);
              if (!IsNull(parent)) {
                return OrdinaryHasMetadata(MetadataKey, parent, P);
              }
              return false;
            }
            // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
            // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
            function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
              const metadataMap = GetOrCreateMetadataMap(
                O,
                P, /*Create*/
                false,
              );
              if (IsUndefined(metadataMap)) {
                return false;
              }
              return ToBoolean(metadataMap.has(MetadataKey));
            }
            // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
            // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
            function OrdinaryGetMetadata(MetadataKey, O, P) {
              const hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
              if (hasOwn) {
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
              }
              const parent = OrdinaryGetPrototypeOf(O);
              if (!IsNull(parent)) {
                return OrdinaryGetMetadata(MetadataKey, parent, P);
              }
              return undefined;
            }
            // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
            // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
            function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
              const metadataMap = GetOrCreateMetadataMap(
                O,
                P, /*Create*/
                false,
              );
              if (IsUndefined(metadataMap)) {
                return undefined;
              }
              return metadataMap.get(MetadataKey);
            }
            // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
            // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
            function OrdinaryDefineOwnMetadata(
              MetadataKey,
              MetadataValue,
              O,
              P,
            ) {
              const metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
              metadataMap.set(MetadataKey, MetadataValue);
            }
            // 3.1.6.1 OrdinaryMetadataKeys(O, P)
            // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
            function OrdinaryMetadataKeys(O, P) {
              const ownKeys = OrdinaryOwnMetadataKeys(O, P);
              const parent = OrdinaryGetPrototypeOf(O);
              if (parent === null) {
                return ownKeys;
              }
              const parentKeys = OrdinaryMetadataKeys(parent, P);
              if (parentKeys.length <= 0) {
                return ownKeys;
              }
              if (ownKeys.length <= 0) {
                return parentKeys;
              }
              const set = new _Set();
              const keys = [];
              for (const key of ownKeys) {
                const hasKey = set.has(key);
                if (!hasKey) {
                  set.add(key);
                  keys.push(key);
                }
              }
              for (const key of parentKeys) {
                const hasKey = set.has(key);
                if (!hasKey) {
                  set.add(key);
                  keys.push(key);
                }
              }
              return keys;
            }
            // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
            // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
            function OrdinaryOwnMetadataKeys(O, P) {
              const keys = [];
              const metadataMap = GetOrCreateMetadataMap(
                O,
                P, /*Create*/
                false,
              );
              if (IsUndefined(metadataMap)) {
                return keys;
              }
              const keysObj = metadataMap.keys();
              const iterator = GetIterator(keysObj);
              let k = 0;
              while (true) {
                const next = IteratorStep(iterator);
                if (!next) {
                  keys.length = k;
                  return keys;
                }
                const nextValue = IteratorValue(next);
                try {
                  keys[k] = nextValue;
                } catch (e) {
                  try {
                    IteratorClose(iterator);
                  } finally {
                    throw e;
                  }
                }
                k++;
              }
            }
            // 6 ECMAScript Data Typ0es and Values
            // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
            function Type(x) {
              if (x === null) {
                return 1 /* Null */;
              }
              switch (typeof x) {
                case "undefined":
                  return 0 /* Undefined */;
                case "boolean":
                  return 2 /* Boolean */;
                case "string":
                  return 3 /* String */;
                case "symbol":
                  return 4 /* Symbol */;
                case "number":
                  return 5 /* Number */;
                case "object":
                  return x === null ? 1 /* Null */ : 6 /* Object */;
                default:
                  return 6 /* Object */;
              }
            }
            // 6.1.1 The Undefined Type
            // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
            function IsUndefined(x) {
              return x === undefined;
            }
            // 6.1.2 The Null Type
            // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
            function IsNull(x) {
              return x === null;
            }
            // 6.1.5 The Symbol Type
            // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
            function IsSymbol(x) {
              return typeof x === "symbol";
            }
            // 6.1.7 The Object Type
            // https://tc39.github.io/ecma262/#sec-object-type
            function IsObject(x) {
              return typeof x === "object"
                ? x !== null
                : typeof x === "function";
            }
            // 7.1 Type Conversion
            // https://tc39.github.io/ecma262/#sec-type-conversion
            // 7.1.1 ToPrimitive(input [, PreferredType])
            // https://tc39.github.io/ecma262/#sec-toprimitive
            function ToPrimitive(input, PreferredType) {
              switch (Type(input)) {
                case 0 /* Undefined */:
                  return input;
                case 1 /* Null */:
                  return input;
                case 2 /* Boolean */:
                  return input;
                case 3 /* String */:
                  return input;
                case 4 /* Symbol */:
                  return input;
                case 5 /* Number */:
                  return input;
              }
              const hint = PreferredType === 3 /* String */
                ? "string"
                : PreferredType === 5 /* Number */
                ? "number"
                : "default";
              const exoticToPrim = GetMethod(input, toPrimitiveSymbol);
              if (exoticToPrim !== undefined) {
                const result = exoticToPrim.call(input, hint);
                if (IsObject(result)) {
                  throw new TypeError();
                }
                return result;
              }
              return OrdinaryToPrimitive(
                input,
                hint === "default" ? "number" : hint,
              );
            }
            // 7.1.1.1 OrdinaryToPrimitive(O, hint)
            // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
            function OrdinaryToPrimitive(O, hint) {
              if (hint === "string") {
                const toString = O.toString;
                if (IsCallable(toString)) {
                  const result = toString.call(O);
                  if (!IsObject(result)) {
                    return result;
                  }
                }
                const valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                  const result = valueOf.call(O);
                  if (!IsObject(result)) {
                    return result;
                  }
                }
              } else {
                const valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                  const result = valueOf.call(O);
                  if (!IsObject(result)) {
                    return result;
                  }
                }
                const toString = O.toString;
                if (IsCallable(toString)) {
                  const result = toString.call(O);
                  if (!IsObject(result)) {
                    return result;
                  }
                }
              }
              throw new TypeError();
            }
            // 7.1.2 ToBoolean(argument)
            // https://tc39.github.io/ecma262/2016/#sec-toboolean
            function ToBoolean(argument) {
              return !!argument;
            }
            // 7.1.12 ToString(argument)
            // https://tc39.github.io/ecma262/#sec-tostring
            function ToString(argument) {
              return "" + argument;
            }
            // 7.1.14 ToPropertyKey(argument)
            // https://tc39.github.io/ecma262/#sec-topropertykey
            function ToPropertyKey(argument) {
              const key = ToPrimitive(argument, 3 /* String */);
              if (IsSymbol(key)) {
                return key;
              }
              return ToString(key);
            }
            // 7.2 Testing and Comparison Operations
            // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
            // 7.2.2 IsArray(argument)
            // https://tc39.github.io/ecma262/#sec-isarray
            function IsArray(argument) {
              return Array.isArray
                ? Array.isArray(argument)
                : argument instanceof Object
                ? argument instanceof Array
                : Object.prototype.toString.call(argument) === "[object Array]";
            }
            // 7.2.3 IsCallable(argument)
            // https://tc39.github.io/ecma262/#sec-iscallable
            function IsCallable(argument) {
              // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
              return typeof argument === "function";
            }
            // 7.2.4 IsConstructor(argument)
            // https://tc39.github.io/ecma262/#sec-isconstructor
            function IsConstructor(argument) {
              // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
              return typeof argument === "function";
            }
            // 7.2.7 IsPropertyKey(argument)
            // https://tc39.github.io/ecma262/#sec-ispropertykey
            function IsPropertyKey(argument) {
              switch (Type(argument)) {
                case 3 /* String */:
                  return true;
                case 4 /* Symbol */:
                  return true;
                default:
                  return false;
              }
            }
            // 7.3 Operations on Objects
            // https://tc39.github.io/ecma262/#sec-operations-on-objects
            // 7.3.9 GetMethod(V, P)
            // https://tc39.github.io/ecma262/#sec-getmethod
            function GetMethod(V, P) {
              const func = V[P];
              if (func === undefined || func === null) {
                return undefined;
              }
              if (!IsCallable(func)) {
                throw new TypeError();
              }
              return func;
            }
            // 7.4 Operations on Iterator Objects
            // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
            function GetIterator(obj) {
              const method = GetMethod(obj, iteratorSymbol);
              if (!IsCallable(method)) {
                throw new TypeError(); // from Call
              }
              const iterator = method.call(obj);
              if (!IsObject(iterator)) {
                throw new TypeError();
              }
              return iterator;
            }
            // 7.4.4 IteratorValue(iterResult)
            // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
            function IteratorValue(iterResult) {
              return iterResult.value;
            }
            // 7.4.5 IteratorStep(iterator)
            // https://tc39.github.io/ecma262/#sec-iteratorstep
            function IteratorStep(iterator) {
              const result = iterator.next();
              return result.done ? false : result;
            }
            // 7.4.6 IteratorClose(iterator, completion)
            // https://tc39.github.io/ecma262/#sec-iteratorclose
            function IteratorClose(iterator) {
              const f = iterator["return"];
              if (f) {
                f.call(iterator);
              }
            }
            // 9.1 Ordinary Object Internal Methods and Internal Slots
            // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
            // 9.1.1.1 OrdinaryGetPrototypeOf(O)
            // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
            function OrdinaryGetPrototypeOf(O) {
              const proto = Object.getPrototypeOf(O);
              if (typeof O !== "function" || O === functionPrototype) {
                return proto;
              }
              // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
              // Try to determine the superclass constructor. Compatible implementations
              // must either set __proto__ on a subclass constructor to the superclass constructor,
              // or ensure each class has a valid `constructor` property on its prototype that
              // points back to the constructor.
              // If this is not the same as Function.[[Prototype]], then this is definately inherited.
              // This is the case when in ES6 or when using __proto__ in a compatible browser.
              if (proto !== functionPrototype) {
                return proto;
              }
              // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
              const prototype = O.prototype;
              const prototypeProto = prototype &&
                Object.getPrototypeOf(prototype);
              if (
                prototypeProto == null || prototypeProto === Object.prototype
              ) {
                return proto;
              }
              // If the constructor was not a function, then we cannot determine the heritage.
              const constructor = prototypeProto.constructor;
              if (typeof constructor !== "function") {
                return proto;
              }
              // If we have some kind of self-reference, then we cannot determine the heritage.
              if (constructor === O) {
                return proto;
              }
              // we have a pretty good guess at the heritage.
              return constructor;
            }
            // naive Map shim
            function CreateMapPolyfill() {
              const cacheSentinel = {};
              const arraySentinel = [];
              class MapIterator {
                constructor(keys, values, selector) {
                  this._index = 0;
                  this._keys = keys;
                  this._values = values;
                  this._selector = selector;
                }
                "@@iterator"() {
                  return this;
                }
                [iteratorSymbol]() {
                  return this;
                }
                next() {
                  const index = this._index;
                  if (index >= 0 && index < this._keys.length) {
                    const result = this._selector(
                      this._keys[index],
                      this._values[index],
                    );
                    if (index + 1 >= this._keys.length) {
                      this._index = -1;
                      this._keys = arraySentinel;
                      this._values = arraySentinel;
                    } else {
                      this._index++;
                    }
                    return { value: result, done: false };
                  }
                  return { value: undefined, done: true };
                }
                throw(error) {
                  if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                  }
                  throw error;
                }
                return(value) {
                  if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                  }
                  return { value: value, done: true };
                }
              }
              return class Map {
                constructor() {
                  this._keys = [];
                  this._values = [];
                  this._cacheKey = cacheSentinel;
                  this._cacheIndex = -2;
                }
                get size() {
                  return this._keys.length;
                }
                has(key) {
                  return this._find(key, /*insert*/ false) >= 0;
                }
                get(key) {
                  const index = this._find(key, /*insert*/ false);
                  return index >= 0 ? this._values[index] : undefined;
                }
                set(key, value) {
                  const index = this._find(key, /*insert*/ true);
                  this._values[index] = value;
                  return this;
                }
                delete(key) {
                  const index = this._find(key, /*insert*/ false);
                  if (index >= 0) {
                    const size = this._keys.length;
                    for (let i = index + 1; i < size; i++) {
                      this._keys[i - 1] = this._keys[i];
                      this._values[i - 1] = this._values[i];
                    }
                    this._keys.length--;
                    this._values.length--;
                    if (key === this._cacheKey) {
                      this._cacheKey = cacheSentinel;
                      this._cacheIndex = -2;
                    }
                    return true;
                  }
                  return false;
                }
                clear() {
                  this._keys.length = 0;
                  this._values.length = 0;
                  this._cacheKey = cacheSentinel;
                  this._cacheIndex = -2;
                }
                keys() {
                  return new MapIterator(this._keys, this._values, getKey);
                }
                values() {
                  return new MapIterator(this._keys, this._values, getValue);
                }
                entries() {
                  return new MapIterator(this._keys, this._values, getEntry);
                }
                "@@iterator"() {
                  return this.entries();
                }
                [iteratorSymbol]() {
                  return this.entries();
                }
                _find(key, insert) {
                  if (this._cacheKey !== key) {
                    this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                  }
                  if (this._cacheIndex < 0 && insert) {
                    this._cacheIndex = this._keys.length;
                    this._keys.push(key);
                    this._values.push(undefined);
                  }
                  return this._cacheIndex;
                }
              };
              function getKey(key, _) {
                return key;
              }
              function getValue(_, value) {
                return value;
              }
              function getEntry(key, value) {
                return [key, value];
              }
            }
            // naive Set shim
            function CreateSetPolyfill() {
              return class Set {
                constructor() {
                  this._map = new _Map();
                }
                get size() {
                  return this._map.size;
                }
                has(value) {
                  return this._map.has(value);
                }
                add(value) {
                  return this._map.set(value, value), this;
                }
                delete(value) {
                  return this._map.delete(value);
                }
                clear() {
                  this._map.clear();
                }
                keys() {
                  return this._map.keys();
                }
                values() {
                  return this._map.values();
                }
                entries() {
                  return this._map.entries();
                }
                "@@iterator"() {
                  return this.keys();
                }
                [iteratorSymbol]() {
                  return this.keys();
                }
              };
            }
            // naive WeakMap shim
            function CreateWeakMapPolyfill() {
              const UUID_SIZE = 16;
              const keys = HashMap.create();
              const rootKey = CreateUniqueKey();
              return class WeakMap {
                constructor() {
                  this._key = CreateUniqueKey();
                }
                has(target) {
                  const table = GetOrCreateWeakMapTable(
                    target, /*create*/
                    false,
                  );
                  return table !== undefined
                    ? HashMap.has(table, this._key)
                    : false;
                }
                get(target) {
                  const table = GetOrCreateWeakMapTable(
                    target, /*create*/
                    false,
                  );
                  return table !== undefined
                    ? HashMap.get(table, this._key)
                    : undefined;
                }
                set(target, value) {
                  const table = GetOrCreateWeakMapTable(
                    target, /*create*/
                    true,
                  );
                  table[this._key] = value;
                  return this;
                }
                delete(target) {
                  const table = GetOrCreateWeakMapTable(
                    target, /*create*/
                    false,
                  );
                  return table !== undefined ? delete table[this._key] : false;
                }
                clear() {
                  // NOTE: not a real clear, just makes the previous data unreachable
                  this._key = CreateUniqueKey();
                }
              };
              function CreateUniqueKey() {
                let key;
                do key = "@@WeakMap@@" + CreateUUID(); while (
                  HashMap.has(keys, key)
                );
                keys[key] = true;
                return key;
              }
              function GetOrCreateWeakMapTable(target, create) {
                if (!hasOwn.call(target, rootKey)) {
                  if (!create) {
                    return undefined;
                  }
                  Object.defineProperty(
                    target,
                    rootKey,
                    { value: HashMap.create() },
                  );
                }
                return target[rootKey];
              }
              function FillRandomBytes(buffer, size) {
                for (let i = 0; i < size; ++i) {
                  buffer[i] = Math.random() * 0xff | 0;
                }
                return buffer;
              }
              function GenRandomBytes(size) {
                if (typeof Uint8Array === "function") {
                  if (typeof crypto !== "undefined") {
                    return crypto.getRandomValues(new Uint8Array(size));
                  }
                  if (typeof msCrypto !== "undefined") {
                    return msCrypto.getRandomValues(new Uint8Array(size));
                  }
                  return FillRandomBytes(new Uint8Array(size), size);
                }
                return FillRandomBytes(new Array(size), size);
              }
              function CreateUUID() {
                const data = GenRandomBytes(UUID_SIZE);
                // mark as random - RFC 4122 § 4.4
                data[6] = data[6] & 0x4f | 0x40;
                data[8] = data[8] & 0xbf | 0x80;
                let result = "";
                for (let offset = 0; offset < UUID_SIZE; ++offset) {
                  const byte = data[offset];
                  if (offset === 4 || offset === 6 || offset === 8) {
                    result += "-";
                  }
                  if (byte < 16) {
                    result += "0";
                  }
                  result += byte.toString(16).toLowerCase();
                }
                return result;
              }
            }
            // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
            function MakeDictionary(obj) {
              obj.__ = undefined;
              delete obj.__;
              return obj;
            }
          });
        })(Reflect || (Reflect = {}));
        exports_73("Reflect", Reflect);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/types/constructor",
  [],
  function (exports_74, context_74) {
    "use strict";
    var __moduleName = context_74 && context_74.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/lazy-helpers",
  [],
  function (exports_75, context_75) {
    "use strict";
    var DelayedConstructor;
    var __moduleName = context_75 && context_75.id;
    function delay(wrappedConstructor) {
      if (typeof wrappedConstructor === "undefined") {
        throw new Error(
          "Attempt to `delay` undefined. Constructor must be wrapped in a callback",
        );
      }
      return new DelayedConstructor(wrappedConstructor);
    }
    exports_75("delay", delay);
    return {
      setters: [],
      execute: function () {
        DelayedConstructor = class DelayedConstructor {
          constructor(wrap) {
            this.wrap = wrap;
            this.reflectMethods = [
              "get",
              "getPrototypeOf",
              "setPrototypeOf",
              "getOwnPropertyDescriptor",
              "defineProperty",
              "has",
              "set",
              "deleteProperty",
              "apply",
              "construct",
            ];
          }
          createProxy(createObject) {
            const target = {};
            let init = false;
            let value;
            const delayedObject = () => {
              if (!init) {
                value = createObject(this.wrap());
                init = true;
              }
              return value;
            };
            return new Proxy(target, this.createHandler(delayedObject));
          }
          createHandler(delayedObject) {
            const handler = {};
            const install = (name) => {
              handler[name] = (...args) => {
                args[0] = delayedObject();
                const method = Reflect[name];
                return method(...args);
              };
            };
            this.reflectMethods.forEach(install);
            return handler;
          }
        };
        exports_75("DelayedConstructor", DelayedConstructor);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/providers/class-provider",
  [],
  function (exports_76, context_76) {
    "use strict";
    var __moduleName = context_76 && context_76.id;
    function isClassProvider(provider) {
      return !!provider.useClass;
    }
    exports_76("isClassProvider", isClassProvider);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/providers/value-provider",
  [],
  function (exports_77, context_77) {
    "use strict";
    var __moduleName = context_77 && context_77.id;
    function isValueProvider(provider) {
      return provider.useValue != undefined;
    }
    exports_77("isValueProvider", isValueProvider);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/providers/injection-token",
  ["https://deno.land/x/alosaur/src/injection/lazy-helpers"],
  function (exports_78, context_78) {
    "use strict";
    var lazy_helpers_ts_1;
    var __moduleName = context_78 && context_78.id;
    function isNormalToken(token) {
      return typeof token === "string" || typeof token === "symbol";
    }
    exports_78("isNormalToken", isNormalToken);
    function isTokenDescriptor(descriptor) {
      return (typeof descriptor === "object" &&
        "token" in descriptor &&
        "multiple" in descriptor);
    }
    exports_78("isTokenDescriptor", isTokenDescriptor);
    function isConstructorToken(token) {
      return typeof token === "function" ||
        token instanceof lazy_helpers_ts_1.DelayedConstructor;
    }
    exports_78("isConstructorToken", isConstructorToken);
    return {
      setters: [
        function (lazy_helpers_ts_1_1) {
          lazy_helpers_ts_1 = lazy_helpers_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/providers/token-provider",
  [],
  function (exports_79, context_79) {
    "use strict";
    var __moduleName = context_79 && context_79.id;
    function isTokenProvider(provider) {
      return !!provider.useToken;
    }
    exports_79("isTokenProvider", isTokenProvider);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/providers/provider",
  [
    "https://deno.land/x/alosaur/src/injection/providers/class-provider",
    "https://deno.land/x/alosaur/src/injection/providers/value-provider",
    "https://deno.land/x/alosaur/src/injection/providers/token-provider",
    "https://deno.land/x/alosaur/src/injection/providers/factory-provider",
  ],
  function (exports_80, context_80) {
    "use strict";
    var class_provider_ts_1,
      value_provider_ts_1,
      token_provider_ts_1,
      factory_provider_ts_1;
    var __moduleName = context_80 && context_80.id;
    function isProvider(provider) {
      return (class_provider_ts_1.isClassProvider(provider) ||
        value_provider_ts_1.isValueProvider(provider) ||
        token_provider_ts_1.isTokenProvider(provider) ||
        factory_provider_ts_1.isFactoryProvider(provider));
    }
    exports_80("isProvider", isProvider);
    return {
      setters: [
        function (class_provider_ts_1_1) {
          class_provider_ts_1 = class_provider_ts_1_1;
        },
        function (value_provider_ts_1_1) {
          value_provider_ts_1 = value_provider_ts_1_1;
        },
        function (token_provider_ts_1_1) {
          token_provider_ts_1 = token_provider_ts_1_1;
        },
        function (factory_provider_ts_1_1) {
          factory_provider_ts_1 = factory_provider_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/providers/factory-provider",
  [],
  function (exports_81, context_81) {
    "use strict";
    var __moduleName = context_81 && context_81.id;
    function isFactoryProvider(provider) {
      return !!provider.useFactory;
    }
    exports_81("isFactoryProvider", isFactoryProvider);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/types/lifecycle",
  [],
  function (exports_82, context_82) {
    "use strict";
    var Lifecycle;
    var __moduleName = context_82 && context_82.id;
    return {
      setters: [],
      execute: function () {
        (function (Lifecycle) {
          Lifecycle[Lifecycle["Transient"] = 0] = "Transient";
          Lifecycle[Lifecycle["Singleton"] = 1] = "Singleton";
          Lifecycle[Lifecycle["ResolutionScoped"] = 2] = "ResolutionScoped";
          Lifecycle[Lifecycle["ContainerScoped"] = 3] = "ContainerScoped";
        })(Lifecycle || (Lifecycle = {}));
        exports_82("default", Lifecycle);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/types/registration-options",
  [],
  function (exports_83, context_83) {
    "use strict";
    var __moduleName = context_83 && context_83.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/types/dependency-container",
  [],
  function (exports_84, context_84) {
    "use strict";
    var __moduleName = context_84 && context_84.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/types/dictionary",
  [],
  function (exports_85, context_85) {
    "use strict";
    var __moduleName = context_85 && context_85.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/types/index",
  ["https://deno.land/x/alosaur/src/injection/types/lifecycle"],
  function (exports_86, context_86) {
    "use strict";
    var __moduleName = context_86 && context_86.id;
    return {
      setters: [
        function (lifecycle_ts_1_1) {
          exports_86({
            "Lifecycle": lifecycle_ts_1_1["default"],
          });
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/providers/index",
  [
    "https://deno.land/x/alosaur/src/injection/providers/class-provider",
    "https://deno.land/x/alosaur/src/injection/providers/factory-provider",
    "https://deno.land/x/alosaur/src/injection/providers/injection-token",
    "https://deno.land/x/alosaur/src/injection/providers/token-provider",
    "https://deno.land/x/alosaur/src/injection/providers/value-provider",
  ],
  function (exports_87, context_87) {
    "use strict";
    var __moduleName = context_87 && context_87.id;
    return {
      setters: [
        function (class_provider_ts_2_1) {
          exports_87({
            "isClassProvider": class_provider_ts_2_1["isClassProvider"],
          });
        },
        function (factory_provider_ts_2_1) {
          exports_87({
            "isFactoryProvider": factory_provider_ts_2_1["isFactoryProvider"],
          });
        },
        function (injection_token_ts_1_1) {
          exports_87({
            "isNormalToken": injection_token_ts_1_1["isNormalToken"],
          });
        },
        function (token_provider_ts_2_1) {
          exports_87({
            "isTokenProvider": token_provider_ts_2_1["isTokenProvider"],
          });
        },
        function (value_provider_ts_2_1) {
          exports_87({
            "isValueProvider": value_provider_ts_2_1["isValueProvider"],
          });
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/registry",
  [],
  function (exports_88, context_88) {
    "use strict";
    var Registry;
    var __moduleName = context_88 && context_88.id;
    return {
      setters: [],
      execute: function () {
        Registry = class Registry {
          constructor() {
            this._registryMap = new Map();
          }
          entries() {
            return this._registryMap.entries();
          }
          getAll(key) {
            this.ensure(key);
            return this._registryMap.get(key);
          }
          get(key) {
            this.ensure(key);
            const value = this._registryMap.get(key);
            return value[value.length - 1] || null;
          }
          set(key, value) {
            this.ensure(key);
            this._registryMap.get(key).push(value);
          }
          setAll(key, value) {
            this._registryMap.set(key, value);
          }
          has(key) {
            this.ensure(key);
            return this._registryMap.get(key).length > 0;
          }
          clear() {
            this._registryMap.clear();
          }
          ensure(key) {
            if (!this._registryMap.has(key)) {
              this._registryMap.set(key, []);
            }
          }
        };
        exports_88("default", Registry);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/resolution-context",
  [],
  function (exports_89, context_89) {
    "use strict";
    var ResolutionContext;
    var __moduleName = context_89 && context_89.id;
    return {
      setters: [],
      execute: function () {
        ResolutionContext = class ResolutionContext {
          constructor() {
            this.scopedResolutions = new Map();
          }
        };
        exports_89("default", ResolutionContext);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/error-helpers",
  [],
  function (exports_90, context_90) {
    "use strict";
    var __moduleName = context_90 && context_90.id;
    function formatDependency(params, idx) {
      if (params === null) {
        return `at position #${idx}`;
      }
      const argName = params.split(",")[idx].trim();
      return `"${argName}" at position #${idx}`;
    }
    function composeErrorMessage(msg, e, indent = "    ") {
      return [msg, ...e.message.split("\n").map((l) => indent + l)].join("\n");
    }
    function formatErrorCtor(ctor, paramIdx, error) {
      const [, params = null] =
        ctor.toString().match(/constructor\(([\w, ]+)\)/) ||
        [];
      const dep = formatDependency(params, paramIdx);
      return composeErrorMessage(
        `Cannot inject the dependency ${dep} of "${ctor.name}" constructor. Reason:`,
        error,
      );
    }
    exports_90("formatErrorCtor", formatErrorCtor);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/dependency-container",
  [
    "https://deno.land/x/alosaur/src/injection/providers/index",
    "https://deno.land/x/alosaur/src/injection/providers/provider",
    "https://deno.land/x/alosaur/src/injection/providers/injection-token",
    "https://deno.land/x/alosaur/src/injection/registry",
    "https://deno.land/x/alosaur/src/injection/types/lifecycle",
    "https://deno.land/x/alosaur/src/injection/resolution-context",
    "https://deno.land/x/alosaur/src/injection/error-helpers",
    "https://deno.land/x/alosaur/src/injection/lazy-helpers",
  ],
  function (exports_91, context_91) {
    "use strict";
    var index_ts_1,
      provider_ts_1,
      injection_token_ts_2,
      registry_ts_1,
      lifecycle_ts_2,
      resolution_context_ts_1,
      error_helpers_ts_1,
      lazy_helpers_ts_2,
      typeInfo,
      InternalDependencyContainer,
      instance;
    var __moduleName = context_91 && context_91.id;
    return {
      setters: [
        function (index_ts_1_1) {
          index_ts_1 = index_ts_1_1;
        },
        function (provider_ts_1_1) {
          provider_ts_1 = provider_ts_1_1;
        },
        function (injection_token_ts_2_1) {
          injection_token_ts_2 = injection_token_ts_2_1;
        },
        function (registry_ts_1_1) {
          registry_ts_1 = registry_ts_1_1;
        },
        function (lifecycle_ts_2_1) {
          lifecycle_ts_2 = lifecycle_ts_2_1;
        },
        function (resolution_context_ts_1_1) {
          resolution_context_ts_1 = resolution_context_ts_1_1;
        },
        function (error_helpers_ts_1_1) {
          error_helpers_ts_1 = error_helpers_ts_1_1;
        },
        function (lazy_helpers_ts_2_1) {
          lazy_helpers_ts_2 = lazy_helpers_ts_2_1;
        },
      ],
      execute: function () {
        exports_91("typeInfo", typeInfo = new Map());
        /** Dependency Container */
        InternalDependencyContainer = class InternalDependencyContainer {
          constructor(parent) {
            this.parent = parent;
            this._registry = new registry_ts_1.default();
          }
          register(
            token,
            providerOrConstructor,
            options = { lifecycle: lifecycle_ts_2.default.Transient },
          ) {
            let provider;
            if (!provider_ts_1.isProvider(providerOrConstructor)) {
              provider = { useClass: providerOrConstructor };
            } else {
              provider = providerOrConstructor;
            }
            if (
              options.lifecycle === lifecycle_ts_2.default.Singleton ||
              options.lifecycle == lifecycle_ts_2.default.ContainerScoped ||
              options.lifecycle == lifecycle_ts_2.default.ResolutionScoped
            ) {
              if (
                index_ts_1.isValueProvider(provider) ||
                index_ts_1.isFactoryProvider(provider)
              ) {
                throw new Error(
                  `Cannot use lifecycle "${
                    lifecycle_ts_2.default[options.lifecycle]
                  }" with ValueProviders or FactoryProviders`,
                );
              }
            }
            this._registry.set(token, { provider, options });
            return this;
          }
          registerType(from, to) {
            if (index_ts_1.isNormalToken(to)) {
              return this.register(from, {
                useToken: to,
              });
            }
            return this.register(from, {
              useClass: to,
            });
          }
          registerInstance(token, instance) {
            return this.register(token, {
              useValue: instance,
            });
          }
          registerSingleton(from, to) {
            if (index_ts_1.isNormalToken(from)) {
              if (index_ts_1.isNormalToken(to)) {
                return this.register(from, {
                  useToken: to,
                }, { lifecycle: lifecycle_ts_2.default.Singleton });
              } else if (to) {
                return this.register(from, {
                  useClass: to,
                }, { lifecycle: lifecycle_ts_2.default.Singleton });
              }
              throw new Error(
                'Cannot register a type name as a singleton without a "to" token',
              );
            }
            let useClass = from;
            if (to && !index_ts_1.isNormalToken(to)) {
              useClass = to;
            }
            return this.register(from, {
              useClass,
            }, { lifecycle: lifecycle_ts_2.default.Singleton });
          }
          resolve(token, context = new resolution_context_ts_1.default()) {
            const registration = this.getRegistration(token);
            if (!registration && index_ts_1.isNormalToken(token)) {
              throw new Error(
                `Attempted to resolve unregistered dependency token: "${token.toString()}"`,
              );
            }
            if (registration) {
              return this.resolveRegistration(registration, context);
            }
            // No registration for this token, but since it's a constructor, return an instance
            if (injection_token_ts_2.isConstructorToken(token)) {
              return this.construct(token, context);
            }
            throw new Error(
              "Attempted to construct an undefined constructor. Could mean a circular dependency problem. Try using `delay` function.",
            );
          }
          resolveRegistration(registration, context) {
            // If we have already resolved this scoped dependency, return it
            if (
              registration.options.lifecycle ===
                lifecycle_ts_2.default.ResolutionScoped &&
              context.scopedResolutions.has(registration)
            ) {
              return context.scopedResolutions.get(registration);
            }
            const isSingleton =
              registration.options.lifecycle ===
                lifecycle_ts_2.default.Singleton;
            const isContainerScoped =
              registration.options.lifecycle ===
                lifecycle_ts_2.default.ContainerScoped;
            const returnInstance = isSingleton || isContainerScoped;
            let resolved;
            if (index_ts_1.isValueProvider(registration.provider)) {
              resolved = registration.provider.useValue;
            } else if (index_ts_1.isTokenProvider(registration.provider)) {
              resolved = returnInstance
                ? registration.instance ||
                  (registration.instance = this.resolve(
                    registration.provider.useToken,
                    context,
                  ))
                : this.resolve(registration.provider.useToken, context);
            } else if (index_ts_1.isClassProvider(registration.provider)) {
              resolved = returnInstance
                ? registration.instance ||
                  (registration.instance = this.construct(
                    registration.provider.useClass,
                    context,
                  ))
                : this.construct(registration.provider.useClass, context);
            } else if (index_ts_1.isFactoryProvider(registration.provider)) {
              resolved = registration.provider.useFactory(this);
            } else {
              resolved = this.construct(registration.provider, context);
            }
            // If this is a scoped dependency, store resolved instance in context
            if (
              registration.options.lifecycle ===
                lifecycle_ts_2.default.ResolutionScoped
            ) {
              context.scopedResolutions.set(registration, resolved);
            }
            return resolved;
          }
          resolveAll(token, context = new resolution_context_ts_1.default()) {
            const registrations = this.getAllRegistrations(token);
            if (!registrations && index_ts_1.isNormalToken(token)) {
              throw new Error(
                `Attempted to resolve unregistered dependency token: "${token.toString()}"`,
              );
            }
            if (registrations) {
              return registrations.map((item) =>
                this.resolveRegistration(item, context)
              );
            }
            // No registration for this token, but since it's a constructor, return an instance
            return [this.construct(token, context)];
          }
          isRegistered(token, recursive = false) {
            return (this._registry.has(token) ||
              (recursive &&
                (this.parent || false) &&
                this.parent.isRegistered(token, true)));
          }
          reset() {
            this._registry.clear();
          }
          clearInstances() {
            for (const [token, registrations] of this._registry.entries()) {
              this._registry.setAll(
                token,
                registrations
                  // Clear ValueProvider registrations
                  .filter((registration) =>
                    !index_ts_1.isValueProvider(registration.provider)
                  )
                  // Clear instances
                  .map((registration) => {
                    registration.instance = undefined;
                    return registration;
                  }),
              );
            }
          }
          createChildContainer() {
            const childContainer = new InternalDependencyContainer(this);
            for (const [token, registrations] of this._registry.entries()) {
              // If there are any ContainerScoped registrations, we need to copy
              // ALL registrations to the child container, if we were to copy just
              // the ContainerScoped registrations, we would lose access to the others
              if (
                registrations.some(({ options }) =>
                  options.lifecycle === lifecycle_ts_2.default.ContainerScoped
                )
              ) {
                childContainer._registry.setAll(
                  token,
                  registrations.map((registration) => {
                    if (
                      registration.options.lifecycle ===
                        lifecycle_ts_2.default.ContainerScoped
                    ) {
                      return {
                        provider: registration.provider,
                        options: registration.options,
                      };
                    }
                    return registration;
                  }),
                );
              }
            }
            return childContainer;
          }
          getRegistration(token) {
            if (this.isRegistered(token)) {
              return this._registry.get(token);
            }
            if (this.parent) {
              return this.parent.getRegistration(token);
            }
            return null;
          }
          getAllRegistrations(token) {
            if (this.isRegistered(token)) {
              return this._registry.getAll(token);
            }
            if (this.parent) {
              return this.parent.getAllRegistrations(token);
            }
            return null;
          }
          construct(ctor, context) {
            if (ctor instanceof lazy_helpers_ts_2.DelayedConstructor) {
              return ctor.createProxy((target) =>
                this.resolve(target, context)
              );
            }
            if (ctor.length === 0) {
              return new ctor();
            }
            const paramInfo = typeInfo.get(ctor);
            if (!paramInfo || paramInfo.length === 0) {
              throw new Error(`TypeInfo not known for "${ctor.name}"`);
            }
            const params = paramInfo.map(this.resolveParams(context, ctor));
            return new ctor(...params);
          }
          resolveParams(context, ctor) {
            return (param, idx) => {
              try {
                if (injection_token_ts_2.isTokenDescriptor(param)) {
                  return param.multiple
                    ? this.resolveAll(param.token)
                    : this.resolve(param.token, context);
                }
                return this.resolve(param, context);
              } catch (e) {
                throw new Error(
                  error_helpers_ts_1.formatErrorCtor(ctor, idx, e),
                );
              }
            };
          }
        };
        exports_91("instance", instance = new InternalDependencyContainer());
        exports_91("default", instance);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/reflection-helpers",
  ["https://deno.land/x/alosaur/src/injection/reflect"],
  function (exports_92, context_92) {
    "use strict";
    var reflect_ts_1, INJECTION_TOKEN_METADATA_KEY;
    var __moduleName = context_92 && context_92.id;
    function getParamInfo(target) {
      const params =
        reflect_ts_1.Reflect.getMetadata("design:paramtypes", target) || [];
      const injectionTokens =
        reflect_ts_1.Reflect.getOwnMetadata(
          INJECTION_TOKEN_METADATA_KEY,
          target,
        ) || {};
      Object.keys(injectionTokens).forEach((key) => {
        params[+key] = injectionTokens[key];
      });
      return params;
    }
    exports_92("getParamInfo", getParamInfo);
    function defineInjectionTokenMetadata(data) {
      return function (target, _propertyKey, parameterIndex) {
        const injectionTokens =
          reflect_ts_1.Reflect.getOwnMetadata(
            INJECTION_TOKEN_METADATA_KEY,
            target,
          ) || {};
        injectionTokens[parameterIndex] = data;
        reflect_ts_1.Reflect.defineMetadata(
          INJECTION_TOKEN_METADATA_KEY,
          injectionTokens,
          target,
        );
      };
    }
    exports_92("defineInjectionTokenMetadata", defineInjectionTokenMetadata);
    return {
      setters: [
        function (reflect_ts_1_1) {
          reflect_ts_1 = reflect_ts_1_1;
        },
      ],
      execute: function () {
        exports_92(
          "INJECTION_TOKEN_METADATA_KEY",
          INJECTION_TOKEN_METADATA_KEY = "injectionTokens.ts",
        );
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/decorators/auto-injectable",
  [
    "https://deno.land/x/alosaur/src/injection/reflection-helpers",
    "https://deno.land/x/alosaur/src/injection/dependency-container",
    "https://deno.land/x/alosaur/src/injection/providers/injection-token",
    "https://deno.land/x/alosaur/src/injection/error-helpers",
  ],
  function (exports_93, context_93) {
    "use strict";
    var reflection_helpers_ts_1,
      dependency_container_ts_1,
      injection_token_ts_3,
      error_helpers_ts_2;
    var __moduleName = context_93 && context_93.id;
    /**
     * Class decorator factory that replaces the decorated class' constructor with
     * a parameter less constructor that has dependencies auto-resolved
     *
     * Note: Resolution is performed using the global container
     *
     * @return {Function} The class decorator
     */
    function autoInjectable() {
      return function (target) {
        const paramInfo = reflection_helpers_ts_1.getParamInfo(target);
        return class extends target {
          constructor(...args) {
            super(
              ...args.concat(
                paramInfo.slice(args.length).map((type, index) => {
                  try {
                    if (injection_token_ts_3.isTokenDescriptor(type)) {
                      return type.multiple
                        ? dependency_container_ts_1.instance.resolveAll(
                          type.token,
                        )
                        : dependency_container_ts_1.instance.resolve(
                          type.token,
                        );
                    }
                    return dependency_container_ts_1.instance.resolve(type);
                  } catch (e) {
                    const argIndex = index + args.length;
                    throw new Error(
                      error_helpers_ts_2.formatErrorCtor(target, argIndex, e),
                    );
                  }
                }),
              ),
            );
          }
        };
      };
    }
    return {
      setters: [
        function (reflection_helpers_ts_1_1) {
          reflection_helpers_ts_1 = reflection_helpers_ts_1_1;
        },
        function (dependency_container_ts_1_1) {
          dependency_container_ts_1 = dependency_container_ts_1_1;
        },
        function (injection_token_ts_3_1) {
          injection_token_ts_3 = injection_token_ts_3_1;
        },
        function (error_helpers_ts_2_1) {
          error_helpers_ts_2 = error_helpers_ts_2_1;
        },
      ],
      execute: function () {
        exports_93("default", autoInjectable);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/decorators/inject",
  ["https://deno.land/x/alosaur/src/injection/reflection-helpers"],
  function (exports_94, context_94) {
    "use strict";
    var reflection_helpers_ts_2;
    var __moduleName = context_94 && context_94.id;
    /**
     * Parameter decorator factory that allows for interface information to be stored in the constructor's metadata
     *
     * @return {Function} The parameter decorator
     */
    function inject(token) {
      return reflection_helpers_ts_2.defineInjectionTokenMetadata(token);
    }
    return {
      setters: [
        function (reflection_helpers_ts_2_1) {
          reflection_helpers_ts_2 = reflection_helpers_ts_2_1;
        },
      ],
      execute: function () {
        exports_94("default", inject);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/decorators/injectable",
  [
    "https://deno.land/x/alosaur/src/injection/reflection-helpers",
    "https://deno.land/x/alosaur/src/injection/dependency-container",
  ],
  function (exports_95, context_95) {
    "use strict";
    var reflection_helpers_ts_3, dependency_container_ts_2;
    var __moduleName = context_95 && context_95.id;
    /**
     * Class decorator factory that allows the class' dependencies to be injected
     * at runtime.
     *
     * @return {Function} The class decorator
     */
    function injectable() {
      return function (target) {
        dependency_container_ts_2.typeInfo.set(
          target,
          reflection_helpers_ts_3.getParamInfo(target),
        );
      };
    }
    return {
      setters: [
        function (reflection_helpers_ts_3_1) {
          reflection_helpers_ts_3 = reflection_helpers_ts_3_1;
        },
        function (dependency_container_ts_2_1) {
          dependency_container_ts_2 = dependency_container_ts_2_1;
        },
      ],
      execute: function () {
        exports_95("default", injectable);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/decorators/registry",
  ["https://deno.land/x/alosaur/src/injection/dependency-container"],
  function (exports_96, context_96) {
    "use strict";
    var dependency_container_ts_3;
    var __moduleName = context_96 && context_96.id;
    /**
     * Class decorator factory that allows constructor dependencies to be registered at runtime.
     *
     * @return {Function} The class decorator
     */
    function registry(registrations = []) {
      return function (target) {
        registrations.forEach(({ token, options, ...provider }) =>
          dependency_container_ts_3.instance.register(token, provider, options)
        );
        return target;
      };
    }
    return {
      setters: [
        function (dependency_container_ts_3_1) {
          dependency_container_ts_3 = dependency_container_ts_3_1;
        },
      ],
      execute: function () {
        exports_96("default", registry);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/decorators/singleton",
  [
    "https://deno.land/x/alosaur/src/injection/decorators/injectable",
    "https://deno.land/x/alosaur/src/injection/dependency-container",
  ],
  function (exports_97, context_97) {
    "use strict";
    var injectable_ts_1, dependency_container_ts_4;
    var __moduleName = context_97 && context_97.id;
    /**
     * Class decorator factory that registers the class as a singleton within
     * the global container.
     *
     * @return {Function} The class decorator
     */
    function singleton() {
      return function (target) {
        injectable_ts_1.default()(target);
        dependency_container_ts_4.instance.registerSingleton(target);
      };
    }
    return {
      setters: [
        function (injectable_ts_1_1) {
          injectable_ts_1 = injectable_ts_1_1;
        },
        function (dependency_container_ts_4_1) {
          dependency_container_ts_4 = dependency_container_ts_4_1;
        },
      ],
      execute: function () {
        exports_97("default", singleton);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/decorators/inject-all",
  ["https://deno.land/x/alosaur/src/injection/reflection-helpers"],
  function (exports_98, context_98) {
    "use strict";
    var reflection_helpers_ts_4;
    var __moduleName = context_98 && context_98.id;
    /**
     * Parameter decorator factory that allows for interface information to be stored in the constructor's metadata
     *
     * @return {Function} The parameter decorator
     */
    function injectAll(token) {
      const data = { token, multiple: true };
      return reflection_helpers_ts_4.defineInjectionTokenMetadata(data);
    }
    return {
      setters: [
        function (reflection_helpers_ts_4_1) {
          reflection_helpers_ts_4 = reflection_helpers_ts_4_1;
        },
      ],
      execute: function () {
        exports_98("default", injectAll);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/decorators/scoped",
  [
    "https://deno.land/x/alosaur/src/injection/decorators/injectable",
    "https://deno.land/x/alosaur/src/injection/dependency-container",
  ],
  function (exports_99, context_99) {
    "use strict";
    var injectable_ts_2, dependency_container_ts_5;
    var __moduleName = context_99 && context_99.id;
    /**
     * Class decorator factory that registers the class as a scoped dependency within
     * the global container.
     *
     * @return The class decorator
     */
    function scoped(lifecycle, token) {
      return function (target) {
        injectable_ts_2.default()(target);
        dependency_container_ts_5.instance.register(token || target, target, {
          lifecycle,
        });
      };
    }
    exports_99("default", scoped);
    return {
      setters: [
        function (injectable_ts_2_1) {
          injectable_ts_2 = injectable_ts_2_1;
        },
        function (dependency_container_ts_5_1) {
          dependency_container_ts_5 = dependency_container_ts_5_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/decorators/index",
  [
    "https://deno.land/x/alosaur/src/injection/decorators/auto-injectable",
    "https://deno.land/x/alosaur/src/injection/decorators/inject",
    "https://deno.land/x/alosaur/src/injection/decorators/injectable",
    "https://deno.land/x/alosaur/src/injection/decorators/registry",
    "https://deno.land/x/alosaur/src/injection/decorators/singleton",
    "https://deno.land/x/alosaur/src/injection/decorators/inject-all",
    "https://deno.land/x/alosaur/src/injection/decorators/scoped",
  ],
  function (exports_100, context_100) {
    "use strict";
    var __moduleName = context_100 && context_100.id;
    return {
      setters: [
        function (auto_injectable_ts_1_1) {
          exports_100({
            "AutoInjectable": auto_injectable_ts_1_1["default"],
          });
        },
        function (inject_ts_1_1) {
          exports_100({
            "Inject": inject_ts_1_1["default"],
          });
        },
        function (injectable_ts_3_1) {
          exports_100({
            "Injectable": injectable_ts_3_1["default"],
          });
        },
        function (registry_ts_2_1) {
          exports_100({
            "Registry": registry_ts_2_1["default"],
          });
        },
        function (singleton_ts_1_1) {
          exports_100({
            "Singleton": singleton_ts_1_1["default"],
          });
        },
        function (inject_all_ts_1_1) {
          exports_100({
            "InjectAll": inject_all_ts_1_1["default"],
          });
        },
        function (scoped_ts_1_1) {
          exports_100({
            "Scoped": scoped_ts_1_1["default"],
          });
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/factories/factory-function",
  [],
  function (exports_101, context_101) {
    "use strict";
    var __moduleName = context_101 && context_101.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/factories/instance-caching-factory",
  [],
  function (exports_102, context_102) {
    "use strict";
    var __moduleName = context_102 && context_102.id;
    function instanceCachingFactory(factoryFunc) {
      let instance;
      return (dependencyContainer) => {
        if (instance == undefined) {
          instance = factoryFunc(dependencyContainer);
        }
        return instance;
      };
    }
    exports_102("default", instanceCachingFactory);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/factories/predicate-aware-class-factory",
  [],
  function (exports_103, context_103) {
    "use strict";
    var __moduleName = context_103 && context_103.id;
    function predicateAwareClassFactory(
      predicate,
      trueConstructor,
      falseConstructor,
      useCaching = true,
    ) {
      let instance;
      let previousPredicate;
      return (dependencyContainer) => {
        const currentPredicate = predicate(dependencyContainer);
        if (!useCaching || previousPredicate !== currentPredicate) {
          if ((previousPredicate = currentPredicate)) {
            instance = dependencyContainer.resolve(trueConstructor);
          } else {
            instance = dependencyContainer.resolve(falseConstructor);
          }
        }
        return instance;
      };
    }
    exports_103("default", predicateAwareClassFactory);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/factories/index",
  [
    "https://deno.land/x/alosaur/src/injection/factories/instance-caching-factory",
    "https://deno.land/x/alosaur/src/injection/factories/predicate-aware-class-factory",
  ],
  function (exports_104, context_104) {
    "use strict";
    var __moduleName = context_104 && context_104.id;
    return {
      setters: [
        function (instance_caching_factory_ts_1_1) {
          exports_104({
            "instanceCachingFactory":
              instance_caching_factory_ts_1_1["default"],
          });
        },
        function (predicate_aware_class_factory_ts_1_1) {
          exports_104({
            "predicateAwareClassFactory":
              predicate_aware_class_factory_ts_1_1["default"],
          });
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/injection/index",
  [
    "https://deno.land/x/alosaur/src/injection/reflect",
    "https://deno.land/x/alosaur/src/injection/types/index",
    "https://deno.land/x/alosaur/src/injection/decorators/index",
    "https://deno.land/x/alosaur/src/injection/factories/index",
    "https://deno.land/x/alosaur/src/injection/providers/index",
    "https://deno.land/x/alosaur/src/injection/lazy-helpers",
    "https://deno.land/x/alosaur/src/injection/dependency-container",
  ],
  function (exports_105, context_105) {
    "use strict";
    var __moduleName = context_105 && context_105.id;
    var exportedNames_2 = {
      "Lifecycle": true,
      "delay": true,
      "container": true,
    };
    function exportStar_4(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default" && !exportedNames_2.hasOwnProperty(n)) {
          exports[n] = m[n];
        }
      }
      exports_105(exports);
    }
    return {
      setters: [
        function (_1) {
        },
        function (index_ts_2_1) {
          exports_105({
            "Lifecycle": index_ts_2_1["Lifecycle"],
          });
        },
        function (index_ts_3_1) {
          exportStar_4(index_ts_3_1);
        },
        function (index_ts_4_1) {
          exportStar_4(index_ts_4_1);
        },
        function (index_ts_5_1) {
          exportStar_4(index_ts_5_1);
        },
        function (lazy_helpers_ts_3_1) {
          exports_105({
            "delay": lazy_helpers_ts_3_1["delay"],
          });
        },
        function (dependency_container_ts_6_1) {
          exports_105({
            "container": dependency_container_ts_6_1["instance"],
          });
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/utils/register-controllers",
  [
    "https://deno.land/std@0.56.0/log/mod",
    "https://deno.land/x/alosaur/src/mod",
    "https://deno.land/x/alosaur/src/injection/index",
  ],
  function (exports_106, context_106) {
    "use strict";
    var log, mod_ts_9, index_ts_6;
    var __moduleName = context_106 && context_106.id;
    function registerControllers(
      controllers = [],
      classes = [],
      addToRoute,
      logging = true,
    ) {
      // TODO: add two route Map (with route params / exact match)
      // example: new Map(); key = route, value = object
      controllers.forEach((controller) => {
        const actions = mod_ts_9.getMetadataArgsStorage().actions.filter((
          action,
        ) => action.target === controller.target);
        const params = mod_ts_9.getMetadataArgsStorage().params.filter((
          param,
        ) => param.target === controller.target);
        // TODO: if obj not in classes
        // resolve from DI
        const target = index_ts_6.container.resolve(controller.target);
        classes.push(target);
        if (logging) {
          log.debug(
            `The "${controller.target.name ||
              controller.target.constructor
                .name}" controller has been registered.`,
          );
        }
        let areaRoute = ``;
        if (controller.area !== undefined && controller.area.baseRoute) {
          areaRoute = controller.area.baseRoute;
        }
        actions.forEach((action) => {
          let fullRoute = areaRoute;
          if (controller.route) {
            fullRoute += controller.route;
          }
          const regexpRoute = action.route instanceof RegExp
            ? action.route
            : undefined;
          if (!regexpRoute && action.route) {
            fullRoute += action.route;
          }
          if (fullRoute === "") {
            fullRoute = "/";
          }
          const metaRoute = {
            baseRoute: areaRoute,
            route: fullRoute,
            regexpRoute,
            target: target,
            areaObject: controller.area && controller.area.target,
            actionObject: action.object,
            controllerObject: controller.target,
            action: action.method,
            method: action.type,
            params: params.filter((param) => param.method === action.method),
          };
          if (logging) {
            log.debug(`The "${metaRoute.route}" route has been registered.`);
          }
          addToRoute(metaRoute);
        });
      });
    }
    exports_106("registerControllers", registerControllers);
    return {
      setters: [
        function (log_2) {
          log = log_2;
        },
        function (mod_ts_9_1) {
          mod_ts_9 = mod_ts_9_1;
        },
        function (index_ts_6_1) {
          index_ts_6 = index_ts_6_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
/*!
 * Adapted from koa-send at https://github.com/koajs/send and which is licensed
 * with the MIT license.
 */
System.register(
  "https://deno.land/x/alosaur/src/static/send",
  ["https://deno.land/x/alosaur/src/deps"],
  function (exports_107, context_107) {
    "use strict";
    var deps_ts_4, deps_ts_5, UP_PATH_REGEXP;
    var __moduleName = context_107 && context_107.id;
    function decodeComponent(text) {
      try {
        return decodeURIComponent(text);
      } catch {
        return text;
      }
    }
    exports_107("decodeComponent", decodeComponent);
    function isHidden(root, path) {
      const pathArr = path.substr(root.length).split(deps_ts_4.sep);
      return !!pathArr.find((segment) => segment.startsWith("."));
    }
    async function exists(path) {
      try {
        return (await Deno.stat(path)).isFile;
      } catch {
        return false;
      }
    }
    function toUTCString(value) {
      return new Date(value).toUTCString();
    }
    /** Asynchronously fulfill a response with a file from the local file
     * system. */
    async function send({ request, response }, path, options = { root: "" }) {
      const {
        brotli = true,
        extensions,
        format = true,
        gzip = true,
        index,
        hidden = false,
        immutable = false,
        maxAge = 0,
        root,
      } = options;
      const trailingSlash = path[path.length - 1] === "/";
      path = decodeComponent(path.substr(deps_ts_4.parse(path).root.length));
      if (index && trailingSlash) {
        path += index;
      }
      // normalize
      path = resolvePath(root, path);
      if (!hidden && isHidden(root, path)) {
        return;
      }
      if (!response) {
        response = { headers: new Headers() };
      }
      let encodingExt = "";
      if (brotli && (await exists(`${path}.br`))) {
        path = `${path}.br`;
        response.headers.set("Content-Encoding", "br");
        response.headers.delete("Content-Length");
        encodingExt = ".br";
      } else if (gzip && (await exists(`${path}.gz`))) {
        path = `${path}.gz`;
        response.headers.set("Content-Encoding", "gzip");
        response.headers.delete("Content-Length");
        encodingExt = ".gz";
      }
      if (extensions && !/\.[^/]*$/.exec(path)) {
        for (let ext of extensions) {
          if (!/^\./.exec(ext)) {
            ext = `.${ext}`;
          }
          if (await exists(`${path}${ext}`)) {
            path += ext;
            break;
          }
        }
      }
      let stats;
      try {
        stats = await Deno.stat(path);
        if (stats.isDirectory) {
          if (format && index) {
            path += `/${index}`;
            stats = await Deno.stat(path);
          } else {
            return;
          }
        }
      } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
          throw new Error(err.message); // 404
        }
        throw new Error(err.message); // 500
      }
      response.headers.set("Content-Length", String(stats.size));
      // TODO: stats.modified from Stats
      // if (!response.headers.has('Last-Modified') && stats.modified) {
      //   response.headers.set('Last-Modified', toUTCString(stats.modified));
      // }
      if (!response.headers.has("Cache-Control")) {
        const directives = [`max-age=${(maxAge / 1000) | 0}`];
        if (immutable) {
          directives.push("immutable");
        }
        response.headers.set("Cache-Control", directives.join(","));
      }
      if (!response.headers.has("Content-type")) {
        const type = deps_ts_4.contentType(
          encodingExt !== ""
            ? deps_ts_4.extname(deps_ts_4.basename(path, encodingExt))
            : deps_ts_4.extname(path),
        );
        response.headers.set("Content-type", type);
      }
      response.body = await Deno.readFile(path);
      return path;
    }
    exports_107("send", send);
    function resolvePath(rootPath, relativePath) {
      let path = relativePath;
      let root = rootPath;
      // root is optional, similar to root.resolve
      if (arguments.length === 1) {
        path = rootPath;
        root = Deno.cwd();
      }
      if (path == null) {
        throw new TypeError("Argument relativePath is required.");
      }
      // containing NULL bytes is malicious
      if (path.includes("\0")) {
        throw new Error("Malicious Path");
      }
      // path should never be absolute
      if (deps_ts_5.isAbsolute(path)) {
        throw new Error("Malicious Path");
      }
      // path outside root
      if (
        UP_PATH_REGEXP.test(deps_ts_5.normalize("." + deps_ts_4.sep + path))
      ) {
        throw new Error("403");
      }
      // join the relative path
      return deps_ts_5.normalize(deps_ts_5.join(deps_ts_5.resolve(root), path));
    }
    exports_107("resolvePath", resolvePath);
    return {
      setters: [
        function (deps_ts_4_1) {
          deps_ts_4 = deps_ts_4_1;
          deps_ts_5 = deps_ts_4_1;
        },
      ],
      execute: function () {
        // Moved from:
        // import { resolvePath } from './resolve-path.ts';
        UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/;
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/utils/get-static-file",
  [
    "https://deno.land/std@0.56.0/log/mod",
    "https://deno.land/x/alosaur/src/route/route.utils",
    "https://deno.land/x/alosaur/src/static/send",
  ],
  function (exports_108, context_108) {
    "use strict";
    var log, route_utils_ts_2, send_ts_1;
    var __moduleName = context_108 && context_108.id;
    async function getStaticFile(context, staticConfig) {
      if (staticConfig == null) {
        return false;
      }
      let url = context.request.url;
      if (staticConfig.baseRoute) {
        const regexpUrl = new RegExp(`^${staticConfig.baseRoute}`);
        if (regexpUrl.test(url)) {
          url = url.replace(regexpUrl, "/");
        } else {
          return false;
        }
      }
      try {
        const filePath = await send_ts_1.send(
          {
            request: context.request.serverRequest,
            response: context.response,
          },
          route_utils_ts_2.getPathNameFromUrl(url),
          staticConfig,
        );
        return !!filePath;
      } catch (error) {
        // TODO: exception
        if (staticConfig.baseRoute) {
          log.warning(error);
        }
        return null;
      }
    }
    exports_108("getStaticFile", getStaticFile);
    return {
      setters: [
        function (log_3) {
          log = log_3;
        },
        function (route_utils_ts_2_1) {
          route_utils_ts_2 = route_utils_ts_2_1;
        },
        function (send_ts_1_1) {
          send_ts_1 = send_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/renderer/not-found",
  ["https://deno.land/x/alosaur/src/renderer/content"],
  function (exports_109, context_109) {
    "use strict";
    var content_ts_2;
    var __moduleName = context_109 && context_109.id;
    function notFoundAction() {
      return content_ts_2.Content("Not found", 404); // TODO: enum http status
    }
    exports_109("notFoundAction", notFoundAction);
    return {
      setters: [
        function (content_ts_2_1) {
          content_ts_2 = content_ts_2_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/models/app-settings",
  [],
  function (exports_110, context_110) {
    "use strict";
    var __moduleName = context_110 && context_110.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/route/get-hooks",
  [],
  function (exports_111, context_111) {
    "use strict";
    var __moduleName = context_111 && context_111.id;
    function getGroupedHooks(hooks, action) {
      const result = {
        areaHooks: [],
        controllerHooks: [],
        actionHooks: [],
      };
      if (hooks != undefined && hooks.length > 0) {
        const group = getGrouped(hooks, action);
        result.areaHooks = group.areaHooks;
        result.controllerHooks = group.controllerHooks;
        result.actionHooks = group.actionHooks;
      }
      return result;
    }
    exports_111("getGroupedHooks", getGroupedHooks);
    function getHooksForAction(hooks, action) {
      if (hooks == undefined) {
        return undefined;
      }
      const group = getGrouped(hooks, action);
      return [
        ...group.areaHooks,
        ...group.controllerHooks,
        ...group.actionHooks,
      ];
    }
    exports_111("getHooksForAction", getHooksForAction);
    function getGrouped(hooks, action) {
      const areaHooks = [];
      const controllerHooks = [];
      const actionHooks = [];
      for (let hook of hooks) {
        if (hook.object === action.areaObject) {
          areaHooks.push(hook);
          continue;
        }
        if (hook.object === action.controllerObject) {
          controllerHooks.push(hook);
          continue;
        }
        if (
          hook.object === action.actionObject && hook.method === action.action
        ) {
          actionHooks.push(hook);
          continue;
        }
      }
      return {
        areaHooks,
        controllerHooks,
        actionHooks,
      };
    }
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/mod",
  [
    "https://deno.land/std@0.56.0/log/mod",
    "https://deno.land/x/alosaur/src/metadata/metadata",
    "https://deno.land/x/alosaur/src/deps",
    "https://deno.land/x/alosaur/src/route/get-action",
    "https://deno.land/x/alosaur/src/route/get-action-params",
    "https://deno.land/x/alosaur/src/renderer/content",
    "https://deno.land/x/alosaur/src/utils/register-areas",
    "https://deno.land/x/alosaur/src/utils/register-controllers",
    "https://deno.land/x/alosaur/src/utils/get-static-file",
    "https://deno.land/x/alosaur/src/models/context",
    "https://deno.land/x/alosaur/src/renderer/not-found",
    "https://deno.land/x/alosaur/src/route/get-hooks",
    "https://deno.land/x/alosaur/src/http-error/HttpError",
  ],
  function (exports_112, context_112) {
    "use strict";
    var log,
      metadata_ts_1,
      deps_ts_6,
      get_action_ts_1,
      get_action_params_ts_1,
      content_ts_3,
      register_areas_ts_1,
      register_controllers_ts_1,
      get_static_file_ts_1,
      context_ts_1,
      not_found_ts_1,
      get_hooks_ts_1,
      HttpError_ts_9,
      global,
      App;
    var __moduleName = context_112 && context_112.id;
    function getMetadataArgsStorage() {
      if (!global.routingControllersMetadataArgsStorage) {
        global.routingControllersMetadataArgsStorage = new metadata_ts_1
          .MetadataArgsStorage();
      }
      return global.routingControllersMetadataArgsStorage;
    }
    exports_112("getMetadataArgsStorage", getMetadataArgsStorage);
    function getViewRenderConfig() {
      return global.viewRenderConfig;
    }
    exports_112("getViewRenderConfig", getViewRenderConfig);
    // TODO(irustm): move to hooks function
    /**
     * Run hooks function and return true if response is immediately
     */
    async function resolveHooks(context, actionName, hooks) {
      const resolvedHooks = new Set();
      if (hooks !== undefined && hooks.length > 0) {
        for (const hook of hooks) {
          const action = hook.instance[actionName];
          if (action !== undefined) {
            await hook.instance[actionName](context, hook.payload);
            if (context.response.isImmediately()) {
              let reverseActionName = actionName === "onCatchAction"
                ? "onCatchAction" : "onPostAction";
              // run reverse resolved hooks
              await runHooks(
                context,
                reverseActionName,
                Array.from(resolvedHooks).reverse(),
              );
              await context.request.serverRequest.respond(
                context.response.getMergedResult(),
              );
              return true;
            }
          }
          resolvedHooks.add(hook);
        }
      }
      return false;
    }
    async function runHooks(context, actionName, hooks) {
      for (const hook of hooks) {
        const action = hook.instance[actionName];
        if (action !== undefined) {
          await hook.instance[actionName](context, hook.payload);
        }
      }
    }
    // TODO(irustm): move to hooks function
    function hasHooksAction(actionName, hooks) {
      return !!(hooks &&
        hooks.find((hook) => hook.instance[actionName] !== undefined));
    }
    return {
      setters: [
        function (log_4) {
          log = log_4;
        },
        function (metadata_ts_1_1) {
          metadata_ts_1 = metadata_ts_1_1;
        },
        function (deps_ts_6_1) {
          deps_ts_6 = deps_ts_6_1;
        },
        function (get_action_ts_1_1) {
          get_action_ts_1 = get_action_ts_1_1;
        },
        function (get_action_params_ts_1_1) {
          get_action_params_ts_1 = get_action_params_ts_1_1;
        },
        function (content_ts_3_1) {
          content_ts_3 = content_ts_3_1;
        },
        function (register_areas_ts_1_1) {
          register_areas_ts_1 = register_areas_ts_1_1;
        },
        function (register_controllers_ts_1_1) {
          register_controllers_ts_1 = register_controllers_ts_1_1;
        },
        function (get_static_file_ts_1_1) {
          get_static_file_ts_1 = get_static_file_ts_1_1;
        },
        function (context_ts_1_1) {
          context_ts_1 = context_ts_1_1;
        },
        function (not_found_ts_1_1) {
          not_found_ts_1 = not_found_ts_1_1;
        },
        function (get_hooks_ts_1_1) {
          get_hooks_ts_1 = get_hooks_ts_1_1;
        },
        function (HttpError_ts_9_1) {
          HttpError_ts_9 = HttpError_ts_9_1;
        },
      ],
      execute: function () {
        global = {};
        App = class App {
          constructor(settings) {
            this.classes = [];
            this.routes = [];
            this.staticConfig = undefined;
            this.viewRenderConfig = undefined;
            this.transformConfigMap = undefined;
            this.server = undefined;
            this.metadata = getMetadataArgsStorage();
            register_areas_ts_1.registerAreas(this.metadata);
            register_controllers_ts_1.registerControllers(
              this.metadata.controllers,
              this.classes,
              (route) => this.routes.push(route),
              settings.logging,
            );
            if (settings) {
              this.useStatic(settings.staticConfig);
              this.useViewRender(settings.viewRenderConfig);
            }
          }
          async listen(address = ":8000") {
            const server = deps_ts_6.serve(address);
            this.server = server;
            console.log(`Server start in ${address}`);
            for await (const req of server) {
              const context = new context_ts_1.Context(req);
              try {
                // Get middlewares in request
                const middlewares = this.metadata.middlewares.filter((m) =>
                  m.route.test(context.request.url)
                );
                // Resolve every pre middleware
                for (const middleware of middlewares) {
                  await middleware.target.onPreRequest(context);
                }
                if (context.response.isImmediately()) {
                  await req.respond(context.response.getRaw());
                  continue;
                }
                // try getting static file
                if (
                  await get_static_file_ts_1.getStaticFile(
                    context,
                    this.staticConfig,
                  )
                ) {
                  await req.respond(context.response.getRaw());
                  continue;
                } else {
                  const action = get_action_ts_1.getAction(
                    this.routes,
                    context.request.method,
                    context.request.url,
                  );
                  if (action !== null) {
                    const hooks = get_hooks_ts_1.getHooksForAction(
                      this.metadata.hooks,
                      action,
                    );
                    // try resolve hooks
                    if (await resolveHooks(context, "onPreAction", hooks)) {
                      continue;
                    }
                    // Get arguments in this action
                    const args = await get_action_params_ts_1.getActionParams(
                      context,
                      action,
                      this.transformConfigMap,
                    );
                    try {
                      // Get Action result from controller method
                      context.response.result = await action
                        .target[action.action](...args);
                    } catch (error) {
                      context.response.error = error;
                      // try resolve hooks
                      if (
                        hasHooksAction("onCatchAction", hooks) &&
                        await resolveHooks(context, "onCatchAction", hooks)
                      ) {
                        continue;
                      } else {
                        // Resolve every post middleware if error was not caught
                        for (const middleware of middlewares) {
                          await middleware.target.onPostRequest(context);
                        }
                        if (context.response.isImmediately()) {
                          await req.respond(context.response.getMergedResult());
                          continue;
                        }
                        throw error;
                      }
                    }
                    // try resolve hooks
                    if (await resolveHooks(context, "onPostAction", hooks)) {
                      continue;
                    }
                  }
                }
                if (context.response.isImmediately()) {
                  await req.respond(context.response.getMergedResult());
                  continue;
                }
                // Resolve every post middleware
                for (const middleware of middlewares) {
                  await middleware.target.onPostRequest(context);
                }
                if (context.response.isImmediately()) {
                  await req.respond(context.response.getMergedResult());
                  continue;
                }
                if (context.response.result === undefined) {
                  context.response.result = not_found_ts_1.notFoundAction();
                  await req.respond(context.response.getMergedResult());
                  continue;
                }
                await req.respond(context.response.getMergedResult());
              } catch (error) {
                if (this.globalErrorHandler) {
                  this.globalErrorHandler(context, error);
                  if (context.response.isImmediately()) {
                    await req.respond(context.response.getMergedResult());
                    continue;
                  }
                }
                if (context.response.isImmediately()) {
                  await req.respond(context.response.getMergedResult());
                  continue;
                }
                //
                if (!(error instanceof HttpError_ts_9.HttpError)) {
                  log.error(error);
                }
                await req.respond(
                  content_ts_3.Content(error, error.httpCode || 500),
                );
              }
            }
            return server;
          }
          close() {
            if (this.server) {
              this.server.close();
            } else {
              log.warning("Server is not listening");
            }
          }
          useStatic(config) {
            if (config && !this.staticConfig) {
              this.staticConfig = config;
            }
          }
          useViewRender(config) {
            if (config && !this.viewRenderConfig) {
              this.viewRenderConfig = config;
              global.viewRenderConfig = config;
            }
          }
          useTransform(transform) {
            if (!this.transformConfigMap) {
              this.transformConfigMap = new Map();
            }
            this.transformConfigMap.set(transform.type, transform);
          }
          /**
                * Deprecate
                */
          useCors(builder) {
            this.metadata.middlewares.push({
              type: "middleware",
              target: builder,
              route: /\//,
            });
          }
          use(route, middleware) {
            this.metadata.middlewares.push({
              type: "middleware",
              target: middleware,
              route,
            });
          }
          /**
                 * Create one global error handler
                 */
          error(globalErrorHandler) {
            this.globalErrorHandler = globalErrorHandler;
          }
        };
        exports_112("App", App);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/renderer/view",
  [
    "https://deno.land/x/alosaur/src/deps",
    "https://deno.land/x/alosaur/src/mod",
  ],
  function (exports_113, context_113) {
    "use strict";
    var deps_ts_7, mod_ts_10;
    var __moduleName = context_113 && context_113.id;
    /**
     * Renders view with template with changed template render
     * @param path
     * @param model
     * @param status
     */
    async function View(path, model, status = 200) {
      const headers = new Headers();
      headers.set("content-type", deps_ts_7.contentType("text/html"));
      const renderConfig = mod_ts_10.getViewRenderConfig();
      return {
        body: await renderConfig.getBody(path, model, renderConfig),
        status,
        headers,
        __isActionResult: true,
      };
    }
    exports_113("View", View);
    return {
      setters: [
        function (deps_ts_7_1) {
          deps_ts_7 = deps_ts_7_1;
        },
        function (mod_ts_10_1) {
          mod_ts_10 = mod_ts_10_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/renderer/redirect",
  [],
  function (exports_114, context_114) {
    "use strict";
    var __moduleName = context_114 && context_114.id;
    function Redirect(url) {
      const headers = new Headers();
      headers.append("Location", url);
      return {
        status: 302,
        headers,
        __isActionResult: true,
      };
    }
    exports_114("Redirect", Redirect);
    function RedirectPermanent(url) {
      const headers = new Headers();
      headers.append("Location", url);
      return {
        status: 301,
        headers,
        __isActionResult: true,
      };
    }
    exports_114("RedirectPermanent", RedirectPermanent);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/renderer/mod",
  [
    "https://deno.land/x/alosaur/src/renderer/content",
    "https://deno.land/x/alosaur/src/renderer/view",
    "https://deno.land/x/alosaur/src/renderer/redirect",
    "https://deno.land/x/alosaur/src/renderer/not-found",
  ],
  function (exports_115, context_115) {
    "use strict";
    var __moduleName = context_115 && context_115.id;
    function exportStar_5(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default") exports[n] = m[n];
      }
      exports_115(exports);
    }
    return {
      setters: [
        function (content_ts_4_1) {
          exportStar_5(content_ts_4_1);
        },
        function (view_ts_1_1) {
          exportStar_5(view_ts_1_1);
        },
        function (redirect_ts_1_1) {
          exportStar_5(redirect_ts_1_1);
        },
        function (not_found_ts_2_1) {
          exportStar_5(not_found_ts_2_1);
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/decorator/Area",
  ["https://deno.land/x/alosaur/src/mod"],
  function (exports_116, context_116) {
    "use strict";
    var mod_ts_11;
    var __moduleName = context_116 && context_116.id;
    function Area(config) {
      return function (object) {
        mod_ts_11.getMetadataArgsStorage().areas.push({
          type: "area",
          target: object,
          controllers: config && config.controllers,
          baseRoute: config && config.baseRoute,
        });
      };
    }
    exports_116("Area", Area);
    return {
      setters: [
        function (mod_ts_11_1) {
          mod_ts_11 = mod_ts_11_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/decorator/Controller",
  [
    "https://deno.land/x/alosaur/src/mod",
    "https://deno.land/x/alosaur/src/injection/reflection-helpers",
    "https://deno.land/x/alosaur/src/injection/dependency-container",
  ],
  function (exports_117, context_117) {
    "use strict";
    var mod_ts_12, reflection_helpers_ts_5, dependency_container_ts_7;
    var __moduleName = context_117 && context_117.id;
    /**
     * Defines a class as a controller.
     * Each decorated controller method is served as a controller action.
     * Controller actions are executed when request come.
     *
     * @param baseRoute Extra path you can apply as a base route to all controller actions
     */
    function Controller(baseRoute) {
      return function (object) {
        dependency_container_ts_7.typeInfo.set(
          object,
          reflection_helpers_ts_5.getParamInfo(object),
        );
        mod_ts_12.getMetadataArgsStorage().controllers.push({
          type: "default",
          target: object,
          route: baseRoute,
        });
      };
    }
    exports_117("Controller", Controller);
    return {
      setters: [
        function (mod_ts_12_1) {
          mod_ts_12 = mod_ts_12_1;
        },
        function (reflection_helpers_ts_5_1) {
          reflection_helpers_ts_5 = reflection_helpers_ts_5_1;
        },
        function (dependency_container_ts_7_1) {
          dependency_container_ts_7 = dependency_container_ts_7_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/decorator/Get",
  [
    "https://deno.land/x/alosaur/src/mod",
    "https://deno.land/x/alosaur/src/types/request-method",
  ],
  function (exports_118, context_118) {
    "use strict";
    var mod_ts_13, request_method_ts_1;
    var __moduleName = context_118 && context_118.id;
    /**
     * Registers an action to be executed when GET request comes on a given route.
     * Must be applied on a controller action.
     */
    function Get(route) {
      return function (object, methodName) {
        mod_ts_13.getMetadataArgsStorage().actions.push({
          type: request_method_ts_1.RequestMethod.Get,
          object: object,
          target: object.constructor,
          method: methodName,
          route: route,
        });
      };
    }
    exports_118("Get", Get);
    return {
      setters: [
        function (mod_ts_13_1) {
          mod_ts_13 = mod_ts_13_1;
        },
        function (request_method_ts_1_1) {
          request_method_ts_1 = request_method_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/decorator/Post",
  [
    "https://deno.land/x/alosaur/src/mod",
    "https://deno.land/x/alosaur/src/types/request-method",
  ],
  function (exports_119, context_119) {
    "use strict";
    var mod_ts_14, request_method_ts_2;
    var __moduleName = context_119 && context_119.id;
    /**
     * Registers an action to be executed when POST request comes on a given route.
     * Must be applied on a controller action.
     */
    function Post(route) {
      return function (object, methodName) {
        mod_ts_14.getMetadataArgsStorage().actions.push({
          type: request_method_ts_2.RequestMethod.Post,
          object: object,
          target: object.constructor,
          method: methodName,
          route: route,
        });
      };
    }
    exports_119("Post", Post);
    return {
      setters: [
        function (mod_ts_14_1) {
          mod_ts_14 = mod_ts_14_1;
        },
        function (request_method_ts_2_1) {
          request_method_ts_2 = request_method_ts_2_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/decorator/Patch",
  [
    "https://deno.land/x/alosaur/src/mod",
    "https://deno.land/x/alosaur/src/types/request-method",
  ],
  function (exports_120, context_120) {
    "use strict";
    var mod_ts_15, request_method_ts_3;
    var __moduleName = context_120 && context_120.id;
    /**
     * Registers an action to be executed when PATCH request comes on a given route.
     * Must be applied on a controller action.
     */
    function Patch(route) {
      return function (object, methodName) {
        mod_ts_15.getMetadataArgsStorage().actions.push({
          type: request_method_ts_3.RequestMethod.Path,
          object: object,
          target: object.constructor,
          method: methodName,
          route: route,
        });
      };
    }
    exports_120("Patch", Patch);
    return {
      setters: [
        function (mod_ts_15_1) {
          mod_ts_15 = mod_ts_15_1;
        },
        function (request_method_ts_3_1) {
          request_method_ts_3 = request_method_ts_3_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/decorator/Put",
  [
    "https://deno.land/x/alosaur/src/mod",
    "https://deno.land/x/alosaur/src/types/request-method",
  ],
  function (exports_121, context_121) {
    "use strict";
    var mod_ts_16, request_method_ts_4;
    var __moduleName = context_121 && context_121.id;
    /**
     * Registers an action to be executed when POST request comes on a given route.
     * Must be applied on a controller action.
     */
    function Put(route) {
      return function (object, methodName) {
        mod_ts_16.getMetadataArgsStorage().actions.push({
          type: request_method_ts_4.RequestMethod.Put,
          object: object,
          target: object.constructor,
          method: methodName,
          route: route,
        });
      };
    }
    exports_121("Put", Put);
    return {
      setters: [
        function (mod_ts_16_1) {
          mod_ts_16 = mod_ts_16_1;
        },
        function (request_method_ts_4_1) {
          request_method_ts_4 = request_method_ts_4_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/decorator/Delete",
  [
    "https://deno.land/x/alosaur/src/mod",
    "https://deno.land/x/alosaur/src/types/request-method",
  ],
  function (exports_122, context_122) {
    "use strict";
    var mod_ts_17, request_method_ts_5;
    var __moduleName = context_122 && context_122.id;
    /**
     * Registers an action to be executed when Delete request comes on a given route.
     * Must be applied on a controller action.
     */
    function Delete(route) {
      return function (object, methodName) {
        mod_ts_17.getMetadataArgsStorage().actions.push({
          type: request_method_ts_5.RequestMethod.Delete,
          object: object,
          target: object.constructor,
          method: methodName,
          route: route,
        });
      };
    }
    exports_122("Delete", Delete);
    return {
      setters: [
        function (mod_ts_17_1) {
          mod_ts_17 = mod_ts_17_1;
        },
        function (request_method_ts_5_1) {
          request_method_ts_5 = request_method_ts_5_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/decorator/Param",
  [
    "https://deno.land/x/alosaur/src/mod",
    "https://deno.land/x/alosaur/src/types/param",
  ],
  function (exports_123, context_123) {
    "use strict";
    var mod_ts_18, param_ts_1;
    var __moduleName = context_123 && context_123.id;
    /**
     * Injects a request's route parameter value to the controller action parameter.
     * Must be applied on a controller action parameter.
     */
    function Param(name) {
      return function (object, methodName, index) {
        mod_ts_18.getMetadataArgsStorage().params.push({
          type: param_ts_1.ParamType.RouteParam,
          target: object.constructor,
          method: methodName,
          index: index,
          name: name,
        });
      };
    }
    exports_123("Param", Param);
    return {
      setters: [
        function (mod_ts_18_1) {
          mod_ts_18 = mod_ts_18_1;
        },
        function (param_ts_1_1) {
          param_ts_1 = param_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/decorator/QueryParam",
  [
    "https://deno.land/x/alosaur/src/mod",
    "https://deno.land/x/alosaur/src/types/param",
  ],
  function (exports_124, context_124) {
    "use strict";
    var mod_ts_19, param_ts_2;
    var __moduleName = context_124 && context_124.id;
    /**
     * Injects a request's query parameter value to the controller action parameter.
     * Must be applied on a controller action parameter.
     */
    function QueryParam(name) {
      return function (object, methodName, index) {
        mod_ts_19.getMetadataArgsStorage().params.push({
          type: param_ts_2.ParamType.Query,
          target: object.constructor,
          method: methodName,
          index: index,
          name: name,
        });
      };
    }
    exports_124("QueryParam", QueryParam);
    return {
      setters: [
        function (mod_ts_19_1) {
          mod_ts_19 = mod_ts_19_1;
        },
        function (param_ts_2_1) {
          param_ts_2 = param_ts_2_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/decorator/Req",
  [
    "https://deno.land/x/alosaur/src/mod",
    "https://deno.land/x/alosaur/src/types/param",
  ],
  function (exports_125, context_125) {
    "use strict";
    var mod_ts_20, param_ts_3;
    var __moduleName = context_125 && context_125.id;
    /**
     * Injects a Request object to the controller action parameter.
     * Must be applied on a controller action parameter.
     */
    function Req() {
      return function (object, methodName, index) {
        mod_ts_20.getMetadataArgsStorage().params.push({
          type: param_ts_3.ParamType.Request,
          target: object.constructor,
          method: methodName,
          index: index,
        });
      };
    }
    exports_125("Req", Req);
    return {
      setters: [
        function (mod_ts_20_1) {
          mod_ts_20 = mod_ts_20_1;
        },
        function (param_ts_3_1) {
          param_ts_3 = param_ts_3_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/decorator/Res",
  [
    "https://deno.land/x/alosaur/src/mod",
    "https://deno.land/x/alosaur/src/types/param",
  ],
  function (exports_126, context_126) {
    "use strict";
    var mod_ts_21, param_ts_4;
    var __moduleName = context_126 && context_126.id;
    /**
     * Injects a Response object to the controller action parameter.
     * Must be applied on a controller action parameter.
     */
    function Res() {
      return function (object, methodName, index) {
        mod_ts_21.getMetadataArgsStorage().params.push({
          type: param_ts_4.ParamType.Response,
          target: object.constructor,
          method: methodName,
          index: index,
        });
      };
    }
    exports_126("Res", Res);
    return {
      setters: [
        function (mod_ts_21_1) {
          mod_ts_21 = mod_ts_21_1;
        },
        function (param_ts_4_1) {
          param_ts_4 = param_ts_4_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/decorator/Cookie",
  [
    "https://deno.land/x/alosaur/src/mod",
    "https://deno.land/x/alosaur/src/types/param",
  ],
  function (exports_127, context_127) {
    "use strict";
    var mod_ts_22, param_ts_5;
    var __moduleName = context_127 && context_127.id;
    /**
     * Injects a request's query parameter value to the controller action parameter.
     * Must be applied on a controller action parameter.
     */
    function Cookie(name) {
      return function (object, methodName, index) {
        mod_ts_22.getMetadataArgsStorage().params.push({
          type: param_ts_5.ParamType.Cookie,
          target: object.constructor,
          method: methodName,
          index: index,
          name: name,
        });
      };
    }
    exports_127("Cookie", Cookie);
    return {
      setters: [
        function (mod_ts_22_1) {
          mod_ts_22 = mod_ts_22_1;
        },
        function (param_ts_5_1) {
          param_ts_5 = param_ts_5_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/decorator/Body",
  [
    "https://deno.land/x/alosaur/src/mod",
    "https://deno.land/x/alosaur/src/types/param",
  ],
  function (exports_128, context_128) {
    "use strict";
    var mod_ts_23, param_ts_6;
    var __moduleName = context_128 && context_128.id;
    /**
     * Injects a Body object to the controller action parameter.
     * Must be applied on a controller action parameter.
     * transform - may by transform function or
     */
    function Body(transform) {
      return function (object, methodName, index) {
        mod_ts_23.getMetadataArgsStorage().params.push({
          type: param_ts_6.ParamType.Body,
          target: object.constructor,
          method: methodName,
          index: index,
          transform,
        });
      };
    }
    exports_128("Body", Body);
    return {
      setters: [
        function (mod_ts_23_1) {
          mod_ts_23 = mod_ts_23_1;
        },
        function (param_ts_6_1) {
          param_ts_6 = param_ts_6_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/decorator/UseHook",
  [
    "https://deno.land/x/alosaur/src/mod",
    "https://deno.land/x/alosaur/src/types/business",
    "https://deno.land/x/alosaur/src/injection/index",
  ],
  function (exports_129, context_129) {
    "use strict";
    var mod_ts_24, business_ts_1, index_ts_7;
    var __moduleName = context_129 && context_129.id;
    /**
     * Registers an controller or action hook.
     */
    function UseHook(hook, payload) {
      return function (object, methodName) {
        mod_ts_24.getMetadataArgsStorage().hooks.push({
          type: methodName
            ? business_ts_1.BusinessType.Action
            : business_ts_1.BusinessType.Controller,
          object,
          target: object.constructor,
          method: methodName,
          instance: index_ts_7.container.resolve(hook),
          payload,
        });
      };
    }
    exports_129("UseHook", UseHook);
    return {
      setters: [
        function (mod_ts_24_1) {
          mod_ts_24 = mod_ts_24_1;
        },
        function (business_ts_1_1) {
          business_ts_1 = business_ts_1_1;
        },
        function (index_ts_7_1) {
          index_ts_7 = index_ts_7_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/decorator/Middleware",
  ["https://deno.land/x/alosaur/src/mod"],
  function (exports_130, context_130) {
    "use strict";
    var mod_ts_25;
    var __moduleName = context_130 && context_130.id;
    function Middleware(route) {
      return function (middleware) {
        mod_ts_25.getMetadataArgsStorage().middlewares.push({
          type: "middleware",
          target: new middleware(),
          route: route,
        });
      };
    }
    exports_130("Middleware", Middleware);
    return {
      setters: [
        function (mod_ts_25_1) {
          mod_ts_25 = mod_ts_25_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/decorator/mod",
  [
    "https://deno.land/x/alosaur/src/decorator/Area",
    "https://deno.land/x/alosaur/src/decorator/Controller",
    "https://deno.land/x/alosaur/src/decorator/Get",
    "https://deno.land/x/alosaur/src/decorator/Post",
    "https://deno.land/x/alosaur/src/decorator/Patch",
    "https://deno.land/x/alosaur/src/decorator/Put",
    "https://deno.land/x/alosaur/src/decorator/Delete",
    "https://deno.land/x/alosaur/src/decorator/Param",
    "https://deno.land/x/alosaur/src/decorator/QueryParam",
    "https://deno.land/x/alosaur/src/decorator/Req",
    "https://deno.land/x/alosaur/src/decorator/Res",
    "https://deno.land/x/alosaur/src/decorator/Cookie",
    "https://deno.land/x/alosaur/src/decorator/Body",
    "https://deno.land/x/alosaur/src/decorator/UseHook",
    "https://deno.land/x/alosaur/src/decorator/Middleware",
  ],
  function (exports_131, context_131) {
    "use strict";
    var __moduleName = context_131 && context_131.id;
    function exportStar_6(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default") exports[n] = m[n];
      }
      exports_131(exports);
    }
    return {
      setters: [
        function (Area_ts_1_1) {
          exportStar_6(Area_ts_1_1);
        },
        function (Controller_ts_1_1) {
          exportStar_6(Controller_ts_1_1);
        },
        function (Get_ts_1_1) {
          exportStar_6(Get_ts_1_1);
        },
        function (Post_ts_1_1) {
          exportStar_6(Post_ts_1_1);
        },
        function (Patch_ts_1_1) {
          exportStar_6(Patch_ts_1_1);
        },
        function (Put_ts_1_1) {
          exportStar_6(Put_ts_1_1);
        },
        function (Delete_ts_1_1) {
          exportStar_6(Delete_ts_1_1);
        },
        function (Param_ts_1_1) {
          exportStar_6(Param_ts_1_1);
        },
        function (QueryParam_ts_1_1) {
          exportStar_6(QueryParam_ts_1_1);
        },
        function (Req_ts_1_1) {
          exportStar_6(Req_ts_1_1);
        },
        function (Res_ts_1_1) {
          exportStar_6(Res_ts_1_1);
        },
        function (Cookie_ts_1_1) {
          exportStar_6(Cookie_ts_1_1);
        },
        function (Body_ts_1_1) {
          exportStar_6(Body_ts_1_1);
        },
        function (UseHook_ts_1_1) {
          exportStar_6(UseHook_ts_1_1);
        },
        function (Middleware_ts_1_1) {
          exportStar_6(Middleware_ts_1_1);
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/middlewares/spa-builder",
  [
    "https://deno.land/x/alosaur/src/static/send",
    "https://deno.land/x/alosaur/src/utils/get-static-file",
  ],
  function (exports_132, context_132) {
    "use strict";
    var send_ts_2, get_static_file_ts_2, SpaBuilder;
    var __moduleName = context_132 && context_132.id;
    function hasUrlExtension(url) {
      const fragments = url.split("/");
      return fragments[fragments.length - 1].includes(".");
    }
    return {
      setters: [
        function (send_ts_2_1) {
          send_ts_2 = send_ts_2_1;
        },
        function (get_static_file_ts_2_1) {
          get_static_file_ts_2 = get_static_file_ts_2_1;
        },
      ],
      execute: function () {
        SpaBuilder = class SpaBuilder {
          constructor(staticConfig) {
            this.staticConfig = staticConfig;
          }
          onPreRequest(context) {
            return new Promise(async (resolve, reject) => {
              if (
                await get_static_file_ts_2.getStaticFile(
                  context,
                  this.staticConfig,
                )
              ) {
                context.response.setImmediately();
              }
              resolve();
            });
          }
          onPostRequest(context) {
            return new Promise(async (resolve, reject) => {
              if (
                context.response.result === undefined &&
                this.staticConfig.index && !hasUrlExtension(context.request.url)
              ) {
                if (
                  await send_ts_2.send(
                    {
                      request: context.request.serverRequest,
                      response: context.response,
                    },
                    this.staticConfig.index,
                    this.staticConfig,
                  )
                ) {
                  context.response.setImmediately();
                }
              }
              resolve();
            });
          }
        };
        exports_132("SpaBuilder", SpaBuilder);
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/middlewares/mod",
  [
    "https://deno.land/x/alosaur/src/middlewares/cors-builder",
    "https://deno.land/x/alosaur/src/middlewares/spa-builder",
  ],
  function (exports_133, context_133) {
    "use strict";
    var __moduleName = context_133 && context_133.id;
    function exportStar_7(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default") exports[n] = m[n];
      }
      exports_133(exports);
    }
    return {
      setters: [
        function (cors_builder_ts_1_1) {
          exportStar_7(cors_builder_ts_1_1);
        },
        function (spa_builder_ts_1_1) {
          exportStar_7(spa_builder_ts_1_1);
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/src/models/mod",
  [
    "https://deno.land/x/alosaur/src/models/context",
    "https://deno.land/x/alosaur/src/models/hook",
    "https://deno.land/x/alosaur/src/models/request",
    "https://deno.land/x/alosaur/src/models/response",
    "https://deno.land/x/alosaur/src/models/static-config",
    "https://deno.land/x/alosaur/src/models/transform-config",
    "https://deno.land/x/alosaur/src/models/view-render-config",
    "https://deno.land/x/alosaur/src/models/middleware-target",
    "https://deno.land/x/alosaur/src/models/app-settings",
  ],
  function (exports_134, context_134) {
    "use strict";
    var __moduleName = context_134 && context_134.id;
    function exportStar_8(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default") exports[n] = m[n];
      }
      exports_134(exports);
    }
    return {
      setters: [
        function (context_ts_2_1) {
          exportStar_8(context_ts_2_1);
        },
        function (hook_ts_1_1) {
          exportStar_8(hook_ts_1_1);
        },
        function (request_ts_2_1) {
          exportStar_8(request_ts_2_1);
        },
        function (response_ts_2_1) {
          exportStar_8(response_ts_2_1);
        },
        function (static_config_ts_1_1) {
          exportStar_8(static_config_ts_1_1);
        },
        function (transform_config_ts_1_1) {
          exportStar_8(transform_config_ts_1_1);
        },
        function (view_render_config_ts_1_1) {
          exportStar_8(view_render_config_ts_1_1);
        },
        function (middleware_target_ts_1_1) {
          exportStar_8(middleware_target_ts_1_1);
        },
        function (app_settings_ts_1_1) {
          exportStar_8(app_settings_ts_1_1);
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/alosaur/mod",
  [
    "https://deno.land/x/alosaur/src/http-error/mod",
    "https://deno.land/x/alosaur/src/renderer/mod",
    "https://deno.land/x/alosaur/src/decorator/mod",
    "https://deno.land/x/alosaur/src/middlewares/mod",
    "https://deno.land/x/alosaur/src/injection/index",
    "https://deno.land/x/alosaur/src/models/mod",
    "https://deno.land/x/alosaur/src/mod",
  ],
  function (exports_135, context_135) {
    "use strict";
    var __moduleName = context_135 && context_135.id;
    function exportStar_9(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default") exports[n] = m[n];
      }
      exports_135(exports);
    }
    return {
      setters: [
        function (mod_ts_26_1) {
          exportStar_9(mod_ts_26_1);
        },
        function (mod_ts_27_1) {
          exportStar_9(mod_ts_27_1);
        },
        function (mod_ts_28_1) {
          exportStar_9(mod_ts_28_1);
        },
        function (mod_ts_29_1) {
          exportStar_9(mod_ts_29_1);
        },
        function (index_ts_8_1) {
          exportStar_9(index_ts_8_1);
        },
        function (mod_ts_30_1) {
          exportStar_9(mod_ts_30_1);
        },
        function (mod_ts_31_1) {
          exportStar_9(mod_ts_31_1);
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/fs/empty_dir",
  ["https://deno.land/std@0.56.0/path/mod"],
  function (exports_136, context_136) {
    "use strict";
    var mod_ts_32, readDir, readDirSync, mkdir, mkdirSync, remove, removeSync;
    var __moduleName = context_136 && context_136.id;
    /**
     * Ensures that a directory is empty.
     * Deletes directory contents if the directory is not empty.
     * If the directory does not exist, it is created.
     * The directory itself is not deleted.
     * Requires the `--allow-read` and `--allow-write` flag.
     */
    async function emptyDir(dir) {
      try {
        const items = [];
        for await (const dirEntry of readDir(dir)) {
          items.push(dirEntry);
        }
        while (items.length) {
          const item = items.shift();
          if (item && item.name) {
            const filepath = mod_ts_32.join(dir, item.name);
            await remove(filepath, { recursive: true });
          }
        }
      } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
          throw err;
        }
        // if not exist. then create it
        await mkdir(dir, { recursive: true });
      }
    }
    exports_136("emptyDir", emptyDir);
    /**
     * Ensures that a directory is empty.
     * Deletes directory contents if the directory is not empty.
     * If the directory does not exist, it is created.
     * The directory itself is not deleted.
     * Requires the `--allow-read` and `--allow-write` flag.
     */
    function emptyDirSync(dir) {
      try {
        const items = [...readDirSync(dir)];
        // If the directory exists, remove all entries inside it.
        while (items.length) {
          const item = items.shift();
          if (item && item.name) {
            const filepath = mod_ts_32.join(dir, item.name);
            removeSync(filepath, { recursive: true });
          }
        }
      } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
          throw err;
        }
        // if not exist. then create it
        mkdirSync(dir, { recursive: true });
        return;
      }
    }
    exports_136("emptyDirSync", emptyDirSync);
    return {
      setters: [
        function (mod_ts_32_1) {
          mod_ts_32 = mod_ts_32_1;
        },
      ],
      execute: function () {
        readDir = Deno.readDir,
          readDirSync = Deno.readDirSync,
          mkdir = Deno.mkdir,
          mkdirSync = Deno.mkdirSync,
          remove = Deno.remove,
          removeSync = Deno.removeSync;
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/fs/_util",
  ["https://deno.land/std@0.56.0/path/mod"],
  function (exports_137, context_137) {
    "use strict";
    var path;
    var __moduleName = context_137 && context_137.id;
    /**
     * Test whether or not `dest` is a sub-directory of `src`
     * @param src src file path
     * @param dest dest file path
     * @param sep path separator
     */
    function isSubdir(src, dest, sep = path.sep) {
      if (src === dest) {
        return false;
      }
      const srcArray = src.split(sep);
      const destArray = dest.split(sep);
      return srcArray.every((current, i) => destArray[i] === current);
    }
    exports_137("isSubdir", isSubdir);
    /**
     * Get a human readable file type string.
     *
     * @param fileInfo A FileInfo describes a file and is returned by `stat`,
     *                 `lstat`
     */
    function getFileInfoType(fileInfo) {
      return fileInfo.isFile
        ? "file"
        : fileInfo.isDirectory
        ? "dir"
        : fileInfo.isSymlink
        ? "symlink"
        : undefined;
    }
    exports_137("getFileInfoType", getFileInfoType);
    return {
      setters: [
        function (path_2) {
          path = path_2;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/fs/ensure_dir",
  ["https://deno.land/std@0.56.0/fs/_util"],
  function (exports_138, context_138) {
    "use strict";
    var _util_ts_3, lstat, lstatSync, mkdir, mkdirSync;
    var __moduleName = context_138 && context_138.id;
    /**
     * Ensures that the directory exists.
     * If the directory structure does not exist, it is created. Like mkdir -p.
     * Requires the `--allow-read` and `--allow-write` flag.
     */
    async function ensureDir(dir) {
      try {
        const fileInfo = await lstat(dir);
        if (!fileInfo.isDirectory) {
          throw new Error(
            `Ensure path exists, expected 'dir', got '${
              _util_ts_3.getFileInfoType(fileInfo)
            }'`,
          );
        }
      } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
          // if dir not exists. then create it.
          await mkdir(dir, { recursive: true });
          return;
        }
        throw err;
      }
    }
    exports_138("ensureDir", ensureDir);
    /**
     * Ensures that the directory exists.
     * If the directory structure does not exist, it is created. Like mkdir -p.
     * Requires the `--allow-read` and `--allow-write` flag.
     */
    function ensureDirSync(dir) {
      try {
        const fileInfo = lstatSync(dir);
        if (!fileInfo.isDirectory) {
          throw new Error(
            `Ensure path exists, expected 'dir', got '${
              _util_ts_3.getFileInfoType(fileInfo)
            }'`,
          );
        }
      } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
          // if dir not exists. then create it.
          mkdirSync(dir, { recursive: true });
          return;
        }
        throw err;
      }
    }
    exports_138("ensureDirSync", ensureDirSync);
    return {
      setters: [
        function (_util_ts_3_1) {
          _util_ts_3 = _util_ts_3_1;
        },
      ],
      execute: function () {
        lstat = Deno.lstat,
          lstatSync = Deno.lstatSync,
          mkdir = Deno.mkdir,
          mkdirSync = Deno.mkdirSync;
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/fs/ensure_file",
  [
    "https://deno.land/std@0.56.0/path/mod",
    "https://deno.land/std@0.56.0/fs/ensure_dir",
    "https://deno.land/std@0.56.0/fs/_util",
  ],
  function (exports_139, context_139) {
    "use strict";
    var path,
      ensure_dir_ts_1,
      _util_ts_4,
      lstat,
      lstatSync,
      writeFile,
      writeFileSync;
    var __moduleName = context_139 && context_139.id;
    /**
     * Ensures that the file exists.
     * If the file that is requested to be created is in directories that do not
     * exist.
     * these directories are created. If the file already exists,
     * it is NOTMODIFIED.
     * Requires the `--allow-read` and `--allow-write` flag.
     */
    async function ensureFile(filePath) {
      try {
        // if file exists
        const stat = await lstat(filePath);
        if (!stat.isFile) {
          throw new Error(
            `Ensure path exists, expected 'file', got '${
              _util_ts_4.getFileInfoType(stat)
            }'`,
          );
        }
      } catch (err) {
        // if file not exists
        if (err instanceof Deno.errors.NotFound) {
          // ensure dir exists
          await ensure_dir_ts_1.ensureDir(path.dirname(filePath));
          // create file
          await writeFile(filePath, new Uint8Array());
          return;
        }
        throw err;
      }
    }
    exports_139("ensureFile", ensureFile);
    /**
     * Ensures that the file exists.
     * If the file that is requested to be created is in directories that do not
     * exist,
     * these directories are created. If the file already exists,
     * it is NOT MODIFIED.
     * Requires the `--allow-read` and `--allow-write` flag.
     */
    function ensureFileSync(filePath) {
      try {
        // if file exists
        const stat = lstatSync(filePath);
        if (!stat.isFile) {
          throw new Error(
            `Ensure path exists, expected 'file', got '${
              _util_ts_4.getFileInfoType(stat)
            }'`,
          );
        }
      } catch (err) {
        // if file not exists
        if (err instanceof Deno.errors.NotFound) {
          // ensure dir exists
          ensure_dir_ts_1.ensureDirSync(path.dirname(filePath));
          // create file
          writeFileSync(filePath, new Uint8Array());
          return;
        }
        throw err;
      }
    }
    exports_139("ensureFileSync", ensureFileSync);
    return {
      setters: [
        function (path_3) {
          path = path_3;
        },
        function (ensure_dir_ts_1_1) {
          ensure_dir_ts_1 = ensure_dir_ts_1_1;
        },
        function (_util_ts_4_1) {
          _util_ts_4 = _util_ts_4_1;
        },
      ],
      execute: function () {
        lstat = Deno.lstat,
          lstatSync = Deno.lstatSync,
          writeFile = Deno.writeFile,
          writeFileSync = Deno.writeFileSync;
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/fs/ensure_link",
  [
    "https://deno.land/std@0.56.0/path/mod",
    "https://deno.land/std@0.56.0/fs/ensure_dir",
    "https://deno.land/std@0.56.0/fs/exists",
    "https://deno.land/std@0.56.0/fs/_util",
  ],
  function (exports_140, context_140) {
    "use strict";
    var path, ensure_dir_ts_2, exists_ts_2, _util_ts_5;
    var __moduleName = context_140 && context_140.id;
    /**
     * Ensures that the hard link exists.
     * If the directory structure does not exist, it is created.
     *
     * @param src the source file path. Directory hard links are not allowed.
     * @param dest the destination link path
     */
    async function ensureLink(src, dest) {
      if (await exists_ts_2.exists(dest)) {
        const destStatInfo = await Deno.lstat(dest);
        const destFilePathType = _util_ts_5.getFileInfoType(destStatInfo);
        if (destFilePathType !== "file") {
          throw new Error(
            `Ensure path exists, expected 'file', got '${destFilePathType}'`,
          );
        }
        return;
      }
      await ensure_dir_ts_2.ensureDir(path.dirname(dest));
      await Deno.link(src, dest);
    }
    exports_140("ensureLink", ensureLink);
    /**
     * Ensures that the hard link exists.
     * If the directory structure does not exist, it is created.
     *
     * @param src the source file path. Directory hard links are not allowed.
     * @param dest the destination link path
     */
    function ensureLinkSync(src, dest) {
      if (exists_ts_2.existsSync(dest)) {
        const destStatInfo = Deno.lstatSync(dest);
        const destFilePathType = _util_ts_5.getFileInfoType(destStatInfo);
        if (destFilePathType !== "file") {
          throw new Error(
            `Ensure path exists, expected 'file', got '${destFilePathType}'`,
          );
        }
        return;
      }
      ensure_dir_ts_2.ensureDirSync(path.dirname(dest));
      Deno.linkSync(src, dest);
    }
    exports_140("ensureLinkSync", ensureLinkSync);
    return {
      setters: [
        function (path_4) {
          path = path_4;
        },
        function (ensure_dir_ts_2_1) {
          ensure_dir_ts_2 = ensure_dir_ts_2_1;
        },
        function (exists_ts_2_1) {
          exists_ts_2 = exists_ts_2_1;
        },
        function (_util_ts_5_1) {
          _util_ts_5 = _util_ts_5_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/fs/ensure_symlink",
  [
    "https://deno.land/std@0.56.0/path/mod",
    "https://deno.land/std@0.56.0/fs/ensure_dir",
    "https://deno.land/std@0.56.0/fs/exists",
    "https://deno.land/std@0.56.0/fs/_util",
  ],
  function (exports_141, context_141) {
    "use strict";
    var path, ensure_dir_ts_3, exists_ts_3, _util_ts_6;
    var __moduleName = context_141 && context_141.id;
    /**
     * Ensures that the link exists.
     * If the directory structure does not exist, it is created.
     *
     * @param src the source file path
     * @param dest the destination link path
     */
    async function ensureSymlink(src, dest) {
      const srcStatInfo = await Deno.lstat(src);
      const srcFilePathType = _util_ts_6.getFileInfoType(srcStatInfo);
      if (await exists_ts_3.exists(dest)) {
        const destStatInfo = await Deno.lstat(dest);
        const destFilePathType = _util_ts_6.getFileInfoType(destStatInfo);
        if (destFilePathType !== "symlink") {
          throw new Error(
            `Ensure path exists, expected 'symlink', got '${destFilePathType}'`,
          );
        }
        return;
      }
      await ensure_dir_ts_3.ensureDir(path.dirname(dest));
      ensure_dir_ts_3.ensureDirSync(path.dirname(dest));
      if (Deno.build.os === "windows") {
        await Deno.symlink(src, dest, {
          type: srcFilePathType === "dir" ? "dir" : "file",
        });
      } else {
        await Deno.symlink(src, dest);
      }
    }
    exports_141("ensureSymlink", ensureSymlink);
    /**
     * Ensures that the link exists.
     * If the directory structure does not exist, it is created.
     *
     * @param src the source file path
     * @param dest the destination link path
     */
    function ensureSymlinkSync(src, dest) {
      const srcStatInfo = Deno.lstatSync(src);
      const srcFilePathType = _util_ts_6.getFileInfoType(srcStatInfo);
      if (exists_ts_3.existsSync(dest)) {
        const destStatInfo = Deno.lstatSync(dest);
        const destFilePathType = _util_ts_6.getFileInfoType(destStatInfo);
        if (destFilePathType !== "symlink") {
          throw new Error(
            `Ensure path exists, expected 'symlink', got '${destFilePathType}'`,
          );
        }
        return;
      }
      ensure_dir_ts_3.ensureDirSync(path.dirname(dest));
      if (Deno.build.os === "windows") {
        Deno.symlinkSync(src, dest, {
          type: srcFilePathType === "dir" ? "dir" : "file",
        });
      } else {
        Deno.symlinkSync(src, dest);
      }
    }
    exports_141("ensureSymlinkSync", ensureSymlinkSync);
    return {
      setters: [
        function (path_5) {
          path = path_5;
        },
        function (ensure_dir_ts_3_1) {
          ensure_dir_ts_3 = ensure_dir_ts_3_1;
        },
        function (exists_ts_3_1) {
          exists_ts_3 = exists_ts_3_1;
        },
        function (_util_ts_6_1) {
          _util_ts_6 = _util_ts_6_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/fs/walk",
  [
    "https://deno.land/std@0.56.0/testing/asserts",
    "https://deno.land/std@0.56.0/path/mod",
  ],
  function (exports_142, context_142) {
    "use strict";
    var asserts_ts_9, mod_ts_33, readDir, readDirSync, stat, statSync;
    var __moduleName = context_142 && context_142.id;
    function createWalkEntrySync(path) {
      path = mod_ts_33.normalize(path);
      const name = mod_ts_33.basename(path);
      const info = statSync(path);
      return {
        path,
        name,
        isFile: info.isFile,
        isDirectory: info.isDirectory,
        isSymlink: info.isSymlink,
      };
    }
    exports_142("createWalkEntrySync", createWalkEntrySync);
    async function createWalkEntry(path) {
      path = mod_ts_33.normalize(path);
      const name = mod_ts_33.basename(path);
      const info = await stat(path);
      return {
        path,
        name,
        isFile: info.isFile,
        isDirectory: info.isDirectory,
        isSymlink: info.isSymlink,
      };
    }
    exports_142("createWalkEntry", createWalkEntry);
    function include(path, exts, match, skip) {
      if (exts && !exts.some((ext) => path.endsWith(ext))) {
        return false;
      }
      if (match && !match.some((pattern) => !!path.match(pattern))) {
        return false;
      }
      if (skip && skip.some((pattern) => !!path.match(pattern))) {
        return false;
      }
      return true;
    }
    /** Walks the file tree rooted at root, yielding each file or directory in the
     * tree filtered according to the given options. The files are walked in lexical
     * order, which makes the output deterministic but means that for very large
     * directories walk() can be inefficient.
     *
     * Options:
     * - maxDepth?: number = Infinity;
     * - includeFiles?: boolean = true;
     * - includeDirs?: boolean = true;
     * - followSymlinks?: boolean = false;
     * - exts?: string[];
     * - match?: RegExp[];
     * - skip?: RegExp[];
     *
     *      for await (const entry of walk(".")) {
     *        console.log(entry.path);
     *        assert(entry.isFile);
     *      };
     */
    async function* walk(
      root,
      {
        maxDepth = Infinity,
        includeFiles = true,
        includeDirs = true,
        followSymlinks = false,
        exts = undefined,
        match = undefined,
        skip = undefined,
      } = {},
    ) {
      if (maxDepth < 0) {
        return;
      }
      if (includeDirs && include(root, exts, match, skip)) {
        yield await createWalkEntry(root);
      }
      if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
        return;
      }
      for await (const entry of readDir(root)) {
        if (entry.isSymlink) {
          if (followSymlinks) {
            // TODO(ry) Re-enable followSymlinks.
            asserts_ts_9.unimplemented();
          } else {
            continue;
          }
        }
        asserts_ts_9.assert(entry.name != null);
        const path = mod_ts_33.join(root, entry.name);
        if (entry.isFile) {
          if (includeFiles && include(path, exts, match, skip)) {
            yield { path, ...entry };
          }
        } else {
          yield* walk(path, {
            maxDepth: maxDepth - 1,
            includeFiles,
            includeDirs,
            followSymlinks,
            exts,
            match,
            skip,
          });
        }
      }
    }
    exports_142("walk", walk);
    /** Same as walk() but uses synchronous ops */
    function* walkSync(
      root,
      {
        maxDepth = Infinity,
        includeFiles = true,
        includeDirs = true,
        followSymlinks = false,
        exts = undefined,
        match = undefined,
        skip = undefined,
      } = {},
    ) {
      if (maxDepth < 0) {
        return;
      }
      if (includeDirs && include(root, exts, match, skip)) {
        yield createWalkEntrySync(root);
      }
      if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
        return;
      }
      for (const entry of readDirSync(root)) {
        if (entry.isSymlink) {
          if (followSymlinks) {
            asserts_ts_9.unimplemented();
          } else {
            continue;
          }
        }
        asserts_ts_9.assert(entry.name != null);
        const path = mod_ts_33.join(root, entry.name);
        if (entry.isFile) {
          if (includeFiles && include(path, exts, match, skip)) {
            yield { path, ...entry };
          }
        } else {
          yield* walkSync(path, {
            maxDepth: maxDepth - 1,
            includeFiles,
            includeDirs,
            followSymlinks,
            exts,
            match,
            skip,
          });
        }
      }
    }
    exports_142("walkSync", walkSync);
    return {
      setters: [
        function (asserts_ts_9_1) {
          asserts_ts_9 = asserts_ts_9_1;
        },
        function (mod_ts_33_1) {
          mod_ts_33 = mod_ts_33_1;
        },
      ],
      execute: function () {
        readDir = Deno.readDir,
          readDirSync = Deno.readDirSync,
          stat = Deno.stat,
          statSync = Deno.statSync;
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/fs/expand_glob",
  [
    "https://deno.land/std@0.56.0/path/mod",
    "https://deno.land/std@0.56.0/fs/walk",
    "https://deno.land/std@0.56.0/testing/asserts",
  ],
  function (exports_143, context_143) {
    "use strict";
    var mod_ts_34, walk_ts_1, asserts_ts_10, cwd, isWindows;
    var __moduleName = context_143 && context_143.id;
    // TODO: Maybe make this public somewhere.
    function split(path) {
      const s = mod_ts_34.SEP_PATTERN.source;
      const segments = path
        .replace(new RegExp(`^${s}|${s}$`, "g"), "")
        .split(mod_ts_34.SEP_PATTERN);
      const isAbsolute_ = mod_ts_34.isAbsolute(path);
      return {
        segments,
        isAbsolute: isAbsolute_,
        hasTrailingSep: !!path.match(new RegExp(`${s}$`)),
        winRoot: isWindows && isAbsolute_ ? segments.shift() : undefined,
      };
    }
    function throwUnlessNotFound(error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
    }
    function comparePath(a, b) {
      if (a.path < b.path) {
        return -1;
      }
      if (a.path > b.path) {
        return 1;
      }
      return 0;
    }
    /**
     * Expand the glob string from the specified `root` directory and yield each
     * result as a `WalkEntry` object.
     */
    async function* expandGlob(
      glob,
      {
        root = cwd(),
        exclude = [],
        includeDirs = true,
        extended = false,
        globstar = false,
      } = {},
    ) {
      const globOptions = { extended, globstar };
      const absRoot = mod_ts_34.isAbsolute(root) ? mod_ts_34.normalize(root)
      : mod_ts_34.joinGlobs([cwd(), root], globOptions);
      const resolveFromRoot = (path) =>
        mod_ts_34.isAbsolute(path)
          ? mod_ts_34.normalize(path)
          : mod_ts_34.joinGlobs([absRoot, path], globOptions);
      const excludePatterns = exclude
        .map(resolveFromRoot)
        .map((s) => mod_ts_34.globToRegExp(s, globOptions));
      const shouldInclude = (path) =>
        !excludePatterns.some((p) => !!path.match(p));
      const { segments, hasTrailingSep, winRoot } = split(
        resolveFromRoot(glob),
      );
      let fixedRoot = winRoot != undefined ? winRoot : "/";
      while (segments.length > 0 && !mod_ts_34.isGlob(segments[0])) {
        const seg = segments.shift();
        asserts_ts_10.assert(seg != null);
        fixedRoot = mod_ts_34.joinGlobs([fixedRoot, seg], globOptions);
      }
      let fixedRootInfo;
      try {
        fixedRootInfo = await walk_ts_1.createWalkEntry(fixedRoot);
      } catch (error) {
        return throwUnlessNotFound(error);
      }
      async function* advanceMatch(walkInfo, globSegment) {
        if (!walkInfo.isDirectory) {
          return;
        } else if (globSegment == "..") {
          const parentPath = mod_ts_34.joinGlobs(
            [walkInfo.path, ".."],
            globOptions,
          );
          try {
            if (shouldInclude(parentPath)) {
              return yield await walk_ts_1.createWalkEntry(parentPath);
            }
          } catch (error) {
            throwUnlessNotFound(error);
          }
          return;
        } else if (globSegment == "**") {
          return yield* walk_ts_1.walk(walkInfo.path, {
            includeFiles: false,
            skip: excludePatterns,
          });
        }
        yield* walk_ts_1.walk(walkInfo.path, {
          maxDepth: 1,
          match: [
            mod_ts_34.globToRegExp(
              mod_ts_34.joinGlobs([walkInfo.path, globSegment], globOptions),
              globOptions,
            ),
          ],
          skip: excludePatterns,
        });
      }
      let currentMatches = [fixedRootInfo];
      for (const segment of segments) {
        // Advancing the list of current matches may introduce duplicates, so we
        // pass everything through this Map.
        const nextMatchMap = new Map();
        for (const currentMatch of currentMatches) {
          for await (const nextMatch of advanceMatch(currentMatch, segment)) {
            nextMatchMap.set(nextMatch.path, nextMatch);
          }
        }
        currentMatches = [...nextMatchMap.values()].sort(comparePath);
      }
      if (hasTrailingSep) {
        currentMatches = currentMatches.filter((entry) => entry.isDirectory);
      }
      if (!includeDirs) {
        currentMatches = currentMatches.filter((entry) => !entry.isDirectory);
      }
      yield* currentMatches;
    }
    exports_143("expandGlob", expandGlob);
    /** Synchronous version of `expandGlob()`. */
    function* expandGlobSync(
      glob,
      {
        root = cwd(),
        exclude = [],
        includeDirs = true,
        extended = false,
        globstar = false,
      } = {},
    ) {
      const globOptions = { extended, globstar };
      const absRoot = mod_ts_34.isAbsolute(root) ? mod_ts_34.normalize(root)
      : mod_ts_34.joinGlobs([cwd(), root], globOptions);
      const resolveFromRoot = (path) =>
        mod_ts_34.isAbsolute(path) ? mod_ts_34.normalize(path)
        : mod_ts_34.joinGlobs([absRoot, path], globOptions);
      const excludePatterns = exclude
        .map(resolveFromRoot)
        .map((s) => mod_ts_34.globToRegExp(s, globOptions));
      const shouldInclude = (path) =>
        !excludePatterns.some((p) => !!path.match(p));
      const { segments, hasTrailingSep, winRoot } = split(
        resolveFromRoot(glob),
      );
      let fixedRoot = winRoot != undefined ? winRoot : "/";
      while (segments.length > 0 && !mod_ts_34.isGlob(segments[0])) {
        const seg = segments.shift();
        asserts_ts_10.assert(seg != null);
        fixedRoot = mod_ts_34.joinGlobs([fixedRoot, seg], globOptions);
      }
      let fixedRootInfo;
      try {
        fixedRootInfo = walk_ts_1.createWalkEntrySync(fixedRoot);
      } catch (error) {
        return throwUnlessNotFound(error);
      }
      function* advanceMatch(walkInfo, globSegment) {
        if (!walkInfo.isDirectory) {
          return;
        } else if (globSegment == "..") {
          const parentPath = mod_ts_34.joinGlobs(
            [walkInfo.path, ".."],
            globOptions,
          );
          try {
            if (shouldInclude(parentPath)) {
              return yield walk_ts_1.createWalkEntrySync(parentPath);
            }
          } catch (error) {
            throwUnlessNotFound(error);
          }
          return;
        } else if (globSegment == "**") {
          return yield* walk_ts_1.walkSync(walkInfo.path, {
            includeFiles: false,
            skip: excludePatterns,
          });
        }
        yield* walk_ts_1.walkSync(walkInfo.path, {
          maxDepth: 1,
          match: [
            mod_ts_34.globToRegExp(
              mod_ts_34.joinGlobs([walkInfo.path, globSegment], globOptions),
              globOptions,
            ),
          ],
          skip: excludePatterns,
        });
      }
      let currentMatches = [fixedRootInfo];
      for (const segment of segments) {
        // Advancing the list of current matches may introduce duplicates, so we
        // pass everything through this Map.
        const nextMatchMap = new Map();
        for (const currentMatch of currentMatches) {
          for (const nextMatch of advanceMatch(currentMatch, segment)) {
            nextMatchMap.set(nextMatch.path, nextMatch);
          }
        }
        currentMatches = [...nextMatchMap.values()].sort(comparePath);
      }
      if (hasTrailingSep) {
        currentMatches = currentMatches.filter((entry) => entry.isDirectory);
      }
      if (!includeDirs) {
        currentMatches = currentMatches.filter((entry) => !entry.isDirectory);
      }
      yield* currentMatches;
    }
    exports_143("expandGlobSync", expandGlobSync);
    return {
      setters: [
        function (mod_ts_34_1) {
          mod_ts_34 = mod_ts_34_1;
        },
        function (walk_ts_1_1) {
          walk_ts_1 = walk_ts_1_1;
        },
        function (asserts_ts_10_1) {
          asserts_ts_10 = asserts_ts_10_1;
        },
      ],
      execute: function () {
        cwd = Deno.cwd;
        isWindows = Deno.build.os == "windows";
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/fs/move",
  [
    "https://deno.land/std@0.56.0/fs/exists",
    "https://deno.land/std@0.56.0/fs/_util",
  ],
  function (exports_144, context_144) {
    "use strict";
    var exists_ts_4, _util_ts_7;
    var __moduleName = context_144 && context_144.id;
    /** Moves a file or directory */
    async function move(src, dest, { overwrite = false } = {}) {
      const srcStat = await Deno.stat(src);
      if (srcStat.isDirectory && _util_ts_7.isSubdir(src, dest)) {
        throw new Error(
          `Cannot move '${src}' to a subdirectory of itself, '${dest}'.`,
        );
      }
      if (overwrite) {
        if (await exists_ts_4.exists(dest)) {
          await Deno.remove(dest, { recursive: true });
        }
        await Deno.rename(src, dest);
      } else {
        if (await exists_ts_4.exists(dest)) {
          throw new Error("dest already exists.");
        }
        await Deno.rename(src, dest);
      }
      return;
    }
    exports_144("move", move);
    /** Moves a file or directory synchronously */
    function moveSync(src, dest, { overwrite = false } = {}) {
      const srcStat = Deno.statSync(src);
      if (srcStat.isDirectory && _util_ts_7.isSubdir(src, dest)) {
        throw new Error(
          `Cannot move '${src}' to a subdirectory of itself, '${dest}'.`,
        );
      }
      if (overwrite) {
        if (exists_ts_4.existsSync(dest)) {
          Deno.removeSync(dest, { recursive: true });
        }
        Deno.renameSync(src, dest);
      } else {
        if (exists_ts_4.existsSync(dest)) {
          throw new Error("dest already exists.");
        }
        Deno.renameSync(src, dest);
      }
    }
    exports_144("moveSync", moveSync);
    return {
      setters: [
        function (exists_ts_4_1) {
          exists_ts_4 = exists_ts_4_1;
        },
        function (_util_ts_7_1) {
          _util_ts_7 = _util_ts_7_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/fs/copy",
  [
    "https://deno.land/std@0.56.0/path/mod",
    "https://deno.land/std@0.56.0/fs/ensure_dir",
    "https://deno.land/std@0.56.0/fs/_util",
    "https://deno.land/std@0.56.0/testing/asserts",
  ],
  function (exports_145, context_145) {
    "use strict";
    var path, ensure_dir_ts_4, _util_ts_8, asserts_ts_11, isWindows;
    var __moduleName = context_145 && context_145.id;
    async function ensureValidCopy(src, dest, options, isCopyFolder = false) {
      let destStat;
      try {
        destStat = await Deno.lstat(dest);
      } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
          return;
        }
        throw err;
      }
      if (isCopyFolder && !destStat.isDirectory) {
        throw new Error(
          `Cannot overwrite non-directory '${dest}' with directory '${src}'.`,
        );
      }
      if (!options.overwrite) {
        throw new Error(`'${dest}' already exists.`);
      }
      return destStat;
    }
    function ensureValidCopySync(src, dest, options, isCopyFolder = false) {
      let destStat;
      try {
        destStat = Deno.lstatSync(dest);
      } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
          return;
        }
        throw err;
      }
      if (isCopyFolder && !destStat.isDirectory) {
        throw new Error(
          `Cannot overwrite non-directory '${dest}' with directory '${src}'.`,
        );
      }
      if (!options.overwrite) {
        throw new Error(`'${dest}' already exists.`);
      }
      return destStat;
    }
    /* copy file to dest */
    async function copyFile(src, dest, options) {
      await ensureValidCopy(src, dest, options);
      await Deno.copyFile(src, dest);
      if (options.preserveTimestamps) {
        const statInfo = await Deno.stat(src);
        asserts_ts_11.assert(
          statInfo.atime instanceof Date,
          `statInfo.atime is unavailable`,
        );
        asserts_ts_11.assert(
          statInfo.mtime instanceof Date,
          `statInfo.mtime is unavailable`,
        );
        await Deno.utime(dest, statInfo.atime, statInfo.mtime);
      }
    }
    /* copy file to dest synchronously */
    function copyFileSync(src, dest, options) {
      ensureValidCopySync(src, dest, options);
      Deno.copyFileSync(src, dest);
      if (options.preserveTimestamps) {
        const statInfo = Deno.statSync(src);
        asserts_ts_11.assert(
          statInfo.atime instanceof Date,
          `statInfo.atime is unavailable`,
        );
        asserts_ts_11.assert(
          statInfo.mtime instanceof Date,
          `statInfo.mtime is unavailable`,
        );
        Deno.utimeSync(dest, statInfo.atime, statInfo.mtime);
      }
    }
    /* copy symlink to dest */
    async function copySymLink(src, dest, options) {
      await ensureValidCopy(src, dest, options);
      const originSrcFilePath = await Deno.readLink(src);
      const type = _util_ts_8.getFileInfoType(await Deno.lstat(src));
      if (isWindows) {
        await Deno.symlink(originSrcFilePath, dest, {
          type: type === "dir" ? "dir" : "file",
        });
      } else {
        await Deno.symlink(originSrcFilePath, dest);
      }
      if (options.preserveTimestamps) {
        const statInfo = await Deno.lstat(src);
        asserts_ts_11.assert(
          statInfo.atime instanceof Date,
          `statInfo.atime is unavailable`,
        );
        asserts_ts_11.assert(
          statInfo.mtime instanceof Date,
          `statInfo.mtime is unavailable`,
        );
        await Deno.utime(dest, statInfo.atime, statInfo.mtime);
      }
    }
    /* copy symlink to dest synchronously */
    function copySymlinkSync(src, dest, options) {
      ensureValidCopySync(src, dest, options);
      const originSrcFilePath = Deno.readLinkSync(src);
      const type = _util_ts_8.getFileInfoType(Deno.lstatSync(src));
      if (isWindows) {
        Deno.symlinkSync(originSrcFilePath, dest, {
          type: type === "dir" ? "dir" : "file",
        });
      } else {
        Deno.symlinkSync(originSrcFilePath, dest);
      }
      if (options.preserveTimestamps) {
        const statInfo = Deno.lstatSync(src);
        asserts_ts_11.assert(
          statInfo.atime instanceof Date,
          `statInfo.atime is unavailable`,
        );
        asserts_ts_11.assert(
          statInfo.mtime instanceof Date,
          `statInfo.mtime is unavailable`,
        );
        Deno.utimeSync(dest, statInfo.atime, statInfo.mtime);
      }
    }
    /* copy folder from src to dest. */
    async function copyDir(src, dest, options) {
      const destStat = await ensureValidCopy(src, dest, options, true);
      if (!destStat) {
        await ensure_dir_ts_4.ensureDir(dest);
      }
      if (options.preserveTimestamps) {
        const srcStatInfo = await Deno.stat(src);
        asserts_ts_11.assert(
          srcStatInfo.atime instanceof Date,
          `statInfo.atime is unavailable`,
        );
        asserts_ts_11.assert(
          srcStatInfo.mtime instanceof Date,
          `statInfo.mtime is unavailable`,
        );
        await Deno.utime(dest, srcStatInfo.atime, srcStatInfo.mtime);
      }
      for await (const entry of Deno.readDir(src)) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, path.basename(srcPath));
        if (entry.isSymlink) {
          await copySymLink(srcPath, destPath, options);
        } else if (entry.isDirectory) {
          await copyDir(srcPath, destPath, options);
        } else if (entry.isFile) {
          await copyFile(srcPath, destPath, options);
        }
      }
    }
    /* copy folder from src to dest synchronously */
    function copyDirSync(src, dest, options) {
      const destStat = ensureValidCopySync(src, dest, options, true);
      if (!destStat) {
        ensure_dir_ts_4.ensureDirSync(dest);
      }
      if (options.preserveTimestamps) {
        const srcStatInfo = Deno.statSync(src);
        asserts_ts_11.assert(
          srcStatInfo.atime instanceof Date,
          `statInfo.atime is unavailable`,
        );
        asserts_ts_11.assert(
          srcStatInfo.mtime instanceof Date,
          `statInfo.mtime is unavailable`,
        );
        Deno.utimeSync(dest, srcStatInfo.atime, srcStatInfo.mtime);
      }
      for (const entry of Deno.readDirSync(src)) {
        asserts_ts_11.assert(entry.name != null, "file.name must be set");
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, path.basename(srcPath));
        if (entry.isSymlink) {
          copySymlinkSync(srcPath, destPath, options);
        } else if (entry.isDirectory) {
          copyDirSync(srcPath, destPath, options);
        } else if (entry.isFile) {
          copyFileSync(srcPath, destPath, options);
        }
      }
    }
    /**
     * Copy a file or directory. The directory can have contents. Like `cp -r`.
     * Requires the `--allow-read` and `--allow-write` flag.
     * @param src the file/directory path.
     *            Note that if `src` is a directory it will copy everything inside
     *            of this directory, not the entire directory itself
     * @param dest the destination path. Note that if `src` is a file, `dest` cannot
     *             be a directory
     * @param options
     */
    async function copy(src, dest, options = {}) {
      src = path.resolve(src);
      dest = path.resolve(dest);
      if (src === dest) {
        throw new Error("Source and destination cannot be the same.");
      }
      const srcStat = await Deno.lstat(src);
      if (srcStat.isDirectory && _util_ts_8.isSubdir(src, dest)) {
        throw new Error(
          `Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`,
        );
      }
      if (srcStat.isSymlink) {
        await copySymLink(src, dest, options);
      } else if (srcStat.isDirectory) {
        await copyDir(src, dest, options);
      } else if (srcStat.isFile) {
        await copyFile(src, dest, options);
      }
    }
    exports_145("copy", copy);
    /**
     * Copy a file or directory. The directory can have contents. Like `cp -r`.
     * Requires the `--allow-read` and `--allow-write` flag.
     * @param src the file/directory path.
     *            Note that if `src` is a directory it will copy everything inside
     *            of this directory, not the entire directory itself
     * @param dest the destination path. Note that if `src` is a file, `dest` cannot
     *             be a directory
     * @param options
     */
    function copySync(src, dest, options = {}) {
      src = path.resolve(src);
      dest = path.resolve(dest);
      if (src === dest) {
        throw new Error("Source and destination cannot be the same.");
      }
      const srcStat = Deno.lstatSync(src);
      if (srcStat.isDirectory && _util_ts_8.isSubdir(src, dest)) {
        throw new Error(
          `Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`,
        );
      }
      if (srcStat.isSymlink) {
        copySymlinkSync(src, dest, options);
      } else if (srcStat.isDirectory) {
        copyDirSync(src, dest, options);
      } else if (srcStat.isFile) {
        copyFileSync(src, dest, options);
      }
    }
    exports_145("copySync", copySync);
    return {
      setters: [
        function (path_6) {
          path = path_6;
        },
        function (ensure_dir_ts_4_1) {
          ensure_dir_ts_4 = ensure_dir_ts_4_1;
        },
        function (_util_ts_8_1) {
          _util_ts_8 = _util_ts_8_1;
        },
        function (asserts_ts_11_1) {
          asserts_ts_11 = asserts_ts_11_1;
        },
      ],
      execute: function () {
        isWindows = Deno.build.os === "windows";
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.56.0/fs/read_file_str",
  [],
  function (exports_146, context_146) {
    "use strict";
    var __moduleName = context_146 && context_146.id;
    /**
     * Read file synchronously and output it as a string.
     *
     * @param filename File to read
     * @param opts Read options
     */
    function readFileStrSync(filename, opts = {}) {
      const decoder = new TextDecoder(opts.encoding);
      return decoder.decode(Deno.readFileSync(filename));
    }
    exports_146("readFileStrSync", readFileStrSync);
    /**
     * Read file and output it as a string.
     *
     * @param filename File to read
     * @param opts Read options
     */
    async function readFileStr(filename, opts = {}) {
      const decoder = new TextDecoder(opts.encoding);
      return decoder.decode(await Deno.readFile(filename));
    }
    exports_146("readFileStr", readFileStr);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.56.0/fs/write_file_str",
  [],
  function (exports_147, context_147) {
    "use strict";
    var __moduleName = context_147 && context_147.id;
    /**
     * Write the string to file synchronously.
     *
     * @param filename File to write
     * @param content The content write to file
     * @returns void
     */
    function writeFileStrSync(filename, content) {
      const encoder = new TextEncoder();
      Deno.writeFileSync(filename, encoder.encode(content));
    }
    exports_147("writeFileStrSync", writeFileStrSync);
    /**
     * Write the string to file.
     *
     * @param filename File to write
     * @param content The content write to file
     * @returns Promise<void>
     */
    async function writeFileStr(filename, content) {
      const encoder = new TextEncoder();
      await Deno.writeFile(filename, encoder.encode(content));
    }
    exports_147("writeFileStr", writeFileStr);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.56.0/fs/read_json",
  [],
  function (exports_148, context_148) {
    "use strict";
    var __moduleName = context_148 && context_148.id;
    /** Reads a JSON file and then parses it into an object */
    async function readJson(filePath) {
      const decoder = new TextDecoder("utf-8");
      const content = decoder.decode(await Deno.readFile(filePath));
      try {
        return JSON.parse(content);
      } catch (err) {
        err.message = `${filePath}: ${err.message}`;
        throw err;
      }
    }
    exports_148("readJson", readJson);
    /** Reads a JSON file and then parses it into an object */
    function readJsonSync(filePath) {
      const decoder = new TextDecoder("utf-8");
      const content = decoder.decode(Deno.readFileSync(filePath));
      try {
        return JSON.parse(content);
      } catch (err) {
        err.message = `${filePath}: ${err.message}`;
        throw err;
      }
    }
    exports_148("readJsonSync", readJsonSync);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/fs/write_json",
  [],
  function (exports_149, context_149) {
    "use strict";
    var __moduleName = context_149 && context_149.id;
    /* Writes an object to a JSON file. */
    async function writeJson(filePath, object, options = {}) {
      let contentRaw = "";
      try {
        contentRaw = JSON.stringify(object, options.replacer, options.spaces);
      } catch (err) {
        err.message = `${filePath}: ${err.message}`;
        throw err;
      }
      await Deno.writeFile(filePath, new TextEncoder().encode(contentRaw));
    }
    exports_149("writeJson", writeJson);
    /* Writes an object to a JSON file. */
    function writeJsonSync(filePath, object, options = {}) {
      let contentRaw = "";
      try {
        contentRaw = JSON.stringify(object, options.replacer, options.spaces);
      } catch (err) {
        err.message = `${filePath}: ${err.message}`;
        throw err;
      }
      Deno.writeFileSync(filePath, new TextEncoder().encode(contentRaw));
    }
    exports_149("writeJsonSync", writeJsonSync);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.56.0/fs/eol",
  [],
  function (exports_150, context_150) {
    "use strict";
    var EOL, regDetect;
    var __moduleName = context_150 && context_150.id;
    /**
     * Detect the EOL character for string input.
     * returns null if no newline
     */
    function detect(content) {
      const d = content.match(regDetect);
      if (!d || d.length === 0) {
        return null;
      }
      const crlf = d.filter((x) => x === EOL.CRLF);
      if (crlf.length > 0) {
        return EOL.CRLF;
      } else {
        return EOL.LF;
      }
    }
    exports_150("detect", detect);
    /** Format the file to the targeted EOL */
    function format(content, eol) {
      return content.replace(regDetect, eol);
    }
    exports_150("format", format);
    return {
      setters: [],
      execute: function () {
        /** EndOfLine character enum */
        (function (EOL) {
          EOL["LF"] = "\n";
          EOL["CRLF"] = "\r\n";
        })(EOL || (EOL = {}));
        exports_150("EOL", EOL);
        regDetect = /(?:\r?\n)/g;
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.56.0/fs/mod",
  [
    "https://deno.land/std@0.56.0/fs/empty_dir",
    "https://deno.land/std@0.56.0/fs/ensure_dir",
    "https://deno.land/std@0.56.0/fs/ensure_file",
    "https://deno.land/std@0.56.0/fs/ensure_link",
    "https://deno.land/std@0.56.0/fs/ensure_symlink",
    "https://deno.land/std@0.56.0/fs/exists",
    "https://deno.land/std@0.56.0/fs/expand_glob",
    "https://deno.land/std@0.56.0/fs/move",
    "https://deno.land/std@0.56.0/fs/copy",
    "https://deno.land/std@0.56.0/fs/read_file_str",
    "https://deno.land/std@0.56.0/fs/write_file_str",
    "https://deno.land/std@0.56.0/fs/read_json",
    "https://deno.land/std@0.56.0/fs/write_json",
    "https://deno.land/std@0.56.0/fs/walk",
    "https://deno.land/std@0.56.0/fs/eol",
  ],
  function (exports_151, context_151) {
    "use strict";
    var __moduleName = context_151 && context_151.id;
    function exportStar_10(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default") exports[n] = m[n];
      }
      exports_151(exports);
    }
    return {
      setters: [
        function (empty_dir_ts_1_1) {
          exportStar_10(empty_dir_ts_1_1);
        },
        function (ensure_dir_ts_5_1) {
          exportStar_10(ensure_dir_ts_5_1);
        },
        function (ensure_file_ts_1_1) {
          exportStar_10(ensure_file_ts_1_1);
        },
        function (ensure_link_ts_1_1) {
          exportStar_10(ensure_link_ts_1_1);
        },
        function (ensure_symlink_ts_1_1) {
          exportStar_10(ensure_symlink_ts_1_1);
        },
        function (exists_ts_5_1) {
          exportStar_10(exists_ts_5_1);
        },
        function (expand_glob_ts_1_1) {
          exportStar_10(expand_glob_ts_1_1);
        },
        function (move_ts_1_1) {
          exportStar_10(move_ts_1_1);
        },
        function (copy_ts_1_1) {
          exportStar_10(copy_ts_1_1);
        },
        function (read_file_str_ts_1_1) {
          exportStar_10(read_file_str_ts_1_1);
        },
        function (write_file_str_ts_1_1) {
          exportStar_10(write_file_str_ts_1_1);
        },
        function (read_json_ts_1_1) {
          exportStar_10(read_json_ts_1_1);
        },
        function (write_json_ts_1_1) {
          exportStar_10(write_json_ts_1_1);
        },
        function (walk_ts_2_1) {
          exportStar_10(walk_ts_2_1);
        },
        function (eol_ts_1_1) {
          exportStar_10(eol_ts_1_1);
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/dotenv/util",
  [],
  function (exports_152, context_152) {
    "use strict";
    var __moduleName = context_152 && context_152.id;
    function trim(val) {
      return val.trim();
    }
    exports_152("trim", trim);
    function compact(obj) {
      return Object.keys(obj).reduce((result, key) => {
        if (obj[key]) {
          result[key] = obj[key];
        }
        return result;
      }, {});
    }
    exports_152("compact", compact);
    function difference(arrA, arrB) {
      return arrA.filter((a) => arrB.indexOf(a) < 0);
    }
    exports_152("difference", difference);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/dotenv/mod",
  ["https://deno.land/x/dotenv/util"],
  function (exports_153, context_153) {
    "use strict";
    var util_ts_4, MissingEnvVarsError;
    var __moduleName = context_153 && context_153.id;
    function parse(rawDotenv) {
      return rawDotenv.split("\n").reduce((acc, line) => {
        if (!isVariableStart(line)) {
          return acc;
        }
        let [key, ...vals] = removeSpacesAroundEquals(line).split("=");
        let value = vals.join("=");
        if (/^"/.test(value)) {
          value = expandNewlines(value);
        }
        acc[key] = util_ts_4.trim(cleanQuotes(value));
        return acc;
      }, {});
    }
    exports_153("parse", parse);
    function config(options = {}) {
      const o = Object.assign({
        path: `${Deno.cwd()}/.env`,
        export: false,
        safe: false,
        example: `${Deno.cwd()}/.env.example`,
        allowEmptyValues: false,
      }, options);
      const conf = parseFile(o.path);
      if (o.safe) {
        const confExample = parseFile(o.example);
        assertSafe(conf, confExample, o.allowEmptyValues);
      }
      if (o.export) {
        for (let key in conf) {
          Deno.env.set(key, conf[key]);
        }
      }
      return conf;
    }
    exports_153("config", config);
    function parseFile(filepath) {
      try {
        return parse(
          new TextDecoder("utf-8").decode(Deno.readFileSync(filepath)),
        );
      } catch (e) {
        if (e instanceof Deno.errors.NotFound) {
          return {};
        }
        throw e;
      }
    }
    function isVariableStart(str) {
      return /^[a-zA-Z_][a-zA-Z_0-9 ]*=/.test(str);
    }
    function cleanQuotes(value = "") {
      return value.replace(/^['"]([\s\S]*)['"]$/gm, "$1");
    }
    function removeSpacesAroundEquals(str) {
      return str.replace(/( *= *)/, "=");
    }
    function expandNewlines(str) {
      return str.replace("\\n", "\n");
    }
    function assertSafe(conf, confExample, allowEmptyValues) {
      const currentEnv = Deno.env.toObject();
      // Not all the variables have to be defined in .env, they can be supplied externally
      const confWithEnv = Object.assign({}, currentEnv, conf);
      const missing = util_ts_4.difference(
        Object.keys(confExample),
        // If allowEmptyValues is false, filter out empty values from configuration
        Object.keys(
          allowEmptyValues ? confWithEnv : util_ts_4.compact(confWithEnv),
        ),
      );
      if (missing.length > 0) {
        const errorMessages = [
          `The following variables were defined in the example file but are not present in the environment:\n  ${
            missing.join(", ")
          }`,
          `Make sure to add them to your env file.`,
          !allowEmptyValues &&
          `If you expect any of these variables to be empty, you can set the allowEmptyValues option to true.`,
        ];
        throw new MissingEnvVarsError(
          errorMessages.filter(Boolean).join("\n\n"),
        );
      }
    }
    return {
      setters: [
        function (util_ts_4_1) {
          util_ts_4 = util_ts_4_1;
        },
      ],
      execute: function () {
        MissingEnvVarsError = class MissingEnvVarsError extends Error {
          constructor(message) {
            super(message);
            this.name = "MissingEnvVarsError";
            Object.setPrototypeOf(this, new.target.prototype);
          }
        };
        exports_153("MissingEnvVarsError", MissingEnvVarsError);
      },
    };
  },
);
// Adapted from https://github.com/zeit/ms/blob/master/index.js
// Copyright (c) 2016 Zeit, Inc. MIT License
// Copyright (c) 2018 Kevin "Kun" Kassimo Qian. MIT License
System.register(
  "https://raw.githubusercontent.com/denolib/ms/master/ms",
  [],
  function (exports_154, context_154) {
    "use strict";
    var s, m, h, d, w, y;
    var __moduleName = context_154 && context_154.id;
    /** Parse or format the given `val`.
     *
     * Options:
     *
     *  - `long` verbose formatting [false]
     */
    function ms(val, options) {
      switch (typeof val) {
        case "string":
          if ((val).length > 0) {
            return parse(val);
          }
          break;
        case "number":
          if (!isNaN(val)) {
            return options && options.long ? fmtLong(val) : fmtShort(val);
          }
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" +
          JSON.stringify(val),
      );
    }
    exports_154("ms", ms);
    /** Parse the given `str` and return milliseconds.
     */
    function parse(str) {
      if (str.length > 100) {
        return;
      }
      const match =
        /^((?:\d+)?-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i
          .exec(str);
      if (!match) {
        return;
      }
      const n = parseFloat(match[1]);
      const type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return undefined;
      }
    }
    /** Short format for `ms`.
     */
    function fmtShort(ms) {
      const msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    /** Long format for `ms`.
     */
    function fmtLong(ms) {
      const msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    /** Pluralization helper.
     */
    function plural(ms, msAbs, n, name) {
      const isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
    return {
      setters: [],
      execute: function () {
        s = 1000;
        m = s * 60;
        h = m * 60;
        d = h * 24;
        w = d * 7;
        y = d * 365.25;
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/denolib/camelcase/master/mod",
  [],
  function (exports_155, context_155) {
    "use strict";
    var __moduleName = context_155 && context_155.id;
    function preserveCamelCase(input) {
      let isLastCharLower = false;
      let isLastCharUpper = false;
      let isLastLastCharUpper = false;
      for (let i = 0; i < input.length; i++) {
        const c = input[i];
        if (isLastCharLower && /[a-zA-Z]/.test(c) && c.toUpperCase() === c) {
          input = input.slice(0, i) + "-" + input.slice(i);
          isLastCharLower = false;
          isLastLastCharUpper = isLastCharUpper;
          isLastCharUpper = true;
          i++;
        } else if (
          isLastCharUpper &&
          isLastLastCharUpper &&
          /[a-zA-Z]/.test(c) &&
          c.toLowerCase() === c
        ) {
          input = input.slice(0, i - 1) + "-" + input.slice(i - 1);
          isLastLastCharUpper = isLastCharUpper;
          isLastCharUpper = false;
          isLastCharLower = true;
        } else {
          isLastCharLower = c.toLowerCase() === c;
          isLastLastCharUpper = isLastCharUpper;
          isLastCharUpper = c.toUpperCase() === c;
        }
      }
      return input;
    }
    function camelCase(input, options = { pascalCase: false }) {
      function postProcess(x) {
        return options.pascalCase ? x.charAt(0).toUpperCase() + x.slice(1) : x;
      }
      if (Array.isArray(input)) {
        input = input
          .map((x) => x.trim())
          .filter((x) => x.length)
          .join("-");
      } else {
        input = input.trim();
      }
      if (input.length === 0) {
        return "";
      }
      if (input.length === 1) {
        return options.pascalCase ? input.toUpperCase() : input.toLowerCase();
      }
      if (/^[a-z\d]+$/.test(input)) {
        return postProcess(input);
      }
      const hasUpperCase = input !== input.toLowerCase();
      if (hasUpperCase) {
        input = preserveCamelCase(input);
      }
      input = input
        .replace(/^[_.\- ]+/, "")
        .toLowerCase()
        .replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase());
      return postProcess(input);
    }
    exports_155("camelCase", camelCase);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/debuglog/utils",
  ["https://raw.githubusercontent.com/denolib/camelcase/master/mod"],
  function (exports_156, context_156) {
    "use strict";
    var env, mod_ts_35, colors;
    var __moduleName = context_156 && context_156.id;
    /**
     * Selects a color for a debug namespace
     */
    function selectColor(namespace) {
      let hash = 0;
      for (let i = 0; i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      return colors[Math.abs(hash) % colors.length];
    }
    exports_156("selectColor", selectColor);
    function getInspectOpts() {
      const currentEnv = env.toObject();
      const inspectOpts = Object.keys(currentEnv)
        .filter((key) => /^debug_/i.test(key))
        .reduce((obj, key) => {
          const prop = mod_ts_35.camelCase(key.slice(6));
          let envVar = currentEnv[key];
          let val;
          if (/^(yes|on|true|enabled)$/i.test(envVar)) {
            val = true;
          } else if (/^(no|off|false|disabled)$/i.test(envVar)) {
            val = false;
          } else if (envVar === "null") {
            val = null;
          } else {
            val = Number(envVar);
          }
          obj[prop] = val;
          return obj;
        }, {});
      return inspectOpts;
    }
    exports_156("getInspectOpts", getInspectOpts);
    /**
     * Coerce `val`.
     */
    function coerce(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    exports_156("coerce", coerce);
    /**
     * Convert regexp to namespace
     */
    function regexpToNamespace(regexp) {
      return regexp
        .toString()
        .substring(2, regexp.toString().length - 2)
        .replace(/\.\*\?$/, "*");
    }
    exports_156("regexpToNamespace", regexpToNamespace);
    return {
      setters: [
        function (mod_ts_35_1) {
          mod_ts_35 = mod_ts_35_1;
        },
      ],
      execute: function () {
        env = Deno.env;
        // We assume the terminal supports colors
        exports_156(
          "colors",
          colors = [
            20,
            21,
            26,
            27,
            32,
            33,
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            56,
            57,
            62,
            63,
            68,
            69,
            74,
            75,
            76,
            77,
            78,
            79,
            80,
            81,
            92,
            93,
            98,
            99,
            112,
            113,
            128,
            129,
            134,
            135,
            148,
            149,
            160,
            161,
            162,
            163,
            164,
            165,
            166,
            167,
            168,
            169,
            170,
            171,
            172,
            173,
            178,
            179,
            184,
            185,
            196,
            197,
            198,
            199,
            200,
            201,
            202,
            203,
            204,
            205,
            206,
            207,
            208,
            209,
            214,
            215,
            220,
            221,
          ],
        );
      },
    };
  },
);
System.register(
  "https://deno.land/x/debuglog/format",
  ["https://deno.land/x/debuglog/utils"],
  function (exports_157, context_157) {
    "use strict";
    var inspect, utils_ts_1, inspectOpts, formatRegExp;
    var __moduleName = context_157 && context_157.id;
    function format(...args) {
      if (typeof args[0] !== "string") {
        let objects = [];
        for (let i = 0; i < arguments.length; i++) {
          objects.push(inspect(arguments[i], inspectOpts));
        }
        return objects.join(" ");
      }
      let i = 1;
      const f = args[0];
      const len = args.length;
      let str = String(f).replace(formatRegExp, function (x) {
        if (x === "%%") {
          return "%";
        }
        if (i >= len) {
          return x;
        }
        switch (x) {
          case "%s":
            return String(args[i++]);
          case "%d":
            return String(Number(args[i++]));
          case "%j":
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return "[Circular]";
            }
          case "%o":
          case "%O":
            return inspect(args[i++], inspectOpts);
          default:
            return x;
        }
      });
      for (let x = args[i]; i < len; x = args[++i]) {
        if (x == null || typeof x !== "object") {
          str += " " + x;
        } else {
          str += " " + inspect(x);
        }
      }
      return str;
    }
    exports_157("default", format);
    return {
      setters: [
        function (utils_ts_1_1) {
          utils_ts_1 = utils_ts_1_1;
        },
      ],
      execute: function () {
        // Copied from https://github.com/defunctzombie/node-util/blob/master/util.js
        // Modified to format %o and %O as deno objects
        inspect = Deno.inspect;
        inspectOpts = utils_ts_1.getInspectOpts();
        formatRegExp = /%[sdjoO%]/g;
      },
    };
  },
);
System.register(
  "https://deno.land/x/debuglog/debug",
  [
    "https://raw.githubusercontent.com/denolib/ms/master/ms",
    "https://deno.land/x/debuglog/format",
    "https://deno.land/x/debuglog/utils",
  ],
  function (exports_158, context_158) {
    "use strict";
    var noColor,
      env,
      ms_ts_1,
      format_ts_1,
      utils_ts_2,
      instances,
      names,
      skips,
      formatters,
      debugModule;
    var __moduleName = context_158 && context_158.id;
    /**
     * Create a debugger with the given `namespace`.
     */
    function createDebug(namespace) {
      let prevTime;
      let debug;
      // @ts-ignore-next-line
      debug = function (log, ...args) {
        // Skip if debugger is disabled
        if (!debug.enabled) {
          return;
        }
        const self = debug;
        log = utils_ts_2.coerce(log);
        if (typeof log !== "string") {
          // Anything else let's inspect with %O
          args.unshift(log);
          log = "%O";
        }
        // Set `diff` timestamp
        const currTime = Number(Date.now());
        // Difference in miliseconds
        const diff = currTime - (prevTime || currTime);
        prevTime = currTime;
        // Apply all custom formatters to our arguments
        const customFormattedArgs = applyFormatters.call(self, log, ...args);
        const { namespace, color } = self;
        // Format the string before logging
        const formattedArgs = formatArgs(
          { namespace, color, diff },
          customFormattedArgs,
        );
        // Use a custom logger if defined
        // If not, we use the default logger
        const logFn = self.log || debugModule.log;
        // Finally, log
        logFn.apply(self, formattedArgs);
        return;
      };
      debug.namespace = namespace;
      debug.color = utils_ts_2.selectColor(namespace);
      debug.enabled = enabled(namespace);
      debug.destroy = destroy;
      debug.extend = extend;
      instances.push(debug);
      return debug;
    }
    function destroy() {
      if (instances.includes(this)) {
        this.enabled = false;
        instances = instances.filter((instance) => instance !== this);
        return true;
      }
      return false;
    }
    /**
     * const server = debug('server');
     * const serverHttp = server.extend('http') // server:http
     * const serverHttpReq = serverHttp.extend('req', '-') // server:http-req
     */
    function extend(subNamespace, delimiter = ":") {
      const newNamespace = `${this.namespace}${delimiter}${subNamespace}`;
      const newDebug = createDebug(newNamespace);
      // Pass down the custom logger
      newDebug.log = this.log;
      return newDebug;
    }
    function applyFormatters(fmt, ...args) {
      let index = 0;
      const newFmt = fmt.replace(/%([a-zA-Z%])/g, (match, format) => {
        // If we encounter an escaped % then don't increase the array index
        if (match === "%%") {
          return match;
        }
        const formatter = formatters[format];
        if (typeof formatter === "function") {
          const value = args[index];
          // Remove the argument we used in the custom formatter
          args = [...args.slice(0, index), ...args.slice(index + 1)];
          return formatter.call(this, value);
        }
        index++;
        return match;
      });
      // Return the update fmt string and updated args
      return [newFmt, ...args];
    }
    /**
     * Returns true if the given mode name is enabled, false otherwise.
     */
    function enabled(namespace) {
      if (namespace[namespace.length - 1] === "*") {
        return true;
      }
      for (const skip of skips) {
        if (skip.test(namespace)) {
          return false;
        }
      }
      for (const name of names) {
        if (name.test(namespace)) {
          return true;
        }
      }
      return false;
    }
    exports_158("enabled", enabled);
    /**
     * Enables a debug mode by namespaces. This can include modes
     * separated by a colon and wildcards.
     */
    function enable(namespaces) {
      updateNamespacesEnv(namespaces);
      // Resets enabled and disable namespaces
      names = [];
      skips = [];
      // Splits on comma
      // Loops through the passed namespaces
      // And groups them in enabled and disabled lists
      (typeof namespaces === "string" ? namespaces : "")
        .split(/[\s,]+/)
        // Ignore empty strings
        .filter(Boolean)
        .map((namespace) => namespace.replace(/\*/g, ".*?"))
        .forEach((ns) => {
          // If a namespace starts with `-`, we should disable that namespace
          if (ns[0] === "-") {
            skips.push(new RegExp("^" + ns.slice(1) + "$"));
          } else {
            names.push(new RegExp("^" + ns + "$"));
          }
        });
      instances.forEach((instance) => {
        instance.enabled = enabled(instance.namespace);
      });
    }
    exports_158("enable", enable);
    function formatArgs({ namespace, color, diff }, args) {
      const colorCode = "\u001B[3" + (color < 8 ? color : "8;5;" + color);
      const prefix = noColor ? `  ${namespace} `
      : `  ${colorCode};1m${namespace} \u001B[0m`;
      // Add a prefix on every line
      args[0] = args[0]
        .split("\n")
        .map((line) => `${prefix}${line}`)
        .join("\n");
      const lastArg = noColor
        ? `+${ms_ts_1.ms(diff)}`
        : `${colorCode}m+${ms_ts_1.ms(diff)}${"\u001B[0m"}`;
      return [...args, lastArg];
    }
    /**
     * Disable debug output.
     */
    function disable() {
      const namespaces = [
        ...names.map(utils_ts_2.regexpToNamespace),
        ...skips.map(utils_ts_2.regexpToNamespace).map((namespace) =>
          `-${namespace}`
        ),
      ].join(",");
      enable("");
      return namespaces;
    }
    exports_158("disable", disable);
    /**
     * Save `namespaces` to env.
     */
    function updateNamespacesEnv(namespaces) {
      if (namespaces) {
        env.toObject().DEBUG = namespaces;
      } else {
        delete env.toObject().DEBUG;
      }
    }
    // Default logger
    function log(...args) {
      const result = format_ts_1.default(...args);
      console.log(result);
    }
    return {
      setters: [
        function (ms_ts_1_1) {
          ms_ts_1 = ms_ts_1_1;
        },
        function (format_ts_1_1) {
          format_ts_1 = format_ts_1_1;
        },
        function (utils_ts_2_1) {
          utils_ts_2 = utils_ts_2_1;
        },
      ],
      execute: function () {
        noColor = Deno.noColor, env = Deno.env;
        /**
             * Active `debug` instances.
             */
        instances = [];
        /**
             * The currently active debug mode names, and names to skip.
             */
        names = [];
        skips = [];
        /**
             * Map of special "%n" handling functions, for the debug "format" argument.
             *
             * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
             */
        formatters = {};
        // Exports
        debugModule = Object.assign(createDebug, {
          enable,
          disable,
          enabled,
          names,
          skips,
          formatters,
          log,
        });
        // Enable namespaces passed from env
        enable(env.toObject().DEBUG);
        exports_158("default", debugModule);
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/constants/discord",
  [],
  function (exports_159, context_159) {
    "use strict";
    var baseEndpoints, GUILDS_BASE, endpoints;
    var __moduleName = context_159 && context_159.id;
    return {
      setters: [],
      execute: function () {
        exports_159(
          "baseEndpoints",
          baseEndpoints = {
            /** Although, the version can be defaulted, keep the v6 as it can be changed to test newer versions when necessary. */
            BASE_URL: "https://discord.com/api/v6",
            CDN_URL: "https://cdn.discordapp.com",
          },
        );
        GUILDS_BASE = (id) => `${baseEndpoints.BASE_URL}/guilds/${id}`;
        exports_159(
          "endpoints",
          endpoints = {
            GATEWAY_BOT: `${baseEndpoints.BASE_URL}/gateway/bot`,
            // Channel Endpoints
            CHANNEL_MESSAGE: (id, messageID) =>
              `${baseEndpoints.BASE_URL}/channels/${id}/messages/${messageID}`,
            CHANNEL_MESSAGES: (id) =>
              `${baseEndpoints.BASE_URL}/channels/${id}/messages`,
            CHANNEL_PINS: (id) =>
              `${baseEndpoints.BASE_URL}/channels/${id}/pins`,
            CHANNEL_BULK_DELETE: (id) =>
              `${baseEndpoints.BASE_URL}/channels/${id}/messages/bulk-delete`,
            CHANNEL_INVITES: (id) =>
              `${baseEndpoints.BASE_URL}/channels/${id}/invites`,
            CHANNEL_WEBHOOKS: (id) =>
              `${baseEndpoints.BASE_URL}/channels/${id}/webhooks`,
            CHANNEL_MESSAGE_REACTION_ME: (id, messageID, emoji) =>
              `${baseEndpoints.BASE_URL}/channels/${id}/messages/${messageID}/reactions/${emoji}/@me`,
            CHANNEL_MESSAGE_REACTIONS: (id, messageID) =>
              `${baseEndpoints.BASE_URL}/channels/${id}/messages/${messageID}/reactions`,
            CHANNEL_MESSAGE_REACTION: (id, messageID, emoji) =>
              `${baseEndpoints.BASE_URL}/channels/${id}/messages/${messageID}/reactions/${emoji}`,
            // Guild Endpoints
            GUILD: (id) => `${GUILDS_BASE(id)}`,
            GUILD_AUDIT_LOGS: (id) => `${GUILDS_BASE(id)}/audit-logs`,
            GUILD_BAN: (id, userID) => `${GUILDS_BASE(id)}/bans/${userID}`,
            GUILD_BANS: (id) => `${GUILDS_BASE(id)}/bans`,
            GUILD_BANNER: (id, icon) =>
              `${baseEndpoints.CDN_URL}/banners/${id}/${icon}`,
            GUILD_CHANNELS: (id) => `${GUILDS_BASE(id)}/channels`,
            GUILD_CHANNEL: (id) => `${baseEndpoints.BASE_URL}/channels/${id}`,
            GUILD_EMBED: (id) => `${GUILDS_BASE(id)}/embed`,
            GUILD_EMOJI: (id, emoji_id) =>
              `${GUILDS_BASE(id)}/emojis/${emoji_id}`,
            GUILD_EMOJIS: (id) => `${GUILDS_BASE(id)}/emojis`,
            GUILD_ICON: (id, icon) =>
              `${baseEndpoints.CDN_URL}/icons/${id}/${icon}`,
            GUILD_INTEGRATION: (id, integrationID) =>
              `${GUILDS_BASE(id)}/integrations/${integrationID}`,
            GUILD_INTEGRATION_SYNC: (id, integrationID) =>
              `${GUILDS_BASE(id)}/integrations/${integrationID}/sync`,
            GUILD_INTEGRATIONS: (id) => `${GUILDS_BASE(id)}/integrations`,
            GUILD_INVITES: (id) => `${GUILDS_BASE(id)}/invites`,
            GUILD_LEAVE: (id) =>
              `${baseEndpoints.BASE_URL}/users/@me/guilds/${id}`,
            GUILD_MEMBER: (id, memberID) =>
              `${GUILDS_BASE(id)}/members/${memberID}`,
            GUILD_MEMBER_ROLE: (id, memberID, roleID) =>
              `${GUILDS_BASE(id)}/members/${memberID}/roles/${roleID}`,
            GUILD_PRUNE: (id) => `${GUILDS_BASE(id)}/prune`,
            GUILD_REGIONS: (id) => `${GUILDS_BASE(id)}/regions`,
            GUILD_ROLE: (id, roleID) => `${GUILDS_BASE(id)}/roles/${roleID}`,
            GUILD_ROLES: (id) => `${GUILDS_BASE(id)}/roles`,
            GUILD_SPLASH: (id, icon) =>
              `${baseEndpoints.CDN_URL}/splashes/${id}/${icon}`,
            GUILD_VANITY_URL: (id) => `${GUILDS_BASE(id)}/vanity-url`,
            GUILD_WEBHOOKS: (id) => `${GUILDS_BASE(id)}/webhooks`,
            // User endpoints
            USER_AVATAR: (id, icon) =>
              `${baseEndpoints.CDN_URL}/avatars/${id}/${icon}`,
            USER_DEFAULT_AVATAR: (icon) =>
              `${baseEndpoints.CDN_URL}/embed/avatars${icon}.png`,
            USER_CREATE_DM: `${baseEndpoints.BASE_URL}/users/@me/channels`,
          },
        );
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/permission",
  [],
  function (exports_160, context_160) {
    "use strict";
    var Permissions;
    var __moduleName = context_160 && context_160.id;
    return {
      setters: [],
      execute: function () {
        (function (Permissions) {
          Permissions[Permissions["CREATE_INSTANT_INVITE"] = 1] =
            "CREATE_INSTANT_INVITE";
          Permissions[Permissions["KICK_MEMBERS"] = 2] = "KICK_MEMBERS";
          Permissions[Permissions["BAN_MEMBERS"] = 4] = "BAN_MEMBERS";
          Permissions[Permissions["ADMINISTRATOR"] = 8] = "ADMINISTRATOR";
          Permissions[Permissions["MANAGE_CHANNELS"] = 16] = "MANAGE_CHANNELS";
          Permissions[Permissions["MANAGE_GUILD"] = 32] = "MANAGE_GUILD";
          Permissions[Permissions["ADD_REACTIONS"] = 64] = "ADD_REACTIONS";
          Permissions[Permissions["VIEW_AUDIT_LOG"] = 128] = "VIEW_AUDIT_LOG";
          Permissions[Permissions["VIEW_CHANNEL"] = 1024] = "VIEW_CHANNEL";
          Permissions[Permissions["SEND_MESSAGES"] = 2048] = "SEND_MESSAGES";
          Permissions[Permissions["SEND_TTS_MESSAGES"] = 4096] =
            "SEND_TTS_MESSAGES";
          Permissions[Permissions["MANAGE_MESSAGES"] = 8192] =
            "MANAGE_MESSAGES";
          Permissions[Permissions["EMBED_LINKS"] = 16384] = "EMBED_LINKS";
          Permissions[Permissions["ATTACH_FILES"] = 32768] = "ATTACH_FILES";
          Permissions[Permissions["READ_MESSAGE_HISTORY"] = 65536] =
            "READ_MESSAGE_HISTORY";
          Permissions[Permissions["MENTION_EVERYONE"] = 131072] =
            "MENTION_EVERYONE";
          Permissions[Permissions["USE_EXTERNAL_EMOJIS"] = 262144] =
            "USE_EXTERNAL_EMOJIS";
          Permissions[Permissions["CONNECT"] = 1048576] = "CONNECT";
          Permissions[Permissions["SPEAK"] = 2097152] = "SPEAK";
          Permissions[Permissions["MUTE_MEMBERS"] = 4194304] = "MUTE_MEMBERS";
          Permissions[Permissions["DEAFEN_MEMBERS"] = 8388608] =
            "DEAFEN_MEMBERS";
          Permissions[Permissions["MOVE_MEMBERS"] = 16777216] = "MOVE_MEMBERS";
          Permissions[Permissions["USE_VAD"] = 33554432] = "USE_VAD";
          Permissions[Permissions["PRIORITY_SPEAKER"] = 256] =
            "PRIORITY_SPEAKER";
          Permissions[Permissions["STREAM"] = 512] = "STREAM";
          Permissions[Permissions["CHANGE_NICKNAME"] = 67108864] =
            "CHANGE_NICKNAME";
          Permissions[Permissions["MANAGE_NICKNAMES"] = 134217728] =
            "MANAGE_NICKNAMES";
          Permissions[Permissions["MANAGE_ROLES"] = 268435456] = "MANAGE_ROLES";
          Permissions[Permissions["MANAGE_WEBHOOKS"] = 536870912] =
            "MANAGE_WEBHOOKS";
          Permissions[Permissions["MANAGE_EMOJIS"] = 1073741824] =
            "MANAGE_EMOJIS";
        })(Permissions || (Permissions = {}));
        exports_160("Permissions", Permissions);
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/role",
  [],
  function (exports_161, context_161) {
    "use strict";
    var __moduleName = context_161 && context_161.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/member",
  [],
  function (exports_162, context_162) {
    "use strict";
    var __moduleName = context_162 && context_162.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/presence",
  [],
  function (exports_163, context_163) {
    "use strict";
    var __moduleName = context_163 && context_163.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/channel",
  [],
  function (exports_164, context_164) {
    "use strict";
    var ChannelTypes;
    var __moduleName = context_164 && context_164.id;
    return {
      setters: [],
      execute: function () {
        (function (ChannelTypes) {
          /** A text channel within a server */
          ChannelTypes[ChannelTypes["GUILD_TEXT"] = 0] = "GUILD_TEXT";
          /** A direct message between users */
          ChannelTypes[ChannelTypes["DM"] = 1] = "DM";
          /** A voice channel within a server */
          ChannelTypes[ChannelTypes["GUILD_VOICE"] = 2] = "GUILD_VOICE";
          /** A direct message between multiple users. */
          ChannelTypes[ChannelTypes["GROUP_DM"] = 3] = "GROUP_DM";
          /** An organizational category that contains channels */
          ChannelTypes[ChannelTypes["GUILD_CATEGORY"] = 4] = "GUILD_CATEGORY";
          /** A channel that users can follow and crosspost into their own server. */
          ChannelTypes[ChannelTypes["GUILD_NEWS"] = 5] = "GUILD_NEWS";
          /** A channel in which game developers can sell their game on Discord. */
          ChannelTypes[ChannelTypes["GUILD_STORE"] = 6] = "GUILD_STORE";
        })(ChannelTypes || (ChannelTypes = {}));
        exports_164("ChannelTypes", ChannelTypes);
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/guild",
  [],
  function (exports_165, context_165) {
    "use strict";
    var User_Flags, Nitro_Types, AuditLogs;
    var __moduleName = context_165 && context_165.id;
    return {
      setters: [],
      execute: function () {
        (function (User_Flags) {
          User_Flags[User_Flags["NONE"] = 0] = "NONE";
          User_Flags[User_Flags["DISCORD_EMPLOYEE"] = 1] = "DISCORD_EMPLOYEE";
          User_Flags[User_Flags["DISCORD_PARTNER"] = 2] = "DISCORD_PARTNER";
          User_Flags[User_Flags["HYPE_SQUAD_EVENTS"] = 4] = "HYPE_SQUAD_EVENTS";
          User_Flags[User_Flags["BUG_HUNTER"] = 8] = "BUG_HUNTER";
          User_Flags[User_Flags["HOUSE_BRAVERY"] = 64] = "HOUSE_BRAVERY";
          User_Flags[User_Flags["HOUSE_BRILLIANCE"] = 128] = "HOUSE_BRILLIANCE";
          User_Flags[User_Flags["HOUSE_BALANCE"] = 256] = "HOUSE_BALANCE";
          User_Flags[User_Flags["EARLY_SUPPORTER"] = 512] = "EARLY_SUPPORTER";
          User_Flags[User_Flags["TEAM_USER"] = 1024] = "TEAM_USER";
          User_Flags[User_Flags["SYSTEM"] = 4096] = "SYSTEM";
        })(User_Flags || (User_Flags = {}));
        exports_165("User_Flags", User_Flags);
        (function (Nitro_Types) {
          Nitro_Types[Nitro_Types["NITRO_CLASSIC"] = 1] = "NITRO_CLASSIC";
          Nitro_Types[Nitro_Types["NITRO"] = 2] = "NITRO";
        })(Nitro_Types || (Nitro_Types = {}));
        exports_165("Nitro_Types", Nitro_Types);
        (function (AuditLogs) {
          AuditLogs[AuditLogs["GUILD_UPDATE"] = 1] = "GUILD_UPDATE";
          AuditLogs[AuditLogs["CHANNEL_CREATE"] = 10] = "CHANNEL_CREATE";
          AuditLogs[AuditLogs["CHANNEL_UPDATE"] = 11] = "CHANNEL_UPDATE";
          AuditLogs[AuditLogs["CHANNEL_DELETE"] = 12] = "CHANNEL_DELETE";
          AuditLogs[AuditLogs["CHANNEL_OVERWRITE_CREATE"] = 13] =
            "CHANNEL_OVERWRITE_CREATE";
          AuditLogs[AuditLogs["CHANNEL_OVERWRITE_UPDATE"] = 14] =
            "CHANNEL_OVERWRITE_UPDATE";
          AuditLogs[AuditLogs["CHANNEL_OVERWRITE_DELETE"] = 15] =
            "CHANNEL_OVERWRITE_DELETE";
          AuditLogs[AuditLogs["MEMBER_KICK"] = 20] = "MEMBER_KICK";
          AuditLogs[AuditLogs["MEMBER_PRUNE"] = 21] = "MEMBER_PRUNE";
          AuditLogs[AuditLogs["MEMBER_BAN_ADD"] = 22] = "MEMBER_BAN_ADD";
          AuditLogs[AuditLogs["MEMBER_BAN_REMOVE"] = 23] = "MEMBER_BAN_REMOVE";
          AuditLogs[AuditLogs["MEMBER_UPDATE"] = 24] = "MEMBER_UPDATE";
          AuditLogs[AuditLogs["MEMBER_ROLE_UPDATE"] = 25] =
            "MEMBER_ROLE_UPDATE";
          AuditLogs[AuditLogs["MEMBER_MOVE"] = 26] = "MEMBER_MOVE";
          AuditLogs[AuditLogs["MEMBER_DISCONNECT"] = 27] = "MEMBER_DISCONNECT";
          AuditLogs[AuditLogs["BOT_ADD"] = 28] = "BOT_ADD";
          AuditLogs[AuditLogs["ROLE_CREATE"] = 30] = "ROLE_CREATE";
          AuditLogs[AuditLogs["ROLE_UPDATE"] = 31] = "ROLE_UPDATE";
          AuditLogs[AuditLogs["ROLE_DELETE"] = 32] = "ROLE_DELETE";
          AuditLogs[AuditLogs["INVITE_CREATE"] = 40] = "INVITE_CREATE";
          AuditLogs[AuditLogs["INVITE_UPDATE"] = 41] = "INVITE_UPDATE";
          AuditLogs[AuditLogs["INVITE_DELETE"] = 42] = "INVITE_DELETE";
          AuditLogs[AuditLogs["WEBHOOK_CREATE"] = 50] = "WEBHOOK_CREATE";
          AuditLogs[AuditLogs["WEBHOOK_UPDATE"] = 51] = "WEBHOOK_UPDATE";
          AuditLogs[AuditLogs["WEBHOOK_DELETE"] = 52] = "WEBHOOK_DELETE";
          AuditLogs[AuditLogs["EMOJI_CREATE"] = 60] = "EMOJI_CREATE";
          AuditLogs[AuditLogs["EMOJI_UPDATE"] = 61] = "EMOJI_UPDATE";
          AuditLogs[AuditLogs["EMOJI_DELETE"] = 62] = "EMOJI_DELETE";
          AuditLogs[AuditLogs["MESSAGE_DELETE"] = 72] = "MESSAGE_DELETE";
          AuditLogs[AuditLogs["MESSAGE_BULK_DELETE"] = 73] =
            "MESSAGE_BULK_DELETE";
          AuditLogs[AuditLogs["MESSAGE_PIN"] = 74] = "MESSAGE_PIN";
          AuditLogs[AuditLogs["MESSAGE_UNPIN"] = 75] = "MESSAGE_UNPIN";
          AuditLogs[AuditLogs["INTEGRATION_CREATE"] = 80] =
            "INTEGRATION_CREATE";
          AuditLogs[AuditLogs["INTEGRATION_UPDATE"] = 81] =
            "INTEGRATION_UPDATE";
          AuditLogs[AuditLogs["INTEGRATION_DELETE"] = 82] =
            "INTEGRATION_DELETE";
        })(AuditLogs || (AuditLogs = {}));
        exports_165("AuditLogs", AuditLogs);
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/activity",
  [],
  function (exports_166, context_166) {
    "use strict";
    var ActivityType;
    var __moduleName = context_166 && context_166.id;
    return {
      setters: [],
      execute: function () {
        (function (ActivityType) {
          /** Example: "Playing Rocket League" */
          ActivityType[ActivityType["Game"] = 0] = "Game";
          /** Example: "Streaming Rocket League" */
          ActivityType[ActivityType["Streaming"] = 1] = "Streaming";
          /** Example: "Listening to spotify" */
          ActivityType[ActivityType["Listening"] = 2] = "Listening";
          /** Example: ":smiley: I am cool" */
          ActivityType[ActivityType["Custom"] = 4] = "Custom";
        })(ActivityType || (ActivityType = {}));
        exports_166("ActivityType", ActivityType);
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.50.0/async/delay",
  [],
  function (exports_167, context_167) {
    "use strict";
    var __moduleName = context_167 && context_167.id;
    // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
    /* Resolves after the given number of milliseconds. */
    function delay(ms) {
      return new Promise((res) =>
        setTimeout(() => {
          res();
        }, ms)
      );
    }
    exports_167("delay", delay);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/events/channels",
  [
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/cache",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/channel",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/channel",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/client",
  ],
  function (exports_168, context_168) {
    "use strict";
    var cache_ts_1,
      channel_ts_1,
      channel_ts_2,
      client_ts_1,
      handleInternalChannelCreate,
      handleInternalChannelUpdate,
      handleInternalChannelDelete;
    var __moduleName = context_168 && context_168.id;
    return {
      setters: [
        function (cache_ts_1_1) {
          cache_ts_1 = cache_ts_1_1;
        },
        function (channel_ts_1_1) {
          channel_ts_1 = channel_ts_1_1;
        },
        function (channel_ts_2_1) {
          channel_ts_2 = channel_ts_2_1;
        },
        function (client_ts_1_1) {
          client_ts_1 = client_ts_1_1;
        },
      ],
      execute: function () {
        exports_168(
          "handleInternalChannelCreate",
          handleInternalChannelCreate = (data) => {
            const channel = channel_ts_2.createChannel(data);
            cache_ts_1.cache.channels.set(channel.id, channel);
            if (channel.guildID) {
              const guild = cache_ts_1.cache.guilds.get(channel.guildID);
              guild?.channels.set(channel.id, channel);
            }
            client_ts_1.eventHandlers.channelCreate?.(channel);
          },
        );
        exports_168(
          "handleInternalChannelUpdate",
          handleInternalChannelUpdate = (data) => {
            const cachedChannel = cache_ts_1.cache.channels.get(data.id);
            const channel = channel_ts_2.createChannel(data);
            cache_ts_1.cache.channels.set(channel.id, channel);
            if (!cachedChannel) {
              return;
            }
            if (channel.guildID) {
              const guild = cache_ts_1.cache.guilds.get(channel.guildID);
              guild?.channels.set(channel.id, channel);
            }
            client_ts_1.eventHandlers.channelUpdate?.(channel, cachedChannel);
          },
        );
        exports_168(
          "handleInternalChannelDelete",
          handleInternalChannelDelete = (data) => {
            const cachedChannel = cache_ts_1.cache.channels.get(data.id);
            if (!cachedChannel) {
              return;
            }
            if (
              cachedChannel.type === channel_ts_1.ChannelTypes.GUILD_VOICE &&
              data.guild_id
            ) {
              const guild = cache_ts_1.cache.guilds.get(data.guild_id);
              if (guild) {
                guild.voiceStates.forEach((vs, key) => {
                  if (vs.channelID !== data.id) {
                    return;
                  }
                  // Since this channel was deleted all voice states for this channel should be deleted
                  guild.voiceStates.delete(key);
                  const member = guild.members.get(vs.userID);
                  if (!member) {
                    return;
                  }
                  client_ts_1.eventHandlers.voiceChannelLeave?.(
                    member,
                    vs.channelID,
                  );
                });
              }
              guild?.channels.delete(data.id);
            }
            cache_ts_1.cache.channels.delete(data.id);
            cache_ts_1.cache.messages.forEach((message) => {
              if (message.channelID === data.id) {
                cache_ts_1.cache.messages.delete(message.id);
              }
            });
            client_ts_1.eventHandlers.channelDelete?.(cachedChannel);
          },
        );
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/role",
  [],
  function (exports_169, context_169) {
    "use strict";
    var createRole;
    var __moduleName = context_169 && context_169.id;
    return {
      setters: [],
      execute: function () {
        exports_169(
          "createRole",
          createRole = (data) => ({
            ...data,
            /** The @ mention of the role in a string. */
            mention: `<@&${data.id}>`,
          }),
        );
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/member",
  ["https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/cache"],
  function (exports_170, context_170) {
    "use strict";
    var cache_ts_2, createMember;
    var __moduleName = context_170 && context_170.id;
    return {
      setters: [
        function (cache_ts_2_1) {
          cache_ts_2 = cache_ts_2_1;
        },
      ],
      execute: function () {
        exports_170(
          "createMember",
          createMember = (data, guild) => {
            const member = {
              ...data,
              /** When the user joined the guild */
              joinedAt: Date.parse(data.joined_at),
              /** When the user used their nitro boost on the server. */
              premiumSince: data.premium_since
                ? Date.parse(data.premium_since)
                : undefined,
              /** The full username#discriminator */
              tag: `${data.user.username}#${data.user.discriminator}`,
              /** The user mention with nickname if possible */
              mention: `<@!${data.user.id}>`,
              /** The guild id where this member exists */
              guildID: guild.id,
              /** Whether or not this user has 2FA enabled. */
              mfaEnabled: data.user.mfa_enabled,
              /** The premium type for this user */
              premiumType: data.user.premium_type,
              /** Gets the guild object from cache for this member. This is a method instead of a prop to preserve memory. */
              guild: () => cache_ts_2.cache.guilds.get(guild.id),
            };
            // Remove excess properties to preserve cache.
            // delete member.joined_at;
            // delete member.premium_since;
            // delete member.user.mfa_enabled;
            // delete member.user.premium_type;
            return member;
          },
        );
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/guild",
  [
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/collection",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/role",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/member",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/channel",
  ],
  function (exports_171, context_171) {
    "use strict";
    var collection_ts_1, role_ts_1, member_ts_1, channel_ts_3, createGuild;
    var __moduleName = context_171 && context_171.id;
    return {
      setters: [
        function (collection_ts_1_1) {
          collection_ts_1 = collection_ts_1_1;
        },
        function (role_ts_1_1) {
          role_ts_1 = role_ts_1_1;
        },
        function (member_ts_1_1) {
          member_ts_1 = member_ts_1_1;
        },
        function (channel_ts_3_1) {
          channel_ts_3 = channel_ts_3_1;
        },
      ],
      execute: function () {
        exports_171(
          "createGuild",
          createGuild = (data, shardID) => {
            const guild = {
              ...data,
              /** The shard id that this guild is on */
              shardID,
              /** The owner id of the guild. */
              ownerID: data.owner_id,
              /** The afk channel id for this guild. */
              afkChannelID: data.afk_channel_id,
              /** The amount of time before a user is moved to AFK. */
              afkTimeout: data.afk_timeout,
              /** Whether or not the embed is enabled in this server. */
              embedEnabled: data.embed_enabled,
              /** The channel id for the guild embed in this server. */
              embedChannelID: data.embed_channel_id,
              /** The verification level for this server. */
              verificationLevel: data.verification_level,
              /** The MFA level for this server. */
              mfaLevel: data.mfa_level,
              /** The system channel id for this server. */
              systemChannelID: data.system_channel_id,
              /** The max presences for this server. */
              maxPresences: data.max_presences,
              /** The maximum members in this server. */
              maxMembers: data.max_members,
              /** The vanity URL code for this server. */
              vanityURLCode: data.vanity_url_code,
              /** The premium tier for this server. */
              premiumTier: data.premium_tier,
              /** The subscription count for this server. */
              premiumSubscriptionCount: data.premium_subscription_count,
              /** The preferred language in this server. */
              preferredLocale: data.preferred_locale,
              /** The roles in the guild */
              roles: new collection_ts_1.default(
                data.roles.map((r) => [r.id, role_ts_1.createRole(r)]),
              ),
              /** When this guild was joined at. */
              joinedAt: Date.parse(data.joined_at),
              /** The users in this guild. */
              members: new collection_ts_1.default(),
              /** The channels in the guild */
              channels: new collection_ts_1.default(
                data.channels.map((
                  c,
                ) => [c.id, channel_ts_3.createChannel(c, data.id)]),
              ),
              /** The presences of all the users in the guild. */
              presences: new collection_ts_1.default(
                data.presences.map((p) => [p.user.id, p]),
              ),
              /** The total number of members in this guild. This value is updated as members leave and join the server. However, if you do not have the intent enabled to be able to listen to these events, then this will not be accurate. */
              memberCount: data.member_count || 0,
              /** The Voice State data for each user in a voice channel in this server. */
              voiceStates: new collection_ts_1.default(
                data.voice_states.map((vs) => [vs.user_id, {
                  ...vs,
                  guildID: vs.guild_id,
                  channelID: vs.channel_id,
                  userID: vs.user_id,
                  sessionID: vs.session_id,
                  selfDeaf: vs.self_deaf,
                  selfMute: vs.self_mute,
                  selfStream: vs.self_stream,
                }]),
              ),
            };
            data.members.forEach((m) =>
              guild.members.set(m.user.id, member_ts_1.createMember(m, guild))
            );
            // Remove excess properties to preserve cache.
            delete guild.owner_id;
            delete guild.afk_channel_id;
            delete guild.afk_timeout;
            delete guild.embed_enabled;
            delete guild.embed_channel_id;
            delete guild.verification_level;
            delete guild.mfa_level;
            delete guild.system_channel_id;
            delete guild.max_presences;
            delete guild.max_members;
            delete guild.vanity_url_code;
            delete guild.premium_tier;
            delete guild.premium_subscription_count;
            delete guild.preferred_locale;
            delete guild.joined_at;
            delete guild.member_count;
            delete guild.voice_states;
            return guild;
          },
        );
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/events/guilds",
  ["https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/cache"],
  function (exports_172, context_172) {
    "use strict";
    var cache_ts_3,
      handleInternalGuildCreate,
      handleInternalGuildUpdate,
      handleInternalGuildDelete;
    var __moduleName = context_172 && context_172.id;
    return {
      setters: [
        function (cache_ts_3_1) {
          cache_ts_3 = cache_ts_3_1;
        },
      ],
      execute: function () {
        exports_172(
          "handleInternalGuildCreate",
          handleInternalGuildCreate = (guild) => {
            cache_ts_3.cache.guilds.set(guild.id, guild);
          },
        );
        exports_172(
          "handleInternalGuildUpdate",
          handleInternalGuildUpdate = (guild) => {
            cache_ts_3.cache.guilds.set(guild.id, guild);
          },
        );
        exports_172(
          "handleInternalGuildDelete",
          handleInternalGuildDelete = (guild) => {
            cache_ts_3.cache.guilds.delete(guild.id);
          },
        );
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/message",
  ["https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/cache"],
  function (exports_173, context_173) {
    "use strict";
    var cache_ts_4;
    var __moduleName = context_173 && context_173.id;
    function createMessage(data) {
      const message = {
        ...data,
        channelID: data.channel_id,
        guildID: data.guild_id,
        mentionsEveryone: data.mentions_everyone,
        mentionRoles: data.mention_roles,
        mentionChannels: data.mention_channels,
        webhookID: data.webhook_id,
        messageReference: data.message_reference,
        timestamp: Date.parse(data.timestamp),
        editedTimestamp: data.edited_timestamp
          ? Date.parse(data.edited_timestamp)
          : undefined,
        channel: cache_ts_4.cache.channels.get(data.channel_id),
        guild: () =>
          data.guild_id
            ? cache_ts_4.cache.guilds.get(data.guild_id)
            : undefined,
        member: () => message.guild()?.members.get(data.author.id),
        mentions: () =>
          data.mentions.map((mention) =>
            message.guild()?.members.get(mention.id)
          ),
      };
      // Remove excess properties to preserve cache.
      delete message.channel_id;
      delete message.guild_id;
      delete message.mentions_everyone;
      delete message.mention_channels;
      delete message.mention_roles;
      delete message.webhook_id;
      delete message.message_reference;
      delete message.edited_timestamp;
      return message;
    }
    exports_173("createMessage", createMessage);
    return {
      setters: [
        function (cache_ts_4_1) {
          cache_ts_4 = cache_ts_4_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/options",
  [],
  function (exports_174, context_174) {
    "use strict";
    var Intents;
    var __moduleName = context_174 && context_174.id;
    return {
      setters: [],
      execute: function () {
        (function (Intents) {
          /** Enables the following events:
                 * - GUILD_CREATE
                 * - GUILD_DELETE
                 * - GUILD_ROLE_CREATE
                 * - GUILD_ROLE_UPDATE
                 * - GUILD_ROLE_DELETE
                 * - CHANNEL_CREATE
                 * - CHANNEL_UPDATE
                 * - CHANNEL_DELETE
                 * - CHANNEL_PINS_UPDATE
                 */
          Intents[Intents["GUILDS"] = 1] = "GUILDS";
          /** Enables the following events:
                 * - GUILD_MEMBER_ADD
                 * - GUILD_MEMBER_UPDATE
                 * - GUILD_MEMBER_REMOVE
                 */
          Intents[Intents["GUILD_MEMBERS"] = 2] = "GUILD_MEMBERS";
          /** Enables the following events:
                 * - GUILD_BAN_ADD
                 * - GUILD_BAN_REMOVE
                 */
          Intents[Intents["GUILD_BANS"] = 4] = "GUILD_BANS";
          /** Enables the following events:
                 * - GUILD_EMOJIS_UPDATE
                 */
          Intents[Intents["GUILD_EMOJIS"] = 8] = "GUILD_EMOJIS";
          /** Enables the following events:
                 * - GUILD_INTEGRATIONS_UPDATE
                 */
          Intents[Intents["GUILD_INTEGRATIONS"] = 16] = "GUILD_INTEGRATIONS";
          /** Enables the following events:
                 * - WEBHOOKS_UPDATE
                 */
          Intents[Intents["GUILD_WEBHOOKS"] = 32] = "GUILD_WEBHOOKS";
          /** Enables the following events:
                 * - INVITE_CREATE
                 * - INVITE_DELETE
                 */
          Intents[Intents["GUILD_INVITES"] = 64] = "GUILD_INVITES";
          /** Enables the following events:
                 * - VOICE_STATE_UPDATE
                 */
          Intents[Intents["GUILD_VOICE_STATES"] = 128] = "GUILD_VOICE_STATES";
          /** Enables the following events:
                 * - PRESENCE_UPDATE
                 */
          Intents[Intents["GUILD_PRESENCES"] = 256] = "GUILD_PRESENCES";
          /** Enables the following events:
                 * - MESSAGE_CREATE
                 * - MESSAGE_UPDATE
                 * - MESSAGE_DELETE
                 */
          Intents[Intents["GUILD_MESSAGES"] = 512] = "GUILD_MESSAGES";
          /** Enables the following events:
                 * - MESSAGE_REACTION_ADD
                 * - MESSAGE_REACTION_REMOVE
                 * - MESSAGE_REACTION_REMOVE_ALL
                 * - MESSAGE_REACTION_REMOVE_EMOJI
                 */
          Intents[Intents["GUILD_MESSAGE_REACTIONS"] = 1024] =
            "GUILD_MESSAGE_REACTIONS";
          /** Enables the following events:
                 * - TYPING_START
                 */
          Intents[Intents["GUILD_MESSAGE_TYPING"] = 2048] =
            "GUILD_MESSAGE_TYPING";
          /** Enables the following events:
                 * - CHANNEL_CREATE
                 * - MESSAGE_CREATE
                 * - MESSAGE_UPDATE
                 * - MESSAGE_DELETE
                 * - CHANNEL_PINS_UPDATE
                 */
          Intents[Intents["DIRECT_MESSAGES"] = 4096] = "DIRECT_MESSAGES";
          /** Enables the following events:
                 * - MESSAGE_REACTION_ADD
                 * - MESSAGE_REACTION_REMOVE
                 * - MESSAGE_REACTION_REMOVE_ALL
                 * - MESSAGE_REACTION_REMOVE_EMOJI
                 */
          Intents[Intents["DIRECT_MESSAGE_REACTIONS"] = 8192] =
            "DIRECT_MESSAGE_REACTIONS";
          /** Enables the following events:
                 * - TYPING_START
                 */
          Intents[Intents["DIRECT_MESSAGE_TYPING"] = 16384] =
            "DIRECT_MESSAGE_TYPING";
        })(Intents || (Intents = {}));
        exports_174("Intents", Intents);
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/shardingManager",
  [
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/discord",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/client",
    "https://deno.land/std@0.50.0/async/delay",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/events/channels",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/guild",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/events/guilds",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/cache",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/member",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/role",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/message",
  ],
  function (exports_175, context_175) {
    "use strict";
    var discord_ts_1,
      client_ts_2,
      delay_ts_2,
      channels_ts_1,
      guild_ts_1,
      guilds_ts_1,
      cache_ts_5,
      member_ts_2,
      role_ts_2,
      message_ts_1,
      shardCounter,
      fetchAllMembersProcessingRequests,
      shards,
      createNextShard,
      spawnShards;
    var __moduleName = context_175 && context_175.id;
    function createShardWorker(shardID) {
      const path = new URL("./shard.ts", context_175.meta.url).toString();
      const shard = new Worker(path, { type: "module", deno: true });
      shard.onmessage = (message) => {
        if (message.data.type === "REQUEST_CLIENT_OPTIONS") {
          client_ts_2.identifyPayload.shard = [
            shardID || shardCounter,
            client_ts_2.botGatewayData.shards,
          ];
          shard.postMessage({
            type: "CREATE_SHARD",
            botGatewayData: client_ts_2.botGatewayData,
            identifyPayload: client_ts_2.identifyPayload,
            shardID: shardCounter,
          });
          // Update the shard counter
          shardCounter++;
        } else if (message.data.type === "HANDLE_DISCORD_PAYLOAD") {
          handleDiscordPayload(
            JSON.parse(message.data.payload),
            message.data.shardID,
          );
        } else if (message.data.type === "DEBUG_LOG") {
          client_ts_2.eventHandlers.debug?.(message.data.details);
        }
      };
      shards.push(shard);
    }
    exports_175("createShardWorker", createShardWorker);
    async function handleDiscordPayload(data, shardID) {
      client_ts_2.eventHandlers.raw?.(data);
      switch (data.op) {
        case discord_ts_1.GatewayOpcode.HeartbeatACK:
          // Incase the user wants to listen to heartbeat responses
          return client_ts_2.eventHandlers.heartbeat?.();
        case discord_ts_1.GatewayOpcode.Dispatch:
          if (data.t === "READY") {
            client_ts_2.setBotID(data.d.user.id);
            // Triggered on each shard
            client_ts_2.eventHandlers.ready?.();
            // Wait 5 seconds to spawn next shard
            await delay_ts_2.delay(5000);
            createNextShard = true;
          }
          if (data.t === "CHANNEL_CREATE") {
            return channels_ts_1.handleInternalChannelCreate(data.d);
          }
          if (data.t === "CHANNEL_UPDATE") {
            return channels_ts_1.handleInternalChannelUpdate(data.d);
          }
          if (data.t === "CHANNEL_DELETE") {
            return channels_ts_1.handleInternalChannelDelete(data.d);
          }
          if (data.t === "GUILD_CREATE") {
            const options = data.d;
            // When shards resume they emit GUILD_CREATE again.
            if (cache_ts_5.cache.guilds.has(options.id)) {
              return;
            }
            const guild = guild_ts_1.createGuild(data.d, shardID);
            guilds_ts_1.handleInternalGuildCreate(guild);
            if (cache_ts_5.cache.unavailableGuilds.get(options.id)) {
              cache_ts_5.cache.unavailableGuilds.delete(options.id);
            }
            return client_ts_2.eventHandlers.guildCreate?.(guild);
          }
          if (data.t === "GUILD_UPDATE") {
            const options = data.d;
            const cachedGuild = cache_ts_5.cache.guilds.get(options.id);
            if (!cachedGuild) {
              return;
            }
            const keysToSkip = [
              "roles",
              "guild_hashes",
              "guild_id",
              "max_members",
              "emojis",
            ];
            const changes = Object.entries(options)
              .map(([key, value]) => {
                if (keysToSkip.includes(key)) {
                  return;
                }
                // @ts-ignore
                const cachedValue = cachedGuild[key];
                if (cachedValue !== value) {
                  // Guild create sends undefined and update sends false.
                  if (!cachedValue && !value) {
                    return;
                  }
                  if (Array.isArray(cachedValue) && Array.isArray(value)) {
                    const different = (cachedValue.length !== value.length) ||
                      cachedValue.find((val) => !value.includes(val)) ||
                      value.find((val) => !cachedValue.includes(val));
                    if (!different) {
                      return;
                    }
                  }
                  // This will update the cached guild with the new values
                  // @ts-ignore
                  cachedGuild[key] = value;
                  return { key, oldValue: cachedValue, value };
                }
                return;
              }).filter((change) => change);
            return client_ts_2.eventHandlers.guildUpdate?.(
              cachedGuild,
              changes,
            );
          }
          if (data.t === "GUILD_DELETE") {
            const options = data.d;
            const guild = cache_ts_5.cache.guilds.get(options.id);
            if (!guild) {
              return;
            }
            guild.channels.forEach((channel) =>
              cache_ts_5.cache.channels.delete(channel.id)
            );
            cache_ts_5.cache.messages.forEach((message) => {
              if (message.guildID === guild.id) {
                cache_ts_5.cache.messages.delete(message.id);
              }
            });
            if (options.unavailable) {
              return cache_ts_5.cache.unavailableGuilds.set(
                options.id,
                Date.now(),
              );
            }
            guilds_ts_1.handleInternalGuildDelete(guild);
            return client_ts_2.eventHandlers.guildDelete?.(guild);
          }
          if (
            data.t && ["GUILD_BAN_ADD", "GUILD_BAN_REMOVE"].includes(data.t)
          ) {
            const options = data.d;
            const guild = cache_ts_5.cache.guilds.get(options.guild_id);
            if (!guild) {
              return;
            }
            const member = guild.members.get(options.user.id);
            return data.t === "GUILD_BAN_ADD"
              ? client_ts_2.eventHandlers.guildBanAdd?.(
                guild,
                member || options.user,
              )
              : client_ts_2.eventHandlers.guildBanRemove?.(
                guild,
                member || options.user,
              );
          }
          if (data.t === "GUILD_EMOJIS_UPDATE") {
            const options = data.d;
            const guild = cache_ts_5.cache.guilds.get(options.guild_id);
            if (!guild) {
              return;
            }
            const cachedEmojis = guild.emojis;
            guild.emojis = options.emojis;
            return client_ts_2.eventHandlers.guildEmojisUpdate?.(
              guild,
              options.emojis,
              cachedEmojis,
            );
          }
          if (data.t === "GUILD_MEMBER_ADD") {
            const options = data.d;
            const guild = cache_ts_5.cache.guilds.get(options.guild_id);
            if (!guild) {
              return;
            }
            const memberCount = guild.memberCount + 1;
            guild.memberCount = memberCount;
            const member = member_ts_2.createMember(options, guild);
            guild.members.set(options.user.id, member);
            return client_ts_2.eventHandlers.guildMemberAdd?.(guild, member);
          }
          if (data.t === "GUILD_MEMBER_REMOVE") {
            const options = data.d;
            const guild = cache_ts_5.cache.guilds.get(options.guild_id);
            if (!guild) {
              return;
            }
            const memberCount = guild.memberCount - 1;
            guild.memberCount = memberCount;
            const member = guild.members.get(options.user.id);
            return client_ts_2.eventHandlers.guildMemberRemove?.(
              guild,
              member || options.user,
            );
          }
          if (data.t === "GUILD_MEMBER_UPDATE") {
            const options = data.d;
            const guild = cache_ts_5.cache.guilds.get(options.guild_id);
            if (!guild) {
              return;
            }
            const cachedMember = guild.members.get(options.user.id);
            const newMemberData = {
              ...options,
              premium_since: options.premium_since || undefined,
              joined_at: new Date(cachedMember?.joinedAt || Date.now())
                .toISOString(),
              deaf: cachedMember?.deaf || false,
              mute: cachedMember?.mute || false,
            };
            const member = member_ts_2.createMember(newMemberData, guild);
            guild.members.set(options.user.id, member);
            if (cachedMember?.nick !== options.nick) {
              client_ts_2.eventHandlers.nicknameUpdate?.(
                guild,
                member,
                options.nick,
                cachedMember?.nick,
              );
            }
            const roleIDs = cachedMember?.roles || [];
            roleIDs.forEach((id) => {
              if (!options.roles.includes(id)) {
                client_ts_2.eventHandlers.roleLost?.(guild, member, id);
              }
            });
            options.roles.forEach((id) => {
              if (!roleIDs.includes(id)) {
                client_ts_2.eventHandlers.roleGained?.(guild, member, id);
              }
            });
            return client_ts_2.eventHandlers.guildMemberUpdate?.(
              guild,
              member,
              cachedMember,
            );
          }
          if (data.t === "GUILD_MEMBERS_CHUNK") {
            const options = data.d;
            const guild = cache_ts_5.cache.guilds.get(options.guild_id);
            if (!guild) {
              return;
            }
            options.members.forEach((member) => {
              guild.members.set(
                member.user.id,
                member_ts_2.createMember(member, guild),
              );
            });
            // Check if its necessary to resolve the fetchmembers promise for this chunk or if more chunks will be coming
            if (options.nonce) {
              const resolve = fetchAllMembersProcessingRequests.get(
                options.nonce,
              );
              if (!resolve) {
                return;
              }
              if (options.chunk_index + 1 === options.chunk_count) {
                fetchAllMembersProcessingRequests.delete(options.nonce);
                resolve();
              }
            }
          }
          if (data.t === "GUILD_ROLE_DELETE") {
            const options = data.d;
            const guild = cache_ts_5.cache.guilds.get(options.guild_id);
            if (!guild) {
              return;
            }
            const cachedRole = guild.roles.get(options.role_id);
            guild.roles.delete(options.role_id);
            return client_ts_2.eventHandlers.roleDelete?.(guild, cachedRole);
          }
          if (
            data.t &&
            ["GUILD_ROLE_CREATE", "GUILD_ROLE_UPDATE"]
              .includes(data.t)
          ) {
            const options = data.d;
            const guild = cache_ts_5.cache.guilds.get(options.guild_id);
            if (!guild) {
              return;
            }
            if (data.t === "GUILD_ROLE_CREATE") {
              const role = role_ts_2.createRole(options.role);
              const roles = guild.roles.set(options.role.id, role);
              guild.roles = roles;
              return client_ts_2.eventHandlers.roleCreate?.(guild, role);
            }
            const cachedRole = guild.roles.get(options.role.id);
            if (!cachedRole) {
              return;
            }
            if (data.t === "GUILD_ROLE_UPDATE") {
              const role = role_ts_2.createRole(options.role);
              return client_ts_2.eventHandlers.roleUpdate?.(
                guild,
                role,
                cachedRole,
              );
            }
          }
          if (data.t === "MESSAGE_CREATE") {
            const options = data.d;
            const channel = cache_ts_5.cache.channels.get(options.channel_id);
            if (channel) {
              channel.lastMessageID = options.id;
            }
            const message = message_ts_1.createMessage(options);
            // Cache the message
            cache_ts_5.cache.messages.set(options.id, message);
            const guild = options.guild_id
              ? cache_ts_5.cache.guilds.get(options.guild_id) : undefined;
            if (options.member) {
              // If in a guild cache the author as a member
              guild?.members.set(
                options.author.id,
                member_ts_2.createMember(
                  { ...options.member, user: options.author },
                  guild,
                ),
              );
            }
            options.mentions.forEach((mention) => {
              // Cache the member if its a valid member
              if (mention.member) {
                guild?.members.set(
                  mention.id,
                  member_ts_2.createMember(
                    { ...mention.member, user: mention },
                    guild,
                  ),
                );
              }
            });
            return client_ts_2.eventHandlers.messageCreate?.(message);
          }
          if (
            data.t && ["MESSAGE_DELETE", "MESSAGE_DELETE_BULK"].includes(data.t)
          ) {
            const options = data.d;
            const deletedMessages = data.t === "MESSAGE_DELETE" ? [options.id]
            : data.d.ids;
            const channel = cache_ts_5.cache.channels.get(options.channel_id);
            if (!channel) {
              return;
            }
            deletedMessages.forEach((id) => {
              const message = cache_ts_5.cache.messages.get(id);
              if (!message) {
                return;
              }
              client_ts_2.eventHandlers.messageDelete?.(
                message || { id, channel },
              );
              cache_ts_5.cache.messages.delete(id);
            });
          }
          if (data.t === "MESSAGE_UPDATE") {
            const options = data.d;
            const channel = cache_ts_5.cache.channels.get(options.channel_id);
            if (!channel) {
              return;
            }
            const cachedMessage = cache_ts_5.cache.messages.get(options.id);
            if (!cachedMessage) {
              return;
            }
            const oldMessage = {
              attachments: cachedMessage.attachments,
              content: cachedMessage.content,
              embeds: cachedMessage.embeds,
              editedTimestamp: cachedMessage.editedTimestamp,
              tts: cachedMessage.tts,
              pinned: cachedMessage.pinned,
            };
            // Messages with embeds can trigger update but they wont have edited_timestamp
            if (
              !options.edited_timestamp ||
              (cachedMessage.content !== options.content)
            ) {
              return;
            }
            return client_ts_2.eventHandlers.messageUpdate?.(
              cachedMessage,
              oldMessage,
            );
          }
          if (
            data.t &&
            ["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"].includes(data.t)
          ) {
            const options = data.d;
            const message = cache_ts_5.cache.messages.get(options.message_id);
            const isAdd = data.t === "MESSAGE_REACTION_ADD";
            if (message) {
              const previousReactions = message.reactions;
              const reactionExisted = previousReactions?.find((reaction) =>
                reaction.emoji.id === options.emoji.id &&
                reaction.emoji.name === options.emoji.name
              );
              if (reactionExisted) {
                reactionExisted.count = isAdd
                  ? reactionExisted.count + 1
                  : reactionExisted.count - 1;
              } else {
                const newReaction = {
                  count: 1,
                  me: options.user_id === client_ts_2.botID,
                  emoji: {
                    ...options.emoji,
                    id: options.emoji.id || undefined,
                  },
                };
                message.reactions = message.reactions
                  ? [...message.reactions, newReaction] : [newReaction];
              }
              cache_ts_5.cache.messages.set(options.message_id, message);
            }
            if (options.member && options.guild_id) {
              const guild = cache_ts_5.cache.guilds.get(options.guild_id);
              guild?.members.set(
                options.member.user.id,
                member_ts_2.createMember(options.member, guild),
              );
            }
            return isAdd
              ? client_ts_2.eventHandlers.reactionAdd?.(
                message || options,
                options.emoji,
                options.user_id,
              )
              : client_ts_2.eventHandlers.reactionRemove?.(
                message || options,
                options.emoji,
                options.user_id,
              );
          }
          if (data.t === "MESSAGE_REACTION_REMOVE_ALL") {
            return client_ts_2.eventHandlers.reactionRemoveAll?.(data.d);
          }
          if (data.t === "MESSAGE_REACTION_REMOVE_EMOJI") {
            return client_ts_2.eventHandlers.reactionRemoveEmoji?.(data.d);
          }
          if (data.t === "PRESENCE_UPDATE") {
            return client_ts_2.eventHandlers.presenceUpdate?.(data.d);
          }
          if (data.t === "TYPING_START") {
            return client_ts_2.eventHandlers.typingStart?.(data.d);
          }
          if (data.t === "USER_UPDATE") {
            const userData = data.d;
            cache_ts_5.cache.guilds.forEach((guild) => {
              const member = guild.members.get(userData.id);
              if (!member) {
                return;
              }
              // member.author = userData;
              Object.entries(userData).forEach(([key, value]) => {
                // @ts-ignore
                if (member[key] === value) {
                  return;
                }
                // @ts-ignore
                member[key] = value;
              });
            });
            return client_ts_2.eventHandlers.botUpdate?.(userData);
          }
          if (data.t === "VOICE_STATE_UPDATE") {
            const payload = data.d;
            if (!payload.guild_id) {
              return;
            }
            const guild = cache_ts_5.cache.guilds.get(payload.guild_id);
            if (!guild) {
              return;
            }
            const member = guild.members.get(payload.user_id) ||
              (payload.member ? member_ts_2.createMember(payload.member, guild)
              : undefined);
            if (!member) {
              return;
            }
            // No cached state before so lets make one for em
            const cachedState = guild.voiceStates.get(payload.user_id);
            if (!cachedState) {
              guild.voiceStates.set(payload.user_id, {
                ...payload,
                guildID: payload.guild_id,
                channelID: payload.channel_id,
                userID: payload.user_id,
                sessionID: payload.session_id,
                selfDeaf: payload.self_deaf,
                selfMute: payload.self_mute,
                selfStream: payload.self_stream,
              });
            }
            if (cachedState?.channelID !== payload.channel_id) {
              // Either joined or moved channels
              if (payload.channel_id) {
                cachedState?.channelID
                  ? // Was in a channel before
                    client_ts_2.eventHandlers.voiceChannelSwitch?.(
                      member,
                      payload.channel_id,
                      cachedState.channelID,
                    )
                  : // Was not in a channel before so user just joined
                    client_ts_2.eventHandlers.voiceChannelJoin?.(
                      member,
                      payload.channel_id,
                    );
              } // Left the channel
              else if (cachedState?.channelID) {
                client_ts_2.eventHandlers.voiceChannelLeave?.(
                  member,
                  cachedState.channelID,
                );
              }
            }
            return client_ts_2.eventHandlers.voiceStateUpdate?.(
              member,
              payload,
            );
          }
          if (data.t === "WEBHOOKS_UPDATE") {
            const options = data.d;
            return client_ts_2.eventHandlers.webhooksUpdate?.(
              options.channel_id,
              options.guild_id,
            );
          }
          return;
        default:
          return;
      }
    }
    async function requestAllMembers(guild, resolve, options) {
      const nonce = Math.random().toString();
      fetchAllMembersProcessingRequests.set(nonce, resolve);
      shards[guild.shardID].postMessage({
        type: "FETCH_MEMBERS",
        guildID: guild.id,
        nonce,
        options,
      });
    }
    exports_175("requestAllMembers", requestAllMembers);
    function sendGatewayCommand(type, payload) {
      shards.forEach((shard) => {
        shard.postMessage({
          type,
          ...payload,
        });
      });
    }
    exports_175("sendGatewayCommand", sendGatewayCommand);
    return {
      setters: [
        function (discord_ts_1_1) {
          discord_ts_1 = discord_ts_1_1;
        },
        function (client_ts_2_1) {
          client_ts_2 = client_ts_2_1;
        },
        function (delay_ts_2_1) {
          delay_ts_2 = delay_ts_2_1;
        },
        function (channels_ts_1_1) {
          channels_ts_1 = channels_ts_1_1;
        },
        function (guild_ts_1_1) {
          guild_ts_1 = guild_ts_1_1;
        },
        function (guilds_ts_1_1) {
          guilds_ts_1 = guilds_ts_1_1;
        },
        function (cache_ts_5_1) {
          cache_ts_5 = cache_ts_5_1;
        },
        function (member_ts_2_1) {
          member_ts_2 = member_ts_2_1;
        },
        function (role_ts_2_1) {
          role_ts_2 = role_ts_2_1;
        },
        function (message_ts_1_1) {
          message_ts_1 = message_ts_1_1;
        },
      ],
      execute: function () {
        shardCounter = 0;
        fetchAllMembersProcessingRequests = new Map();
        shards = [];
        createNextShard = true;
        exports_175(
          "spawnShards",
          spawnShards = async (data, payload, id = 1) => {
            if ((data.shards === 1 && id === 1) || id <= data.shards) {
              if (createNextShard) {
                createNextShard = false;
                createShardWorker();
                spawnShards(data, payload, id + 1);
              } else {
                await delay_ts_2.delay(1000);
                spawnShards(data, payload, id);
              }
            }
          },
        );
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/utils",
  [
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/activity",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/shardingManager",
  ],
  function (exports_176, context_176) {
    "use strict";
    var activity_ts_1, shardingManager_ts_1, sleep;
    var __moduleName = context_176 && context_176.id;
    function editBotsStatus(
      status,
      name,
      type = activity_ts_1.ActivityType.Game,
    ) {
      shardingManager_ts_1.sendGatewayCommand(
        "EDIT_BOTS_STATUS",
        { status, game: { name, type } },
      );
    }
    exports_176("editBotsStatus", editBotsStatus);
    function chooseRandom(array) {
      return array[Math.floor(Math.random() * array.length)];
    }
    exports_176("chooseRandom", chooseRandom);
    return {
      setters: [
        function (activity_ts_1_1) {
          activity_ts_1 = activity_ts_1_1;
        },
        function (shardingManager_ts_1_1) {
          shardingManager_ts_1 = shardingManager_ts_1_1;
        },
      ],
      execute: function () {
        exports_176(
          "sleep",
          sleep = (timeout) => {
            return new Promise((resolve) => setTimeout(resolve, timeout));
          },
        );
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/collection",
  ["https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/utils"],
  function (exports_177, context_177) {
    "use strict";
    var utils_ts_3, Collection;
    var __moduleName = context_177 && context_177.id;
    return {
      setters: [
        function (utils_ts_3_1) {
          utils_ts_3 = utils_ts_3_1;
        },
      ],
      execute: function () {
        Collection = class Collection extends Map {
          set(key, value) {
            // When this collection is maxSizeed make sure we can add first
            if (this.maxSize || this.maxSize === 0) {
              if (this.size >= this.maxSize) {
                return this;
              }
            }
            return super.set(key, value);
          }
          array() {
            return [...this.values()];
          }
          first() {
            return this.values().next().value;
          }
          last() {
            return [...this.values()][this.size - 1];
          }
          random() {
            return utils_ts_3.chooseRandom([...this.values()]);
          }
          find(callback) {
            for (const key of this.keys()) {
              const value = this.get(key);
              if (callback(value, key)) {
                return value;
              }
            }
            // If nothing matched
            return;
          }
          filter(callback) {
            const relevant = new Collection();
            this.forEach((value, key) => {
              if (callback(value, key)) {
                relevant.set(key, value);
              }
            });
            return relevant;
          }
          map(callback) {
            const results = [];
            for (const key of this.keys()) {
              const value = this.get(key);
              results.push(callback(value, key));
            }
            return results;
          }
          some(callback) {
            for (const key of this.keys()) {
              const value = this.get(key);
              if (callback(value, key)) {
                return true;
              }
            }
            return false;
          }
          every(callback) {
            for (const key of this.keys()) {
              const value = this.get(key);
              if (!callback(value, key)) {
                return false;
              }
            }
            return true;
          }
          reduce(callback, initialValue) {
            let accumulator = initialValue;
            for (const key of this.keys()) {
              const value = this.get(key);
              accumulator = callback(accumulator, value, key);
            }
            return accumulator;
          }
        };
        exports_177("default", Collection);
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/cache",
  [
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/collection",
    "https://deno.land/std@0.50.0/async/delay",
  ],
  function (exports_178, context_178) {
    "use strict";
    var collection_ts_2, delay_ts_3, cache;
    var __moduleName = context_178 && context_178.id;
    async function cleanMessageCache() {
      // Find all messages for each channel and if more than 100 we need to remove the oldest messages.
      const messagesPerChannel = new Map();
      for (const message of cache.messages.values()) {
        if (
          // If the guild isn't in cache the message is useless to cache
          (message.guildID && !cache.guilds.has(message.guildID)) ||
          // If the channel isn't in cache the message is useless in cache
          !cache.channels.has(message.channelID)
        ) {
          cache.messages.delete(message.id);
        }
        const channel = messagesPerChannel.get(message.channelID);
        if (!channel) {
          messagesPerChannel.set(message.channelID, [message]);
        } else {
          channel.push(message);
        }
      }
      messagesPerChannel.forEach((messages) => {
        if (messages.length < 100) {
          return;
        }
        // This channel has more than 100 messages in cache. Delete the oldest
        const sortedMessages = messages.sort((a, b) =>
          b.timestamp - a.timestamp
        );
        sortedMessages.slice(100).forEach((message) =>
          cache.messages.delete(message.id)
        );
      });
      // Check once per minute
      await delay_ts_3.delay(60000);
      cleanMessageCache();
    }
    return {
      setters: [
        function (collection_ts_2_1) {
          collection_ts_2 = collection_ts_2_1;
        },
        function (delay_ts_3_1) {
          delay_ts_3 = delay_ts_3_1;
        },
      ],
      execute: function () {
        exports_178(
          "cache",
          cache = {
            guilds: new collection_ts_2.default(),
            channels: new collection_ts_2.default(),
            messages: new collection_ts_2.default(),
            unavailableGuilds: new collection_ts_2.default(),
          },
        );
        cleanMessageCache();
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/permissions",
  [
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/permission",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/cache",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/client",
  ],
  function (exports_179, context_179) {
    "use strict";
    var permission_ts_1, cache_ts_6, client_ts_3;
    var __moduleName = context_179 && context_179.id;
    /** Checks if the member has this permission. If the member is an owner or has admin perms it will always be true. */
    function memberHasPermission(memberID, guild, memberRoleIDs, permissions) {
      if (memberID === guild.ownerID) {
        return true;
      }
      const permissionBits = memberRoleIDs.map((id) =>
        guild.roles.get(id)?.permissions || 0
      )
        .reduce((bits, permissions) => {
          bits |= permissions;
          return bits;
        }, 0);
      if (permissionBits & permission_ts_1.Permissions.ADMINISTRATOR) {
        return true;
      }
      return permissions.every((permission) =>
        permissionBits & permission_ts_1.Permissions[permission]
      );
    }
    exports_179("memberHasPermission", memberHasPermission);
    function botHasPermission(guildID, permissions) {
      const guild = cache_ts_6.cache.guilds.get(guildID);
      if (!guild) {
        return false;
      }
      const member = guild.members.get(client_ts_3.botID);
      if (!member) {
        return false;
      }
      const permissionBits = member.roles
        .map((id) => guild.roles.get(id))
        .reduce((bits, data) => {
          bits |= data.permissions;
          return bits;
        }, 0);
      if (permissionBits & permission_ts_1.Permissions.ADMINISTRATOR) {
        return true;
      }
      return permissions.every((permission) => permissionBits & permission);
    }
    exports_179("botHasPermission", botHasPermission);
    function calculatePermissions(permissionBits) {
      return Object.keys(permission_ts_1.Permissions).filter((perm) => {
        return permissionBits & permission_ts_1.Permissions[perm];
      });
    }
    exports_179("calculatePermissions", calculatePermissions);
    function highestRole(guildID, memberID) {
      const guild = cache_ts_6.cache.guilds.get(guildID);
      if (!guild) {
        return;
      }
      const member = guild?.members.get(memberID);
      if (!member) {
        return;
      }
      let memberHighestRole;
      for (const roleID of member.roles) {
        const role = guild.roles.get(roleID);
        if (!role) {
          continue;
        }
        if (!memberHighestRole || memberHighestRole.position < role.position) {
          memberHighestRole = role;
        }
      }
      return memberHighestRole || guild.roles.get(guild.id);
    }
    exports_179("highestRole", highestRole);
    function higherRolePosition(guildID, roleID, otherRoleID) {
      const guild = cache_ts_6.cache.guilds.get(guildID);
      if (!guild) {
        return;
      }
      const role = guild.roles.get(roleID);
      const otherRole = guild.roles.get(otherRoleID);
      if (!role || !otherRole) {
        return;
      }
      return role.position > otherRole.position;
    }
    exports_179("higherRolePosition", higherRolePosition);
    return {
      setters: [
        function (permission_ts_1_1) {
          permission_ts_1 = permission_ts_1_1;
        },
        function (cache_ts_6_1) {
          cache_ts_6 = cache_ts_6_1;
        },
        function (client_ts_3_1) {
          client_ts_3 = client_ts_3_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/channel",
  [
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/permissions",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/cache",
  ],
  function (exports_180, context_180) {
    "use strict";
    var permissions_ts_1, cache_ts_7;
    var __moduleName = context_180 && context_180.id;
    function createChannel(data, guildID) {
      const channel = {
        ...data,
        /** The guild id of the channel if it is a guild channel. */
        guildID: guildID || data.guild_id,
        /** The id of the last message sent in this channel */
        lastMessageID: data.last_message_id,
        /** The amount of users allowed in this voice channel. */
        userLimit: data.user_limit,
        /** The rate limit(slowmode) in this text channel that users can send messages. */
        rateLimitPerUser: data.rate_limit_per_user,
        /** The category id for this channel */
        parentID: data.parent_id,
        /** The last time when a message was pinned in this channel */
        lastPinTimestamp: data.last_pin_timestamp,
        /** The permission overwrites for this channel */
        permissions: data.permission_overwrites
          ? data.permission_overwrites.map((perm) => ({
            ...perm,
            allow: permissions_ts_1.calculatePermissions(perm.allow),
            deny: permissions_ts_1.calculatePermissions(perm.deny),
          }))
          : [],
        /** Whether this channel is nsfw or not */
        nsfw: data.nsfw || false,
        /** The mention of the channel */
        mention: `<#${data.id}>`,
      };
      // Remove excess properties to preserve cache.
      delete channel.guild_id;
      delete channel.last_message_id;
      delete channel.rate_limit_per_user;
      delete channel.last_pin_timestamp;
      delete channel.user_limit;
      cache_ts_7.cache.channels.set(data.id, channel);
      return channel;
    }
    exports_180("createChannel", createChannel);
    return {
      setters: [
        function (permissions_ts_1_1) {
          permissions_ts_1 = permissions_ts_1_1;
        },
        function (cache_ts_7_1) {
          cache_ts_7 = cache_ts_7_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/message",
  [],
  function (exports_181, context_181) {
    "use strict";
    var Message_Types, Activity_Types, Message_Flags;
    var __moduleName = context_181 && context_181.id;
    return {
      setters: [],
      execute: function () {
        (function (Message_Types) {
          Message_Types[Message_Types["DEFAULT"] = 0] = "DEFAULT";
          Message_Types[Message_Types["RECIPIENT_ADD"] = 1] = "RECIPIENT_ADD";
          Message_Types[Message_Types["RECIPIENT_REMOVE"] = 2] =
            "RECIPIENT_REMOVE";
          Message_Types[Message_Types["CALL"] = 3] = "CALL";
          Message_Types[Message_Types["CHANNEL_NAME_CHANGE"] = 4] =
            "CHANNEL_NAME_CHANGE";
          Message_Types[Message_Types["CHANNEL_ICON_CHANGE"] = 5] =
            "CHANNEL_ICON_CHANGE";
          Message_Types[Message_Types["CHANNEL_PINNED_MESSAGE"] = 6] =
            "CHANNEL_PINNED_MESSAGE";
          Message_Types[Message_Types["GUILD_MEMBER_JOIN"] = 7] =
            "GUILD_MEMBER_JOIN";
          Message_Types[Message_Types["USER_PREMIUM_GUILD_SUBSCRIPTION"] = 8] =
            "USER_PREMIUM_GUILD_SUBSCRIPTION";
          Message_Types[
            Message_Types["USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1"] = 9
          ] = "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1";
          Message_Types[
            Message_Types["USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2"] = 10
          ] = "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2";
          Message_Types[
            Message_Types["USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3"] = 11
          ] = "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3";
          Message_Types[Message_Types["CHANNEL_FOLLOW_ADD"] = 12] =
            "CHANNEL_FOLLOW_ADD";
        })(Message_Types || (Message_Types = {}));
        exports_181("Message_Types", Message_Types);
        (function (Activity_Types) {
          Activity_Types[Activity_Types["JOIN"] = 1] = "JOIN";
          Activity_Types[Activity_Types["SPECTATE"] = 2] = "SPECTATE";
          Activity_Types[Activity_Types["LISTEN"] = 3] = "LISTEN";
          Activity_Types[Activity_Types["JOIN_REQUEST"] = 5] = "JOIN_REQUEST";
        })(Activity_Types || (Activity_Types = {}));
        exports_181("Activity_Types", Activity_Types);
        (function (Message_Flags) {
          Message_Flags[Message_Flags["CROSSPOSTED"] = 1] = "CROSSPOSTED";
          Message_Flags[Message_Flags["IS_CROSSPOST"] = 2] = "IS_CROSSPOST";
          Message_Flags[Message_Flags["SUPPRESS_EMBEDS"] = 4] =
            "SUPPRESS_EMBEDS";
          Message_Flags[Message_Flags["SOURCE_MESSAGE_DELETED"] = 8] =
            "SOURCE_MESSAGE_DELETED";
          Message_Flags[Message_Flags["URGENT"] = 16] = "URGENT";
        })(Message_Flags || (Message_Flags = {}));
        exports_181("Message_Flags", Message_Flags);
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/discord",
  [],
  function (exports_182, context_182) {
    "use strict";
    var GatewayOpcode,
      GatewayCloseEventCode,
      VoiceOpcode,
      VoiceCloseEventCode,
      HttpResponseCode,
      JSONErrorCode,
      StatusType;
    var __moduleName = context_182 && context_182.id;
    return {
      setters: [],
      execute: function () {
        (function (GatewayOpcode) {
          GatewayOpcode[GatewayOpcode["Dispatch"] = 0] = "Dispatch";
          GatewayOpcode[GatewayOpcode["Heartbeat"] = 1] = "Heartbeat";
          GatewayOpcode[GatewayOpcode["Identify"] = 2] = "Identify";
          GatewayOpcode[GatewayOpcode["StatusUpdate"] = 3] = "StatusUpdate";
          GatewayOpcode[GatewayOpcode["VoiceStateUpdate"] = 4] =
            "VoiceStateUpdate";
          GatewayOpcode[GatewayOpcode["Resume"] = 6] = "Resume";
          GatewayOpcode[GatewayOpcode["Reconnect"] = 7] = "Reconnect";
          GatewayOpcode[GatewayOpcode["RequestGuildMembers"] = 8] =
            "RequestGuildMembers";
          GatewayOpcode[GatewayOpcode["InvalidSession"] = 9] = "InvalidSession";
          GatewayOpcode[GatewayOpcode["Hello"] = 10] = "Hello";
          GatewayOpcode[GatewayOpcode["HeartbeatACK"] = 11] = "HeartbeatACK";
        })(GatewayOpcode || (GatewayOpcode = {}));
        exports_182("GatewayOpcode", GatewayOpcode);
        (function (GatewayCloseEventCode) {
          GatewayCloseEventCode[GatewayCloseEventCode["UnknownError"] = 4000] =
            "UnknownError";
          GatewayCloseEventCode[GatewayCloseEventCode["UnknownOpcode"] = 4001] =
            "UnknownOpcode";
          GatewayCloseEventCode[GatewayCloseEventCode["DecodeError"] = 4002] =
            "DecodeError";
          GatewayCloseEventCode[
            GatewayCloseEventCode["NotAuthenticated"] = 4003
          ] = "NotAuthenticated";
          GatewayCloseEventCode[
            GatewayCloseEventCode["AuthenticationFailed"] = 4004
          ] = "AuthenticationFailed";
          GatewayCloseEventCode[
            GatewayCloseEventCode["AlreadyAuthenticated"] = 4005
          ] = "AlreadyAuthenticated";
          GatewayCloseEventCode[GatewayCloseEventCode["InvalidSeq"] = 4007] =
            "InvalidSeq";
          GatewayCloseEventCode[GatewayCloseEventCode["RateLimited"] = 4008] =
            "RateLimited";
          GatewayCloseEventCode[
            GatewayCloseEventCode["SessionTimeout"] = 4009
          ] = "SessionTimeout";
          GatewayCloseEventCode[GatewayCloseEventCode["InvalidShard"] = 4010] =
            "InvalidShard";
          GatewayCloseEventCode[
            GatewayCloseEventCode["ShardingRequired"] = 4011
          ] = "ShardingRequired";
        })(GatewayCloseEventCode || (GatewayCloseEventCode = {}));
        exports_182("GatewayCloseEventCode", GatewayCloseEventCode);
        (function (VoiceOpcode) {
          VoiceOpcode[VoiceOpcode["Identify"] = 0] = "Identify";
          VoiceOpcode[VoiceOpcode["SelectProtocol"] = 1] = "SelectProtocol";
          VoiceOpcode[VoiceOpcode["Ready"] = 2] = "Ready";
          VoiceOpcode[VoiceOpcode["Heartbeat"] = 3] = "Heartbeat";
          VoiceOpcode[VoiceOpcode["SessionDescription"] = 4] =
            "SessionDescription";
          VoiceOpcode[VoiceOpcode["Speaking"] = 5] = "Speaking";
          VoiceOpcode[VoiceOpcode["HeartbeatACK"] = 6] = "HeartbeatACK";
          VoiceOpcode[VoiceOpcode["Resume"] = 7] = "Resume";
          VoiceOpcode[VoiceOpcode["Hello"] = 8] = "Hello";
          VoiceOpcode[VoiceOpcode["Resumed"] = 9] = "Resumed";
          VoiceOpcode[VoiceOpcode["ClientDisconnect"] = 13] =
            "ClientDisconnect";
        })(VoiceOpcode || (VoiceOpcode = {}));
        exports_182("VoiceOpcode", VoiceOpcode);
        (function (VoiceCloseEventCode) {
          VoiceCloseEventCode[VoiceCloseEventCode["UnknownOpcode"] = 4001] =
            "UnknownOpcode";
          VoiceCloseEventCode[VoiceCloseEventCode["NotAuthenticated"] = 4003] =
            "NotAuthenticated";
          VoiceCloseEventCode[
            VoiceCloseEventCode["AuthenticationFailed"] = 4004
          ] = "AuthenticationFailed";
          VoiceCloseEventCode[
            VoiceCloseEventCode["AlreadyAuthenticated"] = 4005
          ] = "AlreadyAuthenticated";
          VoiceCloseEventCode[
            VoiceCloseEventCode["SessionNoLongerValid"] = 4006
          ] = "SessionNoLongerValid";
          VoiceCloseEventCode[VoiceCloseEventCode["SessionTimeout"] = 4009] =
            "SessionTimeout";
          VoiceCloseEventCode[VoiceCloseEventCode["ServerNotFound"] = 4011] =
            "ServerNotFound";
          VoiceCloseEventCode[VoiceCloseEventCode["UnknownProtocol"] = 4012] =
            "UnknownProtocol";
          VoiceCloseEventCode[VoiceCloseEventCode["Disconnected"] = 4014] =
            "Disconnected";
          VoiceCloseEventCode[
            VoiceCloseEventCode["VoiceServerCrashed"] = 4015
          ] = "VoiceServerCrashed";
          VoiceCloseEventCode[
            VoiceCloseEventCode["UnknownEncryptionMode"] = 4016
          ] = "UnknownEncryptionMode";
        })(VoiceCloseEventCode || (VoiceCloseEventCode = {}));
        exports_182("VoiceCloseEventCode", VoiceCloseEventCode);
        (function (HttpResponseCode) {
          HttpResponseCode[HttpResponseCode["Ok"] = 200] = "Ok";
          HttpResponseCode[HttpResponseCode["Created"] = 201] = "Created";
          HttpResponseCode[HttpResponseCode["NoContent"] = 204] = "NoContent";
          HttpResponseCode[HttpResponseCode["NotModified"] = 304] =
            "NotModified";
          HttpResponseCode[HttpResponseCode["BadRequest"] = 400] = "BadRequest";
          HttpResponseCode[HttpResponseCode["Unauthorized"] = 401] =
            "Unauthorized";
          HttpResponseCode[HttpResponseCode["Forbidden"] = 403] = "Forbidden";
          HttpResponseCode[HttpResponseCode["NotFound"] = 404] = "NotFound";
          HttpResponseCode[HttpResponseCode["MethodNotAllowed"] = 405] =
            "MethodNotAllowed";
          HttpResponseCode[HttpResponseCode["TooManyRequests"] = 429] =
            "TooManyRequests";
          HttpResponseCode[HttpResponseCode["GatewayUnavailable"] = 502] =
            "GatewayUnavailable";
          // ServerError left untyped because it's 5xx.
        })(HttpResponseCode || (HttpResponseCode = {}));
        exports_182("HttpResponseCode", HttpResponseCode);
        (function (JSONErrorCode) {
          JSONErrorCode[JSONErrorCode["UnknownAccount"] = 10001] =
            "UnknownAccount";
          JSONErrorCode[JSONErrorCode["UnknownApplication"] = 10002] =
            "UnknownApplication";
          JSONErrorCode[JSONErrorCode["UnknownChannel"] = 10003] =
            "UnknownChannel";
          JSONErrorCode[JSONErrorCode["UnknownGuild"] = 10004] = "UnknownGuild";
          JSONErrorCode[JSONErrorCode["UnknownIntegration"] = 10005] =
            "UnknownIntegration";
          JSONErrorCode[JSONErrorCode["UnknownInvite"] = 10006] =
            "UnknownInvite";
          JSONErrorCode[JSONErrorCode["UnknownMember"] = 10007] =
            "UnknownMember";
          JSONErrorCode[JSONErrorCode["UnknownMessge"] = 10008] =
            "UnknownMessge";
          JSONErrorCode[JSONErrorCode["UnknownOverwrite"] = 10009] =
            "UnknownOverwrite";
          JSONErrorCode[JSONErrorCode["UnknownProvider"] = 10010] =
            "UnknownProvider";
          JSONErrorCode[JSONErrorCode["UnknownRole"] = 10011] = "UnknownRole";
          JSONErrorCode[JSONErrorCode["UnknownToken"] = 10012] = "UnknownToken";
          JSONErrorCode[JSONErrorCode["UnknownUser"] = 10013] = "UnknownUser";
          JSONErrorCode[JSONErrorCode["UnknownEmoji"] = 10014] = "UnknownEmoji";
          JSONErrorCode[JSONErrorCode["UnknownWebhook"] = 10015] =
            "UnknownWebhook";
          JSONErrorCode[JSONErrorCode["BotsCannotUse"] = 20001] =
            "BotsCannotUse";
          JSONErrorCode[JSONErrorCode["OnlyBotsCanUse"] = 20002] =
            "OnlyBotsCanUse";
          JSONErrorCode[JSONErrorCode["MaxGuildsReached"] = 30001] =
            "MaxGuildsReached";
          JSONErrorCode[JSONErrorCode["MaxFriendsReached"] = 30002] =
            "MaxFriendsReached";
          JSONErrorCode[JSONErrorCode["MaxPinsReached"] = 30003] =
            "MaxPinsReached";
          JSONErrorCode[JSONErrorCode["MaxGuildRolesReached"] = 30005] =
            "MaxGuildRolesReached";
          JSONErrorCode[JSONErrorCode["MaxReactionsReached"] = 30010] =
            "MaxReactionsReached";
          JSONErrorCode[JSONErrorCode["MaxGuildChannelsReached"] = 30013] =
            "MaxGuildChannelsReached";
          JSONErrorCode[JSONErrorCode["MaxInvitesReached"] = 30016] =
            "MaxInvitesReached";
          JSONErrorCode[JSONErrorCode["Unathorized"] = 40001] = "Unathorized";
          JSONErrorCode[JSONErrorCode["UserIsBannedFromGuild"] = 40007] =
            "UserIsBannedFromGuild";
          JSONErrorCode[JSONErrorCode["MissingAccess"] = 50001] =
            "MissingAccess";
          JSONErrorCode[JSONErrorCode["InvalidAccountType"] = 50002] =
            "InvalidAccountType";
          JSONErrorCode[JSONErrorCode["CannotExecuteOnDMChannel"] = 50003] =
            "CannotExecuteOnDMChannel";
          JSONErrorCode[JSONErrorCode["WidgetDisabled"] = 50004] =
            "WidgetDisabled";
          JSONErrorCode[
            JSONErrorCode["CannotEditMessageByAnotherUser"] = 50005
          ] = "CannotEditMessageByAnotherUser";
          JSONErrorCode[JSONErrorCode["CannotSendEmptyMessage"] = 50006] =
            "CannotSendEmptyMessage";
          JSONErrorCode[JSONErrorCode["CannotSendMessageToUser"] = 50007] =
            "CannotSendMessageToUser";
          JSONErrorCode[
            JSONErrorCode["CannotSendMessageInVoiceChannel"] = 50008
          ] = "CannotSendMessageInVoiceChannel";
          JSONErrorCode[JSONErrorCode["ChannelVerificationTooHigh"] = 50009] =
            "ChannelVerificationTooHigh";
          JSONErrorCode[JSONErrorCode["OAuth2ApplicationNoBot"] = 50010] =
            "OAuth2ApplicationNoBot";
          JSONErrorCode[
            JSONErrorCode["OAuth2ApplicationLimitReached"] = 50011
          ] = "OAuth2ApplicationLimitReached";
          JSONErrorCode[JSONErrorCode["InvalidOAuthState"] = 50012] =
            "InvalidOAuthState";
          JSONErrorCode[JSONErrorCode["MissingPermissions"] = 50013] =
            "MissingPermissions";
          JSONErrorCode[JSONErrorCode["InvalidAuthenticationToken"] = 50014] =
            "InvalidAuthenticationToken";
          JSONErrorCode[JSONErrorCode["NoteIsTooLong"] = 50015] =
            "NoteIsTooLong";
          JSONErrorCode[
            JSONErrorCode["TooFewOrTooManyMessagesToDelete"] = 50016
          ] = "TooFewOrTooManyMessagesToDelete";
          JSONErrorCode[
            JSONErrorCode["MessageCanOnlyBePinnedInParentChannel"] = 50019
          ] = "MessageCanOnlyBePinnedInParentChannel";
          JSONErrorCode[JSONErrorCode["InviteCodeTakenOrInvalid"] = 50020] =
            "InviteCodeTakenOrInvalid";
          JSONErrorCode[JSONErrorCode["CannotExecuteOnSystemMessage"] = 50021] =
            "CannotExecuteOnSystemMessage";
          JSONErrorCode[JSONErrorCode["InvalidOAuth2AccessToken"] = 50022] =
            "InvalidOAuth2AccessToken";
          JSONErrorCode[
            JSONErrorCode["MessageProvidedTooOldToBulkDelet"] = 50034
          ] = "MessageProvidedTooOldToBulkDelet";
          JSONErrorCode[JSONErrorCode["InvalidFormBody"] = 50035] =
            "InvalidFormBody";
          JSONErrorCode[
            JSONErrorCode["InviteAcceptedToGuildApplicationBotNotIn"] = 50036
          ] = "InviteAcceptedToGuildApplicationBotNotIn";
          JSONErrorCode[JSONErrorCode["InvalidAPIVersion"] = 50041] =
            "InvalidAPIVersion";
          JSONErrorCode[JSONErrorCode["ReactionBlocked"] = 90001] =
            "ReactionBlocked";
          JSONErrorCode[JSONErrorCode["ResourceOverloaded"] = 130000] =
            "ResourceOverloaded";
        })(JSONErrorCode || (JSONErrorCode = {}));
        exports_182("JSONErrorCode", JSONErrorCode);
        (function (StatusType) {
          StatusType["Online"] = "online";
          StatusType["DoNotDisturb"] = "dnd";
          StatusType["Idle"] = "idle";
          StatusType["Invisible"] = "invisible";
          StatusType["Offline"] = "offline";
        })(StatusType || (StatusType = {}));
        exports_182("StatusType", StatusType);
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/fetch",
  [],
  function (exports_183, context_183) {
    "use strict";
    var __moduleName = context_183 && context_183.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/errors",
  [],
  function (exports_184, context_184) {
    "use strict";
    var Errors;
    var __moduleName = context_184 && context_184.id;
    return {
      setters: [],
      execute: function () {
        (function (Errors) {
          Errors["MISSING_SEND_MESSAGES"] = "MISSING_SEND_MESSAGES";
          Errors["MISSING_MANAGE_ROLES"] = "MISSING_MANAGE_ROLES";
          Errors["MISSING_KICK_MEMBERS"] = "MISSING_KICK_MEMBERS";
          Errors["MISSING_VIEW_CHANNEL"] = "MISSING_VIEW_CHANNEL";
          Errors["MISSING_READ_MESSAGE_HISTORY"] =
            "MISSING_READ_MESSAGE_HISTORY";
          Errors["MISSING_MANAGE_NICKNAMES"] = "MISSING_MANAGE_NICKNAMES";
          Errors["MISSING_MUTE_MEMBERS"] = "MISSING_MUTE_MEMBERS";
          Errors["MISSING_DEAFEN_MEMBERS"] = "MISSING_DEAFEN_MEMBERS";
          Errors["MISSING_SEND_TTS_MESSAGE"] = "MISSING_SEND_TTS_MESSAGE";
          Errors["MISSING_MANAGE_MESSAGES"] = "MISSING_MANAGE_MESSAGES";
          Errors["MISSING_MANAGE_CHANNELS"] = "MISSING_MANAGE_CHANNELS";
          Errors["MISSING_CREATE_INSTANT_INVITE"] =
            "MISSING_CREATE_INSTANT_INVITE";
          Errors["MISSING_MANAGE_WEBHOOKS"] = "MISSING_MANAGE_WEBHOOKS";
          Errors["MISSING_MANAGE_EMOJIS"] = "MISSING_MANAGE_EMOJIS";
          Errors["MISSING_BAN_MEMBERS"] = "MISSING_BAN_MEMBERS";
          Errors["MISSING_MANAGE_GUILD"] = "MISSING_MANAGE_GUILD";
          Errors["MISSING_VIEW_AUDIT_LOG"] = "MISSING_VIEW_AUDIT_LOG";
          Errors["DELETE_MESSAGES_MIN"] = "DELETE_MESSAGES_MIN";
          Errors["DELETE_MESSAGES_MAX"] = "DELETE_MESSAGES_MAX";
          Errors["MESSAGE_MAX_LENGTH"] = "MESSAGE_MAX_LENGTH";
          Errors["NICKNAMES_MAX_LENGTH"] = "NICKNAMES_MAX_LENGTH";
          Errors["PRUNE_MIN_DAYS"] = "PRUNE_MIN_DAYS";
          Errors["RATE_LIMIT_RETRY_MAXED"] = "RATE_LIMIT_RETRY_MAXED";
          Errors["MISSING_INTENT_GUILD_MEMBERS"] =
            "MISSING_INTENT_GUILD_MEMBERS";
          Errors["REQUEST_CLIENT_ERROR"] = "REQUEST_CLIENT_ERROR";
          Errors["REQUEST_SERVER_ERROR"] = "REQUEST_SERVER_ERROR";
          Errors["REQUEST_UNKNOWN_ERROR"] = "REQUEST_UNKNOWN_ERROR";
          Errors["BOTS_HIGHEST_ROLE_TOO_LOW"] = "BOTS_HIGHEST_ROLE_TOO_LOW";
          Errors["CHANNEL_NOT_IN_GUILD"] = "CHANNEL_NOT_IN_GUILD";
        })(Errors || (Errors = {}));
        exports_184("Errors", Errors);
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/requestManager",
  [
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/client",
    "https://deno.land/std@0.50.0/async/delay",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/errors",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/discord",
  ],
  function (exports_185, context_185) {
    "use strict";
    var client_ts_4,
      delay_ts_4,
      errors_ts_1,
      discord_ts_2,
      queue,
      ratelimitedPaths,
      globallyRateLimited,
      queueInProcess,
      RequestManager;
    var __moduleName = context_185 && context_185.id;
    async function processRateLimitedPaths() {
      const now = Date.now();
      ratelimitedPaths.forEach((value, key) => {
        if (value.resetTimestamp < now) {
          return;
        }
        ratelimitedPaths.delete(key);
        if (key === "global") {
          globallyRateLimited = false;
        }
      });
      await delay_ts_4.delay(1000);
      processRateLimitedPaths();
    }
    async function processQueue() {
      if (queue.length && !globallyRateLimited) {
        const request = queue.shift();
        if (request?.bucketID) {
          const rateLimitResetIn = checkRatelimits(request.bucketID);
          const rateLimitedURLResetIn = checkRatelimits(request.url);
          if (rateLimitResetIn) {
            // This request is still rate limited readd to queue
            queue.push(request);
          } else if (rateLimitedURLResetIn) {
            // This URL is rate limited readd to queue
            queue.push(request);
          } else {
            // This request is not rate limited so it should be run
            await request.callback();
          }
        } else {
          // This request has no bucket id so it should be processed
          await request?.callback();
        }
      }
      if (queue.length) {
        processQueue();
      } else {
        queueInProcess = false;
      }
    }
    function createRequestBody(body, method) {
      return {
        headers: {
          Authorization: client_ts_4.authorization,
          "User-Agent":
            `DiscordBot (https://github.com/skillz4killz/discordeno, 0.0.1)`,
          "Content-Type": "application/json",
          "X-Audit-Log-Reason": body ? encodeURIComponent(body.reason) : "",
        },
        body: JSON.stringify(body),
        method: method.toUpperCase(),
      };
    }
    function checkRatelimits(url) {
      const ratelimited = ratelimitedPaths.get(url);
      const global = ratelimitedPaths.get("global");
      const now = Date.now();
      if (ratelimited && now < ratelimited.resetTimestamp) {
        return ratelimited.resetTimestamp - now;
      }
      if (global && now < global.resetTimestamp) {
        return global.resetTimestamp - now;
      }
      return false;
    }
    async function runMethod(method, url, body, retryCount = 0, bucketID) {
      client_ts_4.eventHandlers.debug?.({
        type: "requestManager",
        data: { method, url, body, retryCount, bucketID },
      });
      return new Promise((resolve, reject) => {
        const callback = async () => {
          try {
            const rateLimitResetIn = checkRatelimits(url);
            if (rateLimitResetIn) {
              return setTimeout(
                () => runMethod(method, url, body, retryCount++, bucketID),
                rateLimitResetIn,
              );
            }
            const response = await fetch(url, createRequestBody(body, method));
            const bucketIDFromHeaders = processHeaders(url, response.headers);
            handleStatusCode(response.status);
            // Sometimes Discord returns an empty 204 response that can't be made to JSON.
            if (response.status === 204) {
              resolve();
            }
            const json = await response.json();
            if (
              json.retry_after ||
              json.message === "You are being rate limited."
            ) {
              if (retryCount > 10) {
                throw new Error(errors_ts_1.Errors.RATE_LIMIT_RETRY_MAXED);
              }
              return setTimeout(
                () =>
                  runMethod(
                    method,
                    url,
                    body,
                    retryCount++,
                    bucketIDFromHeaders,
                  ),
                json.retry_after,
              );
            }
            client_ts_4.eventHandlers.debug?.({
              type: "requestManagerSuccess",
              data: { method, url, body, retryCount, bucketID },
            });
            return resolve(json);
          } catch (error) {
            client_ts_4.eventHandlers.debug?.({
              type: "requestManagerFailed",
              data: { method, url, body, retryCount, bucketID },
            });
            return reject(error);
          }
        };
        queue.push({
          callback,
          bucketID,
          url,
        });
        if (!queueInProcess) {
          queueInProcess = true;
          processQueue();
        }
      });
    }
    function handleStatusCode(status) {
      if (
        (status >= 200 && status < 400) ||
        status === discord_ts_2.HttpResponseCode.TooManyRequests
      ) {
        return true;
      }
      switch (status) {
        case discord_ts_2.HttpResponseCode.BadRequest:
        case discord_ts_2.HttpResponseCode.Unauthorized:
        case discord_ts_2.HttpResponseCode.Forbidden:
        case discord_ts_2.HttpResponseCode.NotFound:
        case discord_ts_2.HttpResponseCode.MethodNotAllowed:
          throw new Error(errors_ts_1.Errors.REQUEST_CLIENT_ERROR);
        case discord_ts_2.HttpResponseCode.GatewayUnavailable:
          throw new Error(errors_ts_1.Errors.REQUEST_SERVER_ERROR);
      }
      // left are all unknown
      throw new Error(errors_ts_1.Errors.REQUEST_UNKNOWN_ERROR);
    }
    function processHeaders(url, headers) {
      let ratelimited = false;
      // Get all useful headers
      const remaining = headers.get("x-ratelimit-remaining");
      const resetTimestamp = headers.get("x-ratelimit-reset");
      const retryAfter = headers.get("retry-after");
      const global = headers.get("x-ratelimit-global");
      const bucketID = headers.get("x-ratelimit-bucket");
      // If there is no remaining rate limit for this endpoint, we save it in cache
      if (remaining && remaining === "0") {
        ratelimited = true;
        ratelimitedPaths.set(url, {
          url,
          resetTimestamp: Number(resetTimestamp) * 1000,
          bucketID,
        });
        if (bucketID) {
          ratelimitedPaths.set(bucketID, {
            url,
            resetTimestamp: Number(resetTimestamp) * 1000,
            bucketID,
          });
        }
      }
      // If there is no remaining global limit, we save it in cache
      if (global) {
        const reset = Date.now() + Number(retryAfter);
        client_ts_4.eventHandlers.debug?.(
          { type: "globallyRateLimited", data: { url, reset } },
        );
        globallyRateLimited = true;
        ratelimited = true;
        ratelimitedPaths.set("global", {
          url: "global",
          resetTimestamp: reset,
          bucketID,
        });
        if (bucketID) {
          ratelimitedPaths.set(bucketID, {
            url: "global",
            resetTimestamp: reset,
            bucketID,
          });
        }
      }
      return ratelimited ? bucketID : undefined;
    }
    return {
      setters: [
        function (client_ts_4_1) {
          client_ts_4 = client_ts_4_1;
        },
        function (delay_ts_4_1) {
          delay_ts_4 = delay_ts_4_1;
        },
        function (errors_ts_1_1) {
          errors_ts_1 = errors_ts_1_1;
        },
        function (discord_ts_2_1) {
          discord_ts_2 = discord_ts_2_1;
        },
      ],
      execute: function () {
        queue = [];
        ratelimitedPaths = new Map();
        globallyRateLimited = false;
        queueInProcess = false;
        processRateLimitedPaths();
        exports_185(
          "RequestManager",
          RequestManager = {
            get: async (url, body) => {
              return runMethod("get", /* Get */ url, body);
            },
            post: (url, body) => {
              return runMethod("post", /* Post */ url, body);
            },
            delete: (url, body) => {
              return runMethod("delete", /* Delete */ url, body);
            },
            patch: (url, body) => {
              return runMethod("patch", /* Patch */ url, body);
            },
            put: (url, body) => {
              return runMethod("put", /* Put */ url, body);
            },
          },
        );
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/client",
  [
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/constants/discord",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/requestManager",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/shardingManager",
  ],
  function (exports_186, context_186) {
    "use strict";
    var discord_ts_3,
      requestManager_ts_1,
      shardingManager_ts_2,
      authorization,
      botID,
      eventHandlers,
      botGatewayData,
      identifyPayload,
      createClient;
    var __moduleName = context_186 && context_186.id;
    function updateEventHandlers(newEventHandlers) {
      exports_186("eventHandlers", eventHandlers = newEventHandlers);
    }
    exports_186("updateEventHandlers", updateEventHandlers);
    function setBotID(id) {
      exports_186("botID", botID = id);
    }
    exports_186("setBotID", setBotID);
    return {
      setters: [
        function (discord_ts_3_1) {
          discord_ts_3 = discord_ts_3_1;
        },
        function (requestManager_ts_1_1) {
          requestManager_ts_1 = requestManager_ts_1_1;
        },
        function (shardingManager_ts_2_1) {
          shardingManager_ts_2 = shardingManager_ts_2_1;
        },
      ],
      execute: function () {
        exports_186("authorization", authorization = "");
        exports_186("botID", botID = "");
        exports_186("eventHandlers", eventHandlers = {});
        exports_186(
          "identifyPayload",
          identifyPayload = {
            token: "",
            compress: false,
            properties: {
              $os: "linux",
              $browser: "Discordeno",
              $device: "Discordeno",
            },
            intents: 0,
            shard: [0, 0],
          },
        );
        exports_186(
          "createClient",
          createClient = async (data) => {
            if (data.eventHandlers) {
              exports_186("eventHandlers", eventHandlers = data.eventHandlers);
            }
            exports_186("authorization", authorization = `Bot ${data.token}`);
            // Initial API connection to get info about bots connection
            exports_186(
              "botGatewayData",
              botGatewayData = await requestManager_ts_1.RequestManager.get(
                discord_ts_3.endpoints.GATEWAY_BOT,
              ),
            );
            identifyPayload.token = data.token;
            identifyPayload.intents = data.intents.reduce(
              (bits, next) => (bits |= next),
              0,
            );
            shardingManager_ts_2.spawnShards(botGatewayData, identifyPayload);
          },
        );
        exports_186("default", createClient);
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.50.0/fmt/colors",
  [],
  function (exports_187, context_187) {
    "use strict";
    var noColor, enabled;
    var __moduleName = context_187 && context_187.id;
    function setColorEnabled(value) {
      if (noColor) {
        return;
      }
      enabled = value;
    }
    exports_187("setColorEnabled", setColorEnabled);
    function getColorEnabled() {
      return enabled;
    }
    exports_187("getColorEnabled", getColorEnabled);
    function code(open, close) {
      return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
      };
    }
    function run(str, code) {
      return enabled
        ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
        : str;
    }
    function reset(str) {
      return run(str, code([0], 0));
    }
    exports_187("reset", reset);
    function bold(str) {
      return run(str, code([1], 22));
    }
    exports_187("bold", bold);
    function dim(str) {
      return run(str, code([2], 22));
    }
    exports_187("dim", dim);
    function italic(str) {
      return run(str, code([3], 23));
    }
    exports_187("italic", italic);
    function underline(str) {
      return run(str, code([4], 24));
    }
    exports_187("underline", underline);
    function inverse(str) {
      return run(str, code([7], 27));
    }
    exports_187("inverse", inverse);
    function hidden(str) {
      return run(str, code([8], 28));
    }
    exports_187("hidden", hidden);
    function strikethrough(str) {
      return run(str, code([9], 29));
    }
    exports_187("strikethrough", strikethrough);
    function black(str) {
      return run(str, code([30], 39));
    }
    exports_187("black", black);
    function red(str) {
      return run(str, code([31], 39));
    }
    exports_187("red", red);
    function green(str) {
      return run(str, code([32], 39));
    }
    exports_187("green", green);
    function yellow(str) {
      return run(str, code([33], 39));
    }
    exports_187("yellow", yellow);
    function blue(str) {
      return run(str, code([34], 39));
    }
    exports_187("blue", blue);
    function magenta(str) {
      return run(str, code([35], 39));
    }
    exports_187("magenta", magenta);
    function cyan(str) {
      return run(str, code([36], 39));
    }
    exports_187("cyan", cyan);
    function white(str) {
      return run(str, code([37], 39));
    }
    exports_187("white", white);
    function gray(str) {
      return run(str, code([90], 39));
    }
    exports_187("gray", gray);
    function bgBlack(str) {
      return run(str, code([40], 49));
    }
    exports_187("bgBlack", bgBlack);
    function bgRed(str) {
      return run(str, code([41], 49));
    }
    exports_187("bgRed", bgRed);
    function bgGreen(str) {
      return run(str, code([42], 49));
    }
    exports_187("bgGreen", bgGreen);
    function bgYellow(str) {
      return run(str, code([43], 49));
    }
    exports_187("bgYellow", bgYellow);
    function bgBlue(str) {
      return run(str, code([44], 49));
    }
    exports_187("bgBlue", bgBlue);
    function bgMagenta(str) {
      return run(str, code([45], 49));
    }
    exports_187("bgMagenta", bgMagenta);
    function bgCyan(str) {
      return run(str, code([46], 49));
    }
    exports_187("bgCyan", bgCyan);
    function bgWhite(str) {
      return run(str, code([47], 49));
    }
    exports_187("bgWhite", bgWhite);
    /* Special Color Sequences */
    function clampAndTruncate(n, max = 255, min = 0) {
      return Math.trunc(Math.max(Math.min(n, max), min));
    }
    /** Set text color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit */
    function rgb8(str, color) {
      return run(str, code([38, 5, clampAndTruncate(color)], 39));
    }
    exports_187("rgb8", rgb8);
    /** Set background color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit */
    function bgRgb8(str, color) {
      return run(str, code([48, 5, clampAndTruncate(color)], 49));
    }
    exports_187("bgRgb8", bgRgb8);
    /** Set text color using 24bit rgb. */
    function rgb24(str, color) {
      return run(
        str,
        code([
          38,
          2,
          clampAndTruncate(color.r),
          clampAndTruncate(color.g),
          clampAndTruncate(color.b),
        ], 39),
      );
    }
    exports_187("rgb24", rgb24);
    /** Set background color using 24bit rgb. */
    function bgRgb24(str, color) {
      return run(
        str,
        code([
          48,
          2,
          clampAndTruncate(color.r),
          clampAndTruncate(color.g),
          clampAndTruncate(color.b),
        ], 49),
      );
    }
    exports_187("bgRgb24", bgRgb24);
    return {
      setters: [],
      execute: function () {
        // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
        /**
             * A module to print ANSI terminal colors. Inspired by chalk, kleur, and colors
             * on npm.
             *
             * ```
             * import { bgBlue, red, bold } from "https://deno.land/std/fmt/colors.ts";
             * console.log(bgBlue(red(bold("Hello world!"))));
             * ```
             *
             * This module supports `NO_COLOR` environmental variable disabling any coloring
             * if `NO_COLOR` is set.
             */
        noColor = Deno.noColor;
        enabled = !noColor;
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/logger",
  ["https://deno.land/std@0.50.0/fmt/colors"],
  function (exports_188, context_188) {
    "use strict";
    var colors_ts_3, getTime, logGreen, logBlue, logRed, logYellow, logger;
    var __moduleName = context_188 && context_188.id;
    return {
      setters: [
        function (colors_ts_3_1) {
          colors_ts_3 = colors_ts_3_1;
        },
      ],
      execute: function () {
        exports_188(
          "getTime",
          getTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const minute = now.getMinutes();
            let hour = hours;
            let amOrPm = `AM`;
            if (hour > 12) {
              amOrPm = `PM`;
              hour = hour - 12;
            }
            return `${hour >= 10 ? hour : `0${hour}`}:${
              minute >= 10 ? minute : `0${minute}`
            } ${amOrPm}`;
          },
        );
        exports_188(
          "logGreen",
          logGreen = (text) => {
            console.log(
              colors_ts_3.green(`[${getTime()}] => ${JSON.stringify(text)}`),
            );
          },
        );
        exports_188(
          "logBlue",
          logBlue = (text) => {
            console.log(
              colors_ts_3.blue(`[${getTime()}] => ${JSON.stringify(text)}`),
            );
          },
        );
        exports_188(
          "logRed",
          logRed = (text) => {
            console.log(
              colors_ts_3.red(`[${getTime()}] => ${JSON.stringify(text)}`),
            );
          },
        );
        exports_188(
          "logYellow",
          logYellow = (text) => {
            console.log(
              colors_ts_3.yellow(`[${getTime()}] => ${JSON.stringify(text)}`),
            );
          },
        );
        exports_188(
          "logger",
          logger = {
            getTime,
            success: logGreen,
            info: logBlue,
            error: logRed,
            warn: logYellow,
          },
        );
        exports_188("default", logger);
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/handlers/channel",
  [
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/permission",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/permissions",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/errors",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/requestManager",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/constants/discord",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/message",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/logger",
  ],
  function (exports_189, context_189) {
    "use strict";
    var permission_ts_2,
      permissions_ts_2,
      errors_ts_2,
      requestManager_ts_2,
      discord_ts_4,
      message_ts_2,
      logger_ts_2,
      editChannelNameTopicQueue,
      editChannelProcessing;
    var __moduleName = context_189 && context_189.id;
    /** Checks if a user id or a role id has permission in this channel */
    function hasChannelPermission(channel, id, permissions) {
      const overwrite =
        channel.permission_overwrites?.find((perm) => perm.id === id) ||
        channel.permission_overwrites?.find((perm) =>
          perm.id === channel.guildID
        );
      return permissions.every((perm) => {
        if (overwrite) {
          if (overwrite.deny & perm) {
            return false;
          }
          if (overwrite.allow & perm) {
            return true;
          }
        }
        if (channel.guildID) {
          return permissions_ts_2.botHasPermission(channel.guildID, [perm]);
        }
        return false;
      });
    }
    exports_189("hasChannelPermission", hasChannelPermission);
    /** Fetch a single message from the server. Requires VIEW_CHANNEL and READ_MESSAGE_HISTORY */
    async function getMessage(channel, id) {
      if (channel.guildID) {
        if (
          !permissions_ts_2.botHasPermission(
            channel.guildID,
            [permission_ts_2.Permissions.VIEW_CHANNEL],
          )
        ) {
          throw new Error(errors_ts_2.Errors.MISSING_VIEW_CHANNEL);
        }
        if (
          !permissions_ts_2.botHasPermission(
            channel.guildID,
            [permission_ts_2.Permissions.READ_MESSAGE_HISTORY],
          )
        ) {
          throw new Error(errors_ts_2.Errors.MISSING_READ_MESSAGE_HISTORY);
        }
      }
      const result = await requestManager_ts_2.RequestManager.get(
        discord_ts_4.endpoints.CHANNEL_MESSAGE(channel.id, id),
      );
      return message_ts_2.createMessage(result);
    }
    exports_189("getMessage", getMessage);
    /** Fetches between 2-100 messages. Requires VIEW_CHANNEL and READ_MESSAGE_HISTORY */
    async function getMessages(channel, options) {
      if (channel.guildID) {
        if (
          !permissions_ts_2.botHasPermission(
            channel.guildID,
            [permission_ts_2.Permissions.VIEW_CHANNEL],
          )
        ) {
          throw new Error(errors_ts_2.Errors.MISSING_VIEW_CHANNEL);
        }
        if (
          !permissions_ts_2.botHasPermission(
            channel.guildID,
            [permission_ts_2.Permissions.READ_MESSAGE_HISTORY],
          )
        ) {
          throw new Error(errors_ts_2.Errors.MISSING_READ_MESSAGE_HISTORY);
        }
      }
      if (options?.limit && options.limit > 100) {
        return;
      }
      const result =
        (await requestManager_ts_2.RequestManager.get(
          discord_ts_4.endpoints.CHANNEL_MESSAGES(channel.id),
          options,
        ));
      return result.map((res) => message_ts_2.createMessage(res));
    }
    exports_189("getMessages", getMessages);
    /** Get pinned messages in this channel. */
    async function getPins(channelID) {
      const result =
        (await requestManager_ts_2.RequestManager.get(
          discord_ts_4.endpoints.CHANNEL_PINS(channelID),
        ));
      return result.map((res) => message_ts_2.createMessage(res));
    }
    exports_189("getPins", getPins);
    /** Send a message to the channel. Requires SEND_MESSAGES permission. */
    async function sendMessage(channel, content) {
      if (typeof content === "string") {
        content = { content };
      }
      if (channel.guildID) {
        if (
          !permissions_ts_2.botHasPermission(
            channel.guildID,
            [permission_ts_2.Permissions.SEND_MESSAGES],
          )
        ) {
          throw new Error(errors_ts_2.Errors.MISSING_SEND_MESSAGES);
        }
        if (
          content.tts &&
          !permissions_ts_2.botHasPermission(
            channel.guildID,
            [permission_ts_2.Permissions.SEND_TTS_MESSAGES],
          )
        ) {
          throw new Error(errors_ts_2.Errors.MISSING_SEND_TTS_MESSAGE);
        }
      }
      if (content.content && content.content.length > 2000) {
        throw new Error(errors_ts_2.Errors.MESSAGE_MAX_LENGTH);
      }
      const result = await requestManager_ts_2.RequestManager.post(
        discord_ts_4.endpoints.CHANNEL_MESSAGES(channel.id),
        content,
      );
      return message_ts_2.createMessage(result);
    }
    exports_189("sendMessage", sendMessage);
    /** Delete messages from the channel. 2-100. Requires the MANAGE_MESSAGES permission */
    function deleteMessages(channel, ids, reason) {
      if (
        channel.guildID &&
        !permissions_ts_2.botHasPermission(
          channel.guildID,
          [permission_ts_2.Permissions.MANAGE_MESSAGES],
        )
      ) {
        throw new Error(errors_ts_2.Errors.MISSING_MANAGE_MESSAGES);
      }
      if (ids.length < 2) {
        throw new Error(errors_ts_2.Errors.DELETE_MESSAGES_MIN);
      }
      if (ids.length > 100) {
        logger_ts_2.logYellow(
          `This endpoint only accepts a maximum of 100 messages. Deleting the first 100 message ids provided.`,
        );
      }
      return requestManager_ts_2.RequestManager.post(
        discord_ts_4.endpoints.CHANNEL_BULK_DELETE(channel.id),
        {
          messages: ids.splice(0, 100),
          reason,
        },
      );
    }
    exports_189("deleteMessages", deleteMessages);
    /** Gets the invites for this channel. Requires MANAGE_CHANNEL */
    function getChannelInvites(channel) {
      if (
        channel.guildID &&
        !permissions_ts_2.botHasPermission(
          channel.guildID,
          [permission_ts_2.Permissions.MANAGE_CHANNELS],
        )
      ) {
        throw new Error(errors_ts_2.Errors.MISSING_MANAGE_CHANNELS);
      }
      return requestManager_ts_2.RequestManager.get(
        discord_ts_4.endpoints.CHANNEL_INVITES(channel.id),
      );
    }
    exports_189("getChannelInvites", getChannelInvites);
    /** Creates a new invite for this channel. Requires CREATE_INSTANT_INVITE */
    function createInvite(channel, options) {
      if (
        channel.guildID &&
        !permissions_ts_2.botHasPermission(
          channel.guildID,
          [permission_ts_2.Permissions.CREATE_INSTANT_INVITE],
        )
      ) {
        throw new Error(errors_ts_2.Errors.MISSING_CREATE_INSTANT_INVITE);
      }
      return requestManager_ts_2.RequestManager.post(
        discord_ts_4.endpoints.CHANNEL_INVITES(channel.id),
        options,
      );
    }
    exports_189("createInvite", createInvite);
    /** Gets the webhooks for this channel. Requires MANAGE_WEBHOOKS */
    function getChannelWebhooks(channel) {
      if (
        channel.guildID &&
        !permissions_ts_2.botHasPermission(
          channel.guildID,
          [permission_ts_2.Permissions.MANAGE_WEBHOOKS],
        )
      ) {
        throw new Error(errors_ts_2.Errors.MISSING_MANAGE_WEBHOOKS);
      }
      return requestManager_ts_2.RequestManager.get(
        discord_ts_4.endpoints.CHANNEL_WEBHOOKS(channel.id),
      );
    }
    exports_189("getChannelWebhooks", getChannelWebhooks);
    function processEditChannelQueue() {
      if (!editChannelProcessing) {
        return;
      }
      const now = Date.now();
      editChannelNameTopicQueue.forEach((request) => {
        if (now > request.timestamp) {
          return;
        }
        // 10 minutes have passed so we can reset this channel again
        if (!request.items.length) {
          return editChannelNameTopicQueue.delete(request.channelID);
        }
        request.amount = 0;
        // There are items to process for this request
        const details = request.items.shift();
        if (!details) {
          return;
        }
        editChannel(details.channel, details.options);
        const secondDetails = request.items.shift();
        if (!secondDetails) {
          return;
        }
        return editChannel(secondDetails.channel, secondDetails.options);
      });
      if (editChannelNameTopicQueue.size) {
        setTimeout(() => processEditChannelQueue(), 600000);
      } else {
        editChannelProcessing = false;
      }
    }
    function editChannel(channel, options) {
      if (!channel.guildID) {
        throw new Error(errors_ts_2.Errors.CHANNEL_NOT_IN_GUILD);
      }
      if (
        !permissions_ts_2.botHasPermission(
          channel.guildID,
          [permission_ts_2.Permissions.MANAGE_CHANNELS],
        )
      ) {
        throw new Error(errors_ts_2.Errors.MISSING_MANAGE_CHANNELS);
      }
      if (options.name || options.topic) {
        const request = editChannelNameTopicQueue.get(channel.id);
        if (!request) {
          // If this hasnt been done before simply add 1 for it
          editChannelNameTopicQueue.set(channel.id, {
            channelID: channel.id,
            amount: 1,
            // 10 minutes from now
            timestamp: Date.now() + 600000,
            items: [],
          });
        } else if (request.amount === 1) {
          // Start queuing future requests to this channel
          request.amount = 2;
          request.timestamp = Date.now() + 600000;
        } else {
          // 2 have already been used add to queue
          request.items.push({ channel, options });
          if (editChannelProcessing) {
            return;
          }
          editChannelProcessing = true;
          processEditChannelQueue();
          return;
        }
      }
      return requestManager_ts_2.RequestManager.patch(
        discord_ts_4.endpoints.GUILD_CHANNEL(channel.id),
        options,
      );
    }
    exports_189("editChannel", editChannel);
    return {
      setters: [
        function (permission_ts_2_1) {
          permission_ts_2 = permission_ts_2_1;
        },
        function (permissions_ts_2_1) {
          permissions_ts_2 = permissions_ts_2_1;
        },
        function (errors_ts_2_1) {
          errors_ts_2 = errors_ts_2_1;
        },
        function (requestManager_ts_2_1) {
          requestManager_ts_2 = requestManager_ts_2_1;
        },
        function (discord_ts_4_1) {
          discord_ts_4 = discord_ts_4_1;
        },
        function (message_ts_2_1) {
          message_ts_2 = message_ts_2_1;
        },
        function (logger_ts_2_1) {
          logger_ts_2 = logger_ts_2_1;
        },
      ],
      execute: function () {
        editChannelNameTopicQueue = new Map();
        editChannelProcessing = false;
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/cdn",
  [],
  function (exports_190, context_190) {
    "use strict";
    var __moduleName = context_190 && context_190.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/cdn",
  [],
  function (exports_191, context_191) {
    "use strict";
    var formatImageURL;
    var __moduleName = context_191 && context_191.id;
    return {
      setters: [],
      execute: function () {
        exports_191(
          "formatImageURL",
          formatImageURL = (url, size = 128, format) => {
            return `${url}.${format ||
              (url.includes("/a_") ? "gif" : "jpg")}?size=${size}`;
          },
        );
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/handlers/guild",
  [
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/channel",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/cdn",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/permissions",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/requestManager",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/constants/discord",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/errors",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/permission",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/channel",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/role",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/options",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/client",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/shardingManager",
  ],
  function (exports_192, context_192) {
    "use strict";
    var channel_ts_4,
      cdn_ts_1,
      permissions_ts_3,
      requestManager_ts_3,
      discord_ts_5,
      errors_ts_3,
      permission_ts_3,
      channel_ts_5,
      role_ts_3,
      options_ts_1,
      client_ts_5,
      shardingManager_ts_3;
    var __moduleName = context_192 && context_192.id;
    /** Gets an array of all the channels ids that are the children of this category. */
    function categoryChildrenIDs(guild, id) {
      const channelIDs = [];
      guild.channels.forEach((channel) => {
        if (channel.parentID === id) {
          channelIDs.push(channel.id);
        }
      });
      return channelIDs;
    }
    exports_192("categoryChildrenIDs", categoryChildrenIDs);
    /** The full URL of the icon from Discords CDN. Undefined when no icon is set. */
    function guildIconURL(guild, size = 128, format) {
      return guild.icon
        ? cdn_ts_1.formatImageURL(
          discord_ts_5.endpoints.GUILD_ICON(guild.id, guild.icon),
          size,
          format,
        )
        : undefined;
    }
    exports_192("guildIconURL", guildIconURL);
    /** The full URL of the splash from Discords CDN. Undefined if no splash is set. */
    function guildSplashURL(guild, size = 128, format) {
      return guild.splash
        ? cdn_ts_1.formatImageURL(
          discord_ts_5.endpoints.GUILD_SPLASH(guild.id, guild.splash),
          size,
          format,
        )
        : undefined;
    }
    exports_192("guildSplashURL", guildSplashURL);
    /** The full URL of the banner from Discords CDN. Undefined if no banner is set. */
    function guildBannerURL(guild, size = 128, format) {
      return guild.banner
        ? cdn_ts_1.formatImageURL(
          discord_ts_5.endpoints.GUILD_BANNER(guild.id, guild.banner),
          size,
          format,
        )
        : undefined;
    }
    exports_192("guildBannerURL", guildBannerURL);
    /** Create a channel in your server. Bot needs MANAGE_CHANNEL permissions in the server. */
    async function createGuildChannel(guild, name, options) {
      if (
        !permissions_ts_3.botHasPermission(
          guild.id,
          [permission_ts_3.Permissions.MANAGE_CHANNELS],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_CHANNELS);
      }
      const result =
        (await requestManager_ts_3.RequestManager.post(
          discord_ts_5.endpoints.GUILD_CHANNELS(guild.id),
          {
            name,
            permission_overwrites: options?.permission_overwrites
              ? options.permission_overwrites.map((perm) => ({
                ...perm,
                allow: perm.allow.map((p) => permission_ts_3.Permissions[p]),
                deny: perm.deny.map((p) => permission_ts_3.Permissions[p]),
              }))
              : undefined,
            ...options,
            type: options.type
              ? channel_ts_5.ChannelTypes[options.type]
              : undefined,
          },
        ));
      const channel = channel_ts_4.createChannel(result);
      guild.channels.set(result.id, channel);
      return channel;
    }
    exports_192("createGuildChannel", createGuildChannel);
    /** Returns a list of guild channel objects.
    *
    * ⚠️ **If you need this, you are probably doing something wrong. This is not intended for use. Your channels will be cached in your guild.**
    */
    function getChannels(guildID) {
      return requestManager_ts_3.RequestManager.get(
        discord_ts_5.endpoints.GUILD_CHANNELS(guildID),
      );
    }
    exports_192("getChannels", getChannels);
    /** Modify the positions of channels on the guild. Requires MANAGE_CHANNELS permisison. */
    function swapChannels(guildID, channelPositions) {
      if (channelPositions.length < 2) {
        throw "You must provide atleast two channels to be swapped.";
      }
      return requestManager_ts_3.RequestManager.patch(
        discord_ts_5.endpoints.GUILD_CHANNELS(guildID),
        channelPositions,
      );
    }
    exports_192("swapChannels", swapChannels);
    /** Returns a guild member object for the specified user.
    *
    * ⚠️ **If you need this, you are probably doing something wrong. This is not intended for use. Your members will be cached in your guild.**
    */
    function getMember(guildID, id) {
      return requestManager_ts_3.RequestManager.get(
        discord_ts_5.endpoints.GUILD_MEMBER(guildID, id),
      );
    }
    exports_192("getMember", getMember);
    /** Create an emoji in the server. Emojis and animated emojis have a maximum file size of 256kb. Attempting to upload an emoji larger than this limit will fail and return 400 Bad Request and an error message, but not a JSON status code. */
    function createEmoji(guildID, name, image, options) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.MANAGE_EMOJIS],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_EMOJIS);
      }
      return requestManager_ts_3.RequestManager.post(
        discord_ts_5.endpoints.GUILD_EMOJIS(guildID),
        {
          ...options,
          name,
          image,
        },
      );
    }
    exports_192("createEmoji", createEmoji);
    /** Modify the given emoji. Requires the MANAGE_EMOJIS permission. */
    function editEmoji(guildID, id, options) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.MANAGE_EMOJIS],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_EMOJIS);
      }
      return requestManager_ts_3.RequestManager.patch(
        discord_ts_5.endpoints.GUILD_EMOJI(guildID, id),
        {
          name: options.name,
          roles: options.roles,
        },
      );
    }
    exports_192("editEmoji", editEmoji);
    /** Delete the given emoji. Requires the MANAGE_EMOJIS permission. Returns 204 No Content on success. */
    function deleteEmoji(guildID, id, reason) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.MANAGE_EMOJIS],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_EMOJIS);
      }
      return requestManager_ts_3.RequestManager.delete(
        discord_ts_5.endpoints.GUILD_EMOJI(guildID, id),
        { reason },
      );
    }
    exports_192("deleteEmoji", deleteEmoji);
    /** Create a new role for the guild. Requires the MANAGE_ROLES permission. */
    async function createGuildRole(guild, options, reason) {
      if (
        !permissions_ts_3.botHasPermission(
          guild.id,
          [permission_ts_3.Permissions.MANAGE_ROLES],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_ROLES);
      }
      const role_data = await requestManager_ts_3.RequestManager.post(
        discord_ts_5.endpoints.GUILD_ROLES(guild.id),
        {
          ...options,
          permissions: options.permissions?.map((perm) =>
            permission_ts_3.Permissions[perm]
          ),
          reason,
        },
      );
      const roleData = role_data;
      const role = role_ts_3.createRole(roleData);
      guild.roles.set(role.id, role);
      return role;
    }
    exports_192("createGuildRole", createGuildRole);
    /** Edit a guild role. Requires the MANAGE_ROLES permission. */
    function editRole(guildID, id, options) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.MANAGE_ROLES],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_ROLES);
      }
      return requestManager_ts_3.RequestManager.patch(
        discord_ts_5.endpoints.GUILD_ROLE(guildID, id),
        options,
      );
    }
    exports_192("editRole", editRole);
    /** Delete a guild role. Requires the MANAGE_ROLES permission. */
    function deleteRole(guildID, id) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.MANAGE_ROLES],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_ROLES);
      }
      return requestManager_ts_3.RequestManager.delete(
        discord_ts_5.endpoints.GUILD_ROLE(guildID, id),
      );
    }
    exports_192("deleteRole", deleteRole);
    /** Returns a list of role objects for the guild.
    *
    * ⚠️ **If you need this, you are probably doing something wrong. This is not intended for use. Your roles will be cached in your guild.**
    */
    function getRoles(guildID) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.MANAGE_ROLES],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_ROLES);
      }
      return requestManager_ts_3.RequestManager.get(
        discord_ts_5.endpoints.GUILD_ROLES(guildID),
      );
    }
    exports_192("getRoles", getRoles);
    /** Modify the positions of a set of role objects for the guild. Requires the MANAGE_ROLES permission. */
    function swapRoles(guildID, rolePositons) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.MANAGE_ROLES],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_ROLES);
      }
      return requestManager_ts_3.RequestManager.patch(
        discord_ts_5.endpoints.GUILD_ROLES(guildID),
        rolePositons,
      );
    }
    exports_192("swapRoles", swapRoles);
    /** Check how many members would be removed from the server in a prune operation. Requires the KICK_MEMBERS permission */
    async function getPruneCount(guildID, days) {
      if (days < 1) {
        throw new Error(errors_ts_3.Errors.PRUNE_MIN_DAYS);
      }
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.KICK_MEMBERS],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_KICK_MEMBERS);
      }
      const result =
        (await requestManager_ts_3.RequestManager.get(
          discord_ts_5.endpoints.GUILD_PRUNE(guildID),
          { days },
        ));
      return result.pruned;
    }
    exports_192("getPruneCount", getPruneCount);
    /** Begin pruning all members in the given time period */
    function pruneMembers(guildID, days) {
      if (days < 1) {
        throw new Error(errors_ts_3.Errors.PRUNE_MIN_DAYS);
      }
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.KICK_MEMBERS],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_KICK_MEMBERS);
      }
      return requestManager_ts_3.RequestManager.post(
        discord_ts_5.endpoints.GUILD_PRUNE(guildID),
        { days },
      );
    }
    exports_192("pruneMembers", pruneMembers);
    function fetchMembers(guild, options) {
      if (
        !(client_ts_5.identifyPayload.intents &
          options_ts_1.Intents.GUILD_MEMBERS)
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_INTENT_GUILD_MEMBERS);
      }
      return new Promise((resolve) => {
        shardingManager_ts_3.requestAllMembers(guild, resolve, options);
      });
    }
    exports_192("fetchMembers", fetchMembers);
    /** Returns the audit logs for the guild. Requires VIEW AUDIT LOGS permission */
    function getAuditLogs(guildID, options) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.VIEW_AUDIT_LOG],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_VIEW_AUDIT_LOG);
      }
      return requestManager_ts_3.RequestManager.get(
        discord_ts_5.endpoints.GUILD_AUDIT_LOGS(guildID),
        {
          ...options,
          limit: options.limit && options.limit >= 1 && options.limit <= 100
            ? options.limit
            : 50,
        },
      );
    }
    exports_192("getAuditLogs", getAuditLogs);
    /** Returns the guild embed object. Requires the MANAGE_GUILD permission. */
    function getEmbed(guildID) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.MANAGE_GUILD],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_GUILD);
      }
      return requestManager_ts_3.RequestManager.get(
        discord_ts_5.endpoints.GUILD_EMBED(guildID),
      );
    }
    exports_192("getEmbed", getEmbed);
    /** Modify a guild embed object for the guild. Requires the MANAGE_GUILD permission. */
    function editEmbed(guildID, enabled, channelID) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.MANAGE_GUILD],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_GUILD);
      }
      return requestManager_ts_3.RequestManager.patch(
        discord_ts_5.endpoints.GUILD_EMBED(guildID),
        { enabled, channel_id: channelID },
      );
    }
    exports_192("editEmbed", editEmbed);
    /** Returns the code and uses of the vanity url for this server if it is enabled. Requires the MANAGE_GUILD permission. */
    function getVanityURL(guildID) {
      return requestManager_ts_3.RequestManager.get(
        discord_ts_5.endpoints.GUILD_VANITY_URL(guildID),
      );
    }
    exports_192("getVanityURL", getVanityURL);
    /** Returns a list of integrations for the guild. Requires the MANAGE_GUILD permission. */
    function getIntegrations(guildID) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.MANAGE_GUILD],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_GUILD);
      }
      return requestManager_ts_3.RequestManager.get(
        discord_ts_5.endpoints.GUILD_INTEGRATIONS(guildID),
      );
    }
    exports_192("getIntegrations", getIntegrations);
    /** Modify the behavior and settings of an integration object for the guild. Requires the MANAGE_GUILD permission. */
    function editIntegration(guildID, id, options) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.MANAGE_GUILD],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_GUILD);
      }
      return requestManager_ts_3.RequestManager.patch(
        discord_ts_5.endpoints.GUILD_INTEGRATION(guildID, id),
        options,
      );
    }
    exports_192("editIntegration", editIntegration);
    /** Delete the attached integration object for the guild with this id. Requires MANAGE_GUILD permission. */
    function deleteIntegration(guildID, id) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.MANAGE_GUILD],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_GUILD);
      }
      return requestManager_ts_3.RequestManager.delete(
        discord_ts_5.endpoints.GUILD_INTEGRATION(guildID, id),
      );
    }
    exports_192("deleteIntegration", deleteIntegration);
    /** Sync an integration. Requires teh MANAGE_GUILD permission. */
    function syncIntegration(guildID, id) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.MANAGE_GUILD],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_GUILD);
      }
      return requestManager_ts_3.RequestManager.post(
        discord_ts_5.endpoints.GUILD_INTEGRATION_SYNC(guildID, id),
      );
    }
    exports_192("syncIntegration", syncIntegration);
    /** Returns a list of ban objects for the users banned from this guild. Requires the BAN_MEMBERS permission. */
    function getBans(guildID) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.BAN_MEMBERS],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_BAN_MEMBERS);
      }
      return requestManager_ts_3.RequestManager.get(
        discord_ts_5.endpoints.GUILD_BANS(guildID),
      );
    }
    exports_192("getBans", getBans);
    /** Ban a user from the guild and optionally delete previous messages sent by the user. Requires teh BAN_MEMBERS permission. */
    function ban(guildID, id, options) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.BAN_MEMBERS],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_BAN_MEMBERS);
      }
      return requestManager_ts_3.RequestManager.put(
        discord_ts_5.endpoints.GUILD_BAN(guildID, id),
        options,
      );
    }
    exports_192("ban", ban);
    /** Remove the ban for a user. REquires BAN_MEMBERS permission */
    function unban(guildID, id) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.BAN_MEMBERS],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_BAN_MEMBERS);
      }
      return requestManager_ts_3.RequestManager.delete(
        discord_ts_5.endpoints.GUILD_BAN(guildID, id),
      );
    }
    exports_192("unban", unban);
    /** Check whether a member has certain permissions in this channel. */
    function channelHasPermissions(guild, channelID, memberID, permissions) {
      if (memberID === guild.ownerID) {
        return true;
      }
      const member = guild.members.get(memberID);
      if (!member) {
        throw new Error(
          "Invalid member id provided. This member was not found in the cache. Please fetch them with getMember on guild.",
        );
      }
      const channel = guild.channels.get(channelID);
      if (!channel) {
        throw new Error(
          "Invalid channel id provided. This channel was not found in the cache.",
        );
      }
      let permissionBits = member.roles.reduce((bits, roleID) => {
        const role = guild.roles.get(roleID);
        if (!role) {
          return bits;
        }
        bits |= role.permissions;
        return bits;
      }, 0);
      if (permissionBits & permission_ts_3.Permissions.ADMINISTRATOR) {
        return true;
      }
      return permissions.every((permission) =>
        permissionBits & permission_ts_3.Permissions[permission]
      );
    }
    exports_192("channelHasPermissions", channelHasPermissions);
    /** Modify a guilds settings. Requires the MANAGE_GUILD permission. */
    function editGuild(guildID, options) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.MANAGE_GUILD],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_GUILD);
      }
      return requestManager_ts_3.RequestManager.patch(
        discord_ts_5.endpoints.GUILD(guildID),
        options,
      );
    }
    exports_192("editGuild", editGuild);
    /** Get all the invites for this guild. Requires MANAGE_GUILD permission */
    function getInvites(guildID) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.MANAGE_GUILD],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_GUILD);
      }
      return requestManager_ts_3.RequestManager.get(
        discord_ts_5.endpoints.GUILD_INVITES(guildID),
      );
    }
    exports_192("getInvites", getInvites);
    /** Leave a guild */
    function leave(guildID) {
      return requestManager_ts_3.RequestManager.delete(
        discord_ts_5.endpoints.GUILD_LEAVE(guildID),
      );
    }
    exports_192("leave", leave);
    /** Returns a list of voice region objects for the guild. Unlike the similar /voice route, this returns VIP servers when the guild is VIP-enabled. */
    function getVoiceRegions(guildID) {
      return requestManager_ts_3.RequestManager.get(
        discord_ts_5.endpoints.GUILD_REGIONS(guildID),
      );
    }
    exports_192("getVoiceRegions", getVoiceRegions);
    /** Returns a list of guild webhooks objects. Requires the MANAGE_WEBHOOKs permission. */
    function getWebhooks(guildID) {
      if (
        !permissions_ts_3.botHasPermission(
          guildID,
          [permission_ts_3.Permissions.MANAGE_WEBHOOKS],
        )
      ) {
        throw new Error(errors_ts_3.Errors.MISSING_MANAGE_WEBHOOKS);
      }
      return requestManager_ts_3.RequestManager.get(
        discord_ts_5.endpoints.GUILD_WEBHOOKS(guildID),
      );
    }
    exports_192("getWebhooks", getWebhooks);
    return {
      setters: [
        function (channel_ts_4_1) {
          channel_ts_4 = channel_ts_4_1;
        },
        function (cdn_ts_1_1) {
          cdn_ts_1 = cdn_ts_1_1;
        },
        function (permissions_ts_3_1) {
          permissions_ts_3 = permissions_ts_3_1;
        },
        function (requestManager_ts_3_1) {
          requestManager_ts_3 = requestManager_ts_3_1;
        },
        function (discord_ts_5_1) {
          discord_ts_5 = discord_ts_5_1;
        },
        function (errors_ts_3_1) {
          errors_ts_3 = errors_ts_3_1;
        },
        function (permission_ts_3_1) {
          permission_ts_3 = permission_ts_3_1;
        },
        function (channel_ts_5_1) {
          channel_ts_5 = channel_ts_5_1;
        },
        function (role_ts_3_1) {
          role_ts_3 = role_ts_3_1;
        },
        function (options_ts_1_1) {
          options_ts_1 = options_ts_1_1;
        },
        function (client_ts_5_1) {
          client_ts_5 = client_ts_5_1;
        },
        function (shardingManager_ts_3_1) {
          shardingManager_ts_3 = shardingManager_ts_3_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/handlers/member",
  [
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/cdn",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/constants/discord",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/permissions",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/client",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/permission",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/errors",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/requestManager",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/cache",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/channel",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/handlers/channel",
  ],
  function (exports_193, context_193) {
    "use strict";
    var cdn_ts_2,
      discord_ts_6,
      permissions_ts_4,
      client_ts_6,
      permission_ts_4,
      errors_ts_4,
      requestManager_ts_4,
      cache_ts_8,
      channel_ts_6,
      channel_ts_7;
    var __moduleName = context_193 && context_193.id;
    /** The users custom avatar or the default avatar */
    function avatarURL(member, size = 128, format) {
      return member.user.avatar
        ? cdn_ts_2.formatImageURL(
          discord_ts_6.endpoints.USER_AVATAR(
            member.user.id,
            member.user.avatar,
          ),
          size,
          format,
        )
        : discord_ts_6.endpoints.USER_DEFAULT_AVATAR(
          Number(member.user.discriminator) % 5,
        );
    }
    exports_193("avatarURL", avatarURL);
    /** Add a role to the member */
    function addRole(guild, memberID, roleID, reason) {
      const botsHighestRole = permissions_ts_4.highestRole(
        guild.id,
        client_ts_6.botID,
      );
      if (
        botsHighestRole &&
        !permissions_ts_4.higherRolePosition(
          guild.id,
          botsHighestRole.id,
          roleID,
        )
      ) {
        throw new Error(errors_ts_4.Errors.BOTS_HIGHEST_ROLE_TOO_LOW);
      }
      if (
        !permissions_ts_4.botHasPermission(
          guild.id,
          [permission_ts_4.Permissions.MANAGE_ROLES],
        )
      ) {
        throw new Error(errors_ts_4.Errors.MISSING_MANAGE_ROLES);
      }
      return requestManager_ts_4.RequestManager.put(
        discord_ts_6.endpoints.GUILD_MEMBER_ROLE(guild.id, memberID, roleID),
        { reason },
      );
    }
    exports_193("addRole", addRole);
    /** Remove a role from the member */
    function removeRole(guildID, memberID, roleID, reason) {
      const botsHighestRole = permissions_ts_4.highestRole(
        guildID,
        client_ts_6.botID,
      );
      if (
        botsHighestRole &&
        !permissions_ts_4.higherRolePosition(
          guildID,
          botsHighestRole.id,
          roleID,
        )
      ) {
        throw new Error(errors_ts_4.Errors.BOTS_HIGHEST_ROLE_TOO_LOW);
      }
      if (
        !permissions_ts_4.botHasPermission(
          guildID,
          [permission_ts_4.Permissions.MANAGE_ROLES],
        )
      ) {
        throw new Error(errors_ts_4.Errors.MISSING_MANAGE_ROLES);
      }
      return requestManager_ts_4.RequestManager.delete(
        discord_ts_6.endpoints.GUILD_MEMBER_ROLE(guildID, memberID, roleID),
        { reason },
      );
    }
    exports_193("removeRole", removeRole);
    /** Send a message to a users DM. Note: this takes 2 API calls. 1 is to fetch the users dm channel. 2 is to send a message to that channel. */
    async function sendDirectMessage(memberID, content) {
      let dmChannel = cache_ts_8.cache.channels.get(memberID);
      if (!dmChannel) {
        // If not available in cache create a new one.
        const dmChannelData = await requestManager_ts_4.RequestManager.post(
          discord_ts_6.endpoints.USER_CREATE_DM,
          { recipient_id: memberID },
        );
        // Channel create event will have added this channel to the cache
        cache_ts_8.cache.channels.delete(dmChannelData.id);
        const channel = channel_ts_6.createChannel(dmChannelData);
        // Recreate the channel and add it undert he users id
        cache_ts_8.cache.channels.set(memberID, channel);
        dmChannel = channel;
      }
      // If it does exist try sending a message to this user
      return channel_ts_7.sendMessage(dmChannel, content);
    }
    exports_193("sendDirectMessage", sendDirectMessage);
    /** Kick a member from the server */
    function kick(guild, memberID, reason) {
      const botsHighestRole = permissions_ts_4.highestRole(
        guild.id,
        client_ts_6.botID,
      );
      const membersHighestRole = permissions_ts_4.highestRole(
        guild.id,
        memberID,
      );
      if (
        botsHighestRole && membersHighestRole &&
        botsHighestRole.position <= membersHighestRole.position
      ) {
        throw new Error(errors_ts_4.Errors.BOTS_HIGHEST_ROLE_TOO_LOW);
      }
      if (
        !permissions_ts_4.botHasPermission(
          guild.id,
          [permission_ts_4.Permissions.KICK_MEMBERS],
        )
      ) {
        throw new Error(errors_ts_4.Errors.MISSING_KICK_MEMBERS);
      }
      return requestManager_ts_4.RequestManager.delete(
        discord_ts_6.endpoints.GUILD_MEMBER(guild.id, memberID),
        { reason },
      );
    }
    exports_193("kick", kick);
    /** Edit the member */
    function editMember(guild, memberID, options) {
      if (options.nick) {
        if (options.nick.length > 32) {
          throw new Error(errors_ts_4.Errors.NICKNAMES_MAX_LENGTH);
        }
        if (
          !permissions_ts_4.botHasPermission(
            guild.id,
            [permission_ts_4.Permissions.MANAGE_NICKNAMES],
          )
        ) {
          throw new Error(errors_ts_4.Errors.MISSING_MANAGE_NICKNAMES);
        }
      }
      if (
        options.roles &&
        !permissions_ts_4.botHasPermission(
          guild.id,
          [permission_ts_4.Permissions.MANAGE_ROLES],
        )
      ) {
        throw new Error(errors_ts_4.Errors.MISSING_MANAGE_ROLES);
      }
      if (options.mute) {
        // TODO: This should check if the member is in a voice channel
        if (
          !permissions_ts_4.botHasPermission(
            guild.id,
            [permission_ts_4.Permissions.MUTE_MEMBERS],
          )
        ) {
          throw new Error(errors_ts_4.Errors.MISSING_MUTE_MEMBERS);
        }
      }
      if (
        options.deaf &&
        !permissions_ts_4.botHasPermission(
          guild.id,
          [permission_ts_4.Permissions.DEAFEN_MEMBERS],
        )
      ) {
        throw new Error(errors_ts_4.Errors.MISSING_DEAFEN_MEMBERS);
      }
      // TODO: if channel id is provided check if the bot has CONNECT and MOVE in channel and current channel
      return requestManager_ts_4.RequestManager.patch(
        discord_ts_6.endpoints.GUILD_MEMBER(guild.id, memberID),
        options,
      );
    }
    exports_193("editMember", editMember);
    return {
      setters: [
        function (cdn_ts_2_1) {
          cdn_ts_2 = cdn_ts_2_1;
        },
        function (discord_ts_6_1) {
          discord_ts_6 = discord_ts_6_1;
        },
        function (permissions_ts_4_1) {
          permissions_ts_4 = permissions_ts_4_1;
        },
        function (client_ts_6_1) {
          client_ts_6 = client_ts_6_1;
        },
        function (permission_ts_4_1) {
          permission_ts_4 = permission_ts_4_1;
        },
        function (errors_ts_4_1) {
          errors_ts_4 = errors_ts_4_1;
        },
        function (requestManager_ts_4_1) {
          requestManager_ts_4 = requestManager_ts_4_1;
        },
        function (cache_ts_8_1) {
          cache_ts_8 = cache_ts_8_1;
        },
        function (channel_ts_6_1) {
          channel_ts_6 = channel_ts_6_1;
        },
        function (channel_ts_7_1) {
          channel_ts_7 = channel_ts_7_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/handlers/message",
  [
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/message",
    "https://deno.land/std@0.50.0/async/delay",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/client",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/handlers/channel",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/permission",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/errors",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/requestManager",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/constants/discord",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/permissions",
  ],
  function (exports_194, context_194) {
    "use strict";
    var message_ts_3,
      delay_ts_5,
      client_ts_7,
      channel_ts_8,
      permission_ts_5,
      errors_ts_5,
      requestManager_ts_5,
      discord_ts_7,
      permissions_ts_5;
    var __moduleName = context_194 && context_194.id;
    /** Delete a message */
    async function deleteMessage(message, reason, delayMilliseconds = 0) {
      if (message.author.id !== client_ts_7.botID) {
        // This needs to check the channels permission not the guild permission
        if (
          !message.guildID ||
          !channel_ts_8.hasChannelPermission(
            message.channel,
            client_ts_7.botID,
            [permission_ts_5.Permissions.MANAGE_MESSAGES],
          )
        ) {
          throw new Error(errors_ts_5.Errors.MISSING_MANAGE_MESSAGES);
        }
      }
      if (delayMilliseconds) {
        await delay_ts_5.delay(delayMilliseconds);
      }
      return requestManager_ts_5.RequestManager.delete(
        discord_ts_7.endpoints.CHANNEL_MESSAGE(message.channelID, message.id),
        { reason },
      );
    }
    exports_194("deleteMessage", deleteMessage);
    /** Pin a message in a channel. Requires MANAGE_MESSAGES. Max pins allowed in a channel = 50. */
    function pin(message) {
      if (
        message.guildID &&
        !permissions_ts_5.botHasPermission(
          message.guildID,
          [permission_ts_5.Permissions.MANAGE_MESSAGES],
        )
      ) {
        throw new Error(errors_ts_5.Errors.MISSING_MANAGE_MESSAGES);
      }
      requestManager_ts_5.RequestManager.put(
        discord_ts_7.endpoints.CHANNEL_MESSAGE(message.channelID, message.id),
      );
    }
    exports_194("pin", pin);
    /** Unpin a message in a channel. Requires MANAGE_MESSAGES. */
    function unpin(message) {
      if (
        message.guildID &&
        !permissions_ts_5.botHasPermission(
          message.guildID,
          [permission_ts_5.Permissions.MANAGE_MESSAGES],
        )
      ) {
        throw new Error(errors_ts_5.Errors.MISSING_MANAGE_MESSAGES);
      }
      requestManager_ts_5.RequestManager.delete(
        discord_ts_7.endpoints.CHANNEL_MESSAGE(message.channelID, message.id),
      );
    }
    exports_194("unpin", unpin);
    /** Create a reaction for the message. Reaction takes the form of **name:id** for custom guild emoji, or Unicode characters. Requires READ_MESSAGE_HISTORY and ADD_REACTIONS */
    function addReaction(message, reaction) {
      requestManager_ts_5.RequestManager.put(
        discord_ts_7.endpoints.CHANNEL_MESSAGE_REACTION_ME(
          message.channelID,
          message.id,
          reaction,
        ),
      );
    }
    exports_194("addReaction", addReaction);
    /** Removes a reaction from the bot on this message. Reaction takes the form of **name:id** for custom guild emoji, or Unicode characters. */
    function removeReaction(message, reaction) {
      requestManager_ts_5.RequestManager.delete(
        discord_ts_7.endpoints.CHANNEL_MESSAGE_REACTION_ME(
          message.channelID,
          message.id,
          reaction,
        ),
      );
    }
    exports_194("removeReaction", removeReaction);
    /** Removes all reactions for all emojis on this message. */
    function removeAllReactions(message) {
      if (
        message.guildID &&
        !permissions_ts_5.botHasPermission(
          message.guildID,
          [permission_ts_5.Permissions.MANAGE_MESSAGES],
        )
      ) {
        throw new Error(errors_ts_5.Errors.MISSING_MANAGE_MESSAGES);
      }
      requestManager_ts_5.RequestManager.delete(
        discord_ts_7.endpoints.CHANNEL_MESSAGE_REACTIONS(
          message.channelID,
          message.id,
        ),
      );
    }
    exports_194("removeAllReactions", removeAllReactions);
    /** Removes all reactions for a single emoji on this message. Reaction takes the form of **name:id** for custom guild emoji, or Unicode characters. */
    function removeReactionEmoji(message, reaction) {
      if (
        message.guildID &&
        !permissions_ts_5.botHasPermission(
          message.guildID,
          [permission_ts_5.Permissions.MANAGE_MESSAGES],
        )
      ) {
        throw new Error(errors_ts_5.Errors.MISSING_MANAGE_MESSAGES);
      }
      requestManager_ts_5.RequestManager.delete(
        discord_ts_7.endpoints.CHANNEL_MESSAGE_REACTION(
          message.channelID,
          message.id,
          reaction,
        ),
      );
    }
    exports_194("removeReactionEmoji", removeReactionEmoji);
    /** Get a list of users that reacted with this emoji. */
    async function getReactions(message, reaction) {
      const result =
        (await requestManager_ts_5.RequestManager.get(
          discord_ts_7.endpoints.CHANNEL_MESSAGE_REACTION(
            message.channelID,
            message.id,
            reaction,
          ),
        ));
      const guild = message.guild();
      return result.map((res) => {
        return guild?.members.get(res.id) || res;
      });
    }
    exports_194("getReactions", getReactions);
    /** Edit the message. */
    async function editMessage(message, content) {
      if (message.author.id !== client_ts_7.botID) {
        throw "You can only edit a message that was sent by the bot.";
      }
      if (typeof content === "string") {
        content = { content };
      }
      if (message.guildID) {
        if (
          !permissions_ts_5.botHasPermission(
            message.guildID,
            [permission_ts_5.Permissions.SEND_MESSAGES],
          )
        ) {
          throw new Error(errors_ts_5.Errors.MISSING_SEND_MESSAGES);
        }
        if (
          content.tts &&
          !permissions_ts_5.botHasPermission(
            message.guildID,
            [permission_ts_5.Permissions.SEND_TTS_MESSAGES],
          )
        ) {
          throw new Error(errors_ts_5.Errors.MISSING_SEND_TTS_MESSAGE);
        }
      }
      if (content.content && content.content.length > 2000) {
        throw new Error(errors_ts_5.Errors.MESSAGE_MAX_LENGTH);
      }
      const result = await requestManager_ts_5.RequestManager.patch(
        discord_ts_7.endpoints.CHANNEL_MESSAGE(message.channelID, message.id),
        content,
      );
      return message_ts_3.createMessage(result);
    }
    exports_194("editMessage", editMessage);
    return {
      setters: [
        function (message_ts_3_1) {
          message_ts_3 = message_ts_3_1;
        },
        function (delay_ts_5_1) {
          delay_ts_5 = delay_ts_5_1;
        },
        function (client_ts_7_1) {
          client_ts_7 = client_ts_7_1;
        },
        function (channel_ts_8_1) {
          channel_ts_8 = channel_ts_8_1;
        },
        function (permission_ts_5_1) {
          permission_ts_5 = permission_ts_5_1;
        },
        function (errors_ts_5_1) {
          errors_ts_5 = errors_ts_5_1;
        },
        function (requestManager_ts_5_1) {
          requestManager_ts_5 = requestManager_ts_5_1;
        },
        function (discord_ts_7_1) {
          discord_ts_7 = discord_ts_7_1;
        },
        function (permissions_ts_5_1) {
          permissions_ts_5 = permissions_ts_5_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/mod",
  [
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/client",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/requestManager",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/module/shardingManager",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/channel",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/guild",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/member",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/message",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/structures/role",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/handlers/channel",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/handlers/guild",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/handlers/member",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/handlers/message",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/activity",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/cdn",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/channel",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/discord",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/errors",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/fetch",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/guild",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/member",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/message",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/options",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/permission",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/presence",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/types/role",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/cache",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/cdn",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/logger",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/permissions",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/utils/utils",
  ],
  function (exports_195, context_195) {
    "use strict";
    var client_ts_8;
    var __moduleName = context_195 && context_195.id;
    function exportStar_11(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default") exports[n] = m[n];
      }
      exports_195(exports);
    }
    return {
      setters: [
        function (client_ts_8_1) {
          client_ts_8 = client_ts_8_1;
          exportStar_11(client_ts_8_1);
        },
        function (requestManager_ts_6_1) {
          exportStar_11(requestManager_ts_6_1);
        },
        function (shardingManager_ts_4_1) {
          exportStar_11(shardingManager_ts_4_1);
        },
        function (channel_ts_9_1) {
          exportStar_11(channel_ts_9_1);
        },
        function (guild_ts_2_1) {
          exportStar_11(guild_ts_2_1);
        },
        function (member_ts_3_1) {
          exportStar_11(member_ts_3_1);
        },
        function (message_ts_4_1) {
          exportStar_11(message_ts_4_1);
        },
        function (role_ts_4_1) {
          exportStar_11(role_ts_4_1);
        },
        function (channel_ts_10_1) {
          exportStar_11(channel_ts_10_1);
        },
        function (guild_ts_3_1) {
          exportStar_11(guild_ts_3_1);
        },
        function (member_ts_4_1) {
          exportStar_11(member_ts_4_1);
        },
        function (message_ts_5_1) {
          exportStar_11(message_ts_5_1);
        },
        function (activity_ts_2_1) {
          exportStar_11(activity_ts_2_1);
        },
        function (cdn_ts_3_1) {
          exportStar_11(cdn_ts_3_1);
        },
        function (channel_ts_11_1) {
          exportStar_11(channel_ts_11_1);
        },
        function (discord_ts_8_1) {
          exportStar_11(discord_ts_8_1);
        },
        function (errors_ts_6_1) {
          exportStar_11(errors_ts_6_1);
        },
        function (fetch_ts_1_1) {
          exportStar_11(fetch_ts_1_1);
        },
        function (guild_ts_4_1) {
          exportStar_11(guild_ts_4_1);
        },
        function (member_ts_5_1) {
          exportStar_11(member_ts_5_1);
        },
        function (message_ts_6_1) {
          exportStar_11(message_ts_6_1);
        },
        function (options_ts_2_1) {
          exportStar_11(options_ts_2_1);
        },
        function (permission_ts_6_1) {
          exportStar_11(permission_ts_6_1);
        },
        function (presence_ts_1_1) {
          exportStar_11(presence_ts_1_1);
        },
        function (role_ts_5_1) {
          exportStar_11(role_ts_5_1);
        },
        function (cache_ts_9_1) {
          exportStar_11(cache_ts_9_1);
        },
        function (cdn_ts_4_1) {
          exportStar_11(cdn_ts_4_1);
        },
        function (logger_ts_3_1) {
          exportStar_11(logger_ts_3_1);
        },
        function (permissions_ts_6_1) {
          exportStar_11(permissions_ts_6_1);
        },
        function (utils_ts_4_1) {
          exportStar_11(utils_ts_4_1);
        },
      ],
      execute: function () {
        exports_195("default", client_ts_8.default);
      },
    };
  },
);
System.register(
  "file:///Users/manuelrauber/projects/private/discord-bot/src/deps",
  [
    "https://deno.land/x/alosaur/mod",
    "https://deno.land/std@0.56.0/fs/mod",
    "https://deno.land/std@0.56.0/path/mod",
    "https://deno.land/std@0.56.0/log/mod",
    "https://deno.land/x/dotenv/mod",
    "https://deno.land/x/debuglog/debug",
    "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v5/mod",
  ],
  function (exports_196, context_196) {
    "use strict";
    var __moduleName = context_196 && context_196.id;
    return {
      setters: [
        function (mod_ts_36_1) {
          exports_196({
            "Controller": mod_ts_36_1["Controller"],
            "Get": mod_ts_36_1["Get"],
            "Area": mod_ts_36_1["Area"],
            "App": mod_ts_36_1["App"],
            "container": mod_ts_36_1["container"],
            "instanceCachingFactory": mod_ts_36_1["instanceCachingFactory"],
            "Injectable": mod_ts_36_1["Injectable"],
            "Inject": mod_ts_36_1["Inject"],
          });
        },
        function (mod_ts_37_1) {
          exports_196({
            "readJsonSync": mod_ts_37_1["readJsonSync"],
          });
        },
        function (mod_ts_38_1) {
          exports_196({
            "join": mod_ts_38_1["join"],
          });
        },
        function (alosaurLog_1) {
          exports_196("alosaurLog", alosaurLog_1);
        },
        function (mod_ts_39_1) {
          exports_196({
            "config": mod_ts_39_1["config"],
          });
        },
        function (debugLog_1) {
          exports_196("debugLog", debugLog_1);
        },
        function (mod_ts_40_1) {
          exports_196({
            "createClient": mod_ts_40_1["createClient"],
            "Intents": mod_ts_40_1["Intents"],
          });
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "file:///Users/manuelrauber/projects/private/discord-bot/src/api/health.controller",
  ["file:///Users/manuelrauber/projects/private/discord-bot/src/deps"],
  function (exports_197, context_197) {
    "use strict";
    var deps_ts_8, HealthController;
    var __moduleName = context_197 && context_197.id;
    return {
      setters: [
        function (deps_ts_8_1) {
          deps_ts_8 = deps_ts_8_1;
        },
      ],
      execute: function () {
        HealthController = /** @class */ (() => {
          let HealthController = class HealthController {
            check() {
              return { ok: true };
            }
          };
          __decorate(
            [
              deps_ts_8.Get("/check"),
            ],
            HealthController.prototype,
            "check",
            null,
          );
          HealthController = __decorate([
            deps_ts_8.Controller("/health"),
          ], HealthController);
          return HealthController;
        })();
        exports_197("HealthController", HealthController);
      },
    };
  },
);
System.register(
  "file:///Users/manuelrauber/projects/private/discord-bot/src/api/area",
  [
    "file:///Users/manuelrauber/projects/private/discord-bot/src/deps",
    "file:///Users/manuelrauber/projects/private/discord-bot/src/api/health.controller",
  ],
  function (exports_198, context_198) {
    "use strict";
    var deps_ts_9, health_controller_ts_1, ApiArea;
    var __moduleName = context_198 && context_198.id;
    return {
      setters: [
        function (deps_ts_9_1) {
          deps_ts_9 = deps_ts_9_1;
        },
        function (health_controller_ts_1_1) {
          health_controller_ts_1 = health_controller_ts_1_1;
        },
      ],
      execute: function () {
        ApiArea = /** @class */ (() => {
          let ApiArea = class ApiArea {
          };
          ApiArea = __decorate([
            deps_ts_9.Area({
              baseRoute: "/api",
              controllers: [health_controller_ts_1.HealthController],
            }),
          ], ApiArea);
          return ApiArea;
        })();
        exports_198("ApiArea", ApiArea);
      },
    };
  },
);
System.register(
  "file:///Users/manuelrauber/projects/private/discord-bot/src/utils",
  ["file:///Users/manuelrauber/projects/private/discord-bot/src/deps"],
  function (exports_199, context_199) {
    "use strict";
    var deps_ts_10, deriveDebug;
    var __moduleName = context_199 && context_199.id;
    return {
      setters: [
        function (deps_ts_10_1) {
          deps_ts_10 = deps_ts_10_1;
        },
      ],
      execute: function () {
        exports_199(
          "deriveDebug",
          deriveDebug = (name) => {
            return deps_ts_10.debugLog.default(`BFS:${name}`);
          },
        );
      },
    };
  },
);
System.register(
  "file:///Users/manuelrauber/projects/private/discord-bot/src/application/configuration.provider",
  [
    "file:///Users/manuelrauber/projects/private/discord-bot/src/deps",
    "file:///Users/manuelrauber/projects/private/discord-bot/src/utils",
  ],
  function (exports_200, context_200) {
    "use strict";
    var deps_ts_11, utils_ts_5, debug, ConfigurationProvider;
    var __moduleName = context_200 && context_200.id;
    return {
      setters: [
        function (deps_ts_11_1) {
          deps_ts_11 = deps_ts_11_1;
        },
        function (utils_ts_5_1) {
          utils_ts_5 = utils_ts_5_1;
        },
      ],
      execute: function () {
        debug = utils_ts_5.deriveDebug("ConfigurationProvider");
        ConfigurationProvider = class ConfigurationProvider {
          get current() {
            return Object.freeze(this.internalConfiguration);
          }
          initialize() {
            debug("Initializing...");
            deps_ts_11.config({ export: true });
            this.loadJsonConfigurationFile();
            this.internalConfiguration = {
              server: this.validateServerConfiguration(),
              discord: this.validateDiscordConfiguration(),
            };
          }
          loadJsonConfigurationFile() {
            const file = deps_ts_11.join(Deno.cwd(), "configuration.json");
            debug(`Trying to read from configuration file ${file}`);
            if (!Deno.statSync(file).isFile) {
              debug("Configuration file was not found.");
              return;
            }
            this.configurationFile = deps_ts_11.readJsonSync(file);
          }
          validateServerConfiguration() {
            // @ts-ignore
            const port = +Deno.env.get("PORT") || 8080;
            return { port };
          }
          validateDiscordConfiguration() {
            const token = Deno.env.get("DISCORD_TOKEN") ||
              this.configurationFile.discord.token;
            const prefix = this.configurationFile.discord.prefix || "!";
            if (!token) {
              throw new Error("DISCORD_TOKEN not set.");
            }
            return { token, prefix };
          }
        };
        exports_200("ConfigurationProvider", ConfigurationProvider);
      },
    };
  },
);
System.register(
  "file:///Users/manuelrauber/projects/private/discord-bot/src/application/di-tokens",
  [],
  function (exports_201, context_201) {
    "use strict";
    var DiTokens;
    var __moduleName = context_201 && context_201.id;
    return {
      setters: [],
      execute: function () {
        exports_201(
          "DiTokens",
          DiTokens = {
            Configuration: Symbol.for("Configuration"),
          },
        );
      },
    };
  },
);
System.register(
  "file:///Users/manuelrauber/projects/private/discord-bot/src/bot/event-handler",
  [
    "file:///Users/manuelrauber/projects/private/discord-bot/src/deps",
    "file:///Users/manuelrauber/projects/private/discord-bot/src/utils",
  ],
  function (exports_202, context_202) {
    "use strict";
    var deps_ts_12, utils_ts_6, debug, EventHandler;
    var __moduleName = context_202 && context_202.id;
    return {
      setters: [
        function (deps_ts_12_1) {
          deps_ts_12 = deps_ts_12_1;
        },
        function (utils_ts_6_1) {
          utils_ts_6 = utils_ts_6_1;
        },
      ],
      execute: function () {
        debug = utils_ts_6.deriveDebug("EventHandler");
        EventHandler = /** @class */ (() => {
          let EventHandler = class EventHandler {
            ready() {
              debug("Ready event received.");
            }
            messageCreate(message) {
              console.log(message.content);
            }
          };
          EventHandler = __decorate([
            deps_ts_12.Injectable(),
          ], EventHandler);
          return EventHandler;
        })();
        exports_202("EventHandler", EventHandler);
      },
    };
  },
);
System.register(
  "file:///Users/manuelrauber/projects/private/discord-bot/src/bot/discord-bot",
  [
    "file:///Users/manuelrauber/projects/private/discord-bot/src/application/di-tokens",
    "file:///Users/manuelrauber/projects/private/discord-bot/src/deps",
    "file:///Users/manuelrauber/projects/private/discord-bot/src/utils",
    "file:///Users/manuelrauber/projects/private/discord-bot/src/bot/event-handler",
  ],
  function (exports_203, context_203) {
    "use strict";
    var di_tokens_ts_1,
      deps_ts_13,
      utils_ts_7,
      event_handler_ts_1,
      debug,
      DiscordBot;
    var __moduleName = context_203 && context_203.id;
    return {
      setters: [
        function (di_tokens_ts_1_1) {
          di_tokens_ts_1 = di_tokens_ts_1_1;
        },
        function (deps_ts_13_1) {
          deps_ts_13 = deps_ts_13_1;
        },
        function (utils_ts_7_1) {
          utils_ts_7 = utils_ts_7_1;
        },
        function (event_handler_ts_1_1) {
          event_handler_ts_1 = event_handler_ts_1_1;
        },
      ],
      execute: function () {
        debug = utils_ts_7.deriveDebug("DiscordBot");
        DiscordBot = /** @class */ (() => {
          let DiscordBot = class DiscordBot {
            constructor(configuration, eventHandler) {
              this.configuration = configuration;
              this.eventHandler = eventHandler;
              this.hasStarted = false;
            }
            async start() {
              if (this.hasStarted) {
                debug("The bot is already running.");
                return Promise.resolve();
              }
              this.hasStarted = true;
              debug("Initializing...");
              await deps_ts_13.createClient({
                token: this.configuration.discord.token,
                intents: [
                  deps_ts_13.Intents.GUILD_MESSAGES,
                  deps_ts_13.Intents.GUILDS,
                ],
                eventHandlers: this.eventHandler,
              });
            }
          };
          DiscordBot = __decorate([
            deps_ts_13.Injectable(),
            __param(
              0,
              deps_ts_13.Inject(di_tokens_ts_1.DiTokens.Configuration),
            ),
            __param(1, deps_ts_13.Inject(event_handler_ts_1.EventHandler)),
          ], DiscordBot);
          return DiscordBot;
        })();
        exports_203("DiscordBot", DiscordBot);
      },
    };
  },
);
System.register(
  "file:///Users/manuelrauber/projects/private/discord-bot/src/application/alosaur-debug-adapter",
  [
    "file:///Users/manuelrauber/projects/private/discord-bot/src/deps",
    "file:///Users/manuelrauber/projects/private/discord-bot/src/utils",
  ],
  function (exports_204, context_204) {
    "use strict";
    var deps_ts_14, utils_ts_8, debug, AlosaurDebug, AlosaurDebugAdapter;
    var __moduleName = context_204 && context_204.id;
    return {
      setters: [
        function (deps_ts_14_1) {
          deps_ts_14 = deps_ts_14_1;
        },
        function (utils_ts_8_1) {
          utils_ts_8 = utils_ts_8_1;
        },
      ],
      execute: function () {
        debug = utils_ts_8.deriveDebug("Alosaur");
        AlosaurDebug = class AlosaurDebug
          extends deps_ts_14.alosaurLog.handlers.BaseHandler {
          log(message) {
            debug(message);
          }
        };
        AlosaurDebugAdapter = class AlosaurDebugAdapter {
          static async apply() {
            await deps_ts_14.alosaurLog.setup({
              handlers: {
                console: new AlosaurDebug("DEBUG"),
              },
              loggers: {
                default: {
                  level: "DEBUG",
                  handlers: ["console"],
                },
              },
            });
          }
        };
        exports_204("AlosaurDebugAdapter", AlosaurDebugAdapter);
      },
    };
  },
);
System.register(
  "file:///Users/manuelrauber/projects/private/discord-bot/src/application/application",
  [
    "file:///Users/manuelrauber/projects/private/discord-bot/src/api/area",
    "file:///Users/manuelrauber/projects/private/discord-bot/src/bot/discord-bot",
    "file:///Users/manuelrauber/projects/private/discord-bot/src/bot/event-handler",
    "file:///Users/manuelrauber/projects/private/discord-bot/src/deps",
    "file:///Users/manuelrauber/projects/private/discord-bot/src/utils",
    "file:///Users/manuelrauber/projects/private/discord-bot/src/application/alosaur-debug-adapter",
    "file:///Users/manuelrauber/projects/private/discord-bot/src/application/configuration.provider",
    "file:///Users/manuelrauber/projects/private/discord-bot/src/application/di-tokens",
  ],
  function (exports_205, context_205) {
    "use strict";
    var area_ts_1,
      discord_bot_ts_1,
      event_handler_ts_2,
      deps_ts_15,
      utils_ts_9,
      alosaur_debug_adapter_ts_1,
      configuration_provider_ts_1,
      di_tokens_ts_2,
      debug,
      Application;
    var __moduleName = context_205 && context_205.id;
    return {
      setters: [
        function (area_ts_1_1) {
          area_ts_1 = area_ts_1_1;
        },
        function (discord_bot_ts_1_1) {
          discord_bot_ts_1 = discord_bot_ts_1_1;
        },
        function (event_handler_ts_2_1) {
          event_handler_ts_2 = event_handler_ts_2_1;
        },
        function (deps_ts_15_1) {
          deps_ts_15 = deps_ts_15_1;
        },
        function (utils_ts_9_1) {
          utils_ts_9 = utils_ts_9_1;
        },
        function (alosaur_debug_adapter_ts_1_1) {
          alosaur_debug_adapter_ts_1 = alosaur_debug_adapter_ts_1_1;
        },
        function (configuration_provider_ts_1_1) {
          configuration_provider_ts_1 = configuration_provider_ts_1_1;
        },
        function (di_tokens_ts_2_1) {
          di_tokens_ts_2 = di_tokens_ts_2_1;
        },
      ],
      execute: function () {
        debug = utils_ts_9.deriveDebug("Application");
        Application = class Application {
          async initialize() {
            this.initializeDependencyInjection();
            await alosaur_debug_adapter_ts_1.AlosaurDebugAdapter.apply();
            this.app = new deps_ts_15.App(
              { areas: [area_ts_1.ApiArea], logging: true },
            );
          }
          async start() {
            if (!this.app) {
              debug("Can not start server, did you run initialize?");
              return;
            }
            await this.startDiscordBot();
            await this.startHttpServer();
          }
          async startDiscordBot() {
            const discordBot = deps_ts_15.container.resolve(
              discord_bot_ts_1.DiscordBot,
            );
            await discordBot.start();
          }
          async startHttpServer() {
            const configuration = deps_ts_15.container.resolve(
              di_tokens_ts_2.DiTokens.Configuration,
            );
            await this.app.listen(`:${configuration.server.port}`);
          }
          initializeDependencyInjection() {
            deps_ts_15.container.registerSingleton(discord_bot_ts_1.DiscordBot);
            deps_ts_15.container.registerSingleton(
              event_handler_ts_2.EventHandler,
            );
            deps_ts_15.container.registerSingleton(
              configuration_provider_ts_1.ConfigurationProvider,
            );
            deps_ts_15.container.register(
              di_tokens_ts_2.DiTokens.Configuration,
              {
                useFactory: deps_ts_15.instanceCachingFactory((resolver) => {
                  const configurationProvider = resolver.resolve(
                    configuration_provider_ts_1.ConfigurationProvider,
                  );
                  configurationProvider.initialize();
                  return configurationProvider.current;
                }),
              },
            );
          }
        };
        exports_205("Application", Application);
      },
    };
  },
);
System.register(
  "file:///Users/manuelrauber/projects/private/discord-bot/src/index",
  ["file:///Users/manuelrauber/projects/private/discord-bot/src/application/application"],
  function (exports_206, context_206) {
    "use strict";
    var application_ts_1, application;
    var __moduleName = context_206 && context_206.id;
    return {
      setters: [
        function (application_ts_1_1) {
          application_ts_1 = application_ts_1_1;
        },
      ],
      execute: async function () {
        application = new application_ts_1.Application();
        await application.initialize();
        await application.start();
      },
    };
  },
);

await __instantiateAsync(
  "file:///Users/manuelrauber/projects/private/discord-bot/src/index",
);

