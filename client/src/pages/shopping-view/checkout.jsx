import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems?.items?.reduce(
      (sum, item) =>
        sum +
        (item?.salePrice > 0 ? item?.salePrice : item?.price) * item?.quantity,
      0
    ) || 0;

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  async function handleInitiateRazorpayPayment() {
    if (!cartItems?.items?.length) {
      return toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
    }

    if (!currentSelectedAddress) {
      return toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
    }

    try {
      // Step 1: Create order from backend
      const { data } = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/shop/order/payment/create-order`,
  {
    userId: user?.id,
    cartId: cartItems?._id,
    cartItems: cartItems.items.map(item => ({
      productId: item?.productId,
      title: item?.title,
      image: item?.image,
      price: item?.salePrice > 0 ? item?.salePrice : item?.price,
      quantity: item?.quantity,
      size: item?.size, // 👈 include size
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
        handler: async function (response) {
          try {
            // Step 3: Send payment details to backend for verification & order creation
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/shop/order/payment/capture`,
              {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                orderData: {
                  userId: user?.id,
                  cartId: cartItems?._id,
                  cartItems: cartItems.items.map((item) => ({
                    productId: item?.productId,
                    title: item?.title,
                    image: item?.image,
                    price:
                      item?.salePrice > 0 ? item?.salePrice : item?.price,
                    quantity: item?.quantity,
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
              toast({ title: "Payment successful! Order placed." });
              window.location.href = "/shop/payment-success";
            } else {
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

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast({
        title: "Payment initiation failed. Try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems?.items?.length > 0 &&
            cartItems.items.map((item) => (
              <UserCartItemsContent key={item.productId  + (item.size || "")} cartItem={item} />
            ))}

          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{totalCartAmount}</span>
            </div>
          </div>

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
