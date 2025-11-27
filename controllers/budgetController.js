import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const CODE_PATTERN = /^BUD-\d+$/;

export const getBudgetCodes = async (req, res) => {
  try {
    const budgetCodes = await prisma.budget.findMany({
      include: {
        vouchers: true,
      },
      orderBy:{
        createdAt:'desc'
      }
    });

    if(budgetCodes.length===0){
      return res.status(200).json({
        message:"No Budget codes found",
        data:[],
        results:0
,      })
    }

    return res.status(200).json({
      message: "Budget codes retrieved successfully",
      data: budgetCodes,
      results: budgetCodes.length,
    });

  } catch (error) {
    console.error('Error fetching budget codes:', error);

    return res.status(500).json({
      error: "An error occurred while fetching budget codes"
    });
  }
};

//Create code
export const createBudgetCode = async (req, res) => {
  try {
    const { name, code } = req.body;

    // Validate format
    if (!CODE_PATTERN.test(code)) {
      return res.status(400).json({
        error: "Budget codes must follow the format 'BUD-<number>'",
      });
    }

    // create directly - let database enforce uniqueness
    const newBudget = await prisma.budget.create({
      data: {
        name: name.trim(),
        code: code.toUpperCase(),
      },
    });

    return res.status(201).json({
      message: "New Budget Code created successfully",
      data: newBudget,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "This Budget code already exists" });
    }
  }
};

export const updateBudgetCodeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (code) updateData.code = code.toUpperCase();

    // Update code
    const updatedCode = await prisma.budget.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      message: "Budget Code updated successfully",
      data: updatedCode,
    });
  } catch (error) {
    console.error("Error updating budget code:", error);

    //not found error
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Budget Code not found",
      });
    }

    return res.status(500).json({
      error: "An error occurred while updating the Budget code",
    });
  }
};

export const deleteBudgetCodeById = async (req, res) => {
  try {
    const { id } = req.params;

    //Delete
    const deletedBudgetCode = await prisma.budget.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Budget Code deleted successfully",
      data: deletedBudgetCode,
    });
  } catch (error) {
    console.error("Error deleting Budget code:", error);

    // not found error
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Budget Code not found",
      });
    }

    return res.status(500).json({
      error: "An error occurred while deleting the Budget code",
    });
  }
};
