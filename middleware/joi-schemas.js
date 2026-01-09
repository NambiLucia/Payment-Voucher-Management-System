import Joi from "joi";

export const codeSchema=Joi.object({
name:Joi.string()
        .min(3)
        .max(50)
        .required()
        .trim(),
code: Joi.string()
        .min(3)
        .max(100)
        .required()
        .pattern(/^(ACC|BUD|BEN)-\d+$/)
        .uppercase()


})

export const updateCodeSchema=Joi.object({
name:Joi.string()
        .min(3)
        .max(50)
        .trim(),
code: Joi.string()
        .min(3)
        .max(100)
        .pattern(/^(ACC|BUD|BEN)-\d+$/)
        .uppercase()

}).min(1);

export const voucherSchema = Joi.object({
    date:Joi.string().required(),
    voucherNo:Joi.string().required(),
    payee:Joi.string().min(3).max(50).required(),        
    voucherDetails:Joi.string().min(3).max(300).required(), 
    accountCode:Joi.string().min(3).max(50).required(),
    beneficiaryCode:Joi.string().min(3).max(50).required(),
    budgetCode:Joi.string().min(3).max(50).required(),
    exchangeRate:Joi.number().required(), 
    amountFigures:Joi.number().required(), 
    amountWords:Joi.string().min(3).max(100).required(),
    

})

export const userSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(50)
        .alphanum(),
        // .required(),
    
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: true } })
        .max(100),
        // .required(),
    
    password: Joi.string()
        .min(8)
        .max(100)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        }),
})

