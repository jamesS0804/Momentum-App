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
const weather_icon = document.querySelector('#weather-icon')
const temp = document.querySelector('#temperature')
const loc = document.querySelector('#location')
const timezone_selector = document.querySelector('#timezone')
const timezone_container = document.querySelector('.timezone-container')
let tasks = document.getElementsByClassName('task').length
let name_input = ""
let i=0;
let todo_container_top = -230
let todo_container_min_height = 5
let chosen_timezone = 'Asia/Manila'
let latitude, longitude = 0
const ONESECOND_TO_MILLISECONDS = 1000
const SIXTYSECONDS_TO_MILLISECONDS = 60000
const THIRYMINUTES_TO_MILLISECONDS = 1800000

document.addEventListener('DOMContentLoaded', ()=>{
    if(localStorage.name){
        main.classList.remove('unshow')
        overlay_container.classList.add('unshow')
        user_name.innerText = localStorage.name
        setTimeZone()
        getUserTimeZone()
    }
    if(localStorage.list_HTML) list.innerHTML = localStorage.list_HTML
    if(localStorage.tz) chosen_timezone = localStorage.tz
    if(localStorage.top) {
        todo_container_top = Number(localStorage.getItem('top'))
        todo_container_min_height = Number(localStorage.getItem('minHeight'))
        todo_list.style.top = `${todo_container_top}%`
        todo_list.style.minHeight = `${todo_container_min_height}rem`
    }
})
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
timezone_selector.addEventListener('change', ()=> {
    chosen_timezone = timezone_selector.value
    localStorage.setItem('tz', chosen_timezone)
})
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
input_item.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter'){
        e.preventDefault()
        let input = input_item.value
        if(input || input === '0'){
            addItem(input)
            input_item.value = ""
        }
    }
})
function submit(){
    name_input = overlay_name.value
    if(name_input){
        localStorage.name = name_input
        user_name.innerText = localStorage.name
        main.classList.remove('unshow')
        overlay_container.classList.add('unshow')
    }
}
function getUserTimeZone() {
    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
    }
    navigator.geolocation.getCurrentPosition((position) => {
        latitude = position.coords.latitude
        longitude = position.coords.longitude
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '5280db0fe1msh30445869f4d463ep11e09ajsn73c16b365309',
                'X-RapidAPI-Host': 'timezone-by-location.p.rapidapi.com'
            }
        };
        fetch(`https://timezone-by-location.p.rapidapi.com/timezone?lat=${latitude}&lon=${longitude}&c=1&s=0`, options)
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('userTZ',data.Zones[0].TimezoneId)
            })
            .catch(err => fail(err)) 
    },(error)=> console.log(error), options)
}
function getTimeZoneData() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '5280db0fe1msh30445869f4d463ep11e09ajsn73c16b365309',
            'X-RapidAPI-Host': 'world-time2.p.rapidapi.com'
        }
    };
    return new Promise((success,fail)=>{
        fetch('https://world-time2.p.rapidapi.com/timezone', options)
            .then(response => response.json())
            .then(data => success(data))
            .catch(err => fail(err));
    })
}
function getCurrentTime() {
    const hour = document.querySelector('#hours')
    const minutes = document.querySelector('#minutes')
    const seconds = document.querySelector('#seconds')
    const session = document.querySelector('#session')
    const time_of_day = document.querySelector('#time-of-day')

    let date_str = new Date().toLocaleString("en-US", {timeZone: chosen_timezone})
    let date = new Date(date_str)
    let curr_hour = date.getHours()
    let curr_minutes = date.getMinutes()
    let curr_seconds = date.getSeconds()

    session.innerHTML = curr_hour > 11 ? 'PM' : 'AM'

    time_of_day.innerHTML = curr_hour < 12 ? 'morning'
                                        : curr_hour < 18 ? 'afternoon'
                                        : 'evening'
    if(localStorage.hourFormat === '24') clock_format.setAttribute('checked', true)
    if(!clock_format.checked){
        curr_hour = curr_hour % 12
        curr_hour = curr_hour % 12 === 0 ? 12 : curr_hour
        session.style.display = 'block'
        localStorage.removeItem('hourFormat')
    } else {
        session.style.display = 'none'
        localStorage.setItem('hourFormat',24)
    }
    hour.innerHTML = curr_hour < 10 ? '0' + curr_hour : curr_hour 
    minutes.innerHTML = curr_minutes < 10 ? '0' + curr_minutes : curr_minutes 
    seconds.innerHTML = curr_seconds < 10 ? '0' + curr_seconds : curr_seconds 
    setTimeout(()=>{getCurrentTime()},ONESECOND_TO_MILLISECONDS)
}   
function setRandomQuote() {
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
    setTimeout(()=>{setRandomQuote()}, SIXTYSECONDS_TO_MILLISECONDS)
}
function setWeatherData() {
    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
    }
    navigator.geolocation.getCurrentPosition( (position) => {
        latitude = position.coords.latitude
        longitude = position.coords.longitude
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '7315244462msh559f0803819d17fp19d65ajsne5acc1b4e806',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };
        fetch(`https://weatherapi-com.p.rapidapi.com/current.json?q=${latitude},${longitude}`, options)
        .then(response => response.json())
        .then(data => {
            weather_icon.src = data.current.condition.icon
            temp.innerText = `${data.current.temp_c}°`
            loc.innerText = data.location.name
        })
        .catch(err => console.error(err));
    },(error)=> console.log(error), options)
    setTimeout(()=>{getWeather()}, THIRYMINUTES_TO_MILLISECONDS)
}
async function setTimeZone() {
    let timezones = await getTimeZoneData()
    timezones.forEach(tz => {
        let newOption = document.createElement('option')
        newOption.value = tz
        newOption.text = tz
        if(localStorage.tz) {
            if(tz === localStorage.tz) {
                newOption.setAttribute('selected',true)
                console.log(`${tz} is good`)
            }
        } else {
            if(tz === localStorage.userTZ) {
                newOption.setAttribute('selected',true)
                console.log(`${tz} is good`)
            }
        }
        timezone_selector.appendChild(newOption)
    })
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
    setTimeout(()=>{changeBackgroundImage(index)}, SIXTYSECONDS_TO_MILLISECONDS)
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
    localStorage.setItem('name', new_name)
    user_name.blur()
}
function addItem(input) {
    console.log(`tasks length: ${tasks}`)
    let index = tasks + 1
    console.log(`index: ${index}`)
    let addedItem = `
        <div class="task">
            <input id="box${index}" class="task-list" type="checkbox" onclick="clicked(${index})">
            <span class="item-container">
                <span class="item" contenteditable="true">${input}</span>
                <i class="fa-solid fa-trash fa-2xs" style="color: black;" onclick="update('remove', ${index})"></i>
            </span>
        </div>
    `
    list.insertAdjacentHTML('beforeend',addedItem)
    localStorage.setItem('list_HTML', list.innerHTML)
    let task_to_edit = document.getElementsByClassName('item')[index-1]
    if(task_to_edit) {
        task_to_edit.addEventListener('keypress', (e)=>{
            if(e.key === 'Enter'){
                e.preventDefault()
                localStorage.setItem('list_HTML', list.innerHTML)
                task_to_edit.blur()
            }
        })
    }
    update('add', index)
    tasks += 1
}
function clicked(i) {
    i -= 1
    let tasks_input = document.getElementsByClassName('task-list')
    if(tasks_input[i].checked) {
        tasks_input[i].setAttribute('checked', true)
        tasks_input[i].nextElementSibling.children[0].classList.add('checked')
    } else {
        tasks_input[i].removeAttribute('checked')
        tasks_input[i].nextElementSibling.children[0].classList.remove('checked')
    }
    localStorage.setItem('list_HTML', list.innerHTML)
}
function update(operation, i) {
    let height_limit = 469
    if(operation === 'add') {
        if(todo_list.clientHeight < height_limit) {
            todo_container_top += -50
            todo_container_min_height += 1
            todo_list.style.top = `${todo_container_top}%`
            todo_list.style.minHeight = `${todo_container_min_height}rem`
            localStorage.setItem('top', todo_container_top)
            localStorage.setItem('minHeight', todo_container_min_height)
        }
    } else {
        if(todo_list.clientHeight < height_limit) {
            tasks -= 1
            todo_container_top += 50
            todo_container_min_height -= 1
            todo_list.style.top = `${todo_container_top}%`
            todo_list.style.minHeight = `${todo_container_min_height}rem`
            localStorage.setItem('top', todo_container_top)
            localStorage.setItem('minHeight', todo_container_min_height)
        }
        let item_to_remove = document.getElementById(`box${i}`).parentNode
        item_to_remove.remove()
        localStorage.setItem('list_HTML', list.innerHTML)
    }
}
function settings() {
    // localStorage.removeItem("hourFormat")
    // localStorage.removeItem('list')
    // localStorage.removeItem('list_HTML')
    // localStorage.removeItem('top')
    // localStorage.removeItem('minHeight')
    // localStorage.removeItem('tz')
    // localStorage.removeItem('userTZ')
    timezone_container.classList.toggle('unshow')
}
getUserTimeZone()
setRandomQuote()
getCurrentTime()
setWeatherData()
changeBackgroundImage(i)
onClickOutside()