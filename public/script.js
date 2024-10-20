const nsDiv = document.querySelector('.kanban-columns.ns > .tasks');
const ipDiv = document.querySelector('.kanban-columns.ip > .tasks');
const cpDiv = document.querySelector('.kanban-columns.cp > .tasks');
const dateContainer = document.querySelector('.dates');
const allTodosWrapper = document.querySelector('.date-wrapper.all');
allTodosWrapper.addEventListener('click', () => handleDateClick(allTodosWrapper));

function handleDateClick(dateEl, date=null) {
    const previouslyFocused = document.querySelector('.date-wrapper.focused');
    if (previouslyFocused && previouslyFocused === dateEl && dateEl != allTodosWrapper) {
        previouslyFocused.classList.remove('focused');
        displayTodos();
    }
    else {
        if (previouslyFocused) {
            previouslyFocused.classList.remove('focused');
        }
        dateEl.classList.add('focused');
        if (date) {
            filterTodosByDate(date);
        }
        else {
            displayTodos();
        }
    }
}

function generateDates() {
    const today = new Date();
    const day = today.getDay();
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - day + i + 1);
        weekDays.push(date);
    }
    weekDays.forEach(date => {
        const dateElement = document.createElement('div');
        dateElement.classList.add('date-wrapper');
        const destructeredDate = date.toString().split(" ");
        dateElement.innerHTML = `
        <div class="date">
            ${destructeredDate[2]}
        </div>
        <div class="day">
            ${destructeredDate[0]}
        </div>
        `
        dateElement.addEventListener('click', () => handleDateClick(dateElement, date.toISOString().split('T')[0]));
        dateContainer.appendChild(dateElement);
    });
}

async function filterTodosByDate(date) {
    const response = await getAllTodos();
    const filteredTodos = response.todos.filter(todo => todo.dueDate.split("T")[0] === date);
    generateCards(filteredTodos);
}
generateDates();
dragHandler();
function dragHandler() {
    nsDiv.addEventListener('drop', (event) => {
        event.preventDefault();
        const todoId = event.dataTransfer.getData('text/plain');
        console.log(`Dropped on Not Started. Todo ID: ${todoId}`);
        modifyStatus(todoId, "Not Started");
    })
    ipDiv.addEventListener('drop', (event) => {
        event.preventDefault();
        const todoId = event.dataTransfer.getData('text/plain');
        console.log(`Dropped on Progress. Todo ID: ${todoId}`);
        modifyStatus(todoId, "Pending");
    })
    cpDiv.addEventListener('drop', (event) => {
        event.preventDefault();
        const todoId = event.dataTransfer.getData('text/plain');
        console.log(`Dropped on Completed. Todo ID: ${todoId}`);
        modifyStatus(todoId, "Completed");
    })

    nsDiv.addEventListener('dragover', (event) => {
        event.preventDefault();
    })
    ipDiv.addEventListener('dragover', (event) => {
        event.preventDefault();
    })
    cpDiv.addEventListener('dragover', (event) => {
        event.preventDefault();
    })

}

async function authenticated() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Not Logged In. Redirecting to Signin Page");
        window.location.href = "/user/signin";
        return
    }
    const response = await axios.get("/user/me", {
        headers: {
            authorization: `Bearer ${token}`
        }
    })
    toast(response);
    const greeting = document.querySelector(".greeting");
    greeting.innerHTML = `Hello<span class="dot">!</span> ${response.data.user.name}`;
}


function generateCards(todos) {
    nsDiv.innerHTML = "";
    ipDiv.innerHTML = "";
    cpDiv.innerHTML = "";
    if(todos) {
        todos.forEach(todo => {
            const card = document.createElement('div');
            card.classList.add('kanban-card');
            card.setAttribute('draggable', 'true');
            card.setAttribute('id', `${todo._id}`);
            card.addEventListener('dragstart', (event) => {
                card.classList.add('dragging');
                console.log(event.target.id);
                event.dataTransfer.setData('text/plain', event.target.id);
            });
            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
            })
            card.innerHTML = `
            <div class="header">
                <i class="fa-regular fa-pen-to-square" style="color: #000000; cursor: pointer;" onclick="openTodoPopup('edit', '${todo._id}')"></i>
                <i class="fa-regular fa-trash-can" style="color: #e01a1a; cursor: pointer;" onclick="deleteTodo('${todo._id}')"></i>
            </div>
            <div class="task">
                <h4>${todo.title}</h4>
                <div class="task-info">
                    <div class="status ${todo.status=="Not Started"?"not":todo.status=="Pending"?"pe":"comp"}">${todo.status}</div>
                    <p class="date">Due <i class="fa-regular fa-calendar-days" style="color: #000000; margin-right: 7px;">:</i>${todo.dueDate.split("T")[0]}</p>
                </div>
            </div>`;
            if (todo.status=="Not Started") {
                nsDiv.appendChild(card);
            }
            else if(todo.status == "Pending") {
                ipDiv.appendChild(card);
            }
            else {
                cpDiv.appendChild(card);
            }
        });
    }
    checkEmptyCol(nsDiv);
    checkEmptyCol(ipDiv);
    checkEmptyCol(cpDiv);
}

