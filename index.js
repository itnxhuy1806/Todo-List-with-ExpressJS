let express = require('express')
let app = express()
let bcrypt = require('bcryptjs');
let fs = require('fs')
let path = require('path')
let _ = require('lodash')
let engines = require('consolidate')

let bodyParser = require('body-parser')

app.engine('hbs', engines.handlebars)
app.set('views', './views')
app.set('view engine', 'hbs')

app.use('/js', express.static('js'))
app.use(bodyParser.urlencoded({ extended: true }))

function checkLogin(data, acc) {
     for (let i = 0; i < data.length; i++) {
          if (data[i].username == acc.username && bcrypt.compareSync(acc.password, data[i].password)) {
               return true
          }
     }
     return false
}
function getData(fp) {
     let data
     try {
          data = JSON.parse(fs.readFileSync(fp, { encoding: 'utf8' }))
     }
     catch {
          data = []
     }
     return data
}
function saveFile(fp, data) {
     // fs.unlinkSync(fp) // delete the file
     fs.writeFileSync(fp, JSON.stringify(data, null, 2), { encoding: 'utf8' })
}
app.get('/', function (req, res) {
     let data = getData('./data.json')
     res.render('index', { data: data })
})
app.get('/login', function (req, res) {
     res.render('loginPage')
})
app.put('/login', function (req, res) {
     let fp = './dataAcc.json'
     let data = getData(fp)
     let acc = req.body
     if(checkLogin(data, acc))
          res.end()
})
app.get('/signUp', function (req, res) {
     res.render('SignUpPage')
})

app.put('/signUp', function (req, res) {
     let fp = './dataAcc.json'
     let data = getData(fp)
     let acc = req.body
     acc.password = bcrypt.hashSync(acc.password);
     data.push(acc)
     saveFile(fp, data)
     res.end()
})

app.put('/addTodo', function (req, res) {
     let fp = './data.json'
     let data = getData(fp)
     let dataU = data.filter(val => val.username == req.body.username)
     let todo = req.body.data
     todo.taskList = []
     if (dataU.length > 0) {
          dataU[0].todoList.push(todo)
     }
     else {
          data.push({
               username: req.body.username,
               todoList: [todo]
          })
     }
     saveFile(fp, data)
     res.end()
})
app.put('/addTask', function (req, res) {
     let fp = './data.json'
     let data = getData(fp)
     let task = req.body.data
     let dataU = data.filter(val => val.username == req.body.username)[0].todoList.filter(val => val.id == task.idTodo)
     dataU[0].taskList.push(task.cTask)
     saveFile(fp, data)
     res.end()
})
app.put('/removeTask', function (req, res) {
     let fp = './data.json'
     let data = getData(fp)
     let task = req.body.data
     let oldTaskList = data.filter(val => val.username == req.body.username)[0].todoList.filter(val => val.id = task.idTodo)[0].taskList
     data.filter(val => val.username == req.body.username)[0].todoList.filter(val => val.id = task.idTodo)[0]
          .taskList = oldTaskList.filter(val => val.id != task.cTask.id)
     saveFile(fp, data)
     res.end()
})
app.put('/changeTask', function (req, res) {
     let fp = './data.json'
     let data = getData(fp)
     let task = req.body.data
     console.log(task)
     console.log(data.filter(val => val.username == req.body.username)[0].todoList.filter(val => val.id == task.idTodo)[0]
          .taskList.filter(val => val.id == task.idTask)[0])
     data.filter(val => val.username == req.body.username)[0].todoList.filter(val => val.id == task.idTodo)[0]
          .taskList.filter(val => val.id == task.idTask)[0].checked = task.status
     saveFile(fp, data)
     res.end()
})



app.get("/getData", function (req, res) {
     let data = getData('./data.json')
     res.send(data)
})
let server = app.listen(3000, function () {
     console.log('Server running at http://localhost:' + server.address().port)
})