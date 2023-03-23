/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 532:
/***/ (() => {

const filterBtns = document.querySelectorAll('.portfolio__btn');
const fliterItem = document.querySelectorAll('.portfolio__filter-item');
const filterWrap = document.querySelector('.portfolio__filter-inner');
function filter() {
  filterBtns.forEach(itemBtn => {
    itemBtn.addEventListener('click', () => {
      fliterItem.forEach(element => {
        element.style.opacity = "0";
        element.style.pointerEvents = "none";
        element.style.position = "absolute";
        element.style.transform = "translateX(-300%)";
      });
      let targetId = itemBtn.getAttribute('data-id');
      let targetItem = document.querySelectorAll(`.${targetId}`);
      if (targetId == 'all') {
        fliterItem.forEach(element => {
          element.style.opacity = "1";
          element.style.pointerEvents = "all";
          element.style.position = "relative";
          element.style.transform = "translateX(0)";
          filterWrap.style.justifyContent = 'space-around';
        });
      } else {
        targetItem.forEach(item => {
          item.style.opacity = "1";
          item.style.pointerEvents = "all";
          item.style.position = "relative";
          item.style.transform = "translateX(0)";
          if (window.screen.width <= 1200) {
            filterWrap.style.justifyContent = 'space-around';
          } else {
            filterWrap.style.justifyContent = 'flex-start';
          }
        });
      }
    });
  });
}
requestAnimationFrame(filter, 1000);

/***/ }),

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
const linkMenu = document.querySelectorAll('.header__menu-link');
linkMenu.forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    linkData = item.getAttribute('href').substring(1);
    console.log(linkData);
    let block = document.querySelector(`.${linkData}`);
    block.scrollIntoView({
      block: 'nearest',
      // к ближайшей границе экрана
      behavior: 'smooth'
    });
  });
});

//fix height VANTA
const headerScreen = document.querySelector('.header');
let positionHeight = window.screen.height;
console.log(positionHeight);
headerScreen.style.height = positionHeight + 'px';

//options VANTA
VANTA.NET({
  el: ".header",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: positionHeight,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.0,
  color: 0x603fff,
  backgroundColor: 0x0,
  spacing: 14.00
});

//prealoder 

window.addEventListener('load', function () {
  document.querySelector('body').classList.add("loaded");
});

//Validation

const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const input = document.querySelector('#email');
function onInput() {
  if (isEmailValid(input.value)) {
    input.style.borderColor = 'green';
  } else {
    input.style.borderColor = 'red';
  }
}
input.addEventListener('input', onInput);
function isEmailValid(value) {
  return EMAIL_REGEXP.test(value);
}

/***/ }),

