import pkg, { Status } from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";
const upload = uploadMiddleware("filesUploaded");


// Get Vouchers
export const getVouchers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Get vouchers and total count in parallel
    const [vouchers, total] = await Promise.all([
      prisma.voucher.findMany({
        where: req.userFilter,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.voucher.count({
        where: req.userFilter,
      }),
    ]);

    return res.status(200).json({
      message: "Vouchers retrieved successfully",
      data: vouchers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        resultsPerPage: limit,
        resultsOnPage: vouchers.length,
      },
    });
  } catch (error) {
    console.error("Error fetching vouchers:", error);

    return res.status(500).json({
      error: "An error occurred while fetching vouchers",
    });
  }
};


// Get vouchers by UserID
export const getVouchersByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Get vouchers and total count in parallel
    const [vouchers, total] = await Promise.all([
      prisma.voucher.findMany({
        where: {
          ...req.userFilter,
          userId: id, // Changed from voucherId to userId
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.voucher.count({
        where: {
          ...req.userFilter,
          userId: id,
        },
      }),
    ]);

    // Handle no vouchers found
    if (vouchers.length === 0) {
      return res.status(404).json({
        message: "No vouchers found for this user",
      });
    }

    return res.status(200).json({
      message: "User vouchers retrieved successfully",
      data: vouchers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        resultsPerPage: limit,
        resultsOnPage: vouchers.length,
      },
    });
  } catch (error) {
    console.error("Error fetching user vouchers:", error);

    return res.status(500).json({
      error: "An error occurred while fetching user vouchers",
    });
  }
};

//Get voucher by voucher ID
export const getVoucherByVoucherId = async(req,res)=>{
  try{
      
        const voucher= await prisma.voucher.findUnique({
            where:{
           id:req.params.id,
           deletedAt:null //exclude soft deleted vouchers
            }
          
        })

         if (!voucher) {
      return res.status(404).json({ error: "Voucher not found" });
    }


       return res.status(200)
            .json({
            message: "Voucher retrieved successfully",
            data: voucher,
            requestedAt: new Date().toISOString(),
            
        })

    }
    catch(error){
      console.error("Error fetching vouchers", error)
        return res.status(500).json({
           error: "An error occurred while fetching the voucher"
        })

    }
}

//Get filtered vouchers

export const getFilteredVouchers = async (req, res) => {
  try {
    const { status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    
    if (!status) {
      return res.status(400).json({
        error: "Status parameter is required"
      });
    }

    //  filters - soft delete + status + logged-in user
    const where = {
      ...req.userFilter,
      status: status,
      userId: req.user.id
    };

    
    const [vouchers, total] = await Promise.all([
      prisma.voucher.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.voucher.count({ where })
    ]);

    return res.status(200).json({
      message: `${status} vouchers retrieved successfully`,
      data: vouchers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        resultsPerPage: limit,
        resultsOnPage: vouchers.length
      }
    });

  } catch (error) {
    console.error('Error fetching filtered vouchers:', error);

    return res.status(500).json({
      error: "An error occurred while fetching vouchers"
    });
  }
};
// create voucher
export const createVoucher = async (req, res) => {
  try {
    const {
      date,
      voucherNo,
      payee,
      voucherDetails ,
      accountCode,
      beneficiaryCode,
      budgetCode,
      exchangeRate,
      amountFigures,
      amountWords,
    } = req.body;

    const userId = req.user.id;
    const parsedDate = new Date(date);

// ✅ Check all records in PARALLEL (much faster)
    const [account, budget, beneficiary] = await Promise.all([
      prisma.account.findUnique({ where: { code: accountCode } }),
      prisma.budget.findUnique({ where: { code: budgetCode } }),
      prisma.beneficiary.findUnique({ where: { code: beneficiaryCode } }),
    ]);

    // Validate all at once
    const errors = [];
    if (!account) errors.push(`Account '${accountCode}' not found`);
    if (!budget) errors.push(`Budget '${budgetCode}' not found`);
    if (!beneficiary) errors.push(`Beneficiary '${beneficiaryCode}' not found`);

    if (errors.length > 0) {
      return res.status(404).json({
        error: "Related records not found",
        details: errors,
      });
    }







    // Create the voucher
    const newVoucher = await prisma.voucher.create({
      data: {
        date: parsedDate,
        voucherNo: parseInt(voucherNo),
        payee,
        voucherDetails ,

        accountCode: {
          connect: { code: accountCode },
        },

        beneficiaryCode: {
          connect: { code: beneficiaryCode },
        },

        budgetCode: {
          connect: { code: budgetCode },
        },

        exchangeRate: parseFloat(exchangeRate),
        amountFigures,
        amountWords,

        user_id: {
          connect: { id: userId },
        },
      },
    });

    // Save uploaded PDF documents (Cloudinary URLs)
    if (req.files && req.files.length > 0) {
      const documentsData = req.files.map((file) => ({
        filename: file.originalname,
        filetype: file.mimetype,
        filepath: file.path, // Cloudinary secure URL
        voucherId: newVoucher.id,
      }));

      await prisma.document.createMany({
        data: documentsData,
      });
    }

    // Return success response
    return res.status(201).json({
      message: "Voucher created successfully",
      data: newVoucher,
      documents: req.files?.map((file) => ({
        name: file.originalname,
        url: file.path,
      })),
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error:"Failed to create voucher",
    });
  }
};

// export const approveVoucher = async (req, res) => {
//   const { id } = req.params;
//   const user = req.user;

//   if (user.role !== "ADMIN") {
//     return res
//       .status(403)
//       .json({ message: "Access denied: Only admins can approve vouchers" });
//   }

//   try {
//     const voucher = await prisma.voucher.findUnique({
//       where: { id },
//     });

//     if (!voucher) {
//       return res.status(404).json({ message: "Voucher not found" });
//     }

//     if (voucher.status === "APPROVED") {
//       return res.status(400).json({ message: "Voucher is already approved" });
//     }

//     // Optional: allow approval only from specific states
//     if (!["PENDING", "IN_REVIEW"].includes(voucher.status)) {
//       return res.status(400).json({
//         message: `Voucher cannot be approved from status ${voucher.status}`,
//       });
//     }

//     const updatedVoucher = await prisma.voucher.update({
//       where: { id },
//       data: {
//         status: "APPROVED",
//       },
//     });

//     return res.status(200).json({
//       message: "Voucher approved successfully",
//       voucher: updatedVoucher,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error approving voucher",
//       error: error.message,
//     });
//   }
// };

// export const updateVoucherById = async (req, res) => {
//   try {
//     const updatedVoucher = await prisma.voucher.update({
//       where: {
//         id: req.params.id,
//       },
//       data: req.body,
//     });

//     if (!updatedVoucher) {
//       return res.status(404).json({ error: "Voucher not found" });
//     }

//     return res.status(200).json({
//       message: "Voucher updated",
//       updatedVoucher,
//     });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

