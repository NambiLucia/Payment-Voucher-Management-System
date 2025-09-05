import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//Get Users
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: {
        id: "desc",
      },
    });

    return res.status(200).json({ "All Users": users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Register User
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return res
      .status(201)
      .json({ message: "New User registered Successfully", newUser });
  } catch (error) {
    console.error("Error creating users:", error);
    return res
      .status(500)
      .json({ error: "Error occurred while registering new User" });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({ error: "Wrong Password" });
    }

    const userToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role, 
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    const date = new Date();
    console.log(
      userToken,
      `Token Generated at:- ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    );

    return res.status(200).json({
      message: "Successful User Login",
      userToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
};

//Update User
export const updateUserById =async(req,res) =>{
 try {
        if (!req.params.id) {
            return res.status(400).json({ error: "User ID is required" });
          }

      const updatedUser = await prisma.user.update({
        where: {
          id: req.params.id,
        },
        data: req.body,
      });
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found"});
      }
      return res.status(200).json({message:`User updated`,updatedUser});
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message });
    }
}

export const deleteUserById = async (req, res) => {
  try {
    const { isHardDelete } = req.query; // e.g. /users/1?isHardDelete=true
    const userId = req.params.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (isHardDelete === "true") {
      // Permanent delete (admin only!)
      await prisma.user.delete({ where: { id: userId } });
      return res.status(200).json({ message: "User permanently deleted" });
    } else {
      // Soft delete
      const deletedUser = await prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() }
      });
      return res.status(200).json({
        message: "User soft deleted successfully",
        deletedUser
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


