import '../style/style.scss'
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import 'firebase/auth'
import 'firebase/database'
const firebaseConfig = {
    apiKey: "AIzaSyBi024kgW9yVcA5or8X2Woil8aBRF4dn-Q",
    authDomain: "subscrmanager.firebaseapp.com",
    projectId: "subscrmanager",
    storageBucket: "subscrmanager.appspot.com",
    messagingSenderId: "148466132214",
    appId: "1:148466132214:web:d578c5a48608cde33978d7"
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const addModal = document.querySelector('.addmodal')
const subscrList = document.querySelector('.subscriptions__list')
const regModal = document.querySelector('.registrationModal')
const signInModal = document.querySelector('.signInModal')
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
    if (targetEl.closest('.registration-btn')|| targetEl.closest('.registration__cancel')) {
        showModal(regModal)
    }
    if (targetEl.closest('.signin-btn')|| targetEl.closest('.signInModal__cancel')) {
        showModal(signInModal)
    }
    if (targetEl.closest('.signout-btn')) {
        signOut(auth)
        const headerNav = document.querySelector('.header__nav-list')
        const userMail = document.querySelector('.header__user')
        userMail.classList.add('hidden')
      headerNav.innerHTML = `<li class="header__nav-item"><button class="registration-btn btn">Зарегистрироваться</button></li>
                  <li class="header__nav-item"><button class="signin-btn btn">Войти</button></li>`
    }
})
//change events
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

//registration submit events
document.addEventListener('submit', (e)=> {
    e.preventDefault()
    let targetEl = e.target
    if (targetEl.closest('.registrationModal')) {
        const emailInput = document.querySelector('.registration__mail-input')
        const passwordInput = document.querySelector('.registration__password-input')
        createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value).then((user)=> showModal(regModal)).catch((error) => {
            let errorMessage = ''
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Данный email уже используется'
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Введите корректный email'
                    break;
                case 'auth/weak-password':
                        errorMessage = 'Пароль недостаточно сложный'
                        break;
            }
            const tooltipReg = document.querySelector('.tooltip__registration')
            tooltipReg.textContent = errorMessage
            tooltipReg.classList.remove('hidden')
           let timer = setTimeout(()=>{
            tooltipReg.classList.add('hidden')
            }, 5000)
          })
    }
    if (targetEl.closest('.signInModal')) {
        const signInMailInput = document.querySelector('.signInModal__mail-input')
        const signInPasswordInput = document.querySelector('.signInModal__password-input')
        signInWithEmailAndPassword(auth, signInMailInput.value, signInPasswordInput.value)
  .then((userCredential) => {
    showModal(signInModal)
  })
  .catch((error) => {
    let errorMessage = ''
    switch (error.code) {
        case 'auth/invalid-email':
            errorMessage = 'Введите корректный email'
            break;
        case 'auth/wrong-password':
                errorMessage = 'Не верный пароль'
                break;
        case 'auth/user-not-found':
                errorMessage = 'Не верные данные пользователя'
                break;
    }
    const tooltipReg = document.querySelector('.tooltip__registration')
    tooltipReg.textContent = errorMessage
    tooltipReg.classList.remove('hidden')
   let timer = setTimeout(()=>{
    tooltipReg.classList.add('hidden')
    }, 5000)
  })
}
})
// user changes
onAuthStateChanged(auth, (user) => {
    if (user) {
      const headerNav = document.querySelector('.header__nav-list')
      headerNav.innerHTML = `<li class="header__nav-item"><button class="signout-btn btn">Выйти</button></li>`
      const userMail = document.querySelector('.header__user')
      userMail.textContent = user.email
      userMail.classList.remove('hidden')
    } else {
      // User is signed out
      // ...
    }
  });
