const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')
const router = Router()

router.post('/login',
    [
        check('email', 'Email not found').isEmail(),
        check('password', 'Enter email').exists()
    ],
    async (request, response) => {
    try {
        let errors = validationResult(request)

        if (!errors.isEmpty()) {
            return response.status(400).json ({
                errors: errors.array(),
                message: 'Incorrect login data'
            })
        }

        let {email, password} = request.body

        let user = await User.findOne({ email })

        if (!user) {
            return response.status(400).json ({message: 'User not found'})
        }

        let isMatches = await bcrypt.compare(password, user.password)

        if (!isMatches) {
            return response.status(400).json({message: 'Invalid password. Try again'})
        }

        if (user.status === 'blocked') {
            return response.status(403).json({message: 'The user is blocked'})
        }

        let token = getToken(user.id)

        user.lastLogin = Date.now().toString()
        await user.save()

        response.status(200).json({ token, userId: user.id })

    } catch (e) {
        response.status(500).json({ message: '500. Error server'})
    }
})

router.post('/registration',
    [
        check('email', 'Incorrect email address').isEmail(),
        check('password', 'Enter password more than 1 character').isLength( {min: 1})
    ],
    async (request, response) => {
    try {
        let errors = validationResult(request)

        if (!errors.isEmpty()) {
            return response.status(400).json ({
                errors: errors.array(),
                message: 'Registration data is incorrect'
            })
        }
        let {name, email, password} = request.body
        let regUser = await User.findOne({email})
        if (regUser) {
            return response.status(400).json({message: 'User with this email already exists'})
        }

        let hashedPassword = await bcrypt.hash(password, 1)

        let date = Date.now().toString()

        let user = new User({
            name,
            email,
            password: hashedPassword,
            dateRegistration: date,
            lastLogin: date,
            status: 'unblocked'
        })

        await user.save()

        regUser = await User.findOne({ email })

        let token = getToken(regUser.id)

        response.status(201).json({ token, userId: regUser.id })

    } catch (e) {
        response.status(500).json({ message: '500. Error server'})
    }
})

function getToken(id) {
    return jwt.sign(
        { userId: id },
        config.get('jwtSecret'),
        { expiresIn: config.get('expiresToken') }
    )
}

module.exports = router