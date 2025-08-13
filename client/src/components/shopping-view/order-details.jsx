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

 const logoBase64 =
    "data:image/png;base64,PUT-YOUR-BASE64-HERE"; // Replace with actual Base64


  // ===== Invoice Title =====
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 160, 20);

  // ===== Invoice Info =====
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Order ID: ${orderDetails?._id || "-"}`, 14, 30);
  doc.text(`Date: ${orderDetails?.orderDate.split("T")[0] || "-"}`, 14, 36);
  doc.text(`Due Date: ${orderDetails?.dueDate || "-"}`, 160, 36);

  // ===== From & To =====
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

  // ===== Items Table =====
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

  // ===== Totals =====
  let finalY = doc.lastAutoTable.finalY + 5;
  doc.setFont("helvetica", "normal");
  doc.text(`Subtotal: ₹${orderDetails?.totalAmount} /.`, 140, finalY);

  // ===== Payment Instructions =====
  doc.setFont("helvetica", "bold");
  doc.text("Payment Instructions:", 14, finalY + 25);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Payment can be made in-store or via credit card.\nFor online payments, please visit our website.",
    14,
    finalY + 31
  );

  // ===== Footer =====
  doc.setFontSize(10);
  doc.text("Thank you for shopping with us!", 14, 280);

  // Save the PDF
  doc.save(`invoice_${orderDetails?._id}.pdf`);
}


  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <Button className="mt-5" onClick={handleDownloadInvoice}>Download Invoice</Button>
        </div>

        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>₹{orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
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

        {/* Order Details with Size */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems?.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-wrap items-center justify-between gap-2"
                >
                  <span>Title: {item.title}</span>
                  <span>Size: {item.size || "N/A"}</span>
                  <span>Quantity: {item.quantity}</span>
                  <span>Price: ₹{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
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
