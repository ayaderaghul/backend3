import express from 'express'
import dotenv from 'dotenv'
import prisma from './src/db.js'
import authRouter from './routes/auth.js'
import tweetRouter from './routes/tweet.js'
import followRouter from './routes/follow.js'


import {authMiddleware} from './middleware/auth.js'

dotenv.config()

const app = express()
app.use(express.json())

app.get('/ping', (req, res) => {
    res.status(200).send('pong')
})

app.get('/users', async(req,res) =>{
    const users = await prisma.user.findMany()
    res.json(users)
})

app.use('/api/v1', authRouter)
app.use('/api/v1/tweets', tweetRouter)
app.use('/api/v1/users', followRouter)

app.get('/profile', authMiddleware, (req,res) =>{
    res.json({message: `Hello user ${req.user.userId}`})
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () =>{
    console.log(`Backend running on http://localhost:${PORT}`)
})