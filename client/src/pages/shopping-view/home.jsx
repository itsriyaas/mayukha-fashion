import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "dhoti", label: "Set Mundu", image: "/category/setmundu.jpg" },
  { id: "women", label: "New Arrivals", image: "/category/new_arrival.jpg" },
  { id: "offer", label: "Offer Products", image: "/category/offer.jpg" },
  { id: "kurthies", label: "Kurthies", image: "/category/kurthies.jpg" },
  { id: "sarees", label: "Sarees", image: "/category/sarees.jpg" },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: "https://www.stocksbnb.com/wp-content/uploads/2019/08/nike.png" },
  { id: "adidas", label: "Adidas", icon: "https://ir.ozone.ru/s3/multimedia-1-0/w1200/7459989912.jpg" },
  { id: "puma", label: "Puma", icon: "https://static.tildacdn.com/tild3038-6631-4335-b630-666233393063/full_pL1alFFk.jpeg" },
  { id: "levi", label: "Levi's", icon: "https://avatars.mds.yandex.net/i?id=a5c2c99dedebefbda2095f4c38bf71806826fb1b-16474748-images-thumbs&n=13" },
  { id: "zara", label: "Zara", icon: "https://www.fragrantica.com/mdimg/dizajneri/o.642.jpg" },
  { id: "h&m", label: "H&M", icon: "https://avatars.mds.yandex.net/i?id=afa67999a414ff293e1d8f63ea32d50726b71fb0-5869703-images-thumbs&n=13" },
];
function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[150px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
  {featureImageList && featureImageList.length > 0
    ? featureImageList.map((slide, index) => (
        <img
          src={slide?.image}
          key={index}
          className={`${
            index === currentSlide ? "opacity-100" : "opacity-0"
          } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
        />
      ))
    : null}

  <Button
    variant="outline"
    size="icon"
    onClick={() =>
      setCurrentSlide(
        (prevSlide) =>
          (prevSlide - 1 + featureImageList.length) %
          featureImageList.length
      )
    }
    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
  >
    <ChevronLeftIcon className="w-4 h-4" />
  </Button>

  <Button
    variant="outline"
    size="icon"
    onClick={() =>
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)
    }
    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
  >
    <ChevronRightIcon className="w-4 h-4" />
  </Button>
</div>

      <section className="py-12 bg-gray-50">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-8">
      Shop by category
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {categoriesWithIcon.map((categoryItem, index) => (
        <div
          key={index}
          onClick={() =>
            handleNavigateToListingPage(categoryItem, "category")
          }
          className="cursor-pointer group"
        >
          {/* Image */}
          <div className="overflow-hidden rounded-lg">
            <img
              src={categoryItem.image} // <-- categoryItem.image should be the category image URL
              alt={categoryItem.label}
              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          {/* Category Name */}
          <p className="text-center mt-2 font-medium">
            {categoryItem.label}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* Brand */}
      {/* <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                   <div className="overflow-hidden rounded-lg">
            <img
              src={brandItem.icon} // <-- categoryItem.image should be the category image URL
              alt={brandsWithIcon.label}
              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
