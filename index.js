const addTodo = document.getElementById("addTodo");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

addTodo.addEventListener("click", function (ev) {
    ev.preventDefault();
    let task = todoInput.value;
    const todoImage=document.getElementById("todoImage");
    if (task&&todoImage.files[0]) {
        const formData=new FormData();
        formData.append("todoImage",todoImage.files[0]);
        formData.append("task",task);
        formData.append("completed",false);
        fetch("/todo", {
            method: "POST",
            body: formData
        }).then(function (response) {
            if (response.status === 200) {
                todoInput.value = "";
                todoImage.value="";
                return response.json();
            }
            else {
                console.log("Something went wrong");
            }
        }).then(function(todo){
            displayTodo(todo);
        });
    }
    else {
        console.log("Something went wrong");
        return;
    }
});

fetch("/todo").then(function (response) {
    if (response.status === 200) {
        return response.json();
    }
    else {
        console.log("Something went wrong");
    }
}).then(function (todos) {
    todos.forEach(todo => {
        displayTodo(todo);
    });
});

function displayTodo(todo) {
    //function to create a node of todo
    const todoNode = document.createElement("div");
    todoNode.className="todoNode";
    const todoTask=document.createElement("div");
    todoTask.innerText = todo.task;
    todoNode.appendChild(todoTask);
    //create element for show image in todo
    const todoImage=document.createElement("img");
    todoImage.src=todo.todoImage;
    todoNode.appendChild(todoImage);
    
    //create element for actions to be performed on todolist
    const todoAction=document.createElement("span");
    const checkbox=document.createElement("input");
    checkbox.type="checkbox";
    checkbox.checked=JSON.parse(todo.completed);
    if(JSON.parse(todo.completed)){
        checkbox.disabled=true;
        todoTask.innerHTML=todoTask.innerText.strike();
    }
    checkbox.addEventListener("click",function(ev){
        //event when a todo is completed
        todo.completed=true;
        fetch("/todoComplete",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(todo)
        }).then(function (response) {
            if (response.status === 200) {
                console.log("successfully completed");
                todoTask.innerHTML=todoTask.innerText.strike();
                checkbox.disabled=true;
            }
            else {
                console.log("Something went wrong");
            }
        });
    });
    todoAction.appendChild(checkbox);
    //create button to delete todo
    const del=document.createElement("button");
    del.innerText="Delete";
    del.addEventListener("click",function(ev){
        //to delete a todo
        fetch("/todoDelete",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(todo)
        }).then(function (response) {
            if (response.status === 200) {                
                // todoNode.innerHTML="";
                todoList.removeChild(todoNode);
            }
            else {
                console.log("Something went wrong");
            }
        });
    });
    todoAction.appendChild(del);

    todoNode.appendChild(todoAction);
    todoList.appendChild(todoNode);
}