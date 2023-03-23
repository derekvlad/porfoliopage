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
      });
      let targetId = itemBtn.getAttribute('data-id');
      let targetItem = document.querySelectorAll(`.${targetId}`);
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
const vantaCanvas = document.querySelector('.vanta-canvas');
let frameCount = function _fc(fastTimeStart, preciseTimeStart) {
  let now = performance.now();
  let fastDuration = now - (fastTimeStart || _fc.startTime);
  let preciseDuration = now - (preciseTimeStart || _fc.startTime);
  if (fastDuration < 100) {
    _fc.fastCounter++;
  } else {
    _fc.fastFPS = _fc.fastCounter * 10;
    _fc.fastCounter = 0;
    fastTimeStart = now;
    console.log(_fc.fastFPS);
  }
  if (preciseDuration < 1000) {
    _fc.preciseCounter++;
  } else {
    _fc.preciseFPS = _fc.preciseCounter;
    _fc.preciseCounter = 0;
    preciseTimeStart = now;
    console.log(_fc.preciseFPS);
    if (_fc.preciseFPS <= '30') {
      vantaCanvas.style.display = "none";
    } else {
      vantaCanvas.style.display = "block";
    }
  }
  requestAnimationFrame(() => frameCount(fastTimeStart, preciseTimeStart));
};
frameCount.fastCounter = 0;
frameCount.fastFPS = 0;
frameCount.preciseCounter = 0;
frameCount.preciseFPS = 0;
frameCount.startTime = performance.now();
frameCount();

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
  const headerScreen = document.querySelector('.header');
  let positionHeight = window.screen.height;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFJLEVBQUU7SUFDdEI7SUFFQWxDLHFCQUFxQixDQUFDNEMsSUFBSSxDQUFDO0VBQy9CO0VBRUFyQixLQUFLLEVBQUU7RUFFUCxTQUFTcUIsSUFBSUEsQ0FBQSxFQUFHO0lBQ1p0QixVQUFVLEdBQUd1QixXQUFXLENBQUMsWUFBWTtNQUNqQ3JCLEdBQUcsQ0FBQ3NCLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFcEMsQ0FBQyxFQUFFRyxDQUFDLENBQUM7TUFDekIsS0FBSyxJQUFJNkIsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHeEIsUUFBUSxDQUFDQyxNQUFNLEVBQUV1QixDQUFDLEVBQUUsRUFBRTtRQUN0Q3hCLFFBQVEsQ0FBQ3dCLENBQUMsQ0FBQyxDQUFDRCxNQUFNLEVBQUU7UUFDcEJ2QixRQUFRLENBQUN3QixDQUFDLENBQUMsQ0FBQ1IsSUFBSSxFQUFFO01BQ3RCO0lBQ0osQ0FBQyxFQUFFaEMsSUFBSSxDQUFDSSxLQUFLLENBQUM7RUFDbEI7QUFNSjtBQUFDO0FBQUU1QyxNQUFNLENBQUNxRixNQUFNLEdBQUcsWUFBWTtFQUMzQjlDLFFBQVEsRUFBRTtBQUNkLENBQUM7Ozs7OztVQ3BHRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7Ozs7Ozs7Ozs7OztBQ0FBOztBQUVrQjtBQUNEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY3JlYXRlLWh0bWwtYm9pbGVycGxhdGUvLi9zb3VyY2UvanMvZmlsdGVyLmpzIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlLy4vc291cmNlL2pzL3NjcmlwdC5qcyIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS8uL3NvdXJjZS9qcy9zdGFycy5qcyIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY3JlYXRlLWh0bWwtYm9pbGVycGxhdGUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS8uL3NvdXJjZS9qcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBmaWx0ZXJCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBvcnRmb2xpb19fYnRuJylcclxuY29uc3QgZmxpdGVySXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wb3J0Zm9saW9fX2ZpbHRlci1pdGVtJylcclxuY29uc3QgZmlsdGVyV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wb3J0Zm9saW9fX2ZpbHRlci1pbm5lcicpXHJcbmZ1bmN0aW9uIGZpbHRlcigpIHtcclxuICAgIGZpbHRlckJ0bnMuZm9yRWFjaChpdGVtQnRuID0+IHtcclxuICAgICAgICBpdGVtQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBmbGl0ZXJJdGVtLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIjBcIlxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCJcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgbGV0IHRhcmdldElkID0gaXRlbUJ0bi5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKVxyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0SXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke3RhcmdldElkfWApXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRJZCA9PSAnYWxsJykge1xyXG4gICAgICAgICAgICAgICAgZmxpdGVySXRlbS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhbGxcIlxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCJcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJXcmFwLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ3NwYWNlLWFyb3VuZCdcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRJdGVtLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5vcGFjaXR5ID0gXCIxXCJcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcImFsbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIlxyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcldyYXAuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnZmxleC1zdGFydCdcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufVxyXG5maWx0ZXIoKSIsIi8vdGFyZ2V0IG1lbnUgbGlzdFxuY29uc3QgbWVudUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZW51X19idG4nKTtcbmNvbnN0IGhlYWRlck5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdicpO1xuY29uc3QgbGlua0l0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19tZW51LWl0ZW0nKTtcblxuXG5tZW51QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChoZWFkZXJOYXYgPT09IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi0tYWN0aXZlJykpIHtcbiAgICAgICAgaGVhZGVyTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlcl9fbmF2LS1hY3RpdmUnKVxuICAgICAgICBtZW51QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ21lbnVfX2J0bi0tYWN0aXZlJylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGhlYWRlck5hdi5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX25hdi0tYWN0aXZlJylcbiAgICAgICAgbWVudUJ0bi5jbGFzc0xpc3QuYWRkKCdtZW51X19idG4tLWFjdGl2ZScpXG4gICAgfVxufSlcblxuXG5cblxuXG5cbi8vc2Nyb2xsIHRvIHNraWxsc1xuY29uc3QgaGVhZGVyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fYnRuLWJvdHRvbScpO1xuY29uc3Qgc2tpbGxzU2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5za2lsbHMnKTtcblxuXG5oZWFkZXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgc2tpbGxzU2VjdGlvbi5zY3JvbGxJbnRvVmlldyh7XG4gICAgICAgIGJsb2NrOiAnbmVhcmVzdCcsIC8vINC6INCx0LvQuNC20LDQudGI0LXQuSDQs9GA0LDQvdC40YbQtSDRjdC60YDQsNC90LBcbiAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnLFxuXG4gICAgfSk7XG59KTtcblxuY29uc3QgbGlua01lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19tZW51LWxpbmsnKTtcblxubGlua01lbnUuZm9yRWFjaChpdGVtID0+IHtcblxuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBsaW5rRGF0YSA9IGl0ZW0uZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAgIGNvbnNvbGUubG9nKGxpbmtEYXRhKVxuICAgICAgICBsZXQgYmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuJHtsaW5rRGF0YX1gKVxuXG4gICAgICAgIGJsb2NrLnNjcm9sbEludG9WaWV3KHtcbiAgICAgICAgICAgIGJsb2NrOiAnbmVhcmVzdCcsIC8vINC6INCx0LvQuNC20LDQudGI0LXQuSDQs9GA0LDQvdC40YbQtSDRjdC60YDQsNC90LBcbiAgICAgICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJyxcbiAgICAgICAgfSk7XG5cbiAgICB9KVxuXG5cbn0pXG5cblxuXG4vL2ZpeCBoZWlnaHQgVkFOVEFcbmNvbnN0IGhlYWRlclNjcmVlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKVxubGV0IHBvc2l0aW9uSGVpZ2h0ID0gd2luZG93LnNjcmVlbi5oZWlnaHRcblxuaGVhZGVyU2NyZWVuLnN0eWxlLmhlaWdodCA9IHBvc2l0aW9uSGVpZ2h0ICsgJ3B4J1xuXG5cblxuLy9vcHRpb25zIFZBTlRBXG5WQU5UQS5ORVQoe1xuICAgIGVsOiBcIi5oZWFkZXJcIixcbiAgICBtb3VzZUNvbnRyb2xzOiB0cnVlLFxuICAgIHRvdWNoQ29udHJvbHM6IHRydWUsXG4gICAgZ3lyb0NvbnRyb2xzOiBmYWxzZSxcbiAgICBtaW5IZWlnaHQ6IHBvc2l0aW9uSGVpZ2h0LFxuICAgIG1pbldpZHRoOiAyMDAuMDAsXG4gICAgc2NhbGU6IDEuMDAsXG4gICAgc2NhbGVNb2JpbGU6IDEuMCxcbiAgICBjb2xvcjogMHg2MDNmZmYsXG4gICAgYmFja2dyb3VuZENvbG9yOiAweDAsXG4gICAgc3BhY2luZzogMTQuMDAsXG5cbn0pXG5cblxuXG5cblxuXG5cbi8vcHJlYWxvZGVyIFxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JykuY2xhc3NMaXN0LmFkZChcImxvYWRlZFwiKVxufSk7XG5cblxuXG4vL1ZhbGlkYXRpb25cblxuY29uc3QgRU1BSUxfUkVHRVhQID0gL14oKFtePD4oKVtcXF0uLDs6XFxzQFwiXSsoXFwuW148PigpW1xcXS4sOzpcXHNAXCJdKykqKXwoXCIuK1wiKSlAKChbXjw+KClbXFxdLiw7Olxcc0BcIl0rXFwuKStbXjw+KClbXFxdLiw7Olxcc0BcIl17Mix9KSQvaXU7XG5cbmNvbnN0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2VtYWlsJyk7XG5cbmZ1bmN0aW9uIG9uSW5wdXQoKSB7XG4gIGlmIChpc0VtYWlsVmFsaWQoaW5wdXQudmFsdWUpKSB7XG4gICAgaW5wdXQuc3R5bGUuYm9yZGVyQ29sb3IgPSAnZ3JlZW4nO1xuICB9IGVsc2Uge1xuICAgIGlucHV0LnN0eWxlLmJvcmRlckNvbG9yID0gJ3JlZCc7XG4gIH1cbn1cblxuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBvbklucHV0KTtcblxuZnVuY3Rpb24gaXNFbWFpbFZhbGlkKHZhbHVlKSB7XG5yZXR1cm4gRU1BSUxfUkVHRVhQLnRlc3QodmFsdWUpO1xufVxuXG5cblxuY29uc3QgdmFudGFDYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmFudGEtY2FudmFzJylcbmxldCBmcmFtZUNvdW50ID0gZnVuY3Rpb24gX2ZjKGZhc3RUaW1lU3RhcnQsIHByZWNpc2VUaW1lU3RhcnQpe1xuICAgICAgICBcbiAgICBsZXQgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgXG4gICAgbGV0IGZhc3REdXJhdGlvbiA9IG5vdyAtIChmYXN0VGltZVN0YXJ0IHx8IF9mYy5zdGFydFRpbWUpO1xuICAgIGxldCBwcmVjaXNlRHVyYXRpb24gPSBub3cgLSAocHJlY2lzZVRpbWVTdGFydCB8fCBfZmMuc3RhcnRUaW1lKTtcbiAgICBcbiAgICBpZihmYXN0RHVyYXRpb24gPCAxMDApe1xuICAgICAgICBcbiAgICAgICAgX2ZjLmZhc3RDb3VudGVyKys7XG4gICAgICAgIFxuICAgIH0gZWxzZSB7XG4gICAgICAgIFxuICAgICAgICBfZmMuZmFzdEZQUyA9IF9mYy5mYXN0Q291bnRlciAqIDEwO1xuICAgICAgICBfZmMuZmFzdENvdW50ZXIgPSAwO1xuICAgICAgICBmYXN0VGltZVN0YXJ0ID0gbm93O1xuICAgICAgICBjb25zb2xlLmxvZyhfZmMuZmFzdEZQUyk7XG4gICAgfVxuICAgIFxuICAgIGlmKHByZWNpc2VEdXJhdGlvbiA8IDEwMDApe1xuICAgICAgICBcbiAgICAgICAgX2ZjLnByZWNpc2VDb3VudGVyKys7XG4gICAgICAgIFxuICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgX2ZjLnByZWNpc2VGUFMgPSBfZmMucHJlY2lzZUNvdW50ZXI7XG4gICAgICAgIF9mYy5wcmVjaXNlQ291bnRlciA9IDA7XG4gICAgICAgIHByZWNpc2VUaW1lU3RhcnQgPSBub3c7IFxuICAgICAgICBjb25zb2xlLmxvZyhfZmMucHJlY2lzZUZQUyk7XG5cbiAgICAgICAgXG5cbiAgICAgICAgaWYgKF9mYy5wcmVjaXNlRlBTIDw9ICczMCcpe1xuICAgICAgICAgICAgdmFudGFDYW52YXMuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdmFudGFDYW52YXMuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIlxuICAgICAgICB9XG4gICAgfVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBmcmFtZUNvdW50KGZhc3RUaW1lU3RhcnQsIHByZWNpc2VUaW1lU3RhcnQpKTsgXG59XG5cbmZyYW1lQ291bnQuZmFzdENvdW50ZXIgPSAwO1xuZnJhbWVDb3VudC5mYXN0RlBTID0gMDtcbmZyYW1lQ291bnQucHJlY2lzZUNvdW50ZXIgPSAwO1xuZnJhbWVDb3VudC5wcmVjaXNlRlBTID0gMDtcbmZyYW1lQ291bnQuc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbmZyYW1lQ291bnQoKSBcbiIsImZ1bmN0aW9uIGJkQ2FudmFzKCkge1xyXG5cclxuICAgIG9wdHMgPSB7XHJcbiAgICAgICAgbWluUmFkaXVzOiAwLjUsXHJcbiAgICAgICAgbWF4UmFkaXVzOiAxLjQsXHJcbiAgICAgICAgY29sb3JzOiBbXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNylcIiwgXCJyZ2JhKDI1MiwgMjQ0LCAyMDEsIDAuNylcIiwgXCJyZ2JhKDIwMSwgMjUyLCAyMDEsIDAuNylcIiwgXCJyZ2JhKDIwMSwgMjM2LCAyNTIsIDAuNylcIiwgXCJyZ2JhKDIyOSwgMjAxLCAyNTIsIDAuNylcIiwgXCJyZ2JhKDI1MiwgMjAxLCAyMDEsIDAuNylcIiwgXCJyZ2JhKDI1MiwgMjAxLCAyNDEsIDAuNylcIiwgXCJyZ2JhKDI1MiwgMjAxLCAyMDEsIDAuNylcIl0sXHJcbiAgICAgICAgZGVsYXk6IDEwMCxcclxuICAgICAgICBzdGVwOiAwLjFcclxuICAgIH1cclxuICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbaWQ9XCJiZENhbnZhc1wiXScpO1xyXG4gICAgY29uc3QgaGVhZGVyU2NyZWVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpXHJcbiAgICBsZXQgcG9zaXRpb25IZWlnaHQgPSB3aW5kb3cuc2NyZWVuLmhlaWdodFxyXG4gICAgY29uc29sZS5sb2cocG9zaXRpb25IZWlnaHQpXHJcblxyXG4gICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IHBvc2l0aW9uSGVpZ2h0ICsgJ3B4J1xyXG5cclxuXHJcblxyXG4gICAgcmVzaXplQ2FudmFzKCk7XHJcbiAgICBmdW5jdGlvbiByZXNpemVDYW52YXMoKSB7XHJcbiAgICAgICAgdyA9IGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgICAgIGggPSBjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aW5kb3dSZXNpemUoKTtcclxuICAgIH0pXHJcblxyXG4gICAgbGV0IGNoZWNrO1xyXG5cclxuICAgIGZ1bmN0aW9uIHdpbmRvd1Jlc2l6ZSgpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQoY2hlY2spO1xyXG4gICAgICAgIGFyclN0YXJzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgY2hlY2sgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChhbmltYXRpb25zKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJlc2l6ZUNhbnZhcygpO1xyXG4gICAgICAgICAgICBzZXR1cCgpO1xyXG5cclxuICAgICAgICB9LCAxMDApXHJcbiAgICB9XHJcbiBcclxuICAgIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuICAgIFN0YXJzID0gZnVuY3Rpb24gKHcsIGgpIHtcclxuICAgICAgICB0aGlzLnggPSBNYXRoLnJhbmRvbSgpICogdztcclxuICAgICAgICB0aGlzLnkgPSBNYXRoLnJhbmRvbSgpICogaDtcclxuICAgICAgICB0aGlzLnJhZGl1cyA9IG9wdHMubWluUmFkaXVzICsgTWF0aC5yYW5kb20oKSAqIChvcHRzLm1heFJhZGl1cyAtIG9wdHMubWluUmFkaXVzKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gb3B0cy5jb2xvcnNbW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIG9wdHMuY29sb3JzLmxlbmd0aCldXTtcclxuICAgICAgICB0aGlzLnZlY3RvciA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSkgfHwgLTE7XHJcblxyXG4gICAgICAgIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcclxuICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2soKTtcclxuICAgICAgICAgICAgdGhpcy5yYWRpdXMgKz0gb3B0cy5zdGVwICogdGhpcy52ZWN0b3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNoZWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yYWRpdXMgPiBvcHRzLm1heFJhZGl1cyB8fCB0aGlzLnJhZGl1cyA8IG9wdHMubWluUmFkaXVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlY3RvciAqPSAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXR1cCgpIHtcclxuICAgICAgICBhcnJTdGFycyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8ICh3IC8gNDApICogKGggLyA0MCk7IGkrKykge1xyXG4gICAgICAgICAgICBhcnJTdGFycy5wdXNoKG5ldyBTdGFycyh3LCBoKSk7XHJcbiAgICAgICAgICAgIGFyclN0YXJzW2ldLmRyYXcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICBcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXAoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsb29wKCkge1xyXG4gICAgICAgIGFuaW1hdGlvbnMgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdywgaCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyU3RhcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGFyclN0YXJzW2ldLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgYXJyU3RhcnNbaV0uZHJhdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgb3B0cy5kZWxheSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxufTsgd2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGJkQ2FudmFzKCk7XHJcbn07XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyDQrdGC0L4gLSDQstCw0YjQsCDRgtC+0YfQutCwINCy0YXQvtC00LAg0LTQu9GPINGB0LrRgNC40L/RgtC+0LIg0YHRgtGA0LDQvdC40YbRiy4g0JjQvNC/0L7RgNGC0LjRgNGD0LnRgtC1INGB0Y7QtNCwINC90YPQttC90YvQtSDQstCw0Lwg0YTQsNC50LvRiy5cblxuaW1wb3J0ICcuL3NjcmlwdCc7XG5pbXBvcnQgJy4vc3RhcnMnO1xuaW1wb3J0ICcuL2ZpbHRlcic7XG4iXSwibmFtZXMiOlsiZmlsdGVyQnRucyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImZsaXRlckl0ZW0iLCJmaWx0ZXJXcmFwIiwicXVlcnlTZWxlY3RvciIsImZpbHRlciIsImZvckVhY2giLCJpdGVtQnRuIiwiYWRkRXZlbnRMaXN0ZW5lciIsImVsZW1lbnQiLCJzdHlsZSIsIm9wYWNpdHkiLCJwb2ludGVyRXZlbnRzIiwicG9zaXRpb24iLCJ0YXJnZXRJZCIsImdldEF0dHJpYnV0ZSIsInRhcmdldEl0ZW0iLCJqdXN0aWZ5Q29udGVudCIsIml0ZW0iLCJtZW51QnRuIiwiaGVhZGVyTmF2IiwibGlua0l0ZW0iLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJhZGQiLCJoZWFkZXJCdG4iLCJza2lsbHNTZWN0aW9uIiwic2Nyb2xsSW50b1ZpZXciLCJibG9jayIsImJlaGF2aW9yIiwibGlua01lbnUiLCJlIiwicHJldmVudERlZmF1bHQiLCJsaW5rRGF0YSIsInN1YnN0cmluZyIsImNvbnNvbGUiLCJsb2ciLCJoZWFkZXJTY3JlZW4iLCJwb3NpdGlvbkhlaWdodCIsIndpbmRvdyIsInNjcmVlbiIsImhlaWdodCIsIlZBTlRBIiwiTkVUIiwiZWwiLCJtb3VzZUNvbnRyb2xzIiwidG91Y2hDb250cm9scyIsImd5cm9Db250cm9scyIsIm1pbkhlaWdodCIsIm1pbldpZHRoIiwic2NhbGUiLCJzY2FsZU1vYmlsZSIsImNvbG9yIiwiYmFja2dyb3VuZENvbG9yIiwic3BhY2luZyIsIkVNQUlMX1JFR0VYUCIsImlucHV0Iiwib25JbnB1dCIsImlzRW1haWxWYWxpZCIsInZhbHVlIiwiYm9yZGVyQ29sb3IiLCJ0ZXN0IiwidmFudGFDYW52YXMiLCJmcmFtZUNvdW50IiwiX2ZjIiwiZmFzdFRpbWVTdGFydCIsInByZWNpc2VUaW1lU3RhcnQiLCJub3ciLCJwZXJmb3JtYW5jZSIsImZhc3REdXJhdGlvbiIsInN0YXJ0VGltZSIsInByZWNpc2VEdXJhdGlvbiIsImZhc3RDb3VudGVyIiwiZmFzdEZQUyIsInByZWNpc2VDb3VudGVyIiwicHJlY2lzZUZQUyIsImRpc3BsYXkiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJiZENhbnZhcyIsIm9wdHMiLCJtaW5SYWRpdXMiLCJtYXhSYWRpdXMiLCJjb2xvcnMiLCJkZWxheSIsInN0ZXAiLCJjYW52YXMiLCJyZXNpemVDYW52YXMiLCJ3Iiwid2lkdGgiLCJpbm5lcldpZHRoIiwiaCIsImlubmVySGVpZ2h0Iiwid2luZG93UmVzaXplIiwiY2hlY2siLCJjbGVhclRpbWVvdXQiLCJhcnJTdGFycyIsImxlbmd0aCIsInNldFRpbWVvdXQiLCJjbGVhckludGVydmFsIiwiYW5pbWF0aW9ucyIsInNldHVwIiwiY3R4IiwiZ2V0Q29udGV4dCIsIlN0YXJzIiwieCIsIk1hdGgiLCJyYW5kb20iLCJ5IiwicmFkaXVzIiwicm91bmQiLCJ2ZWN0b3IiLCJkcmF3IiwiYmVnaW5QYXRoIiwiYXJjIiwiUEkiLCJmaWxsU3R5bGUiLCJmaWxsIiwiY2xvc2VQYXRoIiwidXBkYXRlIiwiaSIsInB1c2giLCJsb29wIiwic2V0SW50ZXJ2YWwiLCJjbGVhclJlY3QiLCJvbmxvYWQiXSwic291cmNlUm9vdCI6IiJ9