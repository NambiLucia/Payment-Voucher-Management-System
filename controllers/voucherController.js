import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Get Vouchers
export const getVouchers =async(req,res)=>{
     try{
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        let vouchers =await prisma.voucher.findMany({
            where: req.userFilter,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
            },

            
        })
        res.status(200).json({
            results:vouchers.length,
            vouchers:vouchers,
            requestedAt: new Date().toISOString(),
            
        })



    }
    catch(error){
        return res.status(500).json({
           error: error.message
        })

    }

}


// Get vouchers by UserID
export const getVouchersByUserId = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const vouchers = await prisma.voucher.findMany({
      where: {
        ...req.userFilter, 
        voucherId: req.params.id, // and filter by voucher ID
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      results: vouchers.length,
      vouchers,
      requestedAt: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
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

