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


// error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  // 在这个中间件之前捕获到了error,在这个中间件里面我们根据error.name处理不同类型的错误
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
}