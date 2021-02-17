const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')

const app = express()

app.use(express.json({ extended: true}))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/data', require('./routes/data.routes'))
app.use(express.static(path.join(__dirname, 'public')))
// if (process.env.NODE_ENV === 'production') {
//     app.use('/', express.static(path.join(__dirname, 'client', 'build')))
//
//     app.get('*', ((req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//     }))
// }

const PORT = process.env.PORT || 5000

async function start() {
    try {
        await mongoose.connect(config.get('dbUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))


    } catch (e) {
        console.log('Server error', e.message)
        process.exit(-1);
    }
}

start()



