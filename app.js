const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const connectDB = require('./config/db')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')

// routes definition
const router = require('./routes/index')
const auth = require('./routes/auth')
const reference = require('./routes/reference')

dotenv.config({ path: './config/config.env' })

// Passporrt config
require('./config/passport')(passport)

connectDB()

const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars helpers
const { formatDate } = require('./helpers/hbs')


// Handlebars
app.engine('.hbs', exphbs({ helpers: { formatDate }, defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

// Session
app.use(session({
    secret: 'kingkang',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', router)
app.use('/auth', auth)
app.use('/reference', reference)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Running in ${process.env.NODE_ENV} mode on port ${PORT}`))