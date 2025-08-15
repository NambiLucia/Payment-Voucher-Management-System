import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();


export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; 
    const skip = (page - 1) * limit; 

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: {
        id: 'desc'
      }
    });

    return res.status(200).json(users);

  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};