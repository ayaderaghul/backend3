import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../src/db.js'
import {authMiddleware} from '../middleware/auth.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

router.post('/follow', authMiddleware, async(req,res) =>{
    const {userIdToFollow} = req.body
    const userId = req.user.userId

    if(userIdToFollow === userId) {
        return res.status(400).json({error: 'cannot follow yourself'})
    }

    try {
        await db.follow.create({
            data: {follower_id: userId, followee_id: userIdToFollow}
        })
        res.status(201).json({message: 'followed succesfully'})
    }catch(err) {
        console.error(err)
        res.status(500).json({error: 'could not follow user'})
    }
})


router.delete('/follow', authMiddleware, async(req,res) =>{
    const {userIdToUnfollow} = req.body
    const userId = req.user.userId 

    try {
        await db.follow.deleteMany({
            where: {follower_id: userId, followee_id: userIdToUnfollow}
        })
        res.json({message: 'unfollowed successfully'})
    } catch(err){
        console.error(err)
        res.status(500).json({error: 'could not unfollow user'})
    }
})

export default router