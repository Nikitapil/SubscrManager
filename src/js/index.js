import '../style/style.scss'
const addModal = document.querySelector('.addmodal')
const subscrList = document.querySelector('.subscriptions__list')
const showModal = (modal) => {
    const modalContainer = document.querySelector('.modals')
    modalContainer.classList.toggle('hidden')
    modal.classList.toggle('hidden')
}
const uid = () => {
    const head = Date.now().toString(36)
    const tail = Math.random().toString(36).substr(2)
    return head+tail
}
const counter = () => {
    const totalPrice = document.querySelector('.total__price')
    const allSubscrs = document.querySelectorAll('.subscriptions__item')
    if (allSubscrs.length) {
       let total =  Array.from(Array.from(allSubscrs).filter((item)=> item.querySelector('.subscr-status__checkbox').checked)).map((item)=> item.querySelector('.subscriptions__item-price').dataset.value)
       if (total.length) {
       totalPrice.textContent = total.reduce((prev, curr)=> +prev + +curr) + '$'
       }
       else {
        totalPrice.textContent = '0'
       }
    }
    else {
        totalPrice.textContent = 0
    }
}
const setLocaleStorage = () => {
    localStorage.setItem('subscrlist', subscrList.innerHTML)
}
window.onload = counter
if (localStorage.getItem('subscrlist')) {
    subscrList.innerHTML = localStorage.getItem('subscrlist')
}

document.addEventListener('click', (e)=> {
    let targetEl = e.target
    if (targetEl.closest('.subscriptions__add-btn')) {
        showModal(addModal)
    }
    if (targetEl.closest('.addmodal__cancel')) {
        showModal(addModal)
    }
    if (targetEl.closest('.addmodal__submit')) {
        const titleInput = document.querySelector('.addmodal__name')
        const siteInput = document.querySelector('.addmodal__site')
        const priceInput = document.querySelector('.addmodal__price')
        if (titleInput.value && priceInput.value) {
        const id = uid()
        let newSubscr = document.createElement('li')
        newSubscr.classList.add('subscriptions__item')
        newSubscr.innerHTML = `<input type="checkbox" class="subscriptions__checkbox subscriptions__checkbox_item">
        <div class="subscriptions__info">
            <h3 class="subscriptions__item-name">${titleInput.value}</h3>
            ${siteInput.value ? `<a target="_blank" href="https://${siteInput.value}" class="subscriptions__link"><img src="https://logo.clearbit.com/${siteInput.value}" alt="${siteInput.value}"></a>`: ''}
        </div>
        <p class="subscriptions__item-price" data-value="${priceInput.value}">${priceInput.value}$</p>
        <div class="subscriptions__item-status subscr-status">
            <input checked type="checkbox" id="${id}" class="subscr-status__checkbox">
            <p class="subscr-status__title">Активна</p>
            <label class="status-toggler" for="${id}"><span></span></label>
        </div>
        <button class="subscriptions__item-del"></button>`
        subscrList.append(newSubscr)
        counter()
        setLocaleStorage()
        showModal(addModal)
        titleInput.value = ''
        siteInput.value = ''
        priceInput.value = ''
        }
        else {
            const tooltipAdd = document.querySelector('.tooltip__add')
            tooltipAdd.classList.remove('hidden')
           let timer = setTimeout(()=>{
                tooltipAdd.classList.add('hidden')
            }, 5000)
        }
    }
    if (targetEl.closest('.subscriptions__item-del')) {
        targetEl.closest('.subscriptions__item').remove()
        counter()
        setLocaleStorage()
    }
    if (targetEl.closest('.subscriptions__dellAll')) {
        const checkBoxes = document.querySelectorAll('.subscriptions__checkbox_item')
        Array.from(checkBoxes).filter((item)=> item.checked).forEach((item)=> item.closest('.subscriptions__item').remove())
        counter()
        setLocaleStorage()
    }
})
document.addEventListener('change', (e) => {
    let targetEl = e.target
    if (targetEl.closest('.subscr-status__checkbox')) {
    let status = targetEl.checked ? 'Активна' : 'Не активна'
    targetEl.nextElementSibling.textContent = status
    counter()
    setLocaleStorage()
    }
    if (targetEl.closest('.subscriptions__checkbox_all')) {
        const checkBoxes = document.querySelectorAll('.subscriptions__checkbox_item')
        if (targetEl.checked) {
        Array.from(checkBoxes).forEach((item)=> item.checked = true)
        }
        else {
            Array.from(checkBoxes).forEach((item)=> item.checked = false)
        }
        }
    if (targetEl.closest('.subscriptions__checkbox_item') || targetEl.closest('.subscriptions__checkbox_all')) {
        const checkBoxes = document.querySelectorAll('.subscriptions__checkbox_item')
        const subscrHeaderBtns = document.querySelector('.subscriptions__header-btns')
        let checkBoxesTry = Array.from(checkBoxes).some((item)=> item.checked)
        console.log(checkBoxesTry);
        if (checkBoxesTry) {
            subscrHeaderBtns.innerHTML = `
            <button class="subscriptions__dellAll btn" title="Удалить">Удалить</button>`
        }
        else {
            subscrHeaderBtns.innerHTML = `
            <button class="subscriptions__add-btn btn" title="Новая подписка">Добавить</button>`
        }
    }
})

