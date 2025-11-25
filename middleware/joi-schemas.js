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