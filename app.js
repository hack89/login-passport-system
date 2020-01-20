const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
require('./config/passport')(passport)
const cors = require('cors')
const db = require('./config/keys').MongoURI
const app = express()
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

//routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))


const PORT = process.env.PORT || 5000




mongoose.connect(db, { useNewUrlParser: true }, () => console.log('database connected'))

app.listen(PORT, console.log(`served started in port ${PORT}`))