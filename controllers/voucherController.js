import pkg, { Status } from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();





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
    const { status } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    
    if (!status) {
      return res.status(400).json({
        error: "Status parameter is required"
      });
    }

    //  filters  status + logged-in user
    const where = {
      ...req.userFilter, //filters - soft delete
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




    // Create the voucher
    const newVoucher = await prisma.voucher.create({
      data: {
        date: parsedDate,
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
        amountFigures: parseFloat(amountFigures),
        amountWords,

        user_id: {
          connect: { id: userId },
        },
        createdBy: {
          connect:{
            id:userId,
            
            
          }
        }
      },
    });

    // Save uploaded PDF documents (Cloudinary URLs)
    if (req.files && req.files.length > 0) {
      const documentsData = req.files.map((file) => ({
        filename: file.originalname,
        filetype: file.mimetype,
        filepath: file.path, // Cloudinary URL
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

export const updateVoucher = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  
  try {
    const voucher = await prisma.voucher.findUnique({ where: { id } });
    
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
      
    }
  
    // Check if user is the creator (only creators can edit their own drafts)
    if (voucher.createdById !== user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }
    
    // Only draft vouchers can be edited
    if (voucher.status !== Status.DRAFT) {
      return res.status(400).json({ message: "Only DRAFT vouchers can be edited" });
    }
    
      // Create a copy and remove protected fields
    const allowedFields = { ...req.body };
    delete allowedFields.id;
    delete allowedFields.voucherNo;
    delete allowedFields.createdById;
    delete allowedFields.createdBy;
    delete allowedFields.createdAt;
    delete allowedFields.status;
    delete allowedFields.userId;
    delete allowedFields.user_id;
    delete allowedFields.updatedAt;
    
    const updated = await prisma.voucher.update({
      where: { id },
      data: allowedFields,
    });
    
    return res.status(200).json(
      {
      message: "Voucher updated",
      updated,
    });
  } catch (error) {
    console.error("Error updating voucher:", error);
    res.status(500).json({ message: "Error updating voucher" });
  }
};

export const submitVoucher = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  
  try {
    const voucher = await prisma.voucher.findUnique({ where: { id } });
    
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    
    // Check ownership 
    if (voucher.createdById !== user.id) {
      return res.status(403).json({ 
        message: "Not allowed. You can only submit your own vouchers." 
      });
    }
    
    // Only draft vouchers can be submitted
    if (voucher.status !== Status.DRAFT) {
      return res.status(400).json({ 
        message: "Only DRAFT vouchers can be submitted" 
      });
    }
    
    const updated = await prisma.voucher.update({
      where: { id },
      data: { status: Status.INITIATED },
    });
    
    return res.status(200).json({ 
      message: "Voucher submitted successfully", 
      data: updated 
    });
  } catch (error) {
    console.error("Error submitting voucher:", error);
    return res.status(500).json({ message: "Error submitting voucher" });
  }
};

export const reviewVoucher = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  
  try {
    const voucher = await prisma.voucher.findUnique(
      { where: { id } }
    );
    
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    
    // Check if voucher is in the correct status for review
    if (voucher.status !== Status.INITIATED) {
      return res.status(400).json({ 
        message: "Voucher must be in INITIATED status to start review",
        currentStatus: voucher.status 
      });
    }
    
    //Prevent reviewing own vouchers
    if (voucher.createdById === user.id) {
      return res.status(403).json({ 
        message: "You cannot review your own voucher" 
      });
    }
    
    const updated = await prisma.voucher.update({
      where: { id },
      data: {
        status: Status.IN_REVIEW,
        reviewedById: user.id,
        reviewedAt: new Date(),
      },
    });
    
    return res.status(200).json({ 
      message: "Voucher review started successfully", 
      data: updated 
    });
  } catch (error) {
    console.error("Error reviewing voucher:", error);
    return res.status(500).json({ message: "Error starting voucher review" });
  }
};

export const sendBackVoucher = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const user = req.user;
  
  try {
    const voucher = await prisma.voucher.findUnique({ where: { id } });
    
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    
    // Check if voucher is in a valid status to send back
    if (![Status.INITIATED, Status.IN_REVIEW].includes(voucher.status)) {
      return res.status(400).json({ 
        message: "Voucher must be in INITIATED or IN_REVIEW status",
        currentStatus: voucher.status 
      });
    }
    
    // Prevent sending back own vouchers
    if (voucher.createdById === user.id) {
      return res.status(403).json({ 
        message: "You cannot send back your own voucher" 
      });
    }
    
    const updated = await prisma.voucher.update({
      where: { id },
      data: {
        status: Status.DRAFT,
        reviewComment: comment,
        reviewedById: user.id,
        reviewedAt: new Date(),
      },
    });
    
    return res.status(200).json({ 
      message: "Voucher sent back to initiator for revisions", 
      data: updated 
    });
  } catch (error) {
    console.error("Error sending voucher back:", error);
    return res.status(500).json({ message: "Error sending voucher back" });
  }
};

