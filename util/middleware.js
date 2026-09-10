const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { User, Session } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')

  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({
      error: 'token missing'
    })
  }

  const token = authorization.substring(7)

  try {
    req.decodedToken = jwt.verify(token, SECRET)
  } catch {
    return res.status(401).json({
      error: 'token invalid'
    })
  }

  const session = await Session.findOne({
    where: {
      token
    }
  })

  if (!session) {
    return res.status(401).json({
      error: 'session expired'
    })
  }

  const user = await User.findByPk(session.userId)

  if (!user || user.disabled) {
    return res.status(401).json({
      error: 'user disabled'
    })
  }

  req.user = user

  next()
}

const isAdmin = async (req, res, next) => {
  if (!req.user.admin) {
    return res.status(401).json({
      error: 'operation not allowed'
    })
  }

  next()
}

module.exports = {
  tokenExtractor,
  isAdmin
}
