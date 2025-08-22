import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
 import jwt from 'jsonwebtoken'
 import bcrypt from 'bcrypt'
 




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

    return res.status(200).json({"All Users":users});

  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const register =async(req,res) =>{
try{
const {username,email,password}=req.body
const existingUser =await prisma.user.findUnique({
  where:{email}
})
if(existingUser){
  return res.status(400).json({message:"Email already in use"})
}

const hashedPassword =await bcrypt.hash(hashedPassword,10)
 const newUser = await prisma.user.create({
  data:{
    username,
    email,
    password:hashedPassword

  }
 })

 return res.status(201).json({'message':"New User registered Successfully",newUser})


}
catch(error){
console.error("Error creating users:", error);
    return res.status(500).json({error:"Error occured while registering new User"})
}
}