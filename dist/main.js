// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
/**
 * Slide element down.
 * @param  {Node} elem Element to show and hide
 */
function slideDown(elem) {
  elem.style.maxHeight = '1000px';
  elem.style.opacity = '1';
}
/**
 * Slide element up.
 * @param  {Node} elem Element
 */


function slideUp(elem) {
  elem.style.maxHeight = '0';
  once(1, function () {
    elem.style.opacity = '0';
  });
}
/**
 * Fired once.
 * @param seconds
 * @param callback
 */


function once(seconds, callback) {
  var counter = 0;
  var time = window.setInterval(function () {
    counter++;

    if (counter >= seconds) {
      callback();
      window.clearInterval(time);
    }
  }, 900);
}
/**
 * Slide toggle for a given id.
 * @param id
 */


var state = 0;

function slideToggle(id) {
  var elem = document.getElementById(id);

  if (state === 0) {
    state = 1;
    slideDown(elem);
  } else {
    state = 0;
    slideUp(elem);
  }
}

document.addEventListener('DOMContentLoaded', function (event) {
  var htmlTag = document.querySelector('html'); // Checks the OS settings for preferred color scheme.

  var matchMediaPrefDark = window.matchMedia('(prefers-color-scheme: dark)');

  function startListeningToOSTheme() {
    matchMediaPrefDark.addEventListener('change', onSystemThemeChange);
  }

  function stopListeningToOSTheme() {
    matchMediaPrefDark.removeEventListener('change', onSystemThemeChange);
  }
  /**
   * Called function if the media query defined in @{matchMediaPrefDark} changes.
   * @param e The media query itself
   */


  function onSystemThemeChange(e) {
    var isDark = e.matches;
    htmlTag.dataset.theme = "".concat(isDark ? 'dark' : 'light');
  }

  startListeningToOSTheme();
  /**
   * Switches the data-theme attribute on the html tag.
   * @param theme
   */

  function switchTheme(theme) {
    htmlTag.dataset.theme = "".concat(theme);
  }

  var today;
  today = new Date(); //outputs date in 24hrs format

  if (today.getHours() > 7 && today.getHours() < 19) {// its day, use preferred setting
  } else {
    //its night, enforce dark mode.
    switchTheme('dark');
  }
  /**
   * Toggles the current state of the dark/night mode.
   */


  document.getElementById('dark-light-switch').addEventListener('click', function () {
    stopListeningToOSTheme();
    var theme = htmlTag.dataset.theme;

    if (theme === "light") {
      switchTheme("dark");
    } else {
      switchTheme("light");
    }
  });
});
},{}]},{},["epB2"], null)