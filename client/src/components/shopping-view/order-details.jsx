import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  function handleDownloadInvoice() {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 160, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: ${orderDetails?._id || "-"}`, 14, 30);
    doc.text(`Date: ${orderDetails?.orderDate.split("T")[0] || "-"}`, 14, 36);

    const yStart = 50;
    doc.setFont("helvetica", "bold");
    doc.text("From:", 14, yStart);
    doc.text("To:", 110, yStart);

    doc.setFont("helvetica", "normal");
    doc.text("Mayukha Fashion Store", 14, yStart + 6);
    doc.text(`${orderDetails?.addressInfo?.address || ""}`, 14, yStart + 12);
    doc.text(`${orderDetails?.addressInfo?.city || ""}`, 14, yStart + 18);
    doc.text(`${orderDetails?.addressInfo?.pincode || ""}`, 14, yStart + 24);
    doc.text(`${orderDetails?.addressInfo?.phone || ""}`, 14, yStart + 30);

    doc.text(user.userName, 110, yStart + 6);
    doc.text(`${orderDetails?.addressInfo?.address || ""}`, 110, yStart + 12);
    doc.text(`${orderDetails?.addressInfo?.city || ""}`, 110, yStart + 18);
    doc.text(`${orderDetails?.addressInfo?.pincode || ""}`, 110, yStart + 24);
    doc.text(`${orderDetails?.addressInfo?.phone || ""}`, 110, yStart + 30);

    const tableY = yStart + 45;
    autoTable(doc, {
      startY: tableY,
      head: [["Description", "Quantity", "Unit Price", "Total"]],
      body:
        orderDetails?.cartItems?.map((item) => [
          item.title,
          item.quantity,
          `₹${item.price}`,
          `₹${item.price * item.quantity}`,
        ]) || [],
      styles: { halign: "center" },
      headStyles: { fillColor: [0, 0, 0] },
    });

    let finalY = doc.lastAutoTable.finalY + 5;
    doc.text(`Subtotal: ₹${orderDetails?.totalAmount} /.`, 140, finalY);

    doc.setFont("helvetica", "bold");
    doc.text("Payment Instructions:", 14, finalY + 25);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Payment can be made in-store or via credit card.\nFor online payments, please visit our website.",
      14,
      finalY + 31
    );

    doc.setFontSize(10);
    doc.text("Thank you for shopping with us!", 14, 280);

    doc.save(`invoice_${orderDetails?._id}.pdf`);
  }

  return (
    <DialogContent className="sm:max-w-[600px] w-full px-4 sm:px-6">
      {/* Scrollable wrapper */}
      <div className="max-h-[80vh] overflow-y-auto pr-2">
        <div className="grid gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h2 className="text-lg font-semibold text-center sm:text-left">
              Order Details
            </h2>
            <Button
              className="w-full sm:w-auto mt-5"
              onClick={handleDownloadInvoice}
            >
              Download Invoice
            </Button>
          </div>

          {/* Order Summary */}
          <div className="grid gap-2">
            {[
              { label: "Order ID", value: orderDetails?._id },
              { label: "Order Date", value: orderDetails?.orderDate.split("T")[0] },
              { label: "Order Price", value: `₹${orderDetails?.totalAmount}` },
              { label: "Payment method", value: orderDetails?.paymentMethod },
              { label: "Payment Status", value: orderDetails?.paymentStatus },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
              >
                <p className="font-medium">{item.label}</p>
                <Label>{item.value}</Label>
              </div>
            ))}

            {/* Order Status with Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <p className="font-medium">Order Status</p>
              <Label>
                <Badge
                  className={`py-1 px-3 text-center ${
                    orderDetails?.orderStatus === "confirmed"
                      ? "bg-green-500"
                      : orderDetails?.orderStatus === "rejected"
                      ? "bg-red-600"
                      : "bg-black"
                  }`}
                >
                  {orderDetails?.orderStatus}
                </Badge>
              </Label>
            </div>
          </div>

          <Separator />

          {/* Order Details */}
          <div className="grid gap-4">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems?.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-2 border rounded-md"
                >
                  <span>Title: {item.title}</span>
                  <span>Size: {item.size || "N/A"}</span>
                  <span>Quantity: {item.quantity}</span>
                  <span>Price: ₹{item.price}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Shipping Info */}
          <div className="grid gap-4">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground text-sm">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
