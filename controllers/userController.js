import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";

//Get Users
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      where: req.userFilter,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
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
    const { username, email, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Generate temporary password
    const temporaryPassword = crypto.randomBytes(8).toString("hex");
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        changePassword: true,
      },
    });


    return res.status(201).json({
      message: "User created successfully",
      temporaryPassword: temporaryPassword, //remove this after
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      }
    });

  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Failed to create user" });
  }
};

//create super admin- this is for Nova team ONLY
export const createSuperAdmin = async (req, res) => {
  try {
    const { username, email, role,password } = req.body;


    if (role !== "ADMIN") {
      return res.status(400).json({ 
        message: "Only ADMIN role can be created via this endpoint" 
      });
    }

    // Check if email already in use
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSuperAdmin = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        changePassword: false,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return res.status(201).json({ 
      message: "Admin registered successfully", 
      admin: newSuperAdmin 
    });

  } catch (error) {
    console.error("Error creating admin:", error);
    return res.status(500).json({ 
      error: "Error occurred while registering admin" 
    });
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

//if must change password
if (user.changePassword) {
      const temporaryToken = jwt.sign(
        {
          id: user.id,
          role: user.role,
          changePassword: true,
        },
        process.env.SECRET_KEY,
        { expiresIn: "15m" }
      );

      return res.status(200).json({
        message: "Password change required",
        changePassword: true,
        token: temporaryToken,
      });
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

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { id: userId } 
    });

    const matchPassword= await bcrypt.compare(oldPassword, user.password);
    if (!matchPassword) {
      return res.status(401).json({ error: "Old password incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        changePassword: false,
      },
    });

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ error: "Failed to change password" });
  }
};







// forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a JWT token for password reset
    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }
    );

    // Create reset password link
    const resetLink = `${process.env.FRONTEND_URL.trim()}/reset-password?token=${resetToken}`;

    console.log("Reset Link:", resetLink);

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Send to the user's email
      subject: "NOVA Payment Password Reset Request",
      html: `
<h2>Hello ${user.username}</h2>
<p>Please click on the link below to reset your password:</p>
<p><a href="${resetLink}">${resetLink}</a></p>
<p><strong>Note:</strong> This reset link is valid for only 30 minutes.</p>
<p>Regards,<br>The Nova system team</p>
  `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Reset email sent to:", email);

    return res
      .status(200)
      .json({ message: "Password reset link sent succcesfully to your email" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    
    if (!resetToken) return res.status(400).json({ message: "Token is required" });
    if (!newPassword || newPassword.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.SECRET_KEY);
    } catch {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        // mustChangePassword: false, 
      },
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
















//Update User
export const updateUserById = async (req, res) => {
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
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: `User updated`, updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    console.error("Error code:", error.code);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found with that ID" });
    }

    return res.status(500).json({ error: error.message });
  }
};

//Delete User
export const deleteUserById = async (req, res) => {
  try {
    const isHardDelete = req.query.isHardDelete; //isHardDelete=true
    const userId = req.params.id;

    // Check if user is logged in
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // If hard delete, require admin role
    if (isHardDelete === "true" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already soft deleted
    if (user.deletedAt && isHardDelete !== "true") {
      return res.status(400).json({ message: "User already soft deleted" });
    }

    if (isHardDelete === "true") {
      await prisma.user.delete({ where: { id: userId } });
      return res.status(200).json({ message: "User permanently deleted" });
    }

    // Soft delete
    const deletedUser = await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
      select: { id: true, email: true, deletedAt: true },
    });

    return res.status(200).json({
      message: "User soft deleted successfully",
      deletedUser,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

