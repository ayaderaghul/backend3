import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../src/db.js'
import {authMiddleware} from '../middleware/auth.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

router.get("/:username", authMiddleware, async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user?.userId

    const user = await db.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        created_at: true,
        followers: {
            select: {
                follower_id: true,
                follower: {select: {id: true, username: true}}, // include username here
            },
        },
        followees: {
            select: {
                followee_id: true,
                followee: {select: {id: true, username: true}},
            },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // determine if current user can follow this profile
    let isFollowing = false
    if (currentUserId) {
        const followRecord = await db.follow.findUnique({
            where: {
                follower_id_followee_id: {
                    follower_id: currentUserId,
                    followee_id: user.id
                }
            }
        })
        isFollowing = !!followRecord
    }

    res.json({...user, isFollowing, currentUserId: req.user.userId});
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/follow', authMiddleware, async(req,res) =>{
    const {userIdToFollow} = req.body

    if (!userIdToFollow) {
        return res.status(400).json({ message: "userIdToFollow is required" });
    }

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