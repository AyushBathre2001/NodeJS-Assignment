const express = require('express');
const lodash = require('lodash')


const router = express.Router()


const searchFunction = async (query) => {
    const response = await fetch(process.env.REQUEST_URL, {
        method: 'GET',
        headers: {
            'x-hasura-admin-secret': process.env.REQUEST_URL_SECRET,
        },
    });

    if (!response.ok) {
        return
    }

    const blogs = await response.json();

    const word = query.charAt(0).toUpperCase() + query.slice(1)

    const blog = blogs.blogs.filter((item) => {
        return (item.title.includes(query) || item.title.includes(word));
      });

      return blog
}

const search = lodash.memoize(searchFunction, (...args) => lodash.values(args).join("_"));

router.get('/blog-search',async (req, res) => {
    try {
      
        const blog = await search(req.query.query)

        if(!blog){
            res.json({"success":false,"msg":"API is unavailable"})
        }

        res.send(blog)
        
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
    }
})

module.exports = router
