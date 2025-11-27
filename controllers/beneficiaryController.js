import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const CODE_PATTERN = /^BEN-\d+$/;

export const getBeneficiaryCodes = async (req, res) => {
  try {
    const beneficiaryCodes = await prisma.beneficiary.findMany({
      include: {
        vouchers: true,
      },
      orderBy:{
        createdAt:'desc'
      }
    });

    if(beneficiaryCodes.length===0){
      return res.status(200).json({
        message:"No Beneficiary codes found",
        data:[],
        results:0
,      })
    }

    return res.status(200).json({
      message: "Beneficiary codes retrieved successfully",
      data: beneficiaryCodes,
      results: beneficiaryCodes.length,
    });

  } catch (error) {
    console.error('Error fetching Beneficiary codes:', error);

    return res.status(500).json({
      error: "An error occurred while fetching Beneficiary codes"
    });
  }
};

//Create code
export const createBeneficiaryCode = async (req, res) => {
  try {
    const { name, code } = req.body;

    // Validate format
    if (!CODE_PATTERN.test(code)) {
      return res.status(400).json({
        error: "Beneficiary codes must follow the format 'BEN-<number>'",
      });
    }

    // create directly - let database enforce uniqueness
    const newBeneficiary = await prisma.beneficiary.create({
      data: {
        name: name.trim(),
        code: code.toUpperCase(),
      },
    });

    return res.status(201).json({
      message: "New Beneficiary Code created successfully",
      data: newBeneficiary,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "This Account code already exists" });
    }
  }
};

export const updateBeneficiaryCodeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (code) updateData.code = code.toUpperCase();

    // Update code
    const updatedCode = await prisma.beneficiary.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      message: "Beneficiary Code updated successfully",
      data: updatedCode,
    });
  } catch (error) {
    console.error("Error updating Beneficiary code:", error);

    // Handle not found error
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Beneficiary Code not found",
      });
    }

    return res.status(500).json({
      error: "An error occurred while updating the Beneficiary code",
    });
  }
};

export const deleteBeneficiaryCodeById = async (req, res) => {
  try {
    const { id } = req.params;

    //Delete
    const deletedAccount = await prisma.beneficiary.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Beneficiary Code deleted successfully",
      data: deletedAccount,
    });
  } catch (error) {
    console.error("Error deleting Beneficiary code:", error);

    // not found error
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Beneficiary Code not found",
      });
    }

    return res.status(500).json({
      error: "An error occurred while deleting the Beneficiary code",
    });
  }
};
