const express = require('express')
const passport = require('passport')
const router = express.Router()

// redirect to google users
router.get('/google', passport.authenticate('google', { scope: ['profile']}))

// callback after successful authentication
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/'}),
    (req, res) => {
        res.redirect('/dashboard')
    })

// logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router