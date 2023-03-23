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
          element.style.transform = "translateX(0%)";
          filterWrap.style.justifyContent = 'space-around';
        });
      } else {
        targetItem.forEach(item => {
          item.style.opacity = "1";
          item.style.pointerEvents = "all";
          item.style.position = "relative";
          item.style.transform = "translateX(0%)";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0VBQy9CO0VBRUF0QixLQUFLLEVBQUU7RUFFUCxTQUFTc0IsSUFBSUEsQ0FBQSxFQUFHO0lBQ1p2QixVQUFVLEdBQUd3QixXQUFXLENBQUMsWUFBWTtNQUNqQ3RCLEdBQUcsQ0FBQ3VCLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFcEMsQ0FBQyxFQUFFRSxDQUFDLENBQUM7TUFDekIsS0FBSyxJQUFJNkIsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHeEIsUUFBUSxDQUFDQyxNQUFNLEVBQUV1QixDQUFDLEVBQUUsRUFBRTtRQUN0Q3hCLFFBQVEsQ0FBQ3dCLENBQUMsQ0FBQyxDQUFDRCxNQUFNLEVBQUU7UUFDcEJ2QixRQUFRLENBQUN3QixDQUFDLENBQUMsQ0FBQ1IsSUFBSSxFQUFFO01BQ3RCO0lBQ0osQ0FBQyxFQUFFL0IsSUFBSSxDQUFDSSxLQUFLLENBQUM7RUFDbEI7QUFNSjtBQUFDO0FBQUVqRCxNQUFNLENBQUMwRixNQUFNLEdBQUcsWUFBWTtFQUMzQjlDLFFBQVEsRUFBRTtBQUNkLENBQUM7Ozs7OztVQ3BHRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7Ozs7Ozs7Ozs7OztBQ0FBOztBQUVrQjtBQUNEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY3JlYXRlLWh0bWwtYm9pbGVycGxhdGUvLi9zb3VyY2UvanMvZmlsdGVyLmpzIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlLy4vc291cmNlL2pzL3NjcmlwdC5qcyIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS8uL3NvdXJjZS9qcy9zdGFycy5qcyIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY3JlYXRlLWh0bWwtYm9pbGVycGxhdGUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS8uL3NvdXJjZS9qcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBmaWx0ZXJCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBvcnRmb2xpb19fYnRuJylcbmNvbnN0IGZsaXRlckl0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucG9ydGZvbGlvX19maWx0ZXItaXRlbScpXG5jb25zdCBmaWx0ZXJXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvcnRmb2xpb19fZmlsdGVyLWlubmVyJylcbmZ1bmN0aW9uIGZpbHRlcigpIHtcbiAgICBmaWx0ZXJCdG5zLmZvckVhY2goaXRlbUJ0biA9PiB7XG4gICAgICAgIGl0ZW1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBmbGl0ZXJJdGVtLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gXCIwXCJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIlxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlWCgtMzAwJSlcIlxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGxldCB0YXJnZXRJZCA9IGl0ZW1CdG4uZ2V0QXR0cmlidXRlKCdkYXRhLWlkJylcbiAgICAgICAgICAgIGxldCB0YXJnZXRJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7dGFyZ2V0SWR9YClcbiAgICAgICAgICAgIGlmICh0YXJnZXRJZCA9PSAnYWxsJykge1xuICAgICAgICAgICAgICAgIGZsaXRlckl0ZW0uZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gXCIxXCJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhbGxcIlxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGVYKDAlKVwiXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcldyYXAuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnc3BhY2UtYXJvdW5kJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldEl0ZW0uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5vcGFjaXR5ID0gXCIxXCJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhbGxcIlxuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGVYKDAlKVwiXG4gICAgICAgICAgICAgICAgICAgIGlmKHdpbmRvdy5zY3JlZW4ud2lkdGggPD0gMTIwMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJXcmFwLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ3NwYWNlLWFyb3VuZCdcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJXcmFwLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ2ZsZXgtc3RhcnQnICBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0pXG59XG5maWx0ZXIoKSIsIi8vdGFyZ2V0IG1lbnUgbGlzdFxuY29uc3QgbWVudUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZW51X19idG4nKTtcbmNvbnN0IGhlYWRlck5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdicpO1xuY29uc3QgbGlua0l0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19tZW51LWl0ZW0nKTtcblxuXG5tZW51QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChoZWFkZXJOYXYgPT09IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi0tYWN0aXZlJykpIHtcbiAgICAgICAgaGVhZGVyTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlcl9fbmF2LS1hY3RpdmUnKVxuICAgICAgICBtZW51QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ21lbnVfX2J0bi0tYWN0aXZlJylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGhlYWRlck5hdi5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX25hdi0tYWN0aXZlJylcbiAgICAgICAgbWVudUJ0bi5jbGFzc0xpc3QuYWRkKCdtZW51X19idG4tLWFjdGl2ZScpXG4gICAgfVxufSlcblxuXG5cblxuXG5cbi8vc2Nyb2xsIHRvIHNraWxsc1xuY29uc3QgaGVhZGVyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fYnRuLWJvdHRvbScpO1xuY29uc3Qgc2tpbGxzU2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5za2lsbHMnKTtcblxuXG5oZWFkZXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgc2tpbGxzU2VjdGlvbi5zY3JvbGxJbnRvVmlldyh7XG4gICAgICAgIGJsb2NrOiAnbmVhcmVzdCcsIC8vINC6INCx0LvQuNC20LDQudGI0LXQuSDQs9GA0LDQvdC40YbQtSDRjdC60YDQsNC90LBcbiAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnLFxuXG4gICAgfSk7XG59KTtcblxuY29uc3QgbGlua01lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19tZW51LWxpbmsnKTtcblxubGlua01lbnUuZm9yRWFjaChpdGVtID0+IHtcblxuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBsaW5rRGF0YSA9IGl0ZW0uZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAgIGNvbnNvbGUubG9nKGxpbmtEYXRhKVxuICAgICAgICBsZXQgYmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuJHtsaW5rRGF0YX1gKVxuXG4gICAgICAgIGJsb2NrLnNjcm9sbEludG9WaWV3KHtcbiAgICAgICAgICAgIGJsb2NrOiAnbmVhcmVzdCcsIC8vINC6INCx0LvQuNC20LDQudGI0LXQuSDQs9GA0LDQvdC40YbQtSDRjdC60YDQsNC90LBcbiAgICAgICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJyxcbiAgICAgICAgfSk7XG5cbiAgICB9KVxuXG5cbn0pXG5cblxuXG4vL2ZpeCBoZWlnaHQgVkFOVEFcbmNvbnN0IGhlYWRlclNjcmVlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKVxubGV0IHBvc2l0aW9uSGVpZ2h0ID0gd2luZG93LnNjcmVlbi5oZWlnaHRcblxuaGVhZGVyU2NyZWVuLnN0eWxlLmhlaWdodCA9IHBvc2l0aW9uSGVpZ2h0ICsgJ3B4J1xuXG5cblxuLy9vcHRpb25zIFZBTlRBXG5WQU5UQS5ORVQoe1xuICAgIGVsOiBcIi5oZWFkZXJcIixcbiAgICBtb3VzZUNvbnRyb2xzOiB0cnVlLFxuICAgIHRvdWNoQ29udHJvbHM6IHRydWUsXG4gICAgZ3lyb0NvbnRyb2xzOiBmYWxzZSxcbiAgICBtaW5IZWlnaHQ6IHBvc2l0aW9uSGVpZ2h0LFxuICAgIG1pbldpZHRoOiAyMDAuMDAsXG4gICAgc2NhbGU6IDEuMDAsXG4gICAgc2NhbGVNb2JpbGU6IDEuMCxcbiAgICBjb2xvcjogMHg2MDNmZmYsXG4gICAgYmFja2dyb3VuZENvbG9yOiAweDAsXG4gICAgc3BhY2luZzogMTQuMDAsXG5cbn0pXG5cblxuXG5cblxuXG5cbi8vcHJlYWxvZGVyIFxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JykuY2xhc3NMaXN0LmFkZChcImxvYWRlZFwiKVxufSk7XG5cblxuXG4vL1ZhbGlkYXRpb25cblxuY29uc3QgRU1BSUxfUkVHRVhQID0gL14oKFtePD4oKVtcXF0uLDs6XFxzQFwiXSsoXFwuW148PigpW1xcXS4sOzpcXHNAXCJdKykqKXwoXCIuK1wiKSlAKChbXjw+KClbXFxdLiw7Olxcc0BcIl0rXFwuKStbXjw+KClbXFxdLiw7Olxcc0BcIl17Mix9KSQvaXU7XG5cbmNvbnN0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2VtYWlsJyk7XG5cbmZ1bmN0aW9uIG9uSW5wdXQoKSB7XG4gIGlmIChpc0VtYWlsVmFsaWQoaW5wdXQudmFsdWUpKSB7XG4gICAgaW5wdXQuc3R5bGUuYm9yZGVyQ29sb3IgPSAnZ3JlZW4nO1xuICB9IGVsc2Uge1xuICAgIGlucHV0LnN0eWxlLmJvcmRlckNvbG9yID0gJ3JlZCc7XG4gIH1cbn1cblxuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBvbklucHV0KTtcblxuZnVuY3Rpb24gaXNFbWFpbFZhbGlkKHZhbHVlKSB7XG5yZXR1cm4gRU1BSUxfUkVHRVhQLnRlc3QodmFsdWUpO1xufVxuXG5cblxuIiwiZnVuY3Rpb24gYmRDYW52YXMoKSB7XG5cbiAgICBvcHRzID0ge1xuICAgICAgICBtaW5SYWRpdXM6IDAuNSxcbiAgICAgICAgbWF4UmFkaXVzOiAxLjQsXG4gICAgICAgIGNvbG9yczogW1wicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjcpXCIsIFwicmdiYSgyNTIsIDI0NCwgMjAxLCAwLjcpXCIsIFwicmdiYSgyMDEsIDI1MiwgMjAxLCAwLjcpXCIsIFwicmdiYSgyMDEsIDIzNiwgMjUyLCAwLjcpXCIsIFwicmdiYSgyMjksIDIwMSwgMjUyLCAwLjcpXCIsIFwicmdiYSgyNTIsIDIwMSwgMjAxLCAwLjcpXCIsIFwicmdiYSgyNTIsIDIwMSwgMjQxLCAwLjcpXCIsIFwicmdiYSgyNTIsIDIwMSwgMjAxLCAwLjcpXCJdLFxuICAgICAgICBkZWxheTogMTAwLFxuICAgICAgICBzdGVwOiAwLjFcbiAgICB9XG4gICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tpZD1cImJkQ2FudmFzXCJdJyk7XG4gICAgY29uc3QgaGVhZGVyU2NyZWVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpXG4gICAgbGV0IHBvc2l0aW9uSGVpZ2h0ID0gd2luZG93LnNjcmVlbi5oZWlnaHRcbiAgICBjb25zb2xlLmxvZyhwb3NpdGlvbkhlaWdodClcblxuICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBwb3NpdGlvbkhlaWdodCArICdweCdcblxuXG5cbiAgICByZXNpemVDYW52YXMoKTtcbiAgICBmdW5jdGlvbiByZXNpemVDYW52YXMoKSB7XG4gICAgICAgIHcgPSBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgaCA9IGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgfVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3dSZXNpemUoKTtcbiAgICB9KVxuXG4gICAgbGV0IGNoZWNrO1xuXG4gICAgZnVuY3Rpb24gd2luZG93UmVzaXplKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoY2hlY2spO1xuICAgICAgICBhcnJTdGFycy5sZW5ndGggPSAwO1xuICAgICAgICBjaGVjayA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChhbmltYXRpb25zKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVzaXplQ2FudmFzKCk7XG4gICAgICAgICAgICBzZXR1cCgpO1xuXG4gICAgICAgIH0sIDEwMClcbiAgICB9XG4gXG4gICAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICBTdGFycyA9IGZ1bmN0aW9uICh3LCBoKSB7XG4gICAgICAgIHRoaXMueCA9IE1hdGgucmFuZG9tKCkgKiB3O1xuICAgICAgICB0aGlzLnkgPSBNYXRoLnJhbmRvbSgpICogaDtcbiAgICAgICAgdGhpcy5yYWRpdXMgPSBvcHRzLm1pblJhZGl1cyArIE1hdGgucmFuZG9tKCkgKiAob3B0cy5tYXhSYWRpdXMgLSBvcHRzLm1pblJhZGl1cyk7XG4gICAgICAgIHRoaXMuY29sb3IgPSBvcHRzLmNvbG9yc1tbTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogb3B0cy5jb2xvcnMubGVuZ3RoKV1dO1xuICAgICAgICB0aGlzLnZlY3RvciA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSkgfHwgLTE7XG5cbiAgICAgICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIE1hdGguUEkgKiAyKTtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jaGVjaygpO1xuICAgICAgICAgICAgdGhpcy5yYWRpdXMgKz0gb3B0cy5zdGVwICogdGhpcy52ZWN0b3I7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNoZWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucmFkaXVzID4gb3B0cy5tYXhSYWRpdXMgfHwgdGhpcy5yYWRpdXMgPCBvcHRzLm1pblJhZGl1cykge1xuICAgICAgICAgICAgICAgIHRoaXMudmVjdG9yICo9IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgICAgIGFyclN0YXJzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAodyAvIDQwKSAqIChoIC8gNDApOyBpKyspIHtcbiAgICAgICAgICAgIGFyclN0YXJzLnB1c2gobmV3IFN0YXJzKHcsIGgpKTtcbiAgICAgICAgICAgIGFyclN0YXJzW2ldLmRyYXcoKTtcbiAgICAgICAgfVxuICAgICAgIFxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgfVxuXG4gICAgc2V0dXAoKTtcblxuICAgIGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgIGFuaW1hdGlvbnMgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHcsIGgpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJTdGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGFyclN0YXJzW2ldLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIGFyclN0YXJzW2ldLmRyYXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgb3B0cy5kZWxheSk7XG4gICAgfVxuXG5cblxuXG5cbn07IHdpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgYmRDYW52YXMoKTtcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8g0K3RgtC+IC0g0LLQsNGI0LAg0YLQvtGH0LrQsCDQstGF0L7QtNCwINC00LvRjyDRgdC60YDQuNC/0YLQvtCyINGB0YLRgNCw0L3QuNGG0YsuINCY0LzQv9C+0YDRgtC40YDRg9C50YLQtSDRgdGO0LTQsCDQvdGD0LbQvdGL0LUg0LLQsNC8INGE0LDQudC70YsuXG5cbmltcG9ydCAnLi9zY3JpcHQnO1xuaW1wb3J0ICcuL3N0YXJzJztcbmltcG9ydCAnLi9maWx0ZXInO1xuIl0sIm5hbWVzIjpbImZpbHRlckJ0bnMiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmbGl0ZXJJdGVtIiwiZmlsdGVyV3JhcCIsInF1ZXJ5U2VsZWN0b3IiLCJmaWx0ZXIiLCJmb3JFYWNoIiwiaXRlbUJ0biIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbGVtZW50Iiwic3R5bGUiLCJvcGFjaXR5IiwicG9pbnRlckV2ZW50cyIsInBvc2l0aW9uIiwidHJhbnNmb3JtIiwidGFyZ2V0SWQiLCJnZXRBdHRyaWJ1dGUiLCJ0YXJnZXRJdGVtIiwianVzdGlmeUNvbnRlbnQiLCJpdGVtIiwid2luZG93Iiwic2NyZWVuIiwid2lkdGgiLCJtZW51QnRuIiwiaGVhZGVyTmF2IiwibGlua0l0ZW0iLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJhZGQiLCJoZWFkZXJCdG4iLCJza2lsbHNTZWN0aW9uIiwic2Nyb2xsSW50b1ZpZXciLCJibG9jayIsImJlaGF2aW9yIiwibGlua01lbnUiLCJlIiwicHJldmVudERlZmF1bHQiLCJsaW5rRGF0YSIsInN1YnN0cmluZyIsImNvbnNvbGUiLCJsb2ciLCJoZWFkZXJTY3JlZW4iLCJwb3NpdGlvbkhlaWdodCIsImhlaWdodCIsIlZBTlRBIiwiTkVUIiwiZWwiLCJtb3VzZUNvbnRyb2xzIiwidG91Y2hDb250cm9scyIsImd5cm9Db250cm9scyIsIm1pbkhlaWdodCIsIm1pbldpZHRoIiwic2NhbGUiLCJzY2FsZU1vYmlsZSIsImNvbG9yIiwiYmFja2dyb3VuZENvbG9yIiwic3BhY2luZyIsIkVNQUlMX1JFR0VYUCIsImlucHV0Iiwib25JbnB1dCIsImlzRW1haWxWYWxpZCIsInZhbHVlIiwiYm9yZGVyQ29sb3IiLCJ0ZXN0IiwiYmRDYW52YXMiLCJvcHRzIiwibWluUmFkaXVzIiwibWF4UmFkaXVzIiwiY29sb3JzIiwiZGVsYXkiLCJzdGVwIiwiY2FudmFzIiwicmVzaXplQ2FudmFzIiwidyIsImlubmVyV2lkdGgiLCJoIiwiaW5uZXJIZWlnaHQiLCJ3aW5kb3dSZXNpemUiLCJjaGVjayIsImNsZWFyVGltZW91dCIsImFyclN0YXJzIiwibGVuZ3RoIiwic2V0VGltZW91dCIsImNsZWFySW50ZXJ2YWwiLCJhbmltYXRpb25zIiwic2V0dXAiLCJjdHgiLCJnZXRDb250ZXh0IiwiU3RhcnMiLCJ4IiwiTWF0aCIsInJhbmRvbSIsInkiLCJyYWRpdXMiLCJyb3VuZCIsInZlY3RvciIsImRyYXciLCJiZWdpblBhdGgiLCJhcmMiLCJQSSIsImZpbGxTdHlsZSIsImZpbGwiLCJjbG9zZVBhdGgiLCJ1cGRhdGUiLCJpIiwicHVzaCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImxvb3AiLCJzZXRJbnRlcnZhbCIsImNsZWFyUmVjdCIsIm9ubG9hZCJdLCJzb3VyY2VSb290IjoiIn0=