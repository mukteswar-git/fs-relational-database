require('dotenv').config()

const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')

const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres'
})

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

Blog.sync()

app.use(express.json())

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    res.json(blog)
  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params

  const deleted = await Blog.destroy({
    where: {
      id: id
    }
  })

  if (deleted === 0) {
    return res.status(404).json({
      error: 'Blog not found'
    })
  }

  res.status(204).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
