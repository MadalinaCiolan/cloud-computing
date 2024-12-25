// 1. Import libraries
const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

const postsRoute = require('./routes/posts')
const commentsRoute = require('./routes/comments')
const likesRoute = require('./routes/likes')
const dislikesRoute = require('./routes/dislikes')
const authRoute = require('./routes/auth')

// 2. Middleware
app.use(bodyParser.json())
app.use('/posts', postsRoute)
app.use('/comments', commentsRoute)
app.use('/likes', likesRoute)
app.use('/dislikes', dislikesRoute)
app.use('/user', authRoute)

// 3. Create routes
app.get('/', (req, res) => {
    res.send('Welcome to Piazza System home page!')
})

mongoose.connect(process.env.DB_CONNECTOR)
    .then(() => console.log('Your mongoDB connector is on!'))
    .catch((err) => console.error('Error connecting to MongoDB', err))



//4. Start the server
app.listen(3002, () => {
    console.log('Piazza server is up and running')
})
