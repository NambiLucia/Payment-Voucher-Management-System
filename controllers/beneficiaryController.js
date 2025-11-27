import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const CODE_PATTERN = /^ACC-\d+$/;

export const getAccountCodes = async (req, res) => {
  try {
    const accountCodes = await prisma.account.findMany({
      include: {
        vouchers: true,
      },
      orderBy:{
        createdAt:'desc'
      }
    });

    if(accountCodes.length===0){
      return res.status(200).json({
        message:"No Account codes found",
        data:[],
        results:0
,      })
    }

    return res.status(200).json({
      message: "Account codes retrieved successfully",
      data: accountCodes,
      results: accountCodes.length,
    });

  } catch (error) {
    console.error('Error fetching account codes:', error);

    return res.status(500).json({
      error: "An error occurred while fetching account codes"
    });
  }
};

//Create code
export const createAccountCode = async (req, res) => {
  try {
    const { name, code } = req.body;

    // Validate format
    if (!CODE_PATTERN.test(code)) {
      return res.status(400).json({
        error: "Account codes must follow the format 'ACC-<number>'",
      });
    }

    // create directly - let database enforce uniqueness
    const newAccount = await prisma.account.create({
      data: {
        name: name.trim(),
        code: code.toUpperCase(),
      },
    });

    return res.status(201).json({
      message: "New Account Code created successfully",
      data: newAccount,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "This Account code already exists" });
    }
  }
};

export const updateAccountCodeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (code) updateData.code = code.toUpperCase();

    // Update code
    const updatedCode = await prisma.account.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      message: "Account Code updated successfully",
      data: updatedCode,
    });
  } catch (error) {
    console.error("Error updating account code:", error);

    // Handle not found error
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Account Code not found",
      });
    }

    return res.status(500).json({
      error: "An error occurred while updating the account code",
    });
  }
};

export const deleteAccountCodeById = async (req, res) => {
  try {
    const { id } = req.params;

    //Delete
    const deletedAccount = await prisma.account.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Account Code deleted successfully",
      data: deletedAccount,
    });
  } catch (error) {
    console.error("Error deleting account code:", error);

    // not found error
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Account Code not found",
      });
    }

    return res.status(500).json({
      error: "An error occurred while deleting the account code",
    });
  }
};
