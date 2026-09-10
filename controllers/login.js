const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

router.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({
    where: {
      username
    }
  })

  if (!user) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const passwordCorrect = await bcrypt.compare(
    password,
    user.passwordHash
  )

  if (!passwordCorrect) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  if (user.disabled) {
    return res.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, SECRET)

  // Store the session in the database
  await Session.create({
    token,
    userId: user.id
  })

  res.status(200).json({
    token,
    username: user.username,
    name: user.name
  })
})

module.exports = router
