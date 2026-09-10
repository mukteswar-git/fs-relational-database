const router = require('express').Router()

const { ReadingList, User, Blog } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res, next) => {
  try {
    const { userId, blogId } = req.body

    if (!userId) {
      return res.status(400).json({
        error: 'userId is required'
      })
    }

    if (!blogId) {
      return res.status(400).json({
        error: 'blogId is required'
      })
    }

    const user = await User.findByPk(userId)

    if (!user) {
      return res.status(404).json({
        error: 'userId is not valid'
      })
    }

    const blog = await Blog.findByPk(blogId)

    if (!blog) {
      return res.status(404).json({
        error: 'blogId is not valid'
      })
    }

    const readingList = await ReadingList.create({
      userId,
      blogId
    })

    res.status(201).json({
      id: readingList.id,
      user_id: readingList.userId,
      blog_id: readingList.blogId,
      read: readingList.read
    })
  } catch (error) {
    next(error)
  }
})
router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const readingList = await ReadingList.findByPk(req.params.id)

    if (!readingList) {
      return res.status(404).end()
    }

    if (readingList.userId !== req.decodedToken.id) {
      return res.status(401).end()
    }

    readingList.read = req.body.read

    await readingList.save()

    res.json(readingList)
  } catch (error) {
    next(error)
  }
})

module.exports = router
