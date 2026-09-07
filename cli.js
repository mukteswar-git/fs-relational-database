require('dotenv').config()

const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres'
})

const main = async () => {
  try {
    const [results] = await sequelize.query('SELECT * FROM blogs')

    results.forEach(blog => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    })
  } catch (error) {
    console.error(error)
  } finally {
    await sequelize.close()
  }
}

main()
