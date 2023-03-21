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
function resizeHeader() {
  let positionWidth = headerScreen.clientWidth;
  console.log(positionWidth);
  if (positionWidth <= "480") {
    const canvasVanta = document.querySelector('.vanta-canvas');
    canvasVanta.style.display = "none";
  }
  if (positionWidth >= "480") {
    const canvasVanta = document.querySelector('.vanta-canvas');
    canvasVanta.style.display = "block";
  }
}
window.addEventListener("resize", function () {
  resizeHeader();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsQ0FBQ1IsSUFBSSxFQUFFO0lBQ3RCO0lBQ0FVLElBQUksRUFBRTtFQUNWO0VBRUFyQixLQUFLLEVBQUU7RUFFUCxTQUFTcUIsSUFBSUEsQ0FBQSxFQUFHO0lBQ1p0QixVQUFVLEdBQUd1QixXQUFXLENBQUMsWUFBWTtNQUNqQ3JCLEdBQUcsQ0FBQ3NCLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFcEMsQ0FBQyxFQUFFRyxDQUFDLENBQUM7TUFDekIsS0FBSyxJQUFJNkIsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHeEIsUUFBUSxDQUFDQyxNQUFNLEVBQUV1QixDQUFDLEVBQUUsRUFBRTtRQUN0Q3hCLFFBQVEsQ0FBQ3dCLENBQUMsQ0FBQyxDQUFDRCxNQUFNLEVBQUU7UUFDcEJ2QixRQUFRLENBQUN3QixDQUFDLENBQUMsQ0FBQ1IsSUFBSSxFQUFFO01BQ3RCO0lBQ0osQ0FBQyxFQUFFaEMsSUFBSSxDQUFDSSxLQUFLLENBQUM7RUFDbEI7QUFNSjtBQUFDO0FBQUUzQixNQUFNLENBQUNvRSxNQUFNLEdBQUcsWUFBWTtFQUMzQjlDLFFBQVEsRUFBRTtBQUNkLENBQUM7Ozs7OztVQzdGRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7Ozs7Ozs7Ozs7QUNBQTs7QUFFa0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jcmVhdGUtaHRtbC1ib2lsZXJwbGF0ZS8uL3NvdXJjZS9qcy9zY3JpcHQuanMiLCJ3ZWJwYWNrOi8vY3JlYXRlLWh0bWwtYm9pbGVycGxhdGUvLi9zb3VyY2UvanMvc3RhcnMuanMiLCJ3ZWJwYWNrOi8vY3JlYXRlLWh0bWwtYm9pbGVycGxhdGUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY3JlYXRlLWh0bWwtYm9pbGVycGxhdGUvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vY3JlYXRlLWh0bWwtYm9pbGVycGxhdGUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NyZWF0ZS1odG1sLWJvaWxlcnBsYXRlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY3JlYXRlLWh0bWwtYm9pbGVycGxhdGUvLi9zb3VyY2UvanMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy90YXJnZXQgbWVudSBsaXN0XG5jb25zdCBtZW51QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnVfX2J0bicpO1xuY29uc3QgaGVhZGVyTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2Jyk7XG5jb25zdCBsaW5rSXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX21lbnUtaXRlbScpO1xuXG5cbm1lbnVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgaWYgKGhlYWRlck5hdiA9PT0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2LS1hY3RpdmUnKSkge1xuICAgICAgICBoZWFkZXJOYXYuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZGVyX19uYXYtLWFjdGl2ZScpXG4gICAgICAgIG1lbnVCdG4uY2xhc3NMaXN0LnJlbW92ZSgnbWVudV9fYnRuLS1hY3RpdmUnKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaGVhZGVyTmF2LmNsYXNzTGlzdC5hZGQoJ2hlYWRlcl9fbmF2LS1hY3RpdmUnKVxuICAgICAgICBtZW51QnRuLmNsYXNzTGlzdC5hZGQoJ21lbnVfX2J0bi0tYWN0aXZlJylcbiAgICB9XG59KVxuXG5cblxuXG5cblxuLy9zY3JvbGwgdG8gc2tpbGxzXG5jb25zdCBoZWFkZXJCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19idG4tYm90dG9tJyk7XG5jb25zdCBza2lsbHNTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNraWxscycpO1xuXG5cbmhlYWRlckJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBza2lsbHNTZWN0aW9uLnNjcm9sbEludG9WaWV3KHtcbiAgICAgICAgYmxvY2s6ICduZWFyZXN0JywgLy8g0Log0LHQu9C40LbQsNC50YjQtdC5INCz0YDQsNC90LjRhtC1INGN0LrRgNCw0L3QsFxuICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCcsXG5cbiAgICB9KTtcbn0pO1xuXG5jb25zdCBsaW5rTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX21lbnUtbGluaycpO1xuXG5saW5rTWVudS5mb3JFYWNoKGl0ZW0gPT4ge1xuXG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGxpbmtEYXRhID0gaXRlbS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zdWJzdHJpbmcoMSlcbiAgICAgICAgY29uc29sZS5sb2cobGlua0RhdGEpXG4gICAgICAgIGxldCBibG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC4ke2xpbmtEYXRhfWApXG5cbiAgICAgICAgYmxvY2suc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgICAgICAgYmxvY2s6ICduZWFyZXN0JywgLy8g0Log0LHQu9C40LbQsNC50YjQtdC5INCz0YDQsNC90LjRhtC1INGN0LrRgNCw0L3QsFxuICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnLFxuICAgICAgICB9KTtcblxuICAgIH0pXG5cblxufSlcblxuXG5cbi8vZml4IGhlaWdodCBWQU5UQVxuY29uc3QgaGVhZGVyU2NyZWVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpXG5sZXQgcG9zaXRpb25IZWlnaHQgPSB3aW5kb3cuc2NyZWVuLmhlaWdodFxuXG5oZWFkZXJTY3JlZW4uc3R5bGUuaGVpZ2h0ID0gcG9zaXRpb25IZWlnaHQgKyAncHgnXG5cblxuXG4vL29wdGlvbnMgVkFOVEFcblZBTlRBLk5FVCh7XG4gICAgZWw6IFwiLmhlYWRlclwiLFxuICAgIG1vdXNlQ29udHJvbHM6IHRydWUsXG4gICAgdG91Y2hDb250cm9sczogdHJ1ZSxcbiAgICBneXJvQ29udHJvbHM6IGZhbHNlLFxuICAgIG1pbkhlaWdodDogcG9zaXRpb25IZWlnaHQsXG4gICAgbWluV2lkdGg6IDIwMC4wMCxcbiAgICBzY2FsZTogMS4wMCxcbiAgICBzY2FsZU1vYmlsZTogMS4wLFxuICAgIGNvbG9yOiAweDYwM2ZmZixcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IDB4MCxcbiAgICBzcGFjaW5nOiAxNC4wMCxcbiAgICBcbn0pXG5cblxuXG5mdW5jdGlvbiByZXNpemVIZWFkZXIoKSB7XG4gICAgbGV0IHBvc2l0aW9uV2lkdGggPSBoZWFkZXJTY3JlZW4uY2xpZW50V2lkdGhcbiAgICBjb25zb2xlLmxvZyhwb3NpdGlvbldpZHRoKVxuICAgIGlmIChwb3NpdGlvbldpZHRoIDw9IFwiNDgwXCIpIHtcbiAgICAgICAgY29uc3QgY2FudmFzVmFudGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmFudGEtY2FudmFzJylcbiAgICAgICAgY2FudmFzVmFudGEuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG4gICAgfVxuICAgIGlmIChwb3NpdGlvbldpZHRoID49IFwiNDgwXCIpIHtcbiAgICAgICAgY29uc3QgY2FudmFzVmFudGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmFudGEtY2FudmFzJylcbiAgICAgICAgY2FudmFzVmFudGEuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIlxuICAgIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgZnVuY3Rpb24gKCkge1xuICAgIHJlc2l6ZUhlYWRlcigpXG59KVxuIiwiZnVuY3Rpb24gYmRDYW52YXMoKSB7XHJcblxyXG4gICAgb3B0cyA9IHtcclxuICAgICAgICBtaW5SYWRpdXM6IDAuNSxcclxuICAgICAgICBtYXhSYWRpdXM6IDEuNCxcclxuICAgICAgICBjb2xvcnM6IFtcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC43KVwiLCBcInJnYmEoMjUyLCAyNDQsIDIwMSwgMC43KVwiLCBcInJnYmEoMjAxLCAyNTIsIDIwMSwgMC43KVwiLCBcInJnYmEoMjAxLCAyMzYsIDI1MiwgMC43KVwiLCBcInJnYmEoMjI5LCAyMDEsIDI1MiwgMC43KVwiLCBcInJnYmEoMjUyLCAyMDEsIDIwMSwgMC43KVwiLCBcInJnYmEoMjUyLCAyMDEsIDI0MSwgMC43KVwiLCBcInJnYmEoMjUyLCAyMDEsIDIwMSwgMC43KVwiXSxcclxuICAgICAgICBkZWxheTogOTAsXHJcbiAgICAgICAgc3RlcDogMC4xXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYmRDYW52YXNcIik7XHJcblxyXG4gICAgcmVzaXplQ2FudmFzKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gcmVzaXplQ2FudmFzKCkge1xyXG4gICAgICAgIHcgPSBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICBoID0gY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2luZG93UmVzaXplKCk7XHJcbiAgICB9KVxyXG5cclxuICAgIGxldCBjaGVjaztcclxuXHJcbiAgICBmdW5jdGlvbiB3aW5kb3dSZXNpemUoKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KGNoZWNrKTtcclxuICAgICAgICBhcnJTdGFycy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGNoZWNrID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoYW5pbWF0aW9ucyk7XHJcbiAgICAgICAgICAgIHJlc2l6ZUNhbnZhcygpO1xyXG4gICAgICAgICAgICBzZXR1cCgpO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgIH0sIDEwMClcclxuICAgIH1cclxuXHJcbiAgICBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbiAgICBTdGFycyA9IGZ1bmN0aW9uICh3LCBoKSB7XHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5yYW5kb20oKSAqIHc7XHJcbiAgICAgICAgdGhpcy55ID0gTWF0aC5yYW5kb20oKSAqIGg7XHJcbiAgICAgICAgdGhpcy5yYWRpdXMgPSBvcHRzLm1pblJhZGl1cyArIE1hdGgucmFuZG9tKCkgKiAob3B0cy5tYXhSYWRpdXMgLSBvcHRzLm1pblJhZGl1cyk7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IG9wdHMuY29sb3JzW1tNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiBvcHRzLmNvbG9ycy5sZW5ndGgpXV07XHJcbiAgICAgICAgdGhpcy52ZWN0b3IgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpIHx8IC0xO1xyXG5cclxuICAgICAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIE1hdGguUEkgKiAyKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrKCk7XHJcbiAgICAgICAgICAgIHRoaXMucmFkaXVzICs9IG9wdHMuc3RlcCAqIHRoaXMudmVjdG9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jaGVjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmFkaXVzID4gb3B0cy5tYXhSYWRpdXMgfHwgdGhpcy5yYWRpdXMgPCBvcHRzLm1pblJhZGl1cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZWN0b3IgKj0gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XHJcbiAgICAgICAgYXJyU3RhcnMgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAodyAvIDQwKSAqIChoIC8gNDApOyBpKyspIHtcclxuICAgICAgICAgICAgYXJyU3RhcnMucHVzaChuZXcgU3RhcnModywgaCkpO1xyXG4gICAgICAgICAgICBhcnJTdGFyc1tpXS5kcmF3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxvb3AoKVxyXG4gICAgfVxyXG5cclxuICAgIHNldHVwKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gbG9vcCgpIHtcclxuICAgICAgICBhbmltYXRpb25zID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHcsIGgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyclN0YXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBhcnJTdGFyc1tpXS51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIGFyclN0YXJzW2ldLmRyYXcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIG9wdHMuZGVsYXkpO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG5cclxuICAgXHJcbiAgICBcclxufTsgd2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGJkQ2FudmFzKCk7XHJcbn07XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyDQrdGC0L4gLSDQstCw0YjQsCDRgtC+0YfQutCwINCy0YXQvtC00LAg0LTQu9GPINGB0LrRgNC40L/RgtC+0LIg0YHRgtGA0LDQvdC40YbRiy4g0JjQvNC/0L7RgNGC0LjRgNGD0LnRgtC1INGB0Y7QtNCwINC90YPQttC90YvQtSDQstCw0Lwg0YTQsNC50LvRiy5cblxuaW1wb3J0ICcuL3NjcmlwdCc7XG5pbXBvcnQgJy4vc3RhcnMnO1xuIl0sIm5hbWVzIjpbIm1lbnVCdG4iLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJoZWFkZXJOYXYiLCJsaW5rSXRlbSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJhZGRFdmVudExpc3RlbmVyIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwiaGVhZGVyQnRuIiwic2tpbGxzU2VjdGlvbiIsInNjcm9sbEludG9WaWV3IiwiYmxvY2siLCJiZWhhdmlvciIsImxpbmtNZW51IiwiZm9yRWFjaCIsIml0ZW0iLCJlIiwicHJldmVudERlZmF1bHQiLCJsaW5rRGF0YSIsImdldEF0dHJpYnV0ZSIsInN1YnN0cmluZyIsImNvbnNvbGUiLCJsb2ciLCJoZWFkZXJTY3JlZW4iLCJwb3NpdGlvbkhlaWdodCIsIndpbmRvdyIsInNjcmVlbiIsImhlaWdodCIsInN0eWxlIiwiVkFOVEEiLCJORVQiLCJlbCIsIm1vdXNlQ29udHJvbHMiLCJ0b3VjaENvbnRyb2xzIiwiZ3lyb0NvbnRyb2xzIiwibWluSGVpZ2h0IiwibWluV2lkdGgiLCJzY2FsZSIsInNjYWxlTW9iaWxlIiwiY29sb3IiLCJiYWNrZ3JvdW5kQ29sb3IiLCJzcGFjaW5nIiwicmVzaXplSGVhZGVyIiwicG9zaXRpb25XaWR0aCIsImNsaWVudFdpZHRoIiwiY2FudmFzVmFudGEiLCJkaXNwbGF5IiwiYmRDYW52YXMiLCJvcHRzIiwibWluUmFkaXVzIiwibWF4UmFkaXVzIiwiY29sb3JzIiwiZGVsYXkiLCJzdGVwIiwiY2FudmFzIiwicmVzaXplQ2FudmFzIiwidyIsIndpZHRoIiwiaW5uZXJXaWR0aCIsImgiLCJpbm5lckhlaWdodCIsIndpbmRvd1Jlc2l6ZSIsImNoZWNrIiwiY2xlYXJUaW1lb3V0IiwiYXJyU3RhcnMiLCJsZW5ndGgiLCJzZXRUaW1lb3V0IiwiY2xlYXJJbnRlcnZhbCIsImFuaW1hdGlvbnMiLCJzZXR1cCIsImN0eCIsImdldENvbnRleHQiLCJTdGFycyIsIngiLCJNYXRoIiwicmFuZG9tIiwieSIsInJhZGl1cyIsInJvdW5kIiwidmVjdG9yIiwiZHJhdyIsImJlZ2luUGF0aCIsImFyYyIsIlBJIiwiZmlsbFN0eWxlIiwiZmlsbCIsImNsb3NlUGF0aCIsInVwZGF0ZSIsImkiLCJwdXNoIiwibG9vcCIsInNldEludGVydmFsIiwiY2xlYXJSZWN0Iiwib25sb2FkIl0sInNvdXJjZVJvb3QiOiIifQ==