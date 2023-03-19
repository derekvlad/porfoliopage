/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 43:
/***/ (() => {

function bdCanvas() {
  opts = {
    minRadius: 0.5,
    maxRadius: 1.4,
    colors: ["rgba(255, 255, 255, 0.7)", "rgba(252, 244, 201, 0.7)", "rgba(201, 252, 201, 0.7)", "rgba(201, 236, 252, 0.7)", "rgba(229, 201, 252, 0.7)", "rgba(252, 201, 201, 0.7)", "rgba(252, 201, 241, 0.7)", "rgba(252, 201, 201, 0.7)"],
    delay: 90,
    step: 0.1
  };
  let canvas = document.querySelector("#bdCanvas");
  resizeCanvas();
  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", function () {
    windowResize();
  });
  let check;
  function windowResize() {
    clearTimeout(check);
    arrStars.length = 0;
    check = setTimeout(function () {
      clearInterval(animations);
      resizeCanvas();
      setup();
    }, 100);
  }
  let ctx = canvas.getContext("2d");
  Stars = function (w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.radius = opts.minRadius + Math.random() * (opts.maxRadius - opts.minRadius);
    this.color = opts.colors[[Math.round(Math.random() * opts.colors.length)]];
    this.vector = Math.round(Math.random()) || -1;
    this.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    };
    this.update = function () {
      this.check();
      this.radius += opts.step * this.vector;
    };
    this.check = function () {
      if (this.radius > opts.maxRadius || this.radius < opts.minRadius) {
        this.vector *= -1;
      }
    };
  };
  function setup() {
    arrStars = [];
    for (let i = 0; i < w / 40 * (h / 40); i++) {
      arrStars.push(new Stars(w, h));
      arrStars[i].draw();
    }
    loop();
  }
  setup();
  function loop() {
    animations = setInterval(function () {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < arrStars.length; i++) {
        arrStars[i].update();
        arrStars[i].draw();
      }
    }, opts.delay);
  }
}
;
window.onload = function () {
  bdCanvas();
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/* harmony import */ var _stars__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43);
/* harmony import */ var _stars__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_stars__WEBPACK_IMPORTED_MODULE_0__);
// Это - ваша точка входа для скриптов страницы. Импортируйте сюда нужные вам файлы.



})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TUFDdEI7SUFDSixDQUFDLEVBQUV0QyxJQUFJLENBQUNJLEtBQUssQ0FBQztFQUNsQjtBQUVKO0FBQUM7QUFBRVEsTUFBTSxDQUFDdUMsTUFBTSxHQUFHLFlBQVk7RUFDM0JwRCxRQUFRLEVBQUU7QUFDZCxDQUFDOzs7Ozs7VUN6RkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7Ozs7OztBQ0FBOztBQUVrQiIsInNvdXJjZXMiOlsid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlLy4vc291cmNlL2pzL3N0YXJzLmpzIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlLy4vc291cmNlL2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGJkQ2FudmFzKCkge1xyXG5cclxuICAgIG9wdHMgPSB7XHJcbiAgICAgICAgbWluUmFkaXVzOiAwLjUsXHJcbiAgICAgICAgbWF4UmFkaXVzOiAxLjQsXHJcbiAgICAgICAgY29sb3JzOiBbXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNylcIiwgXCJyZ2JhKDI1MiwgMjQ0LCAyMDEsIDAuNylcIiwgXCJyZ2JhKDIwMSwgMjUyLCAyMDEsIDAuNylcIiwgXCJyZ2JhKDIwMSwgMjM2LCAyNTIsIDAuNylcIiwgXCJyZ2JhKDIyOSwgMjAxLCAyNTIsIDAuNylcIiwgXCJyZ2JhKDI1MiwgMjAxLCAyMDEsIDAuNylcIiwgXCJyZ2JhKDI1MiwgMjAxLCAyNDEsIDAuNylcIiwgXCJyZ2JhKDI1MiwgMjAxLCAyMDEsIDAuNylcIl0sXHJcbiAgICAgICAgZGVsYXk6IDkwLFxyXG4gICAgICAgIHN0ZXA6IDAuMVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2JkQ2FudmFzXCIpO1xyXG5cclxuICAgIHJlc2l6ZUNhbnZhcygpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlc2l6ZUNhbnZhcygpIHtcclxuICAgICAgICB3ID0gY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICAgICAgaCA9IGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHdpbmRvd1Jlc2l6ZSgpO1xyXG4gICAgfSlcclxuXHJcbiAgICBsZXQgY2hlY2s7XHJcblxyXG4gICAgZnVuY3Rpb24gd2luZG93UmVzaXplKCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChjaGVjayk7XHJcbiAgICAgICAgYXJyU3RhcnMubGVuZ3RoID0gMDtcclxuICAgICAgICBjaGVjayA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKGFuaW1hdGlvbnMpO1xyXG4gICAgICAgICAgICByZXNpemVDYW52YXMoKTtcclxuICAgICAgICAgICAgc2V0dXAoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSwgMTAwKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuICAgIFN0YXJzID0gZnVuY3Rpb24gKHcsIGgpIHtcclxuICAgICAgICB0aGlzLnggPSBNYXRoLnJhbmRvbSgpICogdztcclxuICAgICAgICB0aGlzLnkgPSBNYXRoLnJhbmRvbSgpICogaDtcclxuICAgICAgICB0aGlzLnJhZGl1cyA9IG9wdHMubWluUmFkaXVzICsgTWF0aC5yYW5kb20oKSAqIChvcHRzLm1heFJhZGl1cyAtIG9wdHMubWluUmFkaXVzKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gb3B0cy5jb2xvcnNbW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIG9wdHMuY29sb3JzLmxlbmd0aCldXTtcclxuICAgICAgICB0aGlzLnZlY3RvciA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSkgfHwgLTE7XHJcblxyXG4gICAgICAgIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcclxuICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2soKTtcclxuICAgICAgICAgICAgdGhpcy5yYWRpdXMgKz0gb3B0cy5zdGVwICogdGhpcy52ZWN0b3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNoZWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yYWRpdXMgPiBvcHRzLm1heFJhZGl1cyB8fCB0aGlzLnJhZGl1cyA8IG9wdHMubWluUmFkaXVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlY3RvciAqPSAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXR1cCgpIHtcclxuICAgICAgICBhcnJTdGFycyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8ICh3IC8gNDApICogKGggLyA0MCk7IGkrKykge1xyXG4gICAgICAgICAgICBhcnJTdGFycy5wdXNoKG5ldyBTdGFycyh3LCBoKSk7XHJcbiAgICAgICAgICAgIGFyclN0YXJzW2ldLmRyYXcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbG9vcCgpXHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXAoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsb29wKCkge1xyXG4gICAgICAgIGFuaW1hdGlvbnMgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdywgaCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyU3RhcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGFyclN0YXJzW2ldLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgYXJyU3RhcnNbaV0uZHJhdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgb3B0cy5kZWxheSk7XHJcbiAgICB9XHJcblxyXG59OyB3aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgYmRDYW52YXMoKTtcclxufTtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vINCt0YLQviAtINCy0LDRiNCwINGC0L7Rh9C60LAg0LLRhdC+0LTQsCDQtNC70Y8g0YHQutGA0LjQv9GC0L7QsiDRgdGC0YDQsNC90LjRhtGLLiDQmNC80L/QvtGA0YLQuNGA0YPQudGC0LUg0YHRjtC00LAg0L3Rg9C20L3Ri9C1INCy0LDQvCDRhNCw0LnQu9GLLlxuXG5pbXBvcnQgJy4vc2NyaXB0JztcbmltcG9ydCAnLi9zdGFycyc7XG4iXSwibmFtZXMiOlsiYmRDYW52YXMiLCJvcHRzIiwibWluUmFkaXVzIiwibWF4UmFkaXVzIiwiY29sb3JzIiwiZGVsYXkiLCJzdGVwIiwiY2FudmFzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwicmVzaXplQ2FudmFzIiwidyIsIndpZHRoIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImgiLCJoZWlnaHQiLCJpbm5lckhlaWdodCIsImFkZEV2ZW50TGlzdGVuZXIiLCJ3aW5kb3dSZXNpemUiLCJjaGVjayIsImNsZWFyVGltZW91dCIsImFyclN0YXJzIiwibGVuZ3RoIiwic2V0VGltZW91dCIsImNsZWFySW50ZXJ2YWwiLCJhbmltYXRpb25zIiwic2V0dXAiLCJjdHgiLCJnZXRDb250ZXh0IiwiU3RhcnMiLCJ4IiwiTWF0aCIsInJhbmRvbSIsInkiLCJyYWRpdXMiLCJjb2xvciIsInJvdW5kIiwidmVjdG9yIiwiZHJhdyIsImJlZ2luUGF0aCIsImFyYyIsIlBJIiwiZmlsbFN0eWxlIiwiZmlsbCIsImNsb3NlUGF0aCIsInVwZGF0ZSIsImkiLCJwdXNoIiwibG9vcCIsInNldEludGVydmFsIiwiY2xlYXJSZWN0Iiwib25sb2FkIl0sInNvdXJjZVJvb3QiOiIifQ==