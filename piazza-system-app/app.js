// 1. Import libraries
const express = require('express')
// const {restart} = require('nodemon') 
const app = express()

const mongoose = require('mongoose')
//const bodyParser = require('body-parser')
//require('dotenv/config')



const postsRoute = require('./routes/posts')
//const userRoute = require('./routes/user')

// 2. Middleware
app.use('/posts', postsRoute)
//app.use('/user',userRoute)

// 3. Create a route
app.get('/', (req,res)=>{
    res.send('Welcome to Piazza System home page!')
})

const MURL = 'mongodb+srv://mada85nrg:1234@cluster0.7vwyr.mongodb.net/Piazza?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(MURL)
    .then(()=> console.log('Your mongoDB connector is on!'))
    .catch((err)=> console.error('Error connecting to MongoDB', err))

   

//4. Start the server
app.listen(3002, ()=>{
    console.log('Piazza server is up and running')
})
