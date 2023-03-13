const overlay_container = document.querySelector('.overlay')
const overlay_name = document.querySelector('#overlay-name')
const overlay_submit = document.querySelector('#overlay-submit')

const main = document.getElementsByTagName('main')[0]
let user_name = document.querySelector('#user-name')

const clock_container = document.querySelector('.clock')
const greeting_container = document.querySelector('.greeting-container')
const circle_container = document.querySelectorAll('.circle-container')

const clock_circle = circle_container[0]
const greeting_circle = circle_container[1]

const clock_dropdown = document.querySelector('.clock-dropdown')
const clock_format = document.querySelector('#clock-format')

const name_change = document.querySelector('.name-change')

const todo_name = document.querySelector('#todo-name')
const todo_list = document.querySelector('.todolist-container')

document.addEventListener('DOMContentLoaded', ()=>{
    if(localStorage.getItem('hasData')){
        main.classList.remove('unshow')
        overlay_container.classList.add('unshow')
        user_name.innerText = localStorage.getItem('name')
    } else {
        console.log("no data!")
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
    
    // console.log(date = date.toLocaleString('en-US', {hour12:false}))


    session.innerHTML = curr_hour > 11 ? "PM" : "AM"

    time_of_day.innerHTML = curr_hour < 12 ? "morning"
                                        : curr_hour < 18 ? "afternoon"
                                        : "evening"

    if(!clock_format.checked){
        curr_hour = curr_hour % 12
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

let i=0;

function changeBackgroundImage(index) {  
    // let authorization = '8I1-nFG0oPbsDbN3MCGILQuV1gySyv2Y7PtbJFKO50E'
    // let url = `https://api.unsplash.com/photos/?client_id=${authorization}&query=lion`
    
    // fetch(url)
    //     .then(response => {
    //         return response.json();
    //     })
    //     .then(data => {
    //         let random = Math.floor(Math.random() * (data.length + 1))
    //         let image_url = data[random].urls.raw
    //         document.body.style.backgroundImage = `url('${image_url}')`
    //     });

    const images = ['./images/sunrise.jpg','./images/bridge.jpg','./images/city.jpg','./images/dunes.png','./images/retro.jpg','./images/space.png']

    document.body.style.backgroundImage = `url('${images[index]}')`
    index++
    index = index < images.length ? index : 0
    setTimeout(()=>{changeBackgroundImage(index)}, 60000)
}


clock_container.addEventListener('mousemove', ()=>{
    clock_circle.classList.remove('unshow')
})

clock_container.addEventListener('mouseout', ()=>{
    clock_circle.classList.add('unshow')
})

greeting_container.addEventListener('mousemove', ()=>{
    greeting_circle.classList.remove('unshow')
})

greeting_container.addEventListener('mouseout', ()=>{
    greeting_circle.classList.add('unshow')
})

clock_circle.addEventListener('click', ()=>{
    clock_dropdown.classList.toggle('visible')
})

greeting_circle.addEventListener('click', ()=>{
    name_change.classList.toggle('visible')
})

todo_name.addEventListener('click', ()=>{
    todo_list.classList.toggle('unshow')
})


getCurrentTime()
getRandomQuote()
changeBackgroundImage(i)




