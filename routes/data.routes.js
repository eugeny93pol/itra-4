const {Router} = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth.middleware')
const router = Router()

const checkStatus = async (userId) => {
    const user = await User.findById(userId)
    return user && user.status === 'unblocked'
}

router.get('/load', auth, async (request, response) => {
    try {
        const status = await checkStatus(request.user.userId)
        if (!status) {
            return response.status(401).json('User blocked or removed')
        }
        const users = await User.find()
        users.map(user => {
            user.password = ''
        })
        response.json(users)
    } catch (e) {
        response.status(500).json({ message: '500. Error server'})
    }
})

router.post('/block', auth, async (request, response) => {
        try {
            if (!(await checkStatus(request.user.userId))) {
                return response.status(401).json('User blocked or removed')
            }
            const ids = request.body
            ids.forEach(async (id) => {
                const user = await User.findById(id)
                if (user) {
                    user.status = 'blocked'
                    await user.save()
                }
            })
            response.status(200).json({ message: 'Users blocked'})
        } catch (e) {
            response.status(500).json({ message: '500. Error server'})
        }
    })

router.post('/unblock', auth, async (request, response) => {
        try {
            if (!(await checkStatus(request.user.userId))) {
                return response.status(401).json('User blocked or removed')
            }

            const ids = request.body
            ids.forEach(async (id) => {
                const user = await User.findById(id)
                if (user) {
                    user.status = 'unblocked'
                    await user.save()
                }
            })
            response.status(201).json({ message: 'Users unblocked'})
        } catch (e) {
            response.status(500).json({ message: '500. Error server'})
        }
    })

router.post('/delete', auth, async (request, response) => {
        try {
            if (!(await checkStatus(request.user.userId))) {
                return response.status(401).json('User blocked or removed')
            }
            const ids = request.body
            ids.forEach(async (id) => {
                await User.findByIdAndDelete(id)
            })
            response.status(200).json({ message: 'Users deleted'})
        } catch (e) {
            response.status(500).json({ message: '500. Error server'})
        }
    })

module.exports = router