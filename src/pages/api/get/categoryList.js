import { PrismaClient } from '../../../generated/prisma'

const prisma = new PrismaClient()

export default async function handler(req, res){
    if(req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed'})
    }

    try {
        const categories =  await prisma.Category.findMany()
        res.status(200).json(categories)
    }  catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch categories'})
    }
}