function checkEmptyCol(coldiv) {
    if (coldiv.children.length === 0) {
        const pdiv = document.createElement('div');
        pdiv.classList.add('placeholder-div');
        pdiv.innerHTML = "No Todos to Display.<br/>You can add a todo using the <i class='fa-solid fa-circle-plus' style='color: #000000;'></i> icon to add one. You can drag them over to the respective columns to update their status";
        coldiv.appendChild(pdiv);
    }
}

async function getAllTodos() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/user/signin";
        return
    }
    const response = await axios.get("/todos/", {
        headers: {
            authorization: `Bearer ${token}`
        }
    })
    return response.data;
}

async function getTodo(todoId) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Not Logged In. Redirecting to Signin Page");
        window.location.href = "/user/signin";
        return
    }
    const response = await axios.get(`/todos/${todoId}`, {
        headers: {
            authorization: `Bearer ${token}`
        }
    })
    return response.data.todos;
}

function closeTodoPopup() {
    const todoPopup = document.querySelector(".todo-popup-container");
    todoPopup.style.display = "none";
}

async function openTodoPopup(action, id) {
    const todoForm = document.querySelector(".todo-form");
    // todoForm.reset();
    console.log(action);
    const todoPopup = document.querySelector(".todo-popup-container");
    const popupTitle = document.querySelector(".todo-form > h2")
    if (action==="add") {
        todoPopup.style.display = "flex";
        popupTitle.innerText = "Add a Todo";
        todoForm.setAttribute('onsubmit', 'createTodo(event, "add")');
        document.querySelector("#todo-title").value = "";
        document.querySelector("#todo-due").value = "";
        document.querySelector("#status").value = "";
    }
    else if (action==="edit") {
        console.log(id);
        todoPopup.style.display = "flex";
        popupTitle.innerText = "Edit a Todo";
        todoForm.setAttribute('onsubmit', `createTodo(event, "edit", "${id}")`);
        const todo = await getTodo(id);
        const title = document.querySelector("#todo-title");
        const dueDate = document.querySelector("#todo-due");
        const status = document.querySelector("#status");
        title.value = todo[0].title;
        status.value = todo[0].status;
        const date = new Date(todo[0].dueDate);
        dueDate.value = date.toISOString().split("T")[0];
    }
}

async function createTodo(event, action, id) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    console.log(token);
    const title = document.querySelector("#todo-title").value;
    const dueDate = document.querySelector("#todo-due").value;
    const status = document.querySelector("#status").value;

    // const response = await axios.post("/todos/add", {
    //     headers: {
    //         authorization: `Bearer ${token}`
    //     }
    // },
    // {
    //     title,
    //     dueDate,
    //     status
    // })
    if (action==="add") {
        const res = await axios({
            method: 'post',
            url: '/todos/add',
            headers: {
                authorization: `Bearer ${token}`
            },
            data: {
                title,
                dueDate,
                status
            }
        });
        toast(res);
    }
    else if (action==="edit") {
        const res = await axios({
            method: 'put',
            url: `/todos/edit/${id}`,
            headers: {
                authorization: `Bearer ${token}`
            },
            data: {
                title,
                dueDate,
                status
            }
        });
        toast(res);
    }
    closeTodoPopup();
    displayTodos();
}

async function deleteTodo(id) {
    const token = localStorage.getItem("token");
    const res = await axios({
        method: 'delete',
        url: `/todos/${id}`,
        headers: {
            authorization: `Bearer ${token}`
        }
    });
    toast(res);
    displayTodos();
}

async function modifyStatus(id, status) {
    const token = localStorage.getItem("token");
    console.log(status);
    const res = await axios({
        method: 'put',
        url: `/todos/edit/${id}`,
        headers: {
            authorization: `Bearer ${token}`
        },
        data: {
            status: status
        }
    });
    toast(res);
    displayTodos();
}

async function displayTodos() {
    const response = await getAllTodos();
    generateCards(response.todos);
}


function toast(response) {
    const popupDiv = document.querySelector('.toast-popup');
    const toastNotify = document.createElement('div');
    toastNotify.classList.add('toast');
    if (response.status === 200 || response.status ===201) {
        toastNotify.classList.add('success');
        toastNotify.innerHTML = `<i class="fa-solid fa-circle-check fa-xl" style="color: #4BB543;"></i>${response.data.msg}`;
    }
    else {
        toastNotify.classList.add('error');
        toastNotify.innerHTML = `<i class="fa-solid fa-circle-exclamation fa-xl" style="color: #cd2323;"></i>${response.data.msg}`;
    }
    popupDiv.appendChild(toastNotify);
    setTimeout(() => {
        popupDiv.removeChild(toastNotify);
    }, 2000);
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/user/signin"
}

authenticated();

displayTodos();
