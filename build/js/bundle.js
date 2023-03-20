/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 145:
/***/ (() => {

//target menu list
const menuBtn = document.querySelector('.menu__btn');
const headerNav = document.querySelector('.header__nav');
const linkItem = document.querySelectorAll('.header__menu-item');
menuBtn.addEventListener('click', () => {
  if (headerNav === document.querySelector('.header__nav--active')) {
    headerNav.classList.remove('header__nav--active');
    menuBtn.classList.remove('menu__btn--active');
  } else {
    headerNav.classList.add('header__nav--active');
    menuBtn.classList.add('menu__btn--active');
  }
});
linkItem.forEach(item => {
  item.addEventListener('click', () => {
    headerNav.classList.remove('header__nav--active');
    menuBtn.classList.remove('menu__btn--active');
  });
});

//scroll to skills
const headerBtn = document.querySelector('.header__btn-bottom');
const skillsSection = document.querySelector('.skills');
headerBtn.addEventListener('click', () => {
  skillsSection.scrollIntoView({
    block: 'nearest',
    // к ближайшей границе экрана
    behavior: 'smooth'
  });
});

/***/ }),

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
/* harmony import */ var _script__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(145);
/* harmony import */ var _script__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_script__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _stars__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(43);
/* harmony import */ var _stars__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_stars__WEBPACK_IMPORTED_MODULE_1__);
// Это - ваша точка входа для скриптов страницы. Импортируйте сюда нужные вам файлы.



})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUUsRUFBRTtRQUN0Q3pCLFFBQVEsQ0FBQ3lCLENBQUMsQ0FBQyxDQUFDRCxNQUFNLEVBQUU7UUFDcEJ4QixRQUFRLENBQUN5QixDQUFDLENBQUMsQ0FBQ1IsSUFBSSxFQUFFO01BQ3RCO0lBQ0osQ0FBQyxFQUFFbkMsSUFBSSxDQUFDSSxLQUFLLENBQUM7RUFDbEI7QUFNSjtBQUFDO0FBQUVNLE1BQU0sQ0FBQ3NDLE1BQU0sR0FBRyxZQUFZO0VBQzNCakQsUUFBUSxFQUFFO0FBQ2QsQ0FBQzs7Ozs7O1VDN0ZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7Ozs7Ozs7OztBQ0FBOztBQUVrQiIsInNvdXJjZXMiOlsid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlLy4vc291cmNlL2pzL3NjcmlwdC5qcyIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS8uL3NvdXJjZS9qcy9zdGFycy5qcyIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY3JlYXRlLWh0bWwtYm9pbGVycGxhdGUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS8uL3NvdXJjZS9qcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvL3RhcmdldCBtZW51IGxpc3RcbmNvbnN0IG1lbnVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWVudV9fYnRuJyk7XG5jb25zdCBoZWFkZXJOYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYnKTtcbmNvbnN0IGxpbmtJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbWVudS1pdGVtJyk7XG5cblxubWVudUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+e1xuICAgIGlmIChoZWFkZXJOYXYgPT09IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi0tYWN0aXZlJykpe1xuICAgICAgICBoZWFkZXJOYXYuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZGVyX19uYXYtLWFjdGl2ZScpXG4gICAgICAgIG1lbnVCdG4uY2xhc3NMaXN0LnJlbW92ZSgnbWVudV9fYnRuLS1hY3RpdmUnKVxuICAgIH1cbiAgICBlbHNle1xuICAgICAgICBoZWFkZXJOYXYuY2xhc3NMaXN0LmFkZCgnaGVhZGVyX19uYXYtLWFjdGl2ZScpXG4gICAgICAgIG1lbnVCdG4uY2xhc3NMaXN0LmFkZCgnbWVudV9fYnRuLS1hY3RpdmUnKVxuICAgIH1cbn0pXG5saW5rSXRlbS5mb3JFYWNoKGl0ZW0gPT57XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKCk9PntcbiAgICAgICAgaGVhZGVyTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlcl9fbmF2LS1hY3RpdmUnKVxuICAgICAgICBtZW51QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ21lbnVfX2J0bi0tYWN0aXZlJylcbiAgICB9KVxufSlcblxuXG5cblxuLy9zY3JvbGwgdG8gc2tpbGxzXG5jb25zdCBoZWFkZXJCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19idG4tYm90dG9tJyk7XG5jb25zdCBza2lsbHNTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNraWxscycpO1xuXG5cbmhlYWRlckJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+e1xuICAgIHNraWxsc1NlY3Rpb24uc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgICBibG9jazogJ25lYXJlc3QnLCAvLyDQuiDQsdC70LjQttCw0LnRiNC10Lkg0LPRgNCw0L3QuNGG0LUg0Y3QutGA0LDQvdCwXG4gICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJywgXG4gICAgICAgIFxuICAgIH0pO1xufSk7IiwiZnVuY3Rpb24gYmRDYW52YXMoKSB7XHJcblxyXG4gICAgb3B0cyA9IHtcclxuICAgICAgICBtaW5SYWRpdXM6IDAuNSxcclxuICAgICAgICBtYXhSYWRpdXM6IDEuNCxcclxuICAgICAgICBjb2xvcnM6IFtcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC43KVwiLCBcInJnYmEoMjUyLCAyNDQsIDIwMSwgMC43KVwiLCBcInJnYmEoMjAxLCAyNTIsIDIwMSwgMC43KVwiLCBcInJnYmEoMjAxLCAyMzYsIDI1MiwgMC43KVwiLCBcInJnYmEoMjI5LCAyMDEsIDI1MiwgMC43KVwiLCBcInJnYmEoMjUyLCAyMDEsIDIwMSwgMC43KVwiLCBcInJnYmEoMjUyLCAyMDEsIDI0MSwgMC43KVwiLCBcInJnYmEoMjUyLCAyMDEsIDIwMSwgMC43KVwiXSxcclxuICAgICAgICBkZWxheTogOTAsXHJcbiAgICAgICAgc3RlcDogMC4xXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYmRDYW52YXNcIik7XHJcblxyXG4gICAgcmVzaXplQ2FudmFzKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gcmVzaXplQ2FudmFzKCkge1xyXG4gICAgICAgIHcgPSBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICBoID0gY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2luZG93UmVzaXplKCk7XHJcbiAgICB9KVxyXG5cclxuICAgIGxldCBjaGVjaztcclxuXHJcbiAgICBmdW5jdGlvbiB3aW5kb3dSZXNpemUoKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KGNoZWNrKTtcclxuICAgICAgICBhcnJTdGFycy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGNoZWNrID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoYW5pbWF0aW9ucyk7XHJcbiAgICAgICAgICAgIHJlc2l6ZUNhbnZhcygpO1xyXG4gICAgICAgICAgICBzZXR1cCgpO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgIH0sIDEwMClcclxuICAgIH1cclxuXHJcbiAgICBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbiAgICBTdGFycyA9IGZ1bmN0aW9uICh3LCBoKSB7XHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5yYW5kb20oKSAqIHc7XHJcbiAgICAgICAgdGhpcy55ID0gTWF0aC5yYW5kb20oKSAqIGg7XHJcbiAgICAgICAgdGhpcy5yYWRpdXMgPSBvcHRzLm1pblJhZGl1cyArIE1hdGgucmFuZG9tKCkgKiAob3B0cy5tYXhSYWRpdXMgLSBvcHRzLm1pblJhZGl1cyk7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IG9wdHMuY29sb3JzW1tNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiBvcHRzLmNvbG9ycy5sZW5ndGgpXV07XHJcbiAgICAgICAgdGhpcy52ZWN0b3IgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpIHx8IC0xO1xyXG5cclxuICAgICAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIE1hdGguUEkgKiAyKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrKCk7XHJcbiAgICAgICAgICAgIHRoaXMucmFkaXVzICs9IG9wdHMuc3RlcCAqIHRoaXMudmVjdG9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jaGVjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmFkaXVzID4gb3B0cy5tYXhSYWRpdXMgfHwgdGhpcy5yYWRpdXMgPCBvcHRzLm1pblJhZGl1cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZWN0b3IgKj0gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XHJcbiAgICAgICAgYXJyU3RhcnMgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAodyAvIDQwKSAqIChoIC8gNDApOyBpKyspIHtcclxuICAgICAgICAgICAgYXJyU3RhcnMucHVzaChuZXcgU3RhcnModywgaCkpO1xyXG4gICAgICAgICAgICBhcnJTdGFyc1tpXS5kcmF3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxvb3AoKVxyXG4gICAgfVxyXG5cclxuICAgIHNldHVwKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gbG9vcCgpIHtcclxuICAgICAgICBhbmltYXRpb25zID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHcsIGgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyclN0YXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBhcnJTdGFyc1tpXS51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIGFyclN0YXJzW2ldLmRyYXcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIG9wdHMuZGVsYXkpO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG5cclxuICAgXHJcbiAgICBcclxufTsgd2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGJkQ2FudmFzKCk7XHJcbn07XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyDQrdGC0L4gLSDQstCw0YjQsCDRgtC+0YfQutCwINCy0YXQvtC00LAg0LTQu9GPINGB0LrRgNC40L/RgtC+0LIg0YHRgtGA0LDQvdC40YbRiy4g0JjQvNC/0L7RgNGC0LjRgNGD0LnRgtC1INGB0Y7QtNCwINC90YPQttC90YvQtSDQstCw0Lwg0YTQsNC50LvRiy5cblxuaW1wb3J0ICcuL3NjcmlwdCc7XG5pbXBvcnQgJy4vc3RhcnMnO1xuIl0sIm5hbWVzIjpbIm1lbnVCdG4iLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJoZWFkZXJOYXYiLCJsaW5rSXRlbSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJhZGRFdmVudExpc3RlbmVyIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwiZm9yRWFjaCIsIml0ZW0iLCJoZWFkZXJCdG4iLCJza2lsbHNTZWN0aW9uIiwic2Nyb2xsSW50b1ZpZXciLCJibG9jayIsImJlaGF2aW9yIiwiYmRDYW52YXMiLCJvcHRzIiwibWluUmFkaXVzIiwibWF4UmFkaXVzIiwiY29sb3JzIiwiZGVsYXkiLCJzdGVwIiwiY2FudmFzIiwicmVzaXplQ2FudmFzIiwidyIsIndpZHRoIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImgiLCJoZWlnaHQiLCJpbm5lckhlaWdodCIsIndpbmRvd1Jlc2l6ZSIsImNoZWNrIiwiY2xlYXJUaW1lb3V0IiwiYXJyU3RhcnMiLCJsZW5ndGgiLCJzZXRUaW1lb3V0IiwiY2xlYXJJbnRlcnZhbCIsImFuaW1hdGlvbnMiLCJzZXR1cCIsImN0eCIsImdldENvbnRleHQiLCJTdGFycyIsIngiLCJNYXRoIiwicmFuZG9tIiwieSIsInJhZGl1cyIsImNvbG9yIiwicm91bmQiLCJ2ZWN0b3IiLCJkcmF3IiwiYmVnaW5QYXRoIiwiYXJjIiwiUEkiLCJmaWxsU3R5bGUiLCJmaWxsIiwiY2xvc2VQYXRoIiwidXBkYXRlIiwiaSIsInB1c2giLCJsb29wIiwic2V0SW50ZXJ2YWwiLCJjbGVhclJlY3QiLCJvbmxvYWQiXSwic291cmNlUm9vdCI6IiJ9