import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const getDocument = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1); // Prevent page < 1
    const limit = 10;
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where: req.userFilter,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: { 
          id: true,
          filename: true,
          filepath: true,
          createdAt: true,
         
        },
      }),
      prisma.document.count({
        where: req.userFilter,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      message: "Documents retrieved successfully",
      data: documents,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults: total,
        resultsPerPage: limit,
        resultsOnPage: documents.length,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching documents:", error);

    return res.status(500).json({
      error: "An error occurred while fetching documents",
    });
  }
};





export const deleteDocumentById = async (req, res) => {
  try {
    const { id: documentId } = req.params;
    const isHardDelete = req.query.isHardDelete === "true";

    // Admin check for hard delete
    if (isHardDelete && req.user.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden: Only admins can permanently delete documents",
      });
    }

    // Fetch document
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return res.status(404).json({
        error: "Document not found",
      });
    }

    // Authorization check: User can only delete their own documents (unless admin)
    if (req.user.role !== "admin" && document.userId !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden: You can only delete your own documents",
      });
    }

    // Already soft deleted
    if (document.deletedAt && !isHardDelete) {
      return res.status(400).json({
        error: "Document is already deleted",
      });
    }

    // Hard delete (permanent removal)
    if (isHardDelete) {
      // Delete from Cloudinary first
      if (document.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(document.cloudinaryPublicId, {
            resource_type: "raw", // for PDFs
          });
        } catch (cloudinaryError) {
          console.error("Cloudinary deletion failed:", cloudinaryError);
          // Continue with database deletion even if Cloudinary fails
        }
      }

      // Delete from database
      await prisma.document.delete({
        where: { id: documentId },
      });

      return res.status(200).json({
        message: "Document permanently deleted",
      });
    }

    // Soft delete
    const deletedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        deletedAt: true,
      },
    });

    return res.status(200).json({
      message: "Document soft deleted successfully",
      data: deletedDocument,
    });
  } catch (error) {
    console.error("Delete document error:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Document not found",
      });
    }

    return res.status(500).json({
      error: "An error occurred while deleting the document",
    });
  }
};

