const noteRouter = require('express').Router()
const Note = require('../models/note')


noteRouter.get('/', (req, res) => {
  // res.json(notes)
  Note.find({}).then(notes=>{
    res.json(notes);
  })
})

noteRouter.get('/:id', (request, response, next)=>{
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
  // 一般来说，如果id格式正确，那么note为null，
  // 而id格式不正确，则会引发mongodb的错误，在catch中处理
  .catch(error=>next(error))
  // if(note){  // 如果没有找到，那么note将为undefined
  //   res.json(note);
  // }
  // else{
  //   res.status(404).end();
  // }
  // res.json(note);
})

noteRouter.post('/', (request, response,next) => {
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
  note.save()
    .then(savedNote=>{
      response.json(savedNote)
    })
    .catch(error=>next(error))
  // notes = notes.concat(note);
  // response.json(note);
})

noteRouter.delete('/:id', (request, response, next)=>{
  Note.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  
  .catch(error => next(error))
})

noteRouter.put('/:id', (request, response, next) => {
  const body = request.body;
  const note = {
    content: body.content,
    important: body.important,
  }
  Note.findByIdAndUpdate(request.params.id, note, {new: true})
  .then(updatedNote => {
    response.json(updatedNote);
  })
  .catch(error => next(error))
})

module.exports = noteRouter;