export const schemaValidator =(schema)=>(req,res,next)=>{
    const {error,value}= schema.validate(req.body);
    if(error) {
        return res.status(400).json({error:error.details})
    }
    else{
req.body = value;
next();
    }
    
}