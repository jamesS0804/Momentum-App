const overlay_container = document.querySelector('.overlay')
const overlay_name = document.querySelector('#overlay-name')
const overlay_submit = document.querySelector('#overlay-submit')
const main = document.getElementsByTagName('main')[0]
let user_name = document.querySelector('#user-name')

const clock_container = document.querySelector('.clock')
const greeting_container = document.querySelector('.greeting')
const circle_container = document.querySelectorAll('.circle-container')

const clock_circle = circle_container[0]
const greeting_circle = circle_container[1]

const clock_dropdown = document.querySelector('.clock-dropdown')
const clock_format = document.querySelector('#clock-format')
const name_change = document.querySelector('.name-change')
const todo_name = document.querySelector('#todo-name')
const todo_list = document.querySelector('.todolist-container')

const list = document.querySelector('#list')
const input_item = document.querySelector('#input-item')

let i=0;

document.addEventListener('DOMContentLoaded', ()=>{
    if(localStorage.getItem('hasData')){
        main.classList.remove('unshow')
        overlay_container.classList.add('unshow')
        user_name.innerText = localStorage.getItem('name')
    }
})

function submit(){
    let name_input = overlay_name.value

    localStorage.setItem('name', name_input)
    localStorage.setItem('hasData', true)

    user_name.innerText = localStorage.getItem('name')

    main.classList.remove('unshow')
    overlay_container.classList.add('unshow')
}

overlay_submit.addEventListener('click', (e)=> {
    e.preventDefault()
    submit()
})

overlay_name.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter'){
        e.preventDefault()
        submit()
    }
})

function getCurrentTime() {
    const hour = document.querySelector('#hours')
    const minutes = document.querySelector('#minutes')
    const seconds = document.querySelector('#seconds')
    const session = document.querySelector('#session')
    const time_of_day = document.querySelector('#time-of-day')

    let date = new Date() 
    let curr_hour = date.getHours()
    let curr_minutes = date.getMinutes()
    let curr_seconds = date.getSeconds()

    session.innerHTML = curr_hour > 11 ? "PM" : "AM"

    time_of_day.innerHTML = curr_hour < 12 ? "morning"
                                        : curr_hour < 18 ? "afternoon"
                                        : "evening"
    if(!clock_format.checked){
        curr_hour = curr_hour % 12
        curr_hour = curr_hour % 12 === 0 ? 12 : curr_hour
        session.style.display = 'block'
    } else { 
        session.style.display = 'none'
    }

    hour.innerHTML = curr_hour < 10 ? '0' + curr_hour : curr_hour 
    minutes.innerHTML = curr_minutes < 10 ? '0' + curr_minutes : curr_minutes 
    seconds.innerHTML = curr_seconds < 10 ? '0' + curr_seconds : curr_seconds 
    setTimeout(()=>{getCurrentTime()},1000)
}

function getRandomQuote() {
    const quote_text = document.querySelector('#text')
    const quote_author = document.querySelector('#author')

    fetch("https://type.fit/api/quotes")
        .then(response => {
            return response.json();
        })
        .then(data => {
            let random = Math.floor(Math.random() * (data.length + 1))
            quote_text.innerHTML = data[random].text
            quote_author.innerHTML = data[random].author
        });
    setTimeout(()=>{getRandomQuote()}, 60000)
}

function changeBackgroundImage(index) {
    fetch('./images.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            document.body.style.backgroundImage = `url('${data.images[index]}')`
            index++
            index = index < data.images.length ? index : 0
        });
    setTimeout(()=>{changeBackgroundImage(index)}, 60000)
}
function onClickOutside() {
    document.addEventListener('click', e => {
       if(!e.target.id) {
            clock_dropdown.classList.add('unshow')
            name_change.classList.add('unshow')
            clock_circle.classList.add('unshow')
            greeting_circle.classList.add('unshow')
            setUserName()
       }
    });
}
function setUserName() {
    let new_name = user_name.innerText
    console.log(`new_name: ${new_name}`)
    localStorage.setItem('name', new_name)
    user_name.blur()
}
clock_container.addEventListener('mousemove', ()=>{
    clock_circle.classList.remove('unshow')
})
clock_container.addEventListener('mouseout', ()=>{
    !clock_dropdown.classList.contains('unshow') ? clock_circle.classList.remove('unshow') : clock_circle.classList.add('unshow')
})
greeting_container.addEventListener('mousemove', ()=>{
    greeting_circle.classList.remove('unshow')
})
greeting_container.addEventListener('mouseout', ()=>{
    !name_change.classList.contains('unshow') ?  greeting_circle.classList.remove('unshow') : greeting_circle.classList.add('unshow')
})
clock_circle.addEventListener('click', ()=>{
    !clock_dropdown.classList.contains('unshow') ? clock_dropdown.classList.add('unshow') : clock_dropdown.classList.remove('unshow')
})
greeting_circle.addEventListener('click', ()=>{
    !name_change.classList.contains('unshow') ? name_change.classList.add('unshow') : name_change.classList.remove('unshow')
})
todo_name.addEventListener('click', ()=>{
    todo_list.classList.toggle('unshow')
})
user_name.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter'){
        e.preventDefault()
        setUserName()
    }
})
name_change.addEventListener('click', ()=>{
    name_change.classList.add('unshow')
    user_name.focus()
})

let itemArray = []

function Item (isChecked,item) {
    this.isChecked = isChecked
    this.item = item
}

function addItem(input) {
    console.log(list.innerHTML)
    let addedItem = `
        <div>
            <input type="checkbox">
            <span>${input}</span>
        </div>
    `
    let recordItem = new Item(false,input)
    itemArray.push(recordItem)
    console.log(itemArray)
    localStorage.setItem('list', itemArray)
    list.insertAdjacentHTML('beforeend',addedItem)
}
input_item.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter'){
        e.preventDefault()
        let input = input_item.value
        console.log(`input: ${input}`)
        addItem(input)
        input_item.value = ""
    }
})
getCurrentTime()
getRandomQuote()
changeBackgroundImage(i)
onClickOutside()