export const approveVoucher = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  
  try {
    const voucher = await prisma.voucher.findUnique({ where: { id } });
    
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    
    // Check if voucher is in the correct status for approval
    if (voucher.status !== Status.IN_REVIEW) {
      return res.status(400).json({ 
        message: "Voucher must be in IN_REVIEW status for approval",
        currentStatus: voucher.status 
      });
    }
    
    // Optional: Prevent approving own vouchers
    if (voucher.createdById === user.id) {
      return res.status(403).json({ 
        message: "You cannot approve your own voucher" 
      });
    }
    
    // Optional: Prevent approving if you're also the reviewer
    if (voucher.reviewedById === user.id) {
      return res.status(403).json({ 
        message: "You cannot approve a voucher you reviewed" 
      });
    }
    
    const updated = await prisma.voucher.update({
      where: { id },
      data: {
        status: Status.APPROVED,
        approvedById: user.id,
        approvedAt: new Date(),
      },
    });
    
    return res.status(200).json({ 
      message: "Voucher approved successfully", 
      data: updated 
    });
  } catch (error) {
    console.error("Error approving voucher:", error);
    return res.status(500).json({ message: "Error approving voucher" });
  }
};


export const rejectVoucher = async (req, res) => {
  const { id } = req.params;
  const { rejectionReason } = req.body; 
  const user = req.user;
  
  try {
    const voucher = await prisma.voucher.findUnique({ where: { id } });
    
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    
    // Check if voucher is in the correct status for rejection
    if (voucher.status !== Status.IN_REVIEW) {
      return res.status(400).json({ 
        message: "Voucher must be in IN_REVIEW status for rejection",
        currentStatus: voucher.status 
      });
    }
    
    // Optional: Prevent rejecting own vouchers
    if (voucher.createdById === user.id) {
      return res.status(403).json({ 
        message: "You cannot reject your own voucher" 
      });
    }
    
    //  Prevent rejecting if you're also the reviewer
    if (voucher.reviewedById === user.id) {
      return res.status(403).json({ 
        message: "You cannot reject a voucher you reviewed" 
      });
    }
    
    const updated = await prisma.voucher.update({
      where: { id },
      data: {
        status: Status.REJECTED,
        rejectedById: user.id,
        rejectedAt: new Date(),
        rejectionReason,
      },
    });
    
    return res.status(200).json({ 
      message: "Voucher rejected", 
      data: updated 
    });
  } catch (error) {
    console.error("Error rejecting voucher:", error);
    return res.status(500).json({ message: "Error rejecting voucher" });
  }
};


export const deleteVoucherById = async (req, res) => {
  try {
    const { id } = req.params;

    // Auth check
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const voucher = await prisma.voucher.findUnique({
      where: { id },
    });

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    // Only DRAFT vouchers can be soft deleted
    if (voucher.status !== Status.DRAFT) {
      return res.status(400).json({
        message: "Only draft vouchers can be soft deleted",
      });
    }

    // Already soft deleted
    if (voucher.deletedAt) {
      return res.status(400).json({
        message: "Voucher already soft deleted",
      });
    }

    // Soft delete voucher
    const deletedVoucher = await prisma.voucher.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        status: true,
        deletedAt: true,
      },
    });

    console.log(`Voucher ${id} soft deleted by user ${req.user.id}`);

    return res.status(200).json({
      message: "Voucher soft deleted successfully",
      deletedVoucher,
    });
  } catch (error) {
    console.error("Delete voucher error:", error);
    return res.status(500).json({
      message: "Failed to delete voucher",
      error: error.message,
    });
  }
};



export const restoreVoucherById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }


    const voucher = await prisma.voucher.findUnique({
      where: { id },
    });

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    // Check if it's actually soft deleted
    if (!voucher.deletedAt) {
      return res.status(400).json({
        message: "Voucher is not deleted or already restored",
      });
    }

    // Restore voucher
    const restoredVoucher = await prisma.voucher.update({
      where: { id },
      data: {
        deletedAt: null,
      },
      select: {
        id: true,
        status: true,
        deletedAt: true,
      },
    });

    console.log(`Voucher ${id} restored by ${req.user.role} ${req.user.id}`);

    return res.status(200).json({
      message: "Voucher restored successfully",
      restoredVoucher,
    });
  } catch (error) {
    console.error("Restore voucher error:", error);
    return res.status(500).json({
      message: "Failed to restore voucher",
      error: error.message,
    });
  }
};




































