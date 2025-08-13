import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import img from "../../assets/account.jpg";

import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);

  // Always have a safe fallback
  const items = Array.isArray(cartItems?.items) ? cartItems.items : [];

  // Calculate total amount
  const totalCartAmount =
    items.reduce(
      (sum, item) =>
        sum + (item?.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
      0
    ) || 0;

  // Load Razorpay script once
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const formatSize = (size) => {
    if (Array.isArray(size)) return size.join(", ");
    return size || "Not specified";
  };

  // Handle payment initiation
  const handleInitiateRazorpayPayment = async () => {
    if (!items.length) {
      return toast({
        title: "Your cart is empty. Please add items to proceed.",
        variant: "destructive",
      });
    }

    if (!currentSelectedAddress) {
      return toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
    }

    // Check for missing size
    const missingSize = items.some((item) => !item.size || (Array.isArray(item.size) && item.size.length === 0));
    if (missingSize) {
      return toast({
        title: "Some products are missing size. Please Refresh the page or contact support.",
        variant: "destructive",
      });
    }

    try {
      // Step 1: Create Razorpay order in backend
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/order/payment/create-order`,
        {
          userId: user?.id,
          cartId: cartItems?._id,
          cartItems: items.map((item) => ({
            productId: typeof item.productId === "object" ? item.productId._id : String(item.productId),
            title: item?.title || item?.productId?.title,
            image: item?.image || item?.productId?.image,
            price: item?.salePrice > 0 ? item.salePrice : item.price,
            quantity: item.quantity,
            size: item.size,
          })),
          addressInfo: {
            addressId: currentSelectedAddress?._id,
            address: currentSelectedAddress?.address,
            city: currentSelectedAddress?.city,
            pincode: currentSelectedAddress?.pincode,
            phone: currentSelectedAddress?.phone,
            notes: currentSelectedAddress?.notes,
          },
          orderStatus: "pending",
          paymentMethod: "razorpay",
          paymentStatus: "pending",
          totalAmount: totalCartAmount,
          orderDate: new Date(),
          orderUpdateDate: new Date(),
        }
      );

      const { id: razorpayOrderId, amount, currency } = data;

      // Step 2: Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Mayukha Fashion Store",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/shop/order/payment/capture`,
              {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                orderData: {
                  userId: user?.id,
                  cartId: cartItems?._id,
                  cartItems: items.map((item) => ({
                    productId: typeof item.productId === "object" ? item.productId._id : String(item.productId),
                    title: item?.title || item?.productId?.title,
                    image: item?.image || item?.productId?.image,
                    price: item?.salePrice > 0 ? item.salePrice : item.price,
                    quantity: item.quantity,
                    size: item.size,
                  })),
                  addressInfo: {
                    addressId: currentSelectedAddress?._id,
                    address: currentSelectedAddress?.address,
                    city: currentSelectedAddress?.city,
                    pincode: currentSelectedAddress?.pincode,
                    phone: currentSelectedAddress?.phone,
                    notes: currentSelectedAddress?.notes,
                  },
                  totalAmount: totalCartAmount,
                },
              }
            );

          if (verifyRes.data.success) {
  const orderId = verifyRes.data.order?._id;
  toast({ title: "Payment successful! Order placed." });
  window.location.href = `/shop/payment-success/${orderId}`;
}
 else {
              toast({
                title: "Payment verification failed. Please contact support.",
                variant: "destructive",
              });
            }
          } catch (err) {
            console.error(err);
            toast({
              title: "Payment verification failed. Try again.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: currentSelectedAddress?.phone || "",
        },
        theme: { color: "#3399cc" },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error(error);
      toast({
        title: "Payment initiation failed. Try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" alt="Checkout Banner" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        {/* Address Section */}
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />

        {/* Cart Section */}
        <div className="flex flex-col gap-4">
          {items.length > 0 &&
            items.map((item) => {
              const id = typeof item.productId === "object" ? item.productId._id : String(item.productId);
              return (
                <div key={`${id}-${formatSize(item.size)}`}>
                  <UserCartItemsContent cartItem={item} />
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Size:</strong> {formatSize(item.size)}
                  </p>
                </div>
              );
            })}

          {/* Cart Summary */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{totalCartAmount}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="mt-4 w-full">
            <Button onClick={handleInitiateRazorpayPayment} className="w-full">
              Pay with Razorpay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
