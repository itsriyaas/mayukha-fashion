import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList, isLoading } = useSelector(
    (state) => state.commonFeature
  );

  // ✅ Handle add feature image
  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) return;

    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  // ✅ Handle delete feature image
  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id));
  }

  // ✅ Fetch on mount
  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      {/* Image Upload */}
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />

      {/* Upload Button */}
      <Button
        onClick={handleUploadFeatureImage}
        className="mt-5 w-full"
        disabled={isLoading || !uploadedImageUrl}
      >
        {isLoading ? "Uploading..." : "Upload"}
      </Button>

      {/* Images List */}
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList?.length > 0 ? (
          featureImageList.map((featureImgItem) => (
            <div key={featureImgItem._id} className="relative">
              <img
                src={featureImgItem.image}
                className="w-full h-[300px] object-cover rounded-t-lg"
                alt="Feature"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                disabled={isLoading}
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No feature images added yet.</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
