const filterBtns = document.querySelectorAll('.portfolio__btn')
const fliterItem = document.querySelectorAll('.portfolio__filter-item')
const filterWrap = document.querySelector('.portfolio__filter-inner')
function filter() {
    filterBtns.forEach(itemBtn => {
        itemBtn.addEventListener('click', () => {
            fliterItem.forEach(element => {
                element.style.opacity = "0"
                element.style.pointerEvents = "none"
                element.style.position = "absolute"
            })
            let targetId = itemBtn.getAttribute('data-id')
            let targetItem = document.querySelectorAll(`.${targetId}`)
            if (targetId == 'all') {
                fliterItem.forEach(element => {
                    element.style.opacity = "1"
                    element.style.pointerEvents = "all"
                    element.style.position = "relative"
                    filterWrap.style.justifyContent = 'space-around'
                })
            } else {
                targetItem.forEach(item => {
                    item.style.opacity = "1"
                    item.style.pointerEvents = "all"
                    item.style.position = "relative"
                    filterWrap.style.justifyContent = 'flex-start'
                })
            }
        })
    })
}
filter()