const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

userRouter.post('/', async (request, response) => {
  const body = request.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })
  const savedUser = await user.save()
  response.json(savedUser)
})

userRouter.get('/', (request, response) => {
  const users = User.find({}).populate('notes', {content: 1, data: 1});
  response.json(users);
  // User.find({}).then(users => {
  //   response.json(users);
  // })
})

userRouter.delete('/:id', (request, response, next) => {
  User.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error=>next(error))
})

module.exports = userRouter;