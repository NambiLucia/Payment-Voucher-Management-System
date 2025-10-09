import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

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

