const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport')


router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})


//register handle

router.post('/register', async(req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        const user = await User.findOne({ email: email })
        if (user) {
            errors.push({ msg: 'Email already exists' });
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            });
        } else {
            const newUser = new User({
                name,
                email,
                password
            });


            const salt = await bcrypt.genSalt(10);
            newUser.password = await bcrypt.hash(password, salt)

            try {
                await newUser.save()
                req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                )
                res.redirect('/users/login');
            } catch (err) {
                console.log(err);
            }


        };
    }
});


//login 

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

//logout


router.get('/logout', (req, res) => {
    req.logOut();
    req.flash(
        'success_msg',
        'You are logged out'
    )
    res.redirect('/users/login')
})

module.exports = router