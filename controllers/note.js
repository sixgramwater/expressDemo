const noteRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

noteRouter.get('/', (req, res) => {
  // 使用populate完成级联查询
  // populate(path, select): path->表示需要填充的字段，select表示选取什么字段
  // 前提：user字段必须事先定义了ref
  const notes = Note.find({}).populate('user', {username: 1, name: 1});
  res.json(notes);
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

// steps to create a note:
// 1. figure out who create it (userId)
// 2. create a note based on this user 
// 3. put this user info into this note 
// 4. update the user.notes array 
noteRouter.post('/', async (request, response,next) => {
  const body = request.body
  const user = await User.findById(body.userId); 
  console.log(user);

  if(!body.content){
    return response.status(400).json({  // 注意这里需要return,要不然系统需要运行到最后
      error: 'content missing'
    })
  }
  
  const note = new Note({
    content: body.content,
      // id: generateId(),
    important: body.important || false,  // 默认值
    date: new Date(),
    user: user._id,
  })
  try{
    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    response.json(savedNote)
  } 
  catch (error){
    console.log(error)
  }
  // const savedNote = await note.save()

  // // REMINDER: update user.note array !!
  // user.notes = user.notes.concat(savedNote._id)
  // await user.save()
  // response.json(savedNote)
  // note.save()
  //   .then(savedNote=>{
  //     response.json(savedNote)
  //   })
  //   .catch(error=>next(error))
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