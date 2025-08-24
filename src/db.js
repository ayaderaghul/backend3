import { PrismaClient } from '@prisma/client'
// import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient()

async function testConnection() {
    try {
        await prisma.$connect()
        console.log('connected to postgres via prisma')
    } catch (err) {
        console.error('database connection failed', err)
    } finally {
        await prisma.$disconnect()
    }
}

testConnection()
export default prisma