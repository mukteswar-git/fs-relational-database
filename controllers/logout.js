const router = require('express').Router()

const { Session } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, async (req, res, next) => {
  try {
    const authorization = req.get('authorization')
    const token = authorization.substring(7)

    await Session.destroy({
      where: {
        userId: req.user.id
      }
    })

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router
