import { StarIcon, Heart, CopyPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
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

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState(productDetails?.image);
  const [selectedSize, setSelectedSize] = useState(""); // single size selection

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (!selectedSize) {
      toast({
        title: "Please select a size before adding to cart",
        variant: "destructive",
      });
      return;
    }

    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId && item.size === selectedSize
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for size ${selectedSize}`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        size: selectedSize,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: `Size ${selectedSize} added to cart` });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
    setSelectedSize("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({ title: "Review added successfully!" });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) {
      setSelectedImage(productDetails?.image);
      dispatch(getReviews(productDetails?._id));
    }
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  const images = productDetails?.images?.length
    ? productDetails.images
    : [productDetails?.image];

  // Split sizes by comma if they are stored as a single string
 const sizes = Array.isArray(productDetails?.sizes)
    ? productDetails.sizes.flatMap(s => s.split(",").map(size => size.trim()))
    : [];

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:p-6 md:p-8 w-full sm:max-w-[95vw] lg:max-w-[80vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT SIDE */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="thumbnail"
                  className={`w-20 h-20 object-cover rounded cursor-pointer border flex-shrink-0 ${
                    selectedImage === img ? "border-primary" : "border-gray-200"
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

          {/* RIGHT SIDE */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              {productDetails?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-gray-500">
                Brands : <span className="font-semibold">Mayukha Fashion</span>
              </span>
              <StarRatingComponent rating={averageReview} />
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
                Available in Stock: {productDetails?.totalStock} Items
              </span>
            </div>

            <p className="text-muted-foreground mt-3">
              {productDetails?.description}
            </p>
            <p className="mt-2 font-medium">
              Free Shipping (Est. Delivery Time 2-3 Days)
            </p>

            {/* SINGLE SIZE SELECTION */}
{sizes.length > 0 && (
  <div className="mt-4">
    <Label>Select Size</Label>
    <div className="flex flex-wrap gap-3 mt-2">
      {sizes.map((size, idx) => (
        <label
          key={idx}
          className={`cursor-pointer px-4 py-2 border rounded flex items-center justify-center
            ${selectedSize === size
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


            {/* ADD TO CART */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              {productDetails?.totalStock === 0 ? (
                <Button className="opacity-60 cursor-not-allowed">
                  Out of Stock
                </Button>
              ) : (
                <Button
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() =>
                    handleAddToCart(
                      productDetails?._id,
                      productDetails?.totalStock
                    )
                  }
                >
                  Add to Cart
                </Button>
              )}
            </div>

            {/* TABS */}
            <Tabs defaultValue="description" className="mt-6">
              <TabsList className="flex-wrap">
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
                <div className="max-h-[250px] overflow-auto p-4">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((reviewItem, idx) => (
                      <div key={idx} className="flex gap-4 mb-4">
                        <Avatar className="w-10 h-10 border">
                          <AvatarFallback>
                            {reviewItem?.userName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold">{reviewItem?.userName}</h3>
                          <StarRatingComponent
                            rating={reviewItem?.reviewValue}
                          />
                          <p className="text-muted-foreground">
                            {reviewItem.reviewMessage}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No Reviews</p>
                  )}
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <Label>Write a review</Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <StarRatingComponent
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                    <Input
                      name="reviewMsg"
                      value={reviewMsg}
                      onChange={(e) => setReviewMsg(e.target.value)}
                      placeholder="Write a review..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAddReview}
                      disabled={reviewMsg.trim() === ""}
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
