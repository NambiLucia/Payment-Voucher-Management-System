export const softDeleteFilter = (req, res, next) => {
  // Default filter: exclude soft-deleted users
  req.userFilter = { deletedAt: null };
  next();
};
