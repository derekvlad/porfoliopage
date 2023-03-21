/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 532:
/***/ (() => {

const filterBtns = document.querySelectorAll('.portfolio__btn');
const fliterItem = document.querySelectorAll('.portfolio__filter-item');
const filterWrap = document.querySelector('.portfolio__filter-inner');
function filter() {
  filterBtns.forEach(itemBtn => {
    console.log(itemBtn);
    itemBtn.addEventListener('click', () => {
      fliterItem.forEach(element => {
        element.style.opacity = "0";
        element.style.pointerEvents = "none";
        element.style.position = "absolute";
      });
      let targetId = itemBtn.getAttribute('data-id');
      console.log(targetId);
      let targetItem = document.querySelectorAll(`.${targetId}`);
      console.log(targetItem);
      if (targetId == 'all') {
        fliterItem.forEach(element => {
          element.style.opacity = "1";
          element.style.pointerEvents = "all";
          element.style.position = "relative";
          filterWrap.style.justifyContent = 'space-around';
        });
      } else {
        targetItem.forEach(item => {
          item.style.opacity = "1";
          item.style.pointerEvents = "all";
          item.style.position = "relative";
          filterWrap.style.justifyContent = 'flex-start';
        });
      }
    });
  });
}
filter();

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
  let canvas = document.querySelector('[id="bdCanvas"]');
  const headerScreen = document.querySelector('.header');
  let positionHeight = window.screen.height;
  canvas.style.height = positionHeight + 'px';
  console.log();
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
/* harmony import */ var _filter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(532);
/* harmony import */ var _filter__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_filter__WEBPACK_IMPORTED_MODULE_2__);
// Это - ваша точка входа для скриптов страницы. Импортируйте сюда нужные вам файлы.




})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7Ozs7Ozs7Ozs7OztBQ0FBOztBQUVrQjtBQUNEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY3JlYXRlLWh0bWwtYm9pbGVycGxhdGUvLi9zb3VyY2UvanMvZmlsdGVyLmpzIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlLy4vc291cmNlL2pzL3NjcmlwdC5qcyIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS8uL3NvdXJjZS9qcy9zdGFycy5qcyIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY3JlYXRlLWh0bWwtYm9pbGVycGxhdGUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS8uL3NvdXJjZS9qcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcbmNvbnN0IGZpbHRlckJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucG9ydGZvbGlvX19idG4nKVxyXG5cclxuY29uc3QgZmxpdGVySXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wb3J0Zm9saW9fX2ZpbHRlci1pdGVtJylcclxuY29uc3QgZmlsdGVyV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wb3J0Zm9saW9fX2ZpbHRlci1pbm5lcicpXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGZpbHRlcigpIHtcclxuXHJcblxyXG5cclxuXHJcbiAgICBmaWx0ZXJCdG5zLmZvckVhY2goaXRlbUJ0biA9PiB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGl0ZW1CdG4pXHJcbiAgICAgICAgaXRlbUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgZmxpdGVySXRlbS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gXCIwXCJcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiXHJcblxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0SWQgPSBpdGVtQnRuLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRhcmdldElkKVxyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0SXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke3RhcmdldElkfWApXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRhcmdldEl0ZW0pXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRJZCA9PSAnYWxsJykge1xyXG5cclxuICAgICAgICAgICAgICAgIGZsaXRlckl0ZW0uZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIjFcIlxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiYWxsXCJcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyV3JhcC5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdzcGFjZS1hcm91bmQnXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SXRlbS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUub3BhY2l0eSA9IFwiMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhbGxcIlxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCJcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJXcmFwLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ2ZsZXgtc3RhcnQnXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG5cclxuXHJcbn1cclxuXHJcblxyXG5maWx0ZXIoKSIsIi8vdGFyZ2V0IG1lbnUgbGlzdFxuY29uc3QgbWVudUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZW51X19idG4nKTtcbmNvbnN0IGhlYWRlck5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdicpO1xuY29uc3QgbGlua0l0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19tZW51LWl0ZW0nKTtcblxuXG5tZW51QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChoZWFkZXJOYXYgPT09IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi0tYWN0aXZlJykpIHtcbiAgICAgICAgaGVhZGVyTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlcl9fbmF2LS1hY3RpdmUnKVxuICAgICAgICBtZW51QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ21lbnVfX2J0bi0tYWN0aXZlJylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGhlYWRlck5hdi5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX25hdi0tYWN0aXZlJylcbiAgICAgICAgbWVudUJ0bi5jbGFzc0xpc3QuYWRkKCdtZW51X19idG4tLWFjdGl2ZScpXG4gICAgfVxufSlcblxuXG5cblxuXG5cbi8vc2Nyb2xsIHRvIHNraWxsc1xuY29uc3QgaGVhZGVyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fYnRuLWJvdHRvbScpO1xuY29uc3Qgc2tpbGxzU2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5za2lsbHMnKTtcblxuXG5oZWFkZXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgc2tpbGxzU2VjdGlvbi5zY3JvbGxJbnRvVmlldyh7XG4gICAgICAgIGJsb2NrOiAnbmVhcmVzdCcsIC8vINC6INCx0LvQuNC20LDQudGI0LXQuSDQs9GA0LDQvdC40YbQtSDRjdC60YDQsNC90LBcbiAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnLFxuXG4gICAgfSk7XG59KTtcblxuY29uc3QgbGlua01lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19tZW51LWxpbmsnKTtcblxubGlua01lbnUuZm9yRWFjaChpdGVtID0+IHtcblxuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBsaW5rRGF0YSA9IGl0ZW0uZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAgIGNvbnNvbGUubG9nKGxpbmtEYXRhKVxuICAgICAgICBsZXQgYmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuJHtsaW5rRGF0YX1gKVxuXG4gICAgICAgIGJsb2NrLnNjcm9sbEludG9WaWV3KHtcbiAgICAgICAgICAgIGJsb2NrOiAnbmVhcmVzdCcsIC8vINC6INCx0LvQuNC20LDQudGI0LXQuSDQs9GA0LDQvdC40YbQtSDRjdC60YDQsNC90LBcbiAgICAgICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJyxcbiAgICAgICAgfSk7XG5cbiAgICB9KVxuXG5cbn0pXG5cblxuXG4vL2ZpeCBoZWlnaHQgVkFOVEFcbmNvbnN0IGhlYWRlclNjcmVlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKVxubGV0IHBvc2l0aW9uSGVpZ2h0ID0gd2luZG93LnNjcmVlbi5oZWlnaHRcblxuaGVhZGVyU2NyZWVuLnN0eWxlLmhlaWdodCA9IHBvc2l0aW9uSGVpZ2h0ICsgJ3B4J1xuXG5cblxuLy9vcHRpb25zIFZBTlRBXG5WQU5UQS5ORVQoe1xuICAgIGVsOiBcIi5oZWFkZXJcIixcbiAgICBtb3VzZUNvbnRyb2xzOiB0cnVlLFxuICAgIHRvdWNoQ29udHJvbHM6IHRydWUsXG4gICAgZ3lyb0NvbnRyb2xzOiBmYWxzZSxcbiAgICBtaW5IZWlnaHQ6IHBvc2l0aW9uSGVpZ2h0LFxuICAgIG1pbldpZHRoOiAyMDAuMDAsXG4gICAgc2NhbGU6IDEuMDAsXG4gICAgc2NhbGVNb2JpbGU6IDEuMCxcbiAgICBjb2xvcjogMHg2MDNmZmYsXG4gICAgYmFja2dyb3VuZENvbG9yOiAweDAsXG4gICAgc3BhY2luZzogMTQuMDAsXG4gICAgXG59KVxuXG5cblxuXG5cblxuXG4vL3ByZWFsb2RlciBcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLGZ1bmN0aW9uKCl7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLmNsYXNzTGlzdC5hZGQoXCJsb2FkZWRcIikgIFxuICB9KTtcbiAgIiwiZnVuY3Rpb24gYmRDYW52YXMoKSB7XHJcblxyXG4gICAgb3B0cyA9IHtcclxuICAgICAgICBtaW5SYWRpdXM6IDAuNSxcclxuICAgICAgICBtYXhSYWRpdXM6IDEuNCxcclxuICAgICAgICBjb2xvcnM6IFtcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC43KVwiLCBcInJnYmEoMjUyLCAyNDQsIDIwMSwgMC43KVwiLCBcInJnYmEoMjAxLCAyNTIsIDIwMSwgMC43KVwiLCBcInJnYmEoMjAxLCAyMzYsIDI1MiwgMC43KVwiLCBcInJnYmEoMjI5LCAyMDEsIDI1MiwgMC43KVwiLCBcInJnYmEoMjUyLCAyMDEsIDIwMSwgMC43KVwiLCBcInJnYmEoMjUyLCAyMDEsIDI0MSwgMC43KVwiLCBcInJnYmEoMjUyLCAyMDEsIDIwMSwgMC43KVwiXSxcclxuICAgICAgICBkZWxheTogOTAsXHJcbiAgICAgICAgc3RlcDogMC4xXHJcbiAgICB9XHJcbiAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2lkPVwiYmRDYW52YXNcIl0nKTtcclxuICAgIGNvbnN0IGhlYWRlclNjcmVlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKVxyXG4gICAgbGV0IHBvc2l0aW9uSGVpZ2h0ID0gd2luZG93LnNjcmVlbi5oZWlnaHRcclxuXHJcbiAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gcG9zaXRpb25IZWlnaHQgKyAncHgnXHJcblxyXG4gICAgY29uc29sZS5sb2coKVxyXG5cclxuICAgIHJlc2l6ZUNhbnZhcygpO1xyXG4gICAgZnVuY3Rpb24gcmVzaXplQ2FudmFzKCkge1xyXG4gICAgICAgIHcgPSBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICBoID0gY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2luZG93UmVzaXplKCk7XHJcbiAgICB9KVxyXG5cclxuICAgIGxldCBjaGVjaztcclxuXHJcbiAgICBmdW5jdGlvbiB3aW5kb3dSZXNpemUoKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KGNoZWNrKTtcclxuICAgICAgICBhcnJTdGFycy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGNoZWNrID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoYW5pbWF0aW9ucyk7XHJcbiAgICAgICAgICAgIHJlc2l6ZUNhbnZhcygpO1xyXG4gICAgICAgICAgICBzZXR1cCgpO1xyXG5cclxuICAgICAgICB9LCAxMDApXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG4gICAgU3RhcnMgPSBmdW5jdGlvbiAodywgaCkge1xyXG4gICAgICAgIHRoaXMueCA9IE1hdGgucmFuZG9tKCkgKiB3O1xyXG4gICAgICAgIHRoaXMueSA9IE1hdGgucmFuZG9tKCkgKiBoO1xyXG4gICAgICAgIHRoaXMucmFkaXVzID0gb3B0cy5taW5SYWRpdXMgKyBNYXRoLnJhbmRvbSgpICogKG9wdHMubWF4UmFkaXVzIC0gb3B0cy5taW5SYWRpdXMpO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBvcHRzLmNvbG9yc1tbTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogb3B0cy5jb2xvcnMubGVuZ3RoKV1dO1xyXG4gICAgICAgIHRoaXMudmVjdG9yID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKSB8fCAtMTtcclxuXHJcbiAgICAgICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCBNYXRoLlBJICogMik7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGVjaygpO1xyXG4gICAgICAgICAgICB0aGlzLnJhZGl1cyArPSBvcHRzLnN0ZXAgKiB0aGlzLnZlY3RvcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2hlY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJhZGl1cyA+IG9wdHMubWF4UmFkaXVzIHx8IHRoaXMucmFkaXVzIDwgb3B0cy5taW5SYWRpdXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVjdG9yICo9IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldHVwKCkge1xyXG4gICAgICAgIGFyclN0YXJzID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgKHcgLyA0MCkgKiAoaCAvIDQwKTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFyclN0YXJzLnB1c2gobmV3IFN0YXJzKHcsIGgpKTtcclxuICAgICAgICAgICAgYXJyU3RhcnNbaV0uZHJhdygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsb29wKClcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cCgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxvb3AoKSB7XHJcbiAgICAgICAgYW5pbWF0aW9ucyA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3LCBoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJTdGFycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgYXJyU3RhcnNbaV0udXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBhcnJTdGFyc1tpXS5kcmF3KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBvcHRzLmRlbGF5KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG59OyB3aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgYmRDYW52YXMoKTtcclxufTtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vINCt0YLQviAtINCy0LDRiNCwINGC0L7Rh9C60LAg0LLRhdC+0LTQsCDQtNC70Y8g0YHQutGA0LjQv9GC0L7QsiDRgdGC0YDQsNC90LjRhtGLLiDQmNC80L/QvtGA0YLQuNGA0YPQudGC0LUg0YHRjtC00LAg0L3Rg9C20L3Ri9C1INCy0LDQvCDRhNCw0LnQu9GLLlxuXG5pbXBvcnQgJy4vc2NyaXB0JztcbmltcG9ydCAnLi9zdGFycyc7XG5pbXBvcnQgJy4vZmlsdGVyJztcbiJdLCJuYW1lcyI6WyJmaWx0ZXJCdG5zIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZmxpdGVySXRlbSIsImZpbHRlcldyYXAiLCJxdWVyeVNlbGVjdG9yIiwiZmlsdGVyIiwiZm9yRWFjaCIsIml0ZW1CdG4iLCJjb25zb2xlIiwibG9nIiwiYWRkRXZlbnRMaXN0ZW5lciIsImVsZW1lbnQiLCJzdHlsZSIsIm9wYWNpdHkiLCJwb2ludGVyRXZlbnRzIiwicG9zaXRpb24iLCJ0YXJnZXRJZCIsImdldEF0dHJpYnV0ZSIsInRhcmdldEl0ZW0iLCJqdXN0aWZ5Q29udGVudCIsIml0ZW0iLCJtZW51QnRuIiwiaGVhZGVyTmF2IiwibGlua0l0ZW0iLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJhZGQiLCJoZWFkZXJCdG4iLCJza2lsbHNTZWN0aW9uIiwic2Nyb2xsSW50b1ZpZXciLCJibG9jayIsImJlaGF2aW9yIiwibGlua01lbnUiLCJlIiwicHJldmVudERlZmF1bHQiLCJsaW5rRGF0YSIsInN1YnN0cmluZyIsImhlYWRlclNjcmVlbiIsInBvc2l0aW9uSGVpZ2h0Iiwid2luZG93Iiwic2NyZWVuIiwiaGVpZ2h0IiwiVkFOVEEiLCJORVQiLCJlbCIsIm1vdXNlQ29udHJvbHMiLCJ0b3VjaENvbnRyb2xzIiwiZ3lyb0NvbnRyb2xzIiwibWluSGVpZ2h0IiwibWluV2lkdGgiLCJzY2FsZSIsInNjYWxlTW9iaWxlIiwiY29sb3IiLCJiYWNrZ3JvdW5kQ29sb3IiLCJzcGFjaW5nIiwiYmRDYW52YXMiLCJvcHRzIiwibWluUmFkaXVzIiwibWF4UmFkaXVzIiwiY29sb3JzIiwiZGVsYXkiLCJzdGVwIiwiY2FudmFzIiwicmVzaXplQ2FudmFzIiwidyIsIndpZHRoIiwiaW5uZXJXaWR0aCIsImgiLCJpbm5lckhlaWdodCIsIndpbmRvd1Jlc2l6ZSIsImNoZWNrIiwiY2xlYXJUaW1lb3V0IiwiYXJyU3RhcnMiLCJsZW5ndGgiLCJzZXRUaW1lb3V0IiwiY2xlYXJJbnRlcnZhbCIsImFuaW1hdGlvbnMiLCJzZXR1cCIsImN0eCIsImdldENvbnRleHQiLCJTdGFycyIsIngiLCJNYXRoIiwicmFuZG9tIiwieSIsInJhZGl1cyIsInJvdW5kIiwidmVjdG9yIiwiZHJhdyIsImJlZ2luUGF0aCIsImFyYyIsIlBJIiwiZmlsbFN0eWxlIiwiZmlsbCIsImNsb3NlUGF0aCIsInVwZGF0ZSIsImkiLCJwdXNoIiwibG9vcCIsInNldEludGVydmFsIiwiY2xlYXJSZWN0Iiwib25sb2FkIl0sInNvdXJjZVJvb3QiOiIifQ==