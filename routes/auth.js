import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../src/db.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

router.post('/signup', async(req, res) => {
    const {email, password, username} = req.body

    // 1. validate input
    if (!email || !password) {
        return res.status(400).json({error: 'email and pasword are required'})
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({error: 'invalid email format'})
    }

    if (password.length < 6) {
        return res.status(400).json({error: 'Password must be at least 6 characters'})
    }

    // 2. check if user exists

    const existingUser = await db.user.findUnique({ where: { email}})
    if (existingUser) {
        return res.status(409).json({error: 'email already registered'})
    }

    // 3. create user



    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await db.user.create({
            data: {email, password_hash: hashedPassword, username}
        })

        const token = jwt.sign({userId: newUser.id}, JWT_SECRET, {expiresIn: '1d'})
        
        res.status(201).json({token})
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

router.post('/login', async(req,res) =>{
    const {email, password} = req.body
    if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

    try {
        // 1. find user
        const user = await db.user.findUnique({where: {email}})
        if (!user) return res.status(401).json({error: 'invalid credentials'})
        
        if (!user.password_hash) {
            return res.status(500).json({ error: 'User has no password stored' });
        }
            


        // 2.compare password
        const isMatch = await bcrypt.compare(password, user.password_hash)
        if(!isMatch) return res.status(401).json({error: 'invalid credentials'})
        // 3. create jwt
        const token= jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '1d'})

        res.json({token})
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})



export default router 