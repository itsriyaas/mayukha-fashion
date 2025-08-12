const Feature = require("../../models/Feature");

/**
 * Add a new feature image
 */
const addFeatureImage = async (req, res) => {
  try {
    const { image, public_id, altText } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    const featureImage = new Feature({
      image,
      public_id: public_id || null,
      altText: altText || "",
    });

    await featureImage.save();

    res.status(201).json({
      success: true,
      data: featureImage,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

/**
 * Get all feature images
 */
const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

/**
 * Delete a feature image
 */
const deleteFeatureImage = async (req, res) => {
  try {
    const { id } = req.params;
    const featureImage = await Feature.findById(id);

    if (!featureImage) {
      return res.status(404).json({
        success: false,
        message: "Feature image not found",
      });
    }

    // Optional: If using Cloudinary, delete from Cloudinary as well
    // if (featureImage.public_id) {
    //   await cloudinary.uploader.destroy(featureImage.public_id);
    // }

    await Feature.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Feature image deleted successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = { addFeatureImage, getFeatureImages, deleteFeatureImage };
