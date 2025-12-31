export const schemaValidator =(schema)=>(req,res,next)=>{
     console.log('Validating:', req.body);
    const {error,value}= schema.validate(req.body);
    if(error) {
        return res.status(400).json({error:error.details})
    }
    else{
req.body = value;
next();
    }
    
}