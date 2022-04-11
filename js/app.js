import { setCookie, getCookie } from "./utilities.js"
let username = getCookie("username")

function isChecked(ele) {
     $(ele).find(".form-check-label").css("text-decoration", "line-through")
     $(ele).removeClass("bg-primary");
     $(ele).addClass("bg-danger");
     $(ele).find(".form-check-input").removeClass("bg-primary")
     $(ele).find(".form-check-input").addClass("bg-danger")
}
function unchecked(ele) {
     $(ele).find(".form-check-label").css("text-decoration", "none")
     $(ele).addClass("bg-primary");
     $(ele).removeClass("bg-danger");
     $(ele).find(".form-check-input").removeClass("bg-danger")
}
function createIdTask(TodoList) {
     let aId = []
     let idTask = $(TodoList).attr("id")
     $(TodoList).find(".task").each(function (index, ele) {
          aId.push($(ele).attr("id"))
     })
     let i = 1
     while (i < 1000) {
          let id = idTask + "_Task" + i
          if (aId.indexOf(id) == -1)
               return id
          i++
     }

}
function createIdTodoList() {
     let aId = []
     $("#TodoLists").find(".todoList").each(function (index, ele) {
          aId.push($(ele).attr("id"))
     })
     let i = 1
     while (i < 1000) {
          let id = "todoList" + i
          if (aId.indexOf(id) == -1)
               return id
          i++
     }

}

function createTask(todoList, cTodoList, data) {
     let id = createIdTask(todoList)
     let content = $(todoList).find(".inpNameTDL").val()
     let checked = false
     if (data) {
          id = data.id
          content = data.content
          checked = data.checked
     }
     let check = ""
     if (checked == 'true') {
          check = "checked"
     }
     let task = `<input class="form-check-input" ${check} type="checkbox">`
     task = task + `<label class="form-check-label ms-2" style="overflow:hidden; max-width:750px; white-space: nowrap;"> ${content} </label>`
     task = task + `<div class="mx-auto "></div><button class="btn btn-outline-primary rm"><i class="bi bi-trash "></i></button>`
     task = `<div class="nav">${task}</div>`;
     task = $.parseHTML(`<li id="${id}" class="list-group-item bg-primary bg-opacity-10 bg-primary task fs-5" >${task}</li>`)
     let cTask = {
          id,
          content,
          checked,
     }
     addEventChangeTask(cTodoList, task, cTask)
     addEventRemoveTask(cTodoList, task, cTask)
     return { task, cTask }
}

function addTask(cTodoList, task, cTask) {
     $(`#${cTodoList.id}`).find(".list-group").append(task)
     let data = { idTodo: cTodoList.id, cTask }
     save(data, 'addTask')
}
function addEventRemoveTask(cTodoList, task, cTask) {
     $(task).find('.rm').click(function () {
          $(task).remove();
          let data = { idTodo: cTodoList.id, cTask }
          save(data, "removeTask")
     })
}
function changeStatusTask(idTodo, idTask, status) {
     let data = { idTodo, idTask, status }
     save(data, "changeTask")
}
function addEventChangeTask(cTodoList, task, cTask) {
     let fun = function () {
          if ($(this).find("input[type='checkbox']")[0].checked) {
               isChecked(task)
               changeStatusTask(cTodoList.id, cTask.id, true)
          }
          else {
               unchecked(task)
               changeStatusTask(cTodoList.id, cTask.id, false)
          }
     }
     $(task).change(fun)
}


function createToDoList(data) {
     let id = createIdTodoList()
     let name = $("#inputNameTDL").val();
     console.log(data)
     if (data) {
          id = data.id
          name = data.name
     }
     let todoList = `<p class="text-center text-primary fs-4">${name}<p><input type="text" class="inpNameTDL form-control fs-5 bg-primary bg-opacity-10" placeholder="Add Task" value="" /></p>`
     todoList = todoList + `<ul class="list-group fs-5"> </ul>`
     todoList = `<div id="${id}" class="border boder-primary mb-3 todoList">${todoList}</div>`
     todoList = $.parseHTML(todoList)
     let cTodoList = {
          id,
          name,
     }
     return { todoList, cTodoList }
}
function isLoggedIn() {
     if (username != "")
          return true
     return false
}


function addTodoList(todoList, cTodoList) {
     $("#TodoLists").append(todoList)
     save(cTodoList, "addTodo")
}
function addEventCreateTask(todoList, cTodoList) {
     $(todoList).find(".inpNameTDL").on("keypress", function (e) {
          if (e.keyCode == "13") {
               let { task, cTask } = createTask(todoList, cTodoList)
               addTask(cTodoList, task, cTask)
          }
     })
}
function loadTodoList() {
     let id = $("#idTodo").text()
     $.get("/getData/" + id, {}, function (data) {
          if (data.length > 0) {
               data.map(function (val) {
                    let { todoList, cTodoList } = createToDoList(val)
                    addEventCreateTask(todoList, cTodoList)
                    $("#TodoLists").append(todoList)
                    val.taskList.map(function (ele) {
                         console.log(ele)
                         let { task } = createTask(todoList, cTodoList, ele)
                         $(todoList).append(task)
                         if (ele.checked == 'true') {
                              isChecked(task)
                         }
                    })
               })
          }
     })
}
function save(data, url) {
     $.ajax('/' + url, {
          method: 'PUT',
          data: {
               username,
               data: data
          },
          complete: function () {
               // location.reload()
          }
     })
}
if (isLoggedIn()) {
     loadTodoList()
     $("#name").text(`${username}`)
     $("#btn-login").text(`Logout`)
     $("#btnAddTDL").click(function () {
          let { todoList, cTodoList } = createToDoList()
          addEventCreateTask(todoList, cTodoList)
          addTodoList(todoList, cTodoList)
     })
}