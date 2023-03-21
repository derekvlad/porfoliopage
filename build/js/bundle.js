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

// linkItem.forEach(item =>{
//     item.addEventListener('click',()=>{
//         headerNav.classList.remove('header__nav--active')
//         menuBtn.classList.remove('menu__btn--active')
//         let linkId = item.childNodes
//         console.log("linklinkId" ,linkId)

//         linkId.forEach(link =>{
//         //    let link.ATTRIBUTE_NODE

//         })
//     })
// })

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
      block: 'end',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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S0FBSyxDQUFDO0VBQ2xCO0FBTUo7QUFBQztBQUFFdEIsTUFBTSxDQUFDK0QsTUFBTSxHQUFHLFlBQVk7RUFDM0I5QyxRQUFRLEVBQUU7QUFDZCxDQUFDOzs7Ozs7VUM3RkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7Ozs7Ozs7O0FDQUE7O0FBRWtCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY3JlYXRlLWh0bWwtYm9pbGVycGxhdGUvLi9zb3VyY2UvanMvc2NyaXB0LmpzIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlLy4vc291cmNlL2pzL3N0YXJzLmpzIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlLy4vc291cmNlL2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vdGFyZ2V0IG1lbnUgbGlzdFxuY29uc3QgbWVudUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZW51X19idG4nKTtcbmNvbnN0IGhlYWRlck5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdicpO1xuY29uc3QgbGlua0l0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19tZW51LWl0ZW0nKTtcblxuXG5tZW51QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChoZWFkZXJOYXYgPT09IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi0tYWN0aXZlJykpIHtcbiAgICAgICAgaGVhZGVyTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlcl9fbmF2LS1hY3RpdmUnKVxuICAgICAgICBtZW51QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ21lbnVfX2J0bi0tYWN0aXZlJylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGhlYWRlck5hdi5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX25hdi0tYWN0aXZlJylcbiAgICAgICAgbWVudUJ0bi5jbGFzc0xpc3QuYWRkKCdtZW51X19idG4tLWFjdGl2ZScpXG4gICAgfVxufSlcblxuLy8gbGlua0l0ZW0uZm9yRWFjaChpdGVtID0+e1xuLy8gICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpPT57XG4vLyAgICAgICAgIGhlYWRlck5hdi5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkZXJfX25hdi0tYWN0aXZlJylcbi8vICAgICAgICAgbWVudUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdtZW51X19idG4tLWFjdGl2ZScpXG4vLyAgICAgICAgIGxldCBsaW5rSWQgPSBpdGVtLmNoaWxkTm9kZXNcbi8vICAgICAgICAgY29uc29sZS5sb2coXCJsaW5rbGlua0lkXCIgLGxpbmtJZClcblxuLy8gICAgICAgICBsaW5rSWQuZm9yRWFjaChsaW5rID0+e1xuLy8gICAgICAgICAvLyAgICBsZXQgbGluay5BVFRSSUJVVEVfTk9ERVxuXG4vLyAgICAgICAgIH0pXG4vLyAgICAgfSlcbi8vIH0pXG5cblxuXG5cbi8vc2Nyb2xsIHRvIHNraWxsc1xuY29uc3QgaGVhZGVyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fYnRuLWJvdHRvbScpO1xuY29uc3Qgc2tpbGxzU2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5za2lsbHMnKTtcblxuXG5oZWFkZXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgc2tpbGxzU2VjdGlvbi5zY3JvbGxJbnRvVmlldyh7XG4gICAgICAgIGJsb2NrOiAnbmVhcmVzdCcsIC8vINC6INCx0LvQuNC20LDQudGI0LXQuSDQs9GA0LDQvdC40YbQtSDRjdC60YDQsNC90LBcbiAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnLFxuXG4gICAgfSk7XG59KTtcblxuY29uc3QgbGlua01lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19tZW51LWxpbmsnKTtcblxubGlua01lbnUuZm9yRWFjaChpdGVtID0+IHtcbiAgIFxuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBsaW5rRGF0YSA9IGl0ZW0uZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAgIGNvbnNvbGUubG9nKGxpbmtEYXRhKVxuICAgICAgICBsZXQgYmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuJHtsaW5rRGF0YX1gKVxuICAgICAgICBcbiAgICAgICAgYmxvY2suc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgICAgICAgYmxvY2s6ICdlbmQnLCAvLyDQuiDQsdC70LjQttCw0LnRiNC10Lkg0LPRgNCw0L3QuNGG0LUg0Y3QutGA0LDQvdCwXG4gICAgICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCcsXG4gICAgICAgIH0pO1xuICAgIFxuICAgIH0pXG5cblxufSlcblxuXG5cbi8vZml4IGhlaWdodCBWQU5UQVxuY29uc3QgaGVhZGVyU2NyZWVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpXG5sZXQgcG9zaXRpb25IZWlnaHQgPSB3aW5kb3cuc2NyZWVuLmhlaWdodFxuXG5oZWFkZXJTY3JlZW4uc3R5bGUuaGVpZ2h0ID0gcG9zaXRpb25IZWlnaHQgKyAncHgnXG5cblxuXG4vL29wdGlvbnMgVkFOVEFcblZBTlRBLk5FVCh7XG4gICAgZWw6IFwiLmhlYWRlclwiLFxuXG4gICAgbW91c2VDb250cm9sczogdHJ1ZSxcbiAgICB0b3VjaENvbnRyb2xzOiB0cnVlLFxuICAgIGd5cm9Db250cm9sczogZmFsc2UsXG4gICAgbWluSGVpZ2h0OiBwb3NpdGlvbkhlaWdodCxcbiAgICBtaW5XaWR0aDogMjAwLjAwLFxuICAgIHNjYWxlOiAxLjAwLFxuICAgIHNjYWxlTW9iaWxlOiAxLjAsXG4gICAgY29sb3I6IDB4NjAzZmZmLFxuICAgIGJhY2tncm91bmRDb2xvcjogMHgwLFxuICAgIHNwYWNpbmc6IDE0LjAwXG59KSIsImZ1bmN0aW9uIGJkQ2FudmFzKCkge1xyXG5cclxuICAgIG9wdHMgPSB7XHJcbiAgICAgICAgbWluUmFkaXVzOiAwLjUsXHJcbiAgICAgICAgbWF4UmFkaXVzOiAxLjQsXHJcbiAgICAgICAgY29sb3JzOiBbXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNylcIiwgXCJyZ2JhKDI1MiwgMjQ0LCAyMDEsIDAuNylcIiwgXCJyZ2JhKDIwMSwgMjUyLCAyMDEsIDAuNylcIiwgXCJyZ2JhKDIwMSwgMjM2LCAyNTIsIDAuNylcIiwgXCJyZ2JhKDIyOSwgMjAxLCAyNTIsIDAuNylcIiwgXCJyZ2JhKDI1MiwgMjAxLCAyMDEsIDAuNylcIiwgXCJyZ2JhKDI1MiwgMjAxLCAyNDEsIDAuNylcIiwgXCJyZ2JhKDI1MiwgMjAxLCAyMDEsIDAuNylcIl0sXHJcbiAgICAgICAgZGVsYXk6IDkwLFxyXG4gICAgICAgIHN0ZXA6IDAuMVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2JkQ2FudmFzXCIpO1xyXG5cclxuICAgIHJlc2l6ZUNhbnZhcygpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlc2l6ZUNhbnZhcygpIHtcclxuICAgICAgICB3ID0gY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICAgICAgaCA9IGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHdpbmRvd1Jlc2l6ZSgpO1xyXG4gICAgfSlcclxuXHJcbiAgICBsZXQgY2hlY2s7XHJcblxyXG4gICAgZnVuY3Rpb24gd2luZG93UmVzaXplKCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChjaGVjayk7XHJcbiAgICAgICAgYXJyU3RhcnMubGVuZ3RoID0gMDtcclxuICAgICAgICBjaGVjayA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKGFuaW1hdGlvbnMpO1xyXG4gICAgICAgICAgICByZXNpemVDYW52YXMoKTtcclxuICAgICAgICAgICAgc2V0dXAoKTtcclxuICAgICAgICAgICBcclxuICAgICAgICB9LCAxMDApXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG4gICAgU3RhcnMgPSBmdW5jdGlvbiAodywgaCkge1xyXG4gICAgICAgIHRoaXMueCA9IE1hdGgucmFuZG9tKCkgKiB3O1xyXG4gICAgICAgIHRoaXMueSA9IE1hdGgucmFuZG9tKCkgKiBoO1xyXG4gICAgICAgIHRoaXMucmFkaXVzID0gb3B0cy5taW5SYWRpdXMgKyBNYXRoLnJhbmRvbSgpICogKG9wdHMubWF4UmFkaXVzIC0gb3B0cy5taW5SYWRpdXMpO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBvcHRzLmNvbG9yc1tbTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogb3B0cy5jb2xvcnMubGVuZ3RoKV1dO1xyXG4gICAgICAgIHRoaXMudmVjdG9yID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKSB8fCAtMTtcclxuXHJcbiAgICAgICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCBNYXRoLlBJICogMik7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGVjaygpO1xyXG4gICAgICAgICAgICB0aGlzLnJhZGl1cyArPSBvcHRzLnN0ZXAgKiB0aGlzLnZlY3RvcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2hlY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJhZGl1cyA+IG9wdHMubWF4UmFkaXVzIHx8IHRoaXMucmFkaXVzIDwgb3B0cy5taW5SYWRpdXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVjdG9yICo9IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldHVwKCkge1xyXG4gICAgICAgIGFyclN0YXJzID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgKHcgLyA0MCkgKiAoaCAvIDQwKTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFyclN0YXJzLnB1c2gobmV3IFN0YXJzKHcsIGgpKTtcclxuICAgICAgICAgICAgYXJyU3RhcnNbaV0uZHJhdygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsb29wKClcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cCgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxvb3AoKSB7XHJcbiAgICAgICAgYW5pbWF0aW9ucyA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3LCBoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJTdGFycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgYXJyU3RhcnNbaV0udXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBhcnJTdGFyc1tpXS5kcmF3KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBvcHRzLmRlbGF5KTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuXHJcbiAgIFxyXG4gICAgXHJcbn07IHdpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBiZENhbnZhcygpO1xyXG59O1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8g0K3RgtC+IC0g0LLQsNGI0LAg0YLQvtGH0LrQsCDQstGF0L7QtNCwINC00LvRjyDRgdC60YDQuNC/0YLQvtCyINGB0YLRgNCw0L3QuNGG0YsuINCY0LzQv9C+0YDRgtC40YDRg9C50YLQtSDRgdGO0LTQsCDQvdGD0LbQvdGL0LUg0LLQsNC8INGE0LDQudC70YsuXG5cbmltcG9ydCAnLi9zY3JpcHQnO1xuaW1wb3J0ICcuL3N0YXJzJztcbiJdLCJuYW1lcyI6WyJtZW51QnRuIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiaGVhZGVyTmF2IiwibGlua0l0ZW0iLCJxdWVyeVNlbGVjdG9yQWxsIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNsYXNzTGlzdCIsInJlbW92ZSIsImFkZCIsImhlYWRlckJ0biIsInNraWxsc1NlY3Rpb24iLCJzY3JvbGxJbnRvVmlldyIsImJsb2NrIiwiYmVoYXZpb3IiLCJsaW5rTWVudSIsImZvckVhY2giLCJpdGVtIiwiZSIsInByZXZlbnREZWZhdWx0IiwibGlua0RhdGEiLCJnZXRBdHRyaWJ1dGUiLCJzdWJzdHJpbmciLCJjb25zb2xlIiwibG9nIiwiaGVhZGVyU2NyZWVuIiwicG9zaXRpb25IZWlnaHQiLCJ3aW5kb3ciLCJzY3JlZW4iLCJoZWlnaHQiLCJzdHlsZSIsIlZBTlRBIiwiTkVUIiwiZWwiLCJtb3VzZUNvbnRyb2xzIiwidG91Y2hDb250cm9scyIsImd5cm9Db250cm9scyIsIm1pbkhlaWdodCIsIm1pbldpZHRoIiwic2NhbGUiLCJzY2FsZU1vYmlsZSIsImNvbG9yIiwiYmFja2dyb3VuZENvbG9yIiwic3BhY2luZyIsImJkQ2FudmFzIiwib3B0cyIsIm1pblJhZGl1cyIsIm1heFJhZGl1cyIsImNvbG9ycyIsImRlbGF5Iiwic3RlcCIsImNhbnZhcyIsInJlc2l6ZUNhbnZhcyIsInciLCJ3aWR0aCIsImlubmVyV2lkdGgiLCJoIiwiaW5uZXJIZWlnaHQiLCJ3aW5kb3dSZXNpemUiLCJjaGVjayIsImNsZWFyVGltZW91dCIsImFyclN0YXJzIiwibGVuZ3RoIiwic2V0VGltZW91dCIsImNsZWFySW50ZXJ2YWwiLCJhbmltYXRpb25zIiwic2V0dXAiLCJjdHgiLCJnZXRDb250ZXh0IiwiU3RhcnMiLCJ4IiwiTWF0aCIsInJhbmRvbSIsInkiLCJyYWRpdXMiLCJyb3VuZCIsInZlY3RvciIsImRyYXciLCJiZWdpblBhdGgiLCJhcmMiLCJQSSIsImZpbGxTdHlsZSIsImZpbGwiLCJjbG9zZVBhdGgiLCJ1cGRhdGUiLCJpIiwicHVzaCIsImxvb3AiLCJzZXRJbnRlcnZhbCIsImNsZWFyUmVjdCIsIm9ubG9hZCJdLCJzb3VyY2VSb290IjoiIn0=