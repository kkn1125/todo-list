const $ = (el) => document.querySelector(el);

const todoList = [];

function createTodo() {
  const todo = $("#insert").value;
  todoList.push(todo);
  update();
}

function createTodoItem(content) {
  clear();
  const item = document.createElement("div");
  item.classList.add("item");
  item.innerHTML = content;
  return item;
}

function update() {
  $("#list").innerHTML = "";
  todoList.forEach((item) => {
    $("#list").append(createTodoItem(item));
  });
}

function clear() {
  $("#insert").value = "";
}

$("#btn").addEventListener("click", createTodo);
