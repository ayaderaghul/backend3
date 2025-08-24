import {faker} from '@faker-js/faker'
import db from '../src/db.js'
import bcrypt from 'bcrypt'


const NUM_USERS = 20
const users = []

const password = "123456"
const hashedPassword = await bcrypt.hash(password, 10)


for (let i = 0; i < NUM_USERS; i++) {
    const user = await db.user.create({
        data: {
            username: faker.internet.username(),
            email: faker.internet.email(),
            password_hash: hashedPassword
        }
    })
    users.push(user)
}

for (const user of users) {
    const numFollows = faker.number.int({min: 3, max: 10})
    const followees = faker.helpers.shuffle(users)
        .filter(u => u.id !== user.id)
        .slice(0, numFollows)
    for (const followee of followees) {
        await db.follow.create({
            data: {
                follower_id: user.id,
                followee_id: followee.id
            }
        })
    }
}

for (const user of users) {
    const numTweets = faker.number.int({min: 2, max:5})

    for (let i=0; i < numTweets; i++) {
        await db.tweet.create({
            data: {
                user_id: user.id,
                content: faker.lorem.sentence({min: 5, max: 15}),
                created_at: faker.date.recent({days: 10})
            }
        })
    }
}