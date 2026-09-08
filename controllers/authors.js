const router = require('express').Router()
const { Blog, sequelize } = require('../models')

router.get('/', async (req, res, next) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        'author',
        [sequelize.fn('COUNT', sequelize.col('id')), 'blogs'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
      ],
      group: ['author'],
      order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']]
    })

    res.json(authors)
  } catch (error) {
    next(error)
  }
})

module.exports = router
