const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
// const password = '138118lk';
// const url = `mongodb+srv://sixgramwater:${password}@cluster0.mfqr1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

// 格式化Mongoose返回的对象：修改Schema 的 toJSON 方法
noteSchema.set('toJSON',{
  transform: (document, returnedObject)=>{
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})
// model： define a model or retrieve from it
const Note = mongoose.model('Note', noteSchema)

module.exports = Note