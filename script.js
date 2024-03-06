const overlay_container = document.querySelector(".overlay");
const overlay_name = document.querySelector("#overlay-name");
const overlay_submit = document.querySelector("#overlay-submit");
const main = document.getElementsByTagName("main")[0];
let user_name = document.querySelector("#user-name");
const clock_container = document.querySelector(".clock");
const greeting_container = document.querySelector(".greeting");
const circle_container = document.querySelectorAll(".circle-container");
const clock_circle = circle_container[0];
const greeting_circle = circle_container[1];
const clock_dropdown = document.querySelector(".clock-dropdown");
const clock_format = document.querySelector("#clock-format");
const name_change = document.querySelector(".name-change");
const todo_name = document.querySelector("#todo-name");
const todo_list = document.querySelector(".todolist-container");
const list = document.querySelector("#list");
const input_item = document.querySelector("#input-item");
const weather_icon = document.querySelector("#weather-icon");
const temp = document.querySelector("#temperature");
const loc = document.querySelector("#location");
const timezone_selector = document.querySelector("#timezone");
const timezone_container = document.querySelector(".timezone-container");
let tasks = Array.from(document.getElementsByClassName("task"));
let name_input = "";
let latitude,
  longitude = 0;
const ONESECOND_TO_MILLISECONDS = 1000;
const SIXTYSECONDS_TO_MILLISECONDS = 60000;
const ONEMINUTETHIRTYSECONDS_TO_MILLISECONDS = 90000;
const THIRYMINUTES_TO_MILLISECONDS = 1800000;

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.name) {
    main.classList.remove("unshow");
    overlay_container.classList.add("unshow");
    user_name.innerText = localStorage.name;
    getUserTimeZone();
  }
  if (localStorage.tasks) {
    tasks = JSON.parse(localStorage.tasks);
    renderTasks();
  }
});
overlay_submit.addEventListener("click", (e) => {
  e.preventDefault();
  submit();
});
overlay_name.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    submit();
  }
});
clock_container.addEventListener("mousemove", () => {
  clock_circle.classList.remove("unshow");
});
clock_container.addEventListener("mouseout", () => {
  !clock_dropdown.classList.contains("unshow")
    ? clock_circle.classList.remove("unshow")
    : clock_circle.classList.add("unshow");
});
greeting_container.addEventListener("mousemove", () => {
  greeting_circle.classList.remove("unshow");
});
greeting_container.addEventListener("mouseout", () => {
  !name_change.classList.contains("unshow")
    ? greeting_circle.classList.remove("unshow")
    : greeting_circle.classList.add("unshow");
});
clock_circle.addEventListener("click", () => {
  !clock_dropdown.classList.contains("unshow")
    ? clock_dropdown.classList.add("unshow")
    : clock_dropdown.classList.remove("unshow");
});
greeting_circle.addEventListener("click", () => {
  !name_change.classList.contains("unshow")
    ? name_change.classList.add("unshow")
    : name_change.classList.remove("unshow");
});
todo_name.addEventListener("click", () => {
  todo_list.classList.toggle("unshow");
});
user_name.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    setUserName();
  }
});
name_change.addEventListener("click", () => {
  name_change.classList.add("unshow");
  user_name.focus();
});
input_item.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    let input = input_item.value;
    if (input || input === "0") {
      addItem(input);
      input_item.value = "";
    }
  }
});
function renderTasks() {
  list.innerHTML = "";
  const localstorage_tasks = JSON.parse(localStorage.getItem("tasks"))
  localstorage_tasks.forEach((task) => {
    let addedItem = document.createElement("li");
    addedItem.classList.add("task");
    addedItem.id = task.id;

    let checkbox = document.createElement("input");
    checkbox.classList.add("task-list");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("click", () => clicked(task.id));

    let itemContainer = document.createElement("span");
    itemContainer.classList.add("item-container");

    let item = document.createElement("span");
    item.classList.add("item");
    item.contentEditable = true;
    item.textContent = task.content;
    item.addEventListener("keypress", (e) => {
      if (e.target.innerText !== null && e.key === "Enter") {
        e.preventDefault();
        tasks = tasks.map((task) => {
          return task.id !== e.target.parentNode.parentNode.id
            ? { ...task }
            : { ...task, content: e.target.innerText };
        });
        updateLocalStorage();
        item.blur();
      }
    });

    if (task.completed) {
      item.classList.add("checked");
    }

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash", "fa-2xs");
    deleteIcon.style.color = "black";
    deleteIcon.addEventListener("click", () => removeItem(task.id));

    itemContainer.appendChild(item);
    itemContainer.appendChild(deleteIcon);

    addedItem.appendChild(checkbox);
    addedItem.appendChild(itemContainer);

    list.appendChild(addedItem);
  });
}
function submit() {
  name_input = overlay_name.value;
  if (name_input) {
    localStorage.name = name_input;
    user_name.innerText = localStorage.name;
    main.classList.remove("unshow");
    overlay_container.classList.add("unshow");
  }
}
function getUserTimeZone() {
  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
  };
  navigator.geolocation.getCurrentPosition(
    (position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "5280db0fe1msh30445869f4d463ep11e09ajsn73c16b365309",
          "X-RapidAPI-Host": "timezone-by-location.p.rapidapi.com",
        },
      };
      fetch(
        `https://timezone-by-location.p.rapidapi.com/timezone?lat=${latitude}&lon=${longitude}&c=1&s=0`,
        options
      )
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("userTZ", data.Zones[0].TimezoneId);
        })
        .catch((err) => fail(err));
    },
    (error) => console.log(error),
    options
  );
}
function getTimeZoneData() {
  const url = "https://location-and-time.p.rapidapi.com/timezone";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "7315244462msh559f0803819d17fp19d65ajsne5acc1b4e806",
      "X-RapidAPI-Host": "location-and-time.p.rapidapi.com",
    },
  };
  return new Promise((success, fail) => {
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => success(data.response))
      .catch((err) => fail(err));
  });
}
function getCurrentTime() {
  const hour = document.querySelector("#hours");
  const minutes = document.querySelector("#minutes");
  const seconds = document.querySelector("#seconds");
  const session = document.querySelector("#session");
  const time_of_day = document.querySelector("#time-of-day");

  let date_str = new Date().toLocaleString("en-US", {
    timeZone: localStorage.getItem("userTZ"),
  });
  let date = new Date(date_str);
  let curr_hour = date.getHours();
  let curr_minutes = date.getMinutes();
  let curr_seconds = date.getSeconds();

  session.innerHTML = curr_hour > 11 ? "PM" : "AM";

  time_of_day.innerHTML =
    curr_hour < 12 ? "morning" : curr_hour < 18 ? "afternoon" : "evening";
  if (localStorage.hourFormat === "24")
    clock_format.setAttribute("checked", true);
  if (!clock_format.checked) {
    curr_hour = curr_hour % 12;
    curr_hour = curr_hour % 12 === 0 ? 12 : curr_hour;
    session.style.display = "block";
    localStorage.removeItem("hourFormat");
  } else {
    session.style.display = "none";
    localStorage.setItem("hourFormat", 24);
  }
  hour.innerHTML = curr_hour < 10 ? "0" + curr_hour : curr_hour;
  minutes.innerHTML = curr_minutes < 10 ? "0" + curr_minutes : curr_minutes;
  seconds.innerHTML = curr_seconds < 10 ? "0" + curr_seconds : curr_seconds;
  setTimeout(() => {
    getCurrentTime();
  }, ONESECOND_TO_MILLISECONDS);
}
function setRandomQuote() {
  const quote_text = document.querySelector("#text");
  const quote_author = document.querySelector("#author");

  fetch("https://type.fit/api/quotes")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let random = Math.floor(Math.random() * (data.length + 1));
      quote_text.innerHTML = data[random].text;
      quote_author.innerHTML = data[random].author;
    });
  setTimeout(() => {
    setRandomQuote();
  }, SIXTYSECONDS_TO_MILLISECONDS);
}
function setWeatherData() {
  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
  };
  navigator.geolocation.getCurrentPosition(
    (position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "7315244462msh559f0803819d17fp19d65ajsne5acc1b4e806",
          "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
        },
      };
      fetch(
        `https://weatherapi-com.p.rapidapi.com/current.json?q=${latitude},${longitude}`,
        options
      )
        .then((response) => response.json())
        .then((data) => {
          weather_icon.src = data.current.condition.icon;
          temp.innerText = `${data.current.temp_c}°`;
          loc.innerText = data.location.name;
        })
        .catch((err) => console.error(err));
    },
    (error) => console.log(error),
    options
  );
  setTimeout(() => {
    getWeather();
  }, THIRYMINUTES_TO_MILLISECONDS);
}
function changeBackgroundImage() {
  fetch(
    `https://api.unsplash.com/photos/random?client_id=LMJ13Dn5_HeJnwge_6sR7baTm9FOftofcRES8_KTsTM`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const image = new Image();
      image.src = data.urls.full;
      image.onload = () => {
        document.body.style.backgroundImage = `url(${data.urls.full})`;
      };
    });
  setTimeout(
    () => changeBackgroundImage(),
    ONEMINUTETHIRTYSECONDS_TO_MILLISECONDS
  );
}
function onClickOutside() {
  document.addEventListener("click", (e) => {
    if (!e.target.id) {
      clock_dropdown.classList.add("unshow");
      name_change.classList.add("unshow");
      clock_circle.classList.add("unshow");
      greeting_circle.classList.add("unshow");
      setUserName();
    }
  });
}
function setUserName() {
  let new_name = user_name.innerText;
  localStorage.setItem("name", new_name);
  user_name.blur();
}
function addItem(input) {
  let id = crypto.randomUUID();

  let taskItem = {
    id: "task" + id,
    content: input,
    completed: false,
  };

  tasks.push(taskItem);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  let addedItem = document.createElement("li");
  addedItem.id = taskItem.id;
  addedItem.classList.add("task");

  let checkbox = document.createElement("input");
  checkbox.classList.add("task-list");
  checkbox.type = "checkbox";
  checkbox.addEventListener("click", () => clicked(taskItem.id));

  let itemContainer = document.createElement("span");
  itemContainer.classList.add("item-container");

  let item = document.createElement("span");
  item.classList.add("item");
  item.contentEditable = true;
  item.textContent = input;
  item.addEventListener("keypress", (e) => {
    if (e.target.innerText !== null && e.key === "Enter") {
      e.preventDefault();
      tasks = tasks.map((task) => {
        return task.id !== e.target.parentNode.parentNode.id
          ? { ...task }
          : { ...task, content: e.target.innerText };
      });
      updateLocalStorage();
      item.blur();
    }
  });

  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-trash", "fa-2xs");
  deleteIcon.style.color = "black";
  deleteIcon.addEventListener("click", () => removeItem(taskItem.id));

  itemContainer.appendChild(item);
  itemContainer.appendChild(deleteIcon);

  addedItem.appendChild(checkbox);
  addedItem.appendChild(itemContainer);

  list.appendChild(addedItem);
}
function clicked(id) {
  const clicked_task = document.querySelector(`#${id}`);
  const task_checkbox = clicked_task.children[0];
  let task_span = clicked_task.children[1].children[0];

  if (task_checkbox.checked) {
    task_checkbox.setAttribute("checked", true);
    task_span.classList.add("checked");
  } else {
    task_checkbox.removeAttribute("checked");
    task_span.classList.remove("checked");
  }

  tasks = tasks.map((task) => {
    return task.id !== id ? { ...task } : { ...task, completed: !task.completed };
  });
  updateLocalStorage();
}
function removeItem(id) {
  tasks = tasks.filter((task) => task.id !== id);
  let item_to_remove = document.querySelector(`#${id}`);
  item_to_remove.remove();
  updateLocalStorage();
}

function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

getUserTimeZone();
setRandomQuote();
getCurrentTime();
setWeatherData();
// changeBackgroundImage();
onClickOutside();