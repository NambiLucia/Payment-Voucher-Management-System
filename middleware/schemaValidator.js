export const schemaValidator = (schema, options = {}) => (req, res, next) => {
    console.log('Validating:', req.body);

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details });
    }

    
    // Check for req.files (array) 
    if (options.requireFile && (!req.files || req.files.length === 0)) {
        return res.status(400).json({ error: "PDF file is required" });
    }

    req.body = value;
    next();
};