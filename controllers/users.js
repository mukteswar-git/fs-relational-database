const router = require('express').Router()

const { User, Blog } = require('../models')

const bcrypt = require('bcrypt')

router.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await User.create({
      username,
      name,
      passwordHash
    })

    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog
      }
    })

    res.json(users)
  } catch (error) {
    next(error)
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username
      }
    })

    if (!user) {
      return res.status(404).end()
    }

    user.name = req.body.name
    await user.save()

    res.json(user)
  } catch (error) {
    next(error)
  }
})

module.exports = router
