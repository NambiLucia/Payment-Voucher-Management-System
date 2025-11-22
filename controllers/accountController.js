import pkg, { Role } from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const getAccountCodes = async (req,res)=>{

    try{
        let accountCodes=await prisma.account.findMany({
            include:{
                vouchers:true
            }
        })
        res.status(200).json({
            accountCodes,
            results:accountCodes.length
        })

    }
    catch(error){
        return res.status(500).json({
           error: error.message
        })

    }

}

exports.createAccountCode =async(req,res)=>{
    try{
     
      const {name,code}=req.body;
      const existingCode =await prisma.account.findUnique({
        where:{code}
      })

      const codePattern = /^ACC-\d+$/;
      if(!codePattern.test(code)){
        return res.status(400).json({
            error:"Account codes must follow the format 'ACC-<number>'"
        })
      }

  
       if (existingCode) {
          return res.status(409).json({ error: "This Account code already exists" });
        }
    
  
      const newCode =await prisma.account.create({
          data:{
            name,   
            code
          }
      });
  
  
  return res.status(201).json({
      message: "New Account Code created successfully",
      AccountCode: newCode,
  });
  
    }
    catch(error){
    return res.status(500).json({
             error: error.message
          })
    }
  }