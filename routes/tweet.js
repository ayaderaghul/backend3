import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../src/db.js'
import {authMiddleware} from '../middleware/auth.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

router.post('/', authMiddleware, async(req,res) =>{
    const {content} = req.body
    if (!content || content.trim() === '') {
        return res.status(400).json({error: 'tweet content required'})
    }

    try {
        const tweet = await db.tweet.create({
            data: {
                content,
                user_id: req.user.userId
            }
        })
        res.status(201).json(tweet)
    } catch(err) {
        console.error(err)
        res.status(500).json({error: 'could not create tweet'})
    }
})


router.get('/timeline', authMiddleware, async(req,res) =>{
    const userId = req.user.userId
    try {
        const follows = await db.follow.findMany({
            where: {follower_id: userId},
            select: {followee_id: true}
        })

        const followingIds = follows.map(f => f.followee_id)

        followingIds.push(userId)

        const tweets = await db.tweet.findMany({
            where: {user_id: {in:followingIds}},
            include: {user: {select: {id: true, username: true}}},
            orderBy: {created_at: 'desc'},
            take: 50
        })

        res.json(tweets)
    }catch(err){
        console.error(err)
        res.status(500).json({error: 'could not fetch timeline'})
    }
})


router.get('/:id', authMiddleware, async (req,res)=>{
    // const tweetId = parseInt(req.params.id, 10)
    const tweetId = req.params.id

    try {
        const tweet = await db.tweet.findUnique({
            where:{id: tweetId},
            include: {user:{select:{id:true, username:true}}}
        })

        if(!tweet) return res.status(404).json({error: 'tweet not found'})
        res.json(tweet)
    }catch(err){
        console.error(err)
        res.status(500).json({error: 'could not fetch tweet'})
    }
})



export default router 