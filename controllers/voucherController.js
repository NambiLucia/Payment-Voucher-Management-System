import pkg from "@prisma/client";
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
           id:req.params.id
            }
          
        })

         if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }


        res.status(200)
            .json({
            voucher:voucher,
            requestedAt: new Date().toISOString(),
            
        })

    }
    catch(error){
        return res.status(500).json({
           error: error.message
        })

    }
}

//Get filtered vouchers

export const getFilteredVouchers = async(req,res)=>{
    try{
      const {status}=req.query
      const filters={}

      if (status) {
      filters.status = status;
    }
      const vouchers=await prisma.voucher.findMany({
        where: filters,
        orderBy:{
            createdAt:'desc'
        }
         })
         
        res.status(200).json({
          results:vouchers

        })
     

    }
    catch(error){
      res.status(500).json({error:error.message})
    }

}

// create voucher

