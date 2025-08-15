import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();


export const getUsers =async(req,res)=>{
    try{
        const limit = parseInt(req.query.limit) || 10;
        let users= await prisma.user.findMany({
            take:limit
        })
       return res.status(200).json(users)
    }
    catch(error){
        return res.json({
            error:error.message
        })

    }
}