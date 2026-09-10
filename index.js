const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const notesRouter = require('./controllers/notes')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorRouter = require('./controllers/authors')
const readingListsRouter = require('./controllers/readinglists')
const logoutRouter = require('./controllers/logout')

const {
  Blog,
  Note,
  User,
  ReadingList,
  Session,
  Membership,
  UserNotes
} = require('./models')

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: error.errors.map(error => error.message)
    })
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: error.errors.map(error => error.message)
    })
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({
      error: error.message
    })
  }

  next(error)
}

app.use(express.json())

app.use('/api/notes', notesRouter)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readinglists', readingListsRouter)
app.use('/api/logout', logoutRouter)

app.get('/', (req, res) => {
  res.status(200).end()
})

app.post('/api/reset', async (req, res, next) => {
  try {
    await ReadingList.destroy({ where: {} })
    await Session.destroy({ where: {} })
    await UserNotes.destroy({ where: {} })
    await Membership.destroy({ where: {} })
    await Blog.destroy({ where: {} })
    await Note.destroy({ where: {} })
    await User.destroy({ where: {} })

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
