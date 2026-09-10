const router = require('express').Router()

const { User, Blog, Team, Note } = require('../models')

const bcrypt = require('bcrypt')

const { tokenExtractor, isAdmin } = require('../util/middleware')
const { PORT } = require('../util/config')

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
      include: [
        {
          model: Blog
        },
        {
          model: Team,
          attributes: ['name', 'id'],
          through: {
            attributes: []
          }
        }
      ]
    })

    res.json(users)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Note,
          attributes: { exclude: ['userId'] }
        },
        {
          model: Note,
          as: 'marked_notes',
          attributes: { exclude: ['userId'] },
          through: {
            attributes: []
          }
        },
        {
          model: Blog,
          as: 'readingList',
          through: {
            attributes: ['id', 'read'],
            ...(req.query.read !== undefined && {
              where: {
                read: req.query.read === 'true'
              }
            })
          }
        }
      ]
    })

    if (!user) {
      return res.status(404).end()
    }

    let teams = undefined

    if (req.query.teams) {
      teams = await user.getTeams({
        attributes: ['name'],
        joinTableAttributes: []
      })
    }

    if (user) {
      res.json({
        name: user.name,
        username: user.username,
        readings: user.readingList.map(blog => ({
          id: blog.id,
          url: blog.url,
          title: blog.title,
          author: blog.author,
          likes: blog.likes,
          year: blog.year,
          reading_list: {
            read: blog.reading_list.read,
            id: blog.reading_list.id
          }
        })),
        teams
      })
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

router.put(
  '/:username',
  tokenExtractor,
  isAdmin,
  async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          username: req.params.username
        }
      })

      if (!user) {
        return res.status(404).end()
      }

      user.disabled = req.body.disabled

      await user.save()

      res.json(user)
    } catch (error) {
      next(error)
    }
  }
)

module.exports = router
