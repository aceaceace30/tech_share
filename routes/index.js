const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Reference = require('../models/Reference')

router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const reference = await Reference.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            reference,
        })
    } catch(err) {
        console.log(err)
        res.render('error/500')
    }
})

module.exports = router