/***/ 43:
/***/ (() => {

function bdCanvas() {
  opts = {
    minRadius: 0.5,
    maxRadius: 1.4,
    colors: ["rgba(255, 255, 255, 0.7)", "rgba(252, 244, 201, 0.7)", "rgba(201, 252, 201, 0.7)", "rgba(201, 236, 252, 0.7)", "rgba(229, 201, 252, 0.7)", "rgba(252, 201, 201, 0.7)", "rgba(252, 201, 241, 0.7)", "rgba(252, 201, 201, 0.7)"],
    delay: 100,
    step: 0.1
  };
  let canvas = document.querySelector('[id="bdCanvas"]');
  let positionHeight = document.documentElement.clientHeight;
  console.log(positionHeight);
  canvas.style.height = positionHeight + 'px';
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
    requestAnimationFrame(loop);
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
/* harmony import */ var _filter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(532);
/* harmony import */ var _filter__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_filter__WEBPACK_IMPORTED_MODULE_2__);
// Это - ваша точка входа для скриптов страницы. Импортируйте сюда нужные вам файлы.




})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFJLENBQUM7RUFDL0I7RUFFQXJCLEtBQUssRUFBRTtFQUVQLFNBQVNxQixJQUFJQSxDQUFBLEVBQUc7SUFDWnRCLFVBQVUsR0FBR3VCLFdBQVcsQ0FBQyxZQUFZO01BQ2pDckIsR0FBRyxDQUFDc0IsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUVuQyxDQUFDLEVBQUVFLENBQUMsQ0FBQztNQUN6QixLQUFLLElBQUk2QixDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUd4QixRQUFRLENBQUNDLE1BQU0sRUFBRXVCLENBQUMsRUFBRSxFQUFFO1FBQ3RDeEIsUUFBUSxDQUFDd0IsQ0FBQyxDQUFDLENBQUNELE1BQU0sRUFBRTtRQUNwQnZCLFFBQVEsQ0FBQ3dCLENBQUMsQ0FBQyxDQUFDUixJQUFJLEVBQUU7TUFDdEI7SUFDSixDQUFDLEVBQUVqQyxJQUFJLENBQUNJLEtBQUssQ0FBQztFQUNsQjtBQU1KO0FBQUM7QUFBRWxELE1BQU0sQ0FBQzRGLE1BQU0sR0FBRyxZQUFZO0VBQzNCL0MsUUFBUSxFQUFFO0FBQ2QsQ0FBQzs7Ozs7O1VDbkdEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7Ozs7Ozs7Ozs7O0FDQUE7O0FBRWtCO0FBQ0QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS8uL3NvdXJjZS9qcy9maWx0ZXIuanMiLCJ3ZWJwYWNrOi8vY3JlYXRlLWh0bWwtYm9pbGVycGxhdGUvLi9zb3VyY2UvanMvc2NyaXB0LmpzIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlLy4vc291cmNlL2pzL3N0YXJzLmpzIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlLy4vc291cmNlL2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGZpbHRlckJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucG9ydGZvbGlvX19idG4nKVxyXG5jb25zdCBmbGl0ZXJJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBvcnRmb2xpb19fZmlsdGVyLWl0ZW0nKVxyXG5jb25zdCBmaWx0ZXJXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvcnRmb2xpb19fZmlsdGVyLWlubmVyJylcclxuZnVuY3Rpb24gZmlsdGVyKCkge1xyXG4gICAgZmlsdGVyQnRucy5mb3JFYWNoKGl0ZW1CdG4gPT4ge1xyXG4gICAgICAgIGl0ZW1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGZsaXRlckl0ZW0uZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiMFwiXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIlxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIlxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVgoLTMwMCUpXCJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgbGV0IHRhcmdldElkID0gaXRlbUJ0bi5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKVxyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0SXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke3RhcmdldElkfWApXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRJZCA9PSAnYWxsJykge1xyXG4gICAgICAgICAgICAgICAgZmxpdGVySXRlbS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhbGxcIlxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCJcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlWCgwKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyV3JhcC5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdzcGFjZS1hcm91bmQnXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SXRlbS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUub3BhY2l0eSA9IFwiMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhbGxcIlxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCJcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlWCgwKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgaWYod2luZG93LnNjcmVlbi53aWR0aCA8PSAxMjAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyV3JhcC5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdzcGFjZS1hcm91bmQnXHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcldyYXAuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnZmxleC1zdGFydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZpbHRlciwgMTAwMClcclxuIiwiLy90YXJnZXQgbWVudSBsaXN0XG5jb25zdCBtZW51QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnVfX2J0bicpO1xuY29uc3QgaGVhZGVyTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2Jyk7XG5jb25zdCBsaW5rSXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX21lbnUtaXRlbScpO1xuXG5cbm1lbnVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgaWYgKGhlYWRlck5hdiA9PT0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2LS1hY3RpdmUnKSkge1xuICAgICAgICBoZWFkZXJOYXYuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZGVyX19uYXYtLWFjdGl2ZScpXG4gICAgICAgIG1lbnVCdG4uY2xhc3NMaXN0LnJlbW92ZSgnbWVudV9fYnRuLS1hY3RpdmUnKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaGVhZGVyTmF2LmNsYXNzTGlzdC5hZGQoJ2hlYWRlcl9fbmF2LS1hY3RpdmUnKVxuICAgICAgICBtZW51QnRuLmNsYXNzTGlzdC5hZGQoJ21lbnVfX2J0bi0tYWN0aXZlJylcbiAgICB9XG59KVxuXG5cblxuXG5cblxuLy9zY3JvbGwgdG8gc2tpbGxzXG5jb25zdCBoZWFkZXJCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19idG4tYm90dG9tJyk7XG5jb25zdCBza2lsbHNTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNraWxscycpO1xuXG5cbmhlYWRlckJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBza2lsbHNTZWN0aW9uLnNjcm9sbEludG9WaWV3KHtcbiAgICAgICAgYmxvY2s6ICduZWFyZXN0JywgLy8g0Log0LHQu9C40LbQsNC50YjQtdC5INCz0YDQsNC90LjRhtC1INGN0LrRgNCw0L3QsFxuICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCcsXG5cbiAgICB9KTtcbn0pO1xuXG5jb25zdCBsaW5rTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX21lbnUtbGluaycpO1xuXG5saW5rTWVudS5mb3JFYWNoKGl0ZW0gPT4ge1xuXG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGxpbmtEYXRhID0gaXRlbS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zdWJzdHJpbmcoMSlcbiAgICAgICAgY29uc29sZS5sb2cobGlua0RhdGEpXG4gICAgICAgIGxldCBibG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC4ke2xpbmtEYXRhfWApXG5cbiAgICAgICAgYmxvY2suc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgICAgICAgYmxvY2s6ICduZWFyZXN0JywgLy8g0Log0LHQu9C40LbQsNC50YjQtdC5INCz0YDQsNC90LjRhtC1INGN0LrRgNCw0L3QsFxuICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnLFxuICAgICAgICB9KTtcblxuICAgIH0pXG5cblxufSlcblxuXG5cbi8vZml4IGhlaWdodCBWQU5UQVxuY29uc3QgaGVhZGVyU2NyZWVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpXG5sZXQgcG9zaXRpb25IZWlnaHQgPSB3aW5kb3cuc2NyZWVuLmhlaWdodFxuY29uc29sZS5sb2cocG9zaXRpb25IZWlnaHQpXG5oZWFkZXJTY3JlZW4uc3R5bGUuaGVpZ2h0ID0gcG9zaXRpb25IZWlnaHQgKyAncHgnXG5cblxuXG4vL29wdGlvbnMgVkFOVEFcblZBTlRBLk5FVCh7XG4gICAgZWw6IFwiLmhlYWRlclwiLFxuICAgIG1vdXNlQ29udHJvbHM6IHRydWUsXG4gICAgdG91Y2hDb250cm9sczogdHJ1ZSxcbiAgICBneXJvQ29udHJvbHM6IGZhbHNlLFxuICAgIG1pbkhlaWdodDogcG9zaXRpb25IZWlnaHQsXG4gICAgbWluV2lkdGg6IDIwMC4wMCxcbiAgICBzY2FsZTogMS4wMCxcbiAgICBzY2FsZU1vYmlsZTogMS4wLFxuICAgIGNvbG9yOiAweDYwM2ZmZixcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IDB4MCxcbiAgICBzcGFjaW5nOiAxNC4wMCxcblxufSlcblxuXG5cblxuXG5cblxuLy9wcmVhbG9kZXIgXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5jbGFzc0xpc3QuYWRkKFwibG9hZGVkXCIpXG59KTtcblxuXG5cbi8vVmFsaWRhdGlvblxuXG5jb25zdCBFTUFJTF9SRUdFWFAgPSAvXigoW148PigpW1xcXS4sOzpcXHNAXCJdKyhcXC5bXjw+KClbXFxdLiw7Olxcc0BcIl0rKSopfChcIi4rXCIpKUAoKFtePD4oKVtcXF0uLDs6XFxzQFwiXStcXC4pK1tePD4oKVtcXF0uLDs6XFxzQFwiXXsyLH0pJC9pdTtcblxuY29uc3QgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZW1haWwnKTtcblxuZnVuY3Rpb24gb25JbnB1dCgpIHtcbiAgICBpZiAoaXNFbWFpbFZhbGlkKGlucHV0LnZhbHVlKSkge1xuICAgICAgICBpbnB1dC5zdHlsZS5ib3JkZXJDb2xvciA9ICdncmVlbic7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXQuc3R5bGUuYm9yZGVyQ29sb3IgPSAncmVkJztcbiAgICB9XG59XG5cbmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0Jywgb25JbnB1dCk7XG5cbmZ1bmN0aW9uIGlzRW1haWxWYWxpZCh2YWx1ZSkge1xuICAgIHJldHVybiBFTUFJTF9SRUdFWFAudGVzdCh2YWx1ZSk7XG59XG5cblxuIiwiZnVuY3Rpb24gYmRDYW52YXMoKSB7XHJcblxyXG4gICAgb3B0cyA9IHtcclxuICAgICAgICBtaW5SYWRpdXM6IDAuNSxcclxuICAgICAgICBtYXhSYWRpdXM6IDEuNCxcclxuICAgICAgICBjb2xvcnM6IFtcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC43KVwiLCBcInJnYmEoMjUyLCAyNDQsIDIwMSwgMC43KVwiLCBcInJnYmEoMjAxLCAyNTIsIDIwMSwgMC43KVwiLCBcInJnYmEoMjAxLCAyMzYsIDI1MiwgMC43KVwiLCBcInJnYmEoMjI5LCAyMDEsIDI1MiwgMC43KVwiLCBcInJnYmEoMjUyLCAyMDEsIDIwMSwgMC43KVwiLCBcInJnYmEoMjUyLCAyMDEsIDI0MSwgMC43KVwiLCBcInJnYmEoMjUyLCAyMDEsIDIwMSwgMC43KVwiXSxcclxuICAgICAgICBkZWxheTogMTAwLFxyXG4gICAgICAgIHN0ZXA6IDAuMVxyXG4gICAgfVxyXG4gICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tpZD1cImJkQ2FudmFzXCJdJyk7XHJcbiAgICBcclxuICAgIGxldCBwb3NpdGlvbkhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcclxuICAgIGNvbnNvbGUubG9nKHBvc2l0aW9uSGVpZ2h0KVxyXG5cclxuICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBwb3NpdGlvbkhlaWdodCArICdweCdcclxuXHJcblxyXG5cclxuICAgIHJlc2l6ZUNhbnZhcygpO1xyXG4gICAgZnVuY3Rpb24gcmVzaXplQ2FudmFzKCkge1xyXG4gICAgICAgIHcgPSBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICBoID0gY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2luZG93UmVzaXplKCk7XHJcbiAgICB9KVxyXG5cclxuICAgIGxldCBjaGVjaztcclxuXHJcbiAgICBmdW5jdGlvbiB3aW5kb3dSZXNpemUoKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KGNoZWNrKTtcclxuICAgICAgICBhcnJTdGFycy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGNoZWNrID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoYW5pbWF0aW9ucyk7XHJcbiAgICAgICAgICAgIHJlc2l6ZUNhbnZhcygpO1xyXG4gICAgICAgICAgICBzZXR1cCgpO1xyXG5cclxuICAgICAgICB9LCAxMDApXHJcbiAgICB9XHJcbiBcclxuICAgIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuICAgIFN0YXJzID0gZnVuY3Rpb24gKHcsIGgpIHtcclxuICAgICAgICB0aGlzLnggPSBNYXRoLnJhbmRvbSgpICogdztcclxuICAgICAgICB0aGlzLnkgPSBNYXRoLnJhbmRvbSgpICogaDtcclxuICAgICAgICB0aGlzLnJhZGl1cyA9IG9wdHMubWluUmFkaXVzICsgTWF0aC5yYW5kb20oKSAqIChvcHRzLm1heFJhZGl1cyAtIG9wdHMubWluUmFkaXVzKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gb3B0cy5jb2xvcnNbW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIG9wdHMuY29sb3JzLmxlbmd0aCldXTtcclxuICAgICAgICB0aGlzLnZlY3RvciA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSkgfHwgLTE7XHJcblxyXG4gICAgICAgIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcclxuICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2soKTtcclxuICAgICAgICAgICAgdGhpcy5yYWRpdXMgKz0gb3B0cy5zdGVwICogdGhpcy52ZWN0b3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNoZWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yYWRpdXMgPiBvcHRzLm1heFJhZGl1cyB8fCB0aGlzLnJhZGl1cyA8IG9wdHMubWluUmFkaXVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlY3RvciAqPSAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXR1cCgpIHtcclxuICAgICAgICBhcnJTdGFycyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8ICh3IC8gNDApICogKGggLyA0MCk7IGkrKykge1xyXG4gICAgICAgICAgICBhcnJTdGFycy5wdXNoKG5ldyBTdGFycyh3LCBoKSk7XHJcbiAgICAgICAgICAgIGFyclN0YXJzW2ldLmRyYXcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICBcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXAoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsb29wKCkge1xyXG4gICAgICAgIGFuaW1hdGlvbnMgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdywgaCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyU3RhcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGFyclN0YXJzW2ldLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgYXJyU3RhcnNbaV0uZHJhdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgb3B0cy5kZWxheSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxufTsgd2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGJkQ2FudmFzKCk7XHJcbn07XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyDQrdGC0L4gLSDQstCw0YjQsCDRgtC+0YfQutCwINCy0YXQvtC00LAg0LTQu9GPINGB0LrRgNC40L/RgtC+0LIg0YHRgtGA0LDQvdC40YbRiy4g0JjQvNC/0L7RgNGC0LjRgNGD0LnRgtC1INGB0Y7QtNCwINC90YPQttC90YvQtSDQstCw0Lwg0YTQsNC50LvRiy5cblxuaW1wb3J0ICcuL3NjcmlwdCc7XG5pbXBvcnQgJy4vc3RhcnMnO1xuaW1wb3J0ICcuL2ZpbHRlcic7XG4iXSwibmFtZXMiOlsiZmlsdGVyQnRucyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImZsaXRlckl0ZW0iLCJmaWx0ZXJXcmFwIiwicXVlcnlTZWxlY3RvciIsImZpbHRlciIsImZvckVhY2giLCJpdGVtQnRuIiwiYWRkRXZlbnRMaXN0ZW5lciIsImVsZW1lbnQiLCJzdHlsZSIsIm9wYWNpdHkiLCJwb2ludGVyRXZlbnRzIiwicG9zaXRpb24iLCJ0cmFuc2Zvcm0iLCJ0YXJnZXRJZCIsImdldEF0dHJpYnV0ZSIsInRhcmdldEl0ZW0iLCJqdXN0aWZ5Q29udGVudCIsIml0ZW0iLCJ3aW5kb3ciLCJzY3JlZW4iLCJ3aWR0aCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1lbnVCdG4iLCJoZWFkZXJOYXYiLCJsaW5rSXRlbSIsImNsYXNzTGlzdCIsInJlbW92ZSIsImFkZCIsImhlYWRlckJ0biIsInNraWxsc1NlY3Rpb24iLCJzY3JvbGxJbnRvVmlldyIsImJsb2NrIiwiYmVoYXZpb3IiLCJsaW5rTWVudSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImxpbmtEYXRhIiwic3Vic3RyaW5nIiwiY29uc29sZSIsImxvZyIsImhlYWRlclNjcmVlbiIsInBvc2l0aW9uSGVpZ2h0IiwiaGVpZ2h0IiwiVkFOVEEiLCJORVQiLCJlbCIsIm1vdXNlQ29udHJvbHMiLCJ0b3VjaENvbnRyb2xzIiwiZ3lyb0NvbnRyb2xzIiwibWluSGVpZ2h0IiwibWluV2lkdGgiLCJzY2FsZSIsInNjYWxlTW9iaWxlIiwiY29sb3IiLCJiYWNrZ3JvdW5kQ29sb3IiLCJzcGFjaW5nIiwiRU1BSUxfUkVHRVhQIiwiaW5wdXQiLCJvbklucHV0IiwiaXNFbWFpbFZhbGlkIiwidmFsdWUiLCJib3JkZXJDb2xvciIsInRlc3QiLCJiZENhbnZhcyIsIm9wdHMiLCJtaW5SYWRpdXMiLCJtYXhSYWRpdXMiLCJjb2xvcnMiLCJkZWxheSIsInN0ZXAiLCJjYW52YXMiLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRIZWlnaHQiLCJyZXNpemVDYW52YXMiLCJ3IiwiaW5uZXJXaWR0aCIsImgiLCJpbm5lckhlaWdodCIsIndpbmRvd1Jlc2l6ZSIsImNoZWNrIiwiY2xlYXJUaW1lb3V0IiwiYXJyU3RhcnMiLCJsZW5ndGgiLCJzZXRUaW1lb3V0IiwiY2xlYXJJbnRlcnZhbCIsImFuaW1hdGlvbnMiLCJzZXR1cCIsImN0eCIsImdldENvbnRleHQiLCJTdGFycyIsIngiLCJNYXRoIiwicmFuZG9tIiwieSIsInJhZGl1cyIsInJvdW5kIiwidmVjdG9yIiwiZHJhdyIsImJlZ2luUGF0aCIsImFyYyIsIlBJIiwiZmlsbFN0eWxlIiwiZmlsbCIsImNsb3NlUGF0aCIsInVwZGF0ZSIsImkiLCJwdXNoIiwibG9vcCIsInNldEludGVydmFsIiwiY2xlYXJSZWN0Iiwib25sb2FkIl0sInNvdXJjZVJvb3QiOiIifQ==