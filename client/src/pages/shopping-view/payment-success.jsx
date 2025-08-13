import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { id: orderId } = useParams();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/shop/order/details/${orderId}`
        );
        setOrderData(data.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <p className="text-center mt-10">Loading order details...</p>;
  }

  if (!orderData) {
    return <p className="text-center mt-10 text-red-500">Order not found.</p>;
  }

  return (
    <Card className="p-6 max-w-3xl mx-auto shadow-lg border mt-5 mb-5">
      <CardHeader className="p-0 mb-4 text-center">
        <div className="flex justify-center mb-3">
          <span className="text-green-500 text-5xl">✔</span>
        </div>
        <CardTitle className="text-3xl font-bold text-green-600">
          Order successfully placed!
        </CardTitle>
        <p className="mt-2 text-gray-700">
          Thank you! Your payment of ₹{" "}
          {orderData.totalAmount?.toLocaleString()} has been received.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Order ID : {orderData._id} | Transaction ID : {orderData.paymentId}
        </p>
      </CardHeader>

      <CardContent>
        {/* Payment Details */}
        <div className="border rounded-md p-4 bg-gray-50 mb-4">
          <div className="flex justify-between py-1">
            <span>Total Amount :</span>
            <span>₹ {orderData.totalAmount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Payment Method :</span>
            <span>{orderData.paymentMethod}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Payment Status :</span>
            <span>{orderData.paymentStatus}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Order Status :</span>
            <span>{orderData.orderStatus}</span>
          </div>
        </div>

        {/* Address Info */}
        {orderData.addressInfo && (
          <div className="border rounded-md p-4 bg-gray-50 mb-4">
            <h2 className="font-semibold mb-2">Delivery Address</h2>
            <p>{orderData.addressInfo.address}</p>
            <p>
              {orderData.addressInfo.city} - {orderData.addressInfo.pincode}
            </p>
            <p>Phone: {orderData.addressInfo.phone}</p>
            {orderData.addressInfo.notes && (
              <p>Notes: {orderData.addressInfo.notes}</p>
            )}
          </div>
        )}

        {/* Ordered Items */}
        <div className="border rounded-md p-4 bg-gray-50">
          <h2 className="font-semibold mb-2">Ordered Items</h2>
          {orderData.cartItems?.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-1 border-b last:border-0"
            >
              <div className="flex items-center gap-2">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} {item.size && `| Size: ${item.size}`}
                  </p>
                </div>
              </div>
              <span>₹ {item.price}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-3">
          Please contact us at 9987487988 or email mayukhafashion@support.com
          for any query.
        </p>

        <div className="flex justify-center mt-6">
          <Button onClick={() => navigate("/shop/account")}>OK</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentSuccessPage;
