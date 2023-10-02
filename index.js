require('dotenv').config()
const express = require('express')
var cors = require('cors')

const app = express()

app.use(cors())

app.use('/api',require('./routes/blogstats'))
app.use('/api',require('./routes/searchBlog'))


app.listen(5000,()=>{
    console.log("Server is running")
})