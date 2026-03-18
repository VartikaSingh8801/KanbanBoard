function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var id = ev.dataTransfer.getData("text");
    var task = document.getElementById(id);
    var column = ev.target.closest(".To, .Toon, .Tocom");
    if (column != null && task != null) {
        column.appendChild(task);
        saveBoard();
    }
}

function saveBoard() {
    var todo = [];
    var progress = [];
    var done = [];
    var todoTasks = document.querySelectorAll(".To input");
    var progressTasks = document.querySelectorAll(".Toon input");
    var doneTasks = document.querySelectorAll(".Tocom input");
    for (var i = 0; i < todoTasks.length; i++) {
        todo.push(todoTasks[i].value);
    }
    for (var i = 0; i < progressTasks.length; i++) {
        progress.push(progressTasks[i].value);
    }
    for (var i = 0; i < doneTasks.length; i++) {
        done.push(doneTasks[i].value);
    }
    var board = {
        todo: todo,
        progress: progress,
        done: done
    };
    localStorage.setItem("kanbanProgress", JSON.stringify(board));
}

window.onload = function () {
    var stored = localStorage.getItem("kanbanProgress");
    document.querySelector(".To").innerHTML = "<h3>To-Do</h3><button onclick='addTask()' class='add-btn'>+ New Task</button>";
    document.querySelector(".Toon").innerHTML = "<h3>On Progress</h3>";
    document.querySelector(".Tocom").innerHTML = "<h3>Completed</h3>";
    if (stored != null) {
        var data = JSON.parse(stored);
        renderTasks(".To", data.todo);
        renderTasks(".Toon", data.progress);
        renderTasks(".Tocom", data.done);
    }
};

function renderTasks(columnClass, list) {
    var column = document.querySelector(columnClass);
    for (var i = 0; i < list.length; i++) {
        var task = document.createElement("div");
        task.className = "task-bar";
        task.draggable = true;
        task.id = "task-" + columnClass.replace(".", "") + "-" + Math.random().toString(36).substr(2, 5);
        task.ondragstart = drag;
        task.innerHTML = '<input type="text" value="' + list[i] + '" placeholder="+ Add your task here" oninput="saveBoard()">' + 
                         '<span class="delete-btn" onclick="deleteTask(this)">X</span>';
        
        column.appendChild(task);
    } 
}

function deleteTask(element) {
    var taskToDelete = element.parentElement;
    taskToDelete.remove();
    saveBoard(); 
}

function addTask() {
    renderTasks(".To", [""]);
    saveBoard();
}