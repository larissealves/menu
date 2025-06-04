import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient()

export default async function handler (req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const {name, price, description, categoryID } =  req.body

    try {
        const newDish = await prisma.Dish.create ({
            data: {
                name,
                price,
                description,
                categoryID: parseInt(categoryID),
            },
    })

    res.status(200).json(newDish)

    } catch (error){
        console.log(error)
        res.status(500).json({error: 'Failed to create dish'})
    }
}