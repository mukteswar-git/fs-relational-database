const { DataTypes, Sequelize } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      allowNull: true
    })

    await queryInterface.addConstraint('blogs', {
      fields: ['year'],
      type: 'check',
      where: {
        year: {
          [Sequelize.Op.gte]: 1991,
          [Sequelize.Op.lte]: new Date().getFullYear()
        }
      },
      name: 'blogs_year_check'
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint(
      'blogs',
      'blogs_year_check'
    )

    await queryInterface.removeColumn('blogs', 'year')
  }
}
