const Note = require('./note')
const Blog = require('./blog')
const User = require('./user')
const { sequelize } = require('../util/db')
const Team = require('./team')
const Membership = require('./membership')
const UserNotes = require('./user_notes')
const ReadingList = require('./reading_list')
const Session = require('./session')

User.hasMany(Note)
Note.belongsTo(User)

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })

User.belongsToMany(Note, {
  through: UserNotes,
  as: 'marked_notes'
})

Note.belongsToMany(User, {
  through: UserNotes,
  as: 'users_marked'
})

User.belongsToMany(Blog, {
  through: ReadingList,
  as: 'readingList'
})

Blog.belongsToMany(User, {
  through: ReadingList,
  as: 'readers'
})

User.hasMany(Session)
Session.belongsTo(User)

module.exports = {
  Note,
  Blog,
  User,
  sequelize,
  Team,
  Membership,
  UserNotes,
  ReadingList,
  Session
}
