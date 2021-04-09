require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')
app.use(express.json())  // express json-parser: 如果没有 json-parser，body 属性将是undefined的。 
// Json-parser 的功能是获取请求的 JSON 数据，将其转换为 JavaScript 对象，然后在调用路由处理程序之前将其附加到请求对象的 body 属性。

// logger middleware
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// unknown Endpoint middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(requestLogger)


// 

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  // res.json(notes)
  Note.find({}).then(notes=>{
    res.json(notes);
  })
})

app.get('/api/notes/:id', (request, response)=>{
  // const id = Number(req.params.id); // param中的id类型是string，而notes中的id类型是number
  // const note = notes.find(note=> note.id === id)
  Note.findById(request.params.id)
  .then(note=>{
    if(note){
      response.json(note)
    } else {
      response.status(404).end()  // Not find
    }
  })
  .catch(error=>{
    // console.log(error);
    // response.status(500).end()  // Internal server error
    console.log(error)
    response.status(400).send({ error: 'malformatted id' })  //400 bad request
  })
  // if(note){  // 如果没有找到，那么note将为undefined
  //   res.json(note);
  // }
  // else{
  //   res.status(404).end();
  // }
  // res.json(note);
})


const generateId = () => {
  const maxId = (notes.length>0)
  ? Math.max(...notes.map(note=>note.id))
  : 0
  return maxId + 1;
}

app.post('/api/notes', (request, response) => {
  const body = request.body
  if(!body.content){
    return response.status(400).json({  // 注意这里需要return,要不然系统需要运行到最后
      error: 'content missing'
    })
  }
  // const note = {
  //   content: body.content,
  //   id: generateId(),
  //   important: body.important || false,  // 默认值
  //   date: new Date(),
  // }
  const note = new Note({
    content: body.content,
      // id: generateId(),
    important: body.important || false,  // 默认值
    date: new Date(),
  })
  note.save().then(savedNote=>{
    response.json(savedNote)
  })
  // notes = notes.concat(note);
  // response.json(note);
})

// 让我们在路由之后添加如下中间件，它用于捕获对不存在的路由发出的请求。 对于这些请求，中间件将返回 JSON 格式的错误消息。
app.use(unknownEndpoint) 

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})