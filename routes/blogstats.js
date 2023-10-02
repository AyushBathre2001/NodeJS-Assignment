const express = require('express');
const blogAnalysis = require('../middleware/analysis');

const router = express.Router()

router.get('/blog-stats',blogAnalysis, async (req, res) => {
    try {
        
        const blogStats = req.stats
        res.json({"success":true,"stats":blogStats})

    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
    }
})

module.exports = router
