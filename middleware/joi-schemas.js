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
    date:Joi.string().isoDate().required(),
    voucherNo:Joi.string().required(),
    payee:Joi.string().min(3).max(50).required(),        
    paymentDetails:Joi.string().min(3).max(300).required(), 
    accountCode:Joi.string().min(3).max(50).required(),
    beneficiaryCode:Joi.string().min(3).max(50).required(),
    budgetCode:Joi.string().min(3).max(50).required(),
    exchangeRate:Joi.number().required(), 
    amountFigures:Joi.number().required(), 
    amountWords:Joi.string().min(3).max(100).required(),
    

})