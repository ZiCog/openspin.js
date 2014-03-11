//
// openspin-pre.js
// 
// This is a wrapper function around the Emscripten generated code
// See hello-post.js for the tail end of this wrapper.
// See https://github.com/mdaines/viz.js/ for original inspiration about pre and post.
// 
openspin = function (moduleConf) {
    var Module = moduleConf;
//
// Emscripten generated code goes here...
//


// Note: For maximum-speed code, see "Optimizing Code" on the Emscripten wiki, https://github.com/kripken/emscripten/wiki/Optimizing-Code
// Note: Some Emscripten settings may limit the speed of the generated code.
// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');

// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  if (!Module['print']) Module['print'] = function print(x) {
    process['stdout'].write(x + '\n');
  };
  if (!Module['printErr']) Module['printErr'] = function printErr(x) {
    process['stderr'].write(x + '\n');
  };

  var nodeFS = require('fs');
  var nodePath = require('path');

  Module['read'] = function read(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };

  Module['readBinary'] = function readBinary(filename) { return Module['read'](filename, true) };

  Module['load'] = function load(f) {
    globalEval(read(f));
  };

  Module['arguments'] = process['argv'].slice(2);

  module['exports'] = Module;
}
else if (ENVIRONMENT_IS_SHELL) {
  if (!Module['print']) Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm

  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function read() { throw 'no read() available (jsc?)' };
  }

  Module['readBinary'] = function readBinary(f) {
    return read(f, 'binary');
  };

  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  this['Module'] = Module;

  eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined"); // wipe out the SpiderMonkey shell 'gc' function, which can confuse closure (uses it as a minified name, and it is then initted to a non-falsey value unexpectedly)
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function read(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };

  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  if (typeof console !== 'undefined') {
    if (!Module['print']) Module['print'] = function print(x) {
      console.log(x);
    };
    if (!Module['printErr']) Module['printErr'] = function printErr(x) {
      console.log(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    if (!Module['print']) Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }

  if (ENVIRONMENT_IS_WEB) {
    this['Module'] = Module;
  } else {
    Module['load'] = importScripts;
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}

function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function load(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***

// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];

// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];

// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}



// === Auto-generated preamble library stuff ===

//========================================
// Runtime code shared with compiler
//========================================

var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      return '(((' +target + ')+' + (quantum-1) + ')&' + -quantum + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?{ ?[^}]* ?}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type) {
    switch (type) {
      case 'i1': case 'i8': return 1;
      case 'i16': return 2;
      case 'i32': return 4;
      case 'i64': return 8;
      case 'float': return 4;
      case 'double': return 8;
      default: {
        if (type[type.length-1] === '*') {
          return Runtime.QUANTUM_SIZE; // A pointer
        } else if (type[0] === 'i') {
          var bits = parseInt(type.substr(1));
          assert(bits % 8 === 0);
          return bits/8;
        } else {
          return 0;
        }
      }
    }
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (vararg) return 8;
    if (!vararg && (type == 'i64' || type == 'double')) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    var index = 0;
    type.flatIndexes = type.fields.map(function(field) {
      index++;
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        if (field[1] === '0') {
          // this is [0 x something]. When inside another structure like here, it must be at the end,
          // and it adds no size
          // XXX this happens in java-nbody for example... assert(index === type.fields.length, 'zero-length in the middle!');
          size = 0;
          if (Types.types[field]) {
            alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
          } else {
            alignSize = type.alignSize || QUANTUM_SIZE;
          }
        } else {
          size = Types.types[field].flatSize;
          alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
        }
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else if (field[0] === '<') {
        // vector type
        size = alignSize = Types.types[field].flatSize; // fully aligned
      } else if (field[0] === 'i') {
        // illegal integer field, that could not be legalized because it is an internal structure field
        // it is ok to have such fields, if we just use them as markers of field size and nothing more complex
        size = alignSize = parseInt(field.substr(1))/8;
        assert(size % 1 === 0, 'cannot handle non-byte-size field ' + field);
      } else {
        assert(false, 'invalid type for calculateStructAlignment');
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    if (type.name_ && type.name_[0] === '[') {
      // arrays have 2 elements, so we get the proper difference. then we scale here. that way we avoid
      // allocating a potentially huge array for [999999 x i8] etc.
      type.flatSize = parseInt(type.name_.substr(1))*type.flatSize/2;
    }
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2*(1 + i);
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  getAsmConst: function (code, numArgs) {
    // code is a constant string on the heap, so we can cache these
    if (!Runtime.asmConstCache) Runtime.asmConstCache = {};
    var func = Runtime.asmConstCache[code];
    if (func) return func;
    var args = [];
    for (var i = 0; i < numArgs; i++) {
      args.push(String.fromCharCode(36) + i); // $0, $1 etc
    }
    code = Pointer_stringify(code);
    if (code[0] === '"') {
      // tolerate EM_ASM("..code..") even though EM_ASM(..code..) is correct
      if (code.indexOf('"', 1) === code.length-1) {
        code = code.substr(1, code.length-2);
      } else {
        // something invalid happened, e.g. EM_ASM("..code($0)..", input)
        abort('invalid EM_ASM input |' + code + '|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)');
      }
    }
    return Runtime.asmConstCache[code] = eval('(function(' + args.join(',') + '){ ' + code + ' })'); // new Function does not allow upvars in node
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function dynCall_wrapper() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xFF;

      if (buffer.length == 0) {
        if ((code & 0x80) == 0x00) {        // 0xxxxxxx
          return String.fromCharCode(code);
        }
        buffer.push(code);
        if ((code & 0xE0) == 0xC0) {        // 110xxxxx
          needed = 1;
        } else if ((code & 0xF0) == 0xE0) { // 1110xxxx
          needed = 2;
        } else {                            // 11110xxx
          needed = 3;
        }
        return '';
      }

      if (needed) {
        buffer.push(code);
        needed--;
        if (needed > 0) return '';
      }

      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var c4 = buffer[3];
      var ret;
      if (buffer.length == 2) {
        ret = String.fromCharCode(((c1 & 0x1F) << 6)  | (c2 & 0x3F));
      } else if (buffer.length == 3) {
        ret = String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6)  | (c3 & 0x3F));
      } else {
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        var codePoint = ((c1 & 0x07) << 18) | ((c2 & 0x3F) << 12) |
                        ((c3 & 0x3F) << 6)  | (c4 & 0x3F);
        ret = String.fromCharCode(
          Math.floor((codePoint - 0x10000) / 0x400) + 0xD800,
          (codePoint - 0x10000) % 0x400 + 0xDC00);
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function processJSString(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = (((STACKTOP)+7)&-8); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = (((STATICTOP)+7)&-8); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + size)|0;DYNAMICTOP = (((DYNAMICTOP)+7)&-8); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+((low>>>0)))+((+((high>>>0)))*(+4294967296))) : ((+((low>>>0)))+((+((high|0)))*(+4294967296)))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}


Module['Runtime'] = Runtime;









//========================================
// Runtime essentials
//========================================

var __THREW__ = 0; // Used in checking for thrown exceptions.

var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;

var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;

function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

var globalScope = this;

// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = Module['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}

// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      value = intArrayFromString(value);
      type = 'array';
    }
    if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}

// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;

// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;

// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}
Module['allocate'] = allocate;

function Pointer_stringify(ptr, /* optional */ length) {
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;

  var ret = '';

  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }

  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF16ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
    if (codeUnit == 0)
      return str;
    ++i;
    // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
    str += String.fromCharCode(codeUnit);
  }
}
Module['UTF16ToString'] = UTF16ToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16LE form. The copy will require at most (str.length*2+1)*2 bytes of space in the HEAP.
function stringToUTF16(str, outPtr) {
  for(var i = 0; i < str.length; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[(((outPtr)+(i*2))>>1)]=codeUnit;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[(((outPtr)+(str.length*2))>>1)]=0;
}
Module['stringToUTF16'] = stringToUTF16;

// Given a pointer 'ptr' to a null-terminated UTF32LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF32ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}
Module['UTF32ToString'] = UTF32ToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32LE form. The copy will require at most (str.length+1)*4 bytes of space in the HEAP,
// but can use less, since str.length does not return the number of characters in the string, but the number of UTF-16 code units in the string.
function stringToUTF32(str, outPtr) {
  var iChar = 0;
  for(var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    var codeUnit = str.charCodeAt(iCodeUnit); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++iCodeUnit);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[(((outPtr)+(iChar*4))>>2)]=codeUnit;
    ++iChar;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[(((outPtr)+(iChar*4))>>2)]=0;
}
Module['stringToUTF32'] = stringToUTF32;

function demangle(func) {
  try {
    // Special-case the entry point, since its name differs from other name mangling.
    if (func == 'Object._main' || func == '_main') {
      return 'main()';
    }
    if (typeof func === 'number') func = Pointer_stringify(func);
    if (func[0] !== '_') return func;
    if (func[1] !== '_') return func; // C function
    if (func[2] !== 'Z') return func;
    switch (func[3]) {
      case 'n': return 'operator new()';
      case 'd': return 'operator delete()';
    }
    var i = 3;
    // params, etc.
    var basicTypes = {
      'v': 'void',
      'b': 'bool',
      'c': 'char',
      's': 'short',
      'i': 'int',
      'l': 'long',
      'f': 'float',
      'd': 'double',
      'w': 'wchar_t',
      'a': 'signed char',
      'h': 'unsigned char',
      't': 'unsigned short',
      'j': 'unsigned int',
      'm': 'unsigned long',
      'x': 'long long',
      'y': 'unsigned long long',
      'z': '...'
    };
    function dump(x) {
      //return;
      if (x) Module.print(x);
      Module.print(func);
      var pre = '';
      for (var a = 0; a < i; a++) pre += ' ';
      Module.print (pre + '^');
    }
    var subs = [];
    function parseNested() {
      i++;
      if (func[i] === 'K') i++; // ignore const
      var parts = [];
      while (func[i] !== 'E') {
        if (func[i] === 'S') { // substitution
          i++;
          var next = func.indexOf('_', i);
          var num = func.substring(i, next) || 0;
          parts.push(subs[num] || '?');
          i = next+1;
          continue;
        }
        if (func[i] === 'C') { // constructor
          parts.push(parts[parts.length-1]);
          i += 2;
          continue;
        }
        var size = parseInt(func.substr(i));
        var pre = size.toString().length;
        if (!size || !pre) { i--; break; } // counter i++ below us
        var curr = func.substr(i + pre, size);
        parts.push(curr);
        subs.push(curr);
        i += pre + size;
      }
      i++; // skip E
      return parts;
    }
    var first = true;
    function parse(rawList, limit, allowVoid) { // main parser
      limit = limit || Infinity;
      var ret = '', list = [];
      function flushList() {
        return '(' + list.join(', ') + ')';
      }
      var name;
      if (func[i] === 'N') {
        // namespaced N-E
        name = parseNested().join('::');
        limit--;
        if (limit === 0) return rawList ? [name] : name;
      } else {
        // not namespaced
        if (func[i] === 'K' || (first && func[i] === 'L')) i++; // ignore const and first 'L'
        var size = parseInt(func.substr(i));
        if (size) {
          var pre = size.toString().length;
          name = func.substr(i + pre, size);
          i += pre + size;
        }
      }
      first = false;
      if (func[i] === 'I') {
        i++;
        var iList = parse(true);
        var iRet = parse(true, 1, true);
        ret += iRet[0] + ' ' + name + '<' + iList.join(', ') + '>';
      } else {
        ret = name;
      }
      paramLoop: while (i < func.length && limit-- > 0) {
        //dump('paramLoop');
        var c = func[i++];
        if (c in basicTypes) {
          list.push(basicTypes[c]);
        } else {
          switch (c) {
            case 'P': list.push(parse(true, 1, true)[0] + '*'); break; // pointer
            case 'R': list.push(parse(true, 1, true)[0] + '&'); break; // reference
            case 'L': { // literal
              i++; // skip basic type
              var end = func.indexOf('E', i);
              var size = end - i;
              list.push(func.substr(i, size));
              i += size + 2; // size + 'EE'
              break;
            }
            case 'A': { // array
              var size = parseInt(func.substr(i));
              i += size.toString().length;
              if (func[i] !== '_') throw '?';
              i++; // skip _
              list.push(parse(true, 1, true)[0] + ' [' + size + ']');
              break;
            }
            case 'E': break paramLoop;
            default: ret += '?' + c; break paramLoop;
          }
        }
      }
      if (!allowVoid && list.length === 1 && list[0] === 'void') list = []; // avoid (void)
      return rawList ? list : ret + flushList();
    }
    return parse();
  } catch(e) {
    return func;
  }
}

function demangleAll(text) {
  return text.replace(/__Z[\w\d_]+/g, function(x) { var y = demangle(x); return x === y ? x : (x + ' [' + y + ']') });
}

function stackTrace() {
  var stack = new Error().stack;
  return stack ? demangleAll(stack) : '(no stack trace available)'; // Stack trace is not available at least on IE10 and Safari 6.
}

// Memory management

var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return (x+4095)&-4096;
}

var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk

function enlargeMemory() {
  abort('Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value ' + TOTAL_MEMORY + ', or (2) set Module.TOTAL_MEMORY before the program runs.');
}

var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 134217728;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;

var totalMemory = 4096;
while (totalMemory < TOTAL_MEMORY || totalMemory < 2*TOTAL_STACK) {
  if (totalMemory < 16*1024*1024) {
    totalMemory *= 2;
  } else {
    totalMemory += 16*1024*1024
  }
}
if (totalMemory !== TOTAL_MEMORY) {
  Module.printErr('increasing TOTAL_MEMORY to ' + totalMemory + ' to be more reasonable');
  TOTAL_MEMORY = totalMemory;
}

// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'Cannot fallback to non-typed array case: Code is too specialized');

var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);

// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');

Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;

function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited

var runtimeInitialized = false;

function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}

function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module['addOnInit'] = Module.addOnInit = addOnInit;

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;

function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module['addOnExit'] = Module.addOnExit = addOnExit;

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;

// Tools

// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;

// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr;
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;

function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;

function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=str.charCodeAt(i);
  }
  if (!dontAddNull) HEAP8[(((buffer)+(str.length))|0)]=0;
}
Module['writeAsciiToMemory'] = writeAsciiToMemory;

function unSign(value, bits, ignore, sig) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore, sig) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}

// check for imul support, and also for correctness ( https://bugs.webkit.org/show_bug.cgi?id=126345 )
if (!Math['imul'] || Math['imul'](0xffffffff, 5) !== -5) Math['imul'] = function imul(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];


var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_min = Math.min;

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled

function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}
Module['removeRunDependency'] = removeRunDependency;

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data


var memoryInitializer = null;

// === Body ===



STATIC_BASE = 8;

STATICTOP = STATIC_BASE + 2179736;


/* global initializers */ __ATINIT__.push({ func: function() { runPostSets() } });







var _stdout;
var _stdout=_stdout=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);;
var _stderr;
var _stderr=_stderr=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);;








































































































































































































































































































































































































































































































































































































































































































































































































































































































































































var __ZTVN10__cxxabiv120__si_class_type_infoE;
__ZTVN10__cxxabiv120__si_class_type_infoE=allocate([0,0,0,0,96,39,0,0,2,0,0,0,24,0,0,0,14,0,0,0,12,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);;
var __ZTVN10__cxxabiv117__class_type_infoE;
__ZTVN10__cxxabiv117__class_type_infoE=allocate([0,0,0,0,112,39,0,0,4,0,0,0,8,0,0,0,14,0,0,0,12,0,0,0,2,0,0,0,4,0,0,0,4,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);;


















var __ZTISt9exception;











































var __ZN12SymbolEngineC1Ev;
var __ZN12SymbolEngineD1Ev;
/* memory initializer */ allocate([68,111,110,101,46,0,0,0,85,110,114,101,99,111,103,110,105,122,101,100,32,116,101,120,116,32,101,110,99,111,100,105,110,103,32,102,111,114,109,97,116,33,0,0,0,0,0,0,84,111,111,32,109,97,110,121,32,102,105,108,101,115,33,0,128,34,0,0,8,35,0,0,64,26,0,0,152,21,0,0,184,18,0,0,184,12,0,0,216,10,0,0,112,8,0,0,48,6,0,0,232,3,0,0,80,37,0,0,40,35,0,0,104,33,0,0,48,32,0,0,72,31,0,0,88,30,0,0,168,29,0,0,248,28,0,0,80,28,0,0,208,27,0,0,24,27,0,0,112,26,0,0,160,25,0,0,232,24,0,0,64,24,0,0,112,23,0,0,8,23,0,0,208,22,0,0,168,22,0,0,96,22,0,0,8,22,0,0,200,21,0,0,96,21,0,0,248,20,0,0,192,20,0,0,136,20,0,0,72,20,0,0,16,20,0,0,248,19,0,0,120,19,0,0,0,19,0,0,216,18,0,0,104,18,0,0,16,14,0,0,248,13,0,0,208,13,0,0,184,13,0,0,160,13,0,0,104,13,0,0,64,13,0,0,24,13,0,0,248,12,0,0,112,12,0,0,88,12,0,0,48,12,0,0,24,12,0,0,232,11,0,0,208,11,0,0,160,11,0,0,96,11,0,0,24,11,0,0,248,10,0,0,176,10,0,0,120,10,0,0,56,10,0,0,16,10,0,0,208,9,0,0,152,9,0,0,64,9,0,0,40,9,0,0,192,8,0,0,152,8,0,0,48,8,0,0,0,8,0,0,176,7,0,0,120,7,0,0,64,7,0,0,32,7,0,0,232,6,0,0,192,6,0,0,136,6,0,0,96,6,0,0,232,5,0,0,184,5,0,0,152,5,0,0,120,5,0,0,72,5,0,0,32,5,0,0,240,4,0,0,208,4,0,0,96,4,0,0,32,4,0,0,176,3,0,0,144,3,0,0,104,3,0,0,64,3,0,0,24,3,0,0,240,2,0,0,184,2,0,0,88,2,0,0,200,37,0,0,128,37,0,0,8,37,0,0,216,36,0,0,176,36,0,0,136,36,0,0,96,36,0,0,40,36,0,0,208,35,0,0,176,35,0,0,96,35,0,0,56,35,0,0,208,34,0,0,160,34,0,0,104,34,0,0,72,34,0,0,40,34,0,0,0,34,0,0,95,112,137,0,255,9,47,15,10,0,0,0,100,0,0,0,232,3,0,0,16,39,0,0,160,134,1,0,64,66,15,0,128,150,152,0,0,225,245,5,87,79,82,68,70,73,76,76,0,0,0,0,0,0,0,0,83,121,109,98,111,108,115,32,95,67,76,75,77,79,68,69,44,32,95,67,76,75,70,82,69,81,44,32,95,88,73,78,70,82,69,81,32,99,97,110,32,111,110,108,121,32,98,101,32,117,115,101,100,32,97,115,32,105,110,116,101,103,101,114,32,99,111,110,115,116,97,110,116,115,0,0,0,0,0,0,66,89,84,69,70,73,76,76,0,0,0,0,0,0,0,0,95,83,84,65,67,75,32,97,110,100,32,95,70,82,69,69,32,109,117,115,116,32,115,117,109,32,116,111,32,117,110,100,101,114,32,56,107,0,0,0,80,85,66,32,32,0,0,0,83,84,82,67,79,77,80,0,82,69,83,32,105,115,32,110,111,116,32,97,108,108,111,119,101,100,32,105,110,32,79,82,71,88,32,109,111,100,101,0,83,84,82,83,73,90,69,0,82,101,103,105,115,116,101,114,32,105,115,32,110,111,116,32,97,108,108,111,119,101,100,32,104,101,114,101,0,0,0,0,67,79,71,78,69,87,0,0,63,95,82,69,84,32,97,100,100,114,101,115,115,32,105,115,32,111,117,116,32,111,102,32,114,97,110,103,101,0,0,0,82,69,66,79,79,84,0,0,63,95,82,69,84,32,97,100,100,114,101,115,115,32,105,115,32,110,111,116,32,108,111,110,103,0,0,0,0,0,0,0,67,72,73,80,86,69,82,0,80,85,66,47,67,79,78,32,108,105,115,116,32,111,118,101,114,102,108,111,119,0,0,0,67,76,75,70,82,69,81,0,79,84,72,69,82,32,109,117,115,116,32,98,101,32,108,97,115,116,32,99,97,115,101,0,92,0,0,0,0,0,0,0,101,108,115,101,105,102,100,101,102,0,0,0,0,0,0,0,67,76,75,77,79,68,69,0,95,67,76,75,70,82,69,81,47,95,88,73,78,70,82,69,81,32,110,111,116,32,97,108,108,111,119,101,100,32,119,105,116,104,32,82,67,70,65,83,84,47,82,67,83,76,79,87,0,0,0,0,0,0,0,0,34,36,34,32,105,115,32,110,111,116,32,97,108,108,111,119,101,100,32,104,101,114,101,0,13,68,105,115,116,105,108,108,101,100,32,108,111,110,103,115,58,32,37,100,0,0,0,0,76,79,79,75,68,79,87,78,90,0,0,0,0,0,0,0,79,114,105,103,105,110,32,101,120,99,101,101,100,115,32,36,49,70,48,32,108,105,109,105,116,0,0,0,0,0,0,0,37,115,32,58,32,101,114,114,111,114,32,58,32,79,98,106,101,99,116,32,110,101,115,116,105,110,103,32,101,120,99,101,101,100,115,32,108,105,109,105,116,32,111,102,32,37,100,32,108,101,118,101,108,115,46,10,0,0,0,0,0,0,0,0,76,79,79,75,68,79,87,78,0,0,0,0,0,0,0,0,79,98,106,101,99,116,32,101,120,99,101,101,100,115,32,51,50,107,0,0,0,0,0,0,76,79,79,75,85,80,90,0,79,114,105,103,105,110,32,101,120,99,101,101,100,115,32,70,73,84,32,108,105,109,105,116,0,0,0,0,0,0,0,0,32,58,32,0,0,0,0,0,76,79,79,75,85,80,0,0,79,98,106,101,99,116,32,100,105,115,116,105,108,108,101,114,32,111,118,101,114,102,108,111,119,0,0,0,0,0,0,0,82,69,84,85,82,78,0,0,79,98,106,101,99,116,32,99,111,117,110,116,32,109,117,115,116,32,98,101,32,102,114,111,109,32,49,32,116,111,32,50,53,53,0,0,0,0,0,0,65,66,79,82,84,0,0,0,78,111,32,80,85,66,32,114,111,117,116,105,110,101,115,32,102,111,117,110,100,0,0,0,81,85,73,84,0,0,0,0,78,111,32,99,97,115,101,115,32,101,110,99,111,117,110,116,101,114,101,100,0,0,0,0,78,69,88,84,0,0,0,0,77,101,109,111,114,121,32,105,110,115,116,114,117,99,116,105,111,110,115,32,99,97,110,110,111,116,32,117,115,101,32,87,82,47,78,82,0,0,0,0,83,84,69,80,0,0,0,0,76,105,109,105,116,32,111,102,32,50,53,54,32,115,117,98,114,111,117,116,105,110,101,115,32,43,32,111,98,106,101,99,116,115,32,101,120,99,101,101,100,101,100,0,0,0,0,0,58,0,0,0,0,0,0,0,101,108,115,101,0,0,0,0,84,79,0,0,0,0,0,0,67,65,76,76,32,115,121,109,98,111,108,32,109,117,115,116,32,110,111,116,32,101,120,99,101,101,100,32,50,53,50,32,99,104,97,114,97,99,116,101,114,115,0,0,0,0,0,0,76,105,109,105,116,32,111,102,32,49,53,32,112,97,114,97,109,101,116,101,114,115,32,101,120,99,101,101,100,101,100,0,70,82,79,77,0,0,0,0,76,105,109,105,116,32,111,102,32,52,48,57,54,32,108,111,99,97,108,32,118,97,114,105,97,98,108,101,115,32,101,120,99,101,101,100,101,100,0,0,37,115,124,45,37,115,10,0,85,78,84,73,76,0,0,0,76,105,109,105,116,32,111,102,32,49,54,32,69,76,83,69,73,70,115,32,101,120,99,101,101,100,101,100,0,0,0,0,87,72,73,76,69,0,0,0,76,105,109,105,116,32,111,102,32,49,44,48,52,56,44,53,55,54,32,68,65,84,32,115,121,109,98,111,108,115,32,101,120,99,101,101,100,101,100,0,95,68,69,66,85,71,0,0,82,69,80,69,65,84,0,0,76,105,115,116,32,105,115,32,116,111,111,32,108,97,114,103,101,0,0,0,0,0,0,0,79,84,72,69,82,0,0,0,76,105,109,105,116,32,111,102,32,51,50,32,117,110,105,113,117,101,32,65,82,67,72,73,86,69,32,102,105,108,101,115,32,101,120,99,101,101,100,101,100,0,0,0,0,0,0,0,67,65,83,69,0,0,0,0,76,105,109,105,116,32,111,102,32,51,50,32,117,110,105,113,117,101,32,80,82,69,67,79,77,80,73,76,69,32,102,105,108,101,115,32,101,120,99,101,101,100,101,100,0,0,0,0,69,76,83,69,0,0,0,0,76,105,109,105,116,32,111,102,32,51,50,32,117,110,105,113,117,101,32,68,65,84,32,102,105,108,101,115,32,101,120,99,101,101,100,101,100,0,0,0,69,76,83,69,73,70,78,79,84,0,0,0,0,0,0,0,13,95,67,76,75,70,82,69,81,58,32,37,48,56,88,13,13,0,0,0,0,0,0,0,76,105,109,105,116,32,111,102,32,51,50,32,117,110,105,113,117,101,32,111,98,106,101,99,116,115,32,101,120,99,101,101,100,101,100,0,0,0,0,0,69,76,83,69,73,70,0,0,76,105,109,105,116,32,111,102,32,56,32,110,101,115,116,101,100,32,98,108,111,99,107,115,32,101,120,99,101,101,100,101,100,0,0,0,0,0,0,0,35,0,0,0,0,0,0,0,105,102,110,100,101,102,0,0,73,70,78,79,84,0,0,0,95,67,76,75,70,82,69,81,32,111,114,32,95,88,73,78,70,82,69,81,32,109,117,115,116,32,98,101,32,115,112,101,99,105,102,105,101,100,0,0,76,105,109,105,116,32,111,102,32,54,52,32,99,97,115,101,115,32,101,120,99,101,101,100,101,100,0,0,0,0,0,0,73,70,0,0,0,0,0,0,73,110,116,101,103,101,114,32,111,112,101,114,97,116,111,114,32,110,111,116,32,97,108,108,111,119,101,100,32,105,110,32,102,108,111,97,116,105,110,103,45,112,111,105,110,116,32,101,120,112,114,101,115,115,105,111,110,0,0,0,0,0,0,0,76,105,110,101,58,10,37,115,10,79,102,102,101,110,100,105,110,103,32,73,116,101,109,58,32,37,115,10,0,0,0,0,70,73,76,69,0,0,0,0,73,110,116,101,114,110,97,108,0,0,0,0,0,0,0,0,65,82,67,72,73,86,69,0,73,110,116,101,103,101,114,32,110,111,116,32,97,108,108,111,119,101,100,32,105,110,32,102,108,111,97,116,105,110,103,45,112,111,105,110,116,32,101,120,112,114,101,115,115,105,111,110,0,0,0,0,0,0,0,0,80,82,69,67,79,77,80,73,76,69,0,0,0,0,0,0,95,88,73,78,70,82,69,81,0,0,0,0,0,0,0,0,73,110,118,97,108,105,100,32,102,105,108,101,110,97,109,101,44,32,117,115,101,32,34,70,105,108,101,110,97,109,101,73,110,81,117,111,116,101,115,34,0,0,0,0,0,0,0,0,76,79,78,71,0,0,0,0,73,110,118,97,108,105,100,32,102,105,108,101,110,97,109,101,32,99,104,97,114,97,99,116,101,114,0,0,0,0,0,0,73,110,118,97,108,105,100,32,111,98,106,101,99,116,32,102,105,108,101,32,0,0,0,0,87,79,82,68,0,0,0,0,73,110,116,101,114,110,97,108,32,68,65,84,32,102,105,108,101,32,110,111,116,32,102,111,117,110,100,0,0,0,0,0,66,89,84,69,0,0,0,0,73,110,118,97,108,105,100,32,100,111,117,98,108,101,45,98,105,110,97,114,121,32,110,117,109,98,101,114,0,0,0,0,68,69,86,0,0,0,0,0,13,13,95,67,76,75,77,79,68,69,58,32,37,48,50,88,0,0,0,0,0,0,0,0,73,110,118,97,108,105,100,32,95,67,76,75,77,79,68,69,32,115,112,101,99,105,102,105,101,100,0,0,0,0,0,0,105,110,102,105,110,105,116,121,0,0,0,0,0,0,0,0,80,82,73,0,0,0,0,0,73,110,118,97,108,105,100,32,98,105,110,97,114,121,32,110,117,109,98,101,114,0,0,0,61,0,0,0,0,0,0,0,80,85,66,0,0,0,0,0,67,111,110,115,116,97,110,116,32,101,120,99,101,101,100,115,32,51,50,32,98,105,116,115,0,0,0,0,0,0,0,0,70,108,111,97,116,105,110,103,45,112,111,105,110,116,32,111,118,101,114,102,108,111,119,0,79,66,74,0,0,0,0,0,70,108,111,97,116,105,110,103,45,112,111,105,110,116,32,110,111,116,32,97,108,108,111,119,101,100,32,105,110,32,105,110,116,101,103,101,114,32,101,120,112,114,101,115,115,105,111,110,0,0,0,0,0,0,0,0,105,102,100,101,102,0,0,0,68,65,84,0,0,0,0,0,70,108,111,97,116,105,110,103,45,112,111,105,110,116,32,99,111,110,115,116,97,110,116,32,109,117,115,116,32,98,101,32,119,105,116,104,105,110,32,43,47,45,32,51,46,52,101,43,51,56,0,0,0,0,0,0,86,65,82,0,0,0,0,0,70,105,108,101,110,97,109,101,32,116,111,111,32,108,111,110,103,0,0,0,0,0,0,0,67,79,78,0,0,0,0,0,95,67,76,75,70,82,69,81,0,0,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,84,79,0,0,0,0,0,83,84,82,73,78,71,0,0,69,120,112,101,99,116,101,100,32,83,84,69,80,32,111,114,32,101,110,100,32,111,102,32,108,105,110,101,0,0,0,0,67,79,78,83,84,65,78,84,0,0,0,0,0,0,0,0,69,109,112,116,121,32,115,116,114,105,110,103,0,0,0,0,84,82,85,78,67,0,0,0,69,120,112,101,99,116,101,100,32,34,93,34,0,0,0,0,82,79,85,78,68,0,0,0,13,79,66,74,32,98,121,116,101,115,58,32,37,100,0,0,69,120,112,101,99,116,101,100,32,34,41,34,0,0,0,0,70,76,79,65,84,0,0,0,69,120,112,101,99,116,101,100,32,34,125,125,34,0,0,0,44,0,0,0,0,0,0,0,85,110,116,101,114,109,105,110,97,116,101,100,32,35,105,102,32,115,116,97,114,116,105,110,103,32,97,116,32,108,105,110,101,32,37,100,0,0,0,0,78,79,84,0,0,0,0,0,67,97,110,110,111,116,32,99,111,109,112,117,116,101,32,115,113,117,97,114,101,32,114,111,111,116,32,111,102,32,110,101,103,97,116,105,118,101,32,102,108,111,97,116,105,110,103,45,112,111,105,110,116,32,110,117,109,98,101,114,0,0,0,0,69,120,112,101,99,116,101,100,32,34,125,34,0,0,0,0,37,115,37,99,37,115,0,0,61,62,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,34,35,34,0,0,0,0,69,110,100,32,79,102,32,70,105,108,101,0,0,0,0,0,61,60,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,34,124,34,32,111,114,32,101,110,100,32,111,102,32,108,105,110,101,0,0,0,0,0,61,61,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,80,82,69,67,79,77,80,73,76,69,32,111,114,32,65,82,67,72,73,86,69,0,0,60,62,0,0,0,0,0,0,95,67,76,75,77,79,68,69,0,0,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,34,91,34,0,0,0,0,62,0,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,34,40,34,0,0,0,0,60,0,0,0,0,0,0,0,69,120,112,114,101,115,115,105,111,110,32,105,115,32,116,111,111,32,99,111,109,112,108,101,120,0,0,0,0,0,0,0,94,94,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,70,82,79,77,0,0,0,47,47,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,34,61,34,32,34,91,34,32,34,44,34,32,111,114,32,101,110,100,32,111,102,32,108,105,110,101,0,0,0,0,0,32,37,48,50,88,0,0,0,117,115,97,103,101,58,32,111,112,101,110,115,112,105,110,10,32,32,32,32,32,32,32,32,32,91,32,45,104,32,93,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,100,105,115,112,108,97,121,32,116,104,105,115,32,104,101,108,112,10,32,32,32,32,32,32,32,32,32,91,32,45,76,32,111,114,32,45,73,32,60,112,97,116,104,62,32,93,32,32,32,32,97,100,100,32,97,32,100,105,114,101,99,116,111,114,121,32,116,111,32,116,104,101,32,105,110,99,108,117,100,101,32,112,97,116,104,10,32,32,32,32,32,32,32,32,32,91,32,45,111,32,60,112,97,116,104,62,32,93,32,32,32,32,32,32,32,32,32,32,111,117,116,112,117,116,32,102,105,108,101,110,97,109,101,10,32,32,32,32,32,32,32,32,32,91,32,45,98,32,93,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,111,117,116,112,117,116,32,98,105,110,97,114,121,32,102,105,108,101,32,102,111,114,109,97,116,10,32,32,32,32,32,32,32,32,32,91,32,45,101,32,93,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,111,117,116,112,117,116,32,101,101,112,114,111,109,32,102,105,108,101,32,102,111,114,109,97,116,10,32,32,32,32,32,32,32,32,32,91,32,45,99,32,93,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,111,117,116,112,117,116,32,111,110,108,121,32,68,65,84,32,115,101,99,116,105,111,110,115,10,32,32,32,32,32,32,32,32,32,91,32,45,100,32,93,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,100,117,109,112,32,111,117,116,32,100,111,99,32,109,111,100,101,10,32,32,32,32,32,32,32,32,32,91,32,45,116,32,93,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,111,117,116,112,117,116,32,106,117,115,116,32,116,104,101,32,111,98,106,101,99,116,32,102,105,108,101,32,116,114,101,101,10,32,32,32,32,32,32,32,32,32,91,32,45,102,32,93,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,111,117,116,112,117,116,32,97,32,108,105,115,116,32,111,102,32,102,105,108,101,110,97,109,101,115,32,102,111,114,32,117,115,101,32,105,110,32,97,114,99,104,105,118,105,110,103,10,32,32,32,32,32,32,32,32,32,91,32,45,113,32,93,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,113,117,105,101,116,32,109,111,100,101,32,40,115,117,112,112,114,101,115,115,32,98,97,110,110,101,114,32,97,110,100,32,110,111,110,45,101,114,114,111,114,32,116,101,120,116,41,10,32,32,32,32,32,32,32,32,32,91,32,45,118,32,93,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,118,101,114,98,111,115,101,32,111,117,116,112,117,116,10,32,32,32,32,32,32,32,32,32,91,32,45,112,32,93,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,100,105,115,97,98,108,101,32,116,104,101,32,112,114,101,112,114,111,99,101,115,115,111,114,10,32,32,32,32,32,32,32,32,32,91,32,45,97,32,93,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,117,115,101,32,97,108,116,101,114,110,97,116,105,118,101,32,112,114,101,112,114,111,99,101,115,115,111,114,32,114,117,108,101,115,10,32,32,32,32,32,32,32,32,32,91,32,45,68,32,60,100,101,102,105,110,101,62,32,93,32,32,32,32,32,32,32,32,97,100,100,32,97,32,100,101,102,105,110,101,10,32,32,32,32,32,32,32,32,32,91,32,45,77,32,60,115,105,122,101,62,32,93,32,32,32,32,32,32,32,32,32,32,115,105,122,101,32,111,102,32,101,101,112,114,111,109,32,40,117,112,32,116,111,32,49,54,55,55,55,50,49,54,32,98,121,116,101,115,41,10,32,32,32,32,32,32,32,32,32,91,32,45,115,32,93,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,100,117,109,112,32,80,85,66,32,38,32,67,79,78,32,115,121,109,98,111,108,32,105,110,102,111,114,109,97,116,105,111,110,32,102,111,114,32,116,111,112,32,111,98,106,101,99,116,10,32,32,32,32,32,32,32,32,32,60,110,97,109,101,46,115,112,105,110,62,32,32,32,32,32,32,32,32,32,32,32,32,115,112,105,110,32,102,105,108,101,32,116,111,32,99,111,109,112,105,108,101,10,10,0,0,0,0,0,47,0,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,101,110,100,32,111,102,32,108,105,110,101,0,0,0,0,49,57,58,53,56,58,48,57,0,0,0,0,0,0,0,0,93,0,0,0,0,0,0,0,42,42,0,0,0,0,0,0,85,110,97,98,108,101,32,116,111,32,111,112,101,110,32,102,105,108,101,32,37,115,0,0,66,108,111,99,107,110,101,115,116,32,115,116,97,99,107,32,111,118,101,114,102,108,111,119,0,0,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,34,46,34,0,0,0,0,77,97,114,32,32,54,32,50,48,49,52,0,0,0,0,0,42,0,0,0,0,0,0,0,69,105,116,104,101,114,32,95,67,76,75,70,82,69,81,32,111,114,32,95,88,73,78,70,82,69,81,32,109,117,115,116,32,98,101,32,115,112,101,99,105,102,105,101,100,44,32,98,117,116,32,110,111,116,32,98,111,116,104,0,0,0,0,0,67,111,109,112,105,108,101,100,32,111,110,32,37,115,32,37,115,10,0,0,0,0,0,0,37,115,40,37,100,58,37,100,41,32,58,32,101,114,114,111,114,32,58,32,37,115,10,0,124,60,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,34,44,34,32,111,114,32,34,41,34,0,0,0,0,0,80,114,111,112,101,108,108,101,114,32,83,112,105,110,47,80,65,83,77,32,67,111,109,112,105,108,101,114,32,39,79,112,101,110,83,112,105,110,39,32,40,99,41,50,48,49,50,45,50,48,49,51,32,80,97,114,97,108,108,97,120,32,73,110,99,46,32,68,66,65,32,80,97,114,97,108,108,97,120,32,83,101,109,105,99,111,110,100,117,99,116,111,114,46,10,0,79,82,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,34,44,34,0,0,0,0,62,124,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,34,58,34,0,0,0,0,80,85,66,44,32,37,115,44,32,37,100,44,32,37,100,10,0,0,0,0,0,0,0,0,95,70,82,69,69,0,0,0,65,78,68,0,0,0,0,0,69,120,112,101,99,116,101,100,32,34,44,34,32,111,114,32,101,110,100,32,111,102,32,108,105,110,101,0,0,0,0,0,80,65,82,65,77,44,32,37,115,44,32,37,115,44,32,37,100,44,32,37,100,10,0,0,62,60,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,66,89,84,69,44,32,87,79,82,68,44,32,111,114,32,76,79,78,71,0,0,0,0,67,79,78,70,44,32,37,115,44,32,37,102,10,0,0,0,126,62,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,32,117,110,105,113,117,101,32,118,97,114,105,97,98,108,101,32,110,97,109,101,0,67,79,78,44,32,37,115,44,32,37,100,10,0,0,0,0,45,0,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,32,117,110,105,113,117,101,32,115,117,98,114,111,117,116,105,110,101,32,110,97,109,101,0,0,0,0,0,0,0,37,48,52,88,45,0,0,0,80,114,111,103,114,97,109,32,115,105,122,101,32,105,115,32,37,100,32,98,121,116,101,115,10,0,0,0,0,0,0,0,115,116,100,58,58,98,97,100,95,97,108,108,111,99,0,0,43,0,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,32,117,110,105,113,117,101,32,114,101,115,117,108,116,32,110,97,109,101,0,0,0,119,98,0,0,0,0,0,0,91,0,0,0,0,0,0,0,94,0,0,0,0,0,0,0,66,108,111,99,107,32,100,101,115,105,103,110,97,116,111,114,32,109,117,115,116,32,98,101,32,105,110,32,102,105,114,115,116,32,99,111,108,117,109,110,0,0,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,32,117,110,105,113,117,101,32,112,97,114,97,109,101,116,101,114,32,110,97,109,101,0,0,0,0,0,0,0,0,124,0,0,0,0,0,0,0,84,89,80,69,58,32,37,48,50,88,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,32,117,110,105,113,117,101,32,110,97,109,101,44,32,66,89,84,69,44,32,87,79,82,68,44,32,76,79,78,71,44,32,111,114,32,97,115,115,101,109,98,108,121,32,105,110,115,116,114,117,99,116,105,111,110,0,0,0,0,0,0,0,114,98,0,0,0,0,0,0,124,124,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,32,117,110,105,113,117,101,32,99,111,110,115,116,97,110,116,32,110,97,109,101,32,111,114,32,34,35,34,0,0,67,111,109,112,105,108,105,110,103,46,46,46,10,37,115,10,0,0,0,0,0,0,0,0,38,0,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,32,118,97,114,105,97,98,108,101,0,0,0,0,0,101,101,112,114,111,109,0,0,33,0,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,32,117,110,105,113,117,101,32,111,98,106,101,99,116,32,110,97,109,101,0,0,0,98,105,110,97,114,121,0,0,95,83,84,65,67,75,0,0,60,35,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,32,116,101,114,109,105,110,97,116,105,110,103,32,113,117,111,116,101,0,0,0,0,80,76,76,49,54,88,0,0,80,76,76,56,88,0,0,0,80,76,76,52,88,0,0,0,80,76,76,50,88,0,0,0,37,115,58,37,100,58,32,37,115,58,32,0,0,0,0,0,80,76,76,49,88,0,0,0,88,84,65,76,51,0,0,0,35,62,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,32,115,117,98,114,111,117,116,105,110,101,32,111,114,32,111,98,106,101,99,116,32,110,97,109,101,0,0,0,0,88,84,65,76,50,0,0,0,88,84,65,76,49,0,0,0,69,82,82,79,82,58,32,115,112,105,110,102,105,108,101,32,109,117,115,116,32,104,97,118,101,32,46,115,112,105,110,32,101,120,116,101,110,115,105,111,110,46,32,89,111,117,32,112,97,115,115,101,100,32,105,110,58,32,37,115,10,0,0,0,88,73,78,80,85,84,0,0,82,67,83,76,79,87,0,0,82,67,70,65,83,84,0,0,80,73,0,0,0,0,0,0,80,79,83,88,0,0,0,0,78,69,71,88,0,0,0,0,79,117,116,32,111,102,32,109,101,109,111,114,121,10,0,0,84,82,85,69,0,0,0,0,70,65,76,83,69,0,0,0,60,60,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,32,115,117,98,114,111,117,116,105,110,101,32,110,97,109,101,0,0,0,0,0,0,82,69,83,85,76,84,0,0,86,83,67,76,0,0,0,0,125,0,0,0,0,0,0,0,86,67,70,71,0,0,0,0,80,72,83,66,0,0,0,0,80,72,83,65,0,0,0,0,70,82,81,66,0,0,0,0,70,82,81,65,0,0,0,0,67,84,82,66,0,0,0,0,109,117,108,116,105,112,108,101,32,35,101,108,115,101,32,115,116,97,116,101,109,101,110,116,115,32,105,110,32,35,105,102,0,0,0,0,0,0,0,0,67,84,82,65,0,0,0,0,68,73,82,66,0,0,0,0,62,62,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,32,109,101,109,111,114,121,32,118,97,114,105,97,98,108,101,32,97,102,116,101,114,32,34,64,34,0,0,0,0,68,73,82,65,0,0,0,0,32,32,32,78,65,77,69,58,32,37,115,13,0,0,0,0,79,85,84,66,0,0,0,0,123,0,0,0,0,0,0,0,79,85,84,65,0,0,0,0,73,78,66,0,0,0,0,0,73,78,65,0,0,0,0,0,67,78,84,0,0,0,0,0,80,65,82,0,0,0,0,0,78,82,0,0,0,0,0,0,87,82,0,0,0,0,0,0,35,101,108,115,101,32,119,105,116,104,111,117,116,32,109,97,116,99,104,105,110,103,32,35,105,102,0,0,0,0,0,0,87,67,0,0,0,0,0,0,60,45,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,32,108,111,99,97,108,32,115,121,109,98,111,108,0,87,90,0,0,0,0,0,0,67,77,80,88,0,0,0,0,39,0,0,0,0,0,0,0,67,77,80,0,0,0,0,0,84,69,83,84,78,0,0,0,41,0,0,0,0,0,0,0,84,69,83,84,0,0,0,0,74,77,80,0,0,0,0,0,82,69,84,0,0,0,0,0,67,65,76,76,0,0,0,0,84,74,90,0,0,0,0,0,35,101,110,100,105,102,32,119,105,116,104,111,117,116,32,109,97,116,99,104,105,110,103,32,35,105,102,0,0,0,0,0,84,74,78,90,0,0,0,0,45,62,0,0,0,0,0,0,34,125,34,32,109,117,115,116,32,98,101,32,112,114,101,99,101,101,100,101,100,32,98,121,32,34,123,34,32,116,111,32,102,111,114,109,32,97,32,99,111,109,109,101,110,116,0,0,69,120,112,101,99,116,101,100,32,97,110,32,105,110,115,116,114,117,99,116,105,111,110,32,111,114,32,118,97,114,105,97,98,108,101,0,0,0,0,0,68,74,78,90,0,0,0,0,79,117,116,32,111,102,32,109,101,109,111,114,121,33,10,0,67,77,80,83,85,66,0,0,80,49,0,0,0,0,0,0,83,85,66,83,88,0,0,0,65,68,68,83,88,0,0,0,83,85,66,83,0,0,0,0,65,68,68,83,0,0,0,0,83,85,66,88,0,0,0,0,65,68,68,88,0,0,0,0,67,77,80,83,88,0,0,0,35,101,114,114,111,114,58,32,37,115,0,0,0,0,0,0,67,77,80,83,0,0,0,0,83,80,82,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,110,32,101,120,112,114,101,115,115,105,111,110,32,116,101,114,109,0,0,0,0,0,78,69,71,78,90,0,0,0,78,69,71,90,0,0,0,0,95,95,84,65,82,71,69,84,95,95,0,0,0,0,0,0,67,97,110,110,111,116,32,102,105,110,100,47,111,112,101,110,32,100,97,116,32,102,105,108,101,58,32,37,115,32,10,0,78,69,71,78,67,0,0,0,78,69,71,67,0,0,0,0,65,66,83,78,69,71,0,0,65,66,83,0,0,0,0,0,78,69,71,0,0,0,0,0,77,79,86,0,0,0,0,0,83,85,77,78,90,0,0,0,35,119,97,114,110,58,32,37,115,0,0,0,0,0,0,0,83,85,77,90,0,0,0,0,58,61,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,32,68,65,84,32,115,121,109,98,111,108,0,0,0,83,85,77,78,67,0,0,0,83,85,77,67,0,0,0,0,95,95,83,80,73,78,95,95,0,0,0,0,0,0,0,0,83,85,66,65,66,83,0,0,65,68,68,65,66,83,0,0,83,85,66,0,0,0,0,0,65,68,68,0,0,0,0,0,77,85,88,78,90,0,0,0,77,85,88,90,0,0,0,0,77,85,88,78,67,0,0,0,77,85,88,67,0,0,0,0,45,45,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,32,99,111,110,115,116,97,110,116,44,32,117,110,97,114,121,32,111,112,101,114,97,116,111,114,44,32,111,114,32,34,40,34,0,0,0,0,0,88,79,82,0,0,0,0,0,65,78,68,78,0,0,0,0,49,0,0,0,0,0,0,0,74,77,80,82,69,84,0,0,77,79,86,73,0,0,0,0,77,79,86,68,0,0,0,0,77,79,86,83,0,0,0,0,77,65,88,0,0,0,0,0,77,73,78,0,0,0,0,0,77,65,88,83,0,0,0,0,110,97,110,0,0,0,0,0,114,101,100,101,102,105,110,105,110,103,32,96,37,115,39,0,77,73,78,83,0,0,0,0,43,43,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,32,99,111,110,115,116,97,110,116,32,110,97,109,101,0,0,0,0,0,0,0,0,82,69,86,0,0,0,0,0,42,69,78,68,42,0,0,0,83,65,82,0,0,0,0,0,82,67,76,0,0,0,0,0,82,67,82,0,0,0,0,0,83,72,76,0,0,0,0,0,46,79,66,74,0,0,0,0,83,72,82,0,0,0,0,0,82,79,76,0,0,0,0,0,82,79,82,0,0,0,0,0,79,78,69,83,0,0,0,0,37,115,32,105,115,32,110,111,116,32,97,32,118,97,108,105,100,32,105,100,101,110,116,105,102,105,101,114,32,102,111,114,32,100,101,102,105,110,101,0,69,78,67,0,0,0,0,0,63,0,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,32,98,105,110,97,114,121,32,111,112,101,114,97,116,111,114,32,111,114,32,34,41,34,0,0,0,0,0,0,0,77,85,76,83,0,0,0,0,77,85,76,0,0,0,0,0,37,100,0,0,0,0,0,0,72,85,66,79,80,0,0,0,82,68,76,79,78,71,0,0,87,82,76,79,78,71,0,0,82,68,87,79,82,68,0,0,87,82,87,79,82,68,0,0,82,68,66,89,84,69,0,0,87,82,66,89,84,69,0,0,110,111,32,115,116,114,105,110,103,32,102,111,117,110,100,32,102,111,114,32,105,110,99,108,117,100,101,0,0,0,0,0,73,70,95,78,69,86,69,82,0,0,0,0,0,0,0,0,126,126,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,110,32,97,115,115,101,109,98,108,121,32,105,110,115,116,114,117,99,116,105,111,110,0,0,0,0,0,0,0,0,73,70,95,65,76,87,65,89,83,0,0,0,0,0,0,0,73,70,95,66,69,0,0,0,87,65,82,78,73,78,71,58,32,69,101,112,114,111,109,32,115,105,122,101,32,101,120,99,101,101,100,101,100,32,98,121,32,37,100,32,108,111,110,103,115,46,10,0,0,0,0,0,73,70,95,90,95,79,82,95,67,0,0,0,0,0,0,0,73,70,95,67,95,79,82,95,90,0,0,0,0,0,0,0,73,70,95,78,90,95,79,82,95,67,0,0,0,0,0,0,73,70,95,67,95,79,82,95,78,90,0,0,0,0,0,0,73,70,95,66,0,0,0,0,73,70,95,67,0,0,0,0,73,70,95,90,95,79,82,95,78,67,0,0,0,0,0,0,105,110,99,108,117,100,101,0,73,70,95,78,67,95,79,82,95,90,0,0,0,0,0,0,126,0,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,110,32,97,115,115,101,109,98,108,121,32,101,102,102,101,99,116,0,0,0,0,0,73,70,95,69,0,0,0,0,73,70,95,90,0,0,0,0,37,115,32,58,32,101,114,114,111,114,32,58,32,79,98,106,101,99,116,32,72,101,97,112,32,79,118,101,114,102,108,111,119,46,10,0,0,0,0,0,73,70,95,90,95,69,81,95,67,0,0,0,0,0,0,0,73,70,95,67,95,69,81,95,90,0,0,0,0,0,0,0,73,70,95,90,95,65,78,68,95,67,0,0,0,0,0,0,73,70,95,67,95,65,78,68,95,90,0,0,0,0,0,0,73,70,95,78,90,95,79,82,95,78,67,0,0,0,0,0,73,70,95,78,67,95,79,82,95,78,90,0,0,0,0,0,73,70,95,90,95,78,69,95,67,0,0,0,0,0,0,0,117,110,100,101,102,0,0,0,73,70,95,67,95,78,69,95,90,0,0,0,0,0,0,0,64,64,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,97,110,32,97,115,115,101,109,98,108,121,32,101,102,102,101,99,116,32,111,114,32,101,110,100,32,111,102,32,108,105,110,101,0,0,0,0,0,0,73,70,95,78,69,0,0,0,32,32,32,86,65,76,85,69,58,32,37,48,56,88,32,40,37,48,56,120,41,0,0,0,73,70,95,78,90,0,0,0,37,115,32,58,32,101,114,114,111,114,32,58,32,79,98,106,101,99,116,32,101,120,99,101,101,100,115,32,114,117,110,116,105,109,101,32,109,101,109,111,114,121,32,108,105,109,105,116,32,98,121,32,37,100,32,108,111,110,103,115,46,10,0,0,73,70,95,78,90,95,65,78,68,95,67,0,0,0,0,0,73,70,95,67,95,65,78,68,95,78,90,0,0,0,0,0,13,80,114,111,103,114,97,109,58,32,32,37,100,32,76,111,110,103,115,13,86,97,114,105,97,98,108,101,58,32,37,100,32,76,111,110,103,115,13,0,73,70,95,65,69,0,0,0,73,70,95,78,67,0,0,0,73,70,95,90,95,65,78,68,95,78,67,0,0,0,0,0,73,70,95,78,67,95,65,78,68,95,90,0,0,0,0,0,73,70,95,65,0,0,0,0,73,70,95,78,90,95,65,78,68,95,78,67,0,0,0,0,100,101,102,105,110,101,0,0,64,0,0,0,0,0,0,0,68,101,115,116,105,110,97,116,105,111,110,32,114,101,103,105,115,116,101,114,32,99,97,110,110,111,116,32,101,120,99,101,101,100,32,36,49,70,70,0,73,70,95,78,67,95,65,78,68,95,78,90,0,0,0,0,78,79,80,0,0,0,0,0,37,115,32,58,32,101,114,114,111,114,32,58,32,79,98,106,101,99,116,32,102,105,108,101,115,32,101,120,99,101,101,100,32,54,52,107,46,10,0,0,70,73,84,0,0,0,0,0,82,69,83,0,0,0,0,0,34,32,73,110,116,101,114,102,97,99,101,58,13,13,0,0,79,82,71,0,0,0,0,0,40,0,0,0,0,0,0,0,86,97,114,105,97,98,108,101,32,110,101,101,100,115,32,97,110,32,111,112,101,114,97,116,111,114,0,0,0,0,0,0,79,82,71,88,0,0,0,0,85,110,100,101,102,105,110,101,100,32,115,121,109,98,111,108,0,0,0,0,0,0,0,0,76,79,67,75,67,76,82,0,85,110,100,101,102,105,110,101,100,32,63,95,82,69,84,32,115,121,109,98,111,108,0,0,76,79,67,75,83,69,84,0,85,110,114,101,99,111,103,110,105,122,101,100,32,99,104,97,114,97,99,116,101,114,0,0,65,100,100,114,101,115,115,32,105,115,32,110,111,116,32,108,111,110,103,0,0,0,0,0,76,79,67,75,82,69,84,0,84,111,111,32,109,117,99,104,32,118,97,114,105,97,98,108,101,32,115,112,97,99,101,32,105,115,32,100,101,99,108,97,114,101,100,0,0,0,0,0,76,79,67,75,78,69,87,0,84,111,111,32,109,97,110,121,32,115,116,114,105,110,103,32,99,111,110,115,116,97,110,116,32,99,104,97,114,97,99,116,101,114,115,0,0,0,0,0,46,46,0,0,0,0,0,0,101,110,100,105,102,0,0,0,65,100,100,114,101,115,115,32,105,115,32,111,117,116,32,111,102,32,114,97,110,103,101,0,67,79,71,83,84,79,80,0,68,105,118,105,100,101,32,98,121,32,122,101,114,111,0,0,84,111,111,32,109,97,110,121,32,115,116,114,105,110,103,32,99,111,110,115,116,97,110,116,115,0,0,0,0,0,0,0,67,79,71,73,78,73,84,0,84,104,105,115,32,105,110,115,116,114,117,99,116,105,111,110,32,105,115,32,111,110,108,121,32,97,108,108,111,119,101,100,32,119,105,116,104,105,110,32,97,32,82,69,80,69,65,84,32,98,108,111,99,107,0,0,119,97,114,110,105,110,103,0,46,115,112,105,110,0,0,0,67,79,71,73,68,0,0,0,83,121,109,98,111,108,32,116,97,98,108,101,32,105,115,32,102,117,108,108,0,0,0,0,67,76,75,83,69,84,0,0,83,121,109,98,111,108,115,32,95,83,84,65,67,75,32,97,110,100,32,95,70,82,69,69,32,99,97,110,32,111,110,108,121,32,98,101,32,117,115,101,100,32,97,115,32,105,110,116,101,103,101,114,32,99,111,110,115,116,97,110,116,115,0,0,79,98,106,101,99,116,32,34,37,115,0,0,0,0,0,0,87,65,73,84,86,73,68,0,83,111,117,114,99,101,32,114,101,103,105,115,116,101,114,47,99,111,110,115,116,97,110,116,32,99,97,110,110,111,116,32,101,120,99,101,101,100,32,36,49,70,70,0,0,0,0,0,87,65,73,84,67,78,84,0,83,105,122,101,32,111,118,101,114,114,105,100,101,32,109,117,115,116,32,98,101,32,115,109,97,108,108,101,114,0,0,0,87,65,73,84,80,78,69,0,83,105,122,101,32,111,118,101,114,114,105,100,101,32,109,117,115,116,32,98,101,32,108,97,114,103,101,114,0,0,0,0,87,65,73,84,80,69,81,0,83,84,82,73,78,71,32,110,111,116,32,97,108,108,111,119,101,100,32,104,101,114,101,0,76,79,78,71,77,79,86,69,0,0,0,0,0,0,0,0,83,121,109,98,111,108,32,105,115,32,97,108,114,101,97,100,121,32,100,101,102,105,110,101,100,0,0,0,0,0,0,0,87,79,82,68,77,79,86,69,0,0,0,0,0,0,0,0,83,121,109,98,111,108,32,101,120,99,101,101,100,115,32,50,53,54,32,99,104,97,114,97,99,116,101,114,115,0,0,0,46,0,0,0,0,0,0,0,101,108,115,101,105,102,110,100,101,102,0,0,0,0,0,0,66,89,84,69,77,79,86,69,0,0,0,0,0,0,0,0,95,67,76,75,70,82,69,81,47,95,88,73,78,70,82,69,81,32,115,112,101,99,105,102,105,101,100,32,119,105,116,104,111,117,116,32,95,67,76,75,77,79,68,69,0,0,0,0,83,121,109,98,111,108,32,95,68,69,66,85,71,32,99,97,110,32,111,110,108,121,32,98,101,32,117,115,101,100,32,97,115,32,97,110,32,105,110,116,101,103,101,114,32,99,111,110,115,116,97,110,116,0,0,0,76,79,78,71,70,73,76,76,0,0,0,0,0,0,0,0,83,116,114,105,110,103,32,99,104,97,114,97,99,116,101,114,115,32,109,117,115,116,32,114,97,110,103,101,32,102,114,111,109,32,49,32,116,111,32,50,53,53,0,0,0,0,0,0,37,115,32,58,32,101,114,114,111,114,32,58,32,67,97,110,32,110,111,116,32,102,105,110,100,47,111,112,101,110,32,102,105,108,101,46,10,0,0,0,114,98,0,0,0,0,0,0,101,114,114,111,114,0,0,0,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,0,0,0,0,0,0,80,39,0,0,10,0,0,0,6,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,152,39,0,0,18,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,83,116,57,116,121,112,101,95,105,110,102,111,0,0,0,0,83,116,57,98,97,100,95,97,108,108,111,99,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,48,95,95,115,105,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,55,95,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,54,95,95,115,104,105,109,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,0,56,72,97,115,104,97,98,108,101,0,0,0,0,0,0,0,49,54,83,121,109,98,111,108,84,97,98,108,101,69,110,116,114,121,0,0,0,0,0,0,0,0,0,0,136,38,0,0,0,0,0,0,152,38,0,0,0,0,0,0,0,0,0,0,0,0,0,0,168,38,0,0,112,39,0,0,0,0,0,0,0,0,0,0,208,38,0,0,128,39,0,0,0,0,0,0,0,0,0,0,248,38,0,0,72,39,0,0,0,0,0,0,0,0,0,0,32,39,0,0,0,0,0,0,48,39,0,0,144,39,0,0,0,0,0,0,1,0,0,0,0,0,0,0,248,33,0,0,0,0,0,0,2,0,0,0,0,0,0,0,224,25,0,0,0,0,0,0,3,0,0,0,0,0,0,0,136,21,0,0,0,0,0,0,4,0,0,0,0,0,0,0,144,18,0,0,0,0,0,0,5,0,0,0,0,0,0,0,128,12,0,0,0,0,0,0,6,0,0,0,0,0,0,0,200,10], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);
/* memory initializer */ allocate([7,0,0,0,0,0,0,0,88,8,0,0,0,0,0,0,8,0,0,0,0,0,0,0,24,6,0,0,0,0,0,0,9,0,0,0,0,0,0,0,200,3,0,0,0,0,0,0,10,0,0,0,0,0,0,0,40,37,0,0,0,0,0,0,11,0,0,0,0,0,0,0,248,34,0,0,0,0,0,0,12,0,0,0,0,0,0,0,96,33,0,0,0,0,0,0,13,0,0,0,0,0,0,0,40,32,0,0,0,0,0,0,14,0,0,0,0,0,0,0,64,31,0,0,0,0,0,0,15,0,0,0,0,0,0,0,80,30,0,0,0,0,0,0,16,0,0,0,0,0,0,0,160,29,0,0,0,0,0,0,17,0,0,0,0,0,0,0,240,28,0,0,0,0,0,0,18,0,0,0,0,0,0,0,72,28,0,0,0,0,0,0,19,0,0,0,0,0,0,0,200,27,0,0,0,0,0,0,20,0,0,0,0,0,0,0,16,27,0,0,0,0,0,0,22,0,0,0,1,0,0,0,56,26,0,0,0,0,0,0,22,0,0,0,1,0,0,0,152,25,0,0,1,0,0,0,22,0,0,0,1,0,0,0,224,24,0,0,2,0,0,0,22,0,0,0,1,0,0,0,56,24,0,0,3,0,0,0,22,0,0,0,6,0,0,0,104,23,0,0,4,0,0,0,22,0,0,0,6,0,0,0,0,23,0,0,5,0,0,0,21,0,0,0,0,0,0,0,200,22,0,0,7,0,0,0,22,0,0,0,2,0,0,0,160,22,0,0,8,0,0,0,21,0,0,0,0,0,0,0,88,22,0,0,9,0,0,0,22,0,0,0,3,0,0,0,240,21,0,0,10,0,0,0,22,0,0,0,3,0,0,0,144,21,0,0,11,0,0,0,22,0,0,0,5,0,0,0,88,21,0,0,12,0,0,0,22,0,0,0,5,0,0,0,240,20,0,0,13,0,0,0,22,0,0,0,1,0,0,0,184,20,0,0,14,0,0,0,22,0,0,0,1,0,0,0,128,20,0,0,15,0,0,0,22,0,0,0,9,0,0,0,64,20,0,0,16,0,0,0,21,0,0,0,0,0,0,0,8,20,0,0,17,0,0,0,22,0,0,0,10,0,0,0,240,19,0,0,18,0,0,0,21,0,0,0,0,0,0,0,112,19,0,0,19,0,0,0,22,0,0,0,4,0,0,0,248,18,0,0,20,0,0,0,22,0,0,0,4,0,0,0,152,18,0,0,21,0,0,0,22,0,0,0,4,0,0,0,96,18,0,0,22,0,0,0,22,0,0,0,4,0,0,0,8,14,0,0,23,0,0,0,21,0,0,0,0,0,0,0,240,13,0,0,24,0,0,0,22,0,0,0,7,0,0,0,200,13,0,0,25,0,0,0,22,0,0,0,7,0,0,0,176,13,0,0,26,0,0,0,22,0,0,0,7,0,0,0,136,13,0,0,27,0,0,0,22,0,0,0,7,0,0,0,96,13,0,0,28,0,0,0,22,0,0,0,7,0,0,0,56,13,0,0,29,0,0,0,22,0,0,0,7,0,0,0,16,13,0,0,30,0,0,0,21,0,0,0,8,0,0,0,176,12,0,0,31,0,0,0,23,0,0,0,0,0,0,0,104,12,0,0,0,0,0,0,24,0,0,0,0,0,0,0,64,12,0,0,0,0,0,0,25,0,0,0,0,0,0,0,40,12,0,0,0,0,0,0,26,0,0,0,0,0,0,0,8,12,0,0,0,0,0,0,27,0,0,0,0,0,0,0,224,11,0,0,0,0,0,0,28,0,0,0,0,0,0,0,184,11,0,0,0,0,0,0,28,0,0,0,1,0,0,0,152,11,0,0,0,0,0,0,28,0,0,0,2,0,0,0,88,11,0,0,0,0,0,0,28,0,0,0,3,0,0,0,16,11,0,0,0,0,0,0,28,0,0,0,4,0,0,0,208,10,0,0,0,0,0,0,28,0,0,0,5,0,0,0,168,10,0,0,0,0,0,0,28,0,0,0,6,0,0,0,88,10,0,0,0,0,0,0,29,0,0,0,0,0,0,0,48,10,0,0,0,0,0,0,29,0,0,0,1,0,0,0,8,10,0,0,0,0,0,0,29,0,0,0,2,0,0,0,200,9,0,0,0,0,0,0,30,0,0,0,0,0,0,0,120,9,0,0,0,0,0,0,31,0,0,0,0,0,0,0,56,9,0,0,0,0,0,0,32,0,0,0,0,0,0,0,32,9,0,0,0,0,0,0,33,0,0,0,0,0,0,0,184,8,0,0,0,0,0,0,34,0,0,0,0,0,0,0,104,8,0,0,0,0,0,0,35,0,0,0,0,0,0,0,40,8,0,0,0,0,0,0,36,0,0,0,0,0,0,0,216,7,0,0,0,0,0,0,37,0,0,0,0,0,0,0,168,7,0,0,0,0,0,0,38,0,0,0,0,0,0,0,112,7,0,0,0,0,0,0,39,0,0,0,0,0,0,0,56,7,0,0,0,0,0,0,40,0,0,0,0,0,0,0,24,7,0,0,0,0,0,0,42,0,0,0,0,0,0,0,224,6,0,0,0,0,0,0,43,0,0,0,0,0,0,0,184,6,0,0,0,0,0,0,44,0,0,0,0,0,0,0,128,6,0,0,0,0,0,0,45,0,0,0,0,0,0,0,40,6,0,0,0,0,0,0,46,0,0,0,0,0,0,0,224,5,0,0,0,0,0,0,47,0,0,0,0,0,0,0,176,5,0,0,0,0,0,0,47,0,0,0,1,0,0,0,144,5,0,0,0,0,0,0,48,0,0,0,48,0,0,0,112,5,0,0,0,0,0,0,48,0,0,0,50,0,0,0,64,5,0,0,0,0,0,0,49,0,0,0,16,0,0,0,24,5,0,0,0,0,0,0,49,0,0,0,144,0,0,0,232,4,0,0,0,0,0,0,49,0,0,0,17,0,0,0,192,4,0,0,0,0,0,0,49,0,0,0,145,0,0,0,80,4,0,0,0,0,0,0,50,0,0,0,0,0,0,0,224,3,0,0,0,0,0,0,51,0,0,0,0,0,0,0,168,3,0,0,0,0,0,0,52,0,0,0,0,0,0,0,136,3,0,0,0,0,0,0,53,0,0,0,0,0,0,0,96,3,0,0,0,0,0,0,55,0,0,0,168,0,0,0,56,3,0,0,0,0,0,0,57,0,0,0,86,0,0,0,16,3,0,0,0,0,0,0,57,0,0,0,151,0,0,0,232,2,0,0,0,0,0,0,59,0,0,0,216,0,0,0,168,2,0,0,0,0,0,0,59,0,0,0,217,0,0,0,72,2,0,0,0,0,0,0,59,0,0,0,218,0,0,0,184,37,0,0,0,0,0,0,59,0,0,0,220,0,0,0,64,37,0,0,0,0,0,0,59,0,0,0,221,0,0,0,248,36,0,0,0,0,0,0,59,0,0,0,222,0,0,0,200,36,0,0,0,0,0,0,59,0,0,0,219,0,0,0,168,36,0,0,60,1,0,0,59,0,0,0,223,0,0,0,128,36,0,0,61,1,0,0,59,0,0,0,99,0,0,0,88,36,0,0,126,1,0,0,59,0,0,0,167,0,0,0,32,36,0,0,63,1,0,0,59,0,0,0,160,0,0,0,200,35,0,0,128,1,0,0,54,0,0,0,0,0,0,0,168,35,0,0,193,1,0,0,56,0,0,0,236,0,0,0,88,35,0,0,130,1,0,0,59,0,0,0,97,0,0,0,32,35,0,0,131,1,0,0,58,0,0,0,41,0,0,0,200,34,0,0,196,1,0,0,59,0,0,0,98,0,0,0,152,34,0,0,133,1,0,0,58,0,0,0,106,0,0,0,96,34,0,0,134,1,0,0,58,0,0,0,107,0,0,0,64,34,0,0,135,1,0,0,62,0,0,0,0,0,0,0,32,34,0,0,0,0,0,0,62,0,0,0,1,0,0,0,240,33,0,0,0,0,0,0,62,0,0,0,2,0,0,0,216,33,0,0,0,0,0,0,62,0,0,0,3,0,0,0,208,33,0,0,0,0,0,0,62,0,0,0,4,0,0,0,160,33,0,0,0,0,0,0,63,0,0,0,1,0,0,0,144,33,0,0,0,0,0,0,63,0,0,0,1,0,0,0,72,33,0,0,0,0,0,0,63,0,0,0,1,0,0,0,64,33,0,0,0,0,0,0,63,0,0,0,2,0,0,0,48,33,0,0,0,0,0,0,63,0,0,0,2,0,0,0,32,33,0,0,0,0,0,0,63,0,0,0,3,0,0,0,24,33,0,0,0,0,0,0,63,0,0,0,3,0,0,0,16,33,0,0,0,0,0,0,63,0,0,0,4,0,0,0,216,32,0,0,0,0,0,0,63,0,0,0,4,0,0,0,200,32,0,0,0,0,0,0,63,0,0,0,5,0,0,0,128,32,0,0,0,0,0,0,63,0,0,0,5,0,0,0,96,32,0,0,0,0,0,0,63,0,0,0,6,0,0,0,24,32,0,0,0,0,0,0,63,0,0,0,6,0,0,0,0,32,0,0,0,0,0,0,63,0,0,0,7,0,0,0,240,31,0,0,0,0,0,0,63,0,0,0,7,0,0,0,224,31,0,0,0,0,0,0,63,0,0,0,8,0,0,0,208,31,0,0,0,0,0,0,63,0,0,0,8,0,0,0,192,31,0,0,0,0,0,0,63,0,0,0,9,0,0,0,176,31,0,0,0,0,0,0,63,0,0,0,9,0,0,0,160,31,0,0,0,0,0,0,63,0,0,0,10,0,0,0,112,31,0,0,0,0,0,0,63,0,0,0,10,0,0,0,104,31,0,0,0,0,0,0,63,0,0,0,11,0,0,0,48,31,0,0,0,0,0,0,63,0,0,0,11,0,0,0,24,31,0,0,0,0,0,0,63,0,0,0,12,0,0,0,16,31,0,0,0,0,0,0,63,0,0,0,12,0,0,0,8,31,0,0,0,0,0,0,63,0,0,0,13,0,0,0,248,30,0,0,0,0,0,0,63,0,0,0,13,0,0,0,232,30,0,0,0,0,0,0,63,0,0,0,14,0,0,0,216,30,0,0,0,0,0,0,63,0,0,0,14,0,0,0,200,30,0,0,0,0,0,0,63,0,0,0,14,0,0,0,144,30,0,0,0,0,0,0,63,0,0,0,15,0,0,0,128,30,0,0,0,0,0,0,63,0,0,0,0,0,0,0,64,30,0,0,0,0,0,0,64,0,0,0,0,0,0,0,24,30,0,0,0,0,0,0,64,0,0,0,64,0,0,0,16,30,0,0,0,0,0,0,64,0,0,0,1,0,0,0,8,30,0,0,0,0,0,0,64,0,0,0,65,0,0,0,0,30,0,0,0,0,0,0,64,0,0,0,2,0,0,0,248,29,0,0,0,0,0,0,64,0,0,0,66,0,0,0,240,29,0,0,0,0,0,0,64,0,0,0,3,0,0,0,232,29,0,0,0,0,0,0,64,0,0,0,68,0,0,0,216,29,0,0,0,0,0,0,64,0,0,0,69,0,0,0,208,29,0,0,0,0,0,0,64,0,0,0,70,0,0,0,152,29,0,0,0,0,0,0,64,0,0,0,71,0,0,0,104,29,0,0,0,0,0,0,64,0,0,0,72,0,0,0,96,29,0,0,0,0,0,0,64,0,0,0,73,0,0,0,88,29,0,0,0,0,0,0,64,0,0,0,74,0,0,0,80,29,0,0,0,0,0,0,64,0,0,0,75,0,0,0,64,29,0,0,0,0,0,0,64,0,0,0,76,0,0,0,56,29,0,0,0,0,0,0,64,0,0,0,77,0,0,0,48,29,0,0,0,0,0,0,64,0,0,0,78,0,0,0,40,29,0,0,0,0,0,0,64,0,0,0,79,0,0,0,24,29,0,0,0,0,0,0,64,0,0,0,80,0,0,0,232,28,0,0,0,0,0,0,64,0,0,0,81,0,0,0,200,28,0,0,0,0,0,0,64,0,0,0,82,0,0,0,192,28,0,0,0,0,0,0,64,0,0,0,83,0,0,0,184,28,0,0,0,0,0,0,64,0,0,0,84,0,0,0,176,28,0,0,0,0,0,0,64,0,0,0,85,0,0,0,168,28,0,0,0,0,0,0,64,0,0,0,86,0,0,0,160,28,0,0,0,0,0,0,64,0,0,0,87,0,0,0,152,28,0,0,0,0,0,0,64,0,0,0,89,0,0,0,136,28,0,0,0,0,0,0,64,0,0,0,91,0,0,0,128,28,0,0,0,0,0,0,64,0,0,0,92,0,0,0,64,28,0,0,0,0,0,0,64,0,0,0,93,0,0,0,56,28,0,0,0,0,0,0,64,0,0,0,94,0,0,0,48,28,0,0,0,0,0,0,64,0,0,0,95,0,0,0,40,28,0,0,0,0,0,0,64,0,0,0,96,0,0,0,32,28,0,0,0,0,0,0,64,0,0,0,97,0,0,0,24,28,0,0,0,0,0,0,64,0,0,0,98,0,0,0,16,28,0,0,0,0,0,0,64,0,0,0,99,0,0,0,8,28,0,0,0,0,0,0,64,0,0,0,100,0,0,0,240,27,0,0,0,0,0,0,64,0,0,0,101,0,0,0,232,27,0,0,0,0,0,0,64,0,0,0,102,0,0,0,192,27,0,0,0,0,0,0,64,0,0,0,103,0,0,0,168,27,0,0,0,0,0,0,64,0,0,0,104,0,0,0,160,27,0,0,0,0,0,0,64,0,0,0,105,0,0,0,152,27,0,0,0,0,0,0,64,0,0,0,106,0,0,0,144,27,0,0,0,0,0,0,64,0,0,0,107,0,0,0,136,27,0,0,0,0,0,0,64,0,0,0,108,0,0,0,128,27,0,0,0,0,0,0,64,0,0,0,109,0,0,0,120,27,0,0,0,0,0,0,64,0,0,0,110,0,0,0,64,27,0,0,0,0,0,0,64,0,0,0,111,0,0,0,56,27,0,0,0,0,0,0,64,0,0,0,48,0,0,0,8,27,0,0,0,0,0,0,64,0,0,0,49,0,0,0,240,26,0,0,0,0,0,0,64,0,0,0,114,0,0,0,232,26,0,0,0,0,0,0,64,0,0,0,115,0,0,0,224,26,0,0,0,0,0,0,64,0,0,0,116,0,0,0,216,26,0,0,0,0,0,0,64,0,0,0,117,0,0,0,208,26,0,0,0,0,0,0,64,0,0,0,118,0,0,0,200,26,0,0,0,0,0,0,64,0,0,0,119,0,0,0,192,26,0,0,0,0,0,0,64,0,0,0,120,0,0,0,176,26,0,0,0,0,0,0,64,0,0,0,121,0,0,0,152,26,0,0,0,0,0,0,64,0,0,0,58,0,0,0,48,26,0,0,0,0,0,0,64,0,0,0,59,0,0,0,8,26,0,0,0,0,0,0,64,0,0,0,21,0,0,0,0,26,0,0,0,0,0,0,64,0,0,0,22,0,0,0,248,25,0,0,0,0,0,0,64,0,0,0,23,0,0,0,240,25,0,0,0,0,0,0,64,0,0,0,24,0,0,0,232,25,0,0,0,0,0,0,64,0,0,0,25,0,0,0,216,25,0,0,0,0,0,0,64,0,0,0,33,0,0,0,208,25,0,0,0,0,0,0,64,0,0,0,51,0,0,0,192,25,0,0,0,0,0,0,65,0,0,0,4,0,0,0,184,25,0,0,0,0,0,0,65,0,0,0,2,0,0,0,144,25,0,0,0,0,0,0,65,0,0,0,1,0,0,0,104,25,0,0,0,0,0,0,65,0,0,0,8,0,0,0,96,25,0,0,0,0,0,0,66,0,0,0,16,0,0,0,88,25,0,0,0,0,0,0,66,0,0,0,17,0,0,0,80,25,0,0,0,0,0,0,66,0,0,0,18,0,0,0,72,25,0,0,0,0,0,0,66,0,0,0,19,0,0,0,64,25,0,0,0,0,0,0,66,0,0,0,20,0,0,0,56,25,0,0,0,0,0,0,66,0,0,0,21,0,0,0,40,25,0,0,0,0,0,0,66,0,0,0,22,0,0,0,16,25,0,0,0,0,0,0,66,0,0,0,23,0,0,0,216,24,0,0,0,0,0,0,66,0,0,0,24,0,0,0,208,24,0,0,0,0,0,0,66,0,0,0,25,0,0,0,160,24,0,0,0,0,0,0,66,0,0,0,26,0,0,0,152,24,0,0,0,0,0,0,66,0,0,0,27,0,0,0,144,24,0,0,0,0,0,0,66,0,0,0,28,0,0,0,136,24,0,0,0,0,0,0,66,0,0,0,29,0,0,0,128,24,0,0,0,0,0,0,66,0,0,0,30,0,0,0,120,24,0,0,0,0,0,0,66,0,0,0,31,0,0,0,104,24,0,0,0,0,0,0,78,0,0,0,0,0,0,0,96,24,0,0,0,0,0,0,67,0,0,0,0,0,0,0,48,24,0,0,0,0,0,0,67,0,0,0,255,255,255,255,40,24,0,0,0,0,0,0,67,0,0,0,0,0,0,128,16,24,0,0,0,0,0,0,67,0,0,0,255,255,255,127,8,24,0,0,0,0,0,0,68,0,0,0,219,15,73,64,0,24,0,0,0,0,0,0,67,0,0,0,1,0,0,0,248,23,0,0,0,0,0,0,67,0,0,0,2,0,0,0,240,23,0,0,0,0,0,0,67,0,0,0,4,0,0,0,232,23,0,0,0,0,0,0,67,0,0,0,8,0,0,0,160,23,0,0,0,0,0,0,67,0,0,0,16,0,0,0,152,23,0,0,0,0,0,0,67,0,0,0,32,0,0,0,96,23,0,0,0,0,0,0,67,0,0,0,64,0,0,0,88,23,0,0,0,0,0,0,67,0,0,0,128,0,0,0,64,23,0,0,0,0,0,0,67,0,0,0,0,1,0,0,56,23,0,0,0,0,0,0,67,0,0,0,0,2,0,0,48,23,0,0,0,0,0,0,67,0,0,0,0,4,0,0,40,23,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,240,75,0,0,0,0,0,0,255,255,255,255,255,255,255,255,255,9,10,255,255,13,255,255,255,255,255,255,255,255,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,160,161,162,163,255,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,15,14,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,2,4,3,5,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,164,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,21,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,20,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,16,255,255,255,255,255,255,255,255,255,255,255,255,255,255,18,255,255,255,255,255,19,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,17,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,144,255,145,255,255,255,255,255,255,255,255,255,159,255,255,255,158,255,255,255,157,255,255,255,156,255,255,255,149,255,255,255,255,255,255,153,148,255,255,255,255,255,255,152,151,255,255,255,255,255,255,155,150,255,255,255,255,255,255,154,146,255,255,255,255,255,255,255,255,255,255,255,255,255,255,147,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,7,255,255,255,255,255,255,255,255,255,6,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE+10240);



var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);

assert(tempDoublePtr % 8 == 0);

function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

}

function copyTempDouble(ptr) {

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];

  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];

  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];

  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];

}


  
  
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};
  
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
  
  
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value;
      return value;
    }
  
  var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
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
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
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
      },basename:function (path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function (l, r) {
        return PATH.normalize(l + '/' + r);
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
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
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
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
      }};
  
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          if (stream.tty.output.length) {
            stream.tty.ops.put_char(stream.tty, 10);
          }
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              result = process['stdin']['read']();
              if (!result) {
                if (process['stdin']['_readableState'] && process['stdin']['_readableState']['ended']) {
                  return null;  // EOF
                }
                return undefined;  // no data available
              }
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }}};
  
  var MEMFS={ops_table:null,CONTENT_OWNING:1,CONTENT_FLEXIBLE:2,CONTENT_FIXED:3,mount:function (mount) {
        return MEMFS.createNode(null, '/', 16384 | 0777, 0);
      },createNode:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            },
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.contents = [];
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },ensureFlexible:function (node) {
        if (node.contentMode !== MEMFS.CONTENT_FLEXIBLE) {
          var contents = node.contents;
          node.contents = Array.prototype.slice.call(contents);
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        }
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.contents.length;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.ensureFlexible(node);
            var contents = node.contents;
            if (attr.size < contents.length) contents.length = attr.size;
            else while (attr.size > contents.length) contents.push(0);
          }
        },lookup:function (parent, name) {
          throw FS.genericErrors[ERRNO_CODES.ENOENT];
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 0777 | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else
          {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          var node = stream.node;
          node.timestamp = Date.now();
          var contents = node.contents;
          if (length && contents.length === 0 && position === 0 && buffer.subarray) {
            // just replace it with the new data
            if (canOwn && offset === 0) {
              node.contents = buffer; // this could be a subarray of Emscripten HEAP, or allocated from some other source.
              node.contentMode = (buffer.buffer === HEAP8.buffer) ? MEMFS.CONTENT_OWNING : MEMFS.CONTENT_FIXED;
            } else {
              node.contents = new Uint8Array(buffer.subarray(offset, offset+length));
              node.contentMode = MEMFS.CONTENT_FIXED;
            }
            return length;
          }
          MEMFS.ensureFlexible(node);
          var contents = node.contents;
          while (contents.length < position) contents.push(0);
          for (var i = 0; i < length; i++) {
            contents[position + i] = buffer[offset + i];
          }
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.contents.length;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.ungotten = [];
          stream.position = position;
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.ensureFlexible(stream.node);
          var contents = stream.node.contents;
          var limit = offset + length;
          while (limit > contents.length) contents.push(0);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        }}};
  
  var IDBFS={dbs:{},indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
        return MEMFS.mount.apply(null, arguments);
      },syncfs:function (mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
          if (err) return callback(err);
  
          IDBFS.getRemoteSet(mount, function(err, remote) {
            if (err) return callback(err);
  
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
  
            IDBFS.reconcile(src, dst, callback);
          });
        });
      },reconcile:function (src, dst, callback) {
        var total = 0;
  
        var create = {};
        for (var key in src.files) {
          if (!src.files.hasOwnProperty(key)) continue;
          var e = src.files[key];
          var e2 = dst.files[key];
          if (!e2 || e.timestamp > e2.timestamp) {
            create[key] = e;
            total++;
          }
        }
  
        var remove = {};
        for (var key in dst.files) {
          if (!dst.files.hasOwnProperty(key)) continue;
          var e = dst.files[key];
          var e2 = src.files[key];
          if (!e2) {
            remove[key] = e;
            total++;
          }
        }
  
        if (!total) {
          // early out
          return callback(null);
        }
  
        var completed = 0;
        function done(err) {
          if (err) return callback(err);
          if (++completed >= total) {
            return callback(null);
          }
        };
  
        // create a single transaction to handle and IDB reads / writes we'll need to do
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        transaction.onerror = function transaction_onerror() { callback(this.error); };
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
  
        for (var path in create) {
          if (!create.hasOwnProperty(path)) continue;
          var entry = create[path];
  
          if (dst.type === 'local') {
            // save file to local
            try {
              if (FS.isDir(entry.mode)) {
                FS.mkdir(path, entry.mode);
              } else if (FS.isFile(entry.mode)) {
                var stream = FS.open(path, 'w+', 0666);
                FS.write(stream, entry.contents, 0, entry.contents.length, 0, true /* canOwn */);
                FS.close(stream);
              }
              done(null);
            } catch (e) {
              return done(e);
            }
          } else {
            // save file to IDB
            var req = store.put(entry, path);
            req.onsuccess = function req_onsuccess() { done(null); };
            req.onerror = function req_onerror() { done(this.error); };
          }
        }
  
        for (var path in remove) {
          if (!remove.hasOwnProperty(path)) continue;
          var entry = remove[path];
  
          if (dst.type === 'local') {
            // delete file from local
            try {
              if (FS.isDir(entry.mode)) {
                // TODO recursive delete?
                FS.rmdir(path);
              } else if (FS.isFile(entry.mode)) {
                FS.unlink(path);
              }
              done(null);
            } catch (e) {
              return done(e);
            }
          } else {
            // delete file from IDB
            var req = store.delete(path);
            req.onsuccess = function req_onsuccess() { done(null); };
            req.onerror = function req_onerror() { done(this.error); };
          }
        }
      },getLocalSet:function (mount, callback) {
        var files = {};
  
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
  
        var check = FS.readdir(mount.mountpoint)
          .filter(isRealDir)
          .map(toAbsolute(mount.mountpoint));
  
        while (check.length) {
          var path = check.pop();
          var stat, node;
  
          try {
            var lookup = FS.lookupPath(path);
            node = lookup.node;
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
  
          if (FS.isDir(stat.mode)) {
            check.push.apply(check, FS.readdir(path)
              .filter(isRealDir)
              .map(toAbsolute(path)));
  
            files[path] = { mode: stat.mode, timestamp: stat.mtime };
          } else if (FS.isFile(stat.mode)) {
            files[path] = { contents: node.contents, mode: stat.mode, timestamp: stat.mtime };
          } else {
            return callback(new Error('node type not supported'));
          }
        }
  
        return callback(null, { type: 'local', files: files });
      },getDB:function (name, callback) {
        // look it up in the cache
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        req.onupgradeneeded = function req_onupgradeneeded() {
          db = req.result;
          db.createObjectStore(IDBFS.DB_STORE_NAME);
        };
        req.onsuccess = function req_onsuccess() {
          db = req.result;
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function req_onerror() {
          callback(this.error);
        };
      },getRemoteSet:function (mount, callback) {
        var files = {};
  
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
  
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
          transaction.onerror = function transaction_onerror() { callback(this.error); };
  
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          store.openCursor().onsuccess = function store_openCursor_onsuccess(event) {
            var cursor = event.target.result;
            if (!cursor) {
              return callback(null, { type: 'remote', db: db, files: files });
            }
  
            files[cursor.key] = cursor.value;
            cursor.continue();
          };
        });
      }};
  
  var NODEFS={isWindows:false,staticInit:function () {
        NODEFS.isWindows = !!process.platform.match(/^win/);
      },mount:function (mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, '/', NODEFS.getMode(mount.opts.root), 0);
      },createNode:function (parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node;
      },getMode:function (path) {
        var stat;
        try {
          stat = fs.lstatSync(path);
          if (NODEFS.isWindows) {
            // On Windows, directories return permission bits 'rw-rw-rw-', even though they have 'rwxrwxrwx', so 
            // propagate write bits to execute bits.
            stat.mode = stat.mode | ((stat.mode & 146) >> 1);
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        return stat.mode;
      },realPath:function (node) {
        var parts = [];
        while (node.parent !== node) {
          parts.push(node.name);
          node = node.parent;
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts);
      },flagsToPermissionStringMap:{0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"},flagsToPermissionString:function (flags) {
        if (flags in NODEFS.flagsToPermissionStringMap) {
          return NODEFS.flagsToPermissionStringMap[flags];
        } else {
          return flags;
        }
      },node_ops:{getattr:function (node) {
          var path = NODEFS.realPath(node);
          var stat;
          try {
            stat = fs.lstatSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          // node.js v0.10.20 doesn't report blksize and blocks on Windows. Fake them with default blksize of 4096.
          // See http://support.microsoft.com/kb/140365
          if (NODEFS.isWindows && !stat.blksize) {
            stat.blksize = 4096;
          }
          if (NODEFS.isWindows && !stat.blocks) {
            stat.blocks = (stat.size+stat.blksize-1)/stat.blksize|0;
          }
          return {
            dev: stat.dev,
            ino: stat.ino,
            mode: stat.mode,
            nlink: stat.nlink,
            uid: stat.uid,
            gid: stat.gid,
            rdev: stat.rdev,
            size: stat.size,
            atime: stat.atime,
            mtime: stat.mtime,
            ctime: stat.ctime,
            blksize: stat.blksize,
            blocks: stat.blocks
          };
        },setattr:function (node, attr) {
          var path = NODEFS.realPath(node);
          try {
            if (attr.mode !== undefined) {
              fs.chmodSync(path, attr.mode);
              // update the common node structure mode as well
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              var date = new Date(attr.timestamp);
              fs.utimesSync(path, date, date);
            }
            if (attr.size !== undefined) {
              fs.truncateSync(path, attr.size);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },lookup:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          var mode = NODEFS.getMode(path);
          return NODEFS.createNode(parent, name, mode);
        },mknod:function (parent, name, mode, dev) {
          var node = NODEFS.createNode(parent, name, mode, dev);
          // create the backing node for this in the fs root as well
          var path = NODEFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              fs.mkdirSync(path, node.mode);
            } else {
              fs.writeFileSync(path, '', { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return node;
        },rename:function (oldNode, newDir, newName) {
          var oldPath = NODEFS.realPath(oldNode);
          var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },unlink:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.unlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },rmdir:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.rmdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readdir:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },symlink:function (parent, newName, oldPath) {
          var newPath = PATH.join2(NODEFS.realPath(parent), newName);
          try {
            fs.symlinkSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readlink:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        }},stream_ops:{open:function (stream) {
          var path = NODEFS.realPath(stream.node);
          try {
            if (FS.isFile(stream.node.mode)) {
              stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },close:function (stream) {
          try {
            if (FS.isFile(stream.node.mode) && stream.nfd) {
              fs.closeSync(stream.nfd);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },read:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(length);
          var res;
          try {
            res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          if (res > 0) {
            for (var i = 0; i < res; i++) {
              buffer[offset + i] = nbuffer[i];
            }
          }
          return res;
        },write:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
          var res;
          try {
            res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return res;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = fs.fstatSync(stream.nfd);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code]);
              }
            }
          }
  
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
  
          stream.position = position;
          return position;
        }}};
  
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      // we don't currently perform any user-space buffering of data
    }var FS={root:null,mounts:[],devices:[null],streams:[null],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || { recurse_count: 0 };
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
  
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            current = current.mount.root;
          }
  
          // follow symlinks
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
              
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
  
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
            this.parent = null;
            this.mount = null;
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            FS.hashAddNode(this);
          };
  
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
  
          FS.FSNode.prototype = {};
  
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); },
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); },
            },
          });
        }
        return new FS.FSNode(parent, name, mode, rdev);
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return node.mounted;
      },isFile:function (mode) {
        return (mode & 61440) === 32768;
      },isDir:function (mode) {
        return (mode & 61440) === 16384;
      },isLink:function (mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function (mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function (mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function (mode) {
        return (mode & 61440) === 4096;
      },isSocket:function (mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var accmode = flag & 2097155;
        var perms = ['r', 'w', 'rw'][accmode];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        return FS.nodePermissions(dir, 'x');
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if ((flags & 2097155) !== 0 ||  // opening for write
              (flags & 512)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 1;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        if (stream.__proto__) {
          // reuse the object
          stream.__proto__ = FS.FSStream.prototype;
        } else {
          var newStream = new FS.FSStream();
          for (var p in stream) {
            newStream[p] = stream[p];
          }
          stream = newStream;
        }
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },syncfs:function (populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
  
        var completed = 0;
        var total = FS.mounts.length;
        function done(err) {
          if (err) {
            return callback(err);
          }
          if (++completed >= total) {
            callback(null);
          }
        };
  
        // sync all mounts
        for (var i = 0; i < FS.mounts.length; i++) {
          var mount = FS.mounts[i];
          if (!mount.type.syncfs) {
            done(null);
            continue;
          }
          mount.type.syncfs(mount, populate, done);
        }
      },mount:function (type, opts, mountpoint) {
        var lookup;
        if (mountpoint) {
          lookup = FS.lookupPath(mountpoint, { follow: false });
          mountpoint = lookup.path;  // use the absolute path
        }
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          root: null
        };
        // create a root node for the fs
        var root = type.mount(mount);
        root.mount = mount;
        mount.root = root;
        // assign the mount info to the mountpoint's node
        if (lookup) {
          lookup.node.mount = mount;
          lookup.node.mounted = true;
          // compatibility update FS.root if we mount to /
          if (mountpoint === '/') {
            FS.root = mount.root;
          }
        }
        // add to our cached list of mounts
        FS.mounts.push(mount);
        return root;
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 0666;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 0777;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 0666;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // POSIX says unlink should set EPERM, not EISDIR
          if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:function (path) {
        var lookup = FS.lookupPath(path, { follow: false });
        var link = lookup.node;
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return link.node_ops.readlink(link);
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 0666 : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // check permissions
        var err = FS.mayOpen(node, flags);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            Module['printErr']('read file: ' + path);
          }
        }
        return stream;
      },close:function (stream) {
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        return stream.stream_ops.llseek(stream, offset, whence);
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = '';
          var utf8 = new Runtime.UTF8Processor();
          for (var i = 0; i < length; i++) {
            ret += utf8.processCChar(buf[i]);
          }
        } else if (opts.encoding === 'binary') {
          ret = buf;
        } else {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var utf8 = new Runtime.UTF8Processor();
          var buf = new Uint8Array(utf8.processJSString(data));
          FS.write(stream, buf, 0, buf.length, 0);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0);
        } else {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        FS.close(stream);
      },cwd:function () {
        return FS.currentPath;
      },chdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function() { return 0; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        HEAP32[((_stdin)>>2)]=stdin.fd;
        assert(stdin.fd === 1, 'invalid handle for stdin (' + stdin.fd + ')');
  
        var stdout = FS.open('/dev/stdout', 'w');
        HEAP32[((_stdout)>>2)]=stdout.fd;
        assert(stdout.fd === 2, 'invalid handle for stdout (' + stdout.fd + ')');
  
        var stderr = FS.open('/dev/stderr', 'w');
        HEAP32[((_stderr)>>2)]=stderr.fd;
        assert(stderr.fd === 3, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function () {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno) {
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
          this.message = ERRNO_MESSAGES[errno];
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [ERRNO_CODES.ENOENT].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function () {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.root = FS.createNode(null, '/', 16384 | 0777, 0);
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = Math.floor(idx / this.chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter;
          }
          LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
              // Find length
              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var chunkSize = 1024*1024; // Chunk size in bytes
  
              if (!hasByteServing) chunkSize = datalength;
  
              // Function to get a range from the remote URL.
              var doXHR = (function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
                // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
                // Some hints to the browser that we want binary data.
                if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
                if (xhr.overrideMimeType) {
                  xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }
  
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                  return new Uint8Array(xhr.response || []);
                } else {
                  return intArrayFromString(xhr.responseText || '', true);
                }
              });
              var lazyArray = this;
              lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum+1) * chunkSize - 1; // including this byte
                end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                  lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum];
              });
  
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
          }
  
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
        Browser.init();
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};
  
  function _open(path, oflag, varargs) {
      // int open(const char *path, int oflag, ...);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/open.html
      var mode = HEAP32[((varargs)>>2)];
      path = Pointer_stringify(path);
      try {
        var stream = FS.open(path, oflag, mode);
        return stream.fd;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fopen(filename, mode) {
      // FILE *fopen(const char *restrict filename, const char *restrict mode);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fopen.html
      var flags;
      mode = Pointer_stringify(mode);
      if (mode[0] == 'r') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 0;
        }
      } else if (mode[0] == 'w') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 512;
      } else if (mode[0] == 'a') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 1024;
      } else {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return 0;
      }
      var ret = _open(filename, flags, allocate([0x1FF, 0, 0, 0], 'i32', ALLOC_STACK));  // All creation permissions.
      return (ret == -1) ? 0 : ret;
    }

  function _realpath(file_name, resolved_name) {
      // char *realpath(const char *restrict file_name, char *restrict resolved_name);
      // http://pubs.opengroup.org/onlinepubs/009604499/functions/realpath.html
      var absolute = FS.analyzePath(Pointer_stringify(file_name));
      if (absolute.error) {
        ___setErrNo(absolute.error);
        return 0;
      } else {
        var size = Math.min(4095, absolute.path.length);  // PATH_MAX - 1.
        for (var i = 0; i < size; i++) {
          HEAP8[(((resolved_name)+(i))|0)]=absolute.path.charCodeAt(i);
        }
        HEAP8[(((resolved_name)+(size))|0)]=0;
        return resolved_name;
      }
    }

   
  Module["_strcpy"] = _strcpy;

  
  
  
  
  
  
  var _mkport=undefined;var SOCKFS={mount:function (mount) {
        return FS.createNode(null, '/', 16384 | 0777, 0);
      },createSocket:function (family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
          assert(streaming == (protocol == 6)); // if SOCK_STREAM, must be tcp
        }
  
        // create our internal socket structure
        var sock = {
          family: family,
          type: type,
          protocol: protocol,
          server: null,
          peers: {},
          pending: [],
          recv_queue: [],
          sock_ops: SOCKFS.websocket_sock_ops
        };
  
        // create the filesystem node to store the socket structure
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;
  
        // and the wrapping stream that enables library functions such
        // as read and write to indirectly interact with the socket
        var stream = FS.createStream({
          path: name,
          node: node,
          flags: FS.modeStringToFlags('r+'),
          seekable: false,
          stream_ops: SOCKFS.stream_ops
        });
  
        // map the new stream to the socket structure (sockets have a 1:1
        // relationship with a stream)
        sock.stream = stream;
  
        return sock;
      },getSocket:function (fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
          return null;
        }
        return stream.node.sock;
      },stream_ops:{poll:function (stream) {
          var sock = stream.node.sock;
          return sock.sock_ops.poll(sock);
        },ioctl:function (stream, request, varargs) {
          var sock = stream.node.sock;
          return sock.sock_ops.ioctl(sock, request, varargs);
        },read:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          var msg = sock.sock_ops.recvmsg(sock, length);
          if (!msg) {
            // socket is closed
            return 0;
          }
          buffer.set(msg.buffer, offset);
          return msg.buffer.length;
        },write:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          return sock.sock_ops.sendmsg(sock, buffer, offset, length);
        },close:function (stream) {
          var sock = stream.node.sock;
          sock.sock_ops.close(sock);
        }},nextname:function () {
        if (!SOCKFS.nextname.current) {
          SOCKFS.nextname.current = 0;
        }
        return 'socket[' + (SOCKFS.nextname.current++) + ']';
      },websocket_sock_ops:{createPeer:function (sock, addr, port) {
          var ws;
  
          if (typeof addr === 'object') {
            ws = addr;
            addr = null;
            port = null;
          }
  
          if (ws) {
            // for sockets that've already connected (e.g. we're the server)
            // we can inspect the _socket property for the address
            if (ws._socket) {
              addr = ws._socket.remoteAddress;
              port = ws._socket.remotePort;
            }
            // if we're just now initializing a connection to the remote,
            // inspect the url property
            else {
              var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
              if (!result) {
                throw new Error('WebSocket URL must be in the format ws(s)://address:port');
              }
              addr = result[1];
              port = parseInt(result[2], 10);
            }
          } else {
            // create the actual websocket object and connect
            try {
              var url = 'ws://' + addr + ':' + port;
              // the node ws library API is slightly different than the browser's
              var opts = ENVIRONMENT_IS_NODE ? {headers: {'websocket-protocol': ['binary']}} : ['binary'];
              // If node we use the ws library.
              var WebSocket = ENVIRONMENT_IS_NODE ? require('ws') : window['WebSocket'];
              ws = new WebSocket(url, opts);
              ws.binaryType = 'arraybuffer';
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
            }
          }
  
  
          var peer = {
            addr: addr,
            port: port,
            socket: ws,
            dgram_send_queue: []
          };
  
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
  
          // if this is a bound dgram socket, send the port number first to allow
          // us to override the ephemeral port reported to us by remotePort on the
          // remote end.
          if (sock.type === 2 && typeof sock.sport !== 'undefined') {
            peer.dgram_send_queue.push(new Uint8Array([
                255, 255, 255, 255,
                'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                ((sock.sport & 0xff00) >> 8) , (sock.sport & 0xff)
            ]));
          }
  
          return peer;
        },getPeer:function (sock, addr, port) {
          return sock.peers[addr + ':' + port];
        },addPeer:function (sock, peer) {
          sock.peers[peer.addr + ':' + peer.port] = peer;
        },removePeer:function (sock, peer) {
          delete sock.peers[peer.addr + ':' + peer.port];
        },handlePeerEvents:function (sock, peer) {
          var first = true;
  
          var handleOpen = function () {
            try {
              var queued = peer.dgram_send_queue.shift();
              while (queued) {
                peer.socket.send(queued);
                queued = peer.dgram_send_queue.shift();
              }
            } catch (e) {
              // not much we can do here in the way of proper error handling as we've already
              // lied and said this data was sent. shut it down.
              peer.socket.close();
            }
          };
  
          function handleMessage(data) {
            assert(typeof data !== 'string' && data.byteLength !== undefined);  // must receive an ArrayBuffer
            data = new Uint8Array(data);  // make a typed array view on the array buffer
  
  
            // if this is the port message, override the peer's port with it
            var wasfirst = first;
            first = false;
            if (wasfirst &&
                data.length === 10 &&
                data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
              // update the peer's port and it's key in the peer map
              var newport = ((data[8] << 8) | data[9]);
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
              peer.port = newport;
              SOCKFS.websocket_sock_ops.addPeer(sock, peer);
              return;
            }
  
            sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
          };
  
          if (ENVIRONMENT_IS_NODE) {
            peer.socket.on('open', handleOpen);
            peer.socket.on('message', function(data, flags) {
              if (!flags.binary) {
                return;
              }
              handleMessage((new Uint8Array(data)).buffer);  // copy from node Buffer -> ArrayBuffer
            });
            peer.socket.on('error', function() {
              // don't throw
            });
          } else {
            peer.socket.onopen = handleOpen;
            peer.socket.onmessage = function peer_socket_onmessage(event) {
              handleMessage(event.data);
            };
          }
        },poll:function (sock) {
          if (sock.type === 1 && sock.server) {
            // listen sockets should only say they're available for reading
            // if there are pending clients.
            return sock.pending.length ? (64 | 1) : 0;
          }
  
          var mask = 0;
          var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
            SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
            null;
  
          if (sock.recv_queue.length ||
              !dest ||  // connection-less sockets are always ready to read
              (dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
            mask |= (64 | 1);
          }
  
          if (!dest ||  // connection-less sockets are always ready to write
              (dest && dest.socket.readyState === dest.socket.OPEN)) {
            mask |= 4;
          }
  
          if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {
            mask |= 16;
          }
  
          return mask;
        },ioctl:function (sock, request, arg) {
          switch (request) {
            case 21531:
              var bytes = 0;
              if (sock.recv_queue.length) {
                bytes = sock.recv_queue[0].data.length;
              }
              HEAP32[((arg)>>2)]=bytes;
              return 0;
            default:
              return ERRNO_CODES.EINVAL;
          }
        },close:function (sock) {
          // if we've spawned a listen server, close it
          if (sock.server) {
            try {
              sock.server.close();
            } catch (e) {
            }
            sock.server = null;
          }
          // close any peer connections
          var peers = Object.keys(sock.peers);
          for (var i = 0; i < peers.length; i++) {
            var peer = sock.peers[peers[i]];
            try {
              peer.socket.close();
            } catch (e) {
            }
            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          }
          return 0;
        },bind:function (sock, addr, port) {
          if (typeof sock.saddr !== 'undefined' || typeof sock.sport !== 'undefined') {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already bound
          }
          sock.saddr = addr;
          sock.sport = port || _mkport();
          // in order to emulate dgram sockets, we need to launch a listen server when
          // binding on a connection-less socket
          // note: this is only required on the server side
          if (sock.type === 2) {
            // close the existing server if it exists
            if (sock.server) {
              sock.server.close();
              sock.server = null;
            }
            // swallow error operation not supported error that occurs when binding in the
            // browser where this isn't supported
            try {
              sock.sock_ops.listen(sock, 0);
            } catch (e) {
              if (!(e instanceof FS.ErrnoError)) throw e;
              if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
            }
          }
        },connect:function (sock, addr, port) {
          if (sock.server) {
            throw new FS.ErrnoError(ERRNO_CODS.EOPNOTSUPP);
          }
  
          // TODO autobind
          // if (!sock.addr && sock.type == 2) {
          // }
  
          // early out if we're already connected / in the middle of connecting
          if (typeof sock.daddr !== 'undefined' && typeof sock.dport !== 'undefined') {
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
            if (dest) {
              if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
              } else {
                throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
              }
            }
          }
  
          // add the socket to our peer list and set our
          // destination address / port to match
          var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          sock.daddr = peer.addr;
          sock.dport = peer.port;
  
          // always "fail" in non-blocking mode
          throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
        },listen:function (sock, backlog) {
          if (!ENVIRONMENT_IS_NODE) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
          }
          if (sock.server) {
             throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already listening
          }
          var WebSocketServer = require('ws').Server;
          var host = sock.saddr;
          sock.server = new WebSocketServer({
            host: host,
            port: sock.sport
            // TODO support backlog
          });
  
          sock.server.on('connection', function(ws) {
            if (sock.type === 1) {
              var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
  
              // create a peer on the new socket
              var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
              newsock.daddr = peer.addr;
              newsock.dport = peer.port;
  
              // push to queue for accept to pick up
              sock.pending.push(newsock);
            } else {
              // create a peer on the listen socket so calling sendto
              // with the listen socket and an address will resolve
              // to the correct client
              SOCKFS.websocket_sock_ops.createPeer(sock, ws);
            }
          });
          sock.server.on('closed', function() {
            sock.server = null;
          });
          sock.server.on('error', function() {
            // don't throw
          });
        },accept:function (listensock) {
          if (!listensock.server) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var newsock = listensock.pending.shift();
          newsock.stream.flags = listensock.stream.flags;
          return newsock;
        },getname:function (sock, peer) {
          var addr, port;
          if (peer) {
            if (sock.daddr === undefined || sock.dport === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            }
            addr = sock.daddr;
            port = sock.dport;
          } else {
            // TODO saddr and sport will be set for bind()'d UDP sockets, but what
            // should we be returning for TCP sockets that've been connect()'d?
            addr = sock.saddr || 0;
            port = sock.sport || 0;
          }
          return { addr: addr, port: port };
        },sendmsg:function (sock, buffer, offset, length, addr, port) {
          if (sock.type === 2) {
            // connection-less sockets will honor the message address,
            // and otherwise fall back to the bound destination address
            if (addr === undefined || port === undefined) {
              addr = sock.daddr;
              port = sock.dport;
            }
            // if there was no address to fall back to, error out
            if (addr === undefined || port === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
            }
          } else {
            // connection-based sockets will only use the bound
            addr = sock.daddr;
            port = sock.dport;
          }
  
          // find the peer for the destination address
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
  
          // early out if not connected with a connection-based socket
          if (sock.type === 1) {
            if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            } else if (dest.socket.readyState === dest.socket.CONNECTING) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // create a copy of the incoming data to send, as the WebSocket API
          // doesn't work entirely with an ArrayBufferView, it'll just send
          // the entire underlying buffer
          var data;
          if (buffer instanceof Array || buffer instanceof ArrayBuffer) {
            data = buffer.slice(offset, offset + length);
          } else {  // ArrayBufferView
            data = buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + length);
          }
  
          // if we're emulating a connection-less dgram socket and don't have
          // a cached connection, queue the buffer to send upon connect and
          // lie, saying the data was sent now.
          if (sock.type === 2) {
            if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
              // if we're not connected, open a new connection
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
              }
              dest.dgram_send_queue.push(data);
              return length;
            }
          }
  
          try {
            // send the actual data
            dest.socket.send(data);
            return length;
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
        },recvmsg:function (sock, length) {
          // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
          if (sock.type === 1 && sock.server) {
            // tcp servers should not be recv()'ing on the listen socket
            throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
          }
  
          var queued = sock.recv_queue.shift();
          if (!queued) {
            if (sock.type === 1) {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
  
              if (!dest) {
                // if we have a destination address but are not connected, error out
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
              }
              else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                // return null if the socket has closed
                return null;
              }
              else {
                // else, our socket is in a valid state but truly has nothing available
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
            } else {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
          // requeued TCP data it'll be an ArrayBufferView
          var queuedLength = queued.data.byteLength || queued.data.length;
          var queuedOffset = queued.data.byteOffset || 0;
          var queuedBuffer = queued.data.buffer || queued.data;
          var bytesRead = Math.min(length, queuedLength);
          var res = {
            buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
            addr: queued.addr,
            port: queued.port
          };
  
  
          // push back any unread data for TCP connections
          if (sock.type === 1 && bytesRead < queuedLength) {
            var bytesRemaining = queuedLength - bytesRead;
            queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
            sock.recv_queue.unshift(queued);
          }
  
          return res;
        }}};function _send(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _write(fd, buf, len);
    }
  
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
  
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var bytesWritten = _write(stream, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        var streamObj = FS.getStream(stream);
        if (streamObj) streamObj.error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }
  
  
   
  Module["_strlen"] = _strlen;
  
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = HEAPF64[(((varargs)+(argIndex))>>3)];
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+8))>>2)]];
          argIndex += 8; // each 32-bit chunk is in a 64-bit block
  
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Math.max(Runtime.getNativeFieldSize(type), Runtime.getAlignSize(type, null, true));
        return ret;
      }
  
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          var flagPadSign = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              case 32:
                flagPadSign = true;
                break;
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
  
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
  
          // Handle precision.
          var precisionSet = false, precision = -1;
          if (next == 46) {
            precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          }
          if (precision === -1) {
            precision = 6; // Standard default.
            precisionSet = false;
          }
  
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
  
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
  
              // Add sign if needed
              if (currArg >= 0) {
                if (flagAlwaysSigned) {
                  prefix = '+' + prefix;
                } else if (flagPadSign) {
                  prefix = ' ' + prefix;
                }
              }
  
              // Move sign to prefix so we zero-pad after the sign
              if (argText.charAt(0) == '-') {
                prefix = '-' + prefix;
                argText = argText.substr(1);
              }
  
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
  
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
  
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
  
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
  
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
  
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
  
                // Add sign.
                if (currArg >= 0) {
                  if (flagAlwaysSigned) {
                    argText = '+' + argText;
                  } else if (flagPadSign) {
                    argText = ' ' + argText;
                  }
                }
              }
  
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
  
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
  
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length;
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }function _printf(format, varargs) {
      // int printf(const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var stdout = HEAP32[((_stdout)>>2)];
      return _fprintf(stdout, format, varargs);
    }

  
  function __exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      Module['exit'](status);
    }function _exit(status) {
      __exit(status);
    }


  
  function _lseek(fildes, offset, whence) {
      // off_t lseek(int fildes, off_t offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/lseek.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        return FS.llseek(stream, offset, whence);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fseek(stream, offset, whence) {
      // int fseek(FILE *stream, long offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fseek.html
      var ret = _lseek(stream, offset, whence);
      if (ret == -1) {
        return -1;
      }
      stream = FS.getStream(stream);
      stream.eof = false;
      return 0;
    }

  function _ftell(stream) {
      // long ftell(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ftell.html
      stream = FS.getStream(stream);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      if (FS.isChrdev(stream.node.mode)) {
        ___setErrNo(ERRNO_CODES.ESPIPE);
        return -1;
      } else {
        return stream.position;
      }
    }

  
  
  function _recv(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _read(fd, buf, len);
    }
  
  function _pread(fildes, buf, nbyte, offset) {
      // ssize_t pread(int fildes, void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _read(fildes, buf, nbyte) {
      // ssize_t read(int fildes, void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
  
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fread(ptr, size, nitems, stream) {
      // size_t fread(void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fread.html
      var bytesToRead = nitems * size;
      if (bytesToRead == 0) {
        return 0;
      }
      var bytesRead = 0;
      var streamObj = FS.getStream(stream);
      if (!streamObj) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return 0;
      }
      while (streamObj.ungotten.length && bytesToRead > 0) {
        HEAP8[((ptr++)|0)]=streamObj.ungotten.pop();
        bytesToRead--;
        bytesRead++;
      }
      var err = _read(stream, ptr, bytesToRead);
      if (err == -1) {
        if (streamObj) streamObj.error = true;
        return 0;
      }
      bytesRead += err;
      if (bytesRead < bytesToRead) streamObj.eof = true;
      return Math.floor(bytesRead / size);
    }

  
  function _close(fildes) {
      // int close(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/close.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        FS.close(stream);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  
  function _fsync(fildes) {
      // int fsync(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fsync.html
      var stream = FS.getStream(fildes);
      if (stream) {
        // We write directly to the file system, so there's nothing to do here.
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }function _fclose(stream) {
      // int fclose(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fclose.html
      _fsync(stream);
      return _close(stream);
    }

   
  Module["_strncpy"] = _strncpy;

  
   
  Module["_memcpy"] = _memcpy;var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;

  function _strstr(ptr1, ptr2) {
      var check = 0, start;
      do {
        if (!check) {
          start = ptr1;
          check = ptr2;
        }
        var curr1 = HEAP8[((ptr1++)|0)];
        var curr2 = HEAP8[((check++)|0)];
        if (curr2 == 0) return start;
        if (curr2 != curr1) {
          // rewind to one character after start, to find ez in eeez
          ptr1 = start + 1;
          check = 0;
        }
      } while (curr1);
      return 0;
    }

  
   
  Module["_memset"] = _memset;var _llvm_memset_p0i8_i32=_memset;

  
  
  function __getFloat(text) {
      return /^[+-]?[0-9]*\.?[0-9]+([eE][+-]?[0-9]+)?/.exec(text);
    }function __scanString(format, get, unget, varargs) {
      if (!__scanString.whiteSpace) {
        __scanString.whiteSpace = {};
        __scanString.whiteSpace[32] = 1;
        __scanString.whiteSpace[9] = 1;
        __scanString.whiteSpace[10] = 1;
        __scanString.whiteSpace[11] = 1;
        __scanString.whiteSpace[12] = 1;
        __scanString.whiteSpace[13] = 1;
      }
      // Supports %x, %4x, %d.%d, %lld, %s, %f, %lf.
      // TODO: Support all format specifiers.
      format = Pointer_stringify(format);
      var soFar = 0;
      if (format.indexOf('%n') >= 0) {
        // need to track soFar
        var _get = get;
        get = function get() {
          soFar++;
          return _get();
        }
        var _unget = unget;
        unget = function unget() {
          soFar--;
          return _unget();
        }
      }
      var formatIndex = 0;
      var argsi = 0;
      var fields = 0;
      var argIndex = 0;
      var next;
  
      mainLoop:
      for (var formatIndex = 0; formatIndex < format.length;) {
        if (format[formatIndex] === '%' && format[formatIndex+1] == 'n') {
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          HEAP32[((argPtr)>>2)]=soFar;
          formatIndex += 2;
          continue;
        }
  
        if (format[formatIndex] === '%') {
          var nextC = format.indexOf('c', formatIndex+1);
          if (nextC > 0) {
            var maxx = 1;
            if (nextC > formatIndex+1) {
              var sub = format.substring(formatIndex+1, nextC);
              maxx = parseInt(sub);
              if (maxx != sub) maxx = 0;
            }
            if (maxx) {
              var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
              argIndex += Runtime.getAlignSize('void*', null, true);
              fields++;
              for (var i = 0; i < maxx; i++) {
                next = get();
                HEAP8[((argPtr++)|0)]=next;
              }
              formatIndex += nextC - formatIndex + 1;
              continue;
            }
          }
        }
  
        // handle %[...]
        if (format[formatIndex] === '%' && format.indexOf('[', formatIndex+1) > 0) {
          var match = /\%([0-9]*)\[(\^)?(\]?[^\]]*)\]/.exec(format.substring(formatIndex));
          if (match) {
            var maxNumCharacters = parseInt(match[1]) || Infinity;
            var negateScanList = (match[2] === '^');
            var scanList = match[3];
  
            // expand "middle" dashs into character sets
            var middleDashMatch;
            while ((middleDashMatch = /([^\-])\-([^\-])/.exec(scanList))) {
              var rangeStartCharCode = middleDashMatch[1].charCodeAt(0);
              var rangeEndCharCode = middleDashMatch[2].charCodeAt(0);
              for (var expanded = ''; rangeStartCharCode <= rangeEndCharCode; expanded += String.fromCharCode(rangeStartCharCode++));
              scanList = scanList.replace(middleDashMatch[1] + '-' + middleDashMatch[2], expanded);
            }
  
            var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
            argIndex += Runtime.getAlignSize('void*', null, true);
            fields++;
  
            for (var i = 0; i < maxNumCharacters; i++) {
              next = get();
              if (negateScanList) {
                if (scanList.indexOf(String.fromCharCode(next)) < 0) {
                  HEAP8[((argPtr++)|0)]=next;
                } else {
                  unget();
                  break;
                }
              } else {
                if (scanList.indexOf(String.fromCharCode(next)) >= 0) {
                  HEAP8[((argPtr++)|0)]=next;
                } else {
                  unget();
                  break;
                }
              }
            }
  
            // write out null-terminating character
            HEAP8[((argPtr++)|0)]=0;
            formatIndex += match[0].length;
            
            continue;
          }
        }      
        // remove whitespace
        while (1) {
          next = get();
          if (next == 0) return fields;
          if (!(next in __scanString.whiteSpace)) break;
        }
        unget();
  
        if (format[formatIndex] === '%') {
          formatIndex++;
          var suppressAssignment = false;
          if (format[formatIndex] == '*') {
            suppressAssignment = true;
            formatIndex++;
          }
          var maxSpecifierStart = formatIndex;
          while (format[formatIndex].charCodeAt(0) >= 48 &&
                 format[formatIndex].charCodeAt(0) <= 57) {
            formatIndex++;
          }
          var max_;
          if (formatIndex != maxSpecifierStart) {
            max_ = parseInt(format.slice(maxSpecifierStart, formatIndex), 10);
          }
          var long_ = false;
          var half = false;
          var longLong = false;
          if (format[formatIndex] == 'l') {
            long_ = true;
            formatIndex++;
            if (format[formatIndex] == 'l') {
              longLong = true;
              formatIndex++;
            }
          } else if (format[formatIndex] == 'h') {
            half = true;
            formatIndex++;
          }
          var type = format[formatIndex];
          formatIndex++;
          var curr = 0;
          var buffer = [];
          // Read characters according to the format. floats are trickier, they may be in an unfloat state in the middle, then be a valid float later
          if (type == 'f' || type == 'e' || type == 'g' ||
              type == 'F' || type == 'E' || type == 'G') {
            next = get();
            while (next > 0 && (!(next in __scanString.whiteSpace)))  {
              buffer.push(String.fromCharCode(next));
              next = get();
            }
            var m = __getFloat(buffer.join(''));
            var last = m ? m[0].length : 0;
            for (var i = 0; i < buffer.length - last + 1; i++) {
              unget();
            }
            buffer.length = last;
          } else {
            next = get();
            var first = true;
            
            // Strip the optional 0x prefix for %x.
            if ((type == 'x' || type == 'X') && (next == 48)) {
              var peek = get();
              if (peek == 120 || peek == 88) {
                next = get();
              } else {
                unget();
              }
            }
            
            while ((curr < max_ || isNaN(max_)) && next > 0) {
              if (!(next in __scanString.whiteSpace) && // stop on whitespace
                  (type == 's' ||
                   ((type === 'd' || type == 'u' || type == 'i') && ((next >= 48 && next <= 57) ||
                                                                     (first && next == 45))) ||
                   ((type === 'x' || type === 'X') && (next >= 48 && next <= 57 ||
                                     next >= 97 && next <= 102 ||
                                     next >= 65 && next <= 70))) &&
                  (formatIndex >= format.length || next !== format[formatIndex].charCodeAt(0))) { // Stop when we read something that is coming up
                buffer.push(String.fromCharCode(next));
                next = get();
                curr++;
                first = false;
              } else {
                break;
              }
            }
            unget();
          }
          if (buffer.length === 0) return 0;  // Failure.
          if (suppressAssignment) continue;
  
          var text = buffer.join('');
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          switch (type) {
            case 'd': case 'u': case 'i':
              if (half) {
                HEAP16[((argPtr)>>1)]=parseInt(text, 10);
              } else if (longLong) {
                (tempI64 = [parseInt(text, 10)>>>0,(tempDouble=parseInt(text, 10),(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)],HEAP32[((argPtr)>>2)]=tempI64[0],HEAP32[(((argPtr)+(4))>>2)]=tempI64[1]);
              } else {
                HEAP32[((argPtr)>>2)]=parseInt(text, 10);
              }
              break;
            case 'X':
            case 'x':
              HEAP32[((argPtr)>>2)]=parseInt(text, 16);
              break;
            case 'F':
            case 'f':
            case 'E':
            case 'e':
            case 'G':
            case 'g':
            case 'E':
              // fallthrough intended
              if (long_) {
                HEAPF64[((argPtr)>>3)]=parseFloat(text);
              } else {
                HEAPF32[((argPtr)>>2)]=parseFloat(text);
              }
              break;
            case 's':
              var array = intArrayFromString(text);
              for (var j = 0; j < array.length; j++) {
                HEAP8[(((argPtr)+(j))|0)]=array[j];
              }
              break;
          }
          fields++;
        } else if (format[formatIndex].charCodeAt(0) in __scanString.whiteSpace) {
          next = get();
          while (next in __scanString.whiteSpace) {
            if (next <= 0) break mainLoop;  // End of input.
            next = get();
          }
          unget(next);
          formatIndex++;
        } else {
          // Not a specifier.
          next = get();
          if (format[formatIndex].charCodeAt(0) !== next) {
            unget(next);
            break mainLoop;
          }
          formatIndex++;
        }
      }
      return fields;
    }function _sscanf(s, format, varargs) {
      // int sscanf(const char *restrict s, const char *restrict format, ... );
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/scanf.html
      var index = 0;
      function get() { return HEAP8[(((s)+(index++))|0)]; };
      function unget() { index--; };
      return __scanString(format, get, unget, varargs);
    }


  
  function _strncmp(px, py, n) {
      var i = 0;
      while (i < n) {
        var x = HEAPU8[(((px)+(i))|0)];
        var y = HEAPU8[(((py)+(i))|0)];
        if (x == y && x == 0) return 0;
        if (x == 0) return -1;
        if (y == 0) return 1;
        if (x == y) {
          i ++;
          continue;
        } else {
          return x > y ? 1 : -1;
        }
      }
      return 0;
    }function _strcmp(px, py) {
      return _strncmp(px, py, TOTAL_MEMORY);
    }


  
  function _fputs(s, stream) {
      // int fputs(const char *restrict s, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputs.html
      return _write(stream, s, _strlen(s));
    }
  
  function _fputc(c, stream) {
      // int fputc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputc.html
      var chr = unSign(c & 0xFF);
      HEAP8[((_fputc.ret)|0)]=chr;
      var ret = _write(stream, _fputc.ret, 1);
      if (ret == -1) {
        var streamObj = FS.getStream(stream);
        if (streamObj) streamObj.error = true;
        return -1;
      } else {
        return chr;
      }
    }function _puts(s) {
      // int puts(const char *s);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/puts.html
      // NOTE: puts() always writes an extra newline.
      var stdout = HEAP32[((_stdout)>>2)];
      var ret = _fputs(s, stdout);
      if (ret < 0) {
        return ret;
      } else {
        var newlineRet = _fputc(10, stdout);
        return (newlineRet < 0) ? -1 : ret + 1;
      }
    }

  function _strchr(ptr, chr) {
      ptr--;
      do {
        ptr++;
        var val = HEAP8[(ptr)];
        if (val == chr) return ptr;
      } while (val);
      return 0;
    }

  function _fgetc(stream) {
      // int fgetc(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fgetc.html
      var streamObj = FS.getStream(stream);
      if (!streamObj) return -1;
      if (streamObj.eof || streamObj.error) return -1;
      var ret = _fread(_fgetc.ret, 1, 1, stream);
      if (ret == 0) {
        return -1;
      } else if (ret == -1) {
        streamObj.error = true;
        return -1;
      } else {
        return HEAPU8[((_fgetc.ret)|0)];
      }
    }

  function _ungetc(c, stream) {
      // int ungetc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ungetc.html
      stream = FS.getStream(stream);
      if (!stream) {
        return -1;
      }
      if (c === -1) {
        // do nothing for EOF character
        return c;
      }
      c = unSign(c & 0xFF);
      stream.ungotten.push(c);
      stream.eof = false;
      return c;
    }

  function _strdup(ptr) {
      var len = _strlen(ptr);
      var newStr = _malloc(len + 1);
      (_memcpy(newStr, ptr, len)|0);
      HEAP8[(((newStr)+(len))|0)]=0;
      return newStr;
    }

  var _llvm_va_start=undefined;

  
  function _snprintf(s, n, format, varargs) {
      // int snprintf(char *restrict s, size_t n, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var limit = (n === undefined) ? result.length
                                    : Math.min(result.length, Math.max(n - 1, 0));
      if (s < 0) {
        s = -s;
        var buf = _malloc(limit+1);
        HEAP32[((s)>>2)]=buf;
        s = buf;
      }
      for (var i = 0; i < limit; i++) {
        HEAP8[(((s)+(i))|0)]=result[i];
      }
      if (limit < n || (n === undefined)) HEAP8[(((s)+(i))|0)]=0;
      return result.length;
    }function _vsnprintf(s, n, format, va_arg) {
      return _snprintf(s, n, format, HEAP32[((va_arg)>>2)]);
    }

  function _llvm_va_end() {}

  function _isspace(chr) {
      return (chr == 32) || (chr >= 9 && chr <= 13);
    }

  function _isalnum(chr) {
      return (chr >= 48 && chr <= 57) ||
             (chr >= 97 && chr <= 122) ||
             (chr >= 65 && chr <= 90);
    }

  function _isalpha(chr) {
      return (chr >= 97 && chr <= 122) ||
             (chr >= 65 && chr <= 90);
    }



  function _llvm_lifetime_start() {}

  function _llvm_lifetime_end() {}

  function _sprintf(s, format, varargs) {
      // int sprintf(char *restrict s, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      return _snprintf(s, undefined, format, varargs);
    }

  function _strrchr(ptr, chr) {
      var ptr2 = ptr + _strlen(ptr);
      do {
        if (HEAP8[(ptr2)] == chr) return ptr2;
        ptr2--;
      } while (ptr2 >= ptr);
      return 0;
    }

  
  
   
  Module["_tolower"] = _tolower; 
  Module["_strncasecmp"] = _strncasecmp; 
  Module["_strcasecmp"] = _strcasecmp;

  
  function __ZSt18uncaught_exceptionv() { // std::uncaught_exception()
      return !!__ZSt18uncaught_exceptionv.uncaught_exception;
    }
  
  
  
  function ___cxa_is_number_type(type) {
      var isNumber = false;
      try { if (type == __ZTIi) isNumber = true } catch(e){}
      try { if (type == __ZTIj) isNumber = true } catch(e){}
      try { if (type == __ZTIl) isNumber = true } catch(e){}
      try { if (type == __ZTIm) isNumber = true } catch(e){}
      try { if (type == __ZTIx) isNumber = true } catch(e){}
      try { if (type == __ZTIy) isNumber = true } catch(e){}
      try { if (type == __ZTIf) isNumber = true } catch(e){}
      try { if (type == __ZTId) isNumber = true } catch(e){}
      try { if (type == __ZTIe) isNumber = true } catch(e){}
      try { if (type == __ZTIc) isNumber = true } catch(e){}
      try { if (type == __ZTIa) isNumber = true } catch(e){}
      try { if (type == __ZTIh) isNumber = true } catch(e){}
      try { if (type == __ZTIs) isNumber = true } catch(e){}
      try { if (type == __ZTIt) isNumber = true } catch(e){}
      return isNumber;
    }function ___cxa_does_inherit(definiteType, possibilityType, possibility) {
      if (possibility == 0) return false;
      if (possibilityType == 0 || possibilityType == definiteType)
        return true;
      var possibility_type_info;
      if (___cxa_is_number_type(possibilityType)) {
        possibility_type_info = possibilityType;
      } else {
        var possibility_type_infoAddr = HEAP32[((possibilityType)>>2)] - 8;
        possibility_type_info = HEAP32[((possibility_type_infoAddr)>>2)];
      }
      switch (possibility_type_info) {
      case 0: // possibility is a pointer
        // See if definite type is a pointer
        var definite_type_infoAddr = HEAP32[((definiteType)>>2)] - 8;
        var definite_type_info = HEAP32[((definite_type_infoAddr)>>2)];
        if (definite_type_info == 0) {
          // Also a pointer; compare base types of pointers
          var defPointerBaseAddr = definiteType+8;
          var defPointerBaseType = HEAP32[((defPointerBaseAddr)>>2)];
          var possPointerBaseAddr = possibilityType+8;
          var possPointerBaseType = HEAP32[((possPointerBaseAddr)>>2)];
          return ___cxa_does_inherit(defPointerBaseType, possPointerBaseType, possibility);
        } else
          return false; // one pointer and one non-pointer
      case 1: // class with no base class
        return false;
      case 2: // class with base class
        var parentTypeAddr = possibilityType + 8;
        var parentType = HEAP32[((parentTypeAddr)>>2)];
        return ___cxa_does_inherit(definiteType, parentType, possibility);
      default:
        return false; // some unencountered type
      }
    }
  
  function ___resumeException(ptr) {
      if (!___cxa_last_thrown_exception) { ___cxa_last_thrown_exception = ptr; }
      throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
    }
  
  var ___cxa_last_thrown_exception=0;
  
  var ___cxa_exception_header_size=8;function ___cxa_find_matching_catch(thrown, throwntype) {
      if (thrown == -1) thrown = ___cxa_last_thrown_exception;
      header = thrown - ___cxa_exception_header_size;
      if (throwntype == -1) throwntype = HEAP32[((header)>>2)];
      var typeArray = Array.prototype.slice.call(arguments, 2);
  
      // If throwntype is a pointer, this means a pointer has been
      // thrown. When a pointer is thrown, actually what's thrown
      // is a pointer to the pointer. We'll dereference it.
      if (throwntype != 0 && !___cxa_is_number_type(throwntype)) {
        var throwntypeInfoAddr= HEAP32[((throwntype)>>2)] - 8;
        var throwntypeInfo= HEAP32[((throwntypeInfoAddr)>>2)];
        if (throwntypeInfo == 0)
          thrown = HEAP32[((thrown)>>2)];
      }
      // The different catch blocks are denoted by different types.
      // Due to inheritance, those types may not precisely match the
      // type of the thrown object. Find one which matches, and
      // return the type of the catch block which should be called.
      for (var i = 0; i < typeArray.length; i++) {
        if (___cxa_does_inherit(typeArray[i], throwntype, thrown))
          return ((asm["setTempRet0"](typeArray[i]),thrown)|0);
      }
      // Shouldn't happen unless we have bogus data in typeArray
      // or encounter a type for which emscripten doesn't have suitable
      // typeinfo defined. Best-efforts match just in case.
      return ((asm["setTempRet0"](throwntype),thrown)|0);
    }function ___gxx_personality_v0() {
    }

  
   
  Module["_memmove"] = _memmove;var _llvm_memmove_p0i8_p0i8_i32=_memmove;

  var _llvm_memset_p0i8_i64=_memset;

   
  Module["_memcmp"] = _memcmp;

  var _sqrtf=Math_sqrt;

  var _fabsf=Math_abs;

  function ___errno_location() {
      return ___errno_state;
    }

  function __ZNSt9exceptionD2Ev() {}

  function _abort() {
      Module['abort']();
    }

  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }

  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 30: return PAGE_SIZE;
        case 132:
        case 133:
        case 12:
        case 137:
        case 138:
        case 15:
        case 235:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 149:
        case 13:
        case 10:
        case 236:
        case 153:
        case 9:
        case 21:
        case 22:
        case 159:
        case 154:
        case 14:
        case 77:
        case 78:
        case 139:
        case 80:
        case 81:
        case 79:
        case 82:
        case 68:
        case 67:
        case 164:
        case 11:
        case 29:
        case 47:
        case 48:
        case 95:
        case 52:
        case 51:
        case 46:
          return 200809;
        case 27:
        case 246:
        case 127:
        case 128:
        case 23:
        case 24:
        case 160:
        case 161:
        case 181:
        case 182:
        case 242:
        case 183:
        case 184:
        case 243:
        case 244:
        case 245:
        case 165:
        case 178:
        case 179:
        case 49:
        case 50:
        case 168:
        case 169:
        case 175:
        case 170:
        case 171:
        case 172:
        case 97:
        case 76:
        case 32:
        case 173:
        case 35:
          return -1;
        case 176:
        case 177:
        case 7:
        case 155:
        case 8:
        case 157:
        case 125:
        case 126:
        case 92:
        case 93:
        case 129:
        case 130:
        case 131:
        case 94:
        case 91:
          return 1;
        case 74:
        case 60:
        case 69:
        case 70:
        case 4:
          return 1024;
        case 31:
        case 42:
        case 72:
          return 32;
        case 87:
        case 26:
        case 33:
          return 2147483647;
        case 34:
        case 1:
          return 47839;
        case 38:
        case 36:
          return 99;
        case 43:
        case 37:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 28: return 32768;
        case 44: return 32767;
        case 75: return 16384;
        case 39: return 1000;
        case 89: return 700;
        case 71: return 256;
        case 40: return 255;
        case 2: return 100;
        case 180: return 64;
        case 25: return 20;
        case 5: return 16;
        case 6: return 6;
        case 73: return 4;
        case 84: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }

  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret;
      }
      return ret;
    }

  function ___cxa_allocate_exception(size) {
      var ptr = _malloc(size + ___cxa_exception_header_size);
      return ptr + ___cxa_exception_header_size;
    }

  function ___cxa_throw(ptr, type, destructor) {
      if (!___cxa_throw.initialized) {
        try {
          HEAP32[((__ZTVN10__cxxabiv119__pointer_type_infoE)>>2)]=0; // Workaround for libcxxabi integration bug
        } catch(e){}
        try {
          HEAP32[((__ZTVN10__cxxabiv117__class_type_infoE)>>2)]=1; // Workaround for libcxxabi integration bug
        } catch(e){}
        try {
          HEAP32[((__ZTVN10__cxxabiv120__si_class_type_infoE)>>2)]=2; // Workaround for libcxxabi integration bug
        } catch(e){}
        ___cxa_throw.initialized = true;
      }
      var header = ptr - ___cxa_exception_header_size;
      HEAP32[((header)>>2)]=type;
      HEAP32[(((header)+(4))>>2)]=destructor;
      ___cxa_last_thrown_exception = ptr;
      if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exception = 1;
      } else {
        __ZSt18uncaught_exceptionv.uncaught_exception++;
      }
      throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
    }

  function ___cxa_call_unexpected(exception) {
      Module.printErr('Unexpected exception thrown, this is not properly supported - aborting');
      ABORT = true;
      throw exception;
    }

  
  function _copysign(a, b) {
      return __reallyNegative(a) === __reallyNegative(b) ? a : -a;
    }var _copysignl=_copysign;

  
  function _fmod(x, y) {
      return x % y;
    }var _fmodl=_fmod;

  var _fabs=Math_abs;






  var Browser={mainLoop:{scheduler:null,shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
  
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
  
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function img_onload() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function img_onerror(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function audio_onerror(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
  
        // Canvas event setup
  
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
  
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
  
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
  
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule, webGLContextAttributes) {
        var ctx;
        try {
          if (useWebGL) {
            var contextAttributes = {
              antialias: false,
              alpha: false
            };
  
            if (webGLContextAttributes) {
              for (var attribute in webGLContextAttributes) {
                contextAttributes[attribute] = webGLContextAttributes[attribute];
              }
            }
  
  
            var errorInfo = '?';
            function onContextCreationError(event) {
              errorInfo = event.statusMessage || errorInfo;
            }
            canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
            try {
              ['experimental-webgl', 'webgl'].some(function(webglId) {
                return ctx = canvas.getContext(webglId, contextAttributes);
              });
            } finally {
              canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
            }
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas: ' + [errorInfo, e]);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
  
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          GLctx = Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
  
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
  
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
  
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen();
      },requestAnimationFrame:function requestAnimationFrame(func) {
        if (typeof window === 'undefined') { // Provide fallback to setTimeout if window is undefined (e.g. in Node.js)
          setTimeout(func, 1000/60);
        } else {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                           window['mozRequestAnimationFrame'] ||
                                           window['webkitRequestAnimationFrame'] ||
                                           window['msRequestAnimationFrame'] ||
                                           window['oRequestAnimationFrame'] ||
                                           window['setTimeout'];
          }
          window.requestAnimationFrame(func);
        }
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x, y;
          
          // Neither .scrollX or .pageXOffset are defined in a spec, but
          // we prefer .scrollX because it is currently in a spec draft.
          // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
          var scrollX = ((typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset);
          var scrollY = ((typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset);
          if (event.type == 'touchstart' ||
              event.type == 'touchend' ||
              event.type == 'touchmove') {
            var t = event.touches.item(0);
            if (t) {
              x = t.pageX - (scrollX + rect.left);
              y = t.pageY - (scrollY + rect.top);
            } else {
              return;
            }
          } else {
            x = event.pageX - (scrollX + rect.left);
            y = event.pageY - (scrollY + rect.top);
          }
  
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
  
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function xhr_onload() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      }};
FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
__ATINIT__.unshift({ func: function() { TTY.init() } });__ATEXIT__.push({ func: function() { TTY.shutdown() } });TTY.utf8 = new Runtime.UTF8Processor();
if (ENVIRONMENT_IS_NODE) { var fs = require("fs"); NODEFS.staticInit(); }
__ATINIT__.push({ func: function() { SOCKFS.root = FS.mount(SOCKFS, {}, null); } });
_fputc.ret = allocate([0], "i8", ALLOC_STATIC);
_fgetc.ret = allocate([0], "i8", ALLOC_STATIC);
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);

staticSealed = true; // seal the static portion of memory

STACK_MAX = STACK_BASE + 5242880;

DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);

assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");

 var ctlz_i8 = allocate([8,7,6,6,5,5,5,5,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_DYNAMIC);
 var cttz_i8 = allocate([8,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,7,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0], "i8", ALLOC_DYNAMIC);

var Math_min = Math.min;
function invoke_viiiii(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_iiii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_viiiiii"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iii(index,a1,a2) {
  try {
    return Module["dynCall_iii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiii(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm=(function(global,env,buffer){"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env.cttz_i8|0;var n=env.ctlz_i8|0;var o=env.__ZTVN10__cxxabiv117__class_type_infoE|0;var p=env.__ZTVN10__cxxabiv120__si_class_type_infoE|0;var q=env._stderr|0;var r=env._stdout|0;var s=env.__ZTISt9exception|0;var t=+env.NaN;var u=+env.Infinity;var v=0;var w=0;var x=0;var y=0;var z=0,A=0,B=0,C=0,D=0.0,E=0,F=0,G=0,H=0.0;var I=0;var J=0;var K=0;var L=0;var M=0;var N=0;var O=0;var P=0;var Q=0;var R=0;var S=global.Math.floor;var T=global.Math.abs;var U=global.Math.sqrt;var V=global.Math.pow;var W=global.Math.cos;var X=global.Math.sin;var Y=global.Math.tan;var Z=global.Math.acos;var _=global.Math.asin;var $=global.Math.atan;var aa=global.Math.atan2;var ba=global.Math.exp;var ca=global.Math.log;var da=global.Math.ceil;var ea=global.Math.imul;var fa=env.abort;var ga=env.assert;var ha=env.asmPrintInt;var ia=env.asmPrintFloat;var ja=env.min;var ka=env.invoke_viiiii;var la=env.invoke_vi;var ma=env.invoke_ii;var na=env.invoke_iiii;var oa=env.invoke_v;var pa=env.invoke_viiiiii;var qa=env.invoke_iii;var ra=env.invoke_viiii;var sa=env._strncmp;var ta=env._lseek;var ua=env._sscanf;var va=env._fabsf;var wa=env._snprintf;var xa=env._vsnprintf;var ya=env.__scanString;var za=env._llvm_va_end;var Aa=env.___cxa_throw;var Ba=env._fread;var Ca=env._fclose;var Da=env.__getFloat;var Ea=env._isalnum;var Fa=env._fprintf;var Ga=env._printf;var Ha=env._close;var Ia=env._pread;var Ja=env._fflush;var Ka=env._fopen;var La=env.__reallyNegative;var Ma=env._sqrtf;var Na=env._strchr;var Oa=env._fputc;var Pa=env._sysconf;var Qa=env._open;var Ra=env._abort;var Sa=env.___setErrNo;var Ta=env._fwrite;var Ua=env._fseek;var Va=env._send;var Wa=env._write;var Xa=env._fputs;var Ya=env._ftell;var Za=env._isalpha;var _a=env._exit;var $a=env._sprintf;var ab=env._llvm_lifetime_end;var bb=env._strrchr;var cb=env._strdup;var db=env.___cxa_allocate_exception;var eb=env._isspace;var fb=env._realpath;var gb=env._read;var hb=env.___cxa_is_number_type;var ib=env._time;var jb=env.__formatString;var kb=env.___cxa_does_inherit;var lb=env._fabs;var mb=env.___cxa_find_matching_catch;var nb=env.__ZNSt9exceptionD2Ev;var ob=env._recv;var pb=env.__ZSt18uncaught_exceptionv;var qb=env._pwrite;var rb=env._strstr;var sb=env._puts;var tb=env._fsync;var ub=env._fgetc;var vb=env.___errno_location;var wb=env.___gxx_personality_v0;var xb=env._llvm_lifetime_start;var yb=env._copysign;var zb=env._sbrk;var Ab=env._fmod;var Bb=env.___resumeException;var Cb=env._ungetc;var Db=env.___cxa_call_unexpected;var Eb=env.__exit;var Fb=env._strcmp;var Gb=0.0;
// EMSCRIPTEN_START_FUNCS
function Pb(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+7&-8;return b|0}function Qb(){return i|0}function Rb(a){a=a|0;i=a}function Sb(a,b){a=a|0;b=b|0;if((v|0)==0){v=a;w=b}}function Tb(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0]}function Ub(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0];a[k+4|0]=a[b+4|0];a[k+5|0]=a[b+5|0];a[k+6|0]=a[b+6|0];a[k+7|0]=a[b+7|0]}function Vb(a){a=a|0;I=a}function Wb(a){a=a|0;J=a}function Xb(a){a=a|0;K=a}function Yb(a){a=a|0;L=a}function Zb(a){a=a|0;M=a}function _b(a){a=a|0;N=a}function $b(a){a=a|0;O=a}function ac(a){a=a|0;P=a}function bc(a){a=a|0;Q=a}function cc(a){a=a|0;R=a}function dc(){c[2514]=o+8;c[2516]=p+8;c[2518]=s;c[2520]=p+8;c[2524]=p+8;c[2528]=p+8;c[2532]=o+8;c[2534]=p+8}function ec(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0;d=i;i=i+8|0;e=d|0;f=Ka(a|0,b|0)|0;a:do{if((f|0)==0){c[e>>2]=0;while(1){g=Qc(e,a)|0;if((g|0)==0){h=0;j=0;break a}k=Ka(g|0,b|0)|0;if((k|0)!=0){h=k;j=g;break}}}else{h=f;j=0}}while(0);f=c[5e3]|0;if((f|0)>=2048){sb(56)|0;_a(-2|0);return 0}if((j|0)!=0){c[5e3]=f+1;mg(81456+(f<<10)|0,j|0)|0;i=d;return h|0}if((fb(a|0,81456+(f<<10)|0)|0)==0){mg(81456+(c[5e3]<<10)|0,a|0)|0}c[5e3]=(c[5e3]|0)+1;i=d;return h|0}function fc(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;e=ec(b,9760)|0;if((e|0)==0){f=0;return f|0}do{if(a[14280]|0){wc(2178608,e,b);Ac(2178608);g=Bc(2178608)|0;h=ng(g|0)|0;c[d>>2]=h;if((h|0)!=0){i=g;break}Tf(g);i=0}else{Ua(e|0,0,2)|0;g=Ya(e|0)|0;c[d>>2]=g;if((g|0)<=0){i=0;break}h=Sf(g+1|0)|0;a[h+g|0]=0;Ua(e|0,0,0)|0;Ba(h|0,1,c[d>>2]|0,e|0)|0;i=h}}while(0);Ca(e|0)|0;f=i;return f|0}function gc(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;i=i+8|0;e=d|0;c[e>>2]=0;f=fc(b,e)|0;if((f|0)==0){c[(c[20362]|0)+12>>2]=0;g=0;i=d;return g|0}b=c[e>>2]|0;e=b+1|0;h=Xf((e|0)>-1?e:-1)|0;if(!(Pc(f,b,h,a[14280]|0)|0)){sb(16)|0;Zf(h);Tf(f);g=0;i=d;return g|0}b=c[20362]|0;e=c[b+12>>2]|0;if((e|0)==0){j=b}else{Zf(e);j=c[20362]|0}c[j+12>>2]=h;Tf(f);g=1;i=d;return g|0}function hc(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;e=i;i=i+1072|0;f=e|0;g=e+8|0;h=e+16|0;j=e+24|0;k=e+32|0;l=e+40|0;m=e+48|0;n=e+560|0;c[f>>2]=1;c[g>>2]=1;c[h>>2]=-1;c[j>>2]=-1;c[k>>2]=0;c[l>>2]=0;jd(f,g,h,j,k,l)|0;o=c[f>>2]|0;f=c[g>>2]|0;Ga(4952,(g=i,i=i+32|0,c[g>>2]=b,c[g+8>>2]=o,c[g+16>>2]=f,c[g+24>>2]=d,g)|0)|0;i=g;d=c[k>>2]|0;f=c[(c[20362]|0)+12>>2]|0;do{if((d|0)==(c[l>>2]|0)){if((a[f+d|0]|0)!=0){break}pg(n|0,3368,12)|0;c[m>>2]=4271950;p=m|0;q=n|0;r=Ga(2304,(g=i,i=i+16|0,c[g>>2]=q,c[g+8>>2]=p,g)|0)|0;i=g;i=e;return}}while(0);d=c[h>>2]|0;og(n|0,f+d|0,(c[j>>2]|0)-d|0)|0;a[n+((c[j>>2]|0)-(c[h>>2]|0))|0]=0;h=m|0;j=c[k>>2]|0;og(h|0,(c[(c[20362]|0)+12>>2]|0)+j|0,(c[l>>2]|0)-j|0)|0;a[m+((c[l>>2]|0)-(c[k>>2]|0))|0]=0;p=h;q=n|0;r=Ga(2304,(g=i,i=i+16|0,c[g>>2]=q,c[g+8>>2]=p,g)|0)|0;i=g;i=e;return}function ic(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;f=i;i=i+8480|0;g=f|0;h=f+32|0;j=f+8224|0;k=c[544676]|0;if((k|0)>0&(d^1|e)){pg(g|0,9776,32)|0;Ga(1712,(l=i,i=i+16|0,c[l>>2]=g+(32-(k<<1)),c[l+8>>2]=b,l)|0)|0;i=l;m=c[544676]|0}else{m=k}c[544676]=m+1;if((m|0)>15){Ga(1152,(l=i,i=i+16|0,c[l>>2]=b,c[l+8>>2]=16,l)|0)|0;i=l;n=0;i=f;return n|0}if(a[14280]|0){o=Dc(2178608)|0}else{o=0}if(!(gc(b)|0)){Ga(9720,(l=i,i=i+8|0,c[l>>2]=b,l)|0)|0;i=l;n=0;i=f;return n|0}m=Zc()|0;if((m|0)!=0){hc(b,m);n=0;i=f;return n|0}m=c[20362]|0;k=c[m+60>>2]|0;do{if((k|0)>0){g=0;p=m;while(1){q=g<<8;r=h+q|0;mg(r|0,p+64+q|0)|0;if((rb(r|0,9120)|0)==0){s=h+((ng(r|0)|0)+q)|0;a[s]=a[9120]|0;a[s+1|0]=a[9121]|0;a[s+2|0]=a[9122]|0;a[s+3|0]=a[9123]|0;a[s+4|0]=a[9124]|0;a[s+5|0]=a[9125]|0}s=g+1|0;if((s|0)>=(k|0)){t=0;break}g=s;p=c[20362]|0}while(1){p=t+1|0;if(!(ic(h+(t<<8)|0,d,e)|0)){n=0;u=45;break}if((p|0)<(k|0)){t=p}else{break}}if((u|0)==45){i=f;return n|0}if(a[14280]|0){Ec(2178608,o)}if(!(gc(b)|0)){Ga(9720,(l=i,i=i+8|0,c[l>>2]=b,l)|0)|0;i=l;n=0;i=f;return n|0}p=Zc()|0;if((p|0)!=0){hc(b,p);n=0;i=f;return n|0}if(Wc(c[20362]|0,h|0)|0){v=c[20362]|0;break}Ga(8616,(l=i,i=i+8|0,c[l>>2]=b,l)|0)|0;i=l;n=0;i=f;return n|0}else{v=m}}while(0);a:do{if((c[v+74688>>2]|0)>0){m=j|0;h=0;o=0;t=v;while(1){mg(m|0,(o<<8)+(t+74692)|0)|0;k=c[20362]|0;e=ec(m,9760)|0;if((e|0)==0){Ga(7e3,(l=i,i=i+8|0,c[l>>2]=m,l)|0)|0;i=l;w=-1}else{d=Ba(k+83396+h|0,1,65536-h|0,e|0)|0;Ca(e|0)|0;w=d}c[(c[20362]|0)+83268+(o<<2)>>2]=w;d=c[20362]|0;x=d+83268+(o<<2)|0;e=c[x>>2]|0;if((e|0)==-1){u=33;break}if((e+h|0)>65536){u=35;break}c[d+83140+(o<<2)>>2]=h;d=c[20362]|0;e=o+1|0;if((e|0)<(c[d+74688>>2]|0)){h=(c[d+83268+(o<<2)>>2]|0)+h|0;o=e;t=d}else{break a}}if((u|0)==33){c[x>>2]=0;n=0;i=f;return n|0}else if((u|0)==35){Ga(8616,(l=i,i=i+8|0,c[l>>2]=b,l)|0)|0;i=l;n=0;i=f;return n|0}}}while(0);u=cd()|0;if((u|0)!=0){hc(b,u);n=0;i=f;return n|0}u=c[20362]|0;x=(c[u+197876>>2]|0)+16+(c[u+197872>>2]|0)+(c[u+197848>>2]<<2)|0;do{if((c[u+8>>2]|0)==0){w=c[u+197868>>2]|0;if(x>>>0<=w>>>0){break}Ga(8328,(l=i,i=i+16|0,c[l>>2]=b,c[l+8>>2]=(x-w|0)>>>2,l)|0)|0;i=l;n=0;i=f;return n|0}}while(0);if(Uc(b,u)|0){c[544676]=(c[544676]|0)-1;n=1;i=f;return n|0}else{Ga(8056,(l=i,i=i+8|0,c[l>>2]=b,l)|0)|0;i=l;n=0;i=f;return n|0}return 0}function jc(f,g,h,j,k){f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;l=i;m=c[20362]|0;if(h){h=c[m+48>>2]|0;n=c[m+197876>>2]|0;o=(n>>>0>65535>>>0?n:e[h+4>>1]|0)-4-((d[h+7|0]|0)<<2)|0;c[f>>2]=Xf(o)|0;c[g>>2]=o;h=c[(c[20362]|0)+48>>2]|0;pg(c[f>>2]|0,h+(((d[h+7|0]|0)<<2)+8)|0,o)|0;i=l;return}o=c[m+197876>>2]|0;h=c[m+48>>2]|0;n=o+16|0;p=n+(c[m+197872>>2]|0)|0;q=p+8|0;r=(b[h+8>>1]|0)+16&65535;s=p+12+(e[h+10>>1]|0)+((d[m+197844|0]|0)<<2)|0;if(j){j=Xf(n)|0;c[f>>2]=j;qg(j|0,0,n|0)|0;c[g>>2]=n}else{j=o+24|0;if(j>>>0>k>>>0){Ga(7832,(m=i,i=i+8|0,c[m>>2]=(j-k|0)>>>2,m)|0)|0;i=m;t=j}else{t=k}k=Xf(t)|0;c[f>>2]=k;qg(k|0,0,t|0)|0;c[g>>2]=t;a[(c[f>>2]|0)+p|0]=-1;a[(c[f>>2]|0)+(p+1)|0]=-1;a[(c[f>>2]|0)+(p+2)|0]=-7;a[(c[f>>2]|0)+(p+3)|0]=-1;a[(c[f>>2]|0)+(p+4)|0]=-1;a[(c[f>>2]|0)+(p+5)|0]=-1;a[(c[f>>2]|0)+(p+6)|0]=-7;a[(c[f>>2]|0)+(p+7)|0]=-1}c[c[f>>2]>>2]=c[(c[20362]|0)+197856>>2];a[(c[f>>2]|0)+4|0]=a[(c[20362]|0)+197852|0]|0;b[(c[f>>2]|0)+6>>1]=16;b[(c[f>>2]|0)+8>>1]=n;b[(c[f>>2]|0)+10>>1]=q;b[(c[f>>2]|0)+12>>1]=r;b[(c[f>>2]|0)+14>>1]=s;pg((c[f>>2]|0)+16|0,(c[(c[20362]|0)+48>>2]|0)+4|0,o)|0;o=c[f>>2]|0;if((n|0)==0){u=0}else{f=0;s=0;while(1){r=s+1|0;q=(d[o+s|0]|0)+f&255;if(r>>>0<n>>>0){f=q;s=r}else{u=q;break}}}a[o+5|0]=-2028-u;i=l;return}function kc(){var a=0,b=0,d=0,e=0,f=0;a=c[20362]|0;b=c[a+24>>2]|0;if((b|0)==0){d=a}else{Zf(b);d=c[20362]|0}b=c[d+36>>2]|0;if((b|0)==0){e=d}else{Zf(b);e=c[20362]|0}b=c[e+48>>2]|0;if((b|0)==0){f=e}else{Zf(b);f=c[20362]|0}b=c[f+12>>2]|0;if((b|0)==0){Vc();Tc();Yc();return}Zf(b);Vc();Tc();Yc();return}function lc(b,d){b=b|0;d=d|0;var e=0,f=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0.0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0;e=i;i=i+792|0;f=e|0;j=e+8|0;k=e+264|0;l=e+272|0;m=e+280|0;n=e+536|0;c[f>>2]=32768;a[14280]=1;c[544676]=0;c[5e3]=0;c[20362]=0;o=(b|0)>1;do{if(o){p=0;s=0;t=0;u=1;v=0;w=0;x=0;y=1;z=0;B=0;C=0;D=0;a:while(1){E=c[d+(y<<2)>>2]|0;b:do{if((a[E]|0)==45){switch(a[E+1|0]|0){case 112:{a[14280]=0;F=D;G=C;H=B;I=z;J=y;K=x;L=w;M=v;N=u;O=t;P=s;Q=p;break b;break};case 97:{F=D;G=C;H=B;I=z;J=y;K=x;L=w;M=v;N=u;O=t;P=s;Q=1;break b;break};case 68:{if(!(a[14280]|0)){R=25;break a}if((a[E+2|0]|0)!=0){F=D;G=C;H=B;I=z;J=y;K=x;L=w;M=v;N=u;O=t;P=s;Q=p;break b}S=y+1|0;if((S|0)<(b|0)){F=D;G=C;H=B;I=z;J=S;K=x;L=w;M=v;N=u;O=t;P=s;Q=p;break b}else{R=24;break a}break};case 116:{F=D;G=C;H=B;I=z;J=y;K=x;L=w;M=1;N=u;O=t;P=s;Q=p;break b;break};case 102:{F=D;G=C;H=B;I=z;J=y;K=x;L=1;M=v;N=u;O=t;P=s;Q=p;break b;break};case 98:{F=D;G=C;H=B;I=z;J=y;K=x;L=w;M=v;N=1;O=t;P=s;Q=p;break b;break};case 99:{F=D;G=C;H=B;I=z;J=y;K=x;L=w;M=v;N=u;O=1;P=s;Q=p;break b;break};case 100:{F=D;G=C;H=B;I=z;J=y;K=x;L=w;M=v;N=u;O=t;P=1;Q=p;break b;break};case 101:{F=D;G=C;H=B;I=z;J=y;K=x;L=w;M=v;N=0;O=t;P=s;Q=p;break b;break};case 113:{F=D;G=C;H=B;I=1;J=y;K=x;L=w;M=v;N=u;O=t;P=s;Q=p;break b;break};case 118:{F=D;G=C;H=1;I=z;J=y;K=x;L=w;M=v;N=u;O=t;P=s;Q=p;break b;break};case 115:{F=D;G=C;H=B;I=z;J=y;K=1;L=w;M=v;N=u;O=t;P=s;Q=p;break b;break};case 111:{S=E+2|0;if((a[S]|0)!=0){F=D;G=S;H=B;I=z;J=y;K=x;L=w;M=v;N=u;O=t;P=s;Q=p;break b}S=y+1|0;if((S|0)>=(b|0)){R=18;break a}F=D;G=c[d+(S<<2)>>2]|0;H=B;I=z;J=S;K=x;L=w;M=v;N=u;O=t;P=s;Q=p;break b;break};case 73:case 76:{S=E+2|0;if((a[S]|0)==0){T=y+1|0;if((T|0)>=(b|0)){R=7;break a}U=c[d+(T<<2)>>2]|0;V=T}else{U=S;V=y}Rc(U)|0;F=D;G=C;H=B;I=z;J=V;K=x;L=w;M=v;N=u;O=t;P=s;Q=p;break b;break};case 77:{S=E+2|0;if((a[S]|0)==0){T=y+1|0;if((T|0)>=(b|0)){R=12;break a}W=c[d+(T<<2)>>2]|0;X=T}else{W=S;X=y}ua(W|0,7648,(Y=i,i=i+8|0,c[Y>>2]=f,Y)|0)|0;i=Y;if((c[f>>2]|0)>>>0>16777216>>>0){R=14;break a}else{F=D;G=C;H=B;I=z;J=X;K=x;L=w;M=v;N=u;O=t;P=s;Q=p;break b}break};default:{R=34;break a}}}else{if((D|0)==0){F=E;G=C;H=B;I=z;J=y;K=x;L=w;M=v;N=u;O=t;P=s;Q=p}else{R=36;break a}}}while(0);E=J+1|0;if((E|0)<(b|0)){p=Q;s=P;t=O;u=N;v=M;w=L;x=K;y=E;z=I;B=H;C=G;D=F}else{R=38;break}}if((R|0)==7){D=c[r>>2]|0;Ta(5008,95,1,D|0)|0;Fa(D|0,4928,(Y=i,i=i+16|0,c[Y>>2]=4840,c[Y+8>>2]=4736,Y)|0)|0;i=Y;Ta(3648,1051,1,c[q>>2]|0)|0;kc();Z=1;i=e;return Z|0}else if((R|0)==12){D=c[r>>2]|0;Ta(5008,95,1,D|0)|0;Fa(D|0,4928,(Y=i,i=i+16|0,c[Y>>2]=4840,c[Y+8>>2]=4736,Y)|0)|0;i=Y;Ta(3648,1051,1,c[q>>2]|0)|0;kc();Z=1;i=e;return Z|0}else if((R|0)==14){D=c[r>>2]|0;Ta(5008,95,1,D|0)|0;Fa(D|0,4928,(Y=i,i=i+16|0,c[Y>>2]=4840,c[Y+8>>2]=4736,Y)|0)|0;i=Y;Ta(3648,1051,1,c[q>>2]|0)|0;kc();Z=1;i=e;return Z|0}else if((R|0)==18){D=c[r>>2]|0;Ta(5008,95,1,D|0)|0;Fa(D|0,4928,(Y=i,i=i+16|0,c[Y>>2]=4840,c[Y+8>>2]=4736,Y)|0)|0;i=Y;Ta(3648,1051,1,c[q>>2]|0)|0;kc();Z=1;i=e;return Z|0}else if((R|0)==24){D=c[r>>2]|0;Ta(5008,95,1,D|0)|0;Fa(D|0,4928,(Y=i,i=i+16|0,c[Y>>2]=4840,c[Y+8>>2]=4736,Y)|0)|0;i=Y;Ta(3648,1051,1,c[q>>2]|0)|0;kc();Z=1;i=e;return Z|0}else if((R|0)==25){D=c[r>>2]|0;Ta(5008,95,1,D|0)|0;Fa(D|0,4928,(Y=i,i=i+16|0,c[Y>>2]=4840,c[Y+8>>2]=4736,Y)|0)|0;i=Y;Ta(3648,1051,1,c[q>>2]|0)|0;kc();Z=1;i=e;return Z|0}else if((R|0)==34){D=c[r>>2]|0;Ta(5008,95,1,D|0)|0;Fa(D|0,4928,(Y=i,i=i+16|0,c[Y>>2]=4840,c[Y+8>>2]=4736,Y)|0)|0;i=Y;Ta(3648,1051,1,c[q>>2]|0)|0;kc();Z=1;i=e;return Z|0}else if((R|0)==36){D=c[r>>2]|0;Ta(5008,95,1,D|0)|0;Fa(D|0,4928,(Y=i,i=i+16|0,c[Y>>2]=4840,c[Y+8>>2]=4736,Y)|0)|0;i=Y;Ta(3648,1051,1,c[q>>2]|0)|0;kc();Z=1;i=e;return Z|0}else if((R|0)==38){if((F|0)==0){break}D=M|L|K;C=D|I;if(a[14280]|0){B=(Q&1)!=0;vc(2178608,B);c:do{if(o){z=1;while(1){_=c[d+(z<<2)>>2]|0;if((a[_]|0)==45){if((a[_+1|0]|0)==68){break}}y=z+1|0;if((y|0)<(b|0)){z=y}else{break c}}if(!(a[14280]|0)){y=c[r>>2]|0;Ta(5008,95,1,y|0)|0;Fa(y|0,4928,(Y=i,i=i+16|0,c[Y>>2]=4840,c[Y+8>>2]=4736,Y)|0)|0;i=Y;Ta(3648,1051,1,c[q>>2]|0)|0;kc();Z=1;i=e;return Z|0}y=_+2|0;do{if((a[y]|0)==0){x=z+1|0;if((x|0)<(b|0)){$=c[d+(x<<2)>>2]|0;break}x=c[r>>2]|0;Ta(5008,95,1,x|0)|0;Fa(x|0,4928,(Y=i,i=i+16|0,c[Y>>2]=4840,c[Y+8>>2]=4736,Y)|0)|0;i=Y;Ta(3648,1051,1,c[q>>2]|0)|0;kc();Z=1;i=e;return Z|0}else{$=y}}while(0);zc(2178608,$,B?19512:7312)}}while(0);zc(2178608,7160,7312);zc(2178608,6984,6840);Cc(2178608,6600,6448,6256)}Sc(F)|0;B=j|0;do{if((G|0)==0){mg(B|0,F|0)|0;y=rb(B|0,9120)|0;if((y|0)==0){Ga(6056,(Y=i,i=i+8|0,c[Y>>2]=F,Y)|0)|0;i=Y;z=c[r>>2]|0;Ta(5008,95,1,z|0)|0;Fa(z|0,4928,(Y=i,i=i+16|0,c[Y>>2]=4840,c[Y+8>>2]=4736,Y)|0)|0;i=Y;Ta(3648,1051,1,c[q>>2]|0)|0;kc();Z=1;i=e;return Z|0}a[j+(1-j+y)|0]=0;y=j+(ng(B|0)|0)|0;if(O){z=y;A=7627108;a[z]=A;A=A>>8;a[z+1|0]=A;A=A>>8;a[z+2|0]=A;A=A>>8;a[z+3|0]=A;break}if(N){a[y]=a[5872]|0;a[y+1|0]=a[5873]|0;a[y+2|0]=a[5874]|0;a[y+3|0]=a[5875]|0;a[y+4|0]=a[5876]|0;a[y+5|0]=a[5877]|0;a[y+6|0]=a[5878]|0;break}else{a[y]=a[5824]|0;a[y+1|0]=a[5825]|0;a[y+2|0]=a[5826]|0;a[y+3|0]=a[5827]|0;a[y+4|0]=a[5828]|0;a[y+5|0]=a[5829]|0;a[y+6|0]=a[5830]|0;break}}else{mg(B|0,G|0)|0}}while(0);if(!C){y=c[r>>2]|0;Ta(5008,95,1,y|0)|0;Fa(y|0,4928,(Y=i,i=i+16|0,c[Y>>2]=4840,c[Y+8>>2]=4736,Y)|0)|0;i=Y;Ga(5768,(Y=i,i=i+8|0,c[Y>>2]=F,Y)|0)|0;i=Y}if(M){sb(F|0)|0}y=Xc()|0;c[20362]=y;c[y+24>>2]=Xf(2e6)|0;c[(c[20362]|0)+28>>2]=2e6;y=c[20362]|0;qg(c[y+24>>2]|0,0,2e6)|0;z=C|P^1|O;if(z){c[y+36>>2]=0;c[(c[20362]|0)+40>>2]=0;aa=c[20362]|0}else{c[y+36>>2]=Xf(2e6)|0;c[(c[20362]|0)+40>>2]=2e6;y=c[20362]|0;qg(c[y+36>>2]|0,0,2e6)|0;aa=y}a[aa+197864|0]=O&1;a[(c[20362]|0)+197865|0]=N&1;c[(c[20362]|0)+197868>>2]=c[f>>2];y=c[f>>2]|0;c[(c[20362]|0)+56>>2]=y>>>0>61440>>>0?y:61440;y=c[20362]|0;x=c[y+56>>2]|0;c[y+48>>2]=Xf((x|0)>-1?x:-1)|0;mg((c[20362]|0)+74432|0,F|0)|0;x=rb((c[20362]|0)+74432|0,9120)|0;if((x|0)!=0){a[x]=0}if(!(ic(F,C,M)|0)){kc();Z=1;i=e;return Z|0}if(!C){sb(8)|0}do{if(!D){c[k>>2]=0;c[l>>2]=0;jc(k,l,O,N,c[f>>2]|0);x=Ka(B|0,5504)|0;if((x|0)!=0){Ta(c[k>>2]|0,c[l>>2]|0,1,x|0)|0;Ca(x|0)|0}if(!C){Ga(5416,(Y=i,i=i+8|0,c[Y>>2]=c[l>>2],Y)|0)|0;i=Y}x=c[k>>2]|0;if((x|0)==0){break}Zf(x)}}while(0);do{if(K){B=c[20362]|0;if((c[B+165836>>2]|0)<=0){break}D=m|0;x=m+1|0;y=n|0;w=n+1|0;v=0;u=B;do{a[D]=42;a[x]=0;B=c[u+173840+(v<<2)>>2]|0;if((B|0)==4|(B|0)==5){t=c[u+185840+(v<<2)>>2]|0;ba=t;ca=(c[u+189840+(v<<2)>>2]|0)-t|0;R=88}else if((B|0)==2|(B|0)==3){da=u;ea=B}else{t=c[u+165840+(v<<2)>>2]|0;ba=t;ca=(c[u+169840+(v<<2)>>2]|0)-t|0;R=88}do{if((R|0)==88){R=0;if((ca-1|0)>>>0>=255>>>0){da=u;ea=B;break}og(D|0,(c[u+12>>2]|0)+ba|0,ca|0)|0;a[m+ca|0]=0;t=c[20362]|0;da=t;ea=c[t+173840+(v<<2)>>2]|0}}while(0);if((ea|0)==0){B=c[da+177840+(v<<2)>>2]|0;Ga(5344,(Y=i,i=i+16|0,c[Y>>2]=D,c[Y+8>>2]=B,Y)|0)|0;i=Y}else if((ea|0)==1){fa=+g[da+177840+(v<<2)>>2];Ga(5288,(Y=i,i=i+16|0,c[Y>>2]=D,h[Y+8>>3]=fa,Y)|0)|0;i=Y}else if((ea|0)==6){a[y]=42;a[w]=0;B=c[da+185840+(v<<2)>>2]|0;t=(c[da+189840+(v<<2)>>2]|0)-B|0;if((t-1|0)>>>0<255>>>0){og(y|0,(c[da+12>>2]|0)+B|0,t|0)|0;a[n+t|0]=0;ga=c[20362]|0}else{ga=da}t=c[ga+177840+(v<<2)>>2]|0;B=c[ga+181840+(v<<2)>>2]|0;Ga(5224,(Y=i,i=i+32|0,c[Y>>2]=y,c[Y+8>>2]=D,c[Y+16>>2]=t,c[Y+24>>2]=B,Y)|0)|0;i=Y}else if((ea|0)==4){B=c[da+193840+(v<<2)>>2]|0;Ga(5152,(Y=i,i=i+24|0,c[Y>>2]=D,c[Y+8>>2]=B&65535,c[Y+16>>2]=B>>16,Y)|0)|0;i=Y}v=v+1|0;u=c[20362]|0;}while((v|0)<(c[u+165836>>2]|0))}}while(0);do{if(L){u=c[5e3]|0;v=(u|0)>0;if(v){ha=0}else{break}while(1){D=ha+1|0;y=(D|0)<(u|0);if(!y){break}w=81456+(ha<<10)|0;x=D;do{B=81456+(x<<10)|0;if((Fb(w|0,B|0)|0)==0){a[B]=0}x=x+1|0;}while((x|0)<(u|0));if(y){ha=D}else{break}}if(v){ia=0;ja=u}else{break}while(1){x=81456+(ia<<10)|0;if((a[x]|0)==0){ka=ja}else{sb(x|0)|0;ka=c[5e3]|0}x=ia+1|0;if((x|0)<(ka|0)){ia=x;ja=ka}else{break}}}}while(0);do{if(!(C|H^1|O)){u=c[20362]|0;if((c[u+32>>2]|0)>0){la=0;ma=u}else{break}while(1){u=(c[ma+24>>2]|0)+la|0;v=Na(u|0,13)|0;if((v|0)==0){sb(u|0)|0;u=c[20362]|0;na=(ng((c[u+24>>2]|0)+la|0)|0)+la|0;oa=u}else{a[v]=0;sb((c[(c[20362]|0)+24>>2]|0)+la|0)|0;a[v]=13;u=c[20362]|0;na=la+1+v-((c[u+24>>2]|0)+la)|0;oa=u}if((na|0)<(c[oa+32>>2]|0)){la=na;ma=oa}else{break}}}}while(0);do{if(!z){C=c[20362]|0;if((c[C+44>>2]|0)>0){pa=0;qa=C}else{break}while(1){C=(c[qa+36>>2]|0)+pa|0;u=Na(C|0,13)|0;if((u|0)==0){sb(C|0)|0;C=c[20362]|0;ra=(ng((c[C+36>>2]|0)+pa|0)|0)+pa|0;sa=C}else{a[u]=0;sb((c[(c[20362]|0)+36>>2]|0)+pa|0)|0;a[u]=13;C=c[20362]|0;ra=pa+1+u-((c[C+36>>2]|0)+pa)|0;sa=C}if((ra|0)<(c[sa+44>>2]|0)){pa=ra;qa=sa}else{break}}}}while(0);kc();Z=0;i=e;return Z|0}}}while(0);sa=c[r>>2]|0;Ta(5008,95,1,sa|0)|0;Fa(sa|0,4928,(Y=i,i=i+16|0,c[Y>>2]=4840,c[Y+8>>2]=4736,Y)|0)|0;i=Y;Ta(3648,1051,1,c[q>>2]|0)|0;kc();Z=1;i=e;return Z|0}function mc(a,b){a=a|0;b=b|0;c[a>>2]=0;c[a+4>>2]=0;c[a+8>>2]=0;c[a+12>>2]=(b|0)!=0?b:1024;return}function nc(a){a=a|0;return c[a+4>>2]|0}function oc(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;e=b+4|0;f=c[e>>2]|0;g=f+1|0;h=b+8|0;i=c[h>>2]|0;j=b|0;k=c[j>>2]|0;do{if(g>>>0>i>>>0){l=b+12|0;m=Vf(k,(c[l>>2]|0)+i|0)|0;if((m|0)==0){n=0;return n|0}else{c[h>>2]=(c[h>>2]|0)+(c[l>>2]|0);c[j>>2]=m;o=c[e>>2]|0;p=m;break}}else{o=f;p=k}}while(0);a[p+o|0]=d;c[e>>2]=g;n=c[b>>2]|0;return n|0}function pc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;e=a+4|0;f=c[e>>2]|0;g=f+d|0;h=a+8|0;i=c[h>>2]|0;do{if(g>>>0>i>>>0){j=c[a+12>>2]|0;k=j+i|0;l=k>>>0<g>>>0?j+g|0:k;k=a|0;j=Vf(c[k>>2]|0,l)|0;if((j|0)==0){m=0;return m|0}else{c[h>>2]=l;c[k>>2]=j;n=j;o=c[e>>2]|0;break}}else{n=c[a>>2]|0;o=f}}while(0);pg(n+o|0,b|0,d)|0;c[e>>2]=g;m=c[a>>2]|0;return m|0}function qc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;d=ng(b|0)|0;e=a+4|0;f=c[e>>2]|0;g=f+d|0;h=a+8|0;i=c[h>>2]|0;do{if(g>>>0>i>>>0){j=c[a+12>>2]|0;k=j+i|0;l=k>>>0<g>>>0?j+g|0:k;k=a|0;j=Vf(c[k>>2]|0,l)|0;if((j|0)==0){m=0;return m|0}else{c[h>>2]=l;c[k>>2]=j;n=j;o=c[e>>2]|0;break}}else{n=c[a>>2]|0;o=f}}while(0);pg(n+o|0,b|0,d)|0;c[e>>2]=g;m=c[a>>2]|0;return m|0}function rc(a){a=a|0;var b=0,d=0,e=0,f=0;b=a|0;d=c[b>>2]|0;e=a+12|0;f=c[e>>2]|0;c[b>>2]=0;c[a+4>>2]=0;c[a+8>>2]=0;c[e>>2]=(f|0)!=0?f:1024;return d|0}function sc(a){a=a|0;c[a+4>>2]=0;return}function tc(a){a=a|0;var b=0,d=0;b=a|0;d=c[b>>2]|0;if((d|0)!=0){Tf(d)}c[b>>2]=0;c[a+4>>2]=0;c[a+8>>2]=0;c[a+12>>2]=1;return}function uc(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;d=i;i=i+8|0;e=d|0;f=c[b>>2]|0;if((f|0)==0){g=0;i=d;return g|0}h=c[f+4>>2]|0;j=f+12|0;c[j>>2]=(c[j>>2]|0)+1;j=b+4|0;sc(j);b=f+16|0;do{if((c[b>>2]|0)==0){f=ub(h|0)|0;if((f|0)<0){g=0;i=d;return g|0}k=ub(h|0)|0;l=ub(h|0)|0;do{if((f|0)==255&(k|0)==254|(k|0)==0){c[b>>2]=16;Cb(l|0,h|0)|0}else{if((f|0)==239&(k|0)==187&(l|0)==191){c[b>>2]=2;break}else{c[b>>2]=8;Cb(l|0,h|0)|0;Cb(k|0,h|0)|0;break}}}while(0);oc(j,239)|0;oc(j,187)|0;oc(j,191)|0;if((c[b>>2]|0)==8){oc(j,f)|0}if((f|0)!=10){break}oc(j,0)|0;g=1;i=d;return g|0}}while(0);k=e|0;e=0;while(1){l=Nb[c[b>>2]&31](h,k)|0;if((l|0)<1){m=e;break}n=l+e|0;pc(j,k,l)|0;if((l|0)==1&(a[k]|0)==10){m=n;break}else{e=n}}oc(j,0)|0;g=m;i=d;return g|0}function vc(b,d){b=b|0;d=d|0;qg(b|0,0,92)|0;mc(b+4|0,128);mc(b+20|0,102400);c[b+60>>2]=4;c[b+64>>2]=4;c[b+68>>2]=9768;c[b+72>>2]=9112;a[b+88|0]=d&1;return}function wc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=i;f=Uf(1,24)|0;if((f|0)==0){Jc(a,6816,(g=i,i=i+1|0,i=i+7&-8,c[g>>2]=0,g)|0);i=g;i=e;return}else{c[f+12>>2]=0;c[f+4>>2]=b;b=a|0;c[f>>2]=c[b>>2];c[f+8>>2]=d;c[b>>2]=f;i=e;return}}function xc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;d=i;i=i+8|0;e=d|0;f=Ka(b|0,5712)|0;a:do{if((f|0)==0){c[e>>2]=0;while(1){g=Qc(e,b)|0;if((g|0)==0){break}h=Ka(g|0,5712)|0;if((h|0)!=0){j=h;break a}}Jc(a,4768,(k=i,i=i+8|0,c[k>>2]=b,k)|0);i=k;i=d;return}else{j=f}}while(0);f=Uf(1,24)|0;if((f|0)==0){Jc(a,6816,(k=i,i=i+1|0,i=i+7&-8,c[k>>2]=0,k)|0);i=k;l=c[a>>2]|0}else{k=f;c[f+12>>2]=0;c[f+4>>2]=j;j=a|0;c[f>>2]=c[j>>2];c[f+8>>2]=b;c[j>>2]=k;l=k}k=l+20|0;c[k>>2]=c[k>>2]|1;i=d;return}function yc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;b=i;d=a+40|0;e=c[d>>2]|0;f=a|0;g=c[f>>2]|0;a:do{if((e|0)==0){h=g}else{j=0;k=e;l=g;while(1){m=j|0;b:do{if((j|0)==0){if((Fb(c[l+8>>2]|0,c[k+8>>2]|0)|0)!=0){n=k;o=8;break}Jc(a,3208,(p=i,i=i+8|0,c[p>>2]=c[k+12>>2],p)|0);i=p;c[d>>2]=c[k>>2];Tf(k);q=0;r=d}else{s=k;t=l;while(1){if((Fb(c[t+8>>2]|0,c[s+8>>2]|0)|0)!=0){n=s;o=8;break b}Jc(a,3208,(p=i,i=i+8|0,c[p>>2]=c[s+12>>2],p)|0);i=p;c[m>>2]=c[s>>2];Tf(s);u=c[m>>2]|0;v=c[f>>2]|0;if((u|0)==0){h=v;break a}else{s=u;t=v}}}}while(0);if((o|0)==8){o=0;q=n;r=n|0}m=c[r>>2]|0;t=c[f>>2]|0;if((m|0)==0){h=t;break}else{j=q;k=m;l=t}}}}while(0);if((h|0)==0){i=b;return}c[f>>2]=c[h>>2];if((c[h+20>>2]&1|0)!=0){Ca(c[h+4>>2]|0)|0}Tf(h);i=b;return}function zc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=Uf(16,1)|0;c[e+4>>2]=b;c[e+8>>2]=d;c[e+12>>2]=0;d=a+36|0;c[e>>2]=c[d>>2];c[d>>2]=e;return}function Ac(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0;d=i;i=i+16|0;e=d|0;f=b|0;if((c[f>>2]|0)==0){i=d;return}g=b+4|0;h=b+56|0;j=e|0;k=e+4|0;l=e+8|0;m=b+40|0;n=b+36|0;o=b+88|0;p=b+20|0;a:while(1){if((uc(b)|0)>=1){do{q=rc(g)|0;r=a[q]|0;do{if(r<<24>>24==-17){if((a[q+1|0]|0)!=-69){s=9;break}t=(a[q+2|0]|0)==-65?3:0;u=t+1|0;v=a[q+t|0]|0;s=7}else{u=1;v=r;s=7}}while(0);b:do{if((s|0)==7){s=0;if(v<<24>>24!=35){s=9;break}if((c[h>>2]|0)!=0){s=9;break}r=q+u|0;c[j>>2]=r;c[k>>2]=0;c[l>>2]=0;t=a[r]|0;c:do{if(t<<24>>24==0){w=r}else{x=r;y=t;while(1){z=x+1|0;if((eb(y<<24>>24|0)|0)==0){w=x;break c}A=a[z]|0;if(A<<24>>24==0){w=z;break}else{x=z;y=A}}}}while(0);c[j>>2]=w;c[k>>2]=0;t=a[w]|0;if((t<<24>>24|0)==34){r=w;while(1){B=r+1|0;C=a[B]|0;if((C<<24>>24|0)==34|(C<<24>>24|0)==0){break}else{r=B}}y=C<<24>>24==34?r+2|0:B;c[k>>2]=y;c[l>>2]=a[y]|0;a[y]=0}else if((t<<24>>24|0)!=0){y=t&255;do{if((eb(y|0)|0)==0){if((Ea(y|0)|0)!=0|t<<24>>24==95){D=2;s=19;break}E=w+1|0}else{D=1;s=19}}while(0);d:do{if((s|0)==19){s=0;t=w+1|0;y=a[t]|0;if(y<<24>>24==0){E=t;break}else{F=t;G=y}while(1){y=G&255;if((eb(y|0)|0)==0){t=(Ea(y|0)|0)!=0|G<<24>>24==95;H=t?2:3}else{H=1}t=F+1|0;if((H|0)!=(D|0)){E=F;break d}y=a[t]|0;if(y<<24>>24==0){E=t;break}else{F=t;G=y}}}}while(0);c[k>>2]=E;c[l>>2]=a[E]|0;a[E]=0}if((Fb(w|0,2896)|0)==0){Lc(b,e,0);I=0;break}if((Fb(w|0,2144)|0)==0){Lc(b,e,1);I=0;break}if((Fb(w|0,1568)|0)==0){y=c[m>>2]|0;if((y|0)==0){Jc(b,6512,(J=i,i=i+1|0,i=i+7&-8,c[J>>2]=0,J)|0);i=J;I=0;break}t=y+20|0;if((c[t>>2]|0)!=0){Jc(b,6312,(J=i,i=i+1|0,i=i+7&-8,c[J>>2]=0,J)|0);i=J;I=0;break}c[t>>2]=1;t=y+4|0;if((c[y+16>>2]|0)==0){c[t>>2]=0;I=0;break}else{c[t>>2]=1;I=0;break}}if((Fb(w|0,976)|0)==0){t=c[m>>2]|0;if((t|0)==0){Jc(b,6512,(J=i,i=i+1|0,i=i+7&-8,c[J>>2]=0,J)|0);i=J;I=0;break}y=t+16|0;if((c[y>>2]|0)!=0){c[t+4>>2]=1;I=0;break}r=c[k>>2]|0;if((r|0)==0){K=j}else{a[r]=c[l>>2];K=k}r=c[K>>2]|0;x=a[r]|0;e:do{if(x<<24>>24==0){L=r}else{A=r;z=x;while(1){M=A+1|0;if((eb(z<<24>>24|0)|0)==0){L=A;break e}N=a[M]|0;if(N<<24>>24==0){L=M;break}else{A=M;z=N}}}}while(0);c[j>>2]=L;c[k>>2]=0;x=a[L]|0;if((x<<24>>24|0)==34){r=L;while(1){O=r+1|0;P=a[O]|0;if((P<<24>>24|0)==34|(P<<24>>24|0)==0){break}else{r=O}}z=P<<24>>24==34?r+2|0:O;c[k>>2]=z;c[l>>2]=a[z]|0;a[z]=0}else if((x<<24>>24|0)!=0){z=x&255;do{if((eb(z|0)|0)==0){if((Ea(z|0)|0)!=0|x<<24>>24==95){Q=2;s=53;break}R=L+1|0}else{Q=1;s=53}}while(0);f:do{if((s|0)==53){s=0;x=L+1|0;z=a[x]|0;if(z<<24>>24==0){R=x;break}else{S=x;T=z}while(1){z=T&255;if((eb(z|0)|0)==0){x=(Ea(z|0)|0)!=0|T<<24>>24==95;U=x?2:3}else{U=1}x=S+1|0;if((U|0)!=(Q|0)){R=S;break f}z=a[x]|0;if(z<<24>>24==0){R=x;break}else{S=x;T=z}}}}while(0);c[k>>2]=R;c[l>>2]=a[R]|0;a[R]=0}z=c[n>>2]|0;g:do{if((z|0)==0){s=62}else{x=z;while(1){if((Fb(c[x+4>>2]|0,L|0)|0)==0){break}r=c[x>>2]|0;if((r|0)==0){s=62;break g}else{x=r}}r=t+4|0;if((c[x+8>>2]|0)==0){V=r;break}c[r>>2]=0;c[y>>2]=1;I=0;break b}}while(0);if((s|0)==62){s=0;V=t+4|0}c[V>>2]=1;I=0;break}if((Fb(w|0,9520)|0)==0){y=c[m>>2]|0;if((y|0)==0){Jc(b,6512,(J=i,i=i+1|0,i=i+7&-8,c[J>>2]=0,J)|0);i=J;I=0;break}z=y+16|0;if((c[z>>2]|0)!=0){c[y+4>>2]=1;I=0;break}r=c[k>>2]|0;if((r|0)==0){W=j}else{a[r]=c[l>>2];W=k}r=c[W>>2]|0;A=a[r]|0;h:do{if(A<<24>>24==0){X=r}else{N=r;M=A;while(1){Y=N+1|0;if((eb(M<<24>>24|0)|0)==0){X=N;break h}Z=a[Y]|0;if(Z<<24>>24==0){X=Y;break}else{N=Y;M=Z}}}}while(0);c[j>>2]=X;c[k>>2]=0;A=a[X]|0;if((A<<24>>24|0)==34){r=X;while(1){_=r+1|0;$=a[_]|0;if(($<<24>>24|0)==34|($<<24>>24|0)==0){break}else{r=_}}t=$<<24>>24==34?r+2|0:_;c[k>>2]=t;c[l>>2]=a[t]|0;a[t]=0}else if((A<<24>>24|0)!=0){t=A&255;do{if((eb(t|0)|0)==0){if((Ea(t|0)|0)!=0|A<<24>>24==95){aa=2;s=82;break}ba=X+1|0}else{aa=1;s=82}}while(0);i:do{if((s|0)==82){s=0;A=X+1|0;t=a[A]|0;if(t<<24>>24==0){ba=A;break}else{ca=A;da=t}while(1){t=da&255;if((eb(t|0)|0)==0){A=(Ea(t|0)|0)!=0|da<<24>>24==95;ea=A?2:3}else{ea=1}A=ca+1|0;if((ea|0)!=(aa|0)){ba=ca;break i}t=a[A]|0;if(t<<24>>24==0){ba=A;break}else{ca=A;da=t}}}}while(0);c[k>>2]=ba;c[l>>2]=a[ba]|0;a[ba]=0}t=c[n>>2]|0;j:do{if((t|0)==0){s=91}else{A=t;while(1){if((Fb(c[A+4>>2]|0,X|0)|0)==0){break}r=c[A>>2]|0;if((r|0)==0){s=91;break j}else{A=r}}r=y+4|0;if((c[A+8>>2]|0)==0){fa=r;break}c[r>>2]=1;I=0;break b}}while(0);if((s|0)==91){s=0;fa=y+4|0}c[fa>>2]=0;c[z>>2]=1;I=0;break}if((Fb(w|0,8960)|0)==0){t=c[m>>2]|0;if((t|0)==0){Jc(b,6672,(J=i,i=i+1|0,i=i+7&-8,c[J>>2]=0,J)|0);i=J;I=0;break}else{c[m>>2]=c[t>>2];Tf(t);I=0;break}}if((Fb(w|0,9768)|0)==0){t=c[m>>2]|0;if((t|0)!=0){if((c[t+4>>2]|0)!=0){I=0;break}}t=c[k>>2]|0;if((t|0)==0){ga=j}else{a[t]=c[l>>2];ga=k}t=c[ga>>2]|0;r=t;while(1){ha=a[r]|0;ia=ha<<24>>24==0;if(ha<<24>>24!=10&(ia^1)){r=r+1|0}else{break}}if(ia){ja=0}else{c[l>>2]=ha<<24>>24;a[r]=0;ja=r}c[k>>2]=ja;c[j>>2]=t;Jc(b,6904,(J=i,i=i+8|0,c[J>>2]=t,J)|0);i=J;if((a[o]&1)==0){I=0;break}else{s=109;break a}}if((Fb(w|0,9112)|0)==0){z=c[m>>2]|0;if((z|0)!=0){if((c[z+4>>2]|0)!=0){I=0;break}}z=c[k>>2]|0;if((z|0)==0){ka=j}else{a[z]=c[l>>2];ka=k}z=c[ka>>2]|0;y=z;while(1){la=a[y]|0;ma=la<<24>>24==0;if(la<<24>>24!=10&(ma^1)){y=y+1|0}else{break}}if(ma){na=0}else{c[l>>2]=la<<24>>24;a[y]=0;na=y}c[k>>2]=na;c[j>>2]=z;Mc(b,7088,(J=i,i=i+8|0,c[J>>2]=z,J)|0);i=J;I=0;break}if((Fb(w|0,8536)|0)==0){Nc(b,e,1);I=0;break}if((Fb(w|0,8208)|0)==0){Nc(b,e,0);I=0;break}if((Fb(w|0,7976)|0)!=0){a[c[k>>2]|0]=c[l>>2];I=Kc(b,g,q)|0;break}t=c[m>>2]|0;if((t|0)!=0){if((c[t+4>>2]|0)!=0){I=0;break}}t=c[k>>2]|0;if((t|0)==0){oa=j}else{a[t]=c[l>>2];oa=k}t=c[oa>>2]|0;r=a[t]|0;k:do{if(r<<24>>24==0){pa=t}else{M=t;N=r;while(1){x=M+1|0;if((eb(N<<24>>24|0)|0)==0){pa=M;break k}Z=a[x]|0;if(Z<<24>>24==0){pa=x;break}else{M=x;N=Z}}}}while(0);c[j>>2]=pa;c[k>>2]=0;do{if((a[pa]|0)==34){r=pa+1|0;t=r;while(1){z=a[t]|0;qa=z<<24>>24==0;if(z<<24>>24!=34&(qa^1)){t=t+1|0}else{break}}if(qa){break}c[k>>2]=t;c[l>>2]=a[t]|0;a[t]=0;xc(b,cb(r|0)|0);I=0;break b}}while(0);Jc(b,7712,(J=i,i=i+1|0,i=i+7&-8,c[J>>2]=0,J)|0);i=J;I=0}}while(0);if((s|0)==9){s=0;I=Kc(b,g,q)|0}Tf(q);if((I|0)==0){oc(p,10)|0}else{z=rc(g)|0;qc(p,z)|0;Tf(z)}}while((uc(b)|0)>=1)}yc(b);if((c[f>>2]|0)==0){s=144;break}}if((s|0)==109){_a(1)}else if((s|0)==144){i=d;return}}function Bc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=a+20|0;oc(b,0)|0;d=a+36|0;e=c[d>>2]|0;if((e|0)!=0){f=e;while(1){e=c[f>>2]|0;do{if((c[f+12>>2]&1|0)!=0){Tf(c[f+4>>2]|0);g=c[f+8>>2]|0;if((g|0)==0){break}Tf(g)}}while(0);Tf(f);if((e|0)==0){break}else{f=e}}}c[d>>2]=0;tc(a+4|0);return rc(b)|0}function Cc(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;c[a+44>>2]=b;c[a+48>>2]=d;c[a+52>>2]=e;return}function Dc(a){a=a|0;return c[a+36>>2]|0}function Ec(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=b;b=a+36|0;a=c[b>>2]|0;if((a|0)!=(d|0)&(a|0)!=0){e=a}else{f=a;c[b>>2]=f;return}while(1){a=c[e>>2]|0;do{if((c[e+12>>2]&1|0)!=0){Tf(c[e+4>>2]|0);g=c[e+8>>2]|0;if((g|0)==0){break}Tf(g)}}while(0);Tf(e);if((a|0)!=(d|0)&(a|0)!=0){e=a}else{f=a;break}}c[b>>2]=f;return}function Fc(b,c){b=b|0;c=c|0;var d=0,e=0,f=0;d=ub(b|0)|0;if((d|0)<0){e=-1;return e|0}f=ub(b|0)|0;if((f|0)<0){e=-1;return e|0}b=(f<<8)+d|0;if((b|0)<128){a[c]=b;e=1;return e|0}if((b|0)<2048){a[c]=b>>>6&31|192;a[c+1|0]=b&63|128;e=2;return e|0}if((b|0)<65536){a[c]=b>>>12&15|224;a[c+1|0]=b>>>6&63|128;a[c+2|0]=b&63|128;e=3;return e|0}else{a[c]=b>>>18&7|240;a[c+1|0]=b>>>12&63|128;a[c+2|0]=b>>>6&63|128;a[c+3|0]=b&63|128;e=4;return e|0}return 0}function Gc(b,c){b=b|0;c=c|0;var d=0,e=0;d=ub(b|0)|0;if((d|0)==-1){e=-1}else{a[c]=d;e=1}return e|0}function Hc(b,c){b=b|0;c=c|0;var d=0,e=0;d=ub(b|0)|0;if((d|0)==-1){e=-1;return e|0}if((d|0)<128){a[c]=d;e=1;return e|0}else{a[c]=d>>>6&31|192;a[c+1|0]=d&63|128;e=2;return e|0}return 0}function Ic(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=i;g=c[q>>2]|0;Fa(g|0,5960,(h=i,i=i+24|0,c[h>>2]=b,c[h+8>>2]=d,c[h+16>>2]=a,h)|0)|0;i=h;Xa(e|0,g|0)|0;Oa(10,g|0)|0;i=f;return}function Jc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=i;i=i+1040|0;f=e|0;g=f;c[g>>2]=d;c[g+4>>2]=0;g=e+16|0;xa(g|0,1024,b|0,f|0)|0;f=a+80|0;c[f>>2]=(c[f>>2]|0)+1;f=c[a>>2]|0;b=c[a+60>>2]|0;d=c[a+68>>2]|0;if((f|0)==0){Ob[b&7](d,19504,0,g);i=e;return}else{Ob[b&7](d,c[f+8>>2]|0,c[f+12>>2]|0,g);i=e;return}}function Kc(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;f=c[b+40>>2]|0;do{if((f|0)!=0){if((c[f+4>>2]|0)==0){break}else{g=0}return g|0}}while(0);f=b+56|0;h=b+48|0;i=b+36|0;j=b+88|0;k=b+52|0;b=0;l=0;while(1){if((l|0)==0){m=e;n=a[e]|0}else{a[l]=b;m=l;n=b}if((n<<24>>24|0)==34){o=m;while(1){p=o+1|0;q=a[p]|0;if((q<<24>>24|0)==34|(q<<24>>24|0)==0){break}else{o=p}}r=q<<24>>24==34?o+2|0:p;s=a[r]|0;a[r]=0;t=s;u=r}else if((n<<24>>24|0)==0){break}else{r=n&255;do{if((eb(r|0)|0)==0){if((Ea(r|0)|0)!=0|n<<24>>24==95){v=2;w=13;break}x=m+1|0}else{v=1;w=13}}while(0);a:do{if((w|0)==13){w=0;r=m+1|0;o=a[r]|0;if(o<<24>>24==0){x=r;break}else{y=r;z=o}while(1){o=z&255;if((eb(o|0)|0)==0){r=(Ea(o|0)|0)!=0|z<<24>>24==95;A=r?2:3}else{A=1}r=y+1|0;if((A|0)!=(v|0)){x=y;break a}o=a[r]|0;if(o<<24>>24==0){x=r;break}else{y=r;z=o}}}}while(0);o=a[x]|0;a[x]=0;t=o;u=x}o=a[m]|0;if(o<<24>>24==0){break}r=c[f>>2]|0;b:do{if((r|0)==0){if((Za(o&255|0)|0)==0){s=c[h>>2]|0;if((s|0)==0){B=m;break}if((rb(m|0,s|0)|0)==0){B=m;break}c[f>>2]=(c[f>>2]|0)+1;B=m;break}s=c[i>>2]|0;if((s|0)==0){B=m;break}else{C=s}while(1){if((Fb(c[C+4>>2]|0,m|0)|0)==0){break}s=c[C>>2]|0;if((s|0)==0){B=m;break b}else{C=s}}s=c[C+8>>2]|0;if((s|0)==0){B=m;break}if((a[j]&1)==0){B=s;break}B=(a[s]|0)==0?m:s}else{if((rb(m|0,c[k>>2]|0)|0)!=0){c[f>>2]=r-1;B=m;break}if((rb(m|0,c[h>>2]|0)|0)==0){B=m;break}c[f>>2]=r+1;B=m}}while(0);qc(d,B)|0;b=t;l=u}u=nc(d)|0;oc(d,0)|0;g=u;return g|0}function Lc(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;f=i;g=Uf(1,24)|0;h=g;if((g|0)==0){Jc(b,6168,(j=i,i=i+1|0,i=i+7&-8,c[j>>2]=0,j)|0);i=j;i=f;return}j=b+40|0;k=c[j>>2]|0;c[g>>2]=k;l=b|0;m=c[l>>2]|0;if((m|0)==0){n=k}else{c[g+8>>2]=cb(c[m+8>>2]|0)|0;c[g+12>>2]=c[(c[l>>2]|0)+12>>2];n=c[j>>2]|0}do{if((n|0)!=0){if((c[n+4>>2]|0)==0){break}c[g+4>>2]=1;c[g+16>>2]=1;c[j>>2]=h;i=f;return}}while(0);n=g+4|0;c[n>>2]=0;l=g+16|0;c[l>>2]=0;c[j>>2]=h;h=d+4|0;j=c[h>>2]|0;if((j|0)==0){o=d|0}else{a[j]=c[d+8>>2];o=h}j=c[o>>2]|0;o=a[j]|0;a:do{if(o<<24>>24==0){p=j}else{g=j;m=o;while(1){k=g+1|0;if((eb(m<<24>>24|0)|0)==0){p=g;break a}q=a[k]|0;if(q<<24>>24==0){p=k;break}else{g=k;m=q}}}}while(0);c[d>>2]=p;c[h>>2]=0;o=a[p]|0;if((o<<24>>24|0)==34){j=p;while(1){r=j+1|0;s=a[r]|0;if((s<<24>>24|0)==34|(s<<24>>24|0)==0){break}else{j=r}}m=s<<24>>24==34?j+2|0:r;c[h>>2]=m;c[d+8>>2]=a[m]|0;a[m]=0}else if((o<<24>>24|0)!=0){m=o&255;do{if((eb(m|0)|0)==0){if((Ea(m|0)|0)!=0|o<<24>>24==95){t=2;u=20;break}v=p+1|0}else{t=1;u=20}}while(0);b:do{if((u|0)==20){o=p+1|0;m=a[o]|0;if(m<<24>>24==0){v=o;break}else{w=o;x=m}while(1){m=x&255;if((eb(m|0)|0)==0){o=(Ea(m|0)|0)!=0|x<<24>>24==95;y=o?2:3}else{y=1}o=w+1|0;if((y|0)!=(t|0)){v=w;break b}m=a[o]|0;if(m<<24>>24==0){v=o;break}else{w=o;x=m}}}}while(0);c[h>>2]=v;c[d+8>>2]=a[v]|0;a[v]=0}v=c[b+36>>2]|0;c:do{if((v|0)==0){z=0}else{b=v;while(1){if((Fb(c[b+4>>2]|0,p|0)|0)==0){break}d=c[b>>2]|0;if((d|0)==0){z=0;break c}else{b=d}}z=(c[b+8>>2]|0)!=0|0}}while(0);if((z|0)==(e|0)){c[n>>2]=1;i=f;return}else{c[n>>2]=0;c[l>>2]=1;i=f;return}}function Mc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=i;i=i+1040|0;f=e|0;g=a+76|0;c[g>>2]=(c[g>>2]|0)+1;g=f;c[g>>2]=d;c[g+4>>2]=0;g=e+16|0;xa(g|0,1024,b|0,f|0)|0;f=c[a>>2]|0;b=c[a+64>>2]|0;d=c[a+72>>2]|0;if((f|0)==0){Ob[b&7](d,19504,0,g);i=e;return}else{Ob[b&7](d,c[f+8>>2]|0,c[f+12>>2]|0,g);i=e;return}}function Nc(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;f=i;i=i+16|0;g=f|0;h=c[b+40>>2]|0;do{if((h|0)!=0){if((c[h+4>>2]|0)==0){break}i=f;return}}while(0);h=d+4|0;j=c[h>>2]|0;if((j|0)==0){k=d|0}else{a[j]=c[d+8>>2];k=h}j=c[k>>2]|0;k=a[j]|0;a:do{if(k<<24>>24==0){l=j}else{m=j;n=k;while(1){o=m+1|0;if((eb(n<<24>>24|0)|0)==0){l=m;break a}p=a[o]|0;if(p<<24>>24==0){l=o;break}else{m=o;n=p}}}}while(0);k=d|0;c[k>>2]=l;c[h>>2]=0;j=a[l]|0;if((j<<24>>24|0)==34){n=l;while(1){q=n+1|0;r=a[q]|0;if((r<<24>>24|0)==34|(r<<24>>24|0)==0){break}else{n=q}}m=r<<24>>24==34?n+2|0:q;c[h>>2]=m;c[d+8>>2]=a[m]|0;a[m]=0}else if((j<<24>>24|0)!=0){m=j&255;do{if((eb(m|0)|0)==0){if((Ea(m|0)|0)!=0|j<<24>>24==95){s=2;t=15;break}u=l+1|0}else{s=1;t=15}}while(0);b:do{if((t|0)==15){j=l+1|0;m=a[j]|0;if(m<<24>>24==0){u=j;break}else{v=j;w=m}while(1){m=w&255;if((eb(m|0)|0)==0){j=(Ea(m|0)|0)!=0|w<<24>>24==95;x=j?2:3}else{x=1}j=v+1|0;if((x|0)!=(s|0)){u=v;break b}m=a[j]|0;if(m<<24>>24==0){u=j;break}else{v=j;w=m}}}}while(0);c[h>>2]=u;c[d+8>>2]=a[u]|0;a[u]=0}u=a[l]|0;w=u<<24>>24;do{if((eb(w|0)|0)==0){if(!((Ea(w|0)|0)!=0|u<<24>>24==95)){break}v=b+36|0;s=c[v>>2]|0;c:do{if((s|0)==0){t=27}else{x=s;while(1){if((Fb(c[x+4>>2]|0,l|0)|0)==0){break}m=c[x>>2]|0;if((m|0)==0){t=27;break c}else{x=m}}m=(e|0)!=0;if((c[x+8>>2]|0)!=0&m){Mc(b,7384,(y=i,i=i+8|0,c[y>>2]=l,y)|0);i=y;z=cb(l|0)|0;t=31;break}else{j=cb(l|0)|0;if(m){z=j;t=31;break}else{A=0;B=j;break}}}}while(0);if((t|0)==27){s=cb(l|0)|0;if((e|0)==0){A=0;B=s}else{z=s;t=31}}if((t|0)==31){s=c[h>>2]|0;if((s|0)==0){C=k}else{a[s]=c[d+8>>2];C=h}s=c[C>>2]|0;j=a[s]|0;d:do{if(j<<24>>24==0){D=s}else{m=s;q=j;while(1){n=m+1|0;if((eb(q<<24>>24|0)|0)==0){D=m;break d}r=a[n]|0;if(r<<24>>24==0){D=n;break}else{m=n;q=r}}}}while(0);c[k>>2]=D;c[h>>2]=0;j=D;while(1){E=a[j]|0;F=E<<24>>24==0;if(E<<24>>24!=10&(F^1)){j=j+1|0}else{break}}if(F){G=0}else{c[d+8>>2]=E<<24>>24;a[j]=0;G=j}c[h>>2]=G;c[k>>2]=D;mc(g,80);Kc(b,g,D)|0;A=rc(g)|0;B=z}s=Uf(16,1)|0;c[s+4>>2]=B;c[s+8>>2]=A;c[s+12>>2]=1;c[s>>2]=c[v>>2];c[v>>2]=s;i=f;return}}while(0);Jc(b,7536,(y=i,i=i+8|0,c[y>>2]=l,y)|0);i=y;i=f;return}function Oc(b,e){b=b|0;e=e|0;var f=0,g=0,h=0;f=a[b]|0;g=f&255;if(f<<24>>24>-1){c[e>>2]=1;h=g;return h|0}if((f&-32)<<24>>24==-64){c[e>>2]=2;h=a[b+1|0]&63|g<<6&1984;return h|0}if((f&-16)<<24>>24==-32){c[e>>2]=3;h=(d[b+1|0]|0)<<6&4032|g<<12&61440|a[b+2|0]&63;return h|0}if((f&-8)<<24>>24==-16){c[e>>2]=4;h=(d[b+1|0]|0)<<12&258048|g<<18&1835008|(d[b+2|0]|0)<<6&4032|a[b+3|0]&63;return h|0}if((f&-4)<<24>>24==-8){c[e>>2]=5;h=(d[b+1|0]|0)<<18&16515072|g<<24&50331648|(d[b+2|0]|0)<<12&258048|(d[b+3|0]|0)<<6&4032|a[b+4|0]&63;return h|0}if((f&-2)<<24>>24!=-4){h=g;return h|0}c[e>>2]=6;h=(d[b+1|0]|0)<<24&1056964608|g<<30&1073741824|(d[b+2|0]|0)<<18&16515072|(d[b+3|0]|0)<<12&258048|(d[b+4|0]|0)<<6&4032|a[b+5|0]&63;return h|0}function Pc(d,e,f,g){d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;h=i;i=i+8|0;j=h|0;a:do{if(g){k=1}else{l=b[d>>1]|0;m=l&255;if((l<<16>>16|0)==(-257|0)){k=0;break}else if((l<<16>>16|0)==(-2|0)){n=0;i=h;return n|0}do{if((e|0)>2){l=a[d+1|0]|0;if(l<<24>>24==0){k=0;break a}if(!(m<<24>>24==-17&l<<24>>24==-69)){break}if((a[d+2|0]|0)==-65){k=1;break a}}}while(0);b:do{if((e|0)>0){l=0;o=0;p=m;while(1){do{if(p<<24>>24==10){if((l|0)!=0){if((a[d+(l-1)|0]|0)==13){q=o;break}}a[f+o|0]=13;q=o+1|0}else{a[f+o|0]=p;q=o+1|0}}while(0);r=l+1|0;if((r|0)>=(e|0)){s=q;break b}l=r;o=q;p=a[d+r|0]|0}}else{s=0}}while(0);a[f+s|0]=0;n=1;i=h;return n|0}}while(0);if((e|0)>0){if(k){k=0;s=0;q=0;while(1){c[j>>2]=2;g=Oc(d+k|0,j)|0;m=g&65535;do{if((m<<16>>16|0)==10){if((k|0)!=0&q<<16>>16==13){t=s;break}a[f+s|0]=13;t=s+1|0}else if((m<<16>>16|0)==(-257|0)){t=s}else{a[f+s|0]=a[14296+(g>>>5&256&(g>>>4&4095^256)|g&2047)|0]|0;t=s+1|0}}while(0);g=(c[j>>2]|0)+k|0;if((g|0)<(e|0)){k=g;s=t;q=m}else{u=t;break}}}else{t=0;q=0;s=0;while(1){c[j>>2]=2;k=b[d+t>>1]|0;g=k&65535;do{if((k<<16>>16|0)==10){if((t|0)!=0&s<<16>>16==13){v=q;break}a[f+q|0]=13;v=q+1|0}else if((k<<16>>16|0)==(-257|0)){v=q}else{a[f+q|0]=a[14296+(g>>>5&256&(g>>>4^256)|g&2047)|0]|0;v=q+1|0}}while(0);g=t+2|0;if((g|0)<(e|0)){t=g;q=v;s=k}else{u=v;break}}}}else{u=0}a[f+u|0]=0;n=1;i=h;return n|0}function Qc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;e=c[a>>2]|0;f=c[((e|0)==0?19440:e|0)>>2]|0;c[a>>2]=f;if((f|0)==0){g=0;i=d;return g|0}$a(2178720,3336,(a=i,i=i+24|0,c[a>>2]=f+4,c[a+8>>2]=47,c[a+16>>2]=b,a)|0)|0;i=a;g=2178720;i=d;return g|0}function Rc(a){a=a|0;var b=0;b=Xf((ng(a|0)|0)+8|0)|0;mg(b+4|0,a|0)|0;c[c[3572]>>2]=b;a=b;c[3572]=a;c[a>>2]=0;return 1}function Sc(b){b=b|0;var d=0,e=0,f=0;d=bb(b|0,47)|0;if((d|0)==0){e=0;return e|0}f=d-b|0;d=Xf(f+8|0)|0;og(d+4|0,b|0,f|0)|0;a[d+(f+4)|0]=0;c[c[3572]>>2]=d;f=d;c[3572]=f;c[f>>2]=0;e=1;return e|0}function Tc(){var b=0,d=0;b=c[4860]|0;if((b|0)!=0){d=b;while(1){b=c[d>>2]|0;Zf(d);if((b|0)==0){break}else{d=b}}}c[4860]=0;a[2178720]=0;return}function Uc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=c[4088]|0;e=d;while(1){f=e-1|0;if((e|0)<=0){break}if((tg(c[16360+(f*12|0)>>2]|0,a|0)|0)==0){g=4;break}else{e=f}}do{if((g|0)==4){if((e|0)==0){break}else{h=1}return h|0}}while(0);if((d|0)>=256){h=0;return h|0}e=(ng(a|0)|0)+1|0;g=Xf((e|0)>-1?e:-1)|0;c[16360+(d*12|0)>>2]=g;mg(g|0,a|0)|0;a=b+52|0;g=c[4088]|0;c[16368+(g*12|0)>>2]=c[a>>2];d=c[a>>2]|0;e=Xf((d|0)>-1?d:-1)|0;c[16364+(g*12|0)>>2]=e;pg(e|0,c[b+48>>2]|0,c[a>>2]|0)|0;c[4088]=g+1;h=1;return h|0}function Vc(){var a=0,b=0,d=0;if((c[4088]|0)>0){a=0}else{c[4088]=0;return}do{b=16360+(a*12|0)|0;d=c[b>>2]|0;if((d|0)!=0){Zf(d)}c[b>>2]=0;b=16364+(a*12|0)|0;d=c[b>>2]|0;if((d|0)!=0){Zf(d)}c[b>>2]=0;c[16368+(a*12|0)>>2]=0;a=a+1|0;}while((a|0)<(c[4088]|0));c[4088]=0;return}function Wc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;d=a+60|0;if((c[d>>2]|0)>0){e=0;f=0}else{g=1;return g|0}while(1){h=b+(f<<8)|0;i=c[4088]|0;while(1){j=i-1|0;if((i|0)<=0){k=-1;break}if((tg(c[16360+(j*12|0)>>2]|0,h|0)|0)==0){k=j;break}else{i=j}}i=16368+(k*12|0)|0;h=c[i>>2]|0;if((h+e|0)>65536){g=0;l=7;break}pg(a+8768+e|0,c[16364+(k*12|0)>>2]|0,h)|0;c[a+8512+(f<<2)>>2]=e;c[a+8640+(f<<2)>>2]=c[i>>2];h=f+1|0;if((h|0)<(c[d>>2]|0)){e=(c[i>>2]|0)+e|0;f=h}else{g=1;l=7;break}}if((l|0)==7){return g|0}return 0}function Xc(){var b=0,d=0,e=0;b=Wf(276600)|0;c[4874]=b;qg(b|0,0,276600)|0;b=Wf(12)|0;he(b);c[4870]=b;d=Wf(324)|0;e=c[4874]|0;c[d>>2]=e;c[d+4>>2]=b;c[d+8>>2]=0;a[d+12|0]=0;a[d+41|0]=0;qg(d+44|0,0,17)|0;c[4872]=d;return e|0}function Yc(){var a=0;a=c[4872]|0;if((a|0)!=0){Yf(a)}c[4872]=0;a=c[4870]|0;if((a|0)!=0){ie(a);Yf(a)}c[4870]=0;a=c[4874]|0;if((a|0)==0){c[4874]=0;return}Yf(a|0);c[4874]=0;return}function Zc(){var b=0,d=0,e=0,f=0,g=0;b=i;i=i+8|0;d=b|0;zd(c[4872]|0);le(c[4870]|0,0);c[(c[4874]|0)+206100>>2]=0;c[(c[4874]|0)+32>>2]=0;c[(c[4874]|0)+44>>2]=0;a[(c[4874]|0)+206363|0]=0;c[(c[4874]|0)+165836>>2]=0;e=c[4874]|0;c[e+52>>2]=(c[e+8>>2]|0)==0?4:0;e=c[4874]|0;pe(c[e+24>>2]|0,c[e+28>>2]|0);if(!(_c()|0)){f=c[(c[4874]|0)+4>>2]|0;i=b;return f|0}if(!($c(0)|0)){f=c[(c[4874]|0)+4>>2]|0;i=b;return f|0}a[d]=0;a:do{if(kd(4,d)|0){do{if((a[d]&1)==0){e=c[4874]|0;if((c[e+8>>2]|0)!=0){break}a[e|0]=1;c[(c[4874]|0)+4>>2]=c[103];e=c[4874]|0;c[e+16>>2]=c[e+20>>2];break a}}while(0);if(!(kd(5,d)|0)){break}if(!(ad()|0)){f=c[(c[4874]|0)+4>>2]|0;i=b;return f|0}e=bd()|0;g=c[4874]|0;if(e){c[g+16>>2]=0;c[(c[4874]|0)+20>>2]=0;f=0;i=b;return f|0}else{f=c[g+4>>2]|0;i=b;return f|0}}}while(0);f=c[(c[4874]|0)+4>>2]|0;i=b;return f|0}function _c(){var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;b=i;i=i+16|0;d=b|0;e=b+8|0;c[(c[4874]|0)+148932>>2]=0;c[(c[4874]|0)+157384>>2]=0;c[d>>2]=0;a[e]=0;zd(c[4872]|0);a:while(1){if(!(Ed(c[4872]|0,6,e)|0)){f=0;g=14;break}h=a[e]|0;b:do{if((h&1)==0){while(1){if(!(Ad(c[4872]|0,e)|0)){f=0;g=14;break a}j=c[4872]|0;k=c[j+20>>2]|0;if((k|0)==30){l=c[4874]|0;if(!(Le(l+148932|0,d,l+148936|0,l+157128|0,l+157256|0,75)|0)){f=0;g=14;break a}if(!(Bd(c[4872]|0,84)|0)){f=0;g=14;break a}}else if((k|0)==31){l=c[4874]|0;if(!(Le(l+157384|0,d,l+157388|0,l+165580|0,l+165708|0,76)|0)){f=0;g=14;break a}if(!(Bd(c[4872]|0,84)|0)){f=0;g=14;break a}}else if((k|0)==28){break}else if((k|0)!=84){g=11;break a}k=a[e]|0;if((k&1)!=0){m=k;break b}}Dd(j);m=a[e]|0}else{m=h}}while(0);if((m&1)!=0){f=1;g=14;break}}if((g|0)==11){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[66];f=0;i=b;return f|0}else if((g|0)==14){i=b;return f|0}return 0}function $c(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+16|0;e=d|0;f=d+8|0;a[e]=0;zd(c[4872]|0);g=(b|0)==0;h=(b|0)==1;j=0;a:while(1){c[(c[4874]|0)+206660>>2]=1;c[(c[4874]|0)+206664>>2]=0;b:do{if((j&1)==0){c:while(1){if(!(Ad(c[4872]|0,e)|0)){k=0;l=34;break a}d:do{if((c[(c[4872]|0)+20>>2]|0)!=84){if(g){while(1){if((a[e]&1)!=0){break d}c[(c[4874]|0)+206668>>2]=1;m=c[4872]|0;e:do{switch(c[m+20>>2]|0){case 0:{if(!(Pe(0)|0)){k=0;l=34;break a}break};case 28:{n=m;break c;break};case 7:{if(!(Od(h,1,0)|0)){k=0;l=34;break a}o=c[4874]|0;p=o+206660|0;if((a[o+206693|0]&1)==0){c[p>>2]=1;o=Nd()|0;c[(c[4874]|0)+206664>>2]=o;break e}else{c[p>>2]=0;break e}break};case 67:case 68:{l=19;break a;break};default:{l=26;break a}}}while(0);a[f]=0;if(!(De(f)|0)){k=0;l=34;break a}if((a[f]&1)==0){break d}if(!(Ad(c[4872]|0,e)|0)){k=0;l=34;break a}}}while(1){if((a[e]&1)!=0){break d}c[(c[4874]|0)+206668>>2]=1;m=c[4872]|0;f:do{switch(c[m+20>>2]|0){case 28:{n=m;break c;break};case 67:case 68:{c[(c[4874]|0)+206668>>2]=0;c[(c[4874]|0)+206672>>2]=c[(c[4872]|0)+20>>2];c[(c[4874]|0)+206676>>2]=c[(c[4872]|0)+24>>2];if(!(Pe(b)|0)){k=0;l=34;break a}break};case 0:{if(!(Pe(b)|0)){k=0;l=34;break a}break};case 7:{if(!(Od(h,1,0)|0)){k=0;l=34;break a}p=c[4874]|0;o=p+206660|0;if((a[p+206693|0]&1)==0){c[o>>2]=1;p=Nd()|0;c[(c[4874]|0)+206664>>2]=p;break f}else{c[o>>2]=0;break f}break};default:{l=26;break a}}}while(0);a[f]=0;if(!(De(f)|0)){k=0;l=34;break a}if((a[f]&1)==0){break d}if(!(Ad(c[4872]|0,e)|0)){k=0;l=34;break a}}}}while(0);m=a[e]|0;if((m&1)!=0){q=m;break b}}Dd(n);m=a[e]|0;if((m&1)!=0){q=m;break}if(!(Ed(c[4872]|0,0,e)|0)){k=0;l=34;break a}q=a[e]|0}else{q=j}}while(0);if((q&1)==0){j=q}else{k=1;l=34;break}}if((l|0)==19){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[47];k=0;i=d;return k|0}else if((l|0)==26){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[47];k=0;i=d;return k|0}else if((l|0)==34){i=d;return k|0}return 0}function ad(){var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;b=i;i=i+16|0;d=b|0;e=b+8|0;f=c[4874]|0;c[f+197896>>2]=c[f+52>>2];c[(c[4874]|0)+197900>>2]=0;c[(c[4874]|0)+60>>2]=0;a[d]=0;zd(c[4872]|0);a:while(1){b:do{if(Ed(c[4872]|0,3,d)|0){if((a[d]&1)!=0){break}while(1){if(!(Ad(c[4872]|0,d)|0)){g=0;h=24;break a}j=c[4872]|0;f=c[j+20>>2]|0;if((f|0)==0){Md(j);if(Cd(c[4872]|0,3)|0){if(!(Od(1,1,0)|0)){g=0;h=24;break a}k=Nd()|0;if((k-1|0)>>>0>254>>>0){h=9;break a}if(Bd(c[4872]|0,4)|0){l=k}else{g=0;h=24;break a}}else{l=1}if(!(Bd(c[4872]|0,8)|0)){g=0;h=24;break a}c[e>>2]=0;k=c[4874]|0;if(!(Le(k+60|0,e,k+64|0,k+8256|0,k+8384|0,73)|0)){g=0;h=24;break a}k=c[e>>2]|0;m=c[4874]|0;if((k|0)==((c[m+60>>2]|0)-1|0)){c[m+74304+(k<<2)>>2]=0;n=c[e>>2]|0;o=c[4874]|0}else{n=k;o=m}ke(c[4870]|0,o+206104|0,79,(c[o+52>>2]|0)>>>2&255|n<<8,0,0);if((l|0)>0){m=0;do{p=c[4874]|0;if((c[p+52>>2]|0)>=1024){h=18;break a}Je(c[e>>2]|0)|0;k=(c[4874]|0)+197900|0;c[k>>2]=(c[k>>2]|0)+1;m=m+1|0;}while((m|0)<(l|0))}m=(c[4874]|0)+74304+(c[e>>2]<<2)|0;c[m>>2]=(c[m>>2]|0)+l;if(!(Bd(c[4872]|0,84)|0)){g=0;h=24;break a}}else if((f|0)==28){break}else if((f|0)!=84){h=23;break a}if((a[d]&1)!=0){break b}}Dd(j)}}while(0);if((a[d]&1)!=0){g=1;h=24;break}}if((h|0)==9){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[104];g=0;i=b;return g|0}else if((h|0)==18){a[p|0]=1;c[(c[4874]|0)+4>>2]=c[100];g=0;i=b;return g|0}else if((h|0)==23){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[45];g=0;i=b;return g|0}else if((h|0)==24){i=b;return g|0}return 0}function bd(){var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;b=i;i=i+16|0;d=b|0;e=b+8|0;c[(c[4874]|0)+74688>>2]=0;c[d>>2]=0;a[e]=0;zd(c[4872]|0);a:while(1){if(!(Ed(c[4872]|0,2,e)|0)){f=0;g=11;break}h=a[e]|0;b:do{if((h&1)==0){while(1){if(!(Ad(c[4872]|0,e)|0)){f=0;g=11;break a}j=c[4872]|0;k=c[j+20>>2]|0;if((k|0)==32){l=c[4874]|0;if(!(Le(l+74688|0,d,l+74692|0,l+82884|0,l+83012|0,74)|0)){f=0;g=11;break a}if(!(Bd(c[4872]|0,84)|0)){f=0;g=11;break a}}else if((k|0)==28){break}k=a[e]|0;if((k&1)!=0){m=k;break b}}Dd(j);m=a[e]|0}else{m=h}}while(0);if((m&1)!=0){f=1;g=11;break}}if((g|0)==11){i=b;return f|0}return 0}function cd(){var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;b=i;i=i+16|0;d=b|0;e=b+8|0;if(!(dd()|0)){f=c[(c[4874]|0)+4>>2]|0;i=b;return f|0}if(!($c(1)|0)){f=c[(c[4874]|0)+4>>2]|0;i=b;return f|0}if(!(ed()|0)){f=c[(c[4874]|0)+4>>2]|0;i=b;return f|0}g=ud()|0;h=c[4874]|0;if(!g){f=c[h+4>>2]|0;i=b;return f|0}do{if((a[h+197864|0]&1)==0){c[e>>2]=0;if(ld(4,e)|0){if(ld(5,e)|0){break}}f=c[(c[4874]|0)+4>>2]|0;i=b;return f|0}}while(0);e=fd()|0;h=c[4874]|0;if(!e){f=c[h+4>>2]|0;i=b;return f|0}do{if((a[h+197864|0]&1)==0){if((c[h+8>>2]|0)!=0){break}if((c[h+52>>2]|0)>=61441){break}if(yd()|0){break}f=c[(c[4874]|0)+4>>2]|0;i=b;return f|0}}while(0);h=gd()|0;e=c[4874]|0;if(!h){f=c[e+4>>2]|0;i=b;return f|0}a:do{if((a[e+197864|0]&1)==0){a[d]=0;zd(c[4872]|0);if(!(Ed(c[4872]|0,0,d)|0)){f=c[(c[4874]|0)+4>>2]|0;i=b;return f|0}if((a[d]&1)==0){h=c[4874]|0;c[h+20>>2]=c[h+16>>2]}h=Ld(c[4872]|0,5880)|0;g=c[4872]|0;do{if(h){j=c[g+20>>2]|0;if((j|0)==67){k=c[g+24>>2]|0;l=31;break}else if((j|0)==0){k=16;l=31;break}else{a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[126];break}}else{k=16;l=31}}while(0);b:do{if((l|0)==31){do{if(Ld(g,5176)|0){h=c[4872]|0;j=c[h+20>>2]|0;if((j|0)==0){m=k;break}else if((j|0)==67){m=(c[h+24>>2]|0)+k|0;break}else{a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[126];break b}}else{m=k}}while(0);h=c[4874]|0;if((m|0)>8192){a[h|0]=1;c[(c[4874]|0)+4>>2]=c[116];break}c[h+197848>>2]=m;if(!(hd()|0)){f=c[(c[4874]|0)+4>>2]|0;i=b;return f|0}do{if(Ld(c[4872]|0,1808)|0){h=c[4872]|0;j=c[h+20>>2]|0;if((j|0)==67){c[(c[4874]|0)+197860>>2]=c[h+24>>2];break}else if((j|0)==0){break}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[119];f=c[(c[4874]|0)+4>>2]|0;i=b;return f|0}}while(0);j=ue()|0;h=c[4874]|0;if(!j){f=c[h+4>>2]|0;i=b;return f|0}c[h+32>>2]=c[h+206368>>2];h=c[4874]|0;j=c[h+40>>2]|0;if((j|0)<=0){c[h+44>>2]=0;break a}pe(c[h+36>>2]|0,j);j=id()|0;h=c[4874]|0;if(j){c[h+44>>2]=c[h+206368>>2];break a}f=c[h+4>>2]|0;i=b;return f|0}}while(0);f=c[(c[4874]|0)+4>>2]|0;i=b;return f|0}}while(0);c[(c[4874]|0)+16>>2]=0;c[(c[4874]|0)+20>>2]=0;f=0;i=b;return f|0}function dd(){var b=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;b=c[4874]|0;if((c[b+60>>2]|0)>0){e=0;f=b}else{g=1;return g|0}a:while(1){b=c[f+8512+(e<<2)>>2]|0;h=f+8768+b|0;i=c[f+8640+(e<<2)>>2]|0;if((i|0)>0){j=0;k=0;while(1){l=j+1|0;m=(d[j+b+(f+8768)|0]|0)+k&255;if((l|0)<(i|0)){j=l;k=m}else{break}}n=(m|0)==48}else{n=0}k=i+b+(f+8768)|0;if(!(((a[f+197864|0]&1)!=0|n)&(a[h]&3)==0)){o=7;break}j=(d[b+2+(f+8768)|0]|0|(d[b+3+(f+8768)|0]|0)<<8)<<16>>16;if((j&3|0)!=0){o=7;break}l=e+1|0;p=l&255;q=1;r=b+5+j+(f+8768)|0;while(1){if(r>>>0>=k>>>0){break}j=r;s=0;t=a[r]|0;while(1){if(!(we(t)|0)){o=13;break a}a[(c[4874]|0)+206104+s|0]=a[j]|0;u=j+1|0;v=a[u]|0;w=s+1|0;if((v&255)>>>0<18>>>0){o=15;break}if((w|0)<257){j=u;s=w;t=v}else{x=q;y=u;break}}do{if((o|0)==15){o=0;a[(c[4874]|0)+206104+w|0]=p;a[s+2+((c[4874]|0)+206104)|0]=0;t=a[u]|0;if((t&255)>>>0<16>>>0){ke(c[4870]|0,(c[4874]|0)+206104|0,80,(t&255)<<8|q,0,0);x=q+1|0;y=j+2|0;break}else{ke(c[4870]|0,(c[4874]|0)+206104|0,t<<24>>24==16?81:82,(d[j+3|0]|0)<<8|(d[j+2|0]|0)|(d[j+4|0]|0)<<16|(d[j+5|0]|0)<<24,0,0);x=q;y=j+6|0;break}}}while(0);if(y>>>0>k>>>0){o=19;break a}else{q=x;r=y}}r=c[4874]|0;if((l|0)<(c[r+60>>2]|0)){e=l;f=r}else{g=1;o=21;break}}if((o|0)==7){c[f+206368>>2]=0;re(2544)|0;re((c[4874]|0)+64+e|0)|0;re(7496)|0;qe(0)|0;f=c[4874]|0;c[f+4>>2]=c[f+24>>2];g=0;return g|0}else if((o|0)==13){c[(c[4874]|0)+206368>>2]=0;re(2544)|0;re((c[4874]|0)+64+e|0)|0;re(7496)|0;qe(0)|0;f=c[4874]|0;c[f+4>>2]=c[f+24>>2];g=0;return g|0}else if((o|0)==19){c[(c[4874]|0)+206368>>2]=0;re(2544)|0;re((c[4874]|0)+64+e|0)|0;re(7496)|0;qe(0)|0;e=c[4874]|0;c[e+4>>2]=c[e+24>>2];g=0;return g|0}else if((o|0)==21){return g|0}return 0}function ed(){var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;b=i;i=i+16|0;d=b|0;e=b+8|0;c[(c[4874]|0)+197880>>2]=0;c[(c[4874]|0)+197884>>2]=0;c[(c[4874]|0)+197888>>2]=0;a[d]=0;zd(c[4872]|0);a:while(1){if(!(Ed(c[4872]|0,1,d)|0)){f=0;g=28;break}h=a[d]|0;b:do{if((h&1)==0){c:while(1){if(!(Ad(c[4872]|0,d)|0)){f=0;g=28;break a}j=c[4872]|0;k=c[j+20>>2]|0;d:do{if((k|0)==29){l=c[j+24>>2]|0;m=(l|0)==0;n=(l|0)==1?70:71;do{if((a[d]&1)!=0){break d}if(!(Ad(c[4872]|0,d)|0)){f=0;g=28;break a}o=c[4872]|0;if((c[o+20>>2]|0)!=0){g=11;break a}Md(o);if(Cd(c[4872]|0,3)|0){if(!(Od(1,1,0)|0)){f=0;g=28;break a}o=Nd()|0;if((o|0)>32768){g=15;break a}if(Bd(c[4872]|0,4)|0){p=o}else{f=0;g=28;break a}}else{p=1}if((l|0)==2){o=(c[4874]|0)+197888|0;q=c[o>>2]|0;c[o>>2]=q+(p<<2);r=q}else if((l|0)==0){q=(c[4874]|0)+197880|0;o=c[q>>2]|0;c[q>>2]=o+p;r=o}else if((l|0)==1){o=(c[4874]|0)+197884|0;q=c[o>>2]|0;c[o>>2]=q+(p<<1);r=q}else{r=0}if((r+(p<<l)|0)>32768){g=22;break a}ke(c[4870]|0,(c[4874]|0)+206104|0,m?69:n,r,0,0);a[e]=0;if(!(De(e)|0)){f=0;g=28;break a}}while((a[e]&1)!=0)}else if((k|0)==28){break c}else if((k|0)!=84){g=25;break a}}while(0);k=a[d]|0;if((k&1)!=0){s=k;break b}}Dd(j);s=a[d]|0}else{s=h}}while(0);if((s&1)!=0){f=1;g=28;break}}if((g|0)==11){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[52];f=0;i=b;return f|0}else if((g|0)==15){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[131];f=0;i=b;return f|0}else if((g|0)==22){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[131];f=0;i=b;return f|0}else if((g|0)==25){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[53];f=0;i=b;return f|0}else if((g|0)==28){i=b;return f|0}return 0}function fd(){var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;e=i;i=i+256|0;f=e|0;g=e+128|0;h=c[4874]|0;c[h+197892>>2]=(c[h+197884>>2]|0)+(c[h+197880>>2]|0)+(c[h+197888>>2]|0);h=c[4874]|0;j=h+197892|0;k=c[j>>2]|0;if((k&3|0)==0){l=h;m=k}else{c[j>>2]=(k|3)+1;k=c[4874]|0;l=k;m=c[k+197892>>2]|0}if((m|0)>32768){a[l|0]=1;c[(c[4874]|0)+4>>2]=c[131];n=0;i=e;return n|0}a:do{if((a[l+197864|0]&1)==0){m=l;while(1){if((c[m+52>>2]&3|0)==0){o=m;break a}if(!(Ie(0)|0)){n=0;break}m=c[4874]|0}i=e;return n|0}else{o=l}}while(0);if((c[o+8>>2]|0)==0){b[c[o+48>>2]>>1]=c[o+52>>2];l=c[4874]|0;a[(c[l+48>>2]|0)+2|0]=(c[l+197896>>2]|0)>>>2;l=c[4874]|0;a[(c[l+48>>2]|0)+3|0]=c[l+197900>>2];p=c[4874]|0}else{p=o}b:do{if((c[p+60>>2]|0)>0){o=0;l=p;c:while(1){c[f+(o<<2)>>2]=c[l+52>>2];m=c[l+8512+(o<<2)>>2]|0;c[g+(o<<2)>>2]=(d[m+1+(l+8768)|0]|0)<<8|(d[l+8768+m|0]|0);k=(d[m+3+(l+8768)|0]|0)<<8|(d[m+2+(l+8768)|0]|0);j=m+4|0;if(k<<16>>16==0){q=l}else{m=0;while(1){h=m+1&65535;if(!(Ie(a[j+(m&65535)+(l+8768)|0]|0)|0)){n=0;break c}if((h&65535)>>>0<(k&65535)>>>0){m=h}else{break}}q=c[4874]|0}m=o+1|0;if((m|0)<(c[q+60>>2]|0)){o=m;l=q}else{r=q;break b}}i=e;return n|0}else{r=p}}while(0);if((c[r+197900>>2]|0)<=0){n=1;i=e;return n|0}p=(c[r+48>>2]|0)+(c[r+197896>>2]|0)|0;r=0;while(1){q=c[p>>2]|0;b[p>>1]=c[f+(q<<2)>>2];b[p+2>>1]=c[(c[4874]|0)+197892>>2];l=(c[4874]|0)+197892|0;c[l>>2]=(c[l>>2]|0)+(c[g+(q<<2)>>2]|0);s=c[4874]|0;if((c[s+197892>>2]|0)>32768){break}q=r+1|0;if((q|0)<(c[s+197900>>2]|0)){p=p+4|0;r=q}else{n=1;t=22;break}}if((t|0)==22){i=e;return n|0}a[s|0]=1;c[(c[4874]|0)+4>>2]=c[131];n=0;i=e;return n|0}function gd(){var b=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;b=c[4874]|0;if((c[b+8>>2]|0)!=0){e=1;return e|0}f=c[b+197892>>2]|0;g=c[b+52>>2]|0;b=g<<16|f;if(!(Ie(0)|0)){e=0;return e|0}h=c[4874]|0;a:do{if((c[h+206100>>2]|0)>0){i=0;j=h;while(1){k=i+1|0;if(!(Ie(a[j+197908+i|0]|0)|0)){e=0;break}l=c[4874]|0;if((k|0)<(c[l+206100>>2]|0)){i=k;j=l}else{break a}}return e|0}}while(0);if(!(Je(0)|0)){e=0;return e|0}h=c[4874]|0;j=c[h+48>>2]|0;ug(j+4|0,j|0,(c[h+56>>2]|0)-4|0)|0;c[c[(c[4874]|0)+48>>2]>>2]=b;c[(c[4874]|0)+197872>>2]=f;c[(c[4874]|0)+197876>>2]=g;f=c[4874]|0;b=c[f+52>>2]|0;h=c[f+48>>2]|0;if((b|0)>0){f=0;j=0;while(1){i=j+1|0;l=(d[h+j|0]|0)+f&255;if((i|0)<(b|0)){f=l;j=i}else{m=l;break}}}else{m=0}a[h+(g+4)|0]=48-m;e=1;return e|0}function hd(){var b=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;a[(c[4874]|0)+197852|0]=0;c[(c[4874]|0)+197856>>2]=12e6;b=Ld(c[4872]|0,3472)|0;e=c[4872]|0;do{if(b){f=c[e+20>>2]|0;if((f|0)==67){g=c[e+24>>2]|0;h=0;break}else if((f|0)==0){g=0;h=1;break}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[117];i=0;return i|0}else{g=0;h=1}}while(0);b=Ld(e,3008)|0;e=c[4872]|0;do{if(b){f=c[e+20>>2]|0;if((f|0)==0){j=0;k=1;break}else if((f|0)==67){j=c[e+24>>2]|0;k=0;break}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[117];i=0;return i|0}else{j=0;k=1}}while(0);do{if(Ld(e,2440)|0){b=c[4872]|0;f=c[b+20>>2]|0;if((f|0)==67){l=c[b+24>>2]|0;m=0;break}else if((f|0)==0){l=0;m=1;break}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[117];i=0;return i|0}else{l=0;m=1}}while(0);if(h){if(k&m){i=1;return i|0}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[28];i=0;return i|0}if(!(k|m)){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[58];i=0;return i|0}do{if((g-1|0)>>>0<=2046>>>0){h=(g&3|0)!=0;if(!((g&2044|0)==0|h^1)){break}if(h){if(!(k&m)){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[27];i=0;return i|0}if((g|0)!=2){i=1;return i|0}a[(c[4874]|0)+197852|0]=1;c[(c[4874]|0)+197856>>2]=2e4;i=1;return i|0}h=g>>>2&15;e=0;f=32;b=0;while(1){if((h&1|0)==0){n=e;o=b}else{n=e+1|0;o=32-f|0}p=f-1|0;if((p|0)>0){h=h>>1;e=n;f=p;b=o}else{break}}if((n|0)!=1){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[81];i=0;return i|0}a[(c[4874]|0)+197852|0]=o<<3|34;do{if((g&1984|0)==0){q=0}else{b=g>>6;f=0;e=32;h=o;while(1){if((b&1|0)==0){r=f;s=h}else{r=f+1|0;s=32-e|0}p=e-1|0;if((p|0)>0){b=b>>1;f=r;e=p;h=s}else{break}}if((r|0)==1){h=(c[4874]|0)+197852|0;a[h]=s+65+(d[h]|0);q=s;break}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[81];i=0;return i|0}}while(0);if(!k){c[(c[4874]|0)+197856>>2]=j;i=1;return i|0}if(m){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[25];i=0;return i|0}else{c[(c[4874]|0)+197856>>2]=l<<q;i=1;return i|0}}}while(0);a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[81];i=0;return i|0}function id(){var d=0,e=0,f=0,g=0,h=0,j=0,k=0;d=i;i=i+520|0;e=d|0;f=d+8|0;zd(c[4872]|0);a[(c[4874]|0)+206362|0]=0;a[(c[4874]|0)+206363|0]=1;a[e]=0;do{if(!(Ad(c[4872]|0,e)|0)){g=0;h=15;break}if((c[(c[4872]|0)+20>>2]|0)!=84){break}}while((a[e]&1)==0);if((h|0)==15){i=d;return g|0}h=c[4874]|0;do{if((a[h+206362|0]&1)==0){j=h}else{if(qe(13)|0){j=c[4874]|0;break}else{g=0;i=d;return g|0}}}while(0);a[j+206363|0]=0;j=c[4874]|0;h=c[j+16>>2]|0;e=f|0;$a(e|0,9232,(f=i,i=i+8|0,c[f>>2]=j+74432,f)|0)|0;i=f;if(!(re(e)|0)){g=0;i=d;return g|0}if(!(re(8672)|0)){g=0;i=d;return g|0}if(!(nd(h)|0)){g=0;i=d;return g|0}j=c[(c[4874]|0)+48>>2]|0;k=b[j>>1]>>2;$a(e|0,8424,(f=i,i=i+16|0,c[f>>2]=b[j+2>>1]>>2,c[f+8>>2]=k,f)|0)|0;i=f;if(!(re(e)|0)){g=0;i=d;return g|0}e=c[4874]|0;do{if((a[e+206362|0]&1)!=0){a[e+206363|0]=1;if(nd(h)|0){break}else{g=0}i=d;return g|0}}while(0);g=1;i=d;return g|0}function jd(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0;i=c[4874]|0;if((i|0)==0){j=0;return j|0}if((a[i|0]&1)==0){j=0;return j|0}c[b>>2]=Gd(c[4872]|0,e,f)|0;c[d>>2]=Fd(c[4872]|0)|0;c[g>>2]=c[(c[4874]|0)+16>>2];c[h>>2]=c[(c[4874]|0)+20>>2];j=1;return j|0}function kd(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;e=i;i=i+32|0;f=e|0;g=e+8|0;h=e+16|0;j=e+24|0;a[f]=0;zd(c[4872]|0);k=(b|0)==4;a:while(1){if(!(Ed(c[4872]|0,b,f)|0)){l=0;m=47;break}do{if((a[f]&1)==0){if(!(Ad(c[4872]|0,f)|0)){l=0;m=47;break a}n=c[4872]|0;if((c[n+20>>2]|0)!=0){m=6;break a}Md(n);o=c[4874]|0;if((c[o+52>>2]|0)>=1024){m=46;break a}b:do{if(Cd(c[4872]|0,1)|0){n=0;while(1){if((a[f]&1)!=0){p=n;break b}if(!(Ad(c[4872]|0,f)|0)){l=0;m=47;break a}if((c[(c[4872]|0)+20>>2]|0)!=0){m=16;break a}if(n<<24>>24>=15){m=15;break a}q=n+1&255;a[g]=0;if(!(Ee(g)|0)){l=0;m=47;break a}if((a[g]&1)==0){p=q;break}else{n=q}}}else{p=0}}while(0);if(Cd(c[4872]|0,8)|0){if(!(Ad(c[4872]|0,f)|0)){l=0;m=47;break a}n=c[(c[4872]|0)+20>>2]|0;if(!((n|0)==0|(n|0)==78)){m=20;break a}}a[h]=0;if(!(Fe(h)|0)){l=0;m=47;break a}c:do{if((a[h]&1)==0){r=0}else{n=0;while(1){if((a[f]&1)!=0){r=n;break c}if(!(Ad(c[4872]|0,f)|0)){l=0;m=47;break a}q=c[4872]|0;if((c[q+20>>2]|0)!=0){m=37;break a}if(Cd(q,3)|0){if(!(Od(1,1,0)|0)){l=0;m=47;break a}q=(Nd()|0)<<2;if((q|0)>32768){m=29;break a}s=q+n|0;if((s|0)>=32769){m=34;break a}if(Bd(c[4872]|0,4)|0){t=s}else{l=0;m=47;break a}}else{t=n+4|0}if((t|0)>32768){m=34;break a}a[j]=0;if(!(De(j)|0)){l=0;m=47;break a}if((a[j]&1)==0){r=t;break}else{n=t}}}}while(0);n=c[4874]|0;ke(c[4870]|0,n+206104|0,83,(c[n+52>>2]|0)>>>2&255|p<<24>>24<<8,b,0);if((a[(c[4874]|0)+197864|0]&1)==0){Je(r<<16)|0}if(k){if(!(Ne()|0)){l=0;m=47;break a}if(!(Me(p)|0)){l=0;m=47;break a}}if((a[d]&1)!=0){break}a[(c[4874]|0)+197844|0]=p;a[d]=1}}while(0);if((a[f]&1)!=0){l=1;m=47;break}}if((m|0)==6){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[51];l=0;i=e;return l|0}else if((m|0)==15){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[99];l=0;i=e;return l|0}else if((m|0)==16){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[49];l=0;i=e;return l|0}else if((m|0)==20){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[50];l=0;i=e;return l|0}else if((m|0)==29){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[98];l=0;i=e;return l|0}else if((m|0)==34){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[98];l=0;i=e;return l|0}else if((m|0)==37){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[52];l=0;i=e;return l|0}else if((m|0)==46){a[o|0]=1;c[(c[4874]|0)+4>>2]=c[100];l=0;i=e;return l|0}else if((m|0)==47){i=e;return l|0}return 0}function ld(d,e){d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;f=i;i=i+32|0;g=f|0;h=f+8|0;j=f+16|0;k=f+24|0;a[g]=0;zd(c[4872]|0);l=(d|0)==4;m=l?4:5;n=l?6:7;a:while(1){if(!(Ed(c[4872]|0,d,g)|0)){o=0;p=32;break}l=a[g]|0;if((l&1)==0){q=c[4874]|0;r=c[q+16>>2]|0;s=c[q+52>>2]|0;if(!(Ad(c[4872]|0,g)|0)){o=0;p=32;break}q=c[4874]|0;t=c[q+16>>2]|0;u=c[q+20>>2]|0;b:do{if(Cd(c[4872]|0,1)|0){q=0;v=4;while(1){if((a[g]&1)!=0){w=q;x=v;break b}if(!(Ad(c[4872]|0,g)|0)){o=0;p=32;break a}y=c[4872]|0;if((c[y+20>>2]|0)!=0){p=11;break a}Md(y);ke(c[4870]|0,(c[4874]|0)+206104|0,78,v,0,1);y=c[4874]|0;c[y+206372>>2]=c[y+16>>2];y=c[4874]|0;c[y+206376>>2]=c[y+20>>2];c[(c[4874]|0)+206384>>2]=c[e>>2];c[(c[4874]|0)+206388>>2]=q;c[(c[4874]|0)+206392>>2]=t;c[(c[4874]|0)+206396>>2]=u;c[(c[4874]|0)+206400>>2]=0;c[(c[4874]|0)+206380>>2]=n;He();y=q+1|0;z=v+4|0;a[h]=0;if(!(Ee(h)|0)){o=0;p=32;break a}if((a[h]&1)==0){w=y;x=z;break}else{q=y;v=z}}}else{w=0;x=4}}while(0);do{if(Cd(c[4872]|0,8)|0){if(!(Ad(c[4872]|0,g)|0)){o=0;p=32;break a}v=c[4872]|0;q=c[v+20>>2]|0;if((q|0)==0){Md(v);ke(c[4870]|0,(c[4874]|0)+206104|0,78,0,0,1);break}else if((q|0)==78){if((c[v+24>>2]|0)==0){break}else{p=16;break a}}else{p=16;break a}}}while(0);a[j]=0;if(!(Fe(j)|0)){o=0;p=32;break}c:do{if((a[j]&1)!=0){v=x;while(1){if((a[g]&1)!=0){break c}if(!(Ad(c[4872]|0,g)|0)){o=0;p=32;break a}q=c[4872]|0;if((c[q+20>>2]|0)!=0){p=28;break a}Md(q);if(Cd(c[4872]|0,3)|0){if(!(Od(1,1,0)|0)){o=0;p=32;break a}q=(Nd()|0)<<2;if(Bd(c[4872]|0,4)|0){A=q}else{o=0;p=32;break a}}else{A=4}ke(c[4870]|0,(c[4874]|0)+206104|0,78,v,0,1);a[k]=0;if(!(De(k)|0)){o=0;p=32;break a}if((a[k]&1)==0){break}else{v=A+v|0}}}}while(0);v=c[4874]|0;b[(c[v+48>>2]|0)+((c[e>>2]<<2)+4)>>1]=c[v+52>>2];if(!(Td()|0)){o=0;p=32;break}c[(c[4874]|0)+206372>>2]=r;c[(c[4874]|0)+206376>>2]=c[(c[4872]|0)+8>>2];c[(c[4874]|0)+206384>>2]=s;v=c[4874]|0;c[v+206388>>2]=c[v+52>>2];c[(c[4874]|0)+206392>>2]=t;c[(c[4874]|0)+206396>>2]=u;c[(c[4874]|0)+206400>>2]=c[e>>2]|w<<16;c[(c[4874]|0)+206380>>2]=m;He();c[e>>2]=(c[e>>2]|0)+1;le(c[4870]|0,1);B=a[g]|0}else{B=l}if((B&1)!=0){o=1;p=32;break}}if((p|0)==11){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[49];o=0;i=f;return o|0}else if((p|0)==16){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[50];o=0;i=f;return o|0}else if((p|0)==28){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[52];o=0;i=f;return o|0}else if((p|0)==32){i=f;return o|0}return 0}function md(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;e=i;i=i+8|0;f=e|0;g=c[4872]|0;h=c[g+8>>2]|0;a[f]=0;if(!(Ad(g,f)|0)){j=0;i=e;return j|0}f=c[4874]|0;g=(c[f+20>>2]|0)-(c[f+16>>2]|0)|0;c[d>>2]=g;a:do{if((g|0)>0&b){f=0;while(1){k=c[4874]|0;l=f+1|0;if(!(qe(a[(c[k+12>>2]|0)+((c[k+16>>2]|0)+f)|0]|0)|0)){j=0;break}k=c[d>>2]|0;if((l|0)<(k|0)){f=l}else{m=k;break a}}i=e;return j|0}else{m=g}}while(0);g=c[4874]|0;f=c[g+12>>2]|0;k=m+(c[g+16>>2]|0)|0;while(1){g=a[f+k|0]|0;if((g<<24>>24|0)==40){n=k;o=40;p=m;q=10;break}else if(!((g<<24>>24|0)==32|(g<<24>>24|0)==9)){r=k;s=f;break}k=k+1|0}do{if((q|0)==10){b:while(1){q=0;t=n+1|0;c[d>>2]=p+1;if(b){if(!(qe(o)|0)){j=0;q=35;break}}c:do{if((o<<24>>24|0)==44){c[d>>2]=(c[d>>2]|0)+1;if(b){if(!(qe(32)|0)){j=0;q=35;break b}}k=c[(c[4874]|0)+12>>2]|0;f=t;while(1){m=a[k+f|0]|0;if(!((m<<24>>24|0)==32|(m<<24>>24|0)==9)){u=f;v=m;break c}f=f+1|0}}else if((o<<24>>24|0)==41){q=7;break b}else{u=t;v=a[(c[(c[4874]|0)+12>>2]|0)+t|0]|0}}while(0);n=u;o=v;p=c[d>>2]|0;q=10}if((q|0)==7){r=t;s=c[(c[4874]|0)+12>>2]|0;break}else if((q|0)==35){i=e;return j|0}}}while(0);t=r;while(1){r=a[s+t|0]|0;if((r<<24>>24|0)==58){q=22;break}else if(!((r<<24>>24|0)==32|(r<<24>>24|0)==9)){break}t=t+1|0}d:do{if((q|0)==22){c[d>>2]=(c[d>>2]|0)+3;do{if(b){if(re(1296)|0){break}else{j=0}i=e;return j|0}}while(0);s=c[(c[4874]|0)+12>>2]|0;r=t;while(1){w=a[s+r|0]|0;if(!((w<<24>>24|0)==32|(w<<24>>24|0)==9)){break}r=r+1|0}if(!(we(w)|0)){break}if(b){x=r}else{s=r;while(1){c[d>>2]=(c[d>>2]|0)+1;if(we(a[(c[(c[4874]|0)+12>>2]|0)+s|0]|0)|0){s=s+1|0}else{break d}}}while(1){c[d>>2]=(c[d>>2]|0)+1;if(!(qe(32)|0)){j=0;break}if(we(a[(c[(c[4874]|0)+12>>2]|0)+x|0]|0)|0){x=x+1|0}else{break d}}i=e;return j|0}}while(0);c[(c[4872]|0)+8>>2]=h;c[d>>2]=(c[d>>2]|0)+5;do{if(b){if(qe(13)|0){break}else{j=0}i=e;return j|0}}while(0);j=1;i=e;return j|0}function nd(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;i=i+24|0;e=d|0;f=d+8|0;g=d+16|0;zd(c[4872]|0);c[(c[4872]|0)+8>>2]=b;a[e]=0;a:while(1){if(!(Ed(c[4872]|0,4,e)|0)){h=0;break}if((a[e]&1)!=0){h=1;break}if((a[(c[4874]|0)+206363|0]&1)!=0){if(!(qe(13)|0)){h=0;break}c[f>>2]=0;if(!(md(0,f)|0)){h=0;break}b=c[f>>2]|0;if((b|0)>0){j=0;do{j=j+1|0;if(!(qe(95)|0)){h=0;break a}}while((j|0)<(b|0))}if(!(qe(13)|0)){h=0;break}}if(!(re(736)|0)){h=0;break}c[g>>2]=0;if(!(md(1,g)|0)){h=0;break}if((a[(c[4874]|0)+206363|0]&1)!=0){if(!(qe(13)|0)){h=0;break}}if((a[e]&1)!=0){h=1;break}}i=d;return h|0}function od(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;e=1<<d;if((b|0)<=0){f=1;return f|0}d=a&255;g=a>>>8&255;h=(e|0)>2;i=a>>>16&255;j=a>>>24&255;if((e|0)>1){k=0}else{e=0;while(1){if(!(Ie(d)|0)){f=0;l=21;break}a=c[4874]|0;if((c[a+206680>>2]|0)==0){m=a+206364|0;c[m>>2]=(c[m>>2]|0)+1}m=e+1|0;if((m|0)<(b|0)){e=m}else{f=1;l=21;break}}if((l|0)==21){return f|0}}a:while(1){if(!(Ie(d)|0)){f=0;l=21;break}e=c[4874]|0;if((c[e+206680>>2]|0)==0){m=e+206364|0;c[m>>2]=(c[m>>2]|0)+1}if(!(Ie(g)|0)){f=0;l=21;break}m=c[4874]|0;if((c[m+206680>>2]|0)==0){e=m+206364|0;c[e>>2]=(c[e>>2]|0)+1}do{if(h){if(!(Ie(i)|0)){f=0;l=21;break a}e=c[4874]|0;if((c[e+206680>>2]|0)==0){m=e+206364|0;c[m>>2]=(c[m>>2]|0)+1}if(!(Ie(j)|0)){f=0;l=21;break a}m=c[4874]|0;if((c[m+206680>>2]|0)!=0){break}e=m+206364|0;c[e>>2]=(c[e>>2]|0)+1}}while(0);e=k+1|0;if((e|0)<(b|0)){k=e}else{f=1;l=21;break}}if((l|0)==21){return f|0}return 0}function pd(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;e=(1<<d)-1|0;f=c[4874]|0;g=c[f+52>>2]|0;a:do{if((g&e|0)==0){h=f;i=g}else{while(1){if(!(Ie(0)|0)){j=0;break}k=c[4874]|0;if((c[k+206680>>2]|0)==0){l=k+206364|0;c[l>>2]=(c[l>>2]|0)+1;m=c[4874]|0}else{m=k}k=c[m+52>>2]|0;if((k&e|0)==0){h=m;i=k;break a}}return j|0}}while(0);if(!a){j=1;return j|0}a=c[h+206364>>2]|0;c[h+206384>>2]=i;c[(c[4874]|0)+206388>>2]=d;c[(c[4874]|0)+206392>>2]=a;c[(c[4874]|0)+206396>>2]=0;c[(c[4874]|0)+206400>>2]=0;c[(c[4874]|0)+206380>>2]=3;He();h=c[4870]|0;m=(c[4874]|0)+206104|0;do{if(b){n=75}else{if((d|0)==0){n=72;break}n=(d|0)==1?73:74}}while(0);ke(h,m,n,i,a,0);j=1;return j|0}function qd(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;h=i;i=i+8|0;j=h|0;k=c[(c[4872]|0)+24>>2]&255;c[g>>2]=k;a:do{if(pd(e,(a[f]&1)!=0,k)|0){if(!(Ad(c[4872]|0,b)|0)){l=0;break}if((c[(c[4872]|0)+20>>2]|0)==84){l=1;break}m=(d|0)==1;n=k;while(1){if((a[b]&1)!=0){l=1;break a}o=c[4872]|0;if((c[o+20>>2]|0)==29){p=c[o+24>>2]&255;if((p|0)<(c[g>>2]|0)){break}else{q=p}}else{Dd(o);q=n}if(!(Od(m,(q|0)!=2,1)|0)){l=0;break a}o=Nd()|0;if(Cd(c[4872]|0,3)|0){if(!(Od(1,1,1)|0)){l=0;break a}p=Nd()|0;if(Bd(c[4872]|0,4)|0){r=p}else{l=0;break a}}else{r=1}if(!(od(o,r,q)|0)){l=0;break a}a[j]=0;if(!(De(j)|0)){l=0;break a}if((a[j]&1)==0){l=1;break a}if(Ad(c[4872]|0,b)|0){n=q}else{l=0;break a}}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[123];l=0}else{l=0}}while(0);i=h;return l|0}function rd(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0;f=i;i=i+16|0;g=f|0;h=f+8|0;c[e>>2]=0;if(b){b=c[4874]|0;e=c[b+52>>2]|0;j=c[b+206364>>2]|0;c[b+206384>>2]=e;c[(c[4874]|0)+206388>>2]=0;c[(c[4874]|0)+206392>>2]=j;c[(c[4874]|0)+206396>>2]=0;c[(c[4874]|0)+206400>>2]=0;c[(c[4874]|0)+206380>>2]=3;He();ke(c[4870]|0,(c[4874]|0)+206104|0,d?75:72,e,j,0)}c[g>>2]=0;c[h>>2]=0;if(!(Ge(g,h)|0)){k=0;i=f;return k|0}h=c[4874]|0;g=c[h+74688>>2]|0;a:do{if((g|0)>0){j=0;while(1){e=j+1|0;if((Fb((j<<8)+(h+74692)|0,h+206404|0)|0)==0){break}if((e|0)<(g|0)){j=e}else{break a}}b:do{if((c[h+83268+(j<<2)>>2]|0)>0){e=0;d=h;while(1){if(!(Ie(a[(c[d+83140+(j<<2)>>2]|0)+e+(d+83396)|0]|0)|0)){k=0;break}b=c[4874]|0;if((c[b+206680>>2]|0)==0){l=b+206364|0;c[l>>2]=(c[l>>2]|0)+1;m=c[4874]|0}else{m=b}b=e+1|0;if((b|0)<(c[m+83268+(j<<2)>>2]|0)){e=b;d=m}else{break b}}i=f;return k|0}}while(0);k=Bd(c[4872]|0,84)|0;i=f;return k|0}}while(0);a[h|0]=1;c[(c[4874]|0)+4>>2]=c[83];k=0;i=f;return k|0}function sd(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0;c[e>>2]=2;f=c[(c[4872]|0)+24>>2]&255;if((f|0)==1){if(!(pd(b,(a[d]&1)!=0,2)|0)){g=0;return g|0}do{if(Cd(c[4872]|0,84)|0){h=0}else{if(!(Od(1,1,1)|0)){g=0;return g|0}i=Nd()|0;if(!(Bd(c[4872]|0,84)|0)){g=0;return g|0}if((i|0)<=496){h=i;break}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[108];g=0;return g|0}}while(0);c[(c[4874]|0)+206364>>2]=h<<2;c[(c[4874]|0)+206680>>2]=0;g=1;return g|0}else if((f|0)==4){if(!(pd(b,(a[d]&1)!=0,2)|0)){g=0;return g|0}if(!(Bd(c[4872]|0,84)|0)){g=0;return g|0}g=od(0,1,2)|0;return g|0}else if((f|0)==3){if(!(pd(b,(a[d]&1)!=0,2)|0)){g=0;return g|0}do{if(Cd(c[4872]|0,84)|0){j=496}else{if(!(Od(1,1,1)|0)){g=0;return g|0}h=Nd()|0;if(Bd(c[4872]|0,84)|0){j=h;break}else{g=0}return g|0}}while(0);h=c[4874]|0;if((c[h+206364>>2]|0)<=(j<<2|0)){g=1;return g|0}a[h|0]=1;c[(c[4874]|0)+4>>2]=c[106];g=0;return g|0}else if((f|0)==2){f=c[4874]|0;if((c[f+206680>>2]|0)!=0){a[f|0]=1;c[(c[4874]|0)+4>>2]=c[115];g=0;return g|0}a[d]=1;if(!(pd(b,1,c[e>>2]|0)|0)){g=0;return g|0}do{if(Cd(c[4872]|0,84)|0){k=1}else{if(!(Od(1,1,1)|0)){g=0;return g|0}e=Nd()|0;if(Bd(c[4872]|0,84)|0){k=e;break}else{g=0}return g|0}}while(0);e=(c[4874]|0)+206364|0;c[e>>2]=(c[e>>2]|0)+(k<<2);k=c[4874]|0;if((c[k+206364>>2]|0)<=1984){g=1;return g|0}a[k|0]=1;c[(c[4874]|0)+4>>2]=c[108];g=0;return g|0}else{if(!(pd(b,(a[d]&1)!=0,2)|0)){g=0;return g|0}if(!(Bd(c[4872]|0,84)|0)){g=0;return g|0}c[(c[4874]|0)+206364>>2]=0;c[(c[4874]|0)+206680>>2]=1;g=1;return g|0}return 0}function td(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0;j=i;i=i+16|0;k=j|0;l=j+8|0;c[g>>2]=2;if(!(pd(e,f,2)|0)){m=0;i=j;return m|0}f=c[4872]|0;if((a[f+40|0]&1)==0){if((c[f+20>>2]|0)==22){n=4}else{o=f+24|0}}else{n=4}if((n|0)==4){o=f+36|0}e=c[o>>2]|0;o=e&255;g=(e&128|0)!=0;p=(e>>>1&32|h&255|(g?768:o<<8))<<18;do{if(g){if(!(Od((d|0)==1,1,1)|0)){m=0;i=j;return m|0}h=Nd()|0;if((h|0)<=511){q=0;r=e&7|p|h<<9|4194304;break}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[30];m=0;i=j;return m|0}else{if((o|0)==21){if(!(Bd(f,7)|0)){m=0;i=j;return m|0}c[k>>2]=0;if(!(Ae(k)|0)){m=0;i=j;return m|0}h=c[k>>2]|0;if((h|0)<=0){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[37];m=0;i=j;return m|0}if((h|0)>252){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[26];m=0;i=j;return m|0}s=c[4872]|0;t=s+64|0;u=(d|0)==1;do{if(u){if(!(Ld(s,t)|0)){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[37];m=0;i=j;return m|0}v=c[4872]|0;w=c[v+20>>2]|0;if((w|0)==0){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[134];m=0;i=j;return m|0}if((w&-4|0)!=72){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[37];m=0;i=j;return m|0}w=c[v+28>>2]|0;if((w&3|0)!=0){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[18];m=0;i=j;return m|0}if((w>>2|0)<=495){x=w;y=c[k>>2]|0;break}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[19];m=0;i=j;return m|0}else{x=c[s+28>>2]|0;y=h}}while(0);h=x>>>2&511|p;a[s+64+y|0]=95;a[(c[k>>2]|0)+1+(s+64)|0]=82;a[(c[k>>2]|0)+2+(s+64)|0]=69;a[(c[k>>2]|0)+3+(s+64)|0]=84;a[(c[k>>2]|0)+4+(s+64)|0]=0;w=c[4872]|0;do{if(u){if(!(Ld(w,t)|0)){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[37];m=0;i=j;return m|0}v=c[4872]|0;z=c[v+20>>2]|0;if((z|0)==0){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[133];m=0;i=j;return m|0}if((z&-4|0)!=72){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[37];m=0;i=j;return m|0}z=c[v+28>>2]|0;if((z&3|0)!=0){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[112];m=0;i=j;return m|0}if((z>>2|0)<=495){A=z;break}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[113];m=0;i=j;return m|0}else{A=c[w+28>>2]|0}}while(0);q=0;r=(h|A<<7&261632)^146800640;break}else if((o|0)==22){q=0;r=p^71303168;break}else if((o|0)==23){if(!(Ad(f,b)|0)){m=0;i=j;return m|0}w=c[4872]|0;if((c[w+20>>2]|0)==7){B=p|4194304}else{Dd(w);B=p}if(!(Od((d|0)==1,1,1)|0)){m=0;i=j;return m|0}w=Nd()|0;if((w|0)<=511){q=0;r=w|B;break}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[125];m=0;i=j;return m|0}else{w=(d|0)==1;if(!(Od(w,1,1)|0)){m=0;i=j;return m|0}t=Nd()|0;if((t|0)>511){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[30];m=0;i=j;return m|0}u=t<<9|p;if(!(Bd(c[4872]|0,5)|0)){m=0;i=j;return m|0}if(!(Ad(c[4872]|0,b)|0)){m=0;i=j;return m|0}t=c[4872]|0;if((c[t+20>>2]|0)==7){C=u|4194304}else{Dd(t);C=u}if(!(Od(w,1,1)|0)){m=0;i=j;return m|0}w=Nd()|0;if((w|0)<=511){q=0;r=w|C;break}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[125];m=0;i=j;return m|0}}}while(0);while(1){if((a[b]&1)!=0){D=r;break}if(!(Ad(c[4872]|0,b)|0)){m=0;n=76;break}C=c[4872]|0;E=c[C+20>>2]|0;if((E|0)!=65){n=71;break}p=c[C+24>>2]|0;if((p&9|0)!=0&r>>>0<201326592>>>0){n=68;break}C=((p<<20|-58720257)^58720256)&r|p<<23&58720256;a[l]=0;if(!(De(l)|0)){m=0;n=76;break}if((a[l]&1)==0){D=C;break}else{q=1;r=C}}do{if((n|0)==68){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[101];m=0;i=j;return m|0}else if((n|0)==71){if(q){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[32];m=0;i=j;return m|0}if((E|0)==84){D=r;break}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[31];m=0;i=j;return m|0}else if((n|0)==76){i=j;return m|0}}while(0);m=od(D,1,2)|0;i=j;return m|0}function ud(){var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0;b=i;i=i+32|0;d=b|0;e=b+8|0;f=b+16|0;g=b+24|0;h=c[4874]|0;j=c[h+52>>2]|0;k=0;l=0;m=0;n=0;o=h;a:while(1){c[o+52>>2]=j;c[(c[4874]|0)+197904>>2]=0;c[(c[4874]|0)+206364>>2]=0;c[(c[4874]|0)+206680>>2]=0;c[d>>2]=0;a[e]=0;zd(c[4872]|0);b:do{if((a[e]&1)==0){h=(n|0)==0;p=k;q=l;r=m;while(1){if(!(Ed(c[4872]|0,2,e)|0)){s=0;t=50;break a}if((a[e]&1)!=0){u=p;v=q;w=r;break b}x=c[4874]|0;y=c[x+16>>2]|0;z=c[x+52>>2]|0;x=p;c:while(1){if(!(Ad(c[4872]|0,e)|0)){s=0;t=50;break a}if((a[e]&1)!=0){A=x;break}d:do{if((c[(c[4872]|0)+20>>2]|0)!=84){B=c[4874]|0;c[B+206372>>2]=c[B+16>>2];a[f]=0;a[g]=0;if(!(ze(f)|0)){s=0;t=50;break a}B=c[4874]|0;c[B+206376>>2]=c[B+20>>2];B=c[4872]|0;C=c[B+20>>2]|0;e:do{switch(C|0){case 0:{if((a[f]&1)==0){if(!(Ke()|0)){s=0;t=50;break a}D=c[4872]|0}else{D=B}Md(D);if(!(Ad(c[4872]|0,e)|0)){s=0;t=50;break a}E=c[4872]|0;F=c[E+20>>2]|0;if((F|0)!=84){G=1;H=E;I=F;break e}F=c[d>>2]|0;E=c[4874]|0;J=c[E+52>>2]|0;K=c[E+206364>>2]|0;c[E+206384>>2]=J;c[(c[4874]|0)+206388>>2]=F;c[(c[4874]|0)+206392>>2]=K;c[(c[4874]|0)+206396>>2]=0;c[(c[4874]|0)+206400>>2]=0;c[(c[4874]|0)+206380>>2]=3;He();if((F|0)==0){L=72}else{L=(F|0)==1?73:74}ke(c[4870]|0,(c[4874]|0)+206104|0,L,J,K,0);break d;break};case 72:case 73:case 74:case 75:{if((a[f]&1)==0){if(!(Ke()|0)){s=0;t=50;break a}}if(h){t=24;break a}if(!(Ad(c[4872]|0,e)|0)){s=0;t=50;break a}K=c[4872]|0;J=c[K+20>>2]|0;if((J|0)==84){break d}else{G=0;H=K;I=J}break};default:{G=0;H=B;I=C}}}while(0);f:do{switch(I|0){case 29:{if(qd(e,n,G,g,d)|0){break d}else{s=0;t=50;break a}break};case 32:{if(rd(G,0,d)|0){break d}else{s=0;t=50;break a}break};case 62:{if(sd(G,g,d)|0){break d}else{s=0;t=50;break a}break};case 63:{C=c[H+24>>2]&255;if(!(Ad(H,e)|0)){s=0;t=50;break a}B=c[4872]|0;J=c[B+20>>2]|0;do{if((J|0)!=64){if((a[B+40|0]&1)!=0){break}if((J|0)!=22){t=36;break a}K=c[B+32>>2]|0;if(!((K|0)==16|(K|0)==18)){t=36;break a}}}while(0);if(td(e,n,G,0,d,C)|0){break d}else{s=0;t=50;break a}break};case 64:{break};default:{if((a[H+40|0]&1)!=0){break f}if((I|0)==28){t=42;break c}else if((I|0)!=22){t=45;break a}B=c[H+32>>2]|0;if(!((B|0)==16|(B|0)==18)){t=45;break a}}}}while(0);if(!(td(e,n,G,0,d,15)|0)){s=0;t=50;break a}}}while(0);if((a[e]&1)==0){x=1}else{A=1;break}}do{if((t|0)==42){t=0;Dd(H);if(!h){A=1;break}c[(c[4874]|0)+206372>>2]=y;c[(c[4874]|0)+206376>>2]=c[(c[4872]|0)+8>>2];c[(c[4874]|0)+206384>>2]=z;x=c[4874]|0;c[x+206388>>2]=c[x+52>>2];c[(c[4874]|0)+206392>>2]=0;c[(c[4874]|0)+206396>>2]=0;c[(c[4874]|0)+206400>>2]=0;c[(c[4874]|0)+206380>>2]=2;He();A=1}}while(0);if((a[e]&1)==0){p=A;q=y;r=z}else{u=A;v=y;w=z;break}}}else{u=k;v=l;w=m}}while(0);if((u|0)!=0&(n|0)==0){c[(c[4874]|0)+206372>>2]=v;c[(c[4874]|0)+206376>>2]=c[(c[4872]|0)+8>>2];c[(c[4874]|0)+206384>>2]=w;r=c[4874]|0;c[r+206388>>2]=c[r+52>>2];c[(c[4874]|0)+206392>>2]=0;c[(c[4874]|0)+206396>>2]=0;c[(c[4874]|0)+206400>>2]=0;c[(c[4874]|0)+206380>>2]=2;He()}r=n+1|0;if((r|0)>=2){s=1;t=50;break}k=u;l=v;m=w;n=r;o=c[4874]|0}if((t|0)==24){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[121];s=0;i=b;return s|0}else if((t|0)==36){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[33];s=0;i=b;return s|0}else if((t|0)==45){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[48];s=0;i=b;return s|0}else if((t|0)==50){i=b;return s|0}return 0}function vd(e,f,g){e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;h=c[4874]|0;i=h+206900|0;j=c[i>>2]|0;if((j|0)==16384){a[h|0]=1;c[(c[4874]|0)+4>>2]=c[105];k=0;return k|0}c[i>>2]=j+1;b[(c[4874]|0)+206904+(j<<1)>>1]=e;e=c[4874]|0;j=e+206900|0;i=c[j>>2]|0;if((i|0)==16384){a[e|0]=1;c[(c[4874]|0)+4>>2]=c[105];k=0;return k|0}c[j>>2]=i+1;b[(c[4874]|0)+206904+(i<<1)>>1]=f;i=f&65535;j=c[4874]|0;e=a[(c[j+48>>2]|0)+(i+3)|0]|0;h=j+206900|0;l=c[h>>2]|0;if((l|0)==16384){a[j|0]=1;c[(c[4874]|0)+4>>2]=c[105];k=0;return k|0}c[h>>2]=l+1;b[(c[4874]|0)+206904+(l<<1)>>1]=e&255;l=e&255;if(e<<24>>24==0){k=1;return k|0}e=b[g>>1]|0;h=1;j=e;while(1){b[g>>1]=j+1;m=c[4874]|0;n=m+206900|0;o=c[n>>2]|0;if((o|0)==16384){p=10;break}c[n>>2]=o+1;b[(c[4874]|0)+206904+(o<<1)>>1]=j;if((h<<16>>16|0)>=(l|0)){break}h=h+1&65535;j=b[g>>1]|0}if((p|0)==10){a[m|0]=1;c[(c[4874]|0)+4>>2]=c[105];k=0;return k|0}m=c[(c[4874]|0)+48>>2]|0;j=d[m+(i+2)|0]|0;h=0;o=0;n=m;while(1){m=h+1&65535;if(!(vd(h+e&65535,(b[n+((o+j<<2)+i)>>1]|0)+f&65535,g)|0)){k=0;p=17;break}q=m<<16>>16;if((q|0)>=(l|0)){k=1;p=17;break}h=m;o=q;n=c[(c[4874]|0)+48>>2]|0}if((p|0)==17){return k|0}return 0}function wd(){var a=0,d=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0;a=c[4874]|0;d=c[a+206900>>2]|0;if((d|0)>0){f=0;g=a;h=d}else{return}while(1){d=b[g+206904+(f+2<<1)>>1]|0;a=d&65535;i=d<<16>>16==0;a:do{if(i){j=8}else{k=f+3|0;l=0;while(1){m=l+1|0;if((b[g+206904+(k+l<<1)>>1]|0)>-1){break}if((m|0)<(a|0)){l=m}else{j=8;break a}}n=k+a|0;o=g;p=h}}while(0);if((j|0)==8){j=0;l=a+3|0;m=l+f|0;b:do{if((m|0)<(h|0)){q=f+1|0;r=f+3|0;s=0;t=m;u=h;v=g;while(1){w=v+206904+(q<<1)|0;x=v+48|0;y=t;c:while(1){z=b[v+206904+(y+2<<1)>>1]|0;A=z&65535;d:do{if(d<<16>>16==z<<16>>16){if(!i){B=y+3|0;C=0;while(1){D=C+1|0;if((b[v+206904+(r+C<<1)>>1]|0)!=(b[v+206904+(B+C<<1)>>1]|0)){break d}if((D|0)<(A|0)){C=D}else{break}}}C=c[x>>2]|0;B=C+(e[w>>1]|0)|0;if((vg(B|0,C+(e[v+206904+(y+1<<1)>>1]|0)|0,e[B>>1]|0)|0)==0){break c}}}while(0);z=y+3+A|0;if((z|0)<(u|0)){y=z}else{E=s;F=v;break b}}do{if((u|0)>0){w=e[v+206904+(f<<1)>>1]|0;x=0;z=v;while(1){B=x+3|0;C=b[z+206904+(x+2<<1)>>1]|0;D=C&65535;if(C<<16>>16==0){G=B;H=z}else{C=D>>>0>1>>>0;I=B;J=1;K=z;while(1){L=K+206904+(I<<1)|0;if((b[L>>1]&32767|0)==(w|0)){b[L>>1]=b[K+206904+(y<<1)>>1]|-32768}if((J|0)>=(D|0)){break}I=I+1|0;J=J+1|0;K=c[4874]|0}G=(C?D:1)+B|0;H=c[4874]|0}M=c[H+206900>>2]|0;if((G|0)<(M|0)){x=G;z=H}else{break}}if((M|0)<=0){N=H;O=M;break}z=e[H+206904+(y<<1)>>1]|0;x=0;w=H;while(1){A=x+3|0;K=b[w+206904+(x+2<<1)>>1]|0;J=K&65535;if(K<<16>>16==0){P=A;Q=w}else{K=J>>>0>1>>>0;I=A;L=1;R=w;while(1){S=R+206904+(I<<1)|0;if((b[S>>1]&32767|0)==(z|0)){b[S>>1]=b[R+206904+(y<<1)>>1]|-32768}if((L|0)>=(J|0)){break}I=I+1|0;L=L+1|0;R=c[4874]|0}P=(K?J:1)+A|0;Q=c[4874]|0}R=c[Q+206900>>2]|0;if((P|0)<(R|0)){x=P;w=Q}else{N=Q;O=R;break}}}else{N=v;O=u}}while(0);c[N+206900>>2]=O-l;w=c[4874]|0;ug(w+206904+(f<<1)|0,w+206904+(m<<1)|0,(c[w+206900>>2]|0)-f<<1|0)|0;w=c[4874]|0;x=c[w+206900>>2]|0;if((y|0)<(x|0)){s=1;t=y;u=x;v=w}else{E=1;F=w;break}}}else{E=0;F=g}}while(0);n=E?0:m;o=F;p=c[F+206900>>2]|0}if((n|0)<(p|0)){f=n;g=o;h=p}else{break}}return}function xd(a){a=a|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;f=c[4874]|0;g=b[f+206904+(a+2<<1)>>1]|0;h=g&65535;if(g<<16>>16==0){return}g=b[f+206904+(a+1<<1)>>1]|0;i=g&65535;j=c[f+48>>2]|0;k=j+((d[j+(i+2)|0]<<2)+i)|0;i=a+3|0;a=0;j=f;while(1){f=b[j+206904+(i+a<<1)>>1]&32767;if((b[j+206904>>1]|0)==f<<16>>16){l=0}else{m=0;while(1){n=m+3+(e[j+206904+(m+2<<1)>>1]|0)|0;if((b[j+206904+(n<<1)>>1]|0)==f<<16>>16){l=n;break}else{m=n}}}b[k+(a<<1<<1)>>1]=(b[j+206904+(l+1<<1)>>1]|0)-g;xd(l);m=a+1|0;if((m|0)>=(h|0)){break}a=m;j=c[4874]|0}return}function yd(){var a=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;a=i;i=i+72|0;f=a|0;g=a+8|0;h=c[4874]|0;j=c[h+52>>2]|0;c[h+206900>>2]=0;b[f>>1]=1;if(!(vd(0,0,f)|0)){k=0;i=a;return k|0}f=c[4874]|0;if((c[f+206900>>2]|0)>0){h=0;l=f;while(1){f=b[l+206904+(h+2<<1)>>1]|0;m=f&65535;if(f<<16>>16==0){n=h;o=l}else{f=e[l+206904+(h+1<<1)>>1]|0;p=c[l+48>>2]|0;q=p+(((d[p+(f+2)|0]|0)<<2)+f)|0;f=0;while(1){b[q>>1]=0;p=f+1|0;if((p|0)<(m|0)){q=q+4|0;f=p}else{break}}n=m+h|0;o=c[4874]|0}f=n+3|0;if((f|0)<(c[o+206900>>2]|0)){h=f;l=o}else{break}}}wd();o=c[4874]|0;if((c[o+206900>>2]|0)>0){l=0;h=0;n=o;do{f=n+206904+(h+1<<1)|0;q=(c[n+48>>2]|0)+(e[f>>1]|0)|0;p=b[q>>1]|0;pg(20008+(l&65535)|0,q|0,p&65535)|0;b[f>>1]=l;l=p+l&65535;n=c[4874]|0;h=h+3+(e[n+206904+(h+2<<1)>>1]|0)|0;}while((h|0)<(c[n+206900>>2]|0));r=l&65535;s=n}else{r=0;s=o}c[s+52>>2]=r;pg(c[(c[4874]|0)+48>>2]|0,20008,r)|0;xd(0);r=c[4874]|0;c[r+197840>>2]=j-(c[r+52>>2]|0)>>2;r=g|0;$a(r|0,1080,(g=i,i=i+8|0,c[g>>2]=c[(c[4874]|0)+197840>>2],g)|0)|0;i=g;if(!(re(r)|0)){k=0;i=a;return k|0}k=qe(13)|0;i=a;return k|0}function zd(b){b=b|0;c[b+8>>2]=0;a[b+12|0]=0;return}function Ad(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0;f=i;i=i+32|0;g=f|0;h=f+8|0;j=f+16|0;k=f+24|0;l=b+8|0;m=b+41|0;c[b+44+((a[m]&3)<<2)>>2]=c[l>>2];n=b+12|0;a[(a[m]&3)+(b+60)|0]=a[n]|0;a[m]=(a[m]|0)+1;m=b+20|0;c[m>>2]=0;o=b+24|0;c[o>>2]=0;p=b+28|0;c[p>>2]=0;q=b+36|0;c[q>>2]=-1;r=b+32|0;c[r>>2]=-1;s=b+16|0;c[s>>2]=0;a[e]=0;t=b|0;u=c[(c[t>>2]|0)+12>>2]|0;v=c[l>>2]|0;w=b+64|0;a[w]=0;x=v;y=0;z=0;A=v;a:while(1){v=(z|0)>0;B=z&255;C=x;D=y;E=A;b:while(1){F=C;G=E;while(1){H=G+1|0;c[l>>2]=H;I=a[u+G|0]|0;if(v){J=I;K=H;L=5;break a}M=a[n]|0;if((M<<24>>24|0)==1){L=15;break a}else if((M<<24>>24|0)!=0){L=16;break a}if((I<<24>>24|0)==13){L=30;break a}else if((I<<24>>24|0)==0){L=29;break a}else if((I<<24>>24|0)==34){L=23;break a}if(I<<24>>24<33){F=H;G=H}else{break}}switch(I<<24>>24){case 39:{L=33;break a;break};case 37:{L=58;break b;break};case 36:{L=62;break b;break};case 123:{break};case 125:{N=2;O=F;break a;break};default:{L=64;break b}}do{if((a[u+H|0]|0)==123){c[l>>2]=G+2;a[(c[4874]|0)+206362|0]=1;M=c[l>>2]|0;if((a[u+M|0]|0)!=13){P=1;Q=M;break}R=M+1|0;c[l>>2]=R;P=1;Q=R}else{P=D;Q=H}}while(0);R=Q+1|0;c[l>>2]=R;M=a[u+Q|0]|0;if(M<<24>>24==0){S=Q;T=P;L=49;break a}else{U=P;V=1;W=Q;X=R;Y=M}c:while(1){d:do{if(U){Z=V;_=W;$=Y;aa=X}else{M=V;R=W;ba=X;ca=Y;while(1){if(ca<<24>>24!=123){Z=M;_=R;$=ca;aa=ba;break d}da=ba+1|0;c[l>>2]=da;fa=a[u+ba|0]|0;if(fa<<24>>24==0){S=ba;T=0;L=49;break a}else{M=M+1|0;R=ba;ba=da;ca=fa}}}}while(0);do{if($<<24>>24==125){if(U){if((a[u+aa|0]|0)==125){break c}else{ga=Z;ha=1;ia=aa;break}}else{if((Z|0)<2){C=aa;D=0;E=aa;continue b}else{ga=Z-1|0;ha=0;ia=aa;break}}}else{if(!U){ga=Z;ha=0;ia=aa;break}ve($)|0;ga=Z;ha=1;ia=c[l>>2]|0}}while(0);ca=ia+1|0;c[l>>2]=ca;ba=a[u+ia|0]|0;if(ba<<24>>24==0){S=ia;T=ha;L=49;break a}else{U=ha;V=ga;W=ia;X=ca;Y=ba}}ba=_+2|0;c[l>>2]=ba;C=ba;D=1;E=ba}if((L|0)==58){L=0;E=G+2|0;c[l>>2]=E;C=a[u+H|0]|0;if(C<<24>>24==37){c[l>>2]=G+3;if(ye(a[u+E|0]|0,j,4)|0){ja=4}else{N=64;O=F;break}}else{if(ye(C,j,2)|0){ja=2}else{N=64;O=F;break}}C=(c[l>>2]|0)-1|0;c[l>>2]=C;x=F;y=D;z=ja;A=C;continue}else if((L|0)==62){L=0;c[l>>2]=G+2;C=ye(a[u+H|0]|0,k,16)|0;E=(c[l>>2]|0)-1|0;c[l>>2]=E;if(C){x=F;y=D;z=16;A=E;continue}else{L=63;break}}else if((L|0)==64){L=0;if((I-48&255)>>>0>=10>>>0){L=66;break}c[l>>2]=G;x=F;y=D;z=10;A=G;continue}}e:do{if((L|0)==5){while(1){L=0;if(J<<24>>24==95){ka=K}else{if(!(ye(J,g,B)|0)){break}A=ea(c[o>>2]|0,z)|0;c[o>>2]=(a[g]|0)+A;ka=c[l>>2]|0}A=ka+1|0;c[l>>2]=A;J=a[u+ka|0]|0;K=A;L=5}do{if(!((ye(a[u+(c[l>>2]|0)|0]|0,h,B)|0)&((z|0)==10&J<<24>>24==46))){if((J<<24>>24|0)==101|(J<<24>>24|0)==69){break}c[l>>2]=(c[l>>2]|0)-1;c[m>>2]=67;N=-1;O=F;break e}}while(0);c[l>>2]=F;if(!(Be(u,l,o)|0)){N=59;O=F;break}c[l>>2]=(c[l>>2]|0)-1;c[m>>2]=68;N=-1;O=F}else if((L|0)==15){a[n]=2;c[l>>2]=G;c[m>>2]=5;N=-1;O=F}else if((L|0)==16){a[n]=0;if((I<<24>>24|0)==0){c[l>>2]=G;N=26;O=F;break}else if((I<<24>>24|0)==13){N=26;O=F;break}else if((I<<24>>24|0)==34){N=55;O=F;break}else{c[o>>2]=I<<24>>24;c[l>>2]=G+2;if((a[u+H|0]|0)!=34){c[l>>2]=H;a[n]=1}c[m>>2]=67;N=-1;O=F;break}}else if((L|0)==23){A=G+2|0;c[l>>2]=A;y=a[u+H|0]|0;if((y<<24>>24|0)==0){c[l>>2]=H;N=26;O=F;break}else if((y<<24>>24|0)==13){N=26;O=F;break}else if((y<<24>>24|0)==34){N=55;O=F;break}else{c[o>>2]=y&255;c[l>>2]=G+3;if((a[u+A|0]|0)!=34){c[l>>2]=A;a[n]=1}c[m>>2]=67;N=-1;O=F;break}}else if((L|0)==29){c[m>>2]=84;a[e]=1;A=(c[l>>2]|0)-1|0;c[l>>2]=A;N=-1;O=A}else if((L|0)==30){c[m>>2]=84;N=-1;O=F}else if((L|0)==33){do{if((a[u+H|0]|0)==39){c[l>>2]=G+2;a[(c[4874]|0)+206362|0]=1;L=37}else{if(D){L=37;break}A=c[l>>2]|0;while(1){y=A+1|0;c[l>>2]=y;x=a[u+A|0]|0;if((x<<24>>24|0)==13){L=41;break}else if((x<<24>>24|0)==0){la=A;L=40;break}else{A=y}}}}while(0);f:do{if((L|0)==37){while(1){L=0;A=c[l>>2]|0;c[l>>2]=A+1;y=a[u+A|0]|0;if(y<<24>>24==0){la=A;L=40;break f}ve(y)|0;if(y<<24>>24==13){L=41;break}else{L=37}}}}while(0);if((L|0)==40){c[l>>2]=la;c[m>>2]=84;a[e]=1;N=-1;O=F;break}else if((L|0)==41){c[m>>2]=84;N=-1;O=F;break}}else if((L|0)==49){c[l>>2]=S;N=T?52:51;O=S}else if((L|0)==63){c[m>>2]=61;N=-1;O=F}else if((L|0)==66){y=xe(I)|0;if(we(y)|0){if(we(y)|0){A=0;x=y;while(1){ma=A+1|0;a[b+64+A|0]=x;k=c[l>>2]|0;c[l>>2]=k+1;ja=xe(a[u+k|0]|0)|0;if((we(ja)|0)&(ma|0)<257){A=ma;x=ja}else{break}}if((A|0)>255){N=102;O=F;break}else{na=ma}}else{na=0}c[l>>2]=(c[l>>2]|0)-1;a[b+64+na|0]=0;c[s>>2]=je(c[b+4>>2]|0,w)|0;N=-1;O=F;break}a[w]=y;x=c[l>>2]|0;ja=x+1|0;c[l>>2]=ja;k=a[u+x|0]|0;if(k<<24>>24>32){a[b+65|0]=k;c[l>>2]=x+2;a[b+66|0]=a[u+ja|0]|0;a[b+67|0]=0;x=b+4|0;j=je(c[x>>2]|0,w)|0;c[s>>2]=j;_=(j|0)==0;j=_?2:3;if(_){c[l>>2]=(c[l>>2]|0)-1;a[b+64+j|0]=0;_=je(c[x>>2]|0,w)|0;c[s>>2]=_;Y=(_|0)==0;oa=Y;pa=(Y<<31>>31)+j|0}else{oa=0;pa=j}if(!(oa|k<<24>>24<33)){N=-1;O=F;break}qa=pa;ra=c[l>>2]|0;sa=x}else{qa=1;ra=ja;sa=b+4|0}c[l>>2]=ra-1;a[b+64+qa|0]=0;ja=je(c[sa>>2]|0,w)|0;c[s>>2]=ja;N=(ja|0)==0?114:-1;O=F}}while(0);c[(c[t>>2]|0)+16>>2]=O;c[(c[t>>2]|0)+20>>2]=c[l>>2];do{if((c[m>>2]|0)==0){l=c[s>>2]|0;if((l|0)==0){break}O=c[l+4>>2]|0;c[m>>2]=O;c[o>>2]=c[l+8>>2];c[p>>2]=c[l+12>>2];F=b+40|0;if((a[l+21|0]&1)!=0){a[F]=1;c[q>>2]=d[l+20|0]|0;break}a[F]=0;F=a[l+20|0]|0;c[r>>2]=F&255;l=(O|0)==22;if(l&F<<24>>24==16){c[q>>2]=88}if(!(l&F<<24>>24==18)){break}c[q>>2]=90}}while(0);if((N|0)==-1){ta=1;i=f;return ta|0}a[c[t>>2]|0]=1;c[(c[t>>2]|0)+4>>2]=c[72+(N<<2)>>2];ta=0;i=f;return ta|0}function Bd(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;i=i+8|0;f=e|0;g=b+24|0;h=c[g>>2]|0;a[f]=0;Ad(b,f)|0;if((c[b+20>>2]|0)==(d|0)){c[g>>2]=h;j=1;i=e;return j|0}h=b|0;a[c[h>>2]|0]=1;switch(d|0){case 4:{k=54;break};case 2:{k=53;break};case 1:{k=46;break};case 7:{k=50;break};case 5:{k=38;break};case 84:{k=42;break};case 10:{k=41;break};case 83:{k=24;break};case 8:{k=37;break};default:{k=0}}c[(c[h>>2]|0)+4>>2]=c[72+(k<<2)>>2];j=0;i=e;return j|0}function Cd(b,d){b=b|0;d=d|0;var e=0,f=0,g=0;e=i;i=i+8|0;f=e|0;a[f]=0;Ad(b,f)|0;if((c[b+20>>2]|0)==(d|0)){g=1;i=e;return g|0}d=b+41|0;f=(a[d]|0)-1&255;a[d]=f;d=f&3;c[b+8>>2]=c[b+44+(d<<2)>>2];a[b+12|0]=a[b+60+d|0]|0;g=0;i=e;return g|0}function Dd(b){b=b|0;var d=0,e=0;d=b+41|0;e=(a[d]|0)-1&255;a[d]=e;d=e&3;c[b+8>>2]=c[b+44+(d<<2)>>2];a[b+12|0]=a[b+60+d|0]|0;return}function Ed(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;f=b+20|0;g=b+24|0;h=b|0;while(1){i=Ad(b,e)|0;j=a[e]|0;if(!(i&(j&1)==0)){k=12;break}if((c[f>>2]|0)!=28){continue}if((c[g>>2]|0)==(d|0)){break}}if((k|0)==12){l=(j&1)!=0;return l|0}j=c[h>>2]|0;k=c[j+12>>2]|0;d=c[j+16>>2]|0;if((d|0)==0){l=1;return l|0}else{m=d}while(1){if((m|0)>0&(a[k+m|0]|0)!=13){m=m-1|0}else{break}}g=m+1|0;if((d|0)==(g|0)){l=1;return l|0}m=d-g|0;if((m|0)>0){n=0;o=0}else{l=1;return l|0}while(1){p=(a[k+(o+g)|0]|0)==9?n|7:n;d=o+1|0;if((d|0)<(m|0)){n=p+1|0;o=d}else{break}}if((p|0)==-1){l=1;return l|0}a[j|0]=1;c[(c[h>>2]|0)+4>>2]=c[21];l=0;return l|0}function Fd(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0;d=c[b>>2]|0;b=c[d+12>>2]|0;e=c[d+16>>2]|0;if((e|0)==0){f=1;return f|0}else{g=e}while(1){if((g|0)>0&(a[b+g|0]|0)!=13){g=g-1|0}else{break}}d=g+1|0;if((e|0)==(d|0)){f=1;return f|0}g=e-d|0;if((g|0)>0){h=0;i=0}else{f=1;return f|0}while(1){j=(a[b+(i+d)|0]|0)==9?h|7:h;e=i+1|0;if((e|0)<(g|0)){h=j+1|0;i=e}else{break}}f=j+2|0;return f|0}function Gd(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0;f=b|0;b=c[f>>2]|0;g=c[b+12>>2]|0;h=c[b+16>>2]|0;c[d>>2]=-1;b=h;h=1;i=-1;a:while(1){j=b;while(1){if((j|0)<=0){break a}k=j-1|0;if((a[g+k|0]|0)==13){break}else{j=k}}if((i|0)==-1){c[d>>2]=j;l=j}else{l=i}b=k;h=h+1|0;i=l}if((i|0)==-1){c[d>>2]=0}d=c[(c[f>>2]|0)+16>>2]|0;while(1){f=a[g+d|0]|0;if((f<<24>>24|0)==0|(f<<24>>24|0)==13){break}d=d+1|0}c[e>>2]=d;return h|0}function Hd(a){a=a|0;var b=0;b=a+20|0;c[b>>2]=(c[b>>2]|0)-14;return}function Id(a){a=a|0;var b=0;b=a+20|0;if((c[b>>2]|0)!=75){return}c[b>>2]=74;return}function Jd(a){a=a|0;var b=0,d=0,e=0;b=a+20|0;if((c[b>>2]|0)!=22){d=0;return d|0}e=a+32|0;if((c[e>>2]|0)!=13){d=0;return d|0}c[b>>2]=21;c[e>>2]=6;c[a+24>>2]=0;c[a+28>>2]=0;d=1;return d|0}function Kd(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;d=i;i=i+8|0;e=d|0;f=b+20|0;if((c[f>>2]|0)!=22){g=1;i=d;return g|0}h=b+32|0;if((c[h>>2]|0)!=13){g=1;i=d;return g|0}j=b+24|0;k=c[j>>2]|0;a[e]=0;if(!(Ad(b,e)|0)){g=0;i=d;return g|0}e=c[f>>2]|0;if((e|0)==68){c[j>>2]=c[j>>2]|-2147483648;g=1;i=d;return g|0}else if((e|0)==67){c[j>>2]=-(c[j>>2]|0);g=1;i=d;return g|0}else{e=b+41|0;l=(a[e]|0)-1&255;a[e]=l;e=l&3;c[b+8>>2]=c[b+44+(e<<2)>>2];a[b+12|0]=a[b+60+e|0]|0;c[f>>2]=22;c[b+36>>2]=-1;c[h>>2]=13;c[j>>2]=k;g=1;i=d;return g|0}return 0}function Ld(b,e){b=b|0;e=e|0;var f=0,g=0;f=je(c[b+4>>2]|0,e)|0;c[b+16>>2]=f;if((f|0)==0){c[b+20>>2]=0;c[b+24>>2]=0;c[b+28>>2]=0;c[b+36>>2]=-1;c[b+32>>2]=-1;return 1}e=c[f+4>>2]|0;c[b+20>>2]=e;c[b+24>>2]=c[f+8>>2];c[b+28>>2]=c[f+12>>2];g=b+40|0;if((a[f+21|0]&1)!=0){a[g]=1;c[b+36>>2]=d[f+20|0]|0;return 1}a[g]=0;g=a[f+20|0]|0;c[b+32>>2]=g&255;f=(e|0)==22;if(f&g<<24>>24==16){c[b+36>>2]=88}if(!(f&g<<24>>24==18)){return 1}c[b+36>>2]=90;return 1}function Md(a){a=a|0;mg((c[a>>2]|0)+206104|0,a+64|0)|0;return}function Nd(){var a=0;a=c[4874]|0;return c[a+206700+((c[a+206696>>2]|0)-1<<2)>>2]|0}function Od(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=i;i=i+8|0;g=f|0;c[(c[4874]|0)+206684>>2]=d&1;a[(c[4874]|0)+206692|0]=b&1;a[(c[4874]|0)+206694|0]=e&1;c[(c[4874]|0)+206696>>2]=0;a[(c[4874]|0)+206693|0]=0;c[(c[4874]|0)+206768>>2]=0;a[g]=0;if(!(Ad(c[4872]|0,g)|0)){h=0;i=f;return h|0}e=c[(c[4874]|0)+16>>2]|0;Dd(c[4872]|0);c[(c[4874]|0)+206688>>2]=11;Pd((c[(c[4874]|0)+206688>>2]|0)-1|0);if((a[c[4874]|0]&1)!=0){h=0;i=f;return h|0}Dd(c[4872]|0);if(!(Ad(c[4872]|0,g)|0)){h=0;i=f;return h|0}c[(c[4874]|0)+16>>2]=e;h=1;i=f;return h|0}function Pd(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;d=i;i=i+16|0;e=d|0;f=d+8|0;c[e>>2]=b;if((b|0)<0){Qd(e)}else{Pd(b-1|0)}if((a[c[4874]|0]&1)!=0){i=d;return}a[f]=0;b=c[e>>2]|0;e=b-1|0;while(1){if(!(Ad(c[4872]|0,f)|0)){g=18;break}h=c[4872]|0;if((c[h+20>>2]|0)!=22){g=8;break}if((11193743>>>((c[h+32>>2]|0)>>>0)&1|0)==0){j=h}else{k=c[4874]|0;l=k+206684|0;if((c[l>>2]|0)==2){g=12;break}c[l>>2]=1;j=c[4872]|0}if((b|0)!=(c[j+24>>2]|0)){g=14;break}l=c[4874]|0;c[l+206772+(c[l+206768>>2]<<2)>>2]=c[j+32>>2];l=(c[4874]|0)+206768|0;c[l>>2]=(c[l>>2]|0)+1;l=c[4874]|0;m=c[l+16>>2]|0;n=c[l+20>>2]|0;Pd(e);l=c[4874]|0;if((a[l|0]&1)!=0){g=18;break}c[l+16>>2]=m;c[(c[4874]|0)+20>>2]=n;n=(c[4874]|0)+206696|0;c[n>>2]=(c[n>>2]|0)-1;if(!(Sd()|0)){g=18;break}n=(c[4874]|0)+206768|0;c[n>>2]=(c[n>>2]|0)-1;if((a[f]&1)!=0){g=18;break}}if((g|0)==8){Dd(h);i=d;return}else if((g|0)==12){a[k|0]=1;c[(c[4874]|0)+4>>2]=c[88];i=d;return}else if((g|0)==14){Dd(j);i=d;return}else if((g|0)==18){i=d;return}}function Qd(b){b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;i=i+16|0;e=d|0;f=d+8|0;a[e]=0;g=c[4872]|0;do{Ad(g,e)|0;g=c[4872]|0;if((c[g+20>>2]|0)!=22){break}if((c[g+32>>2]|0)!=12){break}}while((a[e]&1)==0);a[f]=0;do{if(!(Rd(f)|0)){if((a[c[4874]|0]&1)==0){break}i=d;return}}while(0);if((a[f]&1)!=0){f=c[4874]|0;e=c[f+206696>>2]|0;if((e|0)>9){a[f|0]=1;c[(c[4874]|0)+4>>2]=c[63];i=d;return}else{c[f+206700+(e<<2)>>2]=c[f+206764>>2];f=(c[4874]|0)+206696|0;c[f>>2]=(c[f>>2]|0)+1;i=d;return}}if(Jd(c[4872]|0)|0){c[b>>2]=0}f=c[4872]|0;e=c[f+20>>2]|0;if((e|0)==1){c[(c[4874]|0)+206688>>2]=11;Pd((c[(c[4874]|0)+206688>>2]|0)-1|0);Bd(c[4872]|0,2)|0;i=d;return}else if((e|0)==21){do{if((11193743>>>((c[f+32>>2]|0)>>>0)&1|0)==0){h=f}else{e=c[4874]|0;g=e+206684|0;if((c[g>>2]|0)!=2){c[g>>2]=1;h=c[4872]|0;break}a[e|0]=1;c[(c[4874]|0)+4>>2]=c[88];i=d;return}}while(0);c[b>>2]=c[h+24>>2];h=c[4874]|0;f=c[h+16>>2]|0;e=c[h+20>>2]|0;c[h+206772+(c[h+206768>>2]<<2)>>2]=c[(c[4872]|0)+32>>2];h=(c[4874]|0)+206768|0;c[h>>2]=(c[h>>2]|0)+1;Pd((c[b>>2]|0)-1|0);b=c[4874]|0;if((a[b|0]&1)!=0){i=d;return}c[b+16>>2]=f;c[(c[4874]|0)+20>>2]=e;if(!(Sd()|0)){i=d;return}e=(c[4874]|0)+206768|0;c[e>>2]=(c[e>>2]|0)-1;i=d;return}else{e=c[4874]|0;if((a[e+206692|0]&1)==0){i=d;return}a[e|0]=1;c[(c[4874]|0)+4>>2]=c[36];i=d;return}}function Rd(b){b=b|0;var d=0,e=0,f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;d=i;i=i+32|0;e=d|0;f=d+8|0;h=d+16|0;j=d+24|0;a[b]=1;l=c[4872]|0;m=c[l+20>>2]|0;if((m|0)==68){n=c[4874]|0;o=n+206684|0;if((c[o>>2]|0)==1){a[n|0]=1;c[(c[4874]|0)+4>>2]=c[86];p=0;i=d;return p|0}else{c[o>>2]=2;c[(c[4874]|0)+206764>>2]=c[(c[4872]|0)+24>>2];p=1;i=d;return p|0}}else if((m|0)==23){o=c[4874]|0;n=o+206684|0;if((c[n>>2]|0)==1){a[o|0]=1;c[(c[4874]|0)+4>>2]=c[86];p=0;i=d;return p|0}c[n>>2]=2;if(!(Bd(c[4872]|0,1)|0)){p=0;i=d;return p|0}c[(c[4874]|0)+206684>>2]=1;c[(c[4874]|0)+206688>>2]=11;Pd((c[(c[4874]|0)+206688>>2]|0)-1|0);c[(c[4874]|0)+206684>>2]=2;if(!(Bd(c[4872]|0,2)|0)){p=0;i=d;return p|0}n=c[4874]|0;o=n+206696|0;q=(c[o>>2]|0)-1|0;r=c[n+206700+(q<<2)>>2]|0;c[o>>2]=q;g[(c[4874]|0)+206764>>2]=+(r|0);p=1;i=d;return p|0}else if((m|0)==67){r=c[4874]|0;q=r+206684|0;if((c[q>>2]|0)==2){a[r|0]=1;c[(c[4874]|0)+4>>2]=c[78];p=0;i=d;return p|0}else{c[q>>2]=1;c[(c[4874]|0)+206764>>2]=c[(c[4872]|0)+24>>2];p=1;i=d;return p|0}}else if((m|0)==24){q=c[4874]|0;r=q+206684|0;if((c[r>>2]|0)==2){a[q|0]=1;c[(c[4874]|0)+4>>2]=c[78];p=0;i=d;return p|0}c[r>>2]=1;if(!(Bd(c[4872]|0,1)|0)){p=0;i=d;return p|0}c[(c[4874]|0)+206684>>2]=2;c[(c[4874]|0)+206688>>2]=11;Pd((c[(c[4874]|0)+206688>>2]|0)-1|0);c[(c[4874]|0)+206684>>2]=1;if(!(Bd(c[4872]|0,2)|0)){p=0;i=d;return p|0}r=c[4874]|0;q=r+206696|0;o=(c[q>>2]|0)-1|0;n=c[r+206700+(o<<2)>>2]|0;c[q>>2]=o;c[(c[4874]|0)+206764>>2]=~~((c[k>>2]=n,+g[k>>2])+.5);p=1;i=d;return p|0}else{n=c[4874]|0;if((m|0)==25){o=n+206684|0;if((c[o>>2]|0)==2){a[n|0]=1;c[(c[4874]|0)+4>>2]=c[78];p=0;i=d;return p|0}c[o>>2]=1;if(!(Bd(c[4872]|0,1)|0)){p=0;i=d;return p|0}c[(c[4874]|0)+206684>>2]=2;c[(c[4874]|0)+206688>>2]=11;Pd((c[(c[4874]|0)+206688>>2]|0)-1|0);c[(c[4874]|0)+206684>>2]=1;if(!(Bd(c[4872]|0,2)|0)){p=0;i=d;return p|0}o=c[4874]|0;q=o+206696|0;r=(c[q>>2]|0)-1|0;s=c[o+206700+(r<<2)>>2]|0;c[q>>2]=r;c[(c[4874]|0)+206764>>2]=~~(c[k>>2]=s,+g[k>>2]);p=1;i=d;return p|0}do{if((a[n+206694|0]&1)==0){t=l;u=m}else{a[h]=0;if(ze(h)|0){s=c[4872]|0;t=s;u=c[s+20>>2]|0;break}else{p=0;i=d;return p|0}}}while(0);if((u|0)==0){a[(c[4874]|0)+206693|0]=1;u=c[4874]|0;h=c[u+16>>2]|0;m=c[u+20>>2]|0;do{if(Cd(c[4872]|0,7)|0){c[f>>2]=0;if(!(Ae(f)|0)){p=0;i=d;return p|0}if((c[f>>2]|0)!=0){break}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[35];p=0;i=d;return p|0}}while(0);c[(c[4874]|0)+16>>2]=h;c[(c[4874]|0)+20>>2]=m;m=c[4874]|0;h=m+206692|0;if((a[h]&1)!=0){a[m|0]=1;c[(c[4874]|0)+4>>2]=c[134];p=0;i=d;return p|0}if((a[h]&1)!=0){p=1;i=d;return p|0}c[m+206764>>2]=0;p=1;i=d;return p|0}m=c[t+20>>2]|0;if((m|0)==79){if(!(Bd(t,7)|0)){p=0;i=d;return p|0}if(!(Ce(81,(c[(c[4872]|0)+24>>2]|0)>>>8&255)|0)){p=0;i=d;return p|0}p=Rd(b)|0;i=d;return p|0}else if((m|0)==12){h=c[4874]|0;f=h+206684|0;if((c[f>>2]|0)==2){a[h|0]=1;c[(c[4874]|0)+4>>2]=c[78];p=0;i=d;return p|0}c[f>>2]=1;a[j]=0;if(!(Ad(c[4872]|0,j)|0)){p=0;i=d;return p|0}if((a[(c[4874]|0)+206694|0]&1)!=0){Id(c[4872]|0)}j=c[4872]|0;f=c[j+20>>2]|0;if((f-72|0)>>>0<3>>>0){c[(c[4874]|0)+206764>>2]=c[j+24>>2];p=1;i=d;return p|0}if((f|0)!=0){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[37];p=0;i=d;return p|0}a[(c[4874]|0)+206693|0]=1;f=c[4874]|0;j=c[f+16>>2]|0;h=c[f+20>>2]|0;do{if(Cd(c[4872]|0,7)|0){c[e>>2]=0;if(!(Ae(e)|0)){p=0;i=d;return p|0}if((c[e>>2]|0)!=0){break}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[35];p=0;i=d;return p|0}}while(0);c[(c[4874]|0)+16>>2]=j;c[(c[4874]|0)+20>>2]=h;h=c[4874]|0;j=h+206692|0;if((a[j]&1)!=0){a[h|0]=1;c[(c[4874]|0)+4>>2]=c[134];p=0;i=d;return p|0}if((a[j]&1)==0){c[h+206764>>2]=0}a[b]=0;p=1;i=d;return p|0}else if((m|0)==66){h=c[4874]|0;if((a[h+206694|0]&1)==0){a[h|0]=1;c[(c[4874]|0)+4>>2]=c[114];p=0;i=d;return p|0}j=h+206684|0;if((c[j>>2]|0)==2){a[h|0]=1;c[(c[4874]|0)+4>>2]=c[78];p=0;i=d;return p|0}else{c[j>>2]=1;c[(c[4874]|0)+206764>>2]=c[(c[4872]|0)+24>>2];j=(c[4874]|0)+206764|0;c[j>>2]=c[j>>2]|480;p=1;i=d;return p|0}}else if((m|0)==61){j=c[4874]|0;if((a[j+206694|0]&1)==0){a[j|0]=1;c[(c[4874]|0)+4>>2]=c[109];p=0;i=d;return p|0}else{c[j+206764>>2]=c[j+206364>>2]>>2;p=1;i=d;return p|0}}else{if((a[(c[4874]|0)+206694|0]&1)==0){v=m}else{Id(t);v=c[(c[4872]|0)+20>>2]|0}if((v-72|0)>>>0>=3>>>0){a[b]=0;p=1;i=d;return p|0}b=c[4874]|0;v=b+206684|0;if((c[v>>2]|0)==2){a[b|0]=1;c[(c[4874]|0)+4>>2]=c[78];p=0;i=d;return p|0}c[v>>2]=1;v=c[4874]|0;b=c[4872]|0;if((a[v+206694|0]&1)==0){c[v+206764>>2]=c[b+24>>2];p=1;i=d;return p|0}c[v+206764>>2]=c[b+28>>2];b=c[4874]|0;v=b+206764|0;t=c[v>>2]|0;if((t&3|0)!=0){a[b|0]=1;c[(c[4874]|0)+4>>2]=c[18];p=0;i=d;return p|0}c[v>>2]=t>>2;t=c[4874]|0;if((c[t+206764>>2]|0)<=495){p=1;i=d;return p|0}a[t|0]=1;c[(c[4874]|0)+4>>2]=c[19];p=0;i=d;return p|0}}return 0}function Sd(){var b=0,d=0,e=0,f=0,h=0,i=0.0,j=0.0,l=0,m=0,n=0,o=0,p=0,q=0,r=0.0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;b=c[4874]|0;d=c[b+206696>>2]|0;e=b+206700+(d-1<<2)|0;if((a[b+206693|0]&1)!=0){c[e>>2]=0;f=1;return f|0}h=c[e>>2]|0;e=c[b+206700+(d<<2)>>2]|0;i=(c[k>>2]=h,+g[k>>2]);j=(c[k>>2]=e,+g[k>>2]);d=c[b+206772+((c[b+206768>>2]|0)-1<<2)>>2]|0;a:do{switch(d|0){case 5:{if((c[b+206684>>2]|0)==2){l=0;m=(g[k>>2]=i>j?j:i,c[k>>2]|0);break a}else{l=(h|0)>(e|0)?e:h;m=0;break a}break};case 4:{if((c[b+206684>>2]|0)==2){l=0;m=(g[k>>2]=i<j?j:i,c[k>>2]|0);break a}else{l=(h|0)<(e|0)?e:h;m=0;break a}break};case 25:case 26:case 27:case 28:case 29:case 30:{if((c[b+206684>>2]|0)==2){if(i<j){n=1}else{n=i>j?2:4}o=d&n;l=o;m=(o|0)==0?0:1065353216;break a}else{if((h|0)<(e|0)){p=1}else{p=(h|0)>(e|0)?2:4}l=((d&p|0)!=0)<<31>>31;m=0;break a}break};case 11:{l=e^h;m=0;break};case 16:{o=(h|0)!=0&(e|0)!=0;q=o<<31>>31;if((c[b+206684>>2]|0)!=2){l=q;m=0;break a}l=q;m=o?1065353216:0;break};case 19:{l=1<<(h&255);m=0;break};case 6:{if((c[b+206684>>2]|0)==2){l=0;m=(g[k>>2]=-0.0-i,c[k>>2]|0);break a}else{l=-h|0;m=0;break a}break};case 18:{o=(e|h|0)!=0;q=o<<31>>31;if((c[b+206684>>2]|0)!=2){l=q;m=0;break a}l=q;m=o?1065353216:0;break};case 13:{if((c[b+206684>>2]|0)==2){l=0;m=(g[k>>2]=i-j,c[k>>2]|0);break a}else{l=h-e|0;m=0;break a}break};case 12:{if((c[b+206684>>2]|0)==2){l=0;m=(g[k>>2]=i+j,c[k>>2]|0);break a}else{l=e+h|0;m=0;break a}break};case 9:{if((c[b+206684>>2]|0)==2){r=+T(+i);l=0;m=(g[k>>2]=r,c[k>>2]|0);break a}else{l=(h|0)<0?-h|0:h;m=0;break a}break};case 10:{l=e|h;m=0;break};case 21:{o=h>>>16;q=h&65535;s=e>>>16;t=e&65535;l=(((ea(t,o)|0)+(ea(s,q)|0)+((ea(t,q)|0)>>>16)|0)>>>16)+(ea(s,o)|0)|0;m=0;break};case 22:{if((c[b+206684>>2]|0)==2){l=0;m=(g[k>>2]=i/j,c[k>>2]|0);break a}else{l=(h|0)/(e|0)|0;m=0;break a}break};case 31:{o=(h|0)==0;s=o&1;if((c[b+206684>>2]|0)==2){l=s;m=o?1065353216:0;break a}else{l=o?-1:s;m=0;break a}break};case 15:{s=e&255;if((s|0)==0){l=0;m=0;break a}else{u=0;v=0;w=h}while(1){o=w&1|v<<1;q=u+1|0;if((q|0)<(s|0)){u=q;v=o;w=w>>1}else{l=o;m=0;break}}break};case 0:{l=Re(h,e&255)|0;m=0;break};case 2:{l=h>>>((e&255)>>>0);m=0;break};case 3:{l=h<<(e&255);m=0;break};case 14:{l=h>>(e&255);m=0;break};case 1:{l=Qe(h,e&255)|0;m=0;break};case 8:{l=e&h;m=0;break};case 20:{if((c[b+206684>>2]|0)==2){l=0;m=(g[k>>2]=i*j,c[k>>2]|0);break a}else{l=ea(e,h)|0;m=0;break a}break};case 7:{l=~h;m=0;break};case 23:{l=(h|0)%(e|0)|0;m=0;break};case 24:{if((c[b+206684>>2]|0)!=2){if((h|0)<1){l=0;m=0;break a}else{x=0;y=h;z=1}while(1){s=x+1|0;o=y-z|0;q=s<<1|1;if((o|0)<(q|0)){l=s;m=0;break a}else{x=s;y=o;z=q}}}if(i>=0.0){r=+U(i);l=0;m=(g[k>>2]=r,c[k>>2]|0);break a}a[b|0]=1;c[(c[4874]|0)+4>>2]=c[23];f=0;return f|0};case 17:{if((h|0)>-1){A=32;B=h}else{l=32;m=0;break a}while(1){q=A-1|0;o=B<<1;if((o|0)>-1&(q|0)>0){A=q;B=o}else{l=q;m=0;break}}break};default:{l=0;m=0}}}while(0);B=c[4874]|0;c[B+206700+((c[B+206696>>2]|0)-1<<2)>>2]=(c[B+206684>>2]|0)==2?m:l;f=1;return f|0}function Td(){var a=0;c[(c[4874]|0)+275528>>2]=0;c[(c[4874]|0)+275540>>2]=0;ce();if(!(Ud(0)|0)){a=0;return a|0}if(!(Ie(50)|0)){a=0;return a|0}a=ge()|0;return a|0}function Ud(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;d=i;i=i+8|0;e=d|0;a[e]=0;a:while(1){if(!(Ad(c[4872]|0,e)|0)){f=0;g=26;break}h=c[4872]|0;j=c[h+20>>2]|0;do{if((j|0)==28){g=25;break a}else if((j|0)!=84){k=Fd(h)|0;c[4998]=k;if((k|0)<=(b|0)){g=25;break a}l=c[(c[4872]|0)+20>>2]|0;if((l|0)==33){if(!(Se(33,19)|0)){f=0;g=26;break a}m=(c[4872]|0)+8|0;n=c[m>>2]|0;o=c[(c[4874]|0)+52>>2]|0;c[m>>2]=n;c[(c[4874]|0)+52>>2]=o;if(Xd(k,10)|0){p=0}else{f=0;g=26;break a}while(1){m=c[(c[4874]|0)+52>>2]|0;if((p|0)==(m|0)){break}c[(c[4872]|0)+8>>2]=n;c[(c[4874]|0)+52>>2]=o;if(Xd(k,10)|0){p=m}else{f=0;g=26;break a}}Ue();break}else if((l|0)==34){if(!(Se(33,19)|0)){f=0;g=26;break a}o=(c[4872]|0)+8|0;n=c[o>>2]|0;m=c[(c[4874]|0)+52>>2]|0;c[o>>2]=n;c[(c[4874]|0)+52>>2]=m;if(Xd(k,11)|0){q=0}else{f=0;g=26;break a}while(1){o=c[(c[4874]|0)+52>>2]|0;if((q|0)==(o|0)){break}c[(c[4872]|0)+8>>2]=n;c[(c[4874]|0)+52>>2]=m;if(Xd(k,11)|0){q=o}else{f=0;g=26;break a}}Ue();break}else if((l|0)==40){if(Vd(k)|0){break}else{f=0;g=26;break a}}else if((l|0)==38){if(!(Se(38,65)|0)){f=0;g=26;break a}m=(c[4872]|0)+8|0;n=c[m>>2]|0;o=c[(c[4874]|0)+52>>2]|0;c[m>>2]=n;c[(c[4874]|0)+52>>2]=o;if(Zd(k,0)|0){r=0}else{f=0;g=26;break a}while(1){m=c[(c[4874]|0)+52>>2]|0;if((r|0)==(m|0)){break}c[(c[4872]|0)+8>>2]=n;c[(c[4874]|0)+52>>2]=o;if(Zd(k,0)|0){r=m}else{f=0;g=26;break a}}Ue();break}else{if(!(kf()|0)){f=0;g=26;break a}if(Bd(c[4872]|0,84)|0){break}else{f=0;g=26;break a}}}}while(0);if((a[e]&1)!=0){g=25;break}}if((g|0)==25){Dd(c[4872]|0);f=1;i=d;return f|0}else if((g|0)==26){i=d;return f|0}return 0}function Vd(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;d=i;i=i+8|0;e=d|0;if(!(Se(40,3)|0)){f=0;i=d;return f|0}a[e]=0;if(!(Ad(c[4872]|0,e)|0)){f=0;i=d;return f|0}g=c[4872]|0;h=c[g+20>>2]|0;do{if((h|0)==84){a[16344]=0;j=0;k=4;l=g}else if((h|0)==42){j=10;k=12;l=g}else{if((h|0)==43){j=11;k=12;l=g;break}Dd(g);m=c[(c[4872]|0)+8>>2]|0;if(!(of()|0)){f=0;i=d;return f|0}if(!(Ad(c[4872]|0,e)|0)){f=0;i=d;return f|0}c[(c[4872]|0)+8>>2]=m;m=c[4872]|0;if((c[m+20>>2]|0)!=84){j=0;k=14;l=m;break}Te(41);j=0;k=6;l=c[4872]|0}}while(0);e=l+8|0;l=c[e>>2]|0;g=c[(c[4874]|0)+52>>2]|0;c[e>>2]=l;c[(c[4874]|0)+52>>2]=g;if(Nb[k&31](b,j)|0){n=0}else{f=0;i=d;return f|0}while(1){e=c[(c[4874]|0)+52>>2]|0;if((n|0)==(e|0)){break}c[(c[4872]|0)+8>>2]=l;c[(c[4874]|0)+52>>2]=g;if(Nb[k&31](b,j)|0){n=e}else{f=0;o=14;break}}if((o|0)==14){i=d;return f|0}Ue();f=1;i=d;return f|0}function Wd(b,d){b=b|0;d=d|0;var e=0,f=0;if(!(Ie(4)|0)){e=0;return e|0}if(!(We(0)|0)){e=0;return e|0}Ve(c[b>>2]|0,c[(c[4874]|0)+52>>2]|0);f=(c[b>>2]|0)+1|0;c[b>>2]=f;if((f|0)>=18){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[97];e=0;return e|0}if(!(Ye()|0)){e=0;return e|0}if(!(Bd(c[4872]|0,84)|0)){e=0;return e|0}if(!(Ie(d)|0)){e=0;return e|0}e=We(c[b>>2]|0)|0;return e|0}function Xd(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0;e=i;i=i+16|0;f=e|0;g=e+8|0;c[f>>2]=1;h=d&255;a:do{if(Ye()|0){if(!(Bd(c[4872]|0,84)|0)){j=0;break}if(!(Ie(h)|0)){j=0;break}if(!(We(1)|0)){j=0;break}a[g]=0;do{if(!(Ud(b)|0)){j=0;break a}if(!(Ad(c[4872]|0,g)|0)){j=0;break a}if((a[g]&1)!=0){break}d=Fd(c[4872]|0)|0;c[4998]=d;k=c[4872]|0;if((d|0)<(b|0)){l=10;break}d=c[k+20>>2]|0;if((d|0)==36){if(!(Wd(f,11)|0)){j=0;break a}}else if((d|0)==35){if(!(Wd(f,10)|0)){j=0;break a}}else if((d|0)==37){l=15;break}else{l=19;break}}while((a[g]&1)==0);if((l|0)==10){Dd(k)}else if((l|0)==15){if(!(Ie(4)|0)){j=0;break}if(!(We(0)|0)){j=0;break}d=c[f>>2]|0;Ve(d,c[(c[4874]|0)+52>>2]|0);c[f>>2]=d+1;if(!(Bd(c[4872]|0,84)|0)){j=0;break}if(!(Ud(b)|0)){j=0;break}}else if((l|0)==19){Dd(k)}Ve(c[f>>2]|0,c[(c[4874]|0)+52>>2]|0);Ve(0,c[(c[4874]|0)+52>>2]|0);j=1}else{j=0}}while(0);i=e;return j|0}function Yd(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0;e=c[4872]|0;f=c[e+8>>2]|0;g=c[(c[4874]|0)+52>>2]|0;h=0;i=e;while(1){c[i+8>>2]=f;c[(c[4874]|0)+52>>2]=g;if(!(Nb[d&31](a,b)|0)){j=0;k=5;break}e=c[(c[4874]|0)+52>>2]|0;if((h|0)==(e|0)){j=1;k=5;break}h=e;i=c[4872]|0}if((k|0)==5){return j|0}return 0}function Zd(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;d=i;i=i+16|0;e=d|0;f=d+8|0;a:do{if(Xe()|0){if(!(Ye()|0)){g=0;break}if(!(Bd(c[4872]|0,84)|0)){g=0;break}h=c[(c[4872]|0)+8>>2]|0;a[e]=0;j=0;k=0;l=0;m=0;b:while(1){n=m;do{if((n&1)!=0){o=25;break b}if(!(Ad(c[4872]|0,e)|0)){g=0;break a}n=a[e]|0;if((n&1)!=0){o=25;break b}p=c[4872]|0;}while((c[p+20>>2]|0)==84);c[4998]=Fd(p)|0;Dd(c[4872]|0);if((c[4998]|0)<=(b|0)){o=25;break}if(k){o=12;break}n=c[4872]|0;if((c[n+20>>2]|0)==39){if(!(Ad(n,e)|0)){g=0;break a}q=j;r=1;s=c[(c[4874]|0)+16>>2]|0}else{n=j+1|0;if((j|0)>63){o=17;break}while(1){a[f]=0;if(!(nf(f)|0)){g=0;break a}if(!(Ie((a[f]&1)+13&255)|0)){g=0;break a}if(!(We(n)|0)){g=0;break a}if(!(Cd(c[4872]|0,5)|0)){q=n;r=0;s=l;break}}}if(!(Bd(c[4872]|0,8)|0)){g=0;break a}if(!(lf(c[4998]|0)|0)){g=0;break a}j=q;k=r;l=s;m=a[e]|0}if((o|0)==12){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[110];g=0;break}else if((o|0)==17){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[89];g=0;break}else if((o|0)==25){if((j|0)==0){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[102];g=0;break}if(k){c[(c[4872]|0)+8>>2]=l;if(!(Ad(c[4872]|0,e)|0)){g=0;break}m=Fd(c[4872]|0)|0;if(!(Ad(c[4872]|0,e)|0)){g=0;break}if(!(Ud(m)|0)){g=0;break}}if(!(Ie(12)|0)){g=0;break}c[(c[4872]|0)+8>>2]=h;a[e]=0;m=1;n=1;c:while(1){if(!n){break}while(1){if(!(Ad(c[4872]|0,e)|0)){g=0;break a}t=a[e]|0;if((t&1)!=0){break c}u=c[4872]|0;if((c[u+20>>2]|0)==84){v=t}else{c[4998]=Fd(u)|0;Dd(c[4872]|0);if((c[4998]|0)<=(b|0)){break c}u=c[4872]|0;if((c[u+20>>2]|0)!=39){break}if(!(Ad(u,e)|0)){g=0;break a}if(!(Ad(c[4872]|0,e)|0)){g=0;break a}if(!(lf(c[4998]|0)|0)){g=0;break a}v=a[e]|0}if((v&1)!=0){break c}}do{if(!(mf()|0)){g=0;break a}}while(Cd(c[4872]|0,5)|0);Ve(m,c[(c[4874]|0)+52>>2]|0);if(!(Bd(c[4872]|0,8)|0)){g=0;break a}if(!(Ud(c[4998]|0)|0)){g=0;break a}if(!(Ie(12)|0)){g=0;break a}m=m+1|0;n=(a[e]&1)==0}Ve(0,c[(c[4874]|0)+52>>2]|0);g=1;break}}else{g=0}}while(0);i=d;return g|0}function _d(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0;d=i;i=i+8|0;e=d|0;Ve(2,c[(c[4874]|0)+52>>2]|0);if(!(a[16344]|0)){Ve(0,c[(c[4874]|0)+52>>2]|0)}if(!(Ud(b)|0)){f=0;i=d;return f|0}a[e]=0;if(!(Ad(c[4872]|0,e)|0)){f=0;i=d;return f|0}do{if((a[e]&1)==0){g=Fd(c[4872]|0)|0;c[4998]=g;h=c[4872]|0;if((g|0)<(b|0)){Dd(h);j=4;break}g=c[h+20>>2]|0;if((g&-2|0)!=42){Dd(h);j=4;break}a[16344]=1;Ve(0,c[(c[4874]|0)+52>>2]|0);if(!(Ye()|0)){f=0;i=d;return f|0}if(Bd(c[4872]|0,84)|0){j=(g|0)==42?11:10;break}else{f=0;i=d;return f|0}}else{j=4}}while(0);if(!(Ie(j)|0)){f=0;i=d;return f|0}if(!(We(2)|0)){f=0;i=d;return f|0}Ve(1,c[(c[4874]|0)+52>>2]|0);f=1;i=d;return f|0}function $d(a,b){a=a|0;b=b|0;var d=0;Ve(0,c[(c[4874]|0)+52>>2]|0);do{if(Ye()|0){if(!(Bd(c[4872]|0,84)|0)){d=0;break}if(!(Ie(b&255)|0)){d=0;break}if(!(We(1)|0)){d=0;break}if(!(Ud(a)|0)){d=0;break}if(!(Ie(4)|0)){d=0;break}if(!(We(0)|0)){d=0;break}Ve(1,c[(c[4874]|0)+52>>2]|0);d=1}else{d=0}}while(0);return d|0}function ae(a,b){a=a|0;b=b|0;var d=0;do{if(Ye()|0){if(!(Bd(c[4872]|0,84)|0)){d=0;break}if(!(Ie(8)|0)){d=0;break}if(!(We(1)|0)){d=0;break}Ve(2,c[(c[4874]|0)+52>>2]|0);if(!(Ud(a)|0)){d=0;break}Ve(0,c[(c[4874]|0)+52>>2]|0);if(!(Ie(9)|0)){d=0;break}if(!(We(2)|0)){d=0;break}Ve(1,c[(c[4874]|0)+52>>2]|0);d=1}else{d=0}}while(0);return d|0}function be(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;d=i;i=i+40|0;e=d|0;f=d+8|0;g=d+16|0;h=d+24|0;j=d+32|0;a[e]=0;a[f]=0;c[g>>2]=0;c[h>>2]=0;if(!(sf(e,f,g,h)|0)){k=0;i=d;return k|0}a[j]=0;if(!(Ad(c[4872]|0,j)|0)){k=0;i=d;return k|0}l=c[4872]|0;if((c[l+20>>2]|0)!=44){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[62];k=0;i=d;return k|0}m=c[l+8>>2]|0;a[(c[4874]|0)+239672|0]=0;if(!(Ye()|0)){k=0;i=d;return k|0}a[(c[4874]|0)+239672|0]=1;if(!(tf(1,0,a[e]|0,a[f]|0,c[g>>2]|0,c[h>>2]|0)|0)){k=0;i=d;return k|0}Ve(2,c[(c[4874]|0)+52>>2]|0);if(!(Ad(c[4872]|0,j)|0)){k=0;i=d;return k|0}l=c[4874]|0;if((c[(c[4872]|0)+20>>2]|0)!=45){a[l|0]=1;c[(c[4874]|0)+4>>2]=c[75];k=0;i=d;return k|0}a[l+239672|0]=0;if(!(of()|0)){k=0;i=d;return k|0}a[(c[4874]|0)+239672|0]=1;if(!(Ad(c[4872]|0,j)|0)){k=0;i=d;return k|0}l=c[4872]|0;n=c[l+20>>2]|0;do{if((n|0)==46){o=c[l+8>>2]|0;a[(c[4874]|0)+239672|0]=0;if(!(of()|0)){k=0;i=d;return k|0}a[(c[4874]|0)+239672|0]=1;if(!(Bd(c[4872]|0,84)|0)){k=0;i=d;return k|0}if(!(Ud(b)|0)){k=0;i=d;return k|0}Ve(0,c[(c[4874]|0)+52>>2]|0);if(uf(o)|0){p=6;break}else{k=0}i=d;return k|0}else if((n|0)==84){if(Ud(b)|0){Ve(0,c[(c[4874]|0)+52>>2]|0);p=2;break}else{k=0;i=d;return k|0}}else{a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[74];k=0;i=d;return k|0}}while(0);b=(c[4872]|0)+8|0;n=c[b>>2]|0;c[b>>2]=m;if(!(Ye()|0)){k=0;i=d;return k|0}if(!(Ad(c[4872]|0,j)|0)){k=0;i=d;return k|0}if(!(Ye()|0)){k=0;i=d;return k|0}c[(c[4872]|0)+8>>2]=n;if(!(vf(p,a[e]|0,a[f]|0,c[g>>2]|0,c[h>>2]|0)|0)){k=0;i=d;return k|0}if(!(We(2)|0)){k=0;i=d;return k|0}Ve(1,c[(c[4874]|0)+52>>2]|0);k=1;i=d;return k|0}function ce(){a[(c[4874]|0)+239672|0]=1;a[(c[4874]|0)+239673|0]=1;c[(c[4874]|0)+239676>>2]=0;c[(c[4874]|0)+239680>>2]=0;return}function de(){var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;b=c[4874]|0;d=b+239676|0;e=c[d>>2]|0;a:do{if((e|0)>0){f=c[b+16>>2]|0;g=0;while(1){h=g+1|0;if((c[b+272452+(g<<2)>>2]|0)==(f|0)){i=g;break a}if((h|0)<(e|0)){g=h}else{i=h;break}}}else{i=0}}while(0);do{if((i|0)==(e|0)){if((e|0)<=256){c[d>>2]=e+1;g=c[4874]|0;c[g+272452+(e<<2)>>2]=c[g+16>>2];g=c[4874]|0;c[g+274500+(e<<2)>>2]=c[g+239680>>2];break}a[b|0]=1;c[(c[4874]|0)+4>>2]=c[129];j=0;return j|0}else{c[b+239680>>2]=c[b+274500+(i<<2)>>2]}}while(0);c[(c[4874]|0)+275524>>2]=i;j=1;return j|0}function ee(b){b=b|0;var d=0,e=0,f=0,g=0;d=c[4874]|0;e=d+239680|0;f=c[e>>2]|0;if((f|0)>32767){a[d|0]=1;c[(c[4874]|0)+4>>2]=c[130];g=0;return g|0}else{c[e>>2]=f+1;a[(c[4874]|0)+239684+f|0]=b;g=1;return g|0}return 0}function fe(){var b=0;b=c[4874]|0;if((a[b+239673|0]&1)==0){return}c[b+273476+(c[b+275524>>2]<<2)>>2]=c[b+52>>2];return}function ge(){var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;b=c[4874]|0;if((c[b+239676>>2]|0)>0){d=0;e=b}else{f=1;return f|0}while(1){b=(c[e+274500+(d<<2)>>2]|0)+(c[e+52>>2]|0)|0;a[(c[e+48>>2]|0)+(c[e+273476+(d<<2)>>2]|0)|0]=b>>>8|128;g=c[4874]|0;a[(c[g+48>>2]|0)+((c[g+273476+(d<<2)>>2]|0)+1)|0]=b;b=(c[4874]|0)+239676|0;c[b>>2]=(c[b>>2]|0)-1;h=c[4874]|0;if((c[h+239676>>2]|0)>0){d=d+1|0;e=h}else{break}}if((c[h+239680>>2]|0)>0){i=0;j=h}else{f=1;return f|0}while(1){h=i+1|0;if(!(Ie(a[j+239684+i|0]|0)|0)){f=0;k=6;break}e=c[4874]|0;if((h|0)<(c[e+239680>>2]|0)){i=h;j=e}else{f=1;k=6;break}}if((k|0)==6){return f|0}return 0}function he(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;d=Wf(16)|0;e=d;f=d+4|0;c[f>>2]=256;c[d+8>>2]=0;c[d+12>>2]=0;g=Xf(1024)|0;h=d;c[h>>2]=g;c[g>>2]=0;d=1;i=g;while(1){c[i+(d<<2)>>2]=0;g=d+1|0;if((g|0)>=(c[f>>2]|0)){break}d=g;i=c[h>>2]|0}h=b|0;c[h>>2]=e;e=Wf(16)|0;i=e;d=e+4|0;c[d>>2]=8192;c[e+8>>2]=0;c[e+12>>2]=0;f=Xf(32768)|0;g=e;c[g>>2]=f;c[f>>2]=0;e=1;j=f;while(1){c[j+(e<<2)>>2]=0;f=e+1|0;if((f|0)>=(c[d>>2]|0)){break}e=f;j=c[g>>2]|0}c[b+4>>2]=i;i=Wf(16)|0;g=i;j=i+4|0;c[j>>2]=1024;c[i+8>>2]=0;c[i+12>>2]=0;e=Xf(4096)|0;d=i;c[d>>2]=e;c[e>>2]=0;i=1;f=e;while(1){c[f+(i<<2)>>2]=0;e=i+1|0;if((e|0)>=(c[j>>2]|0)){break}i=e;f=c[d>>2]|0}c[b+8>>2]=g;g=c[2540]|0;if((Fb(g|0,7456)|0)==0){return}else{k=0;l=g}do{g=a[l]|0;if(g<<24>>24==0){m=0}else{b=l;d=0;f=g;do{if(f<<24>>24>96){n=(f<<24>>24<123)<<5}else{n=0}g=((f<<24>>24)+d-n|0)*1025|0;d=g>>6^g;b=b+1|0;f=a[b]|0;}while(f<<24>>24!=0);m=d*9|0}f=(m>>11^m)*32769|0;b=c[h>>2]|0;g=Wf(24)|0;c[g>>2]=9848;c[g+4>>2]=c[10152+(k<<4)>>2];c[g+8>>2]=c[10156+(k<<4)>>2];c[g+12>>2]=0;i=(ng(l|0)|0)+1|0;j=Xf((i|0)>-1?i:-1)|0;c[g+16>>2]=j;mg(j|0,l|0)|0;a[g+20|0]=a[10164+(k<<4)|0]|0;a[g+21|0]=a[10165+(k<<4)|0]&1;j=(f>>>0)%((c[b+4>>2]|0)>>>0)|0;i=Wf(16)|0;e=i;c[i>>2]=f;c[i+4>>2]=g;g=(c[b>>2]|0)+(j<<2)|0;c[i+8>>2]=c[g>>2];c[i+12>>2]=0;c[g>>2]=e;g=b+12|0;i=c[g>>2]|0;if((i|0)==0){c[g>>2]=e;c[b+8>>2]=e}else{c[i+12>>2]=e;c[g>>2]=e}k=k+1|0;l=c[10160+(k<<4)>>2]|0;}while((Fb(l|0,7456)|0)!=0);return}function ie(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;b=a|0;d=c[b>>2]|0;if((d|0)!=0){e=d+4|0;f=c[e>>2]|0;g=d|0;h=c[g>>2]|0;if((f|0)>0){i=0;j=h;k=f;while(1){f=c[j+(i<<2)>>2]|0;if((f|0)==0){l=k;m=j}else{me(f);Yf(f);c[(c[g>>2]|0)+(i<<2)>>2]=0;l=c[e>>2]|0;m=c[g>>2]|0}f=i+1|0;if((f|0)<(l|0)){i=f;j=m;k=l}else{n=m;break}}}else{n=h}if((n|0)!=0){Zf(n)}Yf(d)}c[b>>2]=0;b=a+4|0;d=c[b>>2]|0;if((d|0)!=0){n=d+4|0;h=c[n>>2]|0;m=d|0;l=c[m>>2]|0;if((h|0)>0){k=0;j=l;i=h;while(1){h=c[j+(k<<2)>>2]|0;if((h|0)==0){o=i;p=j}else{me(h);Yf(h);c[(c[m>>2]|0)+(k<<2)>>2]=0;o=c[n>>2]|0;p=c[m>>2]|0}h=k+1|0;if((h|0)<(o|0)){k=h;j=p;i=o}else{q=p;break}}}else{q=l}if((q|0)!=0){Zf(q)}Yf(d)}c[b>>2]=0;b=a+8|0;a=c[b>>2]|0;if((a|0)==0){c[b>>2]=0;return}d=a+4|0;q=c[d>>2]|0;l=a|0;p=c[l>>2]|0;if((q|0)>0){o=0;i=p;j=q;while(1){q=c[i+(o<<2)>>2]|0;if((q|0)==0){r=j;s=i}else{me(q);Yf(q);c[(c[l>>2]|0)+(o<<2)>>2]=0;r=c[d>>2]|0;s=c[l>>2]|0}q=o+1|0;if((q|0)<(r|0)){o=q;i=s;j=r}else{t=s;break}}}else{t=p}if((t|0)!=0){Zf(t)}Yf(a);c[b>>2]=0;return}function je(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;e=b|0;f=a[d]|0;if(f<<24>>24==0){g=0}else{h=d;i=0;j=f;do{if(j<<24>>24>96){k=(j<<24>>24<123)<<5}else{k=0}f=((j<<24>>24)+i-k|0)*1025|0;i=f>>6^f;h=h+1|0;j=a[h]|0;}while(j<<24>>24!=0);g=i*9|0}i=(g>>11^g)*32769|0;g=c[e>>2]|0;e=c[(c[g>>2]|0)+(((i>>>0)%((c[g+4>>2]|0)>>>0)|0)<<2)>>2]|0;a:do{if((e|0)!=0){g=e;while(1){if((c[g>>2]|0)==(i|0)){l=g;break}g=c[g+8>>2]|0;if((g|0)==0){break a}}while(1){m=c[l+4>>2]|0;if((tg(c[m+16>>2]|0,d|0)|0)==0){break}g=c[l+8>>2]|0;if((g|0)==0){break a}if((c[g>>2]|0)==(c[l>>2]|0)){l=g}else{break a}}n=m;return n|0}}while(0);m=c[b+4>>2]|0;l=c[(c[m>>2]|0)+(((i>>>0)%((c[m+4>>2]|0)>>>0)|0)<<2)>>2]|0;b:do{if((l|0)!=0){m=l;while(1){if((c[m>>2]|0)==(i|0)){o=m;break}m=c[m+8>>2]|0;if((m|0)==0){break b}}while(1){p=c[o+4>>2]|0;if((tg(c[p+16>>2]|0,d|0)|0)==0){break}m=c[o+8>>2]|0;if((m|0)==0){break b}if((c[m>>2]|0)==(c[o>>2]|0)){o=m}else{break b}}n=p;return n|0}}while(0);p=c[b+8>>2]|0;b=c[(c[p>>2]|0)+(((i>>>0)%((c[p+4>>2]|0)>>>0)|0)<<2)>>2]|0;if((b|0)==0){n=0;return n|0}else{q=b}while(1){if((c[q>>2]|0)==(i|0)){r=q;break}b=c[q+8>>2]|0;if((b|0)==0){n=0;s=27;break}else{q=b}}if((s|0)==27){return n|0}while(1){t=c[r+4>>2]|0;if((tg(c[t+16>>2]|0,d|0)|0)==0){s=24;break}q=c[r+8>>2]|0;if((q|0)==0){n=0;s=27;break}if((c[q>>2]|0)==(c[r>>2]|0)){r=q}else{n=0;s=27;break}}if((s|0)==24){n=t;return n|0}else if((s|0)==27){return n|0}return 0}



function ke(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;se(d,e&255,f,g)|0;i=Wf(24)|0;c[i>>2]=9848;j=i+16|0;c[j>>2]=0;k=(ng(d|0)|0)+1|0;l=Xf((k|0)>-1?k:-1)|0;c[j>>2]=l;mg(l|0,d|0)|0;c[i+4>>2]=e;c[i+8>>2]=f;c[i+12>>2]=g;a[i+21|0]=0;a[i+20|0]=0;if(h){h=b+8|0;g=a[l]|0;if(g<<24>>24==0){m=0}else{f=l;e=0;d=g;do{if(d<<24>>24>96){n=(d<<24>>24<123)<<5}else{n=0}g=((d<<24>>24)+e-n|0)*1025|0;e=g>>6^g;f=f+1|0;d=a[f]|0;}while(d<<24>>24!=0);m=e*9|0}e=(m>>11^m)*32769|0;m=c[h>>2]|0;h=(e>>>0)%((c[m+4>>2]|0)>>>0)|0;d=Wf(16)|0;f=d;c[d>>2]=e;c[d+4>>2]=i;e=(c[m>>2]|0)+(h<<2)|0;c[d+8>>2]=c[e>>2];c[d+12>>2]=0;c[e>>2]=f;e=m+12|0;d=c[e>>2]|0;if((d|0)==0){c[e>>2]=f;c[m+8>>2]=f;return}else{c[d+12>>2]=f;c[e>>2]=f;return}}else{f=b+4|0;b=a[l]|0;if(b<<24>>24==0){o=0}else{e=l;l=0;d=b;do{if(d<<24>>24>96){p=(d<<24>>24<123)<<5}else{p=0}b=((d<<24>>24)+l-p|0)*1025|0;l=b>>6^b;e=e+1|0;d=a[e]|0;}while(d<<24>>24!=0);o=l*9|0}l=(o>>11^o)*32769|0;o=c[f>>2]|0;f=(l>>>0)%((c[o+4>>2]|0)>>>0)|0;d=Wf(16)|0;e=d;c[d>>2]=l;c[d+4>>2]=i;i=(c[o>>2]|0)+(f<<2)|0;c[d+8>>2]=c[i>>2];c[d+12>>2]=0;c[i>>2]=e;i=o+12|0;d=c[i>>2]|0;if((d|0)==0){c[i>>2]=e;c[o+8>>2]=e;return}else{c[d+12>>2]=e;c[i>>2]=e;return}}}function le(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;if(!b){b=a+4|0;d=c[b>>2]|0;if((d|0)!=0){e=d+4|0;f=c[e>>2]|0;g=d|0;h=c[g>>2]|0;if((f|0)>0){i=0;j=h;k=f;while(1){f=c[j+(i<<2)>>2]|0;if((f|0)==0){l=k;m=j}else{me(f);Yf(f);c[(c[g>>2]|0)+(i<<2)>>2]=0;l=c[e>>2]|0;m=c[g>>2]|0}f=i+1|0;if((f|0)<(l|0)){i=f;j=m;k=l}else{n=m;break}}}else{n=h}if((n|0)!=0){Zf(n)}Yf(d)}d=Wf(16)|0;n=d;h=d+4|0;c[h>>2]=8192;c[d+8>>2]=0;c[d+12>>2]=0;m=Xf(32768)|0;l=d;c[l>>2]=m;c[m>>2]=0;d=1;k=m;while(1){c[k+(d<<2)>>2]=0;m=d+1|0;if((m|0)>=(c[h>>2]|0)){break}d=m;k=c[l>>2]|0}c[b>>2]=n}n=a+8|0;a=c[n>>2]|0;if((a|0)!=0){b=a+4|0;l=c[b>>2]|0;k=a|0;d=c[k>>2]|0;if((l|0)>0){h=0;m=d;j=l;while(1){l=c[m+(h<<2)>>2]|0;if((l|0)==0){o=j;p=m}else{me(l);Yf(l);c[(c[k>>2]|0)+(h<<2)>>2]=0;o=c[b>>2]|0;p=c[k>>2]|0}l=h+1|0;if((l|0)<(o|0)){h=l;m=p;j=o}else{q=p;break}}}else{q=d}if((q|0)!=0){Zf(q)}Yf(a)}a=Wf(16)|0;q=a;d=a+4|0;c[d>>2]=1024;c[a+8>>2]=0;c[a+12>>2]=0;p=Xf(4096)|0;o=a;c[o>>2]=p;c[p>>2]=0;a=1;j=p;while(1){c[j+(a<<2)>>2]=0;p=a+1|0;if((p|0)>=(c[d>>2]|0)){break}a=p;j=c[o>>2]|0}c[n>>2]=q;return}function me(a){a=a|0;var b=0;b=c[a+8>>2]|0;if((b|0)!=0){me(b);Yf(b)}b=c[a+4>>2]|0;if((b|0)==0){return}Ib[c[(c[b>>2]|0)+4>>2]&31](b);return}function ne(a){a=a|0;var b=0;c[a>>2]=9848;b=c[a+16>>2]|0;if((b|0)==0){return}Zf(b);return}function oe(a){a=a|0;var b=0,d=0;c[a>>2]=9848;b=c[a+16>>2]|0;if((b|0)==0){d=a;Yf(d);return}Zf(b);d=a;Yf(d);return}function pe(a,b){a=a|0;b=b|0;c[4862]=a;c[4858]=b;c[(c[4874]|0)+206368>>2]=0;return}function qe(b){b=b|0;var d=0,e=0,f=0,g=0;d=c[4874]|0;e=d+206368|0;f=c[e>>2]|0;if((f|0)<(c[4858]|0)){c[e>>2]=f+1;a[(c[4862]|0)+f|0]=b;g=1;return g|0}else{a[d|0]=1;c[(c[4874]|0)+4>>2]=c[95];g=0;return g|0}return 0}function re(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0;d=a[b]|0;if(d<<24>>24==0){e=1;return e|0}else{f=1;g=d}while(1){h=c[4874]|0;d=h+206368|0;i=c[d>>2]|0;if((i|0)>=(c[4858]|0)){break}c[d>>2]=i+1;a[(c[4862]|0)+i|0]=g;i=a[b+f|0]|0;if(i<<24>>24==0){e=1;j=5;break}else{f=f+1|0;g=i}}if((j|0)==5){return e|0}a[h|0]=1;c[(c[4874]|0)+4>>2]=c[95];e=0;return e|0}function se(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;g=i;i=i+320|0;h=g|0;j=h|0;$a(j|0,5624,(k=i,i=i+8|0,c[k>>2]=d&255,k)|0)|0;i=k;d=a[j]|0;a:do{if(d<<24>>24!=0){l=1;m=d;while(1){n=c[4874]|0;o=n+206368|0;p=c[o>>2]|0;if((p|0)>=(c[4858]|0)){break}c[o>>2]=p+1;a[(c[4862]|0)+p|0]=m;p=a[h+l|0]|0;if(p<<24>>24==0){break a}else{l=l+1|0;m=p}}a[n|0]=1;c[(c[4874]|0)+4>>2]=c[95];q=0;i=g;return q|0}}while(0);$a(j|0,8296,(k=i,i=i+16|0,c[k>>2]=e,c[k+8>>2]=f,k)|0)|0;i=k;f=a[j]|0;b:do{if(f<<24>>24!=0){e=1;n=f;while(1){r=c[4874]|0;d=r+206368|0;m=c[d>>2]|0;if((m|0)>=(c[4858]|0)){break}c[d>>2]=m+1;a[(c[4862]|0)+m|0]=n;m=a[h+e|0]|0;if(m<<24>>24==0){break b}else{e=e+1|0;n=m}}a[r|0]=1;c[(c[4874]|0)+4>>2]=c[95];q=0;i=g;return q|0}}while(0);$a(j|0,6424,(k=i,i=i+8|0,c[k>>2]=b,k)|0)|0;i=k;k=a[j]|0;if(k<<24>>24==0){q=1;i=g;return q|0}else{s=1;t=k}while(1){u=c[4874]|0;k=u+206368|0;j=c[k>>2]|0;if((j|0)>=(c[4858]|0)){break}c[k>>2]=j+1;a[(c[4862]|0)+j|0]=t;j=a[h+s|0]|0;if(j<<24>>24==0){q=1;v=13;break}else{s=s+1|0;t=j}}if((v|0)==13){i=g;return q|0}a[u|0]=1;c[(c[4874]|0)+4>>2]=c[95];q=0;i=g;return q|0}function te(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;f=i;i=i+8|0;g=f|0;h=g|0;$a(h|0,5408,(j=i,i=i+8|0,c[j>>2]=b,j)|0)|0;i=j;k=a[h]|0;a:do{if(k<<24>>24==0){l=0}else{m=1;n=k;while(1){o=c[4874]|0;p=o+206368|0;q=c[p>>2]|0;if((q|0)>=(c[4858]|0)){break}c[p>>2]=q+1;a[(c[4862]|0)+q|0]=n;q=a[g+m|0]|0;if(q<<24>>24==0){l=0;break a}else{m=m+1|0;n=q}}a[o|0]=1;c[(c[4874]|0)+4>>2]=c[95];r=0;i=f;return r|0}}while(0);b:while(1){do{if((l|0)<(e|0)){$a(h|0,3640,(j=i,i=i+8|0,c[j>>2]=d[(c[(c[4874]|0)+48>>2]|0)+(l+b)|0]|0,j)|0)|0;i=j;o=a[h]|0;if(o<<24>>24==0){break}else{s=1;t=o}while(1){u=c[4874]|0;o=u+206368|0;k=c[o>>2]|0;if((k|0)>=(c[4858]|0)){v=10;break b}c[o>>2]=k+1;a[(c[4862]|0)+k|0]=t;k=a[g+s|0]|0;if(k<<24>>24==0){break}else{s=s+1|0;t=k}}}else{w=c[4874]|0;k=w+206368|0;o=c[k>>2]|0;if((o|0)>=(c[4858]|0)){v=12;break b}c[k>>2]=o+1;a[(c[4862]|0)+o|0]=32;x=c[4874]|0;o=x+206368|0;k=c[o>>2]|0;if((k|0)>=(c[4858]|0)){v=14;break b}c[o>>2]=k+1;a[(c[4862]|0)+k|0]=32;y=c[4874]|0;k=y+206368|0;o=c[k>>2]|0;if((o|0)>=(c[4858]|0)){v=17;break b}c[k>>2]=o+1;a[(c[4862]|0)+o|0]=32}}while(0);o=l+1|0;if((o|0)<17){l=o}else{v=5;break}}if((v|0)==5){c:do{if((e|0)>0){l=0;while(1){z=c[4874]|0;t=a[(c[z+48>>2]|0)+(l+b)|0]|0;s=z+206368|0;g=c[s>>2]|0;if((g|0)>=(c[4858]|0)){break}c[s>>2]=g+1;a[(c[4862]|0)+g|0]=(t-32&255)>>>0>94>>>0?46:t;l=l+1|0;if((l|0)>=(e|0)){break c}}a[z|0]=1;c[(c[4874]|0)+4>>2]=c[95];r=0;i=f;return r|0}}while(0);z=c[4874]|0;e=z+206368|0;b=c[e>>2]|0;if((b|0)<(c[4858]|0)){c[e>>2]=b+1;a[(c[4862]|0)+b|0]=13;r=1;i=f;return r|0}else{a[z|0]=1;c[(c[4874]|0)+4>>2]=c[95];r=0;i=f;return r|0}}else if((v|0)==10){a[u|0]=1;c[(c[4874]|0)+4>>2]=c[95];r=0;i=f;return r|0}else if((v|0)==12){a[w|0]=1;c[(c[4874]|0)+4>>2]=c[95];r=0;i=f;return r|0}else if((v|0)==14){a[x|0]=1;c[(c[4874]|0)+4>>2]=c[95];r=0;i=f;return r|0}else if((v|0)==17){a[y|0]=1;c[(c[4874]|0)+4>>2]=c[95];r=0;i=f;return r|0}return 0}function ue(){var b=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;b=i;i=i+256|0;e=b|0;f=e|0;$a(f|0,3144,(g=i,i=i+8|0,c[g>>2]=c[(c[4874]|0)+52>>2],g)|0)|0;i=g;h=a[f]|0;a:do{if(h<<24>>24!=0){j=1;k=h;while(1){l=c[4874]|0;m=l+206368|0;n=c[m>>2]|0;if((n|0)>=(c[4858]|0)){break}c[m>>2]=n+1;a[(c[4862]|0)+n|0]=k;n=a[e+j|0]|0;if(n<<24>>24==0){break a}else{j=j+1|0;k=n}}a[l|0]=1;c[(c[4874]|0)+4>>2]=c[95];o=0;i=b;return o|0}}while(0);$a(f|0,2656,(g=i,i=i+8|0,c[g>>2]=d[(c[4874]|0)+197852|0]|0,g)|0)|0;i=g;l=a[f]|0;b:do{if(l<<24>>24!=0){h=1;k=l;while(1){p=c[4874]|0;j=p+206368|0;n=c[j>>2]|0;if((n|0)>=(c[4858]|0)){break}c[j>>2]=n+1;a[(c[4862]|0)+n|0]=k;n=a[e+h|0]|0;if(n<<24>>24==0){break b}else{h=h+1|0;k=n}}a[p|0]=1;c[(c[4874]|0)+4>>2]=c[95];o=0;i=b;return o|0}}while(0);$a(f|0,2024,(g=i,i=i+8|0,c[g>>2]=c[(c[4874]|0)+197856>>2],g)|0)|0;i=g;g=a[f]|0;c:do{if(g<<24>>24==0){q=0}else{f=1;p=g;while(1){r=c[4874]|0;l=r+206368|0;k=c[l>>2]|0;if((k|0)>=(c[4858]|0)){break}c[l>>2]=k+1;a[(c[4862]|0)+k|0]=p;k=a[e+f|0]|0;if(k<<24>>24==0){q=0;break c}else{f=f+1|0;p=k}}a[r|0]=1;c[(c[4874]|0)+4>>2]=c[95];o=0;i=b;return o|0}}while(0);while(1){r=c[(c[4874]|0)+52>>2]|0;if((r|0)<=(q|0)){o=1;s=15;break}e=q+16|0;if(te(q,(e|0)<(r|0)?16:r-q|0)|0){q=e}else{o=0;s=15;break}}if((s|0)==15){i=b;return o|0}return 0}function ve(b){b=b|0;var d=0,e=0,f=0,g=0;d=c[4874]|0;if((a[d+206363|0]&1)==0){e=1;return e|0}f=d+206368|0;g=c[f>>2]|0;if((g|0)<(c[4858]|0)){c[f>>2]=g+1;a[(c[4862]|0)+g|0]=b;e=1;return e|0}else{a[d|0]=1;c[(c[4874]|0)+4>>2]=c[95];e=0;return e|0}return 0}function we(a){a=a|0;if((a-48&255)>>>0<10>>>0|a<<24>>24==95){return 1}else{return(a-65&255)>>>0<26>>>0|0}return 0}function xe(a){a=a|0;return((a-97&255)>>>0<26>>>0?a-32&255:a)|0}function ye(b,c,d){b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0;e=(b-97&255)>>>0<26>>>0?b-32&255:b;b=e-48&255;a[c]=b;if((b&255)>>>0<10>>>0){f=b;g=3}else{b=e-55&255;a[c]=b;if((e-65&255)>>>0<6>>>0){f=b;g=3}}do{if((g|0)==3){if(f<<24>>24<d<<24>>24){h=1}else{break}return h|0}}while(0);h=0;return h|0}function ze(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;d=i;i=i+8|0;e=d|0;f=c[4872]|0;if((c[f+20>>2]|0)!=8){a[b]=0;g=1;i=d;return g|0}h=c[(c[4874]|0)+16>>2]|0;a[e]=0;if(!(Ad(f,e)|0)){g=0;i=d;return g|0}e=(c[4872]|0)+64|0;f=a[e]|0;do{if((f-48&255)>>>0<10>>>0|f<<24>>24==95|(f-65&255)>>>0<26>>>0){j=ng(e|0)|0;c[(c[4874]|0)+16>>2]=h;if((j|0)==0){break}k=c[4874]|0;if((j|0)>256){a[k|0]=1;c[(c[4874]|0)+4>>2]=c[120];g=0;i=d;return g|0}else{j=(c[k+197904>>2]|0)+16843009|0;k=c[4872]|0;l=ng(k+64|0)|0;a[k+64+l|0]=j;a[l+1+(k+64)|0]=j>>>8;a[l+2+(k+64)|0]=j>>>16;a[l+3+(k+64)|0]=j>>>24;a[l+4+(k+64)|0]=0;k=c[4872]|0;Ld(k,k+64|0)|0;a[b]=1;g=1;i=d;return g|0}}else{c[(c[4874]|0)+16>>2]=h}}while(0);a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[40];g=0;i=d;return g|0}function Ae(b){b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;i=i+8|0;e=d|0;a[e]=0;if(!(Ad(c[4872]|0,e)|0)){f=0;i=d;return f|0}e=(c[4872]|0)+64|0;g=a[e]|0;if((g-48&255)>>>0<10>>>0|g<<24>>24==95|(g-65&255)>>>0<26>>>0){h=ng(e|0)|0}else{h=0}c[b>>2]=h;f=1;i=d;return f|0}function Be(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0.0,I=0.0;f=i;i=i+136|0;h=f|0;j=f+128|0;k=0;l=0;m=0;n=1;a:while(1){o=k;p=l;q=m;b:while(1){c:do{if(n){r=o;s=p;while(1){t=r;while(1){if((t|0)>=127){u=t;break a}do{v=c[d>>2]|0;c[d>>2]=v+1;w=a[b+v|0]|0;}while(w<<24>>24==95);if((w-48&255)>>>0>=10>>>0){break}a[h+t|0]=w;t=t+1|0}if(w<<24>>24==46){break b}if(!q){x=s;y=w;z=t;break c}if(s){u=t;break a}if(!((w<<24>>24|0)==43|(w<<24>>24|0)==45)){u=t;break a}a[h+t|0]=w;r=t+1|0;s=1}}else{if(q){A=o;B=p;C=15;break a}else{D=o}while(1){if((D|0)>=127){u=D;break a}do{r=c[d>>2]|0;c[d>>2]=r+1;E=a[b+r|0]|0;}while(E<<24>>24==95);if((E-48&255)>>>0>=10>>>0){x=p;y=E;z=D;break c}a[h+D|0]=E;D=D+1|0}}}while(0);if(!((y<<24>>24|0)==101|(y<<24>>24|0)==69)){u=z;break a}a[h+z|0]=y;o=z+1|0;p=x;q=1}a[h+t|0]=46;k=t+1|0;l=s;m=q;n=0}d:do{if((C|0)==15){while(1){C=0;n=A;while(1){if((n|0)>=127){u=n;break d}do{m=c[d>>2]|0;c[d>>2]=m+1;F=a[b+m|0]|0;}while(F<<24>>24==95);if((F-48&255)>>>0>=10>>>0){break}a[h+n|0]=F;n=n+1|0}if(B){u=n;break d}if(!((F<<24>>24|0)==43|(F<<24>>24|0)==45)){u=n;break d}a[h+n|0]=F;A=n+1|0;B=1;C=15}}}while(0);a[h+u|0]=0;if((u|0)==127){G=0;i=f;return G|0}u=h|0;H=+ig(u,j);I=+H;if((c[j>>2]|0)==(u|0)){G=0;i=f;return G|0}if((c[(vb()|0)>>2]|0)==34){G=0;i=f;return G|0}g[e>>2]=I;G=1;i=f;return G|0}function Ce(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;i=i+8|0;f=e|0;a[f]=0;if(!(Ad(c[4872]|0,f)|0)){g=0;i=e;return g|0}f=c[4872]|0;h=f+64|0;j=a[h]|0;do{if((j-48&255)>>>0<10>>>0|j<<24>>24==95|(j-65&255)>>>0<26>>>0){k=ng(h|0)|0;if((k|0)<=0){l=9;break}a[f+64+k|0]=d+1;a[k+1+(f+64)|0]=0;Ld(c[4872]|0,h)|0;k=c[4872]|0;m=c[k+20>>2]|0;if((b|0)==80){if((m|0)==80){g=1;i=e;return g|0}else{a[c[4874]|0]=1;break}}else{if((m-81|0)>>>0>=2>>>0){l=9;break}Hd(k);g=1;i=e;return g|0}}else{l=9}}while(0);do{if((l|0)==9){a[c[4874]|0]=1;if((b|0)==80){break}c[(c[4874]|0)+4>>2]=c[35];g=0;i=e;return g|0}}while(0);c[(c[4874]|0)+4>>2]=c[42];g=0;i=e;return g|0}function De(b){b=b|0;var d=0,e=0,f=0;d=i;i=i+8|0;e=d|0;a[e]=0;Ad(c[4872]|0,e)|0;e=c[(c[4872]|0)+20>>2]|0;if((e|0)==84){a[b]=0;f=1;i=d;return f|0}else if((e|0)==5){a[b]=1;f=1;i=d;return f|0}else{a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[54];f=0;i=d;return f|0}return 0}function Ee(b){b=b|0;var d=0,e=0,f=0;d=i;i=i+8|0;e=d|0;a[e]=0;Ad(c[4872]|0,e)|0;e=c[(c[4872]|0)+20>>2]|0;if((e|0)==5){a[b]=1;f=1;i=d;return f|0}else if((e|0)==2){a[b]=0;f=1;i=d;return f|0}else{a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[57];f=0;i=d;return f|0}return 0}function Fe(b){b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;i=i+8|0;e=d|0;a[e]=0;Ad(c[4872]|0,e)|0;e=c[4872]|0;f=c[e+20>>2]|0;if((f|0)==22){g=2}else if((f|0)==84){a[b]=0;h=1;i=d;return h|0}do{if((g|0)==2){if((c[e+32>>2]|0)!=10){break}a[b]=1;h=1;i=d;return h|0}}while(0);a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[67];h=0;i=d;return h|0}function Ge(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;i=i+8|0;f=e|0;a[f]=0;Ad(c[4872]|0,f)|0;c[b>>2]=c[(c[4874]|0)+16>>2];Dd(c[4872]|0);g=0;a:while(1){Ad(c[4872]|0,f)|0;h=c[4872]|0;if((c[h+20>>2]|0)!=67){j=3;break}k=c[h+24>>2]&255;if(k<<24>>24<32){j=6;break}switch(k<<24>>24){case 124:case 92:case 63:case 62:case 60:case 58:case 47:case 42:case 34:{j=6;break a;break};default:{}}l=g+1|0;a[(c[4874]|0)+206404+g|0]=k;c[d>>2]=c[(c[4874]|0)+20>>2];if((g|0)>252){j=8;break}if(Cd(c[4872]|0,5)|0){g=l}else{j=10;break}}if((j|0)==3){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[85];m=0;i=e;return m|0}else if((j|0)==6){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[84];m=0;i=e;return m|0}else if((j|0)==8){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[76];m=0;i=e;return m|0}else if((j|0)==10){a[(c[4874]|0)+206404+l|0]=0;c[(c[4874]|0)+16>>2]=c[b>>2];c[(c[4874]|0)+20>>2]=c[d>>2];m=1;i=e;return m|0}return 0}function He(){var a=0,b=0,d=0,e=0,f=0;a=c[4874]|0;b=a+165836|0;d=c[b>>2]|0;if((d|0)>999){e=d-1|0;f=a}else{c[b>>2]=d+1;e=d;f=c[4874]|0}c[f+165840+(e<<2)>>2]=c[f+206372>>2];f=c[4874]|0;c[f+169840+(e<<2)>>2]=c[f+206376>>2];f=c[4874]|0;c[f+173840+(e<<2)>>2]=c[f+206380>>2];f=c[4874]|0;c[f+177840+(e<<2)>>2]=c[f+206384>>2];f=c[4874]|0;c[f+181840+(e<<2)>>2]=c[f+206388>>2];f=c[4874]|0;c[f+185840+(e<<2)>>2]=c[f+206392>>2];f=c[4874]|0;c[f+189840+(e<<2)>>2]=c[f+206396>>2];f=c[4874]|0;c[f+193840+(e<<2)>>2]=c[f+206400>>2];return}function Ie(b){b=b|0;var d=0,e=0,f=0,g=0;d=c[4874]|0;e=d+52|0;f=c[e>>2]|0;if((f|0)<(c[d+56>>2]|0)){c[e>>2]=f+1;a[(c[(c[4874]|0)+48>>2]|0)+f|0]=b;g=1;return g|0}else{a[d|0]=1;c[(c[4874]|0)+4>>2]=c[107];g=0;return g|0}return 0}function Je(b){b=b|0;var d=0,e=0,f=0,g=0;d=c[4874]|0;e=d+52|0;f=c[e>>2]|0;if((f+4|0)<(c[d+56>>2]|0)){c[e>>2]=f+1;a[(c[(c[4874]|0)+48>>2]|0)+f|0]=b;f=(c[4874]|0)+52|0;e=c[f>>2]|0;c[f>>2]=e+1;a[(c[(c[4874]|0)+48>>2]|0)+e|0]=b>>>8;e=(c[4874]|0)+52|0;f=c[e>>2]|0;c[e>>2]=f+1;a[(c[(c[4874]|0)+48>>2]|0)+f|0]=b>>>16;f=(c[4874]|0)+52|0;e=c[f>>2]|0;c[f>>2]=e+1;a[(c[(c[4874]|0)+48>>2]|0)+e|0]=b>>>24;g=1;return g|0}else{a[d|0]=1;c[(c[4874]|0)+4>>2]=c[107];g=0;return g|0}return 0}function Ke(){var b=0,d=0,e=0,f=0;b=(c[4874]|0)+197904|0;d=(a[b]|0)+1&31;a[b]=d;if(d<<24>>24!=0){e=1;return e|0}d=b+1|0;f=(a[d]|0)+1&31;a[d]=f;if(f<<24>>24!=0){e=1;return e|0}f=b+2|0;d=(a[f]|0)+1&31;a[f]=d;if(d<<24>>24!=0){e=1;return e|0}d=b+3|0;b=(a[d]|0)+1&31;a[d]=b;if(b<<24>>24!=0){e=1;return e|0}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[96];e=0;return e|0}function Le(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;j=i;i=i+16|0;k=j|0;l=j+8|0;c[k>>2]=0;c[l>>2]=0;if(!(Ge(k,l)|0)){m=0;i=j;return m|0}n=c[b>>2]|0;do{if((n|0)>0){o=(c[4874]|0)+206404|0;p=0;while(1){q=p+1|0;if((Fb(e+(p<<8)|0,o|0)|0)==0){r=6;break}if((q|0)<(n|0)){p=q}else{break}}if((r|0)==6){c[d>>2]=p;m=1;i=j;return m|0}if((n|0)<32){break}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[72+(h<<2)>>2];m=0;i=j;return m|0}}while(0);c[f+(n<<2)>>2]=c[k>>2];c[g+(c[b>>2]<<2)>>2]=c[l>>2];mg(e+(c[b>>2]<<8)|0,(c[4874]|0)+206404|0)|0;c[d>>2]=c[b>>2];c[b>>2]=(c[b>>2]|0)+1;m=1;i=j;return m|0}function Me(b){b=b|0;var d=0,e=0,f=0;d=c[4874]|0;e=c[d+206100>>2]|0;if((e|0)<8192){a[d+197908+e|0]=b;b=(c[4874]|0)+206100|0;c[b>>2]=(c[b>>2]|0)+1;f=1;return f|0}else{a[d|0]=1;c[(c[4874]|0)+4>>2]=c[111];f=0;return f|0}return 0}function Ne(){var b=0,d=0,e=0,f=0,g=0,h=0;b=c[4874]|0;if((a[b+206104|0]|0)==0){d=1;return d|0}else{e=0;f=b}while(1){b=c[f+206100>>2]|0;if((b|0)>=8192){break}a[f+197908+b|0]=a[f+206104+e|0]|0;b=(c[4874]|0)+206100|0;c[b>>2]=(c[b>>2]|0)+1;b=e+1|0;g=c[4874]|0;if(b>>>0<(ng(g+206104|0)|0)>>>0){e=b;f=g}else{d=1;h=5;break}}if((h|0)==5){return d|0}a[f|0]=1;c[(c[4874]|0)+4>>2]=c[111];d=0;return d|0}function Oe(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;e=c[4874]|0;if((c[e+206668>>2]|0)==0){c[e+16>>2]=c[e+206372>>2];f=c[4874]|0;c[f+20>>2]=c[f+206376>>2];f=c[4874]|0;do{if((c[f+206672>>2]|0)==((b?68:67)|0)){if((c[f+206676>>2]|0)==(d|0)){g=1}else{break}return g|0}}while(0);a[f|0]=1;c[(c[4874]|0)+4>>2]=c[121];g=0;return g|0}c[e+206380>>2]=b&1;c[(c[4874]|0)+206384>>2]=d;c[(c[4874]|0)+206388>>2]=0;c[(c[4874]|0)+206392>>2]=0;c[(c[4874]|0)+206396>>2]=0;c[(c[4874]|0)+206400>>2]=0;e=c[4874]|0;f=e+165836|0;h=c[f>>2]|0;if((h|0)>999){i=h-1|0;j=e}else{c[f>>2]=h+1;i=h;j=c[4874]|0}c[j+165840+(i<<2)>>2]=c[j+206372>>2];j=c[4874]|0;c[j+169840+(i<<2)>>2]=c[j+206376>>2];j=c[4874]|0;c[j+173840+(i<<2)>>2]=c[j+206380>>2];j=c[4874]|0;c[j+177840+(i<<2)>>2]=c[j+206384>>2];j=c[4874]|0;c[j+181840+(i<<2)>>2]=c[j+206388>>2];j=c[4874]|0;c[j+185840+(i<<2)>>2]=c[j+206392>>2];j=c[4874]|0;c[j+189840+(i<<2)>>2]=c[j+206396>>2];j=c[4874]|0;c[j+193840+(i<<2)>>2]=c[j+206400>>2];j=c[4874]|0;a:do{if((a[j+206104|0]|0)==0){k=j}else{i=0;h=j;while(1){f=c[h+206100>>2]|0;if((f|0)>=8192){break}a[h+197908+f|0]=a[h+206104+i|0]|0;f=(c[4874]|0)+206100|0;c[f>>2]=(c[f>>2]|0)+1;f=i+1|0;e=c[4874]|0;if(f>>>0<(ng(e+206104|0)|0)>>>0){i=f;h=e}else{k=e;break a}}a[h|0]=1;c[(c[4874]|0)+4>>2]=c[111];g=0;return g|0}}while(0);j=c[k+206100>>2]|0;if((j|0)>=8192){a[k|0]=1;c[(c[4874]|0)+4>>2]=c[111];g=0;return g|0}a[k+197908+j|0]=b?17:16;j=(c[4874]|0)+206100|0;c[j>>2]=(c[j>>2]|0)+1;j=d;k=0;while(1){l=c[4874]|0;i=c[l+206100>>2]|0;if((i|0)>=8192){m=16;break}a[l+197908+i|0]=j;i=(c[4874]|0)+206100|0;c[i>>2]=(c[i>>2]|0)+1;i=k+1|0;if((i|0)<4){j=j>>8;k=i}else{m=18;break}}if((m|0)==16){a[l|0]=1;c[(c[4874]|0)+4>>2]=c[111];g=0;return g|0}else if((m|0)==18){ke(c[4870]|0,(c[4874]|0)+206104|0,b?68:67,d,0,0);g=1;return g|0}return 0}function Pe(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;i=i+8|0;e=d|0;f=c[4874]|0;c[f+206372>>2]=c[f+16>>2];f=c[4874]|0;c[f+206376>>2]=c[f+20>>2];Md(c[4872]|0);a[e]=0;Ad(c[4872]|0,e)|0;e=c[4872]|0;f=c[e+20>>2]|0;do{if((f|0)==3){if(!(Od((b|0)==1,1,0)|0)){g=0;i=d;return g|0}if(!(Bd(c[4872]|0,4)|0)){g=0;i=d;return g|0}h=c[4874]|0;j=h+206660|0;if((a[h+206693|0]&1)!=0){c[j>>2]=0;break}if((c[j>>2]|0)!=1){break}j=c[h+206664>>2]|0;h=(Nd()|0)+j|0;c[(c[4874]|0)+206664>>2]=h;if(Oe(0,j)|0){break}else{g=0}i=d;return g|0}else if((f|0)==5|(f|0)==84){Dd(e);j=c[4874]|0;if((c[j+206660>>2]|0)!=1){break}h=j+206664|0;j=c[h>>2]|0;c[h>>2]=j+1;if(Oe(0,j)|0){break}else{g=0}i=d;return g|0}else if((f|0)==6){if(!(Od((b|0)==1,0,0)|0)){g=0;i=d;return g|0}j=c[4874]|0;if((a[j+206693|0]&1)!=0){break}h=(c[j+206684>>2]|0)==2;if(Oe(h,Nd()|0)|0){break}else{g=0}i=d;return g|0}else{a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[61];g=0;i=d;return g|0}}while(0);g=1;i=d;return g|0}function Qe(a,b){a=a|0;b=b|0;return a>>>((32-b|0)>>>0)|a<<b|0}function Re(a,b){a=a|0;b=b|0;return a<<32-b|a>>>(b>>>0)|0}function Se(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;e=c[4874]|0;f=c[e+275528>>2]|0;if((f|0)>8){a[e|0]=1;c[(c[4874]|0)+4>>2]=c[90];g=0;return g|0}a[e+275532+f|0]=b;b=c[4874]|0;f=c[b+275540>>2]|0;e=b+275528|0;b=c[e>>2]|0;c[e>>2]=b+1;c[(c[4874]|0)+275544+(b<<2)>>2]=f;f=c[4874]|0;b=f+275540|0;e=c[b>>2]|0;if((d|0)>0){h=0;i=f;f=e;while(1){c[i+275576+(f+h<<2)>>2]=65472;j=h+1|0;k=c[4874]|0;l=k+275540|0;m=c[l>>2]|0;if((j|0)<(d|0)){h=j;i=k;f=m}else{n=l;o=m;break}}}else{n=b;o=e}c[n>>2]=o+d;d=c[4874]|0;if((c[d+275540>>2]|0)<=255){g=1;return g|0}a[d|0]=1;c[(c[4874]|0)+4>>2]=c[22];g=0;return g|0}function Te(b){b=b|0;var d=0;d=c[4874]|0;a[(c[d+275528>>2]|0)-1+(d+275532)|0]=b;return}function Ue(){var a=0;a=(c[4874]|0)+275528|0;c[a>>2]=(c[a>>2]|0)-1;a=c[4874]|0;c[a+275540>>2]=c[a+275544+(c[a+275528>>2]<<2)>>2];return}function Ve(a,b){a=a|0;b=b|0;var d=0;d=c[4874]|0;c[d+275576+((c[d+275544+((c[d+275528>>2]|0)-1<<2)>>2]|0)+a<<2)>>2]=b;return}function We(a){a=a|0;var b=0;b=c[4874]|0;return Cf(c[b+275576+((c[b+275544+((c[b+275528>>2]|0)-1<<2)>>2]|0)+a<<2)>>2]|0)|0}function Xe(){var a=0,b=0,d=0;a=c[4874]|0;b=c[a+275576+(c[a+275544+((c[a+275528>>2]|0)-1<<2)>>2]<<2)>>2]|0;do{if((b|0)>255){if(!(Ie(57)|0)){d=0;return d|0}if(Ie(b>>>8&255)|0){break}else{d=0}return d|0}else{if(Ie(56)|0){break}else{d=0}return d|0}}while(0);d=Ie(b&255)|0;return d|0}function Ye(){return Ze(11)|0}function Ze(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0;d=i;i=i+8|0;e=d|0;f=b-1|0;a:do{if((b|0)<1){g=_e()|0}else{if(!(Ze(f)|0)){g=0;break}while(1){a[e]=0;if(!(Ad(c[4872]|0,e)|0)){g=0;break a}h=c[4872]|0;if((c[h+20>>2]|0)!=22){j=6;break}if((c[h+24>>2]|0)!=(f|0)){j=8;break}k=c[h+32>>2]|0;if(!(Ze(f)|0)){g=0;break a}if(!(Ie((k|224)&255)|0)){g=0;break a}}if((j|0)==6){Dd(h);g=1;break}else if((j|0)==8){Dd(h);g=1;break}}}while(0);i=d;return g|0}function _e(){var b=0,d=0,e=0,f=0,g=0,h=0,j=0;b=i;i=i+8|0;d=b|0;a[d]=0;e=c[4872]|0;while(1){if(!(Ad(e,d)|0)){f=0;break}g=c[4872]|0;if((c[g+20>>2]|0)!=22){h=5;break}if((c[g+32>>2]|0)==12){e=g}else{h=5;break}}do{if((h|0)==5){if(!(Kd(g)|0)){f=0;break}Jd(c[4872]|0)|0;e=c[4872]|0;d=c[e+32>>2]|0;j=c[e+20>>2]|0;if((j|0)==1){if(!(Ze(11)|0)){f=0;break}if(!(Bd(c[4872]|0,2)|0)){f=0;break}}else if((j|0)==21){if(!(Ze(c[e+24>>2]|0)|0)){f=0;break}if(!(Ie((d|224)&255)|0)){f=0;break}}else if((j|0)==13){if(!(_e()|0)){f=0;break}if(!(Ie(-105)|0)){f=0;break}if(!(Ie(0)|0)){f=0;break}}else{if(!($e()|0)){f=0;break}}f=1}}while(0);i=b;return f|0}function $e(){var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;b=i;i=i+80|0;d=b|0;e=b+8|0;f=b+16|0;g=b+24|0;h=b+32|0;j=b+40|0;k=b+48|0;l=b+56|0;m=b+64|0;n=b+72|0;o=c[4872]|0;p=c[o+24>>2]|0;a:do{switch(c[o+20>>2]|0){case 23:case 24:case 25:{Dd(o);if(!(Od(1,0,0)|0)){q=0;break a}q=Bf(Nd()|0)|0;break};case 55:{q=gf(p)|0;break};case 57:case 58:{if(!(Af(p>>>6&3)|0)){q=0;break a}q=Ie(p&63)|0;break};case 12:{a[d]=0;a[e]=0;c[f>>2]=0;c[g>>2]=0;if(!(sf(d,e,f,g)|0)){q=0;break a}r=a[d]|0;if((r<<24>>24|0)==66|(r<<24>>24|0)==20){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[41];q=0;break a}else{q=tf(3,0,r,a[e]|0,c[f>>2]|0,c[g>>2]|0)|0;break a}break};case 49:{if(!(Se(49,1)|0)){q=0;break a}if(!(Yd(0,p,10)|0)){q=0;break a}Ue();q=1;break};case 54:{if(!(Ie(63)|0)){q=0;break a}q=Ie(-119)|0;break};case 83:{if(!(Ie(0)|0)){q=0;break a}if(!(Af(p>>>8&255)|0)){q=0;break a}if(!(Ie(5)|0)){q=0;break a}q=Ie(p&255)|0;break};case 52:{if(!(Ie(52)|0)){q=0;break a}q=Ie(-128)|0;break};case 26:{if(!(Bd(o,1)|0)){q=0;break a}if(!(Od(1,0,0)|0)){q=0;break a}if(!(Bf(Nd()|0)|0)){q=0;break a}q=Bd(c[4872]|0,2)|0;break};case 50:{if(!(Ie(56)|0)){q=0;break a}if(!(Ie(4)|0)){q=0;break a}q=Ie(-128)|0;break};case 14:{q=xf(-112)|0;break};case 15:{q=xf(-108)|0;break};case 27:{q=af()|0;break};case 79:{if(!(Cd(o,7)|0)){q=cf(0,p)|0;break a}if(!(Ce(81,p>>>8&255)|0)){q=0;break a}q=Bf(c[(c[4872]|0)+24>>2]|0)|0;break};case 51:{if(!(Ie(53)|0)){q=0;break a}q=Ie(-64)|0;break};case 16:{q=xf(-120)|0;break};case 17:{q=zf(-96)|0;break};case 18:{q=zf(-80)|0;break};case 9:{q=df(2)|0;break};case 67:case 68:{q=Bf(p)|0;break};default:{a[h]=0;a[j]=0;c[k>>2]=0;c[l>>2]=0;a[m]=0;if(!(rf(m,h,j,k,l)|0)){q=0;break a}if((a[m]&1)==0){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[38];q=0;break a}a[n]=0;if(!(Ad(c[4872]|0,n)|0)){q=0;break a}r=c[4872]|0;b:do{switch(c[r+20>>2]|0){case 19:{q=wf(-128,a[h]|0,a[j]|0,c[k>>2]|0,c[l>>2]|0)|0;break a;break};case 15:{q=vf(-100,a[h]|0,a[j]|0,c[k>>2]|0,c[l>>2]|0)|0;break a;break};case 22:{s=(c[r+32>>2]|192)&255;if(!(Ad(r,n)|0)){q=0;break a}t=c[4872]|0;if((c[t+20>>2]|0)==6){q=wf(s,a[h]|0,a[j]|0,c[k>>2]|0,c[l>>2]|0)|0;break a}else{Dd(t);u=s;v=c[4872]|0;break b}break};case 16:{q=vf(-116,a[h]|0,a[j]|0,c[k>>2]|0,c[l>>2]|0)|0;break a;break};case 14:{q=vf(-104,a[h]|0,a[j]|0,c[k>>2]|0,c[l>>2]|0)|0;break a;break};case 17:{q=yf(-88,a[h]|0,a[j]|0,c[k>>2]|0,c[l>>2]|0)|0;break a;break};case 18:{q=yf(-72,a[h]|0,a[j]|0,c[k>>2]|0,c[l>>2]|0)|0;break a;break};default:{u=-128;v=r}}}while(0);Dd(v);q=tf(0,u,a[h]|0,a[j]|0,c[k>>2]|0,c[l>>2]|0)|0}}}while(0);i=b;return q|0}function af(){var b=0,d=0,e=0,f=0,g=0,h=0,j=0;b=i;i=i+8|0;d=b|0;e=c[4874]|0;a:do{if((a[e+239672|0]&1)==0){a[e|0]=1;c[(c[4874]|0)+4>>2]=c[122];f=0}else{if(!(Bd(c[4872]|0,1)|0)){f=0;break}if(!(de()|0)){f=0;break}do{if(!(Od(1,0,0)|0)){f=0;break a}g=Nd()|0;h=c[4874]|0;if((c[h+206684>>2]|0)==2|(g|0)==0|(g|0)>255){j=7;break}if(!(ee(g&255)|0)){f=0;break a}a[d]=0;if(!(Ee(d)|0)){f=0;break a}}while((a[d]&1)!=0);if((j|0)==7){a[h|0]=1;c[(c[4874]|0)+4>>2]=c[118];f=0;break}ee(0)|0;if(!(Ie(-121)|0)){f=0;break}fe();if(!(Ie(-128)|0)){f=0;break}f=Ie(0)|0}}while(0);i=b;return f|0}function bf(a,b){a=a|0;b=b|0;var c=0;do{if(Ie(a)|0){if(!(Af(b>>>8&255)|0)){c=0;break}if(!(Ie(5)|0)){c=0;break}c=Ie(b&255)|0}else{c=0}}while(0);return c|0}function cf(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;i=i+16|0;f=e|0;g=e+8|0;do{if(Ie(b)|0){a[f]=0;c[g>>2]=0;if(!(pf(f,g)|0)){h=0;break}if(!(Bd(c[4872]|0,10)|0)){h=0;break}if(!(Ce(80,d>>>8&255)|0)){h=0;break}j=c[(c[4872]|0)+24>>2]|0;if(!(Af(j>>>8&255)|0)){h=0;break}if((a[f]&1)==0){k=6}else{if(uf(c[g>>2]|0)|0){k=7}else{h=0;break}}if(!(Ie(k)|0)){h=0;break}if(!(Ie(d&255)|0)){h=0;break}h=Ie(j&255)|0}else{h=0}}while(0);i=e;return h|0}function df(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;i=i+8|0;e=d|0;a[e]=0;do{if(Ad(c[4872]|0,e)|0){f=c[4872]|0;g=c[f+20>>2]|0;if((g|0)==83){h=c[f+24>>2]|0;if(!(Ie(b)|0)){j=0;break}if(!(Af(h>>>8&255)|0)){j=0;break}if(!(Ie(5)|0)){j=0;break}j=Ie(h&255)|0;break}else if((g|0)==79){j=cf(b,c[f+24>>2]|0)|0;break}else{a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[43];j=0;break}}else{j=0}}while(0);i=d;return j|0}function ef(b,d){b=b|0;d=d|0;var e=0,f=0,g=0;b=i;i=i+16|0;e=b|0;f=b+8|0;a:do{if(Ie((d&128)>>>0<128>>>0?54:53)|0){if(!(Xe()|0)){g=0;break}if(!(Bd(c[4872]|0,1)|0)){g=0;break}if(!(Ze(11)|0)){g=0;break}if(!(Bd(c[4872]|0,8)|0)){g=0;break}do{a[e]=0;if(!(nf(e)|0)){g=0;break a}if(!(Ie(((a[e]&1)<<1|d)&127)|0)){g=0;break a}a[f]=0;if(!(Ee(f)|0)){g=0;break a}}while((a[f]&1)!=0);if(!(Ie(15)|0)){g=0;break}Ve(0,c[(c[4874]|0)+52>>2]|0);g=1}else{g=0}}while(0);i=b;return g|0}function ff(a){a=a|0;var b=0;if(!(Af(a>>>6&3)|0)){b=0;return b|0}b=Ie(a&63)|0;return b|0}function gf(b){b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;i=i+8|0;e=d|0;do{if(Bd(c[4872]|0,1)|0){a[e]=0;if(!(Ad(c[4872]|0,e)|0)){f=0;break}g=c[4872]|0;if((c[g+20>>2]|0)!=83){Dd(g);Dd(c[4872]|0);if(!(Ie(52)|0)){f=0;break}if(!(Af(b>>>6&3)|0)){f=0;break}f=Ie(b&63)|0;break}h=c[g+24>>2]|0;if(!(Af(h>>>8&255)|0)){f=0;break}if(!(Bf(h)|0)){f=0;break}if(!(Bd(c[4872]|0,5)|0)){f=0;break}if(!(Ze(11)|0)){f=0;break}if(!(Bd(c[4872]|0,2)|0)){f=0;break}if(!(Ie(21)|0)){f=0;break}f=Ie(b&63)|0}else{f=0}}while(0);i=d;return f|0}function hf(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;d=c[4874]|0;e=c[d+275528>>2]|0;f=0;a:while(1){g=e;while(1){if((g|0)==0){h=4;break a}i=g-1|0;j=a[d+275532+i|0]|0;if((j<<24>>24|0)==38){break}else if((j<<24>>24|0)==33){g=i}else if((j<<24>>24|0)==41){h=8;break a}else if((j<<24>>24|0)==40){k=4;break a}else{h=7;break a}}e=i;f=f+8|0}if((h|0)==4){a[d|0]=1;c[(c[4874]|0)+4>>2]=c[128];l=0;return l|0}else if((h|0)==7){a[d|0]=1;c[(c[4874]|0)+4>>2]=c[87];l=0;return l|0}else if((h|0)==8){k=11}do{if((f|0)>0){if(!(Bf(f)|0)){l=0;return l|0}if(Ie(20)|0){m=c[4874]|0;break}else{l=0;return l|0}}else{m=d}}while(0);d=c[m+275544+(i<<2)>>2]|0;if((b&255|0)==0){if(!(Ie(4)|0)){l=0;return l|0}l=Cf(c[(c[4874]|0)+275576+(d<<2)>>2]|0)|0;return l|0}else{if(!(Ie(k)|0)){l=0;return l|0}l=Cf(c[(c[4874]|0)+275576+(d+1<<2)>>2]|0)|0;return l|0}return 0}function jf(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;d=i;i=i+8|0;e=d|0;f=c[4872]|0;g=c[f+8>>2]|0;do{if(Bd(f,1)|0){h=c[(c[4872]|0)+8>>2]|0;if(!(of()|0)){j=0;break}if(!(Bd(c[4872]|0,5)|0)){j=0;break}a[e]=0;if(!(Ad(c[4872]|0,e)|0)){j=0;break}k=c[4872]|0;if((c[k+20>>2]|0)!=83){c[k+8>>2]=g;j=ff(b)|0;break}l=c[k+24>>2]|0;if(!(Af(l>>>8&255)|0)){j=0;break}if(!(Bf(l)|0)){j=0;break}if(!(Bd(c[4872]|0,5)|0)){j=0;break}if(!(Ye()|0)){j=0;break}if(!(Bd(c[4872]|0,2)|0)){j=0;break}if(!(Ie(21)|0)){j=0;break}if(!(uf(h)|0)){j=0;break}if(!(Ie(63)|0)){j=0;break}if(!(Ie(-113)|0)){j=0;break}if(!(Ie(55)|0)){j=0;break}if(!(Ie(97)|0)){j=0;break}if(!(Ie(-47)|0)){j=0;break}j=Ie(44)|0}else{j=0}}while(0);i=d;return j|0}function kf(){var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;b=i;i=i+56|0;d=b|0;e=b+8|0;f=b+16|0;g=b+24|0;h=b+32|0;j=b+40|0;k=b+48|0;l=c[4872]|0;m=c[l+24>>2]|0;a:do{switch(c[l+20>>2]|0){case 48:{a[d]=0;if(!(Ad(l,d)|0)){n=0;break a}Dd(c[4872]|0);if((c[(c[4872]|0)+20>>2]|0)==84){o=m&255}else{if(!(Ye()|0)){n=0;break a}o=(m|1)&255}n=Ie(o)|0;break};case 53:{if(!(Ie(55)|0)){n=0;break a}if(!(Ie(6)|0)){n=0;break a}if(!(Ie(53)|0)){n=0;break a}n=Ie(32)|0;break};case 16:{n=xf(8)|0;break};case 55:{n=gf(m^4)|0;break};case 83:{n=bf(1,m)|0;break};case 17:{n=zf(32)|0;break};case 18:{n=zf(48)|0;break};case 47:{n=hf(m)|0;break};case 56:{n=jf(m)|0;break};case 59:{n=ff(m)|0;break};case 15:{n=xf(20)|0;break};case 14:{n=xf(16)|0;break};case 9:{n=df(3)|0;break};case 58:{n=ff(m^4)|0;break};case 79:{n=cf(1,m)|0;break};default:{Jd(l)|0;p=c[4872]|0;if((c[p+20>>2]|0)==21){n=xf((c[p+32>>2]|64)&255)|0;break a}a[e]=0;a[f]=0;c[g>>2]=0;c[h>>2]=0;a[j]=0;if(!(rf(j,e,f,g,h)|0)){n=0;break a}if((a[j]&1)==0){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[39];n=0;break a}a[k]=0;if(!(Ad(c[4872]|0,k)|0)){n=0;break a}p=c[4872]|0;b:do{switch(c[p+20>>2]|0){case 19:{q=a[e]|0;r=a[f]|0;s=c[g>>2]|0;t=c[h>>2]|0;if(!(Ye()|0)){n=0;break a}n=tf(1,28,q,r,s,t)|0;break a;break};case 22:{t=(c[p+32>>2]|64)&255;if(!(Ad(p,k)|0)){n=0;break a}s=c[4872]|0;if((c[s+20>>2]|0)==6){n=wf(t,a[e]|0,a[f]|0,c[g>>2]|0,c[h>>2]|0)|0;break a}else{Dd(s);u=c[4872]|0;break b}break};case 15:{n=vf(28,a[e]|0,a[f]|0,c[g>>2]|0,c[h>>2]|0)|0;break a;break};case 18:{n=yf(56,a[e]|0,a[f]|0,c[g>>2]|0,c[h>>2]|0)|0;break a;break};case 16:{n=vf(12,a[e]|0,a[f]|0,c[g>>2]|0,c[h>>2]|0)|0;break a;break};case 14:{n=vf(24,a[e]|0,a[f]|0,c[g>>2]|0,c[h>>2]|0)|0;break a;break};case 17:{n=yf(40,a[e]|0,a[f]|0,c[g>>2]|0,c[h>>2]|0)|0;break a;break};default:{u=p}}}while(0);Dd(u);Dd(c[4872]|0);Ad(c[4872]|0,k)|0;a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[135];n=0}}}while(0);i=b;return n|0}function lf(b){b=b|0;var d=0,e=0,f=0,g=0;d=c[4874]|0;e=c[d+52>>2]|0;f=d+239673|0;d=a[f]|0;a[f]=0;if(!(Ud(b)|0)){g=0;return g|0}a[(c[4874]|0)+239673|0]=d&1;c[(c[4874]|0)+52>>2]=e;g=1;return g|0}function mf(){var b=0,d=0,e=0,f=0;b=c[4874]|0;d=c[b+52>>2]|0;e=b+239673|0;b=a[e]|0;a[e]=0;if(!(Ye()|0)){f=0;return f|0}do{if(Cd(c[4872]|0,11)|0){if(Ye()|0){break}else{f=0}return f|0}}while(0);a[(c[4874]|0)+239673|0]=b&1;c[(c[4874]|0)+52>>2]=d;f=1;return f|0}function nf(b){b=b|0;var d=0,e=0;do{if(Ye()|0){if(Cd(c[4872]|0,11)|0){if(Ye()|0){d=1}else{e=0;break}}else{d=0}a[b]=d;e=1}else{e=0}}while(0);return e|0}function of(){var b=0,d=0,e=0,f=0;b=c[4874]|0;d=c[b+52>>2]|0;e=b+239673|0;b=a[e]|0;a[e]=0;if(!(Ye()|0)){f=0;return f|0}a[(c[4874]|0)+239673|0]=b&1;c[(c[4874]|0)+52>>2]=d;f=1;return f|0}function pf(b,d){b=b|0;d=d|0;var e=0,f=0,g=0;a[b]=0;if(!(Cd(c[4872]|0,3)|0)){e=1;return e|0}c[d>>2]=c[(c[4872]|0)+8>>2];d=c[4874]|0;f=c[d+52>>2]|0;g=d+239673|0;d=a[g]|0;a[g]=0;if(!(Ye()|0)){e=0;return e|0}a[(c[4874]|0)+239673|0]=d&1;c[(c[4874]|0)+52>>2]=f;if(!(Bd(c[4872]|0,4)|0)){e=0;return e|0}a[b]=1;e=1;return e|0}function qf(b,d){b=b|0;d=d|0;var e=0,f=0,g=0;a[b]=0;if(!(Cd(c[4872]|0,3)|0)){e=1;return e|0}c[d>>2]=c[(c[4872]|0)+8>>2];d=c[4874]|0;f=c[d+52>>2]|0;g=d+239673|0;d=a[g]|0;a[g]=0;if(!(Ye()|0)){e=0;return e|0}a[(c[4874]|0)+239673|0]=d&1;c[(c[4874]|0)+52>>2]=f;do{if(Cd(c[4872]|0,11)|0){f=c[4874]|0;d=c[f+52>>2]|0;g=f+239673|0;f=a[g]|0;a[g]=0;if(Ye()|0){a[(c[4874]|0)+239673|0]=f&1;c[(c[4874]|0)+52>>2]=d;break}else{e=0;return e|0}}}while(0);if(!(Bd(c[4872]|0,4)|0)){e=0;return e|0}a[b]=1;e=1;return e|0}function rf(b,e,f,g,h){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;j=i;i=i+16|0;k=j|0;l=j+8|0;c[g>>2]=c[(c[4872]|0)+24>>2];c[h>>2]=0;m=c[(c[4872]|0)+20>>2]|0;n=m&255;o=m&255;do{if((o-69|0)>>>0<3>>>0){a[e]=69;if(o>>>0>=71>>>0){break}p=(c[g>>2]|0)+(c[(c[4874]|0)+197888>>2]|0)|0;c[g>>2]=p;if((o|0)!=69){break}c[g>>2]=p+(c[(c[4874]|0)+197884>>2]|0)}else{if((o-72|0)>>>0<3>>>0){a[e]=72;break}if((o-76|0)>>>0<3>>>0){a[e]=76;break}a[e]=n;if((o|0)==29){a[f]=c[(c[4872]|0)+24>>2];if(!(Cd(c[4872]|0,3)|0)){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[65];q=0;i=j;return q|0}c[g>>2]=c[(c[4872]|0)+8>>2];p=c[4874]|0;r=c[p+52>>2]|0;s=p+239673|0;p=a[s]|0;a[s]=0;if(!(Ye()|0)){q=0;i=j;return q|0}a[(c[4874]|0)+239673|0]=p&1;c[(c[4874]|0)+52>>2]=r;if(!(Bd(c[4872]|0,4)|0)){q=0;i=j;return q|0}do{if(Cd(c[4872]|0,3)|0){c[h>>2]=c[(c[4872]|0)+8>>2];r=c[4874]|0;p=c[r+52>>2]|0;s=r+239673|0;r=a[s]|0;a[s]=0;if(!(Ye()|0)){q=0;i=j;return q|0}a[(c[4874]|0)+239673|0]=r&1;c[(c[4874]|0)+52>>2]=p;if(Bd(c[4872]|0,4)|0){break}else{q=0}i=j;return q|0}}while(0);a[b]=1;q=1;i=j;return q|0}a[f]=2;if((o|0)==20){if(!(Cd(c[4872]|0,3)|0)){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[65];q=0;i=j;return q|0}c[g>>2]=c[(c[4872]|0)+8>>2];p=c[4874]|0;r=c[p+52>>2]|0;s=p+239673|0;p=a[s]|0;a[s]=0;if(!(Ye()|0)){q=0;i=j;return q|0}a[(c[4874]|0)+239673|0]=p&1;c[(c[4874]|0)+52>>2]=r;if(!(Bd(c[4872]|0,4)|0)){q=0;i=j;return q|0}a[b]=1;q=1;i=j;return q|0}else if((o|0)==66){a[k]=0;if(!(qf(k,h)|0)){q=0;i=j;return q|0}if((a[k]&1)!=0){a[f]=3}a[b]=1;q=1;i=j;return q|0}else{a[b]=0;q=1;i=j;return q|0}}}while(0);a[f]=n;a[f]=m-(d[e]|0);e=Cd(c[4872]|0,3)|0;m=c[4872]|0;do{if(e){c[h>>2]=c[m+8>>2];n=c[4874]|0;k=c[n+52>>2]|0;o=n+239673|0;n=a[o]|0;a[o]=0;if(!(Ye()|0)){q=0;i=j;return q|0}a[(c[4874]|0)+239673|0]=n&1;c[(c[4874]|0)+52>>2]=k;if(Bd(c[4872]|0,4)|0){break}else{q=0}i=j;return q|0}else{if(!(Cd(m,10)|0)){break}a[l]=0;if(!(Ad(c[4872]|0,l)|0)){q=0;i=j;return q|0}k=c[4872]|0;if((c[k+20>>2]|0)!=29){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[53];q=0;i=j;return q|0}n=c[k+24>>2]|0;if((d[f]|0)>>>0<(n&255)>>>0){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[124];q=0;i=j;return q|0}a[f]=n;if(!(Cd(c[4872]|0,3)|0)){break}c[h>>2]=c[(c[4872]|0)+8>>2];n=c[4874]|0;k=c[n+52>>2]|0;o=n+239673|0;n=a[o]|0;a[o]=0;if(!(Ye()|0)){q=0;i=j;return q|0}a[(c[4874]|0)+239673|0]=n&1;c[(c[4874]|0)+52>>2]=k;if(Bd(c[4872]|0,4)|0){break}else{q=0}i=j;return q|0}}while(0);a[b]=1;q=1;i=j;return q|0}function sf(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0;g=i;i=i+16|0;h=g|0;j=g+8|0;a[h]=0;do{if(Ad(c[4872]|0,h)|0){a[j]=0;if(!(rf(j,b,d,e,f)|0)){k=0;break}if((a[j]&1)!=0){k=1;break}a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[46];k=0}else{k=0}}while(0);i=g;return k|0}function tf(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;do{if((e<<24>>24|0)==29|(e<<24>>24|0)==20){i=(c[4872]|0)+8|0;j=c[i>>2]|0;c[i>>2]=g;if(Ye()|0){c[(c[4872]|0)+8>>2]=j;k=4;break}else{l=0;return l|0}}else if((e<<24>>24|0)==66){k=9}else{k=4}}while(0);a:do{if((k|0)==4){j=(h|0)!=0;do{if(e<<24>>24!=20&j){i=(c[4872]|0)+8|0;m=c[i>>2]|0;c[i>>2]=h;if(Ye()|0){c[(c[4872]|0)+8>>2]=m;break}else{l=0;return l|0}}}while(0);if((e<<24>>24|0)==66){k=9;break}else if((e<<24>>24|0)==69|(e<<24>>24|0)==76){k=16}else if((e<<24>>24|0)==20){n=b|36;break}do{if((k|0)==16){if(f<<24>>24!=2|(g|0)>31|j){break}n=(b&255|g|(e<<24>>24==69?64:96))&255;break a}}while(0);j=f<<5|b|((h|0)==0?-128:-112);if((e<<24>>24|0)==29){n=j;break}else if((e<<24>>24|0)==72){o=j+4&255}else if((e<<24>>24|0)==69){o=j+8&255}else if((e<<24>>24|0)==76){o=j+12&255}else{a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[87];l=0;return l|0}if(!(Ie(o)|0)){l=0;return l|0}do{if((g|0)>127){if(Ie((g>>>8|128)&255)|0){break}else{l=0}return l|0}}while(0);n=g&255}}while(0);do{if((k|0)==9){if(f<<24>>24==2){p=63}else{o=(c[4872]|0)+8|0;e=c[o>>2]|0;c[o>>2]=h;if(!(Ye()|0)){l=0;return l|0}do{if(Cd(c[4872]|0,11)|0){if(Ye()|0){q=62;break}else{l=0}return l|0}else{q=61}}while(0);c[(c[4872]|0)+8>>2]=e;p=q}if(Ie(p)|0){n=((b&255)<<5|g&31|128)&255;break}else{l=0;return l|0}}}while(0);if(!(Ie(n)|0)){l=0;return l|0}do{if(b<<24>>24==2){if(Ie(d)|0){break}else{l=0}return l|0}}while(0);l=1;return l|0}function uf(a){a=a|0;var b=0,d=0,e=0;b=(c[4872]|0)+8|0;d=c[b>>2]|0;c[b>>2]=a;if(!(Ye()|0)){e=0;return e|0}c[(c[4872]|0)+8>>2]=d;e=1;return e|0}function vf(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;return tf(2,a,b,c,d,e)|0}function wf(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0;if(!(Ye()|0)){f=0;return f|0}f=tf(2,a,b,c,d,e)|0;return f|0}function xf(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;d=i;i=i+48|0;e=d|0;f=d+8|0;g=d+16|0;h=d+24|0;j=d+32|0;k=d+40|0;a[g]=0;a[h]=0;c[j>>2]=0;c[k>>2]=0;a[e]=0;if(!(Ad(c[4872]|0,e)|0)){l=0;i=d;return l|0}a[f]=0;if(!(rf(f,g,h,j,k)|0)){l=0;i=d;return l|0}if((a[f]&1)==0){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[46];l=0;i=d;return l|0}else{l=tf(2,b,a[g]|0,a[h]|0,c[j>>2]|0,c[k>>2]|0)|0;i=d;return l|0}return 0}function yf(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;return tf(2,(c<<1)+2&6|a,b,c,d,e)|0}function zf(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;d=i;i=i+48|0;e=d|0;f=d+8|0;g=d+16|0;h=d+24|0;j=d+32|0;k=d+40|0;a[g]=0;a[h]=0;c[j>>2]=0;c[k>>2]=0;a[e]=0;if(!(Ad(c[4872]|0,e)|0)){l=0;i=d;return l|0}a[f]=0;if(!(rf(f,g,h,j,k)|0)){l=0;i=d;return l|0}if((a[f]&1)==0){a[c[4874]|0]=1;c[(c[4874]|0)+4>>2]=c[46];l=0;i=d;return l|0}else{f=a[h]|0;l=tf(2,(f<<1)+2&6|b,a[g]|0,f,c[j>>2]|0,c[k>>2]|0)|0;i=d;return l|0}return 0}function Af(a){a=a|0;var b=0,d=0,e=0,f=0;a:do{if((a|0)>0){if(!(Bd(c[4872]|0,1)|0)){b=0;break}d=a-1|0;e=0;do{if(!(Ye()|0)){b=0;break a}if((e|0)<(d|0)){if(!(Bd(c[4872]|0,5)|0)){b=0;break a}}e=e+1|0;}while((e|0)<(a|0));if(Bd(c[4872]|0,2)|0){f=9}else{b=0}}else{f=9}}while(0);if((f|0)==9){b=1}return b|0}function Bf(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0;b=a+1|0;a:do{if(b>>>0<3>>>0){c=Ie((b|52)&255)|0}else{d=0;e=0;while(1){f=d+1&255;if(((2<<(e&31))+(e<<26>>31)^e<<25>>31|0)==(a|0)){g=5;break}if(f<<24>>24>-1){d=f;e=f&255}else{break}}if((g|0)==5){if(!(Ie(55)|0)){c=0;break}c=Ie(d)|0;break}if(a>>>0>4294967039>>>0){if(!(Ie(56)|0)){c=0;break}if(!(Ie((a^255)&255)|0)){c=0;break}c=Ie(-25)|0;break}if(a>>>0>4294901759>>>0){if(!(Ie(57)|0)){c=0;break}if(!(Ie((a>>>8^255)&255)|0)){c=0;break}if(!(Ie((a^255)&255)|0)){c=0;break}c=Ie(-25)|0;break}do{if(a>>>0>16777215>>>0){h=4}else{if((a&16711680|0)!=0){h=3;break}h=(a&65280|0)==0?1:2}}while(0);if(Ie(h+55&255)|0){i=h}else{c=0;break}while(1){d=i-1&255;if(!(Ie(a>>((i&255)<<3)-8&255)|0)){c=0;break a}if(d<<24>>24==0){c=1;break}else{i=d}}}}while(0);return c|0}function Cf(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=a-(c[(c[4874]|0)+52>>2]|0)|0;a=b+127|0;if((b|0)<1){if((1-b|0)<65|(b-1|0)>>>0<64>>>0){d=4}else{d=5}}else{if((b-1|0)>>>0<64>>>0){d=4}else{d=5}}do{if((d|0)==4){e=a&127}else if((d|0)==5){f=b-2|0;if(Ie((f>>>8|128)&255)|0){e=f&255;break}else{g=0;return g|0}}}while(0);g=Ie(e)|0;return g|0}function Df(a){a=a|0;return}function Ef(a){a=a|0;return}function Ff(a){a=a|0;return}function Gf(a){a=a|0;Df(a|0);return}function Hf(a){a=a|0;Df(a|0);Yf(a);return}function If(a){a=a|0;Df(a|0);return}function Jf(a){a=a|0;Df(a|0);Yf(a);return}function Kf(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;i=i+56|0;f=e|0;if((a|0)==(b|0)){g=1;i=e;return g|0}if((b|0)==0){g=0;i=e;return g|0}h=Nf(b,10112,10096,0)|0;b=h;if((h|0)==0){g=0;i=e;return g|0}qg(f|0,0,56)|0;c[f>>2]=b;c[f+8>>2]=a;c[f+12>>2]=-1;c[f+48>>2]=1;Ob[c[(c[h>>2]|0)+28>>2]&7](b,f,c[d>>2]|0,1);if((c[f+24>>2]|0)!=1){g=0;i=e;return g|0}c[d>>2]=c[f+16>>2];g=1;i=e;return g|0}function Lf(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0;if((c[d+8>>2]|0)!=(b|0)){return}b=d+16|0;g=c[b>>2]|0;if((g|0)==0){c[b>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;return}if((g|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;c[d+24>>2]=2;a[d+54|0]=1;return}e=d+24|0;if((c[e>>2]|0)!=2){return}c[e>>2]=f;return}function Mf(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0;if((b|0)!=(c[d+8>>2]|0)){g=c[b+8>>2]|0;Ob[c[(c[g>>2]|0)+28>>2]&7](g,d,e,f);return}g=d+16|0;b=c[g>>2]|0;if((b|0)==0){c[g>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;return}if((b|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;c[d+24>>2]=2;a[d+54|0]=1;return}e=d+24|0;if((c[e>>2]|0)!=2){return}c[e>>2]=f;return}function Nf(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;f=i;i=i+56|0;g=f|0;h=c[a>>2]|0;j=a+(c[h-8>>2]|0)|0;k=c[h-4>>2]|0;h=k;c[g>>2]=d;c[g+4>>2]=a;c[g+8>>2]=b;c[g+12>>2]=e;e=g+16|0;b=g+20|0;a=g+24|0;l=g+28|0;m=g+32|0;n=g+40|0;qg(e|0,0,39)|0;if((k|0)==(d|0)){c[g+48>>2]=1;Mb[c[(c[k>>2]|0)+20>>2]&7](h,g,j,j,1,0);i=f;return((c[a>>2]|0)==1?j:0)|0}Hb[c[(c[k>>2]|0)+24>>2]&7](h,g,j,1,0);j=c[g+36>>2]|0;if((j|0)==1){do{if((c[a>>2]|0)!=1){if((c[n>>2]|0)==0&(c[l>>2]|0)==1&(c[m>>2]|0)==1){break}else{o=0}i=f;return o|0}}while(0);o=c[e>>2]|0;i=f;return o|0}else if((j|0)==0){i=f;return((c[n>>2]|0)==1&(c[l>>2]|0)==1&(c[m>>2]|0)==1?c[b>>2]|0:0)|0}else{o=0;i=f;return o|0}return 0}function Of(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0;h=b|0;if((h|0)==(c[d+8>>2]|0)){if((c[d+4>>2]|0)!=(e|0)){return}i=d+28|0;if((c[i>>2]|0)==1){return}c[i>>2]=f;return}if((h|0)!=(c[d>>2]|0)){h=c[b+8>>2]|0;Hb[c[(c[h>>2]|0)+24>>2]&7](h,d,e,f,g);return}do{if((c[d+16>>2]|0)!=(e|0)){h=d+20|0;if((c[h>>2]|0)==(e|0)){break}c[d+32>>2]=f;i=d+44|0;if((c[i>>2]|0)==4){return}j=d+52|0;a[j]=0;k=d+53|0;a[k]=0;l=c[b+8>>2]|0;Mb[c[(c[l>>2]|0)+20>>2]&7](l,d,e,e,1,g);if((a[k]&1)==0){m=0;n=13}else{if((a[j]&1)==0){m=1;n=13}}a:do{if((n|0)==13){c[h>>2]=e;j=d+40|0;c[j>>2]=(c[j>>2]|0)+1;do{if((c[d+36>>2]|0)==1){if((c[d+24>>2]|0)!=2){n=16;break}a[d+54|0]=1;if(m){break a}}else{n=16}}while(0);if((n|0)==16){if(m){break}}c[i>>2]=4;return}}while(0);c[i>>2]=3;return}}while(0);if((f|0)!=1){return}c[d+32>>2]=1;return}function Pf(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;if((c[d+8>>2]|0)==(b|0)){if((c[d+4>>2]|0)!=(e|0)){return}g=d+28|0;if((c[g>>2]|0)==1){return}c[g>>2]=f;return}if((c[d>>2]|0)!=(b|0)){return}do{if((c[d+16>>2]|0)!=(e|0)){b=d+20|0;if((c[b>>2]|0)==(e|0)){break}c[d+32>>2]=f;c[b>>2]=e;b=d+40|0;c[b>>2]=(c[b>>2]|0)+1;do{if((c[d+36>>2]|0)==1){if((c[d+24>>2]|0)!=2){break}a[d+54|0]=1}}while(0);c[d+44>>2]=4;return}}while(0);if((f|0)!=1){return}c[d+32>>2]=1;return}function Qf(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0;if((b|0)!=(c[d+8>>2]|0)){i=c[b+8>>2]|0;Mb[c[(c[i>>2]|0)+20>>2]&7](i,d,e,f,g,h);return}a[d+53|0]=1;if((c[d+4>>2]|0)!=(f|0)){return}a[d+52|0]=1;f=d+16|0;h=c[f>>2]|0;if((h|0)==0){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((c[d+48>>2]|0)==1&(g|0)==1)){return}a[d+54|0]=1;return}if((h|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;a[d+54|0]=1;return}e=d+24|0;h=c[e>>2]|0;if((h|0)==2){c[e>>2]=g;j=g}else{j=h}if(!((c[d+48>>2]|0)==1&(j|0)==1)){return}a[d+54|0]=1;return}function Rf(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0;if((c[d+8>>2]|0)!=(b|0)){return}a[d+53|0]=1;if((c[d+4>>2]|0)!=(f|0)){return}a[d+52|0]=1;f=d+16|0;b=c[f>>2]|0;if((b|0)==0){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((c[d+48>>2]|0)==1&(g|0)==1)){return}a[d+54|0]=1;return}if((b|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;a[d+54|0]=1;return}e=d+24|0;b=c[e>>2]|0;if((b|0)==2){c[e>>2]=g;i=g}else{i=b}if(!((c[d+48>>2]|0)==1&(i|0)==1)){return}a[d+54|0]=1;return}function Sf(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,va=0,wa=0,xa=0,ya=0,za=0,Aa=0,Ba=0,Ca=0,Da=0,Ea=0,Fa=0,Ga=0,Ha=0,Ia=0,Ja=0;do{if(a>>>0<245>>>0){if(a>>>0<11>>>0){b=16}else{b=a+11&-8}d=b>>>3;e=c[4880]|0;f=e>>>(d>>>0);if((f&3|0)!=0){g=(f&1^1)+d|0;h=g<<1;i=19560+(h<<2)|0;j=19560+(h+2<<2)|0;h=c[j>>2]|0;k=h+8|0;l=c[k>>2]|0;do{if((i|0)==(l|0)){c[4880]=e&~(1<<g)}else{if(l>>>0<(c[4884]|0)>>>0){Ra();return 0}m=l+12|0;if((c[m>>2]|0)==(h|0)){c[m>>2]=i;c[j>>2]=l;break}else{Ra();return 0}}}while(0);l=g<<3;c[h+4>>2]=l|3;j=h+(l|4)|0;c[j>>2]=c[j>>2]|1;n=k;return n|0}if(b>>>0<=(c[4882]|0)>>>0){o=b;break}if((f|0)!=0){j=2<<d;l=f<<d&(j|-j);j=(l&-l)-1|0;l=j>>>12&16;i=j>>>(l>>>0);j=i>>>5&8;m=i>>>(j>>>0);i=m>>>2&4;p=m>>>(i>>>0);m=p>>>1&2;q=p>>>(m>>>0);p=q>>>1&1;r=(j|l|i|m|p)+(q>>>(p>>>0))|0;p=r<<1;q=19560+(p<<2)|0;m=19560+(p+2<<2)|0;p=c[m>>2]|0;i=p+8|0;l=c[i>>2]|0;do{if((q|0)==(l|0)){c[4880]=e&~(1<<r)}else{if(l>>>0<(c[4884]|0)>>>0){Ra();return 0}j=l+12|0;if((c[j>>2]|0)==(p|0)){c[j>>2]=q;c[m>>2]=l;break}else{Ra();return 0}}}while(0);l=r<<3;m=l-b|0;c[p+4>>2]=b|3;q=p;e=q+b|0;c[q+(b|4)>>2]=m|1;c[q+l>>2]=m;l=c[4882]|0;if((l|0)!=0){q=c[4885]|0;d=l>>>3;l=d<<1;f=19560+(l<<2)|0;k=c[4880]|0;h=1<<d;do{if((k&h|0)==0){c[4880]=k|h;s=f;t=19560+(l+2<<2)|0}else{d=19560+(l+2<<2)|0;g=c[d>>2]|0;if(g>>>0>=(c[4884]|0)>>>0){s=g;t=d;break}Ra();return 0}}while(0);c[t>>2]=q;c[s+12>>2]=q;c[q+8>>2]=s;c[q+12>>2]=f}c[4882]=m;c[4885]=e;n=i;return n|0}l=c[4881]|0;if((l|0)==0){o=b;break}h=(l&-l)-1|0;l=h>>>12&16;k=h>>>(l>>>0);h=k>>>5&8;p=k>>>(h>>>0);k=p>>>2&4;r=p>>>(k>>>0);p=r>>>1&2;d=r>>>(p>>>0);r=d>>>1&1;g=c[19824+((h|l|k|p|r)+(d>>>(r>>>0))<<2)>>2]|0;r=g;d=g;p=(c[g+4>>2]&-8)-b|0;while(1){g=c[r+16>>2]|0;if((g|0)==0){k=c[r+20>>2]|0;if((k|0)==0){break}else{u=k}}else{u=g}g=(c[u+4>>2]&-8)-b|0;k=g>>>0<p>>>0;r=u;d=k?u:d;p=k?g:p}r=d;i=c[4884]|0;if(r>>>0<i>>>0){Ra();return 0}e=r+b|0;m=e;if(r>>>0>=e>>>0){Ra();return 0}e=c[d+24>>2]|0;f=c[d+12>>2]|0;do{if((f|0)==(d|0)){q=d+20|0;g=c[q>>2]|0;if((g|0)==0){k=d+16|0;l=c[k>>2]|0;if((l|0)==0){v=0;break}else{w=l;x=k}}else{w=g;x=q}while(1){q=w+20|0;g=c[q>>2]|0;if((g|0)!=0){w=g;x=q;continue}q=w+16|0;g=c[q>>2]|0;if((g|0)==0){break}else{w=g;x=q}}if(x>>>0<i>>>0){Ra();return 0}else{c[x>>2]=0;v=w;break}}else{q=c[d+8>>2]|0;if(q>>>0<i>>>0){Ra();return 0}g=q+12|0;if((c[g>>2]|0)!=(d|0)){Ra();return 0}k=f+8|0;if((c[k>>2]|0)==(d|0)){c[g>>2]=f;c[k>>2]=q;v=f;break}else{Ra();return 0}}}while(0);a:do{if((e|0)!=0){f=d+28|0;i=19824+(c[f>>2]<<2)|0;do{if((d|0)==(c[i>>2]|0)){c[i>>2]=v;if((v|0)!=0){break}c[4881]=c[4881]&~(1<<c[f>>2]);break a}else{if(e>>>0<(c[4884]|0)>>>0){Ra();return 0}q=e+16|0;if((c[q>>2]|0)==(d|0)){c[q>>2]=v}else{c[e+20>>2]=v}if((v|0)==0){break a}}}while(0);if(v>>>0<(c[4884]|0)>>>0){Ra();return 0}c[v+24>>2]=e;f=c[d+16>>2]|0;do{if((f|0)!=0){if(f>>>0<(c[4884]|0)>>>0){Ra();return 0}else{c[v+16>>2]=f;c[f+24>>2]=v;break}}}while(0);f=c[d+20>>2]|0;if((f|0)==0){break}if(f>>>0<(c[4884]|0)>>>0){Ra();return 0}else{c[v+20>>2]=f;c[f+24>>2]=v;break}}}while(0);if(p>>>0<16>>>0){e=p+b|0;c[d+4>>2]=e|3;f=r+(e+4)|0;c[f>>2]=c[f>>2]|1}else{c[d+4>>2]=b|3;c[r+(b|4)>>2]=p|1;c[r+(p+b)>>2]=p;f=c[4882]|0;if((f|0)!=0){e=c[4885]|0;i=f>>>3;f=i<<1;q=19560+(f<<2)|0;k=c[4880]|0;g=1<<i;do{if((k&g|0)==0){c[4880]=k|g;y=q;z=19560+(f+2<<2)|0}else{i=19560+(f+2<<2)|0;l=c[i>>2]|0;if(l>>>0>=(c[4884]|0)>>>0){y=l;z=i;break}Ra();return 0}}while(0);c[z>>2]=e;c[y+12>>2]=e;c[e+8>>2]=y;c[e+12>>2]=q}c[4882]=p;c[4885]=m}n=d+8|0;return n|0}else{if(a>>>0>4294967231>>>0){o=-1;break}f=a+11|0;g=f&-8;k=c[4881]|0;if((k|0)==0){o=g;break}r=-g|0;i=f>>>8;do{if((i|0)==0){A=0}else{if(g>>>0>16777215>>>0){A=31;break}f=(i+1048320|0)>>>16&8;l=i<<f;h=(l+520192|0)>>>16&4;j=l<<h;l=(j+245760|0)>>>16&2;B=14-(h|f|l)+(j<<l>>>15)|0;A=g>>>((B+7|0)>>>0)&1|B<<1}}while(0);i=c[19824+(A<<2)>>2]|0;b:do{if((i|0)==0){C=0;D=r;E=0}else{if((A|0)==31){F=0}else{F=25-(A>>>1)|0}d=0;m=r;p=i;q=g<<F;e=0;while(1){B=c[p+4>>2]&-8;l=B-g|0;if(l>>>0<m>>>0){if((B|0)==(g|0)){C=p;D=l;E=p;break b}else{G=p;H=l}}else{G=d;H=m}l=c[p+20>>2]|0;B=c[p+16+(q>>>31<<2)>>2]|0;j=(l|0)==0|(l|0)==(B|0)?e:l;if((B|0)==0){C=G;D=H;E=j;break}else{d=G;m=H;p=B;q=q<<1;e=j}}}}while(0);if((E|0)==0&(C|0)==0){i=2<<A;r=k&(i|-i);if((r|0)==0){o=g;break}i=(r&-r)-1|0;r=i>>>12&16;e=i>>>(r>>>0);i=e>>>5&8;q=e>>>(i>>>0);e=q>>>2&4;p=q>>>(e>>>0);q=p>>>1&2;m=p>>>(q>>>0);p=m>>>1&1;I=c[19824+((i|r|e|q|p)+(m>>>(p>>>0))<<2)>>2]|0}else{I=E}if((I|0)==0){J=D;K=C}else{p=I;m=D;q=C;while(1){e=(c[p+4>>2]&-8)-g|0;r=e>>>0<m>>>0;i=r?e:m;e=r?p:q;r=c[p+16>>2]|0;if((r|0)!=0){p=r;m=i;q=e;continue}r=c[p+20>>2]|0;if((r|0)==0){J=i;K=e;break}else{p=r;m=i;q=e}}}if((K|0)==0){o=g;break}if(J>>>0>=((c[4882]|0)-g|0)>>>0){o=g;break}q=K;m=c[4884]|0;if(q>>>0<m>>>0){Ra();return 0}p=q+g|0;k=p;if(q>>>0>=p>>>0){Ra();return 0}e=c[K+24>>2]|0;i=c[K+12>>2]|0;do{if((i|0)==(K|0)){r=K+20|0;d=c[r>>2]|0;if((d|0)==0){j=K+16|0;B=c[j>>2]|0;if((B|0)==0){L=0;break}else{M=B;N=j}}else{M=d;N=r}while(1){r=M+20|0;d=c[r>>2]|0;if((d|0)!=0){M=d;N=r;continue}r=M+16|0;d=c[r>>2]|0;if((d|0)==0){break}else{M=d;N=r}}if(N>>>0<m>>>0){Ra();return 0}else{c[N>>2]=0;L=M;break}}else{r=c[K+8>>2]|0;if(r>>>0<m>>>0){Ra();return 0}d=r+12|0;if((c[d>>2]|0)!=(K|0)){Ra();return 0}j=i+8|0;if((c[j>>2]|0)==(K|0)){c[d>>2]=i;c[j>>2]=r;L=i;break}else{Ra();return 0}}}while(0);c:do{if((e|0)!=0){i=K+28|0;m=19824+(c[i>>2]<<2)|0;do{if((K|0)==(c[m>>2]|0)){c[m>>2]=L;if((L|0)!=0){break}c[4881]=c[4881]&~(1<<c[i>>2]);break c}else{if(e>>>0<(c[4884]|0)>>>0){Ra();return 0}r=e+16|0;if((c[r>>2]|0)==(K|0)){c[r>>2]=L}else{c[e+20>>2]=L}if((L|0)==0){break c}}}while(0);if(L>>>0<(c[4884]|0)>>>0){Ra();return 0}c[L+24>>2]=e;i=c[K+16>>2]|0;do{if((i|0)!=0){if(i>>>0<(c[4884]|0)>>>0){Ra();return 0}else{c[L+16>>2]=i;c[i+24>>2]=L;break}}}while(0);i=c[K+20>>2]|0;if((i|0)==0){break}if(i>>>0<(c[4884]|0)>>>0){Ra();return 0}else{c[L+20>>2]=i;c[i+24>>2]=L;break}}}while(0);d:do{if(J>>>0<16>>>0){e=J+g|0;c[K+4>>2]=e|3;i=q+(e+4)|0;c[i>>2]=c[i>>2]|1}else{c[K+4>>2]=g|3;c[q+(g|4)>>2]=J|1;c[q+(J+g)>>2]=J;i=J>>>3;if(J>>>0<256>>>0){e=i<<1;m=19560+(e<<2)|0;r=c[4880]|0;j=1<<i;do{if((r&j|0)==0){c[4880]=r|j;O=m;P=19560+(e+2<<2)|0}else{i=19560+(e+2<<2)|0;d=c[i>>2]|0;if(d>>>0>=(c[4884]|0)>>>0){O=d;P=i;break}Ra();return 0}}while(0);c[P>>2]=k;c[O+12>>2]=k;c[q+(g+8)>>2]=O;c[q+(g+12)>>2]=m;break}e=p;j=J>>>8;do{if((j|0)==0){Q=0}else{if(J>>>0>16777215>>>0){Q=31;break}r=(j+1048320|0)>>>16&8;i=j<<r;d=(i+520192|0)>>>16&4;B=i<<d;i=(B+245760|0)>>>16&2;l=14-(d|r|i)+(B<<i>>>15)|0;Q=J>>>((l+7|0)>>>0)&1|l<<1}}while(0);j=19824+(Q<<2)|0;c[q+(g+28)>>2]=Q;c[q+(g+20)>>2]=0;c[q+(g+16)>>2]=0;m=c[4881]|0;l=1<<Q;if((m&l|0)==0){c[4881]=m|l;c[j>>2]=e;c[q+(g+24)>>2]=j;c[q+(g+12)>>2]=e;c[q+(g+8)>>2]=e;break}l=c[j>>2]|0;if((Q|0)==31){R=0}else{R=25-(Q>>>1)|0}e:do{if((c[l+4>>2]&-8|0)==(J|0)){S=l}else{j=l;m=J<<R;while(1){T=j+16+(m>>>31<<2)|0;i=c[T>>2]|0;if((i|0)==0){break}if((c[i+4>>2]&-8|0)==(J|0)){S=i;break e}else{j=i;m=m<<1}}if(T>>>0<(c[4884]|0)>>>0){Ra();return 0}else{c[T>>2]=e;c[q+(g+24)>>2]=j;c[q+(g+12)>>2]=e;c[q+(g+8)>>2]=e;break d}}}while(0);l=S+8|0;m=c[l>>2]|0;i=c[4884]|0;if(S>>>0>=i>>>0&m>>>0>=i>>>0){c[m+12>>2]=e;c[l>>2]=e;c[q+(g+8)>>2]=m;c[q+(g+12)>>2]=S;c[q+(g+24)>>2]=0;break}else{Ra();return 0}}}while(0);n=K+8|0;return n|0}}while(0);K=c[4882]|0;if(K>>>0>=o>>>0){S=K-o|0;T=c[4885]|0;if(S>>>0>15>>>0){J=T;c[4885]=J+o;c[4882]=S;c[J+(o+4)>>2]=S|1;c[J+K>>2]=S;c[T+4>>2]=o|3}else{c[4882]=0;c[4885]=0;c[T+4>>2]=K|3;S=T+(K+4)|0;c[S>>2]=c[S>>2]|1}n=T+8|0;return n|0}T=c[4883]|0;if(T>>>0>o>>>0){S=T-o|0;c[4883]=S;T=c[4886]|0;K=T;c[4886]=K+o;c[K+(o+4)>>2]=S|1;c[T+4>>2]=o|3;n=T+8|0;return n|0}do{if((c[4864]|0)==0){T=Pa(30)|0;if((T-1&T|0)==0){c[4866]=T;c[4865]=T;c[4867]=-1;c[4868]=-1;c[4869]=0;c[4991]=0;c[4864]=(ib(0)|0)&-16^1431655768;break}else{Ra();return 0}}}while(0);T=o+48|0;S=c[4866]|0;K=o+47|0;J=S+K|0;R=-S|0;S=J&R;if(S>>>0<=o>>>0){n=0;return n|0}Q=c[4990]|0;do{if((Q|0)!=0){O=c[4988]|0;P=O+S|0;if(P>>>0<=O>>>0|P>>>0>Q>>>0){n=0}else{break}return n|0}}while(0);f:do{if((c[4991]&4|0)==0){Q=c[4886]|0;g:do{if((Q|0)==0){U=181}else{P=Q;O=19968;while(1){V=O|0;L=c[V>>2]|0;if(L>>>0<=P>>>0){W=O+4|0;if((L+(c[W>>2]|0)|0)>>>0>P>>>0){break}}L=c[O+8>>2]|0;if((L|0)==0){U=181;break g}else{O=L}}if((O|0)==0){U=181;break}P=J-(c[4883]|0)&R;if(P>>>0>=2147483647>>>0){X=0;break}e=zb(P|0)|0;if((e|0)==((c[V>>2]|0)+(c[W>>2]|0)|0)){Y=e;Z=P;U=190}else{_=P;$=e;U=191}}}while(0);do{if((U|0)==181){Q=zb(0)|0;if((Q|0)==-1){X=0;break}e=Q;P=c[4865]|0;L=P-1|0;if((L&e|0)==0){aa=S}else{aa=S-e+(L+e&-P)|0}P=c[4988]|0;e=P+aa|0;if(!(aa>>>0>o>>>0&aa>>>0<2147483647>>>0)){X=0;break}L=c[4990]|0;if((L|0)!=0){if(e>>>0<=P>>>0|e>>>0>L>>>0){X=0;break}}L=zb(aa|0)|0;if((L|0)==(Q|0)){Y=Q;Z=aa;U=190}else{_=aa;$=L;U=191}}}while(0);h:do{if((U|0)==190){if((Y|0)==-1){X=Z}else{ba=Z;ca=Y;U=201;break f}}else if((U|0)==191){L=-_|0;do{if(($|0)!=-1&_>>>0<2147483647>>>0&T>>>0>_>>>0){Q=c[4866]|0;e=K-_+Q&-Q;if(e>>>0>=2147483647>>>0){da=_;break}if((zb(e|0)|0)==-1){zb(L|0)|0;X=0;break h}else{da=e+_|0;break}}else{da=_}}while(0);if(($|0)==-1){X=0}else{ba=da;ca=$;U=201;break f}}}while(0);c[4991]=c[4991]|4;ea=X;U=198}else{ea=0;U=198}}while(0);do{if((U|0)==198){if(S>>>0>=2147483647>>>0){break}X=zb(S|0)|0;$=zb(0)|0;if(!((X|0)!=-1&($|0)!=-1&X>>>0<$>>>0)){break}da=$-X|0;$=da>>>0>(o+40|0)>>>0;if($){ba=$?da:ea;ca=X;U=201}}}while(0);do{if((U|0)==201){ea=(c[4988]|0)+ba|0;c[4988]=ea;if(ea>>>0>(c[4989]|0)>>>0){c[4989]=ea}ea=c[4886]|0;i:do{if((ea|0)==0){S=c[4884]|0;if((S|0)==0|ca>>>0<S>>>0){c[4884]=ca}c[4992]=ca;c[4993]=ba;c[4995]=0;c[4889]=c[4864];c[4888]=-1;S=0;do{X=S<<1;da=19560+(X<<2)|0;c[19560+(X+3<<2)>>2]=da;c[19560+(X+2<<2)>>2]=da;S=S+1|0;}while(S>>>0<32>>>0);S=ca+8|0;if((S&7|0)==0){fa=0}else{fa=-S&7}S=ba-40-fa|0;c[4886]=ca+fa;c[4883]=S;c[ca+(fa+4)>>2]=S|1;c[ca+(ba-36)>>2]=40;c[4887]=c[4868]}else{S=19968;while(1){ga=c[S>>2]|0;ha=S+4|0;ia=c[ha>>2]|0;if((ca|0)==(ga+ia|0)){U=213;break}da=c[S+8>>2]|0;if((da|0)==0){break}else{S=da}}do{if((U|0)==213){if((c[S+12>>2]&8|0)!=0){break}da=ea;if(!(da>>>0>=ga>>>0&da>>>0<ca>>>0)){break}c[ha>>2]=ia+ba;da=c[4886]|0;X=(c[4883]|0)+ba|0;$=da;_=da+8|0;if((_&7|0)==0){ja=0}else{ja=-_&7}_=X-ja|0;c[4886]=$+ja;c[4883]=_;c[$+(ja+4)>>2]=_|1;c[$+(X+4)>>2]=40;c[4887]=c[4868];break i}}while(0);if(ca>>>0<(c[4884]|0)>>>0){c[4884]=ca}S=ca+ba|0;X=19968;while(1){ka=X|0;if((c[ka>>2]|0)==(S|0)){U=223;break}$=c[X+8>>2]|0;if(($|0)==0){break}else{X=$}}do{if((U|0)==223){if((c[X+12>>2]&8|0)!=0){break}c[ka>>2]=ca;S=X+4|0;c[S>>2]=(c[S>>2]|0)+ba;S=ca+8|0;if((S&7|0)==0){la=0}else{la=-S&7}S=ca+(ba+8)|0;if((S&7|0)==0){ma=0}else{ma=-S&7}S=ca+(ma+ba)|0;$=S;_=la+o|0;da=ca+_|0;K=da;T=S-(ca+la)-o|0;c[ca+(la+4)>>2]=o|3;j:do{if(($|0)==(c[4886]|0)){Y=(c[4883]|0)+T|0;c[4883]=Y;c[4886]=K;c[ca+(_+4)>>2]=Y|1}else{if(($|0)==(c[4885]|0)){Y=(c[4882]|0)+T|0;c[4882]=Y;c[4885]=K;c[ca+(_+4)>>2]=Y|1;c[ca+(Y+_)>>2]=Y;break}Y=ba+4|0;Z=c[ca+(Y+ma)>>2]|0;if((Z&3|0)==1){aa=Z&-8;W=Z>>>3;k:do{if(Z>>>0<256>>>0){V=c[ca+((ma|8)+ba)>>2]|0;R=c[ca+(ba+12+ma)>>2]|0;J=19560+(W<<1<<2)|0;do{if((V|0)!=(J|0)){if(V>>>0<(c[4884]|0)>>>0){Ra();return 0}if((c[V+12>>2]|0)==($|0)){break}Ra();return 0}}while(0);if((R|0)==(V|0)){c[4880]=c[4880]&~(1<<W);break}do{if((R|0)==(J|0)){na=R+8|0}else{if(R>>>0<(c[4884]|0)>>>0){Ra();return 0}L=R+8|0;if((c[L>>2]|0)==($|0)){na=L;break}Ra();return 0}}while(0);c[V+12>>2]=R;c[na>>2]=V}else{J=S;L=c[ca+((ma|24)+ba)>>2]|0;O=c[ca+(ba+12+ma)>>2]|0;do{if((O|0)==(J|0)){e=ma|16;Q=ca+(Y+e)|0;P=c[Q>>2]|0;if((P|0)==0){M=ca+(e+ba)|0;e=c[M>>2]|0;if((e|0)==0){oa=0;break}else{pa=e;qa=M}}else{pa=P;qa=Q}while(1){Q=pa+20|0;P=c[Q>>2]|0;if((P|0)!=0){pa=P;qa=Q;continue}Q=pa+16|0;P=c[Q>>2]|0;if((P|0)==0){break}else{pa=P;qa=Q}}if(qa>>>0<(c[4884]|0)>>>0){Ra();return 0}else{c[qa>>2]=0;oa=pa;break}}else{Q=c[ca+((ma|8)+ba)>>2]|0;if(Q>>>0<(c[4884]|0)>>>0){Ra();return 0}P=Q+12|0;if((c[P>>2]|0)!=(J|0)){Ra();return 0}M=O+8|0;if((c[M>>2]|0)==(J|0)){c[P>>2]=O;c[M>>2]=Q;oa=O;break}else{Ra();return 0}}}while(0);if((L|0)==0){break}O=ca+(ba+28+ma)|0;V=19824+(c[O>>2]<<2)|0;do{if((J|0)==(c[V>>2]|0)){c[V>>2]=oa;if((oa|0)!=0){break}c[4881]=c[4881]&~(1<<c[O>>2]);break k}else{if(L>>>0<(c[4884]|0)>>>0){Ra();return 0}R=L+16|0;if((c[R>>2]|0)==(J|0)){c[R>>2]=oa}else{c[L+20>>2]=oa}if((oa|0)==0){break k}}}while(0);if(oa>>>0<(c[4884]|0)>>>0){Ra();return 0}c[oa+24>>2]=L;J=ma|16;O=c[ca+(J+ba)>>2]|0;do{if((O|0)!=0){if(O>>>0<(c[4884]|0)>>>0){Ra();return 0}else{c[oa+16>>2]=O;c[O+24>>2]=oa;break}}}while(0);O=c[ca+(Y+J)>>2]|0;if((O|0)==0){break}if(O>>>0<(c[4884]|0)>>>0){Ra();return 0}else{c[oa+20>>2]=O;c[O+24>>2]=oa;break}}}while(0);ra=ca+((aa|ma)+ba)|0;sa=aa+T|0}else{ra=$;sa=T}Y=ra+4|0;c[Y>>2]=c[Y>>2]&-2;c[ca+(_+4)>>2]=sa|1;c[ca+(sa+_)>>2]=sa;Y=sa>>>3;if(sa>>>0<256>>>0){W=Y<<1;Z=19560+(W<<2)|0;O=c[4880]|0;L=1<<Y;do{if((O&L|0)==0){c[4880]=O|L;ta=Z;ua=19560+(W+2<<2)|0}else{Y=19560+(W+2<<2)|0;V=c[Y>>2]|0;if(V>>>0>=(c[4884]|0)>>>0){ta=V;ua=Y;break}Ra();return 0}}while(0);c[ua>>2]=K;c[ta+12>>2]=K;c[ca+(_+8)>>2]=ta;c[ca+(_+12)>>2]=Z;break}W=da;L=sa>>>8;do{if((L|0)==0){va=0}else{if(sa>>>0>16777215>>>0){va=31;break}O=(L+1048320|0)>>>16&8;aa=L<<O;Y=(aa+520192|0)>>>16&4;V=aa<<Y;aa=(V+245760|0)>>>16&2;R=14-(Y|O|aa)+(V<<aa>>>15)|0;va=sa>>>((R+7|0)>>>0)&1|R<<1}}while(0);L=19824+(va<<2)|0;c[ca+(_+28)>>2]=va;c[ca+(_+20)>>2]=0;c[ca+(_+16)>>2]=0;Z=c[4881]|0;R=1<<va;if((Z&R|0)==0){c[4881]=Z|R;c[L>>2]=W;c[ca+(_+24)>>2]=L;c[ca+(_+12)>>2]=W;c[ca+(_+8)>>2]=W;break}R=c[L>>2]|0;if((va|0)==31){wa=0}else{wa=25-(va>>>1)|0}l:do{if((c[R+4>>2]&-8|0)==(sa|0)){xa=R}else{L=R;Z=sa<<wa;while(1){ya=L+16+(Z>>>31<<2)|0;aa=c[ya>>2]|0;if((aa|0)==0){break}if((c[aa+4>>2]&-8|0)==(sa|0)){xa=aa;break l}else{L=aa;Z=Z<<1}}if(ya>>>0<(c[4884]|0)>>>0){Ra();return 0}else{c[ya>>2]=W;c[ca+(_+24)>>2]=L;c[ca+(_+12)>>2]=W;c[ca+(_+8)>>2]=W;break j}}}while(0);R=xa+8|0;Z=c[R>>2]|0;J=c[4884]|0;if(xa>>>0>=J>>>0&Z>>>0>=J>>>0){c[Z+12>>2]=W;c[R>>2]=W;c[ca+(_+8)>>2]=Z;c[ca+(_+12)>>2]=xa;c[ca+(_+24)>>2]=0;break}else{Ra();return 0}}}while(0);n=ca+(la|8)|0;return n|0}}while(0);X=ea;_=19968;while(1){za=c[_>>2]|0;if(za>>>0<=X>>>0){Aa=c[_+4>>2]|0;Ba=za+Aa|0;if(Ba>>>0>X>>>0){break}}_=c[_+8>>2]|0}_=za+(Aa-39)|0;if((_&7|0)==0){Ca=0}else{Ca=-_&7}_=za+(Aa-47+Ca)|0;da=_>>>0<(ea+16|0)>>>0?X:_;_=da+8|0;K=ca+8|0;if((K&7|0)==0){Da=0}else{Da=-K&7}K=ba-40-Da|0;c[4886]=ca+Da;c[4883]=K;c[ca+(Da+4)>>2]=K|1;c[ca+(ba-36)>>2]=40;c[4887]=c[4868];c[da+4>>2]=27;c[_>>2]=c[4992];c[_+4>>2]=c[4993];c[_+8>>2]=c[4994];c[_+12>>2]=c[4995];c[4992]=ca;c[4993]=ba;c[4995]=0;c[4994]=_;_=da+28|0;c[_>>2]=7;if((da+32|0)>>>0<Ba>>>0){K=_;while(1){_=K+4|0;c[_>>2]=7;if((K+8|0)>>>0<Ba>>>0){K=_}else{break}}}if((da|0)==(X|0)){break}K=da-ea|0;_=X+(K+4)|0;c[_>>2]=c[_>>2]&-2;c[ea+4>>2]=K|1;c[X+K>>2]=K;_=K>>>3;if(K>>>0<256>>>0){T=_<<1;$=19560+(T<<2)|0;S=c[4880]|0;j=1<<_;do{if((S&j|0)==0){c[4880]=S|j;Ea=$;Fa=19560+(T+2<<2)|0}else{_=19560+(T+2<<2)|0;Z=c[_>>2]|0;if(Z>>>0>=(c[4884]|0)>>>0){Ea=Z;Fa=_;break}Ra();return 0}}while(0);c[Fa>>2]=ea;c[Ea+12>>2]=ea;c[ea+8>>2]=Ea;c[ea+12>>2]=$;break}T=ea;j=K>>>8;do{if((j|0)==0){Ga=0}else{if(K>>>0>16777215>>>0){Ga=31;break}S=(j+1048320|0)>>>16&8;X=j<<S;da=(X+520192|0)>>>16&4;_=X<<da;X=(_+245760|0)>>>16&2;Z=14-(da|S|X)+(_<<X>>>15)|0;Ga=K>>>((Z+7|0)>>>0)&1|Z<<1}}while(0);j=19824+(Ga<<2)|0;c[ea+28>>2]=Ga;c[ea+20>>2]=0;c[ea+16>>2]=0;$=c[4881]|0;Z=1<<Ga;if(($&Z|0)==0){c[4881]=$|Z;c[j>>2]=T;c[ea+24>>2]=j;c[ea+12>>2]=ea;c[ea+8>>2]=ea;break}Z=c[j>>2]|0;if((Ga|0)==31){Ha=0}else{Ha=25-(Ga>>>1)|0}m:do{if((c[Z+4>>2]&-8|0)==(K|0)){Ia=Z}else{j=Z;$=K<<Ha;while(1){Ja=j+16+($>>>31<<2)|0;X=c[Ja>>2]|0;if((X|0)==0){break}if((c[X+4>>2]&-8|0)==(K|0)){Ia=X;break m}else{j=X;$=$<<1}}if(Ja>>>0<(c[4884]|0)>>>0){Ra();return 0}else{c[Ja>>2]=T;c[ea+24>>2]=j;c[ea+12>>2]=ea;c[ea+8>>2]=ea;break i}}}while(0);K=Ia+8|0;Z=c[K>>2]|0;$=c[4884]|0;if(Ia>>>0>=$>>>0&Z>>>0>=$>>>0){c[Z+12>>2]=T;c[K>>2]=T;c[ea+8>>2]=Z;c[ea+12>>2]=Ia;c[ea+24>>2]=0;break}else{Ra();return 0}}}while(0);ea=c[4883]|0;if(ea>>>0<=o>>>0){break}Z=ea-o|0;c[4883]=Z;ea=c[4886]|0;K=ea;c[4886]=K+o;c[K+(o+4)>>2]=Z|1;c[ea+4>>2]=o|3;n=ea+8|0;return n|0}}while(0);c[(vb()|0)>>2]=12;n=0;return n|0}function Tf(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0;if((a|0)==0){return}b=a-8|0;d=b;e=c[4884]|0;if(b>>>0<e>>>0){Ra()}f=c[a-4>>2]|0;g=f&3;if((g|0)==1){Ra()}h=f&-8;i=a+(h-8)|0;j=i;a:do{if((f&1|0)==0){k=c[b>>2]|0;if((g|0)==0){return}l=-8-k|0;m=a+l|0;n=m;o=k+h|0;if(m>>>0<e>>>0){Ra()}if((n|0)==(c[4885]|0)){p=a+(h-4)|0;if((c[p>>2]&3|0)!=3){q=n;r=o;break}c[4882]=o;c[p>>2]=c[p>>2]&-2;c[a+(l+4)>>2]=o|1;c[i>>2]=o;return}p=k>>>3;if(k>>>0<256>>>0){k=c[a+(l+8)>>2]|0;s=c[a+(l+12)>>2]|0;t=19560+(p<<1<<2)|0;do{if((k|0)!=(t|0)){if(k>>>0<e>>>0){Ra()}if((c[k+12>>2]|0)==(n|0)){break}Ra()}}while(0);if((s|0)==(k|0)){c[4880]=c[4880]&~(1<<p);q=n;r=o;break}do{if((s|0)==(t|0)){u=s+8|0}else{if(s>>>0<e>>>0){Ra()}v=s+8|0;if((c[v>>2]|0)==(n|0)){u=v;break}Ra()}}while(0);c[k+12>>2]=s;c[u>>2]=k;q=n;r=o;break}t=m;p=c[a+(l+24)>>2]|0;v=c[a+(l+12)>>2]|0;do{if((v|0)==(t|0)){w=a+(l+20)|0;x=c[w>>2]|0;if((x|0)==0){y=a+(l+16)|0;z=c[y>>2]|0;if((z|0)==0){A=0;break}else{B=z;C=y}}else{B=x;C=w}while(1){w=B+20|0;x=c[w>>2]|0;if((x|0)!=0){B=x;C=w;continue}w=B+16|0;x=c[w>>2]|0;if((x|0)==0){break}else{B=x;C=w}}if(C>>>0<e>>>0){Ra()}else{c[C>>2]=0;A=B;break}}else{w=c[a+(l+8)>>2]|0;if(w>>>0<e>>>0){Ra()}x=w+12|0;if((c[x>>2]|0)!=(t|0)){Ra()}y=v+8|0;if((c[y>>2]|0)==(t|0)){c[x>>2]=v;c[y>>2]=w;A=v;break}else{Ra()}}}while(0);if((p|0)==0){q=n;r=o;break}v=a+(l+28)|0;m=19824+(c[v>>2]<<2)|0;do{if((t|0)==(c[m>>2]|0)){c[m>>2]=A;if((A|0)!=0){break}c[4881]=c[4881]&~(1<<c[v>>2]);q=n;r=o;break a}else{if(p>>>0<(c[4884]|0)>>>0){Ra()}k=p+16|0;if((c[k>>2]|0)==(t|0)){c[k>>2]=A}else{c[p+20>>2]=A}if((A|0)==0){q=n;r=o;break a}}}while(0);if(A>>>0<(c[4884]|0)>>>0){Ra()}c[A+24>>2]=p;t=c[a+(l+16)>>2]|0;do{if((t|0)!=0){if(t>>>0<(c[4884]|0)>>>0){Ra()}else{c[A+16>>2]=t;c[t+24>>2]=A;break}}}while(0);t=c[a+(l+20)>>2]|0;if((t|0)==0){q=n;r=o;break}if(t>>>0<(c[4884]|0)>>>0){Ra()}else{c[A+20>>2]=t;c[t+24>>2]=A;q=n;r=o;break}}else{q=d;r=h}}while(0);d=q;if(d>>>0>=i>>>0){Ra()}A=a+(h-4)|0;e=c[A>>2]|0;if((e&1|0)==0){Ra()}do{if((e&2|0)==0){if((j|0)==(c[4886]|0)){B=(c[4883]|0)+r|0;c[4883]=B;c[4886]=q;c[q+4>>2]=B|1;if((q|0)!=(c[4885]|0)){return}c[4885]=0;c[4882]=0;return}if((j|0)==(c[4885]|0)){B=(c[4882]|0)+r|0;c[4882]=B;c[4885]=q;c[q+4>>2]=B|1;c[d+B>>2]=B;return}B=(e&-8)+r|0;C=e>>>3;b:do{if(e>>>0<256>>>0){u=c[a+h>>2]|0;g=c[a+(h|4)>>2]|0;b=19560+(C<<1<<2)|0;do{if((u|0)!=(b|0)){if(u>>>0<(c[4884]|0)>>>0){Ra()}if((c[u+12>>2]|0)==(j|0)){break}Ra()}}while(0);if((g|0)==(u|0)){c[4880]=c[4880]&~(1<<C);break}do{if((g|0)==(b|0)){D=g+8|0}else{if(g>>>0<(c[4884]|0)>>>0){Ra()}f=g+8|0;if((c[f>>2]|0)==(j|0)){D=f;break}Ra()}}while(0);c[u+12>>2]=g;c[D>>2]=u}else{b=i;f=c[a+(h+16)>>2]|0;t=c[a+(h|4)>>2]|0;do{if((t|0)==(b|0)){p=a+(h+12)|0;v=c[p>>2]|0;if((v|0)==0){m=a+(h+8)|0;k=c[m>>2]|0;if((k|0)==0){E=0;break}else{F=k;G=m}}else{F=v;G=p}while(1){p=F+20|0;v=c[p>>2]|0;if((v|0)!=0){F=v;G=p;continue}p=F+16|0;v=c[p>>2]|0;if((v|0)==0){break}else{F=v;G=p}}if(G>>>0<(c[4884]|0)>>>0){Ra()}else{c[G>>2]=0;E=F;break}}else{p=c[a+h>>2]|0;if(p>>>0<(c[4884]|0)>>>0){Ra()}v=p+12|0;if((c[v>>2]|0)!=(b|0)){Ra()}m=t+8|0;if((c[m>>2]|0)==(b|0)){c[v>>2]=t;c[m>>2]=p;E=t;break}else{Ra()}}}while(0);if((f|0)==0){break}t=a+(h+20)|0;u=19824+(c[t>>2]<<2)|0;do{if((b|0)==(c[u>>2]|0)){c[u>>2]=E;if((E|0)!=0){break}c[4881]=c[4881]&~(1<<c[t>>2]);break b}else{if(f>>>0<(c[4884]|0)>>>0){Ra()}g=f+16|0;if((c[g>>2]|0)==(b|0)){c[g>>2]=E}else{c[f+20>>2]=E}if((E|0)==0){break b}}}while(0);if(E>>>0<(c[4884]|0)>>>0){Ra()}c[E+24>>2]=f;b=c[a+(h+8)>>2]|0;do{if((b|0)!=0){if(b>>>0<(c[4884]|0)>>>0){Ra()}else{c[E+16>>2]=b;c[b+24>>2]=E;break}}}while(0);b=c[a+(h+12)>>2]|0;if((b|0)==0){break}if(b>>>0<(c[4884]|0)>>>0){Ra()}else{c[E+20>>2]=b;c[b+24>>2]=E;break}}}while(0);c[q+4>>2]=B|1;c[d+B>>2]=B;if((q|0)!=(c[4885]|0)){H=B;break}c[4882]=B;return}else{c[A>>2]=e&-2;c[q+4>>2]=r|1;c[d+r>>2]=r;H=r}}while(0);r=H>>>3;if(H>>>0<256>>>0){d=r<<1;e=19560+(d<<2)|0;A=c[4880]|0;E=1<<r;do{if((A&E|0)==0){c[4880]=A|E;I=e;J=19560+(d+2<<2)|0}else{r=19560+(d+2<<2)|0;h=c[r>>2]|0;if(h>>>0>=(c[4884]|0)>>>0){I=h;J=r;break}Ra()}}while(0);c[J>>2]=q;c[I+12>>2]=q;c[q+8>>2]=I;c[q+12>>2]=e;return}e=q;I=H>>>8;do{if((I|0)==0){K=0}else{if(H>>>0>16777215>>>0){K=31;break}J=(I+1048320|0)>>>16&8;d=I<<J;E=(d+520192|0)>>>16&4;A=d<<E;d=(A+245760|0)>>>16&2;r=14-(E|J|d)+(A<<d>>>15)|0;K=H>>>((r+7|0)>>>0)&1|r<<1}}while(0);I=19824+(K<<2)|0;c[q+28>>2]=K;c[q+20>>2]=0;c[q+16>>2]=0;r=c[4881]|0;d=1<<K;c:do{if((r&d|0)==0){c[4881]=r|d;c[I>>2]=e;c[q+24>>2]=I;c[q+12>>2]=q;c[q+8>>2]=q}else{A=c[I>>2]|0;if((K|0)==31){L=0}else{L=25-(K>>>1)|0}d:do{if((c[A+4>>2]&-8|0)==(H|0)){M=A}else{J=A;E=H<<L;while(1){N=J+16+(E>>>31<<2)|0;h=c[N>>2]|0;if((h|0)==0){break}if((c[h+4>>2]&-8|0)==(H|0)){M=h;break d}else{J=h;E=E<<1}}if(N>>>0<(c[4884]|0)>>>0){Ra()}else{c[N>>2]=e;c[q+24>>2]=J;c[q+12>>2]=q;c[q+8>>2]=q;break c}}}while(0);A=M+8|0;B=c[A>>2]|0;E=c[4884]|0;if(M>>>0>=E>>>0&B>>>0>=E>>>0){c[B+12>>2]=e;c[A>>2]=e;c[q+8>>2]=B;c[q+12>>2]=M;c[q+24>>2]=0;break}else{Ra()}}}while(0);q=(c[4888]|0)-1|0;c[4888]=q;if((q|0)==0){O=19976}else{return}while(1){q=c[O>>2]|0;if((q|0)==0){break}else{O=q+8|0}}c[4888]=-1;return}function Uf(a,b){a=a|0;b=b|0;var d=0,e=0;do{if((a|0)==0){d=0}else{e=ea(b,a)|0;if((b|a)>>>0<=65535>>>0){d=e;break}d=((e>>>0)/(a>>>0)|0|0)==(b|0)?e:-1}}while(0);b=Sf(d)|0;if((b|0)==0){return b|0}if((c[b-4>>2]&3|0)==0){return b|0}qg(b|0,0,d|0)|0;return b|0}function Vf(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;if((a|0)==0){d=Sf(b)|0;return d|0}if(b>>>0>4294967231>>>0){c[(vb()|0)>>2]=12;d=0;return d|0}if(b>>>0<11>>>0){e=16}else{e=b+11&-8}f=jg(a-8|0,e)|0;if((f|0)!=0){d=f+8|0;return d|0}f=Sf(b)|0;if((f|0)==0){d=0;return d|0}e=c[a-4>>2]|0;g=(e&-8)-((e&3|0)==0?8:4)|0;pg(f|0,a|0,g>>>0<b>>>0?g:b)|0;Tf(a);d=f;return d|0}function Wf(a){a=a|0;var b=0,d=0,e=0;b=(a|0)==0?1:a;while(1){d=Sf(b)|0;if((d|0)!=0){e=10;break}a=(G=c[544678]|0,c[544678]=G+0,G);if((a|0)==0){break}Lb[a&1]()}if((e|0)==10){return d|0}d=db(4)|0;c[d>>2]=9816;Aa(d|0,10064,10);return 0}function Xf(a){a=a|0;return Wf(a)|0}function Yf(a){a=a|0;if((a|0)==0){return}Tf(a);return}function Zf(a){a=a|0;Yf(a);return}function _f(a){a=a|0;return}function $f(a){a=a|0;Yf(a);return}function ag(a){a=a|0;return 5448}function bg(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0.0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0.0,U=0.0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,fa=0,ga=0,ha=0,ia=0.0,ja=0.0,ka=0,la=0,ma=0.0,na=0.0,oa=0,pa=0.0,qa=0,ra=0,sa=0,ta=0,ua=0,va=0,wa=0,xa=0.0,ya=0,za=0.0,Aa=0,Ba=0.0,Ca=0,Da=0,Ea=0,Fa=0,Ga=0.0,Ha=0,Ia=0.0,Ja=0,Ka=0,La=0,Ma=0,Na=0,Oa=0,Pa=0,Qa=0,Ra=0,Sa=0,Ta=0,Ua=0,Va=0,Wa=0,Xa=0,Ya=0,Za=0,_a=0,$a=0,ab=0,bb=0,cb=0,db=0,fb=0,gb=0,hb=0,ib=0,jb=0,kb=0,lb=0,mb=0,nb=0,ob=0,pb=0,qb=0,rb=0,sb=0,tb=0,ub=0,wb=0,xb=0,zb=0,Bb=0,Cb=0,Db=0,Eb=0,Fb=0,Gb=0,Hb=0,Ib=0,Jb=0,Kb=0,Lb=0,Mb=0,Nb=0,Ob=0,Pb=0,Qb=0,Rb=0,Sb=0,Tb=0,Ub=0,Vb=0,Wb=0,Xb=0,Yb=0,Zb=0,_b=0,$b=0,ac=0,bc=0,cc=0,dc=0,ec=0,fc=0,gc=0,hc=0,ic=0,jc=0,kc=0,lc=0,mc=0,nc=0,oc=0,pc=0,qc=0,rc=0,sc=0,tc=0,uc=0,vc=0,wc=0,xc=0,yc=0,zc=0,Ac=0,Bc=0,Cc=0,Dc=0,Ec=0,Fc=0,Gc=0,Hc=0,Ic=0,Jc=0,Kc=0,Lc=0.0,Mc=0,Nc=0,Oc=0,Pc=0,Qc=0.0,Rc=0.0,Sc=0.0,Tc=0,Uc=0,Vc=0.0,Wc=0.0,Xc=0.0,Yc=0.0,Zc=0,_c=0,$c=0.0,ad=0,bd=0;g=i;i=i+512|0;h=g|0;if((e|0)==0){j=-149;k=24}else if((e|0)==1){j=-1074;k=53}else if((e|0)==2){j=-1074;k=53}else{l=0.0;i=g;return+l}e=b+4|0;m=b+100|0;do{n=c[e>>2]|0;if(n>>>0<(c[m>>2]|0)>>>0){c[e>>2]=n+1;o=d[n]|0}else{o=dg(b)|0}}while((eb(o|0)|0)!=0);do{if((o|0)==45|(o|0)==43){n=1-(((o|0)==45)<<1)|0;p=c[e>>2]|0;if(p>>>0<(c[m>>2]|0)>>>0){c[e>>2]=p+1;q=d[p]|0;r=n;break}else{q=dg(b)|0;r=n;break}}else{q=o;r=1}}while(0);o=0;n=q;while(1){if((n|32|0)!=(a[2712+o|0]|0)){s=o;v=n;break}do{if(o>>>0<7>>>0){q=c[e>>2]|0;if(q>>>0<(c[m>>2]|0)>>>0){c[e>>2]=q+1;w=d[q]|0;break}else{w=dg(b)|0;break}}else{w=n}}while(0);q=o+1|0;if(q>>>0<8>>>0){o=q;n=w}else{s=q;v=w;break}}do{if((s|0)==3){x=23}else if((s|0)!=8){w=(f|0)!=0;if(s>>>0>3>>>0&w){if((s|0)==8){break}else{x=23;break}}a:do{if((s|0)==0){n=0;o=v;while(1){if((o|32|0)!=(a[7376+n|0]|0)){y=o;z=n;break a}do{if(n>>>0<2>>>0){q=c[e>>2]|0;if(q>>>0<(c[m>>2]|0)>>>0){c[e>>2]=q+1;A=d[q]|0;break}else{A=dg(b)|0;break}}else{A=o}}while(0);q=n+1|0;if(q>>>0<3>>>0){n=q;o=A}else{y=A;z=q;break}}}else{y=v;z=s}}while(0);if((z|0)==3){o=c[e>>2]|0;if(o>>>0<(c[m>>2]|0)>>>0){c[e>>2]=o+1;B=d[o]|0}else{B=dg(b)|0}if((B|0)==40){C=1}else{if((c[m>>2]|0)==0){l=+t;i=g;return+l}c[e>>2]=(c[e>>2]|0)-1;l=+t;i=g;return+l}while(1){o=c[e>>2]|0;if(o>>>0<(c[m>>2]|0)>>>0){c[e>>2]=o+1;D=d[o]|0}else{D=dg(b)|0}if(!((D-48|0)>>>0<10>>>0|(D-65|0)>>>0<26>>>0)){if(!((D-97|0)>>>0<26>>>0|(D|0)==95)){break}}C=C+1|0}if((D|0)==41){l=+t;i=g;return+l}o=(c[m>>2]|0)==0;if(!o){c[e>>2]=(c[e>>2]|0)-1}if(!w){c[(vb()|0)>>2]=22;cg(b,0);l=0.0;i=g;return+l}if((C|0)==0|o){l=+t;i=g;return+l}else{E=C}while(1){o=E-1|0;c[e>>2]=(c[e>>2]|0)-1;if((o|0)==0){l=+t;break}else{E=o}}i=g;return+l}else if((z|0)==0){do{if((y|0)==48){w=c[e>>2]|0;if(w>>>0<(c[m>>2]|0)>>>0){c[e>>2]=w+1;F=d[w]|0}else{F=dg(b)|0}if((F|32|0)!=120){if((c[m>>2]|0)==0){G=48;break}c[e>>2]=(c[e>>2]|0)-1;G=48;break}w=c[e>>2]|0;if(w>>>0<(c[m>>2]|0)>>>0){c[e>>2]=w+1;H=d[w]|0;J=0}else{H=dg(b)|0;J=0}while(1){if((H|0)==46){x=70;break}else if((H|0)!=48){K=H;L=0;M=0;N=0;O=0;P=J;Q=0;R=0;S=1.0;U=0.0;V=0;break}w=c[e>>2]|0;if(w>>>0<(c[m>>2]|0)>>>0){c[e>>2]=w+1;H=d[w]|0;J=1;continue}else{H=dg(b)|0;J=1;continue}}do{if((x|0)==70){w=c[e>>2]|0;if(w>>>0<(c[m>>2]|0)>>>0){c[e>>2]=w+1;W=d[w]|0}else{W=dg(b)|0}if((W|0)==48){X=0;Y=0}else{K=W;L=0;M=0;N=0;O=0;P=J;Q=1;R=0;S=1.0;U=0.0;V=0;break}while(1){w=c[e>>2]|0;if(w>>>0<(c[m>>2]|0)>>>0){c[e>>2]=w+1;Z=d[w]|0}else{Z=dg(b)|0}w=wg(Y,X,-1,-1)|0;o=I;if((Z|0)==48){X=o;Y=w}else{K=Z;L=0;M=0;N=o;O=w;P=1;Q=1;R=0;S=1.0;U=0.0;V=0;break}}}}while(0);b:while(1){w=K-48|0;do{if(w>>>0<10>>>0){_=w;x=83}else{o=K|32;n=(K|0)==46;if(!((o-97|0)>>>0<6>>>0|n)){$=K;break b}if(n){if((Q|0)==0){aa=L;ba=M;ca=L;da=M;fa=P;ga=1;ha=R;ia=S;ja=U;ka=V;break}else{$=46;break b}}else{_=(K|0)>57?o-87|0:w;x=83;break}}}while(0);if((x|0)==83){x=0;w=0;do{if((L|0)<(w|0)|(L|0)==(w|0)&M>>>0<8>>>0){la=R;ma=S;na=U;oa=_+(V<<4)|0}else{o=0;if((L|0)<(o|0)|(L|0)==(o|0)&M>>>0<14>>>0){pa=S*.0625;la=R;ma=pa;na=U+pa*+(_|0);oa=V;break}if((_|0)==0|(R|0)!=0){la=R;ma=S;na=U;oa=V;break}la=1;ma=S;na=U+S*.5;oa=V}}while(0);w=wg(M,L,1,0)|0;aa=I;ba=w;ca=N;da=O;fa=1;ga=Q;ha=la;ia=ma;ja=na;ka=oa}w=c[e>>2]|0;if(w>>>0<(c[m>>2]|0)>>>0){c[e>>2]=w+1;K=d[w]|0;L=aa;M=ba;N=ca;O=da;P=fa;Q=ga;R=ha;S=ia;U=ja;V=ka;continue}else{K=dg(b)|0;L=aa;M=ba;N=ca;O=da;P=fa;Q=ga;R=ha;S=ia;U=ja;V=ka;continue}}if((P|0)==0){w=(c[m>>2]|0)==0;if(!w){c[e>>2]=(c[e>>2]|0)-1}do{if((f|0)==0){cg(b,0)}else{if(w){break}o=c[e>>2]|0;c[e>>2]=o-1;if((Q|0)==0){break}c[e>>2]=o-2}}while(0);l=+(r|0)*0.0;i=g;return+l}w=(Q|0)==0;o=w?M:O;n=w?L:N;w=0;if((L|0)<(w|0)|(L|0)==(w|0)&M>>>0<8>>>0){w=V;q=L;p=M;while(1){qa=w<<4;ra=wg(p,q,1,0)|0;sa=I;ta=0;if((sa|0)<(ta|0)|(sa|0)==(ta|0)&ra>>>0<8>>>0){w=qa;q=sa;p=ra}else{ua=qa;break}}}else{ua=V}do{if(($|32|0)==112){p=lg(b,f)|0;q=I;if(!((p|0)==0&(q|0)==(-2147483648|0))){va=q;wa=p;break}if((f|0)==0){cg(b,0);l=0.0;i=g;return+l}else{if((c[m>>2]|0)==0){va=0;wa=0;break}c[e>>2]=(c[e>>2]|0)-1;va=0;wa=0;break}}else{if((c[m>>2]|0)==0){va=0;wa=0;break}c[e>>2]=(c[e>>2]|0)-1;va=0;wa=0}}while(0);p=wg(o<<2|0>>>30,n<<2|o>>>30,-32,-1)|0;q=wg(p,I,wa,va)|0;p=I;if((ua|0)==0){l=+(r|0)*0.0;i=g;return+l}w=0;if((p|0)>(w|0)|(p|0)==(w|0)&q>>>0>(-j|0)>>>0){c[(vb()|0)>>2]=34;l=+(r|0)*1.7976931348623157e+308*1.7976931348623157e+308;i=g;return+l}w=j-106|0;qa=(w|0)<0|0?-1:0;if((p|0)<(qa|0)|(p|0)==(qa|0)&q>>>0<w>>>0){c[(vb()|0)>>2]=34;l=+(r|0)*2.2250738585072014e-308*2.2250738585072014e-308;i=g;return+l}if((ua|0)>-1){w=ua;pa=U;qa=p;ra=q;while(1){sa=w<<1;if(pa<.5){xa=pa;ya=sa}else{xa=pa+-1.0;ya=sa|1}za=pa+xa;sa=wg(ra,qa,-1,-1)|0;ta=I;if((ya|0)>-1){w=ya;pa=za;qa=ta;ra=sa}else{Aa=ya;Ba=za;Ca=ta;Da=sa;break}}}else{Aa=ua;Ba=U;Ca=p;Da=q}ra=0;qa=xg(32,0,j,(j|0)<0|0?-1:0)|0;w=wg(Da,Ca,qa,I)|0;qa=I;if((ra|0)>(qa|0)|(ra|0)==(qa|0)&k>>>0>w>>>0){qa=w;if((qa|0)<0){Ea=0;x=126}else{Fa=qa;x=124}}else{Fa=k;x=124}do{if((x|0)==124){if((Fa|0)<53){Ea=Fa;x=126;break}Ga=0.0;Ha=Fa;Ia=+(r|0)}}while(0);if((x|0)==126){pa=+(r|0);Ga=+yb(+(+eg(1.0,84-Ea|0)),+pa);Ha=Ea;Ia=pa}q=(Ha|0)<32&Ba!=0.0&(Aa&1|0)==0;pa=Ia*(q?0.0:Ba)+(Ga+Ia*+(((q&1)+Aa|0)>>>0>>>0))-Ga;if(pa==0.0){c[(vb()|0)>>2]=34}l=+fg(pa,Da);i=g;return+l}else{G=y}}while(0);q=j+k|0;p=-q|0;qa=G;w=0;while(1){if((qa|0)==46){x=137;break}else if((qa|0)!=48){Ja=qa;Ka=0;La=w;Ma=0;Na=0;break}ra=c[e>>2]|0;if(ra>>>0<(c[m>>2]|0)>>>0){c[e>>2]=ra+1;qa=d[ra]|0;w=1;continue}else{qa=dg(b)|0;w=1;continue}}do{if((x|0)==137){qa=c[e>>2]|0;if(qa>>>0<(c[m>>2]|0)>>>0){c[e>>2]=qa+1;Oa=d[qa]|0}else{Oa=dg(b)|0}if((Oa|0)==48){Pa=0;Qa=0}else{Ja=Oa;Ka=1;La=w;Ma=0;Na=0;break}while(1){qa=wg(Qa,Pa,-1,-1)|0;ra=I;o=c[e>>2]|0;if(o>>>0<(c[m>>2]|0)>>>0){c[e>>2]=o+1;Ra=d[o]|0}else{Ra=dg(b)|0}if((Ra|0)==48){Pa=ra;Qa=qa}else{Ja=Ra;Ka=1;La=1;Ma=ra;Na=qa;break}}}}while(0);w=h|0;c[w>>2]=0;qa=Ja-48|0;ra=(Ja|0)==46;c:do{if(qa>>>0<10>>>0|ra){o=h+496|0;n=Ma;sa=Na;ta=0;Sa=0;Ta=0;Ua=La;Va=Ka;Wa=0;Xa=0;Ya=Ja;Za=qa;_a=ra;d:while(1){do{if(_a){if((Va|0)==0){$a=Xa;ab=Wa;bb=1;cb=Ua;db=Ta;fb=ta;gb=Sa;hb=ta;ib=Sa}else{break d}}else{jb=wg(Sa,ta,1,0)|0;kb=I;lb=(Ya|0)!=48;if((Wa|0)>=125){if(!lb){$a=Xa;ab=Wa;bb=Va;cb=Ua;db=Ta;fb=kb;gb=jb;hb=n;ib=sa;break}c[o>>2]=c[o>>2]|1;$a=Xa;ab=Wa;bb=Va;cb=Ua;db=Ta;fb=kb;gb=jb;hb=n;ib=sa;break}mb=h+(Wa<<2)|0;if((Xa|0)==0){nb=Za}else{nb=Ya-48+((c[mb>>2]|0)*10|0)|0}c[mb>>2]=nb;mb=Xa+1|0;ob=(mb|0)==9;$a=ob?0:mb;ab=(ob&1)+Wa|0;bb=Va;cb=1;db=lb?jb:Ta;fb=kb;gb=jb;hb=n;ib=sa}}while(0);jb=c[e>>2]|0;if(jb>>>0<(c[m>>2]|0)>>>0){c[e>>2]=jb+1;pb=d[jb]|0}else{pb=dg(b)|0}jb=pb-48|0;kb=(pb|0)==46;if(jb>>>0<10>>>0|kb){n=hb;sa=ib;ta=fb;Sa=gb;Ta=db;Ua=cb;Va=bb;Wa=ab;Xa=$a;Ya=pb;Za=jb;_a=kb}else{qb=hb;rb=ib;sb=fb;tb=gb;ub=db;wb=cb;xb=bb;zb=ab;Bb=$a;Cb=pb;x=160;break c}}Db=(Ua|0)!=0;Eb=n;Fb=sa;Gb=ta;Hb=Sa;Ib=Ta;Jb=Wa;Kb=Xa;x=168}else{qb=Ma;rb=Na;sb=0;tb=0;ub=0;wb=La;xb=Ka;zb=0;Bb=0;Cb=Ja;x=160}}while(0);do{if((x|0)==160){ra=(xb|0)==0;qa=ra?tb:rb;_a=ra?sb:qb;ra=(wb|0)!=0;if(!(ra&(Cb|32|0)==101)){if((Cb|0)>-1){Db=ra;Eb=_a;Fb=qa;Gb=sb;Hb=tb;Ib=ub;Jb=zb;Kb=Bb;x=168;break}else{Lb=_a;Mb=qa;Nb=ra;Ob=sb;Pb=tb;Qb=ub;Rb=zb;Sb=Bb;x=170;break}}ra=lg(b,f)|0;Za=I;do{if((ra|0)==0&(Za|0)==(-2147483648|0)){if((f|0)==0){cg(b,0);l=0.0;i=g;return+l}else{if((c[m>>2]|0)==0){Tb=0;Ub=0;break}c[e>>2]=(c[e>>2]|0)-1;Tb=0;Ub=0;break}}else{Tb=Za;Ub=ra}}while(0);ra=wg(Ub,Tb,qa,_a)|0;Vb=I;Wb=ra;Xb=sb;Yb=tb;Zb=ub;_b=zb;$b=Bb}}while(0);do{if((x|0)==168){if((c[m>>2]|0)==0){Lb=Eb;Mb=Fb;Nb=Db;Ob=Gb;Pb=Hb;Qb=Ib;Rb=Jb;Sb=Kb;x=170;break}c[e>>2]=(c[e>>2]|0)-1;if(Db){Vb=Eb;Wb=Fb;Xb=Gb;Yb=Hb;Zb=Ib;_b=Jb;$b=Kb}else{x=171}}}while(0);if((x|0)==170){if(Nb){Vb=Lb;Wb=Mb;Xb=Ob;Yb=Pb;Zb=Qb;_b=Rb;$b=Sb}else{x=171}}if((x|0)==171){c[(vb()|0)>>2]=22;cg(b,0);l=0.0;i=g;return+l}ra=c[w>>2]|0;if((ra|0)==0){l=+(r|0)*0.0;i=g;return+l}Za=0;do{if((Wb|0)==(Yb|0)&(Vb|0)==(Xb|0)&((Xb|0)<(Za|0)|(Xb|0)==(Za|0)&Yb>>>0<10>>>0)){if(!(k>>>0>30>>>0|(ra>>>(k>>>0)|0)==0)){break}l=+(r|0)*+(ra>>>0>>>0);i=g;return+l}}while(0);ra=(j|0)/-2|0;Za=(ra|0)<0|0?-1:0;if((Vb|0)>(Za|0)|(Vb|0)==(Za|0)&Wb>>>0>ra>>>0){c[(vb()|0)>>2]=34;l=+(r|0)*1.7976931348623157e+308*1.7976931348623157e+308;i=g;return+l}ra=j-106|0;Za=(ra|0)<0|0?-1:0;if((Vb|0)<(Za|0)|(Vb|0)==(Za|0)&Wb>>>0<ra>>>0){c[(vb()|0)>>2]=34;l=+(r|0)*2.2250738585072014e-308*2.2250738585072014e-308;i=g;return+l}if(($b|0)==0){ac=_b}else{if(($b|0)<9){ra=h+(_b<<2)|0;Za=$b;Xa=c[ra>>2]|0;do{Xa=Xa*10|0;Za=Za+1|0;}while((Za|0)<9);c[ra>>2]=Xa}ac=_b+1|0}Za=Wb;do{if((Zb|0)<9){if(!((Zb|0)<=(Za|0)&(Za|0)<18)){break}if((Za|0)==9){l=+(r|0)*+((c[w>>2]|0)>>>0>>>0);i=g;return+l}if((Za|0)<9){l=+(r|0)*+((c[w>>2]|0)>>>0>>>0)/+(c[552+(8-Za<<2)>>2]|0);i=g;return+l}Wa=k+27+(Za*-3|0)|0;Ta=c[w>>2]|0;if(!((Wa|0)>30|(Ta>>>(Wa>>>0)|0)==0)){break}l=+(r|0)*+(Ta>>>0>>>0)*+(c[552+(Za-10<<2)>>2]|0);i=g;return+l}}while(0);w=(Za|0)%9|0;if((w|0)==0){bc=0;cc=ac;dc=0;ec=Za}else{Xa=(Za|0)>-1?w:w+9|0;w=c[552+(8-Xa<<2)>>2]|0;do{if((ac|0)==0){fc=0;gc=0;hc=Za}else{ra=1e9/(w|0)|0;Ta=Za;Wa=0;Sa=0;ta=0;while(1){sa=h+(Sa<<2)|0;n=c[sa>>2]|0;Ua=((n>>>0)/(w>>>0)|0)+ta|0;c[sa>>2]=Ua;ic=ea((n>>>0)%(w>>>0)|0,ra)|0;n=Sa+1|0;if((Sa|0)==(Wa|0)&(Ua|0)==0){jc=n&127;kc=Ta-9|0}else{jc=Wa;kc=Ta}if((n|0)==(ac|0)){break}else{Ta=kc;Wa=jc;Sa=n;ta=ic}}if((ic|0)==0){fc=ac;gc=jc;hc=kc;break}c[h+(ac<<2)>>2]=ic;fc=ac+1|0;gc=jc;hc=kc}}while(0);bc=gc;cc=fc;dc=0;ec=9-Xa+hc|0}e:while(1){w=h+(bc<<2)|0;if((ec|0)<18){Za=cc;ta=dc;while(1){Sa=0;Wa=Za+127|0;Ta=Za;while(1){ra=Wa&127;_a=h+(ra<<2)|0;qa=c[_a>>2]|0;n=wg(qa<<29|0>>>3,0<<29|qa>>>3,Sa,0)|0;qa=I;Ua=0;if(qa>>>0>Ua>>>0|qa>>>0==Ua>>>0&n>>>0>1e9>>>0){Ua=Hg(n,qa,1e9,0)|0;sa=Ig(n,qa,1e9,0)|0;lc=Ua;mc=sa}else{lc=0;mc=n}c[_a>>2]=mc;_a=(ra|0)==(bc|0);if((ra|0)!=(Ta+127&127|0)|_a){nc=Ta}else{nc=(mc|0)==0?ra:Ta}if(_a){break}else{Sa=lc;Wa=ra-1|0;Ta=nc}}Ta=ta-29|0;if((lc|0)==0){Za=nc;ta=Ta}else{oc=Ta;pc=nc;qc=lc;break}}}else{if((ec|0)==18){rc=cc;sc=dc}else{tc=bc;uc=cc;vc=dc;wc=ec;break}while(1){if((c[w>>2]|0)>>>0>=9007199>>>0){tc=bc;uc=rc;vc=sc;wc=18;break e}ta=0;Za=rc+127|0;Ta=rc;while(1){Wa=Za&127;Sa=h+(Wa<<2)|0;ra=c[Sa>>2]|0;_a=wg(ra<<29|0>>>3,0<<29|ra>>>3,ta,0)|0;ra=I;n=0;if(ra>>>0>n>>>0|ra>>>0==n>>>0&_a>>>0>1e9>>>0){n=Hg(_a,ra,1e9,0)|0;sa=Ig(_a,ra,1e9,0)|0;xc=n;yc=sa}else{xc=0;yc=_a}c[Sa>>2]=yc;Sa=(Wa|0)==(bc|0);if((Wa|0)!=(Ta+127&127|0)|Sa){zc=Ta}else{zc=(yc|0)==0?Wa:Ta}if(Sa){break}else{ta=xc;Za=Wa-1|0;Ta=zc}}Ta=sc-29|0;if((xc|0)==0){rc=zc;sc=Ta}else{oc=Ta;pc=zc;qc=xc;break}}}w=bc+127&127;if((w|0)==(pc|0)){Ta=pc+127&127;Za=h+((pc+126&127)<<2)|0;c[Za>>2]=c[Za>>2]|c[h+(Ta<<2)>>2];Ac=Ta}else{Ac=pc}c[h+(w<<2)>>2]=qc;bc=w;cc=Ac;dc=oc;ec=ec+9|0}f:while(1){Bc=uc+1&127;Xa=h+((uc+127&127)<<2)|0;w=tc;Ta=vc;Za=wc;while(1){ta=(Za|0)==18;Wa=(Za|0)>27?9:1;Cc=w;Dc=Ta;while(1){Sa=0;while(1){_a=Sa+Cc&127;if((_a|0)==(uc|0)){Ec=2;break}sa=c[h+(_a<<2)>>2]|0;_a=c[544+(Sa<<2)>>2]|0;if(sa>>>0<_a>>>0){Ec=2;break}n=Sa+1|0;if(sa>>>0>_a>>>0){Ec=Sa;break}if((n|0)<2){Sa=n}else{Ec=n;break}}if((Ec|0)==2&ta){break f}Fc=Wa+Dc|0;if((Cc|0)==(uc|0)){Cc=uc;Dc=Fc}else{break}}ta=(1<<Wa)-1|0;Sa=1e9>>>(Wa>>>0);Gc=Za;Hc=Cc;n=Cc;Ic=0;do{_a=h+(n<<2)|0;sa=c[_a>>2]|0;ra=(sa>>>(Wa>>>0))+Ic|0;c[_a>>2]=ra;Ic=ea(sa&ta,Sa)|0;sa=(n|0)==(Hc|0)&(ra|0)==0;n=n+1&127;Gc=sa?Gc-9|0:Gc;Hc=sa?n:Hc;}while((n|0)!=(uc|0));if((Ic|0)==0){w=Hc;Ta=Fc;Za=Gc;continue}if((Bc|0)!=(Hc|0)){break}c[Xa>>2]=c[Xa>>2]|1;w=Hc;Ta=Fc;Za=Gc}c[h+(uc<<2)>>2]=Ic;tc=Hc;uc=Bc;vc=Fc;wc=Gc}Za=Cc&127;if((Za|0)==(uc|0)){c[h+(Bc-1<<2)>>2]=0;Jc=Bc}else{Jc=uc}pa=+((c[h+(Za<<2)>>2]|0)>>>0>>>0);Za=Cc+1&127;if((Za|0)==(Jc|0)){Ta=Jc+1&127;c[h+(Ta-1<<2)>>2]=0;Kc=Ta}else{Kc=Jc}za=+(r|0);Lc=za*(pa*1.0e9+ +((c[h+(Za<<2)>>2]|0)>>>0>>>0));Za=Dc+53|0;Ta=Za-j|0;if((Ta|0)<(k|0)){if((Ta|0)<0){Mc=1;Nc=0;x=244}else{Oc=Ta;Pc=1;x=243}}else{Oc=k;Pc=0;x=243}if((x|0)==243){if((Oc|0)<53){Mc=Pc;Nc=Oc;x=244}else{Qc=0.0;Rc=0.0;Sc=Lc;Tc=Pc;Uc=Oc}}if((x|0)==244){pa=+yb(+(+eg(1.0,105-Nc|0)),+Lc);Vc=+Ab(+Lc,+(+eg(1.0,53-Nc|0)));Qc=pa;Rc=Vc;Sc=pa+(Lc-Vc);Tc=Mc;Uc=Nc}w=Cc+2&127;do{if((w|0)==(Kc|0)){Wc=Rc}else{Xa=c[h+(w<<2)>>2]|0;do{if(Xa>>>0<5e8>>>0){if((Xa|0)==0){if((Cc+3&127|0)==(Kc|0)){Xc=Rc;break}}Xc=za*.25+Rc}else{if(Xa>>>0>5e8>>>0){Xc=za*.75+Rc;break}if((Cc+3&127|0)==(Kc|0)){Xc=za*.5+Rc;break}else{Xc=za*.75+Rc;break}}}while(0);if((53-Uc|0)<=1){Wc=Xc;break}if(+Ab(+Xc,+1.0)!=0.0){Wc=Xc;break}Wc=Xc+1.0}}while(0);za=Sc+Wc-Qc;do{if((Za&2147483647|0)>(-2-q|0)){if(+T(+za)<9007199254740992.0){Yc=za;Zc=Tc;_c=Dc}else{Yc=za*.5;Zc=(Tc|0)!=0&(Uc|0)==(Ta|0)?0:Tc;_c=Dc+1|0}if((_c+50|0)<=(p|0)){if(!((Zc|0)!=0&Wc!=0.0)){$c=Yc;ad=_c;break}}c[(vb()|0)>>2]=34;$c=Yc;ad=_c}else{$c=za;ad=Dc}}while(0);l=+fg($c,ad);i=g;return+l}else{if((c[m>>2]|0)!=0){c[e>>2]=(c[e>>2]|0)-1}c[(vb()|0)>>2]=22;cg(b,0);l=0.0;i=g;return+l}}}while(0);do{if((x|0)==23){b=(c[m>>2]|0)==0;if(!b){c[e>>2]=(c[e>>2]|0)-1}if(s>>>0<4>>>0|(f|0)==0|b){break}else{bd=s}do{c[e>>2]=(c[e>>2]|0)-1;bd=bd-1|0;}while(bd>>>0>3>>>0)}}while(0);l=+(r|0)*u;i=g;return+l}function cg(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;c[a+104>>2]=b;d=c[a+8>>2]|0;e=c[a+4>>2]|0;f=d-e|0;c[a+108>>2]=f;if((b|0)!=0&(f|0)>(b|0)){c[a+100>>2]=e+b;return}else{c[a+100>>2]=d;return}}function dg(b){b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;e=b+104|0;f=c[e>>2]|0;if((f|0)==0){g=3}else{if((c[b+108>>2]|0)<(f|0)){g=3}}do{if((g|0)==3){f=hg(b)|0;if((f|0)<0){break}h=c[e>>2]|0;i=c[b+8>>2]|0;do{if((h|0)==0){g=8}else{j=c[b+4>>2]|0;k=h-(c[b+108>>2]|0)-1|0;if((i-j|0)<=(k|0)){g=8;break}c[b+100>>2]=j+k}}while(0);if((g|0)==8){c[b+100>>2]=i}h=c[b+4>>2]|0;if((i|0)!=0){k=b+108|0;c[k>>2]=i+1-h+(c[k>>2]|0)}k=h-1|0;if((d[k]|0|0)==(f|0)){l=f;return l|0}a[k]=f;l=f;return l|0}}while(0);c[b+100>>2]=0;l=-1;return l|0}function eg(a,b){a=+a;b=b|0;var d=0.0,e=0,f=0.0,g=0;do{if((b|0)>1023){d=a*8.98846567431158e+307;e=b-1023|0;if((e|0)<=1023){f=d;g=e;break}e=b-2046|0;f=d*8.98846567431158e+307;g=(e|0)>1023?1023:e}else{if((b|0)>=-1022){f=a;g=b;break}d=a*2.2250738585072014e-308;e=b+1022|0;if((e|0)>=-1022){f=d;g=e;break}e=b+2044|0;f=d*2.2250738585072014e-308;g=(e|0)<-1022?-1022:e}}while(0);return+(f*(c[k>>2]=0<<20|0>>>12,c[k+4>>2]=g+1023<<20|0>>>12,+h[k>>3]))}function fg(a,b){a=+a;b=b|0;return+(+eg(a,b))}function gg(b){b=b|0;var d=0,e=0,f=0,g=0,h=0;d=b+74|0;e=a[d]|0;a[d]=e-1&255|e;e=b+20|0;d=b+44|0;if((c[e>>2]|0)>>>0>(c[d>>2]|0)>>>0){Kb[c[b+36>>2]&3](b,0,0)|0}c[b+16>>2]=0;c[b+28>>2]=0;c[e>>2]=0;e=b|0;f=c[e>>2]|0;if((f&20|0)==0){g=c[d>>2]|0;c[b+8>>2]=g;c[b+4>>2]=g;h=0;return h|0}if((f&4|0)==0){h=-1;return h|0}c[e>>2]=f|32;h=-1;return h|0}function hg(a){a=a|0;var b=0,e=0,f=0,g=0;b=i;i=i+8|0;e=b|0;if((c[a+8>>2]|0)==0){if((gg(a)|0)==0){f=3}else{g=-1}}else{f=3}do{if((f|0)==3){if((Kb[c[a+32>>2]&3](a,e,1)|0)!=1){g=-1;break}g=d[e]|0}}while(0);i=b;return g|0}function ig(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0.0,j=0,k=0,l=0,m=0;d=i;i=i+112|0;e=d|0;qg(e|0,0,112)|0;f=e+4|0;c[f>>2]=a;g=e+8|0;c[g>>2]=-1;c[e+44>>2]=a;c[e+76>>2]=-1;cg(e,0);h=+bg(e,1,1);j=(c[f>>2]|0)-(c[g>>2]|0)+(c[e+108>>2]|0)|0;if((b|0)==0){k=112;l=0;i=d;return+h}if((j|0)==0){m=a}else{m=a+j|0}c[b>>2]=m;k=112;l=0;i=d;return+h}function jg(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;d=a+4|0;e=c[d>>2]|0;f=e&-8;g=a;h=g+f|0;i=h;j=c[4884]|0;k=e&3;if(!((k|0)!=1&g>>>0>=j>>>0&g>>>0<h>>>0)){Ra();return 0}l=g+(f|4)|0;m=c[l>>2]|0;if((m&1|0)==0){Ra();return 0}if((k|0)==0){if(b>>>0<256>>>0){n=0;return n|0}do{if(f>>>0>=(b+4|0)>>>0){if((f-b|0)>>>0>c[4866]<<1>>>0){break}else{n=a}return n|0}}while(0);n=0;return n|0}if(f>>>0>=b>>>0){k=f-b|0;if(k>>>0<=15>>>0){n=a;return n|0}c[d>>2]=e&1|b|2;c[g+(b+4)>>2]=k|3;c[l>>2]=c[l>>2]|1;kg(g+b|0,k);n=a;return n|0}if((i|0)==(c[4886]|0)){k=(c[4883]|0)+f|0;if(k>>>0<=b>>>0){n=0;return n|0}l=k-b|0;c[d>>2]=e&1|b|2;c[g+(b+4)>>2]=l|1;c[4886]=g+b;c[4883]=l;n=a;return n|0}if((i|0)==(c[4885]|0)){l=(c[4882]|0)+f|0;if(l>>>0<b>>>0){n=0;return n|0}k=l-b|0;if(k>>>0>15>>>0){c[d>>2]=e&1|b|2;c[g+(b+4)>>2]=k|1;c[g+l>>2]=k;o=g+(l+4)|0;c[o>>2]=c[o>>2]&-2;p=g+b|0;q=k}else{c[d>>2]=e&1|l|2;e=g+(l+4)|0;c[e>>2]=c[e>>2]|1;p=0;q=0}c[4882]=q;c[4885]=p;n=a;return n|0}if((m&2|0)!=0){n=0;return n|0}p=(m&-8)+f|0;if(p>>>0<b>>>0){n=0;return n|0}q=p-b|0;e=m>>>3;a:do{if(m>>>0<256>>>0){l=c[g+(f+8)>>2]|0;k=c[g+(f+12)>>2]|0;o=19560+(e<<1<<2)|0;do{if((l|0)!=(o|0)){if(l>>>0<j>>>0){Ra();return 0}if((c[l+12>>2]|0)==(i|0)){break}Ra();return 0}}while(0);if((k|0)==(l|0)){c[4880]=c[4880]&~(1<<e);break}do{if((k|0)==(o|0)){r=k+8|0}else{if(k>>>0<j>>>0){Ra();return 0}s=k+8|0;if((c[s>>2]|0)==(i|0)){r=s;break}Ra();return 0}}while(0);c[l+12>>2]=k;c[r>>2]=l}else{o=h;s=c[g+(f+24)>>2]|0;t=c[g+(f+12)>>2]|0;do{if((t|0)==(o|0)){u=g+(f+20)|0;v=c[u>>2]|0;if((v|0)==0){w=g+(f+16)|0;x=c[w>>2]|0;if((x|0)==0){y=0;break}else{z=x;A=w}}else{z=v;A=u}while(1){u=z+20|0;v=c[u>>2]|0;if((v|0)!=0){z=v;A=u;continue}u=z+16|0;v=c[u>>2]|0;if((v|0)==0){break}else{z=v;A=u}}if(A>>>0<j>>>0){Ra();return 0}else{c[A>>2]=0;y=z;break}}else{u=c[g+(f+8)>>2]|0;if(u>>>0<j>>>0){Ra();return 0}v=u+12|0;if((c[v>>2]|0)!=(o|0)){Ra();return 0}w=t+8|0;if((c[w>>2]|0)==(o|0)){c[v>>2]=t;c[w>>2]=u;y=t;break}else{Ra();return 0}}}while(0);if((s|0)==0){break}t=g+(f+28)|0;l=19824+(c[t>>2]<<2)|0;do{if((o|0)==(c[l>>2]|0)){c[l>>2]=y;if((y|0)!=0){break}c[4881]=c[4881]&~(1<<c[t>>2]);break a}else{if(s>>>0<(c[4884]|0)>>>0){Ra();return 0}k=s+16|0;if((c[k>>2]|0)==(o|0)){c[k>>2]=y}else{c[s+20>>2]=y}if((y|0)==0){break a}}}while(0);if(y>>>0<(c[4884]|0)>>>0){Ra();return 0}c[y+24>>2]=s;o=c[g+(f+16)>>2]|0;do{if((o|0)!=0){if(o>>>0<(c[4884]|0)>>>0){Ra();return 0}else{c[y+16>>2]=o;c[o+24>>2]=y;break}}}while(0);o=c[g+(f+20)>>2]|0;if((o|0)==0){break}if(o>>>0<(c[4884]|0)>>>0){Ra();return 0}else{c[y+20>>2]=o;c[o+24>>2]=y;break}}}while(0);if(q>>>0<16>>>0){c[d>>2]=p|c[d>>2]&1|2;y=g+(p|4)|0;c[y>>2]=c[y>>2]|1;n=a;return n|0}else{c[d>>2]=c[d>>2]&1|b|2;c[g+(b+4)>>2]=q|3;d=g+(p|4)|0;c[d>>2]=c[d>>2]|1;kg(g+b|0,q);n=a;return n|0}return 0}function kg(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0;d=a;e=d+b|0;f=e;g=c[a+4>>2]|0;a:do{if((g&1|0)==0){h=c[a>>2]|0;if((g&3|0)==0){return}i=d+(-h|0)|0;j=i;k=h+b|0;l=c[4884]|0;if(i>>>0<l>>>0){Ra()}if((j|0)==(c[4885]|0)){m=d+(b+4)|0;if((c[m>>2]&3|0)!=3){n=j;o=k;break}c[4882]=k;c[m>>2]=c[m>>2]&-2;c[d+(4-h)>>2]=k|1;c[e>>2]=k;return}m=h>>>3;if(h>>>0<256>>>0){p=c[d+(8-h)>>2]|0;q=c[d+(12-h)>>2]|0;r=19560+(m<<1<<2)|0;do{if((p|0)!=(r|0)){if(p>>>0<l>>>0){Ra()}if((c[p+12>>2]|0)==(j|0)){break}Ra()}}while(0);if((q|0)==(p|0)){c[4880]=c[4880]&~(1<<m);n=j;o=k;break}do{if((q|0)==(r|0)){s=q+8|0}else{if(q>>>0<l>>>0){Ra()}t=q+8|0;if((c[t>>2]|0)==(j|0)){s=t;break}Ra()}}while(0);c[p+12>>2]=q;c[s>>2]=p;n=j;o=k;break}r=i;m=c[d+(24-h)>>2]|0;t=c[d+(12-h)>>2]|0;do{if((t|0)==(r|0)){u=16-h|0;v=d+(u+4)|0;w=c[v>>2]|0;if((w|0)==0){x=d+u|0;u=c[x>>2]|0;if((u|0)==0){y=0;break}else{z=u;A=x}}else{z=w;A=v}while(1){v=z+20|0;w=c[v>>2]|0;if((w|0)!=0){z=w;A=v;continue}v=z+16|0;w=c[v>>2]|0;if((w|0)==0){break}else{z=w;A=v}}if(A>>>0<l>>>0){Ra()}else{c[A>>2]=0;y=z;break}}else{v=c[d+(8-h)>>2]|0;if(v>>>0<l>>>0){Ra()}w=v+12|0;if((c[w>>2]|0)!=(r|0)){Ra()}x=t+8|0;if((c[x>>2]|0)==(r|0)){c[w>>2]=t;c[x>>2]=v;y=t;break}else{Ra()}}}while(0);if((m|0)==0){n=j;o=k;break}t=d+(28-h)|0;l=19824+(c[t>>2]<<2)|0;do{if((r|0)==(c[l>>2]|0)){c[l>>2]=y;if((y|0)!=0){break}c[4881]=c[4881]&~(1<<c[t>>2]);n=j;o=k;break a}else{if(m>>>0<(c[4884]|0)>>>0){Ra()}i=m+16|0;if((c[i>>2]|0)==(r|0)){c[i>>2]=y}else{c[m+20>>2]=y}if((y|0)==0){n=j;o=k;break a}}}while(0);if(y>>>0<(c[4884]|0)>>>0){Ra()}c[y+24>>2]=m;r=16-h|0;t=c[d+r>>2]|0;do{if((t|0)!=0){if(t>>>0<(c[4884]|0)>>>0){Ra()}else{c[y+16>>2]=t;c[t+24>>2]=y;break}}}while(0);t=c[d+(r+4)>>2]|0;if((t|0)==0){n=j;o=k;break}if(t>>>0<(c[4884]|0)>>>0){Ra()}else{c[y+20>>2]=t;c[t+24>>2]=y;n=j;o=k;break}}else{n=a;o=b}}while(0);a=c[4884]|0;if(e>>>0<a>>>0){Ra()}y=d+(b+4)|0;z=c[y>>2]|0;do{if((z&2|0)==0){if((f|0)==(c[4886]|0)){A=(c[4883]|0)+o|0;c[4883]=A;c[4886]=n;c[n+4>>2]=A|1;if((n|0)!=(c[4885]|0)){return}c[4885]=0;c[4882]=0;return}if((f|0)==(c[4885]|0)){A=(c[4882]|0)+o|0;c[4882]=A;c[4885]=n;c[n+4>>2]=A|1;c[n+A>>2]=A;return}A=(z&-8)+o|0;s=z>>>3;b:do{if(z>>>0<256>>>0){g=c[d+(b+8)>>2]|0;t=c[d+(b+12)>>2]|0;h=19560+(s<<1<<2)|0;do{if((g|0)!=(h|0)){if(g>>>0<a>>>0){Ra()}if((c[g+12>>2]|0)==(f|0)){break}Ra()}}while(0);if((t|0)==(g|0)){c[4880]=c[4880]&~(1<<s);break}do{if((t|0)==(h|0)){B=t+8|0}else{if(t>>>0<a>>>0){Ra()}m=t+8|0;if((c[m>>2]|0)==(f|0)){B=m;break}Ra()}}while(0);c[g+12>>2]=t;c[B>>2]=g}else{h=e;m=c[d+(b+24)>>2]|0;l=c[d+(b+12)>>2]|0;do{if((l|0)==(h|0)){i=d+(b+20)|0;p=c[i>>2]|0;if((p|0)==0){q=d+(b+16)|0;v=c[q>>2]|0;if((v|0)==0){C=0;break}else{D=v;E=q}}else{D=p;E=i}while(1){i=D+20|0;p=c[i>>2]|0;if((p|0)!=0){D=p;E=i;continue}i=D+16|0;p=c[i>>2]|0;if((p|0)==0){break}else{D=p;E=i}}if(E>>>0<a>>>0){Ra()}else{c[E>>2]=0;C=D;break}}else{i=c[d+(b+8)>>2]|0;if(i>>>0<a>>>0){Ra()}p=i+12|0;if((c[p>>2]|0)!=(h|0)){Ra()}q=l+8|0;if((c[q>>2]|0)==(h|0)){c[p>>2]=l;c[q>>2]=i;C=l;break}else{Ra()}}}while(0);if((m|0)==0){break}l=d+(b+28)|0;g=19824+(c[l>>2]<<2)|0;do{if((h|0)==(c[g>>2]|0)){c[g>>2]=C;if((C|0)!=0){break}c[4881]=c[4881]&~(1<<c[l>>2]);break b}else{if(m>>>0<(c[4884]|0)>>>0){Ra()}t=m+16|0;if((c[t>>2]|0)==(h|0)){c[t>>2]=C}else{c[m+20>>2]=C}if((C|0)==0){break b}}}while(0);if(C>>>0<(c[4884]|0)>>>0){Ra()}c[C+24>>2]=m;h=c[d+(b+16)>>2]|0;do{if((h|0)!=0){if(h>>>0<(c[4884]|0)>>>0){Ra()}else{c[C+16>>2]=h;c[h+24>>2]=C;break}}}while(0);h=c[d+(b+20)>>2]|0;if((h|0)==0){break}if(h>>>0<(c[4884]|0)>>>0){Ra()}else{c[C+20>>2]=h;c[h+24>>2]=C;break}}}while(0);c[n+4>>2]=A|1;c[n+A>>2]=A;if((n|0)!=(c[4885]|0)){F=A;break}c[4882]=A;return}else{c[y>>2]=z&-2;c[n+4>>2]=o|1;c[n+o>>2]=o;F=o}}while(0);o=F>>>3;if(F>>>0<256>>>0){z=o<<1;y=19560+(z<<2)|0;C=c[4880]|0;b=1<<o;do{if((C&b|0)==0){c[4880]=C|b;G=y;H=19560+(z+2<<2)|0}else{o=19560+(z+2<<2)|0;d=c[o>>2]|0;if(d>>>0>=(c[4884]|0)>>>0){G=d;H=o;break}Ra()}}while(0);c[H>>2]=n;c[G+12>>2]=n;c[n+8>>2]=G;c[n+12>>2]=y;return}y=n;G=F>>>8;do{if((G|0)==0){I=0}else{if(F>>>0>16777215>>>0){I=31;break}H=(G+1048320|0)>>>16&8;z=G<<H;b=(z+520192|0)>>>16&4;C=z<<b;z=(C+245760|0)>>>16&2;o=14-(b|H|z)+(C<<z>>>15)|0;I=F>>>((o+7|0)>>>0)&1|o<<1}}while(0);G=19824+(I<<2)|0;c[n+28>>2]=I;c[n+20>>2]=0;c[n+16>>2]=0;o=c[4881]|0;z=1<<I;if((o&z|0)==0){c[4881]=o|z;c[G>>2]=y;c[n+24>>2]=G;c[n+12>>2]=n;c[n+8>>2]=n;return}z=c[G>>2]|0;if((I|0)==31){J=0}else{J=25-(I>>>1)|0}c:do{if((c[z+4>>2]&-8|0)==(F|0)){K=z}else{I=z;G=F<<J;while(1){L=I+16+(G>>>31<<2)|0;o=c[L>>2]|0;if((o|0)==0){break}if((c[o+4>>2]&-8|0)==(F|0)){K=o;break c}else{I=o;G=G<<1}}if(L>>>0<(c[4884]|0)>>>0){Ra()}c[L>>2]=y;c[n+24>>2]=I;c[n+12>>2]=n;c[n+8>>2]=n;return}}while(0);L=K+8|0;F=c[L>>2]|0;J=c[4884]|0;if(!(K>>>0>=J>>>0&F>>>0>=J>>>0)){Ra()}c[F+12>>2]=y;c[L>>2]=y;c[n+8>>2]=F;c[n+12>>2]=K;c[n+24>>2]=0;return}function lg(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;e=a+4|0;f=c[e>>2]|0;g=a+100|0;if(f>>>0<(c[g>>2]|0)>>>0){c[e>>2]=f+1;h=d[f]|0}else{h=dg(a)|0}do{if((h|0)==45|(h|0)==43){f=c[e>>2]|0;i=(h|0)==45|0;if(f>>>0<(c[g>>2]|0)>>>0){c[e>>2]=f+1;j=d[f]|0}else{j=dg(a)|0}if(!((j-48|0)>>>0>9>>>0&(b|0)!=0)){k=i;l=j;break}if((c[g>>2]|0)==0){k=i;l=j;break}c[e>>2]=(c[e>>2]|0)-1;k=i;l=j}else{k=0;l=h}}while(0);if((l-48|0)>>>0>9>>>0){if((c[g>>2]|0)==0){m=-2147483648;n=0;return(I=m,n)|0}c[e>>2]=(c[e>>2]|0)-1;m=-2147483648;n=0;return(I=m,n)|0}else{o=l;p=0}while(1){q=o-48+(p*10|0)|0;l=c[e>>2]|0;if(l>>>0<(c[g>>2]|0)>>>0){c[e>>2]=l+1;r=d[l]|0}else{r=dg(a)|0}if((r-48|0)>>>0<10>>>0&(q|0)<214748364){o=r;p=q}else{break}}p=q;o=(q|0)<0|0?-1:0;if((r-48|0)>>>0<10>>>0){q=r;l=o;h=p;while(1){j=Gg(h,l,10,0)|0;b=I;i=wg(q,(q|0)<0|0?-1:0,-48,-1)|0;f=wg(i,I,j,b)|0;b=I;j=c[e>>2]|0;if(j>>>0<(c[g>>2]|0)>>>0){c[e>>2]=j+1;s=d[j]|0}else{s=dg(a)|0}j=21474836;if((s-48|0)>>>0<10>>>0&((b|0)<(j|0)|(b|0)==(j|0)&f>>>0<2061584302>>>0)){q=s;l=b;h=f}else{t=s;u=b;v=f;break}}}else{t=r;u=o;v=p}if((t-48|0)>>>0<10>>>0){do{t=c[e>>2]|0;if(t>>>0<(c[g>>2]|0)>>>0){c[e>>2]=t+1;w=d[t]|0}else{w=dg(a)|0}}while((w-48|0)>>>0<10>>>0)}if((c[g>>2]|0)!=0){c[e>>2]=(c[e>>2]|0)-1}e=(k|0)!=0;k=xg(0,0,v,u)|0;m=e?I:u;n=e?k:v;return(I=m,n)|0}function mg(b,c){b=b|0;c=c|0;var d=0;do{a[b+d|0]=a[c+d|0];d=d+1|0}while(a[c+(d-1)|0]|0);return b|0}function ng(b){b=b|0;var c=0;c=b;while(a[c]|0){c=c+1|0}return c-b|0}function og(b,c,d){b=b|0;c=c|0;d=d|0;var e=0,f=0;while((e|0)<(d|0)){a[b+e|0]=f?0:a[c+e|0]|0;f=f?1:(a[c+e|0]|0)==0;e=e+1|0}return b|0}function pg(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=b|0;if((b&3)==(d&3)){while(b&3){if((e|0)==0)return f|0;a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2];b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}function qg(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;f=b+e|0;if((e|0)>=20){d=d&255;g=b&3;h=d|d<<8|d<<16|d<<24;i=f&~3;if(g){g=b+4-g|0;while((b|0)<(g|0)){a[b]=d;b=b+1|0}}while((b|0)<(i|0)){c[b>>2]=h;b=b+4|0}}while((b|0)<(f|0)){a[b]=d;b=b+1|0}return b-e|0}function rg(a){a=a|0;if((a|0)<65)return a|0;if((a|0)>90)return a|0;return a-65+97|0}function sg(b,c,d){b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0;while(e>>>0<d>>>0){f=rg(a[b+e|0]|0)|0;g=rg(a[c+e|0]|0)|0;if((f|0)==(g|0)&(f|0)==0)return 0;if((f|0)==0)return-1;if((g|0)==0)return 1;if((f|0)==(g|0)){e=e+1|0;continue}else{return(f>>>0>g>>>0?1:-1)|0}}return 0}function tg(a,b){a=a|0;b=b|0;return sg(a,b,-1)|0}function ug(b,c,d){b=b|0;c=c|0;d=d|0;var e=0;if((c|0)<(b|0)&(b|0)<(c+d|0)){e=b;c=c+d|0;b=b+d|0;while((d|0)>0){b=b-1|0;c=c-1|0;d=d-1|0;a[b]=a[c]|0}b=e}else{pg(b,c,d)|0}return b|0}function vg(a,b,c){a=a|0;b=b|0;c=c|0;var e=0,f=0,g=0;while((e|0)<(c|0)){f=d[a+e|0]|0;g=d[b+e|0]|0;if((f|0)!=(g|0))return((f|0)>(g|0)?1:-1)|0;e=e+1|0}return 0}function wg(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=a+c>>>0;return(I=b+d+(e>>>0<a>>>0|0)>>>0,e|0)|0}function xg(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=b-d>>>0;e=b-d-(c>>>0>a>>>0|0)>>>0;return(I=e,a-c>>>0|0)|0}function yg(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){I=b<<c|(a&(1<<c)-1<<32-c)>>>32-c;return a<<c}I=a<<c-32;return 0}function zg(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){I=b>>>c;return a>>>c|(b&(1<<c)-1)<<32-c}I=0;return b>>>c-32|0}function Ag(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){I=b>>c;return a>>>c|(b&(1<<c)-1)<<32-c}I=(b|0)<0?-1:0;return b>>c-32|0}function Bg(b){b=b|0;var c=0;c=a[n+(b>>>24)|0]|0;if((c|0)<8)return c|0;c=a[n+(b>>16&255)|0]|0;if((c|0)<8)return c+8|0;c=a[n+(b>>8&255)|0]|0;if((c|0)<8)return c+16|0;return(a[n+(b&255)|0]|0)+24|0}function Cg(b){b=b|0;var c=0;c=a[m+(b&255)|0]|0;if((c|0)<8)return c|0;c=a[m+(b>>8&255)|0]|0;if((c|0)<8)return c+8|0;c=a[m+(b>>16&255)|0]|0;if((c|0)<8)return c+16|0;return(a[m+(b>>>24)|0]|0)+24|0}function Dg(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;c=a&65535;d=b&65535;e=ea(d,c)|0;f=a>>>16;a=(e>>>16)+(ea(d,f)|0)|0;d=b>>>16;b=ea(d,c)|0;return(I=(a>>>16)+(ea(d,f)|0)+(((a&65535)+b|0)>>>16)|0,a+b<<16|e&65535|0)|0}function Eg(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;e=b>>31|((b|0)<0?-1:0)<<1;f=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;g=d>>31|((d|0)<0?-1:0)<<1;h=((d|0)<0?-1:0)>>31|((d|0)<0?-1:0)<<1;i=xg(e^a,f^b,e,f)|0;b=I;a=g^e;e=h^f;f=xg((Jg(i,b,xg(g^c,h^d,g,h)|0,I,0)|0)^a,I^e,a,e)|0;return(I=I,f)|0}function Fg(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0;f=i;i=i+8|0;g=f|0;h=b>>31|((b|0)<0?-1:0)<<1;j=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;k=e>>31|((e|0)<0?-1:0)<<1;l=((e|0)<0?-1:0)>>31|((e|0)<0?-1:0)<<1;m=xg(h^a,j^b,h,j)|0;b=I;Jg(m,b,xg(k^d,l^e,k,l)|0,I,g)|0;l=xg(c[g>>2]^h,c[g+4>>2]^j,h,j)|0;j=I;i=f;return(I=j,l)|0}function Gg(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;e=a;a=c;c=Dg(e,a)|0;f=I;return(I=(ea(b,a)|0)+(ea(d,e)|0)+f|f&0,c|0|0)|0}function Hg(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=Jg(a,b,c,d,0)|0;return(I=I,e)|0}function Ig(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;f=i;i=i+8|0;g=f|0;Jg(a,b,d,e,g)|0;i=f;return(I=c[g+4>>2]|0,c[g>>2]|0)|0}function Jg(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,J=0,K=0,L=0,M=0;g=a;h=b;i=h;j=d;k=e;l=k;if((i|0)==0){m=(f|0)!=0;if((l|0)==0){if(m){c[f>>2]=(g>>>0)%(j>>>0);c[f+4>>2]=0}n=0;o=(g>>>0)/(j>>>0)>>>0;return(I=n,o)|0}else{if(!m){n=0;o=0;return(I=n,o)|0}c[f>>2]=a|0;c[f+4>>2]=b&0;n=0;o=0;return(I=n,o)|0}}m=(l|0)==0;do{if((j|0)==0){if(m){if((f|0)!=0){c[f>>2]=(i>>>0)%(j>>>0);c[f+4>>2]=0}n=0;o=(i>>>0)/(j>>>0)>>>0;return(I=n,o)|0}if((g|0)==0){if((f|0)!=0){c[f>>2]=0;c[f+4>>2]=(i>>>0)%(l>>>0)}n=0;o=(i>>>0)/(l>>>0)>>>0;return(I=n,o)|0}p=l-1|0;if((p&l|0)==0){if((f|0)!=0){c[f>>2]=a|0;c[f+4>>2]=p&i|b&0}n=0;o=i>>>((Cg(l|0)|0)>>>0);return(I=n,o)|0}p=(Bg(l|0)|0)-(Bg(i|0)|0)|0;if(p>>>0<=30){q=p+1|0;r=31-p|0;s=q;t=i<<r|g>>>(q>>>0);u=i>>>(q>>>0);v=0;w=g<<r;break}if((f|0)==0){n=0;o=0;return(I=n,o)|0}c[f>>2]=a|0;c[f+4>>2]=h|b&0;n=0;o=0;return(I=n,o)|0}else{if(!m){r=(Bg(l|0)|0)-(Bg(i|0)|0)|0;if(r>>>0<=31){q=r+1|0;p=31-r|0;x=r-31>>31;s=q;t=g>>>(q>>>0)&x|i<<p;u=i>>>(q>>>0)&x;v=0;w=g<<p;break}if((f|0)==0){n=0;o=0;return(I=n,o)|0}c[f>>2]=a|0;c[f+4>>2]=h|b&0;n=0;o=0;return(I=n,o)|0}p=j-1|0;if((p&j|0)!=0){x=(Bg(j|0)|0)+33-(Bg(i|0)|0)|0;q=64-x|0;r=32-x|0;y=r>>31;z=x-32|0;A=z>>31;s=x;t=r-1>>31&i>>>(z>>>0)|(i<<r|g>>>(x>>>0))&A;u=A&i>>>(x>>>0);v=g<<q&y;w=(i<<q|g>>>(z>>>0))&y|g<<r&x-33>>31;break}if((f|0)!=0){c[f>>2]=p&g;c[f+4>>2]=0}if((j|0)==1){n=h|b&0;o=a|0|0;return(I=n,o)|0}else{p=Cg(j|0)|0;n=i>>>(p>>>0)|0;o=i<<32-p|g>>>(p>>>0)|0;return(I=n,o)|0}}}while(0);if((s|0)==0){B=w;C=v;D=u;E=t;F=0;G=0}else{g=d|0|0;d=k|e&0;e=wg(g,d,-1,-1)|0;k=I;i=w;w=v;v=u;u=t;t=s;s=0;while(1){H=w>>>31|i<<1;J=s|w<<1;j=u<<1|i>>>31|0;a=u>>>31|v<<1|0;xg(e,k,j,a)|0;b=I;h=b>>31|((b|0)<0?-1:0)<<1;K=h&1;L=xg(j,a,h&g,(((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1)&d)|0;M=I;b=t-1|0;if((b|0)==0){break}else{i=H;w=J;v=M;u=L;t=b;s=K}}B=H;C=J;D=M;E=L;F=0;G=K}K=C;C=0;if((f|0)!=0){c[f>>2]=E;c[f+4>>2]=D}n=(K|0)>>>31|(B|C)<<1|(C<<1|K>>>31)&0|F;o=(K<<1|0>>>31)&-2|G;return(I=n,o)|0}function Kg(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;Hb[a&7](b|0,c|0,d|0,e|0,f|0)}function Lg(a,b){a=a|0;b=b|0;Ib[a&31](b|0)}function Mg(a,b){a=a|0;b=b|0;return Jb[a&3](b|0)|0}function Ng(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return Kb[a&3](b|0,c|0,d|0)|0}function Og(a){a=a|0;Lb[a&1]()}function Pg(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;Mb[a&7](b|0,c|0,d|0,e|0,f|0,g|0)}function Qg(a,b,c){a=a|0;b=b|0;c=c|0;return Nb[a&31](b|0,c|0)|0}function Rg(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;Ob[a&7](b|0,c|0,d|0,e|0)}function Sg(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;fa(0)}function Tg(a){a=a|0;fa(1)}function Ug(a){a=a|0;fa(2);return 0}function Vg(a,b,c){a=a|0;b=b|0;c=c|0;fa(3);return 0}function Wg(){fa(4)}function Xg(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;fa(5)}function Yg(a,b){a=a|0;b=b|0;fa(6);return 0}function Zg(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;fa(7)}




// EMSCRIPTEN_END_FUNCS
var Hb=[Sg,Sg,Of,Sg,Pf,Sg,Sg,Sg];var Ib=[Tg,Tg,If,Tg,Gf,Tg,$f,Tg,Hf,Tg,_f,Tg,Ff,Tg,Ef,Tg,he,Tg,ne,Tg,oe,Tg,ie,Tg,Jf,Tg,Tg,Tg,Tg,Tg,Tg,Tg];var Jb=[Ug,Ug,ag,Ug];var Kb=[Vg,Vg,Kf,Vg];var Lb=[Wg,Wg];var Mb=[Xg,Xg,Qf,Xg,Rf,Xg,Xg,Xg];var Nb=[Yg,Yg,Gc,Yg,_d,Yg,ae,Yg,Hc,Yg,ef,Yg,$d,Yg,be,Yg,Fc,Yg,Yg,Yg,Yg,Yg,Yg,Yg,Yg,Yg,Yg,Yg,Yg,Yg,Yg,Yg];var Ob=[Zg,Zg,Lf,Zg,Ic,Zg,Mf,Zg];return{_memcmp:vg,_strlen:ng,_free:Tf,_main:lc,_realloc:Vf,_strncpy:og,_memmove:ug,_tolower:rg,_strncasecmp:sg,_memset:qg,_malloc:Sf,_memcpy:pg,_strcasecmp:tg,_strcpy:mg,_calloc:Uf,runPostSets:dc,stackAlloc:Pb,stackSave:Qb,stackRestore:Rb,setThrew:Sb,setTempRet0:Vb,setTempRet1:Wb,setTempRet2:Xb,setTempRet3:Yb,setTempRet4:Zb,setTempRet5:_b,setTempRet6:$b,setTempRet7:ac,setTempRet8:bc,setTempRet9:cc,dynCall_viiiii:Kg,dynCall_vi:Lg,dynCall_ii:Mg,dynCall_iiii:Ng,dynCall_v:Og,dynCall_viiiiii:Pg,dynCall_iii:Qg,dynCall_viiii:Rg}})


// EMSCRIPTEN_END_ASM
({ "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array }, { "abort": abort, "assert": assert, "asmPrintInt": asmPrintInt, "asmPrintFloat": asmPrintFloat, "min": Math_min, "invoke_viiiii": invoke_viiiii, "invoke_vi": invoke_vi, "invoke_ii": invoke_ii, "invoke_iiii": invoke_iiii, "invoke_v": invoke_v, "invoke_viiiiii": invoke_viiiiii, "invoke_iii": invoke_iii, "invoke_viiii": invoke_viiii, "_strncmp": _strncmp, "_lseek": _lseek, "_sscanf": _sscanf, "_fabsf": _fabsf, "_snprintf": _snprintf, "_vsnprintf": _vsnprintf, "__scanString": __scanString, "_llvm_va_end": _llvm_va_end, "___cxa_throw": ___cxa_throw, "_fread": _fread, "_fclose": _fclose, "__getFloat": __getFloat, "_isalnum": _isalnum, "_fprintf": _fprintf, "_printf": _printf, "_close": _close, "_pread": _pread, "_fflush": _fflush, "_fopen": _fopen, "__reallyNegative": __reallyNegative, "_sqrtf": _sqrtf, "_strchr": _strchr, "_fputc": _fputc, "_sysconf": _sysconf, "_open": _open, "_abort": _abort, "___setErrNo": ___setErrNo, "_fwrite": _fwrite, "_fseek": _fseek, "_send": _send, "_write": _write, "_fputs": _fputs, "_ftell": _ftell, "_isalpha": _isalpha, "_exit": _exit, "_sprintf": _sprintf, "_llvm_lifetime_end": _llvm_lifetime_end, "_strrchr": _strrchr, "_strdup": _strdup, "___cxa_allocate_exception": ___cxa_allocate_exception, "_isspace": _isspace, "_realpath": _realpath, "_read": _read, "___cxa_is_number_type": ___cxa_is_number_type, "_time": _time, "__formatString": __formatString, "___cxa_does_inherit": ___cxa_does_inherit, "_fabs": _fabs, "___cxa_find_matching_catch": ___cxa_find_matching_catch, "__ZNSt9exceptionD2Ev": __ZNSt9exceptionD2Ev, "_recv": _recv, "__ZSt18uncaught_exceptionv": __ZSt18uncaught_exceptionv, "_pwrite": _pwrite, "_strstr": _strstr, "_puts": _puts, "_fsync": _fsync, "_fgetc": _fgetc, "___errno_location": ___errno_location, "___gxx_personality_v0": ___gxx_personality_v0, "_llvm_lifetime_start": _llvm_lifetime_start, "_copysign": _copysign, "_sbrk": _sbrk, "_fmod": _fmod, "___resumeException": ___resumeException, "_ungetc": _ungetc, "___cxa_call_unexpected": ___cxa_call_unexpected, "__exit": __exit, "_strcmp": _strcmp, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "cttz_i8": cttz_i8, "ctlz_i8": ctlz_i8, "NaN": NaN, "Infinity": Infinity, "__ZTVN10__cxxabiv117__class_type_infoE": __ZTVN10__cxxabiv117__class_type_infoE, "__ZTVN10__cxxabiv120__si_class_type_infoE": __ZTVN10__cxxabiv120__si_class_type_infoE, "_stderr": _stderr, "_stdout": _stdout, "__ZTISt9exception": __ZTISt9exception }, buffer);
var _memcmp = Module["_memcmp"] = asm["_memcmp"];
var _strlen = Module["_strlen"] = asm["_strlen"];
var _free = Module["_free"] = asm["_free"];
var _main = Module["_main"] = asm["_main"];
var _realloc = Module["_realloc"] = asm["_realloc"];
var _strncpy = Module["_strncpy"] = asm["_strncpy"];
var _memmove = Module["_memmove"] = asm["_memmove"];
var _tolower = Module["_tolower"] = asm["_tolower"];
var _strncasecmp = Module["_strncasecmp"] = asm["_strncasecmp"];
var _memset = Module["_memset"] = asm["_memset"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var _strcasecmp = Module["_strcasecmp"] = asm["_strcasecmp"];
var _strcpy = Module["_strcpy"] = asm["_strcpy"];
var _calloc = Module["_calloc"] = asm["_calloc"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var dynCall_viiiii = Module["dynCall_viiiii"] = asm["dynCall_viiiii"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_viiiiii = Module["dynCall_viiiiii"] = asm["dynCall_viiiiii"];
var dynCall_iii = Module["dynCall_iii"] = asm["dynCall_iii"];
var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];

Runtime.stackAlloc = function(size) { return asm['stackAlloc'](size) };
Runtime.stackSave = function() { return asm['stackSave']() };
Runtime.stackRestore = function(top) { asm['stackRestore'](top) };

// TODO: strip out parts of this we do not need

//======= begin closure i64 code =======

// Copyright 2009 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Defines a Long class for representing a 64-bit two's-complement
 * integer value, which faithfully simulates the behavior of a Java "long". This
 * implementation is derived from LongLib in GWT.
 *
 */

var i64Math = (function() { // Emscripten wrapper
  var goog = { math: {} };


  /**
   * Constructs a 64-bit two's-complement integer, given its low and high 32-bit
   * values as *signed* integers.  See the from* functions below for more
   * convenient ways of constructing Longs.
   *
   * The internal representation of a long is the two given signed, 32-bit values.
   * We use 32-bit pieces because these are the size of integers on which
   * Javascript performs bit-operations.  For operations like addition and
   * multiplication, we split each number into 16-bit pieces, which can easily be
   * multiplied within Javascript's floating-point representation without overflow
   * or change in sign.
   *
   * In the algorithms below, we frequently reduce the negative case to the
   * positive case by negating the input(s) and then post-processing the result.
   * Note that we must ALWAYS check specially whether those values are MIN_VALUE
   * (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
   * a positive number, it overflows back into a negative).  Not handling this
   * case would often result in infinite recursion.
   *
   * @param {number} low  The low (signed) 32 bits of the long.
   * @param {number} high  The high (signed) 32 bits of the long.
   * @constructor
   */
  goog.math.Long = function(low, high) {
    /**
     * @type {number}
     * @private
     */
    this.low_ = low | 0;  // force into 32 signed bits.

    /**
     * @type {number}
     * @private
     */
    this.high_ = high | 0;  // force into 32 signed bits.
  };


  // NOTE: Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the
  // from* methods on which they depend.


  /**
   * A cache of the Long representations of small integer values.
   * @type {!Object}
   * @private
   */
  goog.math.Long.IntCache_ = {};


  /**
   * Returns a Long representing the given (32-bit) integer value.
   * @param {number} value The 32-bit integer in question.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromInt = function(value) {
    if (-128 <= value && value < 128) {
      var cachedObj = goog.math.Long.IntCache_[value];
      if (cachedObj) {
        return cachedObj;
      }
    }

    var obj = new goog.math.Long(value | 0, value < 0 ? -1 : 0);
    if (-128 <= value && value < 128) {
      goog.math.Long.IntCache_[value] = obj;
    }
    return obj;
  };


  /**
   * Returns a Long representing the given value, provided that it is a finite
   * number.  Otherwise, zero is returned.
   * @param {number} value The number in question.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromNumber = function(value) {
    if (isNaN(value) || !isFinite(value)) {
      return goog.math.Long.ZERO;
    } else if (value <= -goog.math.Long.TWO_PWR_63_DBL_) {
      return goog.math.Long.MIN_VALUE;
    } else if (value + 1 >= goog.math.Long.TWO_PWR_63_DBL_) {
      return goog.math.Long.MAX_VALUE;
    } else if (value < 0) {
      return goog.math.Long.fromNumber(-value).negate();
    } else {
      return new goog.math.Long(
          (value % goog.math.Long.TWO_PWR_32_DBL_) | 0,
          (value / goog.math.Long.TWO_PWR_32_DBL_) | 0);
    }
  };


  /**
   * Returns a Long representing the 64-bit integer that comes by concatenating
   * the given high and low bits.  Each is assumed to use 32 bits.
   * @param {number} lowBits The low 32-bits.
   * @param {number} highBits The high 32-bits.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromBits = function(lowBits, highBits) {
    return new goog.math.Long(lowBits, highBits);
  };


  /**
   * Returns a Long representation of the given string, written using the given
   * radix.
   * @param {string} str The textual representation of the Long.
   * @param {number=} opt_radix The radix in which the text is written.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromString = function(str, opt_radix) {
    if (str.length == 0) {
      throw Error('number format error: empty string');
    }

    var radix = opt_radix || 10;
    if (radix < 2 || 36 < radix) {
      throw Error('radix out of range: ' + radix);
    }

    if (str.charAt(0) == '-') {
      return goog.math.Long.fromString(str.substring(1), radix).negate();
    } else if (str.indexOf('-') >= 0) {
      throw Error('number format error: interior "-" character: ' + str);
    }

    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 8));

    var result = goog.math.Long.ZERO;
    for (var i = 0; i < str.length; i += 8) {
      var size = Math.min(8, str.length - i);
      var value = parseInt(str.substring(i, i + size), radix);
      if (size < 8) {
        var power = goog.math.Long.fromNumber(Math.pow(radix, size));
        result = result.multiply(power).add(goog.math.Long.fromNumber(value));
      } else {
        result = result.multiply(radixToPower);
        result = result.add(goog.math.Long.fromNumber(value));
      }
    }
    return result;
  };


  // NOTE: the compiler should inline these constant values below and then remove
  // these variables, so there should be no runtime penalty for these.


  /**
   * Number used repeated below in calculations.  This must appear before the
   * first call to any from* function below.
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_16_DBL_ = 1 << 16;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_24_DBL_ = 1 << 24;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_32_DBL_ =
      goog.math.Long.TWO_PWR_16_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_31_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ / 2;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_48_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_64_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_32_DBL_;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_63_DBL_ =
      goog.math.Long.TWO_PWR_64_DBL_ / 2;


  /** @type {!goog.math.Long} */
  goog.math.Long.ZERO = goog.math.Long.fromInt(0);


  /** @type {!goog.math.Long} */
  goog.math.Long.ONE = goog.math.Long.fromInt(1);


  /** @type {!goog.math.Long} */
  goog.math.Long.NEG_ONE = goog.math.Long.fromInt(-1);


  /** @type {!goog.math.Long} */
  goog.math.Long.MAX_VALUE =
      goog.math.Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);


  /** @type {!goog.math.Long} */
  goog.math.Long.MIN_VALUE = goog.math.Long.fromBits(0, 0x80000000 | 0);


  /**
   * @type {!goog.math.Long}
   * @private
   */
  goog.math.Long.TWO_PWR_24_ = goog.math.Long.fromInt(1 << 24);


  /** @return {number} The value, assuming it is a 32-bit integer. */
  goog.math.Long.prototype.toInt = function() {
    return this.low_;
  };


  /** @return {number} The closest floating-point representation to this value. */
  goog.math.Long.prototype.toNumber = function() {
    return this.high_ * goog.math.Long.TWO_PWR_32_DBL_ +
           this.getLowBitsUnsigned();
  };


  /**
   * @param {number=} opt_radix The radix in which the text should be written.
   * @return {string} The textual representation of this value.
   */
  goog.math.Long.prototype.toString = function(opt_radix) {
    var radix = opt_radix || 10;
    if (radix < 2 || 36 < radix) {
      throw Error('radix out of range: ' + radix);
    }

    if (this.isZero()) {
      return '0';
    }

    if (this.isNegative()) {
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        // We need to change the Long value before it can be negated, so we remove
        // the bottom-most digit in this base and then recurse to do the rest.
        var radixLong = goog.math.Long.fromNumber(radix);
        var div = this.div(radixLong);
        var rem = div.multiply(radixLong).subtract(this);
        return div.toString(radix) + rem.toInt().toString(radix);
      } else {
        return '-' + this.negate().toString(radix);
      }
    }

    // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 6));

    var rem = this;
    var result = '';
    while (true) {
      var remDiv = rem.div(radixToPower);
      var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
      var digits = intval.toString(radix);

      rem = remDiv;
      if (rem.isZero()) {
        return digits + result;
      } else {
        while (digits.length < 6) {
          digits = '0' + digits;
        }
        result = '' + digits + result;
      }
    }
  };


  /** @return {number} The high 32-bits as a signed value. */
  goog.math.Long.prototype.getHighBits = function() {
    return this.high_;
  };


  /** @return {number} The low 32-bits as a signed value. */
  goog.math.Long.prototype.getLowBits = function() {
    return this.low_;
  };


  /** @return {number} The low 32-bits as an unsigned value. */
  goog.math.Long.prototype.getLowBitsUnsigned = function() {
    return (this.low_ >= 0) ?
        this.low_ : goog.math.Long.TWO_PWR_32_DBL_ + this.low_;
  };


  /**
   * @return {number} Returns the number of bits needed to represent the absolute
   *     value of this Long.
   */
  goog.math.Long.prototype.getNumBitsAbs = function() {
    if (this.isNegative()) {
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        return 64;
      } else {
        return this.negate().getNumBitsAbs();
      }
    } else {
      var val = this.high_ != 0 ? this.high_ : this.low_;
      for (var bit = 31; bit > 0; bit--) {
        if ((val & (1 << bit)) != 0) {
          break;
        }
      }
      return this.high_ != 0 ? bit + 33 : bit + 1;
    }
  };


  /** @return {boolean} Whether this value is zero. */
  goog.math.Long.prototype.isZero = function() {
    return this.high_ == 0 && this.low_ == 0;
  };


  /** @return {boolean} Whether this value is negative. */
  goog.math.Long.prototype.isNegative = function() {
    return this.high_ < 0;
  };


  /** @return {boolean} Whether this value is odd. */
  goog.math.Long.prototype.isOdd = function() {
    return (this.low_ & 1) == 1;
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long equals the other.
   */
  goog.math.Long.prototype.equals = function(other) {
    return (this.high_ == other.high_) && (this.low_ == other.low_);
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long does not equal the other.
   */
  goog.math.Long.prototype.notEquals = function(other) {
    return (this.high_ != other.high_) || (this.low_ != other.low_);
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is less than the other.
   */
  goog.math.Long.prototype.lessThan = function(other) {
    return this.compare(other) < 0;
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is less than or equal to the other.
   */
  goog.math.Long.prototype.lessThanOrEqual = function(other) {
    return this.compare(other) <= 0;
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is greater than the other.
   */
  goog.math.Long.prototype.greaterThan = function(other) {
    return this.compare(other) > 0;
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is greater than or equal to the other.
   */
  goog.math.Long.prototype.greaterThanOrEqual = function(other) {
    return this.compare(other) >= 0;
  };


  /**
   * Compares this Long with the given one.
   * @param {goog.math.Long} other Long to compare against.
   * @return {number} 0 if they are the same, 1 if the this is greater, and -1
   *     if the given one is greater.
   */
  goog.math.Long.prototype.compare = function(other) {
    if (this.equals(other)) {
      return 0;
    }

    var thisNeg = this.isNegative();
    var otherNeg = other.isNegative();
    if (thisNeg && !otherNeg) {
      return -1;
    }
    if (!thisNeg && otherNeg) {
      return 1;
    }

    // at this point, the signs are the same, so subtraction will not overflow
    if (this.subtract(other).isNegative()) {
      return -1;
    } else {
      return 1;
    }
  };


  /** @return {!goog.math.Long} The negation of this value. */
  goog.math.Long.prototype.negate = function() {
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.MIN_VALUE;
    } else {
      return this.not().add(goog.math.Long.ONE);
    }
  };


  /**
   * Returns the sum of this and the given Long.
   * @param {goog.math.Long} other Long to add to this one.
   * @return {!goog.math.Long} The sum of this and the given Long.
   */
  goog.math.Long.prototype.add = function(other) {
    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

    var a48 = this.high_ >>> 16;
    var a32 = this.high_ & 0xFFFF;
    var a16 = this.low_ >>> 16;
    var a00 = this.low_ & 0xFFFF;

    var b48 = other.high_ >>> 16;
    var b32 = other.high_ & 0xFFFF;
    var b16 = other.low_ >>> 16;
    var b00 = other.low_ & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  };


  /**
   * Returns the difference of this and the given Long.
   * @param {goog.math.Long} other Long to subtract from this.
   * @return {!goog.math.Long} The difference of this and the given Long.
   */
  goog.math.Long.prototype.subtract = function(other) {
    return this.add(other.negate());
  };


  /**
   * Returns the product of this and the given long.
   * @param {goog.math.Long} other Long to multiply with this.
   * @return {!goog.math.Long} The product of this and the other.
   */
  goog.math.Long.prototype.multiply = function(other) {
    if (this.isZero()) {
      return goog.math.Long.ZERO;
    } else if (other.isZero()) {
      return goog.math.Long.ZERO;
    }

    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return other.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return this.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    }

    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().multiply(other.negate());
      } else {
        return this.negate().multiply(other).negate();
      }
    } else if (other.isNegative()) {
      return this.multiply(other.negate()).negate();
    }

    // If both longs are small, use float multiplication
    if (this.lessThan(goog.math.Long.TWO_PWR_24_) &&
        other.lessThan(goog.math.Long.TWO_PWR_24_)) {
      return goog.math.Long.fromNumber(this.toNumber() * other.toNumber());
    }

    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.

    var a48 = this.high_ >>> 16;
    var a32 = this.high_ & 0xFFFF;
    var a16 = this.low_ >>> 16;
    var a00 = this.low_ & 0xFFFF;

    var b48 = other.high_ >>> 16;
    var b32 = other.high_ & 0xFFFF;
    var b16 = other.low_ >>> 16;
    var b00 = other.low_ & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  };


  /**
   * Returns this Long divided by the given one.
   * @param {goog.math.Long} other Long by which to divide.
   * @return {!goog.math.Long} This Long divided by the given one.
   */
  goog.math.Long.prototype.div = function(other) {
    if (other.isZero()) {
      throw Error('division by zero');
    } else if (this.isZero()) {
      return goog.math.Long.ZERO;
    }

    if (this.equals(goog.math.Long.MIN_VALUE)) {
      if (other.equals(goog.math.Long.ONE) ||
          other.equals(goog.math.Long.NEG_ONE)) {
        return goog.math.Long.MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
      } else if (other.equals(goog.math.Long.MIN_VALUE)) {
        return goog.math.Long.ONE;
      } else {
        // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
        var halfThis = this.shiftRight(1);
        var approx = halfThis.div(other).shiftLeft(1);
        if (approx.equals(goog.math.Long.ZERO)) {
          return other.isNegative() ? goog.math.Long.ONE : goog.math.Long.NEG_ONE;
        } else {
          var rem = this.subtract(other.multiply(approx));
          var result = approx.add(rem.div(other));
          return result;
        }
      }
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.ZERO;
    }

    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().div(other.negate());
      } else {
        return this.negate().div(other).negate();
      }
    } else if (other.isNegative()) {
      return this.div(other.negate()).negate();
    }

    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    var res = goog.math.Long.ZERO;
    var rem = this;
    while (rem.greaterThanOrEqual(other)) {
      // Approximate the result of division. This may be a little greater or
      // smaller than the actual value.
      var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));

      // We will tweak the approximate result by changing it in the 48-th digit or
      // the smallest non-fractional digit, whichever is larger.
      var log2 = Math.ceil(Math.log(approx) / Math.LN2);
      var delta = (log2 <= 48) ? 1 : Math.pow(2, log2 - 48);

      // Decrease the approximation until it is smaller than the remainder.  Note
      // that if it is too large, the product overflows and is negative.
      var approxRes = goog.math.Long.fromNumber(approx);
      var approxRem = approxRes.multiply(other);
      while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
        approx -= delta;
        approxRes = goog.math.Long.fromNumber(approx);
        approxRem = approxRes.multiply(other);
      }

      // We know the answer can't be zero... and actually, zero would cause
      // infinite recursion since we would make no progress.
      if (approxRes.isZero()) {
        approxRes = goog.math.Long.ONE;
      }

      res = res.add(approxRes);
      rem = rem.subtract(approxRem);
    }
    return res;
  };


  /**
   * Returns this Long modulo the given one.
   * @param {goog.math.Long} other Long by which to mod.
   * @return {!goog.math.Long} This Long modulo the given one.
   */
  goog.math.Long.prototype.modulo = function(other) {
    return this.subtract(this.div(other).multiply(other));
  };


  /** @return {!goog.math.Long} The bitwise-NOT of this value. */
  goog.math.Long.prototype.not = function() {
    return goog.math.Long.fromBits(~this.low_, ~this.high_);
  };


  /**
   * Returns the bitwise-AND of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to AND.
   * @return {!goog.math.Long} The bitwise-AND of this and the other.
   */
  goog.math.Long.prototype.and = function(other) {
    return goog.math.Long.fromBits(this.low_ & other.low_,
                                   this.high_ & other.high_);
  };


  /**
   * Returns the bitwise-OR of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to OR.
   * @return {!goog.math.Long} The bitwise-OR of this and the other.
   */
  goog.math.Long.prototype.or = function(other) {
    return goog.math.Long.fromBits(this.low_ | other.low_,
                                   this.high_ | other.high_);
  };


  /**
   * Returns the bitwise-XOR of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to XOR.
   * @return {!goog.math.Long} The bitwise-XOR of this and the other.
   */
  goog.math.Long.prototype.xor = function(other) {
    return goog.math.Long.fromBits(this.low_ ^ other.low_,
                                   this.high_ ^ other.high_);
  };


  /**
   * Returns this Long with bits shifted to the left by the given amount.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the left by the given amount.
   */
  goog.math.Long.prototype.shiftLeft = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var low = this.low_;
      if (numBits < 32) {
        var high = this.high_;
        return goog.math.Long.fromBits(
            low << numBits,
            (high << numBits) | (low >>> (32 - numBits)));
      } else {
        return goog.math.Long.fromBits(0, low << (numBits - 32));
      }
    }
  };


  /**
   * Returns this Long with bits shifted to the right by the given amount.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the right by the given amount.
   */
  goog.math.Long.prototype.shiftRight = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var high = this.high_;
      if (numBits < 32) {
        var low = this.low_;
        return goog.math.Long.fromBits(
            (low >>> numBits) | (high << (32 - numBits)),
            high >> numBits);
      } else {
        return goog.math.Long.fromBits(
            high >> (numBits - 32),
            high >= 0 ? 0 : -1);
      }
    }
  };


  /**
   * Returns this Long with bits shifted to the right by the given amount, with
   * the new top bits matching the current sign bit.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the right by the given amount, with
   *     zeros placed into the new leading bits.
   */
  goog.math.Long.prototype.shiftRightUnsigned = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var high = this.high_;
      if (numBits < 32) {
        var low = this.low_;
        return goog.math.Long.fromBits(
            (low >>> numBits) | (high << (32 - numBits)),
            high >>> numBits);
      } else if (numBits == 32) {
        return goog.math.Long.fromBits(high, 0);
      } else {
        return goog.math.Long.fromBits(high >>> (numBits - 32), 0);
      }
    }
  };

  //======= begin jsbn =======

  var navigator = { appName: 'Modern Browser' }; // polyfill a little

  // Copyright (c) 2005  Tom Wu
  // All Rights Reserved.
  // http://www-cs-students.stanford.edu/~tjw/jsbn/

  /*
   * Copyright (c) 2003-2005  Tom Wu
   * All Rights Reserved.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND, 
   * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY 
   * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  
   *
   * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
   * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
   * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
   * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
   * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * In addition, the following condition applies:
   *
   * All redistributions must retain an intact copy of this copyright notice
   * and disclaimer.
   */

  // Basic JavaScript BN library - subset useful for RSA encryption.

  // Bits per digit
  var dbits;

  // JavaScript engine analysis
  var canary = 0xdeadbeefcafe;
  var j_lm = ((canary&0xffffff)==0xefcafe);

  // (public) Constructor
  function BigInteger(a,b,c) {
    if(a != null)
      if("number" == typeof a) this.fromNumber(a,b,c);
      else if(b == null && "string" != typeof a) this.fromString(a,256);
      else this.fromString(a,b);
  }

  // return new, unset BigInteger
  function nbi() { return new BigInteger(null); }

  // am: Compute w_j += (x*this_i), propagate carries,
  // c is initial carry, returns final carry.
  // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
  // We need to select the fastest one that works in this environment.

  // am1: use a single mult and divide to get the high bits,
  // max digit bits should be 26 because
  // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
  function am1(i,x,w,j,c,n) {
    while(--n >= 0) {
      var v = x*this[i++]+w[j]+c;
      c = Math.floor(v/0x4000000);
      w[j++] = v&0x3ffffff;
    }
    return c;
  }
  // am2 avoids a big mult-and-extract completely.
  // Max digit bits should be <= 30 because we do bitwise ops
  // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
  function am2(i,x,w,j,c,n) {
    var xl = x&0x7fff, xh = x>>15;
    while(--n >= 0) {
      var l = this[i]&0x7fff;
      var h = this[i++]>>15;
      var m = xh*l+h*xl;
      l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
      c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
      w[j++] = l&0x3fffffff;
    }
    return c;
  }
  // Alternately, set max digit bits to 28 since some
  // browsers slow down when dealing with 32-bit numbers.
  function am3(i,x,w,j,c,n) {
    var xl = x&0x3fff, xh = x>>14;
    while(--n >= 0) {
      var l = this[i]&0x3fff;
      var h = this[i++]>>14;
      var m = xh*l+h*xl;
      l = xl*l+((m&0x3fff)<<14)+w[j]+c;
      c = (l>>28)+(m>>14)+xh*h;
      w[j++] = l&0xfffffff;
    }
    return c;
  }
  if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    BigInteger.prototype.am = am2;
    dbits = 30;
  }
  else if(j_lm && (navigator.appName != "Netscape")) {
    BigInteger.prototype.am = am1;
    dbits = 26;
  }
  else { // Mozilla/Netscape seems to prefer am3
    BigInteger.prototype.am = am3;
    dbits = 28;
  }

  BigInteger.prototype.DB = dbits;
  BigInteger.prototype.DM = ((1<<dbits)-1);
  BigInteger.prototype.DV = (1<<dbits);

  var BI_FP = 52;
  BigInteger.prototype.FV = Math.pow(2,BI_FP);
  BigInteger.prototype.F1 = BI_FP-dbits;
  BigInteger.prototype.F2 = 2*dbits-BI_FP;

  // Digit conversions
  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
  var BI_RC = new Array();
  var rr,vv;
  rr = "0".charCodeAt(0);
  for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
  rr = "a".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  rr = "A".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

  function int2char(n) { return BI_RM.charAt(n); }
  function intAt(s,i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c==null)?-1:c;
  }

  // (protected) copy this to r
  function bnpCopyTo(r) {
    for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
    r.t = this.t;
    r.s = this.s;
  }

  // (protected) set from integer value x, -DV <= x < DV
  function bnpFromInt(x) {
    this.t = 1;
    this.s = (x<0)?-1:0;
    if(x > 0) this[0] = x;
    else if(x < -1) this[0] = x+DV;
    else this.t = 0;
  }

  // return bigint initialized to value
  function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

  // (protected) set from string and radix
  function bnpFromString(s,b) {
    var k;
    if(b == 16) k = 4;
    else if(b == 8) k = 3;
    else if(b == 256) k = 8; // byte array
    else if(b == 2) k = 1;
    else if(b == 32) k = 5;
    else if(b == 4) k = 2;
    else { this.fromRadix(s,b); return; }
    this.t = 0;
    this.s = 0;
    var i = s.length, mi = false, sh = 0;
    while(--i >= 0) {
      var x = (k==8)?s[i]&0xff:intAt(s,i);
      if(x < 0) {
        if(s.charAt(i) == "-") mi = true;
        continue;
      }
      mi = false;
      if(sh == 0)
        this[this.t++] = x;
      else if(sh+k > this.DB) {
        this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
        this[this.t++] = (x>>(this.DB-sh));
      }
      else
        this[this.t-1] |= x<<sh;
      sh += k;
      if(sh >= this.DB) sh -= this.DB;
    }
    if(k == 8 && (s[0]&0x80) != 0) {
      this.s = -1;
      if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
    }
    this.clamp();
    if(mi) BigInteger.ZERO.subTo(this,this);
  }

  // (protected) clamp off excess high words
  function bnpClamp() {
    var c = this.s&this.DM;
    while(this.t > 0 && this[this.t-1] == c) --this.t;
  }

  // (public) return string representation in given radix
  function bnToString(b) {
    if(this.s < 0) return "-"+this.negate().toString(b);
    var k;
    if(b == 16) k = 4;
    else if(b == 8) k = 3;
    else if(b == 2) k = 1;
    else if(b == 32) k = 5;
    else if(b == 4) k = 2;
    else return this.toRadix(b);
    var km = (1<<k)-1, d, m = false, r = "", i = this.t;
    var p = this.DB-(i*this.DB)%k;
    if(i-- > 0) {
      if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
      while(i >= 0) {
        if(p < k) {
          d = (this[i]&((1<<p)-1))<<(k-p);
          d |= this[--i]>>(p+=this.DB-k);
        }
        else {
          d = (this[i]>>(p-=k))&km;
          if(p <= 0) { p += this.DB; --i; }
        }
        if(d > 0) m = true;
        if(m) r += int2char(d);
      }
    }
    return m?r:"0";
  }

  // (public) -this
  function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

  // (public) |this|
  function bnAbs() { return (this.s<0)?this.negate():this; }

  // (public) return + if this > a, - if this < a, 0 if equal
  function bnCompareTo(a) {
    var r = this.s-a.s;
    if(r != 0) return r;
    var i = this.t;
    r = i-a.t;
    if(r != 0) return (this.s<0)?-r:r;
    while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
    return 0;
  }

  // returns bit length of the integer x
  function nbits(x) {
    var r = 1, t;
    if((t=x>>>16) != 0) { x = t; r += 16; }
    if((t=x>>8) != 0) { x = t; r += 8; }
    if((t=x>>4) != 0) { x = t; r += 4; }
    if((t=x>>2) != 0) { x = t; r += 2; }
    if((t=x>>1) != 0) { x = t; r += 1; }
    return r;
  }

  // (public) return the number of bits in "this"
  function bnBitLength() {
    if(this.t <= 0) return 0;
    return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
  }

  // (protected) r = this << n*DB
  function bnpDLShiftTo(n,r) {
    var i;
    for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
    for(i = n-1; i >= 0; --i) r[i] = 0;
    r.t = this.t+n;
    r.s = this.s;
  }

  // (protected) r = this >> n*DB
  function bnpDRShiftTo(n,r) {
    for(var i = n; i < this.t; ++i) r[i-n] = this[i];
    r.t = Math.max(this.t-n,0);
    r.s = this.s;
  }

  // (protected) r = this << n
  function bnpLShiftTo(n,r) {
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<cbs)-1;
    var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
    for(i = this.t-1; i >= 0; --i) {
      r[i+ds+1] = (this[i]>>cbs)|c;
      c = (this[i]&bm)<<bs;
    }
    for(i = ds-1; i >= 0; --i) r[i] = 0;
    r[ds] = c;
    r.t = this.t+ds+1;
    r.s = this.s;
    r.clamp();
  }

  // (protected) r = this >> n
  function bnpRShiftTo(n,r) {
    r.s = this.s;
    var ds = Math.floor(n/this.DB);
    if(ds >= this.t) { r.t = 0; return; }
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<bs)-1;
    r[0] = this[ds]>>bs;
    for(var i = ds+1; i < this.t; ++i) {
      r[i-ds-1] |= (this[i]&bm)<<cbs;
      r[i-ds] = this[i]>>bs;
    }
    if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
    r.t = this.t-ds;
    r.clamp();
  }

  // (protected) r = this - a
  function bnpSubTo(a,r) {
    var i = 0, c = 0, m = Math.min(a.t,this.t);
    while(i < m) {
      c += this[i]-a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    if(a.t < this.t) {
      c -= a.s;
      while(i < this.t) {
        c += this[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else {
      c += this.s;
      while(i < a.t) {
        c -= a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c -= a.s;
    }
    r.s = (c<0)?-1:0;
    if(c < -1) r[i++] = this.DV+c;
    else if(c > 0) r[i++] = c;
    r.t = i;
    r.clamp();
  }

  // (protected) r = this * a, r != this,a (HAC 14.12)
  // "this" should be the larger one if appropriate.
  function bnpMultiplyTo(a,r) {
    var x = this.abs(), y = a.abs();
    var i = x.t;
    r.t = i+y.t;
    while(--i >= 0) r[i] = 0;
    for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
    r.s = 0;
    r.clamp();
    if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
  }

  // (protected) r = this^2, r != this (HAC 14.16)
  function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2*x.t;
    while(--i >= 0) r[i] = 0;
    for(i = 0; i < x.t-1; ++i) {
      var c = x.am(i,x[i],r,2*i,0,1);
      if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
        r[i+x.t] -= x.DV;
        r[i+x.t+1] = 1;
      }
    }
    if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
    r.s = 0;
    r.clamp();
  }

  // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
  // r != q, this != m.  q or r may be null.
  function bnpDivRemTo(m,q,r) {
    var pm = m.abs();
    if(pm.t <= 0) return;
    var pt = this.abs();
    if(pt.t < pm.t) {
      if(q != null) q.fromInt(0);
      if(r != null) this.copyTo(r);
      return;
    }
    if(r == null) r = nbi();
    var y = nbi(), ts = this.s, ms = m.s;
    var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
    if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
    else { pm.copyTo(y); pt.copyTo(r); }
    var ys = y.t;
    var y0 = y[ys-1];
    if(y0 == 0) return;
    var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
    var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
    var i = r.t, j = i-ys, t = (q==null)?nbi():q;
    y.dlShiftTo(j,t);
    if(r.compareTo(t) >= 0) {
      r[r.t++] = 1;
      r.subTo(t,r);
    }
    BigInteger.ONE.dlShiftTo(ys,t);
    t.subTo(y,y);	// "negative" y so we can replace sub with am later
    while(y.t < ys) y[y.t++] = 0;
    while(--j >= 0) {
      // Estimate quotient digit
      var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
      if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
        y.dlShiftTo(j,t);
        r.subTo(t,r);
        while(r[i] < --qd) r.subTo(t,r);
      }
    }
    if(q != null) {
      r.drShiftTo(ys,q);
      if(ts != ms) BigInteger.ZERO.subTo(q,q);
    }
    r.t = ys;
    r.clamp();
    if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
    if(ts < 0) BigInteger.ZERO.subTo(r,r);
  }

  // (public) this mod a
  function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a,null,r);
    if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
    return r;
  }

  // Modular reduction using "classic" algorithm
  function Classic(m) { this.m = m; }
  function cConvert(x) {
    if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
    else return x;
  }
  function cRevert(x) { return x; }
  function cReduce(x) { x.divRemTo(this.m,null,x); }
  function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
  function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

  Classic.prototype.convert = cConvert;
  Classic.prototype.revert = cRevert;
  Classic.prototype.reduce = cReduce;
  Classic.prototype.mulTo = cMulTo;
  Classic.prototype.sqrTo = cSqrTo;

  // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
  // justification:
  //         xy == 1 (mod m)
  //         xy =  1+km
  //   xy(2-xy) = (1+km)(1-km)
  // x[y(2-xy)] = 1-k^2m^2
  // x[y(2-xy)] == 1 (mod m^2)
  // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
  // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
  // JS multiply "overflows" differently from C/C++, so care is needed here.
  function bnpInvDigit() {
    if(this.t < 1) return 0;
    var x = this[0];
    if((x&1) == 0) return 0;
    var y = x&3;		// y == 1/x mod 2^2
    y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
    y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
    y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
    // last step - calculate inverse mod DV directly;
    // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
    y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
    // we really want the negative inverse, and -DV < y < DV
    return (y>0)?this.DV-y:-y;
  }

  // Montgomery reduction
  function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp&0x7fff;
    this.mph = this.mp>>15;
    this.um = (1<<(m.DB-15))-1;
    this.mt2 = 2*m.t;
  }

  // xR mod m
  function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t,r);
    r.divRemTo(this.m,null,r);
    if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
    return r;
  }

  // x/R mod m
  function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  }

  // x = x/R mod m (HAC 14.32)
  function montReduce(x) {
    while(x.t <= this.mt2)	// pad x so am has enough room later
      x[x.t++] = 0;
    for(var i = 0; i < this.m.t; ++i) {
      // faster way of calculating u0 = x[i]*mp mod DV
      var j = x[i]&0x7fff;
      var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
      // use am to combine the multiply-shift-add into one call
      j = i+this.m.t;
      x[j] += this.m.am(0,u0,x,i,0,this.m.t);
      // propagate carry
      while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
    }
    x.clamp();
    x.drShiftTo(this.m.t,x);
    if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
  }

  // r = "x^2/R mod m"; x != r
  function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

  // r = "xy/R mod m"; x,y != r
  function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

  Montgomery.prototype.convert = montConvert;
  Montgomery.prototype.revert = montRevert;
  Montgomery.prototype.reduce = montReduce;
  Montgomery.prototype.mulTo = montMulTo;
  Montgomery.prototype.sqrTo = montSqrTo;

  // (protected) true iff this is even
  function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

  // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
  function bnpExp(e,z) {
    if(e > 0xffffffff || e < 1) return BigInteger.ONE;
    var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
    g.copyTo(r);
    while(--i >= 0) {
      z.sqrTo(r,r2);
      if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
      else { var t = r; r = r2; r2 = t; }
    }
    return z.revert(r);
  }

  // (public) this^e % m, 0 <= e < 2^32
  function bnModPowInt(e,m) {
    var z;
    if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
    return this.exp(e,z);
  }

  // protected
  BigInteger.prototype.copyTo = bnpCopyTo;
  BigInteger.prototype.fromInt = bnpFromInt;
  BigInteger.prototype.fromString = bnpFromString;
  BigInteger.prototype.clamp = bnpClamp;
  BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
  BigInteger.prototype.drShiftTo = bnpDRShiftTo;
  BigInteger.prototype.lShiftTo = bnpLShiftTo;
  BigInteger.prototype.rShiftTo = bnpRShiftTo;
  BigInteger.prototype.subTo = bnpSubTo;
  BigInteger.prototype.multiplyTo = bnpMultiplyTo;
  BigInteger.prototype.squareTo = bnpSquareTo;
  BigInteger.prototype.divRemTo = bnpDivRemTo;
  BigInteger.prototype.invDigit = bnpInvDigit;
  BigInteger.prototype.isEven = bnpIsEven;
  BigInteger.prototype.exp = bnpExp;

  // public
  BigInteger.prototype.toString = bnToString;
  BigInteger.prototype.negate = bnNegate;
  BigInteger.prototype.abs = bnAbs;
  BigInteger.prototype.compareTo = bnCompareTo;
  BigInteger.prototype.bitLength = bnBitLength;
  BigInteger.prototype.mod = bnMod;
  BigInteger.prototype.modPowInt = bnModPowInt;

  // "constants"
  BigInteger.ZERO = nbv(0);
  BigInteger.ONE = nbv(1);

  // jsbn2 stuff

  // (protected) convert from radix string
  function bnpFromRadix(s,b) {
    this.fromInt(0);
    if(b == null) b = 10;
    var cs = this.chunkSize(b);
    var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
    for(var i = 0; i < s.length; ++i) {
      var x = intAt(s,i);
      if(x < 0) {
        if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
        continue;
      }
      w = b*w+x;
      if(++j >= cs) {
        this.dMultiply(d);
        this.dAddOffset(w,0);
        j = 0;
        w = 0;
      }
    }
    if(j > 0) {
      this.dMultiply(Math.pow(b,j));
      this.dAddOffset(w,0);
    }
    if(mi) BigInteger.ZERO.subTo(this,this);
  }

  // (protected) return x s.t. r^x < DV
  function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

  // (public) 0 if this == 0, 1 if this > 0
  function bnSigNum() {
    if(this.s < 0) return -1;
    else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
    else return 1;
  }

  // (protected) this *= n, this >= 0, 1 < n < DV
  function bnpDMultiply(n) {
    this[this.t] = this.am(0,n-1,this,0,0,this.t);
    ++this.t;
    this.clamp();
  }

  // (protected) this += n << w words, this >= 0
  function bnpDAddOffset(n,w) {
    if(n == 0) return;
    while(this.t <= w) this[this.t++] = 0;
    this[w] += n;
    while(this[w] >= this.DV) {
      this[w] -= this.DV;
      if(++w >= this.t) this[this.t++] = 0;
      ++this[w];
    }
  }

  // (protected) convert to radix string
  function bnpToRadix(b) {
    if(b == null) b = 10;
    if(this.signum() == 0 || b < 2 || b > 36) return "0";
    var cs = this.chunkSize(b);
    var a = Math.pow(b,cs);
    var d = nbv(a), y = nbi(), z = nbi(), r = "";
    this.divRemTo(d,y,z);
    while(y.signum() > 0) {
      r = (a+z.intValue()).toString(b).substr(1) + r;
      y.divRemTo(d,y,z);
    }
    return z.intValue().toString(b) + r;
  }

  // (public) return value as integer
  function bnIntValue() {
    if(this.s < 0) {
      if(this.t == 1) return this[0]-this.DV;
      else if(this.t == 0) return -1;
    }
    else if(this.t == 1) return this[0];
    else if(this.t == 0) return 0;
    // assumes 16 < DB < 32
    return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
  }

  // (protected) r = this + a
  function bnpAddTo(a,r) {
    var i = 0, c = 0, m = Math.min(a.t,this.t);
    while(i < m) {
      c += this[i]+a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    if(a.t < this.t) {
      c += a.s;
      while(i < this.t) {
        c += this[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else {
      c += this.s;
      while(i < a.t) {
        c += a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += a.s;
    }
    r.s = (c<0)?-1:0;
    if(c > 0) r[i++] = c;
    else if(c < -1) r[i++] = this.DV+c;
    r.t = i;
    r.clamp();
  }

  BigInteger.prototype.fromRadix = bnpFromRadix;
  BigInteger.prototype.chunkSize = bnpChunkSize;
  BigInteger.prototype.signum = bnSigNum;
  BigInteger.prototype.dMultiply = bnpDMultiply;
  BigInteger.prototype.dAddOffset = bnpDAddOffset;
  BigInteger.prototype.toRadix = bnpToRadix;
  BigInteger.prototype.intValue = bnIntValue;
  BigInteger.prototype.addTo = bnpAddTo;

  //======= end jsbn =======

  // Emscripten wrapper
  var Wrapper = {
    abs: function(l, h) {
      var x = new goog.math.Long(l, h);
      var ret;
      if (x.isNegative()) {
        ret = x.negate();
      } else {
        ret = x;
      }
      HEAP32[tempDoublePtr>>2] = ret.low_;
      HEAP32[tempDoublePtr+4>>2] = ret.high_;
    },
    ensureTemps: function() {
      if (Wrapper.ensuredTemps) return;
      Wrapper.ensuredTemps = true;
      Wrapper.two32 = new BigInteger();
      Wrapper.two32.fromString('4294967296', 10);
      Wrapper.two64 = new BigInteger();
      Wrapper.two64.fromString('18446744073709551616', 10);
      Wrapper.temp1 = new BigInteger();
      Wrapper.temp2 = new BigInteger();
    },
    lh2bignum: function(l, h) {
      var a = new BigInteger();
      a.fromString(h.toString(), 10);
      var b = new BigInteger();
      a.multiplyTo(Wrapper.two32, b);
      var c = new BigInteger();
      c.fromString(l.toString(), 10);
      var d = new BigInteger();
      c.addTo(b, d);
      return d;
    },
    stringify: function(l, h, unsigned) {
      var ret = new goog.math.Long(l, h).toString();
      if (unsigned && ret[0] == '-') {
        // unsign slowly using jsbn bignums
        Wrapper.ensureTemps();
        var bignum = new BigInteger();
        bignum.fromString(ret, 10);
        ret = new BigInteger();
        Wrapper.two64.addTo(bignum, ret);
        ret = ret.toString(10);
      }
      return ret;
    },
    fromString: function(str, base, min, max, unsigned) {
      Wrapper.ensureTemps();
      var bignum = new BigInteger();
      bignum.fromString(str, base);
      var bigmin = new BigInteger();
      bigmin.fromString(min, 10);
      var bigmax = new BigInteger();
      bigmax.fromString(max, 10);
      if (unsigned && bignum.compareTo(BigInteger.ZERO) < 0) {
        var temp = new BigInteger();
        bignum.addTo(Wrapper.two64, temp);
        bignum = temp;
      }
      var error = false;
      if (bignum.compareTo(bigmin) < 0) {
        bignum = bigmin;
        error = true;
      } else if (bignum.compareTo(bigmax) > 0) {
        bignum = bigmax;
        error = true;
      }
      var ret = goog.math.Long.fromString(bignum.toString()); // min-max checks should have clamped this to a range goog.math.Long can handle well
      HEAP32[tempDoublePtr>>2] = ret.low_;
      HEAP32[tempDoublePtr+4>>2] = ret.high_;
      if (error) throw 'range error';
    }
  };
  return Wrapper;
})();

//======= end closure i64 code =======



// === Auto-generated postamble setup entry stuff ===

if (memoryInitializer) {
  function applyData(data) {
    HEAPU8.set(data, STATIC_BASE);
  }
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    applyData(Module['readBinary'](memoryInitializer));
  } else {
    addRunDependency('memory initializer');
    Browser.asyncLoad(memoryInitializer, function(data) {
      applyData(data);
      removeRunDependency('memory initializer');
    }, function(data) {
      throw 'could not load memory initializer ' + memoryInitializer;
    });
  }
}

function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;

var initialStackTop;
var preloadStartTime = null;
var calledMain = false;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!Module['calledRun'] && shouldRunNow) run();
  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
}

Module['callMain'] = Module.callMain = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');

  args = args || [];

  if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
    Module.printErr('preload time: ' + (Date.now() - preloadStartTime) + ' ms');
  }

  ensureInitRuntime();

  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);

  initialStackTop = STACKTOP;

  try {

    var ret = Module['_main'](argc, argv, 0);


    // if we're not running an evented main loop, it's time to exit
    if (!Module['noExitRuntime']) {
      exit(ret);
    }
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
      throw e;
    }
  } finally {
    calledMain = true;
  }
}




function run(args) {
  args = args || Module['arguments'];

  if (preloadStartTime === null) preloadStartTime = Date.now();

  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return;
  }

  preRun();

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later
  if (Module['calledRun']) return; // run may have just been called through dependencies being fulfilled just in this very frame

  function doRun() {
    if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
    Module['calledRun'] = true;

    ensureInitRuntime();

    preMain();

    if (Module['_main'] && shouldRunNow) {
      Module['callMain'](args);
    }

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;

function exit(status) {
  ABORT = true;
  EXITSTATUS = status;
  STACKTOP = initialStackTop;

  // exit the runtime
  exitRuntime();

  // TODO We should handle this differently based on environment.
  // In the browser, the best we can do is throw an exception
  // to halt execution, but in node we could process.exit and
  // I'd imagine SM shell would have something equivalent.
  // This would let us set a proper exit status (which
  // would be great for checking test exit statuses).
  // https://github.com/kripken/emscripten/issues/1371

  // throw an exception to halt the current execution
  throw new ExitStatus(status);
}
Module['exit'] = Module.exit = exit;

function abort(text) {
  if (text) {
    Module.print(text);
    Module.printErr(text);
  }

  ABORT = true;
  EXITSTATUS = 1;

  throw 'abort() at ' + stackTrace();
}
Module['abort'] = Module.abort = abort;

// {{PRE_RUN_ADDITIONS}}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}

run();

// {{POST_RUN_ADDITIONS}}






// {{MODULE_ADDITIONS}}





//
// openspin-post.js
//
// Tail end of wrapper function around openspin.js
// See openspin-pre.js for the head end. 

    // Export the file system
    ModuleConf['FS'] = FS;
};
//@ sourceMappingURL=openspin.html.map




