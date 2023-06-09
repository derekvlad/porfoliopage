//target menu list
const menuBtn = document.querySelector('.menu__btn');
const headerNav = document.querySelector('.header__nav');
const linkItem = document.querySelectorAll('.header__menu-item');


menuBtn.addEventListener('click', () => {
    if (headerNav === document.querySelector('.header__nav--active')) {
        headerNav.classList.remove('header__nav--active')
        menuBtn.classList.remove('menu__btn--active')
    }
    else {
        headerNav.classList.add('header__nav--active')
        menuBtn.classList.add('menu__btn--active')
    }
})






//scroll to skills
const headerBtn = document.querySelector('.header__btn-bottom');
const skillsSection = document.querySelector('.skills');


headerBtn.addEventListener('click', () => {
    skillsSection.scrollIntoView({
        block: 'nearest', // к ближайшей границе экрана
        behavior: 'smooth',

    });
});

const linkMenu = document.querySelectorAll('.header__menu-link');

linkMenu.forEach(item => {

    item.addEventListener("click", (e) => {
        e.preventDefault()
        linkData = item.getAttribute('href').substring(1)
        console.log(linkData)
        let block = document.querySelector(`.${linkData}`)

        block.scrollIntoView({
            block: 'nearest', // к ближайшей границе экрана
            behavior: 'smooth',
        });

    })


})



//fix height VANTA
const headerScreen = document.querySelector('.header')
let positionHeight = window.screen.height

headerScreen.style.height = positionHeight + 'px'



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
    spacing: 14.00,

})







//prealoder 

window.addEventListener('load', function () {
    document.querySelector('body').classList.add("loaded")
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



