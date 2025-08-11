import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { createNewOrder } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function RazorpayReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const orderId = params.get("orderId");

  useEffect(() => {
    const storedOrderData = JSON.parse(sessionStorage.getItem("razorpayOrderData"));

    if (paymentId && orderId && storedOrderData) {
      dispatch(createNewOrder(storedOrderData)).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("razorpayOrderData");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [paymentId, orderId, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Razorpay Payment... Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default RazorpayReturnPage;
