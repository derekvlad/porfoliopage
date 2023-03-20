//target menu list
const menuBtn = document.querySelector('.menu__btn');
const headerNav = document.querySelector('.header__nav');
const linkItem = document.querySelectorAll('.header__menu-item');


menuBtn.addEventListener('click', () =>{
    if (headerNav === document.querySelector('.header__nav--active')){
        headerNav.classList.remove('header__nav--active')
        menuBtn.classList.remove('menu__btn--active')
    }
    else{
        headerNav.classList.add('header__nav--active')
        menuBtn.classList.add('menu__btn--active')
    }
})
linkItem.forEach(item =>{
    item.addEventListener('click',()=>{
        headerNav.classList.remove('header__nav--active')
        menuBtn.classList.remove('menu__btn--active')
    })
})




//scroll to skills
const headerBtn = document.querySelector('.header__btn-bottom');
const skillsSection = document.querySelector('.skills');


headerBtn.addEventListener('click', () =>{
    skillsSection.scrollIntoView({
        block: 'nearest', // к ближайшей границе экрана
        behavior: 'smooth', 
        
    });
});