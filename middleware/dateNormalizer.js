// middleware/dateNormalizer.js
export const normalizeDateFormat = (req, res, next) => {
  if (req.body.date) {
    const date = req.body.date;
    
    // Check if it's DD/MM/YYYY format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const [day, month, year] = date.split('/'); // ← No regex match needed
      req.body.date = `${year}-${month}-${day}`;
    }
    // If it's already YYYY-MM-DD or ISO format, leave it as is
  }
  next();
};