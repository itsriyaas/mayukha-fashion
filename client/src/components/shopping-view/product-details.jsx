import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useNavigate } from "react-router-dom";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState(productDetails?.image);
  const [selectedSize, setSelectedSize] = useState("");

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  const handleRatingChange = (val) => setRating(val);
  const navigate = useNavigate(); // ⬅️ Hook for navigation
 // Handle Add to Cart
 const handleAddToCart = () => {
    // 🔹 Check if user is logged in
    if (!user) {
      toast({
        title: "Please login to add items to your cart",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    const cartList = cartItems.items || [];
    const existingItem = cartList.find(
      (item) =>
        item.productId === productDetails?._id &&
        item.size === selectedSize
    );

    if (
      existingItem &&
      existingItem.quantity + 1 > productDetails?.totalStock
    ) {
      toast({
        title: `Only ${productDetails?.totalStock} items available for size ${selectedSize}`,
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: productDetails?._id,
        size: selectedSize,
        quantity: 1,
        productName: `${productDetails?.title} - ${selectedSize}`,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: `Added size ${selectedSize} to cart`,
        });
      }
    });
  };


  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
    setSelectedSize("");
  };

  const handleAddReview = () => {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((res) => {
      if (res.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({ title: "Review added successfully" });
      }
    });
  };

  useEffect(() => {
    if (productDetails) {
      setSelectedImage(productDetails?.image);
      dispatch(getReviews(productDetails?._id));
    }
  }, [productDetails]);

  const avgReview =
    reviews?.length > 0
      ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length
      : 0;

  const images = productDetails?.images?.length
    ? productDetails.images
    : [productDetails?.image];

  const sizes = Array.isArray(productDetails?.sizes)
    ? productDetails.sizes.flatMap((s) =>
        s.split(",").map((size) => size.trim())
      )
    : [];

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:p-6 md:p-8 w-full sm:max-w-[95vw] lg:max-w-[80vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT - Images */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="thumbnail"
                  className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                    selectedImage === img
                      ? "border-primary"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
            <div className="flex-1">
              <img
                src={selectedImage}
                alt={productDetails?.title}
                className="w-full h-auto max-h-[400px] object-cover rounded-lg"
              />
            </div>
          </div>

          {/* RIGHT - Details */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              {productDetails?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-gray-500">
                Brand: <span className="font-semibold">Mayukha Fashion</span>
              </span>
              <StarRatingComponent rating={avgReview} />
              <span>({reviews?.length || 0} Reviews)</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3">
              {productDetails?.salePrice > 0 && (
                <span className="text-gray-500 line-through text-lg">
                  ₹{productDetails?.price}
                </span>
              )}
              <span className="text-red-500 text-2xl font-bold">
                ₹
                {productDetails?.salePrice > 0
                  ? productDetails?.salePrice
                  : productDetails?.price}
              </span>
              <span className="text-green-600 text-sm">
                Stock: {productDetails?.totalStock}
              </span>
            </div>

            <p className="text-muted-foreground mt-3">
              {productDetails?.description}
            </p>

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div className="mt-4">
                <Label>Select Size</Label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {sizes.map((size, idx) => (
                    <label
                      key={idx}
                      className={`cursor-pointer px-4 py-2 border rounded ${
                        selectedSize === size
                          ? "bg-red-500 text-white border-red-500"
                          : "bg-white text-black border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="product-size"
                        value={size}
                        checked={selectedSize === size}
                        onChange={() => setSelectedSize(size)}
                        className="hidden"
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="flex gap-3 mt-4">
  {productDetails?.totalStock === 0 ? (
    <Button disabled>Out of Stock</Button>
  ) : (
    <Button
      className="bg-red-500 hover:bg-red-600"
      onClick={handleAddToCart}
    >
      Add to Cart
    </Button>
  )}
</div>


            {/* Tabs */}
            <Tabs defaultValue="description" className="mt-6">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({reviews?.length || 0})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <p className="p-4 bg-gray-50 rounded-lg">
                  {productDetails?.description}
                </p>
              </TabsContent>
              <TabsContent value="reviews">
                {/* Review list */}
                <div className="max-h-[250px] overflow-auto p-4">
                  {reviews?.length > 0 ? (
                    reviews.map((r, idx) => (
                      <div key={idx} className="flex gap-4 mb-4">
                        <Avatar className="w-10 h-10 border">
                          <AvatarFallback>
                            {r?.userName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold">{r?.userName}</h3>
                          <StarRatingComponent rating={r?.reviewValue} />
                          <p className="text-muted-foreground">
                            {r.reviewMessage}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No Reviews</p>
                  )}
                </div>

                {/* Review form */}
                <div className="mt-6 flex flex-col gap-2">
                  <Label>Write a review</Label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <StarRatingComponent
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                    <Input
                      value={reviewMsg}
                      onChange={(e) => setReviewMsg(e.target.value)}
                      placeholder="Write a review..."
                    />
                    <Button
                      onClick={handleAddReview}
                      disabled={!reviewMsg.trim()}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
