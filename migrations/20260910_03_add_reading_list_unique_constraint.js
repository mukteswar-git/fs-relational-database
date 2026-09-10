module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addConstraint('reading_lists', {
      fields: ['user_id', 'blog_id'],
      type: 'unique',
      name: 'reading_lists_user_id_blog_id_unique'
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint(
      'reading_lists',
      'reading_lists_user_id_blog_id_unique'
    )
  }
}
