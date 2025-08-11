import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config/index";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: "",
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
  sizes: "", // stored as comma-separated string in form
};

// Convert comma-separated string to array for backend
const normalizeSizes = (sizesStr) =>
  sizesStr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    // Make sure sizes is sent as an array
    const cleanedFormData = {
      ...formData,
      sizes: normalizeSizes(formData.sizes),
      image: uploadedImageUrl || formData.image, // ✅ ensure image is sent
    };

    if (currentEditedId !== null) {
      dispatch(
        editProduct({
          id: currentEditedId,
          formData: cleanedFormData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setUploadedImageUrl("");
          setCurrentEditedId(null);
          setOpenCreateProductsDialog(false);
          toast({ title: "Product updated successfully" });
        }
      });
    } else {
      dispatch(addNewProduct(cleanedFormData)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setUploadedImageUrl("");
          setFormData(initialFormData);
          toast({ title: "Product added successfully" });
        }
      });
    }
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({ title: "Product deleted" });
      }
    });
  }

  function isFormValid() {
    return (
      uploadedImageUrl && // ✅ image must be uploaded
      Object.keys(formData)
        .filter((key) => key !== "averageReview" && key !== "image")
        .every((key) => formData[key] && formData[key].toString().trim() !== "")
    );
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  function handleEdit(product) {
    setOpenCreateProductsDialog(true);
    setCurrentEditedId(product?._id);
    setFormData({
      ...product,
      sizes: Array.isArray(product?.sizes)
        ? product.sizes.join(", ")
        : product.sizes || "",
    });
    setUploadedImageUrl(product?.image || "");
  }

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                handleDelete={handleDelete}
                product={productItem}
                onEdit={handleEdit}
              />
            ))
          : null}
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(open) => {
          if (!open) {
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setUploadedImageUrl("");
          }
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
