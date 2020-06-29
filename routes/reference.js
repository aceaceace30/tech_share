const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Reference = require('../models/Reference')

router.get('/add', ensureAuth, (req, res) => {
    res.render('reference/add')
})

router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Reference.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})

router.get('/', ensureAuth, async (req, res) => {
    try {
        const reference = await Reference.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc'})
            .lean()

        res.render('reference/index', {
            reference: reference,
        })

    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})

module.exports = router