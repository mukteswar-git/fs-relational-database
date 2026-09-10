const router = require('express').Router()

const { Blog, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`
        }
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`
        }
      }
    ]
  }

  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  })

  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      userId: req.user.id
    })

    res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  if (req.blog.userId !== req.user.id) {
    return res.status(401).json({
      error: 'only the user who added the blog can delete it'
    })
  }

  await req.blog.destroy()
  res.status(204).end()
})

module.exports